import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  LogOutIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon } from
'lucide-react';
import { toast } from 'sonner';
import { useAuth, initials } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { models } from '../../data/models';
import { studies } from '../../data/studies';
import { candidates } from '../../data/candidates';
import { validationExceptions } from '../../data/studies';
import { StatusBadge } from '../ui/Badge';

interface SearchHit {
  label: string;
  meta: string;
  to: string;
  group: string;
}

export function Topbar({
  onOpenMobileNav,
  onNewStudy



}: {onOpenMobileNav: () => void;onNewStudy: () => void;}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const all: SearchHit[] = [
    ...models.map((m) => ({
      label: `${m.name} ${m.version}`,
      meta: `${m.id} · ${m.task}`,
      to: '/registry',
      group: 'Models'
    })),
    ...studies.map((s) => ({
      label: s.name,
      meta: `${s.id} · ${s.objective}`,
      to: '/studies',
      group: 'Studies'
    })),
    ...candidates.map((c) => ({
      label: `${c.id} · ${c.precision} · ${c.hardware}`,
      meta: `${c.model} · p95 ${c.p95} ms`,
      to: '/candidates',
      group: 'Configurations'
    }))];

    return all.
    filter((item) => `${item.label} ${item.meta}`.toLowerCase().includes(q)).
    slice(0, 6);
  }, [query]);

  const unread = validationExceptions.filter(
    (exception) => exception.state !== 'resolved' && !readIds.includes(exception.id)
  );

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
      <div ref={wrapRef} className="flex h-16 items-center gap-2 px-4 sm:gap-3 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobileNav}
          aria-label="Open navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-ink lg:hidden">
          
          <MenuIcon className="h-4 w-4" />
        </button>

        <div className="relative min-w-0 flex-1 max-w-lg">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search models, studies, configurations…"
            aria-label="Search the workspace"
            className="h-9 w-full rounded-lg border border-line bg-raised pl-9 pr-3 text-sm text-ink placeholder:text-muted/80 focus:border-brand focus:bg-surface focus:outline-none" />
          
          {searchOpen && query.trim().length > 0 &&
          <div className="absolute left-0 right-0 top-11 overflow-hidden rounded-xl border border-line bg-surface shadow-pop">
              {hits.length === 0 ?
            <p className="px-4 py-5 text-xs text-muted">
                  No records match “{query}”. Try a model name, study id or configuration id.
                </p> :

            <ul className="max-h-80 overflow-y-auto py-1">
                  {hits.map((hit) =>
              <li key={`${hit.group}-${hit.label}`}>
                      <button
                  type="button"
                  onClick={() => {
                    navigate(hit.to);
                    setQuery('');
                    setSearchOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-150 ease-smooth hover:bg-raised">
                  
                        <span className="min-w-0">
                          <span className="block truncate text-sm text-ink">{hit.label}</span>
                          <span className="block truncate text-[11px] text-muted">{hit.meta}</span>
                        </span>
                        <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted">
                          {hit.group}
                        </span>
                      </button>
                    </li>
              )}
                </ul>
            }
            </div>
          }
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onNewStudy}
            className="hidden h-9 items-center rounded-lg bg-brand px-3.5 text-sm font-medium text-white transition-colors duration-150 ease-smooth hover:bg-brand-hover sm:inline-flex">
            
            New study
          </button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="sm:hidden">
            <ThemeToggle compact />
          </div>

          <button
            type="button"
            onClick={() => toast.info('Documentation is coming soon', {
              description: 'Model, benchmark and decision API references are in preparation.'
            })}
            aria-label="Help"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-ink sm:flex">
            
            <HelpCircleIcon className="h-4 w-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotifOpen((open) => !open);
                setProfileOpen(false);
              }}
              aria-label={`Validation exceptions (${unread.length} unread)`}
              aria-expanded={notifOpen}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors duration-150 ease-smooth hover:text-ink">
              
              <BellIcon className="h-4 w-4" />
              {unread.length > 0 &&
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                  {unread.length}
                </span>
              }
            </button>
            {notifOpen &&
            <div className="fixed left-3 right-3 top-[4.25rem] z-40 w-auto overflow-hidden rounded-xl border border-line bg-surface shadow-pop sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-80">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                  <p className="text-sm font-semibold text-ink">Validation exceptions</p>
                  <button
                  type="button"
                  onClick={() => {
                    setReadIds(validationExceptions.map((exception) => exception.id));
                    toast.success('All exceptions marked as read');
                  }}
                  className="text-[11px] font-medium text-brand hover:underline">
                  
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {validationExceptions.map((exception) =>
                <li key={exception.id} className="border-b border-line last:border-0">
                      <button
                    type="button"
                    onClick={() => {
                      navigate('/studies');
                      setNotifOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left transition-colors duration-150 ease-smooth hover:bg-raised">
                    
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-mono text-[10px] text-muted">{exception.id}</span>
                          <StatusBadge value={exception.severity} label={`${exception.severity} severity`} />
                        </span>
                        <span className="mt-1 block text-xs text-ink">{exception.message}</span>
                        <span className="mt-0.5 block text-[11px] text-muted">
                          {exception.study} · {exception.raised}
                        </span>
                      </button>
                    </li>
                )}
                </ul>
              </div>
            }
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotifOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex h-9 items-center gap-2 rounded-lg border border-line px-1.5 text-muted transition-colors duration-150 ease-smooth hover:text-ink">
              
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-[10px] font-semibold text-brand">
                {user ? initials(user.name) : 'OP'}
              </span>
              <ChevronDownIcon className="mr-0.5 h-3.5 w-3.5" />
            </button>
            {profileOpen &&
            <div className="fixed left-3 right-3 top-[4.25rem] z-40 w-auto overflow-hidden rounded-xl border border-line bg-surface shadow-pop sm:absolute sm:left-auto sm:right-0 sm:top-11 sm:w-64">
                <div className="border-b border-line px-4 py-3">
                  <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                  <p className="truncate text-[11px] text-muted">{user?.email}</p>
                  <p className="mt-1.5 text-[11px] text-muted">
                    Signed in with {user?.provider === 'google' ? 'Google' : 'email'}
                  </p>
                </div>
                <div className="p-1.5">
                  <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors duration-150 ease-smooth hover:bg-raised hover:text-ink">
                  
                    <UserIcon className="h-4 w-4" /> Profile & ownership
                  </button>
                  <button
                  type="button"
                  onClick={() => {
                    navigate('/settings');
                    setProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted transition-colors duration-150 ease-smooth hover:bg-raised hover:text-ink">
                  
                    <SettingsIcon className="h-4 w-4" /> Workspace settings
                  </button>
                  <button
                  type="button"
                  onClick={() => {
                    signOut();
                    toast.success('Signed out');
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-bad transition-colors duration-150 ease-smooth hover:bg-brand-soft">
                  
                    <LogOutIcon className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </header>);

}