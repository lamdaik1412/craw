const chapterSelect = document.getElementById("chapterSelect");
const chapterContent = document.getElementById("chapterContent");
let chapters = [];
let currentChapterIndex = -1;

function generateChapters() {
    for (let i = 1; i <= 1976; i += 10) {
        const start = String(i).padStart(4, "0");
        const end = String(Math.min(i + 9, 1976)).padStart(4, "0");
        chapters.push(`chap_${start}_${end}.txt`);
    }
}

function populateChapterSelect() {
    chapterSelect.innerHTML = chapters
        .map((ch, i) => `<option value="${i}">${ch}</option>`)
        .join("");
}

async function loadChapter() {
    currentChapterIndex = parseInt(chapterSelect.value);
    const file = `XianNi/${chapters[currentChapterIndex]}`;
    try {
        const res = await fetch(file);
        const text = await res.text();
        chapterContent.innerHTML = text;
    } catch (e) {
        chapterContent.textContent = "Không thể tải chương.";
    }
}

function prevChapter() {
    if (currentChapterIndex > 0) {
        chapterSelect.value = currentChapterIndex - 1;
        loadChapter();
    }
}

function nextChapter() {
    if (currentChapterIndex < chapters.length - 1) {
        chapterSelect.value = currentChapterIndex + 1;
        loadChapter();
    }
}

function searchChapters() {
    const keyword = document.getElementById("searchBox").value.toLowerCase();
    chapterSelect.innerHTML = chapters
        .map((ch, i) => ({ name: ch, index: i }))
        .filter((ch) => ch.name.toLowerCase().includes(keyword))
        .map((ch) => `<option value="${ch.index}">${ch.name}</option>`)
        .join("");
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}

function toggleEyeProtection() {
    document.body.classList.toggle("eye-protection");
}

// Init
generateChapters();
populateChapterSelect();
