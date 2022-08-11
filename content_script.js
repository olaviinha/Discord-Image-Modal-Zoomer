const zoom_by_default = true;   // Zoom in automatically when clicking a thumb in Discord
const max_zoom_factor = 2;      // Maximum zoom relative to image size (1.5 = 150%, 2 = 200% etc). Applies if viewport is larger than the zoomed modal.
const max_zoom = 0.85;          // Maximum zoom relative to viewport (0.5 = 50%, 1 = 100% etc). Applies if the zoomed modal is larger than viewport.
const max_width_to_zoom = 720;  // Disable zoom if image width is larger than this (to avoid auto-zooming already large images)
const max_height_to_zoom = 720; // Disable zoom if image height is larger than this (to avoid auto-zooming already large images)

var modal, zoomer, actual_zoom_factor, resizer;

const zoom = () => {
  if (modal.classList.contains('xtZoomed')) {
    modal.classList.remove('xtZoomed');
    modal.style.cursor = 'zoom-in';
    modal.style.transition = '.25s';
    modal.style.transform = 'scale(1)';
  } else {
    modal.classList.add('xtZoomed');
    modal.style.cursor = 'zoom-out';
    modal.style.transition = '.25s';
    modal.style.transform = 'scale('+actual_zoom_factor+')';
  }
}

const initZoomer = () => {

  let container = document.querySelectorAll('.layerContainer-2v_Sit')[0];
  if (container) {
    container.addEventListener('DOMSubtreeModified', () => {
      modal = container.querySelectorAll('[class^="modal-"]')[0];
      if (modal) {

        let img = modal.querySelectorAll('img')[0];
        actual_zoom_factor = max_zoom_factor;

        if (img) {
          let iw = parseInt(img.style.width);
          let ih = parseInt(img.style.height);
        
          if (iw * actual_zoom_factor > window.innerWidth * max_zoom || ih * actual_zoom_factor > window.innerHeight * max_zoom) {
            let longest_img_side = iw > ih ? iw : ih;
            let shortest_win_side = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
            actual_zoom_factor = (shortest_win_side / longest_img_side) * max_zoom;
          }

          img.addEventListener('click', () => { zoom(); });
          if (zoom_by_default && iw <= max_width_to_zoom && ih <= max_height_to_zoom) {
            zoomer = setTimeout(() => { 
              if (container.innerHTML != '') zoom(); 
            }, 500);
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
