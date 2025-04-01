import moment from 'moment';
import PropTypes from 'prop-types';

const DateFormat = ({ dateValue }) => {
  return <>{moment(dateValue).format('DD-MM-YYYY')}</>;
};

DateFormat.propTypes = {
  dateValue: PropTypes.string.isRequired,
};

export default DateFormat;
