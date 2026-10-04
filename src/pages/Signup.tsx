import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthShell } from '../components/auth/AuthShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Button } from '../components/ui/Button';
import { Field, Input, Checkbox } from '../components/ui/Field';
import { useAuth } from '../contexts/AuthContext';

function getPasswordStrength(password: string) {
  return [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ].filter(Boolean).length;
}

const passwordStrengthLabels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];

export function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState<'email' | 'google' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid work email address.';
    if (password.length < 8) next.password = 'Use at least 8 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.';
    if (!accepted) next.accepted = 'Confirm the evidence and review policy to continue.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending('email');
    try {
      await signUp(name.trim(), email, password);
      toast.success('Workspace created');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to create the workspace.');
    } finally {
      setPending(null);
    }
  };

  const google = async () => {
    setPending('google');
    try {
      await signInWithGoogle();
      toast.success('Signed up with Google');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign up with Google.');
    } finally {
      setPending(null);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <AuthShell>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold tracking-tight">Create your Optivsa workspace</h1>
        <p className="mt-1.5 text-sm text-[#667085]">
          Set up a registry for models, studies and accountable model decisions.
        </p>
      </div>

      <div className="mt-7">
        <GoogleButton onClick={google} loading={pending === 'google'} label="Sign up with Google" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#e5e8ef]" aria-hidden />
        <span className="text-[11px] uppercase tracking-wide text-[#98a2b3]">or use email</span>
        <span className="h-px flex-1 bg-[#e5e8ef]" aria-hidden />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <Input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your full name"
            autoComplete="name" />
          
        </Field>
        <Field label="Work email" htmlFor="signup-email" error={errors.email}>
          <Input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="yourname@gmail.com"
            autoComplete="email" />
          
        </Field>
        <Field
          label="Password"
          htmlFor="signup-password"
          error={errors.password}
          hint="Minimum 8 characters.">
          
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password" />
          <div className="mt-2" aria-live="polite">
            <div className="flex gap-1" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((segment) =>
              <span
                key={segment}
                className={`h-1.5 flex-1 rounded-full ${segment <= passwordStrength ?
                passwordStrength <= 1 ? 'bg-[#dc2626]' :
                passwordStrength <= 2 ? 'bg-[#f59e0b]' :
                passwordStrength <= 3 ? 'bg-[#eab308]' : 'bg-[#16a34a]' : 'bg-[#e5e7eb]'}`} />
              )}
            </div>
            {password.length > 0 &&
            <p className="mt-1 text-[11px] text-[#667085]">
              Password strength: {passwordStrengthLabels[passwordStrength]}
            </p>}
          </div>
        </Field>
        <Field label="Confirm password" htmlFor="confirm-password" error={errors.confirmPassword}>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password" />
        </Field>
        <Checkbox
          label="I understand recommendations are decision-making evidence and require human review before deployment."
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)} />
        
        {errors.accepted && <p className="text-[11px] text-[#dc2626]">{errors.accepted}</p>}

        <Button type="submit" fullWidth size="lg" loading={pending === 'email'}>
          Create workspace
        </Button>
      </form>

      <p className="mt-6 text-sm text-[#667085]">
        Already have access?{' '}
        <Link to="/login" className="font-medium text-[#f63049] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>);

}