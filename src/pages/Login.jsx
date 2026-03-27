import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert("Check your email for the confirmation link!");
    else alert("Success! Check your email.");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center' }}>XFL Admin Login</h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '10px' }} />
        <button onClick={handleLogin} disabled={loading} style={{ padding: '10px', background: '#111', color: 'white', cursor: 'pointer' }}>
          {loading ? 'Processing...' : 'Login'}
        </button>
        <button onClick={handleSignUp} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '0.8rem' }}>
          Don't have an account? Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;