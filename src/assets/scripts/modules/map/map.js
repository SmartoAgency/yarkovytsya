import { fetchMarkersData } from "./getMarkers";
import mapStyle from "./map-style";

export default function googleMap() {
  global.initMap = initMap
}

const MAP_PARAMS = {
  zoom: 10,
  scrollwheel: false,
  navigationControl: false,
  mapTypeControl: false,
  scaleControl: false,
  draggable: true,
  // gestureHandling: 'cooperative',
  language: document.documentElement.getAttribute('lang') || 'en',
  styles: mapStyle()
}

const CENTER = {
    "lat": 50.79661050526192, "lng": 30.36764581724879
}

const baseFolder = window.location.href.match(/localhost|verstka/)
  ? './assets/images/markers/'
  : '/wp-content/themes/3d/assets/images/markers/';

async function startLoadGoogleMap() {
  const script = document.createElement('script');
  let key = document.documentElement.dataset.key ? document.documentElement.dataset.key : '';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap&language=${document.documentElement.getAttribute('lang')}&libraries=marker`;
  document.getElementsByTagName('head')[0].appendChild(script);
}


const maps = document.querySelectorAll('.map');

maps.forEach(($map) => {
  // if (window.location.href.match(/localhost/)) return;
  const callback = (entries, observer) => {
    /* Content excerpted, show below */
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve($map);
        startLoadGoogleMap();
      }
    });
  };
  const observer = new IntersectionObserver(callback, {
    rootMargin: '0px',
    threshold: 0.1,
  });
  observer.observe($map);
});

window.initMap = initMap;

function initMap() {
  const gmarkers1 = [];
  const center = {
    "lat": 50.79661050526192, "lng": 30.36764581724879
  };
  /** Массив, куда записываются выбраные категории */
  let choosedCategories = new Set();
  choosedCategories.add('main');
  /** Елементы, при клике на который будет происходить фильтрация */
  const filterItems = document.querySelectorAll('[data-marker]');
  const map = new google.maps.Map(document.getElementById('map'), {
    ...MAP_PARAMS,
    center: CENTER,
  });

  window.googleMap = map;
  const gDistanceMarkers = [];

  // gDistanceMarkers.push(iniCircleWithTooltip({
  //   map,
  //   radius: 500,
  //   tooltipImgUrl: `${baseFolder}500m.svg`,
  //   center
  // }))
  // gDistanceMarkers.push(iniCircleWithTooltip({
  //   map,
  //   radius: 1000,
  //   tooltipImgUrl: `${baseFolder}1km.svg`,
  //   center
  // }));

  // gDistanceMarkers.push(iniCircleWithTooltip({
  //   map,
  //   radius: 1500,
  //   tooltipImgUrl: `${baseFolder}1_5km.svg`,
  //   center
  // }));

  // google.maps.event.addDomListener(window, "resize", function () {
  //   google.maps.event.trigger(map, "resize");
  //   map.fitBounds(bounds);
  // });

  google.maps.event.addListener(map, 'zoom_changed', function () {
    gDistanceMarkers.forEach((group) => {
      Object.values(group).forEach((el) => {
        if (map.zoom < 14) {
          el.setVisible(false);
        } else {
          el.setVisible(true);
        }
      })
    });


    let scaledSize;
    let anchor;
    if (map.zoom >= 20) {
      scaledSize = new google.maps.Size(50, 58);
      anchor = new google.maps.Point(25, 58);
    } else if (map.zoom >= 16) {
      scaledSize = new google.maps.Size(30, 38);
      anchor = new google.maps.Point(15, 38);
    } else if (map.zoom >= 13) {
      scaledSize = new google.maps.Size(30, 38);
      anchor = new google.maps.Point(15, 38);
    } else if (map.zoom >= 7) {
      scaledSize = new google.maps.Size(20, 28);
      anchor = new google.maps.Point(10, 28);
    } else if (map.zoom >= 5) {
      scaledSize = new google.maps.Size(10, 18);
      anchor = new google.maps.Point(5, 18);
    } else {
      scaledSize = new google.maps.Size(5, 9);
      anchor = new google.maps.Point(2.5, 9);
    }
    for (var i = 0; i < gmarkers1.length; i++) {
      if (gmarkers1[i].category === 'main') continue;
      var icon = gmarkers1[i].getIcon();
      icon.scaledSize = scaledSize;
      icon.anchor = anchor;
      gmarkers1[i].setIcon(icon);
    }
  });


  const filterMarkers = function (category, categoriesArray) {
    gmarkers1.forEach((el) => {
      if (categoriesArray.has(el.category) || categoriesArray.size <= 1) {
        el.setMap(map);
        el.setAnimation(google.maps.Animation.DROP);
      } else {
        el.setMap(null);
      }
    });
  };

  document.querySelectorAll('[data-marker-reset]').forEach((el) => {
    el.addEventListener('click', () => {
      choosedCategories = new Set();
      choosedCategories.add('main');
      filterItems.forEach((item) => {
        item.classList.remove('active');
      });
      filterMarkers('main', choosedCategories);
    });
  });

  filterItems.forEach((item) => {
    item.addEventListener('click', (evt) => {
      evt.stopImmediatePropagation();
      item.classList.toggle('active');
      if (item.classList.contains('active')) {
        choosedCategories.add(item.dataset.category);
        if (item.dataset.multicategory) {
          const innerCategories = item.dataset.multicategory.split('~');
          innerCategories.forEach(el => choosedCategories.add(el));
        }
      } else {
        choosedCategories.delete(item.dataset.category);
        if (item.dataset.multicategory) {
          const innerCategories = item.dataset.multicategory.split('~');
          innerCategories.forEach(el => choosedCategories.delete(el));
        }
      }
      filterMarkers('main', choosedCategories);
    });
  });


  const ajaxMarkers = fetchMarkersData(google);

  ajaxMarkers.then(result => {
    putMarkersOnMap(result, map);
  })

  function putMarkersOnMap(markers, map) {
    const infowindow = new google.maps.InfoWindow({
      content: '',
      maxWidth: 200,
    });
    const initedMarkers = [];
    markers.forEach((marker) => {
      const category = marker.type;

      const mapMarker = new google.maps.Marker({
        map,
        category,
        zIndex: category === 'main' ? 2 : 1,
        icon: marker.icon,
        dataId: +marker.id,
        content: marker.content,
        position: new google.maps.LatLng(marker.position.lat, marker.position.lng),
      });
      mapMarker.dataId = +marker.id;
      initedMarkers.push(mapMarker);

      google.maps.event.addListener(mapMarker, 'click', function () {
        infowindow.setContent(marker.content);
        infowindow.open(map, mapMarker);
        map.panTo(this.getPosition());
      });
      mapMarker.name = marker.type;
      gmarkers1.push(mapMarker);
    });
    map.initedMarkers = initedMarkers;
    markersHightlight(google, map, infowindow);
  }
}



function markersHightlight(google, map, infowindow) {
  const $markerLinks = document.querySelectorAll('[data-marker-id]');
  querySelectorWithNodeList('[data-marker-id]', (item) => {
    item.addEventListener('click', () => {
      const marker = map.initedMarkers.find(el => {
        return el.dataId === +item.dataset.markerId
      });
      if (marker === undefined) return;
      infowindow.setContent(marker.content);
      infowindow.open(map, marker);
    })
  })
}


function querySelectorWithNodeList(selector, cb = () => { }) {
  const $list = document.querySelectorAll(selector);
  $list.forEach(el => cb(el));
}

function iniCircleWithTooltip({
  map,
  radius,
  tooltipImgUrl,
  circleParams = {},
  tooltipParams = {},
  center

}) {
  const tooltip1MeterOffset = 0.00001374;

  const circle = new google.maps.Circle({
    strokeColor: "#717386",
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: "#FF0000",
    fillOpacity: 0,
    map: map,
    center,
    ...circleParams,
    radius, // в метрах
  });

  const tooltipOnLeft = new google.maps.Marker({
    position: {
      lat: center.lat,
      lng: center.lng - (tooltip1MeterOffset * radius), // 28.42702 - 0.01374 (≈ 1 км захід)
    },
    map,
    icon: {
      url: tooltipImgUrl,
      scaledSize: new google.maps.Size(56, 28),
    },
    ...tooltipParams
  });
  const tooltipOnRight = new google.maps.Marker({
    position: {
      lat: center.lat,
      lng: center.lng + (tooltip1MeterOffset * radius), // 28.42702 + 0.01374 (≈ 1 км схід)
    },
    map,
    icon: {
      url: tooltipImgUrl,
      scaledSize: new google.maps.Size(56, 28),
    },
    ...tooltipParams
  });

  return {
    left: tooltipOnLeft,
    right: tooltipOnRight,
    circle,
  }
}