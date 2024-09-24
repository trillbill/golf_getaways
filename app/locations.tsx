import React from 'react';

const locations = [
  'North Carolina',
  'South Carolina',
  // 'Georgia',
  'Florida',
  'Arizona',
  'California',
  // 'Texas',
  'New York',
];

const SearchBar = ({ onSearch }: { onSearch: (value: string) => void }) => {
  return (
    <select
      onChange={(e) => onSearch(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
    >
      <option value="">Anywhere</option>
      {locations.map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
    </select>
  );
};

export default SearchBar;
