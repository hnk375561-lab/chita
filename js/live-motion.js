/* CHITA AUTOMOTORES · live motion system
 * The active demo page is intentionally static-first: all motion is additive,
 * transform/clip-path based, and removed cleanly when reduced motion is requested.
 */
(function (window, document) {
  'use strict';

  function init(options) {
    var g = window.gsap;
    var ST = window.ScrollTrigger;
    if (!g || !ST || !options || !options.layers || !options.layers.length) return;

    g.registerPlugin(ST);
    var reduce = !!options.reduceMotion;
    var mm = g.matchMedia();
    var cleanups = [];
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    if (reduce) {
      // Keep the page fully visible and interactive with no registered animation.
      g.set(options.layers, { clearProps: 'all' });
      return;
    }

    function on(target, type, handler, opts) {
      target.addEventListener(type, handler, opts);
      cleanups.push(function () { target.removeEventListener(type, handler, opts); });
    }

    function magnetic(selector) {
      if (!fine.matches) return;
      document.querySelectorAll(selector).forEach(function (el) {
        var moveX = g.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
        var moveY = g.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
        on(el, 'pointermove', function (event) {
          var box = el.getBoundingClientRect();
          moveX((event.clientX - box.left - box.width / 2) * 0.08);
          moveY((event.clientY - box.top - box.height / 2) * 0.1);
        });
        on(el, 'pointerleave', function () { moveX(0); moveY(0); });
      });
    }

    function bindStageDepth() {
      if (!fine.matches) return;
      var stage = document.querySelector('.stage');
      var image = document.querySelector('#si');
      if (!stage || !image) return;
      var x = g.quickTo(image, 'xPercent', { duration: 0.7, ease: 'power3.out' });
      var y = g.quickTo(image, 'yPercent', { duration: 0.7, ease: 'power3.out' });
      on(stage, 'pointermove', function (event) {
        var box = stage.getBoundingClientRect();
        x(((event.clientX - box.left) / box.width - 0.5) * 2.2);
        y(((event.clientY - box.top) / box.height - 0.5) * 1.4);
      });
      on(stage, 'pointerleave', function () { x(0); y(0); });
    }

    // Hero entrance: a single editorial sequence establishes hierarchy before scroll.
    g.timeline({ defaults: { ease: 'expo.out' }, delay: 0.08 })
      .fromTo('#lay', { scale: 1.06 }, { scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
      .fromTo('.tag', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.28)
      .fromTo('#hn', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.75 }, 0.4)
      .fromTo('.ro', { y: 22, clipPath: 'inset(100% 0% 0% 0%)' }, { y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 }, 0.52)
      .fromTo('.cta', { y: 12 }, { y: 0, duration: 0.7 }, 0.68);

    mm.add('(min-width: 761px)', function () {
      var heroTimeline = g.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '#open',
          start: 'top top',
          end: '+=' + Math.max(260, (options.heroSteps - 1) * 115) + '%',
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            var step = Math.min(options.heroSteps - 1, Math.round(self.progress * (options.heroSteps - 1)));
            if (typeof options.onHeroStep === 'function') options.onHeroStep(step);
          }
        }
      });
      options.layers.forEach(function (layer, index) {
        var image = layer.firstElementChild;
        if (index) {
          g.set(layer, { clipPath: 'polygon(125% 0, 150% 0, 150% 100%, 100% 100%)' });
          heroTimeline.to(layer, { clipPath: 'polygon(-25% 0, 150% 0, 150% 100%, -50% 100%)', duration: 0.72, ease: 'power2.inOut' }, index - 1 + 0.28);
          heroTimeline.fromTo(image, { scale: 1.24 }, { scale: 1, duration: 1, ease: 'power2.out' }, index - 1 + 0.28);
        } else {
          heroTimeline.to(image, { scale: 1.16, duration: 1 }, 0);
        }
      });
      heroTimeline.to('#big', { xPercent: -27, duration: Math.max(1, options.heroSteps - 1) }, 0);
      heroTimeline.to('.tag', { yPercent: -40, opacity: 0.15, duration: 0.45 }, 0.2);
      return function () { heroTimeline.scrollTrigger && heroTimeline.scrollTrigger.kill(); heroTimeline.kill(); };
    });

    mm.add('(max-width: 760px)', function () {
      var mobileParallax = g.to('#lay', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: { trigger: '#open', start: 'top top', end: 'bottom top', scrub: 0.55 }
      });
      g.fromTo('#big', { xPercent: 0 }, {
        xPercent: -13,
        ease: 'none',
        scrollTrigger: { trigger: '#open', start: 'top top', end: 'bottom top', scrub: 0.55 }
      });
      return function () { mobileParallax.scrollTrigger && mobileParallax.scrollTrigger.kill(); mobileParallax.kill(); };
    });

    // Section transitions: the diagonal identity continues through the tape and footer.
    g.fromTo('#tp', { xPercent: 0 }, {
      xPercent: -35,
      ease: 'none',
      scrollTrigger: { trigger: '.tape', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    g.fromTo('#fin', { xPercent: 12, scale: 0.92 }, {
      xPercent: -4, scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: '#end', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 }
    });
    g.fromTo('#end h2', { yPercent: 18 }, {
      yPercent: 0,
      ease: 'none',
      scrollTrigger: { trigger: '#end', start: 'top bottom', end: 'top 30%', scrub: 0.55 }
    });

    magnetic('.cta, nav a');
    bindStageDepth();

    window.addEventListener('resize', function () { ST.refresh(); }, { passive: true });
    cleanups.push(function () { mm.revert(); });
    window.addEventListener('beforeunload', function () {
      cleanups.forEach(function (cleanup) { cleanup(); });
    }, { once: true });
  }

  window.ChitaMotion = { init: init };
})(window, document);
