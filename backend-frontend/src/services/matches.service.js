import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/matches`;

export const matchesService = {
  getMatches,
  getCurrentRound,
  getStartedMatchesInDescendingOrder,
  getMatchesFromTeam,
  getIndexOfNextMatch,
};

async function getMatches() {
  try {
    const response = await fetch(baseUrl);
    if (!response.ok) {
      console.log(baseUrl)
      throw new Error('Failed to fetch matches');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

function getCurrentRound(matches) {
  for (let i = 38; i > 0; i--) {
    // Get a round
    const round = matches[i]

    // Look all the matches, check if at least one has started
    for (let match of round) {
      if (match.started) {
        // Found a match that has started. Return this as the current round
        return i;
      }
    }
  }
  

  // If nothing started, return round 1
  return 1
}

function getStartedMatchesInDescendingOrder(matches) {
  // Flatten the matches
  const matchesArray = Object.values(matches).flat();

  // Sort by date descending
  return matchesArray
    .filter(item => item.started)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getMatchesFromTeam(matches, team) {
  // Flatten the matches
  const matchesArray = Object.values(matches).flat();

  // Sort by date ascending
  return matchesArray
    .filter(item => [item.homeTeam, item.awayTeam].includes(team))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getIndexOfNextMatch(matches) {
  let indexOfNextMatch = 0;
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i];
    if (match.date && !match.started) {
      indexOfNextMatch = i;
      break;
    }
  }

  return indexOfNextMatch;
}
