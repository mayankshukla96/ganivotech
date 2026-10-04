// Catalog + page copy for the browser-based file tools. Used by the hub, menu, footer, sitemap and tool pages.

export const TOOLS = [
  { href: "/tools/qr-generator", name: "QR Code Maker", blurb: "Free QR codes for links, WiFi, WhatsApp, UPI and more, with logo and styles." },
  { href: "/tools/photo-signature-resizer", name: "Photo & Signature Resizer", blurb: "Resize a photo or signature to the exact KB and size an online form asks for." },
  { href: "/tools/compress-to-exact-size", name: "Compress to Exact Size", blurb: "Make a picture or PDF smaller than, or exactly, 50 KB, 100 KB, 200 KB or any size." },
  { href: "/tools/ocr-to-excel-word", name: "OCR to Excel & Word", blurb: "Turn a photo, scan or PDF into an Excel sheet or Word file. English and Hindi." },
  { href: "/tools/vcf-maker", name: "VCF Maker", blurb: "Turn a spreadsheet of contacts into one file you can import on any phone." },
  { href: "/tools/pdf-maker", name: "PDF Maker", blurb: "Combine pictures and text files into one PDF." },
];

export const RESIZER = {
  photo: {
    path: "/tools/photo-signature-resizer",
    title: "Photo Resizer – Resize Photo to Exact KB and Size | GanivoTech",
    description: "Resize a photo to the exact KB and pixel or cm size an online form asks for. Free, no signup, runs in your browser so your photo is never uploaded.",
    h1: "Photo Resizer: Exact KB and Size",
    intro: "Online forms for exams, jobs and applications often ask for a photo in an exact size, such as 20 to 50 KB and a fixed width and height. Set the numbers from the form, and download a photo that meets them.",
    kind: "photo", kb: 50, w: 200, h: 230,
    steps: ["Choose your photo.", "Type the width, height and maximum file size shown on the form (use cm or mm if the form does, and set the DPI it asks for).", "Click Resize and download the JPG. Check the size shown before you upload it."],
    tips: [
      "Always copy the numbers from the form itself, because requirements differ between forms and change each year.",
      "Choose Crop to fill to avoid stretching faces. Choose Stretch only if the form insists on an exact shape.",
      "If the form rejects the file, try the Exactly this size option, which pads the file to the full size without changing the picture.",
      "Use a clear, well-lit photo. Very small limits (10 to 20 KB) always lose some detail.",
    ],
    faqs: [
      ["Is my photo uploaded anywhere?", "No. The photo is resized inside your browser and never leaves your device."],
      ["How do I get an exact size such as 50 KB?", "Choose Exactly this size. The tool compresses to fit under the limit, then adds invisible padding so the file is exactly that size. The picture itself is not changed by the padding."],
      ["Can I enter the size in cm or mm?", "Yes. Pick the unit and the DPI. The tool converts it to pixels, for example 3.5 x 4.5 cm at 200 DPI is 276 x 354 pixels."],
      ["Will this meet my form's requirement?", "It produces the size you enter, but forms differ and can change. Always check the numbers on the form's own instructions."],
      ["Why does my photo look blurry at a tiny size?", "A very small file size means heavy compression. Raise the limit if the form allows, or use a sharper original photo."],
    ],
  },
  signature: {
    path: "/tools/photo-signature-resizer/signature",
    title: "Signature Resizer – Resize Signature to Exact KB | GanivoTech",
    description: "Resize a signature image to the exact KB and size a form asks for, and clean the paper background. Free and private, it runs in your browser.",
    h1: "Signature Resizer: Exact KB and Size",
    intro: "Sign on white paper, take a photo, and this tool crops it to the exact size and file size the form wants. It can whiten the paper so the signature stands out.",
    kind: "signature", kb: 20, w: 140, h: 60,
    steps: ["Sign with a dark pen on plain white paper and photograph it in good light.", "Choose the photo, then enter the width, height and maximum size from the form.", "Keep Whiten the background ticked, click Resize and download the JPG."],
    tips: [
      "Use a dark pen and plain white paper, with even light and no shadows.",
      "Crop close to the signature, or use Crop to fill, so it is not tiny inside the frame.",
      "Signature limits are usually very small, so a thicker pen survives compression best.",
      "Copy the exact numbers from the form, because they differ between forms.",
    ],
    faqs: [
      ["Is my signature uploaded anywhere?", "No. It is processed in your browser and never leaves your device."],
      ["What does Whiten the background do?", "It turns the grey or yellow cast of the paper into clean white, so the signature looks sharp and compresses smaller."],
      ["Can I make it exactly 20 KB?", "Yes. Set 20 and choose Exactly this size. The file is padded invisibly to reach exactly that size."],
      ["Which format does it save?", "JPG, which is what most forms ask for."],
    ],
  },
};

