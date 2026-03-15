import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    increment
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js';
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

function sanitizeGameText(value) {
    if (typeof value !== 'string') return value;
    let text = value;

    const mojibakeCount = (str) => (str.match(/[ÃÂÔ�]/g) || []).length;
    const decodeLatin1Utf8 = (str) => {
        try {
            return decodeURIComponent(escape(str));
        } catch {
            return str;
        }
    };

    if (/[ÃÂÔ�]/.test(text)) {
        const first = decodeLatin1Utf8(text);
        if (mojibakeCount(first) <= mojibakeCount(text)) text = first;

        const second = decodeLatin1Utf8(text);
        if (mojibakeCount(second) < mojibakeCount(text)) text = second;
    }

    const fixes = [
        ['FaÃ§a', 'Faça'],
        ['VocÃª', 'Você'],
        ['nÃ£o', 'não'],
        ['interrogaÃ§Ã£o', 'interrogação'],
        ['comeÃ§ar', 'começar'],
        ['TÃ©rmino', 'Término'],
        ['satelite', 'satélite'],
        ['interroga??o', 'interrogação'],
        ['come?ar', 'começar'],
        ['T??rmino', 'Término'],
        ['T?rmino', 'Término'],
        ['nao e um teclado musical', 'não é um teclado musical'],
        ['Nao e um teclado musical', 'Não é um teclado musical']
    ];

    for (const [bad, good] of fixes) {
        text = text.split(bad).join(good);
    }

    // Corrige variações quebradas vistas no mobile/desktop.
    text = text.replace(/\bT[^A-Za-zÀ-ÖØ-öø-ÿ]{0,24}rmino\.?/giu, 'Término.');
    text = text.replace(/\bT\S{0,18}rmino\.?/giu, 'Término.');
    text = text.replace(/interroga\?+o/giu, 'interrogação');
    text = text.replace(/come\?+ar/giu, 'começar');
    text = text.replace(/interroga[^A-Za-zÀ-ÖØ-öø-ÿ]{0,20}o/giu, 'interrogação');
    text = text.replace(/come[^A-Za-zÀ-ÖØ-öø-ÿ]{0,14}ar/giu, 'começar');
    text = text.replace(/sat[^A-Za-zÀ-ÖØ-öø-ÿ]{0,10}lite/giu, 'satélite');
    text = text.replace(/n[^A-Za-zÀ-ÖØ-öø-ÿ]{0,3}o e um teclado musical/giu, 'não é um teclado musical');

    text = text.replace(/�+/g, '');
    text = text.replace(/Ô¿½/g, '');
    text = text.replace(/\?{2,}/g, '?');
    text = text.replace(/[^\S\r\n]{2,}/g, ' ');
    text = text.replace(/\s{2,}/g, ' ').trim();
    return text;
}


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

// --- VARIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂVEIS DA GALINHA E MENSAGENS ---
let consecutiveErrors = 0;
let chickenAlreadySummoned = false; // Trava para a galinha voar sÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³ 1 vez
let feedbackTimeout = null; // Trava para a mensagem durar exatos 6 segundos

const funnyPhrases = [
    "Que isso, você está inventando palavra nova?",
    "Essa nem o dicionário reconhece.",
    "Calma, respira... não é um teclado musical.",
    "Quase! Só faltou acertar.",
    "Essa passou longe, mas você chega lá.",
    "Se errar valesse ponto, você estava liderando.",
    "Foi ousado. Errado, mas ousado.",
    "Essa palavra veio de outra dimensão.",
    "Bora de novo, agora vai.",
    "Você consegue, só ajusta a estratégia."
];
for (let i = 0; i < funnyPhrases.length; i++) {
    funnyPhrases[i] = sanitizeGameText(funnyPhrases[i]);
}
// --- NOVA VARIÃƒÆ’Ã†â€™Ãƒâ€šÃ‚ÂVEL: SACOLA DE FRASES ---
let unusedPhrases = [...funnyPhrases];

/* --- MOBILE MENU LOGIC --- */
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileOverlay = document.getElementById('mobile-overlay');

// MENU DO ALFABETO
const alphabetDrawer = document.getElementById('alphabet-drawer');
const mobileAlphabetBtn = document.getElementById('mobile-alphabet-btn');
const mobileRulesSlot = document.getElementById('mobile-rules-slot');
const mobileToolsSlot = document.getElementById('mobile-tools-slot');
const mobileVictoryModal = document.getElementById('mobile-victory-modal');
const mobileErrorModal = document.getElementById('mobile-error-modal');
const mobileErrorPhraseEl = document.getElementById('mobile-error-phrase');
let mobileLayoutPrepared = false;

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

function closeMobilePanels() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (alphabetDrawer) alphabetDrawer.classList.remove('mobile-open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
}

function setMobileGameplayMenuVisibility(visible) {
    const canUseMobileUi = isMobileViewport() && !!mobileMenuBtn;
    document.body.classList.toggle('mobile-gameplay-active', canUseMobileUi && !!visible);

    if (!canUseMobileUi) return;
    if (visible) {
        mobileMenuBtn.classList.remove('hidden-control');
    } else {
        mobileMenuBtn.classList.add('hidden-control');
        closeMobilePanels();
    }
}

// Eventos Mobile
if(mobileMenuBtn) mobileMenuBtn.onclick = toggleMobileMenu;
if(mobileAlphabetBtn) mobileAlphabetBtn.onclick = toggleAlphabetMenu;

if(mobileOverlay) {
    mobileOverlay.onclick = () => {
        closeMobilePanels();
    }; 
}


function clearAllHighlights() {
    document.querySelectorAll('.rule-card').forEach(card => card.classList.remove('rule-active'));
}

/* NOVO: PREENCHE O SELETOR COM OPÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ES DISPONÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂVEIS */
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

    currentGameMode = NORMAL_MODE;
    resetDailySession();
    clearAllHighlights();
    animateMage('reset');
    
    // FILTRAGEM PELA ESCOLHA DO USUARIO
    const selectedLen = lengthSelector.value;
    let pool = allChallenges;
    
    if (selectedLen !== 'any') {
        pool = allChallenges.filter(c => c.word.length === parseInt(selectedLen));
    }

    if (pool.length === 0) pool = allChallenges; // Fallback se der erro

    // Sorteio
    const randIdx = Math.floor(Math.random() * pool.length);
    targetChallenge = pool[randIdx];

    startChallengeEngine(targetChallenge, {
        wordLength: targetChallenge.word.length,
        resetHistory: false
    });
}

function startChallengeEngine(challengeData, options = {}) {
    targetChallenge = challengeData;
    maxWordLength = options.wordLength || challengeData?.word?.length || 3;
    currentWord = [];
    replaceIndex = 0;
    hintIndex = 0;
    consecutiveErrors = 0;
    chickenAlreadySummoned = false;
    if (feedbackTimeout) clearTimeout(feedbackTimeout);

    feedback.innerText = "";
    meaningBox.innerText = "";
    meaningBox.classList.add('hidden');
    charInput.placeholder = "?";

    if (options.resetHistory && historyList) {
        historyList.innerHTML = '';
    }

    updateHintDisplay();
    startHintCycle();
    render(true);
    saveGameSessionState();
}

