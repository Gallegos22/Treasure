import { Link } from 'react-router-dom';

export function NewInvoice() {
  return (
    <div>
      <h1>New Invoice</h1>
      <div>
        <p>Dummy Text. Soon To Be Invoice</p>
      </div>
      <Link to="/">Back </Link>
    </div>
  );
}
