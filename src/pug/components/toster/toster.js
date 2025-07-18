import gsap from 'gsap';
import BezierEasing from 'bezier-easing';

export default class MyToster {
  constructor(setting) {
    this.$wrap = setting.$wrap;
    this.$item = setting.$item;
    this.ease_0 = BezierEasing(0.34, 0.98, 0.43, 0.95);

    this.$body = document.querySelector('body');

    this.init();
  }

  /*  */
  createItem({ type, title, text }) {
    return `
      <div class="toast" data-toast-item="" data-toast-status="${type}">
        <div class="toast-logo-block">
          <div class="toast__logo">
            <svg width="104" height="15" viewBox="0 0 104 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.445312 15V0.449219H5.8457C7.36263 0.449219 8.5638 0.846354 9.44922 1.64062C10.3411 2.42839 10.7871 3.5026 10.7871 4.86328C10.7871 5.89844 10.5072 6.77409 9.94727 7.49023C9.39388 8.20638 8.64193 8.71094 7.69141 9.00391L10.9629 15H8.91211L5.8457 9.28711C5.80013 9.28711 5.75456 9.28711 5.70898 9.28711H2.20312V15H0.445312ZM2.20312 7.72461H5.80664C6.81576 7.72461 7.60677 7.4707 8.17969 6.96289C8.75911 6.44857 9.04883 5.7487 9.04883 4.86328C9.04883 3.97786 8.75586 3.28125 8.16992 2.77344C7.59049 2.26562 6.79622 2.01172 5.78711 2.01172H2.20312V7.72461ZM14.8594 0.449219V15H13.1016V0.449219H14.8594ZM21.8711 15L16.5 0.449219H18.3555L21.5 9.21875C21.6497 9.64844 21.8385 10.2018 22.0664 10.8789C22.2943 11.556 22.571 12.3926 22.8965 13.3887C23.2155 12.3926 23.4857 11.556 23.707 10.8789C23.9349 10.2018 24.1237 9.64844 24.2734 9.21875L27.3398 0.449219H29.1758L23.8633 15H21.8711ZM30.8164 15V0.449219H40.2793V2.01172H32.5742V6.76758H39.7129V8.33008H32.5742V13.4375H40.2793V15H30.8164ZM42.418 15V0.449219H47.8184C49.3353 0.449219 50.5365 0.846354 51.4219 1.64062C52.3138 2.42839 52.7598 3.5026 52.7598 4.86328C52.7598 5.89844 52.4798 6.77409 51.9199 7.49023C51.3665 8.20638 50.6146 8.71094 49.6641 9.00391L52.9355 15H50.8848L47.8184 9.28711C47.7728 9.28711 47.7272 9.28711 47.6816 9.28711H44.1758V15H42.418ZM44.1758 7.72461H47.7793C48.7884 7.72461 49.5794 7.4707 50.1523 6.96289C50.7318 6.44857 51.0215 5.7487 51.0215 4.86328C51.0215 3.97786 50.7285 3.28125 50.1426 2.77344C49.5632 2.26562 48.7689 2.01172 47.7598 2.01172H44.1758V7.72461ZM58.8633 15L53.4922 0.449219H55.3477L58.4922 9.21875C58.6419 9.64844 58.8307 10.2018 59.0586 10.8789C59.2865 11.556 59.5632 12.3926 59.8887 13.3887C60.2077 12.3926 60.4779 11.556 60.6992 10.8789C60.9271 10.2018 61.1159 9.64844 61.2656 9.21875L64.332 0.449219H66.168L60.8555 15H58.8633ZM69.5664 0.449219V15H67.8086V0.449219H69.5664ZM72.457 15V0.449219H74.2148V13.4375H81.2266V15H72.457ZM83.1602 15V0.449219H84.918V13.4375H91.9297V15H83.1602ZM93.8633 15V0.449219H103.326V2.01172H95.6211V6.76758H102.76V8.33008H95.6211V13.4375H103.326V15H93.8633Z" fill="#7B9D45"/>
            </svg>
          </div>
        </div>
        <div class="toast-content-block">
          <h5 class="toast__title">${title}</h5>
          <p class="toast__text">${text}</p>
        </div>
        <button class="toast__colose-btn" data-toast-colose-btn="" type="button">
          <svg class="icon--close" role="presentation">
            <use xlink:href="#icon-close"></use>
          </svg>
        </button>
      </div>
    `;
  }

  removeItem(item) {
    gsap.fromTo(
      item,
      0.25,
      { xPercent: 0, ease: this.ease_0 },
      {
        xPercent: 100,
        onComplete: () => {
          item.remove();
        },
      },
    );
  }

  addToast(settingObj) {
    const markup = this.createItem(settingObj);
    this.$wrap.insertAdjacentHTML('beforeend', markup);
    /*  */
    const items = this.$wrap.querySelectorAll('[data-toast-item]');
    const item = items[items.length - 1];
    /*  */
    gsap.fromTo(
      item,
      0.75,
      { xPercent: 100, skewX: -10 },
      { xPercent: 0, skewX: 0, ease: this.ease_0 },
    );

    setTimeout(() => {
      this.removeItem(item);
    }, 3000);
  }

  listeners() {
    const self = this;
    this.$wrap.addEventListener('click', ({ target }) => {
      if (target.closest('[data-toast-colose-btn]') !== null) {
        const item = target.closest('[data-toast-item]');
        self.removeItem(item);
      }
    });
  }

  init() {
    this.listeners();
  }
}