function updateHintDisplay() {
    if (!targetChallenge) return;
    const hints = targetChallenge.hints || [];
    const totalHints = currentGameMode === DAILY_MODE ? 5 : (hints.length || 5);

    if (currentGameMode === DAILY_MODE && dailySession) {
        const unlocked = dailySession.unlockedHints || 3;
        const maxIndex = Math.max(0, unlocked - 1);
        if (hintIndex > maxIndex) hintIndex = maxIndex;
        if (skipHintBtn) {
            skipHintBtn.innerText = unlocked < 5 && hintIndex >= maxIndex
                ? 'Desbloquear Dica >'
                : 'Pular Dica >';
        }
        hintCounter.innerText = `Dica ${Math.min(hintIndex + 1, unlocked)}/${totalHints}`;
    } else {
        if (skipHintBtn) skipHintBtn.innerText = 'Pular Dica >';
        hintCounter.innerText = `Dica ${hintIndex + 1}/${totalHints}`;
    }

    hintText.classList.remove('fade-in');
    hintText.classList.add('fade-out');
    setTimeout(() => {
        hintText.innerText = sanitizeGameText(hints[hintIndex] || '...');
        hintText.classList.remove('fade-out');
        hintText.classList.add('fade-in');
    }, 200);
}
function startHintCycle() {
    if (hintInterval) clearInterval(hintInterval);
    hintInterval = setInterval(() => {
        if (!targetChallenge) return;

        if (currentGameMode === DAILY_MODE && dailySession) {
            const unlocked = dailySession.unlockedHints || 3;
            hintIndex++;
            if (hintIndex >= unlocked) hintIndex = 0;
            updateHintDisplay();
            return;
        }

        hintIndex++;
        if (hintIndex >= targetChallenge.hints.length) hintIndex = 0;
        updateHintDisplay();
    }, 5000);
}
// LOGICA DO BOTAO PULAR DICA
const skipHintBtn = document.getElementById('skip-hint-btn');
if (skipHintBtn) {
    skipHintBtn.addEventListener('click', async () => {
        if (!targetChallenge) return;

        if (currentGameMode === DAILY_MODE && dailySession) {
            const unlocked = dailySession.unlockedHints || 3;
            const maxIdx = Math.max(0, unlocked - 1);

            if (hintIndex < maxIdx) {
                hintIndex++;
                updateHintDisplay();
                startHintCycle();
                return;
            }

            if (unlocked < 5) {
                await unlockNextDailyHint();
                return;
            }

            hintIndex = 0;
            updateHintDisplay();
            startHintCycle();
            return;
        }

        hintIndex++;
        if (hintIndex >= targetChallenge.hints.length) hintIndex = 0;
        updateHintDisplay();
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
    
    // Descobre qual ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© a letra espelhada baseada na posiÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o (A=0 vira Z=25)
    const mirrored = alphabet[25 - index];
    
    // Insere a letra principal e a pequena
    div.innerHTML = `
        ${letter}
        <span class="mirrored-letter">${mirrored}</span>
    `;
    
    div.setAttribute('data-letter', letter);
    div.setAttribute('role', 'button');
    div.addEventListener('click', () => {
        if (!isMobileViewport()) return;
        addChar(letter);
        if (charInput) charInput.blur();
    });

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
        msgDiv.innerHTML = sanitizeGameText('Digite uma letra no campo abaixo onde tem uma interrogação para começar');
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

// --- LOGICA DO BOTAO LIMPAR TABULEIRO --- //
const clearBoardBtn = document.getElementById('clear-board-btn');
let clearConfirmState = false;

if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', () => {
        if (!clearConfirmState) {
            // Primeiro clique - Pede confirmaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o
            clearBoardBtn.innerText = "CERTEZA?";
            clearBoardBtn.style.background = "var(--error)";
            clearBoardBtn.style.color = "#fff";
            clearConfirmState = true;

            // Reseta o botÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o apÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³s 3 segundos se nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o clicar novamente
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
            saveGameSessionState();
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
        // --- NOVO: LIMPA O TABULEIRO QUANDO VOLTA PRO INÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂCIO --- //
        playSoundEffect('overwrite');
        
        // Resetamos o array e o ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ndice para comeÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ar uma palavra nova "limpa"
        currentWord = [];
        replaceIndex = 0;
        
        // Processa a letra que o usuÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡rio acabou de digitar na nova posiÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o 0
        processNewChar(char, 0);

        showFloatingMessage("Ciclo Reiniciado! Tabuleiro limpo.", 2500);

    } else {
        playSoundEffect('type');
        processNewChar(char, currentWord.length);
        
        // AVISO NA PENÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡LTIMA LETRA (N-1)
        if (currentWord.length === maxWordLength - 1) {
            showFloatingMessage("Pr\u00f3xima letra \u00e9 a \u00faltima! O ciclo vai reiniciar.", 2500);
            playSoundEffect('alert');
        }
        
        if (currentWord.length >= maxWordLength) {
            replaceIndex = 0;
        }
    }
    saveGameSessionState();
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

    render();
}


async function validate() {
    const word = currentWord.join('').toUpperCase();
    if (word.length < 2) return;

    feedback.innerText = "Verificando...";

    if (currentGameMode === DAILY_MODE && dailySession) {
        try {
            const data = await callDailyFunction('submitDailyGuess', { guess: word });

            if (data?.alreadyCompleted) {
                feedback.innerText = 'Palavra do Dia j\u00E1 conclu\u00EDda hoje.';
                feedback.style.color = 'var(--warning)';
                startDailyHubCountdown();
                return;
            }

            if (!data?.success) {
                dailySession.attempts = data?.attempts || ((dailySession.attempts || 0) + 1);
                setDailyAttempts(dailySession.attempts);
                feedback.innerText = '';
                animateMage('sad');
                const dailyFunnyPhrase = takeFunnyPhrase();
                showErrorMageFeedback(dailyFunnyPhrase);
                return;
            }

            dailySession.attempts = data.attempts || dailySession.attempts;
            setDailyAttempts(dailySession.attempts);
            stopDailyTimer();
            if (typeof data.elapsedMs === 'number') {
                dailySession.baseElapsedMs = data.elapsedMs;
                updateDailyTimerUi();
            }

            feedback.innerText = '\u{1F3C6} ACERTOU A PALAVRA DO DIA!';
            feedback.style.color = 'var(--success)';
            meaningBox.innerText = data.meaning || '';
            meaningBox.classList.remove('hidden');
            animateMage('win');
            triggerConfetti();
            showMobileVictoryPopup();

            dailyShareText = buildDailyShareText(data || {});
            openDailyResultModal(data);
            startDailyHubCountdown();
            return;
        } catch (err) {
            feedback.innerText = 'Erro ao validar Palavra do Dia.';
            feedback.style.color = 'var(--error)';
            const info = normalizeCallableError(err);
            console.error('submitDailyGuess erro', info);
            feedback.innerText = `Erro Palavra do Dia (${info.code}).`; 
            return;
        }
    }

    if (targetChallenge && word === targetChallenge.word) {
        feedback.innerText = "\u{1F3C6} ACERTOU!"; feedback.style.color = "var(--success)";
        meaningBox.innerText = sanitizeGameText(targetChallenge.meaning);
        meaningBox.classList.remove('hidden');
        document.body.classList.add('success-flash');
        handleCorrectAnswer();

        successSound.play(); playSoundEffect('victory'); triggerConfetti();
        animateMage('win');
        showMobileVictoryPopup();

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
        const dictUrl = `https://api.dicionario-aberto.net/word/${word.toLowerCase()}`;
        const res = await fetch(dictUrl, {
            headers: {
                Accept: 'application/json, text/plain, */*'
            }
        });
        const rawBody = await res.text();
        const contentType = res.headers.get('content-type') || '';

        console.debug('[MagicLexis][Validar] resposta dicionario', {
            url: dictUrl,
            status: res.status,
            ok: res.ok,
            contentType,
            preview: rawBody.slice(0, 220)
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        let parsedData = null;
        const trimmedBody = rawBody.trim();
        if (trimmedBody) {
            try {
                parsedData = JSON.parse(trimmedBody);
            } catch (parseError) {
                console.warn('[MagicLexis][Validar] resposta nao-JSON com HTTP 200; tratando como palavra inexistente.', parseError);
            }
        }

        const dictionaryHasWord = Array.isArray(parsedData)
            ? parsedData.length > 0
            : !!(parsedData && typeof parsedData === 'object' && Object.keys(parsedData).length > 0);

        consecutiveErrors++;

        if (dictionaryHasWord) {
            feedback.innerText = "";

            animateMage('reset');
            const randomPhrase = takeFunnyPhrase();
            showErrorMageFeedback(randomPhrase);
        } else {
            const randomPhrase = takeFunnyPhrase();
            showErrorMageFeedback(randomPhrase);

            feedback.innerText = "";

            document.body.classList.add('error-flash');
            setTimeout(() => document.body.classList.remove('error-flash'), 500);
        }

        if (consecutiveErrors >= 3 && chickenAlreadySummoned === false) {
            chickenAlreadySummoned = true;

            const chickenAudio = new Audio('galinha.mp3');
            chickenAudio.volume = 1.0;
            chickenAudio.play().catch(e => console.log("Erro no \u00e1udio:", e));

            const chickenEl = document.createElement('div');
            chickenEl.innerText = '\uD83D\uDC14';
            chickenEl.className = 'flying-chicken';
            document.body.appendChild(chickenEl);

            setTimeout(() => chickenEl.remove(), 3000);

        } else {
            playSoundEffect('error');
            animateMage('sad');
        }
    } catch (apiError) {
        console.error('[MagicLexis][Validar] falha real de requisicao da API do dicionario.', apiError);
        feedback.innerText = "Erro na API";
    }

    if (feedbackTimeout) clearTimeout(feedbackTimeout);

    feedbackTimeout = setTimeout(() => {
        document.body.classList.remove('success-flash', 'error-flash');
        if(!feedback.innerText.includes("Novo") && !feedback.innerText.includes("ACERTOU")) {
            feedback.innerText = "";
        }
    }, 5000);
}
charInput.addEventListener('input', (e) => { 
    if(e.target.value) { addChar(e.target.value); e.target.value = ''; }
});
validateBtn.addEventListener('click', validate);

// BOTAO LIMPAR HISTORICO - RESTAURADO A LOGICA ORIGINAL
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
            toggleBtn.innerText = '\u25B6';
        } else {
            toggleBtn.innerText = '\u25C0';
        }
    };
}
const isMobileViewport = () => window.matchMedia('(max-width: 800px)').matches;

document.body.onclick = (e) => { 
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isMobileViewport()) return; // Evita abrir teclado a cada toque fora do input no celular
    // Ajuste para nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o roubar foco se clicar no sidebar mobile
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

/* --- ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂUDIO --- */
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

/* --- UTILITÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂRIOS --- */
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
window.toggleSection = toggleSection;
window.toggleNotepad = toggleNotepad;

function showFloatingMessage(text, duration = 2000) {
    const msg = document.getElementById('floating-msg');
    msg.innerText = sanitizeGameText(text);
    msg.classList.remove('hidden');
    setTimeout(() => { msg.classList.add('hidden'); }, duration);
}

function buildMobilePanel(titleText) {
    const panel = document.createElement('div');
    panel.className = 'mobile-panel';
    const header = document.createElement('div');
    header.className = 'mobile-panel-title';
    header.innerText = titleText;
    const body = document.createElement('div');
    body.className = 'mobile-panel-body';
    panel.appendChild(header);
    panel.appendChild(body);
    return { panel, body };
}

function setupMobileLayout() {
    if (!isMobileViewport() || mobileLayoutPrepared) return;
    mobileLayoutPrepared = true;

    const sidebarContent = sidebar ? sidebar.querySelector('.sidebar-content') : null;
    const collapsibleSections = sidebar ? sidebar.querySelectorAll('.collapsible-section') : [];
    const rulesSection = collapsibleSections[0] || null;
    const historySection = collapsibleSections[1] || null;
    const notepadEl = document.getElementById('notepad');
    const rulesContentEl = document.getElementById('rules-content');
    const historyContentEl = document.getElementById('history-content');

    if (rulesContentEl) rulesContentEl.classList.remove('hidden');
    if (historyContentEl) historyContentEl.classList.remove('hidden');

    if (mobileRulesSlot) {
        mobileRulesSlot.classList.remove('hidden-control');
        const rulesPanel = buildMobilePanel('Regras M\u00E1gicas');
        if (rulesSection) rulesPanel.body.appendChild(rulesSection);
        mobileRulesSlot.appendChild(rulesPanel.panel);
    }

    if (mobileToolsSlot) {
        mobileToolsSlot.classList.add('hidden-control');
    }

    if (notepadEl && mobileRulesSlot && mobileRulesSlot.parentNode) {
        mobileRulesSlot.parentNode.insertBefore(notepadEl, mobileRulesSlot);
        notepadEl.classList.remove('mobile-notepad-in-sidebar');
    }

    if (sidebarContent && historySection) {
        sidebarContent.appendChild(historySection);
    }

    setMobileGameplayMenuVisibility(false);
    if (mobileAlphabetBtn) mobileAlphabetBtn.classList.add('hidden-control');

    if (charInput) {
        charInput.setAttribute('readonly', 'readonly');
        charInput.setAttribute('inputmode', 'none');
        charInput.setAttribute('tabindex', '-1');
        charInput.blur();
    }
}

function showMobileVictoryPopup() {
    if (!isMobileViewport() || !mobileVictoryModal) return;
    mobileVictoryModal.classList.remove('hidden-control');
    setTimeout(() => {
        mobileVictoryModal.classList.add('hidden-control');
    }, 2300);
}

function takeFunnyPhrase() {
    if (unusedPhrases.length === 0) {
        unusedPhrases = [...funnyPhrases];
    }
    const randomPhraseIndex = Math.floor(Math.random() * unusedPhrases.length);
    return unusedPhrases.splice(randomPhraseIndex, 1)[0];
}

function showMobileErrorMagePopup(message = '') {
    if (!isMobileViewport() || !mobileErrorModal) return;
    if (mobileErrorPhraseEl) {
        mobileErrorPhraseEl.innerText = sanitizeGameText(message || '');
    }
    mobileErrorModal.classList.remove('hidden-control');
    setTimeout(() => {
        mobileErrorModal.classList.add('hidden-control');
    }, 3000);
}

function showErrorMageFeedback(message = '') {
    if (isMobileViewport()) {
        showMobileErrorMagePopup(message);
        return;
    }
    // Desktop fallback: mantem as frases engracadas visiveis mesmo sem popup mobile.
    feedback.innerHTML = `\u274c Tente novamente<br><span style="font-size: 0.9rem; font-weight: normal; color: var(--text-dim);">${sanitizeGameText(message || "")}</span>`;
    feedback.style.color = "var(--error)";
}

let tutorialPageIndex = 0;
let tutorialPageCount = 0;

function initBookTutorial() {
    const welcome = document.getElementById('welcome-screen');
    const track = document.getElementById('book-pages-track');
    const leftArrow = document.getElementById('book-arrow-left');
    const rightArrow = document.getElementById('book-arrow-right');
    const indicator = document.getElementById('tutorial-page-indicator');
    const skipBtn = document.getElementById('tutorial-skip-btn');

    if (!welcome || !track || !leftArrow || !rightArrow || !indicator || !skipBtn) return;

    const pages = Array.from(track.querySelectorAll('.book-page'));
    tutorialPageCount = pages.length;
    tutorialPageIndex = 0;

    const updatePage = () => {
        const safeIndex = Math.max(0, Math.min(tutorialPageIndex, tutorialPageCount - 1));
        tutorialPageIndex = safeIndex;
        track.style.transform = `translateX(-${safeIndex * 100}%)`;
        indicator.textContent = `P\u00e1gina ${safeIndex + 1} de ${tutorialPageCount}`;
        leftArrow.disabled = safeIndex === 0;
        rightArrow.disabled = safeIndex === tutorialPageCount - 1;
    };

    const goToPage = (pageIndex) => {
        tutorialPageIndex = pageIndex;
        updatePage();
    };

    const nextPage = () => {
        if (tutorialPageIndex < tutorialPageCount - 1) {
            tutorialPageIndex += 1;
            updatePage();
        }
    };

    const previousPage = () => {
        if (tutorialPageIndex > 0) {
            tutorialPageIndex -= 1;
            updatePage();
        }
    };

    leftArrow.addEventListener('click', previousPage);
    rightArrow.addEventListener('click', nextPage);

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].clientX;
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) < 40) return;
        if (delta > 0) nextPage();
        else previousPage();
    }, { passive: true });

    document.addEventListener('keydown', (event) => {
        const welcomeVisible = window.getComputedStyle(welcome).display !== 'none';
        if (!welcomeVisible) return;

        const focusedTag = document.activeElement ? document.activeElement.tagName : '';
        if (focusedTag === 'INPUT' || focusedTag === 'SELECT' || focusedTag === 'TEXTAREA') return;

        if (event.key === 'ArrowRight') {
            event.preventDefault();
            nextPage();
        }

        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            previousPage();
        }
    });


    skipBtn.addEventListener('click', () => goToPage(tutorialPageCount - 1));

    bookTutorialApi = {
        goToPage,
        goToFirstPage: () => goToPage(0),
        goToLastPage: () => goToPage(tutorialPageCount - 1)
    };
    updatePage();
}
/* --- INICIALIZACAO --- */
document.addEventListener("DOMContentLoaded", () => {
    // Detecta mobile (apenas para logs ou classes extras se precisar)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;
    if (isMobile) {
        document.body.classList.add('mobile-mode');
    }
    
    // NOVO: Preenche as opÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes de desafio
    populateLengthOptions();

    if (lengthSelector.querySelector('option[value="3"]')) {
        lengthSelector.value = '3';
    }
    setupMobileLayout();
    initBookTutorial();

    startMageIdle();
    // initChallenge ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© chamado apenas quando clica em START agora
});

