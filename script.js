/* --- DADOS (LOTE 1 - 120 PALAVRAS) --- */
const allChallenges = [
    // --- 3 LETRAS ---
    { word: "SOL", hints: ["Astro rei.", "Aquece o dia.", "Estrela.", "Luz natural.", "Calor."], meaning: "Estrela central do sistema solar." },
    { word: "LUA", hints: ["Satélite.", "Noite.", "Fases.", "Marés.", "Branca."], meaning: "Satélite natural da Terra." },
    { word: "MAR", hints: ["Oceano.", "Sal.", "Ondas.", "Azul.", "Praia."], meaning: "Grande massa de água salgada." },
    { word: "CEU", hints: ["Azul.", "Nuvens.", "Alto.", "Infinito.", "Paraíso."], meaning: "Espaço acima da Terra." },
    { word: "PAZ", hints: ["Calma.", "Branco.", "Trégua.", "Sossego.", "Harmonia."], meaning: "Estado de tranquilidade." },
    { word: "SOM", hints: ["Ouvir.", "Música.", "Ruído.", "Vibração.", "Volume."], meaning: "Sensação auditiva." },
    { word: "COR", hints: ["Tinta.", "Arco-íris.", "Visual.", "Pintura.", "Luz."], meaning: "Impressão visual da luz." },
    { word: "RIO", hints: ["Água doce.", "Correnteza.", "Peixes.", "Fluxo.", "Leito."], meaning: "Curso de água natural." },
    { word: "VOZ", hints: ["Falar.", "Cantar.", "Garganta.", "Som humano.", "Grito."], meaning: "Som produzido pelas cordas vocais." },
    { word: "LUZ", hints: ["Claridade.", "Lâmpada.", "Velocidade.", "Sol.", "Dia."], meaning: "Radiação visível." },
    { word: "SAL", hints: ["Tempero.", "Branco.", "Mar.", "Cozinha.", "Sódio."], meaning: "Substância usada para temperar." },
    { word: "MAE", hints: ["Geradora.", "Amor.", "Família.", "Origem.", "Cuidado."], meaning: "Genitora." },
    { word: "PAI", hints: ["Protetor.", "Família.", "Masculino.", "Origem.", "Herói."], meaning: "Genitor." },
    { word: "GOL", hints: ["Futebol.", "Rede.", "Ponto.", "Chute.", "Torcida."], meaning: "Ponto no futebol." },
    { word: "FIM", hints: ["Término.", "Acabou.", "Conclusão.", "Final.", "Desfecho."], meaning: "Onde algo termina." },

    // --- 4 LETRAS ---
    { word: "AMOR", hints: ["Coração.", "Afeto.", "Paixão.", "Sentimento.", "União."], meaning: "Forte afeição por outra pessoa." },
    { word: "VIDA", hints: ["Viver.", "Existência.", "Nascer.", "Biologia.", "Sopro."], meaning: "Estado de atividade funcional." },
    { word: "GATO", hints: ["Felino.", "Miau.", "Bigode.", "Animal.", "Doméstico."], meaning: "Pequeno mamífero carnívoro." },
    { word: "CASA", hints: ["Moradia.", "Teto.", "Lar.", "Construção.", "Abrigo."], meaning: "Edifício para habitar." },
    { word: "BOLA", hints: ["Esfera.", "Jogo.", "Redonda.", "Futebol.", "Brinquedo."], meaning: "Objeto esférico usado em jogos." },
    { word: "ANEL", hints: ["Dedo.", "Joia.", "Ouro.", "Círculo.", "Compromisso."], meaning: "Aro ornamental usado no dedo." },
    { word: "TREM", hints: ["Trilho.", "Vagão.", "Locomotiva.", "Viagem.", "Apito."], meaning: "Comboio ferroviário." },
    { word: "FLOR", hints: ["Jardim.", "Pétala.", "Cheiro.", "Planta.", "Primavera."], meaning: "Órgão reprodutor das plantas." },
    { word: "MESA", hints: ["Móvel.", "Jantar.", "Apoio.", "Quatro pernas.", "Madeira."], meaning: "Móvel com tampo plano." },
    { word: "FOGO", hints: ["Quente.", "Queima.", "Chama.", "Incêndio.", "Luz."], meaning: "Combustão visível." },
    { word: "AGUA", hints: ["Líquido.", "Beber.", "Vida.", "Rio.", "Chuva."], meaning: "Líquido essencial à vida." },
    { word: "MEDO", hints: ["Susto.", "Pavor.", "Escuro.", "Terror.", "Emoção."], meaning: "Sensação de perigo." },
    { word: "RISO", hints: ["Alegria.", "Boca.", "Piada.", "Engraçado.", "Som."], meaning: "Ato de rir." },
    { word: "CAFE", hints: ["Bebida.", "Preto.", "Manhã.", "Acordar.", "Cafeína."], meaning: "Bebida estimulante." },
    { word: "LIXO", hints: ["Descarte.", "Sujeira.", "Reciclar.", "Cesto.", "Resto."], meaning: "Resíduos descartados." },

    // --- 5 LETRAS ---
    { word: "LIVRO", hints: ["Leitura.", "Páginas.", "Biblioteca.", "História.", "Capa."], meaning: "Conjunto de folhas escritas." },
    { word: "PORTA", hints: ["Entrada.", "Abrir.", "Madeira.", "Maçaneta.", "Saída."], meaning: "Abertura em parede para passagem." },
    { word: "NAVIO", hints: ["Mar.", "Transporte.", "Barco grande.", "Oceano.", "Cruzeiro."], meaning: "Grande embarcação." },
    { word: "PEIXE", hints: ["Água.", "Nadar.", "Escamas.", "Rio.", "Mar."], meaning: "Animal vertebrado aquático." },
    { word: "CARTA", hints: ["Correio.", "Papel.", "Envelope.", "Escrever.", "Mensagem."], meaning: "Mensagem escrita enviada a alguém." },
    { word: "PLUMA", hints: ["Leve.", "Pena.", "Ave.", "Macio.", "Travesseiro."], meaning: "Pena de ave." },
    { word: "NOITE", hints: ["Escuro.", "Lua.", "Estrelas.", "Dormir.", "Fim do dia."], meaning: "Período sem luz solar." },
    { word: "CHUVA", hints: ["Água.", "Nuvens.", "Molhado.", "Temporal.", "Gotas."], meaning: "Precipitação atmosférica." },
    { word: "PRAIA", hints: ["Areia.", "Mar.", "Sol.", "Verão.", "Ondas."], meaning: "Borda de terra à beira-mar." },
    { word: "SONHO", hints: ["Dormir.", "Imaginação.", "Desejo.", "Pesadelo.", "Noite."], meaning: "Imagens vistas enquanto se dorme." },
    { word: "RISCO", hints: ["Perigo.", "Traço.", "Aventura.", "Medo.", "Rabisco."], meaning: "Possibilidade de perigo." },
    { word: "MUNDO", hints: ["Terra.", "Globo.", "Planeta.", "Universo.", "Pessoas."], meaning: "O planeta Terra." },
    { word: "TEMPO", hints: ["Relógio.", "Horas.", "Clima.", "Passado.", "Futuro."], meaning: "Duração dos fatos." },
    { word: "IDEIA", hints: ["Pensamento.", "Mente.", "Criatividade.", "Luz.", "Plano."], meaning: "Representação mental." },
    { word: "FESTA", hints: ["Comemoração.", "Bolo.", "Música.", "Amigos.", "Dança."], meaning: "Reunião para celebrar." },

    // --- 6 LETRAS ---
    { word: "ESCOLA", hints: ["Estudar.", "Alunos.", "Professor.", "Aulas.", "Saber."], meaning: "Estabelecimento de ensino." },
    { word: "JARDIM", hints: ["Flores.", "Verde.", "Grama.", "Plantas.", "Natureza."], meaning: "Terreno cultivado com plantas." },
    { word: "VIAGEM", hints: ["Turismo.", "Malas.", "Férias.", "Avião.", "Estrada."], meaning: "Ato de deslocar-se a outro lugar." },
    { word: "MUSICA", hints: ["Som.", "Melodia.", "Ritmo.", "Instrumento.", "Canção."], meaning: "Arte de combinar sons." },
    { word: "AMIGOS", hints: ["Parceria.", "Companhia.", "Lealdade.", "Festa.", "Grupo."], meaning: "Pessoas com quem se tem afeto." },
    { word: "CIDADE", hints: ["Prédios.", "Ruas.", "Urbano.", "População.", "Prefeito."], meaning: "Aglomerado urbano." },
    { word: "COMIDA", hints: ["Fome.", "Almoço.", "Jantar.", "Sabor.", "Nutrição."], meaning: "O que se come." },
    { word: "BRASIL", hints: ["País.", "Verde e amarelo.", "Samba.", "Futebol.", "Sul-americano."], meaning: "Maior país da América do Sul." },
    { word: "JOGADA", hints: ["Esporte.", "Movimento.", "Estratégia.", "Lance.", "Partida."], meaning: "Ato de jogar." },
    { word: "QUARTO", hints: ["Dormir.", "Cama.", "Cômodo.", "Casa.", "Descanso."], meaning: "Aposento para dormir." },
    { word: "ABRACO", hints: ["Carinho.", "Braços.", "Aperto.", "Afeto.", "Cumprimento."], meaning: "Enlaçamento com os braços." },
    { word: "FUTURO", hints: ["Amanhã.", "Destino.", "Tempo.", "Vir a ser.", "Adiante."], meaning: "Tempo que há de vir." },
    { word: "POESIA", hints: ["Rima.", "Versos.", "Arte.", "Escrita.", "Amor."], meaning: "Arte de compor versos." },
    { word: "BOSQUE", hints: ["Árvores.", "Floresta.", "Natureza.", "Verde.", "Passeio."], meaning: "Pequena floresta." },
    { word: "TROVAO", hints: ["Barulho.", "Tempestade.", "Raio.", "Céu.", "Estrondo."], meaning: "Ruído provocado pelo raio." },

    // --- 7 LETRAS ---
    { word: "GUITARRA", hints: ["Música.", "Cordas.", "Rock.", "Solo.", "Elétrica."], meaning: "Instrumento musical de cordas." },
    { word: "VAMPIRO", hints: ["Sangue.", "Dentes.", "Noite.", "Morcego.", "Drácula."], meaning: "Criatura mitológica que bebe sangue." },
    { word: "ESTRELA", hints: ["Céu.", "Brilho.", "Noite.", "Espaço.", "Pontas."], meaning: "Corpo celeste luminoso." },
    { word: "FAMILIA", hints: ["Parentes.", "Casa.", "Sangue.", "União.", "Genealogia."], meaning: "Grupo de pessoas com laços sanguíneos." },
    { word: "PERFUME", hints: ["Cheiro.", "Frasco.", "Aroma.", "Essência.", "Flor."], meaning: "Líquido aromático." },
    { word: "FUTEBOL", hints: ["Esporte.", "Gol.", "Bola.", "Campo.", "Time."], meaning: "Esporte jogado com os pés." },
    { word: "CORAGEM", hints: ["Bravura.", "Medo.", "Herói.", "Enfrentar.", "Valente."], meaning: "Moral forte perante o perigo." },
    { word: "DESTINO", hints: ["Futuro.", "Sorte.", "Caminho.", "Fado.", "Final."], meaning: "O que está determinado a acontecer." },
    { word: "OCEANOS", hints: ["Água.", "Azul.", "Terra.", "Mar.", "Profundo."], meaning: "Grandes massas de água salgada." },
    { word: "FLORESTA", hints: ["Árvores.", "Selva.", "Verde.", "Animais.", "Mata."], meaning: "Grande extensão de árvores." },
    { word: "ESPELHO", hints: ["Reflexo.", "Vidro.", "Imagem.", "Olhar.", "Vaidade."], meaning: "Superfície que reflete a imagem." },
    { word: "RAPOSAS", hints: ["Animal.", "Esperta.", "Laranja.", "Cauda.", "Mato."], meaning: "Mamífero carnívoro." },
    { word: "PLANETA", hints: ["Terra.", "Espaço.", "Orbita.", "Mundo.", "Sol."], meaning: "Corpo celeste que orbita uma estrela." },
    { word: "ABELHAS", hints: ["Mel.", "Inseto.", "Colmeia.", "Ferrão.", "Rainha."], meaning: "Inseto produtor de mel." },
    { word: "CORRIDA", hints: ["Velocidade.", "Esporte.", "Pressa.", "Pés.", "Chegada."], meaning: "Ato de correr." },

    // --- 8 LETRAS ---
    { word: "CACHORRO", hints: ["Latir.", "Animal.", "Amigo.", "Osso.", "Doméstico."], meaning: "Melhor amigo do homem." },
    { word: "ELEFANTE", hints: ["Grande.", "Tromba.", "África.", "Pesado.", "Cinza."], meaning: "Maior animal terrestre." },
    { word: "DINHEIRO", hints: ["Pagar.", "Moeda.", "Banco.", "Compra.", "Riqueza."], meaning: "Meio de troca de valores." },
    { word: "PRESENTE", hints: ["Aniversário.", "Dar.", "Caixa.", "Agora.", "Natal."], meaning: "Objeto oferecido a alguém." },
    { word: "HISTORIA", hints: ["Passado.", "Livro.", "Tempo.", "Fatos.", "Contar."], meaning: "Narrativa de eventos passados." },
    { word: "NATUREZA", hints: ["Verde.", "Matas.", "Animais.", "Terra.", "Vida."], meaning: "Mundo físico e seus fenômenos." },
    { word: "LIBERDADE", hints: ["Livre.", "Voo.", "Prisão (oposto).", "Direito.", "Escolha."], meaning: "Poder de agir segundo a própria vontade." },
    { word: "TRABALHO", hints: ["Emprego.", "Salário.", "Ofício.", "Esforço.", "Profissão."], meaning: "Atividade produtiva." },
    { word: "UNIVERSO", hints: ["Espaço.", "Tudo.", "Galáxias.", "Infinito.", "Estrelas."], meaning: "Conjunto de tudo o que existe." },
    { word: "SAUDADES", hints: ["Falta.", "Lembrança.", "Distância.", "Sentimento.", "Nostalgia."], meaning: "Sentimento de falta de alguém." },

    // --- 9 LETRAS ---
    { word: "ESPERANCA", hints: ["Fé.", "Futuro.", "Acreditar.", "Verde.", "Sonho."], meaning: "Sentimento de quem vê como possível o que deseja." },
    { word: "FELICIDADE", hints: ["Alegria.", "Sorriso.", "Bem-estar.", "Contente.", "Emoção."], meaning: "Estado de quem é feliz." },
    { word: "BORBOLETA", hints: ["Inseto.", "Voar.", "Colorida.", "Casulo.", "Transformação."], meaning: "Inseto de asas coloridas." },
    { word: "GEOGRAFIA", hints: ["Mapas.", "Terra.", "Países.", "Estudo.", "Relevo."], meaning: "Ciência que estuda a superfície terrestre." },
    { word: "AVENTURA", hints: ["Risco.", "Viagem.", "Ação.", "Explorar.", "Adrenalina."], meaning: "Experiência arriscada ou emocionante." },
    { word: "CHOCOLATE", hints: ["Doce.", "Cacau.", "Marrom.", "Páscoa.", "Comer."], meaning: "Alimento feito de cacau." },
    { word: "PRINCESA", hints: ["Reino.", "Coroa.", "Conto de fadas.", "Castelo.", "Filha do rei."], meaning: "Filha de rei ou rainha." },
    { word: "TECNOLOGIA", hints: ["Computador.", "Futuro.", "Inovação.", "Digital.", "Máquinas."], meaning: "Aplicação de conhecimento científico." },
    { word: "LITERATURA", hints: ["Livros.", "Escrita.", "Autores.", "Poesia.", "Texto."], meaning: "Arte de escrever." },
    { word: "PROFESSOR", hints: ["Ensino.", "Escola.", "Mestre.", "Aula.", "Aprender."], meaning: "Aquele que ensina." },

    // --- 10 LETRAS ---
    { word: "COMPUTADOR", hints: ["Máquina.", "Internet.", "Teclado.", "Tela.", "PC."], meaning: "Máquina eletrônica de processamento de dados." },
    { word: "RINOCERONTE", hints: ["Animal.", "Chifre.", "Pesado.", "África.", "Forte."], meaning: "Grande mamífero com chifre no nariz." },
    { word: "MATEMATICA", hints: ["Números.", "Contas.", "Soma.", "Escola.", "Lógica."], meaning: "Ciência dos números e formas." },
    { word: "ANIVERSARIO", hints: ["Festa.", "Bolo.", "Idade.", "Parabéns.", "Data."], meaning: "Dia em que se completa anos." },
    { word: "ASTRONAUTA", hints: ["Espaço.", "Lua.", "Foguete.", "Nasa.", "Capacete."], meaning: "Viajante espacial." },
    { word: "BRINCADEIRA", hints: ["Diversão.", "Criança.", "Jogo.", "Rir.", "Passatempo."], meaning: "Ato de brincar." },
    { word: "INTELIGENTE", hints: ["Esperto.", "Cérebro.", "Saber.", "Gênio.", "Raciocínio."], meaning: "Que tem inteligência." },
    { word: "RESILIENCIA", hints: ["Força.", "Superar.", "Adaptar.", "Voltar.", "Persistir."], meaning: "Capacidade de se recuperar de dificuldades." },
    { word: "SENTIMENTO", hints: ["Emoção.", "Coração.", "Amor.", "Ódio.", "Sentir."], meaning: "Ato ou efeito de sentir." },
    { word: "CATASTROFE", hints: ["Desastre.", "Caos.", "Destruição.", "Ruim.", "Acidente."], meaning: "Grande desgraça ou infortúnio." },

    // --- 11 a 13 LETRAS ---
    { word: "CURIOSIDADE", hints: ["Saber.", "Pergunta.", "Descobrir.", "Interesse.", "Xereta."], meaning: "Vontade de ver ou aprender algo." },
    { word: "ELETRICIDADE", hints: ["Luz.", "Choque.", "Tomada.", "Energia.", "Fios."], meaning: "Forma de energia." },
    { word: "UNIVERSIDADE", hints: ["Faculdade.", "Estudo.", "Diploma.", "Campus.", "Superior."], meaning: "Instituição de ensino superior." },
    { word: "COMUNICACAO", hints: ["Falar.", "Mensagem.", "Troca.", "Conversa.", "Mídia."], meaning: "Ato de transmitir informação." },
    { word: "REFRIGERANTE", hints: ["Bebida.", "Gás.", "Doce.", "Gelado.", "Soda."], meaning: "Bebida não alcoólica gaseificada." },
    { word: "SOLIDARIEDADE", hints: ["Ajuda.", "Apoio.", "Bondade.", "Próximo.", "União."], meaning: "Cooperação mútua entre pessoas." },
    { word: "TRANSFORMACAO", hints: ["Mudança.", "Virar.", "Evolução.", "Metamorfose.", "Diferente."], meaning: "Ato de transformar." },
    { word: "INDEPENDENCIA", hints: ["Livre.", "País.", "Autonomia.", "Sozinho.", "7 de setembro."], meaning: "Estado de quem não depende de outro." },
    { word: "ARQUITETURA", hints: ["Prédios.", "Projeto.", "Desenho.", "Construção.", "Arte."], meaning: "Arte de projetar e edificar." },
    { word: "CONHECIMENTO", hints: ["Saber.", "Estudo.", "Mente.", "Aprender.", "Sabedoria."], meaning: "Ato de conhecer ou saber." },

    // --- 14 a 20 LETRAS (DIFÍCIL) ---
    { word: "PARALELEPIPEDO", hints: ["Rua.", "Pedra.", "Calçada.", "Bloco.", "Geometria."], meaning: "Sólido geométrico ou pedra de calçamento." },
    { word: "DESENVOLVIMENTO", hints: ["Crescer.", "Progresso.", "Avanço.", "Melhora.", "Evoluir."], meaning: "Ato de desenvolver-se." },
    { word: "RESPONSABILIDADE", hints: ["Dever.", "Adulto.", "Cuidar.", "Culpa.", "Sério."], meaning: "Obrigação de responder pelas próprias ações." },
    { word: "SUSTENTABILIDADE", hints: ["Natureza.", "Futuro.", "Reciclar.", "Verde.", "Planeta."], meaning: "Uso consciente dos recursos naturais." },
    { word: "INCONSTITUCIONAL", hints: ["Lei.", "Proibido.", "Contra.", "Regra.", "Jurídico."], meaning: "Que é contra a constituição." },
    { word: "OTORRINOLARINGOLOGISTA", hints: ["Médico.", "Garganta.", "Nariz.", "Ouvido.", "Nome comprido."], meaning: "Médico especialista em ouvido, nariz e garganta." },
    { word: "INDEPENDENTEMENTE", hints: ["Sem depender.", "Apesar.", "Livre.", "Sozinho.", "Advérbio."], meaning: "De modo independente." },
    { word: "REVOLUCIONARIO", hints: ["Mudança.", "Guerra.", "Novo.", "Líder.", "Transformar."], meaning: "Que causa revolução." },
    { word: "EXTRAORDINARIO", hints: ["Incrível.", "Fora do comum.", "Especial.", "Raro.", "Ótimo."], meaning: "Que não é ordinário ou comum." },
    { word: "INTERNACIONALIZACAO", hints: ["Mundo.", "Global.", "Países.", "Exterior.", "Expandir."], meaning: "Tornar algo internacional." }
];

