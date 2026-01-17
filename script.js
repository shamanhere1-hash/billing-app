/************************************************
 * ELEMENT REFERENCES
 ************************************************/
const homePage = document.getElementById("homePage");
const takeOrderPage = document.getElementById("takeOrderPage");
const packCheckPage = document.getElementById("packCheckPage");
const billingPage = document.getElementById("billingPage");

const productList = document.getElementById("productList");
const billBody = document.getElementById("billBody");
const removePanel = document.getElementById("removePanel");
const grandTotalSpan = document.getElementById("grandTotal");
const searchInput = document.getElementById("search");
const buyerNameInput = document.getElementById("buyerName");

/************************************************
 * LOCAL STORAGE (PERSISTENT STATE)
 ************************************************/
let ordersForPacking =
    JSON.parse(localStorage.getItem("ordersForPacking")) || [];

let billingOrders =
    JSON.parse(localStorage.getItem("billingOrders")) || [];

let billCounter =
    Number(localStorage.getItem("billCounter")) || 1;

/************************************************
 * PRODUCTS
 ************************************************/
const products = [
    { name: "S", price: 116 },
    { name: "M", price: 168 },
    { name: "L", price: 204 },
    { name: "ariyal", price: 107 },
    { name: "tide", price: 107 },
    { name: "surf", price: 108 },
    { name: "xo black", price: 80 },
    { name: "xo red", price: 80 },
    { name: "steelwool", price: 70 },
    { name: "bindas", price: 96 },
    { name: "bidibook", price: 80 },
    { name: "whiteape", price: 60 },
    { name: "pen ₹ 5", price: 20 },
    { name: "pencil ₹ 5", price: 40 },
    { name: "ajay", price: 140 },
    { name: "easy", price: 305 },
    { name: "sunsilk", price: 14 },
    { name: "clinik+", price: 14 },
    { name: "dove", price: 28 },
    { name: "h&d shoulder", price: 36 },
    { name: "guard blade", price: 118 },
    { name: "carwash", price: 52 },
    { name: "feviquick", price: 90 },
    { name: "steel razor", price: 96 },
    { name: "oil", price: 20 },
    { name: "zoom 16*20", price: 120 },
    { name: "ld 3", price: 150 },
    { name: "ld 1/4", price: 225 },
    { name: "ld 1", price: 150 },
    { name: "zoom 3kg", price: 360 },
    { name: "master 3kg", price: 390 },
    { name: "8*11", price: 170 },
    { name: "oil", price: 65 },
    { name: "aa ₹ 10", price: 70 },
    { name: "aaa ₹ 10", price: 70 },
    { name: "aa ₹ 15", price: 105 },
    { name: "stayfree ₹45", price: 40 },
    { name: "whisper ₹37", price: 33 },
    { name: "whisper ₹50", price: 45 },
    { name: "exo", price: 83 },
    { name: "bodyguard", price: 100 },
    { name: "maya ₹10", price: 95 },
    { name: "kaddi", price: 8 },
    { name: "softtouch", price: 140 },
    { name: "skeal", price: 40 },
    { name: "raaj", price: 97 },
    { name: "colgate salt", price: 220 },
    { name: "colgate ₹50", price: 220 },
    { name: "cutie", price: 16 },
    { name: "homeguard ", price: 47 },
    { name: "crayons", price: 80 },
    { name: "marker ₹10", price: 75 },
    { name: "marker ₹20", price: 150 },
    { name: "catter", price: 46 },
    { name: "fevicol ₹5", price: 45 },
     { name: "himalaya", price: 52 },
    { name: "comby", price: 96 },
    { name: "training", price: 500 },
    { name: "riso", price: 78 },
    { name: "karpura", price: 225 },
    { name: "pithambary", price: 39 },
   { name: "candel", price: 75 },
   { name: "f l", price: 114 },
   { name: "sunna tube", price: 30 },
   { name: "boost 10*14", price: 19 },
   { name: "slm moop", price: 95 },
   { name: "ullas", price: 234 },
   { name: "batthi", price: 13 }
];

/************************************************
 * RUNTIME STATE
 ************************************************/
let cart = [];

/************************************************
 * PAGE NAVIGATION
 ************************************************/
