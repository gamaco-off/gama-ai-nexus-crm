import { CreditCard } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { useEffect } from 'react';

export const CreditsDisplay = () => {
  const { credits, isLoading } = useCredits();

  useEffect(() => {
    console.log('Current credits from profiles table:', credits);
  }, [credits]);

  if (isLoading) return null;

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-2 rounded-lg">
      <CreditCard className="w-4 h-4 text-purple-600" />
      <span className="text-sm font-medium text-purple-700">
        {credits?.amount ?? 0} Credits
      </span>
    </div>
  );
};
