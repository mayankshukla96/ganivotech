// Catalog of Ganivotech Chrome extensions. Add an entry here and it appears in the menu, hub, footer and sitemap.
// Set `storeUrl` once an extension is published on the Chrome Web Store; the page then shows "Add to Chrome".

export const INSTALL_STEPS = [
  ["Download", "Download the zip file and extract (unzip) it to a folder you will keep, for example Documents\\Chrome Extensions. Chrome loads the extension from that folder, so do not delete it afterwards."],
  ["Open extensions", "In Chrome, go to chrome://extensions and turn on Developer mode (top-right switch)."],
  ["Load it", "Click Load unpacked and choose the folder that contains manifest.json."],
  ["Pin it", "Click the puzzle-piece icon in the toolbar and pin the extension so it is one click away."],
];

export const INSTALL_NOTE =
  "Microsoft Edge and Brave work the same way (edge://extensions, brave://extensions). To update, replace the files in the folder and click the reload icon on the extension's card.";

export const EXTENSIONS = {
  "qr-studio": {
    name: "Ganivotech QR Studio",
    short: "QR Studio",
    tagline: "Make a QR code of any page and scan QR codes on any web page.",
    badge: "QR codes",
    title: "Free QR Code Chrome Extension – Page QR & QR Scanner | GanivoTech",
    description:
      "Ganivotech QR Studio: a free Chrome extension that makes a styled QR code of any page and scans QR codes on any web page, with link safety warnings. Private and offline.",
    version: "1.0.0",
    zip: "/downloads/ganivotech-qr-studio-1.0.0.zip",
    sizeKB: 150,
    storeUrl: "",
    works: "Chrome, Edge, Brave and other Chromium browsers",
    features: [
      ["QR code of any page", "Open the extension and the page you are on is already a QR code. Pick a style, add a logo, then download PNG or SVG, or copy the image. Send a page to your phone in a second."],
      ["Scan QR codes on any web page", "Chrome cannot read QR codes shown on a page. Click Scan and the extension finds every code in the visible tab, or in an image you drop in or paste."],
      ["Link safety warnings", "Before you open a scanned link it warns about shortened links, raw IP addresses, look-alike characters, hidden usernames and unencrypted http. Nothing opens by itself."],
      ["Understands what a code is", "WiFi codes show the password to copy, contact codes can be saved as .vcf, event codes as .ics, and UPI codes show the payee so you can check before paying."],
      ["Private and offline", "Codes are made and scanned on your device. Nothing you scan is uploaded, and the extension does not collect browsing history."],
      ["Handy extras", "A password generator, JSON formatter and colour picker with a screen eyedropper, plus a Suggest tab to tell us what to build next."],
    ],
    howToUse: [
      "Click the extension icon on any web page. The QR tab shows a QR code of that page.",
      "Choose Brand, Classic or Ocean, and tick Logo to put the Ganivotech logo in the centre.",
      "Download PNG or SVG, or click Copy to paste the image elsewhere.",
      "To read a code, open the Scan tab and click Scan QR codes on this page. You can also drop, choose or paste (Ctrl+V) an image.",
    ],
    permissions: [
      ["activeTab", "Reads the address and title of the page you opened the extension on (to make its QR code), and takes a picture of that tab only when you click Scan."],
      ["storage", "Remembers your last few suggestions on your device."],
      ["https://ganivotech.com/*", "Lets the Suggest tab send an idea you submit to Ganivotech. Nothing else is sent."],
    ],
    privacy: [
      "QR codes are created and scanned inside your browser. Nothing you scan is uploaded.",
      "The extension does not collect browsing history, and has no analytics or tracking.",
      "The only data it sends is what you type into the Suggest tab (your idea and an optional name).",
    ],
    limitations: [
      "Chrome does not let extensions capture its own pages (chrome://), the Web Store or some PDF views. On those pages, drop or paste a screenshot of the code instead.",
      "The scanner may miss very stylised codes, such as dot-pattern codes made by other tools.",
      "A QR code can only be as safe as where it points. Warnings help, but always check the address before you sign in or pay.",
    ],
    troubleshooting: [
      ["Chrome does not allow scanning this page", "Open a normal website, or drop or paste an image of the code."],
      ["No QR code found", "Make sure the whole code is visible and not too small, then scan again."],
      ["Suggestion could not be sent", "Check your internet connection and try again."],
    ],
    faqs: [
      ["Is the extension free?", "Yes. It is free, with no account, no ads and no watermark on your QR codes."],
      ["Does it send the pages I visit or the codes I scan to you?", "No. Codes are created and scanned in your browser, and nothing is uploaded. The only data sent is what you type into the Suggest tab."],
      ["Which browsers does it work in?", "Google Chrome, and other Chromium browsers such as Microsoft Edge and Brave."],
    ],
  },

  "whatsapp-group-number-extractor": {
    name: "WhatsApp Group Number Extractor",
    short: "WhatsApp Group Extractor",
    tagline: "Export the phone numbers shown in a WhatsApp Web group to a CSV file.",
    badge: "WhatsApp Web",
    title: "WhatsApp Group Number Extractor – Free Chrome Tool | GanivoTech",
    description:
      "Free Chrome extension that lists the phone numbers WhatsApp Web shows for the group you have open and exports a CSV. Runs locally; nothing is uploaded.",
    version: "1.0.0",
    zip: "/downloads/whatsapp-group-number-extractor.zip",
    sizeKB: 39,
    storeUrl: "",
    works: "Chrome, Edge and Brave on a computer, with WhatsApp Web",
    notice:
      "Ganivotech is not affiliated with, endorsed by or sponsored by WhatsApp or Meta. WhatsApp is a trademark of Meta Platforms, Inc.",
    features: [
      ["Reads the open group", "Lists the phone numbers that WhatsApp Web shows for the participants of the group you have open, and removes duplicates."],
      ["Handles big groups", "If the group has more members than the panel shows, it clicks View all and scrolls the full list. You can stop at any time and keep what was found."],
      ["CSV export that opens correctly", "Exports Name and Phone Number as a UTF-8 CSV, so Hindi and other scripts display correctly in Excel. The file is named after the group and the date."],
      ["Search and sort", "Search by name or number and sort by name or phone before exporting."],
      ["Honest about what it cannot see", "If WhatsApp Web shows only a saved contact's name, the number is reported as not exposed. The extension never guesses numbers or makes up names."],
      ["Local and minimal", "Everything runs in your browser tab. It makes no network requests of its own, and asks only for access to web.whatsapp.com."],
    ],
    howToUse: [
      "Open web.whatsapp.com and log in, then open the group.",
      "Optional: open Group info. If you skip this, the extension clicks the chat header to open it.",
      "Click the extension icon, then Scan Group. Keep the WhatsApp tab in front while it runs.",
      "Watch the progress. Click Stop at any time; the numbers found so far are kept.",
      "Search or sort the results, then click Export CSV.",
    ],
    permissions: [
      ["https://web.whatsapp.com/*", "Lets the extension run on WhatsApp Web, and nowhere else."],
      ["scripting", "Starts the extension in a WhatsApp tab that was already open before you installed it, so you do not have to refresh."],
    ],
    privacy: [
      "Data is processed only in your browser tab. The extension makes no requests to any server and has no analytics or tracking.",
      "It reads only what WhatsApp Web has already drawn on screen. It does not use WhatsApp's private interfaces, cookies, tokens, encryption keys or message contents.",
      "Exported CSV files contain personal data. Under India's Digital Personal Data Protection Act, 2023, use them only for the purpose members expect (for example school to parent communication), store them securely, and delete them when no longer needed.",
      "WhatsApp's terms restrict automated or bulk collection of user data. Use this tool only for occasional administrative exports of groups you manage, never for bulk harvesting or unsolicited messaging.",
    ],
    limitations: [
      "Only numbers that WhatsApp Web displays can be extracted. A saved contact is shown by name only, so those numbers are counted as not exposed.",
      "WhatsApp Web changes its design often. A large redesign can stop detection until the extension is updated.",
      "Text-based fallbacks assume the English interface. If a scan fails, switch WhatsApp to English.",
      "Your own number is not included, and results live in the WhatsApp tab, so export before refreshing or closing it.",
      "A scan covers about 1,000 members by default. In a background tab Chrome slows timers, so keep the WhatsApp tab in front.",
      "In Excel, a double-clicked CSV may show long numbers as 9.19877E+11. Use Data, then From Text/CSV, and set the Phone Number column to Text. Google Sheets opens the file as is.",
    ],
    troubleshooting: [
      ["Please open WhatsApp Web first.", "Switch to the web.whatsapp.com tab, then open the extension."],
      ["WhatsApp Web is still loading", "Wait for the chat list, or log in with the QR code."],
      ["Please open a WhatsApp group first.", "Open a group, not a one-to-one chat."],
      ["Unable to locate the participant list", "Open Group info yourself and scroll to the members section, then scan again."],
      ["WhatsApp Web's interface may have changed", "Refresh WhatsApp Web. If it keeps happening, the extension needs an update."],
      ["Could not connect to WhatsApp Web", "Refresh the WhatsApp tab. This is needed after installing or reloading the extension."],
    ],
    faqs: [
      ["Does it upload the numbers anywhere?", "No. It runs only in your browser tab, makes no network requests of its own and has no analytics. The CSV is saved on your computer."],
      ["Why are some members missing a number?", "WhatsApp Web shows a saved contact by name only, so their number is not on screen. The extension lists them as not exposed and never guesses."],
      ["Does it work on a phone?", "No. It is a desktop browser extension and works with WhatsApp Web on Chrome, Edge or Brave."],
      ["Is it allowed to use?", "It reads only what WhatsApp Web already shows you, but WhatsApp's terms restrict bulk collection of user data. Use it only for occasional exports of groups you manage, and follow data protection law."],
    ],
  },

  "page-summarizer": {
    name: "Ganivotech Page Summarizer",
    short: "Page Summarizer",
    tagline: "Summarize any web page or selected text with Chrome's built-in on-device AI. No account, no API key.",
    badge: "On-device AI",
    title: "Free AI Page Summarizer for Chrome – Private | GanivoTech",
    description:
      "Summarize any web page or selected text in one click using Chrome's built-in AI. It runs on your computer, so nothing is uploaded. Free, no account and no API key.",
    version: "1.0.0",
    zip: "/downloads/ganivotech-page-summarizer-1.0.0.zip",
    sizeKB: 26,
    storeUrl: "",
    works: "Desktop Google Chrome 138 or newer (Windows, macOS, Linux) with enough free disk space for Chrome's AI model",
    features: [
      ["One click summaries", "Open it on an article and get a TL;DR, key points, a headline or a teaser, in short, medium or long form. The summary streams in as it is written."],
      ["Summarize just a selection", "Select a few paragraphs first and the extension offers to summarize only that text."],
      ["Handles long pages", "Very long pages are read in parts and combined, so you still get one summary. You can stop at any time."],
      ["Private by design", "The summary is written by the AI model inside Chrome on your own computer. The page text is never sent to Ganivotech or any server."],
      ["Share in one tap", "Copy the summary, or share it on WhatsApp with the page title and link, formatted for chat."],
      ["Shows the time you save", "See how long the page would take to read and how short the summary is."],
    ],
    howToUse: [
      "Open an article or any page with plenty of text, then click the extension icon.",
      "Choose Whole page or Selected text, a style (TL;DR, Key points, Headline or Teaser) and a length.",
      "Click Summarize. The first time, Chrome downloads its AI model, which can take several minutes. After that, summaries start right away.",
      "Copy the summary or share it on WhatsApp.",
    ],
    permissions: [
      ["activeTab", "Lets the extension read the page you opened it on, only when you click the icon."],
      ["scripting", "Reads the visible text of that page (and your selection) so it can be summarized."],
    ],
    privacy: [
      "Summaries are created by Chrome's built-in AI on your computer. The page text is not uploaded anywhere.",
      "The extension makes no network requests of its own, has no analytics and asks for no access to the sites you visit except the page you open it on.",
      "Links you click, such as Share on WhatsApp, open normally in a new tab.",
    ],
    limitations: [
      "It needs desktop Chrome 138 or newer, about 22 GB of free disk space for Chrome's AI model, and either a graphics card with more than 4 GB of memory or 16 GB of RAM with 4 or more CPU cores. It does not work on phones or tablets.",
      "On the computer where we tested, only English pages could be summarized. Pages in Hindi and other languages show a clear message instead of a summary. Chrome may add more languages over time.",
      "The first summary needs a one-time download of Chrome's AI model. Chrome decides the size, and an unmetered connection is recommended.",
      "Very long pages are summarized from their first part. For a long document, select the section you care about.",
      "AI summaries can miss detail or make mistakes. Check important facts in the original.",
      "Scanned pages and images have no text to read, and Chrome does not let extensions read its own pages (chrome://), the Web Store or some PDF views.",
    ],
    troubleshooting: [
      ["This browser does not have Chrome's built-in Summarizer", "Update Chrome to version 138 or newer, on a desktop computer."],
      ["Chrome's on-device AI is not available on this computer", "Your computer may not meet the disk, graphics or memory requirements listed above."],
      ["This page looks like it is in another language", "Summaries currently work for English pages. Try an English page or an English selection."],
      ["There is not enough text here to summarize", "Open an article, or select a few paragraphs first."],
      ["Chrome needs you to click the button to start the model download", "Click Summarize again. Chrome only starts the download after a click."],
    ],
    faqs: [
      ["Does it send the page I am reading to you or to any AI company?", "No. The summary is made by the AI model built into Chrome, on your computer. The extension makes no network requests of its own."],
      ["Do I need an API key or account?", "No. There is nothing to sign up for and no cost. Chrome provides the AI model."],
      ["Why does the first summary take so long?", "Chrome has to download its on-device AI model once. After that, summaries start right away."],
      ["Does it work in Hindi?", "Not yet. On the computer where we tested, Chrome's on-device AI summarized English pages only. The extension tells you clearly when a page is in a language it cannot summarize."],
      ["Which browsers does it work in?", "Desktop Google Chrome 138 or newer. Other browsers do not include this built-in AI."],
    ],
  },
};

export const EXTENSION_LIST = Object.entries(EXTENSIONS).map(([slug, e]) => ({ slug, ...e }));