function showPage(page) {
    hideAllPages();

    if (page === "home") homePage.style.display = "block";
    if (page === "takeOrder") takeOrderPage.style.display = "block";
    if (page === "packCheck") {
        packCheckPage.style.display = "block";
        renderPackCheck();
    }
    if (page === "billing") {
        billingPage.style.display = "block";
        renderBilling();
    }
}

function hideAllPages() {
    homePage.style.display = "none";
    takeOrderPage.style.display = "none";
    packCheckPage.style.display = "none";
    billingPage.style.display = "none";
}

/************************************************
 * PRODUCT LIST
 ************************************************/
function renderProducts(list) {
    productList.innerHTML = "";

    list.forEach(product => {
        const li = document.createElement("li");
        li.textContent = `${product.name} - ₹${product.price}`;
        li.onclick = () => addToCart(product);
        productList.appendChild(li);
    });
}

/************************************************
 * CART LOGIC (TAKING ORDER)
 ************************************************/
function addToCart(product) {
    const existing = cart.find(i => i.name === product.name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateBillUI();
}

function updateBillUI() {
    billBody.innerHTML = "";
    removePanel.innerHTML = "";

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const lineTotal = item.qty * item.price;
        grandTotal += lineTotal;

        billBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>
                    <button onclick="changeQty(${index}, -1)">−</button>
                    <input type="number" min="1"
                        value="${item.qty}"
                        onchange="setQty(${index}, this.value)"
                        style="width:50px">
                    <button onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>₹${item.price}</td>
                <td>₹${lineTotal}</td>
            </tr>
        `;

        removePanel.innerHTML += `
            <span class="remove-btn" onclick="removeItem(${index})">
                Remove ${item.name}
            </span>
        `;
    });

    grandTotalSpan.textContent = grandTotal;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty < 1) cart[index].qty = 1;
    updateBillUI();
}

function setQty(index, value) {
    const qty = parseInt(value);
    if (qty >= 1) {
        cart[index].qty = qty;
        updateBillUI();
    }
}

function removeItem(index) {
    cart.splice(index, 1);
    updateBillUI();
}

function resetBill() {
    cart = [];
    billBody.innerHTML = "";
    removePanel.innerHTML = "";
    grandTotalSpan.textContent = 0;
    buyerNameInput.value = "";
}

/************************************************
 * SEND ORDER → PACK & CHECK
 ************************************************/
async function sendOrder() {
    // 1. Get the Firebase functions we need
    const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    // 2. Prepare the order data
    const orderData = {
        billNo: document.getElementById('bill-no').innerText,
        customer: document.getElementById('customer-name').value || "Guest",
        items: cart,
        total: grandTotal,
        status: "pending", // So the packing screen knows it's new
        time: serverTimestamp() // Uses Google's server time
    };

    try {
        // 3. Send to the "orders" collection in the cloud
        await addDoc(collection(window.db, "orders"), orderData);
        alert("Order sent to Packing Screen!");
        resetCart(); 
    } catch (e) {
        console.error("Error: ", e);
        alert("Check internet connection!");
    }
}

/************************************************
 * PACK & CHECK
 ************************************************/
function renderPackCheck() {
    packCheckPage.innerHTML = `
        <button onclick="showPage('home')">⬅ Back</button>
        <h3>Pack & Check</h3>
    `;

    ordersForPacking.forEach((order, index) => {
        let rows = "";

        order.items.forEach(i => {
            rows += `<tr><td>${i.name}</td><td>${i.qty}</td></tr>`;
        });

        packCheckPage.innerHTML += `
            <div class="bill">
                <h4>Bill No: ${order.billNo}</h4>
                <p>Name: ${order.buyerName}</p>

                <table>
                    <tr><th>Item</th><th>Qty</th></tr>
                    ${rows}
                </table>

                <button onclick="submitPack(${index})">Submit</button>
            </div>
        `;
    });
}

function submitPack(index) {
    const order = ordersForPacking.splice(index, 1)[0];
   

    billingOrders.push(order);
    savePersistentState();

    renderPackCheck();
}

/************************************************
 * BILLING
 ************************************************/
function renderBilling() {
    billingPage.innerHTML = `
        <button onclick="showPage('home')">⬅ Back</button>
        <h3>Billing</h3>
    `;

    billingOrders.forEach((order, index) => {
        let rows = "";

        order.items.forEach(i => {
            rows += `
                <tr>
                    <td>${i.name}</td>
                    <td>${i.qty}</td>
                    <td>₹${i.price}</td>
                    <td>₹${i.qty * i.price}</td>
                </tr>
            `;
        });

        billingPage.innerHTML += `
            <div class="bill" id="billing-bill-${index}">
                <h4>Bill No: ${order.billNo}</h4>
                <p>Name: ${order.buyerName}</p>

                <table>
                    <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                    ${rows}
                </table>

                <h3 class="grand-total">
                    Grand Total: ₹${order.total}
                </h3>

                <div class="actions">
                    <button onclick="printBilling(${index})">Print</button>
                    <button onclick="downloadBillingPDF(${index})">Download PDF</button>
                </div>
            </div>
        `;
    });
}

function printBilling(index) {
    const bill = document.getElementById(`billing-bill-${index}`);
    const original = document.body.innerHTML;

    document.body.innerHTML = bill.outerHTML;
    window.print();
    document.body.innerHTML = original;
}

function downloadBillingPDF(index) {
    const bill = document.getElementById(`billing-bill-${index}`);
    html2pdf().from(bill).save(`Bill_${index + 1}.pdf`);
}

/************************************************
 * SEARCH
 ************************************************/
searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    renderProducts(
        products.filter(p => p.name.toLowerCase().includes(value))
    );
});

/************************************************
 * UTILITIES
 ************************************************/
function savePersistentState() {
    localStorage.setItem("ordersForPacking", JSON.stringify(ordersForPacking));
    localStorage.setItem("billingOrders", JSON.stringify(billingOrders));
    localStorage.setItem("billCounter", billCounter);
}


/************************************************
 * INIT
 ************************************************/

function resetAllBills() {
    if (!confirm("This will DELETE all bills and reset bill numbers. Continue?")) {
        return;
    }

    // 1️⃣ Reset in-memory state
    cart = [];
    ordersForPacking = [];
    billingOrders = [];
    billCounter = 1; // start again from 0001

    // 2️⃣ Clear localStorage
    localStorage.removeItem("ordersForPacking");
    localStorage.removeItem("billingOrders");
    localStorage.removeItem("billCounter");

    // 3️⃣ Reset UI
    billBody.innerHTML = "";
    removePanel.innerHTML = "";
    grandTotalSpan.textContent = "0";
    buyerNameInput.value = "";

    // 4️⃣ Go back to home
    showPage("home");

    alert("All bills deleted and bill numbers reset");
}









function toggleProducts() {
    const list = document.getElementById("productList");
    const toggle = document.querySelector(".toggle-products");

    if (!list || !toggle) return;

    if (list.classList.contains("collapsed")) {
        list.classList.remove("collapsed");
        list.classList.add("expanded");
        toggle.textContent = "▲ Show less products";
    } else {
        list.classList.remove("expanded");
        list.classList.add("collapsed");
        toggle.textContent = "▼ Show more products";
    }
}
async function startGlobalSync() {
    const { collection, query, onSnapshot, orderBy, doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

    // Listen to ALL orders sorted by time
    const q = query(collection(window.db, "orders"), orderBy("time", "desc"));

    onSnapshot(q, (snapshot) => {
        const packList = document.getElementById("pack-check-list");
        const billingList = document.getElementById("final-billing-list");
        
        // Clear both lists before redrawing
        if(packList) packList.innerHTML = "";
        if(billingList) billingList.innerHTML = "";

        snapshot.forEach((orderDoc) => {
            const order = orderDoc.data();
            const id = orderDoc.id;

            if (order.status === "pending") {
                // Add to Pack & Check section
                packList.innerHTML += `
                    <div class="order-card">
                        <span>Bill #${order.billNo} - ${order.customer}</span>
                        <button onclick="updateStatus('${id}', 'packed')">Mark Packed</button>
                    </div>`;
            } else if (order.status === "packed") {
                // Add to Final Billing section
                billingList.innerHTML += `
                    <div class="order-card packed">
                        <span>Bill #${order.billNo} - ${order.customer} (READY)</span>
                        <button onclick="updateStatus('${id}', 'delivered')">Done</button>
                    </div>`;
            }
        });
    });
}

// Function to move orders between sections globally
window.updateStatus = async (id, newStatus) => {
    const { doc, updateDoc } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
    const orderRef = doc(window.db, "orders", id);
    await updateDoc(orderRef, { status: newStatus });
};

startGlobalSync();

renderProducts(products);