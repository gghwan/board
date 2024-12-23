import React from 'react';
import PropTypes from 'prop-types';
import FilePreview from './FilePreview';

const FilePreviewGrid = ({ files, onPreview, onDelete }) => {
  if (!files?.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {files.map((file, index) => (
        <FilePreview
          key={index}
          file={file}
          onPreview={() => onPreview(file)}
          onDelete={onDelete ? () => onDelete(index) : undefined}
          previewMode="thumbnail"
          className="aspect-[4/3]"
        />
      ))}
    </div>
  );
};

FilePreviewGrid.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      url: PropTypes.string,
      localUrl: PropTypes.string
    })
  ).isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func
};

export default FilePreviewGrid;
