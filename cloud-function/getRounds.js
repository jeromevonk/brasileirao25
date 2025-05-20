const fs = require('fs');
const path = require('path');
const matches_helper = require("../backend-frontend/src/helpers/match_helper")

async function writeFileAsync(basePath, fileName, data) {
    const filePath = path.join(basePath, `${fileName}.json`);
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function run() {
    const basePath = path.join(__dirname, '../backend-frontend/src/pages/api/data');

    for (let i = 1; i <= 38; i++) {
        const data = await matches_helper.getRoundFromAPI(i);
        // If round is complete, write to file
        if (data && matches_helper.isRoundComplete(data, i)) {
            await writeFileAsync(basePath, i, data);
        }
    }
}

run()