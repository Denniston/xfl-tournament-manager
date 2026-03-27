import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ fighters: 0, teams: 0, tournaments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [f, t, tourney] = await Promise.all([
        supabase.from('fighters').select('*', { count: 'exact', head: true }),
        supabase.from('teams').select('*', { count: 'exact', head: true }),
        supabase.from('tournaments').select('*', { count: 'exact', head: true })
      ]);
      
      setStats({
        fighters: f.count || 0,
        teams: t.count || 0,
        tournaments: tourney.count || 0
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '30px' }}>XFL COMMAND CENTER</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <StatCard label="Total Fighters" count={stats.fighters} color="#111" />
        <StatCard label="Active Gyms" count={stats.teams} color="#FFD700" />
        <StatCard label="Live Tournaments" count={stats.tournaments} color="#cc0000" />
      </div>

      <div style={{ background: '#111', color: 'white', padding: '30px', borderRadius: '12px' }}>
        <h3>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
          <Link to="/create" style={actionBtn}>Start Tournament</Link>
          <Link to="/fighters" style={actionBtn}>Register Fighter</Link>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, count, color }) => (
  <div style={{ padding: '25px', background: 'white', borderLeft: `8px solid ${color}`, boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
    <small style={{ color: '#888', textTransform: 'uppercase', fontWeight: 'bold' }}>{label}</small>
    <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{count}</div>
  </div>
);

const actionBtn = {
  padding: '12px 20px',
  background: '#333',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 'bold'
};

export default Dashboard;