import React, { useState } from 'react';
import { MessageCircle, X, FileDown } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const ChatBot = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);
      
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([600, 800]);
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // Add header
      page.drawText('Defects List', {
        x: 50,
        y: 750,
        size: 24,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      // Add generation date
      page.drawText(`Generated: ${new Date().toLocaleDateString()}`, {
        x: 50,
        y: 720,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Add table headers
      const headers = ['No.', 'Status', 'Equipment', 'Description', 'Reported'];
      const startY = 680;
      const lineHeight = 20;
      const columnWidths = [40, 80, 120, 200, 80];
      let currentX = 50;

      headers.forEach((header, index) => {
        page.drawText(header, {
          x: currentX,
          y: startY,
          size: 12,
          font: boldFont,
        });
        currentX += columnWidths[index];
      });

      // Add table content
      let currentY = startY - lineHeight;
      data.forEach((item, index) => {
        if (currentY < 50) {
          // Add new page if needed
          currentY = startY;
          page = pdfDoc.addPage([600, 800]);
        }

        currentX = 50;
        const rowData = [
          (index + 1).toString(),
          item['Status (Vessel)'],
          item.Equipments,
          item.Description,
          new Date(item['Date Reported']).toLocaleDateString(),
        ];

        rowData.forEach((text, colIndex) => {
          page.drawText(text?.toString().slice(0, 30) || '', {
            x: currentX,
            y: currentY,
            size: 10,
            font: font,
          });
          currentX += columnWidths[colIndex];
        });

        currentY -= lineHeight;
      });

      // Add footer
      page.drawText('Confidential Document', {
        x: 250,
        y: 30,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
      });

      // Save the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `defects-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setLoading(false);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 p-3 rounded-full bg-[#3BADE5] text-white shadow-lg 
        hover:bg-[#3BADE5]/90 transition-all ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-[#132337] rounded-lg shadow-xl border border-white/10">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#3BADE5] flex items-center justify-center">
                <FileDown className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">FleetAssist</h3>
                <p className="text-xs text-white/60">Report Generator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-white/80 mb-2">
                Hello! I can help you generate a report of your defects list.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={generatePDF}
              disabled={loading}
              className="w-full py-2 px-4 bg-[#3BADE5] text-white text-sm rounded-md
              hover:bg-[#3BADE5]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
            >
              {loading ? (
                'Generating...'
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
