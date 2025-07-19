
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// =================================================================================
// SHARED STATE & CONFIG
// =================================================================================
const MAX_KITS_PER_DAY = 5;
const ASSEMBLY_FEE = 150.0;

type Item = {
  id: string;
  name: string;
  price: number;
  image: string; // Can be a URL or a base64 Data URL
  zIndex: number;
  width: number;
  bottom: number;
  left: string;
};

type Booking = {
    id: string;
    name: string;
    address: string;
    phone: string;
    bookingDate: string;
    deliveryTime: string;
    pickupTime: string;
    totalPrice: number;
    serviceType: 'rentalOnly' | 'fullService';
    items: string[];
    themeType: string;
    themeDescription: string;
    confirmed: boolean;
};

type GalleryImage = {
    id: string;
    src: string; // base64 data URL
};

const INITIAL_ITEMS: Item[] = [
  { id: 'cilindro-g', name: 'Cilindro G', price: 50, image: 'https://i.imgur.com/K3y2z2c.png', zIndex: 3, width: 120, bottom: 0, left: 'calc(50% - 150px)' },
  { id: 'cilindro-m', name: 'Cilindro M', price: 40, image: 'https://i.imgur.com/vHq7s1j.png', zIndex: 4, width: 100, bottom: 0, left: 'calc(50% + 50px)' },
  { id: 'cilindro-p', name: 'Cilindro P', price: 30, image: 'https://i.imgur.com/r3smFp1.png', zIndex: 3, width: 80, bottom: 0, left: 'calc(50% - 20px)' },
  { id: 'arco-redondo', name: 'Arco Redondo', price: 80, image: 'https://i.imgur.com/83SAa2x.png', zIndex: 1, width: 350, bottom: 10, left: 'calc(50% - 175px)' },
  { id: 'arco-romano', name: 'Arco Romano', price: 90, image: 'https://i.imgur.com/7gKk9zC.png', zIndex: 1, width: 200, bottom: 0, left: 'calc(50% - 300px)' },
  { id: 'arco-baloes', name: 'Arco de Balões', price: 200, image: 'https://i.imgur.com/yO8vlyb.png', zIndex: 2, width: 450, bottom: 0, left: 'calc(50% - 225px)' },
  { id: 'boleira', name: 'Boleira', price: 25, image: 'https://i.imgur.com/PZk2nI5.png', zIndex: 10, width: 100, bottom: 170, left: 'calc(50% - 50px)' },
  { id: 'vaso-flores', name: '2 Vasos de Flores', price: 40, image: 'https://i.imgur.com/kFLTQTu.png', zIndex: 5, width: 150, bottom: 0, left: 'calc(50% + 150px)' },
  { id: 'suportes-doces', name: 'Suportes para Doces (Kit 3 unidades)', price: 35, image: 'https://i.imgur.com/eWj9n2S.png', zIndex: 11, width: 120, bottom: 90, left: 'calc(50% + 30px)' },
  { id: 'escadinha', name: 'Escadinha de Decoração', price: 30, image: 'https://i.imgur.com/D4sXqwF.png', zIndex: 5, width: 100, bottom: 0, left: 'calc(50% - 250px)' },
  { id: 'mesinha', name: 'Mesinha Branca', price: 45, image: 'https://i.imgur.com/t4pBv3K.png', zIndex: 2, width: 200, bottom: 0, left: 'calc(50% - 100px)' },
];

