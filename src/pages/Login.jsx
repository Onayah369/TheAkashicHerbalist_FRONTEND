import { useNavigate } from "react-router-dom";




function Login() {
    const navigate = useNavigate();
    return (
        <main>
            <button onClick={() => navigate("/")}>
                ← Back to Home
            </button>
            <h1>Login</h1>;
        </main>
    );
}

export default Login;