let usedIndices = [];

/* --- VARIAVEIS --- */
const wordGrid = document.getElementById('word-grid');
const charInput = document.getElementById('char-input');
const validateBtn = document.getElementById('validate-btn');
const feedback = document.getElementById('feedback-message');
const meaningBox = document.getElementById('meaning-box');
const historyList = document.getElementById('input-history');
const successSound = document.getElementById('success-sound');
const miniAlphabetContainer = document.getElementById('mini-alphabet');
const hintText = document.getElementById('current-hint');
const hintCounter = document.getElementById('hint-counter');
const lengthSelector = document.getElementById('length-selector');

let currentWord = [];
let replaceIndex = 0;
let isFirstRound = true; 
let targetChallenge = null;
let hintIndex = 0;
let hintInterval = null;
let maxWordLength = 0;

// --- VARIÁVEIS DA GALINHA E MENSAGENS ---
let consecutiveErrors = 0;
let chickenAlreadySummoned = false; // Trava para a galinha voar só 1 vez
let feedbackTimeout = null; // Trava para a mensagem durar exatos 6 segundos

const funnyPhrases = [
    "Que isso, cara? Tá tentando inventar uma palavra nova pro dicionário?",
    "Essa aí nem o Google teve coragem de reconhecer.",
    "Tá difícil ou você tá de gracinha validando tudo errado?",
    "Quer algo mais fácil? Vai jogar modo três letras, campeão.",
    "Você digitou com o cotovelo agora, né?",
    "Calma, respira… não é um teclado musical.",
    "Essa palavra existe só na sua imaginação fértil.",
    "Eu até tentei defender você, mas não deu.",
    "Se errar mais uma, vou pedir reforço pro professor de português.",
    "Tá treinando pra campeonato mundial de erro?",
    "Essa passou longe… tipo, outro CEP.",
    "Amigo… isso foi estratégia ou desespero?",
    "Eu acredito em você… mas essa aí me quebrou.",
    "Se criatividade valesse ponto, você tava ganhando.",
    "Palavra inédita detectada. Quer patentear?",
    "Você tá jogando ou testando minha paciência?",
    "Errar é humano… mas você tá se dedicando demais.",
    "Quase! Só errou todas as letras.",
    "Vou fingir que não vi essa e te dar outra chance.",
    "Tá me estressando… mas de um jeito carismático. Continua tentando",
    "Você tá jogando ou digitando senha errada do WiFi?",
    "Essa palavra foi criada agora, né? Registro em cartório já.",
    "Calma, não precisa inventar idioma novo.",
    "Eu pedi uma palavra, não um enigma.",
    "Tá tentando me confundir ou se confundir?",
    "Se errar desse jeito fosse esporte, você tava nas Olimpíadas.",
    "Isso aí foi ousadia… mas não foi acerto.",
    "Quase acertou! Só faltou acertar.",
    "Você piscou e digitou?",
    "Essa palavra mora em Nárnia.",
    "Digitou com pressa ou com raiva?",
    "Eu acredito no seu potencial… mas não nessa palavra.",
    "Tá testando minha paciência nível hard?",
    "Respira, jovem gafanhoto.",
    "Essa foi tão errada que eu até ri.",
    "Você desbloqueou o modo criativo sem querer.",
    "Palavra alternativa detectada. Pena que não existe.",
    "Tá querendo trollar o sistema?",
    "Se fosse prova, eu chamava seus pais.",
    "Essa aí passou voando… longe do certo.",
    "Foi estratégia secreta ou só caos mesmo?",
    "Você tá aquecendo os dedos antes de acertar, né?",
    "Essa palavra tá pedindo socorro.",
    "Eu não esperava isso… e olha que eu já vi muita coisa.",
    "Tentativa válida… só não foi válida mesmo.",
    "Você está oficialmente improvisando.",
    "Calma, não é teste de criatividade.",
    "Se insistir assim, eu começo a cobrar taxa de erro.",
    "Palavra misteriosa… até demais.",
    "Você tem talento… pra errar com confiança.",
    "Isso foi ousado. Errado, mas ousado.",
    "A intenção foi boa… eu acho.",
    "Tá jogando no modo aleatório?",
    "Essa palavra veio de qual dimensão?",
    "Você tá tentando desbloquear um final secreto?",
    "Se errar fosse XP, você já tava nível máximo.",
    "Palavra quase invisível… porque não existe.",
    "Eu vi o que você fez aí. Não recomendo.",
    "Tá me desafiando ou se desafiando?",
    "Essa foi criativa. Inútil… mas criativa.",
    "Você digitou e pensou depois, né?",
    "Quer um dicionário de presente?",
    "Tá fazendo speedrun de erro?",
    "Essa aí nem a professora corrigia.",
    "Você consegue… só não assim.",
    "Palavra inédita versão beta.",
    "Foi tentativa ou experimento científico?",
    "Tá achando que eu não sei ler?",
    "Eu sinto que você consegue melhor… bem melhor.",
    "Continua tentando. Uma hora a gente acerta… eu espero."
];
// --- NOVA VARIÁVEL: SACOLA DE FRASES ---
let unusedPhrases = [...funnyPhrases];

