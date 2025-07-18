export function newsCard({ type, typeTitle, title, date, text, href, image } = {}) {
    return `
    
    <a class="news-card ${type ? type : 'news'}" href="${href}"><img class="news-card__image" src="${image}">
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