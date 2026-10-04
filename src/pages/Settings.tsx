import React, { useState } from 'react';
import { toast } from 'sonner';
import { LogOutIcon, MoonIcon, SaveIcon, SunIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Field, Input, Select, Checkbox } from '../components/ui/Field';
import { useAuth, initials } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const trackers = [
{ name: 'MLflow tracking server', state: 'Connected', detail: 'Experiment runs and artefacts' },
{ name: 'Weights & Biases', state: 'Connected', detail: 'Sweep metadata import' },
{ name: 'Internal benchmark harness', state: 'Connected', detail: 'Latency and throughput runs' },
{ name: 'Kubeflow pipelines', state: 'Not connected', detail: 'Trial orchestration' }];


export function Settings() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState(user?.role ?? 'Lead ML Engineer');
  const [objective, setObjective] = useState('Latency-first');
  const [requireApproval, setRequireApproval] = useState(true);
  const [blockOnException, setBlockOnException] = useState(true);
  const [minRuns, setMinRuns] = useState('3');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setSaving(false);
    toast.success('Workspace settings saved');
  };

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Profile, appearance, decision policy and connected experiment systems."
        actions={
        <Button icon={SaveIcon} loading={saving} onClick={save}>
            Save changes
          </Button>
        } />
      

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-7">
          <Card>
            <CardHeader title="Profile & ownership" subtitle="Shown on every decision you record" />
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-brand-soft text-sm font-semibold text-brand">
                  {user ? initials(user.name) : 'OP'}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{user?.name}</p>
                  <p className="truncate text-xs text-muted">
                    Signed in with {user?.provider === 'google' ? 'Google' : 'email'}
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="s-name">
                  <Input id="s-name" value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label="Work email" htmlFor="s-email">
                  <Input
                    id="s-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)} />
                  
                </Field>
                <Field label="Role" htmlFor="s-role" className="sm:col-span-2">
                  <Select id="s-role" value={role} onChange={(event) => setRole(event.target.value)}>
                    <option>Lead ML Engineer</option>
                    <option>ML Engineer</option>
                    <option>MLOps Engineer</option>
                    <option>Data Scientist</option>
                    <option>Inference Engineer</option>
                    <option>AI Platform Lead</option>
                  </Select>
                </Field>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Decision policy"
              subtitle="Controls how configurations can be selected" />
            
            <CardBody className="space-y-4">
              <Field label="Default study objective" htmlFor="s-objective">
                <Select
                  id="s-objective"
                  value={objective}
                  onChange={(event) => setObjective(event.target.value)}>
                  
                  <option>Latency-first</option>
                  <option>Quality-first</option>
                  <option>Cost-first</option>
                  <option>Balanced</option>
                </Select>
              </Field>
              <Field
                label="Minimum repeat runs before high confidence"
                htmlFor="s-runs"
                hint="Fewer runs are reported as low confidence.">
                
                <Select id="s-runs" value={minRuns} onChange={(event) => setMinRuns(event.target.value)}>
                  <option value="1">1 run</option>
                  <option value="3">3 runs</option>
                  <option value="5">5 runs</option>
                </Select>
              </Field>
              <div className="space-y-2.5 rounded-lg border border-line bg-raised p-3.5">
                <Checkbox
                  label="Require a named reviewer to approve every selected configuration"
                  checked={requireApproval}
                  onChange={(event) => setRequireApproval(event.target.checked)} />
                
                <Checkbox
                  label="Block selection while an open validation exception affects the study"
                  checked={blockOnException}
                  onChange={(event) => setBlockOnException(event.target.checked)} />
                
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-5">
          <Card>
            <CardHeader title="Appearance" subtitle="Dashboard theme preference" />
            <CardBody>
              <div className="grid grid-cols-2 gap-3">
                {(
                [
                { key: 'light', label: 'Light', icon: SunIcon },
                { key: 'dark', label: 'Dark', icon: MoonIcon }] as
                const).
                map((option) =>
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setTheme(option.key)}
                  aria-pressed={theme === option.key}
                  className={`rounded-xl border p-4 text-left transition-colors duration-150 ease-smooth ${
                  theme === option.key ?
                  'border-brand bg-brand-soft' :
                  'border-line hover:bg-raised'}`
                  }>
                  
                    <option.icon
                    className={`h-4 w-4 ${theme === option.key ? 'text-brand' : 'text-muted'}`}
                    aria-hidden />
                  
                    <span className="mt-2 block text-xs font-medium text-ink">{option.label}</span>
                    <span className="mt-0.5 block text-[11px] text-muted">
                      {option.key === 'light' ? 'Default theme' : 'Low-light analysis'}
                    </span>
                  </button>
                )}
              </div>
              <p className="mt-3 text-[11px] text-muted">
                Sign-in screens always use the light theme.
              </p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Experiment systems" subtitle="Sources feeding the registry" />
            <CardBody className="py-1">
              <ul className="divide-y divide-line">
                {trackers.map((tracker) =>
                <li key={tracker.name} className="flex items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-medium text-ink">
                        {tracker.name}
                      </span>
                      <span className="block truncate text-[11px] text-muted">{tracker.detail}</span>
                    </span>
                    {tracker.state === 'Connected' ?
                  <Badge tone="success" dot>
                        Connected
                      </Badge> :

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                    toast.info(`${tracker.name} connection requested`, {
                      description: 'An administrator must approve new experiment sources.'
                    })
                    }>
                    
                        Connect
                      </Button>
                  }
                  </li>
                )}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Session" subtitle="End your session on this device" />
            <CardBody>
              <Button variant="danger" icon={LogOutIcon} fullWidth onClick={signOut}>
                Sign out of Optivsa
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>);

}