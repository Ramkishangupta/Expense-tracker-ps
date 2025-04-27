import PropTypes from 'prop-types';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import React from 'react';

const SummaryCard = ({ title, value, icon, color, subtitle, change, className = '', hoverEffect = true }) => {
  // Format the value as currency if it's a number
  const formattedValue = typeof value === 'number'
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }).format(value)
    : value;

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-5 overflow-hidden relative ${hoverEffect ? 'card-hover-effect' : ''} ${className}`}
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex justify-between items-start">
        <div className="z-10">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold mt-1 text-gray-800 truncate">{formattedValue}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
          {change !== undefined && (
            <div className={`text-xs sm:text-sm font-medium mt-2 flex items-center ${
              change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {change > 0 ? <FaArrowUp className="mr-1" /> : change < 0 ? <FaArrowDown className="mr-1" /> : ''}
              {Math.abs(change)}%
              {change !== 0 && <span className="ml-1">{change > 0 ? 'increase' : 'decrease'}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div 
            className="p-3 rounded-full text-white flex items-center justify-center" 
            style={{ backgroundColor: color }}
          >
            {icon}
          </div>
        )}
      </div>
      {/* Add subtle background decoration */}
      <div 
        className="absolute right-0 bottom-0 opacity-5"
        style={{ transform: 'translate(20%, 20%)', color }}
      >
        {icon && React.cloneElement(icon, { size: 80 })}
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  color: PropTypes.string,
  subtitle: PropTypes.string,
  change: PropTypes.number,
  className: PropTypes.string,
  hoverEffect: PropTypes.bool,
};

SummaryCard.defaultProps = {
  color: '#6366f1', // indigo-600 in hex
  className: '',
};

export default SummaryCard; 