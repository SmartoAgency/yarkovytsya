import Swiper, { Navigation } from "swiper";

function initComparePage() {
    const sliderContainer = document.querySelector('[data-compare-slider] .swiper-wrapper');
    const initialList = document.documentElement.getFavouritesList();
    sliderContainer.innerHTML = '';
    initialList.forEach(item => {
        const flatData = getFlatDataById(item);
        const html = renderTemplate('compare-card-template', flatData);
        sliderContainer.insertAdjacentHTML('beforeend', html);
    });


    const swiper = new Swiper('[data-compare-slider]', {
        modules: [Navigation],
        navigation: {
            nextEl: '[data-compare-slider-next]',
            prevEl: '[data-compare-slider-prev]',
        },
        slidesPerView: 4,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            601: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1240: {
                slidesPerView: 4.5,
                spaceBetween: 20,
            },
        }
    });
    
    window.addEventListener('favourites:updated', (evt) => {
        const favouritesList = evt.detail;        
        swiper.update();
        swiper.slideTo(0);
        
    });

}

window.addEventListener('load', () => {
    initComparePage();
    window.dispatchEvent(new Event('resize')); // Оновлюємо розміри слайдів
}, {
    once: true
});



function renderTemplate(templateId, data) {
    const template = document.getElementById(templateId);
    let html = template.innerHTML;

    // Підставляємо дані в шаблон
    for (const key in data) {
        const value = data[key];
        if (key === 'eoselya' && value) {
            html = html.replaceAll(`{{${key}}}`, `<img class="planning-card__image-label" src="/wp-content/themes/3d/assets/images/eoselya.svg">`);
        } else {
            html = html.replaceAll(`{{${key}}}`, value);
        }
    }
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.firstElementChild.outerHTML;
}

function getFlatDataById(id) {
    return {
        project_name: 'PARK AVENUE',
        id: id,
        img_big: `./assets/images/test-plan.jpg`,
        rooms: 3,
        area: 74,
        build: 1,
        section: 2,
        floor: 3,
        fron_window_view: 'ГОРИ',
    }
}