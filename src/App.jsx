import {  useEffect, useState } from 'react'
import { getHerbs } from './services/herbService';

function App() {
  const [herbs, setHerbs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const data = await getHerbs();
        setHerbs(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchHerbs();
  }, []);

  return (
    <div>
      <h1>The Akashic Herbalist</h1>
      {error && <p>Error: {error}</p>}
      <p>Welcome to The Akashic Herbalist! Explore our collection of herbs and their mystical properties.</p>
      <p>Herbs: Loaded: {herbs.length}</p>
      <ul>
        {herbs.map((herb) => (
          <li key={herb.id}>{herb.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;