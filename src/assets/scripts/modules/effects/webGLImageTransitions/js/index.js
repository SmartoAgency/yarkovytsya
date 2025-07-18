
import Swiper, { EffectFade } from "swiper";
import "./dat-gui.js";
import "./gsap.js";
import { Sketch } from "./sketch.js";
import { trackVisibility } from "../../../helpers/helpers.js";

const swiper = new Swiper('[data-home-screen-text-slider]', {
    modules: [EffectFade],
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    speed: 1000,
});

const lines = document.querySelectorAll('[data-front-screen-line-index]');

let timeout = null;
const DELAY = 5000;


let sketch = new Sketch({
	duration: 1.5,
	debug: false,
    onStartTransition: (current) => {
        swiper.slideTo(current);
        if (timeout) {
            clearTimeout(timeout);
        }
    },
    onCompleteCb: (current) => {
        lines.forEach((line, index) => {
            line.classList.remove('active');
            //set css property for animation
            line.style.setProperty('--line-time', `${DELAY}ms`);
            if (index === current) {
                line.classList.add('active');
            }
        });
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            sketch.next();
        }, DELAY);
    },
    onInit: () => {
        const current = 0;
        lines.forEach((line, index) => {
            line.classList.remove('active');
            //set css property for animation
            line.style.setProperty('--line-time', `${DELAY}ms`);
            if (index === current) {
                line.classList.add('active');
            }
        });
        timeout = setTimeout(() => {
            sketch.next();
        }, DELAY);
    },
	easing: 'easeOut',
	uniforms: {
		// width: {value: 0.35, type:'f', min:0., max:1},
	},
	fragment: `
		uniform float time;
		uniform float progress;
		uniform float width;
		uniform float scaleX;
		uniform float scaleY;
		uniform float transition;
		uniform float radius;
		uniform float swipe;
		uniform sampler2D texture1;
		uniform sampler2D texture2;
		uniform sampler2D displacement;
		uniform vec4 resolution;

		varying vec2 vUv;
		varying vec4 vPosition;
		vec2 mirrored(vec2 v) {
			vec2 m = mod(v,2.);
			return mix(m,2.0 - m, step(1.0 ,m));
		}

		void main()	{
		  vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
		  vec4 noise = texture2D(displacement, mirrored(newUV+time*0.04));
		  // float prog = 0.6*progress + 0.2 + noise.g * 0.06;
		  float prog = progress*0.8 -0.05 + noise.g * 0.06;
		  float intpl = pow(abs(smoothstep(0., 1., (prog*2. - vUv.x + 0.5))), 10.);
		  
		  vec4 t1 = texture2D( texture1, (newUV - 0.5) * (1.0 - intpl) + 0.5 ) ;
		  vec4 t2 = texture2D( texture2, (newUV - 0.5) * intpl + 0.5 );
		  gl_FragColor = mix( t1, t2, intpl );

		}

	`
});


trackVisibility('#slider', (status, target) => {
    console.log('trackVisibility', status, target);
    
    if (status === 'enter') {
        // sketch.init();
        sketch.play();
        timeout = setTimeout(() => {
            sketch.next();
        }, DELAY);
    } else if (status === 'exit') {
        sketch.stop();
        clearTimeout(timeout);
    }
});


window.addEventListener('load', () => {
    if (isElementInViewport(document.querySelector('#slider')) === false) {
        sketch.stop();
        clearTimeout(timeout);
    }
}, { once: true})


function isElementInViewport (el) {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
}