const TEAMS = {
    "Atlético-MG": { initials: 'CAM', badge: 'https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg' },
    "Bahia": { initials: 'BAH', badge: 'https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg' },
    "Botafogo": { initials: 'BOT', badge: 'https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg' },
    "Bragantino": { initials: 'RBB', badge: 'https://s.sde.globo.com/media/organizations/2021/06/28/bragantino.svg' },
    "Ceará": { initials: 'CEA', badge: 'https://s.sde.globo.com/media/organizations/2019/10/10/ceara.svg' },
    "Corinthians": { initials: 'COR', badge: 'https://s.sde.globo.com/media/organizations/2019/09/30/Corinthians.svg' },
    "Cruzeiro": { initials: 'CRU', badge: 'https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg' },
    "Flamengo": { initials: 'FLA', badge: 'https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg' },
    "Fluminense": { initials: 'FLU', badge: 'https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg' },
    "Fortaleza": { initials: 'FOR', badge: 'https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg' },
    "Grêmio": { initials: 'GRE', badge: 'https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg' },
    "Internacional": { initials: 'INT', badge: 'https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg' },
    "Juventude": { initials: 'JUV', badge: 'https://s.sde.globo.com/media/organizations/2021/04/29/Juventude-2021-01.svg' },
    "Mirassol": { initials: 'MIR', badge: 'https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg' },
    "Palmeiras": { initials: 'PAL', badge: 'https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg' },
    "São Paulo": { initials: 'SAO', badge: 'https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg' },
    "Sport": { initials: 'SPT', badge: 'https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg' },
    "Vasco": { initials: 'VAS', badge: 'https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg' },
    "Vitória": { initials: 'VIT', badge: 'https://s.sde.globo.com/media/organizations/2024/04/09/escudo-vitoria-svg-69281.svg' },
    "Santos": { initials: 'SAN', badge: 'https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg' },
}

const getTeam = (team) => {
    return TEAMS[team]
}

module.exports = {
    TEAMS,
    getTeam
};