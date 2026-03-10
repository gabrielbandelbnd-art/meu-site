const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const scriptPath = path.join(ROOT, 'script.js');
const legacyWordBankPath = path.join(__dirname, 'word-bank.js');
const outPath = path.join(__dirname, 'daily-word-pool-365.json');

function normalizeWord(raw = '') {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

function parseChallengeMeanings() {
  const content = fs.readFileSync(scriptPath, 'utf8');
  const re = /\{\s*word:\s*"([A-Z]+)"[\s\S]*?meaning:\s*"([^"]+)"\s*\}/g;
  const map = new Map();
  let m;
  while ((m = re.exec(content)) !== null) {
    const w = normalizeWord(m[1]);
    if (!w) continue;
    map.set(w, m[2]);
  }
  return map;
}

function parseLegacyWords() {
  const content = fs.readFileSync(legacyWordBankPath, 'utf8');
  const words = [...content.matchAll(/'([A-Z]+)'/g)].map((m) => normalizeWord(m[1]));
  return [...new Set(words)];
}

const extraWords = [
  'AMIZADE','ALEGRIA','TRISTEZA','BONDADE','RESPEITO','EMPATIA','AFETO','CARINHO','TERNURA','SERENIDADE',
  'CALMARIA','CORACAO','ESPERTO','FAMILIAR','COMPANHEIRO','VIZINHO','PARCERIA','UNIAO','CONFIANCA','LEVEZA',
  'NATUREZA','ARVORE','FOLHAS','JANELA','COZINHA','VARANDA','TRAVESSEIRO','CADEIRA','MOCHILA','CHAVEIRO',
  'SAPATO','CAMISETA','PIPOCA','SORVETE','BISCOITO','MACARRAO','PANELA','GARFO','COLHER','TOALHA',
  'CAMINHO','JORNADA','RECOMECO','ESCOLHA','DECISAO','PROPOSITO','ATITUDE','PACIENCIA','PRATICA','ROTINA',
  'ESFORCO','METODO','CRIACAO','INVENCAO','PROJETO','DESENHO','CADERNO','REVISTA','CAPITULO','ENREDO',
  'PERSONAGEM','CENARIO','DESFECHO','FANTASIA','AVENTURA','MISTERIO','SEGREDO','DESTINO','VITORIA','CONQUISTA',
  'TALENTO','CUIDADO','SAUDE','BEMESTAR','RESPIRAR','MEDITAR','SABERES','MEMORIA','IDEAIS','VALORES',
  'JUSTICA','DIALOGO','ACORDO','EQUIPE','COMUNIDADE','CULTURA','TRADICAO','HERANCA','IDENTIDADE','CIDADAO',
  'ESTUDO','AULA','APRENDER','ENSINAR','BIBLIOTECA','CURIOSO','PERGUNTA','RESPOSTA','DESCOBERTA','PESQUISA',
  'NOTICIA','RELATO','EXEMPLO','PRATICO','TEATRO','MUSEU','PINTURA','ESCULTURA','CANCOES','MELODIA',
  'RITMOS','VIOLAO','TAMBORIM','CORAL','ORQUESTRA','CONCERTO','FESTIVO','CELEBRAR','ANIVERSARIO','PRESENTE',
  'ABRACO','SORRISO','RISADA','ENCANTO','MAGICO','GRIMORIO','ARCANO','RITUAL','SIMBOLO','AMULETO',
  'RELICA','LENDAS','MITICO','ORACULO','LABIRINTO','ECLIPSE','COMETA','ESTRELA','GALAXIA','UNIVERSO',
  'PLANETA','HORIZONTE','AURORA','NOITADA','AMANHECER','ENTARDECER','CHUVEIRO','CACHOEIRA','NASCENTE','OCEANO',
  'MONTANHA','DESERTO','BOSQUE','FLORESTA','PASSARO','ABELHAS','BORBOLETA','RAPOSA','CACHORRO','GATINHO',
  'PEIXE','NAVIO','BICICLETA','TREM','ONIBUS','ESTRADA','VIAGEM','CIDADE','BAIRRO','PRACA',
  'PARQUE','ESCOLA','TRABALHO','OFICINA','FAZENDA','JARDIM','POMAR','SEMENTE','COLHEITA','TEMPERO',
  'CAFETEIRA','CHOCOLATE','FRUTAS','LARANJA','BANANA','MELANCIA','ABACATE','MORANGO','COCO','ABACAXI',
  'MANDIOCA','BATATA','CENOURA','TOMATE','ESPINAFRE','FEIJAO','ARROZ','PAOZINHO','QUEIJO','IOGURTE',
  'MANTEIGA','SUCO','AGUADOCE','LIMONADA','CADERNETA','CANETA','LAPIS','BORRACHA','REGUA','MOEDA',
  'DINHEIRO','TESOURO','FORTUNA','ECONOMIA','NEGOCIO','MERCADO','LOJA','CLIENTE','SERVICO','OFERTA',
  'QUALIDADE','EFICIENCIA','PROGRESSO','RESULTADO','OBJETIVO','RANKING','TORNEIO','DESAFIO','MISSAO','SUPERACAO',
  'PERSISTIR','DISCIPLINA','FOCADO','EQUILIBRIO','INSPIRAR','CRIATIVO','INOVADOR','SOLUCAO','PERSPECTIVA','CONSTRUCAO',
  'FERRAMENTA','ESTRUTURA','PADRAO','FORMATO','SISTEMA','INTERFACE','USUARIO','SESSAO','SEGURANCA','VALIDACAO',
  'CONEXAO','SINTONIA','COESAO','COLABORAR','PARCERIAS','CONSENSO','DEBATE','REFLEXAO','SENSATEZ','PRIORIDADE',
  'CRITERIO','PONDERAR','CONFIAR','ESPERANCA','FELICIDADE','SAUDADE','LIBERDADE','CORAGEM','RESILIENCIA','SENTIMENTO'
];

