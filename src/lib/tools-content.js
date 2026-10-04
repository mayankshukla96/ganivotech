// Catalog + page copy for the browser-based file tools. Used by the hub, menu, footer, sitemap and tool pages.

export const TOOLS = [
  { href: "/tools/qr-generator", name: "QR Code Maker", blurb: "Free QR codes for links, WiFi, WhatsApp, UPI and more, with logo and styles." },
  { href: "/tools/bulk-qr-code-generator", name: "Bulk QR from Excel", blurb: "Make hundreds of QR codes from an Excel or CSV list, as a ZIP or printable A4 sheets." },
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

export const BULK = {
  path: "/tools/bulk-qr-code-generator",
  title: "Bulk QR Code Generator from Excel or CSV | GanivoTech",
  description: "Make hundreds of QR codes at once from an Excel or CSV list. Download a ZIP of PNG or SVG files or printable A4 sheets. Free, no signup, runs in your browser.",
  h1: "Bulk QR Code Generator from Excel",
  intro: "Upload an Excel or CSV list and get one QR code for every row, named and captioned from your columns. Download them as a ZIP of PNG or SVG files, or as printable A4 sheets.",
  steps: [
    "Add your Excel (.xlsx) or CSV file, or paste cells copied from a spreadsheet. Put column names in the first row.",
    "Choose what goes in each QR code by clicking columns, for example {Link}. Pick a caption column such as a name, which also names the files.",
    "Pick a style, check the preview, and download a ZIP of PNG or SVG files, or printable A4 sheets.",
  ],
  tips: [
    "Use the sample file as a starting point, and keep one item per row.",
    "Scan one preview code with your phone before you print hundreds.",
    "Use the sheet PDF for stickers and ID cards, and SVG files for professional printing at any size.",
    "Keep the QR content short. Very long text makes dense codes that are hard to scan.",
    "Phone numbers stored as numbers in Excel lose a leading zero. Format the column as Text first if you need it.",
  ],
  faqs: [
    ["How many QR codes can I make at once?", "Up to 1,000 rows for a ZIP and 500 for printable sheets in one go. For more, split your list into parts."],
    ["Is my spreadsheet uploaded?", "No. Your file is read and the QR codes are made inside your browser, so nothing is uploaded."],
    ["Can I use .xls files?", "Old .xls files are not supported. In Excel choose Save As and pick .xlsx or CSV."],
    ["How do I make each QR code different?", "Put a column name in curly brackets in the content box, for example https://school.com/id/{Roll No}. Each row fills in its own value."],
    ["Do the QR codes expire?", "No. They are static codes with the content written inside them, so they work as long as the link or information stays valid."],
    ["How do I name the files?", "Choose a caption column, such as a name or roll number. It names each file and is printed under the QR code if you keep Print the caption ticked. An _index.csv file in the ZIP lists every file and what it contains."],
  ],
};

export const BULK_TYPES = {
  upi: {
    title: "Bulk UPI QR Code Generator from Excel | GanivoTech",
    description: "Make a UPI payment QR code for every shop or person in an Excel list, with name and amount. ZIP or printable sheets, free and private.",
    h1: "Bulk UPI QR Code Generator",
    intro: "Have many shops, collection points or payees? List their UPI IDs in Excel and get a payment QR code for each, with the name printed under it.",
    steps: ["Download the sample file and fill in the shop name, UPI ID and, optionally, an amount.", "Upload it. The UPI template is already set up for those column names.", "Check the preview, then download a ZIP or printable sheets."],
    tips: ["Leave the amount empty for a code that lets the customer type any amount.", "Always test one code with a small payment before printing many.", "Ganivotech only makes the codes. Payments go directly through the payer's UPI app."],
    faqs: [
      ["What does the UPI template contain?", "A standard upi://pay link with the UPI ID, payee name, an optional amount and INR as the currency."],
      ["Can each code have its own amount?", "Yes. Put the amount in a column. Rows with an empty amount make an open-amount code."],
      ["Does it work with all UPI apps?", "The code follows the standard UPI link format that UPI apps read. Test your own code with your app before printing."],
    ],
  },
  whatsapp: {
    title: "Bulk WhatsApp QR Code Generator from Excel | GanivoTech",
    description: "Make a WhatsApp chat QR code for every number in an Excel list, with an optional ready message. ZIP or printable sheets, free and private.",
    h1: "Bulk WhatsApp QR Code Generator",
    intro: "List your team, branches or sales people with their WhatsApp numbers and get a click-to-chat QR code for each, with a ready message if you want one.",
    steps: ["Download the sample file and fill in names, phone numbers and an optional message.", "Upload it. The WhatsApp template uses the Phone and Message columns.", "Download a ZIP, or printable sheets for visiting cards and counters."],
    tips: ["Include the country code in each number, such as 91 for India.", "Numbers are cleaned automatically, so spaces and plus signs are fine.", "Scanning opens a chat with that number. Nothing is sent automatically."],
    faqs: [
      ["How should I write the phone numbers?", "With the country code, for example +91 98765 43210. Spaces, plus signs and dashes are removed for you."],
      ["Is this bulk messaging?", "No. It only creates QR codes that open a WhatsApp chat when someone scans them. It sends nothing."],
      ["Can each code have a different message?", "Yes. Put the message in the Message column. Leave it empty for a plain chat link."],
    ],
  },
  vcard: {
    title: "Bulk vCard QR Code Generator from Excel | GanivoTech",
    description: "Make a contact-card QR code for every person in an Excel list, to save name, phone, email and company in one scan. Free and private.",
    h1: "Bulk vCard QR Code Generator",
    intro: "Turn a staff or member list into a contact QR code for each person. Scanning a code offers to save that person's name, phone, email and company.",
    steps: ["Download the sample file and fill in name, phone, email and company.", "Upload it. The contact-card template is already set up.", "Download a ZIP, or printable sheets to put on badges and cards."],
    tips: ["Keep only the details people need. Each extra detail makes the QR code denser.", "Empty fields, such as a missing email, are left out automatically.", "To import many contacts at once instead, use the VCF Maker."],
    faqs: [
      ["What happens when someone scans it?", "Their phone offers to add the contact with the name, phone, email and company from your list."],
      ["Is this the same as the VCF Maker?", "No. This makes one QR code per person. The VCF Maker makes one file that imports many contacts at once."],
      ["What if some people have no email?", "Those rows simply leave the email out of the contact card."],
    ],
  },
  "id-cards": {
    title: "Bulk QR Codes for ID Cards and Students | GanivoTech",
    description: "Make a QR code with a caption for every student or employee in an Excel list, for ID cards, attendance and labels. ZIP or printable sheets.",
    h1: "Bulk QR Codes for ID Cards",
    intro: "Give every student, employee or item its own QR code. Use a roll number or ID as the content and the name as the caption, then print sheets or add the images to ID cards.",
    steps: ["Download the sample file and fill in roll numbers, names and classes.", "Upload it. The code holds the roll number and the caption shows the name.", "Download printable A4 sheets, or a ZIP of images for your card design software."],
    tips: ["To open a page when scanned, use a link such as https://school.com/student/{Roll No} as the content.", "Use the PDF sheets with dotted cutting lines for stickers and tags.", "Keep a copy of the _index.csv from the ZIP. It lists which file holds which ID."],
    faqs: [
      ["What should the QR code contain?", "Either the plain roll or ID number, or a link that includes it, such as https://yourschool.com/student/{Roll No}."],
      ["Can I print the name under each QR code?", "Yes. Choose the name column as the caption. It is printed under each code and used as the file name."],
      ["How do I put the codes on ID cards?", "Download the PNG or SVG ZIP and place each image in your card design, or print the A4 sheets as stickers."],
    ],
  },
};
