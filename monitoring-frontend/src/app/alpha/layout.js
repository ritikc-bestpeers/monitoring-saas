"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Layout = ({ children }) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/alpha/dashboard" },
    { name: "Monitors", href: "/alpha/monitors" },
    { name: "Track SSL", href: "/alpha/track-ssl" },
    { name: "Incidents", href: "/incidents" },
    { name: "Integrations", href: "/integrations" },
    { name: "Settings", href: "/settings" },
    { name: "Users", href: "/alpha/admin/users" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-slate-200 min-h-screen">
          <Link
            href="/"
            className="px-6 py-6 flex items-center gap-3 border-b border-slate-100"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-bold">
              M
            </div>
            <div>
              <div className="font-semibold">Monitoring SaaS</div>
            </div>
          </Link>

          <nav className="px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-4 mt-6">
            <div className="text-xs text-slate-500 uppercase mb-2">
              Workspace
            </div>
            <div className="bg-slate-50 p-3 rounded-md text-sm">
              Acme Corp • Free
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-semibold">Monitoring Application</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                  JD
                </div>
              </div>
            </div>
          </header>

          <div className="px-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
