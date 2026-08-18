import React from 'react';

const Hero = () => {
  return (
    <div className="hero">
      <img src="/hero-bg.jpg" alt="Luxury Hotel Resort" className="hero-bg" />
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="title">Experience Unparalleled Luxury</h1>
        <p className="subtitle">Discover world-class resorts and unforgettable moments curated just for you.</p>
        <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem' }}>
          Explore Hotels
        </button>
      </div>
    </div>
  );
};

export default Hero;
