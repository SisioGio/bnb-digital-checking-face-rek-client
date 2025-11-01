import { BookUser, LogIn, FilePlus, KeyRound, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
const tutorialSteps = [
  {
    title: "1. Create an Account",
    description: (
      <>
        <Link to="/register" className="text-blue-400 underline hover:text-blue-300">
          Sign up
        </Link>{" "}
        or{" "}
        <Link to="/login" className="text-blue-400 underline hover:text-blue-300">
          log in
        </Link>{" "}
        to your dashboard.
      </>
    ),
    icon: <BookUser className="w-6 h-6" />,
  },
  {
    title: "2. Go to the Testing Hub",
    description: (
      <>
        Navigate to{" "}
        <Link to="/extract" className="text-blue-400 underline hover:text-blue-300">
          /extract
        </Link>{" "}
        and start by uploading sample files.
      </>
    ),
    icon: <FileSearch className="w-6 h-6" />,
  },
  {
    title: "3. Create a Document Schema",
    description: "Define your own document structure to extract fields from invoices, receipts, etc.",
    icon: <FilePlus className="w-6 h-6" />,
  },
  {
    title: "4. Copy the Schema ID",
    description: "Once tested, copy your document schema ID from the Try It Out tab.",
    icon: <FileSearch className="w-6 h-6" />,
  },
  {
    title: "5. Get Your API Key",
    description: (
      <>
        Go to your{" "}
        <Link to="/account" className="text-blue-400 underline hover:text-blue-300">
          /account
        </Link>{" "}
        tab and copy your personal API key.
      </>
    ),
    icon: <KeyRound className="w-6 h-6" />,
  },
];

const GettingStartedTutorial = () => {
  return (
    <section className="py-24 bg-gray-950 border-b border-gray-800" id="getting-started">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.h2
          className="text-4xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Getting Started
        </motion.h2>

        <ol className="space-y-8">
          {tutorialSteps.map((step, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-4 bg-gray-800/40 border border-gray-700 p-4 rounded-xl shadow-md backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex-none w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                {step.icon}
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{step.title}</h3>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default GettingStartedTutorial;
