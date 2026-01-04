import { WorkoutDay, WorkoutPlan } from "./types";

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: "GYM_BEG_MUSCLE_FULL",
    name: "Gym Beginner - Full Body",
    description: "Perfect for beginners. Full body workouts 3x per week.",
    location: "gym",
    experience: "beginner",
    goal: "muscle_gain",
    split: "Full Body",
    daysPerWeek: 3,
    totalDays: 365,
    phases: [
      { name: "Foundation", startDay: 1, endDay: 30, focus: "Learn proper form" },
      { name: "Building", startDay: 31, endDay: 90, focus: "Progressive overload" },
      { name: "Strength", startDay: 91, endDay: 180, focus: "Increase intensity" },
      { name: "Advanced", startDay: 181, endDay: 365, focus: "Peak performance" },
    ],
  },
  {
    id: "GYM_INT_MUSCLE_PPL",
    name: "Gym Intermediate - Push/Pull/Legs",
    description: "6-day PPL split for serious muscle gains.",
    location: "gym",
    experience: "intermediate",
    goal: "muscle_gain",
    split: "Push/Pull/Legs",
    daysPerWeek: 6,
    totalDays: 365,
    phases: [
      { name: "Foundation", startDay: 1, endDay: 45, focus: "Volume accumulation" },
      { name: "Intensification", startDay: 46, endDay: 120, focus: "Increase weight" },
      { name: "Peak", startDay: 121, endDay: 240, focus: "Maximum intensity" },
      { name: "Maintenance", startDay: 241, endDay: 365, focus: "Sustain gains" },
    ],
  },
  {
    id: "GYM_ADV_STRENGTH_POWER",
    name: "Gym Advanced - Powerlifting",
    description: "Advanced powerlifting program for maximum strength.",
    location: "gym",
    experience: "advanced",
    goal: "strength",
    split: "Upper/Lower",
    daysPerWeek: 4,
    totalDays: 365,
    phases: [
      { name: "Hypertrophy", startDay: 1, endDay: 60, focus: "Build muscle base" },
      { name: "Strength", startDay: 61, endDay: 150, focus: "Heavy compounds" },
      { name: "Peaking", startDay: 151, endDay: 280, focus: "Max attempts" },
      { name: "Deload", startDay: 281, endDay: 365, focus: "Recovery & maintain" },
    ],
  },
  {
    id: "HOME_BEG_MUSCLE_BW",
    name: "Home Beginner - Bodyweight",
    description: "Build muscle at home with no equipment.",
    location: "home",
    experience: "beginner",
    goal: "muscle_gain",
    split: "Full Body",
    daysPerWeek: 3,
    totalDays: 365,
    phases: [
      { name: "Foundation", startDay: 1, endDay: 45, focus: "Master basics" },
      { name: "Progression", startDay: 46, endDay: 120, focus: "Add variations" },
      { name: "Advanced", startDay: 121, endDay: 240, focus: "Complex movements" },
      { name: "Elite", startDay: 241, endDay: 365, focus: "Peak calisthenics" },
    ],
  },
  {
    id: "HOME_INT_MUSCLE_DB",
    name: "Home Intermediate - Dumbbell",
    description: "Full home workout with dumbbells only.",
    location: "home",
    experience: "intermediate",
    goal: "muscle_gain",
    split: "Upper/Lower",
    daysPerWeek: 4,
    totalDays: 365,
    phases: [
      { name: "Foundation", startDay: 1, endDay: 60, focus: "Build base" },
      { name: "Growth", startDay: 61, endDay: 180, focus: "Progressive overload" },
      { name: "Peak", startDay: 181, endDay: 300, focus: "Maximum effort" },
      { name: "Maintain", startDay: 301, endDay: 365, focus: "Sustain gains" },
    ],
  },
  {
    id: "GYM_INT_FAT_UL",
    name: "Gym Intermediate - Fat Loss",
    description: "Upper/Lower split optimized for fat loss.",
    location: "gym",
    experience: "intermediate",
    goal: "fat_loss",
    split: "Upper/Lower",
    daysPerWeek: 4,
    totalDays: 365,
    phases: [
      { name: "Conditioning", startDay: 1, endDay: 45, focus: "Build work capacity" },
      { name: "Fat Burn", startDay: 46, endDay: 150, focus: "High intensity" },
      { name: "Shred", startDay: 151, endDay: 280, focus: "Maximum definition" },
      { name: "Maintain", startDay: 281, endDay: 365, focus: "Sustain leanness" },
    ],
  },
];

