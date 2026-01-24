import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Syringe,
  Thermometer,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Estoque de Lotes', href: '/lots', icon: Package },
  { name: 'Aplicações', href: '/applications', icon: Syringe },
  { name: 'Temperatura', href: '/temperature', icon: Thermometer },
  { name: 'Checklist Diário', href: '/checklist', icon: ClipboardCheck },
  { name: 'Perdas', href: '/losses', icon: AlertTriangle },
  { name: 'Relatórios', href: '/reports', icon: FileText },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-accent">
              <ShieldCheck className="h-6 w-6 text-accent-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold text-sidebar-foreground">
                  SGI PNI
                </span>
                <span className="text-xs text-sidebar-foreground/60">Perobal</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'nav-link',
                  isActive && 'active',
                  collapsed && 'justify-center px-3'
                )}
                title={collapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer with collapse button */}
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-link w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Recolher</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
