import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewJob.css';
import './Modal.css';
import { useNavigate, useParams } from 'react-router-dom';
import { removeJob, addJob, updateJob, type Job, readToken } from '../data';
import { useEffect } from 'react';
export const tokenKey = 'um.token';

export function NewJobForm() {
  const { jobId } = useParams();
  const isEditing = jobId && !jobId.includes('new');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [job, setJob] = useState<Job>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const job = await fetch(`/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${readToken()}`,
          },
        });
        if (!job) throw new Error(`Job with ID ${id} not found`);
        setJob(await job.json());
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+jobId);
  }, [jobId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData = new FormData(event.currentTarget);
    const newJob = Object.fromEntries(formData) as unknown as Job;

    if (isEditing) {
      updateJob({ ...job, ...newJob });
    } else {
      newJob.customerId = Number(jobId?.split('-')[0]);
      addJob(newJob);
    }

    target.reset();
    navigate('/job-list');
  }

  function handleDelete() {
    if (!job?.jobId) throw new Error('Should never happen');
    removeJob(job.jobId);
    navigate('/job-list');
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entry with ID {jobId}:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div>
      <h1 className="new-job-heading mb-10 text-white">
        {isEditing ? 'Edit Job' : 'New Job'}
      </h1>
      <div className="main-container flex justify-center">
        <div className="form-container w-4/5 md:w-1/2 h-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between h-full">
            <div className="h-full">
              <div className="flex text-3xl mb-2">
                <label htmlFor="jobDetails" className="text-white ">
                  Job Details
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="jobDetails"
                  type="text"
                  id="jobDetails"
                  defaultValue={job?.jobDetails ?? ''} // if there is name then use value, if not then set to empty string
                  required
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="quantity" className="text-white">
                  Quantity
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="quantity"
                  id="quantity"
                  type="number"
                  defaultValue={job?.quantity ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="perCost" className="text-white ">
                  Per cost $
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="perCost"
                  type="text"
                  id="perCost"
                  defaultValue={job?.perCost ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="dateOfJob" className="text-white ">
                  Date of Job
                </label>
              </div>
              <div className="text-3xl mb-6">
                <input
                  name="dateOfJob"
                  type="date"
                  id="dateOfJob"
                  min="2023-01-01"
                  max="2032-12-31"
                  defaultValue={job?.dateOfJob ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 rounded-3xl hover:bg-green-600 text-3xl w-24">
                Save
              </button>
              <div>
                {isEditing && (
                  <button
                    type="button"
                    className="bg-red-500 rounded-3xl hover:bg-red-600 ml-40 text-3xl w-28"
                    onClick={() => setIsDeleting(true)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="mt-7 mb-14">
              <Link to="/landing-page" className="text-red-800 text-3xl ">
                Back
              </Link>
            </div>
          </form>
          {isDeleting && (
            <div className="modal-container flex justify-center items-center">
              <div className="modal bg-sky-900">
                <div>
                  <p className="mt-4">
                    Are you sure you want to delete this specific Job?
                  </p>
                </div>
                <div className="flex justify-between mt-7">
                  <button
                    className="modal-button red-background white-text ml-11 bg-green-500 rounded-3xl hover:bg-green-600"
                    onClick={handleDelete}>
                    Confirm
                  </button>
                  <button
                    className="modal-button text-center mr-11 bg-red-500 rounded-3xl hover:bg-red-600"
                    onClick={() => setIsDeleting(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
