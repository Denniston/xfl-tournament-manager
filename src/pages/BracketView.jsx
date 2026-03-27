import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BracketView = () => {
  const [bouts, setBouts] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedID, setSelectedID] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedID) return;
    const { data } = await supabase.from('bouts')
      .select('*, fighter_a:fighters!fighter_a_id(name), fighter_b:fighters!fighter_b_id(name)')
      .eq('tournament_id', selectedID)
      .order('round_number', { ascending: true });
    if (data) setBouts(data);
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
      if (data) setTournaments(data);
    };
    fetchTournaments();
  }, []);

  useEffect(() => { fetchData(); }, [selectedID]);

  const handleSetWinner = async (boutId, winnerId) => {
    setLoading(true);
    // 1. Update the current bout with a winner
    const { error } = await supabase
      .from('bouts')
      .update({ winner_id: winnerId })
      .eq('id', boutId);

    if (error) {
      alert(error.message);
    } else {
      alert("Winner Declared! (Next: Automated advancement logic)");
      fetchData(); // Refresh the UI
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tournament Brackets</h2>
      
      <select onChange={(e) => setSelectedID(e.target.value)} style={{ padding: '15px', marginBottom: '30px', width: '100%' }}>
        <option value="">Select an Active Tournament</option>
        {tournaments.map(t => <option key={t.id} value={t.id}>{t.name} ({t.status})</option>)}
      </select>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {bouts.map((bout) => (
          <div key={bout.id} style={{ border: '2px solid #111', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '8px', background: '#111', color: 'white', fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROUND {bout.round_number}</span>
              <span>{bout.event_name}</span>
            </div>
            
            <div style={{ padding: '15px' }}>
              {/* Fighter A Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: bout.winner_id === bout.fighter_a_id ? 'bold' : 'normal' }}>
                  {bout.fighter_a?.name || 'TBD'}
                </span>
                {!bout.winner_id && bout.fighter_a_id && (
                  <button onClick={() => handleSetWinner(bout.id, bout.fighter_a_id)} style={winBtnStyle}>Win</button>
                )}
              </div>

              {/* Fighter B Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: bout.winner_id === bout.fighter_b_id ? 'bold' : 'normal' }}>
                  {bout.fighter_b?.name || 'TBD'}
                </span>
                {!bout.winner_id && bout.fighter_b_id && (
                  <button onClick={() => handleSetWinner(bout.id, bout.fighter_b_id)} style={winBtnStyle}>Win</button>
                )}
              </div>
            </div>

            {bout.winner_id && (
              <div style={{ padding: '5px', textAlign: 'center', background: '#d4edda', color: '#155724', fontSize: '0.8rem' }}>
                Bout Completed
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const winBtnStyle = {
  padding: '4px 10px',
  fontSize: '0.7rem',
  cursor: 'pointer',
  background: '#FFD700',
  border: '1px solid #000',
  borderRadius: '4px'
};

export default BracketView;