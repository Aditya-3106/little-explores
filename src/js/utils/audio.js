/**
 * @file audio.js
 * @description Audio playback utilities with Web Speech API TTS fallback.
 * @module utils/audio
 */

let currentAudio = null;
let isMutedState = false;
let volumeLevel = 1.0;

/**
 * Play an audio source (URL or data URI).
 * @param {string} src
 * @returns {Promise<void>}
 */
export function playAudio(src) {
  if (isMutedState || !src) return Promise.resolve();

  stopAudio();

  return new Promise((resolve, reject) => {
    try {
      currentAudio = new Audio(src);
      currentAudio.volume = volumeLevel;

      currentAudio.onended = () => {
        currentAudio = null;
        resolve();
      };

      currentAudio.onerror = (e) => {
        currentAudio = null;
        resolve(); // resolve softly to not block game flows
      };

      currentAudio.play().catch(() => {
        // Autoplay policy or format error
        currentAudio = null;
        resolve();
      });
    } catch (err) {
      currentAudio = null;
      resolve();
    }
  });
}

/**
 * Stop currently playing audio and speech.
 */
export function stopAudio() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}

/**
 * Fallback Text-to-Speech using Web Speech API.
 * @param {string} text
 * @param {'en'|'mr'} [lang='en']
 * @returns {Promise<void>}
 */
export function speak(text, lang = 'en') {
  if (isMutedState || !text) return Promise.resolve();

  stopAudio();

  if (!('speechSynthesis' in window)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'mr' ? 'mr-IN' : 'en-US';
      utterance.volume = volumeLevel;
      utterance.rate = 0.9; // Slightly slower for young children

      // Try finding appropriate voice
      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find((v) => v.lang.startsWith(lang));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      resolve();
    }
  });
}

/**
 * Play instruction audio or fallback to TTS.
 * @param {Object} localeData
 * @param {'en'|'mr'} lang
 * @returns {Promise<void>}
 */
export function playInstruction(localeData, lang = 'en') {
  if (!localeData) return Promise.resolve();

  if (localeData.audio) {
    return playAudio(localeData.audio);
  } else if (localeData.instruction) {
    return speak(localeData.instruction, lang);
  }
  return Promise.resolve();
}

/**
 * Play feedback tone using Web Audio API synthesis (cheerful and gentle).
 * @param {'correct'|'hint'|'complete'|'gentle'} type
 */
export function playFeedback(type) {
  if (isMutedState) return;

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.15 * volumeLevel, now);

    if (type === 'correct') {
      // Cheerful chime: C5 -> E5 -> G5
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'hint') {
      // Gentle chime: F4 -> A4
      osc.type = 'sine';
      osc.frequency.setValueAtTime(349.23, now);
      osc.frequency.setValueAtTime(440.0, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === 'complete') {
      // Fanfare: C5 -> E5 -> G5 -> C6
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.12);
      osc.frequency.setValueAtTime(783.99, now + 0.24);
      osc.frequency.setValueAtTime(1046.5, now + 0.36);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    } else {
      // Soft gentle 'bonk': G3
      osc.type = 'sine';
      osc.frequency.setValueAtTime(196.0, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (_) {}
}

/**
 * Set master volume (0.0 to 1.0).
 * @param {number} level
 */
export function setVolume(level) {
  volumeLevel = Math.max(0, Math.min(1, level));
  if (currentAudio) currentAudio.volume = volumeLevel;
}

/**
 * Toggle mute state.
 * @returns {boolean}
 */
export function toggleMute() {
  isMutedState = !isMutedState;
  if (isMutedState) stopAudio();
  return isMutedState;
}

/**
 * Get current mute status.
 * @returns {boolean}
 */
export function isMuted() {
  return isMutedState;
}

