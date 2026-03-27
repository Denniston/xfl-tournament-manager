import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BracketView = () => {
  const [bouts, setBouts] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedID, setSelectedID] = useState('');

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
      if (data) setTournaments(data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (!selectedID) return;
    const fetchBouts = async () => {
      const { data } = await supabase.from('bouts')
        .select('*, fighter_a:fighters!fighter_a_id(name), fighter_b:fighters!fighter_b_id(name)')
        .eq('tournament_id', selectedID);
      if (data) setBouts(data);
    };
    fetchBouts();
  }, [selectedID]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tournament Brackets</h2>
      
      <select onChange={(e) => setSelectedID(e.target.value)} style={{ padding: '10px', marginBottom: '20px' }}>
        <option value="">Select an Active Tournament</option>
        {tournaments.map(t => <option key={t.id} value={t.id}>{t.name} ({t.status})</option>)}
      </select>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bouts.length > 0 ? (
          bouts.map((bout, idx) => (
            <div key={bout.id} style={{ border: '1px solid #333', borderRadius: '4px', width: '250px' }}>
              <div style={{ padding: '10px', background: '#eee', fontSize: '0.8rem', borderBottom: '1px solid #333' }}>
                Match #{idx + 1} - {bout.event_name}
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>
                  {bout.fighter_a?.name || 'BYE'}
                </div>
                <div style={{ paddingTop: '5px' }}>
                  {bout.fighter_b?.name || 'BYE'}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Select a tournament to view the matches.</p>
        )}
      </div>
    </div>
  );
};

export default BracketView;