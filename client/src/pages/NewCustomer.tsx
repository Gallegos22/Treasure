import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewCustomer.css';

export function NewCustomerForm() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { name, phoneNumber, address, email } = Object.fromEntries(formData);
    try {
      const req = {
        // creating req object to hold whatever data the user is inputting
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phoneNumber, address, email }), // converting object to JSON string
      };
      const res = await fetch('/api/customers', req); // awaiting for successful response
      if (!res.ok) throw new Error(`fetch Error ${res.status}`);
      console.log('await res.json():', await res.json());
    } catch (err) {
      console.log('Error!');
    }
    event.target.reset();
  }

  return (
    <div>
      <h1 className="new-customer-heading mb-10 text-black">New Customer</h1>
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
                  type="text"
                  id="phoneNumber"
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
