import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validation: Stop if fields are empty
    if (!email || !password) {
      return alert("Please enter both email and password.");
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation: Stop if fields are empty
    if (!email || !password) {
      return alert("Please enter both email and password to sign up.");
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
    } else if (data?.user?.identities?.length === 0) {
      // This happens if the user already exists
      alert("This email is already registered. Try logging in instead.");
    } else {
      alert("Success! Check your email for the confirmation link to activate your account.");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '30px', 
      background: 'white', 
      borderRadius: '12px', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      textAlign: 'center' 
    }}>
      <h2 style={{ marginBottom: '20px', fontWeight: '800', letterSpacing: '1px' }}>XFL ADMIN</h2>
      
      <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          style={inputStyle} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={inputStyle} 
        />
        
        <button 
          onClick={handleLogin} 
          disabled={loading} 
          style={primaryButtonStyle}
        >
          {loading ? 'Processing...' : 'Login'}
        </button>

        <div style={{ margin: '10px 0', fontSize: '0.8rem', color: '#888' }}>— OR —</div>

        <button 
          onClick={handleSignUp} 
          disabled={loading}
          style={secondaryButtonStyle}
        >
          Create New Account
        </button>
      </form>
      
      <p style={{ marginTop: '20px', fontSize: '0.75rem', color: '#aaa' }}>
        Access restricted to authorized XFL personnel.
      </p>
    </div>
  );
};

// Simple styles to make it look sharp
const inputStyle = {
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '1rem'
};

const primaryButtonStyle = {
  padding: '12px',
  background: '#111',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1rem'
};

const secondaryButtonStyle = {
  padding: '10px',
  background: 'white',
  color: '#111',
  border: '1px solid #111',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: '600'
};

export default Login;