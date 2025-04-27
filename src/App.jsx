import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Categories from './pages/Categories';
import { FaTimes, FaBars, FaWallet } from 'react-icons/fa';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'categories':
        return <Categories />;
      case 'budget':
        return <Budget />;
      default:
        return <Dashboard />;
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      {isMobile && (
        <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-10 border-b border-gray-100">
          <div className="flex items-center">
            <FaWallet className="text-indigo-600 mr-2" size={22} />
            <h1 className="text-xl font-bold text-indigo-600">Finance Tracker</h1>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-gray-600 focus:outline-none p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </header>
      )}

      {/* Sidebar - hidden on mobile unless menu is open */}
      <div 
        className={`${isMobile ? (isMobileMenuOpen ? 'block' : 'hidden') : 'block'} md:block md:sticky md:top-0 md:h-screen`}
      >
        <Sidebar
          activePage={activePage}
          setActivePage={handleNavigation}
          isMobile={isMobile}
        />
      </div>

      {/* Main content */}
      <main 
        className={`flex-1 overflow-y-auto p-4 md:p-6 ${isMobile && isMobileMenuOpen ? 'hidden' : 'block'}`}
        style={{ maxHeight: isMobile ? 'calc(100vh - 57px)' : '100vh' }}
      >
        {renderPage()}
        
        {/* Footer - copyright info */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Finance Tracker &copy; 2025</p>
        </div>
      </main>
    </div>
  );
}

export default App;
