// ========================================
// HA BAGS - Shopping Cart
// ========================================

let cart = [];

// عناصر السلة
const cartCount = document.getElementById("cart-count");
const cartPanel = document.getElementById("cart-panel");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const overlay = document.getElementById("overlay");
const closeCart = document.getElementById("close-cart");

// ========================================
// تحميل السلة المحفوظة
// ========================================

const savedCart = localStorage.getItem("ha_bags_cart");

if (savedCart) {
    try {
        cart = JSON.parse(savedCart);
    } catch (error) {
        cart = [];
    }
}

// ========================================
// حفظ السلة
// ========================================

function saveCart() {
    localStorage.setItem("ha_bags_cart", JSON.stringify(cart));
}

// ========================================
// تحديث عدد المنتجات
// ========================================

function updateCartCount() {
    if (!cartCount) return;

    let count = 0;

    cart.forEach(function (item) {
        count += item.quantity;
    });

    cartCount.textContent = count;
}

// ========================================
// إضافة منتج إلى السلة
// ========================================

function addToCart(productId, name, price, image) {

    const existingProduct = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: Number(price),
            image: image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    renderCart();

    showNotification("تمت إضافة المنتج إلى السلة");
}

// ========================================
// عرض محتويات السلة
// ========================================

function renderCart() {

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="text-align:center;padding:40px 10px;color:#777;">
                السلة فارغة حاليًا 🛍️
            </div>
        `;

        cartTotal.textContent = "0 دج";
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(function (item, index) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">

            <div style="flex:1">

                <h4>${item.name}</h4>

                <p style="margin:4px 0;color:#777;">
                    ${item.price.toLocaleString("ar-DZ")} دج
                </p>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                    margin-top:7px;
                ">

                    <button
                        onclick="changeQuantity(${index}, -1)"
                        style="
                            width:28px;
                            height:28px;
                            border:1px solid #ddd;
                            background:white;
                            border-radius:5px;
                        "
                    >−</button>

                    <span>${item.quantity}</span>

                    <button
                        onclick="changeQuantity(${index}, 1)"
                        style="
                            width:28px;
                            height:28px;
                            border:1px solid #ddd;
                            background:white;
                            border-radius:5px;
                        "
                    >+</button>

                    <button
                        onclick="removeFromCart(${index})"
                        style="
                            margin-right:auto;
                            border:none;
                            background:transparent;
                            color:#d94f7a;
                            cursor:pointer;
                        "
                    >
                        حذف
                    </button>

                </div>

            </div>
        `;

        cartItems.appendChild(div);
    });

    cartTotal.textContent =
        total.toLocaleString("ar-DZ") + " دج";
}

// ========================================
// تغيير كمية المنتج
// ========================================

function changeQuantity(index, change) {

    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartCount();
    renderCart();
}

// ========================================
// حذف منتج
// ========================================

function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    updateCartCount();
    renderCart();

    showNotification("تم حذف المنتج من السلة");
}

// ========================================
// فتح السلة
// ========================================

function openCart() {

    if (cartPanel) {
        cartPanel.classList.add("active");
    }

    if (overlay) {
        overlay.classList.add("active");
    }
}

// ========================================
// إغلاق السلة
// ========================================

function closeCartPanel() {

    if (cartPanel) {
        cartPanel.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }
}

// ========================================
// إشعار
// ========================================

function showNotification(message) {

    const oldNotification =
        document.querySelector(".ha-notification");

    if (oldNotification) {
        oldNotification.remove();
    }

    const notification = document.createElement("div");

    notification.className = "ha-notification";

    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.bottom = "90px";
    notification.style.right = "20px";
    notification.style.background = "#d94f7a";
    notification.style.color = "#fff";
    notification.style.padding = "12px 20px";
    notification.style.borderRadius = "8px";
    notification.style.zIndex = "9999";
    notification.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.2)";
    notification.style.fontFamily =
        "Cairo, Arial, sans-serif";

    document.body.appendChild(notification);

    setTimeout(function () {
        notification.remove();
    }, 2500);
}

// ========================================
// إرسال الطلب عبر WhatsApp
// ========================================

function sendOrderToWhatsApp() {

    if (cart.length === 0) {

        showNotification("السلة فارغة");

        return;
    }

    let message =
        "السلام عليكم، أريد طلب المنتجات التالية من HA BAGS:%0A%0A";

    let total = 0;

    cart.forEach(function (item) {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        message +=
            "👜 " +
            item.name +
            " × " +
            item.quantity +
            " = " +
            itemTotal.toLocaleString("ar-DZ") +
            " دج%0A";
    });

    message +=
        "%0A💰 المجموع: " +
        total.toLocaleString("ar-DZ") +
        " دج";

    // غيّر الرقم لاحقًا إلى رقم واتساب الخاص بك
    const phoneNumber = "213555000000";

    const whatsappURL =
        "https://wa.me/" +
        phoneNumber +
        "?text=" +
        message;

    window.open(whatsappURL, "_blank");
}

// ========================================
// عند تحميل الصفحة
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    renderCart();

    // أزرار إضافة إلى السلة
    const addButtons =
        document.querySelectorAll(".add-to-cart");

    addButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productCard =
                button.closest(".product-card");

            if (!productCard) return;

            const productName =
                button.dataset.product ||
                productCard.querySelector("h3")?.textContent ||
                "منتج HA BAGS";

            const price =
                Number(button.dataset.price) || 0;

            const image =
                productCard.querySelector("img")?.getAttribute("src") ||
                "";

            const productId =
                productName
                    .trim()
                    .replace(/\s+/g, "-");

            addToCart(
                productId,
                productName.trim(),
                price,
                image
            );

            openCart();
        });
    });

    // زر السلة
    const cartButton =
        document.querySelector(".cart-button");

    if (cartButton) {
        cartButton.addEventListener(
            "click",
            openCart
        );
    }

    // زر إغلاق السلة
    if (closeCart) {
        closeCart.addEventListener(
            "click",
            closeCartPanel
        );
    }

    // الضغط على الخلفية يغلق السلة
    if (overlay) {
        overlay.addEventListener(
            "click",
            closeCartPanel
        );
    }

    // زر إتمام الطلب
    const checkoutButton =
        document.querySelector(".checkout-button");

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            sendOrderToWhatsApp
        );
    }

});
