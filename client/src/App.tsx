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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<LandingPage />} />
        <Route path="customer-list" element={<CustomerList />} />
        <Route path="customer-form/:customerId" element={<NewCustomerForm />} />
        <Route path="new-invoice" element={<NewInvoice />} />
        <Route path="job-form/:jobId" element={<NewJobForm />} />
        <Route path="job-list" element={<JobList />} />
        <Route path="job-search" element={<JobSearch />} />
      </Route>
    </Routes>
  );
}
