const PDFDocument = require('pdfkit');

/**
 * Generates a PDF report for a user's portfolio and pipes it to the response.
 * @param {Object} data - Contains user info, portfolio metrics, and assets
 * @param {Object} res - Express response object
 */
const generatePortfolioPDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe its output directly to the HTTP response
  doc.pipe(res);

  // 1. Header
  doc
    .fillColor('#38BDF8')
    .fontSize(24)
    .text('QuantVault', { align: 'left' })
    .fillColor('#444444')
    .fontSize(10)
    .text('Real-Time Investment Portfolio Intelligence Platform', { align: 'left' })
    .moveDown();

  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, 95)
    .lineTo(550, 95)
    .stroke();

  doc.moveDown(2);

  // 2. Title & Date
  doc
    .fillColor('#000000')
    .fontSize(18)
    .text(`Portfolio Wealth Report`, { align: 'center' })
    .fontSize(10)
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
    .moveDown(2);

  // 3. User Summary
  doc
    .fontSize(14)
    .text('Account Overview', { underline: true })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .text(`Username: ${data.username}`)
    .text(`Total Value: $${data.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    .text(`Total Return: $${data.totalReturn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
    .moveDown(2);

  // 4. Holdings Table
  doc
    .fontSize(14)
    .text('Asset Allocation', { underline: true })
    .moveDown(0.5);

  const tableTop = doc.y;
  const col1 = 50;
  const col2 = 200;
  const col3 = 300;
  const col4 = 420;

  // Table Header
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text('Asset Symbol', col1, tableTop)
    .text('Type', col2, tableTop)
    .text('Quantity', col3, tableTop)
    .text('Total Value', col4, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // Table Rows
  let y = tableTop + 25;
  doc.font('Helvetica');

  data.assets.forEach(asset => {
    // Basic pagination guard
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
    
    doc
      .text(asset.symbol, col1, y)
      .text(asset.type, col2, y)
      .text(asset.quantity.toString(), col3, y)
      .text(`$${asset.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, col4, y);
    
    y += 20;
  });

  // Finalize PDF file
  doc.end();
};

module.exports = {
  generatePortfolioPDF
};
