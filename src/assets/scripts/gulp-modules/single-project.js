import $ from 'jquery';
import Swiper, { EffectFade, Navigation } from 'swiper';
import 'slick-carousel';

import { gsap, ScrollTrigger, CustomEase } from 'gsap/all';
import '../modules/gallery/gallerySlider';
import { createResponsiveTimeline, debounceResize, trackVisibility } from '../modules/helpers/helpers';

gsap.registerPlugin(ScrollTrigger, CustomEase);

window.ScrollTrigger2 = ScrollTrigger;


let $slider = $('.slideshow .slider');
let maxItems = $('.item', $slider).length;
let dragging = false;
let tracking;
let rightTracking;

let $sliderRight = $('.slideshow')
    .clone()
    .addClass('slideshow-right')
    .appendTo($('.split-slideshow'));

let rightItems = $('.item', $sliderRight).toArray();
let reverseItems = rightItems.reverse();
$('.slider', $sliderRight).html('');
for (let i = 0; i < maxItems; i++) {
    $(reverseItems[i]).appendTo($('.slider', $sliderRight));
}

const DELAY = 5000;
const SPEED = 1000;

document.querySelectorAll('[data-front-screen-line-index]').forEach((item, index) => {
    item.setAttribute('data-front-screen-line-index', index);
    if (index == 0) {
        item.classList.add('active');
    }
    //set css property for animation
    item.style.setProperty('--line-time', (DELAY+SPEED)/1000 + 's');
})

$slider.addClass('slideshow-left');
$('.slideshow-left')
    .slick({
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        infinite: true,
        speed: SPEED,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        autoplay: true,
        autoplaySpeed: 5000,
    })
    .on('beforeChange', function (event, slick, currentSlide, nextSlide) {

        document.querySelectorAll('[data-front-screen-line-index]').forEach(item => {
            const index = item.getAttribute('data-front-screen-line-index');
            item.classList.toggle('active', index == nextSlide);
        })
        
        if (currentSlide > nextSlide && nextSlide == 0 && currentSlide == maxItems - 1) {
            $('.slideshow-right .slider').slick('slickGoTo', -1);
            $('.slideshow-text').slick('slickGoTo', maxItems);
        } else if (currentSlide < nextSlide && currentSlide == 0 && nextSlide == maxItems - 1) {
            $('.slideshow-right .slider').slick('slickGoTo', maxItems);
            $('.slideshow-text').slick('slickGoTo', -1);
        } else {
            $('.slideshow-right .slider').slick('slickGoTo', maxItems - 1 - nextSlide);
            $('.slideshow-text').slick('slickGoTo', nextSlide);
        }
    })
    .on('mousewheel', function (event) {
        event.preventDefault();
        if (event.deltaX > 0 || event.deltaY < 0) {
            $(this).slick('slickNext');
        } else if (event.deltaX < 0 || event.deltaY > 0) {
            $(this).slick('slickPrev');
        }
    })
    .on('mousedown touchstart', function () {
        dragging = true;
        tracking = $('.slick-track', $slider).css('transform');
        tracking = parseInt(tracking.split(',')[5]);
        rightTracking = $('.slideshow-right .slick-track').css('transform');
        rightTracking = parseInt(rightTracking.split(',')[5]);
    })
    .on('mousemove touchmove', function () {
        if (dragging) {
            let newTracking = $('.slideshow-left .slick-track').css('transform');
            newTracking = parseInt(newTracking.split(',')[5]);
            let diffTracking = newTracking - tracking;
            $('.slideshow-right .slick-track').css({
                transform: 'matrix(1, 0, 0, 1, 0, ' + (rightTracking - diffTracking) + ')',
            });
        }
    })
    .on('mouseleave touchend mouseup', function () {
        dragging = false;
    });

