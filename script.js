(() => {
"use strict";
const WHATSAPP_NUMBER = "8801314576664"; // Change this to your store's WhatsApp number.
const products = [
 {id:1,name:"Indian Traditional Jewellery Set",category:"Indian Traditional Jewellery Set",price:1890,oldPrice:2290,badge:"TRADITIONAL",image:"assets/indian-traditional-jewellery-set.png",description:"Traditional necklace and matching earrings"},
 {id:2,name:"Kashmiri Churi Set",category:"Churi",price:950,oldPrice:1150,badge:"POPULAR",image:"assets/kashmiri-churi.png",description:"Colourful traditional Kashmiri bangles"},
 {id:3,name:"Classic Comfort Bra",category:"Bra",price:650,oldPrice:null,badge:"",image:"assets/bra.png",description:"Everyday comfort bra"},
 {id:4,name:"Soft Cotton Panty",category:"Panty",price:250,oldPrice:null,badge:"",image:"assets/panty.png",description:"Soft everyday underwear"},
 {id:5,name:"Classic Muse Watch",category:"Watch",price:1450,oldPrice:1650,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=700&q=80",description:"Timeless style for every day"},
 {id:6,name:"Elegant Floral Earrings",category:"Earrings",price:590,oldPrice:750,badge:"NEW",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=700&q=80",description:"A delicate finishing touch"}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => "৳" + Number(n).toLocaleString("en-BD");
let category = "All", query = "", cart = [];
try { cart = JSON.parse(localStorage.getItem("marve-cart") || "[]"); } catch (_) { cart = []; }
let toastTimer;
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200);}
function renderProducts(){
 const list=products.filter(p=>(category==="All"||p.category===category)&&[p.name,p.category,p.description].some(s=>s.toLowerCase().includes(query)));
 $("#productGrid").innerHTML=list.map(p=>`<article class="product-card"><div class="product-img-wrap"><img class="product-img" src="${p.image}" alt="${p.name}" loading="lazy"><span class="badge" ${p.badge?"":"hidden"}>${p.badge}</span><button class="add-btn" data-add="${p.id}">＋ Add to bag</button></div><div class="product-info"><span class="product-category">${p.category}</span><h3 class="product-name">${p.name}</h3><div class="product-bottom"><div class="price">${money(p.price)} ${p.oldPrice?`<span class="old-price">${money(p.oldPrice)}</span>`:""}</div></div></div></article>`).join("");
 $("#empty").hidden=list.length>0; $("#productGrid").hidden=list.length===0;
}
function saveCart(){localStorage.setItem("marve-cart",JSON.stringify(cart));renderCart();}
function count(){return cart.reduce((s,i)=>s+i.qty,0);}
function total(){return cart.reduce((s,i)=>s+(products.find(p=>p.id===i.id)?.price||0)*i.qty,0);}
function renderCart(){
 $("#cartCount").textContent=count();$("#bagCount").textContent=count();$("#subtotal").textContent=money(total());
 $("#cartEmpty").hidden=count()>0;$("#cartFooter").hidden=count()===0;
 $("#cartItems").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);if(!p)return "";return `<div class="cart-line"><img src="${p.image}" alt="${p.name}"><div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><div class="line-price">${money(p.price*i.qty)}<button class="remove" data-remove="${p.id}">Remove</button></div></div>`;}).join("");
}
function openCart(){ $("#cartDrawer").classList.add("open");$("#overlay").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeCart(){ $("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow="";}
function checkout(){
 if(!cart.length){toast("Your bag is empty.");return;}
 const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${p.name} x ${i.qty} = ${money(p.price*i.qty)}`;});
 const msg=`Hello MARVE! I would like to place an order:\\n\\n${lines.join("\\n")}\\n\\nSubtotal: ${money(total())}\\n\\nPlease confirm availability, delivery charge and payment details.`;
 window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
}
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add),item=cart.find(i=>i.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();toast("Added to your bag ✦");});
$("#cartItems").addEventListener("click",e=>{const q=e.target.closest("[data-qty]"),r=e.target.closest("[data-remove]");if(q){const id=Number(q.dataset.qty),item=cart.find(i=>i.id===id);if(item){item.qty+=Number(q.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==id);saveCart();}}if(r){cart=cart.filter(i=>i.id!==Number(r.dataset.remove));saveCart();}});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;category=b.dataset.category;$$(".filters button").forEach(x=>x.classList.toggle("active",x===b));renderProducts();});
$$(".category").forEach(b=>b.addEventListener("click",()=>{category=b.dataset.category;$$(".filters button").forEach(x=>x.classList.toggle("active",x.dataset.category===category));renderProducts();$("#shop").scrollIntoView({behavior:"smooth"});}));
$("#searchInput").addEventListener("input",e=>{query=e.target.value.trim().toLowerCase();renderProducts();});
$("#cartOpen").addEventListener("click",openCart);$("#cartClose").addEventListener("click",closeCart);$("#overlay").addEventListener("click",closeCart);$("#checkout").addEventListener("click",checkout);
$("#contactWhatsApp").href=`https://wa.me/${WHATSAPP_NUMBER}`;$("#year").textContent=new Date().getFullYear();
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
renderProducts();renderCart();
})();