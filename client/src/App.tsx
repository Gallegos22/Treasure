import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { NewCustomerForm } from './pages/NewCustomer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route index element={<NewCustomerForm />} />
    </Routes>
  );
}
