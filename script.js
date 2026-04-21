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
const PLAYER_STATS_STORAGE_KEY = 'magiclexis_player_stats_v1';
const AUDIO_SETTINGS_STORAGE_KEY = 'magiclexis_audio_settings_v1';
const THEME_STORAGE_KEY = 'magiclexis_theme_v1';
const ARCANE_STREAK_MILESTONES = [1, 2, 3, 7, 15, 30, 45, 60, 90, 120, 180, 365];
const ADMIN_UID = 'DxTnrg4cG4TWHK6qkbSZudfzJgh2';
const GAMEPLAY_IDLE_TIMEOUT_MS = 60000;
const CAMPAIGN_LEVELS = Array.from(
    { length: CAMPAIGN_LEVEL_END - CAMPAIGN_LEVEL_START + 1 },
    (_, index) => CAMPAIGN_LEVEL_START + index
);
const challengesByLength = new Map();
const AVAILABLE_THEMES = ['default', 'arcane-dark', 'mystic-nature', 'glacial-arcane', 'infernal'];
const THEME_UNLOCK_REQUIREMENTS = {
    default: 0,
    'arcane-dark': 2,
    'mystic-nature': 15,
    'glacial-arcane': 20,
    infernal: 30
};
const THEME_LABELS = {
    default: 'Padrão',
    'arcane-dark': 'Arcano Sombrio',
    'mystic-nature': 'Natureza Mística',
    'glacial-arcane': 'Gelo Arcano',
    infernal: 'Infernal'
};
let currentThemeId = 'default';

function normalizeThemeId(themeId) {
    return AVAILABLE_THEMES.includes(themeId) ? themeId : 'default';
}

function isAdminUser(user = activeUser) {
    return !!user?.uid && user.uid === ADMIN_UID;
}

function getStoredThemePreference() {
    try {
        return normalizeThemeId(localStorage.getItem(THEME_STORAGE_KEY) || 'default');
    } catch (err) {
        console.log('Falha ao ler tema salvo:', err);
        return 'default';
    }
}

function getThemeLabel(themeId) {
    return THEME_LABELS[normalizeThemeId(themeId)] || 'Tema';
}

function getThemeUnlockRequirement(themeId) {
    return THEME_UNLOCK_REQUIREMENTS[normalizeThemeId(themeId)] ?? 0;
}

function getCurrentArcaneStreakCount() {
    return Math.max(0, Number(normalizeArcaneStreakData(activeUserDoc).streakCount || 0));
}

function isThemeUnlocked(themeId, streakCount = getCurrentArcaneStreakCount()) {
    if (isAdminUser()) return true;
    return Math.max(0, Number(streakCount || 0)) >= getThemeUnlockRequirement(themeId);
}

function getThemeUnlockMessage(themeId) {
    const requiredDays = getThemeUnlockRequirement(themeId);
    return `Desbloqueie com ${requiredDays} ${getArcaneDayLabel(requiredDays)} de Chama Arcana 🔥`;
}

function getNewlyUnlockedThemes(previousStreak = 0, nextStreak = 0) {
    return AVAILABLE_THEMES.filter((themeId) => {
        const requiredDays = getThemeUnlockRequirement(themeId);
        return requiredDays > 0 && previousStreak < requiredDays && nextStreak >= requiredDays;
    });
}

function syncThemeAvailability() {
    const savedThemeId = getStoredThemePreference();
    const savedThemeUnlocked = isThemeUnlocked(savedThemeId);
    const currentThemeUnlocked = isThemeUnlocked(currentThemeId);
    const nextThemeId = savedThemeUnlocked
        ? savedThemeId
        : (currentThemeUnlocked ? currentThemeId : 'default');

    if (nextThemeId !== currentThemeId) {
        applyTheme(nextThemeId, { persist: false });
        return;
    }
    renderThemeSelectorUi();
}

function saveThemePreference(themeId) {
    currentThemeId = normalizeThemeId(themeId);
    try {
        localStorage.setItem(THEME_STORAGE_KEY, currentThemeId);
    } catch (err) {
        console.log('Falha ao salvar tema:', err);
    }
    if (typeof db !== 'undefined' && db && activeUser && !activeUser.isAnonymous) {
        activeUserDoc = { ...(activeUserDoc || {}), themeId: currentThemeId };
        setDoc(doc(db, 'users', activeUser.uid), { themeId: currentThemeId }, { merge: true }).catch((err) => {
            console.log('Falha ao salvar tema no perfil:', err);
        });
    }
    return currentThemeId;
}

function loadThemePreference() {
    try {
        const stored = getStoredThemePreference();
        currentThemeId = normalizeThemeId(stored || 'default');
    } catch (err) {
        console.log('Falha ao carregar tema:', err);
        currentThemeId = 'default';
    }
    return currentThemeId;
}

function renderThemeSelectorUi() {
    const streakCount = getCurrentArcaneStreakCount();
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
        const themeId = button.getAttribute('data-theme-option') || 'default';
        const isActive = themeId === currentThemeId;
        const unlocked = isThemeUnlocked(themeId, streakCount);
        const requirement = getThemeUnlockRequirement(themeId);
        const title = unlocked
            ? `${getThemeLabel(themeId)} disponível`
            : getThemeUnlockMessage(themeId);
        button.classList.toggle('is-active', isActive);
        button.classList.toggle('is-locked', !unlocked);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        button.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
        button.setAttribute('title', title);
        button.dataset.unlockRequirement = requirement > 0 ? String(requirement) : '';

        const textContainer = button.querySelector('.theme-option-text');
        if (textContainer) {
            let unlockHint = textContainer.querySelector('.theme-option-unlock-hint');
            if (!unlocked) {
                if (!unlockHint) {
                    unlockHint = document.createElement('small');
                    unlockHint.className = 'theme-option-unlock-hint';
                    textContainer.appendChild(unlockHint);
                }
                unlockHint.innerText = getThemeUnlockMessage(themeId);
            } else if (unlockHint) {
                unlockHint.remove();
            }
        }
    });
}

function applyTheme(themeId, { persist = true } = {}) {
    const normalizedThemeId = normalizeThemeId(themeId);
    const fallbackThemeId = isThemeUnlocked(currentThemeId) ? currentThemeId : 'default';
    currentThemeId = isThemeUnlocked(normalizedThemeId) ? normalizedThemeId : fallbackThemeId;
    document.documentElement.setAttribute('data-theme', currentThemeId);
    document.body?.setAttribute('data-theme', currentThemeId);
    document.body?.classList.toggle('theme-enhanced', currentThemeId !== 'default');
    if (persist) saveThemePreference(currentThemeId);
    renderThemeSelectorUi();
    return currentThemeId;
}

const initialThemeId = loadThemePreference();
document.documentElement.setAttribute('data-theme', initialThemeId);
if (document.body) {
    document.body.setAttribute('data-theme', initialThemeId);
    document.body.classList.toggle('theme-enhanced', initialThemeId !== 'default');
}

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
const modeButtonGroup = document.getElementById('mode-button-group');
const startGameBtn = document.getElementById('start-game-btn');
const modeWarning = document.getElementById('mode-warning');
const challengeSelectorHelp = document.getElementById('challenge-selector-help');
const campaignScreen = document.getElementById('campaign-screen');
const campaignBooksGrid = document.getElementById('campaign-books-grid');
const campaignBackBtn = document.getElementById('campaign-back-btn');
const campaignProgressSummary = document.getElementById('campaign-progress-summary');
const onlineScreen = document.getElementById('online-screen');
const onlineBackBtn = document.getElementById('online-back-btn');
const onlineStatusBanner = document.getElementById('online-status-banner');
const onlineQuickMatchBtn = document.getElementById('online-quick-match-btn');
const onlineCreateRoomBtn = document.getElementById('online-create-room-btn');
const onlineJoinRoomBtn = document.getElementById('online-join-room-btn');
const onlineLetterCountSelect = document.getElementById('online-letter-count-select');
const onlineRoomCodeInput = document.getElementById('online-room-code-input');
const onlineRoomPanel = document.getElementById('online-room-panel');
const onlineRoomCodeDisplay = document.getElementById('online-room-code-display');
const onlineCopyCodeBtn = document.getElementById('online-copy-code-btn');
const onlineRoomState = document.getElementById('online-room-state');
const onlineRoomTypeLabel = document.getElementById('online-room-type-label');
const onlineRoomOpponentLabel = document.getElementById('online-room-opponent-label');
const onlinePlayerSelf = document.getElementById('online-player-self');
const onlinePlayerOpponent = document.getElementById('online-player-opponent');
const onlineRoomOpponentStatus = document.getElementById('online-room-opponent-status');
const onlinePartyPanel = document.getElementById('online-party-panel');
const onlinePartySummary = document.getElementById('online-party-summary');
const onlinePartyPlayersList = document.getElementById('online-party-players-list');
const onlinePartyStartBtn = document.getElementById('online-party-start-btn');
const onlineRoomLeaveBtn = document.getElementById('online-room-leave-btn');
const onlineMatchBanner = document.getElementById('online-match-banner');
const onlineMatchModeLabel = document.getElementById('online-match-mode-label');
const onlineRoomBannerCode = document.getElementById('online-room-banner-code');
const onlineOpponentBannerStatus = document.getElementById('online-opponent-banner-status');
const onlineMatchLeaveBtn = document.getElementById('online-match-leave-btn');
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
const journeyFinaleModal = document.getElementById('journey-finale-modal');
const journeyFinaleIqEl = document.getElementById('journey-finale-iq');
const journeyFinaleRankEl = document.getElementById('journey-finale-rank');
const journeyFinaleReplayBtn = document.getElementById('journey-finale-replay-btn');
const journeyFinaleMenuBtn = document.getElementById('journey-finale-menu-btn');
const journeyFinaleShareBtn = document.getElementById('journey-finale-share-btn');
const journeyStatLettersEl = document.getElementById('journey-stat-letters');
const journeyStatValidationsEl = document.getElementById('journey-stat-validations');
const journeyStatWinsEl = document.getElementById('journey-stat-wins');
const journeyStatErrorsEl = document.getElementById('journey-stat-errors');
const journeyStatClearsEl = document.getElementById('journey-stat-clears');
const journeyStatCyclesEl = document.getElementById('journey-stat-cycles');
const journeyStatDaysEl = document.getElementById('journey-stat-days');
const journeyStatTotalTimeEl = document.getElementById('journey-stat-total-time');
const journeyStatAverageTimeEl = document.getElementById('journey-stat-average-time');
const journeyStatChickensEl = document.getElementById('journey-stat-chickens');
const journeyStatSharesEl = document.getElementById('journey-stat-shares');
const onlineResultTitle = document.getElementById('online-result-title');
const onlineResultCopy = document.getElementById('online-result-copy');
const onlineResultSelfTime = document.getElementById('online-result-self-time');
const onlineResultOpponentTime = document.getElementById('online-result-opponent-time');
const onlineResultSelfErrors = document.getElementById('online-result-self-errors');
const onlineResultOpponentErrors = document.getElementById('online-result-opponent-errors');
const onlineResultRematchBtn = document.getElementById('online-result-rematch-btn');
const onlineResultMenuBtn = document.getElementById('online-result-menu-btn');
const trainingPanel = document.getElementById('training-panel');
const trainingPanelKicker = document.getElementById('training-panel-kicker');
const trainingPanelStage = document.getElementById('training-panel-stage');
const trainingTargetWord = document.getElementById('training-target-word');
const trainingPanelCopy = document.getElementById('training-panel-copy');
const trainingHand = document.getElementById('training-hand');
const appContainerEl = document.getElementById('app-container');
const fullscreenToggleBtn = document.getElementById('fullscreen-toggle-btn');
const userLeaveOnlineMatchBtn = document.getElementById('user-leave-online-match');
const opponentProfileChip = document.getElementById('opponent-profile-chip');
const opponentProfileChipAvatar = document.getElementById('opponent-profile-chip-avatar');
const opponentProfileChipName = document.getElementById('opponent-profile-chip-name');
const publicPlayerModal = document.getElementById('public-player-modal');
const closePublicPlayerModalBtn = document.getElementById('close-public-player-modal');
const publicPlayerAvatar = document.getElementById('public-player-avatar');
const publicPlayerName = document.getElementById('public-player-name');
const publicPlayerStatus = document.getElementById('public-player-status');
const publicPlayerLevelBadge = document.getElementById('public-player-level-badge');
const publicPlayerThemeName = document.getElementById('public-player-theme-name');
const publicPlayerStats = document.getElementById('public-player-stats');
const sendFriendInviteBtn = document.getElementById('send-friend-invite-btn');
const publicPlayerMessage = document.getElementById('public-player-message');
const friendsModal = document.getElementById('friends-modal');
const closeFriendsModalBtn = document.getElementById('close-friends-modal');
const friendRequestsList = document.getElementById('friend-requests-list');
const friendsList = document.getElementById('friends-list');
const friendsStatus = document.getElementById('friends-status');

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
let currentOnlineEntryMode = 'code';
let onlineProgressSyncTimeout = null;
let preserveCurrentViewOnAuthSync = false;
let trainingState = null;
let trainingTransitionTimeout = null;
let selectedPublicPlayer = null;

function getTelaCheiaTarget() {
    if (appContainerEl && !appContainerEl.classList.contains('hidden-app')) {
        return appContainerEl;
    }

    return document.documentElement;
}

function getElementoTelaCheia() {
    return document.fullscreenElement || document.webkitFullscreenElement;
}

async function entrarTelaCheia() {
    const target = getTelaCheiaTarget();
    const requestFullscreen = target?.requestFullscreen || target?.webkitRequestFullscreen;

    try {
        if (!getElementoTelaCheia() && requestFullscreen) {
            await requestFullscreen.call(target, { navigationUI: 'hide' });
        }
    } catch (error) {
        console.warn('Nao foi possivel entrar em tela cheia:', error);
    }
}

async function sairTelaCheia() {
    const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;

    try {
        if (getElementoTelaCheia() && exitFullscreen) {
            await exitFullscreen.call(document);
        }
    } catch (error) {
        console.warn('Nao foi possivel sair da tela cheia:', error);
    }
}

async function alternarTelaCheia() {
    if (getElementoTelaCheia()) {
        await sairTelaCheia();
        return;
    }

    await entrarTelaCheia();
}

function atualizarEstadoFullscreen() {
    const emTelaCheia = !!getElementoTelaCheia();
    document.body.classList.toggle('is-fullscreen', emTelaCheia);

    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.textContent = emTelaCheia ? '↙' : '⛶';
        fullscreenToggleBtn.setAttribute('aria-label', emTelaCheia ? 'Sair da tela cheia' : 'Entrar em tela cheia');
        fullscreenToggleBtn.setAttribute('aria-pressed', emTelaCheia ? 'true' : 'false');
        fullscreenToggleBtn.title = emTelaCheia ? 'Sair da tela cheia' : 'Tela cheia';
    }
}

function limparTelaCheiaAoVoltarMenu() {
    if (getElementoTelaCheia()) {
        void sairTelaCheia();
    }

    document.body.classList.remove('is-fullscreen');
    document.body.classList.remove('mobile-gameplay-active');
    mobileOverlay?.classList.remove('active');
    if (fullscreenToggleBtn) {
        fullscreenToggleBtn.textContent = '⛶';
        fullscreenToggleBtn.setAttribute('aria-label', 'Entrar em tela cheia');
        fullscreenToggleBtn.setAttribute('aria-pressed', 'false');
        fullscreenToggleBtn.title = 'Tela cheia';
    }
}

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
    currentChallengeStartedAt = Date.now();
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
    if (!isOnlineGameplayMode()) {
        showControl(onlineMatchBanner, false);
    }
    syncDynamicMusicState();
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
        if (!isMobileViewport() && !isTrainingModeActive()) return;
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
    if (isTrainingModeActive()) {
        requestAnimationFrame(updateTrainingUi);
    }
}

// --- LOGICA DO BOTAO LIMPAR TABULEIRO --- //
const clearBoardBtn = document.getElementById('clear-board-btn');
let clearConfirmState = false;

function handleClearBoardAction() {
    if (!clearBoardBtn) return;
    if (isTrainingModeActive() && trainingState?.phase === 'guided') {
        showFloatingMessage('Vamos fechar essa parte guiada primeiro.', 1200);
        return;
    }
    if (!clearConfirmState) {
        clearBoardBtn.innerText = "CERTEZA?";
        clearBoardBtn.style.background = "var(--error)";
        clearBoardBtn.style.color = "#fff";
        clearConfirmState = true;

        setTimeout(() => {
            if (clearConfirmState) {
                resetClearButton();
            }
        }, 3000);
        return;
    }

    incrementPlayerStat('limpezasTabuleiro', 1);
    noteGameplayActivity();
    currentWord = [];
    replaceIndex = 0;
    charInput.placeholder = "?";
    render();
    saveGameSessionState();
    queueOnlineProgressSync();
    resetClearButton();
    if (typeof playSoundEffect === 'function') playSoundEffect('error');
}

if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', handleClearBoardAction);
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
    if (isTrainingModeActive() && trainingState?.phase === 'guided') {
        const expectedStep = getTrainingStepData();
        if (!expectedStep) return;
        if (char.toUpperCase() !== expectedStep.click.toUpperCase()) {
            handleTrainingWrongSelection();
            return;
        }
    }
    incrementPlayerStat('letrasConjuradas', 1);
    noteGameplayActivity();

    if (isFirstRound) {
        isFirstRound = false; 
        showFloatingMessage("Perfeito");
    }

    // Atualiza placeholder com a letra digitada
    charInput.placeholder = char.toUpperCase();

    historyList.innerHTML += char.toUpperCase() + ' ';
    historyList.scrollTop = historyList.scrollHeight;

    if (currentWord.length >= maxWordLength) {
        incrementPlayerStat('ciclosReiniciados', 1);
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
            showFloatingMessage("Pr\u00f3xima letra \u00e9 a \u00faltima! O ciclo vai reiniciar.", 1000);
            playSoundEffect('alert');
        }
        
        if (currentWord.length >= maxWordLength) {
            replaceIndex = 0;
        }
    }
    saveGameSessionState();
    queueOnlineProgressSync();
    if (isTrainingModeActive() && trainingState?.phase === 'guided') {
        handleTrainingGuidedProgress();
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

    render();
}


