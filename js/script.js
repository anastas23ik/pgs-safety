const pageNames = {
  'access': 'Системы контроля и управления доступом',
  'antiram': 'Противотаранные устройства',
  'cabble-webs': 'Структурированные кабельные сети',
  'gates': 'Шлагбаумы, ворота и турникеты',
  'notice': 'Системы оповещения',
  'scada': 'Диспетчеризация (SCADA)',
  'service': 'Техническое обслуживание систем безопасности',
  'systems': 'Охранно-пожарные системы',
  'video': 'Системы видеонаблюдения',
}

const getPageName = () =>
  pageNames[Object.keys(pageNames).find(name => window.location.pathname.includes(name))] || 'Главная страница';

const toggleBodyLock = (state) => {
  if (state !== undefined) {
    state
      ? document.querySelector('body').classList.add('lock')
      : document.querySelector('body').classList.remove('lock')
  } else {
    document.querySelector('body').classList.toggle('lock')
  }
}

const setImgToBg = () => {
  const images = document.querySelectorAll('img.hidden-img')
  images.forEach(el => {
    const parent = el.parentElement
    parent.classList.add('bg-img')
    parent.style.backgroundImage = `url(${el.src})`
    el.remove()
  })
}

const callThanksModal = () => {
  const modal = document.getElementById('modalThanks');
  if (modal) {
    modal.classList.add('shown');
    toggleBodyLock(true);
  }
}

const checkSelector = (str) => !!document.querySelectorAll(str).length;

const configureFeaturesSlider = () => {
  const featuresSlider = new Splide('.features__slider', {
    type: 'fade',
    rewind: true,
    arrows: false,
    drag: false,
    perPage: 1,
    pagination: false,
    autoplay: 5000,
    // autoHeight: true
  });
    
  const buttons = document.querySelectorAll('.features__pagination-item')

  buttons[0].classList.add('active')

  buttons.forEach((el, idx) => {
    el.addEventListener('click', (e) => {
      featuresSlider.go(idx)
    })
  })
  
  const resetButtonsActive = () => {
    buttons.forEach(el => el.classList.remove('active'))
  }
  
  featuresSlider.on('move', (idx) => {
    resetButtonsActive()
    buttons[idx].classList.add('active')
  })

  featuresSlider.mount()
}

const configureProjectsSplider = () => {
  const projectsSlider = new Splide('.projects__slider', {
    type: 'loop',
    rewind: true,
    drag: false,
    perPage: 1,
    pagination: false,
    autoplay: 5000,
    gap: 30
  });

  const progressEl = document.querySelector('.projects__progress')
  

  projectsSlider.on('move', (idx) => {
    const length = projectsSlider.length
    progressEl.textContent = `${idx + 1}/${length}`
  })

  projectsSlider.mount()
}

const configureCertificatesSlider = () => {
  const certSlider = new Splide('.certificates__slider', {
    type: 'loop',
    focus: 'center',
    drag: true,
    perPage: 3,
    pagination: false,
    autoplay: 5000,
    breakpoints: {
      1100: {
        perPage: 2,
        focus: false
      },
    }
  });

  const modal = document.getElementById('modalImage')

  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-image__overlay')) {
      toggleBodyLock()
      modal.classList.remove('shown')
    }
  })

  const imgHandler = (e) => {
    const el = e.target
    toggleBodyLock()

    const modalImg = modal.querySelector('img')
    const src = el.getAttribute('data-full-src')
    modalImg.src = src || el.src
    modal.classList.add('shown')
  }

  certSlider.on('mounted', () => {
    document.querySelectorAll('img.expandable').forEach(el => {
      el.addEventListener('click', imgHandler)
    })
  })

  certSlider.mount()
}

const setPhoneMasks = () => {
  const inputs = document.querySelectorAll("input[type='tel']");
  inputs.forEach(input => {
    const im = new Inputmask("+7 (999) 999 99 99");
    im.mask(input);
  });
}

const configureQuestionsForm = () => {
  const form = document.querySelector('.questions__form');
  const inputs = form.querySelectorAll('input');
  const btn = form.querySelector('button');
  btn.addEventListener('click', () => {
    const data = {
      'Страница': getPageName()
    }
    inputs.forEach(input => {
      data[input.getAttribute('name')] = input.value;
    })
    console.log(data);
    callThanksModal()
  });
}

const configureServiceForm = () => {
  const rangeEl = document.querySelector('.range-slider');
  if (rangeEl) {

    const [min, max] = [parseInt(rangeEl.getAttribute('data-min')), parseInt(rangeEl.getAttribute('data-max'))];
    const avg = Math.round(max / 3);
  
    noUiSlider.create(rangeEl, {
        start: avg,
        connect: 'lower',
        tooltips: true,
        step: 1,
        range: { min, max },
        format: {
          to: function(value) {
            return parseInt(value)
        },
        from: function (value) {
          return parseInt(value)
        }
      }
    });
  }


  const inputs = document.querySelectorAll('.service__form input');
  const submitBtn = document.getElementById('submitService');
  
  submitBtn.addEventListener('click', () => {
    const form = {
      'Страница': getPageName()
    };

    if (rangeEl) form[rangeEl.getAttribute('data-name')] = rangeEl.noUiSlider.get()

    inputs.forEach(el => {
      const type = el.getAttribute('type');
      const name = el.getAttribute('name');
      if ((type === 'checkbox' || type === 'radio') && !el.checked) return;
      if (type === 'checkbox') {
        form[name] = form[name] ? [...form[name], el.value] : [el.value];
        return;
      }

      form[el.getAttribute('name')] = el.value;
    })

    console.log(form);
    callThanksModal()
  });
}

const configureModals = () => {
  const buttons = document.querySelectorAll(`button.call-modal`);
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modalId = e.target.getAttribute('data-target')
      const modal = document.getElementById(modalId)
      if (modal) {
        modal.classList.add('shown');
        toggleBodyLock(true);
      }
    });
  });

  const modals = document.querySelectorAll('[data-modal');
  modals.forEach(modal => {
    const overlay = modal.querySelector('[data-overlay]');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          modal.classList.remove('shown');
          toggleBodyLock(false);
        }
      });
    }
  });
}

const configureModalForm = () => {
  const modal = document.getElementById('modalForm');

  const btn = modal.querySelector('button');
  btn.addEventListener('click', () => {
    const inputs = modal.querySelectorAll('input');
    const data = {
      'Страница': getPageName()
    };
    inputs.forEach(input => {
      data[input.getAttribute('name')] = input.value;
    });
    
    console.log(data);

    modal.classList.remove('shown');
    callThanksModal();
  });
}

setImgToBg()
checkSelector('.features__slider') && configureFeaturesSlider()
checkSelector('.projects__slider') && configureProjectsSplider()
checkSelector('.certificates__slider') && configureCertificatesSlider()
checkSelector('.questions__form') && configureQuestionsForm()
checkSelector('.service__form') && configureServiceForm()
setPhoneMasks()
configureModals()
checkSelector('.modal-form') && configureModalForm()