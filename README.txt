MARVE Fashion Store
====================

Files:
- index.html
- style.css
- script.js

What is included:
1. Add to Cart with localStorage.
2. Shop Now / Buy Now button on every product.
3. Checkout popup with:
   - Full Name
   - Mobile Number
   - Delivery Address
   - Payment Method
4. WhatsApp order message.
5. Email sending through EmailJS (after configuration).
6. Mobile responsive layout.

IMPORTANT: WhatsApp
-------------------
In script.js:
const WHATSAPP_NUMBER = "8801314576664";

Change this to your own WhatsApp number.
Use country code and do not use + or spaces.

IMPORTANT: EMAIL
----------------
A browser-only website cannot safely send email directly through your Gmail password.
This project uses EmailJS.

Steps:
1. Go to https://www.emailjs.com/
2. Create an account.
3. Add an Email Service (Gmail is supported).
4. Create an Email Template.
5. Put the template variables in the template, for example:
   {{customer_name}}
   {{customer_phone}}
   {{customer_address}}
   {{payment_method}}
   {{order_items}}
   {{order_total}}
6. Copy your:
   - Public Key
   - Service ID
   - Template ID
7. Replace these values in script.js:
   YOUR_EMAILJS_PUBLIC_KEY
   YOUR_EMAILJS_SERVICE_ID
   YOUR_EMAILJS_TEMPLATE_ID

Then upload all 3 files to GitHub Pages.

NOTE:
WhatsApp opens directly with the filled order message.
Email is sent through EmailJS after you configure the IDs.
Do not put a Gmail password in JavaScript.
