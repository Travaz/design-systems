/* Apis motion presets for Motion (motion.dev). Plain objects and small helpers, no dependency:
   use them as props with motion/react, or as keyframes and options with animate() from "motion".
   Every number comes from apis-motion-tokens.js, which the build generates from tokens.json.
   The rules behind them are in the brand book, section "Motion". */
import { duration, ease, value } from './apis-motion-tokens.js';

/** A staggered sequence has at most 5 steps; everything after the fifth arrives with it. */
export const MAX_STEPS = 5;
export const staggerDelay = (index) => Math.min(index, MAX_STEPS - 1) * duration.stagger;

/** Leaving costs less than entering: about 70% of the entry duration, on ease-exit. */
export const exitTransition = (entry) => ({ duration: +(entry * 0.7).toFixed(3), ease: ease.exit });

/** Springs settle, they never bounce. For gestures and for state that can be interrupted. */
export const spring = { type: 'spring', visualDuration: duration.slow, bounce: 0 };
export const springFast = { type: 'spring', visualDuration: duration.base, bounce: 0 };

/** One transition per pattern of the brand book table. */
export const transitions = {
  feedback: { duration: duration.fast, ease: ease.standard }, // hover, press, focus
  state: { duration: duration.base, ease: ease.standard }, // toggles, tabs, small expansions
  overlay: { duration: duration.slow, ease: ease.standard }, // menus, dialogs, drawers
  reveal: { duration: duration.reveal, ease: ease.standard }, // content blocks reaching the screen
  moment: { duration: duration.reveal, ease: ease.emphasis }, // the one orchestrated moment of a page
};

/* ---------- motion/react props: <motion.button {...press}> ---------- */

/** Buttons, choice cards, tappable rows. */
export const press = { whileTap: { scale: value.pressScale }, transition: transitions.feedback };

/** Popovers, cards, selection marks: from enter-scale and transparent, never from scale 0. */
export const enter = {
  initial: { opacity: 0, scale: value.enterScale },
  animate: { opacity: 1, scale: 1, transition: transitions.state },
  exit: { opacity: 0, scale: value.enterScale, transition: exitTransition(duration.base) },
};

/** Menus, dialogs, drawers. Set transform-origin to the control that opened it. */
export const overlay = {
  initial: { opacity: 0, scale: value.enterScale },
  animate: { opacity: 1, scale: 1, transition: transitions.overlay },
  exit: { opacity: 0, scale: value.enterScale, transition: exitTransition(duration.slow) },
};

/** A content block that rises into place once, when it reaches the screen. */
export const reveal = {
  initial: { opacity: 0, y: value.rise },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: transitions.reveal,
};

/** A screen sequence (title, text, controls) in reading order. Give each child custom={index}. */
export const sequence = {
  parent: { initial: 'hidden', animate: 'shown' },
  child: {
    variants: {
      hidden: { opacity: 0, y: value.rise },
      shown: (index = 0) => ({ opacity: 1, y: 0, transition: { ...transitions.reveal, delay: staggerDelay(index) } }),
    },
  },
};

/** A value that changes in place (a number, a label, an image): crossfade with a light blur on what leaves.
    Wrap it in <AnimatePresence mode="popLayout"> and key it by the value. */
export const swap = {
  initial: { opacity: 0 },
  animate: { opacity: 1, filter: 'blur(0px)', transition: transitions.state },
  exit: { opacity: 0, filter: `blur(${value.blur}px)`, transition: exitTransition(duration.base) },
};

/** Indicators that move between positions (the selected tab bar): layout animation on a spring. */
export const indicator = { layout: true, transition: spring };

/* ---------- vanilla Motion: pass in the functions you import from "motion" ---------- */

export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Reveal blocks on scroll with animate() and inView() from "motion".
    Content stays visible without JavaScript: blocks are hidden only once this runs.
    With reduced motion they simply fade in. Returns a function that stops observing. */
export function revealOnScroll({ animate, inView }, selector = '[data-reveal]', root = document) {
  const reduce = prefersReducedMotion();
  const blocks = [...root.querySelectorAll(selector)];
  blocks.forEach((el) => { el.style.opacity = '0'; });
  return inView(blocks, (el) => {
    const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => blocks.includes(c)) : [el];
    const keyframes = reduce ? { opacity: [0, 1] } : { opacity: [0, 1], y: [value.rise, 0] };
    animate(el, keyframes, { ...transitions.reveal, delay: staggerDelay(siblings.indexOf(el)) });
  }, { amount: 0.2 });
}

/** Press feedback on buttons and tappable rows with press() from "motion". */
export function pressFeedback({ animate, press: onPress }, selector = 'button, [data-press]') {
  if (prefersReducedMotion()) return () => {};
  return onPress(selector, (el) => {
    animate(el, { scale: value.pressScale }, transitions.feedback);
    return () => animate(el, { scale: 1 }, transitions.feedback);
  });
}
