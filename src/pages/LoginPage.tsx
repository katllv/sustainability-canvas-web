import { Link, useRouter } from '@tanstack/react-router';
import { useAuth } from '@/lib/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/schemas';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const ok = await login(data.email, data.password);
      if (ok) {
        toast.success('Logged in successfully!');
        router.navigate({ to: '/' });
      } else {
        toast.error('Login failed.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication error';
      toast.error(errorMessage);
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
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'>
            <Field>
              <Input
                id='email'
                type='text'
                placeholder='Enter email'
                {...register('email')}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <Input
                id='password'
                type='password'
                placeholder='Enter password'
                {...register('password')}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
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
