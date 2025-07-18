import axios from "axios";

export default async function getNews(type) {
    if (document.documentElement.dataset.status === 'local') {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                data: 
                    [
                        {
                            href: '/single-news',
                            type: 'promotion', 
                            typeTitle: 'Акція',
                            image: "./assets/images/home/home-front-screen-bg.jpg",
                            title: 'News title', 
                            date: '20.09.2023', 
                            text: 'Гарна новина! Розпочато продаж квартир у 7 секції в ЖК Щасливий у Дніпрі. Встигніть забронювати квартири площею від 40.7 м2 за кращою ціною.',
                        },
                        {
                            href: '/single-news',
                            type: 'news', 
                            typeTitle: 'Новина',
                            image: "./assets/images/home/home-front-screen-bg.jpg",
                            title: `News title ${Math.floor(Math.random() * 100)}`, 
                            date: '20.10.2023', 
                            text: 'Гарна новина! Розпочато продаж квартир у 7 секції в ЖК Щасливий у Дніпрі. Встигніть забронювати квартири площею від 40.7 м2 за кращою ціною.',
                        },
                        {
                            href: '/single-news',
                            type: 'news',
                            typeTitle: 'Новина',
                            image: "./assets/images/home/home-front-screen-bg.jpg",
                            title: 'News title 2', 
                            date: '20.11.2023', 
                            text: 'Гарна новина! Розпочато продаж квартир у 7 секції в ЖК Щасливий у Дніпрі. Встигніть забронювати квартири площею від 40.7 м2 за кращою ціною.',
                        },
                    ]
            })
            }, 1000)
        })
    }
    const fd = new FormData();
    fd.append('action', 'news');
    fd.append('type', type);

    return axios.post('/wp-admin/admin-ajax.php', fd);
}