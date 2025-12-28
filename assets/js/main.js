// Theme Management
let currentTheme = localStorage.getItem('herhands_theme') || 'light';

// Data Management
let currentUser = null;
let users = JSON.parse(localStorage.getItem('herhands_users')) || [];
let products = JSON.parse(localStorage.getItem('herhands_products')) || [];
let cart = JSON.parse(localStorage.getItem('herhands_cart')) || [];
let orders = JSON.parse(localStorage.getItem('herhands_orders')) || [];
let orderCounter = 1001;

// Image Management
let productImages = [];
let avatarPreview = null;
let defaultAvatars = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=15',
    'https://i.pravatar.cc/150?img=20'
];

// Dashboard State
let currentDashboardTab = 'overview';
let currentProfileTab = 'about';

// Initialize Application
document.addEventListener('DOMContentLoaded', function () {
    // Apply saved theme
    applyTheme(currentTheme);

    // Initialize auth
    const savedUser = localStorage.getItem('herhands_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }

    // Initialize sample data
    initializeSampleData();

    // Update cart count
    updateCartCount();

    // Load home page
    loadPage('home');

    // Setup mobile menu
    setupMobileMenu();

    // Setup profile dropdown
    setupProfileDropdown();

    // Setup theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Setup image uploads
    setupProductImageUpload();
    setupAvatarUpload();
});

// Theme Functions
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(currentTheme);
    localStorage.setItem('herhands_theme', currentTheme);
    showAlert(`Switched to ${currentTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle button text
    const themeText = document.getElementById('theme-text');
    const currentThemeSpan = document.getElementById('current-theme');

    if (themeText) {
        themeText.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    if (currentThemeSpan) {
        currentThemeSpan.textContent = theme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    // Update theme icon animation
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.style.transform = theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Setup Mobile Menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', function () {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.backgroundColor = 'var(--bg-secondary)';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        }
    });
}

// Setup Profile Dropdown
function setupProfileDropdown() {
    const userProfile = document.querySelector('.user-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');

    if (userProfile) {
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function () {
            profileDropdown.classList.remove('show');
        });
    }
}

// Initialize Sample Data
function initializeSampleData() {
    if (users.length === 0) {
        users = [
            {
                id: 1,
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah@example.com",
                password: "password123",
                accountType: "seller",
                joinDate: new Date().toISOString(),
                profilePic: "https://i.pravatar.cc/150?img=1",
                bio: "Handmade ceramic artist with 10 years of experience creating unique pottery pieces.",
                phone: "+1 (555) 123-4567",
                location: "Cairo, Egypt",
                website: "https://sarahceramics.com",
                skills: ["Ceramics", "Pottery", "Hand Painting", "Glazing"],
                shopName: "Sarah's Ceramics",
                shopDescription: "Beautiful handmade ceramic pieces for your home",
                responseTime: "Within 24 hours",
                processingTime: "3-5 days"
            },
            {
                id: 2,
                firstName: "Emma",
                lastName: "Wilson",
                email: "emma@example.com",
                password: "password123",
                accountType: "buyer",
                joinDate: new Date().toISOString(),
                profilePic: "https://i.pravatar.cc/150?img=5",
                bio: "Love supporting women entrepreneurs and finding unique handmade products.",
                phone: "+1 (555) 987-6543",
                location: "Cairo, Egypt",
                website: "",
                skills: [],
                shopName: "",
                shopDescription: "",
                responseTime: "",
                processingTime: ""
            }
        ];
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "Handmade Ceramic Mug Set",
                category: "Home & Living",
                seller: "Sarah's Ceramics",
                sellerId: 1,
                price: 45.99,
                description: "Beautiful handmade ceramic mugs with unique glaze patterns. Each mug is one-of-a-kind.",
                stock: 15,
                tags: ["ceramic", "mug", "handmade", "home"],
                images: ["../images/photo-1544787219-7f47ccb76574.jfif"],
                rating: 4.8,
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                name: "Organic Lavender Soap Bars",
                category: "Beauty & SkinCare",
                seller: "Natural Bliss",
                sellerId: 2,
                price: 24.50,
                description: "Handcrafted soap bars made with organic lavender essential oil and natural ingredients.",
                stock: 30,
                tags: ["soap", "organic", "lavender", "natural"],
                images: ["../images/skincare-7.jpg"],
                rating: 4.9,
                createdAt: new Date().toISOString()
            },
            {
                id: 3,
                name: "Handwoven Cotton Scarf",
                category: "Fashion & Apparel",
                seller: "Weaving Wonders",
                sellerId: 3,
                price: 38.00,
                description: "Soft cotton scarf handwoven with traditional techniques. Perfect for any season.",
                stock: 20,
                tags: ["scarf", "cotton", "handwoven", "fashion"],
                images: ["../images/photo-1591047139829-d91aecb6caea.jfif"],
                rating: 4.7,
                createdAt: new Date().toISOString()
            },
            {
                id: 4,
                name: "Homemade Strawberry Jam",
                category: "Food & Baking",
                seller: "Grandma's Kitchen",
                sellerId: 4,
                price: 12.99,
                description: "Delicious strawberry jam made with fresh organic strawberries and natural sweeteners.",
                stock: 25,
                tags: ["jam", "strawberry", "homemade", "food"],
                images: ["../images/food-8.jpg"],
                rating: 4.9,
                createdAt: new Date().toISOString()
            },
            {
                id: 5,
                name: "Personalized Birthstone Necklace",
                category: "Accessories & Jewelry",
                seller: "Jewelry by Maria",
                sellerId: 5,
                price: 65.00,
                description: "Custom necklace with genuine birthstone. Perfect personalized gift.",
                stock: 10,
                tags: ["necklace", "jewelry", "personalized", "birthstone"],
                images: ["../images/accessories-2.jpg"],
                rating: 4.9,
                createdAt: new Date().toISOString()
            },
            {
                id: 6,
                name: "Scented Soy Candle Set",
                category: "Home & Living",
                seller: "Cozy Home Candles",
                sellerId: 6,
                price: 28.75,
                description: "Natural soy candles with relaxing scents. Burn time 40+ hours each.",
                stock: 18,
                tags: ["candle", "soy", "scented", "home"],
                images: ["../images/skincare-2.jpg"],
                rating: 4.8,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('herhands_products', JSON.stringify(products));
    }

    if (orders.length === 0) {
        orders = [
            {
                id: 1,
                orderNumber: "HH-1001",
                userId: 2,
                items: [
                    {
                        productId: 1,
                        productName: "Handmade Ceramic Mug Set",
                        sellerId: 1,
                        sellerName: "Sarah's Ceramics",
                        quantity: 2,
                        price: 45.99,
                        total: 91.98
                    }
                ],
                shipping: {
                    firstName: "Emma",
                    lastName: "Wilson",
                    address: "123 Main St",
                    city: "Los Angeles",
                    state: "CA",
                    zip: "90001",
                    country: "US",
                    phone: "+1 (555) 987-6543",
                    email: "emma@example.com",
                    notes: "Please deliver to front door"
                },
                payment: {
                    method: "credit-card",
                    cardNumber: "**** **** **** 1234"
                },
                subtotal: 91.98,
                shippingCost: 5.99,
                tax: 9.20,
                total: 107.17,
                status: "delivered",
                createdAt: new Date('2023-10-15').toISOString(),
                updatedAt: new Date('2023-10-20').toISOString()
            }
        ];
        localStorage.setItem('herhands_orders', JSON.stringify(orders));
    }
}

// Product Functions
function populateProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const hasImages = product.images && product.images.length > 0;
        const firstImage = hasImages ? product.images[0] : 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${firstImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                        ${product.stock < 5 ? `<span class="product-badge">Low Stock</span>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-seller">
                            <img src="https://i.pravatar.cc/150?img=${product.sellerId || 1}" alt="${product.seller}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;">
                            <span>${product.seller}</span>
                        </div>
                        <div class="product-price">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <button class="add-to-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
        productsGrid.appendChild(productCard);
    });
}

