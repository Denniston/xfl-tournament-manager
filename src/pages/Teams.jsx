import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Teams = ({ session }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*').order('name');
    if (data) setTeams(data);
  };

  useEffect(() => { fetchTeams(); }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    setLoading(true);
    const { error } = await supabase.from('teams').insert([{ name: newTeamName }]);
    if (error) alert(error.message);
    else { setNewTeamName(''); fetchTeams(); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gym? All fighters must be removed from this gym first.")) return;
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) alert("Error: Ensure no fighters are currently assigned to this gym.");
    else fetchTeams();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontWeight: '800' }}>XFL Gyms</h2>
      
      {session && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #eee' }}>
          <h4 style={{ marginTop: 0 }}>Register New Gym</h4>
          <form onSubmit={handleAddTeam} style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Gym Name" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ddd' }} />
            <button type="submit" disabled={loading} style={{ background: '#111', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Add Gym
            </button>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
        {teams.map((team) => (
          <div key={team.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', textAlign: 'center', position: 'relative' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{team.name}</div>
            {session && (
              <button onClick={() => handleDelete(team.id)} style={{ marginTop: '10px', background: 'none', border: 'none', color: '#cc0000', fontSize: '0.7rem', cursor: 'pointer' }}>Remove Gym</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;