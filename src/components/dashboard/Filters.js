// src/components/Filters.js
import React from 'react';
import Button from './button.js'; // Import Button
import { indianStates, indianCities } from '../../data/mockdata.js'; // Fixed path - go up two levels

const Filters = ({ filters, onFilterChange, onApplyFilters }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Matches</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
          <select
            id="age"
            name="age"
            value={filters.age}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="18-25">18-25</option>
            <option value="26-30">26-30</option>
            <option value="31-35">31-35</option>
            <option value="36+">36+</option>
          </select>
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            id="state"
            name="state"
            value={filters.state}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any State</option>
            {indianStates.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            id="city"
            name="city"
            value={filters.city}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any City</option>
            {indianCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
          <select
            id="education"
            name="education"
            value={filters.education}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="B.Tech">B.Tech</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MBA">MBA</option>
            <option value="B.Sc">B.Sc</option>
            <option value="B.Arch">B.Arch</option>
            <option value="Ph.D">Ph.D</option>
            <option value="M.A. (Literature)">M.A. (Literature)</option>
            <option value="B.E. (Mechanical)">B.E. (Mechanical)</option>
          </select>
        </div>
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height</label>
          <select
            id="height"
            name="height"
            value={filters.height || ''}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="below-5ft">Below 5ft</option>
            <option value="5ft-5ft5in">5ft - 5ft 5in</option>
            <option value="5ft6in-6ft">5ft 6in - 6ft</option>
            <option value="above-6ft">Above 6ft</option>
          </select>
        </div>
        <div>
          <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
          <select
            id="annualIncome"
            name="annualIncome"
            value={filters.annualIncome || ''}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="below-2L">Below 2L</option>
            <option value="2L-5L">2L - 5L</option>
            <option value="5L-10L">5L - 10L</option>
            <option value="10L+">10L+</option>
          </select>
        </div>
        <div>
          <label htmlFor="familyType" className="block text-sm font-medium text-gray-700 mb-1">Family Type</label>
          <select
            id="familyType"
            name="familyType"
            value={filters.familyType || ''}
            onChange={onFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any</option>
            <option value="nuclear">Nuclear</option>
            <option value="joint">Joint</option>
            <option value="others">Others</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
};

export default Filters;
