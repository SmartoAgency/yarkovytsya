import $ from 'jquery';
import Swiper, { EffectFade, Navigation } from 'swiper';

import { gsap, ScrollTrigger, CustomEase } from 'gsap/all';
import '../modules/gallery/gallerySlider';
import { createResponsiveTimeline, debounceResize, trackVisibility } from '../modules/helpers/helpers';

gsap.registerPlugin(ScrollTrigger, CustomEase);

window.ScrollTrigger2 = ScrollTrigger;




function advantagesSliderHandler() {
    const isDesktop = window.innerWidth > 1024;
    
    const SPEED = 1000;
    const gsapSpeed = SPEED / 1000;
    let index = 0;
    let direction = 'next';
    document.querySelector('[data-advantages-slider-next]').addEventListener('click', () => {
        direction = 'next';
    });
    document.querySelector('[data-advantages-slider-prev]').addEventListener('click', () => {
        direction = 'prev';
    });
    const mainSmallSlider = new Swiper('[data-advantages-slider-small]', {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 20,
        speed: SPEED,
        allowTouchMove: false,
        slideToClickedSlide: true,
        loop: true,
        navigation: isDesktop ?{
            nextEl: '[data-advantages-slider-next]',
            prevEl: '[data-advantages-slider-prev]',
        } : false,
    })
    const largeSlider = new Swiper('[data-advantages-slider-large]', {
        modules: [EffectFade, Navigation],
        slidesPerView: 1,
        // loopPreventsSliding: false,
        speed: SPEED,
        
        // preventInteractionOnTransition: true,
        // loop: true,
        effect: 'fade',
        simulateTouch: false,
        allowTouchMove: false,
        on: {
            destroy: function () {
                
            }
        },
        navigation: isDesktop ? false : {
            nextEl: '[data-advantages-slider-next]',
            prevEl: '[data-advantages-slider-prev]',
        },
        fadeEffect: {
            crossFade: true
        }
    });
    
    const textSlider = new Swiper('[data-advantages-slider-texts]', {
        modules: [EffectFade],
        slidesPerView: 1,
        // loopPreventsSliding: false,
        loop: true,
        speed: SPEED,
        simulateTouch: false,
        
        allowTouchMove: false,
        // preventInteractionOnTransition: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
    });

    if (isDesktop) {
        // document.querySelectorAll('[data-advantages-slider-all]').forEach(item => {
        //     item.textContent = mainSmallSlider.slides.length - 2 < 10 ? '0' + (mainSmallSlider.slides.length - 2) : mainSmallSlider.slides.length - 2;
        // });
        mainSmallSlider.on('slideChange', function (instance) {
            setTimeout(() => {
                const nextIndex = document.querySelector('[data-advantages-slider-small] .swiper-slide-active').getAttribute('data-real-index');
    
                largeSlider.slideTo(nextIndex);
                textSlider.slideTo(nextIndex);
                document.querySelectorAll('[data-advantages-slider-current]').forEach(item => {
                    item.textContent = +nextIndex + 1 < 10 ? '0' + (+nextIndex + 1) : +nextIndex + 1;
                });
                
            }, 100);
        });
        largeSlider.on('slideChangeTransitionStart', function (instance) {
    
            if (direction === 'next') {
                nextSlide(instance);
            }
            if (direction === 'prev') {
                prevSlide(instance);
            }
            
            
        });
    } else {
        // document.querySelectorAll('[data-advantages-slider-all]').forEach(item => {
        //     item.textContent = mainSmallSlider.slides.length - 2 < 10 ? '0' + (mainSmallSlider.slides.length - 2) : mainSmallSlider.slides.length - 2;
        // });
        largeSlider.on('slideChange', (instance) => {
            textSlider.slideTo(instance.realIndex);
            document.querySelectorAll('[data-advantages-slider-current]').forEach(item => {
                item.textContent = instance.realIndex + 1 < 10 ? '0' + (instance.realIndex + 1) : instance.realIndex + 1;
            });
            
        })
    }

    textSlider.on('transitionStart', () => {
        document.querySelectorAll('.advantages-slider, [data-advantages-slider-prev], [data-advantages-slider-next]').forEach(item => {
            item.style.cursor = 'wait';
        });
    })
    textSlider.on('slideChangeTransitionEnd', () => {
        document.querySelectorAll('.advantages-slider, [data-advantages-slider-prev], [data-advantages-slider-next]').forEach(item => {
            item.removeAttribute('style');
        });
    })

    function nextSlide(instance) {
        const prevElement = instance.slidesEl.querySelector('.swiper-slide-prev') ? 
            instance.slidesEl.querySelector('.swiper-slide-prev') : 
            instance.slidesEl.querySelectorAll('.swiper-slide')[instance.slides.length - 1];
        const currentElement = instance.slidesEl.querySelector('.swiper-slide-active');
        const smallSliderSlideHeight = mainSmallSlider.slides[0].getBoundingClientRect().height;
        const scale = smallSliderSlideHeight / currentElement.getBoundingClientRect().height;


        gsap.timeline({
            onComplete: function () {
                gsap.set(prevElement.querySelector('img'), {
                    scale: 1,
                })
                gsap.set([prevElement.querySelector('.advantages-slider__large-item'), currentElement.querySelector('img')], {
                    xPercent: 0,
                })
            },
            defaults: {
                ease: 'none',
            },
        })
            .set([prevElement, currentElement], {
                opacity: 1,
            })
            .to(prevElement.querySelector('img'), {
                scale: scale,
                duration: gsapSpeed / 4,
                transformOrigin: 'left top',
            }, '<')
            .to(prevElement.querySelector('.advantages-slider__large-item'), {
                xPercent: -100,
                duration: gsapSpeed / 2,
            })
            .fromTo(currentElement.querySelector('img'), {
                xPercent: 100
            }, {
                xPercent: 0,
                duration: gsapSpeed / 4,
            }, '<')
            .set(prevElement, {
                opacity: 0,
            })
    }
    function prevSlide(instance) {
        const prevElement = instance.slidesEl.querySelector('.swiper-slide-next') ? 
            instance.slidesEl.querySelector('.swiper-slide-next') : 
            instance.slidesEl.querySelectorAll('.swiper-slide')[0];
        const currentElement = instance.slidesEl.querySelector('.swiper-slide-active');
        const smallSliderSlideWidth = mainSmallSlider.slides[0].getBoundingClientRect().width;
        const smallSliderSlideHeight = mainSmallSlider.slides[0].getBoundingClientRect().height;
        const scale = smallSliderSlideHeight / currentElement.getBoundingClientRect().height;        
        gsap.timeline({
            onComplete: function () {
                gsap.set(prevElement.querySelector('img'), {
                    xPercent: 0,
                })
                gsap.set(currentElement.querySelector('img'), {
                    scale: 1,
                })
            },
            defaults: {
                ease: 'none',
            },
        })
            .set([prevElement, currentElement], {
                opacity: 1,
                transition: 'none',
            })
            .to(prevElement.querySelector('img'), {
                xPercent: 100,
                duration: gsapSpeed / 4,
                transformOrigin: 'left top',
            }, '<')
            .fromTo(currentElement.querySelector('img'), {
                scale: scale,
            }, {
                scale: 1,
                duration: gsapSpeed / 4,
                transformOrigin: 'left top',
            }, '<')
            // .fromTo(currentElement.querySelector('.advantages-slider__large-item'), {
            //     xPercent: -100,
                
            // }, {
            //     xPercent: 0,
            //     duration: gsapSpeed / 2,

            // })
            .set(prevElement, {
                opacity: 0,
            })
    }

    return { 
        mainSmallSlider,
        largeSlider,
        textSlider
    };
}

