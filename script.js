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
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    limit,
    increment,
    onSnapshot,
    serverTimestamp,
    runTransaction
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js';
/* --- DADOS (LOTE 1 - 120 PALAVRAS) --- */
const allChallenges = [
    // --- 3 LETRAS ---
    { word: "SOL", hints: ["Astro rei.", "Aquece o dia.", "Estrela.", "Luz natural.", "Calor."], meaning: "Estrela central do sistema solar." },
    { word: "LUA", hints: ["SatÃƒÆ’Ã‚Â©lite.", "Noite.", "Fases.", "MarÃƒÆ’Ã‚Â©s.", "Branca."], meaning: "SatÃƒÆ’Ã‚Â©lite natural da Terra." },
    { word: "MAR", hints: ["Oceano.", "Sal.", "Ondas.", "Azul.", "Praia."], meaning: "Grande massa de ÃƒÆ’Ã‚Â¡gua salgada." },
    { word: "CEU", hints: ["Azul.", "Nuvens.", "Alto.", "Infinito.", "ParaÃƒÆ’Ã‚Â­so."], meaning: "EspaÃƒÆ’Ã‚Â§o acima da Terra." },
    { word: "PAZ", hints: ["Calma.", "Branco.", "TrÃƒÆ’Ã‚Â©gua.", "Sossego.", "Harmonia."], meaning: "Estado de tranquilidade." },
    { word: "SOM", hints: ["Ouvir.", "MÃƒÆ’Ã‚Âºsica.", "RuÃƒÆ’Ã‚Â­do.", "VibraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Volume."], meaning: "SensaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o auditiva." },
    { word: "COR", hints: ["Tinta.", "Arco-ÃƒÆ’Ã‚Â­ris.", "Visual.", "Pintura.", "Luz."], meaning: "ImpressÃƒÆ’Ã‚Â£o visual da luz." },
    { word: "RIO", hints: ["ÃƒÆ’Ã‚Âgua doce.", "Correnteza.", "Peixes.", "Fluxo.", "Leito."], meaning: "Curso de ÃƒÆ’Ã‚Â¡gua natural." },
    { word: "VOZ", hints: ["Falar.", "Cantar.", "Garganta.", "Som humano.", "Grito."], meaning: "Som produzido pelas cordas vocais." },
    { word: "LUZ", hints: ["Claridade.", "LÃƒÆ’Ã‚Â¢mpada.", "Velocidade.", "Sol.", "Dia."], meaning: "RadiaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o visÃƒÆ’Ã‚Â­vel." },
    { word: "SAL", hints: ["Tempero.", "Branco.", "Mar.", "Cozinha.", "SÃƒÆ’Ã‚Â³dio."], meaning: "SubstÃƒÆ’Ã‚Â¢ncia usada para temperar." },
    { word: "MAE", hints: ["Geradora.", "Amor.", "FamÃƒÆ’Ã‚Â­lia.", "Origem.", "Cuidado."], meaning: "Genitora." },
    { word: "PAI", hints: ["Protetor.", "FamÃƒÆ’Ã‚Â­lia.", "Masculino.", "Origem.", "HerÃƒÆ’Ã‚Â³i."], meaning: "Genitor." },
    { word: "GOL", hints: ["Futebol.", "Rede.", "Ponto.", "Chute.", "Torcida."], meaning: "Ponto no futebol." },
    { word: "FIM", hints: ["TÃƒÆ’Ã‚Â©rmino.", "Acabou.", "ConclusÃƒÆ’Ã‚Â£o.", "Final.", "Desfecho."], meaning: "Onde algo termina." },

    // --- 4 LETRAS ---
    { word: "AMOR", hints: ["CoraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Afeto.", "PaixÃƒÆ’Ã‚Â£o.", "Sentimento.", "UniÃƒÆ’Ã‚Â£o."], meaning: "Forte afeiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o por outra pessoa." },
    { word: "VIDA", hints: ["Viver.", "ExistÃƒÆ’Ã‚Âªncia.", "Nascer.", "Biologia.", "Sopro."], meaning: "Estado de atividade funcional." },
    { word: "GATO", hints: ["Felino.", "Miau.", "Bigode.", "Animal.", "DomÃƒÆ’Ã‚Â©stico."], meaning: "Pequeno mamÃƒÆ’Ã‚Â­fero carnÃƒÆ’Ã‚Â­voro." },
    { word: "CASA", hints: ["Moradia.", "Teto.", "Lar.", "ConstruÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Abrigo."], meaning: "EdifÃƒÆ’Ã‚Â­cio para habitar." },
    { word: "BOLA", hints: ["Esfera.", "Jogo.", "Redonda.", "Futebol.", "Brinquedo."], meaning: "Objeto esfÃƒÆ’Ã‚Â©rico usado em jogos." },
    { word: "ANEL", hints: ["Dedo.", "Joia.", "Ouro.", "CÃƒÆ’Ã‚Â­rculo.", "Compromisso."], meaning: "Aro ornamental usado no dedo." },
    { word: "TREM", hints: ["Trilho.", "VagÃƒÆ’Ã‚Â£o.", "Locomotiva.", "Viagem.", "Apito."], meaning: "Comboio ferroviÃƒÆ’Ã‚Â¡rio." },
    { word: "FLOR", hints: ["Jardim.", "PÃƒÆ’Ã‚Â©tala.", "Cheiro.", "Planta.", "Primavera."], meaning: "ÃƒÆ’Ã¢â‚¬Å“rgÃƒÆ’Ã‚Â£o reprodutor das plantas." },
    { word: "MESA", hints: ["MÃƒÆ’Ã‚Â³vel.", "Jantar.", "Apoio.", "Quatro pernas.", "Madeira."], meaning: "MÃƒÆ’Ã‚Â³vel com tampo plano." },
    { word: "FOGO", hints: ["Quente.", "Queima.", "Chama.", "IncÃƒÆ’Ã‚Âªndio.", "Luz."], meaning: "CombustÃƒÆ’Ã‚Â£o visÃƒÆ’Ã‚Â­vel." },
    { word: "AGUA", hints: ["LÃƒÆ’Ã‚Â­quido.", "Beber.", "Vida.", "Rio.", "Chuva."], meaning: "LÃƒÆ’Ã‚Â­quido essencial ÃƒÆ’Ã‚Â  vida." },
    { word: "MEDO", hints: ["Susto.", "Pavor.", "Escuro.", "Terror.", "EmoÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o."], meaning: "SensaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de perigo." },
    { word: "RISO", hints: ["Alegria.", "Boca.", "Piada.", "EngraÃƒÆ’Ã‚Â§ado.", "Som."], meaning: "Ato de rir." },
    { word: "CAFE", hints: ["Bebida.", "Preto.", "ManhÃƒÆ’Ã‚Â£.", "Acordar.", "CafeÃƒÆ’Ã‚Â­na."], meaning: "Bebida estimulante." },
    { word: "LIXO", hints: ["Descarte.", "Sujeira.", "Reciclar.", "Cesto.", "Resto."], meaning: "ResÃƒÆ’Ã‚Â­duos descartados." },

    // --- 5 LETRAS ---
    { word: "LIVRO", hints: ["Leitura.", "PÃƒÆ’Ã‚Â¡ginas.", "Biblioteca.", "HistÃƒÆ’Ã‚Â³ria.", "Capa."], meaning: "Conjunto de folhas escritas." },
    { word: "PORTA", hints: ["Entrada.", "Abrir.", "Madeira.", "MaÃƒÆ’Ã‚Â§aneta.", "SaÃƒÆ’Ã‚Â­da."], meaning: "Abertura em parede para passagem." },
    { word: "NAVIO", hints: ["Mar.", "Transporte.", "Barco grande.", "Oceano.", "Cruzeiro."], meaning: "Grande embarcaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o." },
    { word: "PEIXE", hints: ["ÃƒÆ’Ã‚Âgua.", "Nadar.", "Escamas.", "Rio.", "Mar."], meaning: "Animal vertebrado aquÃƒÆ’Ã‚Â¡tico." },
    { word: "CARTA", hints: ["Correio.", "Papel.", "Envelope.", "Escrever.", "Mensagem."], meaning: "Mensagem escrita enviada a alguÃƒÆ’Ã‚Â©m." },
    { word: "PLUMA", hints: ["Leve.", "Pena.", "Ave.", "Macio.", "Travesseiro."], meaning: "Pena de ave." },
    { word: "NOITE", hints: ["Escuro.", "Lua.", "Estrelas.", "Dormir.", "Fim do dia."], meaning: "PerÃƒÆ’Ã‚Â­odo sem luz solar." },
    { word: "CHUVA", hints: ["ÃƒÆ’Ã‚Âgua.", "Nuvens.", "Molhado.", "Temporal.", "Gotas."], meaning: "PrecipitaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o atmosfÃƒÆ’Ã‚Â©rica." },
    { word: "PRAIA", hints: ["Areia.", "Mar.", "Sol.", "VerÃƒÆ’Ã‚Â£o.", "Ondas."], meaning: "Borda de terra ÃƒÆ’Ã‚Â  beira-mar." },
    { word: "SONHO", hints: ["Dormir.", "ImaginaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Desejo.", "Pesadelo.", "Noite."], meaning: "Imagens vistas enquanto se dorme." },
    { word: "RISCO", hints: ["Perigo.", "TraÃƒÆ’Ã‚Â§o.", "Aventura.", "Medo.", "Rabisco."], meaning: "Possibilidade de perigo." },
    { word: "MUNDO", hints: ["Terra.", "Globo.", "Planeta.", "Universo.", "Pessoas."], meaning: "O planeta Terra." },
    { word: "TEMPO", hints: ["RelÃƒÆ’Ã‚Â³gio.", "Horas.", "Clima.", "Passado.", "Futuro."], meaning: "DuraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o dos fatos." },
    { word: "IDEIA", hints: ["Pensamento.", "Mente.", "Criatividade.", "Luz.", "Plano."], meaning: "RepresentaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o mental." },
    { word: "FESTA", hints: ["ComemoraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Bolo.", "MÃƒÆ’Ã‚Âºsica.", "Amigos.", "DanÃƒÆ’Ã‚Â§a."], meaning: "ReuniÃƒÆ’Ã‚Â£o para celebrar." },

    // --- 6 LETRAS ---
    { word: "ESCOLA", hints: ["Estudar.", "Alunos.", "Professor.", "Aulas.", "Saber."], meaning: "Estabelecimento de ensino." },
    { word: "JARDIM", hints: ["Flores.", "Verde.", "Grama.", "Plantas.", "Natureza."], meaning: "Terreno cultivado com plantas." },
    { word: "VIAGEM", hints: ["Turismo.", "Malas.", "FÃƒÆ’Ã‚Â©rias.", "AviÃƒÆ’Ã‚Â£o.", "Estrada."], meaning: "Ato de deslocar-se a outro lugar." },
    { word: "MUSICA", hints: ["Som.", "Melodia.", "Ritmo.", "Instrumento.", "CanÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o."], meaning: "Arte de combinar sons." },
    { word: "AMIGOS", hints: ["Parceria.", "Companhia.", "Lealdade.", "Festa.", "Grupo."], meaning: "Pessoas com quem se tem afeto." },
    { word: "CIDADE", hints: ["PrÃƒÆ’Ã‚Â©dios.", "Ruas.", "Urbano.", "PopulaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Prefeito."], meaning: "Aglomerado urbano." },
    { word: "COMIDA", hints: ["Fome.", "AlmoÃƒÆ’Ã‚Â§o.", "Jantar.", "Sabor.", "NutriÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o."], meaning: "O que se come." },
    { word: "BRASIL", hints: ["PaÃƒÆ’Ã‚Â­s.", "Verde e amarelo.", "Samba.", "Futebol.", "Sul-americano."], meaning: "Maior paÃƒÆ’Ã‚Â­s da AmÃƒÆ’Ã‚Â©rica do Sul." },
    { word: "JOGADA", hints: ["Esporte.", "Movimento.", "EstratÃƒÆ’Ã‚Â©gia.", "Lance.", "Partida."], meaning: "Ato de jogar." },
    { word: "QUARTO", hints: ["Dormir.", "Cama.", "CÃƒÆ’Ã‚Â´modo.", "Casa.", "Descanso."], meaning: "Aposento para dormir." },
    { word: "ABRACO", hints: ["Carinho.", "BraÃƒÆ’Ã‚Â§os.", "Aperto.", "Afeto.", "Cumprimento."], meaning: "EnlaÃƒÆ’Ã‚Â§amento com os braÃƒÆ’Ã‚Â§os." },
    { word: "FUTURO", hints: ["AmanhÃƒÆ’Ã‚Â£.", "Destino.", "Tempo.", "Vir a ser.", "Adiante."], meaning: "Tempo que hÃƒÆ’Ã‚Â¡ de vir." },
    { word: "POESIA", hints: ["Rima.", "Versos.", "Arte.", "Escrita.", "Amor."], meaning: "Arte de compor versos." },
    { word: "BOSQUE", hints: ["ÃƒÆ’Ã‚Ârvores.", "Floresta.", "Natureza.", "Verde.", "Passeio."], meaning: "Pequena floresta." },
    { word: "TROVAO", hints: ["Barulho.", "Tempestade.", "Raio.", "CÃƒÆ’Ã‚Â©u.", "Estrondo."], meaning: "RuÃƒÆ’Ã‚Â­do provocado pelo raio." },

    // --- 7 LETRAS ---
    { word: "GUITARRA", hints: ["MÃƒÆ’Ã‚Âºsica.", "Cordas.", "Rock.", "Solo.", "ElÃƒÆ’Ã‚Â©trica."], meaning: "Instrumento musical de cordas." },
    { word: "VAMPIRO", hints: ["Sangue.", "Dentes.", "Noite.", "Morcego.", "DrÃƒÆ’Ã‚Â¡cula."], meaning: "Criatura mitolÃƒÆ’Ã‚Â³gica que bebe sangue." },
    { word: "ESTRELA", hints: ["CÃƒÆ’Ã‚Â©u.", "Brilho.", "Noite.", "EspaÃƒÆ’Ã‚Â§o.", "Pontas."], meaning: "Corpo celeste luminoso." },
    { word: "FAMILIA", hints: ["Parentes.", "Casa.", "Sangue.", "UniÃƒÆ’Ã‚Â£o.", "Genealogia."], meaning: "Grupo de pessoas com laÃƒÆ’Ã‚Â§os sanguÃƒÆ’Ã‚Â­neos." },
    { word: "PERFUME", hints: ["Cheiro.", "Frasco.", "Aroma.", "EssÃƒÆ’Ã‚Âªncia.", "Flor."], meaning: "LÃƒÆ’Ã‚Â­quido aromÃƒÆ’Ã‚Â¡tico." },
    { word: "FUTEBOL", hints: ["Esporte.", "Gol.", "Bola.", "Campo.", "Time."], meaning: "Esporte jogado com os pÃƒÆ’Ã‚Â©s." },
    { word: "CORAGEM", hints: ["Bravura.", "Medo.", "HerÃƒÆ’Ã‚Â³i.", "Enfrentar.", "Valente."], meaning: "Moral forte perante o perigo." },
    { word: "DESTINO", hints: ["Futuro.", "Sorte.", "Caminho.", "Fado.", "Final."], meaning: "O que estÃƒÆ’Ã‚Â¡ determinado a acontecer." },
    { word: "OCEANOS", hints: ["ÃƒÆ’Ã‚Âgua.", "Azul.", "Terra.", "Mar.", "Profundo."], meaning: "Grandes massas de ÃƒÆ’Ã‚Â¡gua salgada." },
    { word: "FLORESTA", hints: ["ÃƒÆ’Ã‚Ârvores.", "Selva.", "Verde.", "Animais.", "Mata."], meaning: "Grande extensÃƒÆ’Ã‚Â£o de ÃƒÆ’Ã‚Â¡rvores." },
    { word: "ESPELHO", hints: ["Reflexo.", "Vidro.", "Imagem.", "Olhar.", "Vaidade."], meaning: "SuperfÃƒÆ’Ã‚Â­cie que reflete a imagem." },
    { word: "RAPOSAS", hints: ["Animal.", "Esperta.", "Laranja.", "Cauda.", "Mato."], meaning: "MamÃƒÆ’Ã‚Â­fero carnÃƒÆ’Ã‚Â­voro." },
    { word: "PLANETA", hints: ["Terra.", "EspaÃƒÆ’Ã‚Â§o.", "Orbita.", "Mundo.", "Sol."], meaning: "Corpo celeste que orbita uma estrela." },
    { word: "ABELHAS", hints: ["Mel.", "Inseto.", "Colmeia.", "FerrÃƒÆ’Ã‚Â£o.", "Rainha."], meaning: "Inseto produtor de mel." },
    { word: "CORRIDA", hints: ["Velocidade.", "Esporte.", "Pressa.", "PÃƒÆ’Ã‚Â©s.", "Chegada."], meaning: "Ato de correr." },

    // --- 8 LETRAS ---
    { word: "CACHORRO", hints: ["Latir.", "Animal.", "Amigo.", "Osso.", "DomÃƒÆ’Ã‚Â©stico."], meaning: "Melhor amigo do homem." },
    { word: "ELEFANTE", hints: ["Grande.", "Tromba.", "ÃƒÆ’Ã‚Âfrica.", "Pesado.", "Cinza."], meaning: "Maior animal terrestre." },
    { word: "DINHEIRO", hints: ["Pagar.", "Moeda.", "Banco.", "Compra.", "Riqueza."], meaning: "Meio de troca de valores." },
    { word: "PRESENTE", hints: ["AniversÃƒÆ’Ã‚Â¡rio.", "Dar.", "Caixa.", "Agora.", "Natal."], meaning: "Objeto oferecido a alguÃƒÆ’Ã‚Â©m." },
    { word: "HISTORIA", hints: ["Passado.", "Livro.", "Tempo.", "Fatos.", "Contar."], meaning: "Narrativa de eventos passados." },
    { word: "NATUREZA", hints: ["Verde.", "Matas.", "Animais.", "Terra.", "Vida."], meaning: "Mundo fÃƒÆ’Ã‚Â­sico e seus fenÃƒÆ’Ã‚Â´menos." },
    { word: "LIBERDADE", hints: ["Livre.", "Voo.", "PrisÃƒÆ’Ã‚Â£o (oposto).", "Direito.", "Escolha."], meaning: "Poder de agir segundo a prÃƒÆ’Ã‚Â³pria vontade." },
    { word: "TRABALHO", hints: ["Emprego.", "SalÃƒÆ’Ã‚Â¡rio.", "OfÃƒÆ’Ã‚Â­cio.", "EsforÃƒÆ’Ã‚Â§o.", "ProfissÃƒÆ’Ã‚Â£o."], meaning: "Atividade produtiva." },
    { word: "UNIVERSO", hints: ["EspaÃƒÆ’Ã‚Â§o.", "Tudo.", "GalÃƒÆ’Ã‚Â¡xias.", "Infinito.", "Estrelas."], meaning: "Conjunto de tudo o que existe." },
    { word: "SAUDADES", hints: ["Falta.", "LembranÃƒÆ’Ã‚Â§a.", "DistÃƒÆ’Ã‚Â¢ncia.", "Sentimento.", "Nostalgia."], meaning: "Sentimento de falta de alguÃƒÆ’Ã‚Â©m." },

    // --- 9 LETRAS ---
    { word: "ESPERANCA", hints: ["FÃƒÆ’Ã‚Â©.", "Futuro.", "Acreditar.", "Verde.", "Sonho."], meaning: "Sentimento de quem vÃƒÆ’Ã‚Âª como possÃƒÆ’Ã‚Â­vel o que deseja." },
    { word: "FELICIDADE", hints: ["Alegria.", "Sorriso.", "Bem-estar.", "Contente.", "EmoÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o."], meaning: "Estado de quem ÃƒÆ’Ã‚Â© feliz." },
    { word: "BORBOLETA", hints: ["Inseto.", "Voar.", "Colorida.", "Casulo.", "TransformaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o."], meaning: "Inseto de asas coloridas." },
    { word: "GEOGRAFIA", hints: ["Mapas.", "Terra.", "PaÃƒÆ’Ã‚Â­ses.", "Estudo.", "Relevo."], meaning: "CiÃƒÆ’Ã‚Âªncia que estuda a superfÃƒÆ’Ã‚Â­cie terrestre." },
    { word: "AVENTURA", hints: ["Risco.", "Viagem.", "AÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Explorar.", "Adrenalina."], meaning: "ExperiÃƒÆ’Ã‚Âªncia arriscada ou emocionante." },
    { word: "CHOCOLATE", hints: ["Doce.", "Cacau.", "Marrom.", "PÃƒÆ’Ã‚Â¡scoa.", "Comer."], meaning: "Alimento feito de cacau." },
    { word: "PRINCESA", hints: ["Reino.", "Coroa.", "Conto de fadas.", "Castelo.", "Filha do rei."], meaning: "Filha de rei ou rainha." },
    { word: "TECNOLOGIA", hints: ["Computador.", "Futuro.", "InovaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Digital.", "MÃƒÆ’Ã‚Â¡quinas."], meaning: "AplicaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de conhecimento cientÃƒÆ’Ã‚Â­fico." },
    { word: "LITERATURA", hints: ["Livros.", "Escrita.", "Autores.", "Poesia.", "Texto."], meaning: "Arte de escrever." },
    { word: "PROFESSOR", hints: ["Ensino.", "Escola.", "Mestre.", "Aula.", "Aprender."], meaning: "Aquele que ensina." },

    // --- 10 LETRAS ---
    { word: "COMPUTADOR", hints: ["MÃƒÆ’Ã‚Â¡quina.", "Internet.", "Teclado.", "Tela.", "PC."], meaning: "MÃƒÆ’Ã‚Â¡quina eletrÃƒÆ’Ã‚Â´nica de processamento de dados." },
    { word: "RINOCERONTE", hints: ["Animal.", "Chifre.", "Pesado.", "ÃƒÆ’Ã‚Âfrica.", "Forte."], meaning: "Grande mamÃƒÆ’Ã‚Â­fero com chifre no nariz." },
    { word: "MATEMATICA", hints: ["NÃƒÆ’Ã‚Âºmeros.", "Contas.", "Soma.", "Escola.", "LÃƒÆ’Ã‚Â³gica."], meaning: "CiÃƒÆ’Ã‚Âªncia dos nÃƒÆ’Ã‚Âºmeros e formas." },
    { word: "ANIVERSARIO", hints: ["Festa.", "Bolo.", "Idade.", "ParabÃƒÆ’Ã‚Â©ns.", "Data."], meaning: "Dia em que se completa anos." },
    { word: "ASTRONAUTA", hints: ["EspaÃƒÆ’Ã‚Â§o.", "Lua.", "Foguete.", "Nasa.", "Capacete."], meaning: "Viajante espacial." },
    { word: "BRINCADEIRA", hints: ["DiversÃƒÆ’Ã‚Â£o.", "CrianÃƒÆ’Ã‚Â§a.", "Jogo.", "Rir.", "Passatempo."], meaning: "Ato de brincar." },
    { word: "INTELIGENTE", hints: ["Esperto.", "CÃƒÆ’Ã‚Â©rebro.", "Saber.", "GÃƒÆ’Ã‚Âªnio.", "RaciocÃƒÆ’Ã‚Â­nio."], meaning: "Que tem inteligÃƒÆ’Ã‚Âªncia." },
    { word: "RESILIENCIA", hints: ["ForÃƒÆ’Ã‚Â§a.", "Superar.", "Adaptar.", "Voltar.", "Persistir."], meaning: "Capacidade de se recuperar de dificuldades." },
    { word: "SENTIMENTO", hints: ["EmoÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "CoraÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Amor.", "ÃƒÆ’Ã¢â‚¬Å“dio.", "Sentir."], meaning: "Ato ou efeito de sentir." },
    { word: "CATASTROFE", hints: ["Desastre.", "Caos.", "DestruiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Ruim.", "Acidente."], meaning: "Grande desgraÃƒÆ’Ã‚Â§a ou infortÃƒÆ’Ã‚Âºnio." },

    // --- 11 a 13 LETRAS ---
    { word: "CURIOSIDADE", hints: ["Saber.", "Pergunta.", "Descobrir.", "Interesse.", "Xereta."], meaning: "Vontade de ver ou aprender algo." },
    { word: "ELETRICIDADE", hints: ["Luz.", "Choque.", "Tomada.", "Energia.", "Fios."], meaning: "Forma de energia." },
    { word: "UNIVERSIDADE", hints: ["Faculdade.", "Estudo.", "Diploma.", "Campus.", "Superior."], meaning: "InstituiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de ensino superior." },
    { word: "COMUNICACAO", hints: ["Falar.", "Mensagem.", "Troca.", "Conversa.", "MÃƒÆ’Ã‚Â­dia."], meaning: "Ato de transmitir informaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o." },
    { word: "REFRIGERANTE", hints: ["Bebida.", "GÃƒÆ’Ã‚Â¡s.", "Doce.", "Gelado.", "Soda."], meaning: "Bebida nÃƒÆ’Ã‚Â£o alcoÃƒÆ’Ã‚Â³lica gaseificada." },
    { word: "SOLIDARIEDADE", hints: ["Ajuda.", "Apoio.", "Bondade.", "PrÃƒÆ’Ã‚Â³ximo.", "UniÃƒÆ’Ã‚Â£o."], meaning: "CooperaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o mÃƒÆ’Ã‚Âºtua entre pessoas." },
    { word: "TRANSFORMACAO", hints: ["MudanÃƒÆ’Ã‚Â§a.", "Virar.", "EvoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Metamorfose.", "Diferente."], meaning: "Ato de transformar." },
    { word: "INDEPENDENCIA", hints: ["Livre.", "PaÃƒÆ’Ã‚Â­s.", "Autonomia.", "Sozinho.", "7 de setembro."], meaning: "Estado de quem nÃƒÆ’Ã‚Â£o depende de outro." },
    { word: "ARQUITETURA", hints: ["PrÃƒÆ’Ã‚Â©dios.", "Projeto.", "Desenho.", "ConstruÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o.", "Arte."], meaning: "Arte de projetar e edificar." },
    { word: "CONHECIMENTO", hints: ["Saber.", "Estudo.", "Mente.", "Aprender.", "Sabedoria."], meaning: "Ato de conhecer ou saber." },

    // --- 14 a 20 LETRAS (DIFÃƒÆ’Ã‚ÂCIL) ---
    { word: "PARALELEPIPEDO", hints: ["Rua.", "Pedra.", "CalÃƒÆ’Ã‚Â§ada.", "Bloco.", "Geometria."], meaning: "SÃƒÆ’Ã‚Â³lido geomÃƒÆ’Ã‚Â©trico ou pedra de calÃƒÆ’Ã‚Â§amento." },
    { word: "DESENVOLVIMENTO", hints: ["Crescer.", "Progresso.", "AvanÃƒÆ’Ã‚Â§o.", "Melhora.", "Evoluir."], meaning: "Ato de desenvolver-se." },
    { word: "RESPONSABILIDADE", hints: ["Dever.", "Adulto.", "Cuidar.", "Culpa.", "SÃƒÆ’Ã‚Â©rio."], meaning: "ObrigaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de responder pelas prÃƒÆ’Ã‚Â³prias aÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes." },
    { word: "SUSTENTABILIDADE", hints: ["Natureza.", "Futuro.", "Reciclar.", "Verde.", "Planeta."], meaning: "Uso consciente dos recursos naturais." },
    { word: "INCONSTITUCIONAL", hints: ["Lei.", "Proibido.", "Contra.", "Regra.", "JurÃƒÆ’Ã‚Â­dico."], meaning: "Que ÃƒÆ’Ã‚Â© contra a constituiÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o." },
    { word: "OTORRINOLARINGOLOGISTA", hints: ["MÃƒÆ’Ã‚Â©dico.", "Garganta.", "Nariz.", "Ouvido.", "Nome comprido."], meaning: "MÃƒÆ’Ã‚Â©dico especialista em ouvido, nariz e garganta." },
    { word: "INDEPENDENTEMENTE", hints: ["Sem depender.", "Apesar.", "Livre.", "Sozinho.", "AdvÃƒÆ’Ã‚Â©rbio."], meaning: "De modo independente." },
    { word: "REVOLUCIONARIO", hints: ["MudanÃƒÆ’Ã‚Â§a.", "Guerra.", "Novo.", "LÃƒÆ’Ã‚Â­der.", "Transformar."], meaning: "Que causa revoluÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o." },
    { word: "EXTRAORDINARIO", hints: ["IncrÃƒÆ’Ã‚Â­vel.", "Fora do comum.", "Especial.", "Raro.", "ÃƒÆ’Ã¢â‚¬Å“timo."], meaning: "Que nÃƒÆ’Ã‚Â£o ÃƒÆ’Ã‚Â© ordinÃƒÆ’Ã‚Â¡rio ou comum." },
    { word: "INTERNACIONALIZACAO", hints: ["Mundo.", "Global.", "PaÃƒÆ’Ã‚Â­ses.", "Exterior.", "Expandir."], meaning: "Tornar algo internacional." }
];

let usedIndices = [];
const CAMPAIGN_LEVEL_START = 3;
const CAMPAIGN_LEVEL_END = 22;
const CAMPAIGN_WORDS_TO_COMPLETE = 5;
const CAMPAIGN_PROGRESS_STORAGE_KEY = 'magiclexis_campaign_progress_v1';
const CAMPAIGN_LEVELS = Array.from(
    { length: CAMPAIGN_LEVEL_END - CAMPAIGN_LEVEL_START + 1 },
    (_, index) => CAMPAIGN_LEVEL_START + index
);
const challengesByLength = new Map();

allChallenges.forEach((challenge) => {
    const wordLength = challenge.word.length;
    if (!challengesByLength.has(wordLength)) {
        challengesByLength.set(wordLength, []);
    }
    challengesByLength.get(wordLength).push(challenge);
});

function sanitizeGameText(value) {
    if (value == null) return '';
    if (typeof value !== 'string') return String(value);
    let text = value;
    const replacements = [
        ['ÃƒÆ’Ã‚Â§', 'ç'],
        ['ÃƒÆ’Ã‚Â£', 'ã'],
        ['ÃƒÆ’Ã‚Â¡', 'á'],
        ['ÃƒÆ’Ã‚Â©', 'é'],
        ['ÃƒÆ’Ã‚Âª', 'ê'],
        ['ÃƒÆ’Ã‚Â­', 'í'],
        ['ÃƒÆ’Ã‚Â³', 'ó'],
        ['ÃƒÆ’Ã‚Âº', 'ú'],
        ['ÃƒÆ’Ã‚Â¢', 'â'],
        ['ÃƒÆ’Ã‚Â´', 'ô'],
        ['ÃƒÆ’Ã‚Â€', 'À'],
        ['ÃƒÆ’Ã‚Â', 'Á'],
        ['ÃƒÆ’Ã‚Â‰', 'É'],
        ['ÃƒÆ’Ã‚Â', 'Í'],
        ['ÃƒÆ’Ã‚Â“', 'Ó'],
        ['ÃƒÆ’Ã‚Âš', 'Ú'],
        ['ÃƒÆ’Ã‚Âƒ', 'Ã'],
        ['ÃƒÆ’Ã‚Â‰', 'É'],
        ['ÃƒÆ’Ã‚Â“', 'Ó'],
        ['ÃƒÆ’Ã¢â‚¬Å“', 'Ó'],
        ['ÃƒÆ’Ã¢â‚¬Â', 'Õ'],
        ['ÃƒÆ’Ã¢â‚¬Â¢', 'â'],
        ['ÃƒÆ’Ã¢â‚¬Ëœ', "'"],
        ['ÃƒÆ’Ã¢â‚¬â„¢', "'"],
        ['ÃƒÆ’Ã¢â‚¬Å¡', ','],
        ['ÃƒÆ’Ã¢â‚¬Â¦', '...'],
        ['ÃƒÆ’Ã¢â‚¬Å¾', '"'],
        ['ÃƒÆ’Ã¢â‚¬Â', '"'],
        ['ÃƒÆ’Ã‚Â ', 'à'],
        ['ÃƒÆ’Ã‚Â¨', 'è'],
        ['ÃƒÆ’Ã‚Â¬', 'ì'],
        ['ÃƒÆ’Ã‚Â²', 'ò'],
        ['ÃƒÆ’Ã‚Â¹', 'ù'],
        ['Ãƒâ€šÃ‚Â¿', ''],
        ['Ãƒâ€šÃ‚Â½', ''],
        ['Ãƒâ€šÃ‚Â ', ''],
        ['Ãƒâ€šÃ‚', ''],
        ['Â', '']
    ];

    for (let pass = 0; pass < 3; pass++) {
        let changed = false;

        for (const [broken, fixed] of replacements) {
            if (text.includes(broken)) {
                text = text.split(broken).join(fixed);
                changed = true;
            }
        }

        if (!changed) break;
    }

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
const modeSelector = document.getElementById('mode-selector');
const modeWarning = document.getElementById('mode-warning');
const challengeSelectorHelp = document.getElementById('challenge-selector-help');
const campaignScreen = document.getElementById('campaign-screen');
const campaignBooksGrid = document.getElementById('campaign-books-grid');
const campaignBackBtn = document.getElementById('campaign-back-btn');
const campaignProgressSummary = document.getElementById('campaign-progress-summary');
const onlineScreen = document.getElementById('online-screen');
const onlineBackBtn = document.getElementById('online-back-btn');
const onlineStatusBanner = document.getElementById('online-status-banner');
const onlineCreateRoomBtn = document.getElementById('online-create-room-btn');
const onlineJoinRoomBtn = document.getElementById('online-join-room-btn');
const onlineRoomCodeInput = document.getElementById('online-room-code-input');
const onlineRoomPanel = document.getElementById('online-room-panel');
const onlineRoomCodeDisplay = document.getElementById('online-room-code-display');
const onlineCopyCodeBtn = document.getElementById('online-copy-code-btn');
const onlineRoomState = document.getElementById('online-room-state');
const onlinePlayerSelf = document.getElementById('online-player-self');
const onlinePlayerOpponent = document.getElementById('online-player-opponent');
const onlineRoomOpponentStatus = document.getElementById('online-room-opponent-status');
const onlineRoomLeaveBtn = document.getElementById('online-room-leave-btn');
const onlineMatchBanner = document.getElementById('online-match-banner');
const onlineRoomBannerCode = document.getElementById('online-room-banner-code');
const onlineOpponentBannerStatus = document.getElementById('online-opponent-banner-status');
const campaignCompleteModal = document.getElementById('campaign-level-complete-modal');
const closeCampaignCompleteModalBtn = document.getElementById('close-campaign-complete-modal');
const campaignCompleteTitle = document.getElementById('campaign-complete-title');
const campaignCompleteCopy = document.getElementById('campaign-complete-copy');
const campaignCompleteCurrentLevel = document.getElementById('campaign-complete-current-level');
const campaignCompleteNextLevel = document.getElementById('campaign-complete-next-level');
const campaignCompleteFinalCopy = document.getElementById('campaign-complete-final-copy');
const campaignCompleteNextBtn = document.getElementById('campaign-complete-next-btn');
const campaignCompleteBooksBtn = document.getElementById('campaign-complete-books-btn');
const onlineResultModal = document.getElementById('online-result-modal');
const closeOnlineResultModalBtn = document.getElementById('close-online-result-modal');
const onlineResultTitle = document.getElementById('online-result-title');
const onlineResultCopy = document.getElementById('online-result-copy');
const onlineResultSelfTime = document.getElementById('online-result-self-time');
const onlineResultOpponentTime = document.getElementById('online-result-opponent-time');
const onlineResultSelfErrors = document.getElementById('online-result-self-errors');
const onlineResultOpponentErrors = document.getElementById('online-result-opponent-errors');
const onlineResultRematchBtn = document.getElementById('online-result-rematch-btn');
const onlineResultMenuBtn = document.getElementById('online-result-menu-btn');

let currentWord = [];
let replaceIndex = 0;
let isFirstRound = true; 
let targetChallenge = null;
let hintIndex = 0;
let hintInterval = null;
let maxWordLength = 0;
let lastTouchStartY = 0;
let currentCampaignLevel = null;
let campaignProgress = null;
let highlightedCampaignLevel = null;
let pendingCampaignCompletion = null;
let isValidationInProgress = false;
let isGameplayTransitionLocked = false;
let onlineRoomUnsubscribe = null;
let currentOnlineRoomCode = null;
let currentOnlinePlayerSlot = null;
let currentOnlineRoom = null;
let currentOnlineStartedAt = null;
let currentOnlineStartedRoomToken = null;
let currentOnlineLocalErrors = 0;
let currentOnlineResultShown = false;
let currentOnlineLeaving = false;
let onlineProgressSyncTimeout = null;
let preserveCurrentViewOnAuthSync = false;

// --- VARIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂVEIS DA GALINHA E MENSAGENS ---
let consecutiveErrors = 0;
let chickenAlreadySummoned = false; // Trava para a galinha voar sÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³ 1 vez
let feedbackTimeout = null; // Trava para a mensagem durar exatos 6 segundos

const funnyPhrases = [
    "Que isso, vocÃƒÆ’Ã‚Âª estÃƒÆ’Ã‚Â¡ inventando palavra nova?",
    "Essa nem o dicionÃƒÆ’Ã‚Â¡rio reconhece.",
    "Calma, respira... nÃƒÆ’Ã‚Â£o ÃƒÆ’Ã‚Â© um teclado musical.",
    "Quase! SÃƒÆ’Ã‚Â³ faltou acertar.",
    "Essa passou longe, mas vocÃƒÆ’Ã‚Âª chega lÃƒÆ’Ã‚Â¡.",
    "Se errar valesse ponto, vocÃƒÆ’Ã‚Âª estava liderando.",
    "Foi ousado. Errado, mas ousado.",
    "Essa palavra veio de outra dimensÃƒÆ’Ã‚Â£o.",
    "Bora de novo, agora vai.",
    "VocÃƒÆ’Ã‚Âª consegue, sÃƒÆ’Ã‚Â³ ajusta a estratÃƒÆ’Ã‚Â©gia."
];
for (let i = 0; i < funnyPhrases.length; i++) {
    funnyPhrases[i] = sanitizeGameText(funnyPhrases[i]);
}
// --- NOVA VARIÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂVEL: SACOLA DE FRASES ---
let unusedPhrases = [...funnyPhrases];

/* --- MOBILE MENU LOGIC --- */
const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileOverlay = document.getElementById('mobile-overlay');
const mobileGameplayDrawer = document.getElementById('mobile-gameplay-drawer');
const mobileHistorySlot = document.getElementById('mobile-history-slot');
const mobileNotepadSlot = document.getElementById('mobile-notepad-slot');

// MENU DO ALFABETO
const alphabetDrawer = document.getElementById('alphabet-drawer');
const mobileAlphabetBtn = document.getElementById('mobile-alphabet-btn');
const mobileRulesSlot = document.getElementById('mobile-rules-slot');
const mobileToolsSlot = document.getElementById('mobile-tools-slot');
const mobileVictoryModal = document.getElementById('mobile-victory-modal');
const mobileErrorModal = document.getElementById('mobile-error-modal');
const mobileErrorPhraseEl = document.getElementById('mobile-error-phrase');
const sidebarMageContainer = document.querySelector('.mage-container');
let mobileLayoutPrepared = false;
let popupHidDesktopMage = false;
let lastMobileMenuToggleAt = 0;

function applyMobileSidebarState(open) {
    if (!mobileOverlay || !isMobileViewport()) return;

    if (open) {
        if (mobileGameplayDrawer) {
            mobileGameplayDrawer.classList.remove('hidden-control');
            mobileGameplayDrawer.classList.add('mobile-open');
        }
        Object.assign(mobileOverlay.style, {
            display: 'block',
            pointerEvents: 'auto'
        });
        if (sidebar) {
            Object.assign(sidebar.style, {
                left: '',
                visibility: '',
                pointerEvents: '',
                zIndex: ''
            });
        }
    } else {
        if (mobileGameplayDrawer) {
            mobileGameplayDrawer.classList.add('hidden-control');
            mobileGameplayDrawer.classList.remove('mobile-open');
        }
        Object.assign(mobileOverlay.style, {
            display: '',
            pointerEvents: ''
        });
    }
}

function isMobileGameplayDrawerOpen() {
    return !!mobileGameplayDrawer && mobileGameplayDrawer.classList.contains('mobile-open');
}

function applyLegacySidebarReset() {
    if (!sidebar) return;
    Object.assign(sidebar.style, {
        left: '',
        visibility: '',
        pointerEvents: '',
        zIndex: ''
    });
}

function toggleMobileMenu() {
    const now = Date.now();
    if (now - lastMobileMenuToggleAt < 250) return;
    lastMobileMenuToggleAt = now;

    const isOpen = isMobileGameplayDrawerOpen();
    applyMobileSidebarState(!isOpen);
    applyLegacySidebarReset();
    if (alphabetDrawer) alphabetDrawer.classList.remove('mobile-open');
    checkOverlay();
}

function toggleAlphabetMenu() {
    alphabetDrawer.classList.toggle('mobile-open');
    applyMobileSidebarState(false);
    checkOverlay();
}

function checkOverlay() {
    if (isMobileGameplayDrawerOpen() || alphabetDrawer.classList.contains('mobile-open')) {
        mobileOverlay.classList.add('active');
    } else {
        mobileOverlay.classList.remove('active');
    }
}

function closeMobilePanels() {
    applyMobileSidebarState(false);
    if (alphabetDrawer) alphabetDrawer.classList.remove('mobile-open');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
}

function applyMobileMenuButtonState(visible) {
    if (!mobileMenuBtn) return;

    if (!isMobileViewport()) {
        mobileMenuBtn.style.display = 'none';
        applyMobileSidebarState(false);
        return;
    }

    if (visible) {
        Object.assign(mobileMenuBtn.style, {
            display: 'flex',
            position: 'fixed',
            top: 'calc(env(safe-area-inset-top, 0px) + 12px)',
            left: '12px',
            width: '56px',
            height: '56px',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '12000',
            opacity: '1',
            visibility: 'visible',
            pointerEvents: 'auto'
        });
    } else {
        mobileMenuBtn.style.display = 'none';
        applyMobileSidebarState(false);
    }
}

function setMobileGameplayMenuVisibility(visible) {
    const canUseMobileUi = isMobileViewport() && !!mobileMenuBtn;
    document.body.classList.toggle('mobile-gameplay-active', canUseMobileUi && !!visible);

    if (!canUseMobileUi) return;
    if (visible) {
        mobileMenuBtn.classList.remove('hidden-control');
        applyMobileMenuButtonState(true);
    } else {
        mobileMenuBtn.classList.add('hidden-control');
        applyMobileMenuButtonState(false);
        closeMobilePanels();
    }
}

// Eventos Mobile
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('pointerup', (e) => {
        e.preventDefault();
        toggleMobileMenu();
    });
}
if(mobileAlphabetBtn) mobileAlphabetBtn.onclick = toggleAlphabetMenu;

if(mobileOverlay) {
    mobileOverlay.onclick = () => {
        closeMobilePanels();
    }; 
}


function clearAllHighlights() {
    document.querySelectorAll('.rule-card').forEach(card => card.classList.remove('rule-active'));
}

/* NOVO: PREENCHE O SELETOR COM OPÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ES DISPONÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂVEIS */
function populateLengthOptions() {
    const lengths = [...challengesByLength.keys()].sort((a, b) => a - b);

    lengths.forEach(len => {
        const option = document.createElement('option');
        option.value = len;
        option.innerText = `${len} Letras`;
        lengthSelector.appendChild(option);
    });
}

function pickRandomChallengeByLength(wordLength) {
    const pool = challengesByLength.get(wordLength) || [];
    if (!pool.length) return null;
    const randIdx = Math.floor(Math.random() * pool.length);
    return pool[randIdx];
}

function pickRandomCampaignChallenge(wordLength) {
    const pool = challengesByLength.get(wordLength) || [];
    if (!pool.length) return null;

    const lastWord = targetChallenge?.word || '';
    const filteredPool = pool.length > 1
        ? pool.filter((challenge) => challenge.word !== lastWord)
        : pool;

    const randIdx = Math.floor(Math.random() * filteredPool.length);
    return filteredPool[randIdx] || pool[0];
}

function startRandomChallenge() {
    currentGameMode = RANDOM_MODE;
    currentCampaignLevel = null;
    resetDailySession();
    clearAllHighlights();
    animateMage('reset');

    const eligibleLengths = CAMPAIGN_LEVELS.filter((level) => (challengesByLength.get(level) || []).length > 0);
    const randomLength = eligibleLengths[Math.floor(Math.random() * eligibleLengths.length)] || 3;
    const selectedChallenge = pickRandomChallengeByLength(randomLength) || allChallenges[0];

    startChallengeEngine(selectedChallenge, {
        wordLength: selectedChallenge.word.length,
        resetHistory: false
    });
}

function startCampaignLevel(level) {
    const challenge = pickRandomCampaignChallenge(level);
    if (!challenge) {
        showFloatingMessage('Esse livro ainda nao possui palavras cadastradas.', 2600);
        return;
    }

    currentGameMode = CAMPAIGN_MODE;
    currentCampaignLevel = level;
    highlightedCampaignLevel = null;
    resetDailySession();
    clearAllHighlights();
    animateMage('reset');
    showGameScreen();

    startChallengeEngine(challenge, {
        wordLength: level,
        resetHistory: false
    });
}

function initChallenge() {
    startRandomChallenge();
}

function startChallengeEngine(challengeData, options = {}) {
    isGameplayTransitionLocked = false;
    isValidationInProgress = false;
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
    if (currentGameMode !== ONLINE_MODE) {
        showControl(onlineMatchBanner, false);
    }
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
    
    // Descobre qual ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© a letra espelhada baseada na posiÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o (A=0 vira Z=25)
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
        msgDiv.innerHTML = sanitizeGameText('Digite uma letra no campo abaixo onde tem uma interrogaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o para comeÃƒÆ’Ã‚Â§ar');
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
            // Primeiro clique - Pede confirmaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o
            clearBoardBtn.innerText = "CERTEZA?";
            clearBoardBtn.style.background = "var(--error)";
            clearBoardBtn.style.color = "#fff";
            clearConfirmState = true;

            // Reseta o botÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o apÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³s 3 segundos se nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o clicar novamente
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
            queueOnlineProgressSync();
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
    if (isGameplayTransitionLocked) return;
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
        // --- NOVO: LIMPA O TABULEIRO QUANDO VOLTA PRO INÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂCIO --- //
        playSoundEffect('overwrite');
        
        // Resetamos o array e o ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­ndice para comeÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ar uma palavra nova "limpa"
        currentWord = [];
        replaceIndex = 0;
        
        // Processa a letra que o usuÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡rio acabou de digitar na nova posiÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o 0
        processNewChar(char, 0);

        showFloatingMessage("Ciclo Reiniciado! Tabuleiro limpo.", 2500);

    } else {
        playSoundEffect('type');
        processNewChar(char, currentWord.length);
        
        // AVISO NA PENÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡LTIMA LETRA (N-1)
        if (currentWord.length === maxWordLength - 1) {
            showFloatingMessage("Pr\u00f3xima letra \u00e9 a \u00faltima! O ciclo vai reiniciar.", 2500);
            playSoundEffect('alert');
        }
        
        if (currentWord.length >= maxWordLength) {
            replaceIndex = 0;
        }
    }
    saveGameSessionState();
    queueOnlineProgressSync();
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
    if (isGameplayTransitionLocked || isValidationInProgress) return;
    const word = currentWord.join('').toUpperCase();
    if (word.length < 2) return;
    isValidationInProgress = true;

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
            const info = normalizeCallableError(err);
            console.error('submitDailyGuess erro', info);
            feedback.style.color = 'var(--error)';
            showErrorMageFeedback(takeFunnyPhrase());
            return;
        } finally {
            isValidationInProgress = false;
        }
    }

    if (targetChallenge && word === targetChallenge.word) {
        isGameplayTransitionLocked = true;
        isValidationInProgress = false;
        validateBtn?.blur();
        if (typeof document.activeElement?.blur === 'function') {
            document.activeElement.blur();
        }
        feedback.innerText = "\u{1F3C6} ACERTOU!"; feedback.style.color = "var(--success)";
        meaningBox.innerText = sanitizeGameText(targetChallenge.meaning);
        meaningBox.classList.remove('hidden');
        document.body.classList.add('success-flash');
        const campaignResult = await handleCorrectAnswer();
        if (currentGameMode === ONLINE_MODE) {
            await finalizeOnlineMatch();
        }

        successSound.play(); playSoundEffect('victory'); triggerConfetti();
        animateMage('win');
        if (!campaignResult?.completedNow && currentGameMode !== ONLINE_MODE) {
            showMobileVictoryPopup();
        }

        stopHintCycle(); clearAllHighlights();

        setTimeout(() => {
            document.body.classList.remove('success-flash');

            if (currentGameMode === CAMPAIGN_MODE && currentCampaignLevel) {
                if (campaignResult?.completedNow) {
                    feedback.innerText = "";
                    openCampaignCompleteModal({
                        currentLevel: currentCampaignLevel,
                        nextLevel: campaignResult?.nextLevel || null
                    });
                } else {
                    startCampaignLevel(currentCampaignLevel);
                    feedback.innerText = "Novo desafio do livro iniciado!";
                }
            } else if (currentGameMode === ONLINE_MODE) {
                feedback.innerText = "Resultado enviado. Aguardando o duelo finalizar...";
                updateOnlineBanner();
            } else {
                startRandomChallenge();
                feedback.innerText = "Novo desafio iniciado!";
            }

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
        if (currentGameMode === ONLINE_MODE) {
            currentOnlineLocalErrors += 1;
            queueOnlineProgressSync();
        }

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
        feedback.style.color = 'var(--error)';
        showErrorMageFeedback(takeFunnyPhrase());
    } finally {
        isValidationInProgress = false;
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
    // Ajuste para nÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o roubar foco se clicar no sidebar mobile
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.classList.contains('letter-box') && !sidebar.contains(e.target) && !alphabetDrawer.contains(e.target)) {
        charInput.focus(); 
    }
};

window.addEventListener('pageshow', () => {
    if (!isMobileViewport() || !charInput) return;
    charInput.blur();
});

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

/* --- ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂUDIO --- */
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

/* --- UTILITÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚ÂRIOS --- */
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

    if (mobileHistorySlot && historySection) {
        mobileHistorySlot.appendChild(historySection);
    }

    if (mobileToolsSlot) {
        mobileToolsSlot.classList.add('hidden-control');
    }

    if (notepadEl && mobileNotepadSlot) {
        mobileNotepadSlot.appendChild(notepadEl);
        notepadEl.classList.add('mobile-notepad-in-sidebar');
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
    if (!mobileVictoryModal) return;
    const isDesktopPopup = !isMobileViewport();
    if (isDesktopPopup && sidebarMageContainer) {
        sidebarMageContainer.classList.add('hidden-control');
        popupHidDesktopMage = true;
    }
    if (mageVictoryPopupTimeout) clearTimeout(mageVictoryPopupTimeout);
    mobileVictoryModal.classList.remove('hidden-control');
    mageVictoryPopupTimeout = setTimeout(() => {
        mobileVictoryModal.classList.add('hidden-control');
        if (isDesktopPopup && popupHidDesktopMage && sidebarMageContainer) {
            sidebarMageContainer.classList.remove('hidden-control');
            popupHidDesktopMage = false;
        }
        mageVictoryPopupTimeout = null;
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
    if (!mobileErrorModal) {
        feedback.innerText = '❌ Tente novamente';
        return;
    }
    if (mobileErrorPhraseEl) {
        mobileErrorPhraseEl.innerText = sanitizeGameText(message || takeFunnyPhrase());
    }
    const isDesktopPopup = !isMobileViewport();
    if (isDesktopPopup && sidebarMageContainer) {
        sidebarMageContainer.classList.add('hidden-control');
        popupHidDesktopMage = true;
    }
    if (mageErrorPopupTimeout) clearTimeout(mageErrorPopupTimeout);
    mobileErrorModal.classList.remove('hidden-control');
    mageErrorPopupTimeout = setTimeout(() => {
        mobileErrorModal.classList.add('hidden-control');
        if (isDesktopPopup && popupHidDesktopMage && sidebarMageContainer) {
            sidebarMageContainer.classList.remove('hidden-control');
            popupHidDesktopMage = false;
        }
        mageErrorPopupTimeout = null;
    }, 3000);
}

function showErrorMageFeedback(message = '') {
    showMobileErrorMagePopup(message);
    feedback.innerText = "";
}

let tutorialPageIndex = 0;
let tutorialPageCount = 0;
let mageVictoryPopupTimeout = null;
let mageErrorPopupTimeout = null;

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
    
    // NOVO: Preenche as opÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes de desafio
    populateLengthOptions();

    if (lengthSelector.querySelector('option[value="3"]')) {
        lengthSelector.value = '3';
    }
    syncModeSelectionUi();
    setupMobileLayout();
    initBookTutorial();

    startMageIdle();
    // initChallenge ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© chamado apenas quando clica em START agora
});

// LOGICA DO BOTAO DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    markTutorialSeen();
    beginSelectedGameFlow();

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

campaignBackBtn?.addEventListener('click', () => {
    openWelcomeTutorial(true);
});

// BotÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes futuros
document.getElementById("hub-profile").addEventListener("click", () => {
    openProfileModal();
});

document.getElementById("hub-tournaments").addEventListener("click", () => {
    alert("Torneios em breve ??");
});

document.getElementById("hub-ranking").addEventListener("click", () => {
    openRankingModal();
});
/* --- LÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¦ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã¢â‚¬Å“GICA DO SELETOR DE MODO DE JOGO --- */
document.addEventListener("DOMContentLoaded", () => {
    const modeSelector = document.getElementById('mode-selector');
    const modeWarning = document.getElementById('mode-warning');

    if (modeSelector) {
        modeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;
            if (selectedMode === CAMPAIGN_MODE || selectedMode === RANDOM_MODE || selectedMode === ONLINE_MODE) {
                syncModeSelectionUi();
                return;
            }

            // Se o modo escolhido NÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¾ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢O for 'solo'
            if (selectedMode !== 'solo') {
                // Toca som de erro (se o contexto de ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡udio estiver ativo)
                if (typeof playSoundEffect === 'function') {
                    playSoundEffect('error');
                    // Tenta animar o mago para 'triste' se ele estiver visÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â­vel
                    if (typeof animateMage === 'function') animateMage('sad');
                }

                // Mostra a mensagem de aviso
                modeWarning.style.display = 'block';
                modeWarning.classList.add('popIn'); // Reusa sua animaÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â§ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£o de popIn

                // Reseta o seletor para "Solo" automaticamente
                e.target.value = 'solo';

                // Esconde a mensagem apÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â³s 3 segundos
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
const IS_LOCAL_DEV = ['127.0.0.1', 'localhost'].includes(window.location.hostname);
let isUsingLocalDevSession = false;

const DAILY_MODE = 'daily';
const RANDOM_MODE = 'random';
const CAMPAIGN_MODE = 'campaign';
const ONLINE_MODE = 'online_1v1';
const ONLINE_ROOM_COLLECTION = 'rooms';
const ONLINE_ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
let currentGameMode = RANDOM_MODE;
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

function getCampaignProgressStorageKey() {
    const uid = activeUser?.uid || 'guest';
    return `${CAMPAIGN_PROGRESS_STORAGE_KEY}:${uid}`;
}

function getDefaultCampaignProgress() {
    return {
        unlockedLevels: [CAMPAIGN_LEVEL_START],
        completedLevels: [],
        levelProgress: {
            [CAMPAIGN_LEVEL_START]: 0
        }
    };
}

function hasCampaignContent(level) {
    return (challengesByLength.get(level) || []).length > 0;
}

function normalizeCampaignProgress(rawProgress) {
    const base = rawProgress && typeof rawProgress === 'object' ? rawProgress : {};
    const unlockedSet = new Set(
        Array.isArray(base.unlockedLevels)
            ? base.unlockedLevels.map(Number).filter((level) => CAMPAIGN_LEVELS.includes(level))
            : []
    );
    const completedSet = new Set(
        Array.isArray(base.completedLevels)
            ? base.completedLevels.map(Number).filter((level) => CAMPAIGN_LEVELS.includes(level))
            : []
    );

    unlockedSet.add(CAMPAIGN_LEVEL_START);

    const levelProgress = {};
    CAMPAIGN_LEVELS.forEach((level) => {
        const rawValue = Number(base?.levelProgress?.[level] ?? 0);
        levelProgress[level] = Math.max(0, Math.min(CAMPAIGN_WORDS_TO_COMPLETE, Number.isFinite(rawValue) ? rawValue : 0));
    });

    completedSet.forEach((level) => {
        levelProgress[level] = CAMPAIGN_WORDS_TO_COMPLETE;
        unlockedSet.add(level);
    });

    return {
        unlockedLevels: [...unlockedSet].sort((a, b) => a - b),
        completedLevels: [...completedSet].sort((a, b) => a - b),
        levelProgress
    };
}

function unlockNextCampaignLevels(progress, completedLevel) {
    const unlockedSet = new Set(progress.unlockedLevels);
    let nextLevel = completedLevel + 1;

    while (nextLevel <= CAMPAIGN_LEVEL_END) {
        unlockedSet.add(nextLevel);
        if (hasCampaignContent(nextLevel)) break;
        nextLevel += 1;
    }

    progress.unlockedLevels = [...unlockedSet].sort((a, b) => a - b);
    return progress;
}

function getCampaignBookTier(level) {
    if (level >= 20) return 'gold';
    if (level >= 19) return 'silver';
    if (level >= 14) return 'bronze';
    return 'standard';
}

function getCampaignBookState(level) {
    if (campaignProgress?.completedLevels?.includes(level)) return 'completed';
    if (campaignProgress?.unlockedLevels?.includes(level)) return 'available';
    return 'locked';
}

function getCampaignSummaryText() {
    if (!campaignProgress) return 'Carregando campanha...';

    const completedCount = campaignProgress.completedLevels.length;
    const nextPlayable = CAMPAIGN_LEVELS.find((level) => getCampaignBookState(level) === 'available' && hasCampaignContent(level));

    if (!nextPlayable) {
        return `Campanha em andamento. ${completedCount} livro(s) concluido(s).`;
    }

    const currentProgress = campaignProgress.levelProgress[nextPlayable] || 0;
    return `Proximo livro jogavel: ${nextPlayable} letras. Progresso atual: ${currentProgress}/${CAMPAIGN_WORDS_TO_COMPLETE}.`;
}

function updateCampaignProgressSummary() {
    if (!campaignProgressSummary) return;
    campaignProgressSummary.innerText = sanitizeGameText(getCampaignSummaryText());
}

function getNextCampaignPlayableLevel(fromLevel, unlockedLevels = []) {
    return [...unlockedLevels]
        .sort((a, b) => a - b)
        .find((level) => level > fromLevel && hasCampaignContent(level)) || null;
}

function closeCampaignCompleteModal() {
    pendingCampaignCompletion = null;
    showControl(campaignCompleteModal, false);
}

function goToCampaignBooks(focusLevel = null) {
    highlightedCampaignLevel = focusLevel;
    closeCampaignCompleteModal();
    showCampaignScreen();
}

function continueToNextCampaignBook() {
    const nextLevel = pendingCampaignCompletion?.nextLevel || null;
    closeCampaignCompleteModal();

    if (nextLevel) {
        startCampaignLevel(nextLevel);
        return;
    }

    showCampaignScreen();
}

function openCampaignCompleteModal(payload = {}) {
    if (!campaignCompleteModal) return;

    const currentLevel = Number(payload.currentLevel || currentCampaignLevel || CAMPAIGN_LEVEL_START);
    const nextLevel = Number(payload.nextLevel || 0) || null;
    pendingCampaignCompletion = { currentLevel, nextLevel };
    highlightedCampaignLevel = nextLevel || currentLevel;

    if (campaignCompleteTitle) {
        campaignCompleteTitle.innerText = nextLevel ? 'Livro Concluido!' : 'Campanha Avancada!';
    }

    if (campaignCompleteCopy) {
        campaignCompleteCopy.innerText = nextLevel
            ? 'O tomo foi dominado com sucesso. Um novo desafio magico acaba de ser desbloqueado.'
            : 'Voce concluiu o ultimo livro disponivel desta fase do grimorio.';
    }

    if (campaignCompleteCurrentLevel) {
        campaignCompleteCurrentLevel.innerText = `${currentLevel} letras`;
    }

    if (campaignCompleteNextLevel) {
        campaignCompleteNextLevel.innerText = nextLevel ? `${nextLevel} letras` : 'Nenhum livro novo';
    }

    if (campaignCompleteFinalCopy) {
        const showFinalMessage = !nextLevel;
        campaignCompleteFinalCopy.innerText = showFinalMessage
            ? 'Voce dominou este ciclo do grimorio! Novos livros poderao surgir em futuras atualizacoes.'
            : '';
        campaignCompleteFinalCopy.classList.toggle('hidden-control', !showFinalMessage);
    }

    if (campaignCompleteNextBtn) {
        campaignCompleteNextBtn.innerText = nextLevel ? 'Próximo Livro' : 'Voltar aos Livros';
    }

    showControl(campaignCompleteModal, true);
}

function syncModeSelectionUi() {
    if (!lengthSelector || !modeSelector) return;

    const selectedMode = modeSelector.value || CAMPAIGN_MODE;
    lengthSelector.disabled = true;

    if (selectedMode === CAMPAIGN_MODE) {
        lengthSelector.value = String(CAMPAIGN_LEVEL_START);
        if (challengeSelectorHelp) {
            challengeSelectorHelp.innerText = 'Na campanha, voce escolhe um livro na proxima tela.';
        }
        if (modeWarning) modeWarning.style.display = 'none';
        return;
    }

    if (selectedMode === ONLINE_MODE) {
        lengthSelector.value = String(CAMPAIGN_LEVEL_START);
        if (challengeSelectorHelp) {
            challengeSelectorHelp.innerText = 'No online 1x1, a sala define a mesma palavra para os dois jogadores.';
        }
        if (modeWarning) {
            modeWarning.style.display = 'block';
            modeWarning.innerText = '⚠️ No online, a sala sorteia automaticamente a quantidade de letras.';
        }
        return;
    }

    lengthSelector.value = 'any';
    if (challengeSelectorHelp) {
        challengeSelectorHelp.innerText = 'No aleatorio, o jogo sorteia automaticamente a quantidade de letras.';
    }
    if (modeWarning) {
        modeWarning.style.display = 'block';
        modeWarning.innerText = '⚠️ No aleatório, a quantidade de letras é sorteada automaticamente.';
    }
}

function hideCampaignScreen() {
    if (campaignScreen) campaignScreen.classList.add('hidden-control');
}

function hideOnlineScreen() {
    if (onlineScreen) onlineScreen.classList.add('hidden-control');
}

function formatOnlineTime(ms) {
    if (!Number.isFinite(ms) || ms < 0) return '--';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    const centiseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${centiseconds}`;
}

function getOnlinePlayerName() {
    return activeUserDoc?.name || activeUser?.displayName || activeUser?.email?.split('@')[0] || 'Visitante';
}

function getOnlinePlayerPhoto() {
    return activeUserDoc?.photo || activeUser?.photoURL || DEFAULT_AVATAR;
}

function getOnlineOpponentSlot(slot) {
    return slot === 'player1' ? 'player2' : 'player1';
}

function getRoomPlayerSlot(roomData, uid = activeUser?.uid) {
    if (!roomData?.players || !uid) return null;
    if (roomData.players.player1?.uid === uid) return 'player1';
    if (roomData.players.player2?.uid === uid) return 'player2';
    return null;
}

function getOnlineCurrentPlayer(roomData = currentOnlineRoom) {
    const slot = currentOnlinePlayerSlot || getRoomPlayerSlot(roomData);
    return slot ? roomData?.players?.[slot] || null : null;
}

function getOnlineOpponentPlayer(roomData = currentOnlineRoom) {
    const slot = currentOnlinePlayerSlot || getRoomPlayerSlot(roomData);
    if (!slot) return null;
    return roomData?.players?.[getOnlineOpponentSlot(slot)] || null;
}

function getOnlinePlayableLengths() {
    return CAMPAIGN_LEVELS.filter((level) => hasCampaignContent(level));
}

function getRandomOnlineChallengePayload() {
    const availableLengths = getOnlinePlayableLengths();
    const letterCount = availableLengths[Math.floor(Math.random() * availableLengths.length)] || CAMPAIGN_LEVEL_START;
    const challenge = pickRandomChallengeByLength(letterCount) || pickRandomCampaignChallenge(CAMPAIGN_LEVEL_START) || allChallenges[0];
    return {
        letterCount,
        challenge: {
            word: challenge?.word || '',
            hints: Array.isArray(challenge?.hints) ? challenge.hints : [],
            meaning: challenge?.meaning || ''
        }
    };
}

function buildOnlineRoomCode() {
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += ONLINE_ROOM_CODE_CHARS[Math.floor(Math.random() * ONLINE_ROOM_CODE_CHARS.length)];
    }
    return code;
}

async function generateUniqueOnlineRoomCode() {
    for (let attempt = 0; attempt < 8; attempt++) {
        const code = buildOnlineRoomCode();
        const existing = await getDoc(doc(db, ONLINE_ROOM_COLLECTION, code));
        if (!existing.exists()) return code;
    }
    throw new Error('Nao foi possivel gerar um codigo de sala livre.');
}

function cleanupOnlineRoomListener() {
    if (typeof onlineRoomUnsubscribe === 'function') {
        onlineRoomUnsubscribe();
    }
    onlineRoomUnsubscribe = null;
}

function resetOnlineRoomState() {
    cleanupOnlineRoomListener();
    currentOnlineRoomCode = null;
    currentOnlinePlayerSlot = null;
    currentOnlineRoom = null;
    currentOnlineStartedAt = null;
    currentOnlineStartedRoomToken = null;
    currentOnlineLocalErrors = 0;
    currentOnlineResultShown = false;
    currentOnlineLeaving = false;
    if (onlineProgressSyncTimeout) {
        clearTimeout(onlineProgressSyncTimeout);
        onlineProgressSyncTimeout = null;
    }
    showControl(onlineRoomPanel, false);
    showControl(onlineMatchBanner, false);
    showControl(onlineResultModal, false);
    if (onlineRoomCodeDisplay) onlineRoomCodeDisplay.innerText = '----';
    if (onlineRoomState) onlineRoomState.innerText = 'Aguardando outro jogador...';
    if (onlinePlayerSelf) onlinePlayerSelf.innerText = getOnlinePlayerName();
    if (onlinePlayerOpponent) onlinePlayerOpponent.innerText = 'Aguardando...';
    if (onlineRoomOpponentStatus) onlineRoomOpponentStatus.innerText = 'Esperando conexão';
    if (onlineStatusBanner) onlineStatusBanner.innerText = 'Entre em uma sala para iniciar um duelo mágico.';
}

function updateOnlineBanner(roomData = currentOnlineRoom) {
    const isOnlineMatch = currentGameMode === ONLINE_MODE && !!roomData && isGameScreenVisible();
    showControl(onlineMatchBanner, isOnlineMatch);
    if (!isOnlineMatch) return;

    const opponent = getOnlineOpponentPlayer(roomData);
    if (onlineRoomBannerCode) {
        onlineRoomBannerCode.innerText = `Sala ${roomData?.roomCode || currentOnlineRoomCode || '----'}`;
    }
    if (onlineOpponentBannerStatus) {
        if (!opponent?.uid) {
            onlineOpponentBannerStatus.innerText = 'Oponente: aguardando...';
        } else if (roomData?.status === 'finished') {
            onlineOpponentBannerStatus.innerText = opponent.finished ? `Oponente: terminou em ${formatOnlineTime(opponent.finishTimeMs || 0)}` : 'Oponente: não concluiu';
        } else if (opponent.connected === false) {
            onlineOpponentBannerStatus.innerText = 'Oponente: desconectado';
        } else if (opponent.finished) {
            onlineOpponentBannerStatus.innerText = 'Oponente: terminou';
        } else {
            onlineOpponentBannerStatus.innerText = 'Oponente: jogando...';
        }
    }
}

function renderOnlineRoomPanel(roomData = currentOnlineRoom) {
    const hasRoom = !!roomData && !!currentOnlineRoomCode;
    showControl(onlineRoomPanel, hasRoom);
    if (!hasRoom) {
        if (onlineStatusBanner) {
            onlineStatusBanner.innerText = 'Entre em uma sala para iniciar um duelo mágico.';
        }
        return;
    }

    const me = getOnlineCurrentPlayer(roomData);
    const opponent = getOnlineOpponentPlayer(roomData);
    const waiting = roomData.status === 'waiting';
    const playing = roomData.status === 'playing';
    const finished = roomData.status === 'finished';
    const abandoned = roomData.status === 'abandoned';

    if (onlineStatusBanner) {
        if (waiting) onlineStatusBanner.innerText = 'Sala criada. Compartilhe o código e aguarde seu adversário.';
        else if (playing) onlineStatusBanner.innerText = 'Duelo em andamento. Os dois jogadores receberam a mesma palavra.';
        else if (finished) onlineStatusBanner.innerText = 'Duelo encerrado. Veja o resultado e crie outra sala quando quiser.';
        else if (abandoned) onlineStatusBanner.innerText = 'A sala foi encerrada antes do final da partida.';
        else onlineStatusBanner.innerText = 'Estado da sala atualizado.';
    }

    if (onlineRoomCodeDisplay) onlineRoomCodeDisplay.innerText = roomData.roomCode || currentOnlineRoomCode || '----';
    if (onlinePlayerSelf) onlinePlayerSelf.innerText = me?.name || getOnlinePlayerName();
    if (onlinePlayerOpponent) onlinePlayerOpponent.innerText = opponent?.name || 'Aguardando...';
    if (onlineRoomState) {
        if (waiting) onlineRoomState.innerText = 'Aguardando outro jogador entrar com o código desta sala.';
        else if (playing) onlineRoomState.innerText = `Partida iniciada com ${roomData.letterCount || '--'} letras.`;
        else if (finished) onlineRoomState.innerText = 'Partida concluída. O grimório já definiu o vencedor.';
        else if (abandoned) onlineRoomState.innerText = roomData.abandonMessage || 'Seu oponente saiu da partida.';
    }
    if (onlineRoomOpponentStatus) {
        if (!opponent?.uid) onlineRoomOpponentStatus.innerText = 'Esperando conexão';
        else if (opponent.connected === false) onlineRoomOpponentStatus.innerText = 'Desconectado';
        else if (opponent.finished) onlineRoomOpponentStatus.innerText = 'Terminou';
        else onlineRoomOpponentStatus.innerText = playing ? 'Jogando...' : 'Conectado';
    }

    updateOnlineBanner(roomData);
}

function showOnlineScreen() {
    setMobileGameplayMenuVisibility(false);
    if (hub) {
        hub.style.display = 'none';
        hub.classList.add('hidden-control');
    }
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    hideCampaignScreen();
    document.getElementById('app-container')?.classList.add('hidden-app');
    onlineScreen?.classList.remove('hidden-control');
    renderOnlineRoomPanel();
    syncTopUserUi(activeUser, activeUserDoc);
    syncRefreshLockState();
}

function sanitizeOnlineCodeInput() {
    if (!onlineRoomCodeInput) return '';
    const cleaned = (onlineRoomCodeInput.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    onlineRoomCodeInput.value = cleaned;
    return cleaned;
}

async function copyOnlineRoomCode() {
    const code = currentOnlineRoomCode || currentOnlineRoom?.roomCode || '';
    if (!code) return;
    try {
        await navigator.clipboard.writeText(code);
        showFloatingMessage('Codigo copiado.', 1800);
    } catch (err) {
        showFloatingMessage(`Codigo da sala: ${code}`, 2600);
    }
}

function getOnlineRoomRef(roomCode = currentOnlineRoomCode) {
    return roomCode ? doc(db, ONLINE_ROOM_COLLECTION, roomCode) : null;
}

async function ensureOnlineFirebaseIdentity() {
    if (!auth || !db) {
        console.log('[Online 1x1] Firebase indisponivel para salas online.', {
            hasAuth: !!auth,
            hasDb: !!db
        });
        return null;
    }

    if (auth.currentUser) {
        if (!activeUser || activeUser.uid !== auth.currentUser.uid || isUsingLocalDevSession) {
            activeUser = auth.currentUser;
            isUsingLocalDevSession = false;
            syncTopUserUi(activeUser, activeUserDoc);
        }
        console.log('[Online 1x1] Sessao Firebase pronta para usar salas.', {
            uid: auth.currentUser.uid,
            isAnonymous: !!auth.currentUser.isAnonymous
        });
        return auth.currentUser;
    }

    if (!activeUser) {
        console.log('[Online 1x1] Nao ha usuario ativo para criar/entrar em sala.');
        return null;
    }

    if (IS_LOCAL_DEV && isUsingLocalDevSession) {
        console.log('[Online 1x1] Sessao local detectada. Tentando autenticar anonimamente no Firebase para liberar a sala.');
        try {
            preserveCurrentViewOnAuthSync = true;
            const credential = await signInAnonymously(auth);
            activeUser = credential.user;
            isUsingLocalDevSession = false;
            syncTopUserUi(activeUser, activeUserDoc);
            console.log('[Online 1x1] Conversao para auth anonima concluida.', {
                uid: credential.user.uid,
                isAnonymous: !!credential.user.isAnonymous
            });
            return credential.user;
        } catch (err) {
            preserveCurrentViewOnAuthSync = false;
            console.log('[Online 1x1] Falha ao autenticar anonimamente para o online.', {
                code: err?.code || null,
                message: err?.message || err
            });
            return null;
        }
    }

    console.log('[Online 1x1] Usuario ativo sem sessao Firebase valida para a sala.', {
        activeUid: activeUser?.uid || null,
        authUid: auth.currentUser?.uid || null,
        isUsingLocalDevSession
    });
    return null;
}

async function syncOnlinePlayerPatch(patch = {}) {
    if (!db || !currentOnlineRoomCode || !currentOnlinePlayerSlot || currentOnlineLeaving) return;
    const roomRef = getOnlineRoomRef();
    if (!roomRef) return;
    const updates = {};
    Object.entries(patch).forEach(([key, value]) => {
        updates[`players.${currentOnlinePlayerSlot}.${key}`] = value;
    });
    if (!Object.keys(updates).length) return;
    try {
        await updateDoc(roomRef, updates);
    } catch (err) {
        console.log('Falha ao sincronizar estado online:', err);
    }
}

function queueOnlineProgressSync() {
    if (currentGameMode !== ONLINE_MODE || !currentOnlineRoomCode || !currentOnlinePlayerSlot) return;
    if (onlineProgressSyncTimeout) clearTimeout(onlineProgressSyncTimeout);
    onlineProgressSyncTimeout = setTimeout(() => {
        onlineProgressSyncTimeout = null;
        const progressValue = maxWordLength > 0 ? Math.min(99, Math.round((currentWord.length / maxWordLength) * 100)) : 0;
        syncOnlinePlayerPatch({ progress: progressValue, errors: currentOnlineLocalErrors, connected: true });
    }, 120);
}

function getOnlineElapsedMs() {
    if (!currentOnlineStartedAt) return 0;
    return Math.max(0, Date.now() - currentOnlineStartedAt);
}

async function attachOnlineRoomListener(roomCode) {
    cleanupOnlineRoomListener();
    currentOnlineRoomCode = roomCode;
    const roomRef = getOnlineRoomRef(roomCode);
    onlineRoomUnsubscribe = onSnapshot(roomRef, (snap) => {
        if (!snap.exists()) {
            showFloatingMessage('A sala online foi encerrada.', 2400);
            resetOnlineRoomState();
            showOnlineScreen();
            return;
        }
        const roomData = snap.data();
        currentOnlineRoom = roomData;
        currentOnlinePlayerSlot = currentOnlinePlayerSlot || getRoomPlayerSlot(roomData);
        renderOnlineRoomPanel(roomData);
        handleOnlineRoomSnapshot(roomData);
    }, (err) => {
        console.log('Erro no listener da sala online:', err);
        showFloatingMessage('Erro ao acompanhar a sala online.', 2400);
    });
}

async function createOnlineRoom() {
    if (!db) {
        showFloatingMessage('Entre no jogo para criar uma sala.', 2200);
        return;
    }

    const onlineUser = await ensureOnlineFirebaseIdentity();
    if (!onlineUser) {
        showFloatingMessage('Nao foi possivel autenticar a sala online agora.', 2600);
        return;
    }

    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    } else {
        resetOnlineRoomState();
    }
    onlineCreateRoomBtn && (onlineCreateRoomBtn.disabled = true);
    try {
        const roomCode = await generateUniqueOnlineRoomCode();
        const payload = getRandomOnlineChallengePayload();
        const roomRef = getOnlineRoomRef(roomCode);
        const roomPayload = {
            roomCode,
            status: 'waiting',
            createdAt: serverTimestamp(),
            startedAt: null,
            completedAt: null,
            hostUid: onlineUser.uid,
            winnerUid: null,
            abandonMessage: '',
            gameMode: ONLINE_MODE,
            letterCount: payload.letterCount,
            challenge: payload.challenge,
            players: {
                player1: {
                    uid: onlineUser.uid,
                    name: getOnlinePlayerName(),
                    photo: getOnlinePlayerPhoto(),
                    connected: true,
                    ready: true,
                    finished: false,
                    finishTimeMs: null,
                    errors: 0,
                    progress: 0
                },
                player2: {
                    uid: null,
                    name: '',
                    photo: '',
                    connected: false,
                    ready: false,
                    finished: false,
                    finishTimeMs: null,
                    errors: 0,
                    progress: 0
                }
            }
        };

        console.log('[Online 1x1] Criando sala', {
            collection: ONLINE_ROOM_COLLECTION,
            roomCode,
            uid: onlineUser.uid,
            authUid: auth.currentUser?.uid || null,
            isAnonymous: !!onlineUser.isAnonymous,
            isUsingLocalDevSession,
            payload: roomPayload
        });

        await setDoc(roomRef, roomPayload);
        console.log('[Online 1x1] Sala criada com sucesso', { roomCode, uid: onlineUser.uid });
        currentOnlinePlayerSlot = 'player1';
        await attachOnlineRoomListener(roomCode);
        showFloatingMessage(`Sala ${roomCode} criada.`, 2200);
    } catch (err) {
        console.log('[Online 1x1] Erro ao criar sala online', {
            collection: ONLINE_ROOM_COLLECTION,
            uid: onlineUser?.uid || activeUser?.uid || null,
            authUid: auth.currentUser?.uid || null,
            isAnonymous: !!onlineUser?.isAnonymous,
            isUsingLocalDevSession,
            code: err?.code || null,
            message: err?.message || err
        });
        if (err?.code === 'permission-denied') {
            showFloatingMessage('Permissao do Firestore negada para criar sala.', 2600);
        } else {
            showFloatingMessage('Nao foi possivel criar a sala agora.', 2400);
        }
    } finally {
        if (onlineCreateRoomBtn) onlineCreateRoomBtn.disabled = false;
    }
}

async function joinOnlineRoom() {
    if (!db) {
        showFloatingMessage('Entre no jogo para participar de uma sala.', 2200);
        return;
    }

    const onlineUser = await ensureOnlineFirebaseIdentity();
    if (!onlineUser) {
        showFloatingMessage('Nao foi possivel autenticar a sala online agora.', 2600);
        return;
    }

    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    } else {
        resetOnlineRoomState();
    }
    const roomCode = sanitizeOnlineCodeInput();
    if (roomCode.length !== 4) {
        showFloatingMessage('Digite um codigo valido com 4 caracteres.', 2200);
        return;
    }

    if (onlineJoinRoomBtn) onlineJoinRoomBtn.disabled = true;
    try {
        const roomRef = getOnlineRoomRef(roomCode);
        console.log('[Online 1x1] Tentando entrar na sala', {
            collection: ONLINE_ROOM_COLLECTION,
            roomCode,
            uid: onlineUser.uid,
            authUid: auth.currentUser?.uid || null,
            isAnonymous: !!onlineUser.isAnonymous,
            isUsingLocalDevSession
        });
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) throw new Error('not-found');
            const room = snap.data();
            if (room.hostUid === onlineUser.uid) throw new Error('self-room');
            if (room.status === 'finished') throw new Error('finished');
            if (room.status === 'abandoned') throw new Error('abandoned');
            if (room.players?.player2?.uid && room.players.player2.uid !== onlineUser.uid) throw new Error('full');

            transaction.update(roomRef, {
                status: 'playing',
                startedAt: serverTimestamp(),
                abandonMessage: '',
                'players.player2.uid': onlineUser.uid,
                'players.player2.name': getOnlinePlayerName(),
                'players.player2.photo': getOnlinePlayerPhoto(),
                'players.player2.connected': true,
                'players.player2.ready': true,
                'players.player2.finished': false,
                'players.player2.finishTimeMs': null,
                'players.player2.errors': 0,
                'players.player2.progress': 0
            });
        });

        currentOnlinePlayerSlot = 'player2';
        await attachOnlineRoomListener(roomCode);
        console.log('[Online 1x1] Entrada na sala concluida', { roomCode, uid: onlineUser.uid });
        showFloatingMessage(`Entrou na sala ${roomCode}.`, 2200);
    } catch (err) {
        console.log('[Online 1x1] Erro ao entrar na sala', {
            collection: ONLINE_ROOM_COLLECTION,
            roomCode,
            uid: onlineUser?.uid || activeUser?.uid || null,
            authUid: auth.currentUser?.uid || null,
            isUsingLocalDevSession,
            code: err?.code || err?.message || null,
            message: err?.message || err
        });
        const code = err?.message || 'unknown';
        if (code === 'not-found') showFloatingMessage('Sala nao encontrada.', 2200);
        else if (code === 'self-room') showFloatingMessage('Voce ja e o anfitriao desta sala.', 2200);
        else if (code === 'full') showFloatingMessage('Essa sala ja esta cheia.', 2200);
        else if (code === 'finished') showFloatingMessage('Essa sala ja foi finalizada.', 2200);
        else if (code === 'abandoned') showFloatingMessage('Essa sala foi encerrada.', 2200);
        else if (err?.code === 'permission-denied') showFloatingMessage('Permissao do Firestore negada para entrar na sala.', 2600);
        else {
            console.log('Erro ao entrar na sala online:', err);
            showFloatingMessage('Nao foi possivel entrar na sala.', 2400);
        }
    } finally {
        if (onlineJoinRoomBtn) onlineJoinRoomBtn.disabled = false;
    }
}

function startOnlineMatchFromRoom(roomData) {
    const roomToken = roomData.roomCode;
    if (currentOnlineStartedRoomToken === roomToken) return;

    const challenge = roomData.challenge;
    if (!challenge?.word) {
        showFloatingMessage('Sala online sem desafio valido.', 2400);
        return;
    }

    currentOnlineStartedRoomToken = roomToken;
    currentOnlineStartedAt = Date.now();
    currentOnlineLocalErrors = Number(getOnlineCurrentPlayer(roomData)?.errors || 0);
    currentOnlineResultShown = false;
    currentGameMode = ONLINE_MODE;
    currentCampaignLevel = null;
    resetDailySession();
    clearAllHighlights();
    animateMage('reset');
    showGameScreen();
    startChallengeEngine({
        word: challenge.word,
        hints: Array.isArray(challenge.hints) ? challenge.hints : [],
        meaning: challenge.meaning || ''
    }, {
        wordLength: roomData.letterCount || challenge.word.length || 3,
        resetHistory: true
    });
    feedback.innerText = 'Duelo online iniciado!';
    updateOnlineBanner(roomData);
    queueOnlineProgressSync();
}

function openOnlineResultModal(roomData) {
    if (!onlineResultModal || currentOnlineResultShown) return;
    currentOnlineResultShown = true;
    const me = getOnlineCurrentPlayer(roomData);
    const opponent = getOnlineOpponentPlayer(roomData);
    const isWinner = !!roomData?.winnerUid && roomData.winnerUid === activeUser?.uid;
    const opponentName = opponent?.name || 'oponente';

    if (onlineResultTitle) {
        if (roomData?.status === 'abandoned' && opponent?.connected === false) {
            onlineResultTitle.innerText = 'Oponente saiu!';
        } else {
            onlineResultTitle.innerText = isWinner ? 'Você venceu!' : 'Você perdeu!';
        }
    }
    if (onlineResultCopy) {
        if (roomData?.status === 'abandoned' && opponent?.connected === false) {
            onlineResultCopy.innerText = 'Seu oponente deixou a sala antes do final do duelo.';
        } else if (isWinner) {
            onlineResultCopy.innerText = `Sua conjuracao foi mais rapida que a de ${opponentName}.`;
        } else {
            onlineResultCopy.innerText = `${opponentName} concluiu o grimorio antes desta rodada.`;
        }
    }
    if (onlineResultSelfTime) onlineResultSelfTime.innerText = formatOnlineTime(me?.finishTimeMs ?? getOnlineElapsedMs());
    if (onlineResultOpponentTime) onlineResultOpponentTime.innerText = opponent?.finished ? formatOnlineTime(opponent.finishTimeMs || 0) : '--';
    if (onlineResultSelfErrors) onlineResultSelfErrors.innerText = String(me?.errors || currentOnlineLocalErrors || 0);
    if (onlineResultOpponentErrors) onlineResultOpponentErrors.innerText = String(opponent?.errors || 0);

    showControl(onlineResultModal, true);
}

async function finalizeOnlineMatch() {
    if (!db || !currentOnlineRoomCode || !currentOnlinePlayerSlot) return;
    const roomRef = getOnlineRoomRef();
    const mySlot = currentOnlinePlayerSlot;
    const otherSlot = getOnlineOpponentSlot(mySlot);
    const finishTimeMs = getOnlineElapsedMs();
    currentOnlineLocalErrors = Math.max(currentOnlineLocalErrors, 0);

    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) return;
            const room = snap.data();
            const me = room.players?.[mySlot] || {};
            const opponent = room.players?.[otherSlot] || {};

            const updates = {
                status: 'finished',
                completedAt: serverTimestamp(),
                [`players.${mySlot}.finished`]: true,
                [`players.${mySlot}.finishTimeMs`]: finishTimeMs,
                [`players.${mySlot}.errors`]: currentOnlineLocalErrors,
                [`players.${mySlot}.progress`]: 100,
                [`players.${mySlot}.connected`]: true
            };

            if (!room.winnerUid) {
                let winnerUid = me.uid || activeUser?.uid || null;
                if (opponent.finished) {
                    const myTime = finishTimeMs;
                    const opponentTime = Number(opponent.finishTimeMs || Number.MAX_SAFE_INTEGER);
                    const opponentErrors = Number(opponent.errors || 0);
                    if (opponentTime < myTime || (opponentTime === myTime && opponentErrors < currentOnlineLocalErrors)) {
                        winnerUid = opponent.uid || winnerUid;
                    }
                }
                updates.winnerUid = winnerUid;
            }

            transaction.update(roomRef, updates);
        });
    } catch (err) {
        console.log('Erro ao finalizar duelo online:', err);
    }
}

async function leaveOnlineRoom(options = {}) {
    if (!db || !currentOnlineRoomCode || !currentOnlinePlayerSlot) {
        resetOnlineRoomState();
        return;
    }

    if (currentOnlineLeaving) return;
    currentOnlineLeaving = true;

    const roomRef = getOnlineRoomRef();
    const mySlot = currentOnlinePlayerSlot;
    const otherSlot = getOnlineOpponentSlot(mySlot);
    const shouldAbandon = options.abandon !== false;

    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) return;
            const room = snap.data();
            const opponent = room.players?.[otherSlot] || {};
            const updates = {
                [`players.${mySlot}.connected`]: false
            };

            if (shouldAbandon && room.status !== 'finished') {
                updates.status = 'abandoned';
                updates.completedAt = serverTimestamp();
                updates.abandonMessage = 'Seu oponente saiu da partida.';
                if (opponent.uid) {
                    updates.winnerUid = opponent.uid;
                }
            }

            transaction.update(roomRef, updates);
        });
    } catch (err) {
        console.log('Erro ao sair da sala online:', err);
    } finally {
        resetOnlineRoomState();
    }
}

function handleOnlineRoomSnapshot(roomData) {
    if (!roomData || !currentOnlineRoomCode) return;

    if (roomData.status === 'playing') {
        startOnlineMatchFromRoom(roomData);
        return;
    }

    if (roomData.status === 'finished' || roomData.status === 'abandoned') {
        if (isGameScreenVisible()) {
            updateOnlineBanner(roomData);
            openOnlineResultModal(roomData);
        }
        return;
    }
}

function renderCampaignBooks() {
    if (!campaignBooksGrid) return;
    if (!campaignProgress) {
        campaignBooksGrid.innerHTML = '';
        updateCampaignProgressSummary();
        return;
    }

    campaignBooksGrid.innerHTML = '';

    CAMPAIGN_LEVELS.forEach((level) => {
        const state = getCampaignBookState(level);
        const tier = getCampaignBookTier(level);
        const progressValue = campaignProgress.levelProgress[level] || 0;
        const playable = hasCampaignContent(level);
        const card = document.createElement('button');
        card.type = 'button';
        card.className = `campaign-book campaign-book--${tier} campaign-book--${state}`;
        if (highlightedCampaignLevel === level) {
            card.classList.add('campaign-book--highlighted');
        }
        card.disabled = state === 'locked';
        card.setAttribute('data-level', String(level));

        let stateIcon = '🔒';
        let stateText = 'Bloqueado';
        if (state === 'available') {
            stateIcon = '🔓';
            stateText = playable ? 'Disponivel' : 'Disponivel (sem paginas)';
        } else if (state === 'completed') {
            stateIcon = '✅';
            stateText = 'Concluido';
        }

        card.innerHTML = `
            <div class="campaign-book-title">${level} letras</div>
            <div class="campaign-book-state">${stateIcon} ${stateText}</div>
            <div class="campaign-book-progress">${progressValue}/${CAMPAIGN_WORDS_TO_COMPLETE} palavras</div>
        `;

        card.addEventListener('click', () => {
            if (state === 'locked') {
                showFloatingMessage('Conclua o livro anterior para desbloquear este.', 2200);
                return;
            }

            if (!playable) {
                showFloatingMessage('Esse livro ainda nao possui palavras cadastradas.', 2400);
                return;
            }

            startCampaignLevel(level);
        });

        campaignBooksGrid.appendChild(card);
    });

    updateCampaignProgressSummary();
}

function showCampaignScreen() {
    setMobileGameplayMenuVisibility(false);
    if (hub) {
        hub.style.display = 'none';
        hub.classList.add('hidden-control');
    }
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    hideOnlineScreen();
    document.getElementById('app-container')?.classList.add('hidden-app');
    campaignScreen?.classList.remove('hidden-control');
    renderCampaignBooks();
    syncTopUserUi(activeUser, activeUserDoc);
    syncRefreshLockState();
}

function getSelectedStartMode() {
    if (modeSelector?.value === RANDOM_MODE) return RANDOM_MODE;
    if (modeSelector?.value === ONLINE_MODE) return ONLINE_MODE;
    return CAMPAIGN_MODE;
}

function beginSelectedGameFlow() {
    const selectedMode = getSelectedStartMode();
    if (selectedMode === CAMPAIGN_MODE) {
        showCampaignScreen();
        return;
    }

    if (selectedMode === ONLINE_MODE) {
        resetOnlineRoomState();
        showOnlineScreen();
        return;
    }

    showGameScreen();
    startRandomChallenge();
}

function getCampaignProgressSource() {
    if (activeUser && !activeUser.isAnonymous && !isUsingLocalDevSession && db) {
        return 'firebase';
    }
    return 'local';
}

function loadGuestCampaignProgress() {
    try {
        const stored = localStorage.getItem(getCampaignProgressStorageKey());
        return normalizeCampaignProgress(stored ? JSON.parse(stored) : null);
    } catch (err) {
        console.log('Falha ao carregar progresso local da campanha:', err);
        return normalizeCampaignProgress(null);
    }
}

async function saveCampaignProgress(progress) {
    const normalized = normalizeCampaignProgress(progress);
    campaignProgress = normalized;

    if (getCampaignProgressSource() === 'firebase' && activeUser) {
        const userRef = doc(db, 'users', activeUser.uid);
        await setDoc(userRef, { campaignProgress: normalized }, { merge: true });
        activeUserDoc = { ...(activeUserDoc || {}), campaignProgress: normalized };
    } else {
        try {
            localStorage.setItem(getCampaignProgressStorageKey(), JSON.stringify(normalized));
        } catch (err) {
            console.log('Falha ao salvar progresso local da campanha:', err);
        }
    }

    renderCampaignBooks();
    syncTopUserUi(activeUser, activeUserDoc);
    return normalized;
}

async function loadCampaignProgress() {
    if (getCampaignProgressSource() === 'firebase') {
        const normalized = normalizeCampaignProgress(activeUserDoc?.campaignProgress);
        campaignProgress = normalized;
        return normalized;
    }

    const normalized = loadGuestCampaignProgress();
    campaignProgress = normalized;
    return normalized;
}

async function recordCampaignWordCompletion(level) {
    if (currentGameMode !== CAMPAIGN_MODE || !level) return { completedNow: false, unlockedLevels: [] };

    const progress = normalizeCampaignProgress(campaignProgress);
    const nextProgress = normalizeCampaignProgress({
        ...progress,
        unlockedLevels: [...progress.unlockedLevels],
        completedLevels: [...progress.completedLevels],
        levelProgress: { ...progress.levelProgress }
    });

    nextProgress.unlockedLevels = [...new Set([...nextProgress.unlockedLevels, level])].sort((a, b) => a - b);
    nextProgress.levelProgress[level] = Math.min(
        CAMPAIGN_WORDS_TO_COMPLETE,
        (nextProgress.levelProgress[level] || 0) + 1
    );

    let completedNow = false;
    const unlockedBefore = new Set(progress.unlockedLevels);

    if (nextProgress.levelProgress[level] >= CAMPAIGN_WORDS_TO_COMPLETE) {
        if (!nextProgress.completedLevels.includes(level)) {
            nextProgress.completedLevels.push(level);
            nextProgress.completedLevels.sort((a, b) => a - b);
        }
        nextProgress.levelProgress[level] = CAMPAIGN_WORDS_TO_COMPLETE;
        unlockNextCampaignLevels(nextProgress, level);
        completedNow = !progress.completedLevels.includes(level);
    }

    await saveCampaignProgress(nextProgress);

    return {
        completedNow,
        unlockedLevels: nextProgress.unlockedLevels.filter((item) => !unlockedBefore.has(item)),
        nextLevel: getNextCampaignPlayableLevel(level, nextProgress.unlockedLevels)
    };
}

let bookTutorialApi = null;

function openWelcomeTutorial(goToLastPage = false) {
    setMobileGameplayMenuVisibility(false);
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.classList.add('hidden-app');
    hideCampaignScreen();
    hideOnlineScreen();
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
    if (!targetChallenge || !Array.isArray(currentWord) || !activeUser || currentGameMode === ONLINE_MODE) return null;

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

function isGameScreenVisible() {
    return !document.getElementById('app-container')?.classList.contains('hidden-app');
}

function shouldBlockGameplayRefresh() {
    return isGameScreenVisible();
}

function syncRefreshLockState() {
    const locked = shouldBlockGameplayRefresh();
    document.documentElement.classList.toggle('refresh-lock', locked);
    document.body.classList.toggle('refresh-lock', locked);
}

function showGameScreen() {
    hideCampaignScreen();
    hideOnlineScreen();
    if (hub) {
        hub.style.display = 'none';
        hub.classList.add('hidden-control');
    }
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    document.getElementById('app-container')?.classList.remove('hidden-app');
    setMobileGameplayMenuVisibility(true);
    syncRefreshLockState();
}

async function showHubScreenFromGame() {
    stopHintCycle();
    resetDailySession();
    clearGameSessionState();
    if (currentGameMode === ONLINE_MODE || currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    }
    currentCampaignLevel = null;
    document.getElementById('app-container')?.classList.add('hidden-app');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    hideCampaignScreen();
    hideOnlineScreen();
    setMobileGameplayMenuVisibility(false);
    showHubScreen(true);
    syncTopUserUi(activeUser, activeUserDoc);
    syncRefreshLockState();
}

function tryRestoreGameSession() {
    try {
        clearGameSessionState();
        return false;
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
            showFloatingMessage('Resultado copiado para ÃƒÆ’Ã‚Â¡rea de transferÃƒÆ’Ã‚Âªncia.', 2200);
        }
    } catch (err) {
        console.log('Falha ao compartilhar resultado diÃƒÆ’Ã‚Â¡rio', err);
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
        showFloatingMessage('NÃƒÆ’Ã‚Â£o foi possÃƒÆ’Ã‚Â­vel desbloquear a dica agora.', 2500);
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

function activateLocalDevSession(mode = 'guest', email = '') {
    const normalizedEmail = String(email || '').trim();
    const displayName = mode === 'email'
        ? (normalizedEmail.split('@')[0] || 'Jogador')
        : 'Visitante';

    isUsingLocalDevSession = true;
    activeUser = {
        uid: mode === 'email' ? 'local-dev-email' : 'local-dev-guest',
        isAnonymous: mode !== 'email',
        email: normalizedEmail || null,
        displayName,
        photoURL: DEFAULT_AVATAR,
        getIdToken: async () => 'local-dev-token'
    };
    activeUserDoc = activeUser.isAnonymous ? null : {
        uid: activeUser.uid,
        name: displayName,
        photo: DEFAULT_AVATAR,
        points: 0,
        campaignProgress: getDefaultCampaignProgress()
    };
    campaignProgress = normalizeCampaignProgress(activeUserDoc?.campaignProgress);

    showAuthGate(false);
    showHubScreen(true);
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    document.getElementById('app-container')?.classList.add('hidden-app');
    syncTopUserUi(activeUser, activeUserDoc);
    setGateStatus('');
    setStatus('');
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
        hideCampaignScreen();
        hideOnlineScreen();
    } else {
        hub.classList.add('hidden-control');
    }
    syncRefreshLockState();
}

function showAuthGate(show) {
    showControl(authGate, show);
    if (show) hideCampaignScreen();
    if (show) hideOnlineScreen();
    if (show) setGateAuthMode('login');
}
function getModeVisitor(user) {
    return !!(user && user.isAnonymous);
}

async function ensureUserDoc(user) {
    if (!db || !user || user.isAnonymous) return null;
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const defaultCampaignProgress = getDefaultCampaignProgress();

    if (!snap.exists()) {
        const baseName = user.displayName || (user.email ? user.email.split('@')[0] : 'Jogador');
        await setDoc(userRef, {
            uid: user.uid,
            name: baseName,
            photo: user.photoURL || DEFAULT_AVATAR,
            points: 0,
            campaignProgress: defaultCampaignProgress
        }, { merge: true });
    } else {
        const currentData = snap.data() || {};
        if (!currentData.campaignProgress) {
            await setDoc(userRef, {
                campaignProgress: defaultCampaignProgress
            }, { merge: true });
        }
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
        setStatus('FaÃƒÆ’Ã‚Â§a login para acessar o perfil.', true);
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
        setStatus('Conta visitante: joga normal, mas nÃƒÆ’Ã‚Â£o salva pontos nem ranking.');
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
        setStatus('Visitante nÃƒÆ’Ã‚Â£o salva perfil.', true);
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
        if (IS_LOCAL_DEV) {
            activateLocalDevSession('guest');
            return;
        }
        setGateStatus('Firebase Auth nÃƒÆ’Ã‚Â£o inicializado. Recarregue a pÃƒÆ’Ã‚Â¡gina.', true);
        return;
    }
    try {
        await signInWithPopup(auth, new GoogleAuthProvider());
        setStatus('Login Google realizado.');
        setGateStatus('Login Google realizado.');
    } catch (err) {
        if (IS_LOCAL_DEV) {
            activateLocalDevSession('guest');
            return;
        }
        setStatus('Falha no login Google: ' + (err.message || err), true);
        setGateStatus('Falha no login Google: ' + (err.message || err), true);
    }
}


async function authAnonymously() {
    if (!auth) {
        if (IS_LOCAL_DEV) {
            activateLocalDevSession('guest');
            return;
        }
        setGateStatus('Firebase Auth nÃƒÆ’Ã‚Â£o inicializado. Recarregue a pÃƒÆ’Ã‚Â¡gina.', true);
        return;
    }
    try {
        await signInAnonymously(auth);
        setStatus('Entrou como visitante.');
        setGateStatus('Entrou como visitante.');
    } catch (err) {
        if (IS_LOCAL_DEV) {
            activateLocalDevSession('guest');
            return;
        }
        setStatus('Erro no modo visitante: ' + (err.message || err), true);
        setGateStatus('Erro no modo visitante: ' + (err.message || err), true);
    }
}

async function authWithEmail(isRegister, emailFieldId = 'email-input', passwordFieldId = 'password-input') {
    if (!auth) {
        if (IS_LOCAL_DEV) {
            const email = (document.getElementById(emailFieldId)?.value || '').trim();
            activateLocalDevSession('email', email);
            return;
        }
        setGateStatus('Firebase Auth nÃƒÆ’Ã‚Â£o inicializado. Recarregue a pÃƒÆ’Ã‚Â¡gina.', true);
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
            setStatus('As senhas nÃƒÆ’Ã‚Â£o coincidem.', true);
            setGateStatus('As senhas nÃƒÆ’Ã‚Â£o coincidem.', true);
            return;
        }
    }

    try {
        setGateStatus(isRegister ? 'Criando conta...' : 'Entrando...');
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
        if (IS_LOCAL_DEV) {
            activateLocalDevSession('email', email);
            return;
        }
        setStatus('Erro no login/cadastro: ' + (err.message || err), true);
        setGateStatus('Erro no login/cadastro: ' + (err.message || err), true);
    }
}

async function logoutUser() {
    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    }
    if (isUsingLocalDevSession) {
        isUsingLocalDevSession = false;
        activeUser = null;
        activeUserDoc = null;
        showAuthGate(true);
        showHubScreen(false);
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        document.getElementById('app-container')?.classList.add('hidden-app');
        syncTopUserUi(null, null);
        resetDailySession();
        clearGameSessionState();
        setGateStatus('FaÃƒÆ’Ã‚Â§a login para continuar.');
        return;
    }
    if (!auth) return;
    try {
        await signOut(auth);
        setStatus('Sess\u00E3o encerrada.');
        setGateStatus('FaÃƒÆ’Ã‚Â§a login para continuar.');
    } catch (err) {
        setStatus('Erro ao sair: ' + (err.message || err), true);
        setGateStatus('Erro ao sair: ' + (err.message || err), true);
    }
}

async function handleCorrectAnswer() {
    let campaignResult = { completedNow: false, unlockedLevels: [] };

    if (currentGameMode === CAMPAIGN_MODE && currentCampaignLevel) {
        try {
            campaignResult = await recordCampaignWordCompletion(currentCampaignLevel);
        } catch (err) {
            console.log('Erro ao salvar progresso da campanha:', err);
        }
    }

    if (!activeUser || !db || activeUser.isAnonymous) return campaignResult;

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

    return campaignResult;
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
    onlineBackBtn?.addEventListener('click', async () => {
        await leaveOnlineRoom({ abandon: !!currentOnlineRoomCode });
        openWelcomeTutorial(true);
    });
    onlineCreateRoomBtn?.addEventListener('click', createOnlineRoom);
    onlineJoinRoomBtn?.addEventListener('click', joinOnlineRoom);
    onlineCopyCodeBtn?.addEventListener('click', copyOnlineRoomCode);
    onlineRoomLeaveBtn?.addEventListener('click', async () => {
        await leaveOnlineRoom({ abandon: true });
        showOnlineScreen();
    });
    onlineRoomCodeInput?.addEventListener('input', sanitizeOnlineCodeInput);
    onlineRoomCodeInput?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        joinOnlineRoom();
    });
    closeCampaignCompleteModalBtn?.addEventListener('click', () => {
        goToCampaignBooks(pendingCampaignCompletion?.nextLevel || pendingCampaignCompletion?.currentLevel || null);
    });
    campaignCompleteBooksBtn?.addEventListener('click', () => {
        goToCampaignBooks(pendingCampaignCompletion?.nextLevel || pendingCampaignCompletion?.currentLevel || null);
    });
    campaignCompleteNextBtn?.addEventListener('click', continueToNextCampaignBook);
    closeOnlineResultModalBtn?.addEventListener('click', async () => {
        showControl(onlineResultModal, false);
        await leaveOnlineRoom({ abandon: false });
        showOnlineScreen();
    });
    onlineResultRematchBtn?.addEventListener('click', async () => {
        showControl(onlineResultModal, false);
        await leaveOnlineRoom({ abandon: false });
        showOnlineScreen();
    });
    onlineResultMenuBtn?.addEventListener('click', async () => {
        showControl(onlineResultModal, false);
        await leaveOnlineRoom({ abandon: false });
        document.getElementById('app-container')?.classList.add('hidden-app');
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        hideOnlineScreen();
        setMobileGameplayMenuVisibility(false);
        showHubScreen(true);
        syncTopUserUi(activeUser, activeUserDoc);
        syncRefreshLockState();
    });

    document.getElementById('gate-google-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authWithGoogle();
    });
    document.getElementById('gate-anon-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        authAnonymously();
    });
    document.getElementById('gate-login-email-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
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
    document.getElementById('gate-register-email-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (gateAuthMode !== 'register') {
            setGateAuthMode('register');
            return;
        }
        authWithEmail(true, 'gate-email-input', 'gate-password-input');
    });

    gateEmailInput?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        authWithEmail(gateAuthMode === 'register', 'gate-email-input', 'gate-password-input');
    });

    gatePasswordInput?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        authWithEmail(gateAuthMode === 'register', 'gate-email-input', 'gate-password-input');
    });

    gateConfirmPasswordInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && gateAuthMode === 'register') {
            e.preventDefault();
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
        if (e.target === campaignCompleteModal) {
            goToCampaignBooks(pendingCampaignCompletion?.nextLevel || pendingCampaignCompletion?.currentLevel || null);
        }
        if (e.target === onlineResultModal) {
            void (async () => {
                showControl(onlineResultModal, false);
                await leaveOnlineRoom({ abandon: false });
                showOnlineScreen();
            })();
        }
    });

    window.addEventListener('beforeunload', (e) => {
        if (!shouldBlockGameplayRefresh()) return;
        e.preventDefault();
        e.returnValue = '';
    });

    document.addEventListener('keydown', (e) => {
        if (!shouldBlockGameplayRefresh()) return;
        const key = (e.key || '').toLowerCase();
        const isRefreshShortcut = e.key === 'F5' || ((e.ctrlKey || e.metaKey) && key === 'r');
        if (!isRefreshShortcut) return;
        e.preventDefault();
        showFloatingMessage('Volte ao menu antes de atualizar.', 2200);
    });

    document.addEventListener('touchstart', (e) => {
        if (!isMobileViewport()) return;
        lastTouchStartY = e.touches?.[0]?.clientY || 0;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!shouldBlockGameplayRefresh() || !isMobileViewport()) return;
        const currentTouchY = e.touches?.[0]?.clientY || 0;
        const isPullingDown = currentTouchY > lastTouchStartY + 12;
        if (window.scrollY <= 0 && isPullingDown) {
            e.preventDefault();
        }
    }, { passive: false });

    window.addEventListener('resize', () => {
        applyMobileMenuButtonState(shouldBlockGameplayRefresh());
    });

    window.addEventListener('pagehide', () => {
        if (!currentOnlineRoomCode || currentOnlineLeaving) return;
        leaveOnlineRoom({ abandon: true });
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
            resetOnlineRoomState();
            activeUser = null;
            activeUserDoc = null;
            showAuthGate(true);
            showHubScreen(false);
            welcomeScreen.style.display = 'none';
            document.getElementById('app-container')?.classList.add('hidden-app');
            syncTopUserUi(null, null);
            resetDailySession();
            clearGameSessionState();
            syncRefreshLockState();
            setDailyHubStatus('Fa\u00e7a login para jogar.', true);
            return;
        }

        activeUser = user;
        resetOnlineRoomState();
        try {
            activeUserDoc = await ensureUserDoc(user);
        } catch (e) {
            activeUserDoc = null;
            console.log('Falha ao carregar doc do usuario:', e);
        }
        await loadCampaignProgress();

        const shouldPreserveCurrentView = preserveCurrentViewOnAuthSync;
        preserveCurrentViewOnAuthSync = false;

        showAuthGate(false);
        if (!shouldPreserveCurrentView) {
            clearGameSessionState();
            showHubScreen(true);
            welcomeScreen.style.display = 'none';
            document.getElementById('app-container')?.classList.add('hidden-app');
            setMobileGameplayMenuVisibility(false);
            syncRefreshLockState();
        }

        syncTopUserUi(user, activeUserDoc);
        renderCampaignBooks();
        await refreshDailyHubState();
    });
}
document.addEventListener('DOMContentLoaded', () => {
    bindAuthUiEvents();
    setGateAuthMode('login');
    syncRefreshLockState();
    initFirebase();
    updateAuthProviderLabels();
    observeLanguageChanges();
});


















