// SIMULAÇÃO DE BANCO DE DADOS
let MOCK_BOOKINGS_DB: Booking[] = [
    { id: 'bk_1', name: 'Ana Silva', address: 'Rua das Flores, 123, São Paulo, SP', phone: '11987654321', bookingDate: '2025-08-25', deliveryTime: '09:00', pickupTime: '19:00', totalPrice: 275.00, serviceType: 'rentalOnly', items: ['Cilindro G', 'Cilindro M', 'Boleira', 'Arco Redondo'], themeType: 'Infantil', themeDescription: 'Tema Patrulha Canina', confirmed: true },
    { id: 'bk_2', name: 'Carlos Pereira', address: 'Av. Paulista, 1000, São Paulo, SP', phone: '11912345678', bookingDate: '2025-08-25', deliveryTime: '10:00', pickupTime: '22:00', totalPrice: 535.00, serviceType: 'fullService', items: ['Arco de Balões', 'Mesinha Branca', 'Suportes para Doces (Kit 3 unidades)', '2 Vasos de Flores'], themeType: 'Adulto', themeDescription: 'Aniversário 40 anos, cores preto e dourado', confirmed: false },
    { id: 'bk_3', name: 'Mariana Costa', address: 'Rua Augusta, 500, São Paulo, SP', phone: '11955558888', bookingDate: '2025-09-10', deliveryTime: '13:00', pickupTime: '23:00', totalPrice: 195.00, serviceType: 'rentalOnly', items: ['Arco Romano', 'Boleira', 'Escadinha de Decoração'], themeType: 'Casamento', themeDescription: 'Mini-wedding rústico', confirmed: false },
];

const appState = {
  booking: {
    selectedItems: new Set<string>(),
    serviceType: 'rentalOnly' as 'rentalOnly' | 'fullService',
    bookingDate: '',
    deliveryTime: '',
    pickupTime: '',
    themeType: '',
    themeDescription: '',
    isDateAvailable: false,
  },
  gallery: {
    currentSlide: 0,
    intervalId: null as number | null,
  },
  admin: {
    items: JSON.parse(JSON.stringify(INITIAL_ITEMS)) as Item[],
    galleryImages: [] as GalleryImage[],
    bookings: [] as Booking[],
    isLoading: true,
    filterDate: '',
    activeTab: 'reservations' as 'reservations' | 'items' | 'collections',
    bookingToDelete: null as string | null,
  }
};

// =================================================================================
// RENDER & NAVIGATION LOGIC
// =================================================================================
function renderApp() {
    renderBookingView();
    renderAdminView();
    renderGallery();
}

function navigateToView(view: 'main-view' | 'admin-view' | 'gallery-view') {
    document.querySelectorAll('#app > div[id$="-view"]').forEach(v => {
        (v as HTMLElement).style.display = 'none';
    });
    
    const viewEl = document.getElementById(view) as HTMLElement;
    viewEl.style.display = view === 'gallery-view' ? 'flex' : 'block';

    if (view === 'admin-view') {
        // appState.admin.activeTab = 'reservations'; // Don't reset tab on re-entry
        switchAdminTab(appState.admin.activeTab);
        loadAndRenderAdminBookings();
    } else if (view === 'gallery-view') {
        startSlideshow();
    } else {
        stopSlideshow();
    }
}

function toggleModal(modalId: string, show: boolean) {
    const modal = document.getElementById(modalId) as HTMLElement;
    if (modal) modal.style.display = show ? 'flex' : 'none';
}

function switchAdminTab(tabId: 'reservations' | 'items' | 'collections') {
    appState.admin.activeTab = tabId;
    document.querySelectorAll('.admin-tab-content').forEach(el => (el as HTMLElement).classList.remove('active'));
    document.querySelectorAll('.admin-tab-button').forEach(el => (el as HTMLElement).classList.remove('active'));
    
    document.getElementById(`admin-${tabId}-tab`)?.classList.add('active');
    document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

    if(tabId === 'items') {
      renderItemManager();
    } else if(tabId === 'collections') {
      renderCollectionManager();
    }
}

// =================================================================================
// BOOKING VIEW LOGIC
// =================================================================================
function renderBookingView() {
  renderItemSelection();
  renderThemeSelection();
  renderServiceTypeSelection();
  renderVisualPreview();
  updateOrderSummary();
  renderBookingCalendar();
}

