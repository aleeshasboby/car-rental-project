// frontend/src/pages/user/contact.jsx
import React from 'react';

function Contact() {
  return (
    <div style={{ 
      minHeight: '80vh', 
      padding: '4rem 2rem', 
      backgroundColor: '#000000', // Pure absolute black background
      fontFamily: 'sans-serif', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
      
      {/* Main Card Wrapper - True deep charcoal black */}
      <div style={{ 
        maxWidth: '600px', 
        width: '100%', 
        backgroundColor: '#121212', 
        padding: '2.5rem', 
        borderRadius: '16px', 
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)', 
        border: '1px solid #262626' // Minimal dark grey border
      }}>
        
        {/* Main Header Title - Pure stark white */}
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#ffffff', margin: '0 0 1rem 0' }}>
          Contact Support
        </h2>
        
        {/* Paragraph Description - Soft clear grey text */}
        <p style={{ color: '#a3a3a3', lineHeight: '1.6', marginBottom: '2rem' }}>
          Have questions about your rental booking or regional hub locations? Get in touch with our team.
        </p>
        
        {/* Email Support Panel Box */}
        <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #262626' }}>
          <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>📧 Email Support</strong>
          <a href="mailto:support@carrental.com" style={{ color: '#ffffff', textDecoration: 'underline', fontWeight: '500' }}>
            support@carrental.com
          </a>
        </div>
        
        {/* Emergency Hotline Panel Box */}
        <div style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #262626' }}>
          <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.25rem' }}>📞 Emergency Hotline</strong>
          <span style={{ color: '#e5e5e5', fontWeight: '500' }}>
            +91 7736563819
          </span>
        </div>

      </div>
    </div>
  );
}

export default Contact;