async function validate() {
    if (isGameplayTransitionLocked || isValidationInProgress) return;
    incrementPlayerStat('validacoesFeitas', 1);
    noteGameplayActivity();
    const word = currentWord.join('').toUpperCase();
    if (word.length < 2) return;
    isValidationInProgress = true;

    feedback.innerText = "Verificando...";

    if (currentGameMode === TRAINING_MODE) {
        try {
            if (trainingState?.phase === 'guided') {
                showFloatingMessage('Siga a indicação primeiro e depois valide.', 1200);
                return;
            }
            await handleTrainingValidation(word);
            return;
        } finally {
            isValidationInProgress = false;
        }
    }

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
                incrementPlayerStat('erros', 1);
                syncDynamicMusicState();
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
            incrementPlayerStat('vitorias', 1);
            await onValidGameFinished();
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
        incrementPlayerStat('vitorias', 1);
        const campaignResult = await handleCorrectAnswer();
        await onValidGameFinished();
        if (isOnlineGameplayMode()) {
            await finalizeOnlineMatch();
        }

        playMediaSound(successSound, 0.7); playSoundEffect('victory'); triggerConfetti();
        animateMage('win');
        if (!campaignResult?.completedNow && !isOnlineGameplayMode()) {
            showMobileVictoryPopup();
        }

        stopHintCycle(); clearAllHighlights();

        setTimeout(() => {
            document.body.classList.remove('success-flash');

            if (currentGameMode === CAMPAIGN_MODE && currentCampaignLevel) {
                if (campaignResult?.journeyCompletedNow) {
                    feedback.innerText = "";
                    showJourneyFinaleScreen();
                } else if (campaignResult?.completedNow) {
                    feedback.innerText = "";
                    openCampaignCompleteModal({
                        currentLevel: currentCampaignLevel,
                        nextLevel: campaignResult?.nextLevel || null
                    });
                } else {
                    startCampaignLevel(currentCampaignLevel);
                    feedback.innerText = "Novo desafio do livro iniciado!";
                }
            } else if (isOnlineGameplayMode()) {
                feedback.innerText = currentGameMode === ONLINE_PARTY_MODE
                    ? "Resultado enviado. Aguardando a party finalizar..."
                    : "Resultado enviado. Aguardando o duelo finalizar...";
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
        incrementPlayerStat('erros', 1);
        syncDynamicMusicState();
        if (isOnlineGameplayMode()) {
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
            incrementPlayerStat('galinhasInvocadas', 1);

            const chickenAudio = new Audio('galinha.mp3');
            playMediaSound(chickenAudio, 1);

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
        if (sidebar.classList.contains('collapsed')) {
            toggleBtn.innerText = '\u25B6';
            toggleBtn.setAttribute('aria-label', 'Expandir lateral');
        } else {
            toggleBtn.innerText = '\u25C0';
            toggleBtn.setAttribute('aria-label', 'Recolher lateral');
        }
    };
}
const isMobileViewport = () => window.matchMedia('(max-width: 800px)').matches;
const isGameplayAppVisible = () => !document.getElementById('app-container')?.classList.contains('hidden-app');
const MUSIC_CONTEXT_MENU = 'menu';
const MUSIC_CONTEXT_GAMEPLAY_NORMAL = 'gameplay_normal';
const MUSIC_CONTEXT_GAMEPLAY_TENSAO = 'gameplay_tensao';
const MUSIC_CONTEXT_GAMEPLAY_RELAX = 'gameplay_relax';
const MUSIC_CONTEXT_FIM_JOGO = 'fim_jogo';
const MUSIC_TRACK_LIBRARY = {
    [MUSIC_CONTEXT_MENU]: [
        encodeURI('MUSICAS/MENU/Arcane Reading Room.mp3')
    ],
    [MUSIC_CONTEXT_GAMEPLAY_NORMAL]: [
        encodeURI('MUSICAS/FOCO INTELIGENTE/Arcane Reading Room (1).mp3'),
        encodeURI('MUSICAS/FOCO INTELIGENTE/Arcane Reading Room (2).mp3')
    ],
    [MUSIC_CONTEXT_GAMEPLAY_TENSAO]: [
        encodeURI('MUSICAS/FOCO COM TENSAO/Arcane Lattice.mp3'),
        encodeURI('MUSICAS/FOCO COM TENSAO/Arcane Logic Loop.mp3'),
        encodeURI('MUSICAS/FOCO COM TENSAO/Runes in Motion.mp3')
    ],
    [MUSIC_CONTEXT_GAMEPLAY_RELAX]: [
        encodeURI('MUSICAS/FOCO RELAXANTE (anti-estresse)/Moonlit Puzzle Grove (1).mp3'),
        encodeURI('MUSICAS/FOCO RELAXANTE (anti-estresse)/Moonlit Puzzle Grove.mp3')
    ],
    [MUSIC_CONTEXT_FIM_JOGO]: [
        encodeURI("MUSICAS/FIM DO JOGO/Puzzle’s Quiet Victory.mp3")
    ]
};
const MUSIC_CONTEXT_VOLUME = {
    [MUSIC_CONTEXT_MENU]: 0.42,
    [MUSIC_CONTEXT_GAMEPLAY_NORMAL]: 0.38,
    [MUSIC_CONTEXT_GAMEPLAY_TENSAO]: 0.4,
    [MUSIC_CONTEXT_GAMEPLAY_RELAX]: 0.37,
    [MUSIC_CONTEXT_FIM_JOGO]: 0.5
};
let initialLoadingStarted = false;
let menuMusicUnlocked = false;
let playerStats = null;
let audioSettings = null;
let gameplayTimeIntervalId = null;
let gameplayTimeLastTick = 0;
let gameplayLastActivityAt = 0;
let currentChallengeStartedAt = 0;
let journeyFinaleShown = false;
let journeyFinaleCounterRaf = 0;
const audioManager = {
    unlocked: false,
    unlockBound: false,
    currentContext: '',
    currentTrackIndex: -1,
    currentAudio: null,
    transitionToken: 0,
    lastTrackIndexByContext: {},
    nextTrackPreloader: null,
    getPlaylist(context) {
        return Array.isArray(MUSIC_TRACK_LIBRARY[context]) ? MUSIC_TRACK_LIBRARY[context] : [];
    },
    getContextVolume(context) {
        const baseVolume = MUSIC_CONTEXT_VOLUME[context] ?? 0.4;
        const settings = ensureAudioSettingsLoaded();
        if (!settings.musicEnabled) return 0;
        return Math.max(0, Math.min(1, baseVolume * settings.musicVolume));
    },
    bindUnlock() {
        if (this.unlockBound) return;
        this.unlockBound = true;

        const unlock = () => {
            this.unlocked = true;
            menuMusicUnlocked = true;
            this.unlockBound = false;
            document.removeEventListener('pointerdown', unlock, true);
            document.removeEventListener('keydown', unlock, true);
            document.removeEventListener('touchstart', unlock, true);
            syncDynamicMusicState();
        };

        document.addEventListener('pointerdown', unlock, true);
        document.addEventListener('keydown', unlock, true);
        document.addEventListener('touchstart', unlock, true);
    },
    preloadUpcomingTrack(context, nextIndex) {
        const playlist = this.getPlaylist(context);
        const nextSrc = playlist[nextIndex];
        if (!nextSrc) {
            this.nextTrackPreloader = null;
            return;
        }
        const preloader = new Audio(nextSrc);
        preloader.preload = 'auto';
        preloader.playsInline = true;
        this.nextTrackPreloader = preloader;
    },
    createAudio(src) {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.playsInline = true;
        return audio;
    },
    stopCurrentAudio({ fadeOut = false, durationMs = 550 } = {}) {
        const audio = this.currentAudio;
        if (!audio) return;

        const finishStop = () => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0;
            audio.onended = null;
            if (this.currentAudio === audio) {
                this.currentAudio = null;
                this.currentContext = '';
                this.currentTrackIndex = -1;
            }
        };

        if (!fadeOut) {
            finishStop();
            return;
        }

        fadeAudioVolume(audio, audio.volume, 0, durationMs, finishStop);
    },
    async playTrack(context, trackIndex, options = {}) {
        const playlist = this.getPlaylist(context);
        if (!playlist.length) return;

        const safeIndex = ((trackIndex % playlist.length) + playlist.length) % playlist.length;
        const src = playlist[safeIndex];
        const token = ++this.transitionToken;
        const previousAudio = this.currentAudio;
        const previousContext = this.currentContext;
        const shouldFadeOutPrevious = !!previousAudio && !previousAudio.paused && options.fadeOutPrevious !== false;
        const startNext = async () => {
            if (token !== this.transitionToken) return;

            const audio = this.createAudio(src);
            audio.volume = 0;
            audio.onended = () => {
                if (this.currentAudio !== audio || this.currentContext !== context) return;
                this.lastTrackIndexByContext[context] = safeIndex;
                const nextIndex = (safeIndex + 1) % playlist.length;
                this.playTrack(context, nextIndex, { fadeOutPrevious: false, fadeIn: true }).catch((err) => {
                    console.log('Falha ao avançar playlist:', err);
                });
            };

            this.currentAudio = audio;
            this.currentContext = context;
            this.currentTrackIndex = safeIndex;
            this.lastTrackIndexByContext[context] = safeIndex;
            this.preloadUpcomingTrack(context, (safeIndex + 1) % playlist.length);

            try {
                await audio.play();
                if (token !== this.transitionToken) {
                    audio.pause();
                    return;
                }
                fadeAudioVolume(audio, 0, this.getContextVolume(context), options.fadeIn === false ? 0 : 850);
            } catch (err) {
                if (token !== this.transitionToken) return;
                console.log('Falha ao tocar trilha:', err);
                this.currentAudio = null;
                this.currentContext = '';
                this.currentTrackIndex = -1;
                this.bindUnlock();
            }
        };

        if (previousAudio && previousAudio !== this.currentAudio) {
            previousAudio.pause();
        }

        if (shouldFadeOutPrevious) {
            fadeAudioVolume(previousAudio, previousAudio.volume, 0, 420, () => {
                previousAudio.pause();
                previousAudio.currentTime = 0;
                previousAudio.onended = null;
                if (this.currentAudio === previousAudio) {
                    this.currentAudio = null;
                }
                startNext();
            });
            return;
        }

        if (previousAudio) {
            previousAudio.pause();
            previousAudio.currentTime = 0;
            previousAudio.onended = null;
            if (previousContext === this.currentContext) {
                this.currentAudio = null;
            }
        }

        await startNext();
    },
    async setContext(context, { forceRestart = false } = {}) {
        if (!this.unlocked) {
            this.bindUnlock();
            return;
        }

        const playlist = this.getPlaylist(context);
        if (!playlist.length) return;

        if (!forceRestart && this.currentContext === context && this.currentAudio && !this.currentAudio.paused) {
            return;
        }

        let nextIndex = 0;
        if (!forceRestart) {
            const lastIndex = Number(this.lastTrackIndexByContext[context]);
            nextIndex = Number.isFinite(lastIndex) ? (lastIndex + 1) % playlist.length : 0;
        }

        await this.playTrack(context, nextIndex, { fadeOutPrevious: true, fadeIn: true });
    },
    stopAll({ fadeOut = false } = {}) {
        this.transitionToken += 1;
        this.stopCurrentAudio({ fadeOut });
    },
    applyCurrentVolume() {
        if (!this.currentAudio || !this.currentContext) return;
        this.currentAudio.volume = this.getContextVolume(this.currentContext);
    }
};

function getDesiredGameplayMusicContext() {
    const challengeElapsedMs = currentChallengeStartedAt ? Date.now() - currentChallengeStartedAt : 0;
    if (challengeElapsedMs >= 420000 || consecutiveErrors >= 5) {
        return MUSIC_CONTEXT_GAMEPLAY_RELAX;
    }
    if (consecutiveErrors >= 2 || challengeElapsedMs >= 150000) {
        return MUSIC_CONTEXT_GAMEPLAY_TENSAO;
    }
    return MUSIC_CONTEXT_GAMEPLAY_NORMAL;
}

function getDesiredMusicContext() {
    const isFinaleVisible = !!journeyFinaleModal && !journeyFinaleModal.classList.contains('hidden-control');
    if (isFinaleVisible) return MUSIC_CONTEXT_FIM_JOGO;
    if (!menuMusicUnlocked) return '';
    if (isGameplayAppVisible()) {
        return getDesiredGameplayMusicContext();
    }
    return MUSIC_CONTEXT_MENU;
}

function getDefaultAudioSettings() {
    return {
        musicEnabled: true,
        musicVolume: 1,
        sfxEnabled: true,
        sfxVolume: 1
    };
}

function normalizeAudioSettings(rawSettings) {
    const base = rawSettings && typeof rawSettings === 'object' ? rawSettings : {};
    return {
        musicEnabled: base.musicEnabled !== false,
        musicVolume: Math.max(0, Math.min(1, Number.isFinite(Number(base.musicVolume)) ? Number(base.musicVolume) : 1)),
        sfxEnabled: base.sfxEnabled !== false,
        sfxVolume: Math.max(0, Math.min(1, Number.isFinite(Number(base.sfxVolume)) ? Number(base.sfxVolume) : 1))
    };
}

function ensureAudioSettingsLoaded() {
    if (!audioSettings) {
        loadAudioSettings();
    }
    return audioSettings;
}

function loadAudioSettings() {
    try {
        const stored = localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);
        audioSettings = normalizeAudioSettings(stored ? JSON.parse(stored) : getDefaultAudioSettings());
    } catch (err) {
        console.log('Falha ao carregar configurações de áudio:', err);
        audioSettings = normalizeAudioSettings(getDefaultAudioSettings());
    }
    return audioSettings;
}

function saveAudioSettings(nextSettings = audioSettings) {
    audioSettings = normalizeAudioSettings(nextSettings);
    try {
        localStorage.setItem(AUDIO_SETTINGS_STORAGE_KEY, JSON.stringify(audioSettings));
    } catch (err) {
        console.log('Falha ao salvar configurações de áudio:', err);
    }
    return audioSettings;
}

function updateAudioSettingsUi() {
    const settings = ensureAudioSettingsLoaded();
    if (audioMusicEnabledInput) audioMusicEnabledInput.checked = !!settings.musicEnabled;
    if (audioMusicVolumeInput) audioMusicVolumeInput.value = String(Math.round(settings.musicVolume * 100));
    if (audioMusicVolumeValue) audioMusicVolumeValue.innerText = `${Math.round(settings.musicVolume * 100)}%`;
    if (audioSfxEnabledInput) audioSfxEnabledInput.checked = !!settings.sfxEnabled;
    if (audioSfxVolumeInput) audioSfxVolumeInput.value = String(Math.round(settings.sfxVolume * 100));
    if (audioSfxVolumeValue) audioSfxVolumeValue.innerText = `${Math.round(settings.sfxVolume * 100)}%`;
}

function getEffectiveSfxVolume(baseVolume = 1) {
    const settings = ensureAudioSettingsLoaded();
    if (!settings.sfxEnabled) return 0;
    return Math.max(0, Math.min(1, Number(baseVolume || 0) * settings.sfxVolume));
}

function applyAudioSettings() {
    const settings = ensureAudioSettingsLoaded();
    applySfxSettingsToAudioGraph();
    if (successSound) {
        successSound.volume = getEffectiveSfxVolume(0.7);
    }
    if (!settings.musicEnabled) {
        audioManager.stopAll({ fadeOut: true });
    } else {
        audioManager.applyCurrentVolume();
        syncDynamicMusicState();
    }
    updateAudioSettingsUi();
}

function updateAudioSetting(key, value) {
    const settings = ensureAudioSettingsLoaded();
    settings[key] = value;
    saveAudioSettings(settings);
    applyAudioSettings();
}

function syncDynamicMusicState({ forceRestart = false } = {}) {
    const context = getDesiredMusicContext();
    if (!context) return;
    if (!ensureAudioSettingsLoaded().musicEnabled) return;
    audioManager.setContext(context, { forceRestart }).catch((err) => {
        console.log('Falha ao sincronizar trilha dinâmica:', err);
    });
}

function stopMenuMusic() {
    if (audioManager.currentContext !== MUSIC_CONTEXT_MENU) return;
    audioManager.stopAll({ fadeOut: false });
}

function tryStartMenuMusic(forceRestart = false) {
    if (!menuMusicUnlocked) {
        audioManager.bindUnlock();
        return;
    }
    if (isGameplayAppVisible()) {
        stopMenuMusic();
        return;
    }
    syncDynamicMusicState({ forceRestart });
}

function bindMenuMusicUnlock() {
    audioManager.bindUnlock();
}

function hasBlockingGameplayOverlayOpen() {
    return !!document.querySelector(
        '#profile-modal:not(.hidden-control), #ranking-modal:not(.hidden-control), #daily-result-modal:not(.hidden-control), #campaign-level-complete-modal:not(.hidden-control), #online-result-modal:not(.hidden-control), #journey-finale-modal:not(.hidden-control), #audio-settings-modal:not(.hidden-control), #arcane-streak-modal:not(.hidden-control), #public-player-modal:not(.hidden-control), #friends-modal:not(.hidden-control)'
    );
}

function isTypingContextTarget(target) {
    if (!target) return false;
    if (target === charInput) return false;
    if (target.isContentEditable) return true;
    const tagName = target.tagName;
    return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || tagName === 'BUTTON';
}

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

document.addEventListener('visibilitychange', () => {
    syncGameplayTimeTracking();
    if (document.hidden) return;
    syncDynamicMusicState();
});

document.addEventListener('keydown', (event) => {
    if (isMobileViewport() || !isGameplayAppVisible() || hasBlockingGameplayOverlayOpen()) return;
    if (isTypingContextTarget(event.target)) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key || '';

    if (/^[a-zA-Z]$/.test(key)) {
        event.preventDefault();
        addChar(key);
        if (charInput) {
            charInput.value = '';
            charInput.focus();
        }
        return;
    }

    if (key === 'Enter') {
        event.preventDefault();
        validate();
        return;
    }

    if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        handleClearBoardAction();
        return;
    }
});

document.addEventListener('pointerdown', () => {
    if (!isGameScreenVisible()) return;
    noteGameplayActivity();
}, true);

document.addEventListener('touchstart', () => {
    if (!isGameScreenVisible()) return;
    noteGameplayActivity();
}, true);

document.addEventListener('keydown', () => {
    if (!isGameScreenVisible()) return;
    noteGameplayActivity();
}, true);

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
const sfxMasterGain = audioCtx.createGain();
sfxMasterGain.connect(audioCtx.destination);

function applySfxSettingsToAudioGraph() {
    const settings = ensureAudioSettingsLoaded();
    sfxMasterGain.gain.setValueAtTime(getEffectiveSfxVolume(1), audioCtx.currentTime);
}

function playMediaSound(audio, baseVolume = 1) {
    if (!audio) return;
    const volume = getEffectiveSfxVolume(baseVolume);
    if (volume <= 0) return;
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch((err) => console.log('Erro no áudio:', err));
}

function playSoundEffect(type) {
    if (getEffectiveSfxVolume(1) <= 0) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(sfxMasterGain);
    const now = audioCtx.currentTime;

    if (type === 'type') {
        osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'victory') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const oscV = audioCtx.createOscillator(); const gainV = audioCtx.createGain();
            oscV.type = 'triangle'; oscV.frequency.setValueAtTime(freq, now + i*0.1);
            oscV.connect(gainV); gainV.connect(sfxMasterGain);
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

let floatingMessageTimeout = null;

function showFloatingMessage(text, duration = 2000) {
    const msg = document.getElementById('floating-msg');
    if (!msg) return;
    if (floatingMessageTimeout) {
        clearTimeout(floatingMessageTimeout);
        floatingMessageTimeout = null;
    }
    msg.innerText = sanitizeGameText(text);
    msg.classList.toggle('floating-toast-active', document.body.classList.contains('mobile-gameplay-active'));
    msg.classList.remove('hidden');
    floatingMessageTimeout = setTimeout(() => {
        msg.classList.add('hidden');
        msg.classList.remove('floating-toast-active');
        floatingMessageTimeout = null;
    }, duration);
}

function buildMobilePanel(titleText, options = {}) {
    const { collapsible = false, collapsed = false } = options;
    const panel = document.createElement('div');
    panel.className = 'mobile-panel';
    const header = document.createElement('div');
    header.className = 'mobile-panel-title';
    if (collapsible) {
        panel.classList.add('mobile-panel--collapsible');
        if (collapsed) panel.classList.add('mobile-panel--collapsed');
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');

        const titleLabel = document.createElement('span');
        titleLabel.className = 'mobile-panel-title-label';
        titleLabel.innerText = titleText;

        const indicator = document.createElement('span');
        indicator.className = 'mobile-panel-toggle';
        indicator.innerText = '▾';

        header.appendChild(titleLabel);
        header.appendChild(indicator);

        const togglePanel = () => {
            panel.classList.toggle('mobile-panel--collapsed');
        };

        header.addEventListener('click', togglePanel);
        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                togglePanel();
            }
        });
    } else {
        header.innerText = titleText;
    }
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
        const rulesPanel = buildMobilePanel('Regras M\u00E1gicas', {
            collapsible: true,
            collapsed: false
        });
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
    const backBtn = document.getElementById('tutorial-back-btn');

    if (!welcome || !track || !leftArrow || !rightArrow || !indicator || !skipBtn || !backBtn) return;

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
        skipBtn.style.display = safeIndex === tutorialPageCount - 1 ? 'none' : 'inline-flex';
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
    backBtn.addEventListener('click', () => {
        if (welcomeScreen) welcomeScreen.style.display = 'none';
        document.getElementById('app-container')?.classList.add('hidden-app');
        hideCampaignScreen();
        hideOnlineScreen();
        setMobileGameplayMenuVisibility(false);
        showHubScreen(true);
        syncTopUserUi(activeUser, activeUserDoc);
        syncRefreshLockState();
    });

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
    if (modeSelector) {
        modeSelector.value = '';
    }
    syncModeSelectionUi();
    setupMobileLayout();
    initBookTutorial();

    startMageIdle();
    // initChallenge ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© chamado apenas quando clica em START agora
});

// LOGICA DO BOTAO DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    if (!modeSelector?.value) return;
    markTutorialSeen();
    beginSelectedGameFlow();

    if (audioCtx.state === 'suspended') audioCtx.resume();
    syncTopUserUi(activeUser, activeUserDoc);
};
/* ================= HUB CONTROLE ================= */

const hub = document.getElementById("main-hub");
const hubPlay = document.getElementById("hub-play");
const hubTraining = document.getElementById("hub-training");
const welcomeScreen = document.getElementById("welcome-screen");

hubPlay.addEventListener("click", async () => {
    await entrarTelaCheia();
    clearGameSessionState();
    stopHintCycle();
    resetDailySession();
    const appContainer = document.getElementById('app-container');
    if (appContainer) appContainer.classList.add('hidden-app');
    const goToLastPage = hasSeenTutorial();
    openWelcomeTutorial(goToLastPage);
});

hubTraining?.addEventListener("click", () => {
    startTrainingMode();
});

fullscreenToggleBtn?.addEventListener('click', alternarTelaCheia);
document.addEventListener('fullscreenchange', atualizarEstadoFullscreen);
document.addEventListener('webkitfullscreenchange', atualizarEstadoFullscreen);

campaignBackBtn?.addEventListener('click', () => {
    openWelcomeTutorial(true);
});

// BotÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¾ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Âµes futuros
document.getElementById("hub-profile").addEventListener("click", () => {
    openProfileModal();
});

document.getElementById("hub-friends")?.addEventListener("click", () => {
    openFriendsModal();
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
    const modeButtons = document.querySelectorAll('.mode-option-btn');

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

    modeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (!modeSelector) return;
            const nextMode = button.dataset.mode;
            if (!nextMode || modeSelector.value === nextMode) {
                syncModeSelectionUi();
                return;
            }
            modeSelector.value = nextMode;
            modeSelector.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });
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
const TRAINING_MODE = 'training';
const ONLINE_PARTY_MODE = 'online_party';
const ONLINE_ROOM_COLLECTION = 'rooms';
const ONLINE_MATCHMAKING_COLLECTION = 'matchmaking';
const ONLINE_MATCHMAKING_DOC = 'online_1v1';
const ONLINE_ROOM_TYPE_DUEL = 'duel';
const ONLINE_ROOM_TYPE_PARTY = 'party';
const ONLINE_PARTY_MAX_PLAYERS = 4;
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
const TRAINING_LESSONS = [
    {
        title: 'Treinamento 1',
        word: 'SOL',
        clicks: ['H', 'L', 'L'],
        guidedSteps: [
            { click: 'H', text: 'Vamos conjurar SOL juntos. Comece pelo H.' },
            { click: 'L', text: 'Boa. O H vira S porque é espelhado. Agora vamos para o L.' },
            { click: 'L', text: 'Perfeito. Mais um L e fechamos a palavra SOL.' }
        ],
        guidedCompleteText: 'Boa! SOL apareceu certinho.',
        practiceIntroText: 'Agora é sua vez. Tente fazer SOL sozinho.'
    },
    {
        title: 'Treinamento 2',
        word: 'LUA',
        clicks: ['L', 'U', 'Z'],
        guidedSteps: [
            { click: 'L', text: 'Agora vamos formar LUA. Comece pelo L.' },
            { click: 'U', text: 'Boa. Agora toque no U. Como ele é vogal, ele altera a próxima letra.' },
            { click: 'Z', text: 'Perfeito. Clique no Z, porque com o efeito da vogal ele vira A.' }
        ],
        guidedCompleteText: 'Perfeito! A magia da vogal funcionou.',
        practiceIntroText: 'Agora tenta sozinho. Você consegue fazer LUA.'
    }
];
const TRAINING_FINAL_SEQUENCE = [
    { word: 'SOL', clicks: ['H', 'L', 'L'] },
    { word: 'LUA', clicks: ['L', 'U', 'Z'] },
    { word: 'BOI', clicks: ['B', 'O', 'H'] },
    { word: 'MAR', clicks: ['N', 'Z', 'R'] }
];
const TRAINING_FINAL_REWARD_LABELS = {
    2: 'Boa ⚡',
    3: 'Top 🔥',
    4: 'Perfeito 👑'
};
let activeUser = null;
let activeUserDoc = null;
for (let i = 0; i < DAILY_SHARE_TEMPLATES.length; i++) {
    DAILY_SHARE_TEMPLATES[i] = sanitizeGameText(DAILY_SHARE_TEMPLATES[i]);
}

function isTrainingModeActive() {
    return currentGameMode === TRAINING_MODE && !!trainingState;
}

function getCurrentTrainingLesson() {
    if (!trainingState) return null;
    return TRAINING_LESSONS[trainingState.lessonIndex] || null;
}

function getCurrentTrainingFinalChallenge() {
    if (!trainingState) return null;
    return TRAINING_FINAL_SEQUENCE[trainingState.finalIndex] || null;
}

function clearTrainingTransitionTimeout() {
    if (!trainingTransitionTimeout) return;
    clearTimeout(trainingTransitionTimeout);
    trainingTransitionTimeout = null;
}

function hideTrainingHand() {
    if (!trainingHand) return;
    trainingHand.classList.add('hidden-control');
    trainingHand.classList.remove('is-active');
}

function hideTrainingPanel() {
    showControl(trainingPanel, false);
    hideTrainingHand();
    document.querySelectorAll('.mini-char.training-target').forEach((button) => {
        button.classList.remove('training-target');
    });
    document.body.classList.remove('training-mode-active', 'training-guided-active');
}

function showTrainingPanel() {
    if (!trainingPanel) return;
    showControl(trainingPanel, true);
    document.body.classList.add('training-mode-active');
}

function getTrainingCurrentChallenge() {
    if (!trainingState) return null;
    if (trainingState.phase === 'final') {
        return getCurrentTrainingFinalChallenge();
    }

    const lesson = getCurrentTrainingLesson();
    if (!lesson) return null;
    return {
        word: lesson.word,
        clicks: lesson.clicks
    };
}

function getTrainingPhaseWord() {
    return getTrainingCurrentChallenge()?.word || '---';
}

function getTrainingStepData() {
    const lesson = getCurrentTrainingLesson();
    if (!lesson || !trainingState) return null;

    if (trainingState.phase === 'guided') {
        return lesson.guidedSteps[trainingState.stepIndex] || null;
    }
    return null;
}

function updateTrainingHandPosition() {
    if (!trainingHand || !isTrainingModeActive()) {
        hideTrainingHand();
        return;
    }

    const step = getTrainingStepData();
    if (!step) {
        hideTrainingHand();
        return;
    }

    const targetButton = document.getElementById(`mini-${step.click}`);
    if (!targetButton) {
        hideTrainingHand();
        return;
    }

    document.querySelectorAll('.mini-char.training-target').forEach((button) => {
        button.classList.remove('training-target');
    });
    targetButton.classList.add('training-target');

    const rect = targetButton.getBoundingClientRect();
    trainingHand.style.left = `${rect.left + (rect.width / 2)}px`;
    trainingHand.style.top = `${rect.top + 4}px`;
    trainingHand.classList.remove('hidden-control');
    trainingHand.classList.add('is-active');
}

function updateTrainingUi() {
    if (!isTrainingModeActive()) {
        hideTrainingPanel();
        return;
    }

    const lesson = getCurrentTrainingLesson();
    if (!lesson) {
        hideTrainingPanel();
        return;
    }

    showTrainingPanel();
    const isGuided = trainingState.phase === 'guided';
    document.body.classList.toggle('training-guided-active', isGuided);

    if (trainingPanelKicker) {
        if (trainingState.phase === 'final') {
            trainingPanelKicker.innerText = 'Fase Final';
        } else {
            trainingPanelKicker.innerText = lesson.title;
        }
    }
    if (trainingPanelStage) {
        if (trainingState.phase === 'guided') {
            trainingPanelStage.innerText = `Passo ${trainingState.stepIndex + 1}`;
        } else if (trainingState.phase === 'practice') {
            trainingPanelStage.innerText = 'Teste Imediato';
        } else {
            trainingPanelStage.innerText = `Sequência ${Math.min((trainingState.finalIndex || 0) + 1, TRAINING_FINAL_SEQUENCE.length)}/${TRAINING_FINAL_SEQUENCE.length}`;
        }
    }
    if (trainingTargetWord) {
        trainingTargetWord.innerText = getTrainingPhaseWord();
    }
    if (trainingPanelCopy) {
        if (trainingState.phase === 'guided') {
            trainingPanelCopy.innerText = getTrainingStepData()?.text || '';
        } else if (trainingState.phase === 'practice') {
            trainingPanelCopy.innerText = lesson.practiceIntroText;
        } else {
            const currentChallenge = getCurrentTrainingFinalChallenge();
            const baseCopy = currentChallenge
                ? `Agora sem ajuda. Conjure ${currentChallenge.word} sozinho e mantenha sua sequência viva.`
                : 'Agora é com você. Continue acertando para manter sua sequência.';
            const streakCopy = trainingState.finalStreak >= 2 && TRAINING_FINAL_REWARD_LABELS[trainingState.finalStreak]
                ? ` ${TRAINING_FINAL_REWARD_LABELS[trainingState.finalStreak]}`
                : '';
            trainingPanelCopy.innerText = `${baseCopy}${streakCopy}`;
        }
    }

    if (validateBtn) {
        validateBtn.disabled = trainingState.phase === 'guided';
    }
    if (clearBoardBtn) {
        clearBoardBtn.disabled = trainingState.phase === 'guided';
    }

    requestAnimationFrame(updateTrainingHandPosition);
}

function finishTrainingMode() {
    trainingState = null;
    clearTrainingTransitionTimeout();
    hideTrainingPanel();
    if (validateBtn) validateBtn.disabled = false;
    if (clearBoardBtn) clearBoardBtn.disabled = false;
    document.querySelectorAll('.mini-char.training-target').forEach((button) => {
        button.classList.remove('training-target');
    });
    showFloatingMessage('Treinamento concluído! Sua magia está fluindo. ✨', 2400);
    void showHubScreenFromGame();
}

function startTrainingPhase(phase) {
    if (!trainingState) return;
    const lesson = getCurrentTrainingLesson();
    const currentChallenge = phase === 'final' ? getCurrentTrainingFinalChallenge() : lesson;
    if (!currentChallenge || !lesson) return;

    trainingState.phase = phase;
    trainingState.stepIndex = 0;
    currentGameMode = TRAINING_MODE;
    currentCampaignLevel = null;
    resetDailySession();
    clearAllHighlights();
    animateMage('reset');
    showGameScreen();

    const challengeWord = phase === 'final' ? currentChallenge.word : lesson.word;
    startChallengeEngine({
        word: challengeWord,
        hints: [challengeWord],
        meaning: 'Treinamento arcano'
    }, {
        wordLength: challengeWord.length,
        resetHistory: true
    });

    feedback.innerText = '';
    feedback.style.color = '';
    meaningBox.classList.add('hidden');
    meaningBox.innerText = '';
    updateTrainingUi();
}

function startTrainingMode() {
    clearGameSessionState();
    stopHintCycle();
    resetDailySession();
    clearTrainingTransitionTimeout();
    trainingState = {
        lessonIndex: 0,
        phase: 'guided',
        stepIndex: 0,
        finalIndex: 0,
        finalStreak: 0
    };
    startTrainingPhase('guided');
}

function moveToNextTrainingLesson() {
    if (!trainingState) return;
    trainingState.lessonIndex += 1;
    if (trainingState.lessonIndex >= TRAINING_LESSONS.length) {
        finishTrainingMode();
        return;
    }
    startTrainingPhase('guided');
}

function handleTrainingWrongSelection() {
    if (typeof navigator?.vibrate === 'function') {
        navigator.vibrate(25);
    }
    animateMage('sad');
    playSoundEffect('error');
    showFloatingMessage('Siga o ponteiro mágico e tente de novo.', 1200);
}

function handleTrainingGuidedProgress() {
    if (!isTrainingModeActive()) return;
    const lesson = getCurrentTrainingLesson();
    if (!lesson || !trainingState) return;

    const stepList = lesson.guidedSteps;
    trainingState.stepIndex += 1;

    if (trainingState.stepIndex < stepList.length) {
        updateTrainingUi();
        return;
    }

    const finalCopy = lesson.guidedCompleteText;
    if (trainingPanelCopy) trainingPanelCopy.innerText = finalCopy;
    hideTrainingHand();
    feedback.innerText = finalCopy;
    feedback.style.color = 'var(--success)';
    animateMage('win');
    clearTrainingTransitionTimeout();
    trainingTransitionTimeout = window.setTimeout(() => {
        if (!trainingState) return;
        startTrainingPhase('practice');
    }, 1300);
}