function populateFeaturedProducts() {
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;

    const featuredProducts = products.slice(0, 6);
    featuredGrid.innerHTML = '';

    featuredProducts.forEach(product => {
        const hasImages = product.images && product.images.length > 0;
        const firstImage = hasImages ? product.images[0] : 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${firstImage}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-seller">
                            <img src="https://i.pravatar.cc/150?img=${product.sellerId || 1}" alt="${product.seller}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover;">
                            <span>${product.seller}</span>
                        </div>
                        <div class="product-price">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <button class="add-to-cart" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
        featuredGrid.appendChild(productCard);
    });
}

// Cart Functions
function addToCart(productId) {
    if (!currentUser) {
        showAlert('Please log in to add items to cart', 'error');
        showAuthModal('login');
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: cart.length + 1,
            productId: product.id,
            name: product.name,
            seller: product.seller,
            sellerId: product.sellerId,
            price: product.price,
            quantity: 1,
            image: product.images && product.images.length > 0 ? product.images[0] : ''
        });
    }

    localStorage.setItem('herhands_cart', JSON.stringify(cart));
    updateCartCount();
    showAlert(`Added ${product.name} to cart`, 'success');

    if (window.location.hash === '#cart') {
        loadCartPage();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

function loadCartPage() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }

    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSummaryContainer = document.getElementById('cart-summary-container');

    if (!cartItemsContainer || !cartSummaryContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <i class="fas fa-shopping-cart"></i>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to your cart and they will appear here.</p>
                        <button class="btn mt-4" onclick="loadPage('products')">Browse Products</button>
                    </div>
                `;

        cartSummaryContainer.innerHTML = '';
        return;
    }

    // Render cart items
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return;

        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
                    <div class="cart-item-image">
                        ${item.image ?
                `<img src="${item.image}" alt="${item.name}">` :
                `<div style="background-color: var(--bg-tertiary); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                <i class="fas fa-box" style="font-size: 2rem;"></i>
                            </div>`
            }
                    </div>
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.name}</h3>
                        <p class="cart-item-seller">Sold by: ${item.seller}</p>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn" onclick="updateCartQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.productId})">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Render cart summary
    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    cartSummaryContainer.innerHTML = `
                <h2 class="summary-title">Order Summary</h2>
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span class="amount">$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span class="amount">${shippingCost === 0 ? 'FREE' : '$' + shippingCost.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax</span>
                    <span class="amount">$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span class="amount">$${total.toFixed(2)}</span>
                </div>
                <div class="coupon-section">
                    <p>Have a coupon code?</p>
                    <div class="coupon-input d-flex flex-column">
                        <input type="text" placeholder="Enter coupon code">
                        <button class="btn btn-outline d-block mt-2" onclick="applyCoupon()">Apply</button>
                    </div>
                </div>
                <button class="btn" style="width: 100%;" onclick="showCheckoutModal()">Proceed to Checkout</button>
            `;
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.productId === productId);
    if (!item) return;

    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
        showAlert(`Only ${product.stock} items available in stock`, 'error');
        return;
    }

    item.quantity = newQuantity;
    localStorage.setItem('herhands_cart', JSON.stringify(cart));
    updateCartCount();
    loadCartPage();
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.productId === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem('herhands_cart', JSON.stringify(cart));
        updateCartCount();
        showAlert('Item removed from cart', 'info');
        loadCartPage();
    }
}

function applyCoupon() {
    const couponInput = document.querySelector('.coupon-input input');
    const couponCode = couponInput.value.trim();

    if (!couponCode) {
        showAlert('Please enter a coupon code', 'error');
        return;
    }

    if (couponCode === 'HERHANDS10') {
        showAlert('Coupon applied! 10% discount has been applied to your order.', 'success');
    } else {
        showAlert('Invalid coupon code', 'error');
    }

    couponInput.value = '';
}

// Checkout Functions
function showCheckoutModal() {
    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    if (!currentUser) {
        showAuthModal('login');
        return;
    }

    // Calculate order summary
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    // Populate order summary in checkout modal
    const orderSummary = document.getElementById('checkout-order-summary');
    orderSummary.innerHTML = `
                <div class="summary-row">
                    <span>Items (${cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>${shippingCost === 0 ? 'FREE' : '$' + shippingCost.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row total" style="margin-top: 20px;">
                    <span>Total</span>
                    <span class="amount">$${total.toFixed(2)}</span>
                </div>
            `;

    // Show checkout modal
    document.getElementById('checkout-modal').classList.add('show');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('show');
}

function selectPaymentMethod(method) {
    // Remove selected class from all payment methods
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });

    // Add selected class to clicked payment method
    event.currentTarget.classList.add('selected');

    // Check the radio button
    document.getElementById(`payment-${method}`).checked = true;

    // Show corresponding payment details
    document.querySelectorAll('.payment-details').forEach(el => {
        el.classList.add('hidden');
    });
    document.getElementById(`${method}-details`).classList.remove('hidden');
}

function handleCheckout(event) {
    event.preventDefault();

    if (!currentUser) {
        showAlert('Please log in to complete your order', 'error');
        return;
    }

    if (cart.length === 0) {
        showAlert('Your cart is empty', 'error');
        return;
    }

    // Validate stock before proceeding
    let outOfStockItems = [];
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product && item.quantity > product.stock) {
            outOfStockItems.push(product.name);
        }
    });

    if (outOfStockItems.length > 0) {
        showAlert(`Some items are out of stock: ${outOfStockItems.join(', ')}`, 'error');
        return;
    }

    // Get form data
    const shipping = {
        firstName: document.getElementById('shipping-first-name').value,
        lastName: document.getElementById('shipping-last-name').value,
        address: document.getElementById('shipping-address').value,
        city: document.getElementById('shipping-city').value,
        state: document.getElementById('shipping-state').value,
        zip: document.getElementById('shipping-zip').value,
        phone: document.getElementById('shipping-phone').value,
        email: currentUser.email,
        notes: document.getElementById('shipping-notes').value
    };

    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    let payment = {
        method: paymentMethod
    };

    if (paymentMethod === 'credit-card') {
        payment.cardNumber = '**** **** **** ' + document.getElementById('card-number').value.slice(-4);
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = cart.map(item => {
        const product = products.find(p => p.id === item.productId);
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        return {
            productId: item.productId,
            productName: item.name,
            sellerId: item.sellerId,
            sellerName: item.seller,
            quantity: item.quantity,
            price: item.price,
            total: itemTotal,
            image: item.image
        };
    });

    const shippingCost = subtotal > 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;

    // Create order
    const orderNumber = `HH-${orderCounter++}`;
    const newOrder = {
        id: orders.length + 1,
        orderNumber: orderNumber,
        userId: currentUser.id,
        items: orderItems,
        shipping: shipping,
        payment: payment,
        subtotal: subtotal,
        shippingCost: shippingCost,
        tax: tax,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Update product stock
    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            product.stock -= item.quantity;
        }
    });

    // Save data
    orders.push(newOrder);
    localStorage.setItem('herhands_orders', JSON.stringify(orders));
    localStorage.setItem('herhands_products', JSON.stringify(products));

    // Clear cart
    cart = [];
    localStorage.setItem('herhands_cart', JSON.stringify(cart));
    updateCartCount();

    // Show success modal
    showSuccessModal(newOrder);

    // Close checkout modal
    closeCheckoutModal();
}

function showSuccessModal(order) {
    // Set order number
    document.getElementById('success-order-number').textContent = order.orderNumber;

    // Populate order details
    const orderDetails = document.getElementById('success-order-details');
    orderDetails.innerHTML = `
                <div class="summary-row">
                    <span>Order Total</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping to</span>
                    <span>${order.shipping.firstName} ${order.shipping.lastName}</span>
                </div>
                <div class="summary-row">
                    <span>Items</span>
                    <span>${order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div class="summary-row">
                    <span>Payment Method</span>
                    <span>${order.payment.method === 'credit-card' ? 'Credit Card' :
            order.payment.method === 'paypal' ? 'PayPal' : 'Bank Transfer'}</span>
                </div>
                <div class="summary-row">
                    <span>Status</span>
                    <span class="status-badge status-pending">Pending</span>
                </div>
            `;

    // Show success modal
    document.getElementById('order-success-modal').classList.add('show');
}

function closeSuccessModal() {
    document.getElementById('order-success-modal').classList.remove('show');
    loadPage('products');
}

function viewOrderDetails() {
    closeSuccessModal();
    loadPage('orders');
}

// Orders Page Functions
function loadOrdersPage() {
    if (!currentUser) return;

    const ordersList = document.getElementById('orders-list');
    const ordersEmpty = document.getElementById('orders-empty');

    if (!ordersList || !ordersEmpty) return;

    // Get user's orders
    const userOrders = orders.filter(order => order.userId === currentUser.id);

    if (userOrders.length === 0) {
        ordersList.classList.add('hidden');
        ordersEmpty.classList.remove('hidden');
        return;
    }

    ordersList.classList.remove('hidden');
    ordersEmpty.classList.add('hidden');

    // Render orders
    ordersList.innerHTML = '';

    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';

        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        orderCard.innerHTML = `
                    <div class="order-header">
                        <div>
                            <div class="order-id">Order #${order.orderNumber}</div>
                            <div class="order-date">Placed on ${orderDate}</div>
                        </div>
                        <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
                    </div>
                    
                    <div class="order-products">
                        ${order.items.map(item => `
                            <div class="order-product">
                                <div class="order-product-image">
                                    ${item.image ?
                `<img src="${item.image}" alt="${item.productName}">` :
                `<div style="background-color: var(--bg-tertiary); width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                            <i class="fas fa-box" style="font-size: 1.5rem;"></i>
                                        </div>`
            }
                                </div>
                                <div class="order-product-details">
                                    <div class="order-product-title">${item.productName}</div>
                                    <div class="order-product-seller">Sold by: ${item.sellerName}</div>
                                    <div class="order-product-price">$${item.price.toFixed(2)} x ${item.quantity} = $${item.total.toFixed(2)}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="order-footer">
                        <div class="order-total">
                            Total: <span class="amount">$${order.total.toFixed(2)}</span>
                        </div>
                        <div class="order-actions">
                            <button class="btn btn-outline" onclick="viewOrderDetailsById(${order.id})">View Details</button>
                            ${order.status === 'delivered' ? `<button class="btn" onclick="reorder(${order.id})">Reorder</button>` : ''}
                        </div>
                    </div>
                `;

        ordersList.appendChild(orderCard);
    });
}

function viewOrderDetailsById(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    alert(`Order Details:\n\nOrder #: ${order.orderNumber}\nStatus: ${order.status}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nTotal: $${order.total.toFixed(2)}\n\nShipping to: ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zip}\n\nPayment Method: ${order.payment.method}\nCard: ${order.payment.cardNumber || 'N/A'}`);
}

function reorder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Add all items from the order to cart
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.productId === item.productId);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                id: cart.length + 1,
                productId: item.productId,
                name: item.productName,
                seller: item.sellerName,
                sellerId: item.sellerId,
                price: item.price,
                quantity: item.quantity,
                image: item.image || ''
            });
        }
    });

    localStorage.setItem('herhands_cart', JSON.stringify(cart));
    updateCartCount();
    showAlert('All items from this order have been added to your cart!', 'success');

    // Redirect to cart
    loadPage('cart');
}

