const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Cấu hình số chương
const START_CHAP = 1;
const END_CHAP = 1976; // Thay đổi theo nhu cầu
const BATCH_SIZE = 10; // Số chương mỗi lần lấy 
const DIRRECTORY = path.join(__dirname,'XianNi'); // Thư mục lưu trữ

function cleanText(rawHtml) {
    return rawHtml
        // .replace(/<br\s*\/?>/gi, '\n')     // Chuyển <br> thành \n
        // .replace(/&nbsp;/gi, ' ')          // Xoá &nbsp;
        // .replace(/<[^>]*>/g, '')           // Loại bỏ tất cả thẻ HTML còn lại
        // .replace(/\s{2,}/g, ' ')           // Nén nhiều khoảng trắng
        // .trim();
}

async function fetchChapterContent(page, chapNumber) {
    const url = `https://truyenfull.vision/tien-nghich/chuong-${chapNumber}/`;

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Lấy tiêu đề chương
        const title = await page.$eval('.chapter-title', el => el.textContent.trim());

        // Lấy nội dung thẻ #chapter-c
        const rawHtml = await page.$eval('#chapter-c', el => el.innerHTML);
        const content = cleanText(rawHtml);

        return { title, content };
    } catch (err) {
        console.error(`❌ Lỗi khi lấy chương ${chapNumber}:`, err.message);
        return { title: `Chương ${chapNumber}`, content: '' };
    }
}

async function crawlChapters() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (let i = START_CHAP; i <= END_CHAP; i += BATCH_SIZE) {
        let combinedContent = '';

        const batchStart = i;
        const batchEnd = Math.min(i + BATCH_SIZE - 1, END_CHAP);
        console.log(`📥 Đang lấy chương ${batchStart} đến ${batchEnd}...`);

        for (let j = batchStart; j <= batchEnd; j++) {
            const { title, content } = await fetchChapterContent(page, j);
            combinedContent += `\n--- ${title} ---\n\n${content}\n\n`;
        }

        const filename = `chap_${formatToNDigits(batchStart,4)}_${formatToNDigits(batchEnd,4)}.txt`;
        if (!fs.existsSync(DIRRECTORY)) {
            fs.mkdirSync(DIRRECTORY);
        }
        fs.writeFileSync(path.join(DIRRECTORY, filename), combinedContent, 'utf8'); 
        console.log(`✅ Đã lưu file: ${filename}`);
    }

    await browser.close();
}

function formatToNDigits(num, n) {
    return num.toString().padStart(n, '0');
}

crawlChapters();
