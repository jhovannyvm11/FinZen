"use client";

import { Avatar, Chip } from "@heroui/react";
import ThemeToggle from '../ui/ThemeToggle';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ 
  title = "Financy", 
  subtitle = "Personal Finance Dashboard" 
}: HeaderProps) {
  return (
    <div className="bg-background border-b border-divider relative">
      {/* Header content */}
      <div className="px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and brand */}
            <div className="flex items-center space-x-2.5">
              {/* Logo icon */}
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 bg-blue-600 rounded-lg">
                  <svg className="w-6 h-6 text-white absolute top-1.5 left-0.5" viewBox="0 0 24 13" fill="currentColor">
                    <path d="M0 6h24v1H0z"/>
                  </svg>
                </div>
                <div className="absolute top-1.5 left-1.5 w-6 h-3 bg-indigo-700 rounded-sm">
                  <svg className="w-6 h-3 text-white" viewBox="0 0 25 13" fill="currentColor">
                    <path d="M7 12h25v1H7z"/>
                  </svg>
                </div>
              </div>
              
              {/* Brand name */}
              <div className="text-xl font-semibold text-foreground tracking-tight">
                financy
              </div>
            </div>
            
            {/* Center - Navigation menu */}
            <nav className="hidden md:flex items-center space-x-1">
              <div className="bg-primary-50 text-primary-600 px-3 py-2 rounded-md text-sm font-semibold">
                Overview
              </div>
              <a href="#" className="text-foreground-500 hover:text-foreground px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Transactions
              </a>
              <a href="#" className="text-foreground-500 hover:text-foreground px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Analytics
              </a>
              <a href="#" className="text-foreground-500 hover:text-foreground px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Accounts
              </a>
              <a href="#" className="text-foreground-500 hover:text-foreground px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Wallet
              </a>
            </nav>
            
            {/* Right side - Actions and user */}
            <div className="flex items-center space-x-4">
              {/* Action buttons */}
              <div className="flex items-center space-x-1">
                <button className="p-2 text-foreground-500 hover:text-foreground hover:bg-default-100 rounded-md transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </button>
                <button className="p-2 text-foreground-500 hover:text-foreground hover:bg-default-100 rounded-md transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </button>
                
                {/* Theme Toggle */}
                <ThemeToggle />
              </div>
              
              {/* User avatar */}
              <Avatar 
                src="https://i.pravatar.cc/150?u=jose" 
                className="w-10 h-10 border border-divider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}