/* --- MOBILE MENU LOGIC --- */
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileOverlay = document.getElementById('mobile-overlay');

// MENU DO ALFABETO
const alphabetDrawer = document.getElementById('alphabet-drawer');
const mobileAlphabetBtn = document.getElementById('mobile-alphabet-btn');

function toggleMobileMenu() {
    sidebar.classList.toggle('mobile-open');
    alphabetDrawer.classList.remove('mobile-open'); // Fecha o outro
    checkOverlay();
}

function toggleAlphabetMenu() {
    alphabetDrawer.classList.toggle('mobile-open');
    sidebar.classList.remove('mobile-open'); // Fecha o outro
    checkOverlay();
}

function checkOverlay() {
    if (sidebar.classList.contains('mobile-open') || alphabetDrawer.classList.contains('mobile-open')) {
        mobileOverlay.classList.add('active');
    } else {
        mobileOverlay.classList.remove('active');
    }
}

// Eventos Mobile
if(mobileMenuBtn) mobileMenuBtn.onclick = toggleMobileMenu;
if(mobileAlphabetBtn) mobileAlphabetBtn.onclick = toggleAlphabetMenu;

if(mobileOverlay) {
    mobileOverlay.onclick = () => {
        sidebar.classList.remove('mobile-open');
        alphabetDrawer.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
    }; 
}


