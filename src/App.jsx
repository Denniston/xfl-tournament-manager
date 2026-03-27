import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { supabase } from './services/supabaseClient';

// Import your pages
import Dashboard from './pages/Dashboard';
import Teams from './pages/Teams';
import Fighters from './pages/Fighters';
import TournamentCreator from './pages/TournamentCreator';
import BracketView from './pages/BracketView';
import Login from './pages/Login';

function App() {
  const [dbStatus, setDbStatus] = useState("Checking...");
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check connection
    async function checkConnection() {
      const { data, error } = await supabase.from('teams').select('id').limit(1);
      if (error) setDbStatus("❌ Connection Error");
      else setDbStatus("✅ Connected");
    }
    checkConnection();

    // Handle Session
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const activeStyle = {
    color: '#FFD700',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '0.95rem'
  };

  const navLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'opacity 0.2s'
  };

  return (
    <Router>
      <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
        
        <header style={{ 
          background: '#111', color: 'white', padding: '1rem 2rem', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', letterSpacing: '1px', fontWeight: '800' }}>XFL OPS CENTER</h1>
          
          <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <NavLink to="/" style={({ isActive }) => isActive ? activeStyle : navLinkStyle}>Dashboard</NavLink>
            <NavLink to="/teams" style={({ isActive }) => isActive ? activeStyle : navLinkStyle}>Gyms</NavLink>
            <NavLink to="/fighters" style={({ isActive }) => isActive ? activeStyle : navLinkStyle}>Fighters</NavLink>
            <NavLink to="/bracket" style={({ isActive }) => isActive ? activeStyle : navLinkStyle}>Brackets</NavLink>
            
            {session ? (
              <>
                <NavLink to="/create" style={({ isActive }) => isActive ? 
                  {...activeStyle, background: '#FFD700', color: '#000', padding: '6px 12px', borderRadius: '4px'} : 
                  {...navLinkStyle, background: '#FFD700', color: '#000', padding: '6px 12px', borderRadius: '4px'}
                }>+ New</NavLink>
                <button onClick={() => supabase.auth.signOut()} style={{ background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Logout</button>
              </>
            ) : (
              <NavLink to="/login" style={navLinkStyle}>Login</NavLink>
            )}
          </nav>
          
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{dbStatus}</div>
        </header>

        <main style={{ 
          maxWidth: '1100px', margin: '40px auto', background: 'white', 
          borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          minHeight: '60vh', padding: '30px'
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/teams" element={<Teams session={session} />} />
            <Route path="/fighters" element={<Fighters session={session} />} />
            <Route path="/create" element={session ? <TournamentCreator /> : <Login />} />
            <Route path="/bracket" element={<BracketView session={session} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <footer style={{ textAlign: 'center', padding: '30px', color: '#888', fontSize: '0.8rem' }}>
          &copy; 2026 Xtreme Fighting League • Tournament Management System v1.0
        </footer>
      </div>
    </Router>
  );
}

export default App;