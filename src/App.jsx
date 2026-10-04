import {  useEffect, useState } from 'react'
import { getHerbs } from './services/herbService';

function App() {
  const [herbs, setHerbs] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHerbs = async () => {
      try {
        const data = await getHerbs(search, sort);
        setHerbs(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchHerbs();
  }, [search, sort]);

  return (
    <main>
      <header>
        <h1>The Akashic Herbalist</h1>
        <p>Explore the traditional knowledge of herbs.</p>
      </header>

      <section>
        <h2>Explore Herbs</h2>

        <div>
          <input
            type="text"
            placeholder="Search herbs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sort">Sort by:</label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="">Default</option>
            <option value="name">A-Z</option>
          </select>
        </div>


        {error && <p>{error}</p>}

        <div>
          {herbs.map((herb) => (
            <article key={herb._id}>
              <img
                src={herb.image}
                alt={herb.name}
                width="200"
              />
              <h3>{herb.name}</h3>
              <p>
                <em>{herb.scientificName}</em>
              </p>
              {herb.family && <p>Family: {herb.family}</p>}
              {herb.nativeRegions?.length > 0 && (
                <p>
                  Native to:{" "}
                  {herb.nativeRegions.join(", ")}
                </p>
              )}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;