function filterOrders() {
    showAlert('Filtering orders...', 'info');
    loadOrdersPage();
}

function resetFilters() {
    document.getElementById('order-status-filter').value = 'all';
    document.getElementById('order-sort').value = 'newest';
    loadOrdersPage();
}

function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'pending': return 'status-pending';
        case 'processing': return 'status-processing';
        case 'shipped': return 'status-shipped';
        case 'delivered': return 'status-delivered';
        case 'cancelled': return 'status-cancelled';
        default: return '';
    }
}

// Auth Modal Functions
function showAuthModal(type) {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('show');

    if (type === 'login') {
        switchAuthForm('login');
        document.getElementById('auth-modal-title').textContent = 'Login to HerHands';
    } else {
        switchAuthForm('register');
        document.getElementById('auth-modal-title').textContent = 'Join HerHands';
    }
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.remove('show');
}

function switchAuthForm(formId) {
    document.getElementById('login-form').classList.toggle('hidden', formId !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', formId !== 'register');
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('herhands_current_user', JSON.stringify(user));
        updateUIForLoggedInUser();
        closeAuthModal();
        showAlert('Login successful! Welcome back, ' + user.firstName, 'success');

        if (user.accountType === 'seller') {
            loadPage('dashboard');
        }
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('reg-first-name').value;
    const lastName = document.getElementById('reg-last-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const accountType = document.getElementById('account-type').value;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !accountType) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    if (!document.getElementById('agree-terms').checked) {
        showAlert('You must agree to the terms and conditions', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showAlert('An account with this email already exists', 'error');
        return;
    }

    const newUser = {
        id: users.length + 1,
        firstName,
        lastName,
        email,
        password,
        accountType,
        joinDate: new Date().toISOString(),
        profilePic: `https://i.pravatar.cc/150?img=${users.length + 1}`,
        bio: '',
        phone: '',
        location: '',
        website: '',
        skills: []
    };

    users.push(newUser);
    localStorage.setItem('herhands_users', JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem('herhands_current_user', JSON.stringify(newUser));
    updateUIForLoggedInUser();
    closeAuthModal();
    showAlert('Account created successfully! Welcome to HerHands, ' + firstName, 'success');

    if (accountType === 'seller') {
        loadPage('dashboard');
    }
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    if (!currentUser) return;

    document.getElementById('auth-buttons').classList.add('hidden');
    document.getElementById('user-profile').classList.remove('hidden');
    document.getElementById('dashboard-link').classList.remove('hidden');

    document.getElementById('profile-name').textContent = currentUser.firstName;
    document.getElementById('profile-pic').src = currentUser.profilePic || 'https://i.pravatar.cc/150';
    document.getElementById('profile-avatar-img').src = currentUser.profilePic || 'https://i.pravatar.cc/150';
}

function updateUIForLoggedOutUser() {
    document.getElementById('auth-buttons').classList.remove('hidden');
    document.getElementById('user-profile').classList.add('hidden');
    document.getElementById('dashboard-link').classList.add('hidden');
}

// Logout Function
function logout() {
    currentUser = null;
    localStorage.removeItem('herhands_current_user');
    updateUIForLoggedOutUser();
    showAlert('You have been logged out', 'info');
    loadPage('home');
}

// Page Navigation
function loadPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(`${pageId}-page`).classList.remove('hidden');

    // Update active navigation link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });

    // Update active nav link based on page
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });

    // Load page specific content
    switch (pageId) {
        case 'home':
            populateFeaturedProducts();
            break;
        case 'products':
            populateProducts();
            break;
        case 'cart':
            loadCartPage();
            break;
        case 'dashboard':
            if (!currentUser || currentUser.accountType !== 'seller') {
                showAlert('You must be logged in as a seller to access the dashboard', 'error');
                loadPage('home');
                return;
            }
            switchDashboardTab('overview');
            break;
        case 'profile':
            if (!currentUser) {
                showAuthModal('login');
                return;
            }
            switchProfileTab('about');
            break;
        case 'orders':
            if (!currentUser) {
                showAuthModal('login');
                return;
            }
            loadOrdersPage();
            break;
    }

    // Close mobile menu if open
    const navLinksContainer = document.querySelector('.nav-links');
    if (window.innerWidth <= 768 && navLinksContainer.style.display === 'flex') {
        navLinksContainer.style.display = 'none';
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// Image Upload Functions
function setupProductImageUpload() {
    const uploadArea = document.getElementById('product-image-upload');
    const fileInput = document.getElementById('product-images-input');

    if (!uploadArea || !fileInput) return;

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
        uploadArea.style.backgroundColor = 'rgba(191, 82, 105, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = 'var(--bg-tertiary)';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.backgroundColor = 'var(--bg-tertiary)';

        const files = e.dataTransfer.files;
        handleProductImages(files);
    });

    fileInput.addEventListener('change', (e) => {
        handleProductImages(e.target.files);
    });
}