function clearAllHighlights() {
    document.querySelectorAll('.rule-card').forEach(card => card.classList.remove('rule-active'));
}

/* NOVO: PREENCHE O SELETOR COM OPÇÕES DISPONÍVEIS */
function populateLengthOptions() {
    // Descobre quais tamanhos de palavra existem no banco de dados
    const lengths = [...new Set(allChallenges.map(c => c.word.length))].sort((a,b) => a-b);
    
    lengths.forEach(len => {
        const option = document.createElement('option');
        option.value = len;
        option.innerText = `${len} Letras`;
        lengthSelector.appendChild(option);
    });
}

function initChallenge() {
    clearAllHighlights();
    animateMage('reset');
    
    // FILTRAGEM PELA ESCOLHA DO USUÁRIO
    const selectedLen = lengthSelector.value;
    let pool = allChallenges;
    
    if (selectedLen !== 'any') {
        pool = allChallenges.filter(c => c.word.length === parseInt(selectedLen));
    }

    if (pool.length === 0) pool = allChallenges; // Fallback se der erro

    // Sorteio
    const randIdx = Math.floor(Math.random() * pool.length);
    targetChallenge = pool[randIdx];
    
    maxWordLength = targetChallenge.word.length;
    currentWord = [];
    replaceIndex = 0;
    
    hintIndex = 0;
    consecutiveErrors = 0;
    chickenAlreadySummoned = false; // "Recarrega" a galinha para o novo desafio
    if (feedbackTimeout) clearTimeout(feedbackTimeout); // Limpa relógio antigo
    
    updateHintDisplay();
    startHintCycle();
    
    feedback.innerText = "";
    meaningBox.innerText = "";
    meaningBox.classList.add('hidden');
    
    // Reseta placeholder
    charInput.placeholder = "?";
    
    render(true); 
}

