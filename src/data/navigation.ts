import {
  LayoutDashboardIcon,
  BoxesIcon,
  FlaskConicalIcon,
  GitCompareIcon,
  GaugeIcon,
  BrainCircuitIcon,
  CpuIcon,
  BookOpenIcon,
  SettingsIcon,
  type LucideIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
{
  title: 'Workspace',
  items: [
  { label: 'Dashboard', to: '/', icon: LayoutDashboardIcon },
  { label: 'Model Registry', to: '/registry', icon: BoxesIcon, badge: '142' },
  { label: 'Optimization Studies', to: '/studies', icon: FlaskConicalIcon, badge: '18' },
  { label: 'Candidate Compare', to: '/candidates', icon: GitCompareIcon },
  { label: 'Benchmark Evidence', to: '/benchmarks', icon: GaugeIcon },
  { label: 'Decision Intelligence', to: '/decisions', icon: BrainCircuitIcon }]

},
{
  title: 'Platform',
  items: [
  { label: 'Runtime & Hardware', to: '/runtimes', icon: CpuIcon },
  { label: 'Developer Docs', to: '/docs', icon: BookOpenIcon, badge: 'Soon' },
  { label: 'Settings', to: '/settings', icon: SettingsIcon }]

}];