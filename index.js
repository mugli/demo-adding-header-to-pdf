const { StandardFonts, PDFDocument, rgb } = require("pdf-lib");
const { promises: fs } = require("fs");
const path = require("path");

// Not working set
const INPUT_FILE = path.resolve(__dirname, "input-problematic.pdf");
const OUTPUT_FILE = path.resolve(__dirname, "output-problematic.pdf");

// Working set
const INPUT_WORKING_FILE = path.resolve(__dirname, "input-working.pdf");
const OUTPUT_WORKING_FILE = path.resolve(__dirname, "output-working.pdf");

function drawLine(page, height, width) {
  page.drawLine({
    start: {
      x: 0,
      y: height,
    },
    end: {
      x: width,
      y: height,
    },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
}

function drawText(doc, width, height, headerHeight, page) {
  let text = "This is a draft";
  const fontSize = 8;
  const font = doc.embedStandardFont(StandardFonts.Helvetica);

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  const startX = (width - textWidth) / 2;
  const startY =
    height + headerHeight - (headerHeight - textHeight) / 2 - textHeight;

  page.moveTo(startX, startY);

  page.drawText(text, {
    size: fontSize,
    font: font,
    color: rgb(0.86, 0.09, 0.26),
  });
}

async function main(inputFileName, outputFileName) {
  const pdfBuffer = await fs.readFile(inputFileName);

  const doc = await PDFDocument.load(pdfBuffer);
  const pages = doc.getPages();
  const headerHeight = 50;
  const page = pages[0];

  const { height, width } = page.getSize();

  page.setHeight(height + headerHeight);
  drawLine(page, height, width);
  drawText(doc, width, height, headerHeight, page);

  const resultBytes = await doc.save();
  await fs.writeFile(outputFileName, Buffer.from(resultBytes));
  console.log(`Output generated: ${outputFileName}`);
}

Promise.all([
  main(INPUT_FILE, OUTPUT_FILE),
  main(INPUT_WORKING_FILE, OUTPUT_WORKING_FILE),
])
  .then(() => process.exit())
  .catch(console.error);
