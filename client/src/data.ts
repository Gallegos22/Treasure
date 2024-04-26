export type Customer = {
  customerId: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
};

export async function removeCustomer(customerId: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/customers/${customerId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}

export async function updateCustomer(customer: Customer): Promise<Customer> {
  //Promise is what is returns after a fetch
  const req = {
    // creating req object to hold whatever data the user is inputting
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer), // converting object to JSON string
  };
  const res = await fetch(`/api/customers/${customer.customerId}`, req); // awaiting for successful response
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  // console.log('await res.json():', await res.json());
  // console.log('Error!');
  return await res.json();
}

export async function addCustomer(customer: Customer): Promise<Customer> {
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
  // console.log('await res.json():', await res.json());
  // console.log('Error!');
  return await res.json();
}
