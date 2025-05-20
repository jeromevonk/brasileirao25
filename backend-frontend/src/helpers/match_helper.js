function isRoundComplete(round, i) {
  const finished = round.filter(item => item.finished)
  console.log(`Round ${i} with ${finished.length} finished`)
  return finished.length == 10
}

async function getRoundFromAPI(round) {
  try {
    const response = await fetch(`https://api.globoesporte.globo.com/tabela/d1a37fa4-e948-43a6-ba53-ab24ab3a45b1/fase/fase-unica-campeonato-brasileiro-2025/rodada/${round}/jogos/`);

    if (!response.ok) {
      throw new Error(`Failed getting round ${round}`);
    }

    const data = await response.json();
    const matches = [];

    for (const item of data) {
      matches.push({
        homeTeam: item.equipes.mandante.nome_popular,
        awayTeam: item.equipes.visitante.nome_popular,
        homeScore: item.placar_oficial_mandante,
        awayScore: item.placar_oficial_visitante,
        date: item.data_realizacao?.substring(0, 10) || null,
        time: item.hora_realizacao || null,
        stadium: item.sede?.nome_popular || '',
        started: item.jogo_ja_comecou,
        finished: item.transmissao?.broadcast?.id == "ENCERRADA"
      });
    }

    return matches;
  } catch (error) {
    throw new Error(`Error related to round ${round}: ${error.message}`);
  }
}

module.exports = {
  isRoundComplete,
  getRoundFromAPI,
};
