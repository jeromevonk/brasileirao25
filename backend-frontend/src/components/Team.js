import * as React from 'react';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { AppContext } from 'src/pages/_app';

export default function Team(props) {
  const { name, display, badge } = props;

  // Context
  const context = React.useContext(AppContext);
  const [, setTeam] = context?.team || undefined;

  return (
    <Box 
      display="flex" 
      alignItems="center"
      component="span"
      onClick={() => setTeam(name)}
      style={{ cursor: 'pointer' }}
    >
      <img src={badge} width="24" height="24" style={{ marginRight: '4px' }} alt={name} />
      {display}
    </Box>
  );
}

Team.propTypes = {
  name: PropTypes.string.isRequired,
  display: PropTypes.string.isRequired,
  badge: PropTypes.string.isRequired,
};