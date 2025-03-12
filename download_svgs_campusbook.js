// Set to avoid duplicates
const downloadedSvgUrls = new Set();

// Base URL or the book
const baseUrl = 'https://e-alice-campusbook.s3.ap-northeast-2.amazonaws.com/resources/contents/prod/cms/book/20230926/CT-20230926150955098/source/R1/20230926155016/ebook/OEBPS/pp_content/content_';

// Generate all 474 (this book has 474 pages) SVG URLs
const svgUrls = Array.from({ length: 474 }, (_, i) => {
    const pageNum = String(i + 1).padStart(4, '0');
    return `${baseUrl}${pageNum}.svg`;
});

// Function to download SVG
function downloadSvg({ url, content }) {
    const filename = url ? url.split('/').pop().split('?')[0] : 'content_manual.svg';
    if (downloadedSvgUrls.has(filename)) {
        console.log(`Skipping duplicate: ${filename}`);
        return;
    }

    if (content) {
        // Manual content from "Response" tab
        const blob = new Blob([content], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        downloadedSvgUrls.add(filename);
        console.log(`Saved from content: ${filename} (${downloadedSvgUrls.size}/474)`);
    } else if (url) {
        // Attempt fetch
        console.log(`Fetching: ${filename}`);
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then(svgContent => {
                const blob = new Blob([svgContent], { type: 'image/svg+xml' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                downloadedSvgUrls.add(filename);
                console.log(`Saved: ${filename} (${downloadedSvgUrls.size}/474)`);
            })
            .catch(err => {
                console.error(`Failed ${filename}: ${err}`);
                console.log(`Try signed URL or paste content for ${filename}`);
            });
    }
}

// Function to process batch
function downloadSvgBatch(urls) {
    urls.forEach(url => downloadSvg({ url }));
}

// Run the batch
console.log('Starting download of SVGs...');
downloadSvgBatch(svgUrls);

console.log('Script running. Check Downloads folder.');
console.log('If URLs fail, use signed URLs from Network tab or paste content manually.');