function renderItemSelection() {
  const container = document.getElementById('item-selection')!;
  container.innerHTML = appState.admin.items.map(item => `
    <div class="item-option" id="item-option-${item.id}">
      <input type="checkbox" id="${item.id}" name="${item.id}" ${appState.booking.selectedItems.has(item.id) ? 'checked' : ''}>
      <label for="${item.id}">${item.name}</label>
    </div>
  `).join('');
}

function renderThemeSelection() {
    const container = document.getElementById('theme-selection')!;
    const isThemeChosen = appState.booking.themeType !== '';
    container.innerHTML = `
        <div class="theme-option">
            <input type="radio" id="theme-adulto" name="themeType" value="Adulto" ${appState.booking.themeType === 'Adulto' ? 'checked' : ''}>
            <label for="theme-adulto">Adulto</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-infantil" name="themeType" value="Infantil" ${appState.booking.themeType === 'Infantil' ? 'checked' : ''}>
            <label for="theme-infantil">Infantil</label>
        </div>
        <div class="theme-option">
            <input type="radio" id="theme-casamento" name="themeType" value="Casamento" ${appState.booking.themeType === 'Casamento' ? 'checked' : ''}>
            <label for="theme-casamento">Casamento</label>
        </div>
        <div id="theme-description-container" style="display: ${isThemeChosen ? 'block' : 'none'};">
            <label for="theme-description" class="sr-only">Especifique o tema</label>
            <textarea id="theme-description" placeholder="Ex: Festa Neon, Mundo Bita, Rústico Chic...">${appState.booking.themeDescription}</textarea>
        </div>
    `;
}

function renderServiceTypeSelection() {
  const container = document.getElementById('service-type-selection')!;
  container.innerHTML = `
    <div class="service-option">
      <input type="radio" id="rentalOnly" name="serviceType" value="rentalOnly" ${appState.booking.serviceType === 'rentalOnly' ? 'checked' : ''}>
      <label for="rentalOnly">Apenas Locação (você monta)</label>
    </div>
    <div class="service-option">
      <input type="radio" id="fullService" name="serviceType" value="fullService" ${appState.booking.serviceType === 'fullService' ? 'checked' : ''}>
      <label for="fullService">Locação + Montagem Profissional</label>
    </div>
  `;
}

function renderVisualPreview() {
  const container = document.getElementById('visual-preview')!;
  const placeholder = container.querySelector('.placeholder-text') as HTMLElement | null;
  
  if (placeholder) placeholder.style.display = appState.booking.selectedItems.size === 0 ? 'block' : 'none';

  container.querySelectorAll('img.preview-image').forEach(img => img.remove());

  appState.booking.selectedItems.forEach((itemId) => {
    const item = appState.admin.items.find(i => i.id === itemId);
    if (!item) return;
    
    const imgEl = document.createElement('img');
    imgEl.className = 'preview-image';
    imgEl.id = `img-${itemId}`;
    imgEl.src = item.image;
    imgEl.alt = item.name;
    imgEl.style.zIndex = item.zIndex.toString();
    imgEl.style.width = `${item.width}px`;
    imgEl.style.bottom = `${item.bottom}px`;
    imgEl.style.left = item.left;
    container.appendChild(imgEl);
  });
}

function calculateTotalPrice() {
    let subtotal = 0;
    appState.booking.selectedItems.forEach((itemId) => {
      const item = appState.admin.items.find(i => i.id === itemId);
      if (item) subtotal += item.price;
    });

    const assemblyCost = appState.booking.serviceType === 'fullService' ? ASSEMBLY_FEE : 0;
    return subtotal + assemblyCost;
}

