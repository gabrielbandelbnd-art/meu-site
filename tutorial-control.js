const TUTORIAL_KEY = 'magiclexis_tutorial_seen_v1';

function hasSeenTutorial() {
  try {
    return localStorage.getItem(TUTORIAL_KEY) === '1';
  } catch {
    return false;
  }
}

function markTutorialSeen() {
  try {
    localStorage.setItem(TUTORIAL_KEY, '1');
  } catch {
    // ignora bloqueios de storage
  }
}

function applyTutorialTexts() {
  const pages = document.querySelectorAll('#book-pages-track .book-page');
  if (!pages || pages.length < 7) return;

  pages[0].innerHTML = `
    <h3>Página 1 • Introdução ao MagicLexis</h3>
    <p>No MagicLexis, seu objetivo é descobrir a palavra correta proposta pelo jogo e montar esse resultado no tabuleiro.</p>
    <p>Você não digita a palavra de forma comum do início ao fim, porque as letras podem ser transformadas pelas regras mágicas.</p>
    <p>Para vencer, você precisa entender como cada regra altera a sequência e então conduzir o tabuleiro até a palavra certa.</p>
    <p>Pense como um quebra-cabeça: cada letra inserida pode mudar o caminho final.</p>
  `;

  pages[1].innerHTML = `
    <h3>Página 2 • Regra da Vogal (+1)</h3>
    <p>Quando a letra anterior no tabuleiro for uma vogal, a nova letra digitada avança uma casa no alfabeto.</p>
    <p>Isso significa que a letra que você digitou pode não ser exatamente a letra que ficará registrada no tabuleiro.</p>
    <p class="book-example">Exemplos claros: A vira B, E vira F, O vira P.</p>
    <p>Essa regra afeta diretamente a construção da palavra, então sempre observe a letra anterior antes de jogar a próxima.</p>
  `;

  pages[2].innerHTML = `
    <h3>Página 3 • Regra da Consoante (Espelho)</h3>
    <p>Quando a nova letra for consoante, a letra anterior pode ser espelhada no alfabeto.</p>
    <p>Em outras palavras, letras que já estavam no tabuleiro podem ser alteradas por uma jogada atual.</p>
    <p class="book-example">Exemplos de espelho: A vira Z, B vira Y, C vira X.</p>
    <p>Por isso, não basta pensar só na próxima posição: você também precisa prever como a regra pode transformar o que já foi escrito.</p>
  `;

  pages[3].innerHTML = `
    <h3>Página 4 • Regra do Sanduíche</h3>
    <p>Quando a mesma letra aparece repetida em posições diferentes, tudo o que está entre essas duas letras é invertido.</p>
    <p>Essa é uma das regras mais desafiadoras porque pode reorganizar várias letras de uma vez e mudar o rumo da tentativa.</p>
    <p class="book-example">Exemplo: MARATONA pode virar MARANOTA.</p>
    <p>Fique atento a repetições: identificar um “sanduíche” no momento certo pode ser a chave para acertar a palavra.</p>
  `;

  pages[4].innerHTML = `
    <h3>Página 5 • Ciclo Infinito</h3>
    <p>Quando o tabuleiro fica cheio, o cursor volta automaticamente para o início.</p>
    <p>A partir daí, você continua jogando no mesmo ciclo, com as regras mágicas ainda ativas.</p>
    <p>Isso quer dizer que o estado da palavra continua evoluindo, mesmo depois de completar todas as casas uma vez.</p>
    <p>Em muitos desafios, esse ciclo é necessário para chegar ao resultado correto.</p>
  `;

  pages[5].innerHTML = `
    <h3>Página 6 • Como Jogar</h3>
    <p>Você deve colocar uma letra por vez no campo com interrogação.</p>
    <p>Conforme digita, a palavra vai sendo codificada automaticamente de acordo com as regras mágicas.</p>
    <p>Se errar o caminho ou quiser reiniciar sua tentativa, use o botão <strong>LIMPAR</strong> para limpar o tabuleiro.</p>
    <p>Quando achar que a palavra montada está correta, pressione <strong>VALIDAR</strong>.</p>
    <p>Se estiver certa, você vence e recebe o significado da palavra do desafio.</p>
  `;

  const page7 = pages[6];
  const title = page7.querySelector('h3');
  if (title) title.textContent = 'Página 7 • Dicas Finais';

  const difficultyBox = page7.querySelector('.difficulty-box');
  const paragraphs = page7.querySelectorAll('p');
  const messages = [
    'Observe as regras com atenção antes de cada letra, porque uma única jogada pode alterar partes importantes do tabuleiro.',
    'Use o rascunho para testar combinações e planejar seus próximos passos com mais segurança.',
    'Em alguns desafios, você vai precisar testar mais de uma estratégia até descobrir o caminho correto.',
    'MagicLexis mistura lógica, atenção e paciência. Continue praticando e você vai evoluir a cada partida.'
  ];

  if (paragraphs[0]) paragraphs[0].textContent = messages[0];
  for (let i = 1; i < messages.length; i += 1) {
    if (paragraphs[i]) {
      paragraphs[i].textContent = messages[i];
    } else if (difficultyBox) {
      const p = document.createElement('p');
      p.textContent = messages[i];
      page7.insertBefore(p, difficultyBox);
    }
  }
}

