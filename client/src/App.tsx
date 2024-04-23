import './App.css';
import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { NewCustomerForm } from './pages/NewCustomer';
import { CustomerList } from './pages/CustomerList';
import { LandingPage } from './pages/LandingPage';
import { NewInvoice } from './pages/NewInvoice';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route index element={<LandingPage />} />
      <Route path="customer-list" element={<CustomerList />} />
      <Route path="customer-form" element={<NewCustomerForm />} />
      <Route path="new-invoice" element={<NewInvoice />} />
    </Routes>
  );
}
