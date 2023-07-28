console.clear();

$(document).ready(function () {
  gsap.config({
    autoSleep: 60,
    force3D: true,
    trialWarn: false,
    autoKillThreshold: 1,
    units: { left: "%", top: "%", rotation: "rad" }
  });

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.config({
    ignoreMobileResize: true
  });

  ScrollTrigger.refresh();

  const $section = $("#vertical_scroll_with_cards");

  if (!$section.length) return;

  init();

  function init() {
    initAnimation();
  }

  function initAnimation() {
    const $verticalTextItems = $section.find(".text-items .item");
    const $cards = $section.find(".cards-block .card");
    const $hidedCards = $section.find(".cards-block .card.hided");

    const timelineText = gsap.timeline({});

    const ANIMATION_CONFIG = {
      scrollTriggerEnd: "+=300%",
      cards: {
        xPercentDiff: 80,
        yPercentDiff: 60
      }
    };

    const textScrollTrigger = ScrollTrigger.create({
      animation: timelineText,
      trigger: $section,
      start: "top top",
      end: ANIMATION_CONFIG.scrollTriggerEnd,
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 0.5,
        duration: 0.5,
        ease: "power1.inOut"
      },
      onUpdate: function (self) {
        const progress = +self.progress.toFixed(3);

        if (progress > 0 && progress < 0.25) {
          $(
            ".vertical-scroll-section-wrapper .navigation-item.active"
          ).removeClass("active");
          $(
            ".vertical-scroll-section-wrapper .navigation-item:nth-child(1)"
          ).addClass("active");
        }

        if (
          (progress > 0.25 && progress < 0.5) ||
          (progress > 0.5 && progress < 0.75)
        ) {
          $(
            ".vertical-scroll-section-wrapper .navigation-item.active"
          ).removeClass("active");
          $(
            ".vertical-scroll-section-wrapper .navigation-item:nth-child(2)"
          ).addClass("active");
        }

        if (progress > 0.75 && progress < 1) {
          $(
            ".vertical-scroll-section-wrapper .navigation-item.active"
          ).removeClass("active");
          $(
            ".vertical-scroll-section-wrapper .navigation-item:nth-child(3)"
          ).addClass("active");
        }
      }
    });

    $(".vertical-scroll-section-wrapper").on(
      "click",
      ".navigation-item",
      function () {
        if ($(this).hasClass("active")) return;

        const progressTarget = +$(this).data("progress");
        const scrollValue =
          textScrollTrigger.start +
          progressTarget * (textScrollTrigger.end - textScrollTrigger.start);

        TweenMax.to($(window), 1.5, {
          scrollTo: {
            y: scrollValue,
            autoKill: true
          }
        });
      }
    );

    const timelineCardsMovement = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top",
        end: ANIMATION_CONFIG.scrollTriggerEnd,
        invalidateOnRefresh: true,
        scrub: true
      }
    });

    const timelineForManipulateCards = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top",
        end: ANIMATION_CONFIG.scrollTriggerEnd,
        invalidateOnRefresh: true,
        scrub: true
      }
    });

    const timelineForHidedCardsMovement = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top",
        end: ANIMATION_CONFIG.scrollTriggerEnd,
        invalidateOnRefresh: true,
        scrub: true
      }
    });

    const timelineForHidedCards = gsap.timeline({
      scrollTrigger: {
        trigger: $section,
        start: "top top",
        end: ANIMATION_CONFIG.scrollTriggerEnd,
        invalidateOnRefresh: true,
        scrub: true
      }
    });

    $verticalTextItems.each((index, item) => {
      gsap.set(item, {
        yPercent: index === 0 ? 0 : 100,
        opacity: index === 0 ? 1 : 0
      });

      if ($verticalTextItems[index + 1]) {
        timelineText
          .to(
            item,
            {
              yPercent: -100,
              opacity: 0
            },
            "+=0.5"
          )
          .to(
            $verticalTextItems[index + 1],
            {
              yPercent: 0,
              opacity: 1
            },
            "<"
          );
      }
    });

    $cards.each((index, item) => {
      gsap.set(item, {
        xPercent: index * 20 - ANIMATION_CONFIG.cards.xPercentDiff,
        yPercent: index * -12 - ANIMATION_CONFIG.cards.yPercentDiff,
        opacity: $(item).hasClass("hided") ? 0 : 1,
        scale: index * -0.1 + 1,
        zIndex: index * -1 + 3
      });

      if ($(item).hasClass("hided")) return;

      timelineCardsMovement.to(
        item,
        {
          xPercent: (index - 1) * 20 - ANIMATION_CONFIG.cards.xPercentDiff,
          yPercent: (index - 1) * -12 - ANIMATION_CONFIG.cards.yPercentDiff,
          scale: 1
        },
        0
      );

      timelineForManipulateCards.to(
        item,
        {
          opacity: index !== 2 ? 0 : 1
        },
        index !== 1 ? 0 : "+=60%"
      );
    });

    $hidedCards.each((index, item) => {
      gsap.set(item, {
        xPercent: (index + 3) * 20 - ANIMATION_CONFIG.cards.xPercentDiff,
        yPercent: (index + 3) * -12 - ANIMATION_CONFIG.cards.yPercentDiff,
        scale: (index + 3) * -0.1 + 1
      });

      timelineForHidedCardsMovement
        .to(
          item,
          {
            xPercent: (index + 2) * 20 - ANIMATION_CONFIG.cards.xPercentDiff,
            yPercent: (index + 2) * -12 - ANIMATION_CONFIG.cards.yPercentDiff
          },
          0
        )
        .to(
          item,
          {
            scale: (index + 1) * -0.1 + 1
          },
          0
        );

      timelineForHidedCards.to(
        item,
        {
          opacity: 1
        },
        "+=100%"
      );
    });
  }
});