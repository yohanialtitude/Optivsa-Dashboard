import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BellIcon,
  MessageSquareIcon,
  LogOutIcon,
  PlusIcon,
  ChevronLeftIcon,
  XIcon } from
'lucide-react';
import { navGroups } from '../../data/navigation';
import { useAuth, initials } from '../../contexts/AuthContext';
import { Logo } from './Logo';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onNewStudy: () => void;
  openExceptions: number;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onNewStudy,
  openExceptions
}: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const width = collapsed ? 'lg:w-[76px]' : 'lg:w-[264px]';

  return (
    <>
      {mobileOpen &&
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onCloseMobile}
        className="fixed inset-0 z-40 bg-ink/40 lg:hidden" />

      }
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-surface transition-transform duration-200 ease-smooth lg:translate-x-0 ${width} ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'}`
        }
        aria-label="Primary navigation">
        
        <div className="force-light flex h-20 items-center justify-between gap-2 border-b border-line bg-surface px-4">
          <Logo compact={collapsed} />
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-lg p-1.5 text-muted hover:bg-raised hover:text-ink lg:hidden">
            
            <XIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden rounded-lg p-1.5 text-muted transition-colors duration-150 ease-smooth hover:bg-raised hover:text-ink lg:block ${
            collapsed ? 'mx-auto' : ''}`
            }>
            
            <ChevronLeftIcon
              className={`h-4 w-4 transition-transform duration-200 ease-smooth ${
              collapsed ? 'rotate-180' : ''}`
              } />
            
          </button>
        </div>

        <div className={`border-b border-line px-4 py-4 ${collapsed ? 'lg:px-2' : ''}`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'lg:justify-center' : ''}`}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-brand-soft text-xs font-semibold text-brand">
              {user ? initials(user.name) : 'OP'}
            </span>
            {!collapsed &&
            <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {user?.name ?? 'Optivsa User'}
                </span>
                <span className="block truncate text-[11px] text-muted">
                  {user?.role ?? 'ML Engineer'}
                </span>
              </span>
            }
          </div>

          {!collapsed &&
          <div className="mt-3.5 flex items-center gap-1.5">
              <button
              type="button"
              onClick={() => navigate('/decisions')}
              title="Review queue"
              className="flex h-8 flex-1 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-ink">
              
                <MessageSquareIcon className="h-3.5 w-3.5" />
                <span className="sr-only">Review queue</span>
              </button>
              <button
              type="button"
              onClick={() => navigate('/studies')}
              title="Alerts"
              className="relative flex h-8 flex-1 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-ink">
              
                <BellIcon className="h-3.5 w-3.5" />
                {openExceptions > 0 &&
              <span className="absolute right-1.5 top-1 h-1.5 w-1.5 rounded-full bg-brand" />
              }
                <span className="sr-only">Alerts</span>
              </button>
              <button
              type="button"
              onClick={signOut}
              title="Sign out"
              className="flex h-8 flex-1 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-bad">
              
                <LogOutIcon className="h-3.5 w-3.5" />
                <span className="sr-only">Sign out</span>
              </button>
            </div>
          }
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {navGroups.map((group) =>
          <div key={group.title} className="mb-5 last:mb-0">
              <p
              className={`mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted ${
              collapsed ? 'lg:text-center' : ''}`
              }>
              
                {collapsed ? group.title.slice(0, 1) : group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) =>
              <li key={item.to}>
                    <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors duration-150 ease-smooth ${
                  isActive ?
                  'bg-brand-soft font-medium text-brand' :
                  'text-muted hover:bg-raised hover:text-ink'} ${
                  collapsed ? 'lg:justify-center lg:px-0' : ''}`
                  }>
                  
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                      {!collapsed &&
                  <>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {item.badge &&
                    <span className="shrink-0 rounded-md bg-raised px-1.5 py-0.5 text-[10px] font-medium text-muted">
                              {item.badge}
                            </span>
                    }
                        </>
                  }
                    </NavLink>
                  </li>
              )}
              </ul>
            </div>
          )}
        </nav>

        <div className="border-t border-line p-3">
          {collapsed ?
          <button
            type="button"
            onClick={onNewStudy}
            aria-label="New optimization study"
            className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white transition-colors duration-150 ease-smooth hover:bg-brand-hover">
            
              <PlusIcon className="h-4 w-4" />
            </button> :

          <>
              <button
              type="button"
              onClick={onNewStudy}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-medium text-white transition-colors duration-150 ease-smooth hover:bg-brand-hover">
              
                <PlusIcon className="h-4 w-4" />
                New study
              </button>
              <p className="mt-3 flex items-center justify-between text-[11px] text-muted">
                <span>Recommendations</span>
                <Badge tone="neutral">Review required</Badge>
              </p>
            </>
          }
        </div>
      </aside>
    </>);

}