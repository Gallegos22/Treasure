import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Customer = {
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
      <h1>All Customers</h1>
      <hr />
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
      <div className="card-body">
        <p>Name: {name}</p>
        <p>Phone Number: {phoneNumber}</p>
        <p>Address: {address}</p>
        <p>Email: {email}</p>
      </div>
      <Link to="/">Back </Link>
    </div>
  );
}
