
import { CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const CreditsDisplay = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg">
      <CreditCard className="w-4 h-4 text-purple-600" />
      <span className="text-sm font-medium text-purple-700">
        {profile.credits || 0} Credits
      </span>
    </div>
  );
};
