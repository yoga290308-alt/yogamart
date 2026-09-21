let cart = JSON.parse(localStorage.getItem("cart")) || [];

const buttons = document.querySelectorAll(".product-content button");

buttons.forEach(function (button) {

    button.addEventListener("click", function () {

        const product = button.closest(".product");

        const name = product.querySelector("h3").textContent;
        const price = product.querySelector("h4").textContent;

        cart.push({
            name: name,
            price: price
        });

        localStorage.setItem("cart", JSON.stringify(cart));

        alert(name + " added to cart!");
    });
});
function loadCart() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "Total: ₹0";
        return;
    }

    let total = 0;

    cart.forEach(function(item, index) {

        let quantity = item.quantity || 1;
        let price = parseInt(item.price.replace(/[^0-9]/g, ""));
        let itemTotal = price * quantity;

        total += itemTotal;

        cartItems.innerHTML += `
            <div class="product">

                <div class="product-content">

                    <h3>${item.name}</h3>
                    <p>₹${price} each</p>
                    <div style="
    display:flex;
    align-items:center;
    justify-content:flex-end;
    gap:15px;
">

<button style="width:45px !important; height:35px; padding:0;"
        onclick="changeCartQuantity(${index}, -1)">−</button>

    <input type="number"
       value="${quantity}"
       min="1"
       style="width:60px; text-align:center;"
       onchange="editCartQuantity(${index}, this.value)">

    <button style="width:40px;"
        onclick="changeCartQuantity(${index}, 1)">+</button>

    <strong style="width:100px; text-align:right;">
        ₹${itemTotal}
    </strong>

</div>
                   </div>

                    <br>

                    <button style="width:100px;"
                        onclick="removeItem(${index})">
                        Remove
                    </button>

                </div>

            </div>
        `;
    });

    cartTotal.textContent = "Total: ₹" + total;
}
function changeCartQuantity(index, change) {

    let quantity = cart[index].quantity || 1;

    quantity = quantity + change;

    if (quantity < 1) {
        quantity = 1;
    }

    cart[index].quantity = quantity;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}
function editCartQuantity(index, value) {

    let quantity = Number(value);

    if (quantity < 1) {
        quantity = 1;
    }

    cart[index].quantity = quantity;

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}
function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
    }
    window.location.href="checkout.html";
}
function loadCheckout() {

    const summary = document.getElementById("orderSummary");
    const totalBox = document.getElementById("checkoutTotal");

    if (!summary) return;

    let cartData = JSON.parse(localStorage.getItem("cart")) || [];

    summary.innerHTML = "";

    let total = 0;

    cartData.forEach(function(item) {

        let price = item.price;
        let quantity = item.quantity || 1;

        let number = parseInt(price.replace(/[^0-9]/g, ""));

        total += number * quantity;

        summary.innerHTML += `
            <div class="product">
                <div class="product-content">
                    <h3>${item.name}</h3>
                    <p>${item.price}</p>
                </div>
            </div>
        `;
    });

    totalBox.textContent = "Total: ₹" + total;
}
if (document.getElementById("orderSummary")) {
    loadCheckout();
}
function goToCheckout() {
    window.location.href = "checkout.html";
}
function placeOrder() {

    const payment = document.querySelector('input[name="payment"]:checked');

    if (!payment) {
        alert("Please select a payment method");
        return;
    }

    let cartData = JSON.parse(localStorage.getItem("cart")) || [];
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        items: cartData,
        payment: payment.value,
        date: new Date().toLocaleString()
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    alert("Order placed successfully!");

    window.location.href = "orders.html";
}
function loadOrders() {

    const ordersList = document.getElementById("ordersList");

    if (!ordersList) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    if (orders.length === 0) {
        ordersList.innerHTML = "<p>No orders yet.</p>";
        return;
    }

    ordersList.innerHTML = "";

    orders.forEach(function(order, index) {

        let items = "";
        let total = 0;

        order.items.forEach(function(item) {

            let quantity = item.quantity || 1;
            let price = parseInt(item.price.replace(/[^0-9]/g, ""));

            total += price * quantity;

            items += `
                <p>
                    ${item.name} - ${item.price} × ${quantity}
                </p>
            `;
        });

        ordersList.innerHTML += `
            <div class="product">

                <h3>📦 Order #${index + 1}</h3>

                ${items}

                <p>📅 Date: ${order.date}</p>

                <h3>Total Amount: ₹${total}</h3>

                <p>Payment: ${
                    order.payment === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"
                }</p>

                <p>Status: Order Placed ✅</p>
                <button onclick="clearOrder(${index})">Clear</button>
            </div>
        `;
    });
}
if (document.getElementById("ordersList")) {
    loadOrders();
}
function clearOrder(index) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.splice(index, 1);

    localStorage.setItem("orders", JSON.stringify(orders));

    loadOrders();
}
loadCart();
loadCart();
const searchBox = document.querySelector(".search-box");

