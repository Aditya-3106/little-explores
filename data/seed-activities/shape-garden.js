/**
 * @file shape-garden.js
 * @description Bilingual seed activities for Shape Garden (Shapes & Patterns).
 */

export const shapeGardenActivities = [
  {
    id: 'sg_01_complete_pattern',
    title: 'Complete the Flower Pattern',
    worldId: 'shape-garden',
    domain: 'spatial',
    learningObjective: 'patterns',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'patterns',
    status: 'published',
    visibility: 'public_default',
    icon: '🌸',
    locales: {
      en: {
        title: 'Complete the Pattern',
        instruction: 'Look at the colored shapes. What comes next?',
        hint: 'Yellow, Green, Yellow, Green... what is next?',
        success: 'Brilliant pattern completion!',
        learned: 'Recognising AB repeating sequences.',
      },
      mr: {
        title: 'नमुना पूर्ण करा',
        instruction: 'रंगीत आकारांचा नमुना पहा. पुढे कोणता आकार येईल?',
        hint: 'पिवळा, हिरवा, पिवळा, हिरवा... पुढे काय?',
        success: 'छान! नमुना बरोबर पूर्ण केला!',
        learned: 'आकारांचा पुनरावृत्ती नमुना ओळखणे.',
      },
    },
    payload: {
      sequence: ['🟡', '🟢', '🟡', '🟢', '?'],
      options: ['🟡', '🟢', '🔴'],
      correctIndex: 0,
    },
  },
  {
    id: 'sg_02_find_circle',
    title: 'Find the Circular Object',
    worldId: 'shape-garden',
    domain: 'spatial',
    learningObjective: 'shapes',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'tap-select',
    status: 'published',
    visibility: 'public_default',
    icon: '⚪',
    locales: {
      en: {
        title: 'Find the Round Circle',
        instruction: 'Which object has a round circular shape? 🟡',
        hint: 'Look for something that rolls smoothly with no corners!',
        success: 'Super! The sun and ball are round circles!',
        learned: 'Identifying round 2D circular shapes.',
      },
      mr: {
        title: 'गोल आकार ओळखा',
        instruction: 'कोणती वस्तू गोल वर्तुळाकार आहे? 🟡',
        hint: 'ज्याला कोपरे नसतात आणि गरगर फिरते ती वस्तू शोधा!',
        success: 'बरोबर! चेंडू आणि सूर्य गोल आहेत!',
        learned: 'गोल आकार ओळखणे.',
      },
    },
    payload: {
      options: [
        { id: 'o1', label: 'Sun / Ball', icon: '⚽', correct: true },
        { id: 'o2', label: 'Book', icon: '📖', correct: false },
        { id: 'o3', label: 'Triangle / Party Hat', icon: '📐', correct: false },
      ],
    },
  },
];

