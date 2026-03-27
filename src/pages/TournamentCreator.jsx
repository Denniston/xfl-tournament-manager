import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { generateSeededBracket } from '../services/bracketLogic';


const TournamentCreator = () => {
  const [fighters, setFighters] = useState([]);
  const [selectedFighters, setSelectedFighters] = useState([]);
  const [name, setName] = useState('');
  const [size, setSize] = useState(8);
  const [type, setType] = useState('contender');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchFighters = async () => {
      const { data } = await supabase.from('fighters').select('*, teams(name)');
      if (data) setFighters(data);
    };
    fetchFighters();
  }, []);

  const toggleFighter = (fighter) => {
    if (selectedFighters.find(f => f.id === fighter.id)) {
      setSelectedFighters(selectedFighters.filter(f => f.id !== fighter.id));
    } else if (selectedFighters.length < size) {
      setSelectedFighters([...selectedFighters, fighter]);
    }
  };

const handleCreate = async () => {
  if (selectedFighters.length < size) return alert(`You need ${size} fighters for this bracket!`);

  setLoading(true);

  // 1. Create the Tournament Entry
  const { data: tourney, error: tError } = await supabase
    .from('tournaments')
    .insert([{ name, type, status: 'in_progress' }])
    .select()
    .single();

  if (tError) return alert(tError.message);

  // 2. Run the Seeding Logic (DRY)
  const bracket = generateSeededBracket(selectedFighters, size);

  // 3. Generate the Initial Bouts (Quarterfinals)
  const initialBouts = [];
  for (let i = 0; i < size; i += 2) {
    initialBouts.push({
      tournament_id: tourney.id,
      round_number: 1,
      fighter_a_id: bracket[i]?.id,
      fighter_b_id: bracket[i + 1]?.id,
      event_name: 'Event 1' // Default starting event
    });
  }

  const { error: bError } = await supabase.from('bouts').insert(initialBouts);

  if (bError) alert("Error creating bouts: " + bError.message);
  else alert("Tournament & Initial Bracket Created Successfully!");
  
  setLoading(false);
};
  return (
    <div style={{ padding: '20px' }}>
      <h2>Create New XFL Tournament</h2>
      
      <section style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
        <input placeholder="Tournament Name (e.g. Bantamweight GP)" 
               value={name} onChange={e => setName(e.target.value)} 
               style={{ padding: '10px', fontSize: '1rem' }} />
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <label>Size: 
            <select value={size} onChange={e => setSize(Number(e.target.value))}>
              <option value={4}>4-Man</option>
              <option value={8}>8-Man</option>
              <option value={16}>16-Man</option>
            </select>
          </label>
          <label>Type: 
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="contender">Contender Tournament</option>
              <option value="vacant_title">Vacant Title</option>
            </select>
          </label>
        </div>
      </section>

      <h3>Select Fighters ({selectedFighters.length} / {size})</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {fighters.map(f => (
          <div key={f.id} 
               onClick={() => toggleFighter(f)}
               style={{ 
                 padding: '10px', border: '1px solid #ddd', cursor: 'pointer',
                 background: selectedFighters.find(sf => sf.id === f.id) ? '#e3f2fd' : 'white',
                 borderColor: selectedFighters.find(sf => sf.id === f.id) ? '#2196f3' : '#ddd'
               }}>
            <strong>{f.name}</strong> <br/>
            <small>{f.weight_class} • {f.teams?.name}</small>
          </div>
        ))}
      </div>

      <button onClick={handleCreate} 
              style={{ marginTop: '30px', padding: '15px 30px', background: '#111', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Generate Draft Bracket
      </button>
    </div>
  );
};

export default TournamentCreator;