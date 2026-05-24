import { LanguageCode, ExamType, UserStats, ExamHistoryItem } from '../types';
import { locales } from '../locales';
import { Award, Target, Clock, Zap, BookOpen, Compass, RotateCcw } from 'lucide-react';

interface DashboardProps {
  language: LanguageCode;
  stats: UserStats;
  history: ExamHistoryItem[];
  onResetStats?: () => void;
}

export default function Dashboard({ language, stats, history, onResetStats }: DashboardProps) {
  const t = locales[language] || locales.en;

  // Calculate actual accuracy percentage
  const accuracy = stats.solvedCount > 0
    ? Math.round((stats.correctCount / stats.solvedCount) * 100)
    : 0;

  // Group stats by exam categories for the custom SVG bar chart
  const examCategories: Record<ExamType, { solved: number; correct: number }> = {
    AP: { solved: 0, correct: 0 },
    IELTS: { solved: 0, correct: 0 },
    SAT: { solved: 0, correct: 0 },
    IB: { solved: 0, correct: 0 },
    UNT: { solved: 0, correct: 0 }
  };

  history.forEach(item => {
    if (examCategories[item.exam]) {
      examCategories[item.exam].solved += item.total;
      examCategories[item.exam].correct += item.score;
    }
  });

  const categoryMax = Math.max(...Object.values(examCategories).map(c => c.solved), 5);

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Solved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 tracking-tight">
              {stats.solvedCount}
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.statsSolved}
            </span>
          </div>
        </div>

        {/* Stat 2: Accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 tracking-tight">
              {accuracy}%
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.statsAccuracy}
            </span>
          </div>
        </div>

        {/* Stat 3: Time Spent */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition">
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 tracking-tight">
              {stats.timeSpentMinutes} <span className="text-xs font-semibold text-slate-500">{t.minutesLabel}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.statsTimeSpent}
            </span>
          </div>
        </div>

        {/* Stat 4: Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition">
          <div className="bg-pink-50 text-pink-600 p-3 rounded-xl animate-pulse">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-2xl font-black text-slate-800 tracking-tight">
              {stats.streakDays} <span className="text-xs font-semibold text-slate-500">{t.daysLabel}</span>
            </span>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              {t.statsStreak}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Block & Practice Log split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom Visual SVG Bar Graph Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-indigo-500" />
              {t.dashboardStats}
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">Syllabus Breakdown (2025–26)</span>
          </div>

          <div className="relative pt-4">
            {stats.solvedCount === 0 ? (
              <div className="h-[180px] bg-slate-50/50 rounded-xl flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 italic max-w-xs">{t.noStatsYet}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Visual Bar rows for each Exam Type */}
                {(['AP', 'IELTS', 'SAT', 'IB', 'UNT'] as ExamType[]).map((exam) => {
                  const item = examCategories[exam];
                  const solvedPct = item.solved > 0 ? (item.solved / categoryMax) * 100 : 0;
                  const correctPct = item.solved > 0 ? (item.correct / item.solved) * 100 : 0;

                  return (
                    <div key={exam} className="space-y-1" id={`gauge-${exam}`}>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                        <span className="bg-slate-100 hover:bg-slate-250 border border-slate-200 px-2 py-0.5 rounded font-mono text-[10px] tracking-wide text-indigo-900 w-12 text-center">
                          {exam}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {item.correct} / {item.solved} correct
                        </span>
                      </div>
                      
                      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden flex">
                        {/* Solved bar backdrop */}
                        <div 
                          className="h-full bg-slate-200 transition-all rounded-full duration-550 absolute left-0 top-0"
                          style={{ width: `${Math.max(solvedPct, 2)}%` }}
                        />
                        {/* Correct ratio overlay */}
                        {item.solved > 0 && (
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all rounded-full duration-550 z-10"
                            style={{ width: `${(solvedPct * correctPct) / 100}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono italic pt-2 border-t border-slate-50">
                  <span>Relative Volume Solved</span>
                  <span>Interactive Real-time Sync</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Weaknesses and AI Recommendations Sidebar */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-5">
          {/* Weakness identification list */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
              {t.weakTopicsTitle}
            </h4>
            {stats.weakTopics.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">{t.noWeakTopicsYet}</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {stats.weakTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-rose-100 tracking-wide"
                  >
                    ⚠️ {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI Recommended Topics and actions */}
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              {t.recommendationsTitle}
            </h4>
            {stats.recommendations.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-1">{t.noRecommendationsYet}</p>
            ) : (
              <div className="space-y-2">
                {stats.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100/50 flex items-start gap-2 text-[11px] leading-relaxed text-indigo-900"
                  >
                    <Compass className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Practice Log history list table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-700">
            {t.historyTitle}
          </h3>
          {onResetStats && stats.solvedCount > 0 && (
            <button
              id="reset-stats-btn"
              onClick={onResetStats}
              className="text-[10px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw className="w-3 h-3" />
              Clear analytics
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-xs text-slate-400 italic">{t.noStatsYet}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="py-2.5">Timestamp</th>
                  <th className="py-2.5">Exam</th>
                  <th className="py-2.5">Subject</th>
                  <th className="py-2.5 text-right">Practice Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {history.slice().reverse().map((item, index) => {
                  const passPct = (item.score / item.total) * 100;
                  return (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 font-mono text-slate-400 text-[11px]">{item.timestamp}</td>
                      <td className="py-2.5">
                        <span className="bg-slate-100 border border-slate-200 font-bold px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700">
                          {item.exam}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-700 font-medium">{item.subject}</td>
                      <td className="py-2.5 text-right font-bold">
                        <span className={passPct >= 50 ? 'text-emerald-600' : 'text-rose-600'}>
                          {item.score} / {item.total}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
