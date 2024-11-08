import PropTypes from 'prop-types';
import './Table.css';

export default function Table(props) {
  const tableTitle = props.tableTitle;
  const tableContent = props.tableContent;

  return (
    <div className='table-container'>
      <div className='table-title'>{tableTitle}</div>
      <div className='table-content'>
        {tableContent.map((content, index) => {
          return (
            <div className='table-row' key={index}>
              <div className='table-col'>{content.title}</div>
              <div className='table-col'>{content.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Table.propTypes = {
  tableTitle: PropTypes.string.isRequired,
  tableContent: PropTypes.array.isRequired,
};