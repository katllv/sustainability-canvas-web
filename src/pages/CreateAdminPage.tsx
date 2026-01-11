import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Field, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createAdmin } from '@/api/users';
import { createAdminSchema } from '@/schemas/auth.schema';
import { useRouter } from '@tanstack/react-router';

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

export default function CreateAdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
  });

  const onSubmit = async (data: CreateAdminFormData) => {
    setLoading(true);
    try {
      await createAdmin({
        name: data.name,
        email: data.email.toLowerCase(),
        password: data.password,
        masterpassword: data.masterpassword,
      });
      toast.success('Admin created successfully!');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.navigate({ to: '/login' });
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create admin';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-the-dark-blue flex flex-col items-center justify-center'>
      <h1 className='text-white absolute top-30'>Digital Sustainability Canvas</h1>
      <Card className='w-full max-w-md p-8'>
        <CardHeader className='text-center mb-4'>
          <CardTitle className='text-xl'>Create Admin Account</CardTitle>
          <p className='text-sm text-muted-foreground mt-2'>
            This is a secret page. Do not share the URL.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'>
            <Field>
              <Input
                id='name'
                type='text'
                placeholder='Enter admin name'
                {...register('name')}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field>
              <Input
                id='email'
                type='text'
                placeholder='Enter admin email'
                {...register('email')}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </Field>

            <Field>
              <Input
                id='password'
                type='password'
                placeholder='Enter admin password'
                {...register('password')}
              />
              {errors.password && <FieldError>{errors.password.message}</FieldError>}
            </Field>

            <Field>
              <Input
                id='masterpassword'
                type='password'
                placeholder='Enter master password'
                {...register('masterpassword')}
              />
              {errors.masterpassword && <FieldError>{errors.masterpassword.message}</FieldError>}
            </Field>

            <Button
              type='submit'
              className='w-full mt-10'
              disabled={loading}>
              {loading ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
