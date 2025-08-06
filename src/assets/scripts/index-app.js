import Headroom from 'headroom.js';
import { gsap } from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import './modules/form';
import { lenis } from './modules/scroll/leniscroll';
import Swiper, { Navigation } from 'swiper';
import { getUrlParam, pushSingleParam } from './modules/history/history';
import constructionHandler from './modules/constructionHandler';
import { createResponsiveTimeline } from './modules/helpers/helpers';



gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.core.globals('ScrollTrigger', ScrollTrigger);
gsap.core.globals('SplitText', SplitText);



window.ScrollTrigger = ScrollTrigger;

const header = document.querySelector('.header');
const headroom = new Headroom(header, {
    offset: 100,
});
headroom.init();
header.headroom = headroom;

window.addEventListener('popup-opened', function (evt) {
    headroom.notTop();

});


constructionHandler();

//data-popup

function useState(initialValue) {
    let value = initialValue;
    const subscribers = [];

    function setValue(newValue) {
        value = newValue;
        subscribers.forEach((subscriber) => subscriber(value));
    }

    function getState() {
        return value;
    }

    function subscribe(callback) {
        subscribers.push(callback);
        return () => {
            const index = subscribers.indexOf(callback);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
        };
    }

    return [getState, setValue, subscribe];
}


const [formPopup, setFormPopup, useSetPopupEffect] = useState(false);

useSetPopupEffect(val => {
    const popup = document.querySelector('[data-popup]');
    popup.classList.toggle('active', val);
    document.body.classList.toggle('popup-open', val);
    if (val) {
        window.dispatchEvent(new Event('popup-opened'));
    }
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-popup-call]');
    if (target) {
        setFormPopup(true);

    }
});
document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-popup-close]');
    if (target || evt.target.classList.contains('popup')) {
        setFormPopup(false);
    }
});


const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);


window.addEventListener('resize', () => {
    if (window.screen.width < 1025) return;
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const [menuState, setMenuState, useSetMenuEffect] = useState(false);

useSetMenuEffect(val => {
    const menu = document.querySelector('[data-menu]');
    if (val) {
        const vh = window.innerHeight * 0.01;
        menu.classList.add('active', val);
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.body.classList.add('popup-open', val);
        window.dispatchEvent(new Event('popup-opened'));
    } else {
        document.body.classList.remove('popup-open', val);
        window.dispatchEvent(new Event('popup-closed'));
        menu.addEventListener('animationend', function (evt) {
            menu.classList.remove('active');
            menu.classList.remove('closing');
        }, {
            once: true
        });

        menu.classList.add('closing');

    }
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-call]');

    if (target && menuState() === false) {
        setMenuState(true);
        return
    }
    if (evt.target.closest('[data-menu-close]') && menuState()) {
        setMenuState(false);
    }
});

document.querySelectorAll('.menu__link').forEach(el => {
    el.addEventListener('click', function (evt) {
        setMenuState(false);
    });
})

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-menu-close]');
    if (evt.target.closest('[data-menu-call]')) {
        return;
    }
    if (target || evt.target.classList.contains('menu')) {
        setMenuState(false);
    }
});

const [callbackPopupOpen, setCallbackPopupOpen, useSetCallbackPopupEffect] = useState(false);

useSetCallbackPopupEffect(val => {
    const popup = document.querySelector('[data-callback-popup]');
    document.body.classList.toggle('popup-open', val);
    if (!val && popup.querySelector('[data-success]')) {
        popup.querySelector('[data-success]').remove();
    }
    if (val) {
        popup.classList.add('active', val);
        window.dispatchEvent(new Event('popup-opened'));
    } else {
        popup.addEventListener('animationend', function (evt) {
            popup.classList.remove('active');
            popup.classList.remove('closing');
        }, {
            once: true
        });
        popup.classList.add('closing');
    }
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-callback-popup-call]');
    if (target) {
        setCallbackPopupOpen(true);
    }
});
document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-callback-popup-close]');
    if (target || evt.target.classList.contains('popup')) {
        setCallbackPopupOpen(false);
    }
});
/** Mobile callback popup */


