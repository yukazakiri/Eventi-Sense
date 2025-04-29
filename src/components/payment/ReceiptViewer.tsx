import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { Receipt, Payment } from '../../types/payment';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';

const ReceiptViewer = () => {
  const { receiptNumber } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        // Fetch receipt details
        const { data: receiptData, error: receiptError } = await supabase
          .from('receipts')
          .select('*, payments(*)')
          .eq('receipt_number', receiptNumber)
          .single();

        if (receiptError) throw receiptError;
        
        setReceipt(receiptData);
        setPayment(receiptData.payments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [receiptNumber]);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Receipt-${receipt?.receipt_number}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div>Loading receipt...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!receipt) return <div>Receipt not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div ref={receiptRef} className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Receipt Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Payment Receipt</h1>
          <p className="text-sm opacity-90">Your Trusted Service Partner</p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-6">
          {/* Company Info */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-semibold">Company Name</h2>
            <p className="text-sm text-gray-600">123 Business Street<br/>City, Country</p>
            <p className="text-sm text-gray-600">contact@company.com<br />(123) 456-7890</p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Receipt Number:</span>
              <span>#{receipt.receipt_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{new Date(payment?.payment_date || '').toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Transaction ID:</span>
              <span>{payment?.transaction_id}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Paid:</span>
              <span>₱{payment?.amount.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Payment Method: {payment?.payment_method} ({payment?.payment_type})
            </div>
          </div>

          {/* Verification Section */}
          <div className="border-t pt-4 text-center">
            <div className="mb-4">
            <QRCodeSVG 
                value={`https://eventisense.koamishin.org/verify/${receipt.receipt_number}`}
                size={128}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-gray-600">
              Scan this QR code to verify the authenticity of this receipt.
              <br />
              Verification URL: https://eventisense.koamishin.org/verify/${receipt.receipt_number}
            </p>
          </div>
        </div>

        {/* Receipt Footer */}
        <div className="bg-gray-100 p-4 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p>This is an computer-generated receipt • No signature required</p>
        </div>

        {/* Update the Download Button */}
        <div className="p-4 border-t">
          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
          >
            {downloading ? 'Generating PDF...' : 'Download PDF Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptViewer;