import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Fetch Teams from Supabase (READ)
  const fetchTeams = async () => {
    const { data, error } = await supabase.from('teams').select('*').order('name');
    if (error) console.error('Error fetching teams:', error.message);
    else setTeams(data);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // 2. Add a New Team (CREATE)
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
      setNewTeamName(''); // Clear input
      fetchTeams(); // Refresh list
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>XFL Gyms & Teams</h2>
      
      {/* Form to Add Team */}
      <form onSubmit={handleAddTeam} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Gym Name (e.g. Alpha Male)"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Gym'}
        </button>
      </form>

      {/* List of Teams */}
      <h3>Registered Teams</h3>
      <ul>
        {teams.map((team) => (
          <li key={team.id} style={{ marginBottom: '5px' }}>
            <strong>{team.name}</strong>
          </li>
        ))}
      </ul>
      {teams.length === 0 && <p>No teams found. Add your first one above!</p>}
    </div>
  );
};

export default Teams;