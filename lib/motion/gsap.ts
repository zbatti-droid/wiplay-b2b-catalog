import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* Register plugin once */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Shared defaults ── */
const EASE_OUT  = "power3.out";
const EASE_EXPO = "expo.out";

/* ─────────────────────────────────────────────
   fadeUp  —  element fades up into view
   ───────────────────────────────────────────── */
export function fadeUp(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    delay?: number;
    duration?: number;
    y?: number;
    start?: string;
  } = {}
) {
  const { trigger, delay = 0, duration = 0.85, y = 40, start = "top 88%" } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: (trigger as Element) ?? (target as Element),
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   staggerCards  —  grid of cards animate in
   ───────────────────────────────────────────── */
export function staggerCards(
  targets: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    stagger?: number;
    y?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  const {
    trigger,
    stagger = 0.1,
    y = 36,
    duration = 0.75,
    start = "top 85%",
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: (trigger as Element) ?? undefined,
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   imageReveal  —  clip-path wipe left→right
   ───────────────────────────────────────────── */
export function imageReveal(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    duration?: number;
    start?: string;
  } = {}
) {
  const { trigger, duration = 1.1, start = "top 80%" } = options;

  return gsap.fromTo(
    target,
    { clipPath: "inset(0 100% 0 0)", opacity: 0.6 },
    {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      duration,
      ease: EASE_EXPO,
      scrollTrigger: {
        trigger: (trigger as Element) ?? (target as Element),
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   slideInLeft  —  slides in from left
   ───────────────────────────────────────────── */
export function slideInLeft(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    delay?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  const { trigger, delay = 0, duration = 0.9, start = "top 85%" } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, x: -50 },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: (trigger as Element) ?? (target as Element),
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   slideInRight  —  slides in from right
   ───────────────────────────────────────────── */
export function slideInRight(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    delay?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  const { trigger, delay = 0, duration = 0.9, start = "top 85%" } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, x: 50 },
    {
      opacity: 1,
      x: 0,
      duration,
      delay,
      ease: EASE_OUT,
      scrollTrigger: {
        trigger: (trigger as Element) ?? (target as Element),
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   counterUp  —  animates a number from 0 to end
   ───────────────────────────────────────────── */
export function counterUp(
  el: HTMLElement,
  end: number,
  options: {
    trigger?: Element;
    duration?: number;
    suffix?: string;
    prefix?: string;
  } = {}
) {
  const { trigger, duration = 1.8, suffix = "", prefix = "" } = options;
  const obj = { val: 0 };

  return gsap.to(obj, {
    val: end,
    duration,
    ease: "power2.out",
    scrollTrigger: {
      trigger: trigger ?? el,
      start: "top 85%",
      once: true,
    },
    onUpdate() {
      el.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
    },
  });
}

/* ─────────────────────────────────────────────
   scaleIn  —  scale from 0.88 to 1
   ───────────────────────────────────────────── */
export function scaleIn(
  target: gsap.TweenTarget,
  options: {
    trigger?: Element | string;
    delay?: number;
    duration?: number;
    start?: string;
  } = {}
) {
  const { trigger, delay = 0, duration = 0.8, start = "top 85%" } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, scale: 0.88 },
    {
      opacity: 1,
      scale: 1,
      duration,
      delay,
      ease: "back.out(1.4)",
      scrollTrigger: {
        trigger: (trigger as Element) ?? (target as Element),
        start,
        once: true,
      },
    }
  );
}

/* ─────────────────────────────────────────────
   heroEntrance  —  multi-element sequence
   ───────────────────────────────────────────── */
export function heroEntrance(targets: {
  badge?: Element | null;
  heading?: Element | null;
  body?: Element | null;
  ctas?: Element | null;
}) {
  const tl = gsap.timeline({ defaults: { ease: EASE_OUT } });

  if (targets.badge) {
    tl.fromTo(targets.badge,   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
  }
  if (targets.heading) {
    tl.fromTo(targets.heading, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.85 }, "-=0.3");
  }
  if (targets.body) {
    tl.fromTo(targets.body,    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.75 }, "-=0.5");
  }
  if (targets.ctas) {
    tl.fromTo(targets.ctas,    { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7  }, "-=0.45");
  }

  return tl;
}

/* ─────────────────────────────────────────────
   Kill all ScrollTriggers (cleanup)
   ───────────────────────────────────────────── */
export function killScrollTriggers() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
}

