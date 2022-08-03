const zoom_by_default = true; 	// Zoom in automatically when clicking a thumb in Discord
const zoom_factor = 1.75;		    // Enlargement (1.5 = 150%, etc.)
const max_width_to_zoom = 512;	// Disable zoom if image width is larger than this (to avoid auto-zooming already large images)
const max_height_to_zoom = 512;	// Disable zoom if image height is larger than this (to avoid auto-zooming already large images)

var zoomer, modal;
zoom = () => {
  if (modal.classList.contains('xtZoomed')) {
    modal.classList.remove('xtZoomed');
    modal.style.cursor = 'zoom-in';
    modal.style.transition = '.25s';
    modal.style.transform = 'scale(1)';
  } else {
    modal.classList.add('xtZoomed');
    modal.style.cursor = 'zoom-out';
    modal.style.transition = '.25s';
    modal.style.transform = 'scale('+zoom_factor+')';
  }
}

document.addEventListener('readystatechange', (event) => {
  if (document.readyState == 'complete'){
    let container = document.querySelectorAll('.layerContainer-2v_Sit')[0];
    if (container) {
      container.addEventListener('DOMSubtreeModified', () => {
        modal = container.querySelectorAll('[class^="modal-"]')[0];
        if (modal) {
          let img = modal.querySelectorAll('img')[0];
          if (img && parseInt(img.style.width) <= max_width_to_zoom && parseInt(img.style.height) <= max_height_to_zoom) {
            img.addEventListener('click', () => { zoom(); });
            if (zoom_by_default) {
              zoomer = setTimeout(() => { 
                if(container.innerHTML != '') zoom(); 
              }, 400);
            }
          }
        }
      });
    }
  }
});
