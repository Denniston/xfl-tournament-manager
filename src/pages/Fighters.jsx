import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Fighters = ({ session }) => {
  const [fighters, setFighters] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [weightClass, setWeightClass] = useState('Bantamweight');
  const [teamId, setTeamId] = useState('');

  const fetchData = async () => {
    const { data: fData } = await supabase.from('fighters').select('*, teams(name)').order('name');
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

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this fighter? This will fail if they are in an active tournament.")) return;
    const { error } = await supabase.from('fighters').delete().eq('id', id);
    if (error) alert("Could not delete: Fighter is likely linked to a tournament bout.");
    else fetchData();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontWeight: '800' }}>Fighter Registry</h2>

      {session && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
          <h4 style={{ marginTop: 0 }}>Add New Fighter</h4>
          <form onSubmit={handleAddFighter} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input placeholder="Fighter Name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            <select value={weightClass} onChange={e => setWeightClass(e.target.value)} style={inputStyle}>
              <option>Bantamweight</option><option>Featherweight</option><option>Lightweight</option><option>Welterweight</option>
            </select>
            <select value={teamId} onChange={e => setTeamId(e.target.value)} style={inputStyle}>
              <option value="">Select Gym</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button type="submit" disabled={loading} style={btnStyle}>
              {loading ? 'Saving...' : 'Add Fighter'}
            </button>
          </form>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #111' }}>
            <th style={{ padding: '12px 5px' }}>Name</th>
            <th>Weight</th>
            <th>Gym</th>
            {session && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fighters.map(f => (
            <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px 5px', fontWeight: 'bold' }}>{f.name}</td>
              <td>{f.weight_class}</td>
              <td>{f.teams?.name || 'Independent'}</td>
              {session && (
                <td>
                  <button onClick={() => handleDelete(f.id)} style={{ color: '#cc0000', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd' };
const btnStyle = { background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };

export default Fighters;