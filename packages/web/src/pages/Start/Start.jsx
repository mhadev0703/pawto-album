import { useState } from 'react';
import './Start.css';
import Header from '../../components/Header/Header';
import {
  changeFileToJPG,
  readFileAndResizeImages,
  autoCropImages,
} from '../../utils/utils';
import ImageCropModal from '../../components/ImageCropModal/ImageCropModal';
import CollectionInfo from '../../components/CollectionInfo/CollectionInfo';


export default function Start() {
  const [photos, setPhotos] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [croppedImages, setCroppedImages] = useState([]);
  const [offsetXs, setOffsetXs] = useState([]);
  const [offsetYs, setOffsetYs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [croppingImageIndex, setCroppingImageIndex] = useState(0); // Index of the image being cropped


  const onChangeUploadPhotos = async (e) => {
    // Convert the uploaded files into an array
    let files = Array.from(e.target.files);

    // Ensure the number of uploaded files is between 8 and 20
    if (files.length > 7 && files.length < 21) {
      // If any HEIC files are uploaded, convert their image type to JPG
      let jpegFiles = await Promise.all(
        files.map((file) => {
          return changeFileToJPG(file);
        })
      );

      // Resize the images, making the shorter side 512px while maintaining aspect ratio
      let resizedImageArray = await Promise.all(
        jpegFiles.map((file) => {
          return readFileAndResizeImages(file);
        })
      );

      // Crop the images to a square, centered based on the middle of the image
      let croppedArray = await Promise.all(
        resizedImageArray.map(async (file) => {
          return autoCropImages(file);
        })
      );

      // Extract the cropped images and offsets from the cropped results
      let croppedImageArray = croppedArray.map((r) => {
        return r.canvas;
      });
      let offsetXArray = croppedArray.map((r) => {
        return r.offsetX;
      });
      let offsetYArray = croppedArray.map((r) => {
        return r.offsetY;
      });

      // Set state variables with the processed images and their offsets
      setIsUploaded(true);
      setPhotos(resizedImageArray);
      setCroppedImages(croppedImageArray);
      setOffsetXs(offsetXArray);
      setOffsetYs(offsetYArray);
    } else {
      alert('Please upload 8 to 20 photos.'); // If the number of files is out of range
    }
  };

  const changeShowModal = () => {
    setShowModal(!showModal);
  };

  const changeCroppingImageIndex = (index) => {
    setCroppingImageIndex(index);
    changeShowModal();
  };

  const changeCroppedImage = (index, croppedImage) => {
    let newCroppedImages = [...croppedImages];
    newCroppedImages[index] = croppedImage;
    setCroppedImages(newCroppedImages);
  };

  const deleteImageFromArray = (index) => {
    let newPhotos = photos;
    let newCroppedImages = croppedImages;
    let newOffsetXs = offsetXs;
    let newOffsetYs = offsetYs;

    newPhotos.splice(index, 1);
    newCroppedImages.splice(index, 1);
    newOffsetXs.splice(index, 1);
    newOffsetYs.splice(index, 1);

    if (newCroppedImages.length < 8) {
      setIsUploaded(false);
      setCroppedImages([]);
      setOffsetXs([]);
      setOffsetYs([]);
      setPhotos([]);
      setShowModal(false);
    } else {
      setPhotos(newPhotos);
      setCroppedImages(newCroppedImages);
      setOffsetXs(newOffsetXs);
      setOffsetYs(newOffsetYs);
      setShowModal(false);
    }
  };

  const subHeading = () => {
    return (
      <>
        What would you like to create?
        <br />
        Upload 8 to 20 photos of your dog or cat.
      </>
    );
  };

  return (
    <div className='App'>
      <div>
        <Header subHeading={subHeading()} />
      </div>
      <div className='container'>
        {isUploaded ? (
          <CollectionInfo
            croppedImages={croppedImages}
            changeCroppingImageIndex={changeCroppingImageIndex}
          />
        ) : (
          <div>
            <label className='button' htmlFor='upload-photos'>
              UPLOAD
            </label>
            <input
              id='upload-photos'
              type='file'
              multiple
              onChange={(e) => onChangeUploadPhotos(e)}
              accept='image/x-png,image/jpeg,image/jpg,image/heic'
            />
          </div>
        )}
        {showModal ? (
          <ImageCropModal
            originalImage={photos[croppingImageIndex]}
            offsetXs={offsetXs}
            offsetYs={offsetYs}
            croppingImageIndex={croppingImageIndex}
            changeCroppedImage={changeCroppedImage}
            setShowModal={setShowModal}
            setOffsetXs={setOffsetXs}
            setOffsetYs={setOffsetYs}
            deleteImageFromArray={deleteImageFromArray}
          />
        ) : null}
      </div>
    </div>
  );
}