import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import {
  BarChart3,
  Users,
  MapPin,
  Loader2,
  Database,
} from "lucide-react";

import { db } from "../firebase/firebase.jsx";

const PopulationAnalysis = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recordsRef = collection(db, "populationRecords");

    const unsubscribe = onSnapshot(
      recordsRef,
      (snapshot) => {
        const data = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setRecords(data);
        setLoading(false);
      },
      (error) => {
        console.error("Population Analysis Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ================================
  // POPULATION CALCULATIONS
  // ================================

  const totalMale = records.reduce(
    (sum, record) => sum + Number(record.male || 0),
    0
  );

  const totalFemale = records.reduce(
    (sum, record) => sum + Number(record.female || 0),
    0
  );

  const totalPopulation = totalMale + totalFemale;

  const totalLocations = new Set(
    records
      .map((record) => record.location)
      .filter(Boolean)
  ).size;

  const malePercentage =
    totalPopulation > 0
      ? ((totalMale / totalPopulation) * 100).toFixed(1)
      : 0;

  const femalePercentage =
    totalPopulation > 0
      ? ((totalFemale / totalPopulation) * 100).toFixed(1)
      : 0;

  // ================================
  // POPULATION BY LOCATION
  // ================================

  const locationData = Object.values(
    records.reduce((accumulator, record) => {
      const location = record.location || "Unknown";

      if (!accumulator[location]) {
        accumulator[location] = {
          location,
          male: 0,
          female: 0,
          total: 0,
        };
      }

      accumulator[location].male += Number(record.male || 0);
      accumulator[location].female += Number(record.female || 0);
      accumulator[location].total +=
        Number(record.male || 0) + Number(record.female || 0);

      return accumulator;
    }, {})
  ).sort((a, b) => b.total - a.total);

  const highestPopulation =
    locationData.length > 0 ? locationData[0] : null;

  // ================================
  // LOADING STATE
  // ================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-gray-600">
            Loading population analysis...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Population Analysis
        </h1>

        <p className="mt-1 text-gray-600">
          Analyse population data collected from the system.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Population */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Population
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalPopulation.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Male */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Male Population
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalMale.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {malePercentage}% of total
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Female */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Female Population
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalFemale.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {femalePercentage}% of total
              </p>
            </div>

            <div className="rounded-lg bg-pink-50 p-3">
              <Users className="h-6 w-6 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Locations */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Locations
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalLocations}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Recorded locations
              </p>
            </div>

            <div className="rounded-lg bg-purple-50 p-3">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gender Analysis */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-blue-600" />

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Gender Distribution
            </h2>

            <p className="text-sm text-gray-500">
              Comparison between male and female population.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Male Bar */}
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                Male
              </span>

              <span className="text-sm font-medium text-gray-600">
                {totalMale.toLocaleString()} ({malePercentage}%)
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${malePercentage}%`,
                }}
              />
            </div>
          </div>

          {/* Female Bar */}
          <div>
            <div className="mb-2 flex justify-between">
              <span className="text-sm font-medium text-gray-700">
                Female
              </span>

              <span className="text-sm font-medium text-gray-600">
                {totalFemale.toLocaleString()} ({femalePercentage}%)
              </span>
            </div>

            <div className="h-5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-pink-500 transition-all duration-500"
                style={{
                  width: `${femalePercentage}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Population by Location */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-6 w-6 text-purple-600" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Population by Location
              </h2>

              <p className="text-sm text-gray-500">
                Population distribution across recorded locations.
              </p>
            </div>
          </div>
        </div>

        {locationData.length === 0 ? (
          <div className="p-10 text-center">
            <Database className="mx-auto h-10 w-10 text-gray-400" />

            <p className="mt-3 font-medium text-gray-700">
              No population records available
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Add population records to view analysis.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Male
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Female
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {locationData.map((item) => (
                  <tr key={item.location} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {item.location}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-600">
                      {item.male.toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-600">
                      {item.female.toLocaleString()}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-semibold text-gray-900">
                      {item.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Highest Population Location */}
      {highestPopulation && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">
            Key Finding
          </h2>

          <div className="mt-4 rounded-lg bg-blue-50 p-5">
            <p className="text-sm text-gray-600">
              Location with the highest recorded population
            </p>

            <p className="mt-1 text-xl font-bold text-blue-700">
              {highestPopulation.location}
            </p>

            <p className="mt-2 text-sm text-gray-700">
              Population:{" "}
              <span className="font-semibold">
                {highestPopulation.total.toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopulationAnalysis;