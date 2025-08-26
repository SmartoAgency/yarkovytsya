import { BehaviorSubject } from 'rxjs';
import isEmpty from 'lodash/isEmpty.js';
import FilterModel from './modules/filter/filterModel.js';
import FilterController from './modules/filter/filterController.js';
import FilterView from './modules/filter/filterView.js';
import { pushParams, removeParamsByRegExp, getUrlParam } from './modules/history/history.js';
import { debounceResize } from './modules/helpers/helpers.js';

planningsGallery();

async function planningsGallery() {

    const SEARCH_PARAMS_FILTER_PREFIX = 'filter_';
    const currentFilteredFlatIds$ = new BehaviorSubject([]);

    const $moreButton = document.querySelector('[data-more]');
    const $paginationArrows = document.querySelector('[data-pagination]');

    const fetchedFlats = await getFlats();
    // console.log('fetchedFlats:', fetchedFlats);

    const flats = fetchedFlats.reduce((acc, flat) => {
        acc[flat.id] = flat;
        return acc;
    }, {});   


    let paginationData = [];
    let currentPage$ = new BehaviorSubject(getUrlParam('filterPage') ? +getUrlParam('filterPage') : 1);
    let totalPages = 0;
    const portion = 12;


    currentPage$.subscribe((page) => {
        const $container = document.querySelector('[data-planning-list]');

        $moreButton.classList.toggle('hidden', page >= totalPages);
        $paginationArrows.classList.toggle('hidden', totalPages == 0);

        if (!paginationData[page]) return;

        $container.insertAdjacentHTML('beforeend', paginationData[page].map(id => {
            const flat = flats[id];
            return renderTemplate('flat-card-template', flat);
        }).join(''));

        
        renderCurrentPageAndSwitchArrows(currentPage$);
        pushParams({
            filterPage: currentPage$.value,
        });

        onAfterChangePageEvents();
    })

    currentFilteredFlatIds$.subscribe((ids) => {
        
        const idsSortedByIds = ids.sort((a, b) => {
            return +a - +b > 0 ? 1 : -1;
        });
        paginationData = preparePgination(idsSortedByIds).portionedFlats;
        totalPages = preparePgination(idsSortedByIds).totalPages;

        renderCountPages(totalPages);
        const $container = document.querySelector('[data-planning-list]');
        
        $container.innerHTML = '';
        if (ids.length === 0) {
            const template = document.getElementById('empty-planning-list');
            $container.innerHTML = template.innerHTML;
            return;
        }

        currentPage$.next(totalPages < currentPage$.value ? totalPages : currentPage$.value);
        setTimeout(() => {
        
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }, 800);
    });

    document.querySelectorAll('[data-pagination="prev"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (currentPage$.value > 1) {
                currentPage$.next(currentPage$.value - 1);
                currentFilteredFlatIds$.next(currentFilteredFlatIds$.value);
            }
        });
    });
    document.querySelectorAll('[data-pagination="next"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            if (currentPage$.value < totalPages) {
                currentPage$.next(currentPage$.value + 1);
                currentFilteredFlatIds$.next(currentFilteredFlatIds$.value);
            }
        });
    });

    document.querySelectorAll('[id="resetFilter"]').forEach((el) => {
        el.addEventListener('click', (e) => {
            currentPage$.next(1);
        })
    })

    $moreButton.addEventListener('click', (e) => {
        console.log('more button clicked');
        
        currentPage$.next(+currentPage$.value + 1);
    })

    // mark checked checkboxes from default URL search params
    const filterDefaultSearchParams = new URLSearchParams(window.location.search);
    Array.from(filterDefaultSearchParams.entries()).forEach(([key, value]) => {
        if (key.startsWith(SEARCH_PARAMS_FILTER_PREFIX)) {
            const [_, name, valueName] = key.split('_');
            document.querySelectorAll(`input[data-${name}="${valueName}"]`).forEach((el) => {
                el.checked = true;
            })
        }
    });


    const filterModel = new FilterModel(
        {
            flats: flats,
            currentFilteredFlatIds$: currentFilteredFlatIds$,
            onChangeFilterState: (state, filterConfig) => {
                if (isEmpty(filterConfig)) return;

                const filterSearchParamsPrefix = SEARCH_PARAMS_FILTER_PREFIX;

                const searchParamsOfFilterState = Object.entries(state).reduce((acc, [key, value]) => {
                    const filterName = value[0];
                    const filterType = value[1].type;
                    switch (filterType) {
                        case 'range':
                            const rangeInstance = filterConfig[filterName].elem;
                            if (rangeInstance.result.from !== rangeInstance.result.min) {
                                acc[`${filterSearchParamsPrefix}${filterName}_min`] = value[1].min;
                            }
                            if (rangeInstance.result.to !== rangeInstance.result.max) {
                                acc[`${filterSearchParamsPrefix}${filterName}_max`] = value[1].max;
                            }
                            break;
                        case 'checkbox':
                            value[1].value.forEach(val => {
                                acc[`${filterSearchParamsPrefix}${filterName}_${val}`] = val;
                            });
                            break;
                        case 'text':
                            if (value[1].value) {
                                acc[`${filterSearchParamsPrefix}${filterName}`] = value[1].value;
                            }
                            break;
                    }
                    return acc;
                }, {});

                const regExp = new RegExp(`${SEARCH_PARAMS_FILTER_PREFIX}`);

                removeParamsByRegExp(regExp);

                pushParams(searchParamsOfFilterState);
            },
        },
    );
    const filterView = new FilterView(filterModel, {});
    const filterController = new FilterController(filterModel, filterView);

    filterModel.init();

    function renderCountPages(totalPages) {
        document.querySelectorAll('[data-planning-pages-count]').forEach((el) => {
            el.textContent = totalPages < 10 ? `0${totalPages}` : totalPages;
        });
    }

    function renderCurrentPageAndSwitchArrows(currentPage$) {
        document.querySelectorAll('[name="pagination-current"]').forEach((el) => {
            el.value = padNumber(currentPage$.value);
        });
        document.querySelectorAll('[data-pagination="prev"]').forEach((el) => {
            el.disabled = currentPage$.value <= 1;
        });
        document.querySelectorAll('[data-pagination="next"]').forEach((el) => {
            el.disabled = currentPage$.value >= totalPages;
        });
    }

    function preparePgination(flats = []) {
        const portionedFlats = [];
        const length = flats.length;
        const totalPages = Math.ceil(length / portion);

        flats.forEach((flat, index) => {
            const page = Math.floor(index / portion) + 1;
            if (!portionedFlats[page]) {
                portionedFlats[page] = [];
            }
            portionedFlats[page].push(flat);
        });        

        return { portionedFlats, totalPages };
    }

    function onAfterChangePageEvents() {
        window.dispatchEvent(new CustomEvent('plannings:rendered', {}));
        window.dispatchEvent(new Event('resize'));
    }
}

