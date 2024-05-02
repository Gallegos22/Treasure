export type Customer = {
  customerId: number;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
};

export type Job = {
  jobId: number;
  customerId: number;
  jobDetails: string;
  quantity: string;
  perCost: string;
  dateOfJob: string;
  name: string;
};

export async function removeCustomer(customerId: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/customers/${customerId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}

export async function removeJob(jobId: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/jobs/${jobId}`, req);
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
  return await res.json();
}

export async function updateJob(job: Job): Promise<Job> {
  //Promise is what is returns after a fetch
  const req = {
    // creating req object to hold whatever data the user is inputting
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job), // converting object to JSON string
  };
  const res = await fetch(`/api/jobs/${job.jobId}`, req); // awaiting for successful response
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
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
  return await res.json();
}

export async function addJob(job: Job): Promise<Job> {
  const req = {
    // creating req object to hold whatever data the user is inputting
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job), // converting object to JSON string
  };
  const res = await fetch('/api/jobs', req); // awaiting for successful response
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return await res.json();
}