export const OCR = {
  path: "/tools/ocr-to-excel-word",
  title: "OCR to Excel and Word – Hindi and English | GanivoTech",
  description: "Turn a photo, scan or PDF into an Excel sheet, Word file, CSV or text. Reads English and Hindi. Free, private, runs in your browser. No signup.",
  h1: "OCR to Excel and Word",
  intro: "Photograph a printed table, a form or a page of notes and get the text back as an Excel sheet or a Word file. It reads English and Hindi, and your files stay on your device.",
  steps: ["Add one or more pictures or PDFs.", "Choose the language, and whether the picture is a table (for Excel) or plain text (for Word).", "Click Read the text, check the result, then download Excel, Word, CSV or text."],
  tips: [
    "Use a flat, well-lit, straight-on photo. Tilted or shadowed photos read worse.",
    "Choose A table for lists, mark sheets and fee registers, so rows and columns are rebuilt.",
    "Choose Plain text for paragraphs. You can edit the text before downloading.",
    "Numbers and names should always be checked. OCR can confuse similar characters.",
  ],
  faqs: [
    ["Are my files uploaded?", "No. The text is read on your device. The first run downloads the language data (a few MB) and keeps it for next time."],
    ["Does it read Hindi?", "Yes. Choose Hindi, or English + Hindi for mixed documents. Accuracy depends on how clear the picture is."],
    ["How accurate is the table?", "It rebuilds rows and columns from where the words sit on the page. Clean, printed tables work well. Handwriting, merged cells and very dense layouts need checking and fixing in Excel."],
    ["Can I use a scanned PDF?", "Yes. Each page is read in turn, up to 15 pages at a time."],
    ["Will phone numbers keep their leading zero in Excel?", "Yes. Numbers that start with 0 are kept as text so Excel does not change them."],
  ],
};

export const EXACT = {
  path: "/tools/compress-to-exact-size",
  title: "Compress Image or PDF to Exact Size (KB/MB) | GanivoTech",
  description: "Make a picture or PDF smaller than, or exactly, 50 KB, 100 KB, 200 KB, 1 MB or any size you enter. Free, private, no signup. Runs in your browser.",
  h1: "Compress a File to an Exact Size",
  intro: "Upload forms often reject a file by a few KB. Enter the size you need and the tool shrinks your picture or PDF to fit, or pads it to exactly that size.",
  steps: ["Choose a JPG, PNG, WebP or PDF.", "Pick the target size, and Under this size or Exactly this size.", "Click Make it this size and download the result."],
  tips: [
    "For a Word or Excel file, save it as a PDF first, then compress the PDF.",
    "PDF pages are saved as pictures to reach small sizes, so text can no longer be selected.",
    "Pictures are shrunk by lowering quality first, and by reducing dimensions only if needed.",
    "If a file is already under the limit, it is returned unchanged unless you choose Exactly.",
  ],
  faqs: [
    ["Is my file uploaded?", "No. Everything runs in your browser, so your file never leaves your device."],
    ["Can it compress a PDF to 100 KB?", "Usually yes, for scans and photo PDFs. Pages become pictures, so the text can no longer be selected or searched. Very long PDFs (over 20 pages) are not supported yet."],
    ["What does Exactly this size mean?", "The tool compresses to fit, then adds invisible padding so the file is exactly the size you entered. The content is unchanged."],
    ["Is 1 KB 1000 or 1024 bytes?", "1024 bytes, the same as most computers and upload forms use."],
    ["Can it compress Word, Excel or ZIP files?", "Not directly. Save Word and Excel files as PDF first. ZIP files cannot be shrunk this way."],
  ],
};

// programmatic size pages: /tools/compress-to-exact-size/<slug>
export const SIZES = {
  "20kb": { kb: 20, label: "20 KB", about: "A 20 KB limit is very tight. It is common for signatures and small ID pictures, and works best for simple images." },
  "50kb": { kb: 50, label: "50 KB", about: "Many forms ask for a photo or document under 50 KB. A clear photo usually survives this well if the dimensions are small." },
  "100kb": { kb: 100, label: "100 KB", about: "100 KB is a common limit for photos, ID proofs and certificates on application portals." },
  "200kb": { kb: 200, label: "200 KB", about: "200 KB leaves room for a readable scan of a certificate or ID card, and for a decent photo." },
  "500kb": { kb: 500, label: "500 KB", about: "500 KB suits detailed documents and multi-page PDFs that need to stay readable." },
};
