import { useNavigate } from "react-router-dom";

function Collections() {
    const navigate = useNavigate();
    return (
        <main>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h1>Collections</h1>;
        </main>
    );
}

export default Collections;