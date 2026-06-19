// frontend/src/pages/admin/addcar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewCar } from '../../services/carservice.js';

function AddCar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states mapped directly to your MongoDB Schema properties
  const [formData, setFormData] = useState({
    name: '',
    type: 'Sedan',
    pricePerDay: '',
    hubName: '',
    address: '',
    lat: '',
    lng: '',
    seats: '5',
    fuelType: 'Petrol',
    image: '🚗'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Structure the data to match the embedded coordinates schema object
    const cleanPayload = {
      name: formData.name,
      type: formData.type,
      pricePerDay: Number(formData.pricePerDay),
      hubName: formData.hubName,
      address: formData.address,
      coordinates: {
        lat: Number(formData.lat),
        lng: Number(formData.lng)
      },
      seats: Number(formData.seats),
      fuelType: formData.fuelType,
      image: formData.image
    };

    try {
      await addNewCar(cleanPayload);
      alert('Vehicle successfully registered into CarGo Database! 🎉');
      navigate('/'); // Redirect to browse or home page after creation
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to communicate with database server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>🔧 Fleet Management: Add New Car</h2>
      
      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Vehicle Name</label>
          <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g., Maruti Suzuki Swift" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Vehicle Category</label>
            <select name="type" value={formData.type} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
              <option value="Sedan">Sedan 🚗</option>
              <option value="SUV">SUV 🚙</option>
              <option value="Hatchback">Hatchback 🚗</option>
              <option value="Luxury">Luxury ✨</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Price Per Day (₹)</label>
            <input type="number" name="pricePerDay" required value={formData.pricePerDay} onChange={handleChange} placeholder="e.g., 1500" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Seats</label>
            <input type="number" name="seats" required value={formData.seats} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Fuel Type</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
              <option value="Petrol">Petrol ⛽</option>
              <option value="Diesel">Diesel ⛽</option>
              <option value="EV">Electric ⚡</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Garage Hub Name</label>
          <input type="text" name="hubName" required value={formData.hubName} onChange={handleChange} placeholder="e.g., Kattakada Junction Hub" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Full Hub Address</label>
          <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Full physical street layout description" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Hub Latitude</label>
            <input type="number" step="any" name="lat" required value={formData.lat} onChange={handleChange} placeholder="e.g., 8.5061" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Hub Longitude</label>
            <input type="number" step="any" name="lng" required value={formData.lng} onChange={handleChange} placeholder="e.g., 77.0805" style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '0.35rem' }}>Display Emoji Avatar</label>
          <select name="image" value={formData.image} onChange={handleChange} style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <option value="🚗">Standard Sedan (🚗)</option>
            <option value="🚙">Compact SUV (🚙)</option>
            <option value="🏎️">Premium Sports Car (🏎️)</option>
            <option value="🚐">Family Van (🚐)</option>
          </select>
        </div>

        <button type="submit" disabled={loading} style={{ backgroundColor: loading ? '#94a3b8' : '#16a34a', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontWeight: '700', fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '1rem' }}>
          {loading ? 'Writing to Engine Database...' : 'Register Vehicle to Inventory'}
        </button>

      </form>
    </div>
  );
}

export default AddCar;