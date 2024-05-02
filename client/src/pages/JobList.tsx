import './JobList.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Job } from '../data';

export function JobList() {
  const [jobs, setJobs] = useState<Job[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch('/api/jobs');
        if (!response.ok) {
          throw new Error(`fetch error ${response.status}`);
        }
        const jobs = await response.json();
        setJobs(jobs);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJobs();
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
        <h1 className="mb-14 mt-14 job-list-heading text-black flex justify-center">
          All Jobs
        </h1>
      </div>
      <div className=" flex justify-center">
        <div className="flex flex-wrap justify-center">
          {jobs?.map((job) => (
            <div
              key={job.jobId}
              className="basis-2/3 md:basis-1/2 lg:basis-1/3">
              <JobCard job={job} />
            </div>
          ))}
        </div>
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
          <div className="mt-7 mb-7 flex justify-evenly">
            <Link
              className="border-2 border-black bg-blue-600 rounded-2xl text-lg hover:bg-blue-700 text-white hover:text-white w-20 h-8"
              to={`/job-form/${job.jobId}`}>
              Edit
            </Link>
            <Link
              className="border-2 border-black bg-blue-600 rounded-2xl text-lg hover:bg-blue-700 text-white hover:text-white w-24 h-8"
              to={`/job-form/${job.customerId}-new`}>
              New Job
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