function ensureTutorialButton() {
  const hubButtons = document.querySelector('.hub-buttons');
  const playBtn = document.getElementById('hub-play');
  if (!hubButtons || !playBtn) return null;

  let tutorialBtn = document.getElementById('hub-tutorial');
  if (!tutorialBtn) {
    tutorialBtn = document.createElement('button');
    tutorialBtn.className = 'hub-btn';
    tutorialBtn.id = 'hub-tutorial';
    tutorialBtn.textContent = '📖 Tutorial';
    playBtn.insertAdjacentElement('afterend', tutorialBtn);
  }
  return tutorialBtn;
}

function ensureCloseTutorialButton() {
  const header = document.querySelector('.book-tutorial-header');
  if (!header) return null;

  let closeBtn = document.getElementById('close-tutorial-btn');
  if (!closeBtn) {
    closeBtn = document.createElement('button');
    closeBtn.id = 'close-tutorial-btn';
    closeBtn.className = 'close-tutorial-btn hidden-control';
    closeBtn.setAttribute('aria-label', 'Fechar tutorial');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '2px';
    closeBtn.style.right = '0';
    closeBtn.style.width = '36px';
    closeBtn.style.height = '36px';
    closeBtn.style.borderRadius = '8px';
    closeBtn.style.border = '1px solid rgba(187, 134, 252, 0.65)';
    closeBtn.style.background = 'rgba(27, 16, 38, 0.9)';
    closeBtn.style.color = '#f4e6ff';
    closeBtn.style.fontSize = '1.2rem';
    closeBtn.style.fontWeight = '700';
    closeBtn.style.cursor = 'pointer';
    header.style.position = 'relative';
    header.style.paddingRight = '52px';
    header.appendChild(closeBtn);
  }
  return closeBtn;
}

function resetTutorialToFirstPage() {
  const indicator = document.getElementById('tutorial-page-indicator');
  const track = document.getElementById('book-pages-track');
  const left = document.getElementById('book-arrow-left');
  const right = document.getElementById('book-arrow-right');

  if (track) track.style.transform = 'translateX(0%)';
  if (indicator) {
    const total = document.querySelectorAll('#book-pages-track .book-page').length || 7;
    indicator.textContent = `Página 1 de ${total}`;
  }
  if (left) left.disabled = true;
  if (right) right.disabled = false;
}

function showTutorial(manual = false) {
  const hub = document.getElementById('main-hub');
  const welcome = document.getElementById('welcome-screen');
  const app = document.getElementById('app-container');
  const closeBtn = document.getElementById('close-tutorial-btn');

  if (!hub || !welcome || !app) return;

  hub.style.display = 'none';
  welcome.style.display = 'flex';
  app.classList.add('hidden-app');

  if (closeBtn) {
    closeBtn.classList.toggle('hidden-control', !manual);
    closeBtn.dataset.manual = manual ? '1' : '0';
  }

  resetTutorialToFirstPage();
}

function openGameDirectly() {
  const hub = document.getElementById('main-hub');
  if (hub) hub.style.display = 'none';

  const startBtn = document.getElementById('start-game-btn');
  if (startBtn) startBtn.click();
}

function setupTutorialFlow() {
  const playBtn = document.getElementById('hub-play');
  const tutorialBtn = ensureTutorialButton();
  const closeBtn = ensureCloseTutorialButton();
  const startBtn = document.getElementById('start-game-btn');

  if (!playBtn || !startBtn) return;

  const originalStart = startBtn.onclick;
  startBtn.onclick = (event) => {
    markTutorialSeen();
    if (typeof originalStart === 'function') {
      originalStart.call(startBtn, event);
    }
  };

  playBtn.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    if (!hasSeenTutorial()) {
      showTutorial(false);
    } else {
      openGameDirectly();
    }
  }, true);

  if (tutorialBtn) {
    tutorialBtn.addEventListener('click', (event) => {
      event.preventDefault();
      showTutorial(true);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (closeBtn.dataset.manual !== '1') return;
      const hub = document.getElementById('main-hub');
      const welcome = document.getElementById('welcome-screen');
      const app = document.getElementById('app-container');
      if (welcome) welcome.style.display = 'none';
      if (app) app.classList.add('hidden-app');
      if (hub) hub.style.display = 'flex';
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyTutorialTexts();
  setupTutorialFlow();
});
