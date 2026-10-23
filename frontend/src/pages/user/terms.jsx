// frontend/src/pages/user/terms.jsx
import React from 'react';
import { motion } from 'framer-motion';

function Terms() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-[#0a0a0a] text-white py-16 px-6"
    >
      <div className="max-w-3xl mx-auto bg-[#141414] p-8 sm:p-12 rounded-3xl border border-neutral-800 shadow-2xl shadow-black/80">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          Welcome to CarGo Mobility. Please read these operating guidelines and terms carefully before reserving fleet vehicles.
        </p>

        <div className="border-t border-neutral-800 my-6" />

        <div className="space-y-6 text-sm text-neutral-300">
          <div>
            <h3 className="text-lg font-bold text-white mb-2">1. Driver Eligibility & Verification</h3>
            <p className="text-neutral-400 leading-relaxed">
              Users must possess a valid regional or international driver's license matching Indian transportation regulations and present government identification matching their registered account profile upon vehicle collection.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">2. Geofencing & Hub Station Return</h3>
            <p className="text-neutral-400 leading-relaxed">
              Vehicles are assigned to specific transit terminal hubs equipped with automated key stations. Vehicles must be returned to the agreed destination terminal bay unless an express cross-hub transfer has been confirmed.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">3. Fuel & Vehicle Condition</h3>
            <p className="text-neutral-400 leading-relaxed">
              Vehicles must be returned in commensurate condition with full-to-full or equal baseline fuel/charge levels. All assets are inspected via terminal cameras upon bay check-in.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white mb-2">4. Digital Privacy & Security</h3>
            <p className="text-neutral-400 leading-relaxed">
              Account telemetry, GPS dispatch coordinates, and contact records are handled under strict encryption standards in accordance with our data protection policies.
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

export default Terms;
