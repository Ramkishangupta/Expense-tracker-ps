import PropTypes from 'prop-types';
import { 
  FaChartPie, 
  FaExchangeAlt, 
  FaTags, 
  FaChartLine,
  FaWallet
} from 'react-icons/fa';

const Sidebar = ({ activePage, setActivePage, isMobile }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartPie size={18} /> },
    { id: 'transactions', label: 'Transactions', icon: <FaExchangeAlt size={18} /> },
    { id: 'categories', label: 'Categories', icon: <FaTags size={18} /> },
    { id: 'budget', label: 'Budget', icon: <FaChartLine size={18} /> },
  ];

  const primaryColor = 'indigo-600';
  const secondaryColor = 'indigo-100';

  return (
    <aside className={`${isMobile ? 'w-full' : 'w-64'} bg-white shadow-md`}>
      {!isMobile && (
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center">
            <FaWallet className={`text-${primaryColor} mr-2`} size={22} />
            <h1 className={`text-xl font-bold text-${primaryColor}`}>Finance Tracker</h1>
          </div>
        </div>
      )}
      <nav className={isMobile ? "py-3" : "py-4"}>
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="mb-1 px-3">
              <button
                className={`flex items-center w-full px-4 py-3 text-left transition-colors rounded-lg ${
                  activePage === item.id
                    ? `bg-${secondaryColor} text-${primaryColor} font-medium`
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActivePage(item.id)}
              >
                <span className={`mr-3 ${activePage === item.id ? `text-${primaryColor}` : 'text-gray-500'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  activePage: PropTypes.string.isRequired,
  setActivePage: PropTypes.func.isRequired,
  isMobile: PropTypes.bool,
};

Sidebar.defaultProps = {
  isMobile: false,
};

export default Sidebar; 