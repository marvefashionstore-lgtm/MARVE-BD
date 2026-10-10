/* MARVE — script.js
   Update WHATSAPP_NUMBER below if you want orders sent to another number.
*/
(() => {
  "use strict";

  const WHATSAPP_NUMBER = "8801314576664"; // Bangladesh format: country code + number, no +
  const money = amount => "৳" + Number(amount).toLocaleString("en-BD");
  const products = [
    {id:1,name:"Velvet Glow Lip Tint",category:"Cosmetics",price:450,oldPrice:550,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=700&q=80",description:"A soft, everyday tint"},
    {id:2,name:"Petal Blush Palette",category:"Cosmetics",price:690,oldPrice:null,badge:"NEW",image:"https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=700&q=80",description:"A fresh touch of colour"},
    {id:3,name:"Golden Bloom Necklace",category:"Jewellery",price:850,oldPrice:990,badge:"POPULAR",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=700&q=80",description:"A delicate finishing touch"},
    {id:4,name:"Everyday Hoop Earrings",category:"Jewellery",price:390,oldPrice:null,badge:"",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",description:"Minimal, made to shine"},
    {id:5,name:"Classic Muse Watch",category:"Watches",price:1450,oldPrice:1650,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80",description:"Timeless style, every day"},
    {id:6,name:"Olive Hour Watch",category:"Watches",price:1690,oldPrice:null,badge:"NEW",image:"https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=80",description:"A modern classic"},
    {id:7,name:"Everyday Tote Bag",category:"Lifestyle",price:790,oldPrice:null,badge:"",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=700&q=80",description:"Room for all your essentials"},
    {id:8,name:"Soft Touch Scarf",category:"Lifestyle",price:590,oldPrice:690,badge:"LIMITED",image:"https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=700&q=80",description:"An easy layer of elegance"}
  ];

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const productGrid = $("#productGrid");
  const emptyState = $("#emptyState");
  const resultCount = $("#resultCount");
  const cartDrawer = $("#cartDrawer");
  const overlay = $("#overlay");
  const cartItems = $("#cartItems");
  const cartEmpty = $("#cartEmpty");
  const cartFooter = $("#cartFooter");
  let activeCategory = "All";
  let searchTerm = "";
  let cart = JSON.parse(localStorage.getItem("marve-cart") || "[]");
  let toastTimer;

  function renderProducts() {
    const shown = products.filter(p =>
      (activeCategory === "All" || p.category === activeCategory) &&
      (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm) || p.description.toLowerCase().includes(searchTerm))
    );
    productGrid.innerHTML = shown.map(p => `
      <article class="product-card">
        <div class="product-image-wrap">
          <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.opacity='.15';this.alt='Product image unavailable'">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
          <button class="quick-add" data-add="${p.id}">＋ Add to bag</button>
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <h3 class="product-name">${p.name}</h3>
          <div class="product-bottom"><div class="product-price">${money(p.price)} ${p.oldPrice ? `<span class="product-old-price">${money(p.oldPrice)}</span>` : ""}</div><button class="heart-btn" data-like="${p.id}" aria-label="Add ${p.name} to favourites">♡</button></div>
        </div>
      </article>`).join("");
    emptyState.hidden = shown.length > 0;
    productGrid.hidden = shown.length === 0;
    resultCount.textContent = `${shown.length} product${shown.length === 1 ? "" : "s"}`;
  }

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function saveCart() {
    localStorage.setItem("marve-cart", JSON.stringify(cart));
    renderCart();
  }

  function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) existing.qty += 1;
    else cart.push({id, qty:1});
    saveCart();
    showToast("Added to your bag ✦");
  }

  function cartCount() { return cart.reduce((sum, item) => sum + item.qty, 0); }
  function cartTotal() { return cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.qty, 0); }

  function renderCart() {
    const count = cartCount();
    $("#cartCount").textContent = count;
    $("#cartHeadingCount").textContent = `(${count})`;
    $("#cartSubtotal").textContent = money(cartTotal());
    cartEmpty.style.display = count ? "none" : "block";
    cartFooter.style.display = count ? "block" : "none";
    cartItems.innerHTML = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      if (!p) return "";
      return `<div class="cart-line">
        <img src="${p.image}" alt="${p.name}">
        <div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="qty-control"><button data-qty="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div>
        <div class="cart-line-price">${money(p.price * item.qty)}<button class="remove-item" data-remove="${p.id}">Remove</button></div>
      </div>`;
    }).join("");
  }

  function openCart() {
    cartDrawer.classList.add("open"); overlay.classList.add("open");
    cartDrawer.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartDrawer.classList.remove("open"); overlay.classList.remove("open");
    cartDrawer.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  function checkout() {
    if (!cart.length) return showToast("Your bag is empty.");
    const lines = cart.map(item => {
      const p = products.find(product => product.id === item.id);
      return `${p.name} x ${item.qty} = ${money(p.price * item.qty)}`;
    });
    const message = `Hello MARVE! I would like to place an order:\n\n${lines.join("\n")}\n\nSubtotal: ${money(cartTotal())}\n\nPlease confirm availability, delivery charge and payment details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  productGrid.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) addToCart(Number(addButton.dataset.add));
    const likeButton = event.target.closest("[data-like]");
    if (likeButton) {
      likeButton.classList.toggle("liked");
      likeButton.textContent = likeButton.classList.contains("liked") ? "♥" : "♡";
      showToast(likeButton.classList.contains("liked") ? "Added to favourites" : "Removed from favourites");
    }
  });

  cartItems.addEventListener("click", event => {
    const qtyButton = event.target.closest("[data-qty]");
    const removeButton = event.target.closest("[data-remove]");
    if (qtyButton) {
      const id = Number(qtyButton.dataset.qty);
      const item = cart.find(row => row.id === id);
      if (item) {
        item.qty += Number(qtyButton.dataset.change);
        if (item.qty <= 0) cart = cart.filter(row => row.id !== id);
        saveCart();
      }
    }
    if (removeButton) {
      cart = cart.filter(row => row.id !== Number(removeButton.dataset.remove));
      saveCart();
    }
  });

  $("#filterPills").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    $$(".filter-pill").forEach(pill => pill.classList.toggle("active", pill === button));
    renderProducts();
  });

  $$(".category-card").forEach(button => button.addEventListener("click", () => {
    activeCategory = button.dataset.category;
    $$(".filter-pill").forEach(pill => pill.classList.toggle("active", pill.dataset.category === activeCategory));
    renderProducts();
    $("#shop").scrollIntoView({behavior:"smooth"});
  }));

  $("#searchInput").addEventListener("input", event => {
    searchTerm = event.target.value.trim().toLowerCase();
    renderProducts();
    if (searchTerm) $("#shop").scrollIntoView({behavior:"smooth", block:"start"});
  });
  $("#clearFilters").addEventListener("click", () => {
    activeCategory = "All"; searchTerm = ""; $("#searchInput").value = "";
    $$(".filter-pill").forEach(pill => pill.classList.toggle("active", pill.dataset.category === "All"));
    renderProducts();
  });
  $("#viewAll").addEventListener("click", () => {
    activeCategory = "All"; searchTerm = ""; $("#searchInput").value = "";
    $$(".filter-pill").forEach(pill => pill.classList.toggle("active", pill.dataset.category === "All"));
    renderProducts();
  });
  $("#cartOpen").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#continueShopping").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  $("#checkoutBtn").addEventListener("click", checkout);
  $("#footerWhatsApp").href = `https://wa.me/${WHATSAPP_NUMBER}`;
  $("#footerWhatsApp").target = "_blank";
  $("#year").textContent = new Date().getFullYear();

  $("#menuToggle").addEventListener("click", () => {
    const nav = $("#mobileNav");
    nav.classList.toggle("open");
    $("#menuToggle").textContent = nav.classList.contains("open") ? "×" : "☰";
  });
  $$("#mobileNav a").forEach(link => link.addEventListener("click", () => {
    $("#mobileNav").classList.remove("open");
    $("#menuToggle").textContent = "☰";
  }));
  $("#newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const email = $("#newsletterEmail").value.trim();
    if (email) {
      $("#newsletterMessage").textContent = "Thank you! Newsletter sign-up demo completed.";
      $("#newsletterEmail").value = "";
      showToast("Thanks for joining MARVE ✦");
    }
  });

  document.addEventListener("keydown", event => { if (event.key === "Escape") closeCart(); });
  renderProducts();
  renderCart();
})();
