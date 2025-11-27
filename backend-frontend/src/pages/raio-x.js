import * as React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { Box, Typography } from '@mui/material';
import { withRouter } from 'next/router';

function RaioX({ matches, currentRound }) {
    return (
        <Container
            maxWidth="xl"
            sx={{ paddingLeft: '12px', paddingRight: '12px' }}
        >
            <Box sx={{ my: 2 }}>
                <Typography variant="h4" gutterBottom>
                    Raio-X
                </Typography>
                <Typography variant="body1">
                    Página em construção...
                </Typography>
            </Box>
        </Container>
    );
}

export default withRouter(RaioX);

RaioX.propTypes = {
    matches: PropTypes.object.isRequired,
    currentRound: PropTypes.number.isRequired,
};
