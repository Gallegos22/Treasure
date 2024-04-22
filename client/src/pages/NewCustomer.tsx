import './NewCustomer.css';
import type { FormEvent } from 'react';

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
      <h1>New Customer</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" type="text" required />
        </label>
        <label>
          Phone Number
          <input name="phoneNumber" type="text" required />
        </label>
        <label>
          Address
          <input name="address" type="text" required />
        </label>
        <label>
          Email
          <input name="email" type="text" required />
        </label>
        <button type="submit">Save</button>
        <button>Convert To Invoice</button>
        <button>Back</button>
      </form>
    </div>
  );
}
