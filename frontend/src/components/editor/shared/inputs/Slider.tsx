interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label
}: SliderProps) => {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-32"
      />
      <span className="text-sm text-gray-600 w-8">{value}</span>
    </div>
  );
};

export default Slider;
