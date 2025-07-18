function menuOpen(menu) {
  menu.classList.add('menu__active');
  const createAnimation = (links, translateY = 0, delay = 0) => {
    links.forEach((link, i) => {
      // eslint-disable-next-line no-undef
      gsap.from(link, {
        delay: delay + i / 10,
        y: translateY,
        opacity: 0,
      });
    });
  };

  const links1 = menu.querySelectorAll('[data-animation1]');
  const links2 = menu.querySelectorAll('[data-animation2]');
  const links3 = menu.querySelectorAll('[data-animation3]');
  createAnimation(links1, 100, 0.5);
  createAnimation(links2, 100, 0.8);
  createAnimation(links3, 100, 1.1);
}

function menuClose(menu) {
  menu.classList.remove('menu__active');
}

function menuInit() {
  const menu = document.querySelector('[data-menu]');
  document.querySelector('[data-open-menu]').addEventListener('click', () => menuOpen(menu));
  document.querySelector('[data-close-menu]').addEventListener('click', () => menuClose(menu));
}

function init() {
  const unSelectHandler = (container) => {
    const elem = container.querySelector('.select-items');
    if (!elem.classList.contains('select-hide')) {
      container.classList.remove('select-arrow-active');
      elem.classList.add('select-hide');
    }
    window.removeEventListener('click', unSelectHandler);
  };
  const selectHandler = (event) => {
    event.stopPropagation();
    const container = event.target.closest('[data-lang]');
    container.classList.add('select-arrow-active');
    container.querySelector('.select-items').classList.remove('select-hide');
    window.addEventListener('click', unSelectHandler.bind(null, container));
  };
  document.querySelector('[data-lang="mobile"]').addEventListener('click', selectHandler);
  document.querySelector('[data-lang="desktop"]').addEventListener('click', selectHandler);

  menuInit();
}

window.addEventListener('DOMContentLoaded', init);
