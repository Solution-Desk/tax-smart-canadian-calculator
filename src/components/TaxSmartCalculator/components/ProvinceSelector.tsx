import { PROVINCE_LABELS, ProvinceCode } from '../data/rates';

type Props = {
  value: ProvinceCode;
  onChange: (p: ProvinceCode) => void;
  id?: string;
  className?: string;
};

export default function ProvinceSelector({ 
  value, 
  onChange, 
  id = 'province',
  className = ''
}: Props) {
  return (
    <label htmlFor={id} className="block">
      <span className="block mb-1 text-sm opacity-80">Province / Territory</span>
      <select
        id={id}
        className={`w-full rounded-xl px-3 py-3 bg-[#0f172a] border border-[#24304f] ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value as ProvinceCode)}
      >
        {Object.entries(PROVINCE_LABELS).map(([code, label]) => (
          <option key={code} value={code}>
            {label} ({code})
          </option>
        ))}
      </select>
    </label>
  );
}
