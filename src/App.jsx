import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

// Import your pages
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Fighters from './pages/Fighters';
import TournamentCreator from './pages/TournamentCreator';
import BracketView from './pages/BracketView';

function App() {
  const [dbStatus, setDbStatus] = useState("Checking...");

  useEffect(() => {
    async function checkConnection() {
      // Test connection to Supabase
      const { data, error } = await supabase.from('teams').select('id').limit(1);
      if (error) setDbStatus("❌ Connection Error");
      else setDbStatus("✅ Connected");
    }
    checkConnection();
  }, []);

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        
        {/* Navigation Header */}
        <header style={{ 
          background: '#111', 
          color: 'white', 
          padding: '1rem 2rem', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px', fontWeight: '800' }}>XFL OPS CENTER</h1>
          
          <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <Link to="/" style={navLinkStyle}>Dashboard</Link>
            <Link to="/teams" style={navLinkStyle}>Gyms</Link>
            <Link to="/fighters" style={navLinkStyle}>Fighters</Link>
            <Link to="/bracket" style={navLinkStyle}>Brackets</Link>
            <Link to="/create" style={{
              ...navLinkStyle, 
              background: '#FFD700', 
              color: '#000', 
              padding: '6px 12px', 
              borderRadius: '4px',
              fontWeight: 'bold'
            }}>+ New Tournament</Link>
          </nav>
          
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{dbStatus}</div>
        </header>

        {/* Main Application Window */}
        <main style={{ 
          maxWidth: '1100px', 
          margin: '40px auto', 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          minHeight: '60vh',
          padding: '30px'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/fighters" element={<Fighters />} />
            <Route path="/create" element={<TournamentCreator />} />
            <Route path="/bracket" element={<BracketView />} />
          </Routes>
        </main>

        <footer style={{ textAlign: 'center', padding: '30px', color: '#888', fontSize: '0.8rem' }}>
          &copy; 2026 Xtreme Fighting League • Tournament Management System v1.0
        </footer>
      </div>
    </Router>
  );
}

const navLinkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'opacity 0.2s'
};

export default App;