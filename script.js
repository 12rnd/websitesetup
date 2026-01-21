// Product Data
const products = [
    {
        id: 1,
        title: "Wireless Noise-Cancelling Headphones",
        price: 299.00,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    },
    {
        id: 2,
        title: "Minimalist Analog Watch",
        price: 149.50,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"
    },
    {
        id: 3,
        title: "Ergonomic Mechanical Keyboard",
        price: 189.00,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b91a603?w=500&q=80"
    },
    {
        id: 4,
        title: "Premium Leather Backpack",
        price: 225.00,
        category: "lifestyle",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
    },
    {
        id: 5,
        title: "Smart Home Assistant Hub",
        price: 99.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1558089687-f282ffcbc0d5?w=500&q=80"
    },
    {
        id: 6,
        title: "Ceramic Coffee Pour-Over Set",
        price: 45.00,
        category: "lifestyle",
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500&q=80"
    },
    {
        id: 7,
        title: "Polarized Aviator Sunglasses",
        price: 120.00,
        category: "accessories",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80"
    },
    {
        id: 8,
        title: "Portable SSD 1TB",
        price: 159.00,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1597872252165-4827c47d411d?w=500&q=80"
    }
];

// State
let cart = [];
let currentCategory = 'all';

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total-price');
const cartCountEl = document.getElementById('cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const toast = document.getElementById('toast');

// Initialization
function init() {
    renderProducts();
    setupEventListeners();

    // Entrance Animation
    const entranceOverlay = document.getElementById('entrance-overlay');
    if (entranceOverlay) {
        generateBackgroundElements(entranceOverlay);
        setTimeout(() => {
            entranceOverlay.classList.add('hidden');
        }, 2000); // Keep overlay for 2 seconds
    }
}

function generateBackgroundElements(container) {
    // Create Map Container
    const mapContainer = document.createElement('div');
    mapContainer.classList.add('map-container');
    container.appendChild(mapContainer);
}

// Render Products
function renderProducts() {
    productGrid.innerHTML = '';

    const filteredProducts = currentCategory === 'all'
        ? products
        : products.filter(p => p.category === currentCategory);

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="card-content">
                <div class="card-category">${product.category}</div>
                <h3 class="card-title">${product.title}</h3>
                <div class="card-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i data-lucide="plus"></i> Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    // Re-initialize icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Cart Logic
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`Added ${product.title} to cart`);
    openCart();
};

window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
};

function updateCartUI() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    // Update Total Price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

    // Render Items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is empty.</div>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// UI Interactions
function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function setupEventListeners() {
    // Cart Toggles
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            e.target.classList.add('active');
            // Update state
            currentCategory = e.target.dataset.category;
            renderProducts();
        });
    });

    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            if (input.value) {
                showToast('Thanks for subscribing!');
                input.value = '';
            }
        });
    }
}

// Start
init();
