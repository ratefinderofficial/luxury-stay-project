import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock, AlertCircle } from 'lucide-react';
import Button from '../UI/Button'; // Humara reusable button
import toast from 'react-hot-toast';

const CheckoutForm = ({ amount, currency = 'USD', onSuccess, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Stripe Element Styling (Taake input field professional lage)
  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js load nahi hua abhi tak
      return;
    }

    setProcessing(true);
    setError(null);

    // 1. Payment Confirm karo using Client Secret (jo Backend se aaya hai)
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: 'Guest User', // Real app mein form se name uthayenge
        },
      },
    });

    if (result.error) {
      // Payment Fail ho gayi
      setError(result.error.message);
      setProcessing(false);
      toast.error("Payment Failed: " + result.error.message);
    } else {
      // Payment Successful
      if (result.paymentIntent.status === 'succeeded') {
        toast.success("Payment Successful!");
        setProcessing(false);
        if (onSuccess) onSuccess(result.paymentIntent);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto w-12 h-12 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-3">
          <Lock size={24} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Secure Payment</h3>
        <p className="text-gray-500 text-sm">Complete your booking securely</p>
      </div>

      {/* Amount Display */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center border border-gray-200">
        <span className="text-gray-600 font-medium">Total Amount</span>
        <span className="text-2xl font-bold text-gray-900">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount)}
        </span>
      </div>

      {/* Credit Card Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Details</label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary transition-all">
          <CardElement options={cardStyle} />
        </div>
      </div>

      {/* Error Message Area */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Pay Button */}
      <Button 
        type="submit" 
        variant="primary" 
        className="w-full py-3 text-lg shadow-md"
        disabled={!stripe || processing}
        isLoading={processing}
      >
        {processing ? 'Processing...' : `Pay ${currency.toUpperCase()} ${amount}`}
      </Button>

      {/* Security Footer */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
        <Lock size={12} />
        <span>Encrypted by Stripe 256-bit SSL</span>
      </div>
    </form>
  );
};

export default CheckoutForm;