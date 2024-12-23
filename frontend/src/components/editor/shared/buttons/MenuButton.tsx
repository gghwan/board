interface MenuButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const MenuButton = ({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false
}: MenuButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-2 px-3 py-2 w-full
        ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <i className={`fas fa-${icon} w-4`} />
      <span>{label}</span>
    </button>
  );
};

export default MenuButton;
