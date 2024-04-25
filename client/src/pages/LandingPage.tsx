import { Link, Outlet } from 'react-router-dom';
import './LandingPage.css';

export function LandingPage() {
  return (
    <div>
      <div>
        <h1 className="select-option text-black">Please Select One</h1>
      </div>
      <div className="main-container flex justify-center">
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
        </div>
      </div>
      <Outlet />
    </div>
  );
}