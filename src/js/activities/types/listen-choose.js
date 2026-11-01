/**
 * @module ListenChoose
 * @description ACT-02: Listen and Choose activity type.
 * Plays an audio instruction, child selects the matching image/option.
 * @version 1.0.0
 */

const STRINGS = {
  en: {
    instruction: 'Listen and choose the right answer!',
    playAgain: 'Listen Again 🔊',
    correct: ['You listened so well! 🌟', 'Perfect ears! 👂⭐', 'That\'s right! 🎉'],
    incorrect: ['Listen again and try! 🔊💪', 'Try one more time! 🌈', 'Listen carefully! 👂😊'],
    editorTitle: 'Listen and Choose Settings',
    audioLabel: 'Audio Instruction URL',
    addOption: 'Add Option',
    removeOption: 'Remove',
    optionLabel: 'Option',
    optionImage: 'Image/Emoji',
    markCorrect: 'Correct',
    minOptions: 'Add at least 2 options',
    needCorrect: 'Mark at least one correct answer'
  },
  mr: {
    instruction: 'ऐका आणि बरोबर उत्तर निवडा!',
    playAgain: 'पुन्हा ऐका 🔊',
    correct: ['छान ऐकलंत! 🌟', 'अगदी बरोबर! 👂⭐', 'शाब्बास! 🎉'],
    incorrect: ['पुन्हा ऐका आणि प्रयत्न करा! 🔊💪', 'आणखी एकदा प्रयत्न करा! 🌈', 'नीट ऐका! 👂😊'],
    editorTitle: 'ऐका आणि निवडा सेटिंग्ज',
    audioLabel: 'ऑडिओ सूचना URL',
    addOption: 'पर्याय जोडा',
    removeOption: 'काढा',
    optionLabel: 'पर्याय',
    optionImage: 'चित्र/इमोजी',
    markCorrect: 'बरोबर',
    minOptions: 'किमान 2 पर्याय जोडा',
    needCorrect: 'किमान एक बरोबर उत्तर निवडा'
  }
};

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** @type {import('../activity-registry.js').ActivityTypeConfig} */
const ListenChoose = {
  type: 'listen-choose',
  version: 1,
  name: { en: 'Listen and Choose', mr: 'ऐका आणि निवडा' },
  description: {
    en: 'Child listens to audio and selects the matching answer',
    mr: 'मूल ऑडिओ ऐकते आणि जुळणारे उत्तर निवडते'
  },
  icon: '👂',
  ageGroups: ['nursery', 'lkg', 'ukg'],
  domains: ['language', 'math', 'science', 'social'],

  createEditor(container, existingData = null) {
    const lang = document.documentElement.lang || 'en';
    const s = STRINGS[lang] || STRINGS.en;

    let audioUrl = existingData?.payload?.audioInstruction || '';
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

      const title = document.createElement('h3');
      title.className = 'text-lg font-bold text-purple-700';
      title.textContent = s.editorTitle;
      wrapper.appendChild(title);

      // Audio URL input
      const audioGroup = document.createElement('div');
      audioGroup.className = 'space-y-1';
      const audioLabel = document.createElement('label');
      audioLabel.className = 'text-sm font-semibold text-gray-600';
      audioLabel.textContent = s.audioLabel;
      const audioInput = document.createElement('input');
      audioInput.type = 'text';
      audioInput.value = audioUrl;
      audioInput.className = 'w-full p-2 border rounded-lg';
      audioInput.placeholder = 'https://... or leave empty for TTS';
      audioInput.addEventListener('input', (e) => { audioUrl = e.target.value; });
      audioGroup.appendChild(audioLabel);
      audioGroup.appendChild(audioInput);
      wrapper.appendChild(audioGroup);

      // Options list
      const optList = document.createElement('div');
      optList.className = 'space-y-3';

      options.forEach((opt, idx) => {
        const row = document.createElement('div');
        row.className = 'flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-xl border';

        const num = document.createElement('span');
        num.className = 'font-bold text-gray-500 w-6';
        num.textContent = `${idx + 1}.`;
        row.appendChild(num);

        const labelEn = document.createElement('input');
        labelEn.type = 'text';
        labelEn.placeholder = `${s.optionLabel} (EN)`;
        labelEn.value = opt.label?.en || '';
        labelEn.className = 'flex-1 min-w-[100px] p-2 border rounded-lg text-sm';
        labelEn.addEventListener('input', (e) => {
          if (!options[idx].label) options[idx].label = { en: '', mr: '' };
          options[idx].label.en = e.target.value;
        });
        row.appendChild(labelEn);

        const labelMr = document.createElement('input');
        labelMr.type = 'text';
        labelMr.placeholder = `${s.optionLabel} (MR)`;
        labelMr.value = opt.label?.mr || '';
        labelMr.className = 'flex-1 min-w-[100px] p-2 border rounded-lg text-sm';
        labelMr.addEventListener('input', (e) => {
          if (!options[idx].label) options[idx].label = { en: '', mr: '' };
          options[idx].label.mr = e.target.value;
        });
        row.appendChild(labelMr);

        const imgInput = document.createElement('input');
        imgInput.type = 'text';
        imgInput.placeholder = s.optionImage;
        imgInput.value = opt.image || '';
        imgInput.className = 'w-20 p-2 border rounded-lg text-sm text-center';
        imgInput.addEventListener('input', (e) => { options[idx].image = e.target.value; });
        row.appendChild(imgInput);

        const checkLabel = document.createElement('label');
        checkLabel.className = 'flex items-center gap-1 text-sm cursor-pointer';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!opt.correct;
        checkbox.className = 'w-5 h-5 accent-green-500';
        checkbox.addEventListener('change', (e) => { options[idx].correct = e.target.checked; });
        checkLabel.appendChild(checkbox);
        checkLabel.appendChild(document.createTextNode(s.markCorrect));
        row.appendChild(checkLabel);

        if (options.length > 2) {
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'p-2 text-red-500 hover:bg-red-50 rounded-lg min-w-[48px] min-h-[48px]';
          removeBtn.textContent = '✕';
          removeBtn.addEventListener('click', () => { options.splice(idx, 1); renderEditor(); });
          row.appendChild(removeBtn);
        }

        optList.appendChild(row);
      });

      wrapper.appendChild(optList);

      if (options.length < 6) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'w-full p-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-bold hover:bg-purple-50 min-h-[48px]';
        addBtn.textContent = `+ ${s.addOption}`;
        addBtn.addEventListener('click', () => {
          options.push({ id: `opt${Date.now()}`, label: { en: '', mr: '' }, image: '', correct: false });
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
          audioInstruction: audioUrl,
          options: options.map((opt, i) => ({
            id: opt.id || `opt${i}`,
            label: opt.label || { en: '', mr: '' },
            image: opt.image || '',
            correct: !!opt.correct
          }))
        };
      },
      validate() {
        const errors = [];
        if (options.length < 2) errors.push(s.minOptions);
        if (!options.some(o => o.correct)) errors.push(s.needCorrect);
        return { valid: errors.length === 0, errors };
      },
      destroy() { wrapper.remove(); }
    };
  },

  validate(activity) {
    const errors = [];
    const payload = activity?.payload;
    if (!payload) return { valid: false, errors: ['Missing payload'] };
    if (!Array.isArray(payload.options)) {
      errors.push('payload.options must be an array');
      return { valid: false, errors };
    }
    if (payload.options.length < 2) errors.push('Minimum 2 options required');
    if (payload.options.length > 6) errors.push('Maximum 6 options allowed');
    let hasCorrect = false;
    payload.options.forEach((opt, i) => {
      if (!opt.id) errors.push(`Option ${i + 1} missing "id"`);
      if (!opt.label && !opt.image) errors.push(`Option ${i + 1} needs a label or image`);
      if (opt.correct) hasCorrect = true;
    });
    if (!hasCorrect) errors.push('At least one option must be correct');
    return { valid: errors.length === 0, errors };
  },

  render(activity, container, options = {}) {
    const lang = options.lang || 'en';
    const s = STRINGS[lang] || STRINGS.en;
    const payload = activity.payload;
    const locales = activity.locales?.[lang] || {};
    let selectedId = null;
    let submitted = false;
    let audio = null;
    const callbacks = { onSubmit: options.onSubmit || null, onHint: options.onHint || null };

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col items-center gap-6 p-4 w-full max-w-lg mx-auto';

    // Instruction
    const instruction = document.createElement('p');
    instruction.className = 'text-xl font-bold text-center text-gray-700';
    instruction.textContent = locales.instruction || s.instruction;
    wrapper.appendChild(instruction);

    // Audio play button
    const audioBtn = document.createElement('button');
    audioBtn.type = 'button';
    audioBtn.className = 'flex items-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-full text-lg font-bold shadow-lg hover:bg-blue-600 active:scale-95 transition min-h-[56px]';
    audioBtn.innerHTML = `<span class="text-2xl">🔊</span> ${s.playAgain}`;
    audioBtn.addEventListener('click', () => {
      playAudio();
    });
    wrapper.appendChild(audioBtn);

    function playAudio() {
      if (payload.audioInstruction) {
        if (audio) { audio.pause(); audio.currentTime = 0; }
        audio = new Audio(payload.audioInstruction);
        audio.play().catch(() => {});
      } else if ('speechSynthesis' in window) {
        // TTS fallback
        const text = locales.audioText || locales.instruction || s.instruction;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-US';
        utterance.rate = 0.8;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }

      // Animate button
      audioBtn.classList.add('animate-pulse');
      setTimeout(() => audioBtn.classList.remove('animate-pulse'), 1500);
    }

    // Options grid
    const colCount = payload.options.length <= 2 ? 2 : payload.options.length <= 4 ? 2 : 3;
    const grid = document.createElement('div');
    grid.className = `grid grid-cols-${colCount} gap-3 w-full`;

    const optionEls = [];

    payload.options.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flex flex-col items-center justify-center gap-2 p-4 bg-white border-3 border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 min-h-[80px] min-w-[80px] active:scale-95';
      btn.setAttribute('data-option-id', opt.id);

      if (opt.image) {
        const img = document.createElement('span');
        img.className = 'text-4xl leading-none';
        if (opt.image.startsWith('http') || opt.image.startsWith('/') || opt.image.startsWith('data:')) {
          const imgEl = document.createElement('img');
          imgEl.src = opt.image;
          imgEl.alt = opt.label?.[lang] || '';
          imgEl.className = 'w-16 h-16 object-contain';
          img.appendChild(imgEl);
        } else {
          img.textContent = opt.image;
        }
        btn.appendChild(img);
      }

      if (opt.label) {
        const lbl = document.createElement('span');
        lbl.className = 'text-base font-semibold text-gray-700 text-center';
        lbl.textContent = typeof opt.label === 'object' ? (opt.label[lang] || opt.label.en || '') : opt.label;
        btn.appendChild(lbl);
      }

      btn.addEventListener('click', () => {
        if (submitted) return;

        optionEls.forEach(el => {
          el.classList.remove('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-300');
          el.classList.add('border-gray-200');
        });

        selectedId = opt.id;
        btn.classList.remove('border-gray-200');
        btn.classList.add('border-blue-500', 'bg-blue-50', 'ring-2', 'ring-blue-300');

        handleSubmit();
      });

      optionEls.push(btn);
      grid.appendChild(btn);
    });

    wrapper.appendChild(grid);

    // Feedback area
    const feedbackArea = document.createElement('div');
    feedbackArea.className = 'text-center text-lg font-bold min-h-[2rem]';
    feedbackArea.setAttribute('role', 'status');
    feedbackArea.setAttribute('aria-live', 'polite');
    wrapper.appendChild(feedbackArea);

    container.appendChild(wrapper);

    // Auto-play audio on start
    setTimeout(() => playAudio(), 500);

    function handleSubmit() {
      if (!selectedId || submitted) return;
      submitted = true;

      const response = { selectedId };
      const correctOpt = payload.options.find(o => o.correct);
      const isCorrect = payload.options.find(o => o.id === selectedId)?.correct;

      optionEls.forEach(el => {
        const id = el.getAttribute('data-option-id');
        el.style.pointerEvents = 'none';

        if (id === selectedId && isCorrect) {
          el.classList.remove('border-blue-500', 'bg-blue-50');
          el.classList.add('border-green-500', 'bg-green-50', 'ring-green-300', 'animate-bounce');
        } else if (id === selectedId && !isCorrect) {
          el.classList.remove('border-blue-500', 'bg-blue-50');
          el.classList.add('border-red-300', 'bg-red-50');
        }

        if (id === correctOpt?.id && !isCorrect) {
          setTimeout(() => {
            el.classList.add('border-green-500', 'bg-green-50', 'ring-2', 'ring-green-300');
          }, 800);
        }
      });

      if (isCorrect) {
        feedbackArea.textContent = randomPick(s.correct);
        feedbackArea.className = 'text-center text-xl font-bold text-green-600 min-h-[2rem] animate-bounce';
      } else {
        feedbackArea.textContent = randomPick(s.incorrect);
        feedbackArea.className = 'text-center text-lg font-bold text-orange-500 min-h-[2rem]';

        setTimeout(() => {
          submitted = false;
          selectedId = null;
          optionEls.forEach(el => {
            el.style.pointerEvents = '';
            el.classList.remove('border-red-300', 'bg-red-50', 'border-green-500', 'bg-green-50',
              'ring-2', 'ring-green-300', 'ring-blue-300', 'border-blue-500', 'bg-blue-50', 'animate-bounce');
            el.classList.add('border-gray-200');
          });
          feedbackArea.textContent = '';
          feedbackArea.className = 'text-center text-lg font-bold min-h-[2rem]';
        }, 2000);
      }

      if (callbacks.onSubmit) callbacks.onSubmit(response);
    }

    return {
      onSubmit(cb) { callbacks.onSubmit = cb; },
      onHint(cb) { callbacks.onHint = cb; },
      destroy() {
        if (audio) { audio.pause(); audio = null; }
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        wrapper.remove();
      }
    };
  },

  evaluate(activity, response) {
    const payload = activity.payload;
    const selected = payload.options.find(o => o.id === response.selectedId);
    const isCorrect = selected?.correct === true;
    return {
      correct: isCorrect,
      score: isCorrect ? 1 : 0,
      details: {
        selectedId: response.selectedId,
        correctId: payload.options.find(o => o.correct)?.id
      }
    };
  },

  getFeedback(activity, response, lang = 'en') {
    const s = STRINGS[lang] || STRINGS.en;
    if (response.correct) {
      return { message: randomPick(s.correct), type: 'success', audio: null };
    }
    return { message: randomPick(s.incorrect), type: 'encouragement', audio: null };
  }
};

export default ListenChoose;
