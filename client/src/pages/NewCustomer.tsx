import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewCustomer.css';
import './Modal.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCustomer,
  removeCustomer,
  updateCustomer,
  type Customer,
  readToken,
} from '../data';
import { useEffect } from 'react';
export const tokenKey = 'um.token';

export function NewCustomerForm() {
  const { customerId } = useParams();
  const isEditing = customerId && customerId !== 'new';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [customer, setCustomer] = useState<Customer>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const customer = await fetch(`/api/customers/${customerId}`, {
          headers: {
            Authorization: `Bearer ${readToken()}`,
          },
        });
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const newCustomer = Object.fromEntries(formData) as unknown as Customer;

    if (isEditing) {
      updateCustomer({ ...customer, ...newCustomer });
    } else {
      addCustomer(newCustomer);
    }

    target.reset();
    navigate('/customer-list');
  }

  function handleDelete() {
    if (!customer?.customerId) throw new Error('Should never happen');
    removeCustomer(customer.customerId);
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
      <h1 className="new-customer-heading mb-10 text-white">
        {isEditing ? 'Edit Customer' : 'New Customer'}
      </h1>
      <div className="main-container flex justify-center">
        <div className="form-container w-96 h-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between h-full">
            <div className="h-full">
              <div className="flex text-3xl mb-2">
                <label htmlFor="name" className="text-white ">
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
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="phoneNumber" className="text-white">
                  Phone Number
                </label>
              </div>
              <p className="flex text-white">Format: 123-456-7890</p>
              <div className="text-3xl mb-6">
                <input
                  name="phoneNumber"
                  id="phoneNumber"
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  defaultValue={customer?.phoneNumber ?? ''}
                  required
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="address" className="text-white ">
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
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
              <div className="flex text-3xl mb-2">
                <label htmlFor="email" className="text-white ">
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
                  className="w-full rounded-md p-2 bg-sky-400 text-white border-2 border-white"
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-500 rounded-3xl hover:bg-green-600 mb-4 text-3xl w-24">
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
              <Link
                to="/landing-page"
                className="text-red-500 text-3xl hover:text-red-600">
                Back
              </Link>
            </div>
          </form>
          {isDeleting && (
            <div className="modal-container flex justify-center items-center">
              <div className="modal bg-sky-900">
                <div>
                  <p className="mt-4">
                    Are you sure you want to delete this Customer?
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
