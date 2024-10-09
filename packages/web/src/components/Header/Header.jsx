import './Header.css';
import PropTypes from 'prop-types';

export default function Header(props) {
  return (
    <div>
      <div>
        <h1 className='heading'>Pawto Album</h1>
      </div>
      <div className='subHeading'>{props.subHeading}</div>
    </div>
  );
}

Header.propTypes = {
  subHeading: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]),
};