import { useNavigate } from "react-router-dom";




function Journal() {const navigate = useNavigate();
    return (
        <main>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h1>Journal</h1>;
        </main>
    );
}

export default Journal;