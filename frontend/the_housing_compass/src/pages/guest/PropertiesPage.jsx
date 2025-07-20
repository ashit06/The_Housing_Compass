import { useListings } from '../../hooks/useListings';
import ListingCard from '../../components/ListingCard';
import './styles/PropertiesPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import PropertySearchBox from '../../components/PropertySearchBox';
import { useState, useRef, useMemo, useEffect } from 'react';

const PropertiesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const pageParam = parseInt(params.get('page'), 10) || 1;
  const cityParam = params.get('city') || '';

  const { listings, loading, error } = useListings(cityParam);

  // --- State Management for Filters ---
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState(null);
  const [sortBy, setSortBy] = useState('recommended');

  const [viewMode, setViewMode] = useState('grid');
  const [gridLayout, setGridLayout] = useState('three-col');
  const [currentPage, setCurrentPage] = useState(pageParam);
  const listingsSectionRef = useRef(null);

  // --- Filtering and Sorting Logic ---
  const filteredAndSortedListings = useMemo(() => {
    let result = [...listings];

    if (minPrice) {
      result = result.filter(l => parseFloat(l.current_price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter(l => parseFloat(l.current_price) <= parseFloat(maxPrice));
    }
    if (bedrooms) {
      if (bedrooms === '5+') {
        result = result.filter(l => l.bedrooms >= 5);
      } else {
        result = result.filter(l => l.bedrooms === parseInt(bedrooms));
      }
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.current_price) - parseFloat(b.current_price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.current_price) - parseFloat(a.current_price));
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return result;
  }, [listings, minPrice, maxPrice, bedrooms, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, bedrooms, sortBy]);

  const averagePrice = useMemo(() => {
    if (!filteredAndSortedListings || filteredAndSortedListings.length === 0) return 0;
    const total = filteredAndSortedListings.reduce((sum, listing) => sum + parseFloat(listing.current_price), 0);
    return total / filteredAndSortedListings.length;
  }, [filteredAndSortedListings]);
  
  const formatToRupeesCompact = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value);
  };

  const getItemsPerPage = () => (gridLayout === 'two-col' ? 6 : 9);
  const itemsPerPage = getItemsPerPage();
  const totalPages = Math.ceil(filteredAndSortedListings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = filteredAndSortedListings.slice(startIndex, endIndex);

  const handleLayoutChange = (layout) => {
    setGridLayout(layout);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', String(newPage));
      navigate({ search: searchParams.toString() }, { replace: true });
    }
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setBedrooms(null);
    setSortBy('recommended');
    setCurrentPage(1);
  };

  const PaginationControls = () => (
    !loading && !error && filteredAndSortedListings.length > 0 && totalPages > 1 && (
        <div className="pagination-container">
            <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredAndSortedListings.length)} of {filteredAndSortedListings.length} properties
            </div>
            <div className="pagination-controls">
            <button className="pagination-btn prev" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                ← Previous
            </button>
            <div className="page-numbers">
                {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return <button key={pageNum} className={`page-btn ${currentPage === pageNum ? 'active' : ''}`} onClick={() => handlePageChange(pageNum)}>{pageNum}</button>;
                })}
            </div>
            <button className="pagination-btn next" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Next →
            </button>
            </div>
      </div>
    )
  );

  return (
    <div className="properties-page">
      <PropertySearchBox
        initialValue={cityParam}
        onSubmit={city => {
          const trimmed = city.trim();
          navigate(trimmed ? `/properties/?city=${encodeURIComponent(trimmed)}` : '/properties');
          listingsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
      <div className="filters-section-container">
        <div className="filters-section">
          <div className="container">
            <div className="filters-header">
              <h3>Filter & Sort</h3>
              <span className="results-count">{filteredAndSortedListings.length} properties found</span>
            </div>
            <div className="filters-grid">
              <div className="filter-group">
                <label>Price Range</label>
                <div className="price-range">
                  <input type="number" placeholder="Min price" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
                  <span>to</span>
                  <input type="number" placeholder="Max price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
                </div>
              </div>
              <div className="filter-group">
                <label>Bedrooms</label>
                <div className="bedroom-pills">
                  {[1, 2, 3, 4, '5+'].map(num => (
                    <button key={num} className={`pill-btn ${bedrooms === num ? 'active' : ''}`} onClick={() => setBedrooms(num)}>{num}</button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <label>Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              <div className="filter-group reset-group">
                <button className="reset-btn" onClick={handleResetFilters}>Reset Filters</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="properties container" ref={listingsSectionRef}>
        <div className="section-header">
          <div className="header-content">
            <h2>Featured Properties {cityParam && `in ${cityParam}`}</h2>
            <p>Discover top investment opportunities selected by our analysis</p>
          </div>
          <div className="property-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredAndSortedListings.length}</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">95%</span>
              <span className="stat-label">Match Rate</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{formatToRupeesCompact(averagePrice)}</span>
              <span className="stat-label">Avg. Value</span>
            </div>
          </div>
        </div>
        <div className="view-controls">
          <div className="view-toggle">
            <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
              <span className="icon">⊞</span> Grid View
            </button>
            <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
              <span className="icon">🗺️</span> Map View
            </button>
          </div>
          {viewMode === 'grid' && (
            <div className="layout-options">
              <button className={`layout-btn ${gridLayout === 'two-col' ? 'active' : ''}`} onClick={() => handleLayoutChange('two-col')} title="2 columns">⊞⊞</button>
              <button className={`layout-btn ${gridLayout === 'three-col' ? 'active' : ''}`} onClick={() => handleLayoutChange('three-col')} title="3 columns">⊞⊞⊞</button>
            </div>
          )}
        </div>
        
        {viewMode === 'grid' && <PaginationControls />}
        
        {viewMode === 'map' ? (
          <div className="development-message">
            <div className="development-icon">🚧</div>
            <h3>Map View Coming Soon!</h3>
            <p>We're working hard to bring you an interactive map experience.</p>
            <button className="switch-to-grid-btn" onClick={() => setViewMode('grid')}>
              <span className="icon">⊞</span> Switch to Grid View
            </button>
          </div>
        ) : (
          <div className={`property-grid ${gridLayout}`}>
            {loading ? (
              <div className="loading-container"><div className="loading-spinner"></div><p>Loading...</p></div>
            ) : error ? (
              <div className="error-container"><h3>Oops! Something went wrong</h3><p>{error}</p></div>
            ) : filteredAndSortedListings.length === 0 ? (
              <div className="empty-state"><h3>No properties found</h3><p>Try adjusting your filters or searching for a different city.</p></div>
            ) : (
              currentListings.map(listing => <ListingCard key={listing.id} listing={listing} />)
            )}
          </div>
        )}
        
        {viewMode === 'grid' && <PaginationControls />}
      </section>
    </div>
  );
};

export default PropertiesPage;