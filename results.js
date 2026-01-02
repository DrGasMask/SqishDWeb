// --- SETUP ---
const params = new URLSearchParams(window.location.search);
let query = params.get("q") || "";

const resultsDiv = document.getElementById("results");
const queryText = document.getElementById("queryText");
const paginationDiv = document.getElementById("pagination");

// Top search bar
const topSearchInput = document.getElementById("topSearchInput");
const topSearchForm = document.getElementById("topSearchForm");

// Tabs
const tabs = document.querySelectorAll(".tab");
let activeTab = "web";

// Pagination state
let currentPage = 1;
const RESULTS_PER_PAGE = 10;   // web
const IMAGES_PER_PAGE = 30;    // images

// Pre-fill search
topSearchInput.value = query;
queryText.textContent = query;

// --- SHUTTERSHADE PRIORITY RESULTS ---
const shutterShadeResults = [
    { title: "ShutterShade Studios (Official Website)", url: "https://shuttershadestudios.com/", desc: "Official home of ShutterShade Studios, creators of games and films." },
    { title: "ShutterShade Studios (YouTube)", url: "https://www.youtube.com/@ShutterShadeStudios", desc: "Main YouTube channel for ShutterShade Studios." },
    { title: "ShutterShade Films (YouTube)", url: "https://www.youtube.com/@ShutterShade-Films", desc: "Old film branch of ShutterShade Studios." },
    { title: "ShutterShade Studios (Roblox Group)", url: "https://www.roblox.com/communities/36013916/ShutterShade-Studios#!/about", desc: "Official Roblox group for ShutterShade Studios." },
    { title: "Classic Sandbox (Roblox Game)", url: "https://www.roblox.com/games/133429802296967/Classic-Sandbox", desc: "Sandbox game developed by ShutterShade Studios." }
];

// --- QUERY DETECTION ---
function isShutterShadeQuery(q) {
    const text = q.toLowerCase();
    return text.includes("shuttershade") || text === "sss" || text.includes("shutter shade");
}

// --- TOP SEARCH SUBMIT ---
topSearchForm.addEventListener("submit", e => {
    e.preventDefault();
    const newQuery = topSearchInput.value.trim();
    if (!newQuery) return;
    window.location.href = `results.html?q=${encodeURIComponent(newQuery)}`;
});

// --- TAB SWITCHING ---
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        activeTab = tab.dataset.tab;
        currentPage = 1;
        renderTab();
    });
});

// --- INITIAL LOAD ---
renderTab();

// --- TAB RENDER ---
function renderTab() {
    resultsDiv.innerHTML = "";
    paginationDiv.innerHTML = "";

    if (activeTab === "web") {
        fetchGoogleSearch(query, currentPage);
    } else {
        fetchGoogleImages(query, currentPage);
    }
}

// --- GOOGLE WEB SEARCH ---
async function fetchGoogleSearch(searchTerm, page) {
    const API_KEY = "AIzaSyDmegfkx8BlF58Z0Sr8zKakDy6Nui8ZFmk";
    const CX = "d62e24b5e35eb494e";

    const start = (page - 1) * RESULTS_PER_PAGE + 1;
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(searchTerm)}&start=${start}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        renderGoogleResults(data);
        renderPagination(data.searchInformation?.totalResults || 0);
    } catch {
        resultsDiv.innerHTML = "<p>Failed to fetch results.</p>";
    }
}

// --- RENDER GOOGLE RESULTS ---
function renderGoogleResults(data) {
    resultsDiv.innerHTML = "";

    if (isShutterShadeQuery(query) && currentPage === 1) {
        shutterShadeResults.forEach(r => renderResult(r.title, r.url, r.desc));
    }

    if (data.items) {
        data.items.forEach(item => {
            renderResult(item.title, item.link, item.snippet);
        });
    }
}

// --- RESULT CARD ---
function renderResult(title, url, desc) {
    const div = document.createElement("div");
    div.className = "result";
    div.innerHTML = `
        <a href="${url}" target="_blank" rel="noopener noreferrer">${title}</a>
        <p>${desc}</p>
    `;
    resultsDiv.appendChild(div);
}

// --- GOOGLE IMAGE SEARCH (30 IMAGES PER PAGE) ---
async function fetchGoogleImages(searchTerm, page) {
    resultsDiv.innerHTML = `<div class="image-grid" id="imageGrid"></div>`;
    const imageGrid = document.getElementById("imageGrid");

    const API_KEY = "AIzaSyDmegfkx8BlF58Z0Sr8zKakDy6Nui8ZFmk";
    const CX = "d62e24b5e35eb494e";

    const REQUESTS = IMAGES_PER_PAGE / 10;

    for (let i = 0; i < REQUESTS; i++) {
        const start =
            ((page - 1) * IMAGES_PER_PAGE) + (i * 10) + 1;

        const url =
            `https://www.googleapis.com/customsearch/v1` +
            `?key=${API_KEY}` +
            `&cx=${CX}` +
            `&q=${encodeURIComponent(searchTerm)}` +
            `&searchType=image` +
            `&num=10` +
            `&start=${start}` +
            `&safe=active`;

        try {
            const res = await fetch(url);
            const data = await res.json();

            if (!data.items) continue;

            data.items.forEach(item => {
                const box = document.createElement("div");
                box.className = "img-box";

                const img = document.createElement("img");
                img.src = item.image.thumbnailLink;
                img.alt = item.title;
                img.loading = "lazy";

                box.appendChild(img);
                imageGrid.appendChild(box);
            });

            if (i === 0) {
                renderPagination(data.searchInformation?.totalResults || 0);
            }

        } catch (err) {
            console.error("Image fetch failed:", err);
        }
    }
}

// --- PAGINATION ---
function renderPagination(totalResults) {
    paginationDiv.innerHTML = "";

    const perPage =
        activeTab === "images" ? IMAGES_PER_PAGE : RESULTS_PER_PAGE;

    const totalPages = Math.min(
        Math.ceil(totalResults / perPage),
        10
    );

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "page-btn" + (i === currentPage ? " active" : "");

        btn.onclick = () => {
            currentPage = i;
            renderTab();
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        paginationDiv.appendChild(btn);
    }
}

// --- DARK/LIGHT MODE ---
const themeBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
    themeBtn.textContent =
        document.body.classList.contains("dark-mode")
            ? "☀️ Light Mode"
            : "🌙 Dark Mode";
});
