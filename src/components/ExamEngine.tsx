import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExamType, LanguageCode, Question, MistakeExplanation } from '../types';
import { locales } from '../locales';
import { sampleQuestions } from '../data/questions';
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, FileText, ChevronRight, HelpCircle, Trophy, RefreshCw } from 'lucide-react';

interface ExamEngineProps {
  language: LanguageCode;
  selectedExam: ExamType;
  onAnswerLogged: (exam: ExamType, subject: string, isCorrect: boolean) => void;
  onSectionComplete: (exam: ExamType, subject: string, score: number, total: number) => void;
}

export default function ExamEngine({ language, selectedExam, onAnswerLogged, onSectionComplete }: ExamEngineProps) {
  // Locale helper
  const t = locales[language] || locales.en;

  // Filter states
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  // Exam list state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Interaction states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Gemini error explainer state
  const [explanation, setExplanation] = useState<MistakeExplanation | null>(null);
  const [explainingLoading, setExplainingLoading] = useState(false);
  const [explanationError, setExplanationError] = useState<string | null>(null);

  // Keep track of the actual list of questions matching filters
  useEffect(() => {
    // Collect all subjects available in this exam category
    const filteredByExam = sampleQuestions.filter(q => q.exam === selectedExam);
    const uniqueSubjects = Array.from(new Set(filteredByExam.map(q => q.subject)));
    setSubjects(uniqueSubjects);
    setSelectedSubject('all');
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setSessionScore(0);
    setSessionCompleted(false);
    setExplanation(null);
  }, [selectedExam]);

  // Build the list of active questions based on filters + adaptive ordering
  useEffect(() => {
    let list = sampleQuestions.filter(q => q.exam === selectedExam);

    if (selectedSubject !== 'all') {
      list = list.filter(q => q.subject === selectedSubject);
    }

    if (difficulty !== 'all') {
      list = list.filter(q => q.difficulty === difficulty);
    }

    // Adaptively sort questions for SAT / IELTS based on complexity
    // (Ordering Beginners first, then Intermediate, then Advanced)
    if (selectedExam === 'SAT' || selectedExam === 'IELTS') {
      const difficultyWeights = { Beginner: 1, Easy: 1, Intermediate: 2, Medium: 2, Advanced: 3, Hard: 3 };
      list.sort((a, b) => {
        const weightA = difficultyWeights[a.difficulty as keyof typeof difficultyWeights] || 2;
        const weightB = difficultyWeights[b.difficulty as keyof typeof difficultyWeights] || 2;
        return weightA - weightB;
      });
    }

    setQuestions(list);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setExplanation(null);
    setSessionScore(0);
    setSessionCompleted(false);
  }, [selectedExam, selectedSubject, difficulty]);

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || isSubmitted || questions.length === 0) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    setIsSubmitted(true);
    if (isCorrect) {
      setSessionScore(prev => prev + 1);
    }

    // Propagate up to central stats tracker
    onAnswerLogged(selectedExam, currentQuestion.subject, isCorrect);
  };

  const handleNextQuestion = () => {
    // Check if end of list
    if (currentIndex + 1 >= questions.length) {
      // Completed current practice session!
      onSectionComplete(
        selectedExam,
        selectedSubject === 'all' ? t.allSubjects : selectedSubject,
        sessionScore + (selectedOption === questions[currentIndex].correctIndex ? 1 : 0),
        questions.length
      );
      setSessionCompleted(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setExplanation(null);
      setExplanationError(null);
    }
  };

  const handleAskGeminiForExplanation = async () => {
    if (questions.length === 0 || selectedOption === null) return;
    const currentQuestion = questions[currentIndex];

    setExplainingLoading(true);
    setExplanationError(null);
    setExplanation(null);

    try {
      const response = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.text,
          options: currentQuestion.options,
          studentAnswer: currentQuestion.options[selectedOption],
          correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
          language
        })
      });

      if (!response.ok) {
        throw new Error('Server returned unsafe status code while fetching error logs');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setExplanation(data);
    } catch (err: any) {
      console.error(err);
      setExplanationError(err.message || 'Gemini system connection timed out. Please try explaining again.');
    } finally {
      setExplainingLoading(false);
    }
  };

  const handleRetrySession = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setExplanation(null);
    setExplanationError(null);
    setSessionScore(0);
    setSessionCompleted(false);
  };

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6" id="exam-engine-root">
      {/* Subject and Difficulty practice filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Subject chooser */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              {t.selectSubject}
            </label>
            <select
              id="subject-dropdown-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">{t.allSubjects}</option>
              {subjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* Difficulty chooser */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              {t.selectDifficulty}
            </label>
            <select
              id="difficulty-dropdown-filter"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="all">{t.difficultyAll}</option>
              <option value="Easy">{t.difficultyEasy}</option>
              <option value="Intermediate">{t.difficultyMedium}</option>
              <option value="Advanced">{t.difficultyHard}</option>
            </select>
          </div>
        </div>

        {/* Diagnostic counter */}
        {questions.length > 0 && !sessionCompleted && (
          <span className="text-xs bg-indigo-50 text-indigo-700 font-mono font-bold px-3 py-1.5 rounded-xl border border-indigo-100/50">
            {t.questionNumber} {currentIndex + 1} {t.ofText} {questions.length}
          </span>
        )}
      </div>

      {/* Dynamic Question Render state */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 animate-pulse" />
          <h3 className="text-slate-700 font-black text-base uppercase tracking-wide">No Questions Found</h3>
          <p className="text-slate-400 text-xs max-w-sm">
            We don't have matching local curriculum questions for these filters in our base set yet. Try changing subject categories!
          </p>
        </div>
      ) : sessionCompleted ? (
        /* Lesson Set Complete slide */
        <motion.div
          id="session-complete-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-6"
        >
          <div className="inline-flex bg-indigo-50 p-4 rounded-2xl text-indigo-600">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              {t.completedTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              {t.completedText}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto bg-slate-50 p-4 rounded-xl border border-slate-100 font-sans">
            <div>
              <span className="block text-2xl font-black text-slate-800">
                {sessionScore} / {questions.length}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.correctCountText}</span>
            </div>
            <div>
              <span className="block text-2xl font-black text-emerald-600">
                {Math.round((sessionScore / questions.length) * 100)}%
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.completedTitle}</span>
            </div>
          </div>

          <button
            id="retry-session-btn"
            onClick={handleRetrySession}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow shadow-indigo-500/15 cursor-pointer flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            {t.retryText}
          </button>
        </motion.div>
      ) : (
        /* Core Active Problem Panel */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Question & options display area (lg: col span 8) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 space-y-5 relative overflow-hidden">
              
              {/* Question metadata badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 uppercase font-mono px-2 py-0.5 rounded font-bold">
                  {currentQuestion.subject} • {currentQuestion.year}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  {t.topicText}: {currentQuestion.topic}
                </span>
              </div>

              {/* Passage text if provided (SAT / IELTS Reading passage) */}
              {currentQuestion.passage && (
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 border-b border-indigo-100 pb-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    {t.passageText}
                  </div>
                  <div className="text-xs text-slate-600 italic leading-relaxed max-h-[160px] overflow-y-auto pr-1">
                    {currentQuestion.passage}
                  </div>
                </div>
              )}

              {/* Central Question prompt description */}
              <p className="text-slate-800 text-sm font-bold md:text-base leading-relaxed whitespace-pre-line pt-2">
                {currentQuestion.text}
              </p>

              {/* Options selection stack */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let cardStyle = 'border-slate-150 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-700';
                  if (isSelected) {
                    cardStyle = 'border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm';
                  }

                  if (isSubmitted) {
                    if (isCorrect) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm';
                    } else if (isSelected) {
                      cardStyle = 'border-rose-500 bg-rose-50 text-rose-900 shadow-sm';
                    } else {
                      cardStyle = 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      id={`option-card-${idx}`}
                      disabled={isSubmitted}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 justify-between ${cardStyle}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="bg-slate-100 border border-slate-200 text-slate-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 uppercase">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-xs font-semibold leading-relaxed">{option}</span>
                      </div>
                      
                      {isSubmitted && (
                        <div>
                          {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                          {!isCorrect && isSelected && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer operation bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-medium">Difficulty: {currentQuestion.difficulty}</span>

                <div className="flex items-center gap-2">
                  <AnimatePresence mode="wait">
                    {!isSubmitted ? (
                      <button
                        id="submit-problem-btn"
                        onClick={handleAnswerSubmit}
                        disabled={selectedOption === null}
                        className={`text-xs font-bold px-5 py-2.5 rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer ${
                          selectedOption !== null
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                      >
                        {t.submitAnswer}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        id="next-problem-btn"
                        onClick={handleNextQuestion}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow hover:shadow-slate-500/10 cursor-pointer flex items-center gap-1.5"
                      >
                        {t.nextQuestion}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Prompt AI Mistake button on incorrect answers */}
              {isSubmitted && selectedOption !== currentQuestion.correctIndex && (
                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 animate-fade-in mt-2">
                  <div className="flex items-center gap-2 text-rose-800 text-xs text-left">
                    <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 animate-pulse" />
                    <div>
                      <span className="font-bold block">Wrong choice submitted.</span>
                      <span>Ask Gemini specifically why your option was wrong and concept-build this subject.</span>
                    </div>
                  </div>
                  <button
                    id="trigger-gemini-explainer"
                    onClick={handleAskGeminiForExplanation}
                    disabled={explainingLoading}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t.explainWithGemini}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Structured Gemini Explanation console layout (lg: col span 4) */}
          <div className="lg:col-span-4" id="gemini-explanation-console">
            <div className="bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden min-h-[350px] flex flex-col">
              
              {/* Console header */}
              <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-305">AI Explainer Engine</span>
              </div>

              {/* Output flow body */}
              <div className="flex-1 p-5 space-y-4">
                {explainingLoading && (
                  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 pt-16">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <Sparkles className="relative inline-flex rounded-full h-8 w-8 text-indigo-500 bg-slate-800 p-1" />
                    </div>
                    <p className="text-xs text-slate-400 italic max-w-xs leading-relaxed animate-pulse">
                      {t.explainingLoading}
                    </p>
                  </div>
                )}

                {explanationError && (
                  <div className="bg-rose-950/20 border border-rose-800 rounded-xl p-4 text-xs text-rose-300 space-y-1">
                    <span className="font-bold flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Explanation Error</span>
                    <p>{explanationError}</p>
                  </div>
                )}

                {!explanation && !explainingLoading && !explanationError && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 pt-20">
                    <HelpCircle className="w-10 h-10 text-slate-800" />
                    <p className="text-xs text-slate-500 font-medium">
                      Explanations appear here after an answer is reviewed. Submit wrong choices to test error explanations!
                    </p>
                  </div>
                )}

                {/* Structured explanation panel layout */}
                {explanation && !explainingLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-xs font-sans"
                  >
                    {/* Part 1: Correct choice */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                        ✓ {t.correctAnswerText}
                      </span>
                      <p className="text-slate-100 bg-slate-950/40 p-2.5 rounded-lg border-l-2 border-emerald-500 leading-relaxed font-semibold">
                        {explanation.correctAnswer}
                      </p>
                    </div>

                    {/* Part 2: Why incorrect diagnosis */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block font-mono">
                        ⚠️ {t.whyWrongText}
                      </span>
                      <p className="text-slate-300 bg-slate-950/40 p-2.5 rounded-lg leading-relaxed">
                        {explanation.whyWrong}
                      </p>
                    </div>

                    {/* Part 3: Underling Concept explained */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block font-mono">
                        💡 {t.conceptExplainedText}
                      </span>
                      <p className="text-slate-300 bg-slate-950/40 p-2.5 rounded-lg leading-relaxed whitespace-pre-wrap">
                        {explanation.conceptExplained}
                      </p>
                    </div>

                    {/* Part 4: Worked Example */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block font-mono">
                        📝 {t.workedExampleText}
                      </span>
                      <p className="text-slate-300 bg-slate-950/40 p-2.5 rounded-lg leading-relaxed whitespace-pre-wrap italic">
                        {explanation.workedExample}
                      </p>
                    </div>

                    {/* Part 5: Mnemonic / Tip */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                        ✦ {t.tipToRememberText}
                      </span>
                      <p className="text-slate-105 bg-indigo-950/20 border border-indigo-900/40 p-2.5 rounded-lg leading-relaxed font-medium">
                        {explanation.tip}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