function contactScreenProjectsHandler() {
    const links = document.querySelectorAll('[data-contact-project-link]');
    links.forEach(el => {
        el.addEventListener('click', (evt) => {
            evt.preventDefault();
            const whichProjectMakeActive = el.getAttribute('data-contact-project-link');

            const projects = document.querySelectorAll('[data-contact-project]');
            projects.forEach(project => {
                project.classList.remove('active');
                if (project.getAttribute('data-contact-project') === whichProjectMakeActive) {
                    project.classList.add('active');
                }
            });
            links.forEach(link => {
                link.classList.toggle('active', link === el);
            });
        });
    });

    links[0].click(); // Simulate click on the first link to activate it by default
}

window.addEventListener('load', contactScreenProjectsHandler);


function projectContactsPopupHandler() {
    const [callbackPopupOpen, setCallbackPopupOpen, useSetCallbackPopupEffect] = useState(false);

    useSetCallbackPopupEffect(val => {
        const popup = document.querySelector('[data-project-contacts-popup]');
        if (val) {
            window.dispatchEvent(new Event('popup-opened'));
            popup.classList.add('active');
        } else {
            popup.addEventListener('animationend', function (evt) {
                popup.classList.remove('active');
                popup.classList.remove('closing');
            }, {
                once: true
            });
            popup.classList.add('closing');
            document.body.classList.remove('popup-open', val);
        }
    })

    document.body.addEventListener('click', (evt) => {
        const target = evt.target.closest('[data-project-contacts-popup-call]');
        if (!target) return;
        setCallbackPopupOpen(true);
    });
    document.body.addEventListener('click', (evt) => {
        const target = evt.target.closest('[data-project-contacts-popup-close]');
        if (!target) return;
        setCallbackPopupOpen(false);
    });
}

projectContactsPopupHandler();


document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-up-arrow]');
    if (!target) return;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});


function fullPageDecorParalax() {
    const el = document.querySelector('.inner-front-screen');
    if (!el) return;
    const decore = el.querySelector('.inner-front-screen__decor');
    if (!decore) return;
    const decorWrapper = el.querySelector('.inner-front-screen__decor-wrapper');
    const decoreImg = decore.querySelector('img');
    gsap.set(decoreImg, {
        transformOrigin: 'center'
    })

    const decorTopValue = decorWrapper.getBoundingClientRect().top + window.scrollY;

    const pathToTransform = document.querySelector('.incredible-block__logo');

    const pathToTransformWidth = pathToTransform.getBoundingClientRect().width;
    const decoreImageToScaleValue = pathToTransformWidth / decoreImg.getBoundingClientRect().width * 1.17543859649122806;

    const decorLeft = decore.getBoundingClientRect().left;
    const pathLeft = pathToTransform.getBoundingClientRect().left;

    const decorTranslateValue = pathLeft / -2 * 1.087719;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            endTrigger: document.querySelector('.incredible-block__logo'),
            start: '0% top',
            end: `0 ${decorTopValue * 1.45}px`,
            scrub: true,
            markers: false,
            pin: decore
        }
    })
        .to(decoreImg, {
            xPercent: 0,
            opacity: 0.15
        })
        .to(decoreImg, {
            xPercent: 0,
        })
        .to(decoreImg, {
            xPercent: 0,
        })
        .to(decoreImg, {
            scale: decoreImageToScaleValue,
            rotate: 90,
            y: decorTopValue,
            opacity: 1,
            transformOrigin: 'center',
        })
        .to(decorWrapper, {
            x: decorTranslateValue,
        }, '<')
        .to(decorWrapper, {
            opacity: 0,
            duration: 0.1,
        })
        .fromTo(pathToTransform, {
            opacity: 0
        }, {
            opacity: 1,
            duration: 0.1,
        }, '<');
    return tl;
}

