// src/pages/admin/managecars.jsx
import React, { useState } from 'react';

function ManageCars() {
  // 1. Local state acting as our temporary database fleet array
  const [cars, setCars] = useState([
    { id: 1, name: 'Tesla Model S', price: 90, type: 'Luxury' },
    { id: 2, name: 'Ford Explorer', price: 75, type: 'SUV' },
    { id: 3, name: 'Honda Civic', price: 40, type: 'Economy' },
  ]);

  // 2. Form states to capture input for a new vehicle
  const [carName, setCarName] = useState('');
  const [carPrice, setCarPrice] = useState('');
  const [carType, setCarType] = useState('Luxury');

  // 3. Handler to inject a new car into our fleet state
  const handleAddCar = (e) => {
    e.preventDefault();
    if (!carName || !carPrice) return;

    const newCar = {
      id: Date.now(), // Generate a unique temporary ID
      name: carName,
      price: parseFloat(carPrice),
      type: carType,
    };

    setCars([...cars, newCar]);
    
    // Clear the form inputs
    setCarName('');
    setCarPrice('');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
        Vehicle Inventory Management
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Form to Add a New Car */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155' }}>
            Add New Vehicle to Fleet
          </h3>
          <form onSubmit={handleAddCar} style={{ display: 'flex', flexStack: 'column', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Car Model Name</label>
              <input 
                type="text" 
                placeholder="e.g., BMW M4"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                style={{ w: '100%', width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Daily Rental Rate (₹)</label>
              <input 
                type="number" 
                placeholder="e.g., 99"
                value={carPrice}
                onChange={(e) => setCarPrice(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.25rem' }}>Category Classification</label>
              <select 
                value={carType} 
                onChange={(e) => setCarType(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff' }}
              >
                <option value="Luxury">Luxury</option>
                <option value="SUV">SUV</option>
                <option value="Economy">Economy</option>
              </select>
            </div>

            <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>
              + Confirm & Add Vehicle
            </button>
          </form>
        </div>

        {/* Right Column: Active Inventory List Table */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#334155' }}>
            Live Inventory List ({cars.length} Cars)
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                <th style={{ paddingBottom: '0.5rem' }}>Model</th>
                <th style={{ paddingBottom: '0.5rem' }}>Type</th>
                <th style={{ paddingBottom: '0.5rem' }}>Rate</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0', fontWeight: '500', color: '#1e293b' }}>{car.name}</td>
                  <td style={{ padding: '0.75rem 0', color: '#64748b' }}>{car.type}</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: '600', color: '#059669' }}>${car.price}/day</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default ManageCars;