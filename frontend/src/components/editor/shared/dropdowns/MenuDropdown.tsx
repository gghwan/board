import Dropdown from './Dropdown';
import MenuButton from '../buttons/MenuButton';

interface MenuItem {
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

interface MenuDropdownProps {
  trigger: React.ReactNode;
  items: MenuItem[];
}

const MenuDropdown = ({ trigger, items }: MenuDropdownProps) => {
  return (
    <Dropdown trigger={trigger}>
      <div className="py-1">
        {items.map((item, index) => (
          <MenuButton key={index} {...item} />
        ))}
      </div>
    </Dropdown>
  );
};

export default MenuDropdown;
