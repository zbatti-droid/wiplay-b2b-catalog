'use client';
import {useEffect, useRef} from 'react';
import {usePathname} from 'next/navigation';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {heroEntrance} from '@/lib/motion';
gsap.registerPlugin(ScrollTrigger);
export function MotionPage({children}: {children: React.ReactNode}) {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const hero = element.querySelector('[data-hero]');
        if (hero) heroEntrance({badge: hero.querySelector('[data-hero-badge]'), heading: hero.querySelector('[data-hero-title]'), body: hero.querySelector('[data-hero-copy]'), ctas: hero.querySelector('[data-hero-actions]')});
        element.querySelectorAll('[data-motion="fade"], [data-motion="image"]').forEach(node => {
          gsap.from(node, {y: 24, opacity: 0, duration: .65, ease: 'power2.out', scrollTrigger: {trigger: node, start: 'top 94%', once: true}});
        });
        element.querySelectorAll('[data-motion="stagger"]').forEach(node => {
          gsap.from(node.children, {y: 20, opacity: 0, duration: .6, stagger: .07, scrollTrigger: {trigger: node, start: 'top 94%', once: true}});
        });
        if (window.matchMedia('(min-width: 900px)').matches) element.querySelectorAll('[data-parallax]').forEach(node => {
          gsap.to(node, {yPercent: 8, ease: 'none', scrollTrigger: {trigger: node.parentElement, start: 'top top', end: 'bottom top', scrub: .8}});
        });
      }, element);
      return () => context.revert();
    });
    return () => media.revert();
  }, [pathname]);
  return <div ref={root}>{children}</div>;
}
