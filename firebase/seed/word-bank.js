const RAW_WORDS = [
  'SOL', 'LUA', 'MAR', 'CEU', 'PAZ', 'SOM', 'COR', 'RIO', 'VOZ', 'LUZ', 'SAL', 'MAE', 'PAI', 'GOL', 'FIM',
  'AMOR', 'VIDA', 'GATO', 'CASA', 'BOLA', 'ANEL', 'TREM', 'FLOR', 'MESA', 'FOGO', 'AGUA', 'MEDO', 'RISO', 'CAFE', 'LIXO',
  'LIVRO', 'PORTA', 'NAVIO', 'PEIXE', 'CARTA', 'PLUMA', 'NOITE', 'CHUVA', 'PRAIA', 'SONHO', 'RISCO', 'MUNDO', 'TEMPO', 'IDEIA', 'FESTA',
  'ESCOLA', 'JARDIM', 'VIAGEM', 'MUSICA', 'AMIGOS', 'CIDADE', 'COMIDA', 'BRASIL', 'JOGADA', 'QUARTO', 'ABRACO', 'FUTURO', 'POESIA', 'BOSQUE', 'TROVAO',
  'VAMPIRO', 'ESTRELA', 'FAMILIA', 'PERFUME', 'FUTEBOL', 'CORAGEM', 'DESTINO', 'OCEANOS', 'FLORESTA', 'ESPELHO', 'RAPOSAS', 'PLANETA', 'ABELHAS', 'CORRIDA', 'CACHORRO',
  'ELEFANTE', 'DINHEIRO', 'PRESENTE', 'HISTORIA', 'NATUREZA', 'LIBERDADE', 'TRABALHO', 'UNIVERSO', 'SAUDADES', 'ESPERANCA', 'FELICIDADE', 'BORBOLETA', 'GEOGRAFIA', 'AVENTURA', 'CHOCOLATE',
  'PRINCESA', 'TECNOLOGIA', 'LITERATURA', 'PROFESSOR', 'COMPUTADOR', 'RINOCERONTE', 'MATEMATICA', 'ANIVERSARIO', 'ASTRONAUTA', 'BRINCADEIRA', 'INTELIGENTE', 'RESILIENCIA', 'SENTIMENTO', 'CATASTROFE', 'CURIOSIDADE',
  'ELETRICIDADE', 'UNIVERSIDADE', 'COMUNICACAO', 'REFRIGERANTE', 'SOLIDARIEDADE', 'TRANSFORMACAO', 'INDEPENDENCIA', 'ARQUITETURA', 'CONHECIMENTO', 'PARALELEPIPEDO', 'DESENVOLVIMENTO', 'RESPONSABILIDADE', 'SUSTENTABILIDADE', 'INCONSTITUCIONAL', 'REVOLUCIONARIO',
  'EXTRAORDINARIO', 'INTERNACIONALIZACAO', 'AURORA', 'CREPUSCULO', 'METEORO', 'ORBITA', 'GRAVIDADE', 'GALAXIA', 'NEBULOSA', 'COMETA', 'SATELITE', 'CONSTELACAO', 'HORIZONTE', 'ECLIPSE', 'EQUINOXIO',
  'LABIRINTO', 'ENIGMA', 'MISTERIO', 'SIMBOLO', 'ALQUIMIA', 'ORACULO', 'RITUAL', 'MANUSCRITO', 'ARCANO', 'GRIMORIO', 'HECHICO', 'ENCANTO', 'RUNA', 'RELICARIO', 'AMULETO',
  'SANTUARIO', 'TEMPLO', 'SENADO', 'PALACIO', 'CASTELO', 'FORTALEZA', 'CIDADANIA', 'TRIBUNAL', 'JUSTICA', 'EQUILIBRIO', 'HONESTIDADE', 'DIGNIDADE', 'LEALDADE', 'PRUDENCIA', 'EMPATIA',
  'MEMORIA', 'IMAGINACAO', 'RACIOCINIO', 'LOGICA', 'ANALOGIA', 'SINTAXE', 'SEMANTICA', 'PARAGRAFO', 'CAPITULO', 'BIBLIOTECA', 'ARQUIVO', 'DOCUMENTO', 'CADERNO', 'ESCRITA', 'LEITURA',
  'ORQUESTRA', 'VIOLINO', 'PIANO', 'GUITARRA', 'TAMBOR', 'FONEMA', 'MELODIA', 'HARMONIA', 'RITMO', 'SONORIDADE', 'SILENCIO', 'ECO', 'FREQUENCIA', 'VIBRACAO', 'SINFONIA',
  'ENERGIA', 'MATERIA', 'ATOMO', 'MOLECULA', 'BIOLOGIA', 'FISICA', 'QUIMICA', 'ALGEBRA', 'GEOMETRIA', 'ESTATISTICA', 'CALCULO', 'PROBABILIDADE', 'TEOREMA', 'AXIOMA', 'METODO',
  'NAVEGACAO', 'CARTOGRAFIA', 'MONTANHA', 'DESERTO', 'CAVERNA', 'PLANICIE', 'VULCAO', 'ARQUIPELAGO', 'PENINSULA', 'LAGUNA', 'CACHOEIRA', 'NASCENTE', 'CORRENTEZA', 'MARINHEIRO', 'PESCADOR',
  'SEMENTE', 'COLHEITA', 'FAZENDA', 'HORTA', 'VINHEDO', 'POMAR', 'FERTIL', 'RAIZ', 'TRONCO', 'FOLHAGEM', 'BROTO', 'PETALA', 'FRAGRANCIA', 'NECTAR', 'POLEN',
  'CAVALEIRO', 'ESCUDEIRO', 'MERCADOR', 'ARTESAO', 'FERREIRO', 'ALQUIMISTA', 'ARQUEIRO', 'NAVEGANTE', 'ESCRIVAO', 'CURANDEIRO', 'SENTINELA', 'EMISSARIO', 'CONSELHEIRO', 'HERALDO', 'MENSAGEIRO',
  'ALIANCA', 'PACTO', 'TRATADO', 'NEGOCIO', 'ACORDO', 'CLAUSULA', 'PROPOSTA', 'ESTRATEGIA', 'TATICA', 'PLANEJAMENTO', 'ORGANIZACAO', 'EXECUCAO', 'RESULTADO', 'MELHORIA', 'EFICIENCIA',
  'INTERFACE', 'ALGORITMO', 'SISTEMA', 'SERVIDOR', 'BANCO', 'DADOS', 'CLIENTE', 'USUARIO', 'SESSAO', 'TOKEN', 'CHAVE', 'SEGURANCA', 'CRIPTOGRAFIA', 'ASSINATURA', 'VALIDACAO',
  'INTEGRIDADE', 'CONSISTENCIA', 'LATENCIA', 'ESCALABILIDADE', 'DISPONIBILIDADE', 'REDUNDANCIA', 'MONITORAMENTO', 'OBSERVABILIDADE', 'INCIDENTE', 'CORRECAO', 'VERSIONAMENTO', 'HOMOLOGACAO', 'PRODUCAO', 'AUTOMACAO', 'DEPLOY',
  'JORNADA', 'DESAFIO', 'MISSAO', 'CONQUISTA', 'VITORIA', 'DERROTA', 'RECOMECO', 'PERSISTENCIA', 'DISCIPLINA', 'ROTINA', 'FOCO', 'EQUILIBRIO', 'PROPOSITO', 'MOTIVACAO', 'SUPERACAO',
  'TREINAMENTO', 'APRENDIZADO', 'EVOLUCAO', 'RESULTADOS', 'DESEMPENHO', 'COMPETICAO', 'RANKING', 'PONTUACAO', 'MARATONA', 'TORNEIO', 'DESBLOQUEIO', 'BONIFICACAO', 'PROGRESSO', 'RECOMPENSA', 'OBJETIVO',
  'LABORATORIO', 'EXPERIMENTO', 'HIPOTESE', 'EVIDENCIA', 'PESQUISA', 'RELATORIO', 'DIAGNOSTICO', 'TRATAMENTO', 'TERAPIA', 'CUIDADO', 'SAUDE', 'BEMESTAR', 'EQUANIMIDADE', 'SERENIDADE', 'PACIENCIA',
  'CONSCIENCIA', 'ATENCAO', 'PRESENCA', 'CALMA', 'RESPIRACAO', 'MEDITACAO', 'SABEDORIA', 'PRATICA', 'REFLEXAO', 'CONTEMPLACAO', 'SENSATEZ', 'PRIORIDADE', 'CRITERIO', 'PONDERACAO', 'CONFIANCA',
  'INSPIRACAO', 'CRIATIVIDADE', 'INOVACAO', 'SOLUCAO', 'PERSPECTIVA', 'ABSTRACAO', 'CONSTRUCAO', 'PROTOTIPO', 'MECANISMO', 'ENGENHARIA', 'ARTEFATO', 'FERRAMENTA', 'ESTRUTURA', 'FORMATO', 'PADRAO',
  'LENDARIO', 'MITOLOGIA', 'NARRATIVA', 'PERSONAGEM', 'TRAMA', 'DESFECHO', 'CAPA', 'INDICE', 'PREFACIO', 'EPILOGO', 'CENARIO', 'AMBIENTE', 'ATMOSFERA', 'SIMETRIA', 'PARADOXO',
  'DIALOGO', 'DEBATE', 'CONSENSO', 'DIVERGENCIA', 'PONTE', 'CONEXAO', 'SINTONIA', 'COESAO', 'COLABORACAO', 'PARCERIA', 'COMUNIDADE', 'CULTURA', 'TRADICAO', 'HERANCA', 'IDENTIDADE'
];