function updateHintDisplay() {
    if (!targetChallenge) return;
    hintText.classList.remove('fade-in'); hintText.classList.add('fade-out');
    setTimeout(() => {
        hintText.innerText = targetChallenge.hints[hintIndex];
        hintCounter.innerText = `Dica ${hintIndex + 1}/${targetChallenge.hints.length}`;
        hintText.classList.remove('fade-out'); hintText.classList.add('fade-in');
    }, 200);
}

function startHintCycle() {
    if (hintInterval) clearInterval(hintInterval);
    hintInterval = setInterval(() => {
        if (!targetChallenge) return;
        hintIndex++; if (hintIndex >= targetChallenge.hints.length) hintIndex = 0;
        updateHintDisplay();
    }, 5000);
}

// LÓGICA DO BOTÃO PULAR DICA
const skipHintBtn = document.getElementById('skip-hint-btn');
if (skipHintBtn) {
    skipHintBtn.addEventListener('click', () => {
        if (!targetChallenge) return;
        // Avança o índice da dica manualmente
        hintIndex++; 
        if (hintIndex >= targetChallenge.hints.length) hintIndex = 0;
        
        updateHintDisplay();
        
        // Reinicia o timer para dar tempo de ler a nova dica antes de trocar sozinha
        startHintCycle();
    });
}

