import Swal from 'sweetalert2';
import axios from 'axios';
import Toastify from 'toastify-js';
import { useState } from './modules/helpers/helpers';
import Swiper, { Navigation } from 'swiper';


function initTranslations()  {
    const lang = document.documentElement.lang || 'en';
    const translations = {
        'en': {
            'Підготовка до завантаження': 'Preparing for download',
            'Сталася помилка!': 'An error occurred!',
            'Файл готовий': 'File&nbsp;&nbsp; is&nbsp;&nbsp; ready',
            'Завантажити': 'Download',
        },
        'ua': {
            'Підготовка до завантаження': 'Підготовка до завантаження',
            'Сталася помилка!': 'Сталася помилка!',
            'Файл готовий': 'Файл&nbsp;&nbsp;&nbsp;готовий',
            'Завантажити': 'Завантажити',
        },
        'uk': {
            'Підготовка до завантаження': 'Підготовка до завантаження',
            'Сталася помилка!': 'Сталася помилка!',
            'Файл готовий': 'Файл&nbsp;&nbsp;&nbsp;готовий',
            'Завантажити': 'Завантажити',
        }
    };
    return function (key) {
        return translations[lang][key] || key;
    }
}

const t = initTranslations();

const [flatImage, setFlatImage, subscribeFlatImage] = useState('');

subscribeFlatImage((image) => {
    document.querySelector('[data-flat-image-container]').src = image;
});


document.body.addEventListener('click', function switchFlatImage(evt) {
    const target = evt.target.closest('[data-flat-image]');
    if (!target) return;
    document.querySelectorAll('[data-flat-image]').forEach((el) => {
        el.classList.toggle('active', el === target);
    });
    setFlatImage(target.dataset.flatImage);
});

document.querySelector('[data-flat-image]').click();


//data-pdf-download

document.body.addEventListener('click', function downloadPdf(evt) {
    const target = evt.target.closest('[data-pdf-download]');
    if (!target) return;
    getPdfLink();
    evt.preventDefault();
})

