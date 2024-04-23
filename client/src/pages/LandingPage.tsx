import { Link, Outlet } from 'react-router-dom';

export function LandingPage() {
  return (
    <div>
      <div>
        <h1>TreasureBox</h1>
      </div>
      <div>
        <Link to="/customer-form"> New Customer</Link>
      </div>
      <div>
        <Link to="/customer-list"> Customer List</Link>
      </div>
      <div>
        <Link to="/new-invoice"> New Invoice</Link>
      </div>
      <Outlet />
    </div>
  );
}
