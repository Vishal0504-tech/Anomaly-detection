'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  AlertTriangle, 
  BarChart3, 
  ShieldAlert,
  Menu,
  X,
  Database
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Business List', href: '/businesses', icon: Search },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Data Center', href: '/upload', icon: Database },
];


// ✅ MOVE OUTSIDE
function SidebarContent({
  pathname,
  setIsOpen,
}: {
  pathname: string;
  setIsOpen: (val: boolean) => void;
}) {
  return (
    <>
      <div className="flex h-16 items-center border-b px-6">
        <ShieldAlert className="h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-bold tracking-tight">GST Sentry</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive
                      ? 'text-current'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}


// ✅ MAIN COMPONENT
export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-card p-2 shadow-lg md:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden h-full w-64 flex-col border-r bg-card/80 backdrop-blur-xl text-card-foreground md:flex">
        <SidebarContent pathname={pathname} setIsOpen={setIsOpen} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            />

            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-card shadow-2xl md:hidden"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <SidebarContent pathname={pathname} setIsOpen={setIsOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}