// frontend/src/pages/admin/addcar.jsx
import React, { useState, useEffect } from 'react';
import { addCar, getAllHubs } from '../../services/carservice.js';

function AddCar() {
  const [hubs, setHubs] = useState([]);
  const [loadingHubs, setLoadingHubs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', 
    brand: '', 
    type: 'Sedan', 
    fuelType: 'Petrol', 
    rentPerDay: '', 
    image: '', 
    hub: '' 
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const hubList = await getAllHubs();
        if (Array.isArray(hubList)) {
          setHubs(hubList);
          if (hubList.length > 0) {
            setFormData((prev) => ({ ...prev, hub: hubList[0]._id }));
          }
        }
      } catch (err) {
        console.error("Hub synchronization tracking error:", err);
      } finally {
        setLoadingHubs(false);
      }
    };
    fetchLocations();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hub) {
      alert('Please wait for hubs to load or assign an operational terminal hub!');
      return;
    }
    try {
      setSubmitting(true);
      await addCar(formData);
      alert('New vehicle successfully added and deployed to hub station.');
      setFormData({
        name: '', 
        brand: '', 
        type: 'Sedan', 
        fuelType: 'Petrol', 
        rentPerDay: '', 
        image: '', 
        hub: hubs[0]?._id || ''
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving vehicle profile to system database.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Deploy New Fleet Asset
        </h1>
        <p className="text-neutral-400 text-sm mt-1">
          Add an authorized vehicle profile directly into an active terminal hub bay.
        </p>
      </div>
      
      <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/60">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Hub Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Operational Hub Terminal Assignment
            </label>
            {loadingHubs ? (
              <div className="text-xs text-neutral-500 py-3">Syncing pickup terminals...</div>
            ) : (
              <select 
                name="hub" 
                value={formData.hub} 
                onChange={handleChange} 
                required
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors"
              >
                {hubs.length === 0 && <option value="">No active hubs discovered in database</option>}
                {hubs.map((hub) => (
                  <option key={hub._id} value={hub._id} className="bg-neutral-900 text-white">
                    {hub.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Car Model Name
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g., Thar 4x4, Model S, Fortuner"
              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder-neutral-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Vehicle Manufacturer / Brand
            </label>
            <input 
              type="text" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              required 
              placeholder="e.g., Mahindra, Tesla, Toyota"
              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder-neutral-500" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Classification Class
              </label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Powertrain
              </label>
              <select 
                name="fuelType" 
                value={formData.fuelType} 
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Daily Rental Rate (₹)
            </label>
            <input 
              type="number" 
              name="rentPerDay" 
              value={formData.rentPerDay} 
              onChange={handleChange} 
              required 
              placeholder="2500"
              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder-neutral-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Vehicle Image URL (or emoji fallback)
            </label>
            <input 
              type="text" 
              name="image" 
              value={formData.image} 
              onChange={handleChange} 
              required 
              placeholder="https://images.unsplash.com/... or 🚙"
              className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-white transition-colors placeholder-neutral-500" 
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-extrabold text-sm rounded-xl cursor-pointer border-none transition-all shadow-xl shadow-white/5 mt-4 disabled:opacity-50"
          >
            {submitting ? 'Registering Asset...' : '+ Deploy Asset to Hub'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddCar;
