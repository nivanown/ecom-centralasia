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
function initCircle() {
    const elements = document.querySelectorAll('.people__name');

    if (window.innerWidth >= 1280) {
        elements.forEach(el => {
            if (!el.__circleType) {
                el.__circleType = new CircleType(el).dir(-1).radius(48);
            }
        });
    } else {
        elements.forEach(el => {
            if (el.__circleType) {
                el.__circleType.destroy();
                el.__circleType = null;
            }
        });
    }
}

initCircle();
window.addEventListener('resize', initCircle);

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

/*- mobile-dropdown -*/
document.addEventListener('DOMContentLoaded', function () {
    const mobileBtn = document.querySelector('.mobile-btn');
    const mobileDropdown = document.querySelector('.mobile-dropdown');

    if (!mobileBtn || !mobileDropdown) return;

    mobileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        mobileBtn.classList.toggle('open');
        mobileDropdown.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
        const isClickInside = mobileDropdown.contains(e.target) || mobileBtn.contains(e.target);

        if (!isClickInside) {
            mobileBtn.classList.remove('open');
            mobileDropdown.classList.remove('show');
        }
    });
});

/*- modal -*/
const myModal = new HystModal({
    closeOnEsc: true,
    backscroll: true,      
});

/*- phone-field -*/
document.addEventListener('DOMContentLoaded', () => {
    const formatPhoneInput = (phoneInput) => {
        phoneInput.addEventListener('input', () => {
            let value = phoneInput.value.replace(/\D/g, '');
            if (!value.startsWith('998')) {
                value = '998' + value;
            }
            value = value.slice(0, 12);
            const formattedValue = `+${value.slice(0, 3)} ${value.slice(3, 5)} ${value.slice(5, 8)} ${value.slice(8, 10)} ${value.slice(10, 12)}`;
            phoneInput.value = formattedValue.trim();
        });

        phoneInput.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace') {
                const cursorPosition = phoneInput.selectionStart;
                const value = phoneInput.value;
                if (cursorPosition <= 5) {
                    event.preventDefault();
                    return;
                }
                const prevChar = value[cursorPosition - 1];
                if (/\s/.test(prevChar)) {
                    event.preventDefault();

                    const newValue = value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);
                    phoneInput.value = newValue;

                    phoneInput.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                }
            }
        });

        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value || phoneInput.value === '+998') {
                phoneInput.value = '+998 ';
            }
        });

        phoneInput.addEventListener('blur', () => {
            if (phoneInput.value === '+998 ') {
                phoneInput.value = '';
            }
        });
    };

    const phoneInputs = document.querySelectorAll('.phone-input');
    phoneInputs.forEach((phoneInput) => {
        formatPhoneInput(phoneInput);
    });
});

/*- header -*/
const header = document.querySelector('header');
const remToPx = rem => rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
const headerHeightPx = remToPx(5.3125);

let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

window.addEventListener('scroll', () => {
  const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScrollTop > headerHeightPx) {
    if (currentScrollTop < lastScrollTop) {
      header.classList.add('fixed');
      header.classList.remove('no-fixed');
    } else {
      header.classList.remove('fixed');
      header.classList.add('no-fixed');
    }
  } else {
    header.classList.remove('fixed', 'no-fixed');
  }

  lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
});


