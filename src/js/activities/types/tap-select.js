/**
 * @module TapSelect
 * @description ACT-01: Tap and Select activity type.
 * Shows multiple image/text options; the child taps the correct one.
 * Supports 2–6 options in a responsive grid.
 * @version 1.0.0
 */

/** Localized UI strings */
const STRINGS = {
  en: {
    instruction: 'Tap the correct answer!',
    correct: ['Great job! 🌟', 'You got it! ⭐', 'Amazing! 🎉', 'Wonderful! 🥳'],
    incorrect: ['Almost! Try again! 💪', 'Not quite, keep trying! 🌈', 'You can do it! 😊'],
    editorTitle: 'Tap and Select Settings',
    addOption: 'Add Option',
    removeOption: 'Remove',
    optionLabel: 'Option',
    optionImage: 'Image/Emoji',
    markCorrect: 'Correct Answer',
    minOptions: 'Add at least 2 options',
    maxOptions: 'Maximum 6 options allowed',
    needCorrect: 'Mark at least one correct answer'
  },
  mr: {
    instruction: 'बरोबर उत्तर टॅप करा!',
    correct: ['छान! 🌟', 'बरोबर! ⭐', 'अप्रतिम! 🎉', 'वा! 🥳'],
    incorrect: ['जवळपास! पुन्हा प्रयत्न करा! 💪', 'आणखी एकदा प्रयत्न करा! 🌈', 'तुम्ही करू शकता! 😊'],
    editorTitle: 'टॅप आणि निवडा सेटिंग्ज',
    addOption: 'पर्याय जोडा',
    removeOption: 'काढा',
    optionLabel: 'पर्याय',
    optionImage: 'चित्र/इमोजी',
    markCorrect: 'बरोबर उत्तर',
    minOptions: 'किमान 2 पर्याय जोडा',
    maxOptions: 'जास्तीत जास्त 6 पर्याय',
    needCorrect: 'किमान एक बरोबर उत्तर निवडा'
  }
};

