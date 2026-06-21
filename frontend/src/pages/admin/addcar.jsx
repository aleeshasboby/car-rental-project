// frontend/src/pages/admin/addcar.jsx
import React, { useState, useEffect } from 'react';
import { addCar, getAllHubs } from '../../services/carservice.js';

function AddCar() {
  const [hubs, setHubs] = useState([]);
  const [loadingHubs, setLoadingHubs] = useState(true);
  
  // Structured form state tracking
  const [formData, setFormData] = useState({
    name: '', 
    brand: '', 
    type: 'Sedan', 
    fuelType: 'Petrol', 
    rentPerDay: '', 
    image: '', 
    hub: '' // Stores the selected Hub's relational MongoDB ObjectId reference string
  });

  // Pull all active station hubs from the database on page mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const hubList = await getAllHubs();
        
        // Safety Fallback Check: Make sure the response structure is a valid array matrix
        if (Array.isArray(hubList)) {
          setHubs(hubList);
          // Automatically default our form selection to the first hub in the matrix list
          if (hubList.length > 0) {
            setFormData(prev => ({ ...prev, hub: hubList[0]._id }));
          }
        }
      } catch (err) {
        console.error("Hub synchronization tracking error:", err);
        // Only alert if there's a hard connectivity error, ignoring empty collections
        if (err.response) {
          alert(`Server Error (${err.response.status}): Failed to locate active rental station hubs.`);
        }
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
      alert('Please wait for hubs to load or create an operational terminal hub first!');
      return;
    }
    try {
      await addCar(formData);
      alert('New vehicle successfully added and deployed to hub station! 🚗✨');
      
      // Reset input text lines safely, preserving the active hub selection reference pointer
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
      alert('Error saving vehicle configuration profile to system database.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>✨ Deploy New Fleet Asset</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Inject a vehicle profile directly into an operational station layout sector.</p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Dynamic Dropdown Select Interface replacing messy manual input text strings */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Operational Hub Assignment</label>
          {loadingHubs ? (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>Syncing pickup terminals from grid...</div>
          ) : (
            <select 
              name="hub" 
              value={formData.hub} 
              onChange={handleChange} 
              required
              style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', backgroundColor: '#fff', fontSize: '0.95rem' }}
            >
              {hubs.length === 0 && <option value="">No active hubs discovered inside database matrix</option>}
              {hubs.map(hub => (
                <option key={hub._id} value={hub._id}>{hub.name}</option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Car Model Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', marginTop: '0.25rem', fontSize: '0.95rem' }} placeholder="e.g., Thar, Model 3, Fortuner" />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Manufacturer Brand</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', marginTop: '0.25rem', fontSize: '0.95rem' }} placeholder="e.g., Mahindra, Tesla, Toyota" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Classification Class</label>
            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', backgroundColor: '#fff', fontSize: '0.95rem' }}>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Fuel Classification</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', marginTop: '0.25rem', backgroundColor: '#fff', fontSize: '0.95rem' }}>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Daily Rental Cost (₹)</label>
          <input type="number" name="rentPerDay" value={formData.rentPerDay} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', marginTop: '0.25rem', fontSize: '0.95rem' }} placeholder="e.g., 2500" />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Vehicle Catalog Image Link</label>
          <input type="text" name="image" value={formData.image} onChange={handleChange} required style={{ width: '100%', padding: '0.65rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box', marginTop: '0.25rem', fontSize: '0.95rem' }} placeholder="https://images.unsplash.com/your-car-image.png" />
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.85rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '1rem', cursor: 'pointer', marginTop: '1rem', transition: 'background-color 0.2s' }}>
          + Deploy New Vehicle Assets
        </button>
      </form>
    </div>
  );
}

export default AddCar;