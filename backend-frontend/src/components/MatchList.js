import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import MatchResult from '../components/MatchResult';
import { getTeam } from '../helpers/teams'

export default function MatchList(props) {
  const { data } = props;

  return (
    <Paper elevation={1} sx={{ width: '100%'}}>
      {
        data.map(match => {
          // Get initials and badge from team
          const home = getTeam(match.homeTeam);
          const away = getTeam(match.awayTeam);

          return (
            <Box key={`match-${home.initials}-${away.initials}`}>
              <MatchResult
                homeTeam={{
                  name: match.homeTeam,
                  initials: home.initials,
                  badge: home.badge
                }}
                homeScore={match.homeScore}
                awayTeam={{
                  name: match.awayTeam,
                  initials: away.initials,
                  badge: away.badge
                }}
                awayScore={match.awayScore}
                date={match.date}
                time={match.time}
                started={match.started}
                finished={match.finished}
                stadium={match.stadium}
              />
              <Divider />
            </Box>
          )
        })
      }
    </Paper>
  );
}

MatchList.propTypes = {
  data: PropTypes.array.isRequired,
};