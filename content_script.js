const zoom_by_default = true;    // Zoom in automatically when clicking a thumb in Discord
const max_zoom_factor = 200;     // Maximum zoom relative to image size in percentage (%).
const max_zoom = 90;             // Maximum zoom relative to viewport in percentage (%).
const max_width_to_zoom = 1400;  // Don't auto-zoom if image width is larger than this (to avoid auto-zooming already large images)
const max_height_to_zoom = 1400; // Don't auto-zoom if image height is larger than this (to avoid auto-zooming already large images)
const close_after_zoom = true;   // Whether to zoom out or close modal when clicking on zoomed image.

const container = '.layerContainer_d5a653';
let modal, zoomer, actual_zoom_factor, resizer;
let in_progress = false;

const zoom = () => {
  if(!in_progress){
    if (modal && modal.classList.contains('xtZoomed') && !in_progress) {
      if(close_after_zoom){
        console.log('-> close');
        modal.classList.remove('xtZoomed');
        document.querySelectorAll('.backdrop-2ByYRN')[0].click();
        click_disabled = true;
      } else {
        console.log('-> zoom out');
        modal.classList.remove('xtZoomed');
        modal.style.cursor = 'zoom-in';
        modal.style.transition = '.15s';
        modal.style.transform = 'scale(1)';
      }
    } else if (modal) {
      console.log('-> zoom');
      modal.classList.add('xtZoomed');
      modal.style.cursor = 'zoom-out';
      modal.style.transition = '.15s';
      modal.style.transform = 'scale('+actual_zoom_factor+')';
    }
    in_progress = true;
    setTimeout(() => {
      in_progress = false;
    }, 700);
  }  
}

const initZoomer = () => {
  console.log('initialize');
  let container = document.querySelectorAll(layer_container)[0];
  if (container) {
    container.addEventListener('DOMSubtreeModified', () => {
      modal = container.querySelectorAll('[class^="modal-"]')[0];
      if (modal) {
        let img = modal.querySelectorAll('img')[0];
        actual_zoom_factor = max_zoom_factor / 100;
        if (img) {
          let iw = parseInt(img.style.width);
          let ih = parseInt(img.style.height);          
          let prev_iw, prev_ih;
          if (iw * actual_zoom_factor > window.innerWidth * (max_zoom/100) || ih * actual_zoom_factor > window.innerHeight * (max_zoom/100)) {
            let longest_img_side = iw > ih ? iw : ih;
            let shortest_img_side = iw < ih ? iw : ih;
            let shortest_win_side = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
            actual_zoom_factor = (shortest_win_side / (window.innerWidth > window.innerHeight && iw > ih ? shortest_img_side : longest_img_side)) * (max_zoom/100);
          }
          img.addEventListener('click', () => { zoom(); });
          if (zoom_by_default && iw <= max_width_to_zoom && ih <= max_height_to_zoom) {
            let resize_checker = setInterval(() => {
              if(iw == prev_iw && ih == prev_ih){
                clearInterval(resize_checker);
                zoomer = setTimeout(() => { 
                  if (container.innerHTML != '') zoom();
                }, 300);
              }
              prev_iw = iw;
              prev_ih = ih;
            }, 50);
          } else {
            modal.style.cursor = 'zoom-in';
          }
        }
      }
    });
  }
  document.addEventListener('resize', () => {
    clearTimeout(resizer);
    resizer = setTimeout(() => {
      initZoomer();
    }, 300);
  });
}

document.addEventListener('readystatechange', (event) => {
  if (document.readyState == 'complete'){
    initZoomer();
  }
});