function stopHintCycle() { if (hintInterval) clearInterval(hintInterval); }

const isVowel = (c) => 'AEIOUaeiou'.includes(c);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
alphabet.forEach((letter, index) => {
    const div = document.createElement('div');
    div.className = 'mini-char'; 
    div.id = `mini-${letter}`; 
    
    // Descobre qual é a letra espelhada baseada na posição (A=0 vira Z=25)
    const mirrored = alphabet[25 - index];
    
    // Insere a letra principal e a pequena
    div.innerHTML = `
        ${letter}
        <span class="mirrored-letter">${mirrored}</span>
    `;
    
    miniAlphabetContainer.appendChild(div);
});

function updateMiniAlphabet() {
    document.querySelectorAll('.mini-char').forEach(el => el.classList.remove('active'));
    currentWord.forEach(char => {
        const el = document.getElementById(`mini-${char.toUpperCase()}`);
        if(el) el.classList.add('active');
    });
}

function shiftAlphabet(char) {
    const code = char.charCodeAt(0);
    const start = char === char.toUpperCase() ? 65 : 97;
    const limit = char === char.toUpperCase() ? 90 : 122;
    let nextCode = code + 1;
    if (nextCode > limit) nextCode = start;
    return String.fromCharCode(nextCode);
}

function mirrorAlphabet(char) {
    const alpha = "abcdefghijklmnopqrstuvwxyz";
    const isUpper = char === char.toUpperCase();
    const idx = alpha.indexOf(char.toLowerCase());
    if (idx === -1) return char;
    const mirrored = alpha[25 - idx];
    return isUpper ? mirrored.toUpperCase() : mirrored;
}

function highlight(id) {
    clearAllHighlights();
    const el = document.getElementById(id);
    if (el) el.classList.add('rule-active');
    animateMage('cast');
}

function render(showTutorial = false) {
    wordGrid.innerHTML = '';
    
    if (isFirstRound && currentWord.length === 0 && showTutorial) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'tutorial-message';
        msgDiv.innerHTML = 'Digite uma letra no campo abaixo onde tem uma interrogação para começar';
        wordGrid.appendChild(msgDiv);
        return;
    }

    currentWord.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'letter-box'; div.innerText = c;
        if (currentWord.length >= maxWordLength && i === replaceIndex) {
            div.classList.add('next-to-change');
        }
        wordGrid.appendChild(div);
    });

    updateMiniAlphabet();
}

// --- LÓGICA DO BOTÃO LIMPAR TABULEIRO --- //
const clearBoardBtn = document.getElementById('clear-board-btn');
let clearConfirmState = false;

if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', () => {
        if (!clearConfirmState) {
            // Primeiro clique - Pede confirmação
            clearBoardBtn.innerText = "CERTEZA?";
            clearBoardBtn.style.background = "var(--error)";
            clearBoardBtn.style.color = "#fff";
            clearConfirmState = true;

            // Reseta o botão após 3 segundos se não clicar novamente
            setTimeout(() => {
                if (clearConfirmState) {
                    resetClearButton();
                }
            }, 3000);
        } else {
            // Segundo clique - Limpa o tabuleiro
            currentWord = [];
            replaceIndex = 0;
            charInput.placeholder = "?";
            render();
            resetClearButton();
            if (typeof playSoundEffect === 'function') playSoundEffect('error'); // Som de apagar
        }
    });
}

function resetClearButton() {
    if (clearBoardBtn) {
        clearBoardBtn.innerText = "LIMPAR";
        clearBoardBtn.style.background = "transparent";
        clearBoardBtn.style.color = "var(--error)";
        clearConfirmState = false;
    }
}

function addChar(char) {
    if (!/^[a-zA-Z]$/.test(char)) return;

    if (isFirstRound) {
        isFirstRound = false; 
        showFloatingMessage("Perfeito");
    }

    // Atualiza placeholder com a letra digitada
    charInput.placeholder = char.toUpperCase();

    historyList.innerHTML += char.toUpperCase() + ' ';
    historyList.scrollTop = historyList.scrollHeight;

    if (currentWord.length >= maxWordLength) {
        // --- NOVO: LIMPA O TABULEIRO QUANDO VOLTA PRO INÍCIO --- //
        playSoundEffect('overwrite');
        
        // Resetamos o array e o índice para começar uma palavra nova "limpa"
        currentWord = [];
        replaceIndex = 0;
        
        // Processa a letra que o usuário acabou de digitar na nova posição 0
        processNewChar(char, 0);

        showFloatingMessage("Ciclo Reiniciado! Tabuleiro limpo.", 2500);

    } else {
        playSoundEffect('type');
        processNewChar(char, currentWord.length);
        
        // AVISO NA PENÚLTIMA LETRA (N-1)
        if (currentWord.length === maxWordLength - 1) {
            showFloatingMessage("Próxima letra é a última! O ciclo vai reiniciar.", 2500);
            playSoundEffect('alert');
        }
        
        if (currentWord.length >= maxWordLength) {
            replaceIndex = 0;
        }
    }
}

