// --- IMPORTAR FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- SUAS CREDENCIAIS DO FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyC1QWteo4EFrWokdry-EVS38Dj7J1AhGjI",
  authDomain: "magiclexis.firebaseapp.com",
  projectId: "magiclexis",
  storageBucket: "magiclexis.firebasestorage.app",
  messagingSenderId: "1018035751895",
  appId: "1:1018035751895:web:a6817a7bec70e7672e1992"
};

// INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/* --- LISTA DE PALAVRAS (SEU BANCO DE QUESTÕES - 120 Palavras) --- */
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

/* --- VARIÁVEIS GLOBAIS DO JOGO --- */
let userData = { nickname: "Mago Iniciante", avatar: "https://ui-avatars.com/api/?name=Mago&background=random&color=fff", level: 1, solvedWords: [] };
let currentChallenge = null;
let currentWord = [];
let hintIndex = 0;
let hintInterval = null;
let replaceIndex = 0;
let maxWordLength = 0;

/* --- ELEMENTOS HTML --- */
const authScreen = document.getElementById('auth-screen');
const appContainer = document.getElementById('app-container');
const profileModal = document.getElementById('profile-modal');
const wordGrid = document.getElementById('word-grid');
const charInput = document.getElementById('char-input');
const feedback = document.getElementById('feedback-message');
const meaningBox = document.getElementById('meaning-box');
const historyList = document.getElementById('input-history');
const lengthSelector = document.getElementById('length-selector');
const authMsg = document.getElementById('auth-msg');

/* ==========================================================================
   1. SISTEMA DE LOGIN E CADASTRO
   ========================================================================== */

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authScreen.style.display = 'none';
        appContainer.classList.remove('hidden-app');
        await loadUserData(user.uid);
        initGameInterface();
    } else {
        authScreen.style.display = 'flex';
        appContainer.classList.add('hidden-app');
    }
});

// LOGIN COM E-MAIL
document.getElementById('btn-login').onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    authMsg.innerText = "Entrando...";
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        authMsg.innerText = "Erro: Verifique e-mail e senha.";
    }
};

// LOGIN COM GOOGLE
document.getElementById('btn-google').onclick = async () => {
    authMsg.innerText = "Conectando ao Google...";
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        authMsg.innerText = "Erro no Google: " + error.message;
    }
};

// CADASTRO
document.getElementById('btn-signup').onclick = async () => {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    if(pass.length < 6) { authMsg.innerText = "Senha deve ter 6+ caracteres"; return; }
    authMsg.innerText = "Criando conta mágica...";
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", cred.user.uid), userData);
        authMsg.innerText = "Sucesso! Entrando...";
    } catch (error) {
        authMsg.innerText = "Erro ao criar conta: " + error.message;
    }
};

document.getElementById('btn-logout').onclick = () => signOut(auth);

/* ==========================================================================
   2. BANCO DE DADOS (FIRESTORE)
   ========================================================================== */

async function loadUserData(uid) {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        userData = { ...userData, ...data };
    } else {
        await setDoc(docRef, userData);
    }
    updateUserDisplay();
}

async function saveProgress(word) {
    if (!auth.currentUser) return;
    if (!userData.solvedWords.includes(word)) {
        userData.solvedWords.push(word);
        const newLevel = Math.floor(userData.solvedWords.length / 5) + 1;
        if(newLevel > userData.level) {
            userData.level = newLevel;
            showFloatingMessage(`SUBIU PARA O NÍVEL ${newLevel}! 🎉`, 3000);
        }
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
            solvedWords: arrayUnion(word),
            level: userData.level
        });
        updateUserDisplay();
    }
}

/* ==========================================================================
   3. PERFIL E AVATAR
   ========================================================================== */

function updateUserDisplay() {
    document.getElementById('user-name-display').innerText = userData.nickname;
    document.getElementById('user-level-display').innerText = `Nível ${userData.level} (${userData.solvedWords.length} palavras)`;
    document.getElementById('user-avatar-display').src = userData.avatar;
    document.getElementById('profile-preview-img').src = userData.avatar;
    document.getElementById('profile-nickname').value = userData.nickname;
}

document.getElementById('user-profile-trigger').onclick = () => { profileModal.classList.remove('hidden'); };
document.getElementById('btn-close-profile').onclick = () => profileModal.classList.add('hidden');

document.getElementById('avatar-file-input').onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 2000000) { alert("A imagem é muito grande! Escolha uma menor que 2MB."); return; }
        const reader = new FileReader();
        reader.onloadend = () => { document.getElementById('profile-preview-img').src = reader.result; };
        reader.readAsDataURL(file);
    }
};

