import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../api/supabaseClient';
import { Receipt, Payment } from '../../types/payment';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const VerifyReceipt = () => {
  const { receiptNumber } = useParams();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyReceipt = async () => {
      try {
        // Fetch receipt and payment details
        const { data: receiptData, error: receiptError } = await supabase
          .from('receipts')
          .select('*, payments(*)')
          .eq('receipt_number', receiptNumber)
          .single();

        if (receiptError) throw receiptError;
        
        setReceipt(receiptData);
        setPayment(receiptData.payments);
        setVerified(true);
      } catch (err: any) {
        setError(err.message);
        setVerified(false);
      } finally {
        setLoading(false);
      }
    };

    verifyReceipt();
  }, [receiptNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying receipt...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-sky-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Receipt Verification</h1>
        </div>

        <div className="p-6">
          {verified ? (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-600 mb-4">Receipt Verified</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3 text-left">
                <p><span className="font-medium">Receipt Number:</span> #{receipt?.receipt_number}</p>
                <p><span className="font-medium">Transaction ID:</span> {payment?.transaction_id}</p>
                <p><span className="font-medium">Date:</span> {new Date(payment?.payment_date || '').toLocaleString()}</p>
                <p><span className="font-medium">Amount Paid:</span> ₱{payment?.amount.toFixed(2)}</p>
                <p><span className="font-medium">Payment Method:</span> {payment?.payment_method}</p>
                <p><span className="font-medium">Payment Type:</span> {payment?.payment_type}</p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-600 mb-4">Invalid Receipt</h2>
              <p className="text-gray-600">
                This receipt could not be verified. It may be invalid or no longer exist in our records.
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-100 p-4 text-center">
          <p className="text-sm text-gray-600">
            This is an official verification page for Eventi-Sense receipts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyReceipt;