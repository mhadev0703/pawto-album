import PropTypes from 'prop-types';
import './CollectionInfo.css';

export default function CollectionInfo(props) {
    const croppedImages = props.croppedImages;
    const changeCroppingImageIndex = props.changeCroppingImageIndex;

    return (
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
    );
}

CollectionInfo.propTypes = {
    croppedImages: PropTypes.array.isRequired,
    changeCroppingImageIndex: PropTypes.func.isRequired,
};