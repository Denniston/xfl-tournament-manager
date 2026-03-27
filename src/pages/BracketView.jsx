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

  const handleComplete = async () => {
    if (!window.confirm("Archive this tournament as completed?")) return;
    const { error } = await supabase.from('tournaments').update({ status: 'completed' }).eq('id', selectedID);
    if (error) alert(error.message);
    else alert("Tournament finalized.");
  };

  const handleSetWinner = async (bout, winnerId) => {
    setLoading(true);
    const { error: updateError } = await supabase.from('bouts').update({ winner_id: winnerId }).eq('id', bout.id);

    if (updateError) {
      alert(updateError.message);
      setLoading(false);
      return;
    }

    const nextRound = bout.round_number + 1;
    const { data: nextBouts } = await supabase.from('bouts').select('id').eq('tournament_id', bout.tournament_id).eq('round_number', nextRound).order('id', { ascending: true });

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

    fetchData();
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontWeight: '800', margin: 0 }}>Tournament Brackets</h2>
        {session && selectedID && <button onClick={handleComplete} style={{ background: '#cc0000', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Archive Tournament</button>}
      </div>
      
      <select onChange={(e) => setSelectedID(e.target.value)} style={{ padding: '15px', marginBottom: '30px', width: '100%', borderRadius: '8px', border: '2px solid #111', fontSize: '1rem', fontWeight: 'bold' }}>
        <option value="">Select an Active Tournament</option>
        {tournaments.map(t => <option key={t.id} value={t.id}>{t.name} ({t.status.toUpperCase()})</option>)}
      </select>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {bouts.map((bout) => (
          <div key={bout.id} style={{ border: '2px solid #111', borderRadius: '8px', overflow: 'hidden', background: 'white', opacity: loading ? 0.6 : 1, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '10px', background: '#111', color: 'white', fontSize: '0.75rem', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>ROUND {bout.round_number}</span>
              <span style={{ color: '#FFD700' }}>{bout.event_name}</span>
            </div>
            
            <div style={{ padding: '20px' }}>
              <FighterRow bout={bout} fId={bout.fighter_a_id} fName={bout.fighter_a?.name} session={session} handleWin={handleSetWinner} />
              <div style={{ height: '1px', background: '#eee', margin: '15px 0' }}></div>
              <FighterRow bout={bout} fId={bout.fighter_b_id} fName={bout.fighter_b?.name} session={session} handleWin={handleSetWinner} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FighterRow = ({ bout, fId, fName, session, handleWin }) => {
  const isWinner = bout.winner_id === fId;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontWeight: isWinner ? '900' : 'normal', color: isWinner ? '#2e7d32' : '#000', fontSize: '1.1rem' }}>
        {fName || 'TBD'} {isWinner && '🏆'}
      </span>
      {session && !bout.winner_id && fId && (
        <button onClick={() => handleWin(bout, fId)} style={winBtnStyle}>WIN</button>
      )}
    </div>
  );
};

const winBtnStyle = { padding: '5px 12px', fontSize: '0.7rem', cursor: 'pointer', background: '#FFD700', border: '1px solid #000', borderRadius: '4px', fontWeight: 'bold' };

export default BracketView;