if (window.screen.width > 1024 && !/plannings/.test(window.location.href)) {
    createResponsiveTimeline({
        createTimelineFn: fullPageDecorParalax
    })
}


function homeProjectsSlider() {
    if (!document.querySelector('[home-projects-slider]')) return;
    const swiper = new Swiper('[home-projects-slider]', {
        modules: [Navigation],
        slidesPerView: 1.85,
        spaceBetween: 20,
        navigation: {
            nextEl: '[home-projects-slider-next]',
            prevEl: '[home-projects-slider-prev]',
        },
        breakpoints: {
            320: {
                slidesPerView: 1.01,
                spaceBetween: 8,
                centeredSlides: false,
            },
            1024: {
                slidesPerView: 1.85,
                spaceBetween: 20,
                centeredSlides: true,
            },
        },
    });
}
homeProjectsSlider();



function favouritesHandler() {
    const KEY_FAVOURITES = 'favourites';
    const SELECTORS = {
        favouriteButtons: '[data-favourite-button]', //Кнопка-посилання на сторінку обраних з індикатором кількості обраних в середині
        favouriteButtonsTooltip: '[data-favourite-button-tooltip]', // Підказка з кількістю обраних всередині кнопки favouriteButtons
        favouriteCounter: '[data-favourites-counter]', // Додати до елемента в якому відображається кількість обраних
        favouriteSingleButton: '[data-favourite-single-button]', // Додати до кнопки, яка обирає/знімає з обраних data-favourite-single-button="flat-id"
        favouritesButtonTitle: '[data-favourites-button-title]', // Додати до кнопки, яка відображає текст "Додано до обраних" або "ДОДАТИ У ОБРАНІ" data-favourites-button-title="flat-id"
        deleteFromCompare: '[data-delete-from-compare]', //Видалення з обраних найближчого батьківського елемента data-compare-card //data-delete-from-compare='flat-id'
        compareCard: '[data-compare-card]',
    }
    //data-favourites-title data-in-favourites="Додано до порівняння" data-not-in-favourites="ДОДАТИ У ПОРІВНЯННЯ"
    const favouritesButtons = document.querySelectorAll(SELECTORS['favouriteButtons']);
    const favouritesCounter = document.querySelectorAll(SELECTORS['favouriteCounter']);
    const favouritesList = getInitialFavouritesList();
    document.documentElement.getFavouritesList = () => favouritesList;
    updateFavouritesCounterButtons();


    document.body.addEventListener('click', singleFavouriteButtonHandler);
    document.body.addEventListener('click', deleteFromFavourites);
    window.addEventListener('plannings:rendered', updateFavouritesSingleButtons);
    updateFavouritesSingleButtons();

    function updateFavouritesCounterButtons() {
        favouritesButtons.forEach(button => {
            const tooltip = button.querySelector(SELECTORS['favouriteButtonsTooltip']);
            tooltip.textContent = favouritesList.length;
            if (favouritesList.length === 0) {
                button.removeAttribute('data-count');
            } else {
                gsap.timeline()
                    .add(() => {
                        tooltip.classList.add('jello-horizontal');
                        button.setAttribute('data-count', favouritesList.length);
                    })
                    .add(() => {
                        tooltip.classList.remove('jello-horizontal');
                    }, '+=2.5')
            }
        });

        favouritesCounter.forEach(counter => {
            counter.textContent = favouritesList.length;
        });

        pushSingleParam(KEY_FAVOURITES, favouritesList.join(','));
        localStorage.setItem(KEY_FAVOURITES, favouritesList.join(','));
    }

    function updateFavouritesSingleButtons() {
        document.querySelectorAll(SELECTORS['favouriteSingleButton']).forEach(button => {
            const flatId = button.getAttribute(SELECTORS['favouriteSingleButton'].replace(/(\[|\])/g, ''));
            button.classList.toggle('choosed', favouritesList.includes(flatId));
        });
        updateFavouritesTitles();
    }
    function getInitialFavouritesList() {
        const favouriteParam = getUrlParam(KEY_FAVOURITES);
        if (favouriteParam) {
            return favouriteParam.split(',')
                .filter(id => {
                    return id.trim() !== ''
                });
        }
        if (localStorage.getItem(KEY_FAVOURITES)) {
            return localStorage.getItem(KEY_FAVOURITES)
                .split(',')
                .filter(id => {
                    return id.trim() !== '';
                });
        }
        return [];
    }

    function deleteFromFavourites(evt) {
        const target = evt.target.closest(SELECTORS['deleteFromCompare']);
        if (!target) return;
        evt.preventDefault();
        const id = target.getAttribute(SELECTORS['deleteFromCompare'].replace(/(\[|\])/g, ''));
        const index = favouritesList.indexOf(id);
        if (index !== -1) {
            favouritesList.splice(index, 1);
            target.closest(SELECTORS['compareCard']).remove();
            updateFavouritesCounterButtons();
            updateFavouritesTitles();
            window.dispatchEvent(new CustomEvent('favourites:updated', {
                detail: favouritesList
            }));
        }
    }
    function singleFavouriteButtonHandler(evt) {
        const target = evt.target.closest(SELECTORS['favouriteSingleButton']);
        if (!target) return;
        evt.preventDefault();
        evt.stopPropagation();
        const flatId = target.getAttribute(SELECTORS['favouriteSingleButton'].replace(/(\[|\])/g, ''));
        if (favouritesList.includes(flatId)) {
            favouritesList.splice(favouritesList.indexOf(flatId), 1);
            target.classList.remove('choosed');
        } else {
            favouritesList.push(flatId);
            target.classList.add('choosed');
        }
        updateFavouritesCounterButtons();
        updateFavouritesTitles();
    }

    function updateFavouritesTitles() {
        document.querySelectorAll(SELECTORS['favouritesButtonTitle']).forEach(el => {
            const id = el.getAttribute(SELECTORS['favouritesButtonTitle'].replace(/(\[|\])/g, ''));
            if (favouritesList.includes(id)) {
                el.textContent = el.getAttribute('data-in-favourites');
            } else {
                el.textContent = el.getAttribute('data-not-in-favourites');
            }
        })
    }
}

