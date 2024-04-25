import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewCustomer.css';
import { useNavigate, useParams } from 'react-router-dom';
import { type Customer } from './CustomerList';
import { useEffect } from 'react';

export function NewCustomerForm() {
  const { customerId } = useParams();
  const isEditing = customerId && customerId !== 'new';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [customer, setCustomer] = useState<Customer>();
  const navigate = useNavigate();

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const customer = await fetch(`/api/customers/${customerId}`);
        if (!customer) throw new Error(`Entry with ID ${id} not found`);
        setCustomer(await customer.json());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+customerId);
  }, [customerId]);

  console.log('customer:', customer);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData);

    if (isEditing) {
      try {
        const req = {
          // creating req object to hold whatever data the user is inputting
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customer), // converting object to JSON string
        };
        const res = await fetch(`/api/customers/${customerId}`, req); // awaiting for successful response
        if (!res.ok) throw new Error(`fetch Error ${res.status}`);
        console.log('await res.json():', await res.json());
      } catch (err) {
        console.log('Error!');
      }
    } else {
      try {
        const req = {
          // creating req object to hold whatever data the user is inputting
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(customer), // converting object to JSON string
        };
        const res = await fetch('/api/customers', req); // awaiting for successful response
        if (!res.ok) throw new Error(`fetch Error ${res.status}`);
        console.log('await res.json():', await res.json());
      } catch (err) {
        console.log('Error!');
      }
    }

    event.target.reset();
    navigate('/customer-list');
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entry with ID {customerId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div>
      <h1 className="new-customer-heading mb-10 text-black">
        {isEditing ? 'Edit Customer' : 'New Customer'}
      </h1>
      <div className="main-container flex justify-center">
        <div className="form-container w-96 h-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between h-full">
            <div className="h-full">
              <div className="flex text-3xl mb-2">
                <label htmlFor="name" className="text-black ">
                  Name
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="name"
                  type="text"
                  id="name"
                  defaultValue={customer?.name ?? ''} // if there is name then use value, if not then set to empty string
                  required
                  className="w-full rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="phoneNumber" className="text-black">
                  Phone Number
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="phoneNumber"
                  type="phone"
                  id="tel"
                  defaultValue={customer?.phoneNumber ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="address" className="text-black ">
                  Address
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="address"
                  type="text"
                  id="address"
                  defaultValue={customer?.address ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-white text-black"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="email" className="text-black ">
                  Email
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="email"
                  type="text"
                  id="email"
                  defaultValue={customer?.email ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-white text-black"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-green-500 rounded-3xl">
                Save
              </button>
              <button className="bg-blue-500 rounded-3xl">
                Convert To Invoice
              </button>
            </div>
            <Link to="/" className="mb-20 mt-14 text-red-500 text-3xl">
              Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
