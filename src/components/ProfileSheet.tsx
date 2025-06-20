import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from './ui/sheet';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileSheet: React.FC<ProfileSheetProps> = ({ open, onOpenChange }) => {
  const { user, profile, refreshProfile, session } = useAuth();
  const [email] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Username to display
  const displayName = session?.user?.user_metadata?.full_name || user?.email || '';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      // Update full_name in profiles table
      if (fullName !== profile?.full_name) {
        const { error: updateError, count } = await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', user?.id)
          .select('id', { count: 'exact' });
        if (updateError) throw updateError;
        // If no row was updated, insert new profile
        if (count === 0) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({ id: user?.id, full_name: fullName, email: user?.email })
          if (insertError) throw insertError;
        }
        await refreshProfile();
      }
      // Update password if provided
      if (password) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { error: pwError } = await supabase.auth.updateUser({ password });
        if (pwError) throw pwError;
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <form onSubmit={handleSave} className="flex flex-col gap-4 min-w-[320px]">
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <div className="px-3 py-2 bg-gray-100 rounded-md text-base text-gray-700">{displayName}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={email} disabled />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Profile updated!</div>}
          <SheetFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}; 