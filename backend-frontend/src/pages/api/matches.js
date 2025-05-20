import fs from 'fs';
const matches_helper = require("../../helpers/match_helper")

export default async function handler(req, res) {
  try {
    const responseData = {};
    const requests = [];

    // Loop through rounds from 1 to 38
    for (let i = 1; i <= 38; i++) {
      requests.push(getRoundData(i).then(data => {
        responseData[i] = data;
      }));
    }

    await Promise.all(requests);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

async function getRoundData(round) {
  const filePath = process.cwd() + `/src/pages/api/data/${round}.json`;

  // If file exists, use it
  if (fs.existsSync(filePath)) {
    return getRoundFromFile(filePath);
  } else {
    const data = await matches_helper.getRoundFromAPI(round);

    return data;
  }
}

function getRoundFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`Error reading file ${filePath}: ${error.message}`);
  }
}
