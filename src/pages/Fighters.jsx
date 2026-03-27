import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Fighters = () => {
  const [fighters, setFighters] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [weightClass, setWeightClass] = useState('Bantamweight');
  const [teamId, setTeamId] = useState('');

  const fetchData = async () => {
    // Fetch Fighters and their Team Names (Joins are easy in Supabase!)
    const { data: fData } = await supabase.from('fighters').select('*, teams(name)');
    const { data: tData } = await supabase.from('teams').select('*').order('name');
    
    if (fData) setFighters(fData);
    if (tData) setTeams(tData);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddFighter = async (e) => {
    e.preventDefault();
    if (!name || !teamId) return alert("Please fill in Name and Team");

    setLoading(true);
    const { error } = await supabase.from('fighters').insert([
      { name, weight_class: weightClass, team_id: teamId }
    ]);

    if (error) alert(error.message);
    else {
      setName('');
      fetchData();
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>XFL Fighter Registry</h2>

      <form onSubmit={handleAddFighter} style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input placeholder="Fighter Name" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px' }} />
        
        <select value={weightClass} onChange={e => setWeightClass(e.target.value)} style={{ padding: '8px' }}>
          <option>Bantamweight</option>
          <option>Featherweight</option>
          <option>Lightweight</option>
          <option>Welterweight</option>
        </select>

        <select value={teamId} onChange={e => setTeamId(e.target.value)} style={{ padding: '8px' }}>
          <option value="">Select Team/Gym</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>

        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Add Fighter'}</button>
      </form>

      <h3>Active Fighters</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Name</th>
            <th>Weight</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {fighters.map(f => (
            <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{f.name}</td>
              <td>{f.weight_class}</td>
              <td>{f.teams?.name || 'No Team'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Fighters;