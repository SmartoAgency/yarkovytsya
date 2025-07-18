const baseFolder = window.location.href.match(/localhost|verstka/) 
? './assets/images/markers/'
: '/wp-content/themes/3d/assets/images/markers/';

const markersAdresses = {
  main: `${baseFolder}main.svg`,
  shop: `${baseFolder}shop.svg`,
  education: `${baseFolder}education.svg`,
  cafe: `${baseFolder}cafe.svg`,
  medicine: `${baseFolder}medicine.svg`,
  sport: `${baseFolder}sport.svg`,
  petrol: `${baseFolder}petrol.svg`,
  bank: `${baseFolder}bank.svg`,
  post: `${baseFolder}post.svg`,
  park: `${baseFolder}park.svg`,
  transport: `${baseFolder}transport.svg`,
};


export async function fetchMarkersData(google) {
    const buildLogoSize = new google.maps.Size(125, 55);
    const sendData = new FormData();
    sendData.append('action', 'infrastructure');

    let formatedMarkersDataForMap = [];
    const markers = await getMarkersFromJson();

    markers.forEach(marker => {      
        formatedMarkersDataForMap.push({
            content: marker.description,
            position: { 
              lat: marker.lat, 
              lng: marker.lng 
            },
            type: marker.category,
            id: marker.id,
            zIndex: 1,
            icon: { url: markersAdresses[marker.category], scaledSize: buildLogoSize }
          })
    })

    return formatedMarkersDataForMap;
}

async function getMarkersFromJson() {
    const url = window.location.href.match(/localhost|verstka/) ? '/static/google-markers.json' : '/wp-content/themes/3d/static/google-markers.json';
    const response = await fetch(url, {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}

