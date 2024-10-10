import './ImageCropModal.css';
import { useEffect, useState, useRef } from 'react';

export default function ImageCropModal(props) {
  const originalImage = props.originalImage;
  const setShowModal = props.setShowModal;

  const [defaultLength, setDefaultLength] = useState(512); 

  useEffect(() => {
    const _canvas = document.getElementById('canvas'); 
    const _ctx = _canvas.getContext('2d');
    const _image = new Image();

    _image.onload = function () {
      let mappedWidth = defaultLength;
      let mappedHeight = defaultLength;

      _canvas.width = mappedWidth;
      _canvas.height = mappedHeight;

      _ctx.drawImage(_image, 0, 0, _image.width, _image.height); 
    };

    _image.src = originalImage;
  }, []);

  return (
    <div className='crop-modal'>
      <div
        className='modal-background'
        onClick={() => {
          setShowModal(false);
        }}
      ></div>

      <div className='modal-body'>
        <div className='modal-content'>
          <div className='crop-editor-wrapper'>
            <canvas id='canvas' width='100' height='100'></canvas>
          </div>
        </div>
        <div className='modal-buttons'>
          <button>CROP</button>
          <button>DELETE</button>
        </div>
      </div>
    </div>
  );
}