// LOGICA DO BOTAO DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    markTutorialSeen();
    // Some com o modal
    document.getElementById('welcome-screen').style.display = 'none';
    // Mostra o jogo
    document.getElementById('app-container').classList.remove('hidden-app');
    
    // Inicia o jogo agora com o desafio selecionado
    initChallenge();

    if (audioCtx.state === 'suspended') audioCtx.resume();
    syncTopUserUi(activeUser, activeUserDoc);
};
/* ================= HUB CONTROLE ================= */

const hub = document.getElementById("main-hub");
const hubPlay = document.getElementById("hub-play");
const welcomeScreen = document.getElementById("welcome-screen");

hubPlay.addEventListener("click", () => {
    clearGameSessionState();
    stopHintCycle();
    resetDailySession();
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.classList.add('hidden-app');
    const goToLastPage = hasSeenTutorial();
    openWelcomeTutorial(goToLastPage);
});

// BotÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes futuros
document.getElementById("hub-profile").addEventListener("click", () => {
    openProfileModal();
});

document.getElementById("hub-tournaments").addEventListener("click", () => {
    alert("Torneios em breve 🏆");
});

document.getElementById("hub-ranking").addEventListener("click", () => {
    openRankingModal();
});
/* --- LÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦ÃƒÂ¢Ã¢â€šÂ¬Ã…â€œGICA DO SELETOR DE MODO DE JOGO --- */
document.addEventListener("DOMContentLoaded", () => {
    const modeSelector = document.getElementById('mode-selector');
    const modeWarning = document.getElementById('mode-warning');

    if (modeSelector) {
        modeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;

            // Se o modo escolhido NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢O for 'solo'
            if (selectedMode !== 'solo') {
                // Toca som de erro (se o contexto de ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡udio estiver ativo)
                if (typeof playSoundEffect === 'function') {
                    playSoundEffect('error');
                    // Tenta animar o mago para 'triste' se ele estiver visÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­vel
                    if (typeof animateMage === 'function') animateMage('sad');
                }

                // Mostra a mensagem de aviso
                modeWarning.style.display = 'block';
                modeWarning.classList.add('popIn'); // Reusa sua animaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o de popIn

                // Reseta o seletor para "Solo" automaticamente
                e.target.value = 'solo';

                // Esconde a mensagem apÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³s 3 segundos
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
/* ================= FIREBASE AUTH / PERFIL / RANKING ================= */
const firebaseConfig = {
  apiKey: "AIzaSyC1QWteo4EFrWokdry-EVS38Dj7J1AhGjI",
  authDomain: "magiclexis.firebaseapp.com",
  projectId: "magiclexis",
  storageBucket: "magiclexis.firebasestorage.app",
  messagingSenderId: "1018035751895",
  appId: "1:1018035751895:web:a6817a7bec70e7672e1992"
};

let app = null;
let auth = null;
let db = null;
let storage = null;
let functionsApi = null;
let dailyCallables = {};
const FUNCTIONS_REGION = 'southamerica-east1';

const DAILY_MODE = 'daily';
const NORMAL_MODE = 'normal';
let currentGameMode = NORMAL_MODE;
let dailySession = null;
let dailyTimerInterval = null;
let dailyHubCountdownInterval = null;
let dailyShareText = '';
let dailyHubPreviewRun = null;
const DAILY_SHARE_LINK = 'https://magiclexis.vercel.app';
const DAILY_SHARE_TEMPLATES = [
    `Joguei a Palavra do Dia do MagicLexis e fiz {attempts} tentativas em {mm:ss} \uD83C\uDFC6
Sera que voce consegue bater meu resultado?
https://magiclexis.vercel.app`,
    `Eu acertei a Palavra do Dia do MagicLexis em {attempts} tentativas e {mm:ss}
Duvido voce fazer melhor.
https://magiclexis.vercel.app`,
    `Desafio do dia concluido no MagicLexis \u26A1
{attempts} tentativas em {mm:ss}
Sera que voce descobre a palavra mais rapido?
https://magiclexis.vercel.app`,
    `Acabei de resolver a Palavra do Dia do MagicLexis \uD83E\uDDE0
Tempo: {mm:ss}
Tentativas: {attempts}
Agora e sua vez.
https://magiclexis.vercel.app`,
    `Eu sobrevivi a Palavra do Dia do MagicLexis \uD83E\uDDD9
Tentativas: {attempts}
Tempo: {mm:ss}
Voce consegue resolver tambem?
https://magiclexis.vercel.app`,
    `Consegui resolver o desafio magico de hoje \u2728
MagicLexis
Tentativas: {attempts}
Tempo: {mm:ss}
Tente voce tambem:
https://magiclexis.vercel.app`,
    `Palavra do Dia concluida \uD83C\uDFC6
MagicLexis
{attempts} tentativas
{mm:ss}
Sera que voce consegue fazer melhor?
https://magiclexis.vercel.app`,
    `Resolvi a Palavra do Dia do MagicLexis!
Tentativas: {attempts}
Tempo: {mm:ss}
Agora quero ver voce tentar.
https://magiclexis.vercel.app`
];
let activeUser = null;
let activeUserDoc = null;
for (let i = 0; i < DAILY_SHARE_TEMPLATES.length; i++) {
    DAILY_SHARE_TEMPLATES[i] = sanitizeGameText(DAILY_SHARE_TEMPLATES[i]);
}

const TUTORIAL_SEEN_STORAGE_KEY = 'magiclexis_tutorial_seen_v1';

function getTutorialSeenKey() {
    const uid = activeUser?.uid || 'guest';
    return `${TUTORIAL_SEEN_STORAGE_KEY}:${uid}`;
}

function hasSeenTutorial() {
    try {
        return localStorage.getItem(getTutorialSeenKey()) === '1';
    } catch (err) {
        return false;
    }
}

function markTutorialSeen() {
    try {
        localStorage.setItem(getTutorialSeenKey(), '1');
    } catch (err) {
        console.log('Falha ao salvar estado de tutorial:', err);
    }
}

let bookTutorialApi = null;

function openWelcomeTutorial(goToLastPage = false) {
    setMobileGameplayMenuVisibility(false);
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.classList.add('hidden-app');
    if (hub) {
        hub.style.display = 'none';
        hub.classList.add('hidden-control');
    }
    if (welcomeScreen) welcomeScreen.style.display = 'flex';
    if (bookTutorialApi) {
        if (goToLastPage) bookTutorialApi.goToLastPage();
        else bookTutorialApi.goToFirstPage();
    }
    syncTopUserUi(activeUser, activeUserDoc);
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=ML&background=1f1f1f&color=bb86fc&size=128';

const profileModal = document.getElementById('profile-modal');
const rankingModal = document.getElementById('ranking-modal');
const profileStatus = document.getElementById('profile-status');
const profileNameInput = document.getElementById('profile-name-input');
const profilePhotoInput = document.getElementById('profile-photo-input');
const profilePhotoBtn = document.getElementById('profile-photo-btn');
const profileNameTitle = document.getElementById('profile-name-title');
const profileAvatar = document.getElementById('profile-avatar');
const profilePoints = document.getElementById('profile-points');
const profileRank = document.getElementById('profile-rank');
const userMenu = document.getElementById('user-menu');
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const userAvatarTop = document.getElementById('user-avatar-top');
const userNameTop = document.getElementById('user-name-top');
const hubLogoutBtn = document.getElementById('hub-logout-btn');
const authGate = document.getElementById('auth-gate');
const gateStatus = document.getElementById('gate-status');
const gateEmailInput = document.getElementById('gate-email-input');
const gatePasswordInput = document.getElementById('gate-password-input');
const gateConfirmPasswordInput = document.getElementById('gate-confirm-password-input');
const gateLoginBtn = document.getElementById('gate-login-email-btn');
const gateRegisterBtn = document.getElementById('gate-register-email-btn');
const dailyHubCard = document.getElementById('daily-hub-card');
const dailyHubMobile = document.getElementById('daily-hub-mobile');
const dailyHubStatusDesktop = document.getElementById('daily-hub-status-desktop');
const dailyHubStatusMobile = document.getElementById('daily-hub-status-mobile');
const hubDailyBtnDesktop = document.getElementById('hub-daily-btn-desktop');
const hubDailyBtnMobile = document.getElementById('hub-daily-btn-mobile');
const dailyStatusBar = document.getElementById('daily-status-bar');
const dailyTimerEl = document.getElementById('daily-timer');
const dailyAttemptsEl = document.getElementById('daily-attempts');
const dailyResultModal = document.getElementById('daily-result-modal');
const closeDailyResultModalBtn = document.getElementById('close-daily-result-modal');
const dailyResultTimeEl = document.getElementById('daily-result-time');
const dailyResultAttemptsEl = document.getElementById('daily-result-attempts');
const dailyResultMeaningEl = document.getElementById('daily-result-meaning');
const dailyResultRecordEl = document.getElementById('daily-result-record');
const dailyShareBtn = document.getElementById('daily-share-btn');

let gateAuthMode = 'login';
const GAME_STATE_STORAGE_KEY = 'magiclexis_game_state_v1';

function formatDailyElapsed(ms = 0) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(total / 60).toString().padStart(2, '0');
    const sec = (total % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function buildDailyShareText(payload = {}) {
    const attempts = payload?.attempts || 0;
    const mmss = formatDailyElapsed(payload?.elapsedMs || 0);
    const idx = Math.floor(Math.random() * DAILY_SHARE_TEMPLATES.length);
    const template = DAILY_SHARE_TEMPLATES[idx] || DAILY_SHARE_TEMPLATES[0];
    const header = '\uD83C\uDFC6 MagicLexis Palavra do Dia';

    let text = `${header}\n${template}`
        .replaceAll('{attempts}', String(attempts))
        .replaceAll('{mm:ss}', mmss);

    if (payload?.isRecord) {
        text += '\n\uD83C\uDFC6 Recorde do dia!';
    }

    return text;
}

function normalizeCallableError(err) {
    return {
        code: err?.code || err?.error?.status || 'unknown',
        message: err?.message || err?.error?.message || 'Erro desconhecido',
        details: err?.details || err?.error?.details || null
    };
}

async function callDailyFunction(name, payload = {}) {
    if (!activeUser) {
        const err = new Error('Usuario nao autenticado para chamada diaria.');
        err.code = 'unauthenticated';
        throw err;
    }

    if (!functionsApi) {
        const err = new Error('Firebase Functions nao inicializado.');
        err.code = 'functions/not-initialized';
        throw err;
    }

    const call = dailyCallables[name] || httpsCallable(functionsApi, name);
    dailyCallables[name] = call;

    await activeUser.getIdToken(true);
    const { data } = await call(payload);
    return data;
}
function setDailyHubStatus(message, blocked = false) {
    stopDailyHubCountdown();
    const cleanMessage = sanitizeGameText(message || '');
    if (dailyHubStatusDesktop) dailyHubStatusDesktop.innerText = cleanMessage;
    if (dailyHubStatusMobile) dailyHubStatusMobile.innerText = cleanMessage;
    if (hubDailyBtnDesktop) hubDailyBtnDesktop.disabled = blocked;
    if (hubDailyBtnMobile) hubDailyBtnMobile.disabled = blocked;
}

function stopDailyHubCountdown() {
    if (dailyHubCountdownInterval) {
        clearInterval(dailyHubCountdownInterval);
        dailyHubCountdownInterval = null;
    }
}

function getMsUntilNextSaoPauloMidnight() {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(now).reduce((acc, p) => {
        if (p.type !== 'literal') acc[p.type] = Number(p.value);
        return acc;
    }, {});

    const nowMs = now.getTime();
    const saoPauloAsUtcMs = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const timezoneOffsetMs = saoPauloAsUtcMs - nowMs;
    const nextMidnightAsUtcMs = Date.UTC(parts.year, parts.month - 1, parts.day + 1, 0, 0, 0);
    const nextMidnightMs = nextMidnightAsUtcMs - timezoneOffsetMs;

    return Math.max(0, nextMidnightMs - nowMs);
}

function formatDailyHubCountdown(ms = 0) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const hh = Math.floor(totalSec / 3600).toString().padStart(2, '0');
    const mm = Math.floor((totalSec % 3600) / 60).toString().padStart(2, '0');
    const ss = (totalSec % 60).toString().padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
}

function startDailyHubCountdown() {
    stopDailyHubCountdown();
    const cleanMessage = sanitizeGameText(message || '');
    if (hubDailyBtnDesktop) hubDailyBtnDesktop.disabled = true;
    if (hubDailyBtnMobile) hubDailyBtnMobile.disabled = true;

    const render = () => {
        const remainingMs = getMsUntilNextSaoPauloMidnight();
        const text = `Conclu\u00edda hoje. Liberada em ${formatDailyHubCountdown(remainingMs)} (S\u00e3o Paulo).`;
        if (dailyHubStatusDesktop) dailyHubStatusDesktop.innerText = text;
        if (dailyHubStatusMobile) dailyHubStatusMobile.innerText = text;

        if (remainingMs <= 0) {
            stopDailyHubCountdown();
    const cleanMessage = sanitizeGameText(message || '');
            refreshDailyHubState();
        }
    };

    render();
    dailyHubCountdownInterval = setInterval(render, 1000);
}

function showDailyStatusBar(show) {
    if (!dailyStatusBar) return;
    dailyStatusBar.classList.toggle('hidden-control', !show);
}

function stopDailyTimer() {
    if (dailyTimerInterval) {
        clearInterval(dailyTimerInterval);
        dailyTimerInterval = null;
    }
}

function getDailyElapsedMs() {
    if (!dailySession) return 0;
    const now = Date.now();
    const running = dailySession.pausedAt ? dailySession.pausedAt : now;
    return Math.max(0, running - dailySession.startedAt + (dailySession.baseElapsedMs || 0));
}

function updateDailyTimerUi() {
    if (!dailyTimerEl) return;
    dailyTimerEl.innerText = formatDailyElapsed(getDailyElapsedMs());
}

function startDailyTimer() {
    stopDailyTimer();
    updateDailyTimerUi();
    dailyTimerInterval = setInterval(updateDailyTimerUi, 250);
}

function pauseDailyTimer() {
    if (!dailySession || dailySession.pausedAt) return;
    dailySession.pausedAt = Date.now();
}

function resumeDailyTimer() {
    if (!dailySession || !dailySession.pausedAt) return;
    const pausedDuration = Date.now() - dailySession.pausedAt;
    dailySession.startedAt += pausedDuration;
    dailySession.pausedAt = null;
}

function setDailyAttempts(attempts = 0) {
    if (dailyAttemptsEl) dailyAttemptsEl.innerText = `Tentativas: ${attempts}`;
}

function resetDailySession() {
    dailySession = null;
    dailyShareText = '';
    stopDailyTimer();
    showDailyStatusBar(false);
}

function getGameStateSnapshot() {
    if (!targetChallenge || !Array.isArray(currentWord) || !activeUser) return null;

    return {
        screen: 'game',
        mode: currentGameMode,
        lengthSelectorValue: lengthSelector?.value || '3',
        targetChallenge: {
            word: targetChallenge.word || '',
            hints: Array.isArray(targetChallenge.hints) ? targetChallenge.hints : [],
            meaning: targetChallenge.meaning || ''
        },
        currentWord: [...currentWord],
        replaceIndex,
        hintIndex,
        isFirstRound,
        maxWordLength,
        historyHtml: historyList ? historyList.innerHTML : '',
        charPlaceholder: charInput ? charInput.placeholder : '?',
        dailySession: currentGameMode === DAILY_MODE && dailySession ? { ...dailySession } : null,
        savedAt: Date.now()
    };
}

function saveGameSessionState() {
    try {
        const appVisible = !document.getElementById('app-container')?.classList.contains('hidden-app');
        if (!appVisible) return;
        const snapshot = getGameStateSnapshot();
        if (!snapshot) return;
        localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
        console.log('Falha ao salvar estado da partida:', err);
    }
}

function clearGameSessionState() {
    try {
        localStorage.removeItem(GAME_STATE_STORAGE_KEY);
    } catch (err) {
        console.log('Falha ao limpar estado da partida:', err);
    }
}

function showGameScreen() {
    if (hub) {
        hub.style.display = 'none';
        hub.classList.add('hidden-control');
    }
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    document.getElementById('app-container')?.classList.remove('hidden-app');
    setMobileGameplayMenuVisibility(true);
}

function showHubScreenFromGame() {
    stopHintCycle();
    resetDailySession();
    clearGameSessionState();
    document.getElementById('app-container')?.classList.add('hidden-app');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    setMobileGameplayMenuVisibility(false);
    showHubScreen(true);
    syncTopUserUi(activeUser, activeUserDoc);
}

function tryRestoreGameSession() {
    try {
        const rawState = localStorage.getItem(GAME_STATE_STORAGE_KEY);
        if (!rawState) return false;
        const state = JSON.parse(rawState);
        if (!state || state.screen !== 'game' || !state.targetChallenge) {
            clearGameSessionState();
            return false;
        }

        if (lengthSelector && state.lengthSelectorValue) {
            lengthSelector.value = state.lengthSelectorValue;
        }

        currentGameMode = state.mode === DAILY_MODE ? DAILY_MODE : NORMAL_MODE;
        targetChallenge = {
            word: sanitizeGameText(state.targetChallenge.word || ''),
            hints: Array.isArray(state.targetChallenge.hints) ? state.targetChallenge.hints.map((hint) => sanitizeGameText(hint)) : [],
            meaning: sanitizeGameText(state.targetChallenge.meaning || '')
        };
        currentWord = Array.isArray(state.currentWord) ? state.currentWord : [];
        replaceIndex = Number.isInteger(state.replaceIndex) ? state.replaceIndex : 0;
        hintIndex = Number.isInteger(state.hintIndex) ? state.hintIndex : 0;
        isFirstRound = !!state.isFirstRound;
        maxWordLength = Number.isInteger(state.maxWordLength) ? state.maxWordLength : (targetChallenge.word?.length || 3);

        if (historyList) historyList.innerHTML = state.historyHtml || '';
        if (charInput) charInput.placeholder = state.charPlaceholder || '?';

        if (currentGameMode === DAILY_MODE && state.dailySession) {
            dailySession = { ...state.dailySession };
            showDailyStatusBar(true);
            setDailyAttempts(dailySession.attempts || 0);
            startDailyTimer();
        } else {
            currentGameMode = NORMAL_MODE;
            showDailyStatusBar(false);
            stopDailyTimer();
            dailySession = null;
        }

        showGameScreen();
        updateHintDisplay();
        startHintCycle();
        render(isFirstRound && currentWord.length === 0);
        syncTopUserUi(activeUser, activeUserDoc);
        saveGameSessionState();
        return true;
    } catch (err) {
        console.log('Falha ao restaurar estado da partida:', err);
        clearGameSessionState();
        return false;
    }
}


async function refreshDailyHubState() {
    if (!activeUser) {
        setDailyHubStatus('Fa\u00e7a login para jogar.', true);
        dailyHubPreviewRun = null;
        return;
    }

    try {
        const data = await callDailyFunction('startDailyRun', {});

        if (data?.blocked) {
            startDailyHubCountdown();
            dailyHubPreviewRun = null;
            return;
        }

        dailyHubPreviewRun = data;
        setDailyHubStatus('Dispon\u00edvel agora. Palavra exclusiva de hoje.', false);
    } catch (err) {
        dailyHubPreviewRun = null;
        const info = normalizeCallableError(err);
        console.error('Erro refreshDailyHubState', info, err);
        setDailyHubStatus(`Erro (${info.code}): ${info.message}`, false);
    }
}
function applyDailyRunData(data) {
    currentGameMode = DAILY_MODE;
    
    dailySession = {
        dateKey: data.dateKey,
        unlockedHints: data.unlockedHints || 3,
        attempts: 0,
        startedAt: Date.now(),
        pausedAt: null,
        baseElapsedMs: 0,
        timezone: data.timezone || 'America/Sao_Paulo',
    };

    const dailyChallenge = {
        word: '',
        hints: Array.isArray(data.hints) ? data.hints.map((hint) => sanitizeGameText(hint)) : [],
        meaning: ''
    };

    isFirstRound = true;
    startChallengeEngine(dailyChallenge, {
        wordLength: data.wordLength || 3,
        resetHistory: true
    });

    showDailyStatusBar(true);
    setDailyAttempts(0);
    startDailyTimer();
    saveGameSessionState();
}

function openDailyResultModal(payload) {
    if (!dailyResultModal) return;
    if (dailyResultTimeEl) dailyResultTimeEl.innerText = `Tempo: ${formatDailyElapsed(payload.elapsedMs || 0)}`;
    if (dailyResultAttemptsEl) dailyResultAttemptsEl.innerText = `Tentativas: ${payload.attempts || 0}`;
    if (dailyResultMeaningEl) dailyResultMeaningEl.innerText = `Significado: ${payload.meaning || '--'}`;
    if (dailyResultRecordEl) dailyResultRecordEl.classList.toggle('hidden-control', !payload.isRecord);
    showControl(dailyResultModal, true);
}

async function shareDailyResult() {
    if (!dailyShareText) return;
    try {
        if (navigator.share) {
            await navigator.share({ text: dailyShareText });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(dailyShareText);
            showFloatingMessage('Resultado copiado para área de transferência.', 2200);
        }
    } catch (err) {
        console.log('Falha ao compartilhar resultado diário', err);
    }
}

async function unlockNextDailyHint() {
    if (!dailySession) return;
    if ((dailySession.unlockedHints || 3) >= 5) return;

    pauseDailyTimer();
    try {
        const data = await callDailyFunction('unlockDailyHint', { adProof: 'mock_rewarded_ad' });

        if (!targetChallenge) targetChallenge = { hints: [] };
        targetChallenge.hints = data?.hints || targetChallenge.hints;
        dailySession.unlockedHints = data?.unlockedHints || dailySession.unlockedHints;

        hintIndex = Math.min(hintIndex + 1, (dailySession.unlockedHints || 3) - 1);
        updateHintDisplay();
        startHintCycle();
        showFloatingMessage('Dica extra desbloqueada!');
    } catch (err) {
        showFloatingMessage('Não foi possível desbloquear a dica agora.', 2500);
        const info = normalizeCallableError(err);
        console.error('unlockDailyHint erro', info);
    } finally {
        resumeDailyTimer();
    }
}

async function startDailyModeFromHub() {
    if (!activeUser) {
        setDailyHubStatus('Fa\u00e7a login para jogar.', true);
        return;
    }

    try {
        const canUsePreview = !!dailyHubPreviewRun;
        const data = canUsePreview ? dailyHubPreviewRun : await callDailyFunction('startDailyRun', {});

        if (data?.blocked) {
            startDailyHubCountdown();
            showFloatingMessage('Palavra do Dia j\u00e1 conclu\u00edda hoje.', 2500);
            dailyHubPreviewRun = null;
            return;
        }

        setDailyHubStatus('Partida di\u00e1ria em andamento.', false);
        dailyHubPreviewRun = null;
        showGameScreen();

        applyDailyRunData(data);
        syncTopUserUi(activeUser, activeUserDoc);
        saveGameSessionState();
    } catch (err) {
        const info = normalizeCallableError(err);
        console.error('startDailyRun erro', info);
        setDailyHubStatus(`Erro (${info.code}): ${info.message}`, false);
        showFloatingMessage('Erro ao iniciar Palavra do Dia.', 2500);
    }
}

function setStatus(msg = '', isError = false) {
    if (!profileStatus) return;
    profileStatus.innerText = sanitizeGameText(msg);
    profileStatus.style.color = isError ? 'var(--error)' : 'var(--warning)';
}

function showControl(el, show) {
    if (!el) return;
    el.classList.toggle('hidden-control', !show);
}

function setGateStatus(msg = '', isError = false) {
    if (!gateStatus) return;
    gateStatus.innerText = sanitizeGameText(msg);
    gateStatus.style.color = isError ? 'var(--error)' : 'var(--warning)';
}

function updateAuthProviderLabels() {
    const lang = (document.documentElement.lang || 'pt').toLowerCase();
    const locale = lang.startsWith('en') ? 'en' : (lang.startsWith('es') ? 'es' : 'pt');

    const textMap = {
        pt: { google: 'Entrar com Google', guest: 'Visitante' },
        en: { google: 'Sign in with Google', guest: 'Guest' },
        es: { google: 'Iniciar con Google', guest: 'Invitado' }
    };

    const labels = textMap[locale] || textMap.pt;
    const googleLabel = document.getElementById('gate-google-btn-label');
    const anonLabel = document.getElementById('gate-anon-btn-label');
    if (googleLabel) googleLabel.innerText = labels.google;
    if (anonLabel) anonLabel.innerText = labels.guest;
}

function observeLanguageChanges() {
    const root = document.documentElement;
    if (!root || typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(() => updateAuthProviderLabels());
    observer.observe(root, { attributes: true, attributeFilter: ['lang'] });
}

function setGateAuthMode(mode = 'login') {
    gateAuthMode = mode === 'register' ? 'register' : 'login';
    const isRegister = gateAuthMode === 'register';

    showControl(gateConfirmPasswordInput, isRegister);
    if (gateConfirmPasswordInput) {
        gateConfirmPasswordInput.value = '';
        gateConfirmPasswordInput.disabled = !isRegister;
    }

    if (gatePasswordInput) {
        gatePasswordInput.placeholder = isRegister ? 'Senha (min. 6)' : 'Senha';
    }

    if (gateLoginBtn && gateRegisterBtn) {
        gateLoginBtn.className = isRegister ? 'profile-btn auth-secondary-btn' : 'profile-btn auth-main-btn';
        gateRegisterBtn.className = isRegister ? 'profile-btn auth-main-btn' : 'profile-btn auth-secondary-btn';
    }

    setGateStatus(isRegister ? 'Confirme a senha para criar a conta.' : '');
}

function showHubScreen(show) {
    if (!hub) return;
    if (show) {
        hub.classList.remove('hidden-control');
        hub.style.display = 'flex';
    } else {
        hub.classList.add('hidden-control');
    }
}

function showAuthGate(show) {
    showControl(authGate, show);
    if (show) setGateAuthMode('login');
}
function getModeVisitor(user) {
    return !!(user && user.isAnonymous);
}

async function ensureUserDoc(user) {
    if (!db || !user || user.isAnonymous) return null;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        const baseName = user.displayName || (user.email ? user.email.split('@')[0] : 'Jogador');
        await setDoc(userRef, {
            uid: user.uid,
            name: baseName,
            photo: user.photoURL || DEFAULT_AVATAR,
            points: 0
        }, { merge: true });
    }

    const fresh = await getDoc(userRef);
    return fresh.exists() ? fresh.data() : null;
}
function syncTopUserUi(user, userDoc) {
    const isLogged = !!user;
    const isAnon = getModeVisitor(user);

    const displayName = isLogged
        ? (isAnon ? 'Visitante' : (userDoc?.name || user.displayName || user.email || 'Jogador'))
        : 'Visitante';

    const displayPhoto = isLogged
        ? (userDoc?.photo || user.photoURL || DEFAULT_AVATAR)
        : DEFAULT_AVATAR;

    if (userNameTop) userNameTop.innerText = displayName;
    if (userAvatarTop) userAvatarTop.src = displayPhoto;
    if (profileAvatar) profileAvatar.src = displayPhoto;
    if (profileNameTitle) profileNameTitle.innerText = displayName;

    const appVisible = !document.getElementById('app-container')?.classList.contains('hidden-app');
    showControl(userMenu, isLogged && appVisible);

    const hubVisible = !hub.classList.contains('hidden-control') && hub.style.display !== 'none';
    showControl(hubLogoutBtn, isLogged && hubVisible);
    if (profilePoints) {
        const pts = isAnon ? 0 : (userDoc?.points || 0);
        profilePoints.innerText = `Pontos: ${pts}`;
    }
}


async function refreshProfileRank() {
    if (!profileRank) return;

    if (!activeUser || activeUser.isAnonymous || !db) {
        profileRank.innerText = 'Ranking global: visitante';
        return;
    }

    try {
        const points = activeUserDoc?.points || 0;
        const higherQuery = query(collection(db, 'users'), where('points', '>', points));
        const higher = await getDocs(higherQuery);
        const rank = higher.size + 1;
        profileRank.innerText = `Ranking global: #${rank}`;
    } catch (err) {
        profileRank.innerText = 'Ranking global: --';
    }
}
function openProfileModal() {
    showControl(profileModal, true);
    showControl(userMenuDropdown, false);

    if (!activeUser) {
        setStatus('Faça login para acessar o perfil.', true);
        return;
    }

    const isAnon = activeUser.isAnonymous;
    const displayName = isAnon
        ? 'Visitante'
        : (activeUserDoc?.name || activeUser.displayName || activeUser.email?.split('@')[0] || 'Jogador');

    profileNameInput.value = displayName;
    profileNameInput.disabled = isAnon;
    profilePhotoInput.disabled = isAnon;
    if (profilePhotoBtn) profilePhotoBtn.disabled = isAnon;

    if (isAnon) {
        setStatus('Conta visitante: joga normal, mas não salva pontos nem ranking.');
    } else {
        setStatus('');
    }

    refreshProfileRank();
}

function closeProfileModal() {
    showControl(profileModal, false);
    setStatus('');
}

async function openRankingModal() {
    showControl(rankingModal, true);
    showControl(userMenuDropdown, false);
    await loadRanking();
}

function closeRankingModal() {
    showControl(rankingModal, false);
}

async function uploadProfilePhoto(file, uid) {
    if (!storage || !file || !uid) return null;
    const path = `profile_photos/${uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}
async function saveProfile() {
    if (!activeUser || !db || activeUser.isAnonymous) {
        setStatus('Visitante não salva perfil.', true);
        return;
    }

    const newName = (profileNameInput.value || '').trim().slice(0, 24) || 'Jogador';
    const file = profilePhotoInput.files?.[0] || null;

    setStatus('Salvando perfil...');
    try {
        let photoURL = activeUserDoc?.photo || activeUser.photoURL || DEFAULT_AVATAR;
        if (file) {
            photoURL = await uploadProfilePhoto(file, activeUser.uid);
        }

        await updateProfile(activeUser, { displayName: newName, photoURL });
        await setDoc(doc(db, 'users', activeUser.uid),{
            uid: activeUser.uid,
            name: newName,
            photo: photoURL,
            points: activeUserDoc?.points || 0
        }, { merge: true });

        activeUserDoc = { ...(activeUserDoc || {}), name: newName, photo: photoURL };
        syncTopUserUi(activeUser, activeUserDoc);
        setStatus('Perfil salvo com sucesso.');
    } catch (err) {
        setStatus('Erro ao salvar perfil: ' + (err.message || err), true);
    }
}

async function authWithGoogle() {
    if (!auth) {
        setGateStatus('Firebase Auth não inicializado. Recarregue a página.', true);
        return;
    }
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        setStatus('Login Google realizado.');
        setGateStatus('Login Google realizado.');
    } catch (err) {
        setStatus('Falha no login Google: ' + (err.message || err), true);
        setGateStatus('Falha no login Google: ' + (err.message || err), true);
    }
}


async function authAnonymously() {
    if (!auth) {
        setGateStatus('Firebase Auth não inicializado. Recarregue a página.', true);
        return;
    }
    try {
        await signInAnonymously(auth);
        setStatus('Entrou como visitante.');
        setGateStatus('Entrou como visitante.');
    } catch (err) {
        setStatus('Erro no modo visitante: ' + (err.message || err), true);
        setGateStatus('Erro no modo visitante: ' + (err.message || err), true);
    }
}

async function authWithEmail(isRegister, emailFieldId = 'email-input', passwordFieldId = 'password-input') {
    if (!auth) {
        setGateStatus('Firebase Auth não inicializado. Recarregue a página.', true);
        return;
    }
    const email = (document.getElementById(emailFieldId)?.value || '').trim();
    const password = document.getElementById(passwordFieldId)?.value || '';
    const confirmPassword = document.getElementById('gate-confirm-password-input')?.value || '';

    if (!email || !password) {
        setStatus('Informe email e senha.', true);
        setGateStatus('Informe email e senha.', true);
        return;
    }

    if (isRegister) {
        if (!confirmPassword) {
            setStatus('Confirme a senha para criar a conta.', true);
            setGateStatus('Confirme a senha para criar a conta.', true);
            return;
        }
        if (password !== confirmPassword) {
            setStatus('As senhas não coincidem.', true);
            setGateStatus('As senhas não coincidem.', true);
            return;
        }
    }

    try {
        if (isRegister) {
            await createUserWithEmailAndPassword(auth, email, password);
            setStatus('Conta criada com sucesso.');
            setGateStatus('Conta criada com sucesso.');
            setGateAuthMode('login');
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            setStatus('Login realizado.');
            setGateStatus('Login realizado.');
        }
    } catch (err) {
        setStatus('Erro no login/cadastro: ' + (err.message || err), true);
        setGateStatus('Erro no login/cadastro: ' + (err.message || err), true);
    }
}

async function logoutUser() {
    if (!auth) return;
    try {
        await signOut(auth);
        setStatus('Sess\u00E3o encerrada.');
        setGateStatus('Faça login para continuar.');
    } catch (err) {
        setStatus('Erro ao sair: ' + (err.message || err), true);
        setGateStatus('Erro ao sair: ' + (err.message || err), true);
    }
}

async function handleCorrectAnswer() {
    if (!activeUser || !db || activeUser.isAnonymous) return;

    try {
        const userRef = doc(db, 'users', activeUser.uid);
        await setDoc(userRef, {
            uid: activeUser.uid,
            name: activeUserDoc?.name || activeUser.displayName || 'Jogador',
            photo: activeUserDoc?.photo || activeUser.photoURL || DEFAULT_AVATAR,
            points: increment(1)
        }, { merge: true });

        const fresh = await getDoc(userRef);
        activeUserDoc = fresh.exists() ? fresh.data() : activeUserDoc;
        if (profilePoints) profilePoints.innerText = `Pontos: ${activeUserDoc?.points || 0}`;
    } catch (err) {
        console.log('Erro ao somar pontos:', err);
    }
}
async function loadRanking() {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return;

    if (!db) {
        rankingList.innerHTML = '<div class="ranking-item">Firebase indispon\u00EDvel.</div>';
        return;
    }

    rankingList.innerHTML = '<div class="ranking-item">Carregando ranking...</div>';

    try {
        const rankingQuery = query(collection(db, 'users'), orderBy('points', 'desc'), limit(50));
        const snap = await getDocs(rankingQuery);

        if (snap.empty) {
            rankingList.innerHTML = '<div class="ranking-item">Sem dados no ranking ainda.</div>';
            return;
        }

        rankingList.innerHTML = '';
        snap.docs.forEach((doc, idx) => {
            const u = doc.data();
            const item = document.createElement('div');
            item.className = 'ranking-item';
            item.innerHTML = `
                <strong>#${idx + 1}</strong>
                <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                    <img class="ranking-avatar" src="${u.photo || DEFAULT_AVATAR}" alt="avatar">
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${u.name || 'Jogador'}</span>
                </div>
                <strong>${u.points || 0}</strong>
            `;
            rankingList.appendChild(item);
        });
    } catch (err) {
        rankingList.innerHTML = `<div class="ranking-item">Erro ao carregar ranking: ${err.message || err}</div>`;
    }
}

function bindAuthUiEvents() {
    document.getElementById('close-profile-modal')?.addEventListener('click', closeProfileModal);
    document.getElementById('close-ranking-modal')?.addEventListener('click', closeRankingModal);
    document.getElementById('save-profile-btn')?.addEventListener('click', saveProfile);
    document.getElementById('profile-logout-btn')?.addEventListener('click', logoutUser);
    profilePhotoBtn?.addEventListener('click', () => profilePhotoInput?.click());

    document.getElementById('gate-google-btn')?.addEventListener('click', authWithGoogle);
    document.getElementById('gate-anon-btn')?.addEventListener('click', authAnonymously);
    document.getElementById('gate-login-email-btn')?.addEventListener('click', () => {
        if (gateAuthMode === 'register') {
            setGateAuthMode('login');
            return;
        }
        authWithEmail(false, 'gate-email-input', 'gate-password-input');
    });
    hubDailyBtnDesktop?.addEventListener('click', startDailyModeFromHub);
    hubDailyBtnMobile?.addEventListener('click', startDailyModeFromHub);
    closeDailyResultModalBtn?.addEventListener('click', () => showControl(dailyResultModal, false));
    dailyShareBtn?.addEventListener('click', shareDailyResult);
    document.getElementById('gate-register-email-btn')?.addEventListener('click', () => {
        if (gateAuthMode !== 'register') {
            setGateAuthMode('register');
            return;
        }
        authWithEmail(true, 'gate-email-input', 'gate-password-input');
    });

    gateConfirmPasswordInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && gateAuthMode === 'register') {
            authWithEmail(true, 'gate-email-input', 'gate-password-input');
        }
    });

    document.getElementById('hub-logout-btn')?.addEventListener('click', logoutUser);
    document.getElementById('user-logout-top')?.addEventListener('click', logoutUser);
    document.getElementById('user-open-profile')?.addEventListener('click', openProfileModal);
    document.getElementById('user-go-menu-top')?.addEventListener('click', showHubScreenFromGame);

    document.getElementById('user-menu-trigger')?.addEventListener('click', () => {
        showControl(userMenuDropdown, userMenuDropdown.classList.contains('hidden-control'));
    });

    window.addEventListener('click', (e) => {
        if (!userMenu?.contains(e.target)) showControl(userMenuDropdown, false);
        if (e.target === profileModal) closeProfileModal();
        if (e.target === rankingModal) closeRankingModal();
        if (e.target === dailyResultModal) showControl(dailyResultModal, false);
    });
}

function initFirebase() {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    const functions = getFunctions(app, FUNCTIONS_REGION);
    functionsApi = functions;

    dailyCallables = {
        startDailyRun: httpsCallable(functions, 'startDailyRun'),
        unlockDailyHint: httpsCallable(functions, 'unlockDailyHint'),
        submitDailyGuess: httpsCallable(functions, 'submitDailyGuess')
    };

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            activeUser = null;
            activeUserDoc = null;
            showAuthGate(true);
            showHubScreen(false);
            welcomeScreen.style.display = 'none';
            document.getElementById('app-container')?.classList.add('hidden-app');
            syncTopUserUi(null, null);
            resetDailySession();
            clearGameSessionState();
            setDailyHubStatus('Fa\u00e7a login para jogar.', true);
            return;
        }

        activeUser = user;
        try {
            activeUserDoc = await ensureUserDoc(user);
        } catch (e) {
            activeUserDoc = null;
            console.log('Falha ao carregar doc do usuario:', e);
        }

        showAuthGate(false);
        const restored = tryRestoreGameSession();
        if (!restored) {
            showHubScreen(true);
            welcomeScreen.style.display = 'none';
            document.getElementById('app-container')?.classList.add('hidden-app');
        }

        syncTopUserUi(user, activeUserDoc);
        await refreshDailyHubState();
    });
}
document.addEventListener('DOMContentLoaded', () => {
    bindAuthUiEvents();
    setGateAuthMode('login');
    initFirebase();
    updateAuthProviderLabels();
    observeLanguageChanges();
});










































