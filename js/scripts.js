/*- timer -*/
document.addEventListener('DOMContentLoaded', function () {
    const timer = document.querySelector('.timer');
    if (!timer) return;

    const dateStr = timer.getAttribute('data-date');
    const targetDate = new Date(dateStr);

    if (isNaN(targetDate)) {
        console.warn('Неверный формат даты в data-date:', dateStr);
        return;
    }

    const timerElements = {
        days: timer.querySelector('.timer__number[data-type="days"]'),
        hours: timer.querySelector('.timer__number[data-type="hours"]'),
        minutes: timer.querySelector('.timer__number[data-type="minutes"]'),
        seconds: timer.querySelector('.timer__number[data-type="seconds"]')
    };

    function updateTimer() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            timerElements.days.textContent = '0';
            timerElements.hours.textContent = '00';
            timerElements.minutes.textContent = '00';
            timerElements.seconds.textContent = '00';
            clearInterval(timerInterval);
            return;
        }

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        timerElements.days.textContent = days;
        timerElements.hours.textContent = String(hours).padStart(2, '0');
        timerElements.minutes.textContent = String(minutes).padStart(2, '0');
        timerElements.seconds.textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
});

/*- people -*/
document.querySelectorAll('.people__name').forEach(el => {
    new CircleType(el)
        .dir(-1)
        .radius(48);
});

/*- gallery-slider -*/
var swiper;

function initGallerySwiper(loopEnabled = true) {
    swiper = new Swiper(".gallery-slider", {
        slidesPerView: 4,
        spaceBetween: 24,
        loop: loopEnabled,
        speed: 1500,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            600: {
                slidesPerView: 3,
                spaceBetween: 20,
            },
            960: {
                slidesPerView: 4,
                spaceBetween: 24,
            },
        },
    });
}

initGallerySwiper(true);

Fancybox.bind("[data-fancybox='gallery']", {
    Thumbs: {
        autoStart: true,
    },
    Toolbar: {
        display: ["zoom", "close"],
    },
    on: {
        reveal: () => {
            if (swiper) swiper.destroy(true, true);
            initGallerySwiper(false);
        },
        destroy: () => {
            if (swiper) swiper.destroy(true, true);
            initGallerySwiper(true);
        }
    }
});

/*- to-top -*/
document.querySelector('.to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

