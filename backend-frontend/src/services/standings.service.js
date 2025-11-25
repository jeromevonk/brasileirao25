import { format } from 'date-fns';
import { TEAMS } from '../helpers/teams'
import { convertDateBrazilianFormat } from 'src/helpers'
import { matchesService } from 'src/services';

export const standingsService = {
  getStandings,
};

const ITERATE_BY_ROUNDS = [1, 2, 3, 4, 5, 7, 8];
const ITERATE_BY_TEAM = [6];

function getStandings(matches, option, subOption) {

  // ---------------------------
  // Create empty standings
  // ---------------------------
  const standings = {};

  for (const [key, value] of Object.entries(TEAMS)) {
    standings[key] = emptyStandings()
    standings[key].initials = value.initials
    standings[key].badge = value.badge
  }

  // ----------------------------------------------
  // If there are matches, iterate through
  // ----------------------------------------------
  if (Object.keys(matches).length !== 0) {
    if (ITERATE_BY_ROUNDS.includes(option)) {
      iterateByRounds(standings, matches, option, subOption);
    } else if (ITERATE_BY_TEAM) {
      iterateByTeam(standings, matches, option, subOption);
    }
  }

  // ----------------------------------------------
  // Calculate percents
  // ----------------------------------------------
  for (const [key, value] of Object.entries(standings)) {
    standings[key].percent = value.matches == 0 ? 0 : Math.round((100 * value.points) / (value.matches * 3) * 10) / 10;
  }

  // Convert 
  return convertStandingsToArray(standings);
}

// -----------------------------------------------
// Iterate by round in crescent order
// -----------------------------------------------
function iterateByRounds(standings, matches, option, subOption) {
  const details = getDetailsFromOptions(option, subOption)

  for (let i = details.startRound; i <= details.endRound; i++) {
    const round = matches[i];

    for (const match of round) {
      calculateMatch(standings, match, details.calculateHome, details.calculateAway, details.dateLimit)
    }
  }


  // Sort last matches in descending order
  // Why? Because of delayed matches, it's not garanteed that a match on a given round will happen before a match on a posterior round
  for (const [key, value] of Object.entries(standings)) {
    standings[key].lastMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
}

// -----------------------------------------------
// Iterate by team
// -----------------------------------------------
function iterateByTeam(standings, matches, _option, subOption) {
  // Get matches ordered by descending date
  const startedMatches = matchesService.getStartedMatchesInDescendingOrder(matches);

  // For every team
  for (const team of Object.keys(standings)) {
    let toFind = subOption;

    // Look for last X matches
    for (let i = 0; i < startedMatches.length && toFind > 0; i++) {
      const match = startedMatches[i];

      // Did the team play at home, away?
      if (team === match.homeTeam) {
        calculateMatch(standings, match, true, false, false, true);
        toFind--;
      } else if (team === match.awayTeam) {
        calculateMatch(standings, match, false, true, false, true);
        toFind--;
      }
    }
  }
}


// -----------------------------------------------
// Util
// -----------------------------------------------
function getDetailsFromOptions(option, subOption) {
  const details = {
    startRound: 1,
    endRound: 38,
    calculateHome: true,
    calculateAway: true,
  }

  switch (option) {
    case 1:
      // No changes
      break;

    case 2:
      details.calculateAway = false;
      break;

    case 3:
      details.calculateHome = false;
      break;

    case 4:
      details.endRound = 19
      break;

    case 5:
      details.startRound = 20;
      details.endRound = 38
      break;

    case 6:
      // N/A here
      break;

    case 7:
      details.endRound = subOption;
      break;

    case 8:
      details.dateLimit = format(subOption, 'yyyy-MM-dd');
      break;
  }

  return details
}

function convertStandingsToArray(standings) {
  // Convert 
  const standingArray = [];
  for (const [key, value] of Object.entries(standings)) {
    standingArray.push({
      team: key,
      ...value
    })
  }

  return standingArray;
}

function emptyStandings() {
  return { "points": 0, "pointsLost": 0, "matches": 0, "victories": 0, "draws": 0, "losses": 0, "goalsFor": 0, "goalsAgainst": 0, "goalDifference": 0, "percent": 0, "lastMatches": [], "badge": "", "initials": "", "inPlay": [] }
}

function calculateMatch(standings, match, calculateHome, calculateAway, dateLimit, addToBeginning = false) {
  const { homeTeam, awayTeam, homeScore, awayScore, started, finished, date } = match;

  // If the game has started 
  // AND
  // if dateLimit defined, it's greather than or equal the date
  // THEN
  // consider the match
  if (started && !(dateLimit && date > dateLimit)) {

    // The home team
    if (calculateHome) {

      // Calculate standings
      calculateStandings(standings[homeTeam], homeScore, awayScore, finished);

      // Get match summary
      const matchToAdd = getMatchSummary(match, true)

      // Add to last matches
      if (addToBeginning) {
        standings[homeTeam].lastMatches.unshift(matchToAdd);
      } else {
        standings[homeTeam].lastMatches.push(matchToAdd);
      }
    }

    // The away team
    if (calculateAway) {

      // Calculate standings
      calculateStandings(standings[awayTeam], awayScore, homeScore, finished);

      // Get match summary
      const matchToAdd = getMatchSummary(match, false)

      // Add to last matches
      if (addToBeginning) { // used when iterating by team with matches sorted in descending order
        standings[awayTeam].lastMatches.unshift(matchToAdd);
      } else {
        standings[awayTeam].lastMatches.push(matchToAdd);
      }
    }
  }
}


function getMatchSummary(match, isHome) {
  return {
    isHome,
    outcome: getOutcome(match, isHome),
    tooltip: getHeadline(match),
    date: match.date
  }
}

function getOutcome(match, isHome) {
  if (match.homeScore == match.awayScore) {
    return 'E';
  }
  else if (
    (isHome && match.homeScore > match.awayScore) ||
    (!isHome && match.homeScore < match.awayScore)
  ) {
    return 'V'
  }
  else {
    return 'D'
  }
}

function getHeadline(match) {
  return `${convertDateBrazilianFormat(match.date)} | ${match.homeTeam} ${match.homeScore} x ${match.awayScore} ${match.awayTeam}`
}

function getResults(score, oponentScore) {
  const results = {
    points: 0,
    pointsLost: 0,
    victory: 0,
    draw: 0,
    loss: 0,
    goalsFor: score,
    goalsAgainst: oponentScore,
    goalDifference: score - oponentScore
  }

  if (score > oponentScore) {
    results.points = 3
    results.victory = 1
  } else if (score == oponentScore) {
    results.points = 1
    results.pointsLost = 2
    results.draw = 1
  } else {
    results.pointsLost = 3
    results.loss = 1
  }

  return results;
}

function calculateStandings(teamStandings, score, oponentScore, finished) {
  // Get results
  const results = getResults(score, oponentScore)

  // Add to standings
  teamStandings.matches += 1
  teamStandings.points += results.points
  teamStandings.pointsLost += results.pointsLost
  teamStandings.victories += results.victory
  teamStandings.draws += results.draw
  teamStandings.losses += results.loss
  teamStandings.goalsFor += results.goalsFor
  teamStandings.goalsAgainst += results.goalsAgainst
  teamStandings.goalDifference += results.goalDifference

  // Is game in play?
  if (!finished) {
    console.log(`Found not finished, ${score} ${oponentScore}`)
    for (const [key, value] of Object.entries(results)) {
      // Every key with a value != 0 will be copied to "inPlay"
      if (value != 0) {
        teamStandings.inPlay.push(key)
      }
    }
  }
}