export function getPlanForUser(
  location: "gym" | "home",
  experience: "beginner" | "intermediate" | "advanced",
  goals: string[]
): WorkoutPlan {
  const primaryGoal = goals[0] || "muscle_gain";
  
  const matchingPlan = WORKOUT_PLANS.find(
    (plan) =>
      plan.location === location &&
      plan.experience === experience &&
      plan.goal === primaryGoal
  );

  if (matchingPlan) return matchingPlan;

  const fallbackPlan = WORKOUT_PLANS.find(
    (plan) => plan.location === location && plan.experience === experience
  );

  return fallbackPlan || WORKOUT_PLANS[0];
}

export function generateWorkoutDay(planId: string, dayNumber: number): WorkoutDay {
  const plan = WORKOUT_PLANS.find((p) => p.id === planId) || WORKOUT_PLANS[0];
  const weekNumber = Math.ceil(dayNumber / 7);
  const dayInWeek = ((dayNumber - 1) % 7) + 1;
  
  let split: string;
  let targetMuscles: string[];
  let exercises: WorkoutDay["mainWorkout"];

  if (plan.split === "Push/Pull/Legs") {
    const cycle = (dayNumber - 1) % 6;
    if (cycle === 0 || cycle === 3) {
      split = "Push";
      targetMuscles = ["Chest", "Shoulders", "Triceps"];
      exercises = getPushExercises();
    } else if (cycle === 1 || cycle === 4) {
      split = "Pull";
      targetMuscles = ["Back", "Biceps", "Rear Delts"];
      exercises = getPullExercises();
    } else {
      split = "Legs";
      targetMuscles = ["Quads", "Hamstrings", "Glutes", "Calves"];
      exercises = getLegExercises();
    }
  } else if (plan.split === "Upper/Lower") {
    const cycle = (dayNumber - 1) % 4;
    if (cycle === 0 || cycle === 2) {
      split = "Upper Body";
      targetMuscles = ["Chest", "Back", "Shoulders", "Arms"];
      exercises = getUpperExercises();
    } else {
      split = "Lower Body";
      targetMuscles = ["Quads", "Hamstrings", "Glutes", "Calves"];
      exercises = getLegExercises();
    }
  } else {
    split = "Full Body";
    targetMuscles = ["Chest", "Back", "Legs", "Shoulders", "Arms"];
    exercises = getFullBodyExercises();
  }

  const phase = plan.phases.find(
    (p) => dayNumber >= p.startDay && dayNumber <= p.endDay
  ) || plan.phases[0];

  return {
    day: dayNumber,
    planId: plan.id,
    phase: phase.name,
    week: weekNumber,
    split,
    targetMuscles,
    warmup: {
      duration: "5-7 min",
      exercises: [
        { name: "Arm Circles", duration: "30s each direction", instructions: "Stand tall, extend arms, make large circles" },
        { name: "Jumping Jacks", sets: 1, reps: 20, instructions: "Full range of motion, land softly" },
        { name: "Bodyweight Squats", sets: 1, reps: 15, instructions: "Slow and controlled, focus on depth" },
        { name: "Light Cardio", duration: "2 min", instructions: "Jogging in place or high knees" },
      ],
    },
    mainWorkout: exercises,
    cooldown: {
      duration: "5-10 min",
      exercises: [
        { name: "Static Stretching", duration: "30s per muscle", instructions: "Hold each stretch without bouncing" },
        { name: "Deep Breathing", duration: "2 min", instructions: "Slow inhales and exhales" },
        { name: "Light Walking", duration: "2 min", instructions: "Cool down your heart rate gradually" },
      ],
    },
    tips: {
      motivation: `Day ${dayNumber} of 365! You're ${Math.round((dayNumber / 365) * 100)}% through your journey!`,
      nutrition: "Aim for 1.6-2.2g protein per kg of bodyweight today.",
      hydration: "Drink at least 3 liters of water throughout the day.",
      recovery: "Get 7-9 hours of quality sleep tonight.",
      mindset: "Focus on progress, not perfection.",
      nextDay: dayInWeek < 7 ? "Keep the momentum going tomorrow!" : "Rest day tomorrow - recover well!",
    },
    safetyNotes: [
      { condition: "general", note: "Listen to your body. Stop if you feel sharp pain." },
    ],
    estimatedDuration: {
      warmup: 7,
      workout: 55,
      cooldown: 8,
      total: "70 minutes",
    },
    difficultyRating: Math.min(10, 5 + Math.floor(dayNumber / 50)),
    caloriesBurned: "350-450",
    equipmentNeeded: plan.location === "gym" 
      ? ["Barbell", "Dumbbells", "Cables", "Machines"]
      : ["Bodyweight", "Dumbbells"],
  };
}

