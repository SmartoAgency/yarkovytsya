function init() {
  // eslint-disable-next-line no-undef
  const slider = new Swiper('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: document.querySelector('[data-next]'),
      prevEl: document.querySelector('[data-prev]'),
    },
    preloadImages: false,
    lazy: true,
    speed: 400,
    watchSlidesVisibility: true,
    on: {
      init: (e) => {
        document.querySelector('[data-total]').innerHTML = document.querySelectorAll('.slide').length - 2;
        document.querySelector('[data-current]').innerHTML = e.activeIndex + 1;
      },
    },
  });

  slider.on('activeIndexChange', (obj) => {
    document.querySelector('[data-current]').innerHTML = obj.realIndex + 1;
  });
}

document.addEventListener('DOMContentLoaded', init);