async function handleTrainingValidation(word) {
    if (!trainingState) return;
    const lesson = getCurrentTrainingLesson();
    const challenge = getTrainingCurrentChallenge();
    if (!lesson || !challenge) return;

    const expectedWord = challenge.word.toUpperCase();
    const clickedSequence = historyList?.innerText?.trim().split(/\s+/).filter(Boolean) || [];
    const expectedClicks = challenge.clicks || [];
    const clickedMatches = clickedSequence.join('') === expectedClicks.join('');
    const isCorrect = word === expectedWord;

    if (isCorrect) {
        feedback.style.color = 'var(--success)';
        animateMage('win');
        triggerConfetti();

        if (trainingState.phase === 'practice') {
            feedback.innerText = `Boa! ${expectedWord} saiu certinho.`;
            meaningBox.innerText = `Você mandou bem em ${expectedWord}.`;
            meaningBox.classList.remove('hidden');
            clearTrainingTransitionTimeout();
            trainingTransitionTimeout = window.setTimeout(() => {
                if (!trainingState) return;
                if (trainingState.lessonIndex < TRAINING_LESSONS.length - 1) {
                    moveToNextTrainingLesson();
                    return;
                }
                trainingState.finalIndex = 0;
                trainingState.finalStreak = 0;
                startTrainingPhase('final');
            }, 1300);
            return;
        }

        if (trainingState.phase === 'final') {
            trainingState.finalStreak = (trainingState.finalStreak || 0) + 1;
            const rewardLabel = TRAINING_FINAL_REWARD_LABELS[trainingState.finalStreak] || '';
            const rewardMessage = rewardLabel
                ? `${rewardLabel}`
                : 'Boa! Continue acertando.';

            feedback.innerText = rewardMessage;
            meaningBox.innerText = `Sequência atual: ${trainingState.finalStreak}/${TRAINING_FINAL_SEQUENCE.length}`;
            meaningBox.classList.remove('hidden');
            if (rewardLabel) {
                showFloatingMessage(rewardLabel, 1200);
            }

            clearTrainingTransitionTimeout();
            trainingTransitionTimeout = window.setTimeout(() => {
                if (!trainingState) return;
                trainingState.finalIndex += 1;
                if (trainingState.finalIndex >= TRAINING_FINAL_SEQUENCE.length) {
                    finishTrainingMode();
                    return;
                }
                startTrainingPhase('final');
            }, 1300);
        }
        return;
    }

    incrementPlayerStat('erros', 1);
    feedback.style.color = 'var(--error)';
    animateMage('sad');
    playSoundEffect('error');

    if (trainingState.phase === 'practice') {
        feedback.innerText = `Quase. Vamos fazer ${expectedWord} juntos mais uma vez.`;
        showErrorMageFeedback(`Tudo bem. Vamos retomar ${expectedWord} com calma.`);
        meaningBox.innerText = `Vamos repetir ${expectedWord}. Você pega essa lógica rapidinho.`;
        meaningBox.classList.remove('hidden');
        clearTrainingTransitionTimeout();
        trainingTransitionTimeout = window.setTimeout(() => {
            startTrainingPhase('guided');
        }, 1200);
        return;
    }

    trainingState.finalStreak = 0;
    feedback.innerText = `${expectedWord} escapou dessa vez. Vamos tentar de novo.`;
    showErrorMageFeedback('A sequência voltou ao início, mas você já está perto. Bora mais uma.');
    meaningBox.innerText = clickedMatches
        ? `A sequência reiniciou. Refaça ${expectedWord} para seguir em frente.`
        : `Tente de novo. O que vale é formar ${expectedWord} certinho no tabuleiro.`;
    meaningBox.classList.remove('hidden');
    clearTrainingTransitionTimeout();
    trainingTransitionTimeout = window.setTimeout(() => {
        startTrainingPhase('final');
    }, 1200);
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

    if (isAdminUser()) {
        CAMPAIGN_LEVELS.forEach((level) => unlockedSet.add(level));
    }

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
    if (isAdminUser()) return 'available';
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
    if (!modeSelector) return;

    const selectedMode = modeSelector.value || '';
    if (lengthSelector) {
        lengthSelector.disabled = true;
    }

    if (modeButtonGroup) {
        modeButtonGroup.querySelectorAll('.mode-option-btn').forEach((button) => {
            const isSelected = button.dataset.mode === selectedMode;
            button.classList.toggle('mode-option-selected', isSelected);
            button.setAttribute('aria-checked', isSelected ? 'true' : 'false');
        });
    }

    if (startGameBtn) {
        const hasSelection = !!selectedMode;
        startGameBtn.disabled = !hasSelection;
        startGameBtn.setAttribute('aria-disabled', hasSelection ? 'false' : 'true');
    }

    if (!selectedMode) {
        if (modeWarning) {
            modeWarning.style.display = 'block';
            modeWarning.innerText = 'Escolha um modo de jogo para continuar.';
        }
        return;
    }

    if (selectedMode === CAMPAIGN_MODE) {
        if (lengthSelector) lengthSelector.value = String(CAMPAIGN_LEVEL_START);
        if (modeWarning) modeWarning.style.display = 'none';
        return;
    }

    if (selectedMode === ONLINE_MODE) {
        if (lengthSelector) lengthSelector.value = String(CAMPAIGN_LEVEL_START);
        if (modeWarning) modeWarning.style.display = 'none';
        return;
    }

    if (lengthSelector) lengthSelector.value = 'any';
    if (modeWarning) modeWarning.style.display = 'none';
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

function normalizeSocialMap(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}

function getPublicPlayerName(player = {}) {
    return sanitizeGameText(player.name || player.displayName || player.email || 'Jogador');
}

function getPublicPlayerPhoto(player = {}) {
    return player.photo || player.photoURL || DEFAULT_AVATAR;
}

function getFriendshipStatus(targetUid) {
    if (!targetUid || !activeUser || activeUser.isAnonymous) return 'disabled';
    if (targetUid === activeUser.uid) return 'self';
    if (normalizeSocialMap(activeUserDoc?.friends)[targetUid]) return 'friends';
    if (normalizeSocialMap(activeUserDoc?.friendRequests)[targetUid]) return 'incoming';
    if (normalizeSocialMap(activeUserDoc?.sentFriendRequests)[targetUid]) return 'sent';
    return 'available';
}

function getPlayerThemeId(player = {}) {
    return normalizeThemeId(player.themeId || player.doc?.themeId || 'default');
}

function getOnlineMatchesPlayed(playerDoc = {}) {
    return Math.max(0, Number(playerDoc.onlineMatchesPlayed || playerDoc.onlineMatches || 0));
}

function getOnlinePlayerLevel(playerDoc = {}) {
    return Math.max(1, Math.floor(getOnlineMatchesPlayed(playerDoc) / 5) + 1);
}

function applyPublicPlayerTheme(player = {}) {
    const card = publicPlayerModal?.querySelector('.public-player-card');
    if (!card) return;
    const themeId = getPlayerThemeId(player);
    card.setAttribute('data-player-theme', themeId);
    if (publicPlayerThemeName) publicPlayerThemeName.innerText = getThemeLabel(themeId);
}

function isOnlineGameplayMode(mode = currentGameMode) {
    return mode === ONLINE_MODE || mode === ONLINE_PARTY_MODE;
}

function getOnlineRoomType(roomData = currentOnlineRoom) {
    return roomData?.roomType || ONLINE_ROOM_TYPE_DUEL;
}

function isPartyRoom(roomData = currentOnlineRoom) {
    return getOnlineRoomType(roomData) === ONLINE_ROOM_TYPE_PARTY;
}

function getOnlinePlayersList(roomData = currentOnlineRoom) {
    if (!roomData?.players) return [];
    if (Array.isArray(roomData.players)) {
        return roomData.players.filter((player) => !!player?.uid);
    }
    return ['player1', 'player2']
        .map((slot) => roomData.players?.[slot] || null)
        .filter(Boolean);
}

function getOnlinePlayerEntryBySlot(roomData = currentOnlineRoom, slot = currentOnlinePlayerSlot) {
    if (!roomData?.players || slot === null || slot === undefined) return null;
    if (Array.isArray(roomData.players)) {
        const index = Number(slot);
        return Number.isInteger(index) ? roomData.players[index] || null : null;
    }
    return roomData.players?.[slot] || null;
}

function getOnlinePlayerIndexByUid(roomData = currentOnlineRoom, uid = activeUser?.uid) {
    if (!Array.isArray(roomData?.players) || !uid) return null;
    const index = roomData.players.findIndex((player) => player?.uid === uid);
    return index >= 0 ? String(index) : null;
}

function getOnlineOpponentSlot(slot) {
    return slot === 'player1' ? 'player2' : 'player1';
}

function getRoomPlayerSlot(roomData, uid = activeUser?.uid) {
    if (!roomData?.players || !uid) return null;
    if (Array.isArray(roomData.players)) return getOnlinePlayerIndexByUid(roomData, uid);
    if (roomData.players.player1?.uid === uid) return 'player1';
    if (roomData.players.player2?.uid === uid) return 'player2';
    return null;
}

function getOnlineCurrentPlayer(roomData = currentOnlineRoom) {
    const slot = currentOnlinePlayerSlot || getRoomPlayerSlot(roomData);
    return getOnlinePlayerEntryBySlot(roomData, slot);
}

function getOnlineOpponentPlayer(roomData = currentOnlineRoom) {
    if (isPartyRoom(roomData)) return null;
    const slot = currentOnlinePlayerSlot || getRoomPlayerSlot(roomData);
    if (!slot) return null;
    return roomData?.players?.[getOnlineOpponentSlot(slot)] || null;
}

function getOnlinePlayableLengths() {
    return CAMPAIGN_LEVELS.filter((level) => hasCampaignContent(level));
}

function populateOnlineLetterCountOptions() {
    if (!onlineLetterCountSelect) return;
    const availableLengths = getOnlinePlayableLengths();
    onlineLetterCountSelect.innerHTML = '';

    const randomOption = document.createElement('option');
    randomOption.value = '';
    randomOption.innerText = 'Aleatorio';
    onlineLetterCountSelect.appendChild(randomOption);

    availableLengths.forEach((length) => {
        const option = document.createElement('option');
        option.value = String(length);
        option.innerText = `${length} letras`;
        onlineLetterCountSelect.appendChild(option);
    });

    if (!onlineLetterCountSelect.value) {
        onlineLetterCountSelect.value = '';
    }
}

function getSelectedOnlineLetterCount() {
    const selectedValue = Number(onlineLetterCountSelect?.value || 0);
    return getOnlinePlayableLengths().includes(selectedValue) ? selectedValue : null;
}

function getRandomOnlineChallengePayload(preferredLetterCount = null) {
    const availableLengths = getOnlinePlayableLengths();
    const letterCount = preferredLetterCount && availableLengths.includes(preferredLetterCount)
        ? preferredLetterCount
        : (availableLengths[Math.floor(Math.random() * availableLengths.length)] || CAMPAIGN_LEVEL_START);
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
        const path = `${ONLINE_ROOM_COLLECTION}/${code}`;
        console.log('[Online 1x1] Verificando codigo existente', {
            operation: 'getDoc',
            path,
            attempt: attempt + 1,
            authUid: auth?.currentUser?.uid || null
        });
        let existing;
        try {
            existing = await getDoc(doc(db, ONLINE_ROOM_COLLECTION, code));
        } catch (err) {
            err.operation = 'getDoc-check-room-code';
            err.path = path;
            throw err;
        }
        console.log('[Online 1x1] Resultado da verificacao do codigo', {
            operation: 'getDoc',
            path,
            attempt: attempt + 1,
            exists: existing.exists()
        });
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
    currentOnlineEntryMode = 'code';
    if (onlineProgressSyncTimeout) {
        clearTimeout(onlineProgressSyncTimeout);
        onlineProgressSyncTimeout = null;
    }
    setOnlineLobbyBusy(false);
    showControl(onlineRoomPanel, false);
    showControl(onlineMatchBanner, false);
    showControl(userLeaveOnlineMatchBtn, false);
    showControl(opponentProfileChip, false);
    showControl(onlineResultModal, false);
    showControl(onlinePartyPanel, false);
    if (onlineRoomCodeDisplay) onlineRoomCodeDisplay.innerText = '----';
    if (onlineRoomState) onlineRoomState.innerText = 'Aguardando outro jogador...';
    if (onlineRoomTypeLabel) onlineRoomTypeLabel.innerText = 'Duelo 1x1';
    if (onlineRoomOpponentLabel) onlineRoomOpponentLabel.innerText = 'Oponente';
    if (onlinePlayerSelf) onlinePlayerSelf.innerText = getOnlinePlayerName();
    if (onlinePlayerOpponent) onlinePlayerOpponent.innerText = 'Aguardando...';
    if (onlineRoomOpponentStatus) onlineRoomOpponentStatus.innerText = 'Esperando conexão';
    if (onlinePartySummary) onlinePartySummary.innerText = '1 / 4 jogadores conectados';
    if (onlinePartyPlayersList) onlinePartyPlayersList.innerHTML = '';
    if (onlineMatchModeLabel) onlineMatchModeLabel.innerText = 'Online 1x1';
    if (onlineStatusBanner) onlineStatusBanner.innerText = 'Escolha entre match rápido ou sala por código para iniciar um duelo mágico.';
}

function updateOnlineBanner(roomData = currentOnlineRoom) {
    const isOnlineMatch = isOnlineGameplayMode() && !!roomData && isGameScreenVisible();
    showControl(onlineMatchBanner, isOnlineMatch);
    showControl(userLeaveOnlineMatchBtn, isOnlineMatch && roomData?.status === 'playing');
    updateOpponentProfileChip(roomData, isOnlineMatch);
    if (!isOnlineMatch) return;

    const partyRoom = isPartyRoom(roomData);
    const opponent = getOnlineOpponentPlayer(roomData);
    const players = getOnlinePlayersList(roomData);
    const finishedPlayers = players.filter((player) => player?.finished).length;
    if (onlineMatchModeLabel) {
        onlineMatchModeLabel.innerText = partyRoom ? 'Contra todos' : 'Online 1x1';
    }
    if (onlineRoomBannerCode) {
        onlineRoomBannerCode.innerText = `Sala ${roomData?.roomCode || currentOnlineRoomCode || '----'}`;
    }
    if (onlineOpponentBannerStatus) {
        if (partyRoom) {
            onlineOpponentBannerStatus.innerText = `Jogadores: ${players.length}/${roomData?.maxPlayers || ONLINE_PARTY_MAX_PLAYERS} • Finalizaram: ${finishedPlayers}`;
        } else if (!opponent?.uid) {
            onlineOpponentBannerStatus.innerText = 'Oponente: aguardando...';
        } else if (roomData?.status === 'abandoned') {
            onlineOpponentBannerStatus.innerText = roomData.abandonMessage || `O oponente ${opponent.name || 'oponente'} abandonou o jogo.`;
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

function updateOpponentProfileChip(roomData = currentOnlineRoom, isOnlineMatch = isOnlineGameplayMode() && !!roomData && isGameScreenVisible()) {
    const opponent = getOnlineOpponentPlayer(roomData);
    const shouldShow = isOnlineMatch && !!opponent?.uid && opponent.uid !== activeUser?.uid;
    showControl(opponentProfileChip, shouldShow);
    if (!shouldShow) return;

    if (opponentProfileChipAvatar) opponentProfileChipAvatar.src = getPublicPlayerPhoto(opponent);
    if (opponentProfileChipName) opponentProfileChipName.innerText = getPublicPlayerName(opponent);
    opponentProfileChip.dataset.playerUid = opponent.uid;
}

function renderOnlineRoomPanel(roomData = currentOnlineRoom) {
    const hasRoom = !!roomData && !!currentOnlineRoomCode;
    showControl(onlineRoomPanel, hasRoom);
    if (!hasRoom) {
        if (onlineStatusBanner) {
            onlineStatusBanner.innerText = 'Escolha entre match rápido ou sala por código para iniciar um duelo mágico.';
        }
        return;
    }

    const me = getOnlineCurrentPlayer(roomData);
    const opponent = getOnlineOpponentPlayer(roomData);
    const partyRoom = isPartyRoom(roomData);
    const players = getOnlinePlayersList(roomData);
    const isHost = roomData?.hostUid && roomData.hostUid === activeUser?.uid;
    const entryMode = getOnlineRoomEntryMode(roomData);
    const quickMatch = entryMode === 'quick';
    const waiting = roomData.status === 'waiting';
    const playing = roomData.status === 'playing';
    const finished = roomData.status === 'finished';
    const abandoned = roomData.status === 'abandoned';

    if (onlineStatusBanner) {
        if (waiting) onlineStatusBanner.innerText = partyRoom
            ? 'Sala contra todos criada. Aguarde os jogadores e inicie quando todos estiverem prontos.'
            : quickMatch
            ? 'Match rápido ativo. Procurando outro jogador em tempo real.'
            : 'Sala criada. Compartilhe o código e aguarde seu adversário.';
        else if (playing) onlineStatusBanner.innerText = partyRoom
            ? 'Partida contra todos em andamento. Todos receberam a mesma palavra.'
            : 'Duelo em andamento. Os dois jogadores receberam a mesma palavra.';
        else if (finished) onlineStatusBanner.innerText = partyRoom
            ? 'Partida contra todos encerrada. Veja o progresso final dos jogadores.'
            : 'Duelo encerrado. Veja o resultado e crie outra sala quando quiser.';
        else if (abandoned) onlineStatusBanner.innerText = 'A sala foi encerrada antes do final da partida.';
        else onlineStatusBanner.innerText = 'Estado da sala atualizado.';
    }

    if (onlineRoomCodeDisplay) onlineRoomCodeDisplay.innerText = roomData.roomCode || currentOnlineRoomCode || '----';
    if (onlineRoomTypeLabel) onlineRoomTypeLabel.innerText = partyRoom ? 'Contra todos (ate 4)' : 'Duelo 1x1';
    if (onlineRoomOpponentLabel) onlineRoomOpponentLabel.innerText = partyRoom ? 'Host' : 'Oponente';
    if (onlinePlayerSelf) onlinePlayerSelf.innerText = me?.name || getOnlinePlayerName();
    if (onlinePlayerOpponent) onlinePlayerOpponent.innerText = partyRoom
        ? (players.find((player) => player?.uid === roomData?.hostUid)?.name || 'Aguardando...')
        : (opponent?.name || 'Aguardando...');
    if (onlineRoomState) {
        if (waiting) onlineRoomState.innerText = partyRoom
            ? `Aguardando jogadores. ${players.length}/${roomData?.maxPlayers || ONLINE_PARTY_MAX_PLAYERS} conectados.`
            : quickMatch
            ? 'Aguardando outro jogador entrar no match rápido.'
            : 'Aguardando outro jogador entrar com o código desta sala.';
        else if (playing) onlineRoomState.innerText = partyRoom
            ? `Contra todos iniciado com ${roomData.letterCount || '--'} letras para ${players.length} jogadores.`
            : `Partida iniciada com ${roomData.letterCount || '--'} letras.`;
        else if (finished) onlineRoomState.innerText = partyRoom
            ? 'Contra todos concluido. Todos os progressos foram sincronizados.'
            : 'Partida concluída. O grimório já definiu o vencedor.';
        else if (abandoned) onlineRoomState.innerText = roomData.abandonMessage || 'Seu oponente saiu da partida.';
    }
    if (onlineRoomOpponentStatus) {
        if (partyRoom) {
            onlineRoomOpponentStatus.innerText = isHost
                ? (waiting ? 'Voce pode iniciar a sala' : playing ? 'Voce e o host da sala' : 'Host da sala')
                : `Host: ${players.find((player) => player?.uid === roomData?.hostUid)?.name || 'Aguardando'}`;
        } else if (!opponent?.uid) onlineRoomOpponentStatus.innerText = 'Esperando conexão';
        else if (opponent.connected === false) onlineRoomOpponentStatus.innerText = 'Desconectado';
        else if (opponent.finished) onlineRoomOpponentStatus.innerText = 'Terminou';
        else onlineRoomOpponentStatus.innerText = playing ? 'Jogando...' : 'Conectado';
    }

    showControl(onlinePartyPanel, partyRoom);
    if (onlinePartySummary && partyRoom) {
        const finishedPlayers = players.filter((player) => player?.finished).length;
        onlinePartySummary.innerText = `${players.length} / ${roomData?.maxPlayers || ONLINE_PARTY_MAX_PLAYERS} jogadores • ${finishedPlayers} finalizaram`;
    }
    if (onlinePartyStartBtn) {
        const canStartParty = partyRoom && waiting && isHost && players.length >= 2;
        onlinePartyStartBtn.disabled = !canStartParty;
        onlinePartyStartBtn.innerText = players.length >= 2 ? 'Iniciar sala' : 'Aguardando 2+ jogadores';
    }
    renderPartyPlayersList(roomData);

    updateOnlineBanner(roomData);
}

function showOnlineScreen() {
    stopEndingMusic();
    tryStartMenuMusic();
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
    syncGameplayTimeTracking();
    syncDynamicMusicState();
}

function sanitizeOnlineCodeInput() {
    if (!onlineRoomCodeInput) return '';
    const cleaned = (onlineRoomCodeInput.value || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
    onlineRoomCodeInput.value = cleaned;
    return cleaned;
}

function sanitizePartyRoomCodeInput() {
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

function getOnlineMatchmakingRef() {
    return doc(db, ONLINE_MATCHMAKING_COLLECTION, ONLINE_MATCHMAKING_DOC);
}

function setOnlineLobbyBusy(isBusy) {
    if (onlineQuickMatchBtn) onlineQuickMatchBtn.disabled = isBusy;
    if (onlineCreateRoomBtn) onlineCreateRoomBtn.disabled = isBusy;
    if (onlineJoinRoomBtn) onlineJoinRoomBtn.disabled = isBusy;
    if (onlineLetterCountSelect) onlineLetterCountSelect.disabled = isBusy;
    if (onlineRoomCodeInput) onlineRoomCodeInput.disabled = isBusy;
}

function buildOnlineRoomPayload({ roomCode, onlineUser, payload, matchType = 'code' }) {
    return {
        roomCode,
        roomType: ONLINE_ROOM_TYPE_DUEL,
        status: 'waiting',
        createdAt: serverTimestamp(),
        startedAt: null,
        completedAt: null,
        hostUid: onlineUser.uid,
        winnerUid: null,
        abandonMessage: '',
        gameMode: ONLINE_MODE,
        matchType,
        letterCount: payload.letterCount,
        challenge: payload.challenge,
        players: {
            player1: {
                uid: onlineUser.uid,
                name: getOnlinePlayerName(),
                photo: getOnlinePlayerPhoto(),
                themeId: currentThemeId,
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
}

function buildPartyRoomPayload({ roomCode, onlineUser, payload }) {
    return {
        roomCode,
        roomType: ONLINE_ROOM_TYPE_PARTY,
        status: 'waiting',
        maxPlayers: ONLINE_PARTY_MAX_PLAYERS,
        createdAt: serverTimestamp(),
        startedAt: null,
        completedAt: null,
        hostUid: onlineUser.uid,
        winnerUid: null,
        abandonMessage: '',
        gameMode: ONLINE_PARTY_MODE,
        matchType: 'party',
        letterCount: payload.letterCount,
        word: payload.challenge.word || '',
        challenge: payload.challenge,
        players: [
            {
                uid: onlineUser.uid,
                name: getOnlinePlayerName(),
                photo: getOnlinePlayerPhoto(),
                themeId: currentThemeId,
                connected: true,
                ready: true,
                finished: false,
                finishTimeMs: null,
                errors: 0,
                progress: 0,
                joinedAt: Date.now()
            }
        ]
    };
}

function getOnlineRoomEntryMode(roomData = currentOnlineRoom) {
    return roomData?.matchType || currentOnlineEntryMode || 'code';
}

function getPartyPlayerStatusLabel(player = {}) {
    if (!player?.uid) return 'Aguardando';
    if (player.connected === false) return 'Saiu';
    if (player.finished) return `Terminou em ${formatOnlineTime(player.finishTimeMs || 0)}`;
    if (Number(player.progress || 0) > 0) return `Jogando ${Math.round(Number(player.progress || 0))}%`;
    return 'Pronto';
}

function renderPartyPlayersList(roomData = currentOnlineRoom) {
    if (!onlinePartyPlayersList) return;
    if (!isPartyRoom(roomData)) {
        onlinePartyPlayersList.innerHTML = '';
        return;
    }

    const players = getOnlinePlayersList(roomData);
    onlinePartyPlayersList.innerHTML = '';

    players.forEach((player) => {
        const row = document.createElement('div');
        row.className = 'online-party-player-row';

        const me = player.uid === activeUser?.uid;
        const host = player.uid === roomData?.hostUid;
        const progress = Math.max(0, Math.min(100, Math.round(Number(player.progress || 0))));

        row.innerHTML = `
            <div class="online-party-player-top">
                <strong>${sanitizeGameText(player.name || 'Jogador')}</strong>
                <span>${me ? 'Você' : host ? 'Host' : getPartyPlayerStatusLabel(player)}</span>
            </div>
            <div class="online-party-progress-track">
                <div class="online-party-progress-fill" style="width:${progress}%"></div>
            </div>
            <div class="online-party-player-bottom">
                <span>${getPartyPlayerStatusLabel(player)}</span>
                <span>${progress}%</span>
            </div>
        `;

        onlinePartyPlayersList.appendChild(row);
    });
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
    if (!isOnlineGameplayMode() || !currentOnlineRoomCode || !currentOnlinePlayerSlot) return;
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
    console.log('[Online 1x1] Iniciando listener da sala', {
        operation: 'onSnapshot',
        path: `${ONLINE_ROOM_COLLECTION}/${roomCode}`,
        authUid: auth?.currentUser?.uid || null
    });
    onlineRoomUnsubscribe = onSnapshot(roomRef, (snap) => {
        console.log('[Online 1x1] Snapshot recebido da sala', {
            operation: 'onSnapshot',
            path: `${ONLINE_ROOM_COLLECTION}/${roomCode}`,
            exists: snap.exists()
        });
        if (!snap.exists()) {
            showFloatingMessage('A sala online foi encerrada.', 2400);
            resetOnlineRoomState();
            showOnlineScreen();
            return;
        }
        const roomData = snap.data();
        currentOnlineRoom = roomData;
        currentOnlineEntryMode = roomData?.matchType || currentOnlineEntryMode || 'code';
        currentOnlinePlayerSlot = isPartyRoom(roomData)
            ? (getRoomPlayerSlot(roomData) || currentOnlinePlayerSlot)
            : (currentOnlinePlayerSlot || getRoomPlayerSlot(roomData));
        renderOnlineRoomPanel(roomData);
        handleOnlineRoomSnapshot(roomData);
    }, (err) => {
        console.log('Erro no listener da sala online:', err);
        showFloatingMessage('Erro ao acompanhar a sala online.', 2400);
    });
}

async function createPartyRoom() {
    if (!db) {
        showFloatingMessage('Entre no jogo para criar uma sala.', 2200);
        return;
    }

    const onlineUser = await ensureOnlineFirebaseIdentity();
    if (!onlineUser) {
        showFloatingMessage('Nao foi possivel autenticar a sala agora.', 2600);
        return;
    }

    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    } else {
        resetOnlineRoomState();
    }

    setOnlineLobbyBusy(true);
    try {
        const roomCode = await generateUniqueOnlineRoomCode();
        const payload = getRandomOnlineChallengePayload(getSelectedOnlineLetterCount());
        const roomRef = getOnlineRoomRef(roomCode);
        const roomPayload = buildPartyRoomPayload({ roomCode, onlineUser, payload });

        console.log('[Online Party] Criando sala', {
            operation: 'createPartyRoom',
            roomCode,
            uid: onlineUser.uid,
            maxPlayers: ONLINE_PARTY_MAX_PLAYERS
        });

        await setDoc(roomRef, roomPayload);
        currentOnlineEntryMode = 'party';
        currentOnlinePlayerSlot = '0';
        await attachOnlineRoomListener(roomCode);
        showFloatingMessage(`Sala ${roomCode} criada.`, 2200);
    } catch (err) {
        console.log('[Online Room] Erro ao criar sala contra todos', {
            code: err?.code || null,
            message: err?.message || err
        });
        showFloatingMessage('Nao foi possivel criar a sala agora.', 2400);
    } finally {
        setOnlineLobbyBusy(false);
    }
}

async function joinPartyRoom() {
    if (!db) {
        showFloatingMessage('Entre no jogo para participar de uma sala.', 2200);
        return;
    }

    const onlineUser = await ensureOnlineFirebaseIdentity();
    if (!onlineUser) {
        showFloatingMessage('Nao foi possivel autenticar a sala agora.', 2600);
        return;
    }

    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    } else {
        resetOnlineRoomState();
    }

    const roomCode = sanitizePartyRoomCodeInput();
    if (roomCode.length !== 4) {
        showFloatingMessage('Digite um codigo valido de 4 caracteres para a sala.', 2200);
        return;
    }

    setOnlineLobbyBusy(true);
    try {
        const roomRef = getOnlineRoomRef(roomCode);
        const slot = await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) throw new Error('not-found');

            const room = snap.data();
            if (getOnlineRoomType(room) !== ONLINE_ROOM_TYPE_PARTY) throw new Error('wrong-type');
            if (room.status !== 'waiting') throw new Error(room.status === 'playing' ? 'already-started' : 'unavailable');

            const players = Array.isArray(room.players) ? [...room.players] : [];
            const existingIndex = players.findIndex((player) => player?.uid === onlineUser.uid);
            if (existingIndex >= 0) {
                players[existingIndex] = {
                    ...players[existingIndex],
                    connected: true
                };
                transaction.update(roomRef, { players });
                return String(existingIndex);
            }

            if (players.length >= Number(room.maxPlayers || ONLINE_PARTY_MAX_PLAYERS)) throw new Error('full');

            players.push({
                uid: onlineUser.uid,
                name: getOnlinePlayerName(),
                photo: getOnlinePlayerPhoto(),
                themeId: currentThemeId,
                connected: true,
                ready: true,
                finished: false,
                finishTimeMs: null,
                errors: 0,
                progress: 0,
                joinedAt: Date.now()
            });

            console.log('[Online Party] Entrando em sala', {
                operation: 'joinPartyRoom',
                roomCode,
                uid: onlineUser.uid,
                playerCount: players.length
            });

            transaction.update(roomRef, { players });
            return String(players.length - 1);
        });

        currentOnlineEntryMode = 'party';
        currentOnlinePlayerSlot = slot;
        await attachOnlineRoomListener(roomCode);
        showFloatingMessage(`Entrou na sala ${roomCode}.`, 2200);
    } catch (err) {
        const code = err?.message || 'unknown';
        if (code === 'not-found') showFloatingMessage('Sala nao encontrada.', 2200);
        else if (code === 'wrong-type') showFloatingMessage('Esse codigo pertence a uma sala 1x1.', 2200);
        else if (code === 'full') showFloatingMessage('Essa sala ja esta cheia.', 2200);
        else if (code === 'already-started') showFloatingMessage('Essa sala ja foi iniciada.', 2200);
        else showFloatingMessage('Nao foi possivel entrar na sala.', 2400);
        console.log('[Online Room] Erro ao entrar na sala contra todos', {
            code,
            message: err?.message || err
        });
    } finally {
        setOnlineLobbyBusy(false);
    }
}

async function startPartyRoom() {
    if (!db || !currentOnlineRoomCode) return;
    const roomRef = getOnlineRoomRef();

    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) throw new Error('not-found');

            const room = snap.data();
            if (getOnlineRoomType(room) !== ONLINE_ROOM_TYPE_PARTY) throw new Error('wrong-type');
            if (room.hostUid !== activeUser?.uid) throw new Error('not-host');
            if (room.status !== 'waiting') throw new Error('already-started');

            const players = getOnlinePlayersList(room);
            if (players.length < 2) throw new Error('need-more-players');

            console.log('[Online Party] Iniciando sala', {
                operation: 'startPartyRoom',
                roomCode: room.roomCode,
                uid: activeUser?.uid || null,
                playerCount: players.length
            });

            transaction.update(roomRef, {
                status: 'playing',
                startedAt: serverTimestamp(),
                abandonMessage: ''
            });
        });
    } catch (err) {
        const code = err?.message || 'unknown';
        if (code === 'not-host') showFloatingMessage('Apenas o host pode iniciar a sala.', 2200);
        else if (code === 'need-more-players') showFloatingMessage('A sala precisa de pelo menos 2 jogadores.', 2200);
        else if (code === 'already-started') showFloatingMessage('Essa sala ja foi iniciada.', 2200);
        else showFloatingMessage('Nao foi possivel iniciar a sala.', 2400);
    }
}