// window.addEventListener('load', advantagesSliderHandler, {
//     once: true
// });

let advantagesSliders = advantagesSliderHandler();

window.addEventListener('resize', debounceResize(() => {
    advantagesSliders.mainSmallSlider.destroy();
    advantagesSliders.largeSlider.destroy();
    advantagesSliders.textSlider.destroy();
    advantagesSliders = advantagesSliderHandler();
}, 1000))



function singleProjectConstructionSlider() {
    const slider = new Swiper('[data-single-project-construction-slider]', {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 20,
        navigation: {
            nextEl: '[data-single-project-construction-slide-next]',
            prevEl: '[data-single-project-construction-slide-prev]',
        },
        breakpoints: {
            320: {
                slidesPerView: 1.05,
                spaceBetween: 6,
            },
            601: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1025: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        }
    })
}
window.addEventListener('load', singleProjectConstructionSlider);

function bigBlocksBgParalax() {
    const block1 = document.querySelector('.single-project-big-block');
    const block1Bg = document.querySelector('.single-project-big-block__bg img');

    gsap.timeline({
        scrollTrigger: {
            trigger: block1,
            invalidateOnRefresh: true,
            scrub: true
        }
    })
    .fromTo(block1Bg, {
        y: window.innerWidth > 1024 ? window.innerHeight * -0.2 : -35,
    }, {
        y: window.innerWidth > 1024 ? window.innerHeight * 0.2 : 35,
        ease: 'none',
    })
    const block2 = document.querySelector('.single-project-big-block2');
    const block2Bg = document.querySelector('.single-project-big-block2__bg img');

    gsap.timeline({
        scrollTrigger: {
            trigger: block2,
            invalidateOnRefresh: true,
            scrub: true
        }
    })
    .fromTo(block2Bg, {
        y: window.innerWidth > 1024 ? -100 : -35,
    }, {
        y: window.innerWidth > 1024 ? 100 : 35,
        ease: 'none',
    })
    const block3 = document.querySelector('.single-project-big-block3');
    const block3Bg = document.querySelector('.single-project-big-block3__bg img');

    gsap.timeline({
        scrollTrigger: {
            trigger: block3,
            invalidateOnRefresh: true,
            scrub: true
        }
    })
    .fromTo(block3Bg, {
        y: window.innerWidth > 1024 ? -100 : -50,
    }, {
        y: window.innerWidth > 1024 ? 100 : 50,
        ease: 'none',
    })

}
window.addEventListener('load', bigBlocksBgParalax);



