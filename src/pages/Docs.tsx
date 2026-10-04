import React, { useState } from 'react';
import { toast } from 'sonner';
import { BookOpenIcon, CodeIcon, DatabaseIcon, PlugIcon, ScaleIcon } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Field';

const groups = [
{
  icon: CodeIcon,
  title: 'Model & experiment APIs',
  detail: 'Register model versions, attach datasets and record experiment lineage.',
  endpoints: ['POST /v1/models', 'GET /v1/models/{id}/versions', 'POST /v1/experiments']
},
{
  icon: DatabaseIcon,
  title: 'Metric & benchmark schema',
  detail: 'Submit measured runs with environment metadata and repeat-run variance.',
  endpoints: ['POST /v1/benchmarks', 'GET /v1/benchmarks/{id}', 'GET /v1/metrics/schema']
},
{
  icon: PlugIcon,
  title: 'Runtime integration guides',
  detail: 'Runtime and hardware profile definitions with compatibility context.',
  endpoints: ['GET /v1/runtimes', 'POST /v1/runtimes/checks', 'GET /v1/hardware']
},
{
  icon: ScaleIcon,
  title: 'Decision & study references',
  detail: 'Objectives, constraints, candidate rankings and recorded decisions.',
  endpoints: ['POST /v1/studies', 'GET /v1/studies/{id}/candidates', 'POST /v1/decisions']
}];


export function Docs() {
  const [email, setEmail] = useState('');

  return (
    <>
      <PageHeader
        eyebrow="Developer platform"
        title="API & documentation"
        description="Reference material for the model, benchmark and decision APIs is in preparation."
        actions={<Badge tone="brand">Coming soon</Badge>} />
      

      <Card>
        <CardBody className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <BookOpenIcon className="h-4 w-4 text-brand" aria-hidden />
              Documentation is not published yet
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              Endpoint shapes below are indicative of the planned surface area and may change before
              release. Get notified when the reference goes live.
            </p>
          </div>
          <form
            className="flex w-full max-w-sm items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
                toast.error('Enter a valid email address');
                return;
              }
              toast.success('You are on the documentation list', {
                description: `We will notify ${email} when the reference is published.`
              });
              setEmail('');
            }}>
            
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              aria-label="Email for documentation updates" />
            
            <Button type="submit">Notify me</Button>
          </form>
        </CardBody>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) =>
        <Card key={group.title} as="article" className="flex h-full flex-col">
            <CardHeader
            title={
            <span className="flex items-center gap-2">
                  <group.icon className="h-4 w-4 text-brand" aria-hidden />
                  {group.title}
                </span>
            }
            subtitle={group.detail}
            actions={<Badge tone="neutral">Draft</Badge>} />
          
            <CardBody className="flex flex-1 flex-col">
              <ul className="space-y-2">
                {group.endpoints.map((endpoint) =>
              <li
                key={endpoint}
                className="rounded-lg border border-line bg-raised px-3 py-2 font-mono text-[11px] text-ink">
                
                    {endpoint}
                  </li>
              )}
              </ul>
              <div className="mt-auto pt-4">
                <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={() =>
                toast.info(`${group.title} reference is not published yet`, {
                  description: 'Join the notification list to be told when it is available.'
                })
                }>
                
                  View reference
                </Button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </>);

}