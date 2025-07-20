import './styles/AboutPage.css';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Navigate the Real Estate Market with <span className="gradient-text">Clarity & Confidence</span>
          </h1>
          <p className="hero-subtitle">
            The Housing Compass is your guide, transforming complex market data into clear, actionable insights so you can find the perfect property.
          </p>
        </div>
        <div className="hero-visual">
          {/* A more fitting animation for a compass theme could be used here */}
          <div className="ai-animation">
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <h2 className="section-title">How We Guide You</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🧭</div>
              <h3>Clear Direction</h3>
              <p>Our intelligent platform filters out the noise, matching you with properties based on your unique lifestyle and goals.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">📈</div>
              <h3>Deep Analysis</h3>
              <p>We provide in-depth market analysis, value projections, and neighborhood scoring to empower your decisions.</p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💡</div>
              <h3>Confident Choices</h3>
              <p>We turn complex data into straightforward advice, helping you anticipate market shifts and invest smarter.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section">
        <div className="container">
          <h2 className="section-title">Powered by Smart Technology</h2>
          <div className="tech-features">
            <div className="tech-feature">
              <div className="feature-header">
                <span className="feature-tag">Predictive Analytics</span>
                <h4>Accurate Valuation Guidance</h4>
              </div>
              <p>Our models analyze hundreds of variables to provide property valuations with high accuracy, giving you a key negotiating tool.</p>
            </div>
            <div className="tech-feature">
              <div className="feature-header">
                <span className="feature-tag">Data Science</span>
                <h4>Holistic Property Scoring</h4>
              </div>
              <p>Our algorithms assess not just the price, but location, quality, and investment potential for a complete picture.</p>
            </div>
            <div className="tech-feature">
              <div className="feature-header">
                <span className="feature-tag">Intuitive AI</span>
                <h4>Personalized Search</h4>
              </div>
              <p>Our smart search understands your needs, delivering results that are genuinely relevant to you and your family.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Properties Analyzed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Analysis Accuracy</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">12K+</div>
              <div className="stat-label">Guided Decisions</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">200+</div>
              <div className="stat-label">Data Points per Listing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Note Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">A Note from the Founder</h2>
          <div className="team-grid">
            <div className="team-member founder-note">
              <div className="member-avatar">AA</div>
              <h4>Arpit Agrahari</h4>
              <p className="member-role">Founder, The Housing Compass</p>
              <p className="member-bio">"I started The Housing Compass with a simple goal: to replace confusion with confidence in the real estate journey. My vision is to empower everyone with the clear, data-driven insights they need to find not just a house, but a place they can truly call home. I hope our platform serves as your trusted guide."</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Chart Your Course?</h2>
            <p>Join thousands of users making smarter, data-driven housing decisions with The Housing Compass.</p>
            <div className="cta-buttons">
              <Link to="/properties">
                <button className="btn-primary">Begin Your Journey</button>
              </Link>
              <Link to="/register">
                <button className="btn-secondary">Create an Account</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;