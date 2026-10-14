import React, { useState } from 'react';
import {
  Mic,
  Clock,
  Sparkles,
  Filter,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Briefcase,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { SpeakingActivity, ActivityType, SpeakingLevel, AIAssessmentResult } from '../../types';
import { AudioRecorderStudio } from '../audio/AudioRecorderStudio';
import { SpeakingFeedbackCard } from '../audio/SpeakingFeedbackCard';

interface StudentPracticeProps {
  activities: SpeakingActivity[];
  onCompletePractice: (activity: SpeakingActivity, assessment: AIAssessmentResult, durationSeconds: number) => void;
}

export const StudentPractice: React.FC<StudentPracticeProps> = ({
  activities,
  onCompletePractice,
}) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [activeActivity, setActiveActivity] = useState<SpeakingActivity | null>(null);
  const [activeAssessment, setActiveAssessment] = useState<{
    result: AIAssessmentResult;
    audioUrl: string;
    durationSeconds: number;
  } | null>(null);

  const filterTypes = [
    { id: 'all', label: 'All Exercises' },
    { id: 'discussion', label: 'Discussion & Opinion' },
    { id: 'picture_description', label: 'Picture Description' },
    { id: 'storytelling', label: 'Storytelling' },
    { id: 'role_play', label: 'Role-Play & Situational' },
    { id: 'interview', label: 'Job Interview' },
    { id: 'presentation', label: 'Presentation & Pitch' },
    { id: 'timed_challenge', label: 'Timed Challenges' },
  ];

  const filtered = activities.filter((act) => {
    if (selectedType !== 'all' && act.type !== selectedType) return false;
    if (selectedDifficulty !== 'all' && act.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) return false;
    return true;
  });

  const handleAssessmentComplete = (
    assessment: AIAssessmentResult,
    audioUrl: string,
    durationSeconds: number
  ) => {
    if (activeActivity) {
      onCompletePractice(activeActivity, assessment, durationSeconds);
    }
    setActiveAssessment({ result: assessment, audioUrl, durationSeconds });
  };

  // If currently practicing an activity
  if (activeActivity) {
    if (activeAssessment) {
      return (
        <div className="space-y-6">
          <SpeakingFeedbackCard
            assessment={activeAssessment.result}
            audioUrl={activeAssessment.audioUrl}
            onTryAgain={() => {
              setActiveAssessment(null);
            }}
            onContinue={() => {
              setActiveActivity(null);
              setActiveAssessment(null);
            }}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <AudioRecorderStudio
          activity={activeActivity}
          onAssessmentComplete={handleAssessmentComplete}
          onCancel={() => setActiveActivity(null)}
          submitButtonText="Evaluate Speaking Response"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Speaking Practice Drills
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Choose a prompt, use the preparation timer, record your audio response, and receive instant AI phonetic and fluency analysis.
        </p>
      </div>

      {/* Filter Bars */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Activity Type Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {filterTypes.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedType === tab.id
                  ? 'bg-[#7957E8] text-white shadow-sm'
                  : 'bg-white dark:bg-[#1C1C1E] text-[#6E6E73] dark:text-[#D1D1D6] border border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-[#1C1C1E] p-1 rounded-xl border border-black/5 dark:border-white/10 shrink-0">
          {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedDifficulty(lvl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                selectedDifficulty === lvl
                  ? 'bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA] font-bold'
                  : 'text-[#6E6E73] dark:text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Drills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((activity) => (
          <div
            key={activity.id}
            className="group rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 p-6 flex flex-col justify-between hover:shadow-md transition-all hover:border-[#7957E8]/30"
          >
            <div>
              {/* Image thumbnail if picture description */}
              {activity.imageUrl && (
                <div className="mb-4 h-36 rounded-2xl overflow-hidden bg-black/5 relative">
                  <img src={activity.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Visual Drill
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#7957E8]/10 text-[#7957E8] dark:bg-[#7957E8]/20 dark:text-[#A78BFA]">
                  {activity.category || activity.type.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D]">
                  {activity.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white mb-2 group-hover:text-[#7957E8] transition-colors">
                {activity.title}
              </h3>
              <p className="text-xs text-[#6E6E73] dark:text-[#AEAEB2] line-clamp-3 leading-relaxed mb-4">
                {activity.promptText}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-[#6E6E73] dark:text-[#8E8E93] pt-4 border-t border-black/5 dark:border-white/5 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Prep: {activity.prepTimeSeconds}s
                </span>
                <span>Speak: {activity.minDurationSeconds}s – {activity.maxDurationSeconds}s</span>
              </div>

              <button
                onClick={() => setActiveActivity(activity)}
                className="w-full py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] group-hover:bg-[#7957E8] group-hover:text-white text-[#1D1D1F] dark:text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Mic className="w-4 h-4" /> Start Speaking Task
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10">
          <p className="text-sm font-semibold text-[#1D1D1F] dark:text-white">No exercises match the selected filters.</p>
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedDifficulty('all');
            }}
            className="mt-3 text-xs text-[#7957E8] font-semibold underline cursor-pointer"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};
