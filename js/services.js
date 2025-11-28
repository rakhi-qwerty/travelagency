const tabButtons = document.querySelectorAll(".tab");
const tabContent = document.getElementById("tab-content");


// Templates for each tab
const templates = {
flights: `
<div class="grid">
<div class="input-box">
<div class="input-title">From</div>
<input type="text" placeholder="City or airport" />
</div>


<div class="input-box">
<div class="input-title">To</div>
<input type="text" placeholder="City or airport" />
</div>
</div>


<div class="grid">
<div class="input-box">
<div class="input-title">Departure</div>
<input type="date" />
</div>
<div class="input-box">
<div class="input-title">Return</div>
<input type="date" />
</div>
</div>


<button class="search-btn">Search flights</button>


<div class="alert-box">
<div class="alert-title">Price alerts for your route</div>
<p>NYC → Any destination – Flexible dates</p>
</div>


<div class="alert-box">
<div class="alert-title">Handpicked deals</div>
<p>Weekend getaways under $299</p>
</div>
`,


bus: `<h3>Bus Booking Coming Soon...</h3>`,
cab: `<h3>Cab Booking Coming Soon...</h3>`,
train: `<h3>Train Booking Coming Soon...</h3>`,
hotels: `<h3>Hotel Search Coming Soon...</h3>`,
packages: `<h3>Travel Packages Coming Soon...</h3>`
};


// Default load flights
tabContent.innerHTML = templates.flights;


// Tab switching


tabButtons.forEach(btn => {
btn.addEventListener("click", () => {


document.querySelector(".tab.active")?.classList.remove("active");
btn.classList.add("active");


const page = btn.getAttribute("data-target");
tabContent.innerHTML = templates[page];
});
});