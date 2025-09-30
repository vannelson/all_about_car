export default function CalendarTopBar() {
  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200">
      <div className="flex flex-wrap items-end justify-between gap-4 p-4">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4">
          {/* Gear Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="gear" className="text-xs font-medium text-gray-600">
              Gear Type
            </label>
            <div className="relative">
              <select
                id="gear"
                defaultValue=""
                className="appearance-none block w-44 md:w-48 h-10 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select gear
                </option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Fuel Type */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fuel" className="text-xs font-medium text-gray-600">
              Fuel Type
            </label>
            <div className="relative">
              <select
                id="fuel"
                defaultValue=""
                className="appearance-none block w-44 md:w-48 h-10 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select fuel
                </option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-1">
            <label htmlFor="brand" className="text-xs font-medium text-gray-600">
              Brand
            </label>
            <div className="relative">
              <select
                id="brand"
                defaultValue=""
                className="appearance-none block w-56 h-10 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select brand
                </option>
                <option value="toyota">Toyota</option>
                <option value="honda">Honda</option>
                <option value="bmw">BMW</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Vehicle Class */}
          <div className="flex flex-col gap-1">
            <label htmlFor="vehicleClass" className="text-xs font-medium text-gray-600">
              Vehicle Class
            </label>
            <div className="relative">
              <select
                id="vehicleClass"
                defaultValue=""
                className="appearance-none block w-56 h-10 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select class
                </option>
                <option value="economy">Economy</option>
                <option value="luxury">Luxury</option>
                <option value="suv">SUV</option>
              </select>
              <ChevronIcon />
            </div>
          </div>

          {/* Clear */}
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-md px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1 h-4 w-4"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear All
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-end gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="sort" className="text-xs font-medium text-gray-600">
              Sort by
            </label>
            <div className="relative">
              <select
                id="sort"
                defaultValue=""
                className="appearance-none block w-56 h-10 rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm text-gray-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="" disabled>
                  Select sort
                </option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronIcon() {
  return (
    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

