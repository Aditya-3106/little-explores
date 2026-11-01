/**
 * @file number-town.js
 * @description Bilingual seed activities for Number Town (Early Mathematics).
 */

export const numberTownActivities = [
  {
    id: 'nt_01_count_apples',
    title: 'Count the Apples',
    worldId: 'number-town',
    domain: 'numeracy',
    learningObjective: 'counting',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'count-collect',
    status: 'published',
    visibility: 'public_default',
    icon: '🍎',
    locales: {
      en: {
        title: 'Collect 3 Apples',
        instruction: 'Tap and collect 3 apples into your basket! 🧺',
        hint: 'Tap one apple at a time.',
        success: 'You collected exactly 3 apples!',
        learned: 'Counting up to 3 objects and one-to-one correspondence.',
      },
      mr: {
        title: '३ सफरचंद मोजा आणि गोळा करा',
        instruction: 'टोपलीमध्ये ३ सफरचंद गोळा करा! 🧺',
        hint: 'एका वेळी एक सफरचंद टॅप करा.',
        success: 'छान! बरोबर ३ सफरचंद गोळा केले!',
        learned: '३ पर्यंत मोजणी आणि संख्या समज.',
      },
    },
    payload: {
      targetEmoji: '🍎',
      targetCount: 3,
      totalAvailable: 6,
    },
  },
  {
    id: 'nt_02_number_seq',
    title: 'Order Numbers 1 to 4',
    worldId: 'number-town',
    domain: 'numeracy',
    learningObjective: 'number_order',
    ageGroup: ['nursery', 'lkg'],
    activityType: 'number-sequence',
    status: 'published',
    visibility: 'public_default',
    icon: '🔢',
    locales: {
      en: {
        title: 'Number Order 1 to 4',
        instruction: 'Tap the numbers in order starting with 1!',
        hint: 'Count: 1, 2, 3, 4!',
        success: 'Awesome counting order!',
        learned: 'Sequential number order and recognition.',
      },
      mr: {
        title: '१ ते ४ संख्या क्रम',
        instruction: '१ पासून सुरुवात करून संख्या योग्य क्रमाने टॅप करा!',
        hint: 'मोजा: १, २, ३, ४!',
        success: 'शाब्बास! सर्व संख्या क्रमाने लावल्यात!',
        learned: 'संख्यांचा चढता क्रम समजणे.',
      },
    },
    payload: {
      numbers: [1, 2, 3, 4],
    },
  },
];

