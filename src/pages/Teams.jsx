import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Teams = ({ session }) => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*').order('name');
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;

    setLoading(true);
    const { error } = await supabase
      .from('teams')
      .insert([{ name: newTeamName }]);

    if (error) {
      alert("Error adding team: " + error.message);
    } else {
      setNewTeamName('');
      fetchTeams();
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>XFL Gyms & Teams</h2>
      
      {session && (
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h4>Register New Gym</h4>
          <form onSubmit={handleAddTeam} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Gym Name (e.g. Alpha Male)"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              style={{ padding: '8px', flex: 1 }}
            />
            <button type="submit" disabled={loading} style={{ background: '#111', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
              {loading ? 'Adding...' : 'Add Gym'}
            </button>
          </form>
        </div>
      )}

      <h3>Registered Teams</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
        {teams.map((team) => (
          <div key={team.id} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', textAlign: 'center' }}>
            <strong>{team.name}</strong>
          </div>
        ))}
      </div>
      {teams.length === 0 && <p>No teams found.</p>}
    </div>
  );
};

export default Teams;