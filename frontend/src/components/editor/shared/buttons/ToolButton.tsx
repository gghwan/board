interface ToolButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ToolButton = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  size = 'md'
}: ToolButtonProps) => {
  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`
        rounded-lg transition-colors
        ${sizeClasses[size]}
        ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <i className={`fas fa-${icon}`} />
    </button>
  );
};

export default ToolButton;
