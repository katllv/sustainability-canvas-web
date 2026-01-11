import { useAuth } from '../lib/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/schemas';

export default function SignUpPage() {
  const { register: registerUser, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const ok = await registerUser(data);
      if (ok) {
        toast.success('Registered successfully!');
        router.navigate({ to: '/login' });
      } else {
        toast.error('Registration failed.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication error';
      toast.error(errorMessage);
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
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'>
            <Field>
              <Input
                id='name'
                type='text'
                placeholder='Enter name'
                {...register('name')}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

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

            <Field>
              <Input
                id='registrationCode'
                type='text'
                placeholder='Enter registration code'
                {...register('registrationCode')}
              />
              {errors.registrationCode && (
                <FieldError>{errors.registrationCode.message}</FieldError>
              )}
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