function updateOrderSummary() {
  const container = document.getElementById('order-summary')!;
  const selectedItemsSummary = Array.from(appState.booking.selectedItems).map(id => {
      const item = appState.admin.items.find(i => i.id === id);
      return item ? `<li>${item.name}</li>` : '';
  }).filter(Boolean);
  
  if (selectedItemsSummary.length > 0) {
      container.innerHTML = `<ul>${selectedItemsSummary.join('')}</ul>`;
  } else {
      container.innerHTML = `<p>Nenhum item selecionado.</p>`;
  }
}

function renderBookingCalendar() {
  const container = document.getElementById('booking-calendar')!;
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];
  
  container.innerHTML = `
    <div class="form-group">
      <label for="booking-date">Escolha a data do evento:</label>
      <input type="date" id="booking-date" name="booking-date" min="${minDate}" value="${appState.booking.bookingDate}">
    </div>
    <div id="availability-message" aria-live="polite"></div>
  `;
}

async function checkAvailability(date: string) {
    const messageEl = document.getElementById('availability-message')!;
    messageEl.textContent = 'Verificando...';
    messageEl.className = '';

    const bookingsOnDate = MOCK_BOOKINGS_DB.filter(b => b.bookingDate === date).length;
    const availableKits = MAX_KITS_PER_DAY - bookingsOnDate;

    if (availableKits > 0) {
        messageEl.textContent = `Ótima escolha! Temos ${availableKits} kits disponíveis para esta data.`;
        messageEl.className = 'available';
        appState.booking.isDateAvailable = true;
    } else {
        messageEl.textContent = 'Data indisponível. Por favor, escolha outra data.';
        messageEl.className = 'unavailable';
        appState.booking.isDateAvailable = false;
    }
    updateSubmitButtonState();
}

function updateSubmitButtonState() {
  const button = document.getElementById('submit-booking') as HTMLButtonElement;
  button.disabled = !(
    appState.booking.selectedItems.size > 0 &&
    appState.booking.bookingDate &&
    appState.booking.isDateAvailable &&
    appState.booking.deliveryTime &&
    appState.booking.pickupTime
  );
}

function setupBookingEventListeners() {
  const itemSelection = document.getElementById('item-selection');
  itemSelection?.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.type === 'checkbox') {
      if (target.checked) appState.booking.selectedItems.add(target.id);
      else appState.booking.selectedItems.delete(target.id);
    }
    renderVisualPreview();
    updateOrderSummary();
    updateSubmitButtonState();
  });
  
  const themeSelection = document.getElementById('theme-selection');
  themeSelection?.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if(target.name === 'themeType') {
          appState.booking.themeType = target.value;
      }
      renderThemeSelection(); // Re-render to show/hide textarea
  });
  themeSelection?.addEventListener('input', (e) => {
      const target = e.target as HTMLTextAreaElement;
      if(target.id === 'theme-description') {
          appState.booking.themeDescription = target.value;
      }
  });

  document.getElementById('service-type-selection')!.addEventListener('change', (e) => {
    const value = (e.target as HTMLInputElement).value;
    if (value === 'rentalOnly' || value === 'fullService') {
      appState.booking.serviceType = value as 'rentalOnly' | 'fullService';
    }
  });
  
  document.getElementById('booking-form-schedule')!.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.id === 'booking-date') {
        appState.booking.bookingDate = target.value;
        checkAvailability(target.value);
    } else if (target.id === 'delivery-time') {
        appState.booking.deliveryTime = target.value;
    } else if (target.id === 'pickup-time') {
        appState.booking.pickupTime = target.value;
    }
    updateSubmitButtonState();
  });

  const form = document.getElementById('booking-form') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = document.getElementById('submit-booking') as HTMLButtonElement;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    const formData = new FormData(form);
    const selectedItemsSummary = Array.from(appState.booking.selectedItems).map(id => {
        const item = appState.admin.items.find(i => i.id === id)!;
        return item.name;
    });

    const bookingPayload: Omit<Booking, 'id'> = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      bookingDate: appState.booking.bookingDate,
      deliveryTime: appState.booking.deliveryTime,
      pickupTime: appState.booking.pickupTime,
      totalPrice: calculateTotalPrice(),
      serviceType: appState.booking.serviceType,
      items: selectedItemsSummary,
      themeType: appState.booking.themeType,
      themeDescription: appState.booking.themeDescription,
      confirmed: false,
    };
    
    const newBooking = { ...bookingPayload, id: `bk_${Date.now()}`};
    MOCK_BOOKINGS_DB.push(newBooking);
    
    alert(`Reserva confirmada com sucesso! (Simulação)\nEntraremos em contato em breve.`);
    
    appState.booking = {
      selectedItems: new Set<string>(), serviceType: 'rentalOnly', bookingDate: '',
      deliveryTime: '', pickupTime: '', themeType: '', themeDescription: '', isDateAvailable: false
    };
    form.reset();
    (document.getElementById('booking-form-schedule') as HTMLFormElement).reset();
    document.getElementById('availability-message')!.innerHTML = '';
    renderBookingView();

    submitButton.disabled = false;
    submitButton.textContent = 'Reservar Agora';
  });
}


