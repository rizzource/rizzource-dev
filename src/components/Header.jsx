"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Shield, LogOut, User, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import logoLight from "@/assets/rizzource-logo-light.png";
import logoDark from "@/assets/rizzource-logo-dark.png";
import useAuth from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/userApiSlice";

const Header = () => {
  const { user, roles, isSuperAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const { theme } = useTheme();

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/auth");
  };

  const resolvedRole = isSuperAdmin() ? "Super Admin" : "";

  return (
    <nav className="fixed top-0 z-[100] w-full border-b border-charcoal/5 bg-warm-cream/60 backdrop-blur-xl transition-all duration-300">
      <div className="container flex h-20 items-center justify-between px-6 mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal transition-transform group-hover:rotate-12">
            <Zap className="h-6 w-6 text-electric-teal" />
            <div className="absolute -inset-1 bg-electric-teal/20 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter uppercase italic">RIZZource</span>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-warm-gray">
              Law School & Beyond
            </span>
          </div>
        </Link>

        {/* Navigation Links & Auth */}
        <div className="flex items-center gap-6">

          {/* Back button on certain pages */}
          {pathname === "/auth" || pathname === "/admin" ? (
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full border border-border text-foreground hover:text-electric-teal hover:border-electric-teal transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          ) : null}

          {/* Company Dashboard Link */}
          {(roles.includes("owner") || roles.includes("hr") || roles.includes("admin")) && (
            <Link
              to="/company-dashboard"
              className="relative group overflow-hidden py-1 font-bold uppercase tracking-widest text-xs text-warm-gray hover:text-electric-teal transition-colors"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                Company
              </span>
              <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-electric-teal">
                Company
              </span>
            </Link>
          )}

          {user &&
            <Link
              to="/favoritejobs"
              className="relative group overflow-hidden py-1 font-bold uppercase tracking-widest text-xs text-warm-gray hover:text-electric-teal transition-colors"
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
                Favorite Jobs
              </span>
              <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-electric-teal">
                Favorite Jobs
              </span>
            </Link>
          }
          {/* Explore Jobs Link */}
          <Link
            to="/jobs"
            className="relative group overflow-hidden py-1 font-bold uppercase tracking-widest text-xs text-warm-gray hover:text-electric-teal transition-colors"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              Jobs
            </span>
            <span className="absolute left-0 top-full inline-block transition-transform duration-300 group-hover:-translate-y-full text-electric-teal">
              Jobs
            </span>
          </Link>

          {/* Auth Section */}
          {user ? (
            <>
              {resolvedRole && (
                <span className="text-xs font-black uppercase tracking-widest text-ai-violet">
                  {resolvedRole}
                </span>
              )}

              {isSuperAdmin() && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full bg-ai-violet/10 text-ai-violet hover:bg-ai-violet hover:text-white transition-all"
                >
                  <Shield className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest text-warm-gray hover:text-coral transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              to="/auth">
              <Button onClick={() => { }} className="h-12 px-8 bg-charcoal hover:bg-deep-teal text-warm-cream rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:scale-105 active:scale-95 shadow-xl shadow-charcoal/10">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sign In</span>
              </Button></Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;