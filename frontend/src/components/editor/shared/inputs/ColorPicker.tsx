interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: string[];
}

const defaultColors = [
  '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
  '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
  '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
];

const ColorPicker = ({ value, onChange, colors = defaultColors }: ColorPickerProps) => {
  return (
    <div className="color-picker">
      <div className="grid grid-cols-10 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-md border ${value === color ? 'ring-2 ring-blue-500' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full h-8"
      />
    </div>
  );
};

export default ColorPicker;
