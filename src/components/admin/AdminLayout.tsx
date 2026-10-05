import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, ListTree, Users, HelpCircle,
  FolderOpen, Newspaper, Image, FileBox, Mail, MessageSquare,
  Settings, LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/practice-areas', label: 'Practice Areas', icon: Briefcase },
  { to: '/admin/matter-types', label: 'Matter Types', icon: ListTree },
  { to: '/admin/team-members', label: 'Team Members', icon: Users },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/news-categories', label: 'News Categories', icon: FolderOpen },
  { to: '/admin/news-articles', label: 'Articles', icon: Newspaper },
  { to: '/admin/client-logos', label: 'Client Logos', icon: Image },
  { to: '/admin/resources', label: 'Resources', icon: FileBox },
  { to: '/admin/newsletter', label: 'Subscribers', icon: Mail },
  { to: '/admin/contact', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Firm Settings', icon: Settings },
];

export function AdminLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-900 dark:text-white">Admin Panel</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <div className="px-3 py-2 text-sm">
            <p className="font-medium text-slate-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-slate-500 text-xs">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}