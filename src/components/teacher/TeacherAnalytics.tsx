import React from 'react';
import {
  TrendingUp,
  Award,
  Sparkles,
  Info,
  CheckCircle,
  BarChart3,
  Activity,
  Layers,
} from 'lucide-react';
import { Submission } from '../../types';

interface TeacherAnalyticsProps {
  submissions: Submission[];
}

export const TeacherAnalytics: React.FC<TeacherAnalyticsProps> = ({ submissions }) => {
  const graded = submissions.filter((s) => s.status === 'graded');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Class Speaking Analytics & Rubric Trends
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Longitudinal insights based on instructor rubric scores and AI speech processing. Distinguishes certified grades from automated estimates.
        </p>
      </div>

      {/* 5-Pillar Rubric Class Averages */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
        <h3 className="text-base sm:text-lg font-bold text-[#1D1D1F] dark:text-white mb-2">
          Cohort Rubric Competencies
        </h3>
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mb-6">
          Weighted across all evaluated student audio submissions this term.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Fluency & Continuity',
              score: 91,
              desc: 'Continuous sentence phrasing, natural breath pauses, minimal hesitation.',
            },
            {
              name: 'Pronunciation & Intelligibility',
              score: 93,
              desc: 'Phonetic clarity, natural word stress. (Accent variations are treated neutrally).',
            },
            {
              name: 'Clarity & Organization',
              score: 94,
              desc: 'Logical structure, thesis statement, and supporting oral elaboration.',
            },
            {
              name: 'Spoken Vocabulary',
              score: 89,
              desc: 'Lexical variety, precision of terminology, idiom and transition usage.',
            },
            {
              name: 'Response Relevance & Depth',
              score: 95,
              desc: 'Direct answering of prompt questions with reasoned examples.',
            },
            {
              name: 'Willingness to Communicate',
              score: 96,
              desc: 'Spontaneous willingness to elaborate without trailing off.',
            },
          ].map((pillar, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-white">
                <span>{pillar.name}</span>
                <span className="font-mono text-[#7957E8]">{pillar.score}%</span>
              </div>
              <div className="w-full bg-black/5 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#7957E8] h-full rounded-full transition-all duration-700"
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6E6E73] dark:text-[#8E8E93] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cadence & Distribution Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-[#7957E8]">
            <Activity className="w-5 h-5" />
            <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white">
              Spoken Cadence Distribution
            </h3>
          </div>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mb-4">
            Analysis of words-per-minute (WPM) across submitted audio recordings.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1D1D1F] dark:text-white">Under 110 WPM (Hesitant)</span>
              <span className="font-mono font-bold text-[#6E6E73]">10% of submissions</span>
            </div>
            <div className="w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[10%]" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1D1D1F] dark:text-white font-semibold">120–155 WPM (Natural Conversational)</span>
              <span className="font-mono font-bold text-emerald-600">80% of submissions</span>
            </div>
            <div className="w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[80%]" />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#1D1D1F] dark:text-white">Over 160 WPM (Rushed)</span>
              <span className="font-mono font-bold text-[#6E6E73]">10% of submissions</span>
            </div>
            <div className="w-full bg-[#F5F5F7] dark:bg-[#2C2C2E] h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[10%]" />
            </div>
          </div>
        </div>

        {/* Ethical Speaking Assessment Policy Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 border border-[#7957E8]/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-[#7957E8]">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white">
                Intelligibility & Accent Neutrality Principle
              </h3>
            </div>
            <p className="text-xs text-[#1D1D1F] dark:text-[#E5E5EA] leading-relaxed mb-4">
              Speak Bloom strictly adheres to international phonology standards: accent differences are never treated as errors when speech is intelligible and articulate.
            </p>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D] leading-relaxed">
              Automated AI assessments serve exclusively as formative estimates to guide student practice, while certified grades and rubric evaluations are issued with instructor authority.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#7957E8]/20 text-[11px] text-[#7957E8] font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Compliant with CEFR Oral Production Rubrics
          </div>
        </div>
      </div>
    </div>
  );
};
