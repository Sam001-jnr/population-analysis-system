import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  MapPin,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
} from "lucide-react";

{useState, useEffect} 
import{BrowserRouter, Routes, Route, Navigate}from "react-router-dom";
import{auth} from "./firebase/firebase.jsx";
import {onAuthStateChanged} from "firebase/auth";

import login from "./pages/login.jsx";
import register from "./pages/register.jsx";

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
  const stats = [
    {
      title: "Total Population",
      value: "807,000",
      description: "Recorded population",
      icon: Users,
    },
    {
      title: "Male Population",
      value: "409,300",
      description: "Male population",
      icon: Users,
    },
    {
      title: "Female Population",
      value: "397,700",
      description: "Female population",
      icon: Users,
    },
    {
      title: "Locations",
      value: "3",
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
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Quick Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Access the main functions of the system.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            onClick={() => onNavigate("records")}
            className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Users size={20} className="text-blue-600" />

            <p className="mt-3 font-medium text-slate-900 dark:text-white">
              Manage Population Records
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Add, edit and delete population records.
            </p>
          </button>

          <button
            onClick={() => onNavigate("analysis")}
            className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <BarChart3 size={20} className="text-blue-600" />

            <p className="mt-3 font-medium text-slate-900 dark:text-white">
              View Population Analysis
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Analyse population distribution and gender.
            </p>
          </button>

          <button
            onClick={() => onNavigate("reports")}
            className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <FileText size={20} className="text-blue-600" />

            <p className="mt-3 font-medium text-slate-900 dark:text-white">
              Generate Reports
            </p>

            <p className="mt-1 text-xs text-slate-500">
              View and print population reports.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