document.querySelectorAll('[data-front-screen-line-index]').forEach(item => {
    item.addEventListener('click',function(evt){
        const index = item.getAttribute('data-front-screen-line-index');
        $('.slideshow-left').slick('slickGoTo', index)
    });
});

// $('.slick').slick('slickPause');


// $('.slick').slick('slickPlay');

const frontScreenSliderObserver = trackVisibility('.slideshow-left', (action, target) => {
    if (action === 'enter') {
        $('.slideshow-left').slick('slickPlay');
    } else if (action === 'exit') {
        $('.slideshow-left').slick('slickPause');
    }
});



$('.slideshow-right .slider').slick({
    swipe: false,
    vertical: true,
    arrows: false,
    infinite: true,
    
    speed: SPEED - 50,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    initialSlide: maxItems - 1,
});

$('.slick-arrow-up').on('click', function () {
    $('.slideshow-left').slick('slickPrev');
});
$('.slick-arrow-down').on('click', function () {
    $('.slideshow-left').slick('slickNext');
});

function instaIndicator() {
    if (navigator.userAgent.includes('Instagram') && device.iphone()) {
        let screenHeight = screen.height;

        document
            .querySelector('.split-slideshow ')
            .setAttribute('style', 'height:' + screenHeight + 'px');
        document.querySelector('.slideshow ').setAttribute('style', 'height:' + screenHeight + 'px');

        document
            .querySelectorAll('.slider .item')
            .forEach(item => item.setAttribute('style', 'height:' + screenHeight + 'px'));
    }
}

instaIndicator();

function advantagesSliderHandler() {
    const isDesktop = window.innerWidth > 1024;
    
    const SPEED = 1000;
    const gsapSpeed = SPEED / 1000;
    let index = 0;
    const mainSmallSlider = new Swiper('[data-advantages-slider-small]', {
        modules: [Navigation],
        slidesPerView: 3,
        spaceBetween: 20,
        speed: SPEED,
        allowTouchMove: false,
        // preventInteractionOnTransition: true,
        loop: true,
        // loopPreventsSliding: false,
        navigation: isDesktop ?{
            nextEl: '[data-advantages-slider-next]',
            prevEl: '[data-advantages-slider-prev]',
        } : false,
    })
    const largeSlider = new Swiper('[data-advantages-slider-large]', {
        modules: [EffectFade, Navigation],
        slidesPerView: 1,
        loopPreventsSliding: false,
        speed: SPEED,
        
        // preventInteractionOnTransition: true,
        loop: true,
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
        document.querySelectorAll('[data-advantages-slider-all]').forEach(item => {
            item.textContent = mainSmallSlider.slides.length - 2 < 10 ? '0' + (mainSmallSlider.slides.length - 2) : mainSmallSlider.slides.length - 2;
        });
        mainSmallSlider.on('slideChange', function (instance) {
            largeSlider.slideTo(instance.realIndex);
            textSlider.slideTo(instance.realIndex);
            document.querySelectorAll('[data-advantages-slider-current]').forEach(item => {
                item.textContent = instance.realIndex + 1 < 10 ? '0' + (instance.realIndex + 1) : instance.realIndex + 1;
            });
            
        });
        largeSlider.on('slideChangeTransitionStart', function (instance) {
            let direction = instance.realIndex > index ? 'next' : 'prev';
            if (index === 0 && instance.realIndex === mainSmallSlider.slides.length - 1) {
                direction = 'prev';
            }
            if (index === mainSmallSlider.slides.length - 1 && instance.realIndex === 0) {
                direction = 'next';
            }
            index = instance.realIndex;
    
            if (direction === 'next') {
                nextSlide(instance);
            }
            if (direction === 'prev') {
                prevSlide(instance);
            }
            
            
        });
    } else {
        document.querySelectorAll('[data-advantages-slider-all]').forEach(item => {
            item.textContent = mainSmallSlider.slides.length - 2 < 10 ? '0' + (mainSmallSlider.slides.length - 2) : mainSmallSlider.slides.length - 2;
        });
        largeSlider.on('slideChange', (instance) => {
            textSlider.slideTo(instance.realIndex);
            document.querySelectorAll('[data-advantages-slider-current]').forEach(item => {
                item.textContent = instance.realIndex + 1 < 10 ? '0' + (instance.realIndex + 1) : instance.realIndex + 1;
            });
            
        })
    }

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
        y: window.innerWidth > 1024 ? window.innerHeight * -0.5 : -35,
    }, {
        y: window.innerWidth > 1024 ? window.innerHeight * 0.5 : 35,
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
        y: window.innerWidth > 1024 ? -300 : -50,
    }, {
        y: window.innerWidth > 1024 ? 300 : 50,
        ease: 'none',
    })

}
window.addEventListener('load', bigBlocksBgParalax);


