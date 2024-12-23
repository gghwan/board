import { useState } from 'react';
import Dropdown from './Dropdown';
import ColorPicker from '../inputs/ColorPicker';
import ToolButton from '../buttons/ToolButton';

interface ColorDropdownProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

const ColorDropdown = ({ value, onChange, label = '색상' }: ColorDropdownProps) => {
  const [color, setColor] = useState(value);

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  return (
    <Dropdown
      trigger={
        <ToolButton
          icon="palette"
          label={label}
          isActive={false}
        />
      }
    >
      <div className="p-2">
        <ColorPicker value={color} onChange={handleChange} />
      </div>
    </Dropdown>
  );
};

export default ColorDropdown;
