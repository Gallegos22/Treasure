import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './NewCustomer.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addCustomer,
  removeCustomer,
  updateCustomer,
  type Customer,
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newCustomer = Object.fromEntries(formData) as unknown as Customer; // WHY DO WE NEED AS UNKNOWN AS CUSTOMER

    if (isEditing) {
      updateCustomer({ ...customer, ...newCustomer });
    } else {
      addCustomer(newCustomer);
    }

    event.target.reset();
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
              <p className="flex text-black">Format: 123-456-7890</p>
              <div className="text-3xl mb-6">
                <input
                  name="phoneNumber"
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
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
              <button
                type="submit"
                className="bg-green-500 rounded-3xl hover:bg-green-600">
                Save
              </button>
              <button className="bg-blue-500 rounded-3xl hover:bg-blue-600 ml-4">
                Convert To Invoice
              </button>
              <div>
                {isEditing && (
                  <button
                    type="button"
                    className="bg-red-500 rounded-3xl hover:bg-red-600"
                    onClick={() => setIsDeleting(true)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
            <div className="mt-7 mb-14">
              <Link to="/" className="text-red-500 text-3xl hover:text-red-600">
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
