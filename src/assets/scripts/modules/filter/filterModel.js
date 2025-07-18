import ionRangeSlider from 'ion-rangeslider';
import { BehaviorSubject } from 'rxjs';
import $ from 'jquery';
import size from 'lodash/size';
import has from 'lodash/has';
import set from 'lodash/set';
import includes from 'lodash/includes';
import toNumber from 'lodash/toNumber';
import forIn from 'lodash/forIn';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import clone from 'lodash/clone';

import EventEmitter from '../eventEmitter/EventEmitter';
import debounce from 'lodash/debounce';
import { parseSearchUrl } from '../history/history';


const SEARCH_PARAMS_FILTER_PREFIX = 'filter_';

class FilterModel extends EventEmitter {
  constructor(config) {
    super();

    this.types = {
      area: 'range',
      floor: 'range',
      roomsforfilter: 'checkbox',
      eoselya: 'checkbox',
      level: 'checkbox',
      objecttype: 'checkbox',
      queue: 'checkbox',
      parking: 'checkbox',
    };
    this.configProject = {};
    this.currentFilteredFlatIds$ = config.currentFilteredFlatIds$;
    this.currentFilteredFlatIdsAviableStatus$ = new BehaviorSubject([]);
    this.currentFilteredFloorsData$ = new BehaviorSubject([]);
    this.flats = config.flats;
    this.availableFlatList = config.availableFlatList;
    this.uiMiniFilter = false;
    this.isListScrollBlocked = false;
    this.$wrapper = document.querySelector('.js-s3d-filter');
    this.updateFsm = config.updateFsm;
    this.id = 's3d-flats-filter';
    this.highlightFlybySvgElements$ = config.highlightFlybySvgElements$;
    this.history = config.history;
    this.i18n = config.i18n;
    this.onChangeFilterState = config.onChangeFilterState || function() {};
    this.isFilterEmpty = new BehaviorSubject(true);
    this.show_prices = config.show_prices;  
  }

  init() {
    this.configProject = this.createFilterParam(this.flats);
    this.reduceFilter = this.reduceFilter.bind(this);
    // this.emit('setAmountAllFlat', size(this.flats));
    this.emit('setAmountAllFlat', size(this.availableFlatList));
    this.filterFlatStart();
    this.emit('updateHeightFilter');
    this.emit('initCardClickHandler', this.updateFsm);



    this.isFilterEmpty.subscribe((value) => {
      document.querySelectorAll('.js-s3d-ctr__filter').forEach((el) => {
        if (!value) {
          el.setAttribute('data-filter-not-empty', 'true');
        } else {
          el.removeAttribute('data-filter-not-empty', 'true');
        }
      });
    });

    this.deb = debounce(this.resize.bind(this), 500);
  }

  mobileClosingAnimation(cb = () => {}) {
    gsap
      .timeline()
      .to(this.$wrapper, {
        y: this.$wrapper.getBoundingClientRect().height,
        clearProps: 'all',
      })
      .add(() => {
        this.emit('hideFilter');
        cb();
      });
  }

  mobMenuHandle() {
    const menu = this.$wrapper;
    const moveCords = {
      y: 0,
      swipeDistance: 0,
      locked: true,
      percentForClosing: 37.5,
    };

    document.body.addEventListener('touchstart', e => {
      if (!menu.classList.contains('s3d-open-filter')) return;

      const isElementHasNativeScroll = menu.scrollHeight > menu.getBoundingClientRect().height;

      if (isElementHasNativeScroll) return;
      const html = document.documentElement;
      if (html.classList.contains('mobile') && html.classList.contains('landscape')) return;
      moveCords.y = e.changedTouches[0].clientY;
      moveCords.locked = false;
      menu.style.transition = 'none';
    });
  }
  // запускает фильтр квартир
  filterFlatStart() {
    const filterSettings = this.getFilterParam(this.configProject);
    this.updateAllParamFilter(filterSettings);
    const { flats, floors } = this.startFilter(this.flats, filterSettings);
    this.currentFilteredFlatIds$.next(flats);
  }

