/* =========================
   MARVE STORE SETTINGS
========================= */

// Your WhatsApp number, country code included, without + or spaces.
const WHATSAPP_NUMBER = "8801314576664";

// EmailJS settings.
// Create an account at https://www.emailjs.com/
// Then create one Email Service and one Email Template.
// Replace these 3 values.
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";

if (window.emailjs) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* =========================
   MOBILE MENU
========================= */
function toggleMenu() {
  document.getElementById("nav").classList.toggle("open");
}

/* =========================
   HERO SLIDER
========================= */
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  if (dots[currentSlide]) dots[currentSlide].classList.add("active");
}

function changeSlide(direction) {
  showSlide(currentSlide + direction);
}

setInterval(() => showSlide(currentSlide + 1), 5000);

/* =========================
   CART
========================= */
let cart = JSON.parse(localStorage.getItem("marveCart") || "[]");

function saveCart() {
  localStorage.setItem("marveCart", JSON.stringify(cart));
  updateCart();
}

function addToCart(name, price, image) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, image, quantity: 1 });

  saveCart();
  showToast("Added to cart ✓");
  openCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;

  const container = document.getElementById("cartItems");
  if (!cart.length) {
    container.innerHTML = "Your cart is empty.";
    document.getElementById("cartTotal").textContent = "৳0";
    return;
  }

  let total = 0;
  container.innerHTML = cart.map((item, index) => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item">
        <img src="${escapeHtml(item.image)}" alt="">
        <div>
          <h4>${escapeHtml(item.name)}</h4>
          <p>৳${item.price.toLocaleString()} × ${item.quantity}</p>
          <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        </div>
      </div>`;
  }).join("");

  document.getElementById("cartTotal").textContent = "৳" + total.toLocaleString();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.remove("open");
}

function checkoutCart() {
  if (!cart.length) {
    showToast("Your cart is empty!");
    return;
  }
  openCheckout(cart);
}

/* =========================
   SHOP NOW / BUY NOW
========================= */
function buyNow(name, price, image) {
  const oneProduct = [{ name, price, image, quantity: 1 }];
  openCheckout(oneProduct);
}

/* =========================
   CHECKOUT
========================= */
let checkoutProducts = [];

function openCheckout(items) {
  checkoutProducts = items.map(item => ({ ...item }));
  renderCheckout();
  document.getElementById("checkoutModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("open");
  document.body.style.overflow = "";
}

function renderCheckout() {
  const container = document.getElementById("checkoutItems");
  let total = 0;

  container.innerHTML = checkoutProducts.map(item => {
    total += item.price * item.quantity;
    return `<p>${escapeHtml(item.name)} × ${item.quantity} — ৳${(item.price * item.quantity).toLocaleString()}</p>`;
  }).join("");

  document.getElementById("checkoutTotal").textContent = "৳" + total.toLocaleString();
}

function getCheckoutTotal() {
  return checkoutProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

async function submitOrder(event) {
  event.preventDefault();

  if (!checkoutProducts.length) {
    showToast("No product selected.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const payment = document.getElementById("paymentMethod").value;
  const total = getCheckoutTotal();

  if (!name || !phone || !address) {
    showToast("Please fill in all required fields.");
    return;
  }

  const itemsText = checkoutProducts
    .map(item => `${item.name} × ${item.quantity} = ৳${(item.price * item.quantity).toLocaleString()}`)
    .join("\n");

  const message =
`🛍️ NEW MARVE ORDER

Customer Name: ${name}
Mobile: ${phone}
Address: ${address}
Payment: ${payment}

ORDER:
${itemsText}

TOTAL: ৳${total.toLocaleString()}`;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const button = document.getElementById("placeOrderBtn");
  button.disabled = true;
  button.textContent = "SENDING...";

  // Open WhatsApp immediately so mobile browsers do not block it.
  window.open(whatsappUrl, "_blank", "noopener");

  // Send email through EmailJS if configured.
  const emailConfigured =
    window.emailjs &&
    !EMAILJS_PUBLIC_KEY.startsWith("YOUR_") &&
    !EMAILJS_SERVICE_ID.startsWith("YOUR_") &&
    !EMAILJS_TEMPLATE_ID.startsWith("YOUR_");

  if (emailConfigured) {
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        payment_method: payment,
        order_items: itemsText,
        order_total: `৳${total.toLocaleString()}`
      });
      showToast("Order sent to WhatsApp & email ✓");
    } catch (error) {
      console.error("EmailJS error:", error);
      showToast("WhatsApp opened. Email sending failed.");
    }
  } else {
    showToast("WhatsApp opened. Configure EmailJS for email.");
  }

  // If this checkout came from the cart, clear the cart after ordering.
  if (checkoutProducts === cart || (cart.length && checkoutProducts.length === cart.length &&
      checkoutProducts.every((item, i) => item.name === cart[i].name && item.quantity === cart[i].quantity))) {
    cart = [];
    saveCart();
  }

  button.disabled = false;
  button.textContent = "📱 SEND ORDER ON WHATSAPP + EMAIL";
}

document.getElementById("checkoutModal").addEventListener("click", function(e) {
  if (e.target === this) closeCheckout();
});

/* =========================
   SEARCH + CATEGORY
========================= */
function searchProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  document.querySelectorAll(".product").forEach(product => {
    const name = product.dataset.name.toLowerCase();
    product.style.display = name.includes(search) ? "" : "none";
  });
}

function filterCategory(category) {
  scrollToProducts();
  document.querySelectorAll(".product").forEach(product => {
    product.style.display = product.dataset.category === category ? "" : "none";
  });
  document.getElementById("productSubtitle").textContent = category + " products";
}

function showAllProducts() {
  document.querySelectorAll(".product").forEach(product => product.style.display = "");
  document.getElementById("productSubtitle").textContent = "Our most loved products";
}

function scrollToProducts() {
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

/* =========================
   HELPERS
========================= */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

updateCart();