function getPushExercises(): WorkoutDay["mainWorkout"] {
  return [
    {
      order: 1,
      name: "Barbell Bench Press",
      sets: 4,
      reps: "8-10",
      rest: "90s",
      intensity: "RPE 7-8",
      equipment: ["barbell", "bench"],
      primaryMuscle: "Chest",
      secondaryMuscles: ["Triceps", "Shoulders"],
      instructions: [
        "Lie on bench, feet flat on floor",
        "Grip bar slightly wider than shoulders",
        "Lower to mid-chest with control",
        "Press explosively back to start",
      ],
      formTips: [
        "Keep shoulder blades retracted",
        "Maintain slight arch in lower back",
        "Drive through heels",
      ],
      commonMistakes: [
        "Bouncing bar off chest",
        "Flaring elbows too wide",
        "Lifting hips off bench",
      ],
      alternatives: {
        beginner: { name: "Dumbbell Bench Press", reason: "Easier to control" },
        home: { name: "Push-ups", equipment: ["none"], reason: "No equipment needed" },
      },
      images: [
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 2,
      name: "Incline Dumbbell Press",
      sets: 4,
      reps: "8-10",
      rest: "75s",
      intensity: "RPE 7",
      equipment: ["dumbbells", "incline_bench"],
      primaryMuscle: "Upper Chest",
      secondaryMuscles: ["Shoulders", "Triceps"],
      instructions: [
        "Set bench to 30-45 degree incline",
        "Press dumbbells up and together",
        "Lower with control to chest level",
      ],
      formTips: ["Keep core tight", "Don't let dumbbells drift forward"],
      commonMistakes: ["Setting incline too high", "Rushing the movement"],
      alternatives: {
        home: { name: "Decline Push-ups", equipment: ["none"], reason: "Targets upper chest" },
      },
      images: [
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 3,
      name: "Dumbbell Chest Flyes",
      sets: 3,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 6-7",
      equipment: ["dumbbells", "bench"],
      primaryMuscle: "Chest",
      instructions: [
        "Lie flat with dumbbells above chest",
        "Lower in arc motion with slight elbow bend",
        "Squeeze chest to return",
      ],
      formTips: ["Keep elbow angle constant", "Focus on the stretch"],
      commonMistakes: ["Bending elbows too much", "Going too heavy"],
      alternatives: {
        home: { name: "Floor Flyes", equipment: ["dumbbells"], reason: "Limited range" },
      },
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 4,
      name: "Overhead Press",
      sets: 4,
      reps: "8-10",
      rest: "90s",
      intensity: "RPE 7-8",
      equipment: ["barbell"],
      primaryMuscle: "Shoulders",
      secondaryMuscles: ["Triceps", "Core"],
      instructions: [
        "Stand with bar at shoulder height",
        "Press overhead in straight line",
        "Lower with control",
      ],
      formTips: ["Brace core throughout", "Keep bar path vertical"],
      commonMistakes: ["Excessive back arch", "Pressing forward"],
      alternatives: {
        beginner: { name: "Seated Dumbbell Press", reason: "More stable" },
        injury_shoulder: { name: "Landmine Press", reason: "Less shoulder stress" },
      },
      images: [
        "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 5,
      name: "Lateral Raises",
      sets: 3,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 6-7",
      equipment: ["dumbbells"],
      primaryMuscle: "Side Delts",
      instructions: [
        "Stand with dumbbells at sides",
        "Raise to shoulder height",
        "Lower with control",
      ],
      formTips: ["Lead with elbows", "Slight forward lean"],
      commonMistakes: ["Using momentum", "Going too heavy"],
      alternatives: {},
      images: [
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 6,
      name: "Tricep Pushdowns",
      sets: 3,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["cable_machine"],
      primaryMuscle: "Triceps",
      instructions: [
        "Stand at cable machine",
        "Push rope down until arms straight",
        "Squeeze at bottom",
      ],
      formTips: ["Keep elbows pinned to sides", "Full extension at bottom"],
      commonMistakes: ["Moving elbows", "Leaning too far forward"],
      alternatives: {
        home: { name: "Diamond Push-ups", equipment: ["none"], reason: "Targets triceps" },
      },
      images: [
        "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 7,
      name: "Overhead Tricep Extension",
      sets: 3,
      reps: "10-12",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["dumbbell"],
      primaryMuscle: "Triceps",
      instructions: [
        "Hold dumbbell overhead with both hands",
        "Lower behind head with control",
        "Extend back to start",
      ],
      formTips: ["Keep elbows close to head", "Full range of motion"],
      commonMistakes: ["Flaring elbows", "Moving upper arms"],
      alternatives: {},
      images: [
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      ],
    },
  ];
}

function getPullExercises(): WorkoutDay["mainWorkout"] {
  return [
    {
      order: 1,
      name: "Barbell Rows",
      sets: 4,
      reps: "8-10",
      rest: "90s",
      intensity: "RPE 7-8",
      equipment: ["barbell"],
      primaryMuscle: "Back",
      secondaryMuscles: ["Biceps", "Rear Delts"],
      instructions: [
        "Hinge at hips, back flat",
        "Pull bar to lower chest",
        "Squeeze shoulder blades",
        "Lower with control",
      ],
      formTips: ["Keep core braced", "Don't round lower back"],
      commonMistakes: ["Using momentum", "Standing too upright"],
      alternatives: {
        beginner: { name: "Dumbbell Rows", reason: "Easier to learn" },
        home: { name: "Inverted Rows", equipment: ["none"], reason: "Bodyweight option" },
      },
      images: [
        "https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 2,
      name: "Lat Pulldowns",
      sets: 4,
      reps: "10-12",
      rest: "75s",
      intensity: "RPE 7",
      equipment: ["cable_machine"],
      primaryMuscle: "Lats",
      secondaryMuscles: ["Biceps"],
      instructions: [
        "Grip bar wider than shoulders",
        "Pull to upper chest",
        "Control the negative",
      ],
      formTips: ["Lean slightly back", "Drive elbows down"],
      commonMistakes: ["Pulling behind neck", "Using too much momentum"],
      alternatives: {
        home: { name: "Pull-ups", equipment: ["pull_up_bar"], reason: "Bodyweight equivalent" },
      },
      images: [
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 3,
      name: "Seated Cable Rows",
      sets: 3,
      reps: "10-12",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["cable_machine"],
      primaryMuscle: "Mid Back",
      secondaryMuscles: ["Biceps", "Rear Delts"],
      instructions: [
        "Sit with feet on platform",
        "Pull handle to torso",
        "Squeeze shoulder blades together",
      ],
      formTips: ["Keep chest up", "Don't lean too far back"],
      commonMistakes: ["Rounding back", "Using momentum"],
      alternatives: {
        home: { name: "Resistance Band Rows", equipment: ["resistance_bands"], reason: "Home alternative" },
      },
      images: [
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 4,
      name: "Face Pulls",
      sets: 3,
      reps: "15-20",
      rest: "60s",
      intensity: "RPE 6",
      equipment: ["cable_machine"],
      primaryMuscle: "Rear Delts",
      secondaryMuscles: ["Upper Back"],
      instructions: [
        "Set cable at face height",
        "Pull rope to face, elbows high",
        "Externally rotate at end",
      ],
      formTips: ["Lead with elbows", "Squeeze at contraction"],
      commonMistakes: ["Going too heavy", "Not rotating"],
      alternatives: {
        home: { name: "Band Pull-Aparts", equipment: ["resistance_bands"], reason: "Similar movement" },
      },
      images: [
        "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 5,
      name: "Barbell Curls",
      sets: 3,
      reps: "10-12",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["barbell"],
      primaryMuscle: "Biceps",
      instructions: [
        "Stand with bar at thighs",
        "Curl to shoulders",
        "Lower with control",
      ],
      formTips: ["Keep elbows pinned", "Don't swing"],
      commonMistakes: ["Using momentum", "Moving elbows"],
      alternatives: {
        home: { name: "Dumbbell Curls", equipment: ["dumbbells"], reason: "More accessible" },
      },
      images: [
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 6,
      name: "Hammer Curls",
      sets: 3,
      reps: "10-12",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["dumbbells"],
      primaryMuscle: "Biceps",
      secondaryMuscles: ["Forearms"],
      instructions: [
        "Hold dumbbells with neutral grip",
        "Curl while keeping palms facing in",
        "Lower with control",
      ],
      formTips: ["Keep elbows stable", "Full range of motion"],
      commonMistakes: ["Swinging weights", "Rotating wrists"],
      alternatives: {},
      images: [
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&h=300&fit=crop",
      ],
    },
  ];
}

function getLegExercises(): WorkoutDay["mainWorkout"] {
  return [
    {
      order: 1,
      name: "Barbell Squats",
      sets: 4,
      reps: "6-8",
      rest: "120s",
      intensity: "RPE 8",
      equipment: ["barbell", "squat_rack"],
      primaryMuscle: "Quads",
      secondaryMuscles: ["Glutes", "Hamstrings", "Core"],
      instructions: [
        "Bar on upper back, feet shoulder width",
        "Descend until thighs parallel",
        "Drive through heels to stand",
      ],
      formTips: ["Knees track over toes", "Keep chest up"],
      commonMistakes: ["Knees caving in", "Rounding back"],
      alternatives: {
        beginner: { name: "Goblet Squats", reason: "Easier to learn" },
        home: { name: "Bulgarian Split Squats", equipment: ["dumbbells"], reason: "Single leg work" },
        injury_knee: { name: "Leg Press", reason: "Less knee stress" },
      },
      images: [
        "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534368786749-b63e05c92717?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 2,
      name: "Romanian Deadlifts",
      sets: 4,
      reps: "8-10",
      rest: "90s",
      intensity: "RPE 7-8",
      equipment: ["barbell"],
      primaryMuscle: "Hamstrings",
      secondaryMuscles: ["Glutes", "Lower Back"],
      instructions: [
        "Hold bar at hips, slight knee bend",
        "Hinge at hips, lowering bar",
        "Feel hamstring stretch",
        "Drive hips forward to stand",
      ],
      formTips: ["Keep bar close to body", "Flat back throughout"],
      commonMistakes: ["Rounding back", "Bending knees too much"],
      alternatives: {
        home: { name: "Single Leg RDL", equipment: ["dumbbells"], reason: "Balance challenge" },
      },
      images: [
        "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 3,
      name: "Leg Press",
      sets: 4,
      reps: "10-12",
      rest: "90s",
      intensity: "RPE 7",
      equipment: ["leg_press"],
      primaryMuscle: "Quads",
      secondaryMuscles: ["Glutes"],
      instructions: [
        "Feet shoulder width on platform",
        "Lower until knees at 90 degrees",
        "Press back to start",
      ],
      formTips: ["Don't lock knees", "Keep lower back on pad"],
      commonMistakes: ["Going too deep", "Lifting hips"],
      alternatives: {
        home: { name: "Lunges", equipment: ["dumbbells"], reason: "No machine needed" },
      },
      images: [
        "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597347316205-36f6c451902a?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 4,
      name: "Leg Curls",
      sets: 3,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["leg_curl_machine"],
      primaryMuscle: "Hamstrings",
      instructions: [
        "Lie face down on machine",
        "Curl heels toward glutes",
        "Lower with control",
      ],
      formTips: ["Don't lift hips", "Full range of motion"],
      commonMistakes: ["Using momentum", "Partial reps"],
      alternatives: {
        home: { name: "Nordic Curls", equipment: ["none"], reason: "Advanced bodyweight" },
      },
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 5,
      name: "Leg Extensions",
      sets: 3,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["leg_extension"],
      primaryMuscle: "Quads",
      instructions: [
        "Sit with back against pad",
        "Extend legs until straight",
        "Lower with control",
      ],
      formTips: ["Don't hyperextend", "Squeeze at top"],
      commonMistakes: ["Using too much weight", "Swinging"],
      alternatives: {
        home: { name: "Wall Sits", equipment: ["none"], reason: "Isometric quad work" },
        injury_knee: { name: "Terminal Knee Extensions", reason: "Gentle on knees" },
      },
      images: [
        "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1530822847156-5df684ec5ee1?w=400&h=300&fit=crop",
      ],
    },
    {
      order: 6,
      name: "Standing Calf Raises",
      sets: 4,
      reps: "12-15",
      rest: "60s",
      intensity: "RPE 7",
      equipment: ["calf_raise_machine"],
      primaryMuscle: "Calves",
      instructions: [
        "Stand on platform, heels hanging",
        "Rise onto toes",
        "Lower until stretch felt",
      ],
      formTips: ["Full range of motion", "Pause at top"],
      commonMistakes: ["Bouncing", "Partial reps"],
      alternatives: {
        home: { name: "Single Leg Calf Raises", equipment: ["none"], reason: "No equipment" },
      },
      images: [
        "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400&h=300&fit=crop",
      ],
    },
  ];
}

function getUpperExercises(): WorkoutDay["mainWorkout"] {
  return [
    ...getPushExercises().slice(0, 3),
    ...getPullExercises().slice(0, 3),
  ];
}

function getFullBodyExercises(): WorkoutDay["mainWorkout"] {
  return [
    getPushExercises()[0],
    getPullExercises()[0],
    getLegExercises()[0],
    getPushExercises()[3],
    getPullExercises()[4],
    getLegExercises()[5],
  ];
}
