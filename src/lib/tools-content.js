// Catalog + page copy for the browser-based file tools. Used by the hub, menu, footer, sitemap and tool pages.

export const TOOLS = [
  { href: "/tools/qr-generator", name: "QR Code Maker", blurb: "Free QR codes for links, WiFi, WhatsApp, UPI and more, with logo and styles." },
  { href: "/tools/bulk-qr-code-generator", name: "Bulk QR from Excel", blurb: "Make hundreds of QR codes from an Excel or CSV list, as a ZIP or printable A4 sheets." },
  { href: "/tools/short-link-maker", name: "Short Link Maker", blurb: "Shorten a link with your own custom name, get a QR code and see how many people clicked." },
  { href: "/tools/pdf-tools", name: "PDF Toolkit", blurb: "Merge, split, unlock, protect, watermark and number PDFs, or turn them into pictures. Nothing is uploaded." },
  { href: "/tools/passport-photo-maker", name: "Passport Photo Maker", blurb: "Crop passport and ID photos, whiten the background and print many copies on one sheet." },
  { href: "/tools/image-converter", name: "Image Format Converter", blurb: "Convert pictures between JPG, PNG and WebP in bulk, with quality and size control." },
  { href: "/tools/visiting-card-maker", name: "Visiting Card Maker", blurb: "Design a print-ready visiting card with your logo and a QR code that saves your contact or opens a smart card." },
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

export const SHORT = {
  path: "/tools/short-link-maker",
  title: "Free Short Link Maker – Custom Short URL & QR | GanivoTech",
  description: "Make a short link with your own custom name, like ganivotech.com/go/diwali-offer. Free, no signup. Get a QR code, WhatsApp chat links and click stats.",
  h1: "Short Link Maker: Short Links With Your Own Name",
  intro: "Turn a long web address into a short one that is easy to say, type and remember. Choose your own name for it, such as diwali-offer, or let the tool suggest names in the style you like.",
  note: "Free • No signup • Click stats included",
  steps: [
    "Paste your long link, or switch to WhatsApp chat to make a link that opens a chat with your message already typed.",
    "Pick a name style (from your title, brand plus a word, two words, easy to say, with the month, or a short code) and tap an idea, or type your own name. A tick shows the name is free.",
    "Choose when the link should expire, then press Make short link.",
    "Copy the link, share it on WhatsApp, or download its QR code. Open My links any time to see clicks.",
  ],
  tips: [
    "Use a name that says what the link is for, such as sharma-menu. People trust links they can read.",
    "Add campaign tags if you use Google Analytics, so you can see which post or message brought each visitor.",
    "Put the QR code on posters, menus and visiting cards. The code holds the short link, so you can switch the destination off later.",
    "Save your manage key. It is the only way to see stats or delete the link from another phone or computer.",
    "Pick an expiry for offers and events so an old link does not keep sending people to a finished page.",
  ],
  faqs: [
    ["Is the Short Link Maker free?", "Yes. Making links, custom names, QR codes and click stats are free, with no signup."],
    ["Can I choose my own link name?", "Yes. Type any name of 3 to 32 English letters, numbers and hyphens, for example ganivotech.com/go/my-shop. If the name is taken, the tool shows ideas that are free."],
    ["How long does a short link last?", "It lasts until you set it to expire, you delete it, or it is removed for abuse. If you choose Never, there is no end date."],
    ["Do I need an account?", "No. When you make a link you get a manage key that proves it is yours. It is saved in your browser and you can copy it to use elsewhere. We cannot recover a lost key."],
    ["What do the click stats show?", "The number of clicks, clicks per day for two weeks, and where people came from, their device type and country. Visits by search bots are not counted. We do not store IP addresses."],
    ["Why are some names not allowed?", "Names that look like banks, payment apps, OTP or prize messages are blocked, together with offensive words, to stop scams and keep the service safe for everyone."],
    ["Can anyone check where a short link goes?", "Yes. Add /preview to the end of any short link, for example ganivotech.com/go/my-shop/preview, to see the real destination before opening it, and to report it if it looks unsafe."],
    ["Can I shorten a link that is already shortened?", "No. Paste the full original link, so people can be shown where it really goes."],
    ["Can I change where a link goes later?", "Not yet. You can switch a link off or delete it and make a new one with another name."],
  ],
};

export const PASSPORT = {
  path: "/tools/passport-photo-maker",
  title: "Passport Size Photo Maker – White Background, Print Sheet",
  description: "Make a passport or ID photo at home: crop to 35x45 mm or 51x51 mm, whiten the background, set the KB limit and print many copies on 4x6 or A4. Free, private.",
  h1: "Passport Size Photo Maker: Crop, White Background, Print Sheet",
  intro: "Turn a selfie into a passport, visa or ID photo. Crop to the right size, clean the background to white, keep the file under the size limit, and print several copies on one sheet.",
  steps: [
    "Choose a clear photo taken in good light against a plain, light wall.",
    "Pick the photo size, or type your own in millimetres, then drag and zoom so your face sits inside the dotted oval.",
    "Keep Make the background white ticked and adjust the strength until the background is clean.",
    "Download the single photo as a JPG (set the largest file size the form allows), or make a 4x6 or A4 sheet to print.",
  ],
  tips: [
    "Face the camera straight on with your eyes open, no shadows on the face or wall, and no glasses glare.",
    "Photos for official forms must follow that form's rules. Check the size, background and file size on the form itself before you submit.",
    "When printing the sheet, choose actual size or 100%, not fit to page, so each photo prints at the real size.",
    "The white background step is a colour clean-up, not artificial intelligence. A plain wall gives the best result.",
    "Use 300 DPI for printing. 200 DPI is enough for most online uploads.",
  ],
  faqs: [
    ["Is my photo uploaded anywhere?", "No. The photo is edited inside your browser and never leaves your device."],
    ["What size is an Indian passport photo?", "The Indian passport photo is 51 x 51 mm (2 x 2 inch) with a plain white or off-white background. For online upload the file is usually between 20 and 100 KB. Always confirm on the official instructions, because rules can change."],
    ["Does it remove the background automatically?", "It turns a plain background white by finding the colour at the edges of the picture and painting over it. This works best on an even light wall. It is not an artificial intelligence cut-out, so busy backgrounds may leave marks."],
    ["How do I print passport photos at home?", "Download the sheet as JPG or PDF, print it at actual size on 4x6 photo paper or A4, and cut along the thin lines."],
    ["Can I set the file size, for example under 50 KB?", "Yes. Type the largest size in KB before you download. The photo is compressed until it fits."],
    ["Will this photo be accepted for my application?", "We cannot promise that. It makes the size and background you choose, but each office decides. Follow the official guidelines for your application."],
  ],
};

export const CONVERT = {
  path: "/tools/image-converter",
  title: "Image Converter – JPG, PNG, WebP Free, No Upload | GanivoTech",
  description: "Convert pictures between JPG, PNG and WebP, in bulk, with adjustable quality and size. Free, no signup, and your images stay in your browser.",
  h1: "Image Format Converter: JPG, PNG and WebP",
  intro: "Change the format of one picture or a hundred at once. Choose JPG, PNG or WebP, set the quality and the largest width, and download each file or a single ZIP.",
  steps: [
    "Choose your pictures. You can add many at once.",
    "Pick the format you want: JPG, PNG or WebP.",
    "For JPG and WebP, set the quality. For smaller files, also choose a smaller width.",
    "Click Convert, then save each picture or download them all as a ZIP.",
  ],
  tips: [
    "Use JPG for photos, PNG for logos, screenshots and anything see-through, and WebP when a website accepts it and you want small files.",
    "Converting to JPG turns see-through areas white, because JPG cannot be see-through.",
    "Converting a picture again and again loses quality each time. Keep your original.",
    "If a form wants a picture under a size limit, use Compress to Exact Size after converting.",
  ],
  faqs: [
    ["Are my pictures uploaded anywhere?", "No. The pictures are converted inside your browser and never leave your device."],
    ["Which formats can I convert from?", "JPG, PNG, WebP, GIF, BMP and AVIF, as long as your browser can open them. iPhone HEIC photos are not supported by most browsers. Change the camera setting to Most Compatible, or share the photo as JPG."],
    ["Does converting reduce quality?", "PNG keeps every detail. JPG and WebP are compressed, so a lower quality number makes a smaller file with less detail. 90 is a good balance."],
    ["Can I convert many pictures at once?", "Yes, up to 100 at a time. Download them one by one or all together in a ZIP."],
    ["Why did my transparent picture get a white background?", "JPG cannot store see-through areas, so they are filled with white. Choose PNG or WebP to keep transparency."],
    ["Is it free?", "Yes. No signup, no watermark and no limit on how often you use it."],
  ],
};

export const VCARD_MAKER = {
  path: "/tools/visiting-card-maker",
  title: "Visiting Card Maker with QR Code – Free, Print Ready | GanivoTech",
  description: "Design a visiting card with your logo and a QR code that saves your contact, or a smart card that opens your digital card. Free, 300 DPI, A4 print sheet.",
  h1: "Visiting Card Maker with Logo and QR Code",
  intro: "Type your details, add your logo, pick a style, and download a print-ready card. The QR code saves you as a contact in one scan, or opens a smart digital card with Call, WhatsApp and Save buttons.",
  note: "Free \u2022 No signup \u2022 Print-ready 300 DPI",
  steps: [
    "Fill in your name, title, company, phone, email, website and address. Add your logo if you have one.",
    "Choose a style and colour. The front and back update as you type.",
    "Decide what the QR code does: save your contact offline, or open a smart card page that we host and that counts scans.",
    "Download the front and back as PNG or PDF, or an A4 sheet with 10 cards for your local printer.",
  ],
  tips: [
    "Write the phone number with the country code, for example 919876543210, so the saved contact works everywhere.",
    "Use a square logo with a plain background. It is placed on a white tile on dark styles.",
    "Ask your printer for 89 x 51 mm cards on 300 GSM paper. The files are exactly that size at 300 DPI.",
    "The A4 sheet has the back mirrored, so print both sides and flip on the long edge.",
    "Pick the smart card if your details may change: the QR code stays the same while the page is yours to switch off and remake.",
  ],
  faqs: [
    ["Are my details uploaded?", "Not for a normal card. The card and its QR code are drawn in your browser. If you choose the smart card, the details on it are saved on our server so the page can open when someone scans it."],
    ["What does the QR code contain?", "By default a vCard: your name, title, company, phone, email, website and address. Any phone camera offers to save it as a contact, with no internet needed. With the smart card, the QR code holds the address of your digital card instead."],
    ["What is a smart visiting card?", "A card whose QR code opens a small web page with your logo, name and one-tap buttons: Save contact, Call, WhatsApp, Email, Website and Directions. You can see how many people scanned it in the Short Link Maker under My links."],
    ["Can I change the smart card later?", "Not yet. You can switch it off or delete it with the manage key and make a new one. Keep the same QR code only if the address is unchanged."],
    ["What size is the card?", "89 x 51 mm (3.5 x 2 inch), the standard visiting card size in India, at 300 DPI. Printers may ask for a 3 mm bleed; tell us if yours does."],
    ["Is it free?", "Yes. No signup, no watermark, and you can make as many cards as you like."],
  ],
};
