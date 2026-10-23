// frontend/src/pages/user/contact.jsx
import React from 'react';
import { motion } from 'framer-motion';

function Contact() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center py-16 px-6"
    >
      <div className="max-w-lg w-full bg-[#141414] p-8 sm:p-10 rounded-3xl border border-neutral-800 shadow-2xl shadow-black/80">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 bg-neutral-900 px-3 py-1.5 rounded-full mb-4 border border-neutral-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Support Dispatch 24/7
        </div>

        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Contact Support
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8">
          Have questions about your rental reservation, regional hub stations, or need roadside assistance? Reach our operations desk anytime.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              📧 Email Operations
            </span>
            <a 
              href="mailto:support@carrental.com" 
              className="text-white hover:underline text-sm font-semibold"
            >
              support@carrental.com
            </a>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              📞 Emergency Hotline (24/7 Dispatch)
            </span>
            <span className="text-white text-sm font-semibold">
              +91 7736563819
            </span>
          </div>

          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
              📍 Central Headquarters
            </span>
            <span className="text-neutral-300 text-sm">
              Terminal 3 Complex, Cochin International Airport, Kerala 683111
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Contact;
