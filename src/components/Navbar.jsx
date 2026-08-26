import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, Sparkles, User, LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { getUser, removeAuth, isAuthenticated } from '../utils/auth.js';
import authService from '../services/authService.js';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const navigate = useNavigate();
  const auth = isAuthenticated();
  const user = getUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {auth && (
            <button
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800/80 hover:text-white lg:hidden transition-colors"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <Link to={auth ? '/dashboard' : '/'} className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Shield className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  RISKVAULT
                </span>
                <span className="hidden sm:inline-block rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/30">
                  ENTERPRISE
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-slate-400 tracking-wide">
                Trust Every AI Decision.
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Protection Status & User controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          {auth ? (
            <>
              {/* Protection Active Indicator */}
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                </div>
                <span className="tracking-wide uppercase text-[11px] font-bold">Protection Active</span>
              </div>

              {/* Quick Scan CTA */}
              <Link
                to="/scanner"
                className="hidden md:flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                <span>New AI Scan</span>
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-sm text-slate-200 hover:border-slate-700 hover:bg-slate-800 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-xs font-bold text-white uppercase">
                    {user?.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[120px] truncate text-xs">
                    {user?.full_name || 'My Account'}
                  </span>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-lg focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <p className="text-xs font-medium text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-100 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-cyan-400" />
                      <span>Account Profile</span>
                    </Link>

                    <Link
                      to="/threat-monitor"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <ShieldAlert className="h-4 w-4 text-amber-400" />
                      <span>Threat Monitor</span>
                    </Link>

                    <div className="my-1 border-t border-slate-800/80"></div>

                    <button
                      id="logout-btn"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
