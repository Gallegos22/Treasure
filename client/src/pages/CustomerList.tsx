import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';

export type Customer = {
  customerId: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
};

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error(`fetch error ${response.status}`);
        }
        const customers = await response.json();
        setCustomers(customers);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Customers:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }
  return (
    <div className="container">
      <h1 className="mb-14 mt-14 customer-list-heading text-black">
        All Customers
      </h1>
      <div className="row">
        {customers?.map(
          (
            customer // build an array of customer cards
          ) => (
            <div
              key={customer.customerId} // React making sure every item it creates has a trackable identifier
            >
              <CustomerCard customer={customer} />
            </div>
          )
        )}
      </div>
    </div>
  );
}

type CustomerProps = {
  customer: Customer;
};

function CustomerCard({ customer }: CustomerProps) {
  const { name, phoneNumber, address, email } = customer; // will need  customerId eventually
  return (
    <div>
      <div className="flex justify-center">
        <div className="w-96">
          <div className="card-body border-solid border-4 border-black mt-4 mb-4 rounded-2xl text-xl bg-white text-black">
            <p className="mt-4 mb-4">Name: {name}</p>
            <p className="mt-4 mb-4">Phone Number: {phoneNumber}</p>
            <p className="mt-4 mb-4">Address: {address}</p>
            <p className="mt-4 mb-4">Email: {email}</p>
            <div className="mt-7 mb-7">
              <Link
                className="border-solid border-2 border-black p-3 bg-blue-600 text-white rounded-lg text-lg"
                to={`/customer-form/${customer.customerId}`}>
                Edit
              </Link>
            </div>
            <div className="mt-7 mb-7">
              <Link to="/" className="text-lg text-red-500 p-3">
                Back{' '}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