async function findOrCreateQuickMatchRoom(onlineUser) {
    const queueRef = getOnlineMatchmakingRef();

    for (let attempt = 0; attempt < 8; attempt++) {
        try {
            return await runTransaction(db, async (transaction) => {
                const queueSnap = await transaction.get(queueRef);
                const waitingRoomCode = queueSnap.exists() ? queueSnap.data()?.waitingRoomCode || null : null;

                if (waitingRoomCode) {
                    const waitingRoomRef = getOnlineRoomRef(waitingRoomCode);
                    const waitingRoomSnap = await transaction.get(waitingRoomRef);

                    if (waitingRoomSnap.exists()) {
                        const room = waitingRoomSnap.data();
                        const player1Uid = room?.players?.player1?.uid || null;
                        const player2Uid = room?.players?.player2?.uid || null;
                        const isOwnWaitingRoom = room?.status === 'waiting'
                            && !!player1Uid
                            && !player2Uid
                            && player1Uid === onlineUser.uid;
                        const canJoinWaitingRoom = room?.status === 'waiting'
                            && !!player1Uid
                            && !player2Uid
                            && player1Uid !== onlineUser.uid;

                        if (isOwnWaitingRoom) {
                            console.log('[Online 1x1] Reutilizando sala waiting do proprio jogador', {
                                operation: 'quickMatch:resume-waiting-room',
                                roomCode: waitingRoomCode,
                                uid: onlineUser.uid
                            });
                            return { action: 'created', roomCode: waitingRoomCode, playerSlot: 'player1' };
                        }

                        if (canJoinWaitingRoom) {
                            console.log('[Online 1x1] Sala encontrada para match rapido', {
                                operation: 'quickMatch:found',
                                roomCode: waitingRoomCode,
                                hostUid: player1Uid,
                                joiningUid: onlineUser.uid
                            });
                            console.log('[Online 1x1] Entrando em sala via match rapido', {
                                operation: 'quickMatch:join',
                                roomCode: waitingRoomCode,
                                uid: onlineUser.uid
                            });
                            transaction.update(waitingRoomRef, {
                                status: 'playing',
                                startedAt: serverTimestamp(),
                                abandonMessage: '',
                                matchType: room?.matchType || 'quick',
                                'players.player2.uid': onlineUser.uid,
                                'players.player2.name': getOnlinePlayerName(),
                                'players.player2.photo': getOnlinePlayerPhoto(),
                                'players.player2.themeId': currentThemeId,
                                'players.player2.connected': true,
                                'players.player2.ready': true,
                                'players.player2.finished': false,
                                'players.player2.finishTimeMs': null,
                                'players.player2.errors': 0,
                                'players.player2.progress': 0
                            });
                            transaction.set(queueRef, {
                                waitingRoomCode: null,
                                hostUid: null,
                                updatedAt: serverTimestamp()
                            }, { merge: true });
                            return { action: 'joined', roomCode: waitingRoomCode, playerSlot: 'player2' };
                        }
                    }

                    transaction.set(queueRef, {
                        waitingRoomCode: null,
                        hostUid: null,
                        updatedAt: serverTimestamp()
                    }, { merge: true });
                }

                const roomCode = buildOnlineRoomCode();
                const roomRef = getOnlineRoomRef(roomCode);
                const roomSnap = await transaction.get(roomRef);
                if (roomSnap.exists()) {
                    throw new Error('room-code-collision');
                }

                const payload = getRandomOnlineChallengePayload(getSelectedOnlineLetterCount());
                const roomPayload = buildOnlineRoomPayload({
                    roomCode,
                    onlineUser,
                    payload,
                    matchType: 'quick'
                });

                console.log('[Online 1x1] Criando sala para match rapido', {
                    operation: 'quickMatch:create',
                    roomCode,
                    uid: onlineUser.uid,
                    selectedLetterCount: payload.letterCount
                });

                transaction.set(roomRef, roomPayload);
                transaction.set(queueRef, {
                    waitingRoomCode: roomCode,
                    hostUid: onlineUser.uid,
                    updatedAt: serverTimestamp()
                }, { merge: true });

                return { action: 'created', roomCode, playerSlot: 'player1' };
            });
        } catch (err) {
            if (err?.message === 'room-code-collision') continue;
            throw err;
        }
    }

    throw new Error('quick-match-room-generation-failed');
}

async function startQuickOnlineMatch() {
    if (!db) {
        showFloatingMessage('Entre no jogo para buscar uma partida online.', 2200);
        return;
    }

    const onlineUser = await ensureOnlineFirebaseIdentity();
    if (!onlineUser) {
        showFloatingMessage('Nao foi possivel autenticar o match rapido agora.', 2600);
        return;
    }

    if (currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    } else {
        resetOnlineRoomState();
    }

    setOnlineLobbyBusy(true);
    try {
        console.log('[Online 1x1] Iniciando match rapido', {
            operation: 'quickMatch:start',
            uid: onlineUser.uid,
            authUid: auth?.currentUser?.uid || null,
            selectedLetterCount: getSelectedOnlineLetterCount()
        });

        const result = await findOrCreateQuickMatchRoom(onlineUser);
        currentOnlineEntryMode = 'quick';
        currentOnlinePlayerSlot = result.playerSlot;
        await attachOnlineRoomListener(result.roomCode);

        if (result.action === 'joined') {
            showFloatingMessage(`Sala ${result.roomCode} encontrada. Partida iniciando.`, 2400);
        } else {
            showFloatingMessage(`Sala ${result.roomCode} criada. Procurando adversario...`, 2400);
        }
    } catch (err) {
        console.log('[Online 1x1] Erro no match rapido', {
            operation: err?.operation || 'quickMatch:unknown',
            uid: onlineUser?.uid || activeUser?.uid || null,
            authUid: auth?.currentUser?.uid || null,
            code: err?.code || err?.message || null,
            message: err?.message || err
        });
        if (err?.code === 'permission-denied') {
            showFloatingMessage('Permissao do Firestore negada para o match rapido.', 2600);
        } else {
            showFloatingMessage('Nao foi possivel iniciar o match rapido agora.', 2400);
        }
    } finally {
        setOnlineLobbyBusy(false);
    }
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
    setOnlineLobbyBusy(true);
    try {
        console.log('[Online 1x1] Iniciando criacao de sala', {
            operation: 'createOnlineRoom:start',
            collection: ONLINE_ROOM_COLLECTION,
            authUid: auth?.currentUser?.uid || null,
            activeUid: onlineUser.uid,
            selectedLetterCount: getSelectedOnlineLetterCount()
        });
        const roomCode = await generateUniqueOnlineRoomCode();
        const payload = getRandomOnlineChallengePayload(getSelectedOnlineLetterCount());
        const roomRef = getOnlineRoomRef(roomCode);
        const roomPath = `${ONLINE_ROOM_COLLECTION}/${roomCode}`;
        const roomPayload = buildOnlineRoomPayload({
            roomCode,
            onlineUser,
            payload,
            matchType: 'code'
        });

        console.log('[Online 1x1] Criando sala', {
            operation: 'setDoc',
            collection: ONLINE_ROOM_COLLECTION,
            path: roomPath,
            roomCode,
            uid: onlineUser.uid,
            authUid: auth.currentUser?.uid || null,
            isAnonymous: !!onlineUser.isAnonymous,
            isUsingLocalDevSession,
            payload: roomPayload
        });

        try {
            await setDoc(roomRef, roomPayload);
        } catch (err) {
            err.operation = 'setDoc-create-room';
            err.path = roomPath;
            err.payload = roomPayload;
            throw err;
        }
        console.log('[Online 1x1] Sala criada com sucesso', {
            operation: 'setDoc',
            path: roomPath,
            roomCode,
            uid: onlineUser.uid
        });
        console.log('[Online 1x1] Lendo documento criado', {
            operation: 'getDoc-after-create',
            path: roomPath,
            authUid: auth?.currentUser?.uid || null
        });
        let createdSnap;
        try {
            createdSnap = await getDoc(roomRef);
        } catch (err) {
            err.operation = 'getDoc-after-create';
            err.path = roomPath;
            throw err;
        }
        console.log('[Online 1x1] Resultado da leitura apos criar', {
            operation: 'getDoc-after-create',
            path: roomPath,
            exists: createdSnap.exists()
        });
        currentOnlineEntryMode = 'code';
        currentOnlinePlayerSlot = 'player1';
        await attachOnlineRoomListener(roomCode);
        showFloatingMessage(`Sala ${roomCode} criada.`, 2200);
    } catch (err) {
        console.log('[Online 1x1] Erro ao criar sala online', {
            operation: err?.operation || 'unknown',
            path: err?.path || null,
            collection: ONLINE_ROOM_COLLECTION,
            uid: onlineUser?.uid || activeUser?.uid || null,
            authUid: auth.currentUser?.uid || null,
            isAnonymous: !!onlineUser?.isAnonymous,
            isUsingLocalDevSession,
            payload: err?.payload || null,
            code: err?.code || null,
            message: err?.message || err
        });
        if (err?.code === 'permission-denied') {
            showFloatingMessage('Permissao do Firestore negada para criar sala.', 2600);
        } else {
            showFloatingMessage('Nao foi possivel criar a sala agora.', 2400);
        }
    } finally {
        setOnlineLobbyBusy(false);
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

    setOnlineLobbyBusy(true);
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
            if (getOnlineRoomType(room) !== ONLINE_ROOM_TYPE_DUEL) throw new Error('wrong-type');
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
                'players.player2.themeId': currentThemeId,
                'players.player2.connected': true,
                'players.player2.ready': true,
                'players.player2.finished': false,
                'players.player2.finishTimeMs': null,
                'players.player2.errors': 0,
                'players.player2.progress': 0
            });
        });

        currentOnlineEntryMode = 'code';
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
        else if (code === 'wrong-type') showFloatingMessage('Esse codigo pertence a uma party multiplayer.', 2200);
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
        setOnlineLobbyBusy(false);
    }
}