function handleProductImages(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            showAlert(`Image ${file.name} is too large (max 5MB)`, 'error');
            continue;
        }

        // Check file type
        if (!file.type.match('image.*')) {
            showAlert(`File ${file.name} is not an image`, 'error');
            continue;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const imageData = e.target.result;
            productImages.push(imageData);
            updateProductImagePreview();
        };

        reader.readAsDataURL(file);
    }
}

function updateProductImagePreview() {
    const previewContainer = document.getElementById('product-images-preview');

    if (!previewContainer) return;

    previewContainer.innerHTML = '';

    productImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-preview-item';
        imageItem.innerHTML = `
                    <img src="${image}" alt="Product image ${index + 1}">
                    <button class="remove-image" onclick="removeProductImage(${index})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
        previewContainer.appendChild(imageItem);
    });
}

function removeProductImage(index) {
    productImages.splice(index, 1);
    updateProductImagePreview();
}

function setupAvatarUpload() {
    const avatarInput = document.getElementById('avatar-upload-input');

    if (!avatarInput) return;

    avatarInput.addEventListener('change', function (e) {
        const file = e.target.files[0];

        if (!file) return;

        // Check file size (2MB limit for avatars)
        if (file.size > 2 * 1024 * 1024) {
            showAlert('Avatar image is too large (max 2MB)', 'error');
            return;
        }

        // Check file type
        if (!file.type.match('image.*')) {
            showAlert('Please select an image file', 'error');
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            avatarPreview = e.target.result;
            document.getElementById('avatar-preview-img').src = avatarPreview;
            showAlert('Avatar preview updated', 'success');
        };

        reader.readAsDataURL(file);
    });
}

function openAvatarModal() {
    document.getElementById('avatar-modal').classList.add('show');

    // Set current avatar in preview
    const currentAvatarImg = document.getElementById('current-avatar-img');
    const avatarPreviewImg = document.getElementById('avatar-preview-img');

    if (currentUser && currentUser.profilePic) {
        currentAvatarImg.src = currentUser.profilePic;
        avatarPreviewImg.src = currentUser.profilePic;
    } else {
        currentAvatarImg.src = 'https://i.pravatar.cc/150';
        avatarPreviewImg.src = 'https://i.pravatar.cc/150';
    }

    avatarPreview = currentUser ? currentUser.profilePic : null;
}

function closeAvatarModal() {
    document.getElementById('avatar-modal').classList.remove('show');
    productImages = [];
    avatarPreview = null;
}

function useDefaultAvatar() {
    // Pick a random default avatar
    const randomIndex = Math.floor(Math.random() * defaultAvatars.length);
    const newAvatar = defaultAvatars[randomIndex];

    // Update preview
    const avatarPreviewImg = document.getElementById('avatar-preview-img');
    avatarPreviewImg.src = newAvatar;
    avatarPreview = newAvatar;

    showAlert('Default avatar selected', 'info');
}

function uploadNewAvatar() {
    document.getElementById('avatar-upload-input').click();
}

function takePhoto() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showAlert('Camera access is not supported by your browser', 'error');
        return;
    }

    showAlert('Camera functionality would be implemented in a production app', 'info');
}

function saveAvatar() {
    if (!avatarPreview) {
        showAlert('Please select or upload an avatar first', 'error');
        return;
    }

    if (!currentUser) {
        showAlert('You must be logged in to update your avatar', 'error');
        return;
    }

    // Update current user's avatar
    currentUser.profilePic = avatarPreview;

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    // Update in localStorage
    localStorage.setItem('herhands_current_user', JSON.stringify(currentUser));

    // Update UI
    document.getElementById('profile-pic').src = avatarPreview;
    document.getElementById('profile-avatar-img').src = avatarPreview;

    showAlert('Avatar updated successfully!', 'success');
    closeAvatarModal();
}

// Dashboard Functions
function switchDashboardTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('#dashboard-page .dashboard-main > div').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.dashboard-nav a').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');

    // Add active class to selected nav link
    document.querySelector(`.dashboard-nav a[onclick="switchDashboardTab('${tabId}')"]`).classList.add('active');

    // Update current tab
    currentDashboardTab = tabId;

    // Load tab data
    switch (tabId) {
        case 'overview':
            loadDashboardOverview();
            break;
        case 'products':
            loadDashboardProducts();
            break;
        case 'orders':
            loadDashboardOrders();
            break;
    }
}

function loadDashboardOverview() {
    if (!currentUser) return;

    // Calculate seller stats
    const sellerOrders = orders.filter(order =>
        order.items.some(item => item.sellerId === currentUser.id)
    );

    const sellerProducts = products.filter(product => product.sellerId === currentUser.id);

    const totalEarnings = sellerOrders.reduce((total, order) => {
        const orderItems = order.items.filter(item => item.sellerId === currentUser.id);
        return total + orderItems.reduce((sum, item) => sum + item.total, 0);
    }, 0);

    const totalOrders = sellerOrders.length;
    const activeProducts = sellerProducts.length;

    // Update stats cards
    document.getElementById('total-earnings').textContent = `$${totalEarnings.toFixed(2)}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('active-products').textContent = activeProducts;
    document.getElementById('avg-rating').textContent = '4.8';

    // Load recent orders table
    const recentOrdersTable = document.getElementById('recent-orders-table');
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = '';

        const recentOrders = sellerOrders.slice(0, 5);

        if (recentOrders.length === 0) {
            recentOrdersTable.innerHTML = `
                        <tr>
                            <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                                <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                                <p>No orders yet</p>
                            </td>
                        </tr>
                    `;
        } else {
            recentOrders.forEach(order => {
                const orderDate = new Date(order.createdAt).toLocaleDateString();
                const orderTotal = order.items
                    .filter(item => item.sellerId === currentUser.id)
                    .reduce((total, item) => total + item.total, 0);

                const row = document.createElement('tr');
                row.innerHTML = `
                            <td>${order.orderNumber}</td>
                            <td>${order.shipping.firstName} ${order.shipping.lastName}</td>
                            <td>${orderDate}</td>
                            <td>$${orderTotal.toFixed(2)}</td>
                            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
                            <td>
                                <button class="action-btn view" onclick="viewOrder(${order.id})">View</button>
                            </td>
                        `;
                recentOrdersTable.appendChild(row);
            });
        }
    }
}

