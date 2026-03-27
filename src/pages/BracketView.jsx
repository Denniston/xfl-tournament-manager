import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const BracketView = ({ session }) => {
  const [bouts, setBouts] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedID, setSelectedID] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!selectedID) return;
    const { data } = await supabase.from('bouts')
      .select('*, fighter_a:fighters!fighter_a_id(name), fighter_b:fighters!fighter_b_id(name)')
      .eq('tournament_id', selectedID)
      .order('round_number', { ascending: true })
      .order('id', { ascending: true });
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

  const handleSetWinner = async (bout, winnerId) => {
    setLoading(true);
    
    // 1. Update winner of current bout
    const { error: updateError } = await supabase
      .from('bouts')
      .update({ winner_id: winnerId })
      .eq('id', bout.id);

    if (updateError) {
      alert(updateError.message);
      setLoading(false);
      return;
    }

    // 2. Advancement Logic
    const nextRound = bout.round_number + 1;
    const { data: nextBouts } = await supabase
      .from('bouts')
      .select('id')
      .eq('tournament_id', bout.tournament_id)
      .eq('round_number', nextRound)
      .order('id', { ascending: true });

    if (nextBouts && nextBouts.length > 0) {
      const currentRoundBouts = bouts.filter(b => b.round_number === bout.round_number);
      const boutIndex = currentRoundBouts.findIndex(b => b.id === bout.id);
      const nextBoutIndex = Math.floor(boutIndex / 2);
      const targetBout = nextBouts[nextBoutIndex];

      if (targetBout) {
        const isFighterA = boutIndex % 2 === 0;
        const updateData = isFighterA ? { fighter_a_id: winnerId } : { fighter_b_id: winnerId };
        await supabase.from('bouts').update(updateData).eq('id', targetBout.id);
      }
    }

    alert("Winner set and advanced to next round!");
    fetchData();
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
          <div key={bout.id} style={{ border: '2px solid #111', borderRadius: '8px', overflow: 'hidden', opacity: loading ? 0.6 : 1 }}>
            <div style={{ padding: '8px', background: '#111', color: 'white', fontSize: '0.7rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROUND {bout.round_number}</span>
              <span>{bout.event_name}</span>
            </div>
            
            <div style={{ padding: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: bout.winner_id === bout.fighter_a_id ? 'bold' : 'normal', color: bout.winner_id === bout.fighter_a_id ? 'green' : 'black' }}>
                  {bout.fighter_a?.name || 'TBD'}
                </span>
                {/* Only show "Win" button if user is logged in (session exists) */}
                {session && !bout.winner_id && bout.fighter_a_id && (
                  <button onClick={() => handleSetWinner(bout, bout.fighter_a_id)} style={winBtnStyle}>Win</button>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: bout.winner_id === bout.fighter_b_id ? 'bold' : 'normal', color: bout.winner_id === bout.fighter_b_id ? 'green' : 'black' }}>
                  {bout.fighter_b?.name || 'TBD'}
                </span>
                {/* Only show "Win" button if user is logged in (session exists) */}
                {session && !bout.winner_id && bout.fighter_b_id && (
                  <button onClick={() => handleSetWinner(bout, bout.fighter_b_id)} style={winBtnStyle}>Win</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const winBtnStyle = {
  padding: '4px 10px', fontSize: '0.7rem', cursor: 'pointer',
  background: '#FFD700', border: '1px solid #000', borderRadius: '4px'
};

export default BracketView;