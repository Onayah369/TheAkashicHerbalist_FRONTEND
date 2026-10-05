import { useNavigate } from "react-router-dom";




function Register() {
    const navigate = useNavigate();
    return (
        <main>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h1>Register</h1>;
        </main>
    );
}

export default Register;