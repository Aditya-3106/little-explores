/**
 * @file achievements.js
 * @description Sticker and star badges for celebratory encouragement.
 * @module child/achievements
 */

export const BADGES = [
  { id: 'first_step', icon: '🌟', title: { en: 'First Activity', mr: 'पहिली सुरुवात' }, desc: { en: 'Completed your first activity!', mr: 'पहिला उपक्रम पूर्ण केला!' } },
  { id: 'world_traveler', icon: '🌍', title: { en: 'World Traveler', mr: 'जग भ्रमंती' }, desc: { en: 'Explored learning worlds', mr: 'शिकण्याची जगते शोधली' } },
  { id: 'math_star', icon: '🔢', title: { en: 'Number Champion', mr: 'अंक विजेता' }, desc: { en: 'Counted numbers and solved math', mr: 'संख्या मोजल्या आणि कोडी सोडवली' } },
  { id: 'word_wizard', icon: '🔤', title: { en: 'Letter Explorer', mr: 'अक्षर शोधक' }, desc: { en: 'Discovered sounds and letters', mr: 'अक्षरे आणि ध्वनी ओळखले' } },
  { id: 'puzzle_pro', icon: '🧩', title: { en: 'Puzzle Master', mr: 'कोडे उस्ताद' }, desc: { en: 'Solved thinking challenges', mr: 'विचारपूर्वक कोडी सोडवली' } },
  { id: 'nature_friend', icon: '🐾', title: { en: 'Nature Friend', mr: 'निसर्ग मित्र' }, desc: { en: 'Learned about animals and plants', mr: 'प्राणी आणि वनस्पतींबद्दल शिकलात' } },
];

/**
 * Render badges grid.
 * @param {HTMLElement} container
 * @param {string[]} unlockedBadgeIds
 * @param {'en'|'mr'} [lang='en']
 */
export function renderBadges(container, unlockedBadgeIds = ['first_step'], lang = 'en') {
  container.innerHTML = `
    <div class="achievements-wrap max-w-2xl mx-auto p-4">
      <h3 class="text-2xl font-black text-amber-950 mb-6 text-center">Your Shiny Badges 🏆</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
        ${BADGES.map((b) => {
          const isUnlocked = unlockedBadgeIds.includes(b.id);
          return `
            <div class="p-4 rounded-3xl border-3 flex flex-col items-center text-center transition-all ${
              isUnlocked
                ? 'bg-amber-50 border-amber-300 shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-40 grayscale'
            }">
              <div class="text-5xl mb-2">${b.icon}</div>
              <h4 class="font-bold text-gray-800 text-sm mb-1">${b.title[lang] || b.title.en}</h4>
              <p class="text-xs text-gray-500">${b.desc[lang] || b.desc.en}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

