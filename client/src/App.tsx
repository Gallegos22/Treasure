import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { NewCustomerForm } from './pages/NewCustomer';
import { CustomerList } from './pages/CustomerList';
import { LandingPage } from './pages/LandingPage';
import { NewInvoice } from './pages/NewInvoice';
import { NewJobForm } from './pages/NewJob';
import { JobList } from './pages/JobList';
import { JobSearch } from './pages/JobSearch';
import { Home } from './pages/Home';
import { useState, useEffect } from 'react';
import { saveToken } from './data';
import { User, UserProvider } from './components/UserContext';
import { AuthPage } from './pages/AuthPage';
export const tokenKey = 'um.token';
export const userKey = 'um.user';

export default function App() {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
  const [error, setError] = useState<unknown>();

  function handleSignIn(user: User, token: string) {
    sessionStorage.setItem(tokenKey, token);
    sessionStorage.setItem(userKey, JSON.stringify(user));

    setUser(user);
    setToken(token);
    saveToken(token, user);
  }

  function handleSignOut() {
    setUser(undefined);
    setToken(undefined);
    saveToken(undefined, undefined);
  }

  useEffect(() => {
    async function loadPage() {
      try {
        const sessionToken = sessionStorage.getItem(tokenKey);
        if (sessionToken) {
          const storedUser = JSON.parse(sessionStorage.getItem(userKey)!);
          setToken(sessionToken);
          setUser(storedUser);
        }
      } catch (error) {
        setError(error);
      }
    }
    loadPage();
  }, []);

  if (error) {
    return (
      <div>
        Error Loading Page:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  const contextValue = { user, token, handleSignIn, handleSignOut };

  return (
    <UserProvider value={contextValue}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/sign-up" element={<AuthPage mode="sign-up" />} />
          <Route path="landing-page" element={<LandingPage />} />
          <Route path="customer-list" element={<CustomerList />} />
          <Route
            path="customer-form/:customerId"
            element={<NewCustomerForm />}
          />
          <Route path="new-invoice" element={<NewInvoice />} />
          <Route path="job-form/:jobId" element={<NewJobForm />} />
          <Route path="job-list" element={<JobList />} />
          <Route path="job-search" element={<JobSearch />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
