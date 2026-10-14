import { SpeakingActivity, Course } from '../types';

export const SYSTEM_SPEAKING_ACTIVITIES: SpeakingActivity[] = [
  {
    id: 'act-daily-morning',
    title: 'Daily Check-in: My Morning Routine & Energy',
    type: 'discussion',
    category: 'Daily Warm-up',
    promptText: 'Describe how you start your morning to set yourself up for a productive day. What is one habit that significantly changes your energy level? Speak continuously and explain the reasons behind your routine.',
    prepTimeSeconds: 30,
    minDurationSeconds: 45,
    maxDurationSeconds: 120,
    difficulty: 'Beginner',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Fluency & Continuity', 'Natural Everyday Phrasing', 'Sentence Linking'],
    hints: [
      'Start with a vivid opener: "First thing in the morning, I..."',
      'Use sequential connectors: "After that", "Once I finish...", "What really boosts my focus is..."',
      'Conclude with how it prepares your mindset for the day.'
    ],
    exampleResponse: 'First thing in the morning, I like to wake up without looking at my smartphone for at least thirty minutes. I drink a tall glass of cool water and do light stretches on the balcony. What really transforms my energy is having breakfast by a window with natural sunlight. It gives me clarity before diving into work.',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'act-picture-cafe',
    title: 'Picture Description: Vibrant Urban Coffee House',
    type: 'picture_description',
    category: 'Visual Narration',
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    promptText: 'Look at the photograph of this lively modern café. Describe the foreground, the background, the atmosphere, and what the people appear to be engaged in. Speculate on why spaces like this encourage deep work or social connection.',
    prepTimeSeconds: 45,
    minDurationSeconds: 60,
    maxDurationSeconds: 150,
    difficulty: 'Intermediate',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Spatial Vocabulary', 'Descriptive Nuance', 'Intelligibility & Pronunciation'],
    hints: [
      'In the foreground, we notice...',
      'Moving towards the background, the warm ambient lighting...',
      'The atmosphere appears tranquil yet buzzing with creative energy.',
      'Speculative modal verbs: "They might be brainstorming...", "It seems like..."'
    ],
    exampleResponse: 'In the center of the frame, several patrons are seated along a clean wooden bar with laptops, immersed in focused tasks. Natural light cascades through large panoramic windows. In the background, baristas are meticulously preparing espresso drinks. The warm wooden textures combined with soft lighting create an inviting, contemplative ambience where productivity thrives.',
    createdAt: '2026-01-02T00:00:00Z'
  },
  {
    id: 'act-story-turning-point',
    title: 'Storytelling: A Decision That Changed My Perspective',
    type: 'storytelling',
    category: 'Narrative Fluency',
    promptText: 'Recount a personal memory or turning point when you made a decision that felt intimidating at first, but ultimately taught you an invaluable lesson. Use vivid past tenses and emotive descriptive words.',
    prepTimeSeconds: 60,
    minDurationSeconds: 90,
    maxDurationSeconds: 180,
    difficulty: 'Intermediate',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Narrative Flow', 'Past Tense Articulation', 'Intonation & Emphasis'],
    hints: [
      'Set the scene: "It all happened roughly two years ago when..."',
      'Describe the conflict/doubt: "At first, I wrestled with self-doubt because..."',
      'Highlight the turning moment: "The breakthrough occurred when..."',
      'Reflect on the outcome: "Looking back, that experience shaped how I..."'
    ],
    createdAt: '2026-01-03T00:00:00Z'
  },
  {
    id: 'act-roleplay-flight',
    title: 'Situational Roleplay: Rescheduling an International Flight',
    type: 'role_play',
    category: 'Travel & Real-life Communication',
    promptText: 'You have arrived at the airport service counter because your connecting flight was canceled due to sudden weather conditions. Speak politely yet assertively with the airline representative to arrange an alternative route that gets you to your destination today, while asking about meal vouchers and luggage transfer.',
    prepTimeSeconds: 45,
    minDurationSeconds: 60,
    maxDurationSeconds: 150,
    difficulty: 'Intermediate',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Polite Assertiveness', 'Conversational Tone', 'Clear Functional English'],
    hints: [
      '"Good afternoon. I understand safety is the priority, but my connecting flight was just canceled..."',
      '"Could you check if there are partner airlines departing later this evening?"',
      '"What is the procedure regarding our checked luggage and meal compensation?"'
    ],
    createdAt: '2026-01-04T00:00:00Z'
  },
  {
    id: 'act-interview-leadership',
    title: 'Executive Interview: Resolving Conflict within a Team',
    type: 'interview',
    category: 'Professional & Career',
    promptText: 'Interviewer Question: "Can you describe a challenging disagreement between team members on a previous project? How did you step in to mediate, align differing viewpoints, and deliver a successful outcome?" Use the STAR framework (Situation, Task, Action, Result).',
    prepTimeSeconds: 60,
    minDurationSeconds: 90,
    maxDurationSeconds: 180,
    difficulty: 'Advanced',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Executive Presence', 'STAR Structure', 'Professional Spoken Diction', 'Rhetorical Organization'],
    hints: [
      'Situation: Briefly frame the high-stakes project and opposing perspectives.',
      'Task: State your leadership mandate to foster consensus without delaying milestones.',
      'Action: Describe one-on-one listening sessions and a data-driven alignment workshop.',
      'Result: Mention the project outcome and lasting team synergy.'
    ],
    createdAt: '2026-01-05T00:00:00Z'
  },
  {
    id: 'act-timed-challenge-ai',
    title: '60-Second Timed Challenge: The Future of Human Creativity',
    type: 'timed_challenge',
    category: 'Speed & Spontaneous Delivery',
    promptText: 'You have exactly 60 seconds to speak without stopping. Topic: Will artificial intelligence replace genuine human artistic expression, or will it simply become the next paint brush? Deliver a strong opinion with two quick persuasive points.',
    prepTimeSeconds: 20,
    minDurationSeconds: 45,
    maxDurationSeconds: 60,
    difficulty: 'Advanced',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Quick Thinking', 'Zero Hesitation', 'Pacing & Cadence', 'Definitive Conclusion'],
    hints: [
      'Take a clear stance in your opening five seconds.',
      'First point: Technology has historically expanded human creative tools, from the camera to digital synthesizers.',
      'Second point: The soul of art is human vulnerability and lived experience, which algorithms merely synthesize.',
      'Conclude firmly before the 60-second chime.'
    ],
    createdAt: '2026-01-06T00:00:00Z'
  },
  {
    id: 'act-presentation-product',
    title: 'Product Pitch: Presenting an Eco-Friendly Innovation',
    type: 'presentation',
    category: 'Public Speaking & Presentations',
    promptText: 'Imagine presenting an innovative sustainable packaging solution to prospective investors. Deliver an engaging 2-minute elevator pitch outlining the environmental problem, your breakthrough design, and the tangible business incentive.',
    prepTimeSeconds: 60,
    minDurationSeconds: 90,
    maxDurationSeconds: 180,
    difficulty: 'Advanced',
    createdBy: 'system',
    isSystemPrompt: true,
    rubricCriteria: ['Hook & Vocal Energy', 'Persuasive Rhetoric', 'Clear Proposition', 'Memorable Sign-off'],
    hints: [
      'Hook the audience with an arresting stat about single-use waste.',
      'Introduce the solution with crisp, confident vocal projection.',
      'Address the unit economics and consumer appeal.',
      'End with a clear, compelling call to action.'
    ],
    createdAt: '2026-01-07T00:00:00Z'
  }
];