function incredibleAnimation() {

    if (window.screen.width <= 1024) return;

    const decor1 = document.querySelector('.single-project-big-block__decor');
    const decor1Img = document.querySelector('.single-project-big-block__decor img');
    const decorHeight = decor1.getBoundingClientRect().height;
    const decorWidth = decor1.getBoundingClientRect().width;
    const block1 = document.querySelector('.single-project-big-block');
    const decor2 = document.querySelector('.home-gallery-screen__decor');
    const decor2Img = document.querySelector('.home-gallery-screen__decor img');
    const block2 = document.querySelector('.home-gallery-screen');
    const decor3 = document.querySelector('.home-characteristics__decor');
    const decor3Img = document.querySelector('.home-characteristics__decor img');
    const block3 = document.querySelector('.home-characteristics');

    const block2AndBlock3XDifference = Math.abs(window.innerWidth * 0.1 - window.innerWidth * 0.5 + (decorWidth * 0.5));
   

    const lastBlock = document.querySelector('.incredible-block__logo');

    const lastBlockWidth = lastBlock.getBoundingClientRect().width;
    const lastBlockAndDecorScaleDifference = lastBlock.getBoundingClientRect().width / decor3.getBoundingClientRect().width;

    gsap.set(lastBlock, {
        opacity: 0,
    })

    const tl1 = gsap.timeline({
        scrollTrigger: {
            trigger: block1,
            endTrigger: block2,
            start: `0% ${decorHeight}px`,
            end: `${decorHeight / 2}px ${decorHeight}px`,
            pin: decor1,
            invalidateOnRefresh: true,
            scrub: true,
            // markers: {
            //     startColor: 'brown',
            //     endColor: 'brown',
            // }
        }
    });
    const tl2 =  gsap.timeline({
        scrollTrigger: {
            trigger: block2,
            endTrigger: block3,
            start: `${decorHeight/2}px ${decorHeight}px`,
            end: `${decorHeight/2*0.69}px ${decorHeight}px`,
            pin: decor2,
            invalidateOnRefresh: true,
            scrub: true,
            // markers: {
            //     startColor: 'yellow',
            //     endColor: 'yellow',
            // }
        }
    })
        .to(decor2Img, {
            x: block2AndBlock3XDifference * -1,
        })
    ;
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: block3,
            endTrigger: lastBlock,
            start: `${decorHeight/ 2}px ${decorHeight}px`,
            end: `${decorHeight * 1.3 / 2 }px ${decorHeight}px`,
            pin: decor3,
            invalidateOnRefresh: true,
            scrub: true,
            // markers: {
            //     startColor: 'green',
            //     endColor: 'green',
            // }
        }
    })
        .to(decor3Img, {
            rotate: 90,
            x: window.innerWidth * 0.4 - lastBlockWidth * 0.35,
            scale: lastBlockAndDecorScaleDifference
        })
    ;

    return [tl1, tl2, tl3];
}

if (window.screen.width > 1024) {
    createResponsiveTimeline({
        createTimelineFn: incredibleAnimation
    });
}
// window.addEventListener('load', incredibleAnimation);