function loadDashboardProducts() {
    if (!currentUser) return;

    const myProductsGrid = document.getElementById('my-products-grid');
    if (!myProductsGrid) return;

    myProductsGrid.innerHTML = '';

    const sellerProducts = products.filter(product => product.sellerId === currentUser.id);

    if (sellerProducts.length === 0) {
        myProductsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-secondary);">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 20px;"></i>
                        <h3>No products yet</h3>
                        <p>Add your first product to start selling</p>
                        <button class="btn mt-4" onclick="showAddProductModal()">Add New Product</button>
                    </div>
                `;
        return;
    }

    sellerProducts.forEach(product => {
        const hasImages = product.images && product.images.length > 0;
        const firstImage = hasImages ? product.images[0] : null;

        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
                    <div class="product-image">
                        ${hasImages ?
                `<img src="${firstImage}" alt="${product.name}">` :
                `<div style="background-color: var(--bg-tertiary); height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                <i class="fas fa-box-open" style="font-size: 3rem;"></i>
                            </div>`
            }
                        ${product.stock < 5 ? `<span class="product-badge">Low Stock</span>` : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">
                            <span class="price">$${product.price.toFixed(2)}</span>
                            <span style="font-size: 0.9rem; color: var(--text-secondary);">Stock: ${product.stock}</span>
                        </div>
                        <div style="display: flex; gap: 10px; margin-top: 15px;">
                            <button class="btn btn-outline" style="padding: 8px 15px; font-size: 0.9rem;" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn" style="padding: 8px 15px; font-size: 0.9rem;" onclick="viewProduct(${product.id})">View</button>
                        </div>
                    </div>
                `;
        myProductsGrid.appendChild(productCard);
    });
}