function processNewChar(char, indexToInsert) {
    let charToAdd = char.toUpperCase();

    // REGRA 1: Vogal (+1)
    if (indexToInsert > 0 && isVowel(currentWord[indexToInsert - 1])) {
        highlight('rule-vowel'); playSoundEffect('shift');
        charToAdd = shiftAlphabet(charToAdd);
    }
    
    // REGRA 2: Espelhamento
    if (!isVowel(charToAdd) && indexToInsert > 0 && currentWord.length > 0) {
        highlight('rule-consonant'); playSoundEffect('mirror');
        currentWord[indexToInsert - 1] = mirrorAlphabet(currentWord[indexToInsert - 1]);
    }

    currentWord.splice(indexToInsert, 0, charToAdd);

    // REGRA 3: Sanduíche
    const firstIdx = currentWord.indexOf(charToAdd);
    const lastIdxFound = currentWord.lastIndexOf(charToAdd);
    
    if (firstIdx !== -1 && lastIdxFound !== -1 && firstIdx !== lastIdxFound) {
            const start = firstIdx + 1;
            const end = lastIdxFound;
            if (end > start) {
                highlight('rule-repeat'); playSoundEffect('reverse');
                const mid = currentWord.slice(start, end).reverse();
                currentWord.splice(start, mid.length, ...mid);
            }
    }
    
    render();
}

async function validate() {
    const word = currentWord.join('').toUpperCase();
    if (word.length < 2) return;
    
    feedback.innerText = "Verificando...";
    
    if (targetChallenge && word === targetChallenge.word) {
        feedback.innerText = "🏆 ACERTOU!"; feedback.style.color = "var(--success)";
        meaningBox.innerText = targetChallenge.meaning;
        meaningBox.classList.remove('hidden');
        document.body.classList.add('success-flash');
        
        successSound.play(); playSoundEffect('victory'); triggerConfetti();
        animateMage('win');
        
        stopHintCycle(); clearAllHighlights();
        
        setTimeout(() => {
            document.body.classList.remove('success-flash');
            initChallenge();
            feedback.innerText = "Novo desafio iniciado!";
            
            if (feedbackTimeout) clearTimeout(feedbackTimeout);
            feedbackTimeout = setTimeout(() => { feedback.innerText = ""; }, 2000); 
            
        }, 5000);
        return;
    }

    try {
        const res = await fetch(`https://api.dicionario-aberto.net/word/${word.toLowerCase()}`);
        const data = await res.json();
        
        if (data.length > 0) {
            feedback.innerText = "⚠️ Palavra existe, mas não é a do desafio."; 
            feedback.style.color = "var(--warning)";
            animateMage('reset');
            consecutiveErrors = 0; // Zera o contador se chutar uma palavra real
        } else {
            // ---- LÓGICA DA GALINHA REVISADA ----
            consecutiveErrors++;
            
            // Se a sacola esvaziar, enche ela de novo com as 70 frases!
            if (unusedPhrases.length === 0) {
                unusedPhrases = [...funnyPhrases];
            }
            
            // Sorteia uma frase das que sobraram e tira ela da sacola (splice)
            const randomPhraseIndex = Math.floor(Math.random() * unusedPhrases.length);
            const randomPhrase = unusedPhrases.splice(randomPhraseIndex, 1)[0];
            
            // Exibe a mensagem original + a frase engraçada menorzinha embaixo
            feedback.innerHTML = `❌ Tente novamente<br><span style="font-size: 0.9rem; font-weight: normal; color: var(--text-dim);">${randomPhrase}</span>`; 
            feedback.style.color = "var(--error)";
            
            document.body.classList.add('error-flash'); 
            setTimeout(() => document.body.classList.remove('error-flash'), 500); // Remove o piscar vermelho
            
            // Invoca a galinha apenas se for o 3º erro E se ela ainda não tiver aparecido neste desafio
            if (consecutiveErrors >= 3 && chickenAlreadySummoned === false) {
                chickenAlreadySummoned = true; // Marca que ela já apareceu neste desafio
                
                // Toca o SEU som de galinha local
                const chickenAudio = new Audio('galinha.mp3');
                chickenAudio.volume = 1.0; 
                chickenAudio.play().catch(e => console.log("Erro no áudio:", e));    
                
                const chickenEl = document.createElement('div');
                chickenEl.innerText = '🐔'; // A galinha!
                chickenEl.className = 'flying-chicken';
                document.body.appendChild(chickenEl);
                
                // Remove a galinha do HTML depois de 3 segundos
                setTimeout(() => chickenEl.remove(), 3000);
                
            } else {
                playSoundEffect('error');
                animateMage('sad');
            }
            // ---- FIM DA LÓGICA ----
        }
    } catch { 
        feedback.innerText = "Erro na API"; 
    }

    // --- CONTROLE DE TEMPO DAS FRASES (5 SEGUNDOS) ---
    if (feedbackTimeout) clearTimeout(feedbackTimeout); // Cancela o timer anterior
    
    feedbackTimeout = setTimeout(() => { 
        document.body.classList.remove('success-flash', 'error-flash'); 
        if(!feedback.innerText.includes("Novo") && !feedback.innerText.includes("ACERTOU")) {
            feedback.innerText = ""; 
        }
    }, 5000); // 5000 = 5 segundos
}

charInput.addEventListener('input', (e) => { 
    if(e.target.value) { addChar(e.target.value); e.target.value = ''; }
});
validateBtn.addEventListener('click', validate);

// BOTÃO LIMPAR HISTÓRICO - RESTAURADO A LÓGICA ORIGINAL
document.getElementById('clear-history').onclick = () => { 
    historyList.innerHTML = ''; 
    clearAllHighlights(); 
};

/* --- TOGGLE SIDEBAR (DESKTOP) --- */
const toggleBtn = document.getElementById('toggle-sidebar-btn');
if(toggleBtn) {
    toggleBtn.onclick = () => {
        sidebar.classList.toggle('collapsed');
        // Alterna seta
        if (sidebar.classList.contains('collapsed')) {
            toggleBtn.innerText = "▶";
        } else {
            toggleBtn.innerText = "◀";
        }
    };
}


const isMobileViewport = () => window.matchMedia('(max-width: 800px)').matches;

document.body.onclick = (e) => { 
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isMobileViewport()) return; // Evita abrir teclado a cada toque fora do input no celular
    // Ajuste para não roubar foco se clicar no sidebar mobile
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.classList.contains('letter-box') && !sidebar.contains(e.target) && !alphabetDrawer.contains(e.target)) {
        charInput.focus(); 
    }
};

