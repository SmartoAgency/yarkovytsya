import Swiper, { Mousewheel, Navigation } from 'swiper';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from "gsap/SplitText";
import { pad, trackVisibility, useState } from './modules/helpers/helpers';
import './modules/effects/webGLImageTransitions/js/index';
// const header = document.querySelector('.header');

// const headroom = new Headroom(header, {});
// headroom.init();

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.core.globals('ScrollTrigger', ScrollTrigger);
gsap.core.globals('SplitText', SplitText);

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

Swiper.use([Mousewheel, Navigation]);

document.querySelectorAll('.down-arrow').forEach((el) => {
    el.addEventListener('click', (evt) => {
        evt.preventDefault();
        document.querySelector('.screen2').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    });
})


function homeDeveloperAnimations() {
    const container = document.querySelector('[data-home-developer]');
    if (!container) return;
    const topDecor = container.querySelector('[data-home-developer-top-decor]');
    const bottomDecor = container.querySelector('[data-home-developer-bottom-decor]');
    const bg = container.querySelector('[data-home-developer-bg]');


    gsap.timeline({
        scrollTrigger: {
            trigger: container,
            scrub: 1,
        }
    })
    .fromTo(bg, {
        y: -100
    }, {
        y: 100
    })
    gsap.timeline({
        scrollTrigger: {
            trigger: container,
            end: '20% top',
            scrub: 1,
        }
    })
    .fromTo(topDecor, {
        y: 0
    }, {
        y: window.innerHeight * 0.054
    })
    gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: '80% bottom',
            end: '100% top',
            scrub: 1,
        }
    })
    .fromTo(bottomDecor, {
        y: 0
    }, {
        y: window.screen.width > 600 ? window.innerHeight * 0.4 : 70
    })
}

homeDeveloperAnimations();


homeDeveloperSlider();
function homeDeveloperSlider() {
    new Swiper('[data-not-desktop-developer-swiper]', {
        slidesPerView: 1.2,
        spaceBetween: 60,
        breakpoints: {
            320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
            },
            601: {
                slidesPerView: 1.2,
                spaceBetween: 60,
            },
        },
    });
}



function homepageVideo() {
    const video = document.querySelector('[data-homepage-video]');
    const tracker = trackVisibility('[data-homepage-video]', (event) => {
        if (event === 'enter') {
            video.play();
        } else {
            video.pause();
        }
    });

    const videoBlock = document.querySelector('[data-home-videoblock]');
    const decor = document.querySelector('[data-video-block-decor]');
    if (!videoBlock) return;
    gsap.timeline({
        scrollTrigger: {
            trigger: videoBlock,
            start: '20% bottom',
            once: true,
        }
    })
    .fromTo(decor.querySelector('svg'), {
        yPercent: 100,
    }, {
        yPercent: 0,
        duration: 1.25,
        ease: "power4.out",
    })
}

window.addEventListener('load', homepageVideo);


function frontScreenParalax() {
    const frontScreen = document.querySelector('.home-front-screen');
    if (!frontScreen) return;
    const bg = frontScreen.querySelector('.home-front-screen__bg');
    const content = frontScreen.querySelector('.home-front-screen__content');
    const overlay = frontScreen.querySelector('.home-front-screen__overlay');

    const start = window.screen.width > 600 ? '100% bottom' : `${window.innerHeight * 1.2} bottom`;

    gsap.timeline({
        scrollTrigger: {
            trigger: frontScreen,
            start: start,
            end: '200% bottom',
            scrub: true,
        }
    })
    .fromTo(content, {
        y: 0
    }, {
        y: window.innerHeight * -0.05
    })
    .fromTo(bg, {
        y: 0
    }, {
        y: 250
    },'<')
    .fromTo(overlay, {
        opacity: 0
    }, {
        opacity: 0.6,
    }, '<')
}

window.addEventListener('load', frontScreenParalax);


function incredibleBlockParalax() {
    const block = document.querySelector('.incredible-block')
    if (!block) return;
    const logo = block.querySelector('.incredible-block__logo');
    const svg = block.querySelector('.incredible-block__title');
    const slogan = block.querySelector('.incredible-block__slogan');

    gsap.timeline({
        defaults: {
            ease: 'none',
        },
        scrollTrigger: {
            trigger: block,
            start: '50% bottom',
            end: '200% bottom',
            scrub: true,
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
}
window.addEventListener('load', incredibleBlockParalax);


function homeDeveloperCirclesDesktop() {
    if (window.screen.width < 1024) return;
    const circles = document.querySelectorAll('.home-developer__circle');
    if (!circles.length) return;
    circles.forEach((circle) => {
        gsap.set(circle.querySelector('.home-developer__circle-img-wrap img'), {
            scale: 1.1
        })
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: circle,
                scrub: true,
            }
        });
        tl.fromTo(circle.querySelector('.home-developer__circle-img-wrap img'), {
            y: -30,
        }, {
            y: 30,
        });
    });
}
window.addEventListener('load', homeDeveloperCirclesDesktop);