document.getElementById('btn-save-profile').onclick = async () => {
    const newNick = document.getElementById('profile-nickname').value;
    const newAvatar = document.getElementById('profile-preview-img').src;
    if (!newNick) return;
    document.getElementById('btn-save-profile').innerText = "Salvando...";
    userData.nickname = newNick;
    userData.avatar = newAvatar;
    const userRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userRef, { nickname: newNick, avatar: newAvatar });
    updateUserDisplay();
    profileModal.classList.add('hidden');
    document.getElementById('btn-save-profile').innerText = "Salvar";
};

/* ==========================================================================
   4. LÓGICA DO JOGO
   ========================================================================== */

function initGameInterface() { populateLengthOptions(); initChallenge(); }

function populateLengthOptions() {
    lengthSelector.innerHTML = "";
    const lengths = [...new Set(allChallenges.map(c => c.word.length))].sort((a,b) => a-b);
    lengths.forEach(len => {
        const total = allChallenges.filter(c => c.word.length === len).length;
        const solved = allChallenges.filter(c => c.word.length === len && userData.solvedWords.includes(c.word)).length;
        const option = document.createElement('option');
        option.value = len;
        const check = solved >= total ? '✅' : '';
        option.innerText = `${len} Letras (${solved}/${total}) ${check}`;
        lengthSelector.appendChild(option);
    });
}

lengthSelector.onchange = () => initChallenge();

function initChallenge() {
    clearAllHighlights();
    animateMage('reset');
    const selectedLen = parseInt(lengthSelector.value) || allChallenges[0].word.length;
    const pool = allChallenges.filter(c => c.word.length === selectedLen);
    let availableWords = pool.filter(c => !userData.solvedWords.includes(c.word));
    
    if (availableWords.length === 0) {
        availableWords = pool;
        showFloatingMessage("Você já dominou este nível! Revisando...", 3000);
    }

    const randIdx = Math.floor(Math.random() * availableWords.length);
    currentChallenge = availableWords[randIdx];
    maxWordLength = currentChallenge.word.length;
    currentWord = [];
    replaceIndex = 0;
    hintIndex = 0;
    updateHintDisplay();
    startHintCycle();
    feedback.innerText = "";
    meaningBox.classList.add('hidden');
    charInput.placeholder = "?";
    render();
}

// ... FUNÇÕES AUXILIARES ...
function updateHintDisplay() {
    if (!currentChallenge) return;
    const hintEl = document.getElementById('current-hint');
    hintEl.classList.remove('fade-in'); hintEl.classList.add('fade-out');
    setTimeout(() => {
        hintEl.innerText = currentChallenge.hints[hintIndex] || "Sem dica.";
        document.getElementById('hint-counter').innerText = `Dica ${hintIndex + 1}/${currentChallenge.hints.length}`;
        hintEl.classList.remove('fade-out'); hintEl.classList.add('fade-in');
    }, 200);
}

function startHintCycle() {
    if (hintInterval) clearInterval(hintInterval);
    hintInterval = setInterval(() => {
        if (!currentChallenge) return;
        hintIndex++; if (hintIndex >= currentChallenge.hints.length) hintIndex = 0;
        updateHintDisplay();
    }, 5000);
}

function stopHintCycle() { if (hintInterval) clearInterval(hintInterval); }
const isVowel = (c) => 'AEIOUaeiou'.includes(c);

function render() {
    wordGrid.innerHTML = '';
    currentWord.forEach((c, i) => {
        const div = document.createElement('div');
        div.className = 'letter-box'; div.innerText = c;
        if (currentWord.length >= maxWordLength && i === replaceIndex) { div.classList.add('next-to-change'); }
        wordGrid.appendChild(div);
    });
    updateMiniAlphabet();
}

function addChar(char) {
    if (!/^[a-zA-Z]$/.test(char)) return;
    charInput.placeholder = char.toUpperCase();
    historyList.innerHTML += char.toUpperCase() + ' ';
    historyList.scrollTop = historyList.scrollHeight;
    if (currentWord.length >= maxWordLength) {
        currentWord.splice(replaceIndex, 1);
        let insertionIndex = replaceIndex;
        replaceIndex++;
        if (replaceIndex >= maxWordLength) replaceIndex = 0;
        processNewChar(char, insertionIndex);
    } else {
        processNewChar(char, currentWord.length);
        if (currentWord.length >= maxWordLength) replaceIndex = 0;
    }
}

