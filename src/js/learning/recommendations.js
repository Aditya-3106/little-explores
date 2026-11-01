/**
 * @file recommendations.js
 * @description Suggestions for offline exploration and balanced screen-time activities.
 * @module learning/recommendations
 */

export const OFFLINE_ACTIVITIES = [
  {
    domain: 'numeracy',
    en: 'Count 5 spoons or bowls together in your kitchen!',
    mr: 'स्वयंपाकघरात ५ वाट्या किंवा चमचे एकत्र मोजा!',
  },
  {
    domain: 'spatial',
    en: 'Find 3 round/circular objects in your living room.',
    mr: 'घरात ३ गोल वस्तू शोधून काढा.',
  },
  {
    domain: 'nature',
    en: 'Go outside or to the window and count the birds you see.',
    mr: 'खिडकीबाहेर किंवा बागेत जाऊन पक्षी शोधा आणि त्यांचे रंग पाहा.',
  },
  {
    domain: 'literacy',
    en: 'Find 3 objects at home that start with the letter or sound "M".',
    mr: 'घरात ‘क’ किंवा ‘म’ ने सुरू होणाऱ्या ३ वस्तू शोधा.',
  },
  {
    domain: 'social',
    en: 'Share your favorite toy with a sibling or family member today!',
    mr: 'आज तुमचे आवडते खेळणे भाऊ किंवा बहिणीसोबत वाटून खेळा!',
  },
  {
    domain: 'cognitive',
    en: 'Sort your clothes or socks by color into separate piles.',
    mr: 'रंगानुसार कपडे किंवा मोजे वेगवेगळ्या ढिगाऱ्यात वेगळे करा.',
  },
];

/**
 * Get an offline activity suggestion based on current domain or random.
 * @param {string} [domain]
 * @param {'en'|'mr'} [lang='en']
 * @returns {string}
 */
export function getOfflineRecommendation(domain, lang = 'en') {
  const match = OFFLINE_ACTIVITIES.find((a) => a.domain === domain);
  const picked = match || OFFLINE_ACTIVITIES[Math.floor(Math.random() * OFFLINE_ACTIVITIES.length)];
  return picked[lang] || picked.en;
}

