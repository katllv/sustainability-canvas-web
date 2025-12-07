import { useState } from 'react';
import { useAuth } from '../lib/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function SignUpPage() {
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const { register, loading } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await register({ password, name, email, registrationCode });
      if (ok) {
        toast.success('Registered successfully!');
        // Redirect to login page
        router.navigate({ to: '/login' });
      } else toast.error('Registration failed.');
    } catch (error: any) {
      toast.error(error.message || 'Authentication error');
    }
  };

  return (
    <div className='min-h-screen bg-the-dark-blue flex flex-col items-center justify-center'>
      <h1 className='text-white absolute top-30'>Digital Sustainability Canvas</h1>
      <Card className='w-full max-w-md p-8'>
        <CardHeader className='text-center mb-4'>
          <CardTitle className='text-xl'>Sign up for an account</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleRegister}
            className='space-y-4'>
            <Field>
              <Input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter name'
                required
              />
              <FieldError />
            </Field>

            <Field>
              <Input
                id='email'
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter email'
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

            <Field>
              <Input
                id='registrationCode'
                type='text'
                value={registrationCode}
                onChange={(e) => setRegistrationCode(e.target.value)}
                placeholder='Enter registration code'
                required
              />
              <FieldError />
            </Field>

            <Button
              type='submit'
              className='w-full mt-10'
              disabled={loading}>
              {loading ? 'Loading...' : 'Sign Up'}
            </Button>
          </form>

          <Link
            to='/login'
            className='text-center text-sm mt-6 underline cursor-pointer block'>
            Log in to your account
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