// =================================================================================
// GALLERY VIEW LOGIC
// =================================================================================
function renderGallery() {
    const slidesContainer = document.getElementById('gallery-slides')!;
    const dotsContainer = document.getElementById('gallery-dots')!;
    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    if (appState.admin.galleryImages.length === 0) {
        slidesContainer.innerHTML = `<div class="slide active"><p style="color:white; font-size: 1.2rem;">Nenhuma imagem na coleção ainda.</p></div>`;
        return;
    }

    appState.admin.galleryImages.forEach((image, index) => {
        slidesContainer.innerHTML += `
            <div class="slide ${index === appState.gallery.currentSlide ? 'active' : ''}">
                <img src="${image.src}" alt="Imagem da coleção ${index + 1}">
            </div>
        `;
        dotsContainer.innerHTML += `<span class="gallery-dot ${index === appState.gallery.currentSlide ? 'active' : ''}" data-slide-index="${index}"></span>`;
    });
}

function showSlide(index: number) {
    const slides = document.querySelectorAll('#gallery-slides .slide');
    const dots = document.querySelectorAll('#gallery-dots .gallery-dot');
    
    if (index >= slides.length) {
        appState.gallery.currentSlide = 0;
    } else if (index < 0) {
        appState.gallery.currentSlide = slides.length - 1;
    } else {
        appState.gallery.currentSlide = index;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    if (slides[appState.gallery.currentSlide]) {
        slides[appState.gallery.currentSlide].classList.add('active');
        dots[appState.gallery.currentSlide].classList.add('active');
    }
}

function nextSlide() {
    showSlide(appState.gallery.currentSlide + 1);
}

function prevSlide() {
    showSlide(appState.gallery.currentSlide - 1);
}

function startSlideshow() {
    stopSlideshow(); // Ensure no multiple intervals running
    if (appState.admin.galleryImages.length > 1) {
        appState.gallery.intervalId = window.setInterval(nextSlide, 5000);
    }
}

function stopSlideshow() {
    if (appState.gallery.intervalId !== null) {
        clearInterval(appState.gallery.intervalId);
        appState.gallery.intervalId = null;
    }
}

function setupGalleryEventListeners() {
    document.getElementById('collections-button')?.addEventListener('click', () => {
        renderGallery();
        showSlide(0);
        navigateToView('gallery-view');
    });

    document.getElementById('gallery-back-button')?.addEventListener('click', () => navigateToView('main-view'));
    document.getElementById('close-gallery-button')?.addEventListener('click', () => navigateToView('main-view'));

    document.getElementById('gallery-next')?.addEventListener('click', () => {
        nextSlide();
        startSlideshow(); // Restart timer on manual navigation
    });

    document.getElementById('gallery-prev')?.addEventListener('click', () => {
        prevSlide();
        startSlideshow(); // Restart timer on manual navigation
    });

    document.getElementById('gallery-dots')?.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.matches('.gallery-dot')) {
            const index = parseInt(target.dataset.slideIndex!);
            showSlide(index);
            startSlideshow();
        }
    });
}