/* --- MAGE LOGIC (CSS CUSTOM) --- */
const mageEl = document.getElementById('mage-character');
const mageEffect = document.querySelector('.mage-effect');

function startMageIdle() {
    // Idle state handled by CSS
}

function animateMage(action) {
    mageEl.className = 'pixel-mage'; // Reset
    mageEffect.classList.remove('active');

    if (action === 'cast') {
        mageEl.classList.add('cast');
        setTimeout(() => mageEl.classList.remove('cast'), 600);
    } 
    else if (action === 'win') {
        mageEl.classList.add('win');
        mageEffect.classList.add('active');
    } 
    else if (action === 'sad') {
        mageEl.classList.add('sad');
    }
}

/* --- ÁUDIO --- */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSoundEffect(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    const now = audioCtx.currentTime;

    if (type === 'type') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = audioCtx.createOscillator(); const gainV = audioCtx.createGain();
            oscV.type = 'triangle'; oscV.frequency.setValueAtTime(freq, now + i*0.1);
            oscV.connect(gainV); gainV.connect(audioCtx.destination);
            gainV.gain.setValueAtTime(0, now + i*0.1); gainV.gain.linearRampToValueAtTime(0.2, now + i*0.1 + 0.05);
            gainV.gain.exponentialRampToValueAtTime(0.01, now + i*0.1 + 0.6);
            oscV.start(now + i*0.1); oscV.stop(now + i*0.1 + 0.6);
        });
    } else if (type === 'mirror') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'shift') {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(600, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'reverse') {
        osc.type = 'square'; osc.frequency.setValueAtTime(200, now); osc.frequency.linearRampToValueAtTime(800, now + 0.2); osc.frequency.linearRampToValueAtTime(200, now + 0.4);
        gainNode.gain.setValueAtTime(0.05, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
        osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'error') {
        osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, now); osc.frequency.linearRampToValueAtTime(50, now + 0.3);
        gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'overwrite') {
        osc.type = 'square'; osc.frequency.setValueAtTime(600, now); osc.frequency.linearRampToValueAtTime(200, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'alert') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(440, now); 
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now); osc.stop(now + 0.5);
    }
}

function triggerConfetti() {
    const colors = ['#bb86fc', '#03dac6', '#cf6679', '#ffffff', '#ffb74d'];
    for (let i = 0; i < 150; i++) {
        const conf = document.createElement('div');
        conf.classList.add('confetti');
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.animationDuration = (Math.random() * 3 + 2) + 's';
        conf.style.width = (Math.random() * 10 + 5) + 'px';
        conf.style.height = conf.style.width;
        setTimeout(() => { document.body.appendChild(conf); }, Math.random() * 500);
        setTimeout(() => { conf.remove(); }, 5000);
    }
}

/* --- UTILITÁRIOS --- */
function toggleSection(contentId, headerEl) {
    const content = document.getElementById(contentId);
    content.classList.toggle('hidden');
}
function toggleNotepad() {
    const body = document.querySelector('.notepad-body');
    body.classList.toggle('minimized');
}
function toggleAlphabet() {
    document.getElementById('mini-alphabet').classList.toggle('hidden');
}

function showFloatingMessage(text, duration = 2000) {
    const msg = document.getElementById('floating-msg');
    msg.innerText = text;
    msg.classList.remove('hidden');
    setTimeout(() => { msg.classList.add('hidden'); }, duration);
}

/* --- INICIALIZAÇÃO --- */
document.addEventListener("DOMContentLoaded", () => {
    // Detecta mobile (apenas para logs ou classes extras se precisar)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;
    if (isMobile) {
        document.body.classList.add('mobile-mode');
    }
    
    // NOVO: Preenche as opções de dificuldade
    populateLengthOptions();

    startMageIdle();
    // initChallenge é chamado apenas quando clica em START agora
});

// LÓGICA DO BOTÃO DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    // Some com o modal
    document.getElementById('welcome-screen').style.display = 'none';
    // Mostra o jogo
    document.getElementById('app-container').classList.remove('hidden-app');
    
    // Inicia o jogo agora com a dificuldade selecionada
    initChallenge();

    if (audioCtx.state === 'suspended') audioCtx.resume();
};
/* ================= HUB CONTROLE ================= */

const hub = document.getElementById("main-hub");
const hubPlay = document.getElementById("hub-play");
const welcomeScreen = document.getElementById("welcome-screen");

hubPlay.addEventListener("click", () => {
    hub.style.display = "none";
    welcomeScreen.style.display = "flex";
});

// Botões futuros
document.getElementById("hub-profile").addEventListener("click", () => {
    alert("Sistema de Perfil em construção 🔮");
});

document.getElementById("hub-tournaments").addEventListener("click", () => {
    alert("Torneios em breve 🏆");
});

document.getElementById("hub-ranking").addEventListener("click", () => {
    alert("Ranking global em breve 📊");
});
/* --- LÓGICA DO SELETOR DE MODO DE JOGO --- */
document.addEventListener("DOMContentLoaded", () => {
    const modeSelector = document.getElementById('mode-selector');
    const modeWarning = document.getElementById('mode-warning');

    if (modeSelector) {
        modeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;

            // Se o modo escolhido NÃO for 'solo'
            if (selectedMode !== 'solo') {
                // Toca som de erro (se o contexto de áudio estiver ativo)
                if (typeof playSoundEffect === 'function') {
                    playSoundEffect('error');
                    // Tenta animar o mago para 'triste' se ele estiver visível
                    if (typeof animateMage === 'function') animateMage('sad');
                }

                // Mostra a mensagem de aviso
                modeWarning.style.display = 'block';
                modeWarning.classList.add('popIn'); // Reusa sua animação de popIn

                // Reseta o seletor para "Solo" automaticamente
                e.target.value = 'solo';

                // Esconde a mensagem após 3 segundos
                setTimeout(() => {
                    modeWarning.style.display = 'none';
                }, 3000);
            } else {
                // Se selecionar Solo, garante que o aviso suma
                modeWarning.style.display = 'none';
            }
        });
    }
});