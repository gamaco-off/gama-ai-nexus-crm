
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCredits = () => {
  const [isDeducting, setIsDeducting] = useState(false);
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();

  const deductCredits = useCallback(async (amount: number, description: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to use this feature.",
        variant: "destructive"
      });
      return false;
    }

    setIsDeducting(true);
    try {
      const { data, error } = await supabase.rpc('deduct_credits', {
        user_id: user.id,
        amount,
        description
      });

      if (error) throw error;

      if (data) {
        // Refresh the user profile to update credits
        await refreshProfile();
        return true;
      } else {
        toast({
          title: "Insufficient Credits",
          description: `You need ${amount} credits for this action.`,
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error deducting credits:', error);
      toast({
        title: "Error",
        description: "Failed to process credit transaction.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsDeducting(false);
    }
  }, [user, refreshProfile, toast]);

  return { deductCredits, isDeducting };
};