function processNewChar(char, indexToInsert) {
    let charToAdd = char.toUpperCase();
    if (indexToInsert > 0 && isVowel(currentWord[indexToInsert - 1])) {
        highlight('rule-vowel');
        charToAdd = String.fromCharCode(charToAdd.charCodeAt(0) + 1);
        if (charToAdd > 'Z') charToAdd = 'A';
    }
    if (!isVowel(charToAdd) && indexToInsert > 0 && currentWord.length > 0) {
        highlight('rule-consonant');
        const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const idx = alpha.indexOf(charToAdd);
        if (idx !== -1) charToAdd = alpha[25 - idx];
    }
    currentWord.splice(indexToInsert, 0, charToAdd);
    const firstIdx = currentWord.indexOf(charToAdd);
    const lastIdxFound = currentWord.lastIndexOf(charToAdd);
    if (firstIdx !== -1 && lastIdxFound !== -1 && firstIdx !== lastIdxFound) {
        const start = firstIdx + 1;
        const end = lastIdxFound;
        if (end > start) {
            highlight('rule-repeat');
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
    if (currentChallenge && word === currentChallenge.word) {
        feedback.innerText = "🏆 ACERTOU!"; feedback.style.color = "var(--success)";
        meaningBox.innerText = currentChallenge.meaning;
        meaningBox.classList.remove('hidden');
        document.body.classList.add('success-flash');
        document.getElementById('success-sound').play();
        triggerConfetti();
        animateMage('win');
        stopHintCycle();
        await saveProgress(word);
        populateLengthOptions();
        setTimeout(() => {
            document.body.classList.remove('success-flash');
            initChallenge();
            feedback.innerText = "Novo desafio iniciado!";
            setTimeout(() => { feedback.innerText = ""; }, 2000);
        }, 4000);
        return;
    }
    try {
        const res = await fetch(`https://api.dicionario-aberto.net/word/${word.toLowerCase()}`);
        const data = await res.json();
        if (data.length > 0) {
            feedback.innerText = "⚠️ Palavra existe, mas não é a mágica."; feedback.style.color = "var(--warning)";
            animateMage('reset');
        } else {
            feedback.innerText = "❌ Tente novamente"; feedback.style.color = "var(--error)";
            document.body.classList.add('error-flash');
            animateMage('sad');
        }
    } catch { feedback.innerText = "Erro na API"; }
    setTimeout(() => { document.body.classList.remove('success-flash', 'error-flash'); if(!feedback.innerText.includes("Novo")) feedback.innerText = ""; }, 2000);
}

function highlight(id) {
    document.querySelectorAll('.rule-card').forEach(c => c.classList.remove('rule-active'));
    const el = document.getElementById(id);
    if(el) el.classList.add('rule-active');
    animateMage('cast');
}

function animateMage(action) {
    const mage = document.getElementById('mage-character');
    mage.className = 'pixel-mage';
    if(action === 'cast') { mage.classList.add('cast'); setTimeout(()=>mage.classList.remove('cast'), 500); }
    if(action === 'win') mage.classList.add('win');
    if(action === 'sad') mage.classList.add('sad');
}

function showFloatingMessage(text, time=2000) {
    const msg = document.getElementById('floating-msg');
    msg.innerText = text;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), time);
}

charInput.addEventListener('input', (e) => { if(e.target.value) { addChar(e.target.value); e.target.value=''; }});
document.getElementById('validate-btn').onclick = validate;
document.getElementById('clear-history').onclick = () => { historyList.innerHTML = ''; };

const sidebar = document.getElementById('sidebar');
const alphaDrawer = document.getElementById('alphabet-drawer');
const overlay = document.getElementById('mobile-overlay');
document.getElementById('mobile-menu-btn').onclick = () => { sidebar.classList.add('mobile-open'); overlay.classList.add('active'); };
document.getElementById('mobile-alphabet-btn').onclick = () => { alphaDrawer.classList.add('mobile-open'); overlay.classList.add('active'); };
overlay.onclick = () => { sidebar.classList.remove('mobile-open'); alphaDrawer.classList.remove('mobile-open'); overlay.classList.remove('active'); };

const alphaContainer = document.getElementById('mini-alphabet');
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(l => {
    const d = document.createElement('div'); d.className='mini-char'; d.id=`mini-${l}`; d.innerText=l;
    alphaContainer.appendChild(d);
});
function updateMiniAlphabet() {
    document.querySelectorAll('.mini-char').forEach(el => el.classList.remove('active'));
    currentWord.forEach(char => { const el = document.getElementById(`mini-${char}`); if(el) el.classList.add('active'); });
}

function triggerConfetti() {
    const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff'];
    for(let i=0; i<100; i++) {
        const c = document.createElement('div'); c.className='confetti';
        c.style.left = Math.random()*100+'vw'; c.style.backgroundColor=colors[Math.floor(Math.random()*colors.length)];
        c.style.animationDuration = (Math.random()*2+2)+'s';
        document.body.appendChild(c); setTimeout(()=>c.remove(), 4000);
    }
}

function startMageIdle() { }
document.addEventListener("DOMContentLoaded", startMageIdle);