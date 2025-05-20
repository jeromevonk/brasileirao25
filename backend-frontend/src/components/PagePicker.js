import * as React from 'react';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';

export default function PagePicker(props) {
  const { handleChange, page } = props;

  return (
    <Box 
      display="flex"
      justifyContent="center"
    >
      <Pagination
        count={3}
        page={page}
        size="small"
        color="primary"
        onChange={(_event, value) => { handleChange('page', value) }}
      />
    </Box>
  );
}

PagePicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};