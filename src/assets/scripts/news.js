const { useState } = require("./modules/helpers/helpers");

console.log('news');

const [state, setState, subscribe] = useState(new Set());


subscribe((value) => {
    console.log('state changed', value);
    
});

document.body.addEventListener('click', (evt) => {
    const target = evt.target.closest('[data-news-button]')
    if (!target) return;
    
    if (target.classList.contains('active')) {
        const newState = new Set(state());
        newState.delete(target.dataset.newsButton);
        setState(newState);
        target.classList.remove('active');
    } else {
        const newState = new Set(state());
        newState.add(target.dataset.newsButton);
        setState(newState);
        target.classList.add('active');
    }

})

const newsContainer = document.querySelector('.news-list');