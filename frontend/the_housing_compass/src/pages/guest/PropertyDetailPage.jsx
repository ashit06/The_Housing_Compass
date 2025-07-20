import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useListings } from '../../hooks/useListings';
import PropertyMap from '../../components/PropertyMap';
import PriceHistoryChart from '../../components/PriceHistoryChart';
import ScoreBadge from '../../components/ScoreBadge';
import ImageGallery from '../../components/ImageGallery';
import RealtorInfo from '../../components/RealtorInfo';
import SimpleToast from '../../components/utility/SimpleToast';
import FavoriteButton from '../../components/buttons/FavoriteButton';
import ScheduleButton from '../../components/buttons/ScheduleButton';
import RoiCalculatorButton from '../../components/buttons/RoiCalculatorButton';
import './styles/PropertyDetailPage.css';
import { useAuth } from '../../contexts/AuthContext';

// Insights Modal Component
const InsightsModal = ({ property, onClose }) => {
  // This is where you would get the real response from an analysis engine
  const insights = {
    title: `Investment Analysis: ${property.title}`,
    summary: `This property presents a strong investment opportunity, particularly for long-term growth. Its location in ${property.city}, combined with a solid price history, indicates stability and high demand.`,
    pros: [
      `Location: Situated in ${property.street_address}, a high-demand area with appreciating property values.`,
      `Price Point: The current price of ₹${property.current_price.toLocaleString('en-IN')} is competitive for its size (${property.square_feet} sqft).`,
      `Growth Potential: The neighborhood shows a consistent upward trend in property values over the last 3 years.`
    ],
    cons: [
      `Market Volatility: While currently stable, the broader real estate market could see fluctuations.`,
      `Initial Investment: The property requires a significant upfront investment, which may be a barrier for some.`
    ],
    recommendation: `Recommendation: Favorable. We recommend this property for investors with a medium to long-term horizon. The potential for rental income and capital appreciation is high. We suggest conducting a final physical inspection.`
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>{insights.title}</h2>
        <p className="insights-summary">{insights.summary}</p>
        
        <h3>Potential Upsides</h3>
        <ul>
          {insights.pros.map((pro, index) => <li key={index} className="insight-pro">{pro}</li>)}
        </ul>

        <h3>Points to Consider</h3>
        <ul>
          {insights.cons.map((con, index) => <li key={index} className="insight-con">{con}</li>)}
        </ul>
        
        <p className="insights-recommendation">{insights.recommendation}</p>
        <p className="disclaimer">Disclaimer: This analysis is for informational purposes only. Consult with a financial advisor.</p>
      </div>
    </div>
  );
};


const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings: property, loading, error } = useListings(parseInt(id));
  const [toastMessage, setToastMessage] = useState('');
  const [propertyUrl, setPropertyUrl] = useState('');
  const [isInternalNavigation, setIsInternalNavigation] = useState(false);
  const { currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

  useEffect(() => {
    setPropertyUrl(window.location.href);
    if (document.referrer && new URL(document.referrer).origin === window.location.origin) {
      setIsInternalNavigation(true);
    }
  }, []);

  const handleBackClick = () => {
    if (isInternalNavigation) navigate(-1);
    else navigate('/properties');
  };

  const handleFeatureClick = (e) => {
    if (!currentUser) {
      e.preventDefault();
      setToastMessage('Please log in or register to use this feature.');
      return false;
    }
    return true;
  };

  const handleInsightsClick = (e) => {
    if (handleFeatureClick(e)) {
      setIsModalOpen(true); // Open the modal if the user is logged in
    }
  };

  if (loading) return <div className="loading">Loading property details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!property) return <div className="error">Property not found</div>;

  const imageUrls = [property.image_url, property.image_url, property.image_url].filter(Boolean);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', minimumFractionDigits: 0,
    }).format(price);
  };

  const realtorDetails = {
    name: 'Arpit Agrahari',
    phone: '987-654-3210',
    email: 'arpit@thehousingcompass.com',
    propertiesListed: 42,
    experience: 5,
    degree: 'B.Tech',
    rating: 4.9,
    imageUrl: 'https://placehold.co/100x100/2d3748/ffffff/png?text=AA&font=lato'
  };

  return (
    <div className="property-detail-page">
      <button className="back-button" onClick={handleBackClick}>
        ← Back to Properties
      </button>

      <div className="property-detail-container">
        {/* Left Column*/}
        <div className="property-left-section">
          <div className="property-info-container">
            <div className="property-images">
              <ImageGallery images={imageUrls} alt={property.title} />
            </div>
            <div className="property-header">
              <h1>{property.title}</h1>
              <p className="price">{formatPrice(property.current_price)}</p>
              <p className="location">{property.street_address}, {property.city}, {property.province}</p>
            </div>
            <div className="property-features">
              <span>{property.bedrooms} beds</span>
              <span>{property.bathrooms} baths</span>
              <span>{property.square_feet?.toLocaleString('en-IN')} sqft</span>
            </div>
            <div className="description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>
          </div>

          {property && (
            <div className="social-section">
              <h3>Share this Property</h3>
              <div className="social-buttons">
                <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`, '_blank', 'noopener,noreferrer'); }} className="social-button facebook" aria-label="Share on Facebook">
                  <i className="fab fa-facebook-f" style={{ paddingLeft: "3px", paddingRight: "2.5px" }}></i>
                </a>
                {/* Twitter icon changed to X */}
                <a href="#" onClick={(e) => { e.preventDefault(); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(propertyUrl)}&text=${encodeURIComponent(property.title)}`, '_blank', 'noopener,noreferrer'); }} className="social-button twitter" aria-label="Share on X">
                  <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#" onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(propertyUrl); setToastMessage("Link copied! Paste it in your Instagram story."); window.open("https://www.instagram.com/create/story", "_blank"); }} className="social-button instagram" aria-label="Share on Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                {/* TikTok button removed */}
                <button onClick={() => { navigator.clipboard.writeText(propertyUrl); setToastMessage("Link copied to clipboard!"); }} className="social-button copy-link" aria-label="Copy link">
                  <i className="fas fa-link"></i>
                </button>
              </div>
            </div>
          )}

          <div className="realtor-info-separator"></div>
          <RealtorInfo realtor={realtorDetails} />
        </div>

        {/* Right Column */}
        <div className="property-right-section">
          <div className="property-location">
            <h3>Location & Walkability Scores</h3>
            <div className="location-content">
              <div className="walkability-scores">
                <ScoreBadge streetAddress={property.street_address} city={property.city} province={property.province} />
              </div>
              <div className="map-container">
                <PropertyMap property={property} />
              </div>
            </div>
          </div>

          {property.price_histories && (
            <div className="price-history-section">
              <PriceHistoryChart priceHistory={property.price_histories[0].price_values} />
            </div>
          )}

          <div className="contact-section">
            <button className="action-button insights-button" onClick={handleInsightsClick}>
              <i className="fas fa-chart-line"></i> Investment Insights
            </button>
            <ScheduleButton onClick={handleFeatureClick} />
            <RoiCalculatorButton onClick={handleFeatureClick} />
            <FavoriteButton onClick={handleFeatureClick} />
          </div>
        </div>
      </div>

      {toastMessage && (<SimpleToast message={toastMessage} onClose={() => setToastMessage('')} />)}
      
      {isModalOpen && <InsightsModal property={property} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default PropertyDetailPage;