async function getPdfLink() {
    const additionalParams = {};

    const toast = Toastify({
        position: 'center',
        gravity: 'bottom',
        text: t('Підготовка до завантаження'),
    }).showToast();

    const sendData =  {
        action: 'createPdf',
        id: new URLSearchParams(window.location.search).get('id'),
        ...additionalParams
    };

    const fd = new FormData();
    Object.keys(sendData).forEach(key => {
        fd.append(key, sendData[key]);
    });
    fd.append('action', 'createPdf');

    axios({
        url:
            window.location.href.match(/localhost/)
                ? `./static/pdf.txt`
                : '/wp-admin/admin-ajax.php',
        method: window.status === 'local' ? 'get' : 'post',
        data: fd,
    })
        .then(resp => resp)
        .then(data => {
            return new Promise((resolve, reject) => {
                setTimeout(
                    () => {
                        resolve(data);
                    },
                    window.status === 'local' ? 2000 : 0,
                );
            });
        })
        .then(data => {
            if (!data.data) {
                Toastify({
                    position: 'center',
                    gravity: 'bottom',
                    close: true,
                    text: t('Сталася помилка!'),
                    duration: 4000,
                }).showToast();
                return;
            }
            Swal.fire({
                title: t('Файл готовий'),
                customClass: {
                    container: 's3d-pdf-popup',
                },
                preConfirm: () => {
                    return false;
                },
                width: 386,
                allowOutsideClick: false,
                showCloseButton: true,
                closeButtonHtml: `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00008 7.29297L8.35363 7.64652L12.5001 11.793L16.6465 7.64652L17.0001 7.29297L17.7072 8.00008L17.3536 8.35363L13.2072 12.5001L17.3536 16.6465L17.7072 17.0001L17.0001 17.7072L16.6465 17.3536L12.5001 13.2072L8.35363 17.3536L8.00008 17.7072L7.29297 17.0001L7.64652 16.6465L11.793 12.5001L7.64652 8.35363L7.29297 8.00008L8.00008 7.29297Z" fill="#1A1E21"/>
                    </svg>
                    `,
                html: `
                    <div class="pdf-icon">
                        <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.87531 1.79154C9.81298 1.7599 9.7057 1.73228 9.51696 1.76385C9.20646 1.81578 9.00412 2.00094 8.87612 2.38739C8.73861 2.80254 8.71385 3.39569 8.78949 4.10604C8.89422 5.0896 9.17927 6.19582 9.49125 7.14906C9.83473 6.06033 10.1894 4.5918 10.2452 3.41602C10.2759 2.76752 10.2106 2.28938 10.0703 2.01194C10.006 1.88489 9.93784 1.82327 9.87531 1.79154ZM8.98145 8.67531C8.97968 8.67124 8.9779 8.66717 8.97612 8.6631L8.97294 8.65581L8.97 8.64842C8.51342 7.50282 7.9586 5.74725 7.79511 4.21192C7.71398 3.45003 7.72281 2.68895 7.92684 2.07297C8.14037 1.42829 8.5875 0.905427 9.35198 0.77755C9.70073 0.719213 10.0339 0.750593 10.3279 0.899823C10.6217 1.04895 10.8258 1.29007 10.9626 1.56058C11.2245 2.07827 11.2767 2.77454 11.2441 3.46341C11.1775 4.86547 10.7371 6.5765 10.358 7.71853C10.2702 7.99546 10.1696 8.30009 10.057 8.62757C11.1388 10.9468 12.6067 12.601 14.108 13.7362C16.101 13.3606 17.3821 13.3581 18.3929 13.3581C19.7833 13.3581 20.8649 13.701 21.4012 14.3162C21.6871 14.644 21.821 15.0606 21.7125 15.4961C21.6093 15.9106 21.3081 16.2553 20.9105 16.5213C20.6485 16.6967 20.3065 16.7881 19.9489 16.8275C19.5823 16.8679 19.1564 16.8583 18.6925 16.7982C17.7641 16.6779 16.6464 16.3506 15.481 15.7657C14.9513 15.4999 14.4107 15.1803 13.8724 14.8017C12.3391 15.1165 10.3838 15.6547 7.81651 16.5747C7.24054 16.795 6.71031 17.0147 6.22286 17.2325C5.25974 18.898 4.18761 20.4043 3.05946 21.4142C2.44814 22.0232 1.73069 22.3471 1.118 22.2219C0.79045 22.1549 0.504804 21.9552 0.355935 21.6304C0.213576 21.3197 0.227116 20.9634 0.335287 20.6197C0.549049 19.9403 1.17743 19.1454 2.29001 18.3116C3.07876 17.7204 4.13423 17.092 5.51492 16.4556C5.9159 15.7458 6.30142 15.0016 6.66648 14.2471C7.62756 12.2606 8.42847 10.242 8.98145 8.67531ZM6.99551 15.8217C7.19198 15.444 7.38255 15.0631 7.56665 14.6826C8.36684 13.0287 9.05751 11.3546 9.59126 9.92516C10.5206 11.6387 11.6568 12.9785 12.8479 14.0034C11.4087 14.3405 9.65401 14.8538 7.47415 15.6351L7.47412 15.635L7.4643 15.6387C7.30485 15.6997 7.14861 15.7607 6.99551 15.8217ZM4.53455 18.0665C3.87499 18.4295 3.33184 18.7805 2.88974 19.1118C1.84676 19.8935 1.41135 20.5315 1.28918 20.9198C1.22939 21.1098 1.25692 21.1961 1.26504 21.2138C1.26516 21.2141 1.26529 21.2144 1.26543 21.2148C1.26714 21.2195 1.27188 21.2327 1.3183 21.2421C1.45792 21.2707 1.8555 21.2058 2.36166 20.6978L2.37203 20.6874L2.383 20.6776C3.11644 20.0233 3.841 19.1172 4.53455 18.0665ZM15.3287 14.5474C15.5304 14.6642 15.7309 14.7723 15.9295 14.8719C17.0037 15.411 18.0137 15.7019 18.821 15.8065C19.225 15.8588 19.569 15.8633 19.8393 15.8335C20.1185 15.8027 20.2805 15.7397 20.3544 15.6902C20.6287 15.5067 20.7194 15.3457 20.7422 15.2544C20.7596 15.1842 20.7536 15.0951 20.6475 14.9733C20.4 14.6895 19.69 14.3581 18.3929 14.3581H18.3731C17.6075 14.3581 16.6684 14.3581 15.3287 14.5474Z" fill="#1A1E21"/>
                        </svg>
                    </div>
                `,
                confirmButtonText: `
                    <a href="${data.data}" target='_blank'>
                        <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.52556 14.3176L16.6836 7.60691L17.3675 8.33645L9.36753 15.8364L9.02556 16.157L8.68359 15.8364L0.683593 8.33645L1.36753 7.60691L8.52556 14.3176L8.52556 0.47168L9.52556 0.47168L9.52556 14.3176Z" fill="var(--color-black)"/>
                        </svg>
                        <span>${t('Завантажити')}</span>
                    </a>
                `,
                confirmButtonColor: 'var(--color-white)',
            });
            return data.data;
        })
        .catch(err => {
            Toastify({
                position: 'center',
                gravity: 'bottom',
                close: true,
                text: t('Сталася помилка!'),
                duration: 4000,
            }).showToast();
        })
        .finally(() => {
            toast.hideToast();
        });
}


function sliderHandler() {
    const slider = new Swiper('[data-single-flat-slider]', {
        modules: [Navigation],
        navigation: {
            nextEl: '[data-single-flat-slider-next]',
            prevEl: '[data-single-flat-slider-prev]',
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            601: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            900: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            1320: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
        }
    })
}

window.addEventListener('load', () => {
    sliderHandler();
    window.dispatchEvent(new Event('resize'));
});