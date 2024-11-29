import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { loadTossPayments } from '@tosspayments/payment-sdk';

import Loading from '../../components/Loading/Loading';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';

const REACT_APP_API_ADDRESS = import.meta.env.VITE_API_URL;
const REACT_APP_ADDRESS = import.meta.env.VITE_APP_URL;
const VITE_TOSS_CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

export default function Order() {

  // Get the collectionId from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get('collectionId');

  const [isLoading, setIsLoading] = useState(false);
  const [collectionData, setCollectionData] = useState({
    collectionStatus: '',
    createDatetime: '',
    email: '',
    endDatetime: '',
    animalType: '',
    name: '',
    paid: false,
    price: '',
    receipt: '',
    startDatetime: '',
  });

  const [paidStatus, setPaidStatus] = useState(false);
  const [productInfoData, setProductInfoData] = useState([]);
  const [paymentInfoData, setPaymentInfoData] = useState([]);
  //const [price, setPrice] = useState(2.99);
  const [price, setPrice] = useState(3900);
  
  // Check the payment status when the page is loaded
  useEffect(() => {
    if (collectionId !== null) {
      checkPaidStatus();
    }
  }, []);  // Run only once

  // Set the product and payment information
  useEffect(() => {
    setProductInfoData([
      {
        title: 'Name',
        content: collectionData.name,
      },
      {
        title: 'Animal Type',
        content:
          collectionData.animalType === 'dog'
            ? 'Dog'
            : collectionData.animalType === 'cat'
              ? 'Cat'
              : '',
      },
      {
        title: 'Email',
        content: collectionData.email,
      },
    ]);

    //setPaymentInfoData([{ title: 'TOTAL', content: `$${price}` }]);
    setPaymentInfoData([{ title: 'TOTAL', content: `${price}KRW` }]);
  }, [collectionData, price]);

  const checkPaidStatus = async () => {
    setIsLoading(true);

    let url = `${REACT_APP_API_ADDRESS}/collections?collectionId=${collectionId}`;

    axios
      .get(url)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          if (res.data.error) {
            alert(res.data.error);
            return;
          } else {
            setCollectionData(res.data);

            let collectionStatus = parseInt(res.data.collectionStatus);

            if (collectionStatus === 0 || collectionStatus === 4) {
              setPaidStatus(false);
            } else {
              setPaidStatus(true);
            }
          }
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setIsLoading(false);
      });
  };

  const processCheckout = () => {
    let clientKey = VITE_TOSS_CLIENT_KEY;

    const successUrl = REACT_APP_ADDRESS + '/payment-success';
    const failUrl = REACT_APP_ADDRESS + '/payment-fail';

    loadTossPayments(clientKey)
      .then((tossPayments) => {
        tossPayments.requestPayment('Card', {
          // Payment information parameters
          amount: price,
          orderId: collectionId,
          orderName: `Pawto Album`,
          successUrl: successUrl,
          failUrl: failUrl,
        });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === 'USER_CANCEL') {
          alert('Your payment has been cancelled.');
        }
      });
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='App'>
          <div>
            <Header
              subHeading={
                'Please proceed with the payment to view the created content.'
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
              <div className='content-wrapper'>
                <Table
                  tableTitle={'product info'}
                  tableContent={productInfoData}
                />
                <Table
                  tableTitle={'payment info'}
                  tableContent={paymentInfoData}
                />
                <div
                  style={{ margin: '40px 0' }}
                  className='center-button'
                >
                  <button
                    onClick={() => {
                      processCheckout();
                    }}
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}