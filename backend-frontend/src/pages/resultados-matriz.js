import * as React from 'react';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import { Box } from '@mui/material';
import ResultsMatrix from '../components/ResultsMatrix';
import { matchesService } from 'src/services';
import { withRouter } from 'next/router';

export async function getServerSideProps() {
    const matches = await matchesService.getMatches();

    return {
        props: {
            matches
        },
    }
}

function ResultadosMatriz({ matches }) {
    return (
        <Container
            maxWidth="xl"
            sx={{ paddingLeft: '12px', paddingRight: '12px' }}
        >
            <Box sx={{ my: 2 }}>
                <ResultsMatrix matches={matches} />
            </Box>
        </Container>
    );
}

export default withRouter(ResultadosMatriz);

ResultadosMatriz.propTypes = {
    matches: PropTypes.object.isRequired,
};
