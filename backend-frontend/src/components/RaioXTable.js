import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getTeam } from 'src/helpers/teams';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '8px 16px',
    textAlign: 'center',
    fontSize: '0.875rem',
}));

const TeamCell = styled(StyledTableCell)(({ theme }) => ({
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 'bold',
}));

const HeaderCell = styled(StyledTableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
}));

const RaioXTable = ({ matches }) => {
    const stats = React.useMemo(() => {
        if (!matches) return [];

        const allMatches = Object.values(matches).flat();
        console.log('RaioX Debug - Matches:', matches);
        console.log('RaioX Debug - First Match:', allMatches[0]);
        const teamStats = {};

        // Initialize stats for all teams found in matches
        const teams = new Set();
        allMatches.forEach(m => {
            teams.add(m.homeTeam);
            teams.add(m.awayTeam);
        });

        teams.forEach(team => {
            teamStats[team] = {
                name: team,
                points1: 0,
                points2: 0,
                goals1: 0,
                goals2: 0,
                totalPoints: 0
            };
        });

        // Calculate stats
        Object.keys(matches).forEach(roundKey => {
            const round = parseInt(roundKey);
            const isFirstTurnUserDef = round <= 18;
            const roundMatches = matches[roundKey];

            roundMatches.forEach(match => {
                if (!match.started) return;

                // Home Team
                if (match.homeScore > match.awayScore) {
                    if (isFirstTurnUserDef) teamStats[match.homeTeam].points1 += 3;
                    else teamStats[match.homeTeam].points2 += 3;
                } else if (match.homeScore === match.awayScore) {
                    if (isFirstTurnUserDef) teamStats[match.homeTeam].points1 += 1;
                    else teamStats[match.homeTeam].points2 += 1;
                }

                if (isFirstTurnUserDef) teamStats[match.homeTeam].goals1 += match.homeScore;
                else teamStats[match.homeTeam].goals2 += match.homeScore;

                // Away Team
                if (match.awayScore > match.homeScore) {
                    if (isFirstTurnUserDef) teamStats[match.awayTeam].points1 += 3;
                    else teamStats[match.awayTeam].points2 += 3;
                } else if (match.awayScore === match.homeScore) {
                    if (isFirstTurnUserDef) teamStats[match.awayTeam].points1 += 1;
                    else teamStats[match.awayTeam].points2 += 1;
                }

                if (isFirstTurnUserDef) teamStats[match.awayTeam].goals1 += match.awayScore;
                else teamStats[match.awayTeam].goals2 += match.awayScore;
            });
        });

        // Calculate total points for sorting
        Object.values(teamStats).forEach(stat => {
            stat.totalPoints = stat.points1 + stat.points2;
        });

        // Convert to array and sort by total points descending
        return Object.values(teamStats).sort((a, b) => b.totalPoints - a.totalPoints);
    }, [matches]);

    return (
        <Box sx={{ width: '100%', mt: 2 }}>
            <Paper elevation={1} sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer>
                    <Table size="small" aria-label="raio-x table">
                        <TableHead>
                            <TableRow>
                                <HeaderCell sx={{ textAlign: 'left' }}>Time</HeaderCell>
                                <HeaderCell>Pts 1º Turno</HeaderCell>
                                <HeaderCell>Pts 2º Turno</HeaderCell>
                                <HeaderCell>Gols 1º Turno</HeaderCell>
                                <HeaderCell>Gols 2º Turno</HeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats.map((row) => {
                                const teamInfo = getTeam(row.name);
                                return (
                                    <TableRow key={row.name} hover>
                                        <TeamCell>
                                            {teamInfo?.badge && (
                                                <img src={teamInfo.badge} alt={row.name} width="24" height="24" />
                                            )}
                                            {row.name}
                                        </TeamCell>
                                        <StyledTableCell>{row.points1}</StyledTableCell>
                                        <StyledTableCell>{row.points2}</StyledTableCell>
                                        <StyledTableCell>{row.goals1}</StyledTableCell>
                                        <StyledTableCell>{row.goals2}</StyledTableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

RaioXTable.propTypes = {
    matches: PropTypes.object.isRequired,
};

export default RaioXTable;
