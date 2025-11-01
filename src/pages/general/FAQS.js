import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What types of documents can be processed?",
    answer:
      "You can process a wide range of document types: invoices, receipts, contracts, utility bills, ID cards, PDFs, scanned forms, and more — whether structured, semi-structured, or unstructured."
  },
  {
    question: "Which languages are supported?",
    answer:
      "Our platform supports multilingual documents. Common languages like English, Spanish, French, Italian, German, and many others are fully supported — and the engine adapts dynamically based on content."
  },
  {
    question: "What happens with the extracted data?",
    answer:
      "Once the document is processed, all extracted fields are available via a secure API. You can fetch them and use them in your system for any kind of post-processing, analysis, or automation workflows."
  },
  {
    question: "How much does it cost?",
    answer:
      "Our pricing is usage-based: processing starts at approximately $0.01 per page. Volume-based discounts are available for enterprises and long-term users."
  },
  {
    question: "Can I fine-tune the extraction?",
    answer:
      "Yes! You can fine-tune our models by providing additional samples specific to your vendor or layout (e.g., invoices from a particular supplier). We'll adjust parsing rules on the sender/field level for even higher accuracy."
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. Your documents and data are not stored permanently. We process in-memory only and discard documents immediately after extraction. Everything runs over secure, encrypted connections."
  },
  {
    question: "Is there a free tier or trial?",
    answer:
      "Yes — we offer a free tier to test and explore the platform. No credit card required. Ideal for small prototypes or testing your documents before full deployment."
  },
  {
    question: "Is there a free tier or trial?",
    answer:
      "Yes — we offer a free tier to test and explore the platform. No credit card required. Ideal for small prototypes or testing your documents before full deployment."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-slate-950 text-white py-20 px-6 lg:px-24" id='faqs'>
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-400 text-lg">
          Everything you need to know about using DocAI Extractor effectively and securely.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-slate-800 bg-opacity-60 border border-slate-700 rounded-xl shadow-md transition-all duration-300"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
            >
              <span className="text-lg font-medium">{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 py-5 text-gray-300 text-sm border-t border-slate-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
