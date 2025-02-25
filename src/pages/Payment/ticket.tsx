import  { useState } from "react";
import { CheckCircle, CreditCard, Smartphone, Banknote } from "lucide-react";


const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("gcash");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePayment = () => {
    setPaymentSuccess(true);
  };

  const handleProceed = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if(paymentSuccess){
        setPaymentSuccess(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Confirm Your Payment</h2>
        <div className="mb-4">
          <p className="text-gray-600">Order Summary:</p>
          <p className="font-bold">Event Ticket - ₱1,200</p>
        </div>
        <div className="space-y-2">
          <label
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedPayment === "gcash" ? "border-blue-500" : ""
            }`}
          >
            <input
              type="radio"
              value="gcash"
              checked={selectedPayment === "gcash"}
              onChange={() => setSelectedPayment("gcash")}
              className="hidden"
            />
            <Smartphone size={20} /> GCash
          </label>
          <label
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedPayment === "maya" ? "border-blue-500" : ""
            }`}
          >
            <input
              type="radio"
              value="maya"
              checked={selectedPayment === "maya"}
              onChange={() => setSelectedPayment("maya")}
              className="hidden"
            />
            <CreditCard size={20} /> Maya
          </label>
          <label
            className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-100 ${
              selectedPayment === "bank" ? "border-blue-500" : ""
            }`}
          >
            <input
              type="radio"
              value="bank"
              checked={selectedPayment === "bank"}
              onChange={() => setSelectedPayment("bank")}
              className="hidden"
            />
            <Banknote size={20} /> Bank Transfer
          </label>
        </div>
        <button
          onClick={handleProceed}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
        >
          Proceed to Pay
        </button>
      </div>

      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Complete Your Payment</h3>
            {paymentSuccess ? (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle size={50} className="text-green-500" />
                <p className="text-lg font-semibold">Payment Successful!</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  Scan the QR code or use your chosen payment method.
                </p>
                {selectedPayment === "gcash" && (
                    <p>GCash QR Code Here (replace with actual QR)</p>
                )}
                {selectedPayment === "maya" && (
                    <p>Maya QR Code Here (replace with actual QR)</p>
                )}
                {selectedPayment === "bank" && (
                    <p>Bank Transfer Details Here</p>
                )}
                <button
                  onClick={handlePayment}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mt-4"
                >
                  Confirm Payment
                </button>
              </div>
            )}
            <button
              onClick={handleCloseDialog}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;