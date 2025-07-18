import axios from "axios"

export function getGallerySlider(id) {
    if (document.documentElement.dataset.status === 'local') {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                data: {
                    title: 'Gallery slider'+Math.random(),
                    gallery: ['./assets/images/home/home-page-screen1.jpg', './assets/images/home/home-page-screen1.jpg', './assets/images/home/home-page-screen1.jpg', './assets/images/home/home-page-screen1.jpg'],
                    miniFlatImage: './assets/images/home/home-page-screen1.jpg',
                } 
                    
            })
            }, 1000)
        })
    }
    const fd = new FormData();
    fd.append('device', document.documentElement.classList.contains('mobile') ? 'mobile' : 'desktop');
    fd.append('action', 'singleGallery');
    fd.append('id', id);
    return axios.post('/wp-admin/admin-ajax.php', fd);
}


export function getGalleryList() {
    if (document.documentElement.dataset.status === 'local') { 
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
              resolve({
                data: {
                    gallery_list: [{"type":"1","type_gallery":"gallery","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/Garderob-1.jpg"}],"img":false},{"type":"2","type_gallery":"gallery","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":false},{"type":"3","type_gallery":"gallery","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":false},{"type":"5","type_gallery":"secret","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"type":"6","type_gallery":"secret","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"type":"7","type_gallery":"secret","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"type":"8","type_gallery":"secret","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"},{"type":"9","type_gallery":"secret","gallery":[{"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}],"img":"http://happy-dnipro-wp.smarto.com.ua/wp-content/uploads/2023/07/home-page-screen1-1.jpg"}]
                } 
                    
            })
            }, 1000)
        })
    }
    const fd = new FormData(); fd.append('action', 'gallery');
    fd.append('device', document.documentElement.classList.contains('mobile') ? 'mobile' : 'desktop');
    return axios.post('/wp-admin/admin-ajax.php', fd);
}
