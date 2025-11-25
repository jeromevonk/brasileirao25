import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Tooltip, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from '@mui/material/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol as faSolidFutbol } from '@fortawesome/free-solid-svg-icons';
import Team from '../components/Team';
import { AppContext } from 'src/pages/_app';
import { getComparator } from 'src/helpers'
import styles from './StandingsTable.module.css';

function StandingsTableHead(props) {
  const {
    order,
    orderBy,
    onRequestSort,
    largeScreen } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const createHeadCell = (id, label, options = {}) => ({ id, label, ...options });

  const headCells = [
    createHeadCell('rank', ''),
    createHeadCell('team', 'Team'),
    createHeadCell('points', 'P'),
    createHeadCell('matches', 'J'),
    createHeadCell('victories', 'V'),
    createHeadCell('draws', 'E'),
    createHeadCell('losses', 'D'),
    createHeadCell('goalsFor', 'GP'),
    createHeadCell('goalsAgainst', 'GC'),
    createHeadCell('goalDifference', 'SG'),
    createHeadCell('pointsLost', 'PP'),
    createHeadCell('percent', '%', { onlyLargeScreen: true }),
    createHeadCell('streak', 'Últimos Jogos'),
  ];

  function getClassName(headCellId) {
    if (headCellId === 'rank') {
      return styles.stickyRank;
    } else if (headCellId === 'team') {
      return styles.stickyTeam;
    } else {
      return '';
    }
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => {
          if (!largeScreen.width && headCell.onlyLargeScreen) return;

          return (
            <TableCell
              key={headCell.id}
              align='center'
              padding='checkbox'
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ backgroundColor: headCell.backgroundColor }}
              className={getClassName(headCell.id)}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                hideSortIcon={true}
                onClick={createSortHandler(headCell.id)}
                sx={{
                  flexDirection: 'row-reverse',
                }}
              >
                {headCell.label}
              </TableSortLabel>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  );
}

StandingsTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  largeScreen: PropTypes.object.isRequired
};


export default function StandingsTable(props) {
  // Context
  const context = React.useContext(AppContext);
  const largeScreen = context?.largeScreen;

  // States
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('points');

  const rows = props.data || [];

  const CustomTableCell = styled(TableCell)({
    "borderLeft": '1px dotted grey',
  });

  // ----------------------------------------
  //  Button handlers
  // ----------------------------------------
  const handleRequestSort = (_event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const getStreak = (matchList, isLarge) => {

    const getStreakCellColor = (outcome) => {
      switch (outcome) {
        case 'E':
          return 'black';
        case 'V':
          return 'green';
        case 'D':
          return 'red';
        default:
          return 'black';
      }
    };

    const itens = isLarge ? matchList.slice(-6) : matchList.slice(-5)

    return (
      <Stack direction="row" spacing={0.7}>
        {itens.map((match, index) => (
          <Tooltip key={match.tooltip} title={match.tooltip}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FontAwesomeIcon
                icon={faSolidFutbol}
                style={{ color: getStreakCellColor(match.outcome), fontSize: '14px' }}
              />
            </div>
          </Tooltip>
        ))}
      </Stack>
    );
  };

  // -----------------------------------
  // Cell color
  // -----------------------------------
  const getRankCellColor = (index) => {
    if (index <= 6) {
      return 'blue';
    } else if (index <= 8) {
      return 'lightblue';
    } else if (index <= 14) {
      return 'green';
    } else if (index <= 16) {
      return 'black';
    } else {
      return 'red';
    }
  };

  const getInPlayCellColor = (item, inPlay) => {
    if (inPlay.includes(item)) {
      return 'red';
    } else {
      return 'black';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ width: '100%', mb: 1 }}>
        <TableContainer className={styles.tableContainer}>
          <Table
            sx={{ minWidth: 250 }}
            aria-labelledby="tableTitle"
            size={'small'}
          >
            <StandingsTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              largeScreen={largeScreen}
            />
            <TableBody>
              {rows
                .sort(getComparator(order, orderBy))
                .map((row, index) => {
                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.team}
                    >
                      {
                        // Rank
                      }
                      <TableCell align="center" style={{ fontWeight: 450, color: getRankCellColor(index + 1) }} className={styles.stickyRank}>{index + 1}</TableCell>
                      {
                        // Team
                      }
                      <TableCell align="left" className={styles.stickyTeam}><Team name={row.team} display={largeScreen.width ? row.team : row.initials} badge={row.badge} /></TableCell>
                      {
                        // Points
                      }
                      <CustomTableCell align="center" style={{ fontWeight: 450, color: getInPlayCellColor("points", row.inPlay) }}>{row.points}</CustomTableCell>
                      {
                        // Games
                      }
                      <CustomTableCell align="center">{row.matches}</CustomTableCell>
                      {
                        // Victories
                      }
                      <CustomTableCell align="center" style={{ color: getInPlayCellColor("victory", row.inPlay) }}>{row.victories}</CustomTableCell>
                      {
                        // Draws
                      }
                      <CustomTableCell align="center" style={{ color: getInPlayCellColor("draw", row.inPlay) }}>{row.draws}</CustomTableCell>
                      {
                        // Losses
                      }
                      <CustomTableCell align="center" style={{ color: getInPlayCellColor("loss", row.inPlay) }}>{row.losses}</CustomTableCell>
                      {
                        // Goals for - only if largeScreen
                      }
                      {
                        <CustomTableCell align="center" style={{ color: getInPlayCellColor("goalsFor", row.inPlay) }}>{row.goalsFor}</CustomTableCell>
                      }
                      {
                        // Goals against - only if largeScreen
                      }
                      {
                        <CustomTableCell align="center" style={{ color: getInPlayCellColor("goalsAgainst", row.inPlay) }}>{row.goalsAgainst}</CustomTableCell>
                      }
                      {
                        // Goal difference
                      }
                      <CustomTableCell align="center" style={{ color: getInPlayCellColor("goalDifference", row.inPlay) }}>{row.goalDifference}</CustomTableCell>
                      {
                        // Points lost
                      }
                      <CustomTableCell align="center">{row.pointsLost}</CustomTableCell>
                      {
                        // Percent - only if largeScreen
                      }
                      {
                        largeScreen.width &&
                        <CustomTableCell align="center">{row.percent}</CustomTableCell>
                      }
                      {
                        // Streak
                      }
                      <CustomTableCell>{getStreak(row.lastMatches, largeScreen.width)}</CustomTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

StandingsTable.propTypes = {
  data: PropTypes.array.isRequired
};