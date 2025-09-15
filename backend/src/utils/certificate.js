import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export function generateCertificate({ studentName, quizTitle, scorePercent, passed, issuedAt, orgName }) {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  const stream = new Readable({ read() {} });

  doc.on('data', (chunk) => stream.push(chunk));
  doc.on('end', () => stream.push(null));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);
  const contentHeight = pageHeight - (margin * 2);

  // Professional certificate background
  doc.rect(0, 0, pageWidth, pageHeight).fill('#ffffff');

  // Outer border with professional styling
  doc.lineWidth(4);
  doc.strokeColor('#000000');
  doc.rect(margin, margin, contentWidth, contentHeight).stroke();

  // Inner decorative border
  doc.lineWidth(1);
  doc.strokeColor('#666666');
  doc.rect(margin + 15, margin + 15, contentWidth - 30, contentHeight - 30).stroke();

  // Corner decorative elements
  const cornerSize = 30;
  const corners = [
    [margin + 15, margin + 15], // top-left
    [pageWidth - margin - 15 - cornerSize, margin + 15], // top-right
    [margin + 15, pageHeight - margin - 15 - cornerSize], // bottom-left
    [pageWidth - margin - 15 - cornerSize, pageHeight - margin - 15 - cornerSize] // bottom-right
  ];

  corners.forEach(([x, y]) => {
    doc.lineWidth(2);
    doc.strokeColor('#000000');
    // Corner L-shapes
    doc.moveTo(x, y).lineTo(x + cornerSize, y).stroke();
    doc.moveTo(x, y).lineTo(x, y + cornerSize).stroke();
    doc.moveTo(x + cornerSize, y + cornerSize).lineTo(x, y + cornerSize).stroke();
    doc.moveTo(x + cornerSize, y + cornerSize).lineTo(x + cornerSize, y).stroke();
  });

  // Header section
  const headerY = margin + 60;
  doc.fillColor('#000000');
  doc.fontSize(32).font('Helvetica-Bold');
  doc.text('CertifyPro', margin, headerY, { width: contentWidth, align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(18).font('Helvetica-Bold');
  doc.text('CERTIFICATE OF ACHIEVEMENT', margin, doc.y, { width: contentWidth, align: 'center' });

  // Main content area
  const bodyStartY = headerY + 120;
  doc.y = bodyStartY;

  doc.fontSize(14).font('Helvetica');
  doc.text('This is to certify that', margin, doc.y, { width: contentWidth, align: 'center' });

  doc.moveDown(1);
  doc.fontSize(28).font('Helvetica-Bold');
  doc.fillColor('#000000');
  doc.text(studentName, margin, doc.y, { width: contentWidth, align: 'center' });

  doc.moveDown(1);
  doc.fontSize(14).font('Helvetica');
  doc.fillColor('#000000');
  doc.text('has successfully completed the certification examination for', margin, doc.y, { width: contentWidth, align: 'center' });

  doc.moveDown(1);
  doc.fontSize(20).font('Helvetica-Bold');
  doc.text(quizTitle, margin, doc.y, { width: contentWidth, align: 'center' });

  // Achievement details
  doc.moveDown(1.5);
  doc.fontSize(12).font('Helvetica');
  doc.text(`Score: ${scorePercent}% - ${passed ? 'PASSED' : 'DID NOT PASS'}`, margin, doc.y, { width: contentWidth, align: 'center' });

  doc.moveDown(0.5);
  const formattedDate = new Date(issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Issued on ${formattedDate}`, margin, doc.y, { width: contentWidth, align: 'center' });

  // Validation section
  doc.moveDown(2);
  doc.fontSize(10).font('Helvetica');
  doc.text('This certification validates the holder\'s knowledge and competency', margin, doc.y, { width: contentWidth, align: 'center' });
  doc.text('in the subject matter as assessed by our rigorous examination standards.', margin, doc.y + 12, { width: contentWidth, align: 'center' });

  // Footer with signature and seal
  const footerY = pageHeight - margin - 100;

  // Signature section
  const signatureX = margin + 80;
  const signatureY = footerY;
  doc.lineWidth(1);
  doc.strokeColor('#000000');
  doc.moveTo(signatureX, signatureY).lineTo(signatureX + 200, signatureY).stroke();

  doc.fontSize(12).font('Helvetica-Bold');
  doc.text('CertifyPro Academy', signatureX, signatureY + 10, { width: 200, align: 'center' });
  doc.fontSize(10).font('Helvetica');
  doc.text('Certification Authority', signatureX, signatureY + 25, { width: 200, align: 'center' });

  // Certificate seal (circular design)
  const sealX = pageWidth - margin - 120;
  const sealY = footerY - 20;
  const sealRadius = 40;

  // Outer circle
  doc.lineWidth(3);
  doc.strokeColor('#000000');
  doc.circle(sealX, sealY, sealRadius).stroke();

  // Inner circle
  doc.lineWidth(1);
  doc.circle(sealX, sealY, sealRadius - 8).stroke();

  // Seal text
  doc.fontSize(10).font('Helvetica-Bold');
  doc.fillColor('#000000');
  doc.text('CERTIFIED', sealX - 25, sealY - 15, { width: 50, align: 'center' });
  doc.fontSize(14).font('Helvetica-Bold');
  doc.text(new Date(issuedAt).getFullYear().toString(), sealX - 15, sealY - 5, { width: 30, align: 'center' });
  doc.fontSize(10).font('Helvetica-Bold');
  doc.text('AUTHENTIC', sealX - 25, sealY + 8, { width: 50, align: 'center' });

  // Certificate ID
  doc.fontSize(8).font('Helvetica');
  doc.fillColor('#666666');
  const certId = `CERT-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
  doc.text(`Certificate ID: ${certId}`, margin, pageHeight - margin - 20, { width: contentWidth, align: 'center' });

  doc.end();
  return stream;
}
