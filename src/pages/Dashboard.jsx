import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ teams: 0, fighters: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch counts for teams and fighters
      const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true });
      const { count: fighterCount } = await supabase.from('fighters').select('*', { count: 'exact', head: true });
      
      setStats({ teams: teamCount || 0, fighters: fighterCount || 0 });
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#333' }}>XFL Operations Overview</h2>
      <p style={{ color: '#666' }}>Welcome to the tournament management portal.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #111' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Total Teams</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.teams}</p>
          <Link to="/teams" style={{ fontSize: '0.8rem', color: '#007bff' }}>Manage Gyms →</Link>
        </div>

        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', borderLeft: '5px solid #111' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Active Fighters</h3>
          <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold' }}>{stats.fighters}</p>
          <Link to="/fighters" style={{ fontSize: '0.8rem', color: '#007bff' }}>View Roster →</Link>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', background: '#fff9e6', borderRadius: '8px', border: '1px solid #ffeeba' }}>
        <h4>Quick Start: Next Step</h4>
        <p style={{ fontSize: '0.9rem' }}>To begin a tournament, ensure you have added at least 4 fighters to the registry.</p>
      </div>
    </div>
  );
};

export default Dashboard;