function startOnlineMatchFromRoom(roomData) {
    const roomToken = roomData.roomCode;
    if (currentOnlineStartedRoomToken === roomToken) return;

    const challenge = roomData.challenge || {
        word: roomData.word || '',
        hints: [],
        meaning: ''
    };
    if (!challenge?.word) {
        showFloatingMessage('Sala online sem desafio valido.', 2400);
        return;
    }

    currentOnlineStartedRoomToken = roomToken;
    currentOnlineStartedAt = Date.now();
    currentOnlineLocalErrors = Number(getOnlineCurrentPlayer(roomData)?.errors || 0);
    currentOnlineResultShown = false;
    currentGameMode = isPartyRoom(roomData) ? ONLINE_PARTY_MODE : ONLINE_MODE;
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
    feedback.innerText = isPartyRoom(roomData) ? 'Party online iniciada!' : 'Duelo online iniciado!';
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
            onlineResultCopy.innerText = roomData.abandonMessage || `O oponente ${opponentName} abandonou o jogo.`;
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
    const finishTimeMs = getOnlineElapsedMs();
    currentOnlineLocalErrors = Math.max(currentOnlineLocalErrors, 0);

    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) return;
            const room = snap.data();
            const partyRoom = isPartyRoom(room);

            if (partyRoom) {
                const players = Array.isArray(room.players) ? [...room.players] : [];
                const index = Number(mySlot);
                const me = Number.isInteger(index) ? players[index] || {} : {};
                if (!players[index]) return;

                players[index] = {
                    ...players[index],
                    finished: true,
                    finishTimeMs,
                    errors: currentOnlineLocalErrors,
                    progress: 100,
                    connected: true,
                    matchCounted: true
                };
                if (!me.matchCounted && me.uid) {
                    transaction.set(doc(db, 'users', me.uid), { onlineMatchesPlayed: increment(1) }, { merge: true });
                }

                const finishedPlayers = players.filter((player) => player?.uid && (player.finished || player.connected === false));
                const updates = {
                    players
                };

                if (finishedPlayers.length === players.filter((player) => player?.uid).length) {
                    updates.status = 'finished';
                    updates.completedAt = serverTimestamp();

                    const rankedPlayers = players
                        .filter((player) => player?.uid && player.finished)
                        .sort((a, b) => Number(a.finishTimeMs || Number.MAX_SAFE_INTEGER) - Number(b.finishTimeMs || Number.MAX_SAFE_INTEGER));

                    if (rankedPlayers[0]?.uid) {
                        updates.winnerUid = rankedPlayers[0].uid;
                    }
                } else if (!room.winnerUid) {
                    updates.winnerUid = me.uid || activeUser?.uid || null;
                }

                transaction.update(roomRef, updates);
                return;
            }

            const otherSlot = getOnlineOpponentSlot(mySlot);
            const me = room.players?.[mySlot] || {};
            const opponent = room.players?.[otherSlot] || {};

            const updates = {
                status: 'finished',
                completedAt: serverTimestamp(),
                [`players.${mySlot}.finished`]: true,
                [`players.${mySlot}.finishTimeMs`]: finishTimeMs,
                [`players.${mySlot}.errors`]: currentOnlineLocalErrors,
                [`players.${mySlot}.progress`]: 100,
                [`players.${mySlot}.connected`]: true,
                [`players.${mySlot}.matchCounted`]: true
            };
            if (!me.matchCounted && (me.uid || activeUser?.uid)) {
                transaction.set(doc(db, 'users', me.uid || activeUser.uid), { onlineMatchesPlayed: increment(1) }, { merge: true });
            }

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
    const shouldAbandon = options.abandon !== false;
    const myName = getOnlinePlayerEntryBySlot(currentOnlineRoom, mySlot)?.name || getOnlinePlayerName();

    try {
        await runTransaction(db, async (transaction) => {
            const snap = await transaction.get(roomRef);
            if (!snap.exists()) return;
            const room = snap.data();
            const partyRoom = isPartyRoom(room);

            if (partyRoom) {
                const players = Array.isArray(room.players) ? [...room.players] : [];
                const myIndex = Number(mySlot);
                if (!Number.isInteger(myIndex) || !players[myIndex]) return;

                if (room.status === 'waiting') {
                    players.splice(myIndex, 1);
                    const nextHostUid = players[0]?.uid || null;
                    const updates = {
                        players,
                        hostUid: nextHostUid,
                        abandonMessage: players.length ? '' : 'A sala foi encerrada.'
                    };

                    if (!players.length) {
                        updates.status = 'abandoned';
                        updates.completedAt = serverTimestamp();
                    }

                    transaction.update(roomRef, updates);
                    return;
                }

                const wasMatchCounted = !!players[myIndex].matchCounted;
                players[myIndex] = {
                    ...players[myIndex],
                    connected: false,
                    matchCounted: true
                };
                if (room.status === 'playing' && !wasMatchCounted && players[myIndex].uid) {
                    transaction.set(doc(db, 'users', players[myIndex].uid), { onlineMatchesPlayed: increment(1) }, { merge: true });
                }

                const allResolved = players.filter((player) => player?.uid).every((player) => player.finished || player.connected === false);
                const updates = { players };
                if (allResolved) {
                    updates.status = 'finished';
                    updates.completedAt = serverTimestamp();
                } else if (room.hostUid === activeUser?.uid) {
                    updates.hostUid = players.find((player) => player?.uid && player.connected !== false)?.uid || room.hostUid;
                }

                transaction.update(roomRef, updates);
                return;
            }

            const otherSlot = getOnlineOpponentSlot(mySlot);
            const opponent = room.players?.[otherSlot] || {};
            const isQuickWaitingRoom = room?.matchType === 'quick' && room?.status === 'waiting';
            const updates = {
                [`players.${mySlot}.connected`]: false
            };

            if (shouldAbandon && room.status !== 'finished') {
                updates.status = 'abandoned';
                updates.completedAt = serverTimestamp();
                updates.abandonMessage = `O oponente ${myName} abandonou o jogo.`;
                updates[`players.${mySlot}.matchCounted`] = true;
                if (opponent.uid) {
                    updates.winnerUid = opponent.uid;
                }
            }

            transaction.update(roomRef, updates);
            const me = room.players?.[mySlot] || {};
            if (room.status === 'playing' && !me.matchCounted && (me.uid || activeUser?.uid)) {
                transaction.set(doc(db, 'users', me.uid || activeUser.uid), { onlineMatchesPlayed: increment(1) }, { merge: true });
            }
            if (shouldAbandon && room.status === 'playing' && opponent.uid && !opponent.matchCounted) {
                transaction.set(doc(db, 'users', opponent.uid), { onlineMatchesPlayed: increment(1) }, { merge: true });
            }

            if (isQuickWaitingRoom) {
                const queueRef = getOnlineMatchmakingRef();
                const queueSnap = await transaction.get(queueRef);
                const waitingRoomCode = queueSnap.exists() ? queueSnap.data()?.waitingRoomCode || null : null;
                if (waitingRoomCode === room.roomCode) {
                    transaction.set(queueRef, {
                        waitingRoomCode: null,
                        hostUid: null,
                        updatedAt: serverTimestamp()
                    }, { merge: true });
                }
            }
        });
    } catch (err) {
        console.log('Erro ao sair da sala online:', err);
    } finally {
        resetOnlineRoomState();
    }
}

function forceAbandonOnlineRoomOnUnload() {
    if (!db || !currentOnlineRoomCode || !currentOnlinePlayerSlot || !currentOnlineRoom) return;
    const roomRef = getOnlineRoomRef();
    if (!roomRef) return;

    const mySlot = currentOnlinePlayerSlot;
    const myName = getOnlinePlayerEntryBySlot(currentOnlineRoom, mySlot)?.name || getOnlinePlayerName();

    if (isPartyRoom(currentOnlineRoom)) {
        const players = Array.isArray(currentOnlineRoom.players) ? [...currentOnlineRoom.players] : [];
        const index = Number(mySlot);
        if (!Number.isInteger(index) || !players[index]) return;
        players[index] = { ...players[index], connected: false, matchCounted: true };
        updateDoc(roomRef, { players }).catch(() => {});
        return;
    }

    const otherSlot = getOnlineOpponentSlot(mySlot);
    const opponent = currentOnlineRoom.players?.[otherSlot] || {};
    const updates = {
        [`players.${mySlot}.connected`]: false,
        [`players.${mySlot}.matchCounted`]: true
    };

    if (currentOnlineRoom.status !== 'finished') {
        updates.status = 'abandoned';
        updates.completedAt = serverTimestamp();
        updates.abandonMessage = `O oponente ${myName} abandonou o jogo.`;
        if (opponent.uid) updates.winnerUid = opponent.uid;
    }

    updateDoc(roomRef, updates).catch(() => {});
    currentOnlineLeaving = true;
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
            if (isPartyRoom(roomData)) {
                feedback.innerText = roomData.status === 'finished'
                    ? 'Party concluida. Confira o progresso final da lista de jogadores.'
                    : 'A party foi encerrada.';
            } else {
                openOnlineResultModal(roomData);
            }
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
    stopEndingMusic();
    tryStartMenuMusic();
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
    syncGameplayTimeTracking();
    syncDynamicMusicState();
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
        completedLevel: level,
        journeyCompletedNow: completedNow && isCampaignJourneyFullyCompleted(nextProgress),
        unlockedLevels: nextProgress.unlockedLevels.filter((item) => !unlockedBefore.has(item)),
        nextLevel: getNextCampaignPlayableLevel(level, nextProgress.unlockedLevels)
    };
}

function getCampaignLevelsWithContent() {
    return CAMPAIGN_LEVELS.filter((level) => hasCampaignContent(level));
}

function isCampaignJourneyFullyCompleted(progress = campaignProgress) {
    const normalized = normalizeCampaignProgress(progress);
    const completedSet = new Set(normalized.completedLevels || []);
    const campaignLevels = getCampaignLevelsWithContent();
    return campaignLevels.length > 0 && campaignLevels.every((level) => completedSet.has(level));
}

// Estatísticas persistidas localmente por jogador para manter a jornada entre sessões.
function getPlayerStatsStorageKey() {
    const uid = activeUser?.uid || 'guest';
    return `${PLAYER_STATS_STORAGE_KEY}:${uid}`;
}

function getDefaultPlayerStats() {
    return {
        letrasConjuradas: 0,
        validacoesFeitas: 0,
        vitorias: 0,
        erros: 0,
        limpezasTabuleiro: 0,
        ciclosReiniciados: 0,
        diasJogados: 0,
        tempoTotalJogadoMs: 0,
        galinhasInvocadas: 0,
        vitoriasCompartilhadas: 0,
        playedDayKeys: []
    };
}

function normalizePlayerStats(rawStats) {
    const base = rawStats && typeof rawStats === 'object' ? rawStats : {};
    const normalized = getDefaultPlayerStats();
    const numericKeys = [
        'letrasConjuradas',
        'validacoesFeitas',
        'vitorias',
        'erros',
        'limpezasTabuleiro',
        'ciclosReiniciados',
        'diasJogados',
        'tempoTotalJogadoMs',
        'galinhasInvocadas',
        'vitoriasCompartilhadas'
    ];

    numericKeys.forEach((key) => {
        const value = Number(base[key] ?? 0);
        normalized[key] = Math.max(0, Number.isFinite(value) ? value : 0);
    });

    normalized.playedDayKeys = Array.from(
        new Set(
            Array.isArray(base.playedDayKeys)
                ? base.playedDayKeys.map((item) => String(item || '').trim()).filter(Boolean)
                : []
        )
    ).sort();
    normalized.diasJogados = Math.max(normalized.diasJogados, normalized.playedDayKeys.length);

    return normalized;
}

function loadPlayerStats() {
    try {
        const stored = localStorage.getItem(getPlayerStatsStorageKey());
        playerStats = normalizePlayerStats(stored ? JSON.parse(stored) : null);
    } catch (err) {
        console.log('Falha ao carregar estatisticas locais:', err);
        playerStats = normalizePlayerStats(null);
    }
    return playerStats;
}

function savePlayerStats(stats = playerStats) {
    playerStats = normalizePlayerStats(stats);
    try {
        localStorage.setItem(getPlayerStatsStorageKey(), JSON.stringify(playerStats));
    } catch (err) {
        console.log('Falha ao salvar estatisticas locais:', err);
    }
    return playerStats;
}

function ensurePlayerStatsLoaded() {
    if (!playerStats) {
        loadPlayerStats();
    }
    return playerStats;
}

function incrementPlayerStat(key, amount = 1) {
    const stats = ensurePlayerStatsLoaded();
    const safeAmount = Number(amount);
    if (!Number.isFinite(safeAmount)) return stats;
    stats[key] = Math.max(0, Number(stats[key] || 0) + safeAmount);
    return savePlayerStats(stats);
}

function getLocalDateKey() {
    return new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date());
}

function markGameplayDay() {
    const stats = ensurePlayerStatsLoaded();
    const dateKey = getLocalDateKey();
    if (stats.playedDayKeys.includes(dateKey)) return stats;
    stats.playedDayKeys.push(dateKey);
    stats.playedDayKeys.sort();
    stats.diasJogados = stats.playedDayKeys.length;
    return savePlayerStats(stats);
}

function noteGameplayActivity() {
    gameplayLastActivityAt = Date.now();
    if (isGameScreenVisible()) {
        markGameplayDay();
    }
}

function flushGameplayTime() {
    if (!gameplayTimeLastTick) return;
    const now = Date.now();
    const activeUntil = Math.min(now, (gameplayLastActivityAt || gameplayTimeLastTick) + GAMEPLAY_IDLE_TIMEOUT_MS);
    const delta = Math.max(0, activeUntil - gameplayTimeLastTick);
    if (delta > 0) {
        const stats = ensurePlayerStatsLoaded();
        stats.tempoTotalJogadoMs = Math.max(0, Number(stats.tempoTotalJogadoMs || 0) + delta);
        savePlayerStats(stats);
    }
    gameplayTimeLastTick = now;
    syncDynamicMusicState();
}

// Conta tempo só enquanto a tela de jogo estiver ativa e com atividade recente.
function syncGameplayTimeTracking() {
    const isFinaleVisible = !!journeyFinaleModal && !journeyFinaleModal.classList.contains('hidden-control');
    const shouldTrack = isGameScreenVisible() && !document.hidden && !isFinaleVisible;

    if (shouldTrack) {
        if (!gameplayTimeIntervalId) {
            const now = Date.now();
            gameplayTimeLastTick = now;
            gameplayLastActivityAt = now;
            markGameplayDay();
            gameplayTimeIntervalId = window.setInterval(flushGameplayTime, 5000);
        }
        return;
    }

    if (gameplayTimeIntervalId) {
        flushGameplayTime();
        window.clearInterval(gameplayTimeIntervalId);
        gameplayTimeIntervalId = null;
    }
    gameplayTimeLastTick = 0;
}

