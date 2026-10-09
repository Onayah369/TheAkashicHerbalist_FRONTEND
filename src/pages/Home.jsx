import {  useEffect, useState } from 'react'
import { getHerbs } from '../services/herbService';
import { useAuth } from "../context/authContext";
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';


function Home() {
    const [herbs, setHerbs] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [usage, setUsage] = useState("");
    const [continent, setContinent] = useState("");
    const [selectedHerb, setSelectedHerb] = useState(null);
    const [error, setError] = useState("");
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [country, setCountry] = useState("");
    const countriesByContinent = {
        Africa: ["Egypt", "Nigeria", "South Africa"],
        Asia: ["China", "India", "Japan"],
        Europe: ["France", "Germany", "Italy"],
        "North America": ["Canada", "Mexico", "United States"],
        "South America": ["Brazil", "Argentina", "Peru"],
        Oceania: ["Australia", "New Zealand"],
};


    const { user, token } = useAuth();

    const handleFavorite = async (herbId) => {
        const isFavorite = favoriteIds.includes(herbId);

        try {
            const response = await fetch(
                `http://localhost:8888/api/favorites/${herbId}`,
                {
                    method: isFavorite ? "DELETE" : "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update favorite");
            }

            if (isFavorite) {
                setFavoriteIds(favoriteIds.filter((id) => id !== herbId));
            } else {
                setFavoriteIds([...favoriteIds, herbId]);
            }
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        const fetchHerbs = async () => {
        try {
        setError("");

        const data = await getHerbs(
            search,
            sort,
            usage,
            continent,
            country
        );
        setHerbs(data);
        } catch (error) {
        setError(error.message);
        }
    };

    fetchHerbs();
    }, [search, sort, usage, continent, country]);

    useEffect(() => {
        setCountry("");
    }, [continent]);


    useEffect(() => {
        const getFavorites = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8888/api/favorites",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load favorites");
                }

                setFavoriteIds(data.favorites.map((herb) => herb._id));
            } catch (error) {
                setError(error.message);
            }
        };

        if (token) {
            getFavorites();
        } else {
            setFavoriteIds([]);
        }
    }, [token]);


    if (selectedHerb) {
        const uniqueUses = [
        ...new Set(
        selectedHerb.traditionalUses?.map((item) => item.use) || []
        ),
    ];

    const uniquePlantParts = [
        ...new Set(
            selectedHerb.traditionalUses
            ?.map((item) => item.plantPart)
            .filter(Boolean) || []
        ),
    ];

    const isFavorite = favoriteIds.includes(selectedHerb._id);

    return (
        <main className='page herb-detail-page'>
            <Navbar pageTitle="Herb Details" onBack={() => setSelectedHerb(null)} />

            <section className='herb-detail'>

                <div className='herb-detail-layout'>

                    <div className='herb-detail-image-card'>
                        <img
                            src={selectedHerb.image}
                            alt={selectedHerb.name}
                            width="400"
                        />
                    </div>

                    <div className='herb-detail-content'>
                        <p className='section-eyebrow'>
                            HERBAL PROFILE
                        </p>

                        <h1>{selectedHerb.name}</h1>

                        <p className='herb-detail-scientific'>
                            <em>{selectedHerb.scientificName}</em>
                        </p>

                        {selectedHerb.family && (
                            <p className='herb-detail-family'>
                                Family:{selectedHerb.family}
                            </p>
                        )}

                        {token && (
                            <button
                                type='button'
                                className='herb-detail-favorite'
                                onClick={() => handleFavorite(selectedHerb._id)}
                            >
                                {isFavorite
                                    ? "♥ Remove from Favorites"
                                    : "♡ Add to Favorites"}
                            </button>
                        )}

                        {selectedHerb.usageCategories?.length > 0 && (
                            <div className='herb-detail-section'>
                                <h2>Uses & Categories</h2>

                                <div className='herb-detail-tags'>
                                    {selectedHerb.usageCategories.map(
                                        (category) => (
                                            <span key={category}>
                                                {category}
                                            </span>
                                        )
                                    )}
                                </div>
                        </div>
                    )}

                    {selectedHerb.continents?.length > 0 && (
                    <div className='herb-detail-section'>
                        <h2>Native Regions</h2>
                        <p>{selectedHerb.continents.join(", ")}</p>
                    </div>
                    )}
                    {selectedHerb.countries?.length > 0 && (
                    <div className='herb-detail-section'>
                        <h2>Countries</h2>
                        <p>{selectedHerb.countries.join(", ")}</p>
                    </div>
                    )}

                    {selectedHerb.commonNames?.length > 0 && (
                    <div className='herb-detail-section'>
                        <h2>Common Names</h2>
                        <p>{selectedHerb.commonNames.join(", ")}</p>
                    </div>
                    )}

                    {uniquePlantParts.length > 0 && (
                    <div className='herb-detail-section'>
                        <h2>Plant Parts Used</h2>
                        <p>{uniquePlantParts.join(", ")}</p>
                    </div>
                    )}

                    {uniqueUses.length > 0 && (
                        <div className='herb-detail-section'>
                            <h2>Traditional Uses</h2>

                            <ul className='traditional-use-list'>
                                {uniqueUses.map((use) => (
                                <li key={use}>{use}</li>
                                ))}
                            </ul>
                        </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
        );
    }

    return (
        <main className='page home-page'>

            <Navbar />

            {token && user ? (
                <p className="welcome-message">
                    Welcome back, {user.username}
                </p>
            ) : null}

            <div className='home-hero'>
                <p className='hero-eyebrow'>THE ART OF HERBALISM</p>
                <h1>The Akashic Herbalist</h1>
                <p>Explore the healing properties and uses of herbs from around the world.</p>
            </div>

            <section className='herb-explorer'>
                <div className='explorer-heading'>

                    <div>
                        <p className='section-eyebrow'>DISCOVER</p>
                        <h2>Explore Herbs</h2>
                    </div>

                    <p className='herb-count'>
                        Showing {herbs.length} {herbs.length === 1 ? "herb" : "herbs"}
                    </p>
                </div>

                <div className='herb-filters'>

                    <div className='search-wrapper'>
                        <label htmlFor='herb-search'>Search</label>
                        <input
                            type="text"
                            placeholder="Search herbs..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div className='filter-group'>
                        <label htmlFor="sort">Sort by</label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <option value="">Default</option>
                            <option value="name">A-Z</option>
                        </select>
                    </div>

                    <div className='filter-group'>
                        <label htmlFor="usage">Usage:</label>

                        <select
                            id="usage"
                            value={usage}
                            onChange={(event) => setUsage(event.target.value)}
                        >
                            <option value="">All Uses</option>
                            <option value="Cardiovascular">Cardiovascular</option>
                            <option value="Digestive">Digestive</option>
                            <option value="Eye & Ear">Eye & Ear</option>
                            <option value="General Wellness">General Wellness</option>
                            <option value="Immune & Infectious">Immune & Infectious</option>
                            <option value="Liver & Gallbladder">Liver & Gallbladder</option>
                            <option value="Musculoskeletal">Musculoskeletal</option>
                            <option value="Nervous System">Nervous System</option>
                            <option value="Reproductive">Reproductive</option>
                            <option value="Respiratory">Respiratory</option>
                            <option value="Skin">Skin</option>
                            <option value="Urinary & Renal">Urinary & Renal</option>
                        </select>
                    </div>

                    <div className='filter-group'>
                        <label htmlFor="continent">Continent:</label>

                        <select
                            id="continent"
                            value={continent}
                            onChange={(event) => setContinent(event.target.value)}
                        >
                            <option value="">All Continents</option>
                            <option value="Africa">Africa</option>
                            <option value="Asia">Asia</option>
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="South America">South America</option>
                            <option value="Oceania">Oceania</option>
                        </select>
                    </div>

                    <div className='filter-group'>
                        <label htmlFor="country">Country:</label>

                        <select
                            id="country"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            disabled={!continent}
                        >
                            <option value="">
                                {continent ? "All Countries" : "Select a continent first"}
                            </option>

                            {(countriesByContinent[continent] || []).map((countryName) => (
                                <option key={countryName} value={countryName}>
                                    {countryName}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {(search || sort || usage || continent || country) && (
                    <div className='active-filters'>
                        <div className='active-filter-heading'>
                            <span>Active filters</span>

                            <button
                                type='button'
                                onClick={() => {
                                    setSearch("");
                                    setSort("");
                                    setUsage("");
                                    setContinent("");
                                    setCountry("");
                                }}
                            >
                                Clear all
                            </button>
                        </div>


                        <div className="filter-chips">
                            {search && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setSearch("")}
                                >
                                    Search: {search} ×
                                </button>
                            )}

                            {sort && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setSort("")}
                                >
                                    A-Z ×
                                </button>
                            )}

                            {usage && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setUsage("")}
                                >
                                    {usage} ×
                                </button>
                            )}

                            {continent && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setContinent("")}
                                >
                                    {continent} ×
                                </button>
                            )}

                            {country && (
                                <button
                                    type="button"
                                    className="filter-chip"
                                    onClick={() => setCountry("")}
                                >
                                    {country} ×
                                </button>
                            )}
                        </div>
                    </div>
                )}

                    {error && <p>{error}</p>}


                    <div className='herb-grid'>
                            {herbs.map((herb) => (
                                <article
                                    className='herb-card'
                                    key={herb._id}
                                    onClick={() => setSelectedHerb(herb)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className='herb-image-wrapper'>
                                        <img
                                            src={herb.image}
                                            alt={herb.name}
                                            width="200"
                                        />
                                    </div>
                                    <div className='herb-card-content'>
                                        <div>
                                            <h3>{herb.name}</h3>
                                            <p className='scientific-name'>
                                                <em>{herb.scientificName}</em>
                                            </p>
                                        </div>

                                            {herb.family && (
                                                <p className='herb-family'>Family:
                                                    {herb.family}
                                                </p>
                                            )}

                                            {herb.continents?.length > 0 && (
                                                <p className='herb-region'>
                                                Region: {herb.continents.join(", ")}
                                                </p>
                                            )}

                                            {herb.usageCategories?.length > 0 && (
                                                <div className='herb-tags'>
                                                    {herb.usageCategories.map((category) => (
                                                        <span key={category}>
                                                            {category}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {token && (
                                                <button
                                                className='favorite-button'
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleFavorite(herb._id);
                                                    }}
                                                >
                                                    {favoriteIds.includes(herb._id)
                                                    ?"♥ Remove from Favorites"
                                                    :"♡ Add to Favorites"}
                                                </button>
                                )}

                            </div>

                        </article>

                    ))}

                </div>

            </section>

        </main>

    );

}
export default Home;