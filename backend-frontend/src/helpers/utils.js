export {
  getComparator,
  convertDateBrazilianFormat,
};

function getComparator(order, orderBy) {
  return (a, b) => customComparator(a, b, order, orderBy)
}

const textHeadCells = ['team'];

function customComparator(a, b, order, orderBy) {
  let x, y;

  if (textHeadCells.includes(orderBy)) {
    x = a[orderBy];
    y = b[orderBy];
  } else {
    // Must convert to a number in order to compare correctly
    x = Number(a[orderBy]);
    y = Number(b[orderBy]);
  }

  // If orderBy points, special case
  if (["points", "pointsLost"].includes(orderBy) ) {
    return sortByPoints(a, b, order, orderBy);
  }

  const multiplier = order === 'desc' ? 1 : -1;

  if (y < x) {
    return -1 * multiplier;
  }

  if (y > x) {
    return 1 * multiplier;
  }

  return 0;
}

function sortByPoints(a, b, order, orderBy) {

  let orderMultiplier = order === 'desc' ? 1 : -1;
  let pointsLostMultiplier = 1;
  if (orderBy === "pointsLost") {
    pointsLostMultiplier = -1;
  }
  
  // Compare by this order:
  // - Points
  // - Victories (greater is better)
  // - Goal difference (greater is better)
  // - Goals for (greater is better)


  if (Number(a[orderBy]) > Number(b[orderBy])) {
    return -1 * orderMultiplier;
  } else if (Number(a[orderBy]) < Number(b[orderBy])) {
    return 1 * orderMultiplier;
  } else if (Number(a.victories) > Number(b.victories)) {
    return -1 * orderMultiplier * pointsLostMultiplier;
  } else if (Number(a.victories) < Number(b.victories)) {
    return 1 * orderMultiplier * pointsLostMultiplier;
  } else if (Number(a.goalDifference) > Number(b.goalDifference)) {
    return -1 * orderMultiplier * pointsLostMultiplier;
  } else if (Number(a.goalDifference) < Number(b.goalDifference)) {
    return 1 * orderMultiplier * pointsLostMultiplier;
  } else if (Number(a.goalsFor) > Number(b.goalsFor)) {
    return -1 * orderMultiplier * pointsLostMultiplier;
  } else if (Number(a.goalsFor) < Number(b.goalsFor)) {
    return 1 * orderMultiplier * pointsLostMultiplier;
  } else {
    return 0;
  }
}

function convertDateBrazilianFormat(dateString) {
  // Split the input date string by the '-' character
  if (!dateString) return
  const parts = dateString.split('-');

  // Rearrange the parts into the desired format
  const formattedDate = `${parts[2]}/${parts[1]}`;

  return formattedDate;
}