function formatGameplayDuration(ms = 0) {
    const totalSeconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}min`;
    if (minutes > 0) return `${minutes} min ${seconds}s`;
    return `${seconds}s`;
}

function getAverageMinutesPerDay(stats = playerStats) {
    const safeStats = normalizePlayerStats(stats);
    if (!safeStats.diasJogados) return 0;
    const averageMinutes = (safeStats.tempoTotalJogadoMs / 60000) / safeStats.diasJogados;
    return Number.isFinite(averageMinutes) ? averageMinutes : 0;
}

function formatAverageMinutesPerDay(stats = playerStats) {
    const averageMinutes = getAverageMinutesPerDay(stats);
    if (averageMinutes <= 0) return '0 min/dia';
    if (averageMinutes < 1) return '< 1 min/dia';
    return `${Math.round(averageMinutes)} min/dia`;
}

function calculateMagicIq(stats = playerStats) {
    const safeStats = normalizePlayerStats(stats);
    const averageMinutes = getAverageMinutesPerDay(safeStats);
    const rawValue =
        (safeStats.letrasConjuradas * 1) +
        (safeStats.validacoesFeitas * 2) +
        (safeStats.vitorias * 50) +
        (safeStats.diasJogados * 20) +
        (averageMinutes * 1.5) +
        (safeStats.vitoriasCompartilhadas * 30) -
        (safeStats.erros * 10) -
        (safeStats.limpezasTabuleiro * 3) -
        (safeStats.ciclosReiniciados * 2) +
        (safeStats.galinhasInvocadas * 1);

    const normalizedValue = Math.max(0, Math.round(Number.isFinite(rawValue) ? rawValue : 0));
    return normalizedValue;
}

function getMagicIqRank(iqValue = 0) {
    if (iqValue >= 20000) return 'Lenda Arcana';
    if (iqValue >= 5000) return 'Arquimago Lexical';
    if (iqValue >= 1000) return 'Mago das Letras';
    return 'Aprendiz Arcano';
}

function formatMagicIq(iqValue = 0) {
    return Number(iqValue || 0).toLocaleString('pt-BR');
}

function fadeAudioVolume(audio, fromVolume, toVolume, durationMs = 600, onComplete = null) {
    if (!audio) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    const start = performance.now();
    const safeFrom = Math.max(0, Math.min(1, Number(fromVolume ?? audio.volume ?? 1)));
    const safeTo = Math.max(0, Math.min(1, Number(toVolume ?? 0)));

    if (audio._magicLexisFadeRaf) {
        cancelAnimationFrame(audio._magicLexisFadeRaf);
    }

    audio.volume = safeFrom;

    const step = (now) => {
        const progress = Math.min(1, (now - start) / durationMs);
        audio.volume = safeFrom + ((safeTo - safeFrom) * progress);

        if (progress < 1) {
            audio._magicLexisFadeRaf = requestAnimationFrame(step);
            return;
        }

        audio.volume = safeTo;
        audio._magicLexisFadeRaf = 0;
        if (typeof onComplete === 'function') onComplete();
    };

    audio._magicLexisFadeRaf = requestAnimationFrame(step);
}

function stopEndingMusic({ fadeOut = false } = {}) {
    if (audioManager.currentContext !== MUSIC_CONTEXT_FIM_JOGO) return;
    audioManager.stopAll({ fadeOut });
}

function startJourneyFinaleMusic() {
    audioManager.setContext(MUSIC_CONTEXT_FIM_JOGO, { forceRestart: true }).catch((err) => {
        console.log('Falha ao iniciar trilha final:', err);
    });
}

function animateJourneyFinaleIq(targetValue) {
    if (!journeyFinaleIqEl) return;
    if (journeyFinaleCounterRaf) {
        cancelAnimationFrame(journeyFinaleCounterRaf);
        journeyFinaleCounterRaf = 0;
    }

    const start = performance.now();
    const durationMs = 1500;

    const tick = (now) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.round(targetValue * eased);
        journeyFinaleIqEl.innerText = formatMagicIq(currentValue);
        if (progress < 1) {
            journeyFinaleCounterRaf = requestAnimationFrame(tick);
        } else {
            journeyFinaleCounterRaf = 0;
        }
    };

    journeyFinaleCounterRaf = requestAnimationFrame(tick);
}

function renderJourneyFinaleStats() {
    const stats = ensurePlayerStatsLoaded();
    flushGameplayTime();
    const safeStats = normalizePlayerStats(stats);
    const iqValue = calculateMagicIq(safeStats);

    if (journeyStatLettersEl) journeyStatLettersEl.innerText = String(safeStats.letrasConjuradas);
    if (journeyStatValidationsEl) journeyStatValidationsEl.innerText = String(safeStats.validacoesFeitas);
    if (journeyStatWinsEl) journeyStatWinsEl.innerText = String(safeStats.vitorias);
    if (journeyStatErrorsEl) journeyStatErrorsEl.innerText = String(safeStats.erros);
    if (journeyStatClearsEl) journeyStatClearsEl.innerText = String(safeStats.limpezasTabuleiro);
    if (journeyStatCyclesEl) journeyStatCyclesEl.innerText = String(safeStats.ciclosReiniciados);
    if (journeyStatDaysEl) journeyStatDaysEl.innerText = String(safeStats.diasJogados);
    if (journeyStatTotalTimeEl) journeyStatTotalTimeEl.innerText = formatGameplayDuration(safeStats.tempoTotalJogadoMs);
    if (journeyStatAverageTimeEl) journeyStatAverageTimeEl.innerText = formatAverageMinutesPerDay(safeStats);
    if (journeyStatChickensEl) journeyStatChickensEl.innerText = String(safeStats.galinhasInvocadas);
    if (journeyStatSharesEl) journeyStatSharesEl.innerText = String(safeStats.vitoriasCompartilhadas);
    if (journeyFinaleRankEl) journeyFinaleRankEl.innerText = getMagicIqRank(iqValue);

    animateJourneyFinaleIq(iqValue);
    return { stats: safeStats, iqValue };
}

function buildJourneyShareText(iqValue) {
    return `Eu concluí minha jornada em MagicLexis e alcancei um QI Mágico de ${formatMagicIq(iqValue)}.`;
}

function showJourneyFinaleScreen() {
    if (!journeyFinaleModal || journeyFinaleShown) return;
    journeyFinaleShown = true;
    showControl(journeyFinaleModal, true);
    syncGameplayTimeTracking();
    renderJourneyFinaleStats();
    startJourneyFinaleMusic();
}

function hideJourneyFinaleScreen({ stopMusic = true } = {}) {
    if (!journeyFinaleModal) return;
    showControl(journeyFinaleModal, false);
    if (stopMusic) {
        stopEndingMusic({ fadeOut: true });
    }
    syncGameplayTimeTracking();
}

async function shareJourneyFinale() {
    const { iqValue } = renderJourneyFinaleStats();
    const shareText = buildJourneyShareText(iqValue);

    try {
        if (navigator.share) {
            await navigator.share({ text: shareText });
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            showFloatingMessage('Jornada copiada para a área de transferência.', 2200);
        } else {
            return;
        }
        incrementPlayerStat('vitoriasCompartilhadas', 1);
        renderJourneyFinaleStats();
    } catch (err) {
        console.log('Falha ao compartilhar jornada final:', err);
    }
}

async function restartCampaignJourney() {
    hideJourneyFinaleScreen({ stopMusic: true });
    journeyFinaleShown = false;
    await saveCampaignProgress(getDefaultCampaignProgress());
    startCampaignLevel(CAMPAIGN_LEVEL_START);
}

let bookTutorialApi = null;

function openWelcomeTutorial(goToLastPage = false) {
    stopEndingMusic();
    tryStartMenuMusic();
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
    syncGameplayTimeTracking();
    syncDynamicMusicState();
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
const audioSettingsModal = document.getElementById('audio-settings-modal');
const openAudioSettingsBtn = document.getElementById('open-audio-settings-btn');
const closeAudioSettingsModalBtn = document.getElementById('close-audio-settings-modal');
const audioMusicEnabledInput = document.getElementById('audio-music-enabled');
const audioMusicVolumeInput = document.getElementById('audio-music-volume');
const audioMusicVolumeValue = document.getElementById('audio-music-volume-value');
const audioSfxEnabledInput = document.getElementById('audio-sfx-enabled');
const audioSfxVolumeInput = document.getElementById('audio-sfx-volume');
const audioSfxVolumeValue = document.getElementById('audio-sfx-volume-value');
const userMenu = document.getElementById('user-menu');
const userMenuDropdown = document.getElementById('user-menu-dropdown');
const userAvatarTop = document.getElementById('user-avatar-top');
const userNameTop = document.getElementById('user-name-top');
const userStreakIndicator = document.getElementById('user-streak-indicator');
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
const arcaneStreakModal = document.getElementById('arcane-streak-modal');
const closeArcaneStreakModalBtn = document.getElementById('close-arcane-streak-modal');
const arcaneStreakTitle = document.getElementById('arcane-streak-title');
const arcaneStreakCount = document.getElementById('arcane-streak-count');
const arcaneStreakCopy = document.getElementById('arcane-streak-copy');
const arcaneStreakMilestone = document.getElementById('arcane-streak-milestone');
const arcaneStreakShareBtn = document.getElementById('arcane-streak-share-btn');
const arcaneStreakCloseBtn = document.getElementById('arcane-streak-close-btn');
const arcaneStreakCountLabel = arcaneStreakModal?.querySelector('.arcane-streak-orb span');

let gateAuthMode = 'login';
const GAME_STATE_STORAGE_KEY = 'magiclexis_game_state_v1';
let arcaneStreakIndicatorFeedbackTimeout = 0;

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
    if (!targetChallenge || !Array.isArray(currentWord) || !activeUser || isOnlineGameplayMode()) return null;

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
    return isGameScreenVisible() && !(isOnlineGameplayMode() && currentOnlineRoomCode);
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
    syncTopUserUi(activeUser, activeUserDoc);
    syncRefreshLockState();
    markGameplayDay();
    noteGameplayActivity();
    syncGameplayTimeTracking();
    syncDynamicMusicState({ forceRestart: false });
    updateTrainingUi();
}

async function showHubScreenFromGame() {
    const wasTrainingMode = isTrainingModeActive();
    hideJourneyFinaleScreen({ stopMusic: true });
    journeyFinaleShown = false;
    stopHintCycle();
    resetDailySession();
    clearGameSessionState();
    if (isOnlineGameplayMode() || currentOnlineRoomCode) {
        await leaveOnlineRoom({ abandon: true });
    }
    currentCampaignLevel = null;
    document.getElementById('app-container')?.classList.add('hidden-app');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    hideCampaignScreen();
    hideOnlineScreen();
    setMobileGameplayMenuVisibility(false);
    if (wasTrainingMode) {
        trainingState = null;
        clearTrainingTransitionTimeout();
        hideTrainingPanel();
    }
    showHubScreen(true);
    syncTopUserUi(activeUser, activeUserDoc);
    syncRefreshLockState();
    syncGameplayTimeTracking();
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
        incrementPlayerStat('vitoriasCompartilhadas', 1);
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
    loadPlayerStats();

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
        limparTelaCheiaAoVoltarMenu();
        stopEndingMusic();
        tryStartMenuMusic();
        hub.classList.remove('hidden-control');
        hub.style.display = 'flex';
        hideCampaignScreen();
        hideOnlineScreen();
    } else {
        hub.classList.add('hidden-control');
    }
    syncRefreshLockState();
    syncGameplayTimeTracking();
    if (show) syncDynamicMusicState();
}

function showAuthGate(show) {
    showControl(authGate, show);
    if (show) {
        stopEndingMusic();
        tryStartMenuMusic();
    }
    if (show) hideCampaignScreen();
    if (show) hideOnlineScreen();
    if (show) setGateAuthMode('login');
    syncGameplayTimeTracking();
    if (show) syncDynamicMusicState();
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
            onlineMatchesPlayed: 0,
            campaignProgress: defaultCampaignProgress,
            lastPlayDate: '',
            streakCount: 0,
            lastCelebratedMilestone: 0,
            lastMilestoneClaimed: 0,
            themeId: currentThemeId
        }, { merge: true });
    } else {
        const currentData = snap.data() || {};
        const missingFields = {};
        if (!currentData.campaignProgress) {
            missingFields.campaignProgress = defaultCampaignProgress;
        }
        if (typeof currentData.lastPlayDate !== 'string') {
            missingFields.lastPlayDate = '';
        }
        if (typeof currentData.streakCount !== 'number') {
            missingFields.streakCount = 0;
        }
        if (typeof currentData.lastCelebratedMilestone !== 'number') {
            missingFields.lastCelebratedMilestone = 0;
        }
        if (typeof currentData.lastMilestoneClaimed !== 'number') {
            missingFields.lastMilestoneClaimed = typeof currentData.lastCelebratedMilestone === 'number'
                ? currentData.lastCelebratedMilestone
                : 0;
        }
        if (!AVAILABLE_THEMES.includes(currentData.themeId)) {
            missingFields.themeId = currentThemeId;
        }
        if (typeof currentData.onlineMatchesPlayed !== 'number') {
            missingFields.onlineMatchesPlayed = Math.max(0, Number(currentData.onlineMatchesPlayed || 0));
        }
        if (Object.keys(missingFields).length) {
            await setDoc(userRef, missingFields, { merge: true });
        }
    }

    const fresh = await getDoc(userRef);
    return fresh.exists() ? fresh.data() : null;
}
function syncTopUserUi(user, userDoc) {
    const isLogged = !!user;
    const isAnon = getModeVisitor(user);
    const streakData = normalizeArcaneStreakData(userDoc);

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
    if (userStreakIndicator) {
        userStreakIndicator.innerText = `🔥 ${streakData.streakCount}`;
        userStreakIndicator.setAttribute('role', 'button');
        userStreakIndicator.setAttribute('tabindex', isLogged && !isAnon && streakData.streakCount > 0 ? '0' : '-1');
        userStreakIndicator.setAttribute('title', 'Abrir Chama Arcana');
        showControl(userStreakIndicator, isLogged && !isAnon && streakData.streakCount > 0);
    }

    const appVisible = !document.getElementById('app-container')?.classList.contains('hidden-app');
    showControl(userMenu, isLogged && appVisible);

    const hubVisible = !hub.classList.contains('hidden-control') && hub.style.display !== 'none';
    showControl(hubLogoutBtn, isLogged && hubVisible);
    if (profilePoints) {
        const pts = isAnon ? 0 : (userDoc?.points || 0);
        profilePoints.innerText = `Pontos: ${pts}`;
    }
    syncThemeAvailability();
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

async function refreshActiveUserDoc() {
    if (!db || !activeUser || activeUser.isAnonymous) return null;
    const snap = await getDoc(doc(db, 'users', activeUser.uid));
    activeUserDoc = snap.exists() ? snap.data() : activeUserDoc;
    syncTopUserUi(activeUser, activeUserDoc);
    return activeUserDoc;
}

function setPublicPlayerMessage(message = '', isError = false) {
    if (!publicPlayerMessage) return;
    publicPlayerMessage.innerText = sanitizeGameText(message);
    publicPlayerMessage.style.color = isError ? 'var(--error)' : 'var(--warning)';
}

function setFriendsStatus(message = '', isError = false) {
    if (!friendsStatus) return;
    friendsStatus.innerText = sanitizeGameText(message);
    friendsStatus.style.color = isError ? 'var(--error)' : 'var(--warning)';
}

function renderPublicPlayerStats(playerDoc = {}) {
    if (!publicPlayerStats) return;
    publicPlayerStats.innerHTML = '';
    const streak = normalizeArcaneStreakData(playerDoc).streakCount;
    const campaign = normalizeCampaignProgress(playerDoc.campaignProgress);
    const matchesPlayed = getOnlineMatchesPlayed(playerDoc);
    const stats = [
        ['✦', 'Pontos', String(playerDoc.points || 0)],
        ['🔥', 'Chama', `${streak} dia(s)`],
        ['♜', 'Campanha', `${campaign.completedLevels.length} fase(s)`],
        ['⚔', 'Online', `${matchesPlayed} partida(s)`],
        ['♛', 'Amigos', String(Object.keys(normalizeSocialMap(playerDoc.friends)).length)]
    ];

    stats.forEach(([icon, label, value]) => {
        const item = document.createElement('div');
        item.className = 'public-player-stat';
        const iconEl = document.createElement('strong');
        iconEl.className = 'public-player-stat-icon';
        iconEl.innerText = icon;
        const copy = document.createElement('div');
        const labelEl = document.createElement('span');
        labelEl.innerText = label;
        const valueEl = document.createElement('strong');
        valueEl.innerText = value;
        copy.append(labelEl, valueEl);
        item.append(iconEl, copy);
        publicPlayerStats.appendChild(item);
    });
}

function syncFriendInviteButton() {
    if (!sendFriendInviteBtn || !selectedPublicPlayer) return;
    const status = getFriendshipStatus(selectedPublicPlayer.uid);
    const labels = {
        self: 'Este é você',
        disabled: 'Faça login para adicionar',
        friends: 'Vocês já são amigos',
        incoming: 'Aceitar convite',
        sent: 'Convite enviado',
        available: 'Enviar convite de amizade'
    };
    sendFriendInviteBtn.innerText = labels[status] || labels.available;
    sendFriendInviteBtn.disabled = status === 'self' || status === 'disabled' || status === 'friends' || status === 'sent';
}

async function openPublicPlayerProfile(player = null) {
    const basePlayer = player || getOnlineOpponentPlayer(currentOnlineRoom);
    if (!basePlayer?.uid) return;

    selectedPublicPlayer = { ...basePlayer };
    showControl(publicPlayerModal, true);
    showControl(userMenuDropdown, false);
    setPublicPlayerMessage('');
    applyPublicPlayerTheme(basePlayer);

    if (publicPlayerAvatar) publicPlayerAvatar.src = getPublicPlayerPhoto(basePlayer);
    if (publicPlayerName) publicPlayerName.innerText = getPublicPlayerName(basePlayer);
    if (publicPlayerStatus) publicPlayerStatus.innerText = 'Carregando dados...';
    if (publicPlayerLevelBadge) publicPlayerLevelBadge.innerText = '1';
    renderPublicPlayerStats({});
    syncFriendInviteButton();

    try {
        const snap = db ? await getDoc(doc(db, 'users', basePlayer.uid)) : null;
        const playerDoc = snap?.exists() ? snap.data() : {};
        selectedPublicPlayer = {
            uid: basePlayer.uid,
            name: playerDoc.name || basePlayer.name || 'Jogador',
            photo: playerDoc.photo || basePlayer.photo || DEFAULT_AVATAR,
            themeId: playerDoc.themeId || basePlayer.themeId || 'default',
            doc: playerDoc
        };
        applyPublicPlayerTheme(selectedPublicPlayer);
        if (publicPlayerAvatar) publicPlayerAvatar.src = getPublicPlayerPhoto(selectedPublicPlayer);
        if (publicPlayerName) publicPlayerName.innerText = getPublicPlayerName(selectedPublicPlayer);
        if (publicPlayerStatus) publicPlayerStatus.innerHTML = `Ranking social • <strong>${Number(playerDoc.points || 0)} pontos</strong>`;
        if (publicPlayerLevelBadge) publicPlayerLevelBadge.innerText = String(getOnlinePlayerLevel(playerDoc));
        renderPublicPlayerStats(playerDoc);
        syncFriendInviteButton();
    } catch (err) {
        if (publicPlayerStatus) publicPlayerStatus.innerText = 'Não foi possível carregar tudo agora.';
    }
}

function closePublicPlayerProfile() {
    showControl(publicPlayerModal, false);
    selectedPublicPlayer = null;
}

async function sendFriendInvite(target = selectedPublicPlayer) {
    if (!db || !activeUser || activeUser.isAnonymous || !target?.uid || target.uid === activeUser.uid) {
        setPublicPlayerMessage('Faça login para enviar convite.', true);
        return;
    }

    try {
        const myRef = doc(db, 'users', activeUser.uid);
        const targetRef = doc(db, 'users', target.uid);
        await runTransaction(db, async (transaction) => {
            const mySnap = await transaction.get(myRef);
            const targetSnap = await transaction.get(targetRef);
            if (!targetSnap.exists()) throw new Error('Jogador não encontrado.');

            const myDoc = mySnap.exists() ? mySnap.data() : {};
            const targetDoc = targetSnap.data();
            const targetFriends = normalizeSocialMap(targetDoc.friends);
            if (targetFriends[activeUser.uid]) return;

            const sentFriendRequests = normalizeSocialMap(myDoc.sentFriendRequests);
            const friendRequests = normalizeSocialMap(targetDoc.friendRequests);
            const createdAt = Date.now();
            sentFriendRequests[target.uid] = {
                uid: target.uid,
                name: targetDoc.name || target.name || 'Jogador',
                photo: targetDoc.photo || target.photo || DEFAULT_AVATAR,
                createdAt
            };
            friendRequests[activeUser.uid] = {
                uid: activeUser.uid,
                name: getOnlinePlayerName(),
                photo: getOnlinePlayerPhoto(),
                createdAt
            };

            transaction.set(myRef, { sentFriendRequests }, { merge: true });
            transaction.set(targetRef, { friendRequests }, { merge: true });
        });
        await refreshActiveUserDoc();
        syncFriendInviteButton();
        setPublicPlayerMessage('Convite enviado.');
    } catch (err) {
        setPublicPlayerMessage('Não foi possível enviar o convite agora.', true);
    }
}

async function respondFriendInvite(fromUid, accept) {
    if (!db || !activeUser || activeUser.isAnonymous || !fromUid) return;

    try {
        const myRef = doc(db, 'users', activeUser.uid);
        const fromRef = doc(db, 'users', fromUid);
        await runTransaction(db, async (transaction) => {
            const mySnap = await transaction.get(myRef);
            const fromSnap = await transaction.get(fromRef);
            if (!mySnap.exists() || !fromSnap.exists()) return;

            const myDoc = mySnap.data();
            const fromDoc = fromSnap.data();
            const myRequests = normalizeSocialMap(myDoc.friendRequests);
            const fromSent = normalizeSocialMap(fromDoc.sentFriendRequests);
            const myFriends = normalizeSocialMap(myDoc.friends);
            const fromFriends = normalizeSocialMap(fromDoc.friends);

            delete myRequests[fromUid];
            delete fromSent[activeUser.uid];

            if (accept) {
                const acceptedAt = Date.now();
                myFriends[fromUid] = {
                    uid: fromUid,
                    name: fromDoc.name || 'Jogador',
                    photo: fromDoc.photo || DEFAULT_AVATAR,
                    acceptedAt
                };
                fromFriends[activeUser.uid] = {
                    uid: activeUser.uid,
                    name: getOnlinePlayerName(),
                    photo: getOnlinePlayerPhoto(),
                    acceptedAt
                };
            }

            transaction.set(myRef, { friendRequests: myRequests, friends: myFriends }, { merge: true });
            transaction.set(fromRef, { sentFriendRequests: fromSent, friends: fromFriends }, { merge: true });
        });
        await refreshActiveUserDoc();
        renderFriendsModal();
        setFriendsStatus(accept ? 'Convite aceito.' : 'Convite recusado.');
    } catch (err) {
        setFriendsStatus('Não foi possível responder o convite agora.', true);
    }
}

function renderFriendRow(player, actions = []) {
    const row = document.createElement('div');
    row.className = 'friend-row';

    const avatar = document.createElement('img');
    avatar.src = getPublicPlayerPhoto(player);
    avatar.alt = '';

    const name = document.createElement('strong');
    name.innerText = getPublicPlayerName(player);

    const info = document.createElement('div');
    info.className = 'friend-row-info';
    info.appendChild(name);

    const actionWrap = document.createElement('div');
    actionWrap.className = 'friend-row-actions';
    actions.forEach((action) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = action.danger ? 'profile-btn profile-danger-btn' : 'profile-btn profile-ghost-btn';
        button.innerText = action.label;
        button.addEventListener('click', action.onClick);
        actionWrap.appendChild(button);
    });

    row.append(avatar, info, actionWrap);
    return row;
}

function renderFriendsModal() {
    if (!friendRequestsList || !friendsList) return;
    friendRequestsList.innerHTML = '';
    friendsList.innerHTML = '';

    const requests = Object.values(normalizeSocialMap(activeUserDoc?.friendRequests));
    const friends = Object.values(normalizeSocialMap(activeUserDoc?.friends));

    if (!requests.length) {
        friendRequestsList.innerHTML = '<div class="friends-empty">Nenhum convite pendente.</div>';
    } else {
        requests.forEach((request) => {
            friendRequestsList.appendChild(renderFriendRow(request, [
                { label: 'Aceitar', onClick: () => respondFriendInvite(request.uid, true) },
                { label: 'Recusar', danger: true, onClick: () => respondFriendInvite(request.uid, false) }
            ]));
        });
    }

    if (!friends.length) {
        friendsList.innerHTML = '<div class="friends-empty">Você ainda não adicionou amigos.</div>';
    } else {
        friends.forEach((friend) => {
            friendsList.appendChild(renderFriendRow(friend));
        });
    }
}

async function openFriendsModal() {
    showControl(friendsModal, true);
    showControl(userMenuDropdown, false);
    setFriendsStatus('');
    if (!activeUser || activeUser.isAnonymous) {
        if (friendRequestsList) friendRequestsList.innerHTML = '<div class="friends-empty">Faça login para receber convites.</div>';
        if (friendsList) friendsList.innerHTML = '<div class="friends-empty">Faça login para ver amigos.</div>';
        setFriendsStatus('Faça login para usar amigos.', true);
        return;
    }
    await refreshActiveUserDoc();
    renderFriendsModal();
}

function closeFriendsModal() {
    showControl(friendsModal, false);
}

function openProfileModal() {
    showControl(profileModal, true);
    showControl(userMenuDropdown, false);
    syncThemeAvailability();

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
    closeAudioSettingsModal();
    setStatus('');
}

function openAudioSettingsModal() {
    updateAudioSettingsUi();
    showControl(audioSettingsModal, true);
}

function closeAudioSettingsModal() {
    showControl(audioSettingsModal, false);
}

function getSaoPauloDateKey(offsetDays = 0) {
    const now = new Date();
    const saoPauloNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    saoPauloNow.setDate(saoPauloNow.getDate() + offsetDays);
    const year = saoPauloNow.getFullYear();
    const month = `${saoPauloNow.getMonth() + 1}`.padStart(2, '0');
    const day = `${saoPauloNow.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function normalizeArcaneStreakData(rawData) {
    const claimedMilestone = Math.max(
        0,
        Number(
            rawData?.lastMilestoneClaimed ??
            rawData?.lastCelebratedMilestone ??
            0
        )
    );
    return {
        lastPlayDate: typeof rawData?.lastPlayDate === 'string' ? rawData.lastPlayDate : '',
        streakCount: Math.max(0, Number(rawData?.streakCount || 0)),
        lastCelebratedMilestone: claimedMilestone,
        lastMilestoneClaimed: claimedMilestone
    };
}

function getNextArcaneMilestone(streakCount = 0) {
    const nextFixedMilestone = ARCANE_STREAK_MILESTONES.find((milestone) => milestone > streakCount);
    if (nextFixedMilestone) return nextFixedMilestone;
    const extraDays = Math.max(0, streakCount - 365);
    const extraMonthStep = Math.floor(extraDays / 30) + 1;
    return 365 + (extraMonthStep * 30);
}

function buildArcaneStreakShareText(streakCount = 0) {
    const total = Math.max(0, Number(streakCount || 0));
    const dayLabel = total === 1 ? 'dia' : 'dias';
    return `Minha Chama Arcana chegou a ${total} ${dayLabel} no MagicLexis! 🔥\nJogue agora: https://magiclexis.com.br`;
}

function getArcaneDayLabel(total = 0) {
    return Number(total) === 1 ? 'dia' : 'dias';
}

function getArcaneStreakHeadline(streak = 0) {
    if (streak >= 365) return '🔥 Sua chama virou lenda!';
    if (streak >= 30) return '🔥 Sua chama está poderosa!';
    if (streak >= 7) return '🔥 Sua chama está firme!';
    if (streak > 1) return '🔥 Sua chama cresceu!';
    return '🔥 Sua chama começou!';
}

function getArcaneStreakCopyText(streak = 0) {
    const dayLabel = getArcaneDayLabel(streak);
    if (streak <= 1) {
        return `Você manteve a magia viva por ${streak} ${dayLabel}. Continue jogando para manter sua chama acesa.`;
    }
    if (streak >= 30) {
        return `Sua jornada já soma ${streak} ${dayLabel} seguidos de magia. Continue alimentando essa chama arcana.`;
    }
    return `Você já acumula ${streak} ${dayLabel} seguidos no MagicLexis. Continue jogando para mantê-la viva.`;
}

function closeArcaneStreakModal() {
    showControl(arcaneStreakModal, false);
}

function triggerArcaneStreakIndicatorFeedback() {
    if (!userStreakIndicator) return;
    userStreakIndicator.classList.remove('is-celebrating');
    void userStreakIndicator.offsetWidth;
    userStreakIndicator.classList.add('is-celebrating');
    if (arcaneStreakIndicatorFeedbackTimeout) {
        clearTimeout(arcaneStreakIndicatorFeedbackTimeout);
    }
    arcaneStreakIndicatorFeedbackTimeout = window.setTimeout(() => {
        userStreakIndicator.classList.remove('is-celebrating');
    }, 700);
    if (typeof navigator?.vibrate === 'function') {
        navigator.vibrate([20, 30, 20]);
    }
}

function openArcaneStreakModal(streakData = {}) {
    const normalized = normalizeArcaneStreakData(streakData);
    const streak = normalized.streakCount;
    const nextMilestone = getNextArcaneMilestone(streak);
    const dayLabel = getArcaneDayLabel(streak);
    showControl(userMenuDropdown, false);

    if (arcaneStreakTitle) {
        arcaneStreakTitle.innerText = getArcaneStreakHeadline(streak);
    }
    if (arcaneStreakCount) {
        arcaneStreakCount.innerText = `${streak}`;
    }
    if (arcaneStreakCountLabel) {
        arcaneStreakCountLabel.innerText = `${dayLabel} seguido${streak === 1 ? '' : 's'}`;
    }
    if (arcaneStreakCopy) {
        arcaneStreakCopy.innerText = getArcaneStreakCopyText(streak);
    }
    if (arcaneStreakMilestone) {
        arcaneStreakMilestone.innerText = nextMilestone
            ? `Próximo marco: ${nextMilestone} ${getArcaneDayLabel(nextMilestone)}`
            : `Marco lendário: ${streak} ${dayLabel}`;
    }

    const streakCard = arcaneStreakModal?.querySelector('.arcane-streak-card');
    if (streakCard) {
        streakCard.classList.remove('is-open');
        void streakCard.offsetWidth;
        streakCard.classList.add('is-open');
    }
    showControl(arcaneStreakModal, true);
}

async function shareArcaneStreak() {
    const streak = normalizeArcaneStreakData(activeUserDoc).streakCount;
    const shareText = buildArcaneStreakShareText(streak);

    try {
        if (navigator.share) {
            await navigator.share({
                title: 'MagicLexis • Chama Arcana',
                text: shareText,
                url: 'https://magiclexis.com.br'
            });
            showFloatingMessage('Compartilhado!', 1800);
        } else if (navigator.clipboard) {
            await navigator.clipboard.writeText(shareText);
            showFloatingMessage('Copiado!', 1800);
        } else {
            showFloatingMessage(shareText, 2800);
        }
    } catch (err) {
        if (err?.name !== 'AbortError') {
            console.log('Falha ao compartilhar Chama Arcana:', err);
            showFloatingMessage('Nao foi possivel compartilhar agora.', 2200);
        }
    }
}

async function syncArcaneStreakForUser(userDocData = activeUserDoc) {
    if (!db || !activeUser || activeUser.isAnonymous) return null;

    const normalized = normalizeArcaneStreakData(userDocData);
    const todayKey = getSaoPauloDateKey(0);
    const yesterdayKey = getSaoPauloDateKey(-1);
    let nextStreakCount = normalized.streakCount;
    let didIncrease = false;

    if (normalized.lastPlayDate === todayKey) {
        return { ...normalized, changed: false, didIncrease: false, alreadyCountedToday: true };
    }

    if (!normalized.lastPlayDate) {
        nextStreakCount = 1;
        didIncrease = true;
    } else if (normalized.lastPlayDate === yesterdayKey) {
        nextStreakCount = normalized.streakCount + 1;
        didIncrease = true;
    } else {
        nextStreakCount = 1;
        didIncrease = true;
    }

    const nextData = {
        lastPlayDate: todayKey,
        streakCount: nextStreakCount,
        lastCelebratedMilestone: normalized.lastMilestoneClaimed,
        lastMilestoneClaimed: normalized.lastMilestoneClaimed
    };

    const userRef = doc(db, 'users', activeUser.uid);
    await setDoc(userRef, nextData, { merge: true });
    activeUserDoc = { ...(activeUserDoc || {}), ...nextData };
    syncTopUserUi(activeUser, activeUserDoc);

    const unlockedThemes = getNewlyUnlockedThemes(normalized.streakCount, nextStreakCount);

    const reachedMilestone = ARCANE_STREAK_MILESTONES.includes(nextStreakCount);
    if (reachedMilestone && nextStreakCount > normalized.lastMilestoneClaimed) {
        await setDoc(userRef, {
            lastCelebratedMilestone: nextStreakCount,
            lastMilestoneClaimed: nextStreakCount
        }, { merge: true });
        activeUserDoc.lastCelebratedMilestone = nextStreakCount;
        activeUserDoc.lastMilestoneClaimed = nextStreakCount;
        openArcaneStreakModal(activeUserDoc);
    }

    if (unlockedThemes.length) {
        const unlockCopy = unlockedThemes.length === 1
            ? `🔥 Novo tema desbloqueado: ${getThemeLabel(unlockedThemes[0])}`
            : `🔥 Novos temas desbloqueados: ${unlockedThemes.map((themeId) => getThemeLabel(themeId)).join(', ')}`;
        showFloatingMessage(unlockCopy, 2600);
    }

    return {
        ...nextData,
        changed: true,
        didIncrease,
        alreadyCountedToday: false
    };
}

async function onValidGameFinished() {
    if (!activeUser || activeUser.isAnonymous || !db) return null;
    const streakResult = await syncArcaneStreakForUser(activeUserDoc);
    if (streakResult?.didIncrease && !streakResult?.alreadyCountedToday) {
        triggerArcaneStreakIndicatorFeedback();
        showFloatingMessage(`Chama Arcana: 🔥 ${streakResult.streakCount}`, 2200);
    }
    return streakResult;
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
    closeAudioSettingsModalBtn?.addEventListener('click', closeAudioSettingsModal);
    closeArcaneStreakModalBtn?.addEventListener('click', closeArcaneStreakModal);
    arcaneStreakCloseBtn?.addEventListener('click', closeArcaneStreakModal);
    arcaneStreakShareBtn?.addEventListener('click', shareArcaneStreak);
    closePublicPlayerModalBtn?.addEventListener('click', closePublicPlayerProfile);
    closeFriendsModalBtn?.addEventListener('click', closeFriendsModal);
    sendFriendInviteBtn?.addEventListener('click', async () => {
        const status = getFriendshipStatus(selectedPublicPlayer?.uid);
        if (status === 'incoming') {
            await respondFriendInvite(selectedPublicPlayer.uid, true);
            syncFriendInviteButton();
            setPublicPlayerMessage('Convite aceito.');
            return;
        }
        await sendFriendInvite();
    });
    document.getElementById('close-ranking-modal')?.addEventListener('click', closeRankingModal);
    document.getElementById('save-profile-btn')?.addEventListener('click', saveProfile);
    document.getElementById('profile-logout-btn')?.addEventListener('click', logoutUser);
    openAudioSettingsBtn?.addEventListener('click', openAudioSettingsModal);
    profilePhotoBtn?.addEventListener('click', () => profilePhotoInput?.click());
    onlineBackBtn?.addEventListener('click', async () => {
        await leaveOnlineRoom({ abandon: !!currentOnlineRoomCode });
        openWelcomeTutorial(true);
    });
    onlineQuickMatchBtn?.addEventListener('click', startQuickOnlineMatch);
    onlineCreateRoomBtn?.addEventListener('click', createPartyRoom);
    onlineJoinRoomBtn?.addEventListener('click', joinPartyRoom);
    onlinePartyStartBtn?.addEventListener('click', startPartyRoom);
    onlineCopyCodeBtn?.addEventListener('click', copyOnlineRoomCode);
    onlineRoomLeaveBtn?.addEventListener('click', async () => {
        await leaveOnlineRoom({ abandon: true });
        showOnlineScreen();
    });
    onlineMatchLeaveBtn?.addEventListener('click', async () => {
        await leaveOnlineRoom({ abandon: true });
        showOnlineScreen();
    });
    userLeaveOnlineMatchBtn?.addEventListener('click', async () => {
        showControl(userMenuDropdown, false);
        await leaveOnlineRoom({ abandon: true });
        showOnlineScreen();
    });
    onlineRoomCodeInput?.addEventListener('input', sanitizeOnlineCodeInput);
    onlineRoomCodeInput?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        joinPartyRoom();
    });
    closeCampaignCompleteModalBtn?.addEventListener('click', () => {
        goToCampaignBooks(pendingCampaignCompletion?.nextLevel || pendingCampaignCompletion?.currentLevel || null);
    });
    campaignCompleteBooksBtn?.addEventListener('click', () => {
        goToCampaignBooks(pendingCampaignCompletion?.nextLevel || pendingCampaignCompletion?.currentLevel || null);
    });
    campaignCompleteNextBtn?.addEventListener('click', continueToNextCampaignBook);
    journeyFinaleReplayBtn?.addEventListener('click', restartCampaignJourney);
    journeyFinaleMenuBtn?.addEventListener('click', async () => {
        hideJourneyFinaleScreen({ stopMusic: true });
        journeyFinaleShown = false;
        await showHubScreenFromGame();
    });
    journeyFinaleShareBtn?.addEventListener('click', shareJourneyFinale);
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
    opponentProfileChip?.addEventListener('click', () => openPublicPlayerProfile());

    document.getElementById('user-menu-trigger')?.addEventListener('click', () => {
        showControl(userMenuDropdown, userMenuDropdown.classList.contains('hidden-control'));
    });
    userStreakIndicator?.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (!activeUser || activeUser.isAnonymous) return;
        openArcaneStreakModal(activeUserDoc);
    });
    userStreakIndicator?.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        if (!activeUser || activeUser.isAnonymous) return;
        openArcaneStreakModal(activeUserDoc);
    });
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
        button.addEventListener('click', () => {
            const nextTheme = button.getAttribute('data-theme-option') || 'default';
            if (!isThemeUnlocked(nextTheme)) {
                showFloatingMessage(getThemeUnlockMessage(nextTheme), 2200);
                return;
            }
            applyTheme(nextTheme);
            setStatus(`Tema ${getThemeLabel(nextTheme)} aplicado.`);
        });
    });

    audioMusicEnabledInput?.addEventListener('change', () => {
        updateAudioSetting('musicEnabled', !!audioMusicEnabledInput.checked);
    });
    audioMusicVolumeInput?.addEventListener('input', () => {
        updateAudioSetting('musicVolume', Number(audioMusicVolumeInput.value || 0) / 100);
    });
    audioSfxEnabledInput?.addEventListener('change', () => {
        updateAudioSetting('sfxEnabled', !!audioSfxEnabledInput.checked);
    });
    audioSfxVolumeInput?.addEventListener('input', () => {
        updateAudioSetting('sfxVolume', Number(audioSfxVolumeInput.value || 0) / 100);
    });

    window.addEventListener('click', (e) => {
        if (!userMenu?.contains(e.target)) showControl(userMenuDropdown, false);
        if (e.target === profileModal) closeProfileModal();
        if (e.target === audioSettingsModal) closeAudioSettingsModal();
        if (e.target === arcaneStreakModal) closeArcaneStreakModal();
        if (e.target === publicPlayerModal) closePublicPlayerProfile();
        if (e.target === friendsModal) closeFriendsModal();
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
        if (isOnlineGameplayMode() && currentOnlineRoomCode && !currentOnlineLeaving) {
            forceAbandonOnlineRoomOnUnload();
            return;
        }
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
        if (isTrainingModeActive()) {
            updateTrainingHandPosition();
        }
    });

    window.addEventListener('scroll', () => {
        if (isTrainingModeActive()) {
            updateTrainingHandPosition();
        }
    }, { passive: true });

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            if (isTrainingModeActive()) {
                updateTrainingHandPosition();
            }
        });
        window.visualViewport.addEventListener('scroll', () => {
            if (isTrainingModeActive()) {
                updateTrainingHandPosition();
            }
        });
    }

    window.addEventListener('pagehide', () => {
        if (!currentOnlineRoomCode || currentOnlineLeaving) return;
        forceAbandonOnlineRoomOnUnload();
    });

    populateOnlineLetterCountOptions();
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
            loadPlayerStats();
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
        loadPlayerStats();

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

