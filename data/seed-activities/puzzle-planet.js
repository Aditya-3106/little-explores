/**
 * @file puzzle-planet.js
 * @description Bilingual seed activities for Puzzle Planet (Logical Thinking).
 */

export const puzzlePlanetActivities = [
  {
    id: 'pp_01_memory_match',
    title: 'Animal Memory Match',
    worldId: 'puzzle-planet',
    domain: 'cognitive',
    learningObjective: 'memory',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'memory-match',
    status: 'published',
    visibility: 'public_default',
    icon: '🃏',
    locales: {
      en: {
        title: 'Memory Match',
        instruction: 'Flip the cards to find matching animal pairs!',
        hint: 'Remember what animal was on the card you turned!',
        success: 'Brilliant memory! You found all matches!',
        learned: 'Short-term visual memory and focus.',
      },
      mr: {
        title: 'स्मृती जुळवणी खेळ',
        instruction: 'कार्ड्स उलटे करा आणि प्राण्यांच्या जोड्या शोधा!',
        hint: 'तुम्ही कोणते कार्ड उलटे केले होते ते लक्षात ठेवा!',
        success: 'छान स्मृती! सर्व जोड्या सापडल्या!',
        learned: 'दृश्य स्मृती आणि एकाग्रता.',
      },
    },
    payload: {
      cards: ['🐶', '🐱', '🐰'],
    },
  },
  {
    id: 'pp_02_find_diff',
    title: 'Find the Difference',
    worldId: 'puzzle-planet',
    domain: 'cognitive',
    learningObjective: 'differences',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'find-difference',
    status: 'published',
    visibility: 'public_default',
    icon: '🔍',
    locales: {
      en: {
        title: 'Spot 2 Differences',
        instruction: 'Compare Picture A and Picture B. Tap the differences in Picture B!',
        hint: 'Look closely at the flower and the sky!',
        success: 'Great observation skills!',
        learned: 'Fine visual discrimination and attention to detail.',
      },
      mr: {
        title: '२ फरक ओळखा',
        instruction: 'चित्र ‘अ’ आणि ‘ब’ ची तुलना करा. ‘ब’ मधील फरक टॅप करा!',
        hint: 'फूल आणि आकाशाकडे नीट पहा!',
        success: 'उत्तम निरीक्षण! सर्व फरक सापडले!',
        learned: 'बारीक गोष्टींचे निरीक्षण करणे.',
      },
    },
    payload: {
      differencesCount: 2,
    },
  },
];

