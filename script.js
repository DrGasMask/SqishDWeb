const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const luckyBtn = document.getElementById("luckyBtn");

// More accurate URL detection
function looksLikeURL(text) {
    const pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/.*)?$/i;
    return pattern.test(text);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = input.value.trim();

    if (!query) return;

    if (looksLikeURL(query)) {
        const url = query.startsWith("http") ? query : "https://" + query;
        window.location.href = url;
    } else {
        window.location.href = `results.html?q=${encodeURIComponent(query)}`;
    }
});

luckyBtn.addEventListener("click", () => {
    const ideas = [
        "half life mod",
        "how search engines work",
        "retro websites",
        "why simple designs win"
    ];
    const pick = ideas[Math.floor(Math.random() * ideas.length)];
    window.location.href = `results.html?q=${encodeURIComponent(pick)}`;
});

// Load saved theme on page load
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    document.getElementById("themeToggle").textContent = "☀️ Light Mode";
}

// Toggle button logic
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});


