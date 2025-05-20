import React from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import Team from '../components/Team';
import { convertDateBrazilianFormat } from 'src/helpers'
import { AppContext } from 'src/pages/_app';

const MatchResult = ({ homeTeam, homeScore, awayTeam, awayScore, date, time, started, finished, stadium }) => {

  const getColor = (started, finished) => {
    if (started && !finished) {
      return 'red';
    } else {
      return 'black';
    }
  };

  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  return (
    <Stack
      spacing={0}
    >
      <Typography
        variant="caption"
        component="span"
        textAlign='center'
        fontWeight='bold'
      >
        {convertDateBrazilianFormat(date)} {time} {stadium}
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="320px"
        mb={0.8}
        mt={0.5}
      >
        <Box display="flex" justifyContent="flex-end" alignItems="center" width="42%">
          <Team
            name={homeTeam.name}
            display={largeScreen.width ? homeTeam.name : homeTeam.initials}
            badge={homeTeam.badge}
          />
        </Box>
        <Box mx={2} display="flex" justifyContent="center" alignItems="center" width="16%">
          <Typography
            variant="h7"
            component="span"
            style={{ textAlign: 'center', color: getColor(started, finished) }}>
            {homeScore} x {awayScore}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-start" alignItems="center" width="42%">
          <Team
            name={awayTeam.name}
            display={largeScreen.width ? awayTeam.name : awayTeam.initials}
            badge={awayTeam.badge}
          />
        </Box>
      </Box>
    </Stack>

  );
};

export default MatchResult;

MatchResult.propTypes = {
  homeTeam: PropTypes.object.isRequired,
  homeScore: PropTypes.number,
  awayTeam: PropTypes.object.isRequired,
  awayScore: PropTypes.number,
  date: PropTypes.string,
  time: PropTypes.string,
  started: PropTypes.bool,
  finished: PropTypes.bool,
  stadium: PropTypes.string,
};