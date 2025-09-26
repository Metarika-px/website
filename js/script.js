
  document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper('.planning__swiper', {
        loop: true, 
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      
      });
    const gallerySwiper = new Swiper('.cottage-gallery-swiper', {
    loop: true,
    pagination: {
        el: '.gallery-pagination',
        clickable: true,
    },
    });
    const addsSwiper = new Swiper('.adds-swiper', {
    loop: true,
    slidesPerView: 1.3,
    spaceBetween: 42,
    breakpoints: {
      546: {
        slidesPerView: 1.3,
        spaceBetween: 42
        
      },
      1023: {
        slidesPerView: 3.1,
        spaceBetween: 42
      },
    }

    });
    const burgerMenu = document.querySelector('.burger-menu');
    const burger = document.querySelector('.burger');
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      burgerMenu.classList.toggle('active');
    }); 

    /* const accordion = document.querySelectorAll('.accordion__header');
    accordion.forEach(element => {
      element.addEventListener('click', function() {
        const header = this.nextElementSibling;
        const switcher = this.querySelector('.accordion__switcher');
        header.classList.toggle('active');
        switcher.classList.toggle('active');      
      }
    ) 
      
    }); */
    
    const accordion = document.querySelectorAll('.accordion__item');
    accordion.forEach(element => {
      element.addEventListener('click', function() {
        this.classList.toggle('active');      
      }
    ) 
      
    });


  });

  