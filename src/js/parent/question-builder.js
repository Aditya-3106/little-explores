/**
 * @file question-builder.js
 * @description 10-Step Question Creation Wizard for Parent Studio.
 * Allows parents to independently author custom bilingual activities using reusable interaction templates.
 * @module parent/question-builder
 */

import { createElement, onTouch } from '../utils/dom.js';
import { LEARNING_DOMAINS, AGE_GROUPS } from '../core/config.js';
import { getAllActivityTypes, getActivityType } from '../activities/activity-registry.js';
import { db } from '../storage/database.js';
import { navigateTo } from '../core/router.js';

export function renderQuestionBuilder(container, existingActivity = null) {
  let currentStep = 1;

  // Check for auto-saved draft if starting fresh
  let initialDraft = null;
  if (!existingActivity) {
    try {
      const saved = localStorage.getItem('le_draft_activity');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.draft && confirm('An unsaved activity draft was found. Would you like to resume editing it?')) {
          initialDraft = parsed.draft;
          currentStep = parsed.currentStep || 1;
        } else {
          localStorage.removeItem('le_draft_activity');
        }
      }
    } catch (_) {}
  }

  // Question draft accumulation state
  const draft = existingActivity
    ? { ...existingActivity }
    : (initialDraft || {
        id: 'act_' + Date.now(),
        ageGroup: 'nursery',
        domain: 'numeracy',
        learningObjective: 'counting',
        activityType: 'tap-select',
        title: '',
        locales: {
          en: {
            title: '',
            instruction: '',
            hint: '',
            success: 'Great job!',
          },
          mr: {
            title: '',
            instruction: '',
            hint: '',
            success: 'खूप छान!',
          },
        },
        payload: {},
        status: 'draft',
        visibility: 'family_private',
      });

  let activeEditor = null;

  // Auto-save draft every 30 seconds
  const autoSaveTimer = setInterval(() => {
    try {
      saveCurrentStepData();
      localStorage.setItem('le_draft_activity', JSON.stringify({ draft, currentStep, timestamp: Date.now() }));
      const indicator = container.querySelector('#autosave-indicator');
      if (indicator) {
        indicator.textContent = '● Draft auto-saved at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        indicator.classList.remove('opacity-0');
        setTimeout(() => indicator?.classList.add('opacity-0'), 3000);
      }
    } catch (_) {}
  }, 30000);

  function renderWizard() {
    container.innerHTML = `
      <div class="question-builder max-w-3xl mx-auto bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden my-4">
        <!-- Wizard Header & Progress Bar -->
        <div class="p-6 border-b border-gray-100 bg-gray-50/70">
          <div class="flex justify-between items-center mb-2">
            <h2 class="text-xl font-black text-gray-900">Create New Activity</h2>
            <div class="flex items-center gap-2">
              <span id="autosave-indicator" class="text-[11px] text-emerald-600 font-semibold opacity-0 transition-opacity"></span>
              <span class="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                Step ${currentStep} of 10
              </span>
            </div>
          </div>
          <!-- Progress bar track -->
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div class="bg-blue-600 h-full transition-all duration-300" style="width: ${(currentStep / 10) * 100}%"></div>
          </div>
        </div>

        <!-- Step Body -->
        <div class="p-6 md:p-8" id="wizard-step-body">
        </div>

        <!-- Navigation Footer -->
        <div class="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <button id="wb-btn-prev" class="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 text-sm min-h-[44px] ${
            currentStep === 1 ? 'opacity-40 cursor-not-allowed' : ''
          }">
            ← Back
          </button>
          <div class="flex gap-3">
            <button id="wb-btn-cancel" class="px-4 py-2.5 text-gray-500 font-bold hover:text-gray-800 text-sm min-h-[44px]">
              Cancel
            </button>
            <button id="wb-btn-next" class="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-xs min-h-[44px]">
              ${currentStep === 10 ? 'Save Activity ✨' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    `;

    const stepBody = container.querySelector('#wizard-step-body');
    renderCurrentStep(stepBody);

    // Event listeners for footer navigation
    const prevBtn = container.querySelector('#wb-btn-prev');
    const nextBtn = container.querySelector('#wb-btn-next');
    const cancelBtn = container.querySelector('#wb-btn-cancel');

    if (prevBtn && currentStep > 1) {
      onTouch(prevBtn, () => {
        saveCurrentStepData();
        currentStep--;
        renderWizard();
      });
    }

    if (nextBtn) {
      onTouch(nextBtn, async () => {
        const isValid = saveCurrentStepData();
        if (!isValid) return;

        if (currentStep === 10) {
          // Final save & publish
          clearInterval(autoSaveTimer);
          localStorage.removeItem('le_draft_activity');
          await db.questions.create(draft);
          alert('Activity saved successfully to your Family Library! 🎉');
          navigateTo('/parent/questions');
        } else {
          currentStep++;
          renderWizard();
        }
      });
    }

    if (cancelBtn) {
      onTouch(cancelBtn, () => {
        if (confirm('Discard changes and return to Parent Dashboard?')) {
          clearInterval(autoSaveTimer);
          localStorage.removeItem('le_draft_activity');
          navigateTo('/parent/dashboard');
        }
      });
    }
  }

  function saveCurrentStepData() {
    const stepBody = container.querySelector('#wizard-step-body');
    if (!stepBody) return true;

    if (currentStep === 1) {
      const selected = stepBody.querySelector('input[name="ageGroup"]:checked');
      if (selected) draft.ageGroup = selected.value;
    } else if (currentStep === 2) {
      const selected = stepBody.querySelector('input[name="domain"]:checked');
      if (selected) draft.domain = selected.value;
    } else if (currentStep === 3) {
      const objInput = stepBody.querySelector('#obj-select');
      const customInput = stepBody.querySelector('#custom-obj-input');
      if (objInput && objInput.value === 'custom' && customInput) {
        draft.learningObjective = customInput.value.trim() || 'custom_parent_objective';
      } else if (objInput) {
        draft.learningObjective = objInput.value;
      }
    } else if (currentStep === 4) {
      const selected = stepBody.querySelector('input[name="activityType"]:checked');
      if (selected) draft.activityType = selected.value;
    } else if (currentStep === 5) {
      if (activeEditor && activeEditor.getData) {
        draft.payload = activeEditor.getData();
      }
      const titleInput = stepBody.querySelector('#act-title-input');
      if (titleInput) {
        draft.title = titleInput.value.trim() || 'Untitled Activity';
        if (!draft.locales.en.title) draft.locales.en.title = draft.title;
      }
    } else if (currentStep === 6) {
      const enInst = stepBody.querySelector('#loc-en-instruction');
      const mrInst = stepBody.querySelector('#loc-mr-instruction');
      if (enInst) draft.locales.en.instruction = enInst.value.trim();
      if (mrInst) draft.locales.mr.instruction = mrInst.value.trim();
    } else if (currentStep === 7) {
      // Media uploaded already captured into draft or payloads
    } else if (currentStep === 8) {
      const hint1 = stepBody.querySelector('#hint-input');
      const success = stepBody.querySelector('#success-input');
      if (hint1) draft.locales.en.hint = hint1.value.trim();
      if (success) draft.locales.en.success = success.value.trim();
    } else if (currentStep === 10) {
      const statusSelect = stepBody.querySelector('#act-status-select');
      if (statusSelect) draft.status = statusSelect.value;
    }

    return true;
  }

  function renderCurrentStep(body) {
    if (currentStep === 1) {
      // Step 1: Learning Group
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 1: Select Learning Group</h3>
        <p class="text-sm text-gray-500 mb-6">Choose the target age group. Remember, age is a recommendation based on readiness.</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label class="p-5 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-400 transition-all ${
            draft.ageGroup === 'nursery' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
          }">
            <input type="radio" name="ageGroup" value="nursery" class="sr-only" ${draft.ageGroup === 'nursery' ? 'checked' : ''}>
            <span class="text-4xl mb-2">🌱</span>
            <span class="font-bold text-gray-900">Nursery</span>
            <span class="text-xs text-gray-500 mt-1">Approx. 3–4 Years</span>
          </label>
          <label class="p-5 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-400 transition-all ${
            draft.ageGroup === 'lkg' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
          }">
            <input type="radio" name="ageGroup" value="lkg" class="sr-only" ${draft.ageGroup === 'lkg' ? 'checked' : ''}>
            <span class="text-4xl mb-2">🌿</span>
            <span class="font-bold text-gray-900">LKG</span>
            <span class="text-xs text-gray-500 mt-1">Approx. 4–5 Years</span>
          </label>
          <label class="p-5 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-400 transition-all ${
            draft.ageGroup === 'both' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
          }">
            <input type="radio" name="ageGroup" value="both" class="sr-only" ${draft.ageGroup === 'both' ? 'checked' : ''}>
            <span class="text-4xl mb-2">🌳</span>
            <span class="font-bold text-gray-900">Both Levels</span>
            <span class="text-xs text-gray-500 mt-1">Foundational play</span>
          </label>
        </div>
      `;
    } else if (currentStep === 2) {
      // Step 2: Learning Domain
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 2: Select Learning Domain</h3>
        <p class="text-sm text-gray-500 mb-6">Select the primary developmental domain for this activity.</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          ${LEARNING_DOMAINS.map(
            (d) => `
            <label class="p-4 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-400 transition-all ${
              draft.domain === d.id ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
            }">
              <input type="radio" name="domain" value="${d.id}" class="sr-only" ${draft.domain === d.id ? 'checked' : ''}>
              <span class="text-3xl mb-1">${d.icon}</span>
              <span class="font-bold text-sm text-gray-800">${d.name.en}</span>
              <span class="text-xs text-gray-400 font-semibold">${d.name.mr}</span>
            </label>
          `
          ).join('')}
        </div>
      `;
    } else if (currentStep === 3) {
      // Step 3: Learning Objective
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 3: Select Learning Objective</h3>
        <p class="text-sm text-gray-500 mb-4">What specific foundational skill will your child practice?</p>
        <div class="space-y-4 max-w-md">
          <select id="obj-select" class="w-full p-3 border border-gray-300 rounded-xl font-medium text-gray-800">
            <option value="counting">Counting and Quantities</option>
            <option value="number_recognition">Number Recognition</option>
            <option value="letter_recognition">Letter & Alphabet Familiarity</option>
            <option value="phonics_sounds">Beginning Letter Sounds</option>
            <option value="shape_recognition">Identifying Shapes & Patterns</option>
            <option value="animal_awareness">Animals & Nature Awareness</option>
            <option value="sorting_logic">Logical Sorting and Classification</option>
            <option value="custom">Parent-defined Custom Objective...</option>
          </select>

          <div id="custom-obj-wrap" class="hidden">
            <label class="block text-xs font-bold text-gray-700 mb-1">Enter your custom objective</label>
            <input type="text" id="custom-obj-input" class="w-full p-3 border rounded-xl text-sm" placeholder="e.g., Identify yellow objects around the house">
          </div>
        </div>
      `;

      const sel = body.querySelector('#obj-select');
      const wrap = body.querySelector('#custom-obj-wrap');
      sel.addEventListener('change', () => {
        wrap.classList.toggle('hidden', sel.value !== 'custom');
      });
    } else if (currentStep === 4) {
      // Step 4: Activity Type
      const types = getAllActivityTypes();
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 4: Select Activity Type</h3>
        <p class="text-sm text-gray-500 mb-6">Choose how your child will interact. One template can be reused for any topic!</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[360px] overflow-y-auto p-1">
          ${types
            .map((t) => {
              const info = getActivityType(t);
              const isSelected = draft.activityType === t;
              return `
              <label class="p-3 border-2 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-blue-400 transition-all ${
                isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-gray-200'
              }">
                <input type="radio" name="activityType" value="${t}" class="sr-only" ${isSelected ? 'checked' : ''}>
                <span class="text-3xl mb-1">${info.icon || '🎯'}</span>
                <span class="font-bold text-xs text-gray-800">${info.name?.en || t}</span>
              </label>
            `;
            })
            .join('')}
        </div>
      `;
    } else if (currentStep === 5) {
      // Step 5: Create Question Content
      const template = getActivityType(draft.activityType);
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 5: Activity Content (${template?.name?.en || draft.activityType})</h3>
        <p class="text-sm text-gray-500 mb-4">Set up the question title and specific interactive data.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Activity Title</label>
            <input type="text" id="act-title-input" class="w-full p-3 border rounded-xl" placeholder="e.g., Find the Mango" value="${draft.title || ''}">
          </div>
          <div id="template-editor-slot" class="pt-2 border-t"></div>
        </div>
      `;

      const editorSlot = body.querySelector('#template-editor-slot');
      if (template && template.createEditor) {
        activeEditor = template.createEditor(editorSlot, draft);
      }
    } else if (currentStep === 6) {
      // Step 6: Add Languages
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 6: Bilingual Content</h3>
        <p class="text-sm text-gray-500 mb-4">Provide spoken instructions in English, Marathi, or both.</p>
        <div class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <label class="block text-sm font-bold text-gray-800 mb-1">English Instruction 🇬🇧</label>
            <input type="text" id="loc-en-instruction" class="w-full p-3 border rounded-xl" placeholder="e.g., Tap the big red apple!" value="${
              draft.locales?.en?.instruction || ''
            }">
          </div>
          <div class="p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <label class="block text-sm font-bold text-gray-800 mb-1">Marathi Instruction (मराठी) 🇮🇳</label>
            <input type="text" id="loc-mr-instruction" class="w-full p-3 border rounded-xl" placeholder="उदा., मोठे लाल सफरचंद टॅप करा!" value="${
              draft.locales?.mr?.instruction || ''
            }">
          </div>
        </div>
      `;
    } else if (currentStep === 7) {
      // Step 7: Media Uploads
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 7: Media & Audio</h3>
        <p class="text-sm text-gray-500 mb-4">Optional: Upload custom illustrations or recorded family voice instructions stored in your device storage.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-5 border-2 border-dashed border-gray-300 rounded-2xl text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-2">🖼️</span>
            <span class="text-xs font-bold text-gray-700">Upload Illustration</span>
            <span class="text-[10px] text-gray-400 mt-1">PNG, JPG, WebP up to 5MB</span>
            <input type="file" id="step-img-upload" accept="image/*" class="mt-3 text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700">
            <div id="img-preview" class="mt-2 ${draft.media?.imageUrl ? '' : 'hidden'}">
              <img src="${draft.media?.imageUrl || ''}" class="w-20 h-20 object-contain rounded-lg border border-gray-200 mt-1">
              <span class="text-[10px] text-emerald-600 font-bold block mt-1">✓ Image attached</span>
            </div>
          </div>
          <div class="p-5 border-2 border-dashed border-gray-300 rounded-2xl text-center flex flex-col items-center justify-center">
            <span class="text-3xl mb-2">🎙️</span>
            <span class="text-xs font-bold text-gray-700">Upload Voice Recording</span>
            <span class="text-[10px] text-gray-400 mt-1">MP3, WAV, OGG, WebM up to 10MB</span>
            <input type="file" id="step-audio-upload" accept="audio/*" class="mt-3 text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700">
            <div id="audio-preview" class="mt-2 ${draft.media?.audioUrl ? '' : 'hidden'}">
              <audio controls src="${draft.media?.audioUrl || ''}" class="w-48 h-8 mt-1"></audio>
              <span class="text-[10px] text-emerald-600 font-bold block mt-1">✓ Audio attached</span>
            </div>
          </div>
        </div>
      `;

      const imgInput = body.querySelector('#step-img-upload');
      const imgPreview = body.querySelector('#img-preview');
      imgInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          draft.media = draft.media || {};
          draft.media.imageUrl = reader.result;
          await db.media.save(draft.id + '_img', reader.result, file.type);
          imgPreview.classList.remove('hidden');
          const imgEl = imgPreview.querySelector('img');
          if (imgEl) imgEl.src = reader.result;
        };
        reader.readAsDataURL(file);
      });

      const audioInput = body.querySelector('#step-audio-upload');
      const audioPreview = body.querySelector('#audio-preview');
      audioInput?.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          draft.media = draft.media || {};
          draft.media.audioUrl = reader.result;
          await db.media.save(draft.id + '_audio', reader.result, file.type);
          audioPreview.classList.remove('hidden');
          const audEl = audioPreview.querySelector('audio');
          if (audEl) audEl.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    } else if (currentStep === 8) {
      // Step 8: Hints and Feedback
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 8: Hints & Encouragements</h3>
        <p class="text-sm text-gray-500 mb-4">Customize the encouraging hints Milo will give if your child needs help.</p>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">First Helpful Hint</label>
            <input type="text" id="hint-input" class="w-full p-3 border rounded-xl" placeholder="e.g., Look at the color carefully!" value="${
              draft.locales?.en?.hint || ''
            }">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Celebration Message on Success</label>
            <input type="text" id="success-input" class="w-full p-3 border rounded-xl" placeholder="e.g., Wonderful! You found it!" value="${
              draft.locales?.en?.success || 'Great job!'
            }">
          </div>
        </div>
      `;
    } else if (currentStep === 9) {
      // Step 9: Activity Preview
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 9: Child Mode Preview</h3>
        <p class="text-sm text-gray-500 mb-4">Test and play your activity exactly as your child will see it.</p>
        <div class="border-3 border-amber-300 rounded-3xl p-4 bg-amber-50/20 shadow-inner min-h-[300px]" id="preview-workspace">
        </div>
      `;

      const previewWorkspace = body.querySelector('#preview-workspace');
      const template = getActivityType(draft.activityType);
      if (template && template.render) {
        template.render(draft, previewWorkspace, { language: 'en' });
      }
    } else if (currentStep === 10) {
      // Step 10: Save and Publish
      body.innerHTML = `
        <h3 class="text-lg font-bold text-gray-900 mb-2">Step 10: Save and Publish</h3>
        <p class="text-sm text-gray-500 mb-6">Choose whether to publish directly to your family playground or save as draft.</p>
        <div class="space-y-4 max-w-md">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1">Publish Status</label>
            <select id="act-status-select" class="w-full p-3 border rounded-xl font-medium">
              <option value="published" ${draft.status === 'published' ? 'selected' : ''}>Published to My Family (Available to Play)</option>
              <option value="draft" ${draft.status === 'draft' ? 'selected' : ''}>Save as Draft (Private & Incomplete)</option>
            </select>
          </div>
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-800">
            🔒 By default, all parent-created questions are kept private to your household.
          </div>
        </div>
      `;
    }
  }

  renderWizard();
}

