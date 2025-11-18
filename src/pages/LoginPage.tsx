import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await login(username, password);
      if (ok) {
        toast.success('Logged in successfully!');
        navigate('/');
      } else toast.error('Login failed.');
    } catch (error: any) {
      toast.error(error.message || 'Authentication error');
    }
  };

  return (
    <div className='min-h-screen bg-the-dark-blue flex flex-col items-center justify-center'>
      <h1 className='text-white absolute top-40'>Digital Sustainability Canvas</h1>
      <Card className='w-full max-w-md p-8'>
        <CardHeader className='text-center mb-4'>
          <CardTitle className='text-xl'>Log in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleLogin}
            className='space-y-4'>
            <Field>
              <Input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Enter username'
                required
              />
              <FieldError />
            </Field>

            <Field>
              <Input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter password'
                required
              />
              <FieldError />
            </Field>

            <Button
              type='submit'
              className='w-full mt-10'
              disabled={loading}>
              {loading ? 'Loading...' : 'Log In'}
            </Button>
          </form>

          <Link
            to='/signup'
            className='text-center text-sm mt-6 underline cursor-pointer block'>
            Sign up for an account
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