export const INITIAL_DEFAULT_COURSES: Course[] = [
  {
    id: 'course-master-fluency',
    title: 'Natural English Fluency & Spoken Rhythm',
    description: 'Break free from translation hesitation. Master continuous sentence linking, natural pauses, and conversational momentum through daily vocal drills.',
    level: 'Intermediate',
    teacherId: 'teacher-system',
    teacherName: 'Prof. Eleanor Vance',
    published: true,
    lessonCount: 4,
    enrolledStudentIds: [],
    lessons: [
      {
        id: 'lesson-1',
        title: 'Vocal Warm-up & Connected Speech',
        speakingObjective: 'Eliminate robotic pauses by linking ending consonants with starting vowels.',
        speakingTask: 'Record a 90-second spontaneous talk describing your typical evening relaxation, actively applying connected speech.',
        durationMinutes: 15,
        order: 1
      },
      {
        id: 'lesson-2',
        title: 'Expressing Nuanced Opinions',
        speakingObjective: 'Use hedging and qualifying phrases instead of flat yes/no answers.',
        speakingTask: 'Debate both sides of remote working vs office collaboration in a balanced 2-minute spoken answer.',
        durationMinutes: 20,
        order: 2
      },
      {
        id: 'lesson-3',
        title: 'Storytelling Cadence & Empathy',
        speakingObjective: 'Modulate vocal pitch and pacing to convey emotion and dramatic suspense.',
        speakingTask: 'Narrate an unexpected encounter or surprise that happened during your travels or studies.',
        durationMinutes: 25,
        order: 3
      },
      {
        id: 'lesson-4',
        title: 'Spontaneous Impromptu Speaking',
        speakingObjective: 'Deliver articulate ideas under tight time constraints with zero vocal fillers.',
        speakingTask: 'Respond to an unpredictable prompt with only 15 seconds of preparation and 60 seconds of speaking.',
        durationMinutes: 20,
        order: 4
      }
    ],
    createdAt: '2026-01-10T00:00:00Z'
  },
  {
    id: 'course-professional-presence',
    title: 'Executive Spoken English & Workplace Presentations',
    description: 'Designed for professionals aiming to lead meetings, articulate complex ideas with brevity, and influence stakeholders with vocal confidence.',
    level: 'Advanced',
    teacherId: 'teacher-system',
    teacherName: 'Dr. Marcus Sterling',
    published: true,
    lessonCount: 3,
    enrolledStudentIds: [],
    lessons: [
      {
        id: 'lesson-exec-1',
        title: 'Executive Brevity & The Bottom-Line First Rule',
        speakingObjective: 'Deliver recommendations immediately before supporting details (BLUF technique).',
        speakingTask: 'Deliver a 90-second spoken project update addressing an unexpected delay and proposed resolution.',
        durationMinutes: 25,
        order: 1
      },
      {
        id: 'lesson-exec-2',
        title: 'Handling Tough Questions Under Pressure',
        speakingObjective: 'Acknowledge, bridge, and deliver reasoned arguments during critical Q&A.',
        speakingTask: 'Defend a contentious budget allocation in a simulated high-stakes executive interview.',
        durationMinutes: 30,
        order: 2
      },
      {
        id: 'lesson-exec-3',
        title: 'Persuasive Storytelling for Pitching',
        speakingObjective: 'Combine statistical logic with relatable human anecdotes to convince stakeholders.',
        speakingTask: 'Pitch a bold new educational initiative to a simulated board of directors.',
        durationMinutes: 30,
        order: 3
      }
    ],
    createdAt: '2026-01-12T00:00:00Z'
  }
];
