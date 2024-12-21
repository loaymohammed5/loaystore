let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الـ Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;  // تحديث عدد العناصر في السلة
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    const clearCartContainer = document.getElementById('clear-cart-container');
    cartTableBody.innerHTML = '';  // مسح العناصر السابقة
    let totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';  // إظهار رسالة السلة فارغة
        totalPriceElement.style.display = 'none';  // إخفاء الإجمالي
        document.getElementById('whatsapp-checkout').style.display = 'none';  // إخفاء زر الواتساب
        clearCartContainer.style.display = 'none';  // إخفاء زر تفريغ السلة
    } else {
        emptyMessage.style.display = 'none';  // إخفاء رسالة السلة فارغة
        totalPriceElement.style.display = 'block';  // إظهار الإجمالي
        document.getElementById('whatsapp-checkout').style.display = 'block';  // إظهار زر الواتساب
        clearCartContainer.style.display = 'block';  // إظهار زر تفريغ السلة

        // تجميع المنتجات المتكررة في السلة
        const productCounts = cartItems.reduce((acc, item) => {
            if (acc[item.name]) {
                acc[item.name].count++;
            } else {
                acc[item.name] = { ...item, count: 1 };
            }
            return acc;
        }, {});

        // عرض المنتجات في السلة
        Object.values(productCounts).forEach(item => {
            const row = document.createElement('tr');
            const totalItemPrice = item.price * item.count;  // حساب إجمالي سعر هذا المنتج بناءً على العدد
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
                <td>${item.count}</td>
                <td>${totalItemPrice} ج</td>
                <td><button onclick="removeItem('${item.name}')">إزالة</button></td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += totalItemPrice;  // جمع السعر الإجمالي لكل المنتجات
        });

        // عرض الإجمالي
        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        // إنشاء رابط واتساب مع البيانات المتجمعة
        createWhatsAppLink(productCounts, totalPrice);
    }
}

// إزالة منتج من السلة
function removeItem(productName) {
    // إزالة كل العناصر التي تحتوي على نفس الاسم من السلة
    cartItems = cartItems.filter(item => item.name !== productName);
    
    // حفظ التغييرات في localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // تحديث السلة وعداد السلة
    displayCart();
    updateCartCount();
}

// تفريغ السلة بالكامل
function clearCart() {
    // مسح السلة من localStorage
    localStorage.removeItem('cartItems');
    
    // تحديث المصفوفة لتكون فارغة
    cartItems = [];
    
    // تحديث السلة وعداد السلة
    displayCart();
    updateCartCount();
}

// إنشاء رابط الشراء عبر واتساب مع تنسيق الرسالة بشكل جذاب
function createWhatsAppLink(productCounts, totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-btn');

    // تنسيق الرسالة عبر WhatsApp بشكل جذاب
    let tableHeader = "*المنتج* | *السعر* | *العدد* | *الإجمالي*\n";
    let tableBody = Object.values(productCounts)
        .map(item => `_${item.name}_ | ${item.price} ج | ${item.count} | ${item.price * item.count} ج`)
        .join("\n");

    // إنشاء النص الكامل للرسالة
    const message = `🌟 *مرحباً، عزيزي العميل!*\n\n` +
                    `💬 *لقد قمت بإضافة بعض المنتجات الرائعة إلى سلتك!*\n\n` +
                    `${tableHeader}${tableBody}\n\n` +
                    `----------------------------------------\n` +
                    `💸 *الإجمالي: ${totalPrice}جنيه*💸\n\n` +
                    `🌟 *شكرًا لك على اختيارنا! نحن هنا لخدمتك دائمًا.* 🌟\n` +
                    `🚚 *سوف نرسل طلبك إليك بأسرع وقت ممكن!* 🚚\n\n` +
                    `📲 *لأي استفسارات، لا تتردد في التواصل معنا.* 📲`;

    // ترميز النص للـ URL
    const whatsappUrl = `https://wa.me/249119479189?text=${encodeURIComponent(message)}`;

    // عند الضغط على الزر يتم فتح رابط واتساب
    whatsappButton.onclick = function() {
        window.open(whatsappUrl, '_blank');
    };
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    displayCart();  // عرض محتويات السلة
    updateCartCount();  // تحديث عداد السلة

    // إضافة حدث تفريغ السلة عند الضغط على الزر
    document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
});