async function getFlats() {
    const isDev =  window.location.href.match(/localhost|verstka|192/);
    const url = isDev ? './static/flats.json' : '/wp-admin/admin-ajax.php';
    const method = isDev ? 'GET' : 'POST';
    const fd = new FormData();
    fd.append('action', 'getFlats');

    if (!isDev && window.yarkoFlats) {
        return Promise.resolve(window.yarkoFlats);
    }

    const response = await fetch(url, {
        method,
        body: isDev ? null : fd,
    });
    const data = await response.json();
    return data;
}


function renderTemplate(templateId, data) {
    const template = document.getElementById(templateId);
    let html = template.innerHTML;

    // Підставляємо дані в шаблон
    for (const key in data) {
        const value = data[key] === undefined ? '' : data[key];
        if (key === 'eoselya' && value) {
            //<img class="planning-card__image-label" src="./assets/images/eoselya.svg">
            html = html.replaceAll(`{{${key}}}`, `<img class="planning-card__image-label" src="/wp-content/themes/3d/assets/images/eoselya.svg">`);
        } else {
            html = html.replaceAll(`{{${key}}}`, value);
        }
    }

    // Створюємо елемент
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.firstElementChild.outerHTML;
}

function padNumber(num) {
    return num < 10 ? `0${num}` : num;
}




window.addEventListener('load', () => {
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-filter-collapse]');
        if (!target) return;
        const filter = target.closest('[data-filter]');
        if (!filter) return;
        filter.classList.toggle('collapsed');
    });
    if (window.innerWidth <= 600) {
        document.querySelector('[data-filter]').classList.add('collapsed');
    }
})


const debFilterDisable = debounceResize(() => {
    if (window.innerWidth > 600) {
        document.querySelectorAll('[data-filter]').forEach((el) => {
            el.classList.remove('collapsed');
        });
    }
}, 1000);

    window.addEventListener('resize', debFilterDisable);