function loadDashboardOrders() {
    if (!currentUser) return;

    const ordersTable = document.getElementById('orders-table');
    if (!ordersTable) return;

    ordersTable.innerHTML = '';

    const sellerOrders = orders.filter(order =>
        order.items.some(item => item.sellerId === currentUser.id)
    );

    if (sellerOrders.length === 0) {
        ordersTable.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                            <i class="fas fa-shopping-bag" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                            <p>No orders yet</p>
                        </td>
                    </tr>
                `;
        return;
    }

    sellerOrders.forEach(order => {
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const productsCount = order.items.filter(item => item.sellerId === currentUser.id).length;
        const orderTotal = order.items
            .filter(item => item.sellerId === currentUser.id)
            .reduce((total, item) => total + item.total, 0);

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${order.orderNumber}</td>
                    <td>${order.shipping.firstName} ${order.shipping.lastName}</td>
                    <td>${productsCount} product(s)</td>
                    <td>${orderDate}</td>
                    <td>$${orderTotal.toFixed(2)}</td>
                    <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
                    <td>
                        <button class="action-btn view" onclick="viewOrder(${order.id})">View</button>
                        <button class="action-btn edit" onclick="editOrder(${order.id})">Edit</button>
                    </td>
                `;
        ordersTable.appendChild(row);
    });
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    alert(`Viewing order ${order.orderNumber}\nStatus: ${order.status}\nTotal: $${order.total}`);
}

