/* --- INICIALIZAÇÃO --- */
document.addEventListener("DOMContentLoaded", () => {
    // Detecta mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;
    if (isMobile) {
        document.body.classList.add('mobile-mode');
        // No mobile, a lógica de toggle pode ser diferente, mas vamos manter o padrão desktop first
    }
    
    startMageIdle();
    initChallenge();
});

// LÓGICA DO BOTÃO DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    // Some com o modal
    document.getElementById('welcome-screen').style.display = 'none';
    // Mostra o jogo
    document.getElementById('app-container').classList.remove('hidden-app');
    
    if (audioCtx.state === 'suspended') audioCtx.resume();
};

/* --- TOGGLE SIDEBAR --- */
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-sidebar-btn');

toggleBtn.onclick = () => {
    sidebar.classList.toggle('collapsed');
    // Alterna seta
    if (sidebar.classList.contains('collapsed')) {
        toggleBtn.innerText = "▶";
    } else {
        toggleBtn.innerText = "◀";
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

/* --- DADOS (300 PALAVRAS) --- */
const allChallenges = [
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
    { word: "GOL", hints: ["Futebol.", "Rede.", "Ponto.", "Chute.", "Trave."], meaning: "Ponto marcado no futebol." },
    { word: "SAL", hints: ["Tempero.", "Branco.", "Mar.", "Cozinha.", "Salgado."], meaning: "Cloreto de sódio." },
    { word: "MAE", hints: ["Genitora.", "Amor.", "Família.", "Origem.", "Cuidado."], meaning: "Mulher que gerou um filho." },
    { word: "PAI", hints: ["Genitor.", "Família.", "Protetor.", "Origem.", "Masculino."], meaning: "Homem que gerou um filho." },
    { word: "SIM", hints: ["Afirmação.", "Positivo.", "Concordo.", "Aceito.", "Oposto de não."], meaning: "Advérbio de afirmação." },
    { word: "NAO", hints: ["Negação.", "Recusa.", "Nunca.", "Jamais.", "Oposto de sim."], meaning: "Advérbio de negação." },
    { word: "FIM", hints: ["Término.", "Acabou.", "Final.", "Conclusão.", "Desfecho."], meaning: "Onde algo termina." },
    { word: "LAR", hints: ["Casa.", "Família.", "Abrigo.", "Doce.", "Residência."], meaning: "Lugar onde se mora." },
    { word: "PÅO", hints: ["Alimento.", "Trigo.", "Padaria.", "Café.", "Massa."], meaning: "Alimento feito de farinha." },
    { word: "AVE", hints: ["Pássaro.", "Voo.", "Penas.", "Bico.", "Ninho."], meaning: "Animal com penas." },
    { word: "DOR", hints: ["Sofrimento.", "Machucado.", "Sentimento ruim.", "Ai.", "Desconforto."], meaning: "Sensação desagradável." },
    { word: "REI", hints: ["Monarca.", "Coroa.", "Trono.", "Reino.", "Governante."], meaning: "Chefe de um reino." },
    { word: "LEI", hints: ["Regra.", "Direito.", "Ordem.", "Juiz.", "Justiça."], meaning: "Norma jurídica." },
    { word: "BOI", hints: ["Animal.", "Fazenda.", "Chifre.", "Pasto.", "Gado."], meaning: "Mamífero bovino." },
    { word: "MEL", hints: ["Doce.", "Abelha.", "Colmeia.", "Pegajoso.", "Dourado."], meaning: "Alimento produzido por abelhas." },
    { word: "CEU", hints: ["Alto.", "Nuvens.", "Espaço.", "Azul.", "Paraíso."], meaning: "Espaço celeste." },
    { word: "NOZ", hints: ["Fruto.", "Dura.", "Natal.", "Quebra.", "Seca."], meaning: "Fruto da nogueira." },
    { word: "GIZ", hints: ["Lousa.", "Branco.", "Escrever.", "Pó.", "Escola."], meaning: "Material para escrever em quadros." },
    { word: "GAS", hints: ["Combustível.", "Cozinha.", "Fogo.", "Ar.", "Vapor."], meaning: "Estado da matéria." },
    { word: "OLA", hints: ["Saudação.", "Cumprimento.", "Oi.", "Chegada.", "Voz."], meaning: "Forma de cumprimento." },
    { word: "CASA", hints: ["Moradia.", "Teto.", "Lar.", "Construção.", "Abrigo."], meaning: "Edifício para habitar." },
    { word: "BOLA", hints: ["Esfera.", "Jogo.", "Redonda.", "Futebol.", "Brinquedo."], meaning: "Objeto esférico." },
    { word: "VIDA", hints: ["Viver.", "Existência.", "Nascer.", "Biologia.", "Sopro."], meaning: "Estado de atividade funcional." },
    { word: "AMOR", hints: ["Coração.", "Afeto.", "Paixão.", "Sentimento.", "União."], meaning: "Forte afeição." },
    { word: "ANEL", hints: ["Dedo.", "Joia.", "Ouro.", "Círculo.", "Compromisso."], meaning: "Aro ornamental." },
    { word: "TREM", hints: ["Trilho.", "Vagão.", "Locomotiva.", "Viagem.", "Apito."], meaning: "Comboio ferroviário." },
    { word: "FLOR", hints: ["Jardim.", "Pétala.", "Cheiro.", "Planta.", "Primavera."], meaning: "Órgão reprodutor das plantas." },
    { word: "MESA", hints: ["Móvel.", "Jantar.", "Apoio.", "Quatro pernas.", "Madeira."], meaning: "Móvel com tampo plano." },
    { word: "GATO", hints: ["Felino.", "Miau.", "Bigode.", "Animal.", "Doméstico."], meaning: "Pequeno mamífero carnívoro." },
    { word: "DADO", hints: ["Sorte.", "Cubo.", "Números.", "Jogos.", "Lados."], meaning: "Cubo para jogos de azar." },
    { word: "FOGO", hints: ["Quente.", "Queima.", "Chama.", "Incêndio.", "Luz."], meaning: "Combustão visível." },
    { word: "AGUA", hints: ["Líquido.", "Beber.", "Vida.", "Rio.", "Chuva."], meaning: "Líquido essencial à vida." },
    { word: "LAGO", hints: ["Água parada.", "Pato.", "Pesca.", "Natureza.", "Pequeno mar."], meaning: "Depressão com água." },
    { word: "SEDE", hints: ["Beber.", "Seca.", "Garganta.", "Água.", "Desejo."], meaning: "Necessidade de beber." },
    { word: "MEDO", hints: ["Susto.", "Pavor.", "Escuro.", "Terror.", "Emoção."], meaning: "Sensação de perigo." },
    { word: "RISO", hints: ["Alegria.", "Boca.", "Piada.", "Engraçado.", "Som."], meaning: "Ato de rir." },
    { word: "SONO", hints: ["Dormir.", "Cama.", "Noite.", "Cansaço.", "Sonhar."], meaning: "Estado de repouso." },
    { word: "TODO", hints: ["Inteiro.", "Completo.", "Total.", "Tudo.", "Global."], meaning: "A totalidade." },
    { word: "NADA", hints: ["Vazio.", "Zero.", "Oco.", "Inexistente.", "Nenhum."], meaning: "Coisa nenhuma." },
    { word: "HOJE", hints: ["Agora.", "Dia atual.", "Presente.", "Data.", "Tempo."], meaning: "O dia em que estamos." }
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

let currentWord = [];
let lastChar = '';
let cCombo = 0;
let replaceIndex = 0;
let isFirstRound = true; 
let targetChallenge = null;
let hintIndex = 0;
let hintInterval = null;
let maxWordLength = 0;

function clearAllHighlights() {
    document.querySelectorAll('.rule-card').forEach(card => card.classList.remove('rule-active'));
}

function initChallenge() {
    clearAllHighlights();
    animateMage('reset');
    
    // Sorteio
    if (usedIndices.length === allChallenges.length) usedIndices = [];
    let randIdx;
    do { randIdx = Math.floor(Math.random() * allChallenges.length); } while (usedIndices.includes(randIdx));
    usedIndices.push(randIdx);
    targetChallenge = allChallenges[randIdx];
    
    maxWordLength = targetChallenge.word.length;
    currentWord = [];
    replaceIndex = 0;
    
    hintIndex = 0;
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

function stopHintCycle() { if (hintInterval) clearInterval(hintInterval); }

const isVowel = (c) => 'AEIOUaeiou'.includes(c);

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
alphabet.forEach(letter => {
    const div = document.createElement('div');
    div.className = 'mini-char'; div.id = `mini-${letter}`; div.innerText = letter;
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
        playSoundEffect('overwrite');
        currentWord.splice(replaceIndex, 1);
        let insertionIndex = replaceIndex;
        replaceIndex++;
        if (replaceIndex >= maxWordLength) replaceIndex = 0;
        processNewChar(char, insertionIndex);
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
        }, 5000);
        return;
    }

    try {
        const res = await fetch(`https://api.dicionario-aberto.net/word/${word.toLowerCase()}`);
        const data = await res.json();
        if (data.length > 0) {
            feedback.innerText = "⚠️ Palavra existe, mas não é a do desafio."; feedback.style.color = "var(--warning)";
            animateMage('reset');
        } else {
            feedback.innerText = "❌ Tente novamente"; feedback.style.color = "var(--error)";
            document.body.classList.add('error-flash'); playSoundEffect('error');
            animateMage('sad');
        }
    } catch { feedback.innerText = "Erro na API"; }

    setTimeout(() => { 
        document.body.classList.remove('success-flash', 'error-flash'); 
        if(!feedback.innerText.includes("Novo")) feedback.innerText = ""; 
    }, 2000);
}

charInput.addEventListener('input', (e) => { 
    if(e.target.value) { addChar(e.target.value); e.target.value = ''; }
});
validateBtn.addEventListener('click', validate);
document.getElementById('clear-history').onclick = () => { historyList.innerHTML = ''; clearAllHighlights(); };

document.body.onclick = (e) => { 
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if(e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && !e.target.classList.contains('letter-box')) {
        charInput.focus(); 
    }
};