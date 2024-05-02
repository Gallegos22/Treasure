import { useEffect, useState, type FormEvent } from 'react';
import { type Customer, type Job } from '../data';
import { Link } from 'react-router-dom';

export function JobSearch() {
  const [customers, setCustomers] = useState<Customer[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [val, setVal] = useState('');
  const [jobs, setJobs] = useState<Job[]>();

  useEffect(() => {
    async function fetchJobs() {
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
    fetchJobs();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData) as unknown as Customer;
    try {
      const response = await fetch(`/api/jobSearch/${customer.name}`);
      if (!response.ok) {
        throw new Error(`fetch error ${response.status}`);
      }
      const jobs = await response.json();
      setJobs(jobs);
    } catch (error) {
      setError(error);
    }
  }

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
        <h1 className="mb-14 mt-14 job-list-heading text-white flex justify-center">
          {' '}
          Search Jobs
        </h1>
      </div>
      <div>
        <form className="flex justify-center" onSubmit={handleSubmit}>
          <select
            className="bg-white text-black rounded-md text-3xl"
            name="name"
            id="name"
            value={val}
            onChange={(e) => setVal(e.target.value)}>
            <option value="" disabled>
              Select your Customer
            </option>
            {customers?.map((customer) => (
              <option key={customer.customerId} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
          <button className="bg-sky-900 rounded-3xl" type="submit">
            Submit
          </button>
        </form>
      </div>
      <div className="mt-8">
        <Link className="text-red-500 text-3xl hover:text-red-600" to="/">
          Back{' '}
        </Link>
      </div>
      <div>
        <ul className="flex flex-wrap justify-center">
          {jobs?.map((job) => (
            <li className="basis-2/3 md:basis-1/2 lg:basis-1/3" key={job.jobId}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

type JobProps = {
  job: Job;
};

function JobCard({ job }: JobProps) {
  const { jobDetails, quantity, perCost, dateOfJob, name } = job; // will need  customerId eventually
  return (
    <div className="flex justify-center text-base md:text-lg">
      <div className="w-full md:w-11/12">
        <div className="card-body border-solid border-4 border-black mt-4 mb-4 rounded-2xl text-xl bg-white text-black">
          <p className="mt-4 mb-4">Name: {name} </p>
          <p className="mt-4 mb-4">Jod Details: {jobDetails}</p>
          <p className="mt-4 mb-4">Quantity: {quantity}</p>
          <p className="mt-4 mb-4">perCost$: {perCost}</p>
          <p className="mt-4 mb-4">Date Of Job: {dateOfJob}</p>
          <div className="mt-7 mb-7"></div>
        </div>
      </div>
    </div>
  );
}
