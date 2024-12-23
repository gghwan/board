interface IconButtonProps {
  icon: string;
  onClick?: () => void;
  isActive?: boolean;
  title?: string;
  className?: string;
}

const IconButton = ({ 
  icon, 
  onClick, 
  isActive = false, 
  title,
  className = ''
}: IconButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`
        p-2 rounded-md transition-colors
        ${isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}
        ${className}
      `}
    >
      <i className={`fas fa-${icon}`} />
    </button>
  );
};

export default IconButton;
