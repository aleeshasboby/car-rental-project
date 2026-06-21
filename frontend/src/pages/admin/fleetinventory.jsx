// frontend/src/pages/admin/fleetinventory.jsx
import React, { useState, useEffect } from 'react';
import { getAllCars, deleteCar } from '../../services/carservice.js';

function FleetInventory() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFleet();
  }, []);

  const fetchFleet = async () => {
    try {
      setLoading(true);
      const data = await getAllCars();
      setCars(data);
    } catch (err) {
      alert('Failed to load fleet catalog data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (carId) => {
    if (!window.confirm('Are you absolutely sure you want to remove this vehicle from the active catalog inventory?')) return;
    try {
      await deleteCar(carId);
      alert('Vehicle removed from system matrix.');
      fetchFleet();
    } catch (err) {
      alert('Could not delete vehicle profile records.');
    }
  };

  // Filter cars array based on search input (Name or Brand matches)
  const filteredCars = cars.filter(car => 
    car.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif', width: '100%', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' }}>
      
      {/* Top Heading */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>🛞 Active Garage Ledger</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>View, track, and monitor individual parameters for all registered vehicle entries.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="🔍 Search fleet by model name, manufacturer, or class type..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', fontSize: '0.95rem' }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: '600' }}>
          Syncing full stack engine inventory profiles...
        </div>
      ) : (
        /* Full Width Display Container */
        <div style={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>VEHICLE VISUAL</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>CLASSIFICATION & NAME</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>FUEL METRIC</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>DAILY RATE</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem' }}>RENTAL STATUS</th>
                <th style={{ padding: '1rem', color: '#475569', fontWeight: '700', fontSize: '0.85rem', textAlign: 'center' }}>DESTRUCTION ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    No vehicle assets found matching your criteria inside this system matrix.
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    
                    {/* Column 1: Image Thumbnail */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <img 
                        src={car.image || 'https://via.placeholder.com/100'} 
                        alt={car.name} 
                        style={{ width: '80px', height: '50px', objectFit: 'contain', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }} 
                      />
                    </td>
                    
                    {/* Column 2: Brand and Name */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{car.brand} {car.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.15rem' }}>{car.type}</div>
                    </td>
                    
                    {/* Column 3: Fuel Type */}
                    <td style={{ padding: '0.75rem 1rem', color: '#475569', fontWeight: '500' }}>
                      ⛽ {car.fuelType}
                    </td>
                    
                    {/* Column 4: Cost */}
                    <td style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#4f46e5' }}>
                      <span>&#8377;</span>{car.rentPerDay}/day
                    </td>
                    
                    {/* Column 5: Operational Availability Status */}
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '9999px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        backgroundColor: car.isAvailable ? '#dcfce7' : '#fee2e2',
                        color: car.isAvailable ? '#15803d' : '#991b1b'
                      }}>
                        {car.isAvailable ? 'AVAILABLE' : 'RENTED / OUT'}
                      </span>
                    </td>
                    
                    {/* Column 6: Delete Button */}
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteClick(car._id)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          backgroundColor: '#fff',
                          border: '1px solid #ef4444',
                          color: '#ef4444',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#fef2f2' }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff' }}
                      >
                        Purge Asset
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default FleetInventory;