  createFilterParam(flats) {
    let filterParams = {};
    for (const type in this.types) {
      const typeNames = this.types[type];
      let param = {};
      let rangeParam;
      switch (typeNames) {
        case 'range':
          rangeParam = this.createParam(flats, type, this.createRangeParam.bind(this));
          forIn(rangeParam, (setting, key) => {
            param[key] = {
              type: 'range',
              skin: 'round',
              elem: this.createRange(setting),
            };
          });
          break;
        case 'checkbox':
          param = this.createParam(flats, type, this.createCheckedParam);
          break;
        case 'option':
          param = this.createParam(flats, type, this.createOptionParam);
          break;
        case 'text':
          param = this.createParam(flats, type, this.createTextParam);
          break;
        default:
          param = {};
          break;
      }
      filterParams = {
        ...filterParams,
        ...param,
      };
    }
    return filterParams;
  }

  createParam(flats, keyFilter, callback) {
    const data = Object.keys(flats);
    const configProject = data.reduce((acc, key) => {
      const flat = flats[key];
      return { ...acc, ...callback(flat, keyFilter, acc) };
    }, {});
    return configProject;
  }

  // нужно переписать #change
  createRangeParam(flat, name, acc) {
    if (!has(flat, name)) {
      return acc;
    }
    const setting = acc;
    if (!setting[name]) {
      setting[name] = { min: +flat[name], max: +flat[name] };
      return setting;
    }

    
    if (flat[name] < setting[name].min) {
      setting[name].min = +flat[name];
    }
    if (flat[name] > setting[name].max) {
      setting[name].max = +flat[name];
    }
    setting[name].type = name;
    return setting;
  }

  createCheckedParam(flat, name, acc) {
    if (!has(flat, name)) {
      return acc;
    }
    const elements = document.querySelectorAll(`.js-s3d-filter__checkboxes [data-type = ${name}]`);
    const value = [];
    elements.forEach(element => {
      value.push(element.dataset[name]);
    });
    const params = {
      type: 'checkbox',
      elem: elements,
      value,
    };
    return { [name]: params };
  }

  createOptionParam(flat, name) {
    const elements = document.querySelectorAll(`.js-s3d-filter__checkboxes [data-type= ${name}]`);
    const value = [];
    elements.forEach(element => {
      value.push(element.dataset[name]);
    });
    const params = {
      type: 'option',
      elem: elements,
      value,
    };
    return { [name]: params };
  }

  // создает range slider (ползунки), подписывает на события
  createRange(config) {
    if (config.type !== undefined) {
      const self = this;
      const { min, max } = config;
      const $min = $(`.js-filter-range [data-type=${config.type}][data-border="min"]`);
      const $max = $(`.js-filter-range [data-type=${config.type}][data-border="max"]`);
      const rangeSlider = $(`.js-filter-range .js-s3d-filter__${config.type}--input[data-type=${config.type}]`);
      

      const searchParams = parseSearchUrl(window.location);

      const initialMin = toNumber(searchParams[`${SEARCH_PARAMS_FILTER_PREFIX}${config.type}_min`]) || min;
      const initialMax = toNumber(searchParams[`${SEARCH_PARAMS_FILTER_PREFIX}${config.type}_max`]) || max;

      rangeSlider.ionRangeSlider({
        type: 'double',
        grid: false,
        min,
        max,
        hide_from_to: true,
        hide_min_max: true,
        from: initialMin || 0,
        to: initialMax || 0,
        step: config.type === 'area' ? 0.5 : 1,
        onStart: updateInputs,
        onChange: updateInputs,
        onFinish(e) {
          updateInputs(e);
          self.filterFlatStart({ min: e.from, max: e.to, ...{ type: config.type } });
        },
        onUpdate: updateInputs,
      });
      
      const instance = rangeSlider.data('ionRangeSlider');
      instance.update({
        min,
        max,
        from: initialMin,
        to: initialMax,
      });

      function updateInputs(data) {
        $min.prop('value', data.from);
        $max.prop('value', data.to);
      }

      $min.on('change', function() {
        changeInput.call(this, 'from');
      });
      $max.on('change', function() {
        changeInput.call(this, 'to');
      });

      function changeInput(key) {
        let val = $(this).prop('value');
        if (key === 'from') {
          if (val < min) val = min;
          else if (val > instance.result.to) val = instance.result.to;
        } else if (key === 'to') {
          if (val < instance.result.from) val = instance.result.from;
          else if (val > max) val = max;
        }

        instance.update(key === 'from' ? { from: val } : { to: val });
        $(this).prop('value', val);
        self.filterFlatStart({
          min: instance.result.from,
          max: instance.result.to,
          ...{ type: config.type },
        });
      }
      return instance;
    }
    return null;
  }

  createTextParam(flat, name) {
    const elements = document.querySelector(`[data-type= ${name}]`);
    const self = this;
    elements.addEventListener('change', evt => {
      const value = evt.target.value;
    });
    const value = '';
    const params = {
      type: 'text',
      elem: elements,
      value,
    };
    return { [name]: params };
  }

  // сбросить значения фильтра
  resetFilter() {
    // this.emit('filteredPolygonRemoveClass');

    const mapping = {
      range: param => param.elem.update({ from: param.elem.result.min, to: param.elem.result.max }),
      checkbox: param =>
        param.elem.forEach(el => {
          el.checked = el.checked ? false : '';
        }),
      option: param =>
        param.elem.forEach(el => {
          el.checked = el.checked ? false : '';
        }),
      text: param => (param.elem.value = ''),
    };
    const keysConfiguration = Object.keys(this.configProject);
    keysConfiguration.forEach(key => {
      const params = this.configProject[key];
      if (mapping[params.type]) {
        mapping[params.type](params);
      }
    });
    this.filterFlatStart();
    // const flatsKeys = Object.keys(this.flats);
    // this.updateCurrentFilterFlatsId(flatsKeys);
    // this.emit('setAmountSelectFlat', flatsKeys.length);
  }

  updateAllParamFilter(filterSettings) {
    for (const key in filterSettings) {
      const select = filterSettings[key];
      const typeFilterParam = this.getTypeFilterParam(key);
      let { value } = cloneDeep(select);
      switch (typeFilterParam) {
        case 'text':
          break;
        case 'checkbox':
          if (Array.isArray(value) && value.length === 0) {
            this.configProject[key].value.forEach(i => value.push(i));
          }
          value = value.join(', ');
          this.emit('updateMiniInfo', {
            type: key,
            value,
            key: 'amount',
          });
          break;
        case 'range':
          this.emit('updateMiniInfo', {
            type: key,
            value: select.min,
            key: 'min',
          });
          this.emit('updateMiniInfo', {
            type: key,
            value: select.max,
            key: 'max',
          });
          break;
        default:
          break;
      }
    }
  }

  getTypeFilterParam(name) {
    for (const type in this.types) {
      if (type.includes(name)) return this.types[type];
    }
    return null;
  }

  // поиск квартир по параметрам фильтра
  startFilter(flatList, settings) {
    const flats = Object.values(flatList);
    const settingColl = Object.entries(settings);
    const tempSelectedData = {};
    const floorsSelected = [];

    const filteredFlatsIds = flats.reduce((acc, flat) => {
      const isActive = settingColl.every(([name, value]) => {
        const hasKey = has(flat, [name]);
        if (!hasKey) {
          throw new Error(`flat is not include key: "${name}"`);
        }
        switch (value.type) {
          case 'text':
            
            return this.checkTextParam(flat, name, value);
          case 'range':
            
            return this.checkRangeParam(flat, name, value);
          case 'checkbox':
            
            return this.checkСheckboxParam(flat, name, value);
          case 'option':
            
            return this.checkOptionParam(flat, name, value);
          default:
            break;
        }
        return false;
      });
      if (!isActive) return acc;

      const { build, section, floor } = flat;
      if (!has(tempSelectedData, [build, section, floor])) {
        if (!tempSelectedData[build]) {
          tempSelectedData[build] = {};
        }
        if (!tempSelectedData[build][section]) {
          tempSelectedData[build][section] = {};
        }
        if (!tempSelectedData[build][section][floor]) {
          tempSelectedData[build][section][floor] = true;
        }
        floorsSelected.push({
          build,
          section,
          floor,
        });
      }

      return [...acc, flat.id];
    }, []);

    this.onChangeFilterState(clone(settingColl), clone(this.configProject));
    this.checkIsFilterEmpty(settingColl, this.configProject);
    return { flats: filteredFlatsIds, floors: floorsSelected };
  }

