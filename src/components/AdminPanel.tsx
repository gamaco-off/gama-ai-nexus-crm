import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  role: string;
  leadgen_webhook?: string;
  emma_webhook?: string;
}

const AdminPanel: React.FC = () => {
  const { profile, loading } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchUsers();
    }
  }, [profile]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, leadgen_webhook, emma_webhook');
    console.log('Fetched users for admin panel:', data, error);
    if (error) setError(error.message);
    else setUsers(data || []);
  };

  const handleUpdate = async (userId: string, leadgen_webhook: string, emma_webhook: string) => {
    setUpdating(userId);
    setError(null);
    const { error } = await supabase
      .from('profiles')
      .update({ leadgen_webhook, emma_webhook })
      .eq('id', userId);
    if (error) setError(error.message);
    await fetchUsers();
    setUpdating(null);
  };

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;
  if (profile?.role !== 'admin') return <div className="p-8 text-center text-red-600 text-lg font-semibold">Access denied. Admins only.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-gray-100">
        <h2 className="text-3xl font-bold mb-6 text-purple-700 flex items-center gap-2">
          <span className="inline-block bg-purple-100 text-purple-700 rounded-full px-3 py-1 text-lg mr-2">Admin</span>
          Panel - User Webhook Assignment
        </h2>
        {error && <div className="text-red-500 mb-4 font-medium">{error}</div>}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white rounded-lg">
            <thead className="bg-gradient-to-r from-purple-100 to-blue-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Full Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Leadgen Webhook</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Emma Webhook</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <WebhookRow key={user.id} user={user} onUpdate={handleUpdate} updating={updating === user.id} isEven={idx % 2 === 0} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const WebhookRow: React.FC<{
  user: Profile;
  onUpdate: (id: string, leadgen_webhook: string, emma_webhook: string) => void;
  updating: boolean;
  isEven: boolean;
}> = ({ user, onUpdate, updating, isEven }) => {
  const [leadgen, setLeadgen] = useState(user.leadgen_webhook || '');
  const [emma, setEmma] = useState(user.emma_webhook || '');

  return (
    <tr className={`transition-colors ${isEven ? 'bg-gray-50' : 'bg-white'} hover:bg-purple-50`}>
      <td className="px-4 py-3 whitespace-nowrap text-gray-900 font-medium">{user.email}</td>
      <td className="px-4 py-3 whitespace-nowrap">{user.full_name}</td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-700'}`}>{user.role}</span>
      </td>
      <td className="px-4 py-3">
        <Input value={leadgen} onChange={e => setLeadgen(e.target.value)} className="w-56" placeholder="Paste or generate..." />
      </td>
      <td className="px-4 py-3">
        <Input value={emma} onChange={e => setEmma(e.target.value)} className="w-56" placeholder="Paste or generate..." />
      </td>
      <td className="px-4 py-3">
        <Button onClick={() => onUpdate(user.id, leadgen, emma)} disabled={updating} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-all">
          {updating ? 'Updating...' : 'Assign/Update'}
        </Button>
      </td>
    </tr>
  );
};

export default AdminPanel; 