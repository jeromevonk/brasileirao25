import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { IconButton, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MatchList from './MatchList';
import RoundPicker from './RoundPicker';
import PagePicker from './PagePicker';
import { matchesService } from 'src/services';
import { AppContext } from 'src/pages/_app';

const MATCHES_PER_PAGE = 13;

const getDefaultPage = (matches, team) => {
  const tempData = matchesService.getMatchesFromTeam(matches, team);
  const indexOfNextMatch = matchesService.getIndexOfNextMatch(tempData);

  // Appropriate page for the next match
  return Math.floor(indexOfNextMatch / MATCHES_PER_PAGE) + 1;
}

export default function Matches(props) {
  const { currentRound, matches } = props;
  const [round, setRound] = React.useState(currentRound);

  // Context
  const context = React.useContext(AppContext);
  const [team, setTeam] = context?.team || ['', undefined];
  
  // Initialize page state after we have team value
  const [page, setPage] = React.useState(1);

  // Update page when team changes
  React.useEffect(() => {
    if (team) {
      const calculatedPage = getDefaultPage(matches, team);
      setPage(calculatedPage);
    }
  }, [team, matches]);

  // Figure out match data
  let matchData;
  if (team) {
    matchData = matchesService.getMatchesFromTeam(matches, team).slice((page - 1) * MATCHES_PER_PAGE, (page - 1) * MATCHES_PER_PAGE + MATCHES_PER_PAGE);
  } else {
    matchData = matches[round];
  }

  const handleChange = (name, value) => {
    if (name === 'round') {
      setRound(value)
    } else if (name === 'page') {
      setPage(value)
    } else if (name === 'team') {
      setTeam(value)
    }
  };

  return (
    <Stack spacing={3} sx={{ maxWidth: '400px' }}>
      <Paper elevation={1} sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight="bold" sx={{ display: 'flex', justifyContent: 'center' }}>
          {team ? `Jogos - ${team}` : "Jogos"}
          {
            team &&
            <IconButton
              aria-label="Close"
              size="small"
              onClick={() => handleChange('team', '')}
              sx={{ padding: '0', marginLeft: '4px' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        </Typography>
      </Paper>
      {
        team ?
          <PagePicker
            page={page}
            handleChange={handleChange}
          />
          :
          <RoundPicker
            round={round}
            handleChange={handleChange}
          />
      }
      <MatchList
        data={matchData}
      />
    </Stack>
  );
}

Matches.propTypes = {
  currentRound: PropTypes.number.isRequired,
  matches: PropTypes.object.isRequired,
};