/**
 * Pick a random element from an array.
 * @param {Array} arr
 * @returns {*}
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** @type {import('../activity-registry.js').ActivityTypeConfig} */
const TapSelect = {
  type: 'tap-select',
  version: 1,
  name: { en: 'Tap and Select', mr: 'टॅप करा आणि निवडा' },
  description: {
    en: 'Child taps the correct answer from multiple options',
    mr: 'मुल अनेक पर्यायांमधून बरोबर उत्तर टॅप करते'
  },
  icon: '👆',
  ageGroups: ['nursery', 'lkg', 'ukg'],
  domains: ['language', 'math', 'science', 'social', 'art', 'logic'],

  /**
   * Create the editor form for Parent Studio question builder.
   * @param {HTMLElement} container - Editor container
   * @param {Object} [existingData] - Existing activity data for editing
   * @returns {{ getData: Function, validate: Function, destroy: Function }}
   */
  createEditor(container, existingData = null) {
    const lang = document.documentElement.lang || 'en';
    const s = STRINGS[lang] || STRINGS.en;
    const options = existingData?.payload?.options
      ? [...existingData.payload.options]
      : [
          { id: 'opt1', label: { en: '', mr: '' }, image: '', correct: false },
          { id: 'opt2', label: { en: '', mr: '' }, image: '', correct: false }
        ];

    const wrapper = document.createElement('div');
    wrapper.className = 'space-y-4';

    function renderEditor() {
      wrapper.innerHTML = '';

      // Title
      const title = document.createElement('h3');
      title.className = 'text-lg font-bold text-purple-700';
      title.textContent = s.editorTitle;
      wrapper.appendChild(title);

      // Options list
      const optList = document.createElement('div');
      optList.className = 'space-y-3';

      options.forEach((opt, idx) => {
        const row = document.createElement('div');
        row.className = 'flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border';

        // Option number
        const num = document.createElement('span');
        num.className = 'font-bold text-gray-500 w-8';
        num.textContent = `${idx + 1}.`;
        row.appendChild(num);

        // Label input (English)
        const labelEn = document.createElement('input');
        labelEn.type = 'text';
        labelEn.placeholder = `${s.optionLabel} (English)`;
        labelEn.value = opt.label?.en || '';
        labelEn.className = 'flex-1 min-w-[120px] p-2 border rounded-lg text-sm';
        labelEn.setAttribute('data-idx', idx);
        labelEn.setAttribute('data-field', 'label-en');
        labelEn.addEventListener('input', (e) => {
          if (!options[idx].label) options[idx].label = { en: '', mr: '' };
          options[idx].label.en = e.target.value;
        });
        row.appendChild(labelEn);

        // Label input (Marathi)
        const labelMr = document.createElement('input');
        labelMr.type = 'text';
        labelMr.placeholder = `${s.optionLabel} (मराठी)`;
        labelMr.value = opt.label?.mr || '';
        labelMr.className = 'flex-1 min-w-[120px] p-2 border rounded-lg text-sm';
        labelMr.addEventListener('input', (e) => {
          if (!options[idx].label) options[idx].label = { en: '', mr: '' };
          options[idx].label.mr = e.target.value;
        });
        row.appendChild(labelMr);

        // Image/emoji input
        const imgInput = document.createElement('input');
        imgInput.type = 'text';
        imgInput.placeholder = s.optionImage;
        imgInput.value = opt.image || '';
        imgInput.className = 'w-24 p-2 border rounded-lg text-sm text-center';
        imgInput.addEventListener('input', (e) => {
          options[idx].image = e.target.value;
        });
        row.appendChild(imgInput);

        // Correct checkbox
        const checkLabel = document.createElement('label');
        checkLabel.className = 'flex items-center gap-1 cursor-pointer text-sm';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!opt.correct;
        checkbox.className = 'w-5 h-5 accent-green-500';
        checkbox.addEventListener('change', (e) => {
          options[idx].correct = e.target.checked;
        });
        checkLabel.appendChild(checkbox);
        checkLabel.appendChild(document.createTextNode(s.markCorrect));
        row.appendChild(checkLabel);

        // Remove button (only if > 2 options)
        if (options.length > 2) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'p-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-bold min-w-[48px] min-h-[48px]';
          removeBtn.textContent = '✕';
          removeBtn.setAttribute('aria-label', s.removeOption);
          removeBtn.addEventListener('click', () => {
            options.splice(idx, 1);
            renderEditor();
          });
          row.appendChild(removeBtn);
        }

        optList.appendChild(row);
      });

      wrapper.appendChild(optList);

      // Add option button
      if (options.length < 6) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'w-full p-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-bold hover:bg-purple-50 transition min-h-[48px]';
        addBtn.textContent = `+ ${s.addOption}`;
        addBtn.addEventListener('click', () => {
          options.push({
            id: `opt${Date.now()}`,
            label: { en: '', mr: '' },
            image: '',
            correct: false
          });
          renderEditor();
        });
        wrapper.appendChild(addBtn);
      }
    }

    renderEditor();
    container.appendChild(wrapper);

    return {
      getData() {
        return {
          options: options.map((opt, idx) => ({
            id: opt.id || `opt${idx}`,
            label: opt.label || { en: '', mr: '' },
            image: opt.image || '',
            correct: !!opt.correct
          }))
        };
      },

      validate() {
        const errors = [];
        if (options.length < 2) errors.push(s.minOptions);
        if (options.length > 6) errors.push(s.maxOptions);
        if (!options.some(o => o.correct)) errors.push(s.needCorrect);
        return { valid: errors.length === 0, errors };
      },

      destroy() {
        wrapper.remove();
      }
    };
  },

  /**
   * Validate activity payload.
   * @param {Object} activity - The activity object
   * @returns {{ valid: boolean, errors: string[] }}
   */
  validate(activity) {
    const errors = [];
    const payload = activity?.payload;

    if (!payload) {
      return { valid: false, errors: ['Missing payload'] };
    }

    if (!Array.isArray(payload.options)) {
      errors.push('payload.options must be an array');
      return { valid: false, errors };
    }

    if (payload.options.length < 2) errors.push('Minimum 2 options required');
    if (payload.options.length > 6) errors.push('Maximum 6 options allowed');

    let hasCorrect = false;
    payload.options.forEach((opt, i) => {
      if (!opt.id) errors.push(`Option ${i + 1} missing "id"`);
      if (!opt.label && !opt.image) errors.push(`Option ${i + 1} must have a label or image`);
      if (opt.correct) hasCorrect = true;
    });

    if (!hasCorrect) errors.push('At least one option must be marked correct');

    return { valid: errors.length === 0, errors };
  },

  /**
   * Render the activity for a child to play.
   * @param {Object} activity - The activity data
   * @param {HTMLElement} container - The DOM container
   * @param {Object} options - Render options { lang, onSubmit, onHint }
   * @returns {{ onSubmit: Function, onHint: Function, destroy: Function }}
   */
  render(activity, container, options = {}) {
    const lang = options.lang || 'en';
    const s = STRINGS[lang] || STRINGS.en;
    const payload = activity.payload;
    const locales = activity.locales?.[lang] || {};
    let selectedId = null;
    let submitted = false;
    const callbacks = { onSubmit: options.onSubmit || null, onHint: options.onHint || null };

    // Build UI
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col items-center gap-6 p-4 w-full max-w-lg mx-auto';

    // Instruction
    const instruction = document.createElement('p');
    instruction.className = 'text-xl font-bold text-center text-gray-700';
    instruction.textContent = locales.instruction || locales.question || s.instruction;
    wrapper.appendChild(instruction);

    // Question image (if provided)
    if (activity.payload.questionImage) {
      const qImg = document.createElement('div');
      qImg.className = 'text-6xl text-center';
      qImg.textContent = activity.payload.questionImage;
      wrapper.appendChild(qImg);
    }

    // Options grid
    const colCount = payload.options.length <= 2 ? 2 : payload.options.length <= 4 ? 2 : 3;
    const grid = document.createElement('div');
    grid.className = `grid grid-cols-${colCount} gap-3 w-full`;
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-label', 'Answer options');

    const optionEls = [];

    payload.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flex flex-col items-center justify-center gap-2 p-4 bg-white border-3 border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[80px] min-w-[80px] active:scale-95 select-none';
      btn.setAttribute('data-option-id', opt.id);
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', 'false');

      // Image/emoji
      if (opt.image) {
        const img = document.createElement('span');
        img.className = 'text-4xl leading-none';
        if (opt.image.startsWith('http') || opt.image.startsWith('/') || opt.image.startsWith('data:')) {
          const imgEl = document.createElement('img');
          imgEl.src = opt.image;
          imgEl.alt = opt.label?.[lang] || '';
          imgEl.className = 'w-16 h-16 object-contain';
          img.innerHTML = '';
          img.appendChild(imgEl);
        } else {
          img.textContent = opt.image;
        }
        btn.appendChild(img);
      }

      // Label
      if (opt.label) {
        const lbl = document.createElement('span');
        lbl.className = 'text-base font-semibold text-gray-700 text-center';
        lbl.textContent = typeof opt.label === 'object' ? (opt.label[lang] || opt.label.en || '') : opt.label;
        btn.appendChild(lbl);
      }

      // Click handler
      btn.addEventListener('click', () => {
        if (submitted) return;

        // Deselect previous
        optionEls.forEach(el => {
          el.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-300');
          el.classList.add('border-gray-200');
          el.setAttribute('aria-selected', 'false');
        });

        // Select this
        selectedId = opt.id;
        btn.classList.remove('border-gray-200');
        btn.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-300');
        btn.setAttribute('aria-selected', 'true');

        // Auto-submit on tap for young children
        handleSubmit();
      });

      optionEls.push(btn);
      grid.appendChild(btn);
    });

    wrapper.appendChild(grid);

    // Feedback area
    const feedbackArea = document.createElement('div');
    feedbackArea.className = 'text-center text-lg font-bold min-h-[2rem] transition-all duration-300';
    feedbackArea.setAttribute('role', 'status');
    feedbackArea.setAttribute('aria-live', 'polite');
    wrapper.appendChild(feedbackArea);

    container.appendChild(wrapper);

    function handleSubmit() {
      if (!selectedId || submitted) return;
      submitted = true;

      const response = { selectedId };

      // Visual feedback
      const correctOpt = payload.options.find(o => o.correct);
      const isCorrect = payload.options.find(o => o.id === selectedId)?.correct;

      optionEls.forEach(el => {
        const id = el.getAttribute('data-option-id');
        el.style.pointerEvents = 'none';

        if (id === selectedId && isCorrect) {
          el.classList.remove('border-blue-500', 'bg-blue-50');
          el.classList.add('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-300');
          el.classList.add('animate-bounce');
        } else if (id === selectedId && !isCorrect) {
          el.classList.remove('border-blue-500', 'bg-blue-50');
          el.classList.add('border-red-300', 'bg-red-50');
        }

        if (id === correctOpt?.id && !isCorrect) {
          // Highlight correct answer gently after a delay
          setTimeout(() => {
            el.classList.add('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-300');
          }, 800);
        }
      });

      // Show feedback text
      if (isCorrect) {
        feedbackArea.textContent = randomPick(s.correct);
        feedbackArea.className = 'text-center text-xl font-bold text-green-600 min-h-[2rem] animate-bounce';
      } else {
        feedbackArea.textContent = randomPick(s.incorrect);
        feedbackArea.className = 'text-center text-lg font-bold text-orange-500 min-h-[2rem]';

        // Allow retry after delay
        setTimeout(() => {
          submitted = false;
          selectedId = null;
          optionEls.forEach(el => {
            el.style.pointerEvents = '';
            el.classList.remove('border-red-300', 'bg-red-50', 'border-green-500', 'bg-green-50',
              'ring-2', 'ring-green-300', 'ring-blue-300', 'border-blue-500', 'bg-blue-50', 'animate-bounce');
            el.classList.add('border-gray-200');
            el.setAttribute('aria-selected', 'false');
          });
          feedbackArea.textContent = '';
          feedbackArea.className = 'text-center text-lg font-bold min-h-[2rem] transition-all duration-300';
        }, 2000);
      }

      if (callbacks.onSubmit) {
        callbacks.onSubmit(response);
      }
    }

    return {
      onSubmit(cb) { callbacks.onSubmit = cb; },
      onHint(cb) { callbacks.onHint = cb; },
      destroy() {
        wrapper.remove();
      }
    };
  },

  /**
   * Evaluate child's response.
   * @param {Object} activity - The activity data
   * @param {Object} response - { selectedId: string }
   * @returns {{ correct: boolean, score: number, details: Object }}
   */
  evaluate(activity, response) {
    const payload = activity.payload;
    const selected = payload.options.find(o => o.id === response.selectedId);
    const isCorrect = selected?.correct === true;

    return {
      correct: isCorrect,
      score: isCorrect ? 1 : 0,
      details: {
        selectedId: response.selectedId,
        correctId: payload.options.find(o => o.correct)?.id,
        selectedLabel: selected?.label || null
      }
    };
  },

  /**
   * Get child-friendly feedback.
   * @param {Object} activity - The activity data
   * @param {Object} response - Evaluation result with response
   * @param {string} lang - Language code
   * @returns {{ message: string, type: string, audio: null }}
   */
  getFeedback(activity, response, lang = 'en') {
    const s = STRINGS[lang] || STRINGS.en;

    if (response.correct) {
      return {
        message: randomPick(s.correct),
        type: 'success',
        audio: null
      };
    }

    return {
      message: randomPick(s.incorrect),
      type: 'encouragement',
      audio: null
    };
  }
};

export default TapSelect;
