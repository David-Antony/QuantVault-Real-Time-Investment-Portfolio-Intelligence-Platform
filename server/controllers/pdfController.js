const PDFDocument = require('pdfkit');
const { prisma } = require('../config/db');

/**
 * GET /api/reports/pdf
 * Generates and streams a PDF portfolio report for the authenticated user.
 */
const generatePDF = async (req, res, next) => {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.userId },
      include: {
        assets: { orderBy: { name: 'asc' } },
        transactions: { orderBy: { date: 'desc' }, take: 20 },
        user: true
      }
    });

    if (!portfolio) {
      return res.status(404).json({ success: false, message: 'No portfolio found' });
    }

    const { assets, transactions, user, cashBalance } = portfolio;
    const totalAssetValue = assets.reduce((s, a) => s + Number(a.currentPrice) * Number(a.quantity), 0);
    const totalValue = totalAssetValue + Number(cashBalance);
    const totalInvested = assets.reduce((s, a) => s + Number(a.totalInvested), 0);
    const totalGainLoss = totalAssetValue - totalInvested;
    const overallReturnPct = totalInvested > 0 ? ((totalGainLoss / totalInvested) * 100).toFixed(2) : '0.00';
    const generatedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

    // ── Create PDF ──────────────────────────────────────────────────
    const doc = new PDFDocument({ margin: 50, size: 'A4', info: { Title: 'QuantVault Portfolio Report', Author: user.username } });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="QuantVault-Report-${Date.now()}.pdf"`);
    doc.pipe(res);

    const DARK = '#0A0F1E';
    const CYAN = '#38BDF8';
    const EMERALD = '#10B981';
    const ROSE = '#EF4444';
    const MUTED = '#94A3B8';
    const WHITE = '#F1F5F9';

    const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const pct = (n) => `${n >= 0 ? '+' : ''}${Number(n).toFixed(2)}%`;

    // ── Header ─────────────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 110).fill(DARK);
    doc.fill(CYAN).fontSize(28).font('Helvetica-Bold').text('QuantVault', 50, 30);
    doc.fill(MUTED).fontSize(11).font('Helvetica').text('Real-Time Investment Portfolio Intelligence Platform', 50, 65);
    doc.fill(WHITE).fontSize(11).text(`Portfolio Report — Generated ${generatedAt}`, 50, 85);

    doc.moveDown(3);

    // ── Summary KPIs ───────────────────────────────────────────────
    doc.fill(WHITE).fontSize(16).font('Helvetica-Bold').text('Portfolio Summary', { underline: false });
    doc.moveDown(0.5);

    const kpiY = doc.y;
    const kpis = [
      { label: 'Total Portfolio Value', value: fmt(totalValue), color: CYAN },
      { label: 'Total Invested', value: fmt(totalInvested), color: WHITE },
      { label: 'Total Gain / Loss', value: fmt(totalGainLoss), color: totalGainLoss >= 0 ? EMERALD : ROSE },
      { label: 'Overall Return', value: pct(overallReturnPct), color: Number(overallReturnPct) >= 0 ? EMERALD : ROSE },
      { label: 'Cash Balance', value: fmt(cashBalance), color: WHITE },
      { label: 'Total Assets', value: assets.length.toString(), color: WHITE }
    ];

    kpis.forEach((kpi, i) => {
      const x = 50 + (i % 3) * 170;
      const y = kpiY + Math.floor(i / 3) * 60;
      doc.roundedRect(x, y, 150, 50, 6).fillAndStroke('#101828', '#1E293B');
      doc.fill(MUTED).fontSize(9).font('Helvetica').text(kpi.label, x + 10, y + 8, { width: 130 });
      doc.fill(kpi.color).fontSize(14).font('Helvetica-Bold').text(kpi.value, x + 10, y + 26, { width: 130 });
    });

    doc.y = kpiY + Math.ceil(kpis.length / 3) * 60 + 20;
    doc.moveDown(1);

    // ── Assets Table ───────────────────────────────────────────────
    doc.fill(WHITE).fontSize(16).font('Helvetica-Bold').text('Asset Holdings');
    doc.moveDown(0.5);

    if (assets.length === 0) {
      doc.fill(MUTED).fontSize(11).text('No assets in portfolio.');
    } else {
      const cols = [50, 160, 260, 350, 440];
      const headers = ['Asset', 'Qty', 'Avg Cost', 'Current Price', 'Gain/Loss'];
      doc.rect(50, doc.y, 500, 22).fill('#1E293B');
      headers.forEach((h, i) => doc.fill(MUTED).fontSize(9).font('Helvetica-Bold').text(h, cols[i] + 4, doc.y - 18, { width: 95 }));
      doc.moveDown(0.3);

      assets.forEach((asset) => {
        const currVal = Number(asset.currentPrice) * Number(asset.quantity);
        const gain = currVal - Number(asset.totalInvested);
        const rowY = doc.y;
        if (rowY > 700) { doc.addPage(); }
        doc.fill(WHITE).fontSize(9).font('Helvetica').text(asset.name, cols[0] + 4, rowY, { width: 95 });
        doc.text(Number(asset.quantity).toFixed(4), cols[1] + 4, rowY, { width: 95 });
        doc.text(fmt(asset.averageCost), cols[2] + 4, rowY, { width: 85 });
        doc.text(fmt(asset.currentPrice), cols[3] + 4, rowY, { width: 85 });
        doc.fill(gain >= 0 ? EMERALD : ROSE).text(`${gain >= 0 ? '+' : ''}${fmt(gain)}`, cols[4] + 4, rowY, { width: 95 });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y - 2).lineTo(550, doc.y - 2).stroke('#1E293B');
      });
    }

    doc.moveDown(1.5);

    // ── Recent Transactions ────────────────────────────────────────
    doc.fill(WHITE).fontSize(16).font('Helvetica-Bold').text('Recent Transactions (Last 20)');
    doc.moveDown(0.5);

    if (transactions.length === 0) {
      doc.fill(MUTED).fontSize(11).text('No transactions recorded.');
    } else {
      const tCols = [50, 130, 210, 310, 430];
      const tHeaders = ['Date', 'Asset', 'Type', 'Amount', 'Status'];
      doc.rect(50, doc.y, 500, 22).fill('#1E293B');
      tHeaders.forEach((h, i) => doc.fill(MUTED).fontSize(9).font('Helvetica-Bold').text(h, tCols[i] + 4, doc.y - 18, { width: 90 }));
      doc.moveDown(0.3);

      transactions.forEach((tx) => {
        const rowY = doc.y;
        if (rowY > 700) { doc.addPage(); }
        const typeColor = tx.type === 'buy' ? EMERALD : tx.type === 'sell' ? ROSE : CYAN;
        doc.fill(MUTED).fontSize(9).font('Helvetica').text(new Date(tx.date).toLocaleDateString('en-US'), tCols[0] + 4, rowY, { width: 75 });
        doc.fill(WHITE).text(tx.assetName, tCols[1] + 4, rowY, { width: 75 });
        doc.fill(typeColor).text(tx.type.toUpperCase(), tCols[2] + 4, rowY, { width: 95 });
        doc.fill(WHITE).text(fmt(tx.amount), tCols[3] + 4, rowY, { width: 95 });
        doc.fill(MUTED).text(tx.status, tCols[4] + 4, rowY, { width: 70 });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y - 2).lineTo(550, doc.y - 2).stroke('#1E293B');
      });
    }

    // ── Footer ─────────────────────────────────────────────────────
    doc.moveDown(2);
    doc.fill(MUTED).fontSize(9).text(`QuantVault — ${user.username} — ${generatedAt}`, { align: 'center' });

    doc.end();
  } catch (err) { next(err); }
};

module.exports = { generatePDF };
