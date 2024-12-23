document.addEventListener('DOMContentLoaded', function () {
    let slides = document.querySelectorAll('.slides.fade');
    let slide_index = 0;
  
    function show_slides() {
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
  
        slide_index++;
        if (slide_index >= slides.length) {
            slide_index = 0;
        }
  
        slides[slide_index].classList.add('active');
    }
    show_slides();
    setInterval(show_slides, 5000); 
});  
