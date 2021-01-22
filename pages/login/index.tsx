import PageHead from "../../components/PageHead";
import { useState, FormEvent } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        alert('Coming Soon!');
        // api.login(email, password);
    }

    return (
        <div>
            <PageHead title="BrainDeck Login" />
            <div className="relative bg-white overflow-hidden">
                <div className="mx-auto px-6 mt-6 max-w-4xl">
                    <div className="container mb-6 md:mb-10">
                        <div className="my-5 text-3xl font-semibold">BrainDeck Login</div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    className="ml-2 rounded py-1 px-2 align-middle bg-gray-100"
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    className="ml-2 rounded py-1 px-2 align-middle bg-gray-100"
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    className="py-2 px-6 rounded-md bg-blue-600 text-gray-50"
                                    type="submit"
                                    id="submit"
                                    value="Login"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}