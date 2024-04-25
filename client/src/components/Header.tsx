import { Outlet } from 'react-router-dom';
import './Header.css';

export function Header() {
  return (
    <div>
      <div>
        <h1 className="font-body bg-sky-400 text-black h-20 p-4">
          TreasureBox
        </h1>
      </div>
      <Outlet />
    </div>
  );
}
