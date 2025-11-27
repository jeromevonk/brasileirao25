import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getTeam } from 'src/helpers/teams';
import { matchesService } from 'src/services';
import { convertDateBrazilianFormat } from 'src/helpers';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: '4px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
    fontSize: '0.70rem',
    height: '40px',
    transition: 'all 0.2s ease',
}));

const TeamHeaderCell = styled(StyledTableCell, {
    shouldForwardProp: (prop) => prop !== 'isHighlighted',
})(({ theme, isHighlighted }) => ({
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    minWidth: '40px',
    boxShadow: isHighlighted
        ? 'inset 0 0 0 2px rgba(0, 0, 0, 0.4)'
        : 'none',
}));

const ResultCell = styled(StyledTableCell, {
    shouldForwardProp: (prop) => !['isDiagonal', 'bgColor', 'isRowHighlighted', 'isColHighlighted', 'isHovered', 'isDimmed'].includes(prop),
})(({ theme, isDiagonal, bgColor, isRowHighlighted, isColHighlighted, isHovered, isDimmed }) => ({
    backgroundColor: isDiagonal ? '#e0e0e0' : (bgColor || 'inherit'),
    color: bgColor ? 'black' : 'inherit',
    whiteSpace: 'pre-line',
    opacity: isDimmed ? 0.3 : 1,
    boxShadow: (() => {
        const shadows = [];
        if (isRowHighlighted) shadows.push('inset 0 2px 0 0 rgba(0, 0, 0, 0.4), inset 0 -2px 0 0 rgba(0, 0, 0, 0.4)');
        if (isColHighlighted) shadows.push('inset 2px 0 0 0 rgba(0, 0, 0, 0.4), inset -2px 0 0 0 rgba(0, 0, 0, 0.4)');
        if (isHovered) shadows.push('0 0 8px rgba(0, 0, 0, 0.5)');
        return shadows.length > 0 ? shadows.join(', ') : 'none';
    })(),
    position: 'relative',
    zIndex: isHovered ? 10 : 1,
}));

const ResultsMatrix = ({ matches }) => {
    const [hoveredCell, setHoveredCell] = React.useState({ row: null, col: null });

    // Flatten matches to get a single list just for extracting team names
    const allMatches = React.useMemo(() => {
        if (!matches) return [];
        return Object.values(matches).flat();
    }, [matches]);

    // Extract unique teams and sort them
    const teams = React.useMemo(() => {
        const teamNames = new Set();
        allMatches.forEach(match => {
            teamNames.add(match.homeTeam);
            teamNames.add(match.awayTeam);
        });

        // Convert to objects with badge info
        return Array.from(teamNames)
            .map(name => {
                const info = getTeam(name);
                return {
                    name: name,
                    initials: info?.initials || name.substring(0, 3).toUpperCase(),
                    badge: info?.badge || ''
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allMatches]);

    const handleCellHover = (rowIndex, colIndex) => {
        setHoveredCell({ row: rowIndex, col: colIndex });
    };

    const handleCellLeave = () => {
        setHoveredCell({ row: null, col: null });
    };

    if (teams.length === 0) return null;

    return (
        <Box sx={{ width: '100%', mt: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom component="div" sx={{ ml: 1 }}>
                Tabela de Resultados (Casa x Fora)
            </Typography>
            <Paper elevation={1} sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer sx={{ maxHeight: '80vh' }}>
                    <Table size="small" aria-label="results matrix" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TeamHeaderCell>Casa \ Fora</TeamHeaderCell>
                                {teams.map((team, colIndex) => (
                                    <TeamHeaderCell
                                        key={team.name}
                                        title={team.name}
                                        isHighlighted={hoveredCell.col === colIndex}
                                    >
                                        {team.badge ? (
                                            <img src={team.badge} alt={team.name} width="20" height="20" />
                                        ) : (
                                            team.initials
                                        )}
                                    </TeamHeaderCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teams.map((homeTeam, rowIndex) => {
                                // Get all matches for this home team using the service
                                const homeTeamMatches = matchesService.getMatchesFromTeam(matches, homeTeam.name);

                                return (
                                    <TableRow key={homeTeam.name}>
                                        <TeamHeaderCell
                                            title={homeTeam.name}
                                            isHighlighted={hoveredCell.row === rowIndex}
                                        >
                                            {homeTeam.badge ? (
                                                <img src={homeTeam.badge} alt={homeTeam.name} width="20" height="20" />
                                            ) : (
                                                homeTeam.initials
                                            )}
                                        </TeamHeaderCell>
                                        {teams.map((awayTeam, colIndex) => {
                                            const isDiagonal = homeTeam.name === awayTeam.name;
                                            let cellContent = '';
                                            let bgColor = '';

                                            if (isDiagonal) {
                                                cellContent = '';
                                            } else {
                                                // Find the specific match where homeTeam is Home and awayTeam is Away
                                                const match = homeTeamMatches.find(m =>
                                                    m.homeTeam === homeTeam.name && m.awayTeam === awayTeam.name
                                                );

                                                if (match) {
                                                    if (match.started) {
                                                        cellContent = `${match.homeScore} - ${match.awayScore}`;

                                                        // Determine background color based on Home Team result
                                                        if (match.homeScore > match.awayScore) {
                                                            bgColor = '#e8f5e9'; // Light Green (Win)
                                                        } else if (match.homeScore < match.awayScore) {
                                                            bgColor = '#ffebee'; // Light Red (Loss)
                                                        } else {
                                                            bgColor = '#f5f5f5'; // Light Grey (Draw)
                                                        }
                                                    } else {
                                                        // Not started, show date and time
                                                        const dateStr = convertDateBrazilianFormat(match.date);
                                                        const shortDate = dateStr.substring(0, 5);
                                                        cellContent = `${shortDate}\n${match.time}`;
                                                    }
                                                } else {
                                                    cellContent = '';
                                                }
                                            }

                                            const isHovered = hoveredCell.row === rowIndex && hoveredCell.col === colIndex;
                                            const isRowHighlighted = hoveredCell.row === rowIndex && hoveredCell.col !== null;
                                            const isColHighlighted = hoveredCell.col === colIndex && hoveredCell.row !== null;
                                            const isDimmed = hoveredCell.row !== null && hoveredCell.col !== null && !isHovered && !isRowHighlighted && !isColHighlighted;

                                            return (
                                                <ResultCell
                                                    key={awayTeam.name}
                                                    isDiagonal={isDiagonal}
                                                    bgColor={bgColor}
                                                    isRowHighlighted={isRowHighlighted}
                                                    isColHighlighted={isColHighlighted}
                                                    isHovered={isHovered}
                                                    isDimmed={isDimmed}
                                                    onMouseEnter={() => handleCellHover(rowIndex, colIndex)}
                                                    onMouseLeave={handleCellLeave}
                                                >
                                                    {cellContent}
                                                </ResultCell>
                                            );
                                        })}
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

ResultsMatrix.propTypes = {
    matches: PropTypes.object.isRequired,
};

export default ResultsMatrix;