function initInitialLoadingScreen() {
    const loadingScreen = document.getElementById('initial-loading-screen');
    const loadingEntry = document.getElementById('initial-loading-entry');
    const loadingPlayBtn = document.getElementById('initial-loading-play-btn');
    const loadingStatus = document.getElementById('initial-loading-status');
    const loadingBar = document.getElementById('initial-loading-bar');
    const loadingPercent = document.getElementById('initial-loading-percent');
    if (!loadingScreen || !loadingPlayBtn || !loadingStatus || !loadingBar || !loadingPercent) return;

    document.body.classList.add('loading-screen-active');

    const startInitialLoading = () => {
        if (initialLoadingStarted) return;
        initialLoadingStarted = true;
        menuMusicUnlocked = true;
        audioManager.unlocked = true;
        tryStartMenuMusic(true);

        if (loadingEntry) loadingEntry.classList.add('hidden-control');
        loadingStatus.classList.remove('hidden-control');

        const totalDurationMs = 1500;
        const fadeOutDurationMs = 420;
        const startTime = performance.now();

        const tick = (now) => {
            const elapsed = Math.min(totalDurationMs, now - startTime);
            const progress = Math.min(1, elapsed / totalDurationMs);
            const easedProgress = 1 - Math.pow(1 - progress, 2.6);
            const percent = Math.round(easedProgress * 100);

            loadingBar.style.width = `${percent}%`;
            loadingPercent.innerText = `${percent}%`;

            if (elapsed < totalDurationMs) {
                window.requestAnimationFrame(tick);
                return;
            }

            loadingBar.style.width = '100%';
            loadingPercent.innerText = '100%';

            window.setTimeout(() => {
                loadingScreen.classList.add('is-hidden');
                document.body.classList.remove('loading-screen-active');

                window.setTimeout(() => {
                    loadingScreen.remove();
                }, fadeOutDurationMs);
            }, 110);
        };

        window.requestAnimationFrame(tick);
    };

    loadingPlayBtn.addEventListener('click', async () => {
        await entrarTelaCheia();
        startInitialLoading();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(loadThemePreference(), { persist: false });
    initInitialLoadingScreen();
    atualizarEstadoFullscreen();
    loadPlayerStats();
    loadAudioSettings();
    applySfxSettingsToAudioGraph();
    applyAudioSettings();
    bindAuthUiEvents();
    setGateAuthMode('login');
    syncRefreshLockState();
    initFirebase();
    updateAuthProviderLabels();
    observeLanguageChanges();
});


















