// =================================================================================
// ADMIN VIEW LOGIC
// =================================================================================

function renderAdminView() {
    renderAdminReservations();
    renderItemManager();
    renderCollectionManager();
}

function renderAdminReservations() {
    const listContainer = document.getElementById('bookings-list')!;
    listContainer.innerHTML = '';

    if (appState.admin.isLoading) {
        listContainer.innerHTML = `<p class="loading-message">Carregando reservas...</p>`;
        return;
    }

    const bookingsToRender = appState.admin.filterDate 
        ? appState.admin.bookings.filter(b => b.bookingDate === appState.admin.filterDate)
        : appState.admin.bookings;

    if (bookingsToRender.length === 0) {
        const message = appState.admin.filterDate 
            ? `Nenhuma reserva encontrada para a data ${new Date(appState.admin.filterDate + 'T00:00:00').toLocaleDateString('pt-BR')}.`
            : 'Nenhuma reserva foi encontrada.';
        listContainer.innerHTML = `<p class="empty-message">${message}</p>`;
        return;
    }

    bookingsToRender.sort((a,b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()).forEach(booking => {
        const card = document.createElement('div');
        card.className = `booking-card ${booking.confirmed ? 'is-confirmed' : ''}`;
        card.innerHTML = `
            <div class="booking-card__header">
                <h3>${booking.name}</h3>
                <span>Data: <strong>${new Date(booking.bookingDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong></span>
            </div>
            <div class="booking-card__details">
                <p><strong>Horários:</strong> ${booking.deliveryTime} às ${booking.pickupTime}</p>
                <p><strong>Contato:</strong> ${booking.phone}</p>
                <p><strong>Endereço:</strong> ${booking.address}</p>
                <p><strong>Serviço:</strong> ${booking.serviceType === 'fullService' ? 'Locação + Montagem' : 'Apenas Locação'}</p>
            </div>
            <div class="booking-card__theme">
                <p><strong>Tema:</strong> ${booking.themeType} - <em>${booking.themeDescription || 'Não especificado'}</em></p>
            </div>
            <div class="booking-card__items">
                <strong>Itens:</strong>
                <ul>
                    ${booking.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="booking-card__total">
                <p>Valor Total: <strong>R$ ${booking.totalPrice.toFixed(2)}</strong></p>
            </div>
            <div class="booking-card__actions">
                <label class="confirm-action">
                    <input type="checkbox" class="confirm-checkbox" data-booking-id="${booking.id}" ${booking.confirmed ? 'checked' : ''}>
                    ✔ Reserva Confirmada!
                </label>
                <button class="delete-button" data-booking-id="${booking.id}">Excluir</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function renderItemManager() {
    const listContainer = document.getElementById('items-management-list')!;
    listContainer.innerHTML = appState.admin.items.map(item => `
        <div class="managed-item-card" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-preview-img">
            <div class="form-group">
                <label for="name-${item.id}">Nome</label>
                <input type="text" id="name-${item.id}" value="${item.name}">
            </div>
            <div class="form-group">
                <label for="price-${item.id}">Preço</label>
                <input type="number" id="price-${item.id}" value="${item.price.toFixed(2)}" step="0.01" min="0">
            </div>
            <div class="item-actions">
                <button class="save-item-button">Salvar</button>
                <button class="delete-item-button">Excluir</button>
            </div>
        </div>
    `).join('');
}

function renderCollectionManager() {
    const listContainer = document.getElementById('collection-management-list')!;
    if (appState.admin.galleryImages.length > 0) {
        listContainer.innerHTML = appState.admin.galleryImages.map(image => `
            <div class="collection-image-card" data-image-id="${image.id}">
                <img src="${image.src}" alt="Imagem da coleção">
                <button class="delete-collection-button" aria-label="Excluir imagem">&times;</button>
            </div>
        `).join('');
    } else {
        listContainer.innerHTML = `<p class="empty-message">Nenhuma imagem na coleção.</p>`;
    }
}


async function fetchAdminBookings(): Promise<Booking[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...MOCK_BOOKINGS_DB];
}

async function loadAndRenderAdminBookings() {
    appState.admin.isLoading = true;
    renderAdminReservations();
    try {
        appState.admin.bookings = await fetchAdminBookings();
    } catch (error) {
        console.error("Falha ao carregar reservas:", error);
        appState.admin.bookings = [];
    } finally {
        appState.admin.isLoading = false;
        renderAdminReservations();
    }
}

function setupFullscreenPreviewListener() {
    const openButton = document.getElementById('preview-fullscreen-button');
    const modalContent = document.getElementById('fullscreen-preview-content');
    const previewSource = document.getElementById('visual-preview');

    if (!openButton || !modalContent || !previewSource) return;

    openButton.addEventListener('click', () => {
        modalContent.innerHTML = '';
        const clonedContent = previewSource.cloneNode(true) as HTMLElement;
        
        const placeholder = clonedContent.querySelector('.placeholder-text');
        if (placeholder) {
             placeholder.textContent = 'Comece a selecionar itens para visualizá-los aqui em tela cheia!';
        }
        
        modalContent.appendChild(clonedContent);
        
        toggleModal('fullscreen-preview-modal', true);
    });
}

function setupAdminEventListeners() {
    // Tab navigation
    document.querySelector('.admin-tabs')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if(target.matches('.admin-tab-button')) {
            switchAdminTab(target.dataset.tab as 'reservations' | 'items' | 'collections');
        }
    });

    // Reservations tab listeners
    document.getElementById('admin-reservations-tab')?.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if(target.id === 'date-filter') {
            appState.admin.filterDate = target.value;
            renderAdminReservations();
        } else if (target.matches('.confirm-checkbox')) {
            const bookingId = target.dataset.bookingId!;
            const booking = MOCK_BOOKINGS_DB.find(b => b.id === bookingId);
            if(booking) booking.confirmed = target.checked;
            loadAndRenderAdminBookings(); // Re-render to apply class and keep sort order
        }
    });

    document.getElementById('admin-reservations-tab')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if(target.id === 'clear-filter') {
            (document.getElementById('date-filter') as HTMLInputElement).value = '';
            appState.admin.filterDate = '';
            renderAdminReservations();
        } else if (target.matches('.delete-button')) {
            appState.admin.bookingToDelete = target.dataset.bookingId!;
            toggleModal('delete-confirm-modal', true);
        }
    });

    document.getElementById('confirm-delete-button')?.addEventListener('click', () => {
        if(appState.admin.bookingToDelete) {
            MOCK_BOOKINGS_DB = MOCK_BOOKINGS_DB.filter(b => b.id !== appState.admin.bookingToDelete);
            appState.admin.bookingToDelete = null;
            toggleModal('delete-confirm-modal', false);
            loadAndRenderAdminBookings();
        }
    });

    // Items tab listeners
    document.getElementById('add-item-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (document.getElementById('itemName') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('itemPrice') as HTMLInputElement).value);
        const imageInput = (document.getElementById('itemImage') as HTMLInputElement);
        const zIndex = parseInt((document.getElementById('itemZIndex') as HTMLInputElement).value);
        const width = parseInt((document.getElementById('itemWidth') as HTMLInputElement).value);
        const bottom = parseInt((document.getElementById('itemBottom') as HTMLInputElement).value);
        const left = (document.getElementById('itemLeft') as HTMLInputElement).value;

        const imageFile = imageInput.files?.[0];

        if (name && !isNaN(price) && imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newItem: Item = {
                    id: `item_${Date.now()}`,
                    name,
                    price,
                    image: event.target?.result as string,
                    zIndex, width, bottom, left
                };
                appState.admin.items.push(newItem);
                renderItemManager(); // Update admin view
                renderItemSelection(); // Update customer view
                form.reset();
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert("Por favor, preencha todos os campos, incluindo a imagem.");
        }
    });

    document.getElementById('items-management-list')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        const card = target.closest('.managed-item-card') as HTMLElement;
        if (!card) return;

        const itemId = card.dataset.itemId!;
        const itemIndex = appState.admin.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return;

        if (target.matches('.save-item-button')) {
            const newName = (card.querySelector(`#name-${itemId}`) as HTMLInputElement).value;
            const newPrice = parseFloat((card.querySelector(`#price-${itemId}`) as HTMLInputElement).value);
            
            if (newName && !isNaN(newPrice)) {
                appState.admin.items[itemIndex].name = newName;
                appState.admin.items[itemIndex].price = newPrice;
                renderItemSelection(); // Update customer view
                alert(`Item "${newName}" salvo com sucesso!`);
            } else {
                alert("Nome ou preço inválido.");
            }
        }

        if (target.matches('.delete-item-button')) {
            if (confirm(`Tem certeza que deseja excluir o item "${appState.admin.items[itemIndex].name}"?`)) {
                appState.admin.items.splice(itemIndex, 1);
                renderItemManager();
                renderItemSelection();
            }
        }
    });
    
    // Collections tab listeners
    document.getElementById('add-collection-image-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const imageInput = document.getElementById('collectionImage') as HTMLInputElement;
        const imageFile = imageInput.files?.[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newImage: GalleryImage = {
                    id: `gallery_${Date.now()}`,
                    src: event.target?.result as string
                };
                appState.admin.galleryImages.push(newImage);
                renderCollectionManager();
                renderGallery(); // Update gallery in case it's open
                form.reset();
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert("Por favor, selecione uma imagem.");
        }
    });

    document.getElementById('collection-management-list')?.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.matches('.delete-collection-button')) {
            const card = target.closest('.collection-image-card') as HTMLElement;
            const imageId = card.dataset.imageId!;
            if (confirm('Tem certeza que deseja excluir esta imagem da coleção?')) {
                appState.admin.galleryImages = appState.admin.galleryImages.filter(img => img.id !== imageId);
                renderCollectionManager();
                renderGallery();
            }
        }
    });


    document.getElementById('logout-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToView('main-view');
    });
}

