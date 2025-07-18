import $ from 'jquery';

function unActive() {
  $('.js-s3d__slideModule').removeClass('s3d-unActive');
}

const preloader = (function preloader() {
  const state = {
    showing: false,
    mini: false,
  };
  return {
    show() {
      state.showing = true;
    },
    hide() {
      state.showing = false;
    },
    turnOn(el) {
      if (el && el.length > 0) {
        el.addClass('s3d-unActive').prop('disabled', true);
        return;
      }
      const arr = ['.js-ctr-btn'];
      arr.forEach(name => {
        $(name)
          .addClass('s3d-unActive')
          .prop('disabled', true);
      });
    },
    turnOff(el) {
      if (el && el.length > 0) {
        el.removeClass('s3d-unActive').prop('disabled', false);
        return;
      }
      const arr = ['.js-ctr-btn'];
      arr.forEach(name => {
        $(name)
          .removeClass('s3d-unActive')
          .prop('disabled', false);
      });
    },
    miniOn() {
      state.mini = true;
      $('.js-fs-preloader-before').addClass('preloader-active');
    },
    miniOff() {
      state.mini = false;
      $('.js-fs-preloader-before').removeClass('preloader-active');
    },
    checkState() {
      return { ...state };
    },
  };
})();

function debounce(f, t) {
  return function(args) {
    const previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= t) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  };
}

function delegateHandler(tag, event) {
  return event.target.closest(tag);
}

function preloaderWithoutPercent() {
  return {
    isAnimating: false,
    show() {
      this.isAnimating = true;
      gsap.to('.fs-preloader', { display: 'flex', autoAlpha: 1 });
      // $('.js-s3d-preloader').addClass('preloader-active');
      setTimeout(() => {
        this.isAnimating = false;
      });
    },
    hide() {
      if (!this.isAnimating) {
        gsap.to('.fs-preloader', { display: 'none', autoAlpha: 0 });
        // $('.js-s3d-preloader').removeClass('preloader-active');
        return;
      }
      setTimeout(() => {
        this.hide();
      }, 500);
    },
  };
}

export { unActive, preloader, debounce, delegateHandler, preloaderWithoutPercent };
