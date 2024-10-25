import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './CollectionInfo.css';

export default function CollectionInfo(props) {
    const croppedImages = props.croppedImages;
    const changeCroppingImageIndex = props.changeCroppingImageIndex;

    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [type, setType] = useState('');

    const isValidEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const changeEmail = (e) => {
        if (!isValidEmail(e.target.value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }

        setEmail(e.target.value);
    };

    const changeTitle = (e) => {
        setTitle(e.target.value);
    };

    const changeType = (type, e) => {
        setType(type);

        // change the background color of the selected kind
        let types = document.getElementsByClassName('type');
        for (let i = 0; i < kinds.length; i++) {
            types[i].style.backgroundColor = 'white';
        }
        e.target.style.backgroundColor = '#F2D7C0';
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
                    placeholder='e.g., Our dog Poppy, max 20 characters'
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
                    placeholder='All progress updates will be sent to your email'
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
                    <label>Photos</label>
                    <span>
                        - Click on the photo to adjust the cropping position around the subject
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
        </div>
    );
}

CollectionInfo.propTypes = {
    croppedImages: PropTypes.array.isRequired,
    changeCroppingImageIndex: PropTypes.func.isRequired,
};