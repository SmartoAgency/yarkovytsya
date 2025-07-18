import axios from "axios";

export default async function getProgress(id, sections = []) {

    if (document.documentElement.dataset.status==="local") {
        return Promise.resolve({
            data: {
                title: '25 Серпня 2023 р.'+new Date().getTime(),
                text: 'Монтаж ліфтів Продовжується влаштування систем опалення, вентиляції, водопроводу, каналізації та електрики. Проходять фасадні роботи на торцях. Влаштування утеплення на балконах.',
                gallery: [],
            }
        })
    }

    const fd = new FormData();
    fd.append('action', 'construction');
    fd.append('id', id);

    sections.forEach((el, index) => {
        fd.append(`sections[${index}]`, el);
    })

    return axios.post('/wp-admin/admin-ajax.php', fd);
}





export function getProgressList({ type, sections = [] }) {
    if (document.documentElement.dataset.status === 'local') {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                data: [
                    {
                        title: 'хід будівництва', 
                        img: 'http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/06/1840x640.webp', 
                        id: 15055151,
                        linkText: 'Детальніше',
                        title: new Date().getTime(),
                        date: '30.07.2023',
                        text: 'Монтаж ліфтів Продовжується влаштування систем опалення, вентиляції, водопроводу, каналізації та електрики. Проходять фасадні роботи на торцях. Влаштування утеплення на балконах.',
                        gallery: [],
                    },
                    {
                        title: 'хід будівництва', 
                        img: './assets/images/home/home-page-screen1@05x.jpg', 
                        id: 15055151,
                        linkText: 'Детальніше',
                        title: new Date().getTime(),
                        date: '30.07.2023',
                        text: 'Монтаж ліфтів Продовжується влаштування систем опалення, вентиляції, водопроводу, каналізації та електрики. Проходять фасадні роботи на торцях. Влаштування утеплення на балконах.',
                        gallery: [],
                    }
                ]
            })
            }, 1000)
        })
    }

    const fd = new FormData();
    fd.append('action', 'constructionList');
    fd.append('type', type);

    sections.forEach((el, index) => {
        fd.append(`sections[${index}]`, el);
    })
    
    return axios.post('/wp-admin/admin-ajax.php', fd);
}