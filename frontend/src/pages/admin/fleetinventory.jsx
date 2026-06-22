// frontend/src/pages/admin/fleetinventory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Syncing secure fleet inventory ledger...</div>;
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>📋 Active Fleet Inventory</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Full analytical ledger overview of all vehicles currently deployed to active hubs.</p>
      </div>

      <div style={{ width: '100%', overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Vehicle Image</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Vehicle Details</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Classification</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Fuel Type</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Daily Rate</th>
              <th style={{ padding: '1rem', fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No vehicles currently registered in the database.</td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car._id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' }}>
                  <td style={{ padding: '1rem' }}>
                    <img 
                      src={car.image || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=150'} 
                      alt={car.name} 
                      style={{ width: '100px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                    />
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{car.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.15rem' }}>{car.brand}</div>
                  </td>
                  <td style={{ padding: '1rem', color: '#334155', fontSize: '0.95rem' }}>{car.type}</td>
                  <td style={{ padding: '1rem', color: '#334155', fontSize: '0.95rem' }}>{car.fuelType}</td>
                  <td style={{ padding: '1rem', fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>
                    ₹{Number(car.rentPerDay).toLocaleString('en-IN')}/day
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.35rem 0.75rem', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      fontWeight: '700', 
                      backgroundColor: car.isAvailable !== false ? '#d1fae5' : '#fee2e2', 
                      color: car.isAvailable !== false ? '#065f46' : '#991b1b' 
                    }}>
                      {car.isAvailable !== false ? 'AVAILABLE' : 'RENTED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageCars;