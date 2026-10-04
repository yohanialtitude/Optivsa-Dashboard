import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NewStudyModal } from '../studies/NewStudyModal';
import { validationExceptions } from '../../data/studies';

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [studyOpen, setStudyOpen] = useState(false);

  const openExceptions = validationExceptions.filter((item) => item.state === 'open').length;

  return (
    <div className="min-h-screen w-full bg-canvas">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onNewStudy={() => {
          setStudyOpen(true);
          setMobileOpen(false);
        }}
        openExceptions={openExceptions} />
      
      <div
        className={`flex min-h-screen flex-col transition-[padding] duration-200 ease-smooth ${
        collapsed ? 'lg:pl-[76px]' : 'lg:pl-[264px]'}`
        }>
        
        <Topbar onOpenMobileNav={() => setMobileOpen(true)} onNewStudy={() => setStudyOpen(true)} />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
          <div className="mx-auto w-full max-w-[1500px] space-y-5 sm:space-y-6">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-line px-4 py-4 text-[11px] text-muted sm:px-6">
          Optivsa · optivsa.net — recommendations are decision-making evidence. Results are
          environment-specific and require review before deployment.
        </footer>
      </div>
      <NewStudyModal open={studyOpen} onClose={() => setStudyOpen(false)} />
    </div>);

}