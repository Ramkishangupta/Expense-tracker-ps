import PropTypes from 'prop-types';

const Card = ({ title, children, className = '', titleAction, hoverEffect = true }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden ${hoverEffect ? 'card-hover-effect' : ''} ${className}`}>
      {title && (
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          {titleAction && <div>{titleAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  titleAction: PropTypes.node,
  hoverEffect: PropTypes.bool,
};

export default Card; 