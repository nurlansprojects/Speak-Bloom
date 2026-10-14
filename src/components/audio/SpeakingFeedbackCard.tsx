import React from 'react';
import {
  Sparkles,
  Award,
  CheckCircle,
  Lightbulb,
  Volume2,
  TrendingUp,
  Activity,
  ArrowRight,
  RotateCcw,
  Info,
} from 'lucide-react';
import { AIAssessmentResult } from '../../types';

interface SpeakingFeedbackCardProps {
  assessment: AIAssessmentResult;
  audioUrl?: string;
  onTryAgain?: () => void;
  onContinue?: () => void;
}

export const SpeakingFeedbackCard: React.FC<SpeakingFeedbackCardProps> = ({
  assessment,
  audioUrl,
  onTryAgain,
  onContinue,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 75) return 'text-[#7957E8] dark:text-[#A78BFA]';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 75) return 'bg-[#7957E8]/10 border-[#7957E8]/20';
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Speech Assessment
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
            Speaking Performance Analysis
          </h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Objective evaluation based on fluency, phonetics, structure, and prompt development.
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${getScoreBg(assessment.overallScore)}`}>
          <Award className={`w-8 h-8 ${getScoreColor(assessment.overallScore)}`} />
          <div>
            <div className={`text-2xl sm:text-3xl font-mono font-bold ${getScoreColor(assessment.overallScore)}`}>
              {assessment.overallScore}<span className="text-xs text-[#6E6E73] font-normal">/100</span>
            </div>
            <div className="text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D]">
              Spoken Mastery Score
            </div>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 my-6">
        {[
          { label: 'Fluency', score: assessment.fluencyScore, desc: 'Flow & continuity' },
          { label: 'Pronunciation', score: assessment.pronunciationScore, desc: 'Intelligibility' },
          { label: 'Clarity', score: assessment.clarityScore, desc: 'Structure & logic' },
          { label: 'Vocabulary', score: assessment.vocabularyScore, desc: 'Lexical variety' },
          { label: 'Relevance', score: assessment.relevanceScore, desc: 'Prompt answer' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] flex flex-col justify-between"
          >
            <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D]">{item.label}</span>
            <div className="my-1.5 flex items-baseline gap-1">
              <span className={`text-xl font-mono font-bold ${getScoreColor(item.score)}`}>
                {item.score}
              </span>
              <span className="text-[10px] text-[#6E6E73] dark:text-[#8E8E93]">/100</span>
            </div>
            <div className="w-full bg-black/5 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#7957E8] h-full rounded-full transition-all duration-700"
                style={{ width: `${item.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Speaking Cadence / Pace Indicator */}
      <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#1D1D1F] dark:text-white flex items-center gap-2">
              Speaking Cadence: <span className="font-mono text-[#7957E8] font-bold">{assessment.speakingPaceWpm} WPM</span>
            </div>
            <div className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              {assessment.speakingPaceWpm >= 120 && assessment.speakingPaceWpm <= 160
                ? 'Ideal natural conversational speed (120–160 WPM).'
                : assessment.speakingPaceWpm < 120
                ? 'Slightly slow or hesitant. Work on continuous phrasing.'
                : 'Rapid delivery. Remember to breathe and articulate word endings.'}
            </div>
          </div>
        </div>

        {assessment.detectedFillers && assessment.detectedFillers.length > 0 ? (
          <div className="text-xs text-[#6E6E73] dark:text-[#98989D] flex items-center gap-1.5">
            Fillers observed: <span className="font-semibold text-amber-600 dark:text-amber-400">{assessment.detectedFillers.join(', ')}</span>
          </div>
        ) : (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> No disruptive filler words detected
          </div>
        )}
      </div>

      {/* Transcribed Speech Segment */}
      {assessment.transcript && (
        <div className="mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-[#7957E8]" /> Your Spoken Words (Transcribed)
          </h4>
          <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA] leading-relaxed italic">
            "{assessment.transcript}"
          </div>
        </div>
      )}

      {/* Strengths and Improvement Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Strengths */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" /> Observed Strengths
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA]">
            {assessment.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvement Tips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#7957E8]/5 dark:bg-[#7957E8]/10 border border-[#7957E8]/15">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7957E8] dark:text-[#A78BFA] mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4" /> Actionable Next-Attempt Tips
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA]">
            {assessment.improvementTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#7957E8] font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Phonetic Pronunciation Notes */}
      {assessment.pronunciationNotes && assessment.pronunciationNotes.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2">
            Pronunciation & Stress Focus
          </h4>
          <ul className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#D1D1D6] space-y-1">
            {assessment.pronunciationNotes.map((note, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7957E8]" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Coach Commentary */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-2">
          Coach Commentary
        </h4>
        <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA] leading-relaxed">
          {assessment.detailedFeedback}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 text-[11px] text-[#6E6E73] dark:text-[#8E8E93] mb-6 p-3 rounded-xl bg-black/5 dark:bg-white/5">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#7957E8]" />
        <span>
          {assessment.disclaimer || 'Automated pronunciation and fluency assessments are objective AI estimates to guide practice. Accent differences are not penalised when speech is intelligible.'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-black/5 dark:border-white/10">
        {onTryAgain && (
          <button
            onClick={onTryAgain}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Practice Again
          </button>
        )}
        {onContinue && (
          <button
            onClick={onContinue}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#7957E8] text-white text-xs sm:text-sm font-semibold hover:bg-[#6C47E0] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
