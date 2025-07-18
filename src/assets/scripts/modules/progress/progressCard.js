export function progressCard({ title, date, text, id, img, linkText } = {}) {
    return `
        <div class="progress-card" data-id="${id}">
            <div class="progress-card__delimiter"><svg class="progress-card__delimiter-top" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" fill="#001A58"></circle>
                    <circle cx="8" cy="8" r="4" fill="white"></circle>
                </svg>
                <div class="progress-card__delimiter-center"></div><svg class="progress-card__delimiter-bottom" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="8" fill="#001A58"></circle>
                    <circle cx="8" cy="8" r="4" fill="white"></circle>
                </svg>
            </div>
            <div class="progress-card__img">
                <div class="progress-card__img-inner">
                    <img src="${img}">
                </div>
            </div>
            <div class="progress-card__text">
                <div class="progress-card__text-title">${title} ${date}</div>
                <div class="progress-card__text-text">${text}</div>
                <button class="button-30 button-30--blue">${linkText}</button>
            </div>
        </div>
    `;
    return `

    
    <a class="news-card ${type ? type : 'news'}" href="${href}"><img class="news-card__image" src="./assets/images/home/home-page-screen1.jpg">
        <div class="news-card__text">
            <div class="news-card__label">${typeTitle}</div>
            <div class="news-card__title">${title}</div>
            <p>${text}</p>
            <div class="news-card__date">
                <svg class="icon--calendar" role="presentation">
                    <use xlink:href="#icon-calendar"></use>
                </svg><span>${date}</span>
            </div>
        </div>
    </a>
    `;
}