function normalizeWord(raw = '') {
  return raw
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z]/g, '');
}

const THEMES = [
  { name: 'natureza', meaning: 'Elemento associado a fenomenos naturais e ao ambiente.' },
  { name: 'sociedade', meaning: 'Termo usado em contextos de convivencia, relacoes e organizacao social.' },
  { name: 'conhecimento', meaning: 'Conceito ligado a estudo, interpretacao e construcao intelectual.' },
  { name: 'tecnologia', meaning: 'Palavra aplicada em processos, sistemas ou ferramentas tecnicas.' },
  { name: 'jornada', meaning: 'Ideia ligada a progresso, desafio e superacao ao longo do tempo.' },
  { name: 'cultura', meaning: 'Termo recorrente em narrativas, simbolos e referencias culturais.' }
];

function countVowels(word) {
  return (word.match(/[AEIOU]/g) || []).length;
}

function buildHints(word, themeName) {
  const len = word.length;
  const vowels = countVowels(word);
  const consonants = Math.max(0, len - vowels);
  const mid = word[Math.floor((len - 1) / 2)];
  const unique = new Set(word.split('')).size;

  return [
    `Tem ${len} letras, com ${vowels} vogais e ${consonants} consoantes.`,
    `A letra central (aproximada) e '${mid}', e ha ${unique} letras unicas.`,
    `Comeca com '${word[0]}' e termina com '${word[len - 1]}', mas nao e termo tecnico raro.`,
    `As duas primeiras letras formam '${word.slice(0, 2)}' e as duas ultimas '${word.slice(-2)}'.`,
    `A pista semantica aponta para o tema: ${themeName}.`
  ];
}

function buildEntry(word, idx) {
  const theme = THEMES[idx % THEMES.length];
  return {
    word,
    meaning: theme.meaning,
    hints: buildHints(word, theme.name),
    difficulty: 'hard',
    active: true,
    order: idx + 1
  };
}

function buildDailyPool365() {
  const unique = [...new Set(RAW_WORDS.map(normalizeWord))].filter((w) => w.length >= 3);
  if (unique.length < 365) {
    throw new Error(`Banco insuficiente: ${unique.length} palavras unicas. Minimo: 365.`);
  }

  return unique.slice(0, 365).map((word, idx) => buildEntry(word, idx));
}

module.exports = {
  buildDailyPool365
};