// =================================================================================
// INITIALIZATION
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initial renders
    renderApp();

    // Setup Event Listeners
    setupBookingEventListeners();
    setupAdminEventListeners();
    setupGalleryEventListeners();
    setupFullscreenPreviewListener();

    // Modal Triggers
    document.querySelectorAll('[data-modal-open]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = (trigger as HTMLElement).dataset.modalOpen!;
            toggleModal(modalId, true);
        });
    });
    document.querySelectorAll('[data-modal-close]').forEach(trigger => {
         trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = (trigger as HTMLElement).dataset.modalClose!;
            toggleModal(modalId, false);
        });
    });

    // Login Form
    const loginForm = document.getElementById('admin-login-form') as HTMLFormElement;
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = (loginForm.elements.namedItem('username') as HTMLInputElement).value;
        const password = (loginForm.elements.namedItem('password') as HTMLInputElement).value;
        const errorMessageEl = document.getElementById('login-error-message')!;

        if (username === 'admin' && password === 'sousil123') {
            errorMessageEl.style.display = 'none';
            loginForm.reset();
            toggleModal('admin-login-modal', false);
            navigateToView('admin-view');
        } else {
            errorMessageEl.textContent = 'Usuário ou senha inválidos.';
            errorMessageEl.style.display = 'block';
        }
    });
});
