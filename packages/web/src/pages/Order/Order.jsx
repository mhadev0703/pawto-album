import Loading from '../../components/Loading/Loading';
import Header from '../../components/Header/Header';

export default function Order() {
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='App'>
          <div>
            <Header
              subHeading={
                'Please proceed with the payment to view the generated results.'
              }
            />
          </div>
          <div className='container'>
            {paidStatus ? (
              <div
                style={{ fontWeight: '500', fontSize: '20px' }}
              >
                Your payment has been completed! <br />
                Please check the link sent to your email to track the status of your order.
              </div>
            ) : (
              <div className='center-button'>
                <button>CHECKOUT</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}