  checkIsFilterEmpty(filterState, filterConfig) {
    const isCurrentFilterStateNotEmpty = filterState.some(([name, value]) => {
      const type = value.type;
      switch (type) {
        case 'text':
          return value.value !== '';
        case 'range':

        const rangeInstance = filterConfig[name].elem;
          return rangeInstance.result.min !== rangeInstance.result.from || rangeInstance.result.max !== rangeInstance.result.to;
        case 'checkbox':
          return value.value.length !== 0;
        case 'option':
          return value.value.length !== 0;
        default:
          break;
      }
      return false;
    });

    this.isFilterEmpty.next(!isCurrentFilterStateNotEmpty);
  }

  checkTextParam(flat, key, value) {
    return new RegExp(value.value, 'gi').test(flat[key]);
  }

  checkRangeParam(flat, key, value) {
    if (key === 'floor') {
      return this.checkFloorRangeParam(flat, key, value);
    }
    
    return has(flat, key) && flat[key] >= value.min && flat[key] <= value.max;
  }
  
  checkFloorRangeParam(flat, key, value) {
    const floorRange = flat['floor_range'];

    if (floorRange.match(/-/)) {
      const [min, max] = floorRange.split('-').map(Number);
      let isValid = false;
      for (let i = min; i <= max; i++) {
        if (this.isBetween(i, value.min, value.max)) {
          isValid = true;
          break;
        }
      }
      return isValid;
    } else {
      return has(flat, 'floor_range') && this.isBetween(+flat['floor_range'], value.min, value.max);
    }

    return has(flat, key) && flat[key] >= value.min && flat[key] <= value.max;
  }

  checkСheckboxParam(flat, key, value) {
    return value.value.reduce((acc, name) => acc || flat[key] == name, false) || size(value.value) === 0;
  }

  checkOptionParam(flat, key, value) {
    if (value.value.length === 0) return true;
    return value.value.some(name => flat[key][name]);
  }

  isBetween(x, min, max) {
    return x >= min && x <= max;
  }

  // добавить возможные варианты и/или границы (min, max) в список созданых фильтров
  getFilterParam(filter) {
    const settings = {};
    for (const key in filter) {
      const { type } = filter[key];
      switch (type) {
        case 'text':
          settings[key] = {};
          settings[key]['value'] = filter[key].elem.value;
          break;
        case 'checkbox':
          settings[key] = {};
          settings[key]['value'] = [];
          filter[key].elem.forEach(el => {
            if (el.checked) {
              settings[key].value.push(el.dataset[key]);
            }
          });
          break;
        case 'range':
          settings[key] = {};
          settings[key]['min'] = filter[key].elem.result.from;
          settings[key]['max'] = filter[key].elem.result.to;
          break;
        case 'option':
          settings[key] = {};
          settings[key]['value'] = [];
          filter[key].elem.forEach(el => {
            if (el.checked) {
              settings[key].value.push(el.dataset[key]);
            }
          });
          break;
        default:
          break;
      }
      settings[key].type = type;
    }
    return settings;
  }

  reduceFilter(isShow) {
  }

  changeListScrollBlocked(value) {
    this.isListScrollBlocked = value;
  }

  hideFilter() {
    this.emit('hideFilter');
  }

  resize() {
    this.hideFilter();
  }

  onAfterOpenFilter() {
    this.highlightFlybySvgElements$.next(true);
  }
}

export default FilterModel;
