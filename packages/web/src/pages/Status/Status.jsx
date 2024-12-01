import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

import Loading from '../../components/Loading/Loading';
import Header from '../../components/Header/Header';
import Table from '../../components/Table/Table';

const REACT_APP_API_ADDRESS = import.meta.env.VITE_API_URL;
const REACT_APP_ADDRESS = import.meta.env.VITE_APP_URL;

export default function Status() {

  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get('collectionId');
  const secretKey = searchParams.get('secretKey');  

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

  const [productInfoData, setProductInfoData] = useState([]);
  const [statusInfoData, setStatusInfoData] = useState([]);

  useEffect(() => {
    if (collectionId !== undefined && secretKey !== undefined) {
      getCurrentStatus();
    }
  }, [collectionId, secretKey]);

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
        title: 'Payment Status',
        content: collectionData.paid ? 'Payment Completed' : 'Payment Pending',
      },
      {
        title: 'Email',
        // content: `${collectionData.price} USD`,
        content: `${collectionData.price} KRW`,
      },
      {
        title: 'Payment Receipt',
        content: collectionData.receipt,
        type: 'receipt',
      },
    ]);

    setStatusInfoData([
      {
        title: 'Progress',
        content: getProgressValue(),
        type: 'progress',
      },
      {
        title: 'Payment Completion Time',
        content: changeDatetimeToString(collectionData.createDatetime),
      },
      {
        title: 'Image Generation Start Time',
        content: changeDatetimeToString(collectionData.startDatetime),
      },
      {
        title: 'Image Generation Completion Time',
        content: changeDatetimeToString(collectionData.endDatetime),
      },
      {
        title: '',
        content: `${REACT_APP_ADDRESS}/see?collectionId=${collectionId}&secretKey=${secretKey}`,
        type: 'result',
      },
    ]);
  }, [collectionData]);

  const getCurrentStatus = async () => {
    setIsLoading(true);

    let url = `${REACT_APP_API_ADDRESS}/collections?collectionId=${collectionId}`;

    axios
      .get(url)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setCollectionData(res.data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setIsLoading(false);
      });
  };

  const subHeading = () => {
    return (
      <>
        Thank you for using Pawto Album!
        <br />
        We are currently generating the image. Please check the progress.
      </>
    );
  };

  const getProgressValue = () => {
    if (collectionData.startDatetime !== '') {
      let startDatetime = collectionData.startDatetime;
      // Adjust to local time
      startDatetime = new Date(startDatetime);
      startDatetime.setHours(startDatetime.getHours());

      // Set the estimated completion time to start time + 10 minutes
      let eta = new Date(startDatetime);
      eta.setMinutes(eta.getMinutes() + 10);

      // Current time
      let now = new Date();

      // Calculate the ratio between (current time - start time) and (estimated completion time - start time)
      startDatetime = startDatetime.getTime();
      eta = eta.getTime();
      now = now.getTime();

      let ratio = (now - startDatetime) / (eta - startDatetime);

      if (collectionData.collectionStatus === '1') {
        // Currently generating
        // If the ratio is greater than 1, set it to 0.99
        if (ratio > 1) {
          ratio = 0.99;
        } else if (ratio < 0) {
          ratio = 0;
        }
      } else if (collectionData.collectionStatus === '2') {
        // Completed
        ratio = 1.0;
      } else if (collectionData.collectionStatus === '3') {
        // Failed
        ratio = 0;
      } else {
        ratio = 0;
      }
      // Convert ratio to a percentage and remove decimal places
      return Math.floor(ratio * 100);
    } else {
      return 0;
    }
  };

  // Convert datetime to string
  const changeDatetimeToString = (datetime) => {
    if (datetime !== '') {
      let date = new Date(datetime);
      date.setHours(date.getHours());
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();

      let dateString = `${year}-${month}-${day} ${hour}:${min}`;
      return dateString;
    } else {
      return '';
    }
  };

  return (

    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='App'>
          <div>
            <Header subHeading={subHeading()} />
          </div>
          <div className='container'>
            <div className='content-wrapper'>
              <Table
                tableTitle='Product Info'
                tableContent={productInfoData}
              />
              <Table
                tableTitle='Status'
                tableContent={statusInfoData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}