if (searchBox) {
    searchBox.addEventListener("input", function () {

        const search = searchBox.value.toLowerCase();
        const products = document.querySelectorAll(".product");

        products.forEach(function (product) {

            const name = product.querySelector("h3").textContent.toLowerCase();

            if (name.includes(search)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }

        });
    });
}
function login() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (email === savedEmail && password === savedPassword) {
        window.location.href = "index.html";
    } else {
        document.getElementById("message").textContent =
            "Invalid email or password";
    }
}
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    localStorage.setItem("email", email);
    localStorage.setItem("password", password);

    window.location.href = "login.html";
}
function logout() {
    localStorage.removeItem("email");
    localStorage.removeItem("password");

    window.location.href = "login.html";
}
function calculateMaterials() {

    const length = Number(document.getElementById("length").value);
    const width = Number(document.getElementById("width").value);
    const bhk = Number(document.getElementById("bhk").value);
    const floors = Number(document.getElementById("floors").value);

    if (length <= 0 || width <= 0) {
        alert("Please enter valid length and width");
        return;
    }

    const area = length * width * floors;

    const cement = Math.ceil(area * 0.3);
    const steel = Math.ceil(area * 0.003);
    const bricks = Math.ceil(area * 10);
    const sand = Math.ceil(area * 1.2);
    const jelly = Math.ceil(area * 0.7);
    const paint = Math.ceil(area * 0.05);

    const cementCost = cement * 420;
    const steelCost = steel * 65;
    const brickCost = bricks * 9;
    const sandCost = sand * 250;
    const jellyCost = jelly * 200;
    const paintCost = paint * 200;

    const totalCost =
        cementCost +
        steelCost +
        brickCost +
        sandCost +
        jellyCost +
        paintCost;

    document.getElementById("result").innerHTML = `
        <h2>Material Requirement</h2>

        <p>Construction Area: ${area} sq.ft</p>

        <p>Cement: ${cement} bags</p>
        <p>Steel: ${steel} tonnes</p>
        <p>Bricks: ${bricks} pieces</p>
        <p>Sand: ${sand} cu.ft</p>
        <p>Jelly: ${jelly} cu.ft</p>
        <p>Paint: ${paint} litres</p>

        <h3>Estimated Material Cost: ₹${totalCost}</h3>
    `;
}
function addMaterialsToCart() {

    const length = Number(document.getElementById("length").value);
    const width = Number(document.getElementById("width").value);
    const floors = Number(document.getElementById("floors").value);

    if (length <= 0 || width <= 0) {
        alert("Please calculate materials first!");
        return;
    }

    const area = length * width * floors;

    const cement = Math.ceil(area * 0.3);
    const steel = Math.ceil(area * 0.003);
    const bricks = Math.ceil(area * 10);
    const sand = Math.ceil(area * 1.2);
    const jelly = Math.ceil(area * 0.7);
    const paint = Math.ceil(area * 0.05);
    let cart=[];

    cart.push({
        name: "Cement",
        price: "₹420",
        quantity: cement
    });

    cart.push({
        name: "Steel",
        price: "₹65",
        quantity: steel
    });

    cart.push({
        name: "Bricks",
        price: "₹9",
        quantity: bricks
    });

    cart.push({
        name: "Sand",
        price: "₹250",
        quantity: sand
    });

    cart.push({
        name: "Jelly",
        price: "₹200",
        quantity: jelly
    });

    cart.push({
        name: "Paint",
        price: "₹200",
        quantity: paint
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Required materials added to cart!");

    window.location.href = "cart.html";
}
function clearCart() {
    localStorage.removeItem("cart");
    location.reload();
}
function changeQuantity(id, change) {

    const quantity = document.getElementById(id + "-quantity");

    let value = Number(quantity.textContent);

    value = value + change;

    if (value < 1) {
        value = 1;
    }

    quantity.textContent = value;
}