function editOrder(orderId) {
    alert(`Edit order functionality would be implemented here for order ${orderId}`);
}

function showAddProductModal() {
    if (!currentUser || currentUser.accountType !== 'seller') {
        showAlert('You must be a seller to add products', 'error');
        return;
    }

    document.getElementById('add-product-modal').classList.add('show');
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').classList.remove('show');
}

function handleAddProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value;
    const stock = parseInt(document.getElementById('product-stock').value);
    const tags = document.getElementById('product-tags').value;

    if (!name || !description || !price || !category || !stock) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }

    // Check if at least one image is uploaded
    if (productImages.length === 0) {
        showAlert('Please upload at least one product image', 'error');
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name,
        category,
        seller: currentUser.shopName || `${currentUser.firstName}'s Shop`,
        sellerId: currentUser.id,
        price,
        description,
        stock,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        images: productImages,
        rating: 0,
        createdAt: new Date().toISOString()
    };

    products.push(newProduct);
    localStorage.setItem('herhands_products', JSON.stringify(products));

    showAlert(`Product "${name}" added successfully with ${productImages.length} images!`, 'success');
    closeAddProductModal();

    // Reset product images array
    productImages = [];

    // Clear form and preview
    document.getElementById('add-product-form').reset();
    const previewContainer = document.getElementById('product-images-preview');
    if (previewContainer) previewContainer.innerHTML = '';

    // Refresh products tab if active
    if (currentDashboardTab === 'products') {
        loadDashboardProducts();
    }

    // Refresh overview tab if active
    if (currentDashboardTab === 'overview') {
        loadDashboardOverview();
    }
}

// Product Management Functions
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    showAlert(`Edit product "${product.name}" - This would open an edit modal in a full implementation`, 'info');
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modalHTML = `
                <div class="modal show" id="view-product-modal">
                    <div class="modal-content" style="max-width: 800px;">
                        <button class="close-modal" onclick="closeViewProductModal()">&times;</button>
                        <div class="modal-header">
                            <h2>${product.name}</h2>
                        </div>
                        <div class="modal-body">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                                <div>
                                    ${product.images && product.images.length > 0 ?
            `<img src="${product.images[0]}" alt="${product.name}" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">` :
            `<div style="background-color: var(--bg-tertiary); height: 300px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--text-secondary);">
                                            <i class="fas fa-box-open" style="font-size: 4rem;"></i>
                                        </div>`
        }
                                    <div class="product-images-preview" style="display: flex; gap: 10px; margin-top: 15px;">
                                        ${product.images && product.images.length > 1 ?
            product.images.slice(1, 4).map((img, index) => `
                                                <img src="${img}" alt="Product image ${index + 2}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px; cursor: pointer;" onclick="switchMainImage('${img}')">
                                            `).join('') : ''
        }
                                    </div>
                                </div>
                                <div>
                                    <h3 style="margin-bottom: 15px;">Product Details</h3>
                                    <p><strong>Category:</strong> ${product.category}</p>
                                    <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                                    <p><strong>Stock:</strong> ${product.stock} units</p>
                                    <p><strong>Rating:</strong> ${product.rating}/5.0</p>
                                    <p><strong>Description:</strong></p>
                                    <p>${product.description}</p>
                                    <div style="margin-top: 20px;">
                                        <strong>Tags:</strong>
                                        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 5px;">
                                            ${product.tags.map(tag => `<span style="background-color: rgba(191, 82, 105, 0.1); color: var(--primary); padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">${tag}</span>`).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    // Create and show the modal
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
}

function closeViewProductModal() {
    const modal = document.getElementById('view-product-modal');
    if (modal) {
        modal.remove();
    }
}

function switchMainImage(imageSrc) {
    const mainImage = document.querySelector('#view-product-modal img[alt*="Product"]');
    if (mainImage) {
        mainImage.src = imageSrc;
    }
}

// Profile Functions
function switchProfileTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.profile-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(`${tabId}-tab`).classList.remove('hidden');

    // Add active class to selected tab button
    document.querySelector(`.profile-tab[onclick="switchProfileTab('${tabId}')"]`).classList.add('active');

    // Update current tab
    currentProfileTab = tabId;

    // Load tab data
    if (tabId === 'about') {
        loadProfileAbout();
    } else if (tabId === 'edit') {
        loadProfileEdit();
    }
}

