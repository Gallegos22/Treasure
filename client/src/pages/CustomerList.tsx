import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';
import { type Customer } from '../data';

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
    <div>
      <div>
        <h1 className="mb-14 mt-14 customer-list-heading text-black flex justify-center">
          All Customers
        </h1>
      </div>
      <div className=" flex justify-center">
        <div className="flex flex-wrap justify-center">
          {customers?.map(
            (
              customer // build an array of customer cards
            ) => (
              <div
                key={customer.customerId} // React making sure every item it creates has a trackable identifier
                className="basis-2/3 lg:basis-1/2">
                <CustomerCard customer={customer} />
              </div>
            )
          )}
        </div>
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
    <div className="flex justify-center ">
      <div className="w-96">
        <div className="card-body border-solid border-4 border-black mt-4 mb-4 rounded-2xl text-xl bg-white text-black">
          <p className="mt-4 mb-4">Name: {name}</p>
          <p className="mt-4 mb-4">Phone Number: {phoneNumber}</p>
          <p className="mt-4 mb-4">Address: {address}</p>
          <p className="mt-4 mb-4">Email: {email}</p>
          <div className="mt-7 mb-7 flex justify-center">
            <Link
              className="border-2 border-black bg-blue-600 rounded-2xl text-lg hover:bg-blue-700 text-white hover:text-white w-20 h-8"
              to={`/customer-form/${customer.customerId}`}>
              Edit
            </Link>
          </div>
          <div className="mt-7 mb-7">
            <Link
              to="/"
              className="text-lg text-red-500 p-3 hover:text-red-600">
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
