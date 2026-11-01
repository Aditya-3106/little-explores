/**
 * @file letter-land.js
 * @description Bilingual seed activities for Letter Land (Language & Literacy).
 */

export const letterLandActivities = [
  {
    id: 'll_01_apple',
    title: 'Find the Letter A',
    worldId: 'letter-land',
    domain: 'literacy',
    learningObjective: 'alphabet',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'tap-select',
    status: 'published',
    visibility: 'public_default',
    icon: '🍎',
    locales: {
      en: {
        title: 'Find the Letter A',
        instruction: 'Tap the letter that Apple starts with! 🍎',
        hint: 'Look for the first letter of the alphabet!',
        success: 'Wonderful! A is for Apple!',
        learned: 'Recognising the letter A and its initial sound.',
      },
      mr: {
        title: '‘अ’ अक्षर शोधा',
        instruction: '‘अननस’ कशाने सुरू होतो? ‘अ’ अक्षर टॅप करा! 🍍',
        hint: 'मुळाक्षरांमधील पहिले अक्षर शोधा!',
        success: 'छान! ‘अ’ अननसाचा!',
        learned: '‘अ’ हे स्वर अक्षर ओळखणे.',
      },
    },
    payload: {
      options: [
        { id: 'o1', label: 'A (अ)', icon: '🅰️', correct: true },
        { id: 'o2', label: 'B (ब)', icon: '🅱️', correct: false },
        { id: 'o3', label: 'C (क)', icon: '🅲', correct: false },
      ],
    },
  },
  {
    id: 'll_02_match_pairs',
    title: 'Match Letters to Pictures',
    worldId: 'letter-land',
    domain: 'literacy',
    learningObjective: 'word_picture',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'matching-pairs',
    status: 'published',
    visibility: 'public_default',
    icon: '🔤',
    locales: {
      en: {
        title: 'Match Letters to Pictures',
        instruction: 'Tap a letter, then tap the picture that starts with it!',
        hint: 'A is for Apple, B is for Ball!',
        success: 'Super matching!',
        learned: 'Associating letters with real-world objects.',
      },
      mr: {
        title: 'अक्षरे आणि चित्रे जुळवा',
        instruction: 'अक्षर निवडा आणि संबंधित चित्र टॅप करा!',
        hint: '‘अ’ अननस, ‘क’ कमळ!',
        success: 'सर्व जोड्या बरोबर जुळल्यात!',
        learned: 'अक्षर आणि चित्रांची सांगड घालणे.',
      },
    },
    payload: {
      pairs: [
        { id: 'p1', left: '🅰️', leftText: 'A (अ)', right: '🍎', rightText: 'Apple' },
        { id: 'p2', left: '🅱️', leftText: 'B (ब)', right: '⚽', rightText: 'Ball' },
        { id: 'p3', left: '🅲', leftText: 'C (क)', right: '🐱', rightText: 'Cat' },
      ],
    },
  },
  {
    id: 'll_03_trace_a',
    title: 'Trace the Letter A',
    worldId: 'letter-land',
    domain: 'literacy',
    learningObjective: 'alphabet',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'trace-draw',
    status: 'published',
    visibility: 'public_default',
    icon: '✏️',
    locales: {
      en: {
        title: 'Trace Letter A',
        instruction: 'Use your finger or mouse to trace the letter A!',
        hint: 'Start from the top and trace down!',
        success: 'Great writing practice!',
        learned: 'Fine motor control and letter letterform memory.',
      },
      mr: {
        title: '‘A’ अक्षर गिरवा',
        instruction: 'बोटाने किंवा माउसने ‘A’ अक्षर गिरवा!',
        hint: 'वरपासून सुरुवात करा!',
        success: 'सुंदर गिरवले!',
        learned: 'अक्षराचा आकार समजून घेणे.',
      },
    },
    payload: {
      guideText: 'A',
    },
  },
];

