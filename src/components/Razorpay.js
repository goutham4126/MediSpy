"use client";
import { useState } from 'react';
import Script from 'next/script';
import toast from 'react-hot-toast';
import AddSubsciption from "@/actions/addSubscription";

const SubscriptionButton = ({ amount, onPaymentInit, isPopular = false }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    try {
      await onPaymentInit(amount);
    } catch (error) {
      console.error(error);
      toast.error('Payment initialization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={`flex items-center mt-auto text-white border-0 py-2 px-4 w-full focus:outline-none hover:bg-indigo-600 rounded ${
        isPopular ? 'bg-indigo-600' : 'bg-indigo-500'
      }`}
    >
      {isProcessing ? "Processing..." : `Subscribe ₹${amount}`}
      <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-auto" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"></path>
      </svg>
    </button>
  );
};

const Razorpay = ({ user }) => {
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const handlePayment = async (amount) => {
    if (!razorpayLoaded) {
      toast.error('Payment system is still loading. Please try again.');
      return;
    }

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!res.ok) throw new Error('Failed to create order');
      
      const { orderId } = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "HealthConnect Pro",
        description: `Healthcare Subscription for ₹${amount}`,
        order_id: orderId,
        handler: async function (response) {
          toast.success(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          const subscription= await AddSubsciption(amount);
          if(subscription.error)
          {
            toast.error("Error in subscription");
            return;
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: "9000000000",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on("payment.failed", function (response) {
        toast.error(`Payment failed! Error: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast.error('Payment processing failed');
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-12 mx-auto">
        <div className="flex flex-wrap -m-4 justify-center">
          {/* Free Plan */}
          <div className="p-4 xl:w-1/4 md:flex-1 w-full">
            <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
              <h2 className="text-sm tracking-widest title-font mb-1 font-medium">FREE</h2>
              <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                <span>₹0</span>
                <span className="text-lg ml-1 font-normal text-gray-500">/mo</span>
              </h1>
              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Unlimited Prescriptions & Video Consultations
              </p>
              <p className="flex items-center text-gray-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>3 times symptom checks
              </p>
            </div>
          </div>
          
          {/* Standard Plan */}
          <div className="p-4 xl:w-1/4 md:flex-1 w-full">
            <div className="h-full p-6 rounded-lg border-2 border-indigo-500 flex flex-col relative overflow-hidden">
              <span className="bg-indigo-500 text-white px-3 py-1 tracking-widest text-xs absolute right-0 top-0 rounded-bl">POPULAR</span>
              <h2 className="text-sm tracking-widest title-font mb-1 font-medium">BASIC CARE</h2>
              <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                <span>₹99</span>
                <span className="text-lg ml-1 font-normal text-gray-500">/mo</span>
              </h1>
              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Unlimited Prescriptions & Video Consultations
              </p>
              <p className="flex items-center text-gray-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>10 times symptom checks
              </p>
              <SubscriptionButton amount={99} onPaymentInit={handlePayment} isPopular />
            </div>
          </div>
          
          <div className="p-4 xl:w-1/4 md:flex-1 w-full">
            <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col relative overflow-hidden">
              <h2 className="text-sm tracking-widest title-font mb-1 font-medium">PREMIUM CARE</h2>
              <h1 className="text-5xl text-gray-900 leading-none flex items-center pb-4 mb-4 border-b border-gray-200">
                <span>₹149</span>
                <span className="text-lg ml-1 font-normal text-gray-500">/mo</span>
              </h1>
              <p className="flex items-center text-gray-600 mb-2">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Unlimited Prescriptions & Video Consultations
              </p>
              <p className="flex items-center text-gray-600 mb-6">
                <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-400 text-white rounded-full flex-shrink-0">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                </span>Unlimited symptom checks
              </p>
              <SubscriptionButton amount={149} onPaymentInit={handlePayment} />
            </div>
          </div>
        </div>
      </div>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="lazyOnload"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => toast.error('Failed to load payment system')}
      />
    </section>
  );
};

export default Razorpay;