window.addEventListener('load', () => {
    favouritesHandler();
}, {
    once: true
});



function installmentImgRevealHandler() {
    document.querySelectorAll('[data-img-installment]').forEach(el => {
        const imgOverlay = el.querySelector('[data-img-installment-overlay]');
        const img = el.querySelector('img');
        if (!imgOverlay || !img) return;
        gsap.set(imgOverlay, {
            opacity: 0
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: true,
                markers: false,
            }
        })
            .to(imgOverlay, {
                opacity: 1,
                duration: 0.5
            }, '<')
            .to(img, {
                scale: 1.05,
                duration: 0.5
            }, '<');
    })
}
window.addEventListener('load', installmentImgRevealHandler);


function initImageReveal() {
    const revealImages = document.querySelectorAll('[data-image-reveal]');

    revealImages.forEach(container => {
        const cover = container.querySelector('[data-image-cover]');
        const image = container.querySelector('[data-image]');

        // Set initial state
        gsap.set(cover, { autoAlpha: 1 });
        gsap.set(image, { scale: 1.05 });

        // Single ScrollTrigger with onEnter
        ScrollTrigger.create({
            trigger: container,
            start: "top 80%",
            once: true,
            onEnter: () => {
                const tl = gsap.timeline();

                const animate = () => {
                    tl.to(image, {
                        scale: 1,
                        duration: 1.2,
                        ease: "ease-secondary"
                    }, 0).to(cover, {
                        autoAlpha: 0,
                        duration: 0.6
                    }, 0); // simultaneous
                };


                // If image is already loaded, animate immediately
                if (image.complete) {
                    animate();
                } else {
                    // Wait for the image to load before animating
                    image.onload = () => animate();
                }
            }
        });
    });
}
window.addEventListener('load', initImageReveal);




document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('.down-arrow');
    if (!target) return;
    const toSCroll = target.closest('.page__content').children[1];
    toSCroll.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
})


