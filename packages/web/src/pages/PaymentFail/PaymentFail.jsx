import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Header from '../../components/Header/Header';
import fail from '../../assets/images/fail.png';

export default function PaymentFail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const code = searchParams.get('code');  // Get the error code from the URL

  const [message, setMessage] = useState('The payment was not completed');  // Set the default message

  // Set the error message based on the error code
  useEffect(() => {
    if (code !== null) {
      switch (code) {
        case 'PAYMENT_CANCELED_BY_USER':
          setMessage('The payment was canceled by the user.');
          break;
        case 'PAYMENT_AUTHORIZATION_FAILED':
          setMessage('The payment authorization failed.');
          break;
        case 'PAYMENT_DECLINED_BY_CARD_COMPANY':
          setMessage('The payment was declined by the card company.');
          break;
        default:
          setMessage('The payment failed for an unknown reason.');
          break;
      }
    }
  }, [code]);

  const subHeading = () => {
    return (
      <>
        {message}
        <br />
        Please try again.
      </>
    );
  };

  return (
    <div className='App'>
      <Header subHeading={subHeading()} />
      <div style={{ minHeight: '326px' }} className='container'>
        <div style={{ marginBottom: '25px' }}>
          <img src={fail} alt='payment fail' />
        </div>
        <div className='payment-notification-text'>
          Something went wrong.
        </div>
      </div>
    </div>
  );
}