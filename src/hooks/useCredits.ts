import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CreditTransaction {
  amount: number;
  description: string;
}

export function useCredits() {
    const queryClient = useQueryClient();

    // Fetch current credits
    const { data: credits, isLoading } = useQuery({
        queryKey: ['credits'],
        queryFn: async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            console.log('Fetching credits for user:', user.id);

            const { data, error } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Error fetching credits:', error);
                throw error;
            }

            console.log('Found profile with credits:', data);
            return { amount: data.credits };
        },
    });

    // Deduct credits
    const deductCredits = useMutation({
        mutationFn: async (transaction: CreditTransaction) => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;
            if (!user) throw new Error('No user found');

            console.log('Starting credit deduction for user:', user.id);
            console.log('Transaction details:', transaction);

            // First check current credits
            const { data: currentProfile, error: fetchError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (fetchError) {
                console.error('Error fetching current credits:', fetchError);
                throw fetchError;
            }

            console.log('Current credits before deduction:', currentProfile?.credits);

            if (currentProfile.credits < transaction.amount) {
                throw new Error('Insufficient credits');
            }

            // Use the deduct_credits function from the database
            const { data, error } = await supabase
                .rpc('deduct_credits', {
                    user_id: user.id,
                    amount: transaction.amount,
                    description: transaction.description
                });

            if (error) {
                console.error('Error deducting credits:', error);
                throw error;
            }

            if (!data) {
                throw new Error('Failed to deduct credits');
            }

            // Fetch updated credits
            const { data: updatedProfile, error: updateError } = await supabase
                .from('profiles')
                .select('credits')
                .eq('id', user.id)
                .single();

            if (updateError) {
                console.error('Error fetching updated credits:', updateError);
                throw updateError;
            }

            console.log('Updated credits:', updatedProfile);
            return { amount: updatedProfile.credits };
        },
        onSuccess: () => {
            console.log('Invalidating credits query after deduction');
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
        onError: (error) => {
            console.error('Error in credit deduction mutation:', error);
        }
    });

    return {
        credits,
        isLoading,
        deductCredits,
    };
}
