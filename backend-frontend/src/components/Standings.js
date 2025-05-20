import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import StandingsTable from '../components/StandingsTable';
import OptionPicker from '../components/OptionPicker';

export default function Standings(props) {
  const { selected, handleChange, data } = props;

  return (
    <Stack spacing={1}>
      <OptionPicker
        selected={selected}
        handleChange={handleChange}
      />
      <StandingsTable
        data={data}
      />
    </Stack>
  );
}

Standings.propTypes = {
  selected: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired
};