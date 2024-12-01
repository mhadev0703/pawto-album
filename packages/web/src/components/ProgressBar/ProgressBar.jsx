import PropTypes from 'prop-types';

export default function ProgressBar(props) {
  const backgroundColor = props.backgroundColor;
  const progressValue = props.progressValue;

  const containerStyles = {
    height: '25px',
    width: '200px',
    backgroundColor: '#E6E6E6',
    borderRadius: 50,
    margin: '10px 0',
  };

  const fillerStyles = {
    height: '100%',
    width: `${progressValue}%`,
    backgroundColor: backgroundColor,
    borderRadius: 'inherit',
    textAlign: 'right',
  };

  const labelStyles = {
    padding: 2,
    color: 'black',
    fontWeight: '600',
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${progressValue}%`}</span>
      </div>
    </div>
  );
}

// Define the prop types
ProgressBar.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  progressValue: PropTypes.number.isRequired,
};