function loadProfileAbout() {
    if (!currentUser) return;

    // Update profile information
    document.getElementById('profile-full-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('profile-email').textContent = currentUser.email;
    document.getElementById('profile-bio').textContent = currentUser.bio || 'No bio added yet';
    document.getElementById('profile-about-text').textContent = currentUser.bio || 'No information provided yet.';
    document.getElementById('profile-contact-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || 'Not provided';
    document.getElementById('profile-location').value = currentUser.location || 'Not provided';
    document.getElementById('profile-website').value = currentUser.website || 'Not provided';

    // Update stats
    const sellerProducts = products.filter(product => product.sellerId === currentUser.id);
    const sellerOrders = orders.filter(order =>
        order.items.some(item => item.sellerId === currentUser.id)
    );

    document.getElementById('profile-products').textContent = sellerProducts.length;
    document.getElementById('profile-orders').textContent = sellerOrders.length;
    document.getElementById('profile-rating').textContent = '4.8';

    const totalEarnings = sellerOrders.reduce((total, order) => {
        const orderItems = order.items.filter(item => item.sellerId === currentUser.id);
        return total + orderItems.reduce((sum, item) => sum + item.total, 0);
    }, 0);

    document.getElementById('profile-earnings').textContent = `$${totalEarnings.toFixed(2)}`;

    // Update account details
    document.getElementById('member-since').textContent = new Date(currentUser.joinDate).getFullYear();
    document.getElementById('account-type-display').textContent = currentUser.accountType === 'seller' ? 'Seller Account' : 'Buyer Account';
    document.getElementById('response-time').textContent = currentUser.responseTime || 'Not specified';
    document.getElementById('completed-orders').textContent = sellerOrders.filter(order => order.status === 'delivered').length;
    document.getElementById('customer-rating').textContent = '4.8/5.0';

    // Load skills
    const skillsList = document.getElementById('skills-list');
    skillsList.innerHTML = '';

    if (currentUser.skills && currentUser.skills.length > 0) {
        currentUser.skills.forEach(skill => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                        ${skill}
                        <i class="fas fa-times" onclick="removeSkill('${skill}')"></i>
                    `;
            skillsList.appendChild(skillTag);
        });
    } else {
        skillsList.innerHTML = '<p style="color: var(--text-secondary);">No skills added yet</p>';
    }
}

function loadProfileEdit() {
    if (!currentUser) return;

    document.getElementById('edit-first-name').value = currentUser.firstName;
    document.getElementById('edit-last-name').value = currentUser.lastName;
    document.getElementById('edit-email').value = currentUser.email;
    document.getElementById('edit-phone').value = currentUser.phone || '';
    document.getElementById('edit-location').value = currentUser.location || '';
    document.getElementById('edit-website').value = currentUser.website || '';
    document.getElementById('edit-bio').value = currentUser.bio || '';
}

function handleProfileUpdate(event) {
    event.preventDefault();

    if (!currentUser) return;

    const firstName = document.getElementById('edit-first-name').value;
    const lastName = document.getElementById('edit-last-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    const location = document.getElementById('edit-location').value;
    const website = document.getElementById('edit-website').value;
    const bio = document.getElementById('edit-bio').value;

    // Update current user
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.email = email;
    currentUser.phone = phone;
    currentUser.location = location;
    currentUser.website = website;
    currentUser.bio = bio;

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    // Update in localStorage
    localStorage.setItem('herhands_current_user', JSON.stringify(currentUser));

    // Update UI
    updateUIForLoggedInUser();

    // Refresh about tab
    loadProfileAbout();

    showAlert('Profile updated successfully!', 'success');

    // Switch back to about tab
    switchProfileTab('about');
}

function addSkill() {
    if (!currentUser) return;

    const newSkillInput = document.getElementById('new-skill');
    const newSkill = newSkillInput.value.trim();

    if (!newSkill) {
        showAlert('Please enter a skill', 'error');
        return;
    }

    if (!currentUser.skills) {
        currentUser.skills = [];
    }

    if (currentUser.skills.includes(newSkill)) {
        showAlert('This skill is already in your list', 'error');
        return;
    }

    currentUser.skills.push(newSkill);

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    // Update in localStorage
    localStorage.setItem('herhands_current_user', JSON.stringify(currentUser));

    // Clear input
    newSkillInput.value = '';

    // Refresh skills list
    loadProfileAbout();

    showAlert(`Skill "${newSkill}" added successfully!`, 'success');
}

function removeSkill(skill) {
    if (!currentUser || !currentUser.skills) return;

    currentUser.skills = currentUser.skills.filter(s => s !== skill);

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    // Update in localStorage
    localStorage.setItem('herhands_current_user', JSON.stringify(currentUser));

    // Refresh skills list
    loadProfileAbout();

    showAlert(`Skill "${skill}" removed`, 'info');
}

function handlePasswordChange(event) {
    event.preventDefault();

    if (!currentUser) return;

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (currentPassword !== currentUser.password) {
        showAlert('Current password is incorrect', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showAlert('New passwords do not match', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long', 'error');
        return;
    }

    currentUser.password = newPassword;

    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('herhands_users', JSON.stringify(users));
    }

    // Update in localStorage
    localStorage.setItem('herhands_current_user', JSON.stringify(currentUser));

    // Clear form
    event.target.reset();

    showAlert('Password changed successfully!', 'success');
}

// Shop Settings Functions
function editShippingSettings() {
    showAlert('Shipping settings functionality would be implemented here', 'info');
}

function editPaymentSettings() {
    showAlert('Payment settings functionality would be implemented here', 'info');
}

function editNotificationSettings() {
    showAlert('Notification settings functionality would be implemented here', 'info');
}

function editShopAppearance() {
    showAlert('Shop appearance settings functionality would be implemented here', 'info');
}

// Alert Functions
function showAlert(message, type) {
    // Create alert container if it doesn't exist
    let alertContainer = document.getElementById('global-alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'global-alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '80px';
        alertContainer.style.right = '20px';
        alertContainer.style.zIndex = '9999';
        document.body.appendChild(alertContainer);
    }

    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
                <span>${message}</span>
                <button class="close-alert" onclick="this.parentElement.remove()">&times;</button>
            `;

    // Add to container
    alertContainer.appendChild(alert);

    // Remove after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.remove();
        }
    }, 5000);
}