// window.addEventListener('load', incredibleAnimation);

function incredibleSlider() {
    let currentIndex = 0;
    let isAnimating = false;
    const container = document.querySelector('.incredible-slider');
    let images = container.getAttribute('data-images').split(',');

    if (images.length % 2 !== 0) {
        images.push(images[images.length - 1]);
    }
    let rightImages = images.filter((el,index) => index % 2 === 0);
    let leftImages = images.filter((el,index) => index % 2 !== 0);

    if (window.innerWidth < 1024) {
        rightImages = images;
        leftImages = images;
    }

    const leftSide = container.querySelector('.incredible-slider__left');
    const rightSide = container.querySelector('.incredible-slider__right');
    const clonedItem = leftSide.querySelector('.incredible-slider__item').cloneNode(true);

    leftSide.querySelector('img').src = leftImages[0];
    rightSide.querySelector('img').src = rightImages[0];

    function animateLeft(nextImage, onFinish) {
        const currentItem = leftSide.querySelector('.incredible-slider__item');
        const forAnimation = clonedItem.cloneNode(true);
        forAnimation.querySelector('img').src = nextImage;
        gsap.set(forAnimation, {
            yPercent: -100
        });
        leftSide.appendChild(forAnimation);
        isAnimating = true;
        gsap.timeline({

        })
            .fromTo(currentItem, {
                yPercent: 0,
            }, {
                yPercent: 100,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentItem.remove();
                }
            })
            .fromTo(forAnimation, {
                yPercent: -100,
            }, {
                yPercent: 0,
                duration: 1,
                ease: 'power2.inOut',
            }, '<')
            .add(() => {
                onFinish();
                isAnimating = false;
            });
    }
    function animateRight(nextImage, onFinish) {
        const currentItem = rightSide.querySelector('.incredible-slider__item');
        const forAnimation = clonedItem.cloneNode(true);
        forAnimation.querySelector('img').src = nextImage;
        gsap.set(forAnimation, {
            yPercent: 100
        });
        rightSide.appendChild(forAnimation);

        gsap.timeline({

        })
            .fromTo(currentItem, {
                yPercent: 0,
            }, {
                yPercent: -100,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentItem.remove();
                }
            })
            .fromTo(forAnimation, {
                yPercent: 100,
            }, {
                yPercent: 0,
                duration: 1,
                ease: 'power2.inOut',
            }, '<');
    }
    function animate(nextIndex, onFinish = () => {}) {
        if (!leftImages[nextIndex]) {
            console.warn('No image found for index:', nextIndex);
        }
        if (isAnimating) return;
        animateLeft(leftImages[nextIndex], onFinish);
        animateRight(rightImages[nextIndex], onFinish);
    }
    function getNextIndex() {
        currentIndex = (currentIndex + 1) % rightImages.length;
        return currentIndex;
    }
    function getPreviousIndex() {
        currentIndex = (currentIndex - 1 + rightImages.length) % rightImages.length;
        return currentIndex;
    }

    function goForward() {
        const nextIndex = getNextIndex();
        animate(nextIndex);
    }
    function goBackward() {
        const prevIndex = getPreviousIndex();
        animate(prevIndex);
    }
    function goTo(index, onFinish = () => {}) {
        if (index < 0 || index >= rightImages.length) {
            console.warn('Invalid index:', index);
            return;
        }
        currentIndex = index;
        animate(currentIndex, onFinish);
    }

    return {
        images,
        getCurrentIndex: () => currentIndex,
        getNextIndex,
        getPreviousIndex,
        goForward,
        goBackward,
        getMaxIndex: () => rightImages.length - 1,
        goTo
    }
}

