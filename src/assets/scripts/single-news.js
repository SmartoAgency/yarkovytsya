import gsap from 'gsap';
import Swiper, { Navigation } from 'swiper';
gsap.registerPlugin(ScrollTrigger);


document.querySelector('[data-gallery="all"]').textContent = padNumber(document.querySelectorAll('[data-single-construction-slider] .swiper-slide').length);

const slider = new Swiper('[data-single-construction-slider]', {
    modules: [Navigation],
    loop: true,
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
        nextEl: '[data-gallery="next"]',
        prevEl: '[data-gallery="prev"]',
    },
});

function padNumber(num) {
    return num < 10 ? `0${num}` : num;
}

slider.on('slideChange', function (swiper) {
    const currentSlide = padNumber(swiper.realIndex + 1);
    document.querySelector('[data-gallery="current"]').textContent = currentSlide;
})

function initVideo() {
    if (!document.querySelector('[data-construction-video]')) return;
    const video = document.querySelector('[data-construction-video]');
    const playButton = document.querySelector('[data-construction-video-play]');
    playButton.addEventListener('click', function () {
        video.play();
        video.setAttribute('controls', '');
        // video.removeAttribute('poster');
        this.classList.add('hidden');
    });

    video.addEventListener('pause',function(evt){
        playButton.classList.remove('hidden');
    });
    video.addEventListener('play',function(evt){
        playButton.classList.add('hidden');
    });
    video.addEventListener('ended',function(evt){
        playButton.classList.remove('hidden');
    });
}

initVideo();


function frontScreenParalax() {
    if (window.screen.width < 1024) return;
    const screen = document.querySelector('.inner-front-screen__bg');
    const img = document.querySelector('.inner-front-screen__bg img');
    if (!screen || !img) return;

    gsap.timeline({
        scrollTrigger: {
            trigger: screen,
            start: 'top top',
            scrub: true,
            endTrigger: '.single-construction',
            end: 'bottom top',
        }
    })
    .fromTo(img, {
        y:0,
        scale: 1
    }, {
        y: window.innerHeight,
        scale: 1.2,
    }, 0)
}

window.addEventListener('load', frontScreenParalax)