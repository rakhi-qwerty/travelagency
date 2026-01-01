    // --- DATA ---
    const airports = [
        { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi International Airport' },
        { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International Airport' },
        { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda International Airport' },
        { code: 'MAA', city: 'Chennai', name: 'Chennai International Airport' },
        { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International Airport' },
        { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International Airport' },
        { code: 'DXB', city: 'Dubai', name: 'Dubai International Airport' },
        { code: 'LHR', city: 'London', name: 'Heathrow Airport' },
        { code: 'JFK', city: 'New York', name: 'John F. Kennedy International Airport' },
        { code: 'SIN', city: 'Singapore', name: 'Changi Airport' },
        { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi Airport' },
        { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda Airport' }
    ];

    // --- STATE ---
    let state = {
        tripType: 'multi',
        // Standard State
        from: airports[0],
        to: airports[2],
        departDate: new Date(),
        returnDate: null,
        // Multi City State
        segments: [
            { from: airports.find(a=>a.code==='DEL'), to: airports.find(a=>a.code==='BLR'), date: new Date('2026-01-02') },
            { from: airports.find(a=>a.code==='BLR'), to: null, date: new Date('2026-01-03') }
        ],
        // Travellers
        adults: 1,
        children: 0,
        travelClass: 'Economy'
    };

    // --- INITIALIZATION ---
    document.addEventListener('DOMContentLoaded', () => {
        initializeDate();
        renderMainLayout();
        setupGlobalListeners();
    });

    function initializeDate() {
        // Init Standard Date
        state.departDate = new Date();
        document.getElementById('departDateInput').valueAsDate = new Date();
        updateDateDisplay('depart', state.departDate);
    }

    function renderMainLayout() {
        const stdSearch = document.getElementById('standardSearch');
        const multiSearch = document.getElementById('multiCityContainer');
        const addCityBtn = document.getElementById('addCityBtn');
        const returnCol = document.getElementById('returnCol');
        const returnInput = document.getElementById('returnDateInput');

        // Reset display
        stdSearch.style.display = 'none';
        multiSearch.style.display = 'none';
        addCityBtn.style.display = 'none';

        if (state.tripType === 'multi') {
            multiSearch.style.display = 'flex';
            addCityBtn.style.display = 'block';
            renderMultiCityRows();
        } else {
            stdSearch.style.display = 'flex';
            if (state.tripType === 'round') {
                returnCol.classList.remove('muted');
                returnInput.disabled = false;
            } else {
                returnCol.classList.add('muted');
                returnInput.disabled = true;
                state.returnDate = null;
                document.getElementById('returnDateDisplay').innerText = "--";
            }
            // Update Standard UI
            document.getElementById('fromCity').innerText = state.from.city;
            document.getElementById('fromCode').innerText = `${state.from.code}, ${state.from.name}`;
            document.getElementById('toCity').innerText = state.to.city;
            document.getElementById('toCode').innerText = `${state.to.code}, ${state.to.name}`;
            updateTravellerLabel(document.getElementById('classTitle'), document.getElementById('classSub'));
        }
    }

    // --- MULTI CITY RENDERER ---
    function renderMultiCityRows() {
        const container = document.getElementById('multiCityContainer');
        container.innerHTML = '';

        state.segments.forEach((seg, index) => {
            const row = document.createElement('div');
            row.className = 'multi-row';
            
            // Format Date
            const d = seg.date;
            const dateStr = d ? `${d.getDate()} ${d.toLocaleString('default',{month:'short'})}' ${d.getFullYear().toString().substr(-2)}` : '--';
            const dayStr = d ? d.toLocaleString('default',{weekday:'long'}) : 'Select Date';
            const dateVal = d ? d.toISOString().split('T')[0] : '';

            // From Text
            const fromCity = seg.from ? seg.from.city : 'Select City';
            const fromCode = seg.from ? `${seg.from.code}, ${seg.from.name}` : 'Select origin';

            // To Text
            const toCity = seg.to ? seg.to.city : 'Select City';
            const toCode = seg.to ? `${seg.to.code}, ${seg.to.name}` : 'Select destination';

            row.innerHTML = `
                <!-- FROM -->
                <div class="flight-col from-col" onclick="openMultiDropdown(event, ${index}, 'from')">
                    <span class="label">FROM</span>
                    <h3 class="city-name">${fromCity}</h3>
                    <p class="city-code">${fromCode}</p>
                    <div class="city-dropdown" id="multiFromDrop_${index}">
                        <input type="text" class="citySearch" onclick="event.stopPropagation()" oninput="filterMultiCity(this.value, ${index}, 'from')">
                        <ul class="cityList" id="multiFromList_${index}"></ul>
                    </div>
                </div>

                <!-- TO -->
                <div class="flight-col to-col" onclick="openMultiDropdown(event, ${index}, 'to')">
                    <span class="label">TO</span>
                    <h3 class="city-name">${toCity}</h3>
                    <p class="city-code">${toCode}</p>
                    <div class="city-dropdown" id="multiToDrop_${index}">
                        <input type="text" class="citySearch" onclick="event.stopPropagation()" oninput="filterMultiCity(this.value, ${index}, 'to')">
                        <ul class="cityList" id="multiToList_${index}"></ul>
                    </div>
                </div>

                <!-- DATE -->
                <div class="departure-col">
                    <span class="label">DEPARTURE</span>
                    <h3 class="dateText">${dateStr}</h3>
                    <p class="dayText">${dayStr}</p>
                    <input type="date" class="dateInput" value="${dateVal}" onchange="updateMultiDate(${index}, this.value)">
                </div>

                <!-- TRAVELLERS (Only on 1st row usually, or simplified) -->
                ${index === 0 ? `
                <div class="flight-col traveller-col" id="multiTravellerCol" onclick="openTravellerPanel(event)">
                    <span class="label">TRAVELLERS & CLASS</span>
                    <h3 id="multiClassTitle">1 Traveller</h3>
                    <p id="multiClassSub">Economy</p>
                </div>
                ` : `<div class="flight-col traveller-col" style="display:flex; align-items:center;"></div>`}
                
                <!-- REMOVE BTN -->
                ${index > 1 ? `<i class="fa-solid fa-times remove-row-btn" onclick="removeSegment(${index})"></i>` : ''}
            `;
            container.appendChild(row);
        });

        // Update traveller text for the first row
        const title = document.getElementById('multiClassTitle');
        const sub = document.getElementById('multiClassSub');
        if(title && sub) updateTravellerLabel(title, sub);
    }

    // --- EVENT HANDLERS & LOGIC ---

    function setupGlobalListeners() {
        // Radio Buttons
        const tripRadios = document.querySelectorAll('input[name="trip"]');
        tripRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                state.tripType = e.target.value;
                renderMainLayout();
            });
        });

        // Standard From/To click
        const stdFrom = document.getElementById('fromCol');
        if(stdFrom) stdFrom.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('fromDropdown');
            populateCityList('fromCityList', 'from'); // 'from' updates state.from
        });

        const stdTo = document.getElementById('toCol');
        if(stdTo) stdTo.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleDropdown('toDropdown');
            populateCityList('toCityList', 'to'); // 'to' updates state.to
        });

        // Add City Btn
        document.getElementById('addCityBtn').addEventListener('click', () => {
            if(state.segments.length < 5) {
                // Determine default date (next day of last segment)
                const lastDate = state.segments[state.segments.length-1].date || new Date();
                const nextDate = new Date(lastDate);
                nextDate.setDate(nextDate.getDate() + 1);
                
                // Determine default from (To of last segment)
                const lastTo = state.segments[state.segments.length-1].to;

                state.segments.push({
                    from: lastTo,
                    to: null,
                    date: nextDate
                });
                renderMultiCityRows();
            }
        });

        // Traveller Panel Global Close
        document.getElementById('travellerDone').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('travellerPanel').classList.remove('show');
        });

        // Search Filters Standard
        document.getElementById('fromSearchInput').addEventListener('input', (e) => filterCities(e.target.value, 'fromCityList', (val)=>state.from=val));
        document.getElementById('toSearchInput').addEventListener('input', (e) => filterCities(e.target.value, 'toCityList', (val)=>state.to=val));
        
        // Standard Date
        document.getElementById('departDateInput').addEventListener('change', (e) => {
            state.departDate = new Date(e.target.value);
            updateDateDisplay('depart', state.departDate);
        });
        document.getElementById('returnDateInput').addEventListener('change', (e) => {
            state.returnDate = new Date(e.target.value);
            updateDateDisplay('return', state.returnDate);
        });

        // Search Button
        document.getElementById('searchBtn').addEventListener('click', performSearch);

        // Click Outside
        document.addEventListener('click', () => {
            document.querySelectorAll('.city-dropdown, .traveller-panel').forEach(el => el.classList.remove('show'));
        });
        document.getElementById('travellerPanel').addEventListener('click', e => e.stopPropagation());
        
        // Standard Traveller Click
        document.getElementById('travellerCol').addEventListener('click', openTravellerPanel);
    }

    // --- HELPER FUNCTIONS ---

    function openMultiDropdown(e, index, type) {
        e.stopPropagation();
        // Close others
        document.querySelectorAll('.city-dropdown').forEach(el => el.classList.remove('show'));
        
        const dropId = type === 'from' ? `multiFromDrop_${index}` : `multiToDrop_${index}`;
        const listId = type === 'from' ? `multiFromList_${index}` : `multiToList_${index}`;
        
        document.getElementById(dropId).classList.add('show');
        
        // Populate
        const list = document.getElementById(listId);
        list.innerHTML = '';
        airports.forEach(ap => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="list-code">${ap.code}</span> <span class="list-name">${ap.city}</span>`;
            li.onclick = (ev) => {
                ev.stopPropagation();
                if(type === 'from') state.segments[index].from = ap;
                else state.segments[index].to = ap;
                renderMultiCityRows();
            };
            list.appendChild(li);
        });
    }

    function filterMultiCity(text, index, type) {
        const listId = type === 'from' ? `multiFromList_${index}` : `multiToList_${index}`;
        const list = document.getElementById(listId);
        list.innerHTML = '';
        
        const filtered = airports.filter(a => 
            a.city.toLowerCase().includes(text.toLowerCase()) || 
            a.code.toLowerCase().includes(text.toLowerCase())
        );

        filtered.forEach(ap => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="list-code">${ap.code}</span> <span class="list-name">${ap.city}</span>`;
            li.onclick = (ev) => {
                ev.stopPropagation();
                if(type === 'from') state.segments[index].from = ap;
                else state.segments[index].to = ap;
                renderMultiCityRows();
            };
            list.appendChild(li);
        });
    }

    function updateMultiDate(index, val) {
        state.segments[index].date = new Date(val);
        renderMultiCityRows();
    }

    function removeSegment(index) {
        state.segments.splice(index, 1);
        renderMultiCityRows();
    }

    function openTravellerPanel(e) {
        e.stopPropagation();
        const panel = document.getElementById('travellerPanel');
        
        // Position it
        // Ideally we attach it to the click target, but for simplicity in this layout,
        // we'll just toggle class and let CSS absolute positioning handle it relative to parent if possible,
        // but here the panel is outside standard/multi containers. 
        // We will position it under the clicked element.
        
        const rect = e.currentTarget.getBoundingClientRect();
        // Since panel is absolute to main-content or body? It is in main-content.
        // Let's just reset standard styling logic for simplicity
        
        const containerRect = document.querySelector('.main-content').getBoundingClientRect();
        
        panel.style.top = (rect.bottom - containerRect.top) + "px";
        panel.style.left = (rect.left - containerRect.left) + "px";
        panel.classList.add('show');
    }

    function updateTravellers(type, change) {
        if (type === 'adult') {
            const newVal = state.adults + change;
            if (newVal >= 1 && newVal <= 9) state.adults = newVal;
        } else {
            const newVal = state.children + change;
            if (newVal >= 0 && newVal <= 9) state.children = newVal;
        }
        document.getElementById('adultCount').innerText = state.adults;
        document.getElementById('childCount').innerText = state.children;
        
        // Update labels
        updateTravellerLabel(document.getElementById('classTitle'), document.getElementById('classSub'));
        const mTitle = document.getElementById('multiClassTitle');
        const mSub = document.getElementById('multiClassSub');
        if(mTitle) updateTravellerLabel(mTitle, mSub);
    }

    function updateClass() {
        const radios = document.getElementsByName('travelClass');
        for (let radio of radios) {
            if (radio.checked) {
                state.travelClass = radio.value;
                break;
            }
        }
        updateTravellers('adult', 0); // Trigger text update
    }

    function updateTravellerLabel(titleElem, subElem) {
        if(!titleElem) return;
        const total = state.adults + state.children;
        titleElem.innerText = `${total} Traveller${total > 1 ? 's' : ''}`;
        subElem.innerText = state.travelClass;
    }

    // Standard Functions
    function toggleDropdown(id) {
        document.querySelectorAll('.city-dropdown, .traveller-panel').forEach(el => {
            if(el.id !== id) el.classList.remove('show');
        });
        document.getElementById(id).classList.toggle('show');
    }

    function populateCityList(listId, type) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        airports.forEach(airport => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="list-code">${airport.code}</span> <span class="list-name">${airport.city} - ${airport.name}</span>`;
            li.onclick = () => {
                if(type === 'from') state.from = airport;
                else state.to = airport;
                renderMainLayout(); // Re-renders standard UI
                document.getElementById(listId).parentElement.classList.remove('show');
            };
            list.appendChild(li);
        });
    }

    function filterCities(text, listId, callback) {
        const list = document.getElementById(listId);
        list.innerHTML = '';
        const filtered = airports.filter(a => 
            a.city.toLowerCase().includes(text.toLowerCase()) || 
            a.code.toLowerCase().includes(text.toLowerCase())
        );

        filtered.forEach(airport => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="list-code">${airport.code}</span> <span class="list-name">${airport.city}</span>`;
            li.onclick = () => {
                callback(airport);
                renderMainLayout();
                document.getElementById(listId).parentElement.classList.remove('show');
            };
            list.appendChild(li);
        });
    }

    function updateDateDisplay(type, dateObj) {
        if (!dateObj) return;
        const dateElem = document.getElementById(type === 'depart' ? 'departDateDisplay' : 'returnDateDisplay');
        const dayElem = document.getElementById(type === 'depart' ? 'departDayDisplay' : 'returnDayDisplay');
        
        const day = dateObj.getDate();
        const month = dateObj.toLocaleString('default', { month: 'short' });
        const year = dateObj.getFullYear().toString().substr(-2);
        const dayName = dateObj.toLocaleString('default', { weekday: 'long' });

        dateElem.innerText = `${day} ${month}' ${year}`;
        dayElem.innerText = dayName;
    }

    // --- MOCK SEARCH ---
    function performSearch() {
        const resultContainer = document.getElementById('searchResult');
        const loader = document.getElementById('loading');
        
        resultContainer.innerHTML = '';
        loader.style.display = 'block';
        resultContainer.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            loader.style.display = 'none';
            
            if(state.tripType === 'multi') {
                // Generate header for Multi
                const header = document.createElement('h2');
                header.style.marginBottom = "20px";
                header.innerHTML = `Multi City Trip`;
                resultContainer.appendChild(header);

                // Show a summary card
                const card = document.createElement('div');
                card.className = 'flight-card';
                let routesHtml = '';
                let totalPrice = 0;

                state.segments.forEach((seg, i) => {
                    if(!seg.from || !seg.to) return;
                    const price = Math.floor(Math.random() * 8000 + 3000);
                    totalPrice += price;
                    routesHtml += `
                        <div style="border-bottom:1px solid #eee; padding: 10px 0; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <b>Flight ${i+1}:</b> ${seg.from.code} <i class="fa-solid fa-arrow-right" style="font-size:10px; margin:0 5px;"></i> ${seg.to.code}
                                <div style="font-size:12px; color:#888;">${seg.date.toDateString()}</div>
                            </div>
                            <div style="font-weight:bold;">₹${price.toLocaleString()}</div>
                        </div>
                    `;
                });

                card.innerHTML = `
                    <div style="width:100%;">
                        ${routesHtml}
                        <div style="margin-top:15px; text-align:right; font-size:20px; font-weight:bold;">
                            Total: ₹${totalPrice.toLocaleString()} <button class="book-btn">BOOK ALL</button>
                        </div>
                    </div>
                `;
                resultContainer.appendChild(card);

            } else {
                generateStandardMockFlights();
            }
        }, 1500);
    }

    function generateStandardMockFlights() {
        const airlines = [
            { name: 'IndiGo', logo: '6E' },
            { name: 'Air India', logo: 'AI' },
            { name: 'Vistara', logo: 'UK' }
        ];
        const container = document.getElementById('searchResult');
        
        const header = document.createElement('h2');
        header.style.marginBottom = "20px";
        header.innerText = `Flights from ${state.from.city} to ${state.to.city}`;
        container.appendChild(header);

        for (let i = 0; i < 5; i++) {
            const airline = airlines[Math.floor(Math.random() * airlines.length)];
            const price = Math.floor(Math.random() * (15000 - 4000) + 4000);
            
            const depHour = Math.floor(Math.random() * 23);
            const depMin = Math.floor(Math.random() * 59);
            const durHour = Math.floor(Math.random() * 4) + 1;
            const durMin = Math.floor(Math.random() * 59);
            
            let arrHour = (depHour + durHour) % 24;
            let arrMin = (depMin + durMin);
            if (arrMin >= 60) { arrHour++; arrMin -= 60; }
            
            const depTime = `${String(depHour).padStart(2, '0')}:${String(depMin).padStart(2, '0')}`;
            const arrTime = `${String(arrHour).padStart(2, '0')}:${String(arrMin).padStart(2, '0')}`;
            const duration = `${durHour}h ${durMin}m`;

            const card = document.createElement('div');
            card.className = 'flight-card';
            card.innerHTML = `
                <div class="airline-info">
                    <div class="airline-logo">${airline.logo}</div>
                    <div>
                        <div style="font-weight:bold; font-size:14px;">${airline.name}</div>
                        <div style="font-size:11px; color:#999;">${airline.logo}-${Math.floor(Math.random()*900)+100}</div>
                    </div>
                </div>
                
                <div class="route-info">
                    <div style="text-align:right;">
                        <div class="time">${depTime}</div>
                        <div style="font-size:12px; font-weight:bold;">${state.from.city}</div>
                    </div>
                    <div>
                        <div style="font-size:11px; color:#999; text-align:center;">${duration}</div>
                        <div class="dur"></div>
                        <div style="font-size:11px; color:#999; text-align:center;">Non-stop</div>
                    </div>
                    <div style="text-align:left;">
                        <div class="time">${arrTime}</div>
                        <div style="font-size:12px; font-weight:bold;">${state.to.city}</div>
                    </div>
                </div>

                <div class="price-info">
                    <div class="price">₹ ${price.toLocaleString('en-IN')}</div>
                    <button class="book-btn">BOOK</button>
                </div>
            `;
            container.appendChild(card);
        }
    }