const incredibleSliderInstance = incredibleSlider();

let timeout = null;

if (incredibleSliderInstance.getMaxIndex() > 0) {
    autoplay();
}

if (window.innerWidth > 1024) {
    document.querySelectorAll('[data-front-screen-line-index]').forEach((item,index) => {
        const thisIndex = item.getAttribute('data-front-screen-line-index');
        if (+thisIndex > incredibleSliderInstance.getMaxIndex()) {
            item.remove();
        }
    });
}

document.body.addEventListener('click',function(evt){
    const target = evt.target.closest('[data-front-screen-line-index]');
    if (!target) return;
    clearTimeout(timeout);
    const index = target.getAttribute('data-front-screen-line-index');
    document.querySelectorAll('[data-front-screen-line-index]').forEach(item => {
        item.classList.remove('active');
        //set css var
        item.style.setProperty('--line-time', '5s');
    });
    target.classList.add('active');
    incredibleSliderInstance.goTo(index, () => {
        // autoplay();
    });
});


function autoplay() {
    timeout = setTimeout(() => {
        incredibleSliderInstance.goForward();
        const index = incredibleSliderInstance.getCurrentIndex();
        document.querySelectorAll('[data-front-screen-line-index]').forEach(item => {
            item.classList.remove('active');
            //set css var
            item.style.setProperty('--line-time', '5s');
        });
        document.querySelector(`[data-front-screen-line-index="${index}"]`).classList.add('active');
        if (incredibleSliderInstance.getMaxIndex() > 0) {
            autoplay();
        }
    }, 5000);
}



function newsSliderHandler() {
    new Swiper('[data-news-slider]', {
        slidesPerView: 1,
        spaceBetween: 60,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            601: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1025: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
        },
        navigation: {
            nextEl: '[data-news-slider-next]',
            prevEl: '[data-news-slider-prev]',
        },
    });
}

newsSliderHandler();
