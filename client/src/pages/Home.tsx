import { useNavigate } from 'react-router-dom';
import { LandingPage } from './LandingPage';
import { useUser } from '../components/useUser';
import './Home.css';
import { type FormEvent, useState } from 'react';

export function Home() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      console.log('formData:', formData);
      const userData = Object.fromEntries(formData);
      console.log('userData:', userData);
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      };
      const res = await fetch('/api/auth/sign-in', req);
      console.log('response:', res);
      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const { user, token } = await res.json();
      console.log('user:', user);
      console.log('token:', token);
      handleSignIn(user, token);
      console.log('Signed In', user);
      console.log('Received token:', token);
      navigate('landing-page');
    } catch (err) {
      alert(`Error signing in: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div className="mt-24">
        <h1>User Loginn</h1>
      </div>
      {!user && (
        <div className="main-home-container m-4 flex justify-center items-center">
          <div className="form-container w-96 p-2 bg-white text-black border-2 border-black flex justify-center items-center">
            <form onSubmit={handleSubmit}>
              <div className="flex justify-start">
                <label htmlFor="username">Username:</label>
              </div>
              <div>
                <input
                  type="text"
                  name="username"
                  className="bg-white border-black border-2 rounded-sm"
                  autoComplete="username"
                  id="username"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="flex justify-start mt-1.5">
                  Password:
                </label>
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  className="bg-white border-black border-2 rounded-sm"
                  autoComplete="current-password"
                  id="password"
                  required
                />
              </div>
              <div className="flex justify-evenly mt-5">
                <div className="">
                  <button
                    className="btn btn-primary text-black p-0.5 rounded-md bg-sky-400 border-black text-base"
                    onClick={() => navigate('sign-up')}>
                    Sign Up
                  </button>
                </div>
                <div className="">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className=" text-black p-0.5 rounded-md bg-sky-400 border-black">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {user && <LandingPage />}
    </div>
  );
}
