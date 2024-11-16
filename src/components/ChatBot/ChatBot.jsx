import React, { useState } from 'react';
import { MessageCircle, X, FileDown } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const ChatBot = ({ data, vesselName, filters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Add text sanitization helper
  const sanitizeText = (text) => {
    if (!text) return '-';
    return text
      .toString()
      .replace(/[\n\r]+/g, ' ') // Replace line breaks with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
      .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
      .replace(/[^\w\s-.,]/g, ''); // Keep only alphanumeric, spaces, and basic punctuation
  };

  // Add text truncation helper
  const truncateText = (text, maxWidth, fontSize, font) => {
    if (!text) return '-';
    let truncated = sanitizeText(text);

    try {
      if (font.widthOfTextAtSize(truncated, fontSize) > maxWidth) {
        let ellipsis = '...';
        let width = font.widthOfTextAtSize(ellipsis, fontSize);
        let result = '';

        // Add characters until we exceed the max width
        for (let i = 0; i < truncated.length; i++) {
          let char = truncated[i];
          let charWidth = font.widthOfTextAtSize(char, fontSize);
          if (width + charWidth > maxWidth - font.widthOfTextAtSize('...', fontSize)) {
            break;
          }
          result += char;
          width += charWidth;
        }

        return result + ellipsis;
      }
      return truncated;
    } catch (error) {
      console.error('Error truncating text:', error);
      return text.substring(0, 20) + '...';
    }
  };

  const generatePDF = async () => {
    try {
      setLoading(true);

      const pdfDoc = await PDFDocument.create();
      let currentPage = pdfDoc.addPage([842, 595]); // A4 landscape
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Page configuration
      const margin = {
        top: 540,
        left: 20,
        right: 20,
        bottom: 20,
      };
      const pageWidth = 842 - margin.left - margin.right;

      // Draw header
      currentPage.drawText(sanitizeText('Defects List'), {
        x: margin.left,
        y: margin.top,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      currentPage.drawText(`Vessel: ${sanitizeText(vesselName)}`, {
        x: margin.left,
        y: margin.top - 30,
        size: 12,
        font: helveticaFont,
      });

      currentPage.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
        x: margin.left,
        y: margin.top - 50,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Table configuration
      const tableConfig = {
        startY: margin.top - 90,
        columns: [
          { header: '#', width: 40 },
          { header: 'Status', width: 80 },
          { header: 'Equipment', width: 120 },
          { header: 'Description', width: 180 },
          { header: 'Action Planned', width: 180 },
          { header: 'Criticality', width: 70 },
          { header: 'Reported', width: 70 },
          { header: 'Completed', width: 70 },
        ],
        lineHeight: 25,
      };

      // Draw table header background
      currentPage.drawRectangle({
        x: margin.left,
        y: tableConfig.startY - 5,
        width: pageWidth,
        height: 30,
        color: rgb(0.95, 0.95, 0.95),
      });

      // Draw headers
      let currentX = margin.left;
      tableConfig.columns.forEach((column) => {
        const headerText = sanitizeText(column.header);
        currentPage.drawText(headerText, {
          x: currentX + 5,
          y: tableConfig.startY,
          size: 10,
          font: boldFont,
        });
        currentX += column.width;
      });

      // Draw content
      let currentY = tableConfig.startY - tableConfig.lineHeight;

      // Draw header separator
      currentPage.drawLine({
        start: { x: margin.left, y: tableConfig.startY - 8 },
        end: { x: margin.left + pageWidth, y: tableConfig.startY - 8 },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });

      data.forEach((item, index) => {
        if (currentY < margin.bottom + 30) {
          currentPage = pdfDoc.addPage([842, 595]);
          currentY = tableConfig.startY;
        }

        // Row background
        if (index % 2 === 0) {
          currentPage.drawRectangle({
            x: margin.left,
            y: currentY - 5,
            width: pageWidth,
            height: tableConfig.lineHeight,
            color: rgb(0.97, 0.97, 0.97),
          });
        }

        // Prepare row data
        const rowData = [
          (index + 1).toString(),
          sanitizeText(item['Status (Vessel)'] || '-'),
          sanitizeText(item.Equipments || '-'),
          sanitizeText(item.Description || '-'),
          sanitizeText(item['Action Planned'] || '-'),
          sanitizeText(item.Criticality || '-'),
          item['Date Reported'] ? new Date(item['Date Reported']).toLocaleDateString() : '-',
          item['Date Completed'] ? new Date(item['Date Completed']).toLocaleDateString() : '-',
        ];

        // Draw row data
        currentX = margin.left;
        tableConfig.columns.forEach((column, colIndex) => {
          const text = truncateText(rowData[colIndex], column.width - 10, 9, helveticaFont);
          try {
            currentPage.drawText(text, {
              x: currentX + 5,
              y: currentY,
              size: 9,
              font: helveticaFont,
            });
          } catch (error) {
            console.error('Error drawing text:', error);
            currentPage.drawText('-', {
              x: currentX + 5,
              y: currentY,
              size: 9,
              font: helveticaFont,
            });
          }
          currentX += column.width;
        });

        // Row separator
        currentPage.drawLine({
          start: { x: margin.left, y: currentY - 8 },
          end: { x: margin.left + pageWidth, y: currentY - 8 },
          thickness: 0.5,
          color: rgb(0.9, 0.9, 0.9),
        });

        currentY -= tableConfig.lineHeight;
      });

      // Footer
      currentPage.drawText('Generated by Defects Manager', {
        x: 842 / 2 - 70,
        y: margin.bottom + 10,
        size: 10,
        font: helveticaFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Save and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `defects-report-${sanitizeText(vesselName)}-${new Date().toISOString().split('T')[0]}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLoading(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
    }
  };

  // UI remains unchanged
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-3 rounded-full bg-orange-500 text-white shadow-lg 
        hover:bg-orange-600 transition-all ${isOpen ? 'scale-0' : 'scale-100'} z-50`}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Ask AI</span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-[#132337] rounded-lg shadow-xl border border-white/10 z-50">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Ask AI</h3>
                <p className="text-xs text-white/60">Report Generator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-white/80 mb-2">
                Hello! I can help you generate a PDF report of your defects list.
              </p>
            </div>

            <button
              onClick={generatePDF}
              disabled={loading}
              className="w-full py-2 px-4 bg-orange-500 text-white text-sm rounded-md
              hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {loading ? (
                'Generating PDF...'
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  Generate Defects Report
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
