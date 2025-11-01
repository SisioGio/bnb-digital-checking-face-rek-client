import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiClient from '../../utils/apiClient';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setError('All fields are required.');
      return;
    }

    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await apiClient.post('/contact', { name, email, message });
      if (response.status === 200) {
        setSuccess('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gray-900" id="contact">
      <div className="container mx-auto text-center px-4">
        <motion.h2
          className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Get in Touch
        </motion.h2>


        <motion.div
          className="max-w-2xl mx-auto mb-12 text-lg text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Whether you have a clear plan or just an idea, let's bring it to life.
          We're here to collaborate, advise, and help you move forward.
        </motion.div>


        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <form
            className="bg-gray-800 p-8 rounded-2xl shadow-2xl"
            onSubmit={handleSubmit}
          >
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <div className="mb-4">
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <textarea
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your Message"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-800 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>

          {/* Calendly CTA */}
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col justify-center items-center text-white">
            <h3 className="text-2xl font-semibold mb-4">Prefer a live chat?</h3>
            <p className="mb-6 text-gray-300">
              Book a 30-minute call directly to discuss your project or idea.
            </p>
            <motion.a
              href="https://calendly.com/alessiogiovannini23/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full text-center py-3 px-6 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg font-semibold hover:from-green-500 hover:to-teal-600 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book a Call
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
