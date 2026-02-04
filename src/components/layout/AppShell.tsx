import type { ReactNode } from 'react';
import { useCallStore } from '../../store/callStore';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const connected = useCallStore((state) => state.connected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                TnT UX POC
              </h1>
              <p className="text-sm text-gray-500">
                Tauri v2 + React • Versaterm Public Safety
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? 'bg-accent' : 'bg-error'
                } animate-pulse`}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-gray-500">
            AI-generated components in <code className="bg-gray-100 px-1 rounded">src/components/stitch/</code> are designed to be swappable
          </p>
        </div>
      </footer>
    </div>
  );
}
