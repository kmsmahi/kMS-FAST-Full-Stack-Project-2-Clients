import React, { useState } from 'react';

const faqData = [
  {
    question: "What is the delivery time for parcels in Dhaka vs. nationwide?",
    answer: "Express delivery within Dhaka takes 4–6 hours from pick-up to drop-off. Standard deliveries across major cities (Chittagong, Sylhet, Khulna, Rajshahi) take 24–72 hours, and nationwide home delivery across all 64 districts takes 48–72 hours."
  },
  {
    question: "How can I track my parcel in real-time?",
    answer: "You can track your shipment instantly by entering your unique tracking ID in the live tracking portal on our dashboard or homepage. You will receive real-time status updates at every stage of the journey."
  },
  {
    question: "What is the process and timeline for Cash on Delivery (COD) payouts?",
    answer: "We offer 100% secure Cash on Delivery anywhere in Bangladesh. COD payments are processed and settled directly to your merchant bank account or mobile wallet within 24 hours of successful delivery confirmation."
  },
  {
    question: "How do I schedule a parcel pickup as a merchant?",
    answer: "Simply log into your KMS-FAST merchant account, navigate to the dashboard, and click 'Book a Shipment'. Enter your pickup location, recipient details, and parcel specifications, and our nearest rider will collect it from your doorstep."
  },
  {
    question: "What are your return and reverse logistics policies?",
    answer: "Through our seamless reverse logistics facility, end customers can easily return or exchange products with online merchants. The returned items are securely tracked and routed back to your warehouse with complete transparency."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 sm:py-24 border-b border-gray-100 relative overflow-hidden bg-base-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            Find clear answers about our delivery timelines, tracking features, pricing, and merchant services.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-[#CAEB66] bg-gray-50/50 shadow-md' 
                    : 'border-gray-200 bg-white hover:border-gray-300 shadow-sm'
                }`}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`text-base sm:text-lg font-bold transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-800'}`}>
                    {item.question}
                  </span>
                  
                  {/* Down Arrow Indicator */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ml-4 ${
                    isOpen ? 'bg-[#CAEB66] text-gray-900 rotate-180' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <svg
                      className="w-4 h-4 stroke-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Answer Container */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden px-5 sm:px-6 ${
                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 pb-0 opacity-0'
                  }`}
                >
                  <div className="pt-2 border-t border-gray-200/60 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}