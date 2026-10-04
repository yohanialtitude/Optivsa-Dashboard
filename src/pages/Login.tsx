import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { AuthShell } from '../components/auth/AuthShell';
import { GoogleButton } from '../components/auth/GoogleButton';
import { Button } from '../components/ui/Button';
import { Field, Input, Checkbox } from '../components/ui/Field';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as {from?: string;} | null)?.from ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [pending, setPending] = useState<'email' | 'google' | null>(null);
  const [errors, setErrors] = useState<{email?: string;password?: string;}>({});

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) next.email = 'Enter a valid work email address.';
    if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setPending('email');
    try {
      await signInWithEmail(email, password);
      toast.success('Signed in to Optivsa');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in. Check your credentials.');
    } finally {
      setPending(null);
    }
  };

  const google = async () => {
    setPending('google');
    try {
      await signInWithGoogle();
      toast.success('Signed in with Google');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in with Google.');
    } finally {
      setPending(null);
    }
  };

  return (
    <AuthShell>
      <div className="mt-10">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
        <p className="mt-1.5 text-sm text-[#667085]">
          Access optimization studies, benchmark evidence and model decisions.
        </p>
      </div>

      <div className="mt-7">
        <GoogleButton onClick={google} loading={pending === 'google'} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-[#e5e8ef]" aria-hidden />
        <span className="text-[11px] uppercase tracking-wide text-[#98a2b3]">or use email</span>
        <span className="h-px flex-1 bg-[#e5e8ef]" aria-hidden />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Work email" htmlFor="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="yourname@gmail.com" />
          
        </Field>

        <Field label="Password" htmlFor="password" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="pr-10" />
            
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#667085] hover:text-[#101828]">
              
              {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <Checkbox
            label="Keep me signed in"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)} />
          
          <button
            type="button"
            onClick={() =>
            toast.info('Password reset link sent', {
              description: `Check ${email || 'your inbox'} for reset instructions.`
            })
            }
            className="text-xs font-medium text-[#f63049] hover:underline">
            
            Forgot password?
          </button>
        </div>

        <Button type="submit" fullWidth size="lg" loading={pending === 'email'}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-sm text-[#667085]">
        No account yet?{' '}
        <Link to="/signup" className="font-medium text-[#f63049] hover:underline">
          Create a workspace
        </Link>
      </p>
    </AuthShell>);

}