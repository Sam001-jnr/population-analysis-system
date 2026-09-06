
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  MapPin,
  Database,
  Loader2,
} from "lucide-react";

import { db } from "../firebase/firebase.jsx";

const PopulationRecords = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    location: "",
    state: "",
    male: "",
    female: "",
    year: new Date().getFullYear(),
  });

  // Get records from Firestore
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
        setError("Unable to load population records.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setFormData({
      location: "",
      state: "",
      male: "",
      female: "",
      year: new Date().getFullYear(),
    });

    setEditingRecord(null);
    setError("");
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setEditingRecord(record);

    setFormData({
      location: record.location || "",
      state: record.state || "",
      male: record.male ?? "",
      female: record.female ?? "",
      year: record.year || new Date().getFullYear(),
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const location = formData.location.trim();
    const state = formData.state.trim();
    const male = Number(formData.male);
    const female = Number(formData.female);
    const year = Number(formData.year);

    if (!location || !state) {
      setError("Please enter the location and state.");
      return;
    }

    if (
      formData.male === "" ||
      formData.female === "" ||
      Number.isNaN(male) ||
      Number.isNaN(female)
    ) {
      setError("Please enter valid male and female population values.");
      return;
    }

    if (male < 0 || female < 0) {
      setError("Population values cannot be negative.");
      return;
    }

    if (!year || year < 1900 || year > 2100) {
      setError("Please enter a valid year.");
      return;
    }

    const total = male + female;

    try {
      setSaving(true);

      if (editingRecord) {
        const recordRef = doc(
          db,
          "populationRecords",
          editingRecord.id
        );

        await updateDoc(recordRef, {
          location,
          state,
          male,
          female,
          total,
          year,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "populationRecords"), {
          location,
          state,
          male,
          female,
          total,
          year,
          createdAt: serverTimestamp(),
        });
      }

      closeModal();
    } catch (firebaseError) {
      console.error(firebaseError);
      setError(
        "Unable to save the record. Check your Firebase Firestore rules."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this population record?"
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "populationRecords", id));
    } catch (firebaseError) {
      console.error(firebaseError);
      setError("Unable to delete the record.");
    }
  };

  const filteredRecords = records.filter((record) => {
    const search = searchTerm.toLowerCase();

    return (
      record.location?.toLowerCase().includes(search) ||
      record.state?.toLowerCase().includes(search)
    );
  });

  const totalPopulation = records.reduce(
    (sum, record) => sum + Number(record.total || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Population Records
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add, manage and analyse population records.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Record
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30">
              <Database size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Records
              </p>

              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {records.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30">
              <Users size={20} />
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Total Population
              </p>

              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalPopulation.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by location or state..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
          />
        </div>
      </div>

      {/* Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Users
              size={42}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              No population records yet
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Click "Add Record" to enter your first population record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-slate-700 dark:bg-slate-900/50">
                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Location
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    State
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Male
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Female
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Total
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Year
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-100 dark:border-slate-700"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-blue-600" />

                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {record.location}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {record.state}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {Number(record.male || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {Number(record.female || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                      {Number(record.total || 0).toLocaleString()}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {record.year}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(record)}
                          className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit record"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          onClick={() => handleDelete(record.id)}
                          className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete record"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 p-5 dark:border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingRecord
                    ? "Edit Population Record"
                    : "Add Population Record"}
                </h2>

                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter the population information below.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Awka"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="e.g. Anambra"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Male Population
                  </label>

                  <input
                    type="number"
                    name="male"
                    min="0"
                    value={formData.male}
                    onChange={handleChange}
                    placeholder="e.g. 125400"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Female Population
                  </label>

                  <input
                    type="number"
                    name="female"
                    min="0"
                    value={formData.female}
                    onChange={handleChange}
                    placeholder="e.g. 121800"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max="2100"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5 dark:border-slate-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <Loader2 size={17} className="animate-spin" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingRecord
                    ? "Update Record"
                    : "Add Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopulationRecords;
