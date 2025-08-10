'use client';
import { useRegion } from './RegionContext';

export default function RegionSelector() {
  const { selectedRegion, setSelectedRegion, regions } = useRegion();
  
  return (
    <select
      className="border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 px-2 py-1"
      value={selectedRegion.code}
      onChange={e => {
        const region = regions.find(r => r.code === e.target.value)!;
        setSelectedRegion(region);
      }}
    >
      {regions.map(r => (
        <option key={r.code} value={r.code}>
          {r.flag} {r.code}
        </option>
      ))}
    </select>
  );
}
