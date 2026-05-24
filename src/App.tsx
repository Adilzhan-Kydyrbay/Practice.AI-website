import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExamType, LanguageCode, UserStats, ExamHistoryItem } from './types';
import { locales } from './locales';
import LanguageSelector from './components/LanguageSelector';
import ExamEngine from './components/ExamEngine';
import Dashboard from './components/Dashboard';
import AIChatPanel from './components/AIChatPanel';
import { GraduationCap, Award, Compass, BookOpen, User, Settings, Sparkles, LogOut, CheckCircle } from 'lucide-react';

export default function App() {
  // Authentication & language onboarding state
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [username, setUsername] = useState<string>('');
  const [tempName, setTempName] = useState<string>('');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  // Active App Workspace states
  const [selectedExam, setSelectedExam] = useState<ExamType>('UNT');
  const [activeTab, setActiveTab] = useState<'practice' | 'dashboard' | 'settings'>('practice');

  // Performance metrics & practice history states
  const [stats, setStats] = useState<UserStats>({
    solvedCount: 0,
    correctCount: 0,
    timeSpentMinutes: 0,
    streakDays: 1,
    weakTopics: [],
    recommendations: []
  });
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);

  // Load from local storage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('prep_language') as LanguageCode;
    const savedUsername = localStorage.getItem('prep_username');
    const savedOnboarded = localStorage.getItem('prep_onboarded') === 'true';
    const savedStats = localStorage.getItem('prep_stats2025');
    const savedHistory = localStorage.getItem('prep_history2025');

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedUsername) {
      setUsername(savedUsername);
      setTempName(savedUsername);
    }
    if (savedOnboarded) setIsOnboarded(savedOnboarded);
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  // Sync to local storage on changes
  const saveState = (updatedStats: UserStats, updatedHistory: ExamHistoryItem[]) => {
    setStats(updatedStats);
    setHistory(updatedHistory);
    localStorage.setItem('prep_stats2025', JSON.stringify(updatedStats));
    localStorage.setItem('prep_history2025', JSON.stringify(updatedHistory));
  };

  const handleOnboardSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalName = tempName.trim() || 'Student';
    setUsername(finalName);
    setIsOnboarded(true);

    localStorage.setItem('prep_language', language);
    localStorage.setItem('prep_username', finalName);
    localStorage.setItem('prep_onboarded', 'true');
  };

  const handleLanguageChange = (code: LanguageCode) => {
    setLanguage(code);
    localStorage.setItem('prep_language', code);
  };

  // Log answer event (called when student answers on ExamEngine or Chat panel)
  const handleAnswerLogged = (exam: ExamType, subject: string, isCorrect: boolean) => {
    const newSolved = stats.solvedCount + 1;
    const newCorrect = stats.correctCount + (isCorrect ? 1 : 0);

    // Assume 0.5 minutes spent per question solved
    const newTime = Math.ceil(newSolved * 0.5);

    // Dynamic Weakness calculations
    // If we have history, analyze weak topics where correct index is lower
    const updatedWeak = [...stats.weakTopics];
    if (!isCorrect && !updatedWeak.includes(subject)) {
      updatedWeak.push(subject);
    }

    // Dynamic recommendations match the student exam rules
    const recommendationsMap: Record<ExamType, string[]> = {
      UNT: ['History of Kazakhstan - Mongol Invasion', 'Mathematical Literacy - Combinatorics', 'Physics - Quantum Energy formulas'],
      AP: ['Calculus BC - Taylor Series interval rules', 'Computer Science A - Recursion Trace practices', 'Physics C - Electromagnetism Flux induction'],
      IELTS: ['Academic Reading - Quick Scanning and Landmark mapping', 'Writing Task 2 - Grammar tenses structured transitions'],
      SAT: ['Reading and Writing - Precarious context completions', 'Math - Quadratic discriminants validation'],
      IB: ['Biology HL - Mendelian dihybrid inheritance ratios', 'Physics HL - Thermal Ideal Gas P-V equations']
    };

    const examRecs = recommendationsMap[exam] || ['Practice more questions in current exam modules'];
    const activeRecs = examRecs.filter(rec => !isCorrect || Math.random() > 0.4);

    const updatedStats: UserStats = {
      ...stats,
      solvedCount: newSolved,
      correctCount: newCorrect,
      timeSpentMinutes: newTime,
      weakTopics: updatedWeak.slice(-4), // keep last 4 items
      recommendations: Array.from(new Set(activeRecs)).slice(0, 3)
    };

    saveState(updatedStats, history);
  };

  // Logging completed review set history
  const handleSectionComplete = (exam: ExamType, subject: string, score: number, total: number) => {
    const timeLog = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const logItem: ExamHistoryItem = {
      timestamp: `${new Date().toLocaleDateString()} ${timeLog}`,
      exam,
      subject,
      score,
      total
    };

    const updatedHistory = [...history, logItem];
    
    // Add completed stats
    const updatedStats = {
      ...stats,
      solvedCount: stats.solvedCount + total,
      correctCount: stats.correctCount + score,
      timeSpentMinutes: stats.timeSpentMinutes + Math.ceil(total * 0.5)
    };

    saveState(updatedStats, updatedHistory);
  };

  const handleResetStats = () => {
    const freshStats: UserStats = {
      solvedCount: 0,
      correctCount: 0,
      timeSpentMinutes: 0,
      streakDays: 1,
      weakTopics: [],
      recommendations: []
    };
    saveState(freshStats, []);
  };

  const handleLogout = () => {
    localStorage.removeItem('prep_onboarded');
    setIsOnboarded(false);
  };

  // Localization labels helper
  const t = locales[language] || locales.en;

  const examsConfig: { key: ExamType; name: string; syllabus: string }[] = [
    { key: 'UNT', name: 'UNT (Kazakhstan)', syllabus: 'Structure strictly based on NTC 2025–26 standard. Subjects: Hist of Kaz, Math Literacy, Physics.' },
    { key: 'AP', name: 'AP (College Board)', syllabus: '38 subjects including Calculus BC, Physics C, CS A. Math & MCQs weighted.' },
    { key: 'IELTS', name: 'IELTS (Cambridge)', syllabus: 'Four segments (Listening, Reading, Writing, Speaking). Adaptive reading items built in.' },
    { key: 'SAT', name: 'SAT (Digital prep)', syllabus: 'Math, evidence-based Reading & Writing modules. High-contrast contextual vocabulary.' },
    { key: 'IB', name: 'IB (Diploma Programme)', syllabus: 'Grades 1 to 7 curriculum blocks. Biology HL / Physics HL thermodynamic systems.' }
  ];

  if (!isOnboarded) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans antialiased" id="onboarding-root">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl border border-slate-105 shadow-xl p-8 space-y-6"
        >
          {/* Brand logo */}
          <div className="text-center space-y-2">
            <div className="inline-flex bg-indigo-600 p-3.5 rounded-2xl text-white shadow-lg shadow-indigo-500/10">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Akeser Prep
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {t.appSubtitle}
            </p>
          </div>

          {/* Practice Language selection panel */}
          <LanguageSelector
            currentLanguage={language}
            onChange={handleLanguageChange}
            label={t.chooseLanguage}
          />

          {/* Student name credentials onboarding Form */}
          <form onSubmit={handleOnboardSubmit} className="space-y-4" id="onboarding-form">
            <div className="space-y-1.5">
              <label htmlFor="student-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.enterName}
              </label>
              <input
                id="student-name-input"
                type="text"
                required
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="E.g., Alisher, Aigerim"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm focus:outline-none transition"
              />
            </div>

            <button
              id="submit-onboard-btn"
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 border border-slate-700/60 text-white font-bold text-sm py-3.5 rounded-xl transition shadow hover:shadow-slate-500/10 cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
              {t.startPractice}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col text-slate-700 pb-16" id="app-workspace-root">
      
      {/* Top Header navbar navigation */}
      <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Logo Brand area */}
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-sm text-white tracking-widest block uppercase">Akeser Prep</span>
              <span className="text-[10px] text-slate-400 tracking-wider">AI Training 2025–26</span>
            </div>
          </div>

          {/* Settings tab button controls */}
          <div className="flex items-center gap-4">
            
            {/* Custom menu tabs */}
            <div className="flex bg-slate-800 p-1 rounded-xl items-center border border-slate-750">
              <button
                id="tab-practice"
                onClick={() => setActiveTab('practice')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'practice'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Practice
              </button>
              <button
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                id="tab-settings"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                Settings
              </button>
            </div>

            {/* Quick Micro Language selector helper */}
            <LanguageSelector
              currentLanguage={language}
              onChange={handleLanguageChange}
              mini
            />

            {/* User credentials profile badge */}
            <div className="hidden md:flex items-center gap-2 bg-slate-850 p-1.5 rounded-xl border border-slate-750">
              <div className="bg-indigo-500/20 text-indigo-300 w-7 h-7 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-100 pr-1 truncate max-w-[80px]">
                {username}
              </span>
            </div>
          </div>

        </div>
      </nav>

      {/* Primary Exam Selection Segment */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-850 text-white py-6 border-b border-slate-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-400 font-mono">
                {t.selectExam}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {t.examDescription}
              </p>
            </div>
            
            {/* Quick metrics indicators */}
            <div className="flex gap-4 items-center bg-slate-800/50 p-2.5 rounded-xl border border-slate-750/50 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Accuracy</span>
                <span className="font-extrabold text-white">
                  {stats.solvedCount > 0 ? Math.round((stats.correctCount / stats.solvedCount) * 100) : 0}%
                </span>
              </div>
              <span className="text-slate-650 font-light">|</span>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold">Solved</span>
                <span className="font-extrabold text-white">{stats.solvedCount} items</span>
              </div>
            </div>
          </div>

          {/* Exam Environment Options layout */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {examsConfig.map((exam) => {
              const isActive = selectedExam === exam.key;
              return (
                <button
                  key={exam.key}
                  id={`exam-btn-${exam.key}`}
                  onClick={() => {
                    setSelectedExam(exam.key);
                    // switch to practice tab automatically
                    setActiveTab('practice');
                  }}
                  className={`p-3 rounded-xl text-left border-2 transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-lg'
                      : 'bg-slate-850 border-slate-750 text-slate-400 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <span className="block text-sm font-black tracking-wide font-mono">{exam.key}</span>
                  <span className="text-[10px] truncate block opacity-75">{exam.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Frame container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <AnimatePresence mode="wait">
          {activeTab === 'practice' && (
            <motion.div
              key="practice-room"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
                  Practice Environment: {selectedExam}
                </h3>
              </div>

              {/* Sub descriptor syllabus card */}
              <div className="bg-indigo-50/40 border border-indigo-100/55 rounded-2xl p-4 flex items-center gap-3 text-xs leading-relaxed text-indigo-950">
                <Compass className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                <span>
                  {examsConfig.find(e => e.key === selectedExam)?.syllabus}
                </span>
              </div>

              {/* Active Exam Engine Problem Solver */}
              <ExamEngine
                language={language}
                selectedExam={selectedExam}
                onAnswerLogged={handleAnswerLogged}
                onSectionComplete={handleSectionComplete}
              />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-room"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest leading-none">
                  {t.dashboardTitle}
                </h3>
              </div>

              {/* Statistical Charts & logs dashboard */}
              <Dashboard
                language={language}
                stats={stats}
                history={history}
                onResetStats={handleResetStats}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings-room"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
                <h3 className="text-base font-black text-slate-800 uppercase tracking-wider border-b border-slate-50 pb-2.5">
                  {t.headerSettings}
                </h3>

                <div className="space-y-4">
                  {/* Change Student username details form */}
                  <div className="space-y-1.5">
                    <label htmlFor="settings-name-input" className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Update Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="settings-name-input"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          localStorage.setItem('prep_username', e.target.value);
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none transition leading-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Syllabus config card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-slate-800">Standardized Syllabus Activated</span>
                      <p className="text-slate-400 leading-normal">
                        Your practice sessions strictly track 2025–2026 guidelines. All scores are categorized by exam parameters automatically.
                      </p>
                    </div>
                  </div>

                  {/* Reset platform action button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      id="reset-stats-btn-settings"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete all practice records?')) {
                          handleResetStats();
                        }
                      }}
                      className="bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition"
                    >
                      Reset All Progress Records
                    </button>

                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="text-slate-500 hover:text-slate-800 text-xs font-bold flex items-center gap-1 cursor-pointer transition"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.loginText.startsWith('Welcome') ? 'Switch Accounts' : 'Log Out'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistent AI Study Mentor Sidebar chat */}
      <AIChatPanel
        language={language}
        currentExam={selectedExam}
        username={username}
        onRecordPractice={handleAnswerLogged}
      />
    </div>
  );
}
