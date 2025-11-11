import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/checkout/address', { replace: true });
  }, [navigate]);

  return (
    <div className='flex items-center justify-center py-12'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
    </div>
  );
};

export default CheckoutPage;