// limpeza e normalização dos extras
const extras = [...new Set(extraWords.map(normalizeWord))].filter((w) => w.length >= 5 && w.length <= 10 && /^[A-Z]+$/.test(w));

const categorySets = {
  emocoes: new Set(['AMOR','MEDO','RISCO','SONHO','ESPERANCA','FELICIDADE','SAUDADES','CORAGEM','RESILIENCIA','SENTIMENTO','ALEGRIA','TRISTEZA','BONDADE','EMPATIA','AFETO','CARINHO','TERNURA','SERENIDADE','CONFIANCA','LEVEZA']),
  natureza: new Set(['SOL','LUA','MAR','RIO','LUZ','CHUVA','PRAIA','BOSQUE','TROVAO','ESTRELA','OCEANOS','FLORESTA','PLANETA','ABELHAS','BORBOLETA','NATUREZA','UNIVERSO','COMETA','GALAXIA','AURORA','HORIZONTE','CACHOEIRA','NASCENTE','MONTANHA','DESERTO','ARVORE','FOLHAS']),
  cotidiano: new Set(['CASA','MESA','PORTA','CARTA','LIVRO','CAFE','COMIDA','QUARTO','CIDADE','TRABALHO','DINHEIRO','PRESENTE','BICICLETA','ONIBUS','ESTRADA','MOCHILA','CHAVEIRO','COZINHA','VARANDA','TOALHA','SAPATO','CAMISETA','PANELA','GARFO','COLHER']),
  ideias: new Set(['TEMPO','IDEIA','DESTINO','LIBERDADE','CURIOSIDADE','CONHECIMENTO','COMUNICACAO','TRANSFORMACAO','INDEPENDENCIA','EQUILIBRIO','DIALOGO','REFLEXAO','SABEDORIA','PRIORIDADE','CRITERIO','PONDERACAO']),
  acoes: new Set(['JOGADA','CORRIDA','VIAGEM','ABRACO','SUPERACAO','PERSISTENCIA','DISCIPLINA','FOCO','TREINAMENTO','APRENDIZADO','EVOLUCAO','DESAFIO','MISSAO','CONQUISTA','RECOMECO']),
  cultura: new Set(['MUSICA','POESIA','HISTORIA','LITERATURA','PROFESSOR','ESCOLA','FESTA','FAMILIA','CULTURA','TRADICAO','HERANCA','IDENTIDADE','NARRATIVA','PERSONAGEM','CENARIO'])
};

function getCategory(word) {
  for (const [cat, set] of Object.entries(categorySets)) {
    if (set.has(word)) return cat;
  }
  return 'ideias';
}

const fallbackMeanings = {
  emocoes: 'Sentimento ou estado emocional comum nas experiências humanas.',
  natureza: 'Elemento ligado ao mundo natural e aos fenômenos do ambiente.',
  cotidiano: 'Termo frequente na vida diária, em casa, na rua ou no trabalho.',
  ideias: 'Conceito abstrato usado para pensar escolhas, valores e entendimento.',
  acoes: 'Ação ou processo ligado a movimento, esforço e realização.',
  cultura: 'Termo presente em educação, arte, linguagem ou convivência social.'
};

