export function sideSwitchArrow(swiper, arrow, container) {
    const mediumCordValue = document.documentElement.clientWidth / 2;
    document.body.append(arrow);
    container.style.cursor = 'none';
    arrow.style.cursor = 'none';
    arrow.style.zIndex = 10;
    arrow.__proto__.hide = function () {
      this.style.opacity = '0';
      this.style.pointerEvents = 'none';
    };
    arrow.__proto__.show = function () {
      this.style.opacity = '1';
      // this.style.pointerEvents = 'auto';
    };
    arrow.dataset.side = 'leftSide';
  
  
    container.addEventListener('mousemove', desktopNavButtonHandler);
    container.addEventListener('mouseenter', () => {
      arrow.show();
    });
    container.addEventListener('mouseleave', () => {
      arrow.hide();
    });
    if (document.documentElement.clientWidth < 769) {
      window.removeEventListener('mousemove', desktopNavButtonHandler);
      arrow.remove();
    }
  
    /** Р—Р°РїРёСЃС‹РІР°РµС‚ РєРѕРѕСЂРґРёРЅР°С‚С‹ РѕР±СЊРµРєС‚Р°, РЅР° РєРѕС‚РѕСЂРѕРј РЅСѓР¶РЅРѕ СЃРєСЂС‹С‚СЊ СЃС‚СЂРµР»РєСѓ РїРµСЂРµРєР»СЋС‡РµРЅРёСЏ СЃР»Р°Р№РґРµСЂР° */
    /** ms ---> main-screen */
  
  
    function desktopNavButtonHandler(evt) {
      // arrow.style.position = 'fixed';
      arrow.style.left = `${evt.clientX - 18}px`;
      arrow.style.top = `${evt.clientY - 18}px`;
  
      getCursorSide(evt.clientX);
      handleArrowVisibility(evt);
    }
  
  
    function handleArrowVisibility() {
    }
  
    function getCursorSide(x) {
      if (x < (mediumCordValue)) {
        arrow.classList.add('left-side');
        arrow.dataset.side = 'leftSide';
        // switchGallerySlide('leftSide');
      } else {
        arrow.classList.remove('left-side');
        arrow.dataset.side = 'rightSide';
        // switchGallerySlide('rightSide')
      }
    }
  /*   container.addEventListener('click', function clickToChange() {
      switchGallerySlide(arrow.dataset.side);
    });
    if (document.documentElement.clientWidth < 576) {
      container.removeEventListener('click', clickToChange);
    } */
    
  
    if (document.documentElement.clientWidth > 576) {
        container.addEventListener('click', function clickToChange() {
      switchGallerySlide(arrow.dataset.side);
    });
    }
    
    const navigate = {
      leftSide: () => {
        swiper.slidePrev();
      },
      rightSide: () => {
        swiper.slideNext();
      },
    };
  
    function switchGallerySlide(side) {
      navigate[side]();
      return navigate.side;
    }
  
  
    // eslint-disable-next-line no-unused-vars
  }