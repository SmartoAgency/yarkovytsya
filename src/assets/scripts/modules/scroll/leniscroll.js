// eslint-disable-next-line import/no-extraneous-dependencies
import Lenis from '@studio-freight/lenis';

export const lenis = new Lenis()

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
const date = new Date().getTime();

lenis.on('scroll', (e) => {
    // console.log(date);
  });

if (!document.documentElement.classList.contains('mobile')) {
    requestAnimationFrame(raf)
}
if (document.documentElement.classList.contains('mobile')) {
    lenis.destroy();
}