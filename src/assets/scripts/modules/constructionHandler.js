import { isObject } from "lodash";
import { useState } from "./helpers/helpers";
import Swiper, { Navigation } from "swiper";

function padNumber(num) {
    return num < 10 ? '0' + num : num;
}

export default function constructionHandler() {
    const [ popuOpen, setPopupOpen, subscribePopupOpen ] = useState(false);

    subscribePopupOpen((value) => {
        document.querySelectorAll('[data-construction-popup]').forEach((el) => {
            if (value) {
                el.classList.add('active');
                document.body.classList.add('popup-open', value);
            } else {
                el.addEventListener('animationend', function(evt) {
                    el.classList.remove('active', 'closing');
                }, { once: true });
                el.classList.add('closing');

                document.body.classList.remove('popup-open');
            }
        });
    });

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-construction-popup-open]');
        if (target) {
            e.preventDefault();
            setPopupOpen(true);
        }
    });
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-construction-popup-close]');
        if (target) {
            e.preventDefault();
            setPopupOpen(false);
        }
    });

    const [ data, setData, subscribeData ] = useState({
        slides: [],
        imgCount: 10,
        date: '05.05.'+Math.random(),
        text: '<p>Some text about construction</p>'
    });

    const swiper = new Swiper('[data-construction-popup-slider]', {
        modules: [Navigation],
        navigation: {
            nextEl: '[data-construction-popup-slider-next]',
            prevEl: '[data-construction-popup-slider-prev]',
        },
    });
    const currentCounter = document.querySelector('[data-construction-popup-slider-counter]');
    const totalCounter = document.querySelector('[data-construction-popup-slider-total]');

    swiper.on('slideChange', () => {
        if (currentCounter && totalCounter) {
            currentCounter.textContent = padNumber(swiper.realIndex + 1);
            totalCounter.textContent = padNumber(swiper.slides.length);
        }
    });

    subscribeData((value) => {
        if (!isObject(value)) return;
        const popup = document.querySelector('[data-construction-popup]');
        if (popup) {
            const slidesContainer = popup.querySelector('[data-construction-popup-slides]');
            const imgCount = popup.querySelector('[data-construction-popup-img-count]');
            const date = popup.querySelector('[data-construction-popup-date]');
            const text = popup.querySelector('[data-construction-popup-text]');

            if (slidesContainer) {
                slidesContainer.innerHTML = value.slides.map(slide => `

                    <div class="swiper-slide"><img src="${slide}" alt="Construction Image"></div>
                `).join('');
            }
            if (imgCount) {
                imgCount.textContent = value.imgCount;
            }
            if (date) {
                date.textContent = value.date;
            }
            if (text) {
                text.innerHTML = value.text;
            }
            swiper.update();
            swiper.slideTo(0);
            totalCounter.textContent = padNumber(value.slides.length);
            currentCounter.textContent = padNumber(1);
        }
    })


    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-construction-id]');
        if (!target) return;
        e.preventDefault();
        const id = target.dataset.constructionId;
        getData(id).then((data) => {
            if (!data) return;
            setData(data);
            setPopupOpen(true);
        }).catch((error) => {
            console.error('Error fetching construction data:', error);
        });
    });

    window.setData = setData;

}



function getData(id) {
    if (!id) return null;
    const isDev = document.documentElement.dataset.status === 'local';
    if (isDev) {
        return Promise.resolve(mockData());
    }
    const fd = new FormData();
    fd.append('action', 'get_construction_data');
    fd.append('id', id);
    return fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: fd,
    })
}


function mockData() {
    return {
        slides: [
            './assets/images/single-project/construction-card.jpg',
            './assets/images/single-project/construction-card.jpg',
            './assets/images/single-project/construction-card.jpg',
            './assets/images/single-project/construction-card.jpg',
        ],
        imgCount: 4,
        date: '05.05.2023',
        text: '<p>Mock text about construction</p>'
    };
}