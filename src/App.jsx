import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  User,
  UserRound,
  BarChart3,
  MapPin,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Loader2,
} from "lucide-react";

import { auth, db } from "./firebase/firebase.jsx";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import PopulationRecords from "./pages/populationrecords.jsx";
import PopulationAnalysis from "./pages/populationanalysis.jsx";
import Locations from "./pages/locations.jsx";
import Reports from "./pages/reports.jsx";
import Settings from "./pages/settings.jsx";

const App = () => {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [showRegister, setShowRegister] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActivePage("dashboard");
      setMobileMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navigation = [
    {
      name: "Dashboard",
      key: "dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Population Records",
      key: "records",
      icon: Users,
    },
    {
      name: "Population Analysis",
      key: "analysis",
      icon: BarChart3,
    },
    {
      name: "Locations",
      key: "locations",
      icon: MapPin,
    },
    {
      name: "Reports",
      key: "reports",
      icon: FileText,
    },
    {
      name: "Settings",
      key: "settings",
      icon: SettingsIcon,
    },
  ];

  const renderPage = () => {
    switch (activePage) {
      case "records":
        return <PopulationRecords />;

      case "analysis":
        return <PopulationAnalysis />;

      case "locations":
        return <Locations />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      case "dashboard":
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600"></div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading system...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => setShowRegister(false)}
          onShowLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => {}}
        onShowRegister={() => setShowRegister(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-sm font-bold text-slate-900 dark:text-white">
          Population Analysis System
        </h1>

        <div className="w-10"></div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-72 bg-white p-5 shadow-xl dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  Population Analysis
                </h2>

                <p className="text-xs text-slate-500">
                  NPC Population System
                </p>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <Navigation
              navigation={navigation}
              activePage={activePage}
              setActivePage={setActivePage}
              closeMobileMenu={() => setMobileMenuOpen(false)}
            />

            <button
              onClick={handleLogout}
              className="mt-6 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={19} />
              Logout
            </button>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:block">
        <div className="flex h-full flex-col p-5">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Population Analysis
            </h2>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              NPC Population System
            </p>
          </div>

          <Navigation
            navigation={navigation}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          <div className="mt-auto">
            <div className="mb-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                Logged in as
              </p>

              <p className="mt-1 truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-h-screen md:ml-64">
        <div className="mx-auto max-w-7xl p-4 md:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

const Navigation = ({
  navigation,
  activePage,
  setActivePage,
  closeMobileMenu,
}) => {
  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.key;

        return (
          <button
            key={item.key}
            onClick={() => {
              setActivePage(item.key);

              if (closeMobileMenu) {
                closeMobileMenu();
              }
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon size={19} />
            {item.name}
          </button>
        );
      })}
    </nav>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const recordsRef = collection(db, "populationRecords");

    const unsubscribe = onSnapshot(
      recordsRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecords(data);
        setLoading(false);
        setError("");
      },
      (firebaseError) => {
        console.error("Dashboard error:", firebaseError);
        setError("Unable to load dashboard data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Calculate total male population
  const totalMale = records.reduce(
    (sum, record) => sum + (Number(record.male) || 0),
    0
  );

  // Calculate total female population
  const totalFemale = records.reduce(
    (sum, record) => sum + (Number(record.female) || 0),
    0
  );

  // Calculate total population
  const totalPopulation = totalMale + totalFemale;

  // Calculate unique locations
  const uniqueLocations = new Set(
    records
      .map((record) => record.location)
      .filter(Boolean)
      .map((location) => location.trim().toLowerCase())
  );

  const totalLocations = uniqueLocations.size;

  // Get the five most recent records by year
  const recentRecords = [...records]
    .sort((a, b) => {
      const yearA = Number(a.year) || 0;
      const yearB = Number(b.year) || 0;

      return yearB - yearA;
    })
    .slice(0, 5);

  const stats = [
    {
      title: "Total Population",
      value: totalPopulation,
      description: "Recorded population",
      icon: Users,
    },
    {
      title: "Male Population",
      value: totalMale,
      description: "Male population",
      icon: User,
    },
    {
      title: "Female Population",
      value: totalFemale,
      description: "Female population",
      icon: UserRound,
    },
    {
      title: "Locations",
      value: totalLocations,
      description: "Recorded locations",
      icon: MapPin,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white md:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Overview of the Computer-Based Population Analysis System.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <Loader2
            size={20}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm text-slate-500 dark:text-slate-400">
            Loading population data...
          </span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && !error && (
        <>
          {/* Statistics */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                    <Icon size={21} />
                  </div>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value.toLocaleString()}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Gender Distribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Gender Distribution
            </h2>

            <div className="mt-6 space-y-5">
              {/* Male */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Male
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {totalMale.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width:
                        totalPopulation > 0
                          ? `${(totalMale / totalPopulation) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>

              {/* Female */}
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">
                    Female
                  </span>

                  <span className="font-semibold text-slate-900 dark:text-white">
                    {totalFemale.toLocaleString()}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-pink-500"
                    style={{
                      width:
                        totalPopulation > 0
                          ? `${(totalFemale / totalPopulation) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recent Population Records */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 p-6 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Recent Population Records
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest population records stored in the database.
              </p>
            </div>

            {recentRecords.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No population records have been added yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
                    <tr>
                      <th className="px-6 py-3 font-medium">
                        Location
                      </th>

                      <th className="px-6 py-3 font-medium">
                        State
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Male
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Female
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Total
                      </th>

                      <th className="px-6 py-3 font-medium">
                        Year
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {recentRecords.map((record) => {
                      const male = Number(record.male) || 0;
                      const female = Number(record.female) || 0;
                      const total = male + female;

                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50 dark:hover:bg-slate-700/30"
                        >
                          <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                            {record.location || "N/A"}
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {record.state || "N/A"}
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {male.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {female.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                            {total.toLocaleString()}
                          </td>

                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            {record.year || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid gap-5 md:grid-cols-2">
            <button
              onClick={() => onNavigate("records")}
              className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <Users className="mb-4 text-blue-600" size={28} />

              <h2 className="font-semibold text-slate-900 dark:text-white">
                Population Records
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage population records.
              </p>
            </button>

            <button
              onClick={() => onNavigate("analysis")}
              className="rounded-xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <BarChart3 className="mb-4 text-blue-600" size={28} />

              <h2 className="font-semibold text-slate-900 dark:text-white">
                Population Analysis
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Analyse population distribution and trends.
              </p>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;