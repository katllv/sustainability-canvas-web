import { useState, useRef } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useProfile, useUpdateProfile, useUploadProfilePicture } from '@/api/profiles';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Briefcase, Building2, MapPin, Mail, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { profile: authProfile, user: authUser } = useAuth();
  const { data: profile } = useProfile(authProfile?.id || '');
  const updateProfileMutation = useUpdateProfile();
  const uploadPictureMutation = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditStart = (field: string, currentValue: string | null | undefined) => {
    setEditingField(field);
    setEditValue(currentValue || '');
  };

  const handleEditCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleEditSave = async (field: string) => {
    if (!profile?.id) return;

    try {
      const updates: Record<string, string> = {};

      // Map field names to API field names
      const fieldMap: Record<string, string> = {
        jobTitle: 'jobTitle',
        department: 'department',
        organization: 'organization',
        location: 'location',
      };

      updates[fieldMap[field]] = editValue;

      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        updates,
      });

      toast.success('Profile updated successfully');
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.id) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imageData = e.target?.result as string;
        await uploadPictureMutation.mutateAsync({
          userId: profile.id,
          imageData,
        });

        toast.success('Profile picture updated successfully');
      } catch (error) {
        toast.error('Failed to upload profile picture');
        console.error('Error uploading picture:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className='max-w-2xl mx-auto py-4'>
      {/* Profile Picture Section */}
      <div className='flex flex-col items-center mb-8'>
        <Avatar className='w-24 h-24 mb-4'>
          <AvatarImage
            className='object-cover mx-auto'
            src={profile?.profileUrl || ''}
          />
          <AvatarFallback className='bg-gray-200 text-gray-600 text-3xl'>
            <User className='w-12 h-12' />
          </AvatarFallback>
        </Avatar>

        <h2 className='text-2xl font-bold text-the-dark-blue mb-3'>
          {profile?.name || 'User Name'}
        </h2>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageUpload}
          className='hidden'
        />
        <Button
          variant='outline'
          size='sm'
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadPictureMutation.isPending}
          className='border-gray-300 text-gray-700 hover:bg-gray-50 text-sm'>
          {uploadPictureMutation.isPending ? 'Uploading...' : 'Edit profile picture'}
        </Button>
      </div>

      {/* About Section */}
      <div className='mb-6'>
        <h3 className='text-sm font-semibold text-the-dark-blue mb-4'>About</h3>

        <div className='space-y-1 bg-white border border-gray-200 rounded-lg p-4'>
          {/* Job Title */}
          <div className='flex items-center justify-between py-2'>
            {editingField === 'jobTitle' ? (
              <div className='flex items-center gap-2 flex-1'>
                <Briefcase className='w-4 h-4 text-gray-400' />
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder='Your job title'
                  className='flex-1 h-8 text-sm'
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave('jobTitle')}
                  className='text-green-600 hover:text-green-700'
                  disabled={updateProfileMutation.isPending}>
                  <Check className='w-4 h-4' />
                </button>
                <button
                  onClick={handleEditCancel}
                  className='text-gray-500 hover:text-gray-700'>
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-3 flex-1'>
                  <Briefcase className='w-4 h-4 text-gray-400' />
                  <span
                    className={`text-sm ${profile?.jobTitle ? 'text-gray-700' : 'text-gray-400'}`}>
                    {profile?.jobTitle || 'Your job title'}
                  </span>
                </div>
                <button
                  onClick={() => handleEditStart('jobTitle', profile?.jobTitle)}
                  className='text-the-dark-blue hover:text-the-dark-blue/80'>
                  <Pencil className='w-3.5 h-3.5' />
                </button>
              </>
            )}
          </div>

          {/* Department */}
          <div className='flex items-center justify-between py-2'>
            {editingField === 'department' ? (
              <div className='flex items-center gap-2 flex-1'>
                <Building2 className='w-4 h-4 text-gray-400' />
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder='Your department'
                  className='flex-1 h-8 text-sm'
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave('department')}
                  className='text-green-600 hover:text-green-700'
                  disabled={updateProfileMutation.isPending}>
                  <Check className='w-4 h-4' />
                </button>
                <button
                  onClick={handleEditCancel}
                  className='text-gray-500 hover:text-gray-700'>
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-3 flex-1'>
                  <Building2 className='w-4 h-4 text-gray-400' />
                  <span
                    className={`text-sm ${profile?.department ? 'text-gray-700' : 'text-gray-400'}`}>
                    {profile?.department || 'Your department'}
                  </span>
                </div>
                <button
                  onClick={() => handleEditStart('department', profile?.department)}
                  className='text-the-dark-blue hover:text-the-dark-blue/80'>
                  <Pencil className='w-3.5 h-3.5' />
                </button>
              </>
            )}
          </div>

          {/* Organization */}
          <div className='flex items-center justify-between py-2'>
            {editingField === 'organization' ? (
              <div className='flex items-center gap-2 flex-1'>
                <Building2 className='w-4 h-4 text-gray-400' />
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder='Your organization'
                  className='flex-1 h-8 text-sm'
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave('organization')}
                  className='text-green-600 hover:text-green-700'
                  disabled={updateProfileMutation.isPending}>
                  <Check className='w-4 h-4' />
                </button>
                <button
                  onClick={handleEditCancel}
                  className='text-gray-500 hover:text-gray-700'>
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-3 flex-1'>
                  <Building2 className='w-4 h-4 text-gray-400' />
                  <span
                    className={`text-sm ${profile?.organization ? 'text-gray-700' : 'text-gray-400'}`}>
                    {profile?.organization || 'Your organization'}
                  </span>
                </div>
                <button
                  onClick={() => handleEditStart('organization', profile?.organization)}
                  className='text-the-dark-blue hover:text-the-dark-blue/80'>
                  <Pencil className='w-3.5 h-3.5' />
                </button>
              </>
            )}
          </div>

          {/* Location */}
          <div className='flex items-center justify-between py-2'>
            {editingField === 'location' ? (
              <div className='flex items-center gap-2 flex-1'>
                <MapPin className='w-4 h-4 text-gray-400' />
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder='Your location'
                  className='flex-1 h-8 text-sm'
                  autoFocus
                />
                <button
                  onClick={() => handleEditSave('location')}
                  className='text-green-600 hover:text-green-700'
                  disabled={updateProfileMutation.isPending}>
                  <Check className='w-4 h-4' />
                </button>
                <button
                  onClick={handleEditCancel}
                  className='text-gray-500 hover:text-gray-700'>
                  <X className='w-4 h-4' />
                </button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-3 flex-1'>
                  <MapPin className='w-4 h-4 text-gray-400' />
                  <span
                    className={`text-sm ${profile?.location ? 'text-gray-700' : 'text-gray-400'}`}>
                    {profile?.location || 'Your location'}
                  </span>
                </div>
                <button
                  onClick={() => handleEditStart('location', profile?.location)}
                  className='text-the-dark-blue hover:text-the-dark-blue/80'>
                  <Pencil className='w-3.5 h-3.5' />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div>
        <h3 className='text-sm font-semibold text-the-dark-blue mb-4'>Contact</h3>

        <div className='bg-white border border-gray-200 rounded-lg p-4'>
          <div className='flex items-center justify-between py-2'>
            <div className='flex items-center gap-3 flex-1'>
              <Mail className='w-4 h-4 text-gray-400' />
              <span className='text-sm text-gray-700'>
                {authUser?.email || 'email@example.com'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
