export const PDF_FAQS = [
  ["What file types can I convert to PDF?", "You can convert images (JPG, PNG, GIF, BMP, WebP, SVG) and text files (TXT, HTML) into a PDF. Each file becomes a page in the final document."],
  ["Is this PDF maker free?", "Yes. Everything runs in your browser for free. There is no signup, no watermark and no file size limit."],
  ["Are my files uploaded to a server?", "No. All processing happens in your browser. Your files never leave your device, and nothing is stored on our servers."],
  ["Can I reorder pages?", "Yes. After uploading, use the arrow buttons to move files up or down. The order you set is the page order in the PDF."],
  ["What page sizes are available?", "A4, US Letter and Legal. You can also choose portrait or landscape orientation and adjust margins from none to large."],
];

export const PDF_GUIDES = {
  "how-to-convert-images-to-pdf": {
    title: "How to Convert Images to PDF (Free, No Upload)",
    description: "Step-by-step guide to combining JPG, PNG and other images into a single PDF using a free browser-based tool, with tips on page size, order and quality.",
    h1: "How to Convert Images to PDF",
    date: "2026-10-04",
    sections: [
      { h: "Why convert images to PDF?", p: ["A PDF keeps multiple images in a fixed layout that looks the same on every device and printer. Sending five separate JPG files risks them arriving out of order, being resized by a messaging app or losing quality when forwarded. One PDF bundles them in the sequence you chose, with the page size and orientation you picked.", "Common reasons to convert images to PDF include submitting scanned documents, compiling receipts or invoices, preparing a photo portfolio for print, and combining screenshots into a single report."] },
      { h: "Steps to convert images to PDF", p: ["Open the PDF maker and click the upload area. Select the images you want to include — JPG, PNG, GIF, BMP, WebP and SVG are all supported. You can select multiple files at once.", "After uploading, use the arrow buttons to reorder pages. The order in the list is the order in the final PDF. Remove any file you added by mistake.", "Choose a page size (A4, Letter or Legal), orientation (portrait or landscape) and margin setting. For photos that should fill the page, set margins to none. For documents that will be printed and stapled, normal or large margins leave room for binding.", "Click Generate. Your browser opens a print preview with all the images laid out. Choose 'Save as PDF' in the print dialog to save the file. On Chrome this option is in the destination dropdown; on Safari it is in the bottom-left PDF menu."] },
      { h: "Getting the best results", p: ["Use the highest resolution images you have. The tool does not compress your files — what you upload is what goes into the PDF. A 300 DPI image printed at A4 size needs to be at least 2480 by 3508 pixels for sharp output.", "If your images are a mix of portrait and landscape, choose the orientation that suits the majority, or split them into two PDFs. A landscape photo on a portrait page will be shrunk to fit the width, leaving blank space above and below.", "SVG files are ideal for logos, diagrams and illustrations because they scale to any page size without losing sharpness. Use PNG or JPG for photographs."] },
      { h: "Privacy and file size", p: ["The conversion runs entirely in your browser. Your images are never uploaded to a server, which means there is no file size limit imposed by us and no risk of your files being stored or seen by anyone else. Close the tab and everything is gone.", "The final PDF size depends on the images inside it. A ten-page PDF of phone photos will typically be 10 to 30 MB. If you need a smaller file, resize your images before uploading or use your operating system's built-in PDF compression after saving."] },
    ],
  },
};
