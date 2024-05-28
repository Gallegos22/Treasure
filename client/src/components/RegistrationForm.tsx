import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css';
import { Link } from 'react-router-dom';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };

      const res = await fetch('/api/auth/sign-up', req);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }

      const user = await res.json();
      alert(
        `Successfully registered ${user.username} as userId ${user.userId}.`
      );
      navigate('/');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mt-12 flex ml-32">
        <Link to="/" className="text-red-800 text-3xl">
          Back
        </Link>
      </div>
      <div className="flex justify-center mt-12 underline">
        <h1>Register</h1>
      </div>
      <div className="sign-up-container flex justify-center items-center h-80">
        <div className="form-container w-96 p-2 bg-white border-2 border-black flex justify-center items-center">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-start">
              <label htmlFor="username" className="text-black">
                Username
              </label>
            </div>
            <div>
              <input
                type="text"
                autoComplete="username"
                required
                name="username"
                className="bg-white border-black border-2 rounded-sm text-black"
                id="username"
              />
            </div>
            <div className="flex justify-start mt-1.5 text-black">
              <label htmlFor="password">Password</label>
            </div>
            <div>
              <input
                required
                autoComplete="current-password"
                id="password"
                name="password"
                type="password"
                className="bg-white border-black border-2 rounded-sm text-black"
              />
            </div>
            <div className="mt-5">
              <button
                disabled={isLoading}
                className="p-0.5 bg-sky-400 border-black border-2 rounded-sm">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
