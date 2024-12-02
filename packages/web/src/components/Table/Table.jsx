import PropTypes from 'prop-types';
import './Table.css';
import ProgressBar from '../ProgressBar/ProgressBar';

export default function Table(props) {
  const tableTitle = props.tableTitle;
  const tableContent = props.tableContent;

  // Render the content based on the type
  const contentRenderer = (content) => {
    switch (content.type) {
      case 'receipt':
        return (
          <a
            className='link-button'
            target='_blank'
            href={content.content}
          >
            Receipt
          </a>
        );
      case 'progress':
        return (
          <ProgressBar
            backgroundColor={'#F2D7C0'}
            progressValue={content.content}
          />
        );
      case 'result':
        return (
          <a
            className='link-button'
            target='_blank'
            href={content.content}
          >
            View Generated Images
          </a>
        );
      default:
        return content.content;
    }
  };

  return (
    <div className='table-container'>
      <div className='table-title'>{tableTitle}</div>
      <div className='table-content'>
        {tableContent.map((content, index) => {
          return (
            <div className='table-row' key={index}>
              <div className='table-col'>{content.title}</div>
              <div className='table-col'>{content.content}</div>
              {contentRenderer(content)}
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