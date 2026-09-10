
import {
  Settings as SettingsIcon,
  Database,
  ShieldCheck,
  Info,
} from "lucide-react";

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          View basic system information and configuration.
        </p>
      </div>

      {/* General Settings */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30">
            <SettingsIcon size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              General Settings
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Basic information about the system.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              System Name
            </label>

            <input
              type="text"
              value="Computer-Based Population Analysis System"
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Case Study
            </label>

            <input
              type="text"
              value="National Population Commission (NPC)"
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Version
            </label>

            <input
              type="text"
              value="1.0.0"
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Data Source
            </label>

            <input
              type="text"
              value="Firebase Firestore"
              readOnly
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30">
            <Database size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Database
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              The system uses Firebase Firestore to store and manage
              population records.
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Firebase Database
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-purple-100 p-2 text-purple-600 dark:bg-purple-900/30">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              System Security
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              User authentication and database security are provided through
              Firebase Authentication and Firestore security rules.
            </p>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30">
            <Info size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              About the System
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              The Computer-Based Population Analysis System is designed to
              assist with the recording, management, analysis, and reporting
              of population data. The system provides a simple interface for
              managing population records and generating useful population
              summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

