import $ from 'jquery';
import gsap, { Power1, TimelineMax } from 'gsap';
import EventEmitter from '../eventEmitter/EventEmitter';
import { delegateHandler } from '../general/General';
import get from 'lodash/get';

class FilterView extends EventEmitter {
  constructor(model, elements) {
    super();
    this._model = model;
    this._elements = elements;
    // this.filterTopHeight = document.querySelector('.s3d-filter__top').offsetHeight;
    this.prevId = null;

    $('#resetFilter').on('click', () => {
      this.emit('resetFilter');
    });
    $('#resetFilter-mobile').on('click', () => {
      this.emit('resetFilter');
    });
    $('.js-s3d-filter__close').on('click', () => {
      // this.hidden();
      this.toggle();
    });
    $('.js-s3d-filter').on('click', '.js-s3d-filter__button--apply', () => {
      this.hidden();
    });
    $('.js-s3d-filter__checkboxes').on('click', 'input', () => {
      this.emit('changeFilterHandler');
    });
    $('#hideFilter').on('click', event => {
      // this.emit('reduceFilterHandler');
      const targetElement = event.target.closest('.s3d-filter-wrap');
      if (targetElement) {
        targetElement.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
    $('.js-s3d-ctr__filter').on('click', event => {
      event.preventDefault();
      this.emit('reduceFilterHandler', false);
      this.toggle();
    });
    $('.js-s3d-pln__filter').on('click', event => {
      event.preventDefault();
      this.emit('reduceFilterHandler', false);
      this.showMob();
    });
    $('.s3d-planning-filter-wrap .js-s3d-filter__close').on('click', event => {
      event.preventDefault();
      this.emit('reduceFilterHandler', false);
      this.hideMob();
    });
    $('.js-s3d-filter').on('change', 'input[type="text"]', () => {
      this.emit('changeFilterHandler');
    });

    model.on('hideFilter', () => {
      this.hidden();
    });
    model.on('setAmountAllFlat', data => {
      this.setAmountAllFlat(data);
    });
    model.on('setAmountSelectFlat', data => {
      this.setAmountSelectFlat(data);
    });
    model.on('reduceFilter', state => {
      // this.changeHeightFilterBlock(state);
    });
    this._model.$wrapper.addEventListener('click', evt => {
      const target = delegateHandler('[data-switch-filter-view-type]', evt);
      if (!target) return;
      document
        .querySelectorAll('.active[data-switch-filter-view-type]')
        .forEach(el => el.classList.remove('active'));
      target.classList.add('active');
      this.emit('changeResultsViewType', target.dataset.switchFilterViewType);
    });
    model.on('changeViewType', viewType => {
      const activeButton = document.querySelector(`[data-switch-filter-view-type="${viewType}"]`);
      if (activeButton === null) return;
      activeButton.classList.add('active');
    });
  }

  handleTableInfobox() {
    $('.js-s3d-filter').on('mouseover', '.js-s3d-filter__tr', evt => {
      const infobox = document.querySelector('[data-s3d-table-infobox]');
      const id = evt.currentTarget.dataset.id;
      const flatImg = get(this._model.flats, [id], null);
      if (this.prevId === id) return infobox.classList.add('active');
      if (flatImg['img_big']) {
        infobox.classList.add('active');
        const height = infobox.getBoundingClientRect().height;
        const top = Math.min(evt.target.getBoundingClientRect().top, window.innerHeight - height);
        infobox.style.transform = `translateY(${top}px)`;
        infobox.querySelector('img').src = flatImg['img_big'];
        this.prevId = id;
        return;
      }
      infobox.classList.remove('active');
    });

    $('.js-s3d-filter').on('mouseleave', '.js-s3d-filter__body', () => {
      const infobox = document.querySelector('[data-s3d-table-infobox]');
      infobox.classList.remove('active');
    });
  }


  show() {
    $('.js-s3d-filter').addClass('s3d-open-filter');
    this.setFilterStatusClassToBody();
  }

  hidden() {
    $('.js-s3d-filter').removeClass('s3d-open-filter');
    this.setFilterStatusClassToBody();
    this.setFilterStatusToButtons();
  }

  setFilterStatusClassToBody() {
    document.body.classList.toggle(
      'js-s3d-filter-open',
      document.querySelector('.js-s3d-filter').classList.contains('s3d-open-filter'),
    );
  }

  setFilterStatusToButtons() {
    document.querySelectorAll('.js-s3d-ctr__filter').forEach(el => {
      el.classList.toggle(
        'active',
        document.querySelector('.js-s3d-filter').classList.contains('s3d-open-filter'),
      );
    });
  }

  // перемикач фільтра
  toggle() {
    // $('.js-s3d-filter').toggleClass('s3d-open-filter');
    const $filter = document.querySelector('.js-s3d-filter');
    if ($filter.classList.contains('s3d-open-filter')) {
      $filter.classList.remove('s3d-open-filter');
      $filter.style.transform = '';
      this.onFilterChangeOpenState();
      this.setFilterStatusToButtons();
    } else {
      $filter.classList.add('s3d-open-filter');
      this.onFilterChangeOpenState();
      this.setFilterStatusToButtons();
    }
  }

  onFilterChangeOpenState() {
    if (document.querySelector('.js-s3d-filter').classList.contains('s3d-open-filter')) {
      this.emit('open-filter');
      if (!this._model.modalManager.open) return;
      this._model.modalManager.open(this._model.id);
    }
    this.setFilterStatusClassToBody();
  }

  // перемикач фільтра на сторінці планування
  showMob() {
    $('.js-s3d-filter').addClass('s3d-open-filter');
    if (document.querySelector('.js-s3d-filter').classList.contains('s3d-open-filter')) {
    }
    this.setFilterStatusClassToBody();
  }

  hideMob() {
    $('.js-s3d-planning-filter').removeClass('s3d-open-filter');
  }

  setAmountAllFlat(value) {
    $('.js-s3d__amount-flat__num-all').html(value);
  }

  // установить кол-во найденных квартир
  setAmountSelectFlat(amount) {
    $('.js-s3d__amount-flat__num').html(amount);
  }

  changeHeightFilterBlock(state) {
    const elements = {
      filter: document.querySelector('.js-s3d-filter'),
      filterTop: document.querySelector('.s3d-filter__top'),
      btn: document.querySelector('#hideFilter'),
    };
    const filterScrollHandler = state ? 'filterScrollActive' : 'filterScrollUnActive';
    this[filterScrollHandler](elements);
  }

  filterScrollActive(elements) {
    const { btn, filter, filterTop } = elements;
    const tl = new TimelineMax();
    const paddingBottom = getComputedStyle(filterTop).getPropertyValue('--filter-offset-ver');
    const filterTopClosed = getComputedStyle(filterTop).getPropertyValue(
      '--filter-height-top-closed',
    );
    btn.querySelector('span').innerText = btn.dataset.showText;
    filter.classList.add('s3d-filter__scroll-active');
    tl.to(filterTop, {
      height: filterTopClosed,
      paddingBottom,
      duration: 0.3,
      ease: Power1.easeIn,
    }).eventCallback('onComplete', () => {
      this.emit('changeListScrollBlocked', false);
    });
  }

  filterScrollUnActive(elements) {
    const { btn, filter, filterTop } = elements;
    const tl = new TimelineMax();
    btn.querySelector('span').innerText = btn.dataset.hideText;
    filter.classList.remove('s3d-filter__scroll-active');
    const paddingBottom = getComputedStyle(filterTop).getPropertyValue('--filter-offset-ver');
    tl.to(filterTop, {
      height: this.filterTopHeight,
      paddingBottom,
      duration: 0.3,
      ease: Power1.easeIn,
    }).eventCallback('onComplete', () => {
      setTimeout(() => {
        this.emit('changeListScrollBlocked', false);
      }, 400);
    });
  }
}

export default FilterView;
