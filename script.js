/* =========================================================
   MARVE FASHION STORE - SCRIPT.JS
   Responsive + Safe Version
   ========================================================= */


/* =========================
   STORE SETTINGS
========================= */

// WhatsApp number
// Bangladesh country code included
// No + or spaces
const WHATSAPP_NUMBER = "8801314576664";


// EmailJS settings
const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";


/* =========================
   GLOBAL VARIABLES
========================= */

let currentSlide = 0;

let cart = JSON.parse(
  localStorage.getItem("marveCart") || "[]"
);

let checkoutProducts = [];

let toastTimer;


/* =========================
   DOM READY
========================= */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     EMAILJS
  ------------------------- */

  if (
    window.emailjs &&
    !EMAILJS_PUBLIC_KEY.startsWith("YOUR_")
  ) {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }


  /* -------------------------
     HERO
  ------------------------- */

  initHeroSlider();


  /* -------------------------
     CART
  ------------------------- */

  updateCart();


  /* -------------------------
     CHECKOUT MODAL
  ------------------------- */

  const checkoutModal =
    document.getElementById("checkoutModal");

  if (checkoutModal) {

    checkoutModal.addEventListener(
      "click",
      function (event) {

        if (event.target === this) {
          closeCheckout();
        }

      }
    );

  }


  /* -------------------------
     SEARCH
  ------------------------- */

  const searchInput =
    document.getElementById("searchInput");

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      searchProducts
    );

  }

});


/* =========================================================
   MOBILE MENU
========================================================= */

function toggleMenu() {

  const nav = document.getElementById("nav");

  if (!nav) return;

  nav.classList.toggle("open");
}


/* Close mobile menu */
function closeMenu() {

  const nav = document.getElementById("nav");

  if (!nav) return;

  nav.classList.remove("open");
}


/* =========================================================
   HERO SLIDER
========================================================= */

function initHeroSlider() {

  const slides =
    document.querySelectorAll(".hero-slide");

  const dots =
    document.querySelectorAll(".dot");

  if (!slides.length) return;


  showSlide(0);


  /* Auto slide */

  setInterval(() => {

    showSlide(currentSlide + 1);

  }, 5000);

}


function showSlide(index) {

  const slides =
    document.querySelectorAll(".hero-slide");

  const dots =
    document.querySelectorAll(".dot");

  if (!slides.length) return;


  /* Remove active */

  slides.forEach(slide => {
    slide.classList.remove("active");
  });

  dots.forEach(dot => {
    dot.classList.remove("active");
  });


  /* Calculate slide */

  currentSlide =
    (index + slides.length) % slides.length;


  /* Activate */

  slides[currentSlide]
    .classList.add("active");


  if (dots[currentSlide]) {

    dots[currentSlide]
      .classList.add("active");

  }

}


function changeSlide(direction) {

  showSlide(
    currentSlide + direction
  );

}


/* =========================================================
   CART
========================================================= */

function saveCart() {

  localStorage.setItem(
    "marveCart",
    JSON.stringify(cart)
  );

  updateCart();

}


/* Add product */

function addToCart(
  name,
  price,
  image
) {

  price = Number(price);


  const existing =
    cart.find(
      item => item.name === name
    );


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });

  }


  saveCart();

  showToast("Added to cart ✓");

  openCart();

}


/* Update cart */

function updateCart() {

  const cartCount =
    document.getElementById("cartCount");

  const container =
    document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");


  if (!cartCount || !container || !totalElement) {
    return;
  }


  /* Cart count */

  const count =
    cart.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );


  cartCount.textContent = count;


  /* Empty cart */

  if (!cart.length) {

    container.innerHTML =
      `<p style="padding:20px 0;color:#777;">
        Your cart is empty.
      </p>`;

    totalElement.textContent = "৳0";

    return;

  }


  /* Calculate total */

  let total = 0;


  container.innerHTML =
    cart.map((item, index) => {

      const price =
        Number(item.price || 0);

      const quantity =
        Number(item.quantity || 1);


      total +=
        price * quantity;


      return `
        <div class="cart-item">

          <img
            src="${escapeHtml(item.image || "")}"
            alt="${escapeHtml(item.name)}"
          >

          <div>

            <h4>
              ${escapeHtml(item.name)}
            </h4>

            <
