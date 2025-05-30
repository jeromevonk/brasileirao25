import * as React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AppContext } from 'src/pages/_app';

const roundsArray = Array.from({ length: 38 }, (_, index) => index + 1);

const options = [
  {
    key: 1,
    long: "Atualizada",
    short: "Geral"
  },
  {
    key: 2,
    long: "Mandante",
    short: "Casa"
  },
  {
    key: 3,
    long: "Visitante",
    short: "Fora"
  },
  {
    key: 4,
    long: "Turno",
    short: "1ºT"
  },
  {
    key: 5,
    long: "Returno",
    short: "2ºT"
  },
  {
    key: 6,
    long: "Últimas",
    short: "Ult"
  },
  {
    key: 7,
    long: "Até rodada X",
    short: "Até"
  },
  {
    key: 8,
    long: "Data específica",
    short: "Data"
  }
];

export default function OptionPicker(props) {
  const { handleChange, selected} = props;

  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  const getSubOption = (selected) => {
    if (selected.option === 6) {
      return (
        <Box sx={{ my: 2 }}>
          <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
            <FormControl size="small">
              <InputLabel id="ultimas-select-label">Últimas</InputLabel>
              <Select
                labelId="ultimas-category-label"
                id="ultimas-category"
                label="ultimas"
                value={selected.subOption}
                sx={{ minWidth: 120 }}
                onChange={(event => {
                  const { value } = event.target;
                  handleChange('subOption', value);
                })}
              >
                {
                  roundsArray.map((num) => (
                    <MenuItem key={`ultimas${num}`} value={num}>{num}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Stack>
        </Box>
      )
    } else if (selected.option === 7) {
      return (
        <Box sx={{ my: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <FormControl size="small">
              <InputLabel id="ate-select-label">Até</InputLabel>
              <Select
                labelId="ate-category-label"
                id="ate-category"
                label="ate"
                value={selected.subOption}
                sx={{ minWidth: 120 }}
                onChange={(event => {
                  const { value } = event.target;
                  handleChange('subOption', value);
                })}
              >
                {
                  roundsArray.map((num) => (
                    <MenuItem key={`ate${num}`} value={num}>{num}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Stack>
        </Box>
      )
    } else if (selected.option === 8) {
      return (
        <Box sx={{ my: 2 }}>
          <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Classificação no dia"
                sx={{ width: 1 }}
                value={selected.subOption}
                minDate={new Date(2025, 3, 13)}
                maxDate={new Date(2025, 12, 6)}
                onChange={(value) => {
                  handleChange('subOption', value);
                }}
                renderInput={(params) => <TextField {...params} onKeyDown={e => e.preventDefault()} size='small' />}
              />
            </LocalizationProvider>
          </Stack>
        </Box>
      )
    } else {
      return (<div></div>)
    }
  }

  // Custom padding
  const padding = { padding: { xs: '7px 4px', md: '7px 20px' } };
  return (
    <Box sx={{ width: '100%' }}>
      <Stack>
        <Grid
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '& > :not(style) + :not(style)': { mb: 2 },
          }}
        >
          <ToggleButtonGroup
            color="primary"
            exclusive
            onChange={(_event, value) => { handleChange('option', value) }}
          >
            {
              options.map(opt => {
                return (
                  <ToggleButton
                    key={opt.key}
                    value={opt.key}
                    size="small" sx={padding}
                    selected={opt === selected.option}
                  >
                    {largeScreen.width ? opt.long : opt.short}
                  </ToggleButton>)
              })
            }
          </ToggleButtonGroup>
        </Grid>
        {getSubOption(selected)}
      </Stack>
    </Box>
  );
}

OptionPicker.propTypes = {
  selected: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};