const hintSets = {
  emocoes: [
    'Aparece em momentos intensos da vida pessoal.',
    'Costuma influenciar decisões importantes.',
    'Pode crescer ou diminuir conforme as experiências.',
    'É frequentemente tema de músicas e histórias.',
    'Tem relação direta com a forma como alguém se sente por dentro.'
  ],
  natureza: [
    'Faz parte do mundo natural e do ambiente ao redor.',
    'Pode ser observado em paisagens ou fenômenos da Terra.',
    'Muitas pessoas associam isso a contemplação e equilíbrio.',
    'É comum em descrições poéticas e científicas.',
    'Está presente em conversas sobre planeta, clima ou ecossistemas.'
  ],
  cotidiano: [
    'Está muito presente na rotina de grande parte das pessoas.',
    'Pode aparecer em tarefas simples do dia a dia.',
    'É citado em contextos domésticos ou urbanos.',
    'Tem função prática e familiar para quase todo mundo.',
    'Geralmente é reconhecido sem esforço por pessoas de idades diferentes.'
  ],
  ideias: [
    'É um conceito usado para refletir sobre a vida e as escolhas.',
    'Aparece em conversas sobre valores, direção e entendimento.',
    'Pode mudar a forma de interpretar uma situação.',
    'É comum em debates, livros e reflexões pessoais.',
    'Ajuda a explicar como alguém pensa, decide ou enxerga o mundo.'
  ],
  acoes: [
    'Está ligado a movimento, prática ou execução.',
    'Envolve tentativa, esforço e continuidade.',
    'Pode ser medido por progresso ao longo do tempo.',
    'Costuma surgir em desafios, metas e competições.',
    'Representa algo que alguém realiza para alcançar um resultado.'
  ],
  cultura: [
    'Tem presença forte em contextos de aprendizagem e expressão.',
    'Aparece em obras, narrativas ou espaços de convivência.',
    'Conecta pessoas por linguagem, memória e repertório comum.',
    'É frequentemente citado em temas de arte e educação.',
    'Ajuda a preservar e transmitir conhecimento entre gerações.'
  ]
};

function dedupe(arr) {
  return [...new Set(arr)];
}

function buildPool() {
  const challengeMeanings = parseChallengeMeanings();
  const legacyWords = parseLegacyWords();

  const blacklist = new Set([
    'INCONSTITUCIONAL','INTERNACIONALIZACAO','PARALELEPIPEDO','DESENVOLVIMENTO','RESPONSABILIDADE','SUSTENTABILIDADE',
    'OTORRINOLARINGOLOGISTA','INDEPENDENTEMENTE','ELETRICIDADE','UNIVERSIDADE','PROBABILIDADE','OBSERVABILIDADE',
    'ESCALABILIDADE','CRIPTOGRAFIA','VERSIONAMENTO','HOMOLOGACAO','LABORATORIO','ESTATISTICA'
  ]);

  const candidates = dedupe([
    ...[...challengeMeanings.keys()],
    ...legacyWords,
    ...extras
  ]).map(normalizeWord)
   .filter((w) => /^[A-Z]+$/.test(w))
   .filter((w) => w.length >= 5 && w.length <= 10)
   .filter((w) => !blacklist.has(w));

  // prioridade para palavras com meaning conhecido no script principal
  const prioritized = dedupe([
    ...candidates.filter((w) => challengeMeanings.has(w)),
    ...candidates.filter((w) => !challengeMeanings.has(w))
  ]);

  if (prioritized.length < 365) {
    throw new Error(`Banco insuficiente após filtros: ${prioritized.length}`);
  }

  const words = prioritized.slice(0, 365);

  const out = words.map((word) => {
    const category = getCategory(word);
    const meaning = challengeMeanings.get(word) || fallbackMeanings[category];
    const hints = [...hintSets[category]];

    return {
      word,
      meaning,
      hints,
      active: true
    };
  });

  // validações obrigatórias
  const uniqueCount = new Set(out.map((x) => x.word)).size;
  if (out.length !== 365) throw new Error(`Quantidade inválida: ${out.length}`);
  if (uniqueCount !== 365) throw new Error(`Repetição detectada: únicas=${uniqueCount}`);
  for (const item of out) {
    if (!/^[A-Z]+$/.test(item.word)) throw new Error(`Word inválida: ${item.word}`);
    if (item.word.length < 5 || item.word.length > 10) throw new Error(`Tamanho inválido: ${item.word}`);
    if (!Array.isArray(item.hints) || item.hints.length !== 5) throw new Error(`Hints inválidas: ${item.word}`);
  }

  return out;
}

const pool = buildPool();
fs.writeFileSync(outPath, JSON.stringify(pool, null, 2), 'utf8');
console.log(`Arquivo gerado: ${outPath}`);
console.log(`Total: ${pool.length}`);