function incredibleBlockParalax() {
    const block = document.querySelector('.incredible-block')
    if (!block) return;
    const logo = block.querySelector('.incredible-block__logo');
    const svg = block.querySelector('.incredible-block__title');
    const slogan = block.querySelector('.incredible-block__slogan');

    const tl = gsap.timeline({
        defaults: {
            ease: 'none',
        },
        scrollTrigger: {
            trigger: block,
            start: window.innerWidth < 1024 ? '180% bottom' : '50% bottom',
            end: window.innerWidth < 1024 ?  '450% bottom' : '200% bottom',
            scrub: true,
            // markers: true,
        }
    })
    .from(logo, {
        y: 100
    })
    .fromTo(svg.querySelectorAll('.ярковиця__Union path'), {
        yPercent: 100,
    }, {
        yPercent: 0,
    })
    .fromTo(slogan.querySelectorAll('div'), {
        autoAlpha: 0,
    }, {
        autoAlpha: 1,
        stagger: {
            amount: 0.5,
        }
    }, '<')

    return tl;
}


window.addEventListener('load', () => {
    createResponsiveTimeline({
        createTimelineFn: incredibleBlockParalax
    });
});


function aboutScreenSwipeImageHandler() {
    const swipeBlock = document.querySelector('[data-mobile-image-swipe]');
    if (!swipeBlock) return;

    const [scrollValue, setScrollValue, subscribeScrollValue] = useState(0);

    const input = swipeBlock.querySelector('[data-mobile-image-swipe-input]');
    const icon = swipeBlock.querySelector('[data-mobile-image-swipe-icon]');
    const image = document.querySelector('[data-mobile-image-swipe-image]');
    const svg = swipeBlock.querySelector('[data-mobile-image-swipe-svg]');
    const svgWidth = svg.getAttribute('viewBox').split(' ')[2];
    const slideSvgButtonRadius = +icon.querySelector('circle').getAttribute('r');

    input.setAttribute('max', image.scrollWidth - window.innerWidth);

    subscribeScrollValue((value) => {
        const scrollWidth = image.scrollWidth - image.clientWidth;
        // image.scrollLeft = value * scrollWidth / 100;
        // icon.style.transform = `translateX(${value * scrollWidth / 100}px)`;
        input.value = value;

        const swipeXoffset = gsap.utils.mapRange(
            0,
            input.getAttribute('max'),
            0, svgWidth - slideSvgButtonRadius * 2,
            value
        );

        // icon.style.transform = `translateX(${value}px)`;
        // icon.setAttribute('transform', `tr
        // anslate(${swipeXoffset - (slideSvgButtonRadius * 2)} ,0)`)
        icon.setAttribute('transform', `translate(${swipeXoffset} ,0)`)
    });

    image.addEventListener('scroll', () => {
        setScrollValue(image.scrollLeft);
    })

    input.addEventListener('input', (e) => {
        const value = e.target.value;
        image.scrollLeft = value;
        setScrollValue(value);

    })
    //data-mobile-image-swipe-icon
    setScrollValue((image.scrollWidth - window.innerWidth) / 2);
    image.scrollLeft = (image.scrollWidth - window.innerWidth) / 2;
}

aboutScreenSwipeImageHandler();


window.addEventListener('load',function(evt){
    document.querySelectorAll('[data-split-lines-new-animation]').forEach((el) => {
        let split = SplitText.create(el, { 
            type: "lines", 
            mask: 'lines', 
            linesClass: "line", 
            position: "absolute",
            reduceWhiteSpace: false,
        });
        gsap.timeline({
            scrollTrigger: {
                trigger: el,
                once: true,
                start: '50% bottom',
            }
        })
            .fromTo(split.lines, {
                y: 100,
            }, {
                y: 0,
                duration: 1.25,
                ease: "power4.out",
                stagger: {
                    amount: 0.25,
                }
            })
            .add(() => {
                split.revert();
            })
    })
});