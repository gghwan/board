import PropTypes from 'prop-types';

const FileIcon = ({ type, className = '' }) => {
  const iconClass = {
    image: 'fa-image',
    pdf: 'fa-file-pdf',
    word: 'fa-file-word',
    text: 'fa-file-text',
    drawing: 'fa-draw-polygon'
  }[type] || 'fa-file';

  return <i className={`fas ${iconClass} ${className}`} />;
};

FileIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string
};

export default FileIcon;