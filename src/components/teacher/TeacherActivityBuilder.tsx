import React, { useState } from 'react';
import {
  Mic,
  Clock,
  Sparkles,
  Layers,
  Image as ImageIcon,
  CheckCircle,
  Plus,
  Sliders,
  Send,
} from 'lucide-react';
import { SpeakingActivity, ActivityType, SpeakingLevel } from '../../types';

interface TeacherActivityBuilderProps {
  teacherId: string;
  onSaveActivity: (activity: Omit<SpeakingActivity, 'id' | 'createdAt'>) => void;
  existingActivities: SpeakingActivity[];
}

export const TeacherActivityBuilder: React.FC<TeacherActivityBuilderProps> = ({
  teacherId,
  onSaveActivity,
  existingActivities,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ActivityType>('discussion');
  const [category, setCategory] = useState('Daily Speaking Drill');
  const [difficulty, setDifficulty] = useState<SpeakingLevel>('Intermediate');
  const [promptText, setPromptText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [prepTimeSeconds, setPrepTimeSeconds] = useState(45);
  const [minDurationSeconds, setMinDurationSeconds] = useState(45);
  const [maxDurationSeconds, setMaxDurationSeconds] = useState(120);
  const [hintsText, setHintsText] = useState('Use transition words like "Furthermore" and "On the other hand".\nProvide at least two concrete examples.');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !promptText.trim()) return;

    const hints = hintsText
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    onSaveActivity({
      title: title.trim(),
      type,
      category: category.trim(),
      difficulty,
      promptText: promptText.trim(),
      imageUrl: imageUrl.trim() || undefined,
      prepTimeSeconds,
      minDurationSeconds,
      maxDurationSeconds,
      createdBy: teacherId,
      hints,
      rubricCriteria: ['Fluency & Continuity', 'Pronunciation & Intelligibility', 'Clarity & Logic', 'Vocabulary Variety'],
    });

    setIsSuccess(true);
    setTitle('');
    setPromptText('');
    setImageUrl('');
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          Speaking Activity Builder
        </h1>
        <p className="text-xs sm:text-sm text-[#6E6E73] dark:text-[#98989D] mt-1">
          Design high-impact speaking prompts across 8 specialized vocal task types. Define preparation timers, target speech durations, and guidance tips.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          {isSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              Speaking activity created and published to all students!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                Activity Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spontaneous Rebuttal: Remote Work Collaboration"
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                  Activity Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ActivityType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                >
                  <option value="discussion">Discussion / Opinion</option>
                  <option value="picture_description">Picture Description</option>
                  <option value="storytelling">Storytelling Drill</option>
                  <option value="role_play">Role-Play Scenario</option>
                  <option value="interview">Job Interview Simulation</option>
                  <option value="presentation">Presentation & Pitch</option>
                  <option value="timed_challenge">Timed Challenge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                  Proficiency Target
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as SpeakingLevel)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                  Category Tag
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Workplace English"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                Speaking Prompt Instructions
              </label>
              <textarea
                required
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Write clear instructions for what the student should discuss, defend, or narrate..."
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs sm:text-sm text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
              />
            </div>

            {/* Optional Image URL for Picture Tasks */}
            {type === 'picture_description' && (
              <div>
                <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                  Image URL for Visual Narration
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
                />
              </div>
            )}

            {/* Timers */}
            <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E]">
              <div>
                <label className="block text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] mb-1">
                  Prep Timer (Sec)
                </label>
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={prepTimeSeconds}
                  onChange={(e) => setPrepTimeSeconds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#1D1D1F] dark:text-white border border-black/5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] mb-1">
                  Min Duration (Sec)
                </label>
                <input
                  type="number"
                  min={15}
                  max={300}
                  value={minDurationSeconds}
                  onChange={(e) => setMinDurationSeconds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#1D1D1F] dark:text-white border border-black/5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#6E6E73] dark:text-[#98989D] mb-1">
                  Max Duration (Sec)
                </label>
                <input
                  type="number"
                  min={30}
                  max={600}
                  value={maxDurationSeconds}
                  onChange={(e) => setMaxDurationSeconds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#1C1C1E] text-xs font-bold text-[#1D1D1F] dark:text-white border border-black/5"
                />
              </div>
            </div>

            {/* Hints & Vocabulary suggestions */}
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                Speaking Guidance & Scaffold Phrases (One per line)
              </label>
              <textarea
                rows={3}
                value={hintsText}
                onChange={(e) => setHintsText(e.target.value)}
                placeholder="From my standpoint...&#10;To substantiate this argument..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F7] dark:bg-[#2C2C2E] text-xs text-[#1D1D1F] dark:text-white border border-transparent focus:border-[#7957E8] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-[#7957E8] hover:bg-[#6C47E0] text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Mic className="w-4 h-4" /> Save & Distribute Speaking Drill
              </button>
            </div>
          </form>
        </div>

        {/* Existing Custom Prompts Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1C1C1E] border border-black/5 dark:border-white/10 shadow-sm">
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white mb-3">
              Active Speaking Prompts ({existingActivities.length})
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {existingActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-[#2C2C2E] border border-black/5 dark:border-white/5"
                >
                  <div className="flex items-center justify-between text-[10px] text-[#7957E8] font-semibold mb-1">
                    <span>{act.type.replace('_', ' ')}</span>
                    <span className="text-[#6E6E73] dark:text-[#98989D]">{act.difficulty}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#1D1D1F] dark:text-white line-clamp-1">{act.title}</h4>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D] line-clamp-2 mt-1">
                    {act.promptText}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
