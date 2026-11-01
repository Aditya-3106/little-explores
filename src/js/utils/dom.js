/**
 * @file dom.js
 * @description Safe DOM manipulation and accessibility helpers.
 * @module utils/dom
 */

/**
 * Shorthand query selector.
 * @param {string} selector
 * @param {ParentNode} [context=document]
 * @returns {Element|null}
 */
export function $(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Shorthand query selector all.
 * @param {string} selector
 * @param {ParentNode} [context=document]
 * @returns {Element[]}
 */
export function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Create a DOM element with attributes, styles, and children.
 * @param {string} tag
 * @param {Object} [attrs={}]
 * @param {Array<Node|string>} [children=[]]
 * @returns {HTMLElement}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null) continue;

    if (key === 'className' || key === 'class') {
      el.className = value;
    } else if (key === 'dataset' && typeof value === 'object') {
      Object.assign(el.dataset, value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      el.addEventListener(eventName, value);
    } else if (typeof value === 'boolean') {
      if (value) el.setAttribute(key, '');
    } else {
      el.setAttribute(key, String(value));
    }
  }

  for (const child of children) {
    if (child === null || child === undefined) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }

  return el;
}

/**
 * Clear all child elements from a container.
 * @param {HTMLElement} el
 */
export function clearElement(el) {
  if (!el) return;
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

/**
 * Safely set text content of an element without innerHTML risks.
 * @param {HTMLElement} el
 * @param {string} text
 */
export function setTextContent(el, text) {
  if (el) el.textContent = text ?? '';
}

/**
 * Show an element by removing 'hidden' class or setting display.
 * @param {HTMLElement} el
 */
export function showElement(el) {
  if (!el) return;
  el.classList.remove('hidden');
}

/**
 * Hide an element by adding 'hidden' class.
 * @param {HTMLElement} el
 */
export function hideElement(el) {
  if (!el) return;
  el.classList.add('hidden');
}

/**
 * Toggle element visibility.
 * @param {HTMLElement} el
 * @param {boolean} [force]
 */
export function toggleElement(el, force) {
  if (!el) return;
  el.classList.toggle('hidden', force !== undefined ? !force : undefined);
}

/**
 * Add CSS class(es) to an element.
 * @param {HTMLElement} el
 * @param {...string} classes
 */
export function addClass(el, ...classes) {
  if (el) el.classList.add(...classes);
}

/**
 * Remove CSS class(es) from an element.
 * @param {HTMLElement} el
 * @param {...string} classes
 */
export function removeClass(el, ...classes) {
  if (el) el.classList.remove(...classes);
}

/**
 * Toggle CSS class.
 * @param {HTMLElement} el
 * @param {string} className
 * @param {boolean} [force]
 */
export function toggleClass(el, className, force) {
  if (el) el.classList.toggle(className, force);
}

/**
 * Unified touch and click handler with 48px touch target support.
 * @param {HTMLElement} el
 * @param {Function} handler
 * @param {Object} [options={}]
 * @returns {Function} Unsubscribe function
 */
export function onTouch(el, handler, options = {}) {
  if (!el) return () => {};

  // Ensure minimum touch target size styling if not present
  if (!el.classList.contains('min-h-[48px]') && !el.classList.contains('touch-target')) {
    el.classList.add('min-h-[48px]', 'min-w-[48px]');
  }

  let touched = false;

  const touchHandler = (e) => {
    touched = true;
    if (options.preventScroll) e.preventDefault();
    handler(e);
  };

  const clickHandler = (e) => {
    if (touched) {
      touched = false;
      return;
    }
    handler(e);
  };

  el.addEventListener('touchend', touchHandler, { passive: !options.preventScroll });
  el.addEventListener('click', clickHandler);

  return () => {
    el.removeEventListener('touchend', touchHandler);
    el.removeEventListener('click', clickHandler);
  };
}

/**
 * Animate an element using CSS classes.
 * @param {HTMLElement} el
 * @param {string} animationClass
 * @returns {Promise<void>}
 */
export function animateElement(el, animationClass) {
  return new Promise((resolve) => {
    if (!el) return resolve();
    el.classList.add(animationClass);
    const onEnd = () => {
      el.classList.remove(animationClass);
      el.removeEventListener('animationend', onEnd);
      resolve();
    };
    el.addEventListener('animationend', onEnd, { once: true });
  });
}

/**
 * Scroll smoothly into view.
 * @param {HTMLElement} el
 */
export function scrollIntoView(el) {
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Announce a message to screen readers via an aria-live region.
 * @param {string} message
 * @param {'polite'|'assertive'} [mode='polite']
 */
export function announceToScreenReader(message, mode = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = createElement('div', {
      id: 'sr-announcer',
      className: 'sr-only',
      'aria-live': mode,
      'aria-atomic': 'true',
    });
    document.body.appendChild(announcer);
  } else {
    announcer.setAttribute('aria-live', mode);
  }

  announcer.textContent = '';
  // Trigger update
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

