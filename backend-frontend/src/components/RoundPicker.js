import * as React from 'react';
import PropTypes from 'prop-types';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import { AppContext } from 'src/pages/_app';

export default function RoundPicker(props) {
  const { handleChange, round } = props;

  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  return (
    <Box 
      display="flex"
      justifyContent="center"
    >
      <Pagination
        count={38}
        page={round}
        size="small"
        color="primary"
        boundaryCount={largeScreen.width? 3: 2}
        onChange={(_event, value) => { handleChange('round', value) }}
      />
    </Box>
  );
}

RoundPicker.propTypes = {
  handleChange: PropTypes.func.isRequired,
  round: PropTypes.number.isRequired,
};