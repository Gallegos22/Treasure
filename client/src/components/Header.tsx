import { Outlet } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <div>
      <div>
        <h1>TreasureBox</h1>
      </div>
      <Outlet />
    </div>
  );
}
