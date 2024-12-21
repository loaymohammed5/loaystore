if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) => console.error("Service Worker Registration Failed:", error));
  }

// جلب العناصر المضافة للسلة من localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الـ Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;  // تحديث عدد العناصر في السلة
}

// إضافة المنتجات إلى السلة
function addToCart(productName, productPrice) {
    // إضافة المنتج إلى السلة
    cartItems.push({ name: productName, price: productPrice });
    
    // حفظ السلة في localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // تحديث عداد السلة
    updateCartCount();
}

// عرض المنتجات في الصفحة الرئيسية مع دعم البحث
function displayProducts(products, searchQuery = '') {
    const productContainer = document.querySelector('.product-list');
    productContainer.innerHTML = '';  // مسح المنتجات السابقة

    // تصفية المنتجات بناءً على نص البحث
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>السعر: ${product.price} جنيه</p>
            <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}">أضف إلى السلة</button>
        `;
        productContainer.appendChild(productDiv);
    });

    // إضافة الحدث لكل زر "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            // إضافة المنتج إلى السلة
            addToCart(productName, productPrice);
        });
    });
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    cartTableBody.innerHTML = '';  // مسح العناصر السابقة
    let totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
        document.getElementById('whatsapp-checkout').style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';
        document.getElementById('whatsapp-checkout').style.display = 'block';

        // عرض المنتجات في السلة
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.price;
        });

        // عرض الإجمالي
        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        // إنشاء رابط واتساب
        createWhatsAppLink(totalPrice);
    }
}

// إنشاء رابط الشراء عبر واتساب
function createWhatsAppLink(totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-btn');
    const productsText = cartItems.map(item => `${item.name} - ${item.price} ريال`).join('%0A');
    const message = `مرحباً، أرغب في شراء المنتجات التالية:%0A${productsText}%0Aالإجمالي: ${totalPrice} جنيه.`;
    const whatsappUrl = `https://wa.me/249119479189?text=${encodeURIComponent(message)}`;

    // عند الضغط على الزر يتم فتح رابط واتساب
    whatsappButton.onclick = function() {
        window.open(whatsappUrl, '_blank');
    };
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    // قائمة المنتجات
    const productList = [
        { name: "لحمة عجالي", price: 12000, img: "img/ai-generated-8864309_1280 (1).png", description: "كيلو لحمة عجالي" },
        { name: ".لحمة عجالي", price: 6000, img: "img/ai-generated-8864309_1280 (1).png", description: "نص لحمة عجالي" },
        { name: "..لحمة عجالي", price: 3000, img: "img/ai-generated-8864309_1280 (1).png", description: "ربع لحمه عجالي" },
        { name: "لحمة ضان", price: 24000, img: "img/meat-3359248_1920 (1).jpg", description: "كيلو لحمة ضان" },
        { name: ".لحمة ضان", price: 12000, img: "img/meat-3359248_1920 (1).jpg", description: "نص لحمة ضان" },
        { name: "..لحمة ضان", price: 6000, img: "img/meat-3359248_1920 (1).jpg", description: "ربع لحمة ضان" },
        { name: "لحمة اعجالي مفرومه", price: 14000, img: "img/2018_5_28_21_59_16_26 (1).jpg", description: "كيلو مفرومه" },
        { name: "لحمة عجالي مفرومه.", price: 7000, img: "img/2018_5_28_21_59_16_26 (1).jpg", description: "نص كيلو مفرومه" },
        { name: "لحمة عجالي مفرومه..", price: 3500, img: "img/2018_5_28_21_59_16_26 (1).jpg", description: "ربع كيلو مفرومه" },
        { name: "بطاطس", price: 5000, img: "img/potato-3440360_1920 (1).jpg", description: "كيلو بطاطس" },
        { name: ".بطاطس", price: 2500, img: "img/potato-3440360_1920 (1).jpg", description: "نص كيلو بطاطس" },
        { name: "بامبي", price: 3500, img: "img/1730965247587.jpg", description: "كيلو بامبي" },
        { name: ".بامبي", price: 1800, img: "img/1730965247587.jpg", description: "نص كيلو بامبي" },
        { name: "باميه", price: 7500, img: "img/image_fx_ 1(4).jpg", description: "كيلو باميه" },
        { name: ".باميه", price: 3800, img: "img/image_fx_ 1(4).jpg", description: "نص كيلو باميه" },
        { name: ".باميه", price: 1900, img: "img/image_fx_ 1(4).jpg", description: "ربع كيلو باميه" },
        { name: "باميه فرك", price: 7500, img: "img/image_fx_ 1(4).jpg", description: "كيلو باميه" },
        { name: ".باميه فرك", price: 3800, img: "img/image_fx_ 1(4).jpg", description: "نص كيلو باميه" },
        { name: ".باميه فرك", price: 1900, img: "img/image_fx_ 1(4).jpg", description: "ربع كيلو باميه" },
        { name: "اسود(بازنجان)", price: 4000, img: "img/image_fx_.jpg", description: "كيلو اسود" },
        { name: "اسود", price: 2000, img: "img/image_fx_.jpg", description: "نص كيلو اسود" },
        { name: "قرع", price: 3500, img: "img/image_fx_ (1) (1).jpg", description: "كيلوه قرع" },
        { name: ".قرع", price: 1750, img: "img/image_fx_ (1) (1).jpg", description: "نص كيلو قرع" },
        { name: "كوزه", price: 3500, img: "img/image_fx_ (2) (1).jpg", description: "كيلو كوسه" },
        { name: ".كوزه", price: 1800, img: "img/image_fx_ (2) (1).jpg", description: "نص كيلو كوسه" },
        { name: "رجله خضره", price: 2000, img: "img/ei_1731608358596-removebg-preview.png", description: " رجله خضره يمكنك الاختيار عدة مرات" },
        { name: "طماطم", price: 7000, img: "img/a-tomato-877019_1920 (1).jpg", description: "كيلو طماطم" },
        { name: ".طماطم", price: 3500, img: "img/a-tomato-877019_1920 (1).jpg", description: "نص كيلو طماطم" },
        { name: "..طماطم", price: 1800, img: "img/a-tomato-877019_1920 (1).jpg", description: "ريع كيلو طماطم" },
        { name: "سلطه", price: 5000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: ".سلطه", price: 3000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: "شطه", price: 2000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".شطه", price: 1000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: "..شطه", price: 500, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".ليمون", price: 1000, img: "img/ei_1731755591215-removebg-preview.png", description: "5حبات ليمون ب" },
        { name: "..ليمون", price: 2000, img: "img/ei_1731755591215-removebg-preview.png", description: "10حبات ليمون ب" },
        { name: "بصل أخضر", price: 1000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: ".بصل أخضر", price: 2000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: "..بصل أخضر", price: 3000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: "فلفليه", price: 1000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: ".فلفليه", price: 2000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "..فلفليه", price: 3000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "جرجير", price: 1000, img: "img/watercress-4257303_1920 (1).jpg", description: "جرجير طازج" },
        { name: "جزر", price: 2000, img: "img/carrots-673184_1920 (1).jpg", description: "جزر" },
        { name: "خيار", price: 5000, img: "img/cucumber-7259270_1920 (1).jpg", description: "كيلو خيار" },
        { name: ".خيار", price: 2500, img: "img/cucumber-7259270_1920 (1).jpg", description: "نص كيلو خيار" },
        { name: "..خيار", price: 1300, img: "img/cucumber-7259270_1920 (1).jpg", description: "ربع كيلو خيار" },
        { name: "عجور", price: 1000, img: "img/image_fx_ (4).jpg", description: "عجوره واحدة ب" },
        { name: "تفاح", price: 1200, img: "img/ei_1734696807142-removebg-preview.png", description: "دسته 12 حبه" },
        { name: "تفاح.", price: 6000, img: "img/ei_1734696807142-removebg-preview.png", description: "نص دسته" },
        { name: "تفاح..", price: 3000, img: "img/ei_1734696807142-removebg-preview.png", description: "ربع دسته" },
        { name: ".جوافه", price: 5000, img: "img/ei_1734696960682-removebg-preview.png", description: "كيلو جوافه" },
        { name: "جوافه", price: 2500, img: "img/ei_1734696960682-removebg-preview.png", description: "نص كيلو جوافه" },
        { name: "جوافه.", price: 1300, img: "img/ei_1734696960682-removebg-preview.png", description: "ربع كيلو جوافه" },
        { name: "رمان", price: 2000, img: "img/ei_1734697037509-removebg-preview (1).png", description: "حبة رمان واحدة" },
        { name: "رمان.", price: 10000, img: "img/ei_1734697037509-removebg-preview (1).png", description: "5حبات رمان" },
        { name: "عنب", price: 10000, img: "img/ei_1734696883430-removebg-preview.png", description: "نص كيلو" },
        { name: ".عنب", price: 5000, img: "img/ei_1734696883430-removebg-preview.png", description: "ربع كيلو" },
        { name: "..عنب", price: 2500, img: "img/ei_1734696883430-removebg-preview.png", description: "علبة عنب صغيره" },
        { name: "برتقال", price: 4500, img: "img/ei_1734696846138-removebg-preview.png", description: "دستة برتقال" },
        { name: "برتقال.", price: 2300, img: "img/ei_1734696846138-removebg-preview.png", description: "نص دسته برتقال" },
        { name: "برتقال..", price: 1200, img: "img/ei_1734696846138-removebg-preview.png", description: "ربع دسته برتقال" },
        { name: "جريب", price: 6000, img: "img/ei_1734696921137-removebg-preview.png", description: "دستة جريب" },
        { name: "جريب.", price: 3000, img: "img/ei_1734696921137-removebg-preview.png", description: "نص دسته" },
        { name: "جريب..", price: 1500, img: "img/ei_1734696921137-removebg-preview.png", description: "ربع دسته" },
        { name: "موز", price: 2500, img: "img/ei_1734696989741-removebg-preview.png", description: "كيلو موز" },
        { name: "موز.", price: 1300, img: "img/ei_1734696989741-removebg-preview.png", description: "نص كيلو موز" },
        { name: "تمر", price: 3000, img: "img/ei_1731587410119-removebg-preview.png", description: "ملوة تمر" },
        { name: ".تمر", price: 1500, img: "img/ei_1731587410119-removebg-preview.png", description: "نص ملوة تمر" },
        { name: " عيش خبز", price: 500, img: "img/ei_1731751898951-removebg-preview.png", description: "4عشات ب يمكنك الاختيار عدة مرات" },
        { name: "عيش", price: 1000, img: "img/ei_1731751898951-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: ".عيش", price: 3000, img: "img/ei_1731751898951-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "..عيش", price: 5000, img: "img/ei_1731751898951-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },      
        { name: "عيش الي", price: 1000, img: "img/1731701567197.jpg", description: "يمكنك الاختيلر عدة مرات" },
        { name: ".عيش الي", price: 3000, img: "img/1731701567197.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "..عيش الي", price: 5000, img: "img/1731701567197.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "دقيق سيقا", price: 2200, img: "img/ei_1731608054582-removebg-preview.png", description: " (كيلو دقيق (انتاج شركة سيقا" },
        { name: "دقيق قمح", price: 4500, img: "img/دقيق (1).jpg", description: "ملوة دقيق قمح" },
        { name: ".دقيق قمح", price: 2300, img: "img/دقيق (1).jpg", description: "نص ملوة دقيق قمح" },
        { name: "دقيق ابيض", price: 4000, img: "img/كيف_يصنع_الطحين (1).jpg", description: "ملوة دقيق ابيض" },
        { name: ".دقيق ابيض", price: 2000, img: "img/كيف_يصنع_الطحين (1).jpg", description: "نص ملوه" },
        { name: "دقيق دخن", price: 5000, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "ملوة دقيق دخن" },
        { name: ".دقيق دخن", price: 2500, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "نص ملوه دقيق دخن" },
        { name: "سكر", price: 2500, img: "img/ei_1731587279355-removebg-preview.png", description: "كيلو سكر" },
        { name: ".سكر", price: 1300, img: "img/ei_1731587279355-removebg-preview.png", description: "نص كيلو سكر" },
        { name: "شوال سكر", price: 12000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 5كيلو" },
        { name: ".شوال سكر", price: 24000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 10كيلو" },
        { name: "كبكبي", price: 7000, img: "img/ei_1731600582219-removebg-preview.png", description: "ملوة كبكبي" },
        { name: ".كبكبي", price: 3500, img: "img/ei_1731600582219-removebg-preview.png", description: "نص ملوه كبكبي" },
        { name: "..كبكبي", price: 1800, img: "img/ei_1731600582219-removebg-preview.png", description: "ربع ملوة كبكبي" },
        { name: "عدسيه (بليله)", price: 8500, img: "img/pigean1 (1).jpg", description: "ملوة عدسيه" },
        { name: "عدسيه", price: 4300, img: "img/pigean1 (1).jpg", description: "نص ملوة" },
        { name: "عدسيه", price: 2200, img: "img/pigean1 (1).jpg", description: "ربع ملوة" },
        { name: "فاصوليا", price: 5000, img: "img/ei_1731592911797-removebg-preview.png", description: "كيلو فاصوليا" },
        { name: ".فاصوليا", price: 2500, img: "img/ei_1731592911797-removebg-preview.png", description: " نص كيلو فاصوليا" },
        { name: "..فاصوليا", price: 1300, img: "img/ei_1731592911797-removebg-preview.png", description: "ربع كيلو فاصوليا" },
        { name: "عدس", price: 3600, img: "img/ei_1731592849739-removebg-preview.png", description: "كيلو عدس" },
        { name: ".عدس", price: 1800, img: "img/ei_1731592849739-removebg-preview.png", description: "نص كيلو عدس" },
        { name: "..عدس", price: 900, img: "img/ei_1731592849739-removebg-preview.png", description: "ربع كيلو عدس" },
        { name: "رز", price: 3000, img: "img/ei_1731592875777-removebg-preview.png", description: "كيلو رز" },
        { name: ".رز", price: 1500, img: "img/ei_1731592875777-removebg-preview.png", description: "نص كيلو رز" },
        { name: "..رز", price: 800, img: "img/ei_1731592875777-removebg-preview.png", description: "ربع كيلو رز" },
        { name: "رز كبسه", price: 3000, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "كيلو رز كبسه" },
        { name: ".رز كبسه", price: 1500, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "نص كيلو" },
        { name: "..رز كبسه", price: 800, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "ربع كيلو" },
        { name: "فنكوش", price: 7000, img: "img/ei_1731751812625-removebg-preview.png", description: "كيلو فنكوش" },
        { name: "فنكوش.", price: 3500, img: "img/ei_1731751812625-removebg-preview.png", description: "نص كيلو" },
        { name: "فنكوش..", price: 1800, img: "img/ei_1731751812625-removebg-preview.png", description: "ربع كيلو" },
        { name: "فشار", price: 4000, img: "img/ei_1731751866938-removebg-preview.png", description: "كيلو فشار" },
        { name: "فشار", price: 2000, img: "img/ei_1731751866938-removebg-preview.png", description: "نص كيلو" },
        { name: "فشار", price: 1000, img: "img/ei_1731751866938-removebg-preview.png", description: "ربع كيلو" },
        { name: "شطه حمرا", price: 500, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".شطه حمرا", price: 1000, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "دكوه", price: 500, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".دكوه", price: 1000, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "ويكه", price: 1000, img: "img/1731608221985.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "بصل", price: 2000, img: "img/onions-1397037_1920 (1).jpg", description: "ملوة بصل" },
        { name: ".بصل", price: 3800, img: "img/onions-1397037_1920 (1).jpg", description: "نص ربع بصل" },
        { name: "..بصل", price: 7500, img: "img/onions-1397037_1920 (1).jpg", description: "ربع بصل" },
        { name: "مرقة دجاج", price: 200, img: "img/ei_1731751480774-removebg-preview.png", description: "القطعه الواحدة ب 200" },
        { name: "ثوم", price: 1000, img: "img/garlic-3419544_1280 (1).jpg", description: "يمكنك اخيار الثوم عدة مرات" },
        { name: "كسبره", price: 1000, img: "img/ei_1731587888826-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "كسبره مسحونه", price: 1000, img: "img/ei_1731587592367-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل", price: 1000, img: "img/ginger-1960613_1280 (1).jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل مسحون", price: 1000, img: "img/ei_1731587498607-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرفه", price: 1000, img: "img/ei_1731587655490-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرنفل", price: 1000, img: "img/ei_1731587348599-removebg-preview.png", description: "يمكنك الاختيار عدة مرات(اقل سعر)" },
        { name: "شمار", price: 1000, img: "img/ei_1731587721125-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "كمون(الحبه السودا)", price: 1000, img: "img/ei_1731588860551-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" },
        { name: "فول", price: 1000, img: "img/hq720.jpg", description: "اختار حسب سعرك" },
        { name: ".فول", price: 2000, img: "img/hq720.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "طعميه", price: 500, img: "img/1731701662444.jpg", description: "حبتين ب100 10حبات ب" },
        { name: ".طعميه", price: 1000, img: "img/1731701662444.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "بيض", price: 700, img: "img/ei_1731780353147-removebg-preview.png", description: "بيضه واحده ب" },
        { name: "بيض.", price: 3500, img: "img/ei_1731780353147-removebg-preview.png", description: "5 بيضه ب" },
        { name: "طقم بيض", price: 17000, img: "img/ei_1731780335724-removebg-preview.png", description: "طقم بيض " },
        { name: "زبادي بلدي", price: 1300, img: "img/1731701612938.jpg", description: "رطل زبادي بلدي" },
        { name: "جبنه", price: 18000, img: "img/ei_1731751456840-removebg-preview.png", description: "كيلو جبنه" },
        { name: ".جبنه", price: 9000, img: "img/ei_1731751456840-removebg-preview.png", description: "نص كيلو" },
        { name: "..جبنه", price: 4500, img: "img/ei_1731751456840-removebg-preview.png", description: "ربع كيلو" },
        { name: "جبنه,", price: 2300, img: "img/ei_1731751456840-removebg-preview.png", description: "نص ربع" },
        { name: "جبنه رودس", price: 800, img: "img/ei_1731750070992-removebg-preview.png", description: "جبنة رودس يمكنك الاختيار عدة مرات" },    
        { name: "زيتون", price: 8000, img: "img/ei_1731750100103-removebg-preview.png", description: "كيلو زيتون" },
        { name: ".زيتون", price: 4000, img: "img/ei_1731750100103-removebg-preview.png", description: "نص كيلو زيتون" },
        { name: "زيتون..", price: 2000, img: "img/ei_1731750100103-removebg-preview.png", description: "ربع كيلو زيتون" },
        { name: "زيتون مقطع", price: 8000, img: "img/ei_1731750133670-removebg-preview.png", description: "كيلو" },
        { name: "زيتون مقطع", price: 4000, img: "img/ei_1731750133670-removebg-preview.png", description: "نص كيلو" },
        { name: "زيتون مقطع", price: 2000, img: "img/ei_1731750133670-removebg-preview.png", description: "ربع كيلو" },  
        
        { name: " صلصه مجانا", price: 500, img: "img/ei_1731593282850-removebg-preview.png", description: "ظرف صلصله مجانا يمكنك اختيار عدة ظروف" },
        { name: "صلصه", price: 3600, img: "img/ei_1731600621391-removebg-preview.png", description: "علبة صلصة الفراشه" },
        { name: ".صلصه", price: 3600, img: "img/ei_1731600652049-removebg-preview.png", description: "علبة صلصة سعيد" },
        { name: "زيت فول", price: 1000, img: "img/ei_1731592819883-removebg-preview.png", description: " مكنك الاختيار حسب سعرك او عدة مرات"  },
        { name: ".زيت فول", price: 2000, img: "img/ei_1731592819883-removebg-preview.png", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: " زيت تحمير", price: 1000, img: "img/ei_1731592819883-removebg-preview.png", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: ".زيت تحمير", price: 2000, img: "img/ei_1731592819883-removebg-preview.png", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: "زيت الوافي", price: 5000, img: "img/1731592288427.jpg", description: "زيت الوافي 900مل" },
        { name: ".زيت الوافي", price: 19000, img: "img/ei_1731592752318-removebg-preview.png", description: "زيت الوافي 4لتر" },
        { name: "خميره", price: 300, img: "img/ei_1731749366170-removebg-preview.png", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "باكنج باودر", price: 800, img: "img/ei_1731755615723-removebg-preview.png", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "فانليا", price: 800, img: "img/ei_1731752179544-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "نشاء", price: 1000, img: "img/ei_1731752154085-removebg-preview.png", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "كستر", price: 800, img: "img/ei_1731755822410-removebg-preview.png", description: "ظرف كستر" },
        { name: "خل ابيض", price: 2500, img: "img/ei_1731751734860-removebg-preview.png", description: "خل ابيض" },
      
        
        { name: "ملح", price: 300, img: "img/ei_1731587452255-removebg-preview.png", description: "ظرف ملح" },
        { name: ".ملح", price: 500, img: "img/ei_1731587452255-removebg-preview.png", description: "2 ظرف ملح" },
        { name: "ملح تعبيه", price: 500, img: "img/ei_1731587452255-removebg-preview.png", description: " (اقل طلب) يمكنك الاختيار عدة مرات" },
        { name: "لبن كابو", price: 39000, img: "img/ei_1734696590753-removebg-preview.png", description: "لبن كابو 2250جرام" },
        { name: "لبن كابو.", price: 19000, img: "img/ei_1734696662520-removebg-preview.png", description: "لبن كابو  1000 جرام" },
        { name: "لبن كابو..", price: 4500, img: "img/ei_1734696472444-removebg-preview.png", description: "لبن كابو 200 جرام" },
        { name: "لبن بودره", price: 15000, img: "img/أضرار_الحليب_المجفف.jpg", description: "كيلو لبن بودره" },
        { name: "لبن بودره.", price: 7500, img: "img/أضرار_الحليب_المجفف.jpg", description: "نص كيلو" },
        { name: "لبن بودره..", price: 3800, img: "img/أضرار_الحليب_المجفف.jpg", description: "ربع كيلو" },
        { name: "لبن بودره..", price: 1900, img: "img/أضرار_الحليب_المجفف.jpg", description: "نص ربع كيلو" },
        { name: " بن حب", price: 6500, img: "img/ei_1731587859083-removebg-preview.png", description: "بن رطل" },
        { name: " .بن حب", price: 3300, img: "img/ei_1731587859083-removebg-preview.png", description: "بن نص رطل" },
        { name: "..بن حب", price: 1700, img: "img/ei_1731587859083-removebg-preview.png", description: "بن ربع رطل" },
        { name: "بن مسحون", price: 9000, img: "img/ei_1731587685380-removebg-preview.png", description: "رطل بن مسحون" },
        { name: ".بن مسحون", price: 4500, img: "img/ei_1731587685380-removebg-preview.png", description: "نص رطل بن مسحون" },
        { name: "..بن مسحون", price: 2300, img: "img/ei_1731587685380-removebg-preview.png", description: "ربع رطل بن مسحون" },
        { name: "شاي تعبيه", price: 1000, img: "img/ei_1731587544800-removebg-preview (1).png", description: "نص ربع" },
        { name: "شاي الغزالتين", price: 2000, img: "img/ei_1731601395773-removebg-preview (1).png", description: "ربع شاي الغزالتين" },
        { name: ".شاي الغزالتين", price: 3800, img: "img/ei_1731601395773-removebg-preview (1).png", description: "نص رطل" },
        { name: "..شاي الغزالتين", price: 7500, img: "img/ei_1731601395773-removebg-preview (1).png", description: "رطل شاي الغزالتين" },
        { name: "شعريه نوبو", price: 1300, img: "img/ei_1731607995331-removebg-preview.png", description: "شعريه نوبو" },
        { name: "مكرونه نوبو", price: 1300, img: "img/ei_1731607972769-removebg-preview.png", description: "مكرونه كوع" },
        { name: "مكرونه اسباجتي", price: 1300, img: "img/ei_1731608036079-removebg-preview (1).png", description: "اسباجتي" },
        { name: "طحنيه تعبيه", price: 8500, img: "img/sweet-3-28-1-2021 (1).jpg", description: "كيلو طحنيه يمكنك الاختيار عدة مرات" },
        { name: ".طحنيه تعبيه", price: 4300, img: "img/sweet-3-28-1-2021 (1).jpg", description: "نص كيلو طحنيه" },
        { name: "..طحنيه تعبيه", price: 2200, img: "img/sweet-3-28-1-2021 (1).jpg", description: "ربع كيلو" },
        { name: "طحنية الوافي", price: 11500, img: "img/ei_1731607886849-removebg-preview.png", description: "حجم كبير" },
        { name: ".طحنية الوافي", price:6000, img: "img/ei_1731750044887-removebg-preview.png", description: "حجم وسط" },
        { name: "طحنية الوطنيه", price: 11500, img: "img/ei_1731607898994-removebg-preview.png", description: "حجم كبير" },
        { name: ".طحنية الوطنيه", price: 6000, img: "img/ei_1731607874744-removebg-preview.png", description: "حجم وسط" },
        { name: "مربى", price: 9000, img: "img/ei_1731751511283-removebg-preview.png", description: "مربى كبير" },
        { name: ".مربى", price: 4000, img: "img/ei_1731751511283-removebg-preview.png", description: "مربى وسط" },
        { name: "..مربى", price: 2000, img: "img/ei_1731751511283-removebg-preview.png", description: "مربى صغير" },
   
        { name: "اندومي ", price: 500, img: "img/ei_1731780282744-removebg-preview.png", description: "اندومي خضار يمكنك الاختيار عدة مرات" },
        { name: "بسكويت", price: 500, img: "img/ei_1731749618851-removebg-preview.png", description: "بسكويت جلكوز" },
        { name: "بسكويت.", price: 500, img: "img/ei_1731749667653-removebg-preview.png", description: "بسكويت بيك" },
        { name: "بسكويت..", price: 1000, img: "img/ei_1731749498236-removebg-preview.png", description: "بسكويت اوريو" },
        { name: "كيكه", price: 500, img: "img/ei_1731749256110-removebg-preview.png", description: "كيك السيسي" },
        { name: "ماكس تيلا", price: 10000, img: "img/ei_1731751763920-removebg-preview.png", description: "ماكس تيلا حجم كبير" },
        { name: "ماكس تيلا.", price: 4000, img: "img/ei_1731751788838-removebg-preview.png", description: "حجم وسط" },
        { name: "ماكس تيلا..", price: 1000, img: "img/ei_1731749310685-removebg-preview.png", description: "حجم صغير" },
        { name: "قشطه", price: 2000, img: "img/ei_1731784622818-removebg-preview.png", description: "" },
        { name: "صابون غسيل", price: 800, img: "img/ei_1731749244152-removebg-preview.png", description: "صابون غسيل استار" },
        { name: "صابون غسيل.", price: 1000, img: "img/ei_1731749706564-removebg-preview.png", description: "صابون غسيل أصيل" },
        { name: "صابون غسيل..", price: 1000, img: "img/ei_1731749562306-removebg-preview.png", description: "صابون غسيل الدولار" },
        { name: "صابون جلسرين", price: 1500, img: "img/images (3).jpg", description: "" },
        { name: "صابون جلسرين.", price: 1500, img: "img/100367-scaled.jpg", description: "" },
        { name: "صابون حمام", price: 2000, img: "img/ei_1731752022045-removebg-preview.png", description: "صابون lux حجم كبير" },
        { name: "صابون حمام.", price: 1500, img: "img/ei_1731752022045-removebg-preview.png", description: "صابون lux حجم وسط" },
        { name: "صابون حمام..", price: 1000, img: "img/ei_1731752022045-removebg-preview.png", description: "صابون lux حجم صغير" },
        { name: "صابون حمام,", price: 1500, img: "img/ei_1731752048693-removebg-preview.png", description: "صابون لايف بوي وسط" },
        { name: ".صابون حمام", price: 1000, img: "img/ei_1731752048693-removebg-preview.png", description: "صابون لايف بوي صغير" },
        { name: "صابون بشرى", price: 3000, img: "img/ei_1731752223655-removebg-preview.png", description: "صابون بشرى وسط" },
        { name: "صابون بشرى.", price: 1500, img: "img/ei_1731752223655-removebg-preview.png", description: "صابون بشرى صغير" },
        { name: "صابون تايد", price: 1000, img: "img/56f61b10-85f5-4751-ad8b-ebfef721169c.jpg", description: "صابون بودره تايد يمكنك اختيار عدة ظروف" },
        { name: "صابون تعبيه", price: 3000, img: "img/مسحوق+التنظيف+التجاري+بالجملة+بالمصنع+الغسيل+الغسيل+ا_.الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+صابون+المصنع.jpg", description: "كيلو صابون بودره" },
        { name: "صابون تعبيه.", price: 1500, img: "img/مسحوق+التنظيف+التجاري+بالجملة+بالمصنع+الغسيل+الغسيل+ا_.الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+صابون+المصنع.jpg", description: "نص كيلو صابون بودره" },
        { name: "معجون اسنان", price: 3500, img: "img/ei_1731751974015-removebg-preview.png", description: "معجون سنجل حجم كبير" },
        { name: ".معجون اسنان", price: 2000, img: "img/ei_1731751923147-removebg-preview.png", description: "معجون سنجل حجم وسط" },
        { name: "..معجون اسنان", price: 1000, img: "img/ei_1731751951638-removebg-preview.png", description: "معجون سنجل حجم صغير" },
        { name: "معجون اسنان.", price: 1000, img: "img/ei_1731780314653-removebg-preview.png", description: "معجون الغفران" },
        { name: "فرشة اسنان", price: 800, img: "img/ei_1731751998032-removebg-preview.png", description: "ناعم وسط خشن الاختيار بعد ارسال الفاتوره" },
        { name: "امواس", price: 100, img: "img/ei_1731752114423-removebg-preview.png", description: "قطعه واحده" },
        { name: "امواس", price: 500, img: "img/ei_1731752114423-removebg-preview.png", description: "صندوق امواس" },
        { name: "شفره", price: 500, img: "img/ei_1731752089220-removebg-preview.png", description: "قطعه الواحدة" },
        { name: "كبريت", price: 200, img: "img/ei_1731784693774-removebg-preview.png", description: "قطعه واحده" },
        { name: "", price: 800, img: "img/", description: "" },
        { name: "", price: 800, img: "img/", description: "" },
        { name: "", price: 800, img: "img/", description: "" },
        
        
    ];

    // عرض المنتجات في الصفحة الرئيسية
    displayProducts(productList);

    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();

    // إذا كنا في صفحة السلة، نعرض محتويات السلة
    if (window.location.pathname.includes('cart.html')) {
        displayCart();  // عرض محتويات السلة
    }

    // إضافة مستمع الحدث للبحث
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchQuery = searchInput.value.trim();
        displayProducts(productList, searchQuery);  // إعادة عرض المنتجات بناءً على نص البحث
    });
});