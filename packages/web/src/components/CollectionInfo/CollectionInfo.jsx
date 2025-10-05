import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './CollectionInfo.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const REACT_APP_API_ADDRESS = import.meta.env.VITE_API_URL;
// const REACT_APP_ADDRESS = import.meta.env.VITE_APP_URL;


export default function CollectionInfo(props) {
    const croppedImages = props.croppedImages;
    const changeCroppingImageIndex = props.changeCroppingImageIndex;

    let navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [animalType, setAnimalType] = useState('');
    const [isAgree, setIsAgree] = useState(false);
    const [disabled, setDisabled] = useState(false);  // Disable the submit button if any of the required fields are invalid

    // Check if the required fields are filled in
    useEffect(() => {
        if (
            title === '' ||
            email === '' ||
            animalType === '' ||
            !isAgree ||
            !isValidEmail(email)
        ) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }
    }, [title, email, animalType, isAgree]);

    // Validate email format with regex
    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    // Handle email input change and set error message 
    const changeEmail = (e) => {
        if (!isValidEmail(e.target.value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }

        setEmail(e.target.value);
    };

    // Handle title input change
    const changeTitle = (e) => {
        setTitle(e.target.value);
    };

    // Update selected animal type and apply background color styling
    const changeAnimalType = (animalType, e) => {
        setAnimalType(animalType);

        // Change the background color of the selected animal type
        let typeButtons = document.getElementsByClassName('animal-type');
        for (let i = 0; i < typeButtons.length; i++) {
            typeButtons[i].style.backgroundColor = 'white';
        }
        e.target.style.backgroundColor = '#F2D7C0';
    };

    // Handle checkbox change
    const changeIsAgree = (e) => {
        setIsAgree(e.target.checked);
    };

    // Save the collection data to the database
    const saveData = (e) => {
        e.preventDefault();
        // remove 'data:image/jpeg;base64,' from the beginning of the string
        for (let i = 0; i < croppedImages.length; i++) {
            croppedImages[i] = croppedImages[i].replace(
                /^data:image\/[a-z]+;base64,/,
                ''
            );
        }

        // Send the data to the server
        let url = `${REACT_APP_API_ADDRESS}/createCollection`;
        let data = {
            name: title,
            email: email,
            animalType: animalType,
            images: croppedImages,
        };

        let config = { 'Content-Type': 'application/json' };
        console.log('Request Headers:', config.headers);
        console.log(data);
        axios
            .post(url, data, config)
            .then((res) => {
                console.log('Server Response:', res.data);
                if (res.data.collectionId) {
                    let newPath = '/order?collectionId=' + res.data.collectionId;
                    navigate(newPath);
                }
            })
            .catch((error) => {
                console.log(error.response.data.message);
            });
    };

    return (
        <div className='collection-info-container'>
            <div className='input-field'>
                <div className='input-info'>
                    <label>Title</label>
                </div>
                <input
                    className='custom-input-text'
                    type='text'
                    value={title}
                    onChange={(e) => {
                        changeTitle(e);
                    }}
                    placeholder='e.g., My dog Charlie (Max 20 characters)'
                    maxLength={20}
                />
            </div>

            <div className='input-field'>
                <div className='input-info'>
                    <label>Email</label>
                </div>

                <input
                    className='custom-input-text'
                    type='email'
                    value={email}
                    onChange={(e) => {
                        changeEmail(e);
                    }}
                    placeholder='All progress updates will be sent to your email.'
                />
                <div
                    style={{
                        height: emailError !== '' ? '20px' : '0px',
                        fontWeight: 'bold',
                        color: '#F24646',
                        margin: '3px 8px',
                        fontSize: '12px',
                    }}
                >
                    {emailError}
                </div>
            </div>

            <div className='input-field'>
                <div className='input-info'>
                    <label>Animal Type</label>{' '}
                    <span>- Please select the type of the animal</span>
                </div>
                <div style={{ marginTop: '10px' }} className='animal-type-buttons'>
                    <div
                        className='animal-type'
                        onClick={(e) => {
                            changeAnimalType('dog', e);
                        }}
                    >
                        Dog
                    </div>
                    <div
                        style={{ marginLeft: '10px' }}
                        className='animal-type'
                        onClick={(e) => {
                            changeAnimalType('cat', e);
                        }}
                    >
                        Cat
                    </div>
                </div>
            </div>

            <div className='input-field'>
                <div className='input-info'>
                    <label>Photos</label>
                    <span>
                        - Click on the photo to adjust the crop around the subject
                    </span>
                </div>
                <div className='upload-image-preview'>
                    {croppedImages.map((file, index) => {
                        return (
                            <img
                                onClick={() => changeCroppingImageIndex(index)}
                                key={index}
                                className='preview-image'
                                src={file}
                            />
                        );
                    })}
                </div>
            </div>
            <div className='input-field'>
                <input
                    id='agree-checkbox'
                    type='checkbox'
                    value={isAgree}
                    onChange={(e) => {
                        changeIsAgree(e);
                    }}
                />
                <label className='checkbox-label' htmlFor='agree-checkbox'>
                    I agree to receive non-promotional emails related to the progress, payment, and results of my request.
                </label>
            </div>
            <div className='center-button'>
                <button
                    disabled={disabled}
                    onClick={(e) => {
                        saveData(e);
                    }}
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}

CollectionInfo.propTypes = {
    croppedImages: PropTypes.array.isRequired,
    changeCroppingImageIndex: PropTypes.func.isRequired,
};