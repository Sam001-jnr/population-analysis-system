import { useState } from "react";
import {
  MapPin,
  Search,
  Plus,
  Users,
  Trash2,
} from "lucide-react";

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [locations, setLocations] = useState([
    {
      id: 1,
      location: "Awka",
      state: "Anambra",
      population: 247200,
      year: 2025,
    },
    {
      id: 2,
      location: "Onitsha",
      state: "Anambra",
      population: 364800,
      year: 2025,
    },
    {
      id: 3,
      location: "Nnewi",
      state: "Anambra",
      population: 195000,
      year: 2025,
    },
  ]);

  const filteredLocations = locations.filter((location) => {
    const search = searchTerm.toLowerCase();

    return (
      location.location.toLowerCase().includes(search) ||
      location.state.toLowerCase().includes(search)
    );
  });

  const deleteLocation = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this location?"
    );

    if (!confirmed) return;

    setLocations((previous) =>
      previous.filter((location) => location.id !== id)
    );
  };

  const totalPopulation = locations.reduce(
    (total, location) => total + location.population,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Locations
          </h1>

          <p className="mt-1 text-gray-600">
            View population information by location.
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
          <Plus size={20} />
          Add Location
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-blue-100 p-3">
              <MapPin
                size={24}
                className="text-blue-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Recorded Locations
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {locations.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-green-100 p-3">
              <Users
                size={24}
                className="text-green-600"
              />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Population Covered
              </p>

              <p className="text-2xl font-bold text-gray-900">
                {totalPopulation.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search location or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Locations */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900">
            Recorded Locations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Locations currently included in the population
            analysis.
          </p>
        </div>

        {filteredLocations.length === 0 ? (
          <div className="p-10 text-center">
            <MapPin
              size={42}
              className="mx-auto mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-700">
              No locations found
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Try another search term.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="flex flex-col gap-4 p-6 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gray-100 p-3">
                    <MapPin
                      size={22}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {location.location}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {location.state} • {location.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-6 md:justify-end">
                  <div>
                    <p className="text-sm text-gray-500">
                      Population
                    </p>

                    <p className="font-bold text-gray-900">
                      {location.population.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      deleteLocation(location.id)
                    }
                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    title="Remove location"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;