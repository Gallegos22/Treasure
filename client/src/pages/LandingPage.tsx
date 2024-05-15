import { Link, Outlet } from 'react-router-dom';
import './LandingPage.css';
import { useUser } from '../components/useUser';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();
  const { user, handleSignOut } = useUser();

  return (
    <div>
      {user && (
        <div className="mt-4 flex ">
          <button
            className="text-white bg-red"
            onClick={() => {
              handleSignOut();
              navigate('/');
            }}>
            Sign Out
          </button>
        </div>
      )}
      <div>
        <h1 className="select-option text-white">Please Select One</h1>
      </div>
      <div className="main-container-landing-page flex justify-center">
        <div className="btn-container flex justify-center flex-col w-36">
          <div className="flex justify-center margin bg-blue-600 text-center rounded-xl new-customer">
            <Link
              to="/customer-form/new"
              className="text-white h-14 pt-3.5 text-lg">
              {' '}
              New Customer
            </Link>
          </div>
          <div className="flex justify-center margin bg-blue-600 rounded-xl customer-list">
            <Link
              to="/customer-list"
              className="text-white h-14 pt-3.5 text-lg">
              {' '}
              Customer List
            </Link>
          </div>
          <div className="flex justify-center margin bg-blue-600 rounded-xl new-invoice">
            <Link to="/new-invoice" className="text-white h-14 pt-3.5 text-lg">
              {' '}
              New Invoice
            </Link>
          </div>
          <div className="flex justify-center margin bg-blue-600 rounded-xl job-list">
            <Link to="/job-list" className="text-white h-14 pt-3.5 text-lg">
              {' '}
              Job List
            </Link>
          </div>
          <div className="flex justify-center margin bg-blue-600 rounded-xl job-list">
            <Link to="/job-search" className="text-white h-14 pt-3.5 text-lg">
              {' '}
              Search Job
            </Link>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
