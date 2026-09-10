
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  FileText,
  Users,
  UserRound,
  MapPin,
  Printer,
  Loader2,
} from "lucide-react";

import { db } from "../firebase/firebase.jsx";

const Reports = () => {
  const [records, setRecords] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedState, setSelectedState] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get population records from Firestore
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
      (firebaseError) => {
        console.error(firebaseError);
        setError("Unable to load population reports.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Get available years from real records
  const years = useMemo(() => {
    return [...new Set(records.map((record) => Number(record.year)).filter(Boolean))]
      .sort((a, b) => b - a);
  }, [records]);

  // Get available states from real records
  const states = useMemo(() => {
    return [...new Set(records.map((record) => record.state).filter(Boolean))]
      .sort();
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const yearMatch =
        selectedYear === "All" ||
        Number(record.year) === Number(selectedYear);

      const stateMatch =
        selectedState === "All" ||
        record.state === selectedState;

      return yearMatch && stateMatch;
    });
  }, [records, selectedYear, selectedState]);

  // Calculate totals
  const totalMale = filteredRecords.reduce(
    (sum, record) => sum + Number(record.male || 0),
    0
  );

  const totalFemale = filteredRecords.reduce(
    (sum, record) => sum + Number(record.female || 0),
    0
  );

  const totalPopulation = totalMale + totalFemale;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Population Reports
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Generate and view population summary reports.
          </p>
        </div>

        <button
          onClick={handlePrint}
          disabled={filteredRecords.length === 0}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Printer size={18} />
          Print Report
        </button>
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block">
        <div className="border-b border-slate-300 pb-4">
          <h1 className="text-2xl font-bold">
            COMPUTER-BASED POPULATION ANALYSIS SYSTEM
          </h1>

          <p className="mt-1 text-sm">
            Case Study: National Population Commission (NPC)
          </p>

          <p className="mt-3 text-lg font-semibold">
            Population Analysis Report
          </p>

          <p className="mt-2 text-sm">
            Year: {selectedYear === "All" ? "All Years" : selectedYear}
          </p>

          <p className="text-sm">
            State: {selectedState === "All" ? "All States" : selectedState}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 print:hidden">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Report Filters
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Select the information you want to include in the report.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Year */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="All">All Years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* State */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              State
            </label>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="All">All States</option>

              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white py-20 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            <Loader2 size={24} className="animate-spin text-blue-600" />
            <span>Loading population report...</span>
          </div>
        </div>
      ) : (
        /* Report Content */
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          {/* Summary */}
          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              Population Summary
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Population */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center gap-2 text-blue-600">
                  <Users size={20} />
                  <span className="text-sm font-medium">
                    Total Population
                  </span>
                </div>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalPopulation.toLocaleString()}
                </p>
              </div>

              {/* Male */}
              <div className="rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
                <div className="mb-2 flex items-center gap-2 text-indigo-600">
                  <UserRound size={20} />
                  <span className="text-sm font-medium">Male</span>
                </div>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalMale.toLocaleString()}
                </p>
              </div>

              {/* Female */}
              <div className="rounded-lg bg-pink-50 p-4 dark:bg-pink-900/20">
                <div className="mb-2 flex items-center gap-2 text-pink-600">
                  <UserRound size={20} />
                  <span className="text-sm font-medium">Female</span>
                </div>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalFemale.toLocaleString()}
                </p>
              </div>

              {/* Locations */}
              <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
                <div className="mb-2 flex items-center gap-2 text-emerald-600">
                  <MapPin size={20} />
                  <span className="text-sm font-medium">Locations</span>
                </div>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredRecords.length}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />

              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Population by Location
              </h2>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-600">
                <FileText
                  size={40}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  No matching records
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Try changing the selected year or state.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-900/50">
                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Location
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        State
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Male
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Female
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Total
                      </th>

                      <th className="px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        Year
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map((record) => {
                      const male = Number(record.male || 0);
                      const female = Number(record.female || 0);
                      const total = male + female;

                      return (
                        <tr
                          key={record.id}
                          className="border-b border-slate-100 dark:border-slate-700"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                            {record.location || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {record.state || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {male.toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {female.toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
                            {total.toLocaleString()}
                          </td>

                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {record.year || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Report Footer */}
          <div className="border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <p>
              Report generated from the Computer-Based Population Analysis
              System.
            </p>

            <p className="mt-1">
              Case Study: National Population Commission (NPC)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

