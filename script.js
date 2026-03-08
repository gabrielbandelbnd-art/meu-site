/* --- DADOS (LOTE 1 - 120 PALAVRAS) --- */
const allChallenges = [
    // --- 3 LETRAS ---
    { word: "SOL", hints: ["Astro rei.", "Aquece o dia.", "Estrela.", "Luz natural.", "Calor."], meaning: "Estrela central do sistema solar." },
    { word: "LUA", hints: ["SatÃƒÂ©lite.", "Noite.", "Fases.", "MarÃƒÂ©s.", "Branca."], meaning: "SatÃƒÂ©lite natural da Terra." },
    { word: "MAR", hints: ["Oceano.", "Sal.", "Ondas.", "Azul.", "Praia."], meaning: "Grande massa de ÃƒÂ¡gua salgada." },
    { word: "CEU", hints: ["Azul.", "Nuvens.", "Alto.", "Infinito.", "ParaÃƒÂ­so."], meaning: "EspaÃƒÂ§o acima da Terra." },
    { word: "PAZ", hints: ["Calma.", "Branco.", "TrÃƒÂ©gua.", "Sossego.", "Harmonia."], meaning: "Estado de tranquilidade." },
    { word: "SOM", hints: ["Ouvir.", "MÃƒÂºsica.", "RuÃƒÂ­do.", "VibraÃƒÂ§ÃƒÂ£o.", "Volume."], meaning: "SensaÃƒÂ§ÃƒÂ£o auditiva." },
    { word: "COR", hints: ["Tinta.", "Arco-ÃƒÂ­ris.", "Visual.", "Pintura.", "Luz."], meaning: "ImpressÃƒÂ£o visual da luz." },
    { word: "RIO", hints: ["ÃƒÂgua doce.", "Correnteza.", "Peixes.", "Fluxo.", "Leito."], meaning: "Curso de ÃƒÂ¡gua natural." },
    { word: "VOZ", hints: ["Falar.", "Cantar.", "Garganta.", "Som humano.", "Grito."], meaning: "Som produzido pelas cordas vocais." },
    { word: "LUZ", hints: ["Claridade.", "LÃƒÂ¢mpada.", "Velocidade.", "Sol.", "Dia."], meaning: "RadiaÃƒÂ§ÃƒÂ£o visÃƒÂ­vel." },
    { word: "SAL", hints: ["Tempero.", "Branco.", "Mar.", "Cozinha.", "SÃƒÂ³dio."], meaning: "SubstÃƒÂ¢ncia usada para temperar." },
    { word: "MAE", hints: ["Geradora.", "Amor.", "FamÃƒÂ­lia.", "Origem.", "Cuidado."], meaning: "Genitora." },
    { word: "PAI", hints: ["Protetor.", "FamÃƒÂ­lia.", "Masculino.", "Origem.", "HerÃƒÂ³i."], meaning: "Genitor." },
    { word: "GOL", hints: ["Futebol.", "Rede.", "Ponto.", "Chute.", "Torcida."], meaning: "Ponto no futebol." },
    { word: "FIM", hints: ["TÃƒÂ©rmino.", "Acabou.", "ConclusÃƒÂ£o.", "Final.", "Desfecho."], meaning: "Onde algo termina." },

    // --- 4 LETRAS ---
    { word: "AMOR", hints: ["CoraÃƒÂ§ÃƒÂ£o.", "Afeto.", "PaixÃƒÂ£o.", "Sentimento.", "UniÃƒÂ£o."], meaning: "Forte afeiÃƒÂ§ÃƒÂ£o por outra pessoa." },
    { word: "VIDA", hints: ["Viver.", "ExistÃƒÂªncia.", "Nascer.", "Biologia.", "Sopro."], meaning: "Estado de atividade funcional." },
    { word: "GATO", hints: ["Felino.", "Miau.", "Bigode.", "Animal.", "DomÃƒÂ©stico."], meaning: "Pequeno mamÃƒÂ­fero carnÃƒÂ­voro." },
    { word: "CASA", hints: ["Moradia.", "Teto.", "Lar.", "ConstruÃƒÂ§ÃƒÂ£o.", "Abrigo."], meaning: "EdifÃƒÂ­cio para habitar." },
    { word: "BOLA", hints: ["Esfera.", "Jogo.", "Redonda.", "Futebol.", "Brinquedo."], meaning: "Objeto esfÃƒÂ©rico usado em jogos." },
    { word: "ANEL", hints: ["Dedo.", "Joia.", "Ouro.", "CÃƒÂ­rculo.", "Compromisso."], meaning: "Aro ornamental usado no dedo." },
    { word: "TREM", hints: ["Trilho.", "VagÃƒÂ£o.", "Locomotiva.", "Viagem.", "Apito."], meaning: "Comboio ferroviÃƒÂ¡rio." },
    { word: "FLOR", hints: ["Jardim.", "PÃƒÂ©tala.", "Cheiro.", "Planta.", "Primavera."], meaning: "Ãƒâ€œrgÃƒÂ£o reprodutor das plantas." },
    { word: "MESA", hints: ["MÃƒÂ³vel.", "Jantar.", "Apoio.", "Quatro pernas.", "Madeira."], meaning: "MÃƒÂ³vel com tampo plano." },
    { word: "FOGO", hints: ["Quente.", "Queima.", "Chama.", "IncÃƒÂªndio.", "Luz."], meaning: "CombustÃƒÂ£o visÃƒÂ­vel." },
    { word: "AGUA", hints: ["LÃƒÂ­quido.", "Beber.", "Vida.", "Rio.", "Chuva."], meaning: "LÃƒÂ­quido essencial ÃƒÂ  vida." },
    { word: "MEDO", hints: ["Susto.", "Pavor.", "Escuro.", "Terror.", "EmoÃƒÂ§ÃƒÂ£o."], meaning: "SensaÃƒÂ§ÃƒÂ£o de perigo." },
    { word: "RISO", hints: ["Alegria.", "Boca.", "Piada.", "EngraÃƒÂ§ado.", "Som."], meaning: "Ato de rir." },
    { word: "CAFE", hints: ["Bebida.", "Preto.", "ManhÃƒÂ£.", "Acordar.", "CafeÃƒÂ­na."], meaning: "Bebida estimulante." },
    { word: "LIXO", hints: ["Descarte.", "Sujeira.", "Reciclar.", "Cesto.", "Resto."], meaning: "ResÃƒÂ­duos descartados." },

    // --- 5 LETRAS ---
    { word: "LIVRO", hints: ["Leitura.", "PÃƒÂ¡ginas.", "Biblioteca.", "HistÃƒÂ³ria.", "Capa."], meaning: "Conjunto de folhas escritas." },
    { word: "PORTA", hints: ["Entrada.", "Abrir.", "Madeira.", "MaÃƒÂ§aneta.", "SaÃƒÂ­da."], meaning: "Abertura em parede para passagem." },
    { word: "NAVIO", hints: ["Mar.", "Transporte.", "Barco grande.", "Oceano.", "Cruzeiro."], meaning: "Grande embarcaÃƒÂ§ÃƒÂ£o." },
    { word: "PEIXE", hints: ["ÃƒÂgua.", "Nadar.", "Escamas.", "Rio.", "Mar."], meaning: "Animal vertebrado aquÃƒÂ¡tico." },
    { word: "CARTA", hints: ["Correio.", "Papel.", "Envelope.", "Escrever.", "Mensagem."], meaning: "Mensagem escrita enviada a alguÃƒÂ©m." },
    { word: "PLUMA", hints: ["Leve.", "Pena.", "Ave.", "Macio.", "Travesseiro."], meaning: "Pena de ave." },
    { word: "NOITE", hints: ["Escuro.", "Lua.", "Estrelas.", "Dormir.", "Fim do dia."], meaning: "PerÃƒÂ­odo sem luz solar." },
    { word: "CHUVA", hints: ["ÃƒÂgua.", "Nuvens.", "Molhado.", "Temporal.", "Gotas."], meaning: "PrecipitaÃƒÂ§ÃƒÂ£o atmosfÃƒÂ©rica." },
    { word: "PRAIA", hints: ["Areia.", "Mar.", "Sol.", "VerÃƒÂ£o.", "Ondas."], meaning: "Borda de terra ÃƒÂ  beira-mar." },
    { word: "SONHO", hints: ["Dormir.", "ImaginaÃƒÂ§ÃƒÂ£o.", "Desejo.", "Pesadelo.", "Noite."], meaning: "Imagens vistas enquanto se dorme." },
    { word: "RISCO", hints: ["Perigo.", "TraÃƒÂ§o.", "Aventura.", "Medo.", "Rabisco."], meaning: "Possibilidade de perigo." },
    { word: "MUNDO", hints: ["Terra.", "Globo.", "Planeta.", "Universo.", "Pessoas."], meaning: "O planeta Terra." },
    { word: "TEMPO", hints: ["RelÃƒÂ³gio.", "Horas.", "Clima.", "Passado.", "Futuro."], meaning: "DuraÃƒÂ§ÃƒÂ£o dos fatos." },
    { word: "IDEIA", hints: ["Pensamento.", "Mente.", "Criatividade.", "Luz.", "Plano."], meaning: "RepresentaÃƒÂ§ÃƒÂ£o mental." },
    { word: "FESTA", hints: ["ComemoraÃƒÂ§ÃƒÂ£o.", "Bolo.", "MÃƒÂºsica.", "Amigos.", "DanÃƒÂ§a."], meaning: "ReuniÃƒÂ£o para celebrar." },

    // --- 6 LETRAS ---
    { word: "ESCOLA", hints: ["Estudar.", "Alunos.", "Professor.", "Aulas.", "Saber."], meaning: "Estabelecimento de ensino." },
    { word: "JARDIM", hints: ["Flores.", "Verde.", "Grama.", "Plantas.", "Natureza."], meaning: "Terreno cultivado com plantas." },
    { word: "VIAGEM", hints: ["Turismo.", "Malas.", "FÃƒÂ©rias.", "AviÃƒÂ£o.", "Estrada."], meaning: "Ato de deslocar-se a outro lugar." },
    { word: "MUSICA", hints: ["Som.", "Melodia.", "Ritmo.", "Instrumento.", "CanÃƒÂ§ÃƒÂ£o."], meaning: "Arte de combinar sons." },
    { word: "AMIGOS", hints: ["Parceria.", "Companhia.", "Lealdade.", "Festa.", "Grupo."], meaning: "Pessoas com quem se tem afeto." },
    { word: "CIDADE", hints: ["PrÃƒÂ©dios.", "Ruas.", "Urbano.", "PopulaÃƒÂ§ÃƒÂ£o.", "Prefeito."], meaning: "Aglomerado urbano." },
    { word: "COMIDA", hints: ["Fome.", "AlmoÃƒÂ§o.", "Jantar.", "Sabor.", "NutriÃƒÂ§ÃƒÂ£o."], meaning: "O que se come." },
    { word: "BRASIL", hints: ["PaÃƒÂ­s.", "Verde e amarelo.", "Samba.", "Futebol.", "Sul-americano."], meaning: "Maior paÃƒÂ­s da AmÃƒÂ©rica do Sul." },
    { word: "JOGADA", hints: ["Esporte.", "Movimento.", "EstratÃƒÂ©gia.", "Lance.", "Partida."], meaning: "Ato de jogar." },
    { word: "QUARTO", hints: ["Dormir.", "Cama.", "CÃƒÂ´modo.", "Casa.", "Descanso."], meaning: "Aposento para dormir." },
    { word: "ABRACO", hints: ["Carinho.", "BraÃƒÂ§os.", "Aperto.", "Afeto.", "Cumprimento."], meaning: "EnlaÃƒÂ§amento com os braÃƒÂ§os." },
    { word: "FUTURO", hints: ["AmanhÃƒÂ£.", "Destino.", "Tempo.", "Vir a ser.", "Adiante."], meaning: "Tempo que hÃƒÂ¡ de vir." },
    { word: "POESIA", hints: ["Rima.", "Versos.", "Arte.", "Escrita.", "Amor."], meaning: "Arte de compor versos." },
    { word: "BOSQUE", hints: ["ÃƒÂrvores.", "Floresta.", "Natureza.", "Verde.", "Passeio."], meaning: "Pequena floresta." },
    { word: "TROVAO", hints: ["Barulho.", "Tempestade.", "Raio.", "CÃƒÂ©u.", "Estrondo."], meaning: "RuÃƒÂ­do provocado pelo raio." },

    // --- 7 LETRAS ---
    { word: "GUITARRA", hints: ["MÃƒÂºsica.", "Cordas.", "Rock.", "Solo.", "ElÃƒÂ©trica."], meaning: "Instrumento musical de cordas." },
    { word: "VAMPIRO", hints: ["Sangue.", "Dentes.", "Noite.", "Morcego.", "DrÃƒÂ¡cula."], meaning: "Criatura mitolÃƒÂ³gica que bebe sangue." },
    { word: "ESTRELA", hints: ["CÃƒÂ©u.", "Brilho.", "Noite.", "EspaÃƒÂ§o.", "Pontas."], meaning: "Corpo celeste luminoso." },
    { word: "FAMILIA", hints: ["Parentes.", "Casa.", "Sangue.", "UniÃƒÂ£o.", "Genealogia."], meaning: "Grupo de pessoas com laÃƒÂ§os sanguÃƒÂ­neos." },
    { word: "PERFUME", hints: ["Cheiro.", "Frasco.", "Aroma.", "EssÃƒÂªncia.", "Flor."], meaning: "LÃƒÂ­quido aromÃƒÂ¡tico." },
    { word: "FUTEBOL", hints: ["Esporte.", "Gol.", "Bola.", "Campo.", "Time."], meaning: "Esporte jogado com os pÃƒÂ©s." },
    { word: "CORAGEM", hints: ["Bravura.", "Medo.", "HerÃƒÂ³i.", "Enfrentar.", "Valente."], meaning: "Moral forte perante o perigo." },
    { word: "DESTINO", hints: ["Futuro.", "Sorte.", "Caminho.", "Fado.", "Final."], meaning: "O que estÃƒÂ¡ determinado a acontecer." },
    { word: "OCEANOS", hints: ["ÃƒÂgua.", "Azul.", "Terra.", "Mar.", "Profundo."], meaning: "Grandes massas de ÃƒÂ¡gua salgada." },
    { word: "FLORESTA", hints: ["ÃƒÂrvores.", "Selva.", "Verde.", "Animais.", "Mata."], meaning: "Grande extensÃƒÂ£o de ÃƒÂ¡rvores." },
    { word: "ESPELHO", hints: ["Reflexo.", "Vidro.", "Imagem.", "Olhar.", "Vaidade."], meaning: "SuperfÃƒÂ­cie que reflete a imagem." },
    { word: "RAPOSAS", hints: ["Animal.", "Esperta.", "Laranja.", "Cauda.", "Mato."], meaning: "MamÃƒÂ­fero carnÃƒÂ­voro." },
    { word: "PLANETA", hints: ["Terra.", "EspaÃƒÂ§o.", "Orbita.", "Mundo.", "Sol."], meaning: "Corpo celeste que orbita uma estrela." },
    { word: "ABELHAS", hints: ["Mel.", "Inseto.", "Colmeia.", "FerrÃƒÂ£o.", "Rainha."], meaning: "Inseto produtor de mel." },
    { word: "CORRIDA", hints: ["Velocidade.", "Esporte.", "Pressa.", "PÃƒÂ©s.", "Chegada."], meaning: "Ato de correr." },

    // --- 8 LETRAS ---
    { word: "CACHORRO", hints: ["Latir.", "Animal.", "Amigo.", "Osso.", "DomÃƒÂ©stico."], meaning: "Melhor amigo do homem." },
    { word: "ELEFANTE", hints: ["Grande.", "Tromba.", "ÃƒÂfrica.", "Pesado.", "Cinza."], meaning: "Maior animal terrestre." },
    { word: "DINHEIRO", hints: ["Pagar.", "Moeda.", "Banco.", "Compra.", "Riqueza."], meaning: "Meio de troca de valores." },
    { word: "PRESENTE", hints: ["AniversÃƒÂ¡rio.", "Dar.", "Caixa.", "Agora.", "Natal."], meaning: "Objeto oferecido a alguÃƒÂ©m." },
    { word: "HISTORIA", hints: ["Passado.", "Livro.", "Tempo.", "Fatos.", "Contar."], meaning: "Narrativa de eventos passados." },
    { word: "NATUREZA", hints: ["Verde.", "Matas.", "Animais.", "Terra.", "Vida."], meaning: "Mundo fÃƒÂ­sico e seus fenÃƒÂ´menos." },
    { word: "LIBERDADE", hints: ["Livre.", "Voo.", "PrisÃƒÂ£o (oposto).", "Direito.", "Escolha."], meaning: "Poder de agir segundo a prÃƒÂ³pria vontade." },
    { word: "TRABALHO", hints: ["Emprego.", "SalÃƒÂ¡rio.", "OfÃƒÂ­cio.", "EsforÃƒÂ§o.", "ProfissÃƒÂ£o."], meaning: "Atividade produtiva." },
    { word: "UNIVERSO", hints: ["EspaÃƒÂ§o.", "Tudo.", "GalÃƒÂ¡xias.", "Infinito.", "Estrelas."], meaning: "Conjunto de tudo o que existe." },
    { word: "SAUDADES", hints: ["Falta.", "LembranÃƒÂ§a.", "DistÃƒÂ¢ncia.", "Sentimento.", "Nostalgia."], meaning: "Sentimento de falta de alguÃƒÂ©m." },

    // --- 9 LETRAS ---
    { word: "ESPERANCA", hints: ["FÃƒÂ©.", "Futuro.", "Acreditar.", "Verde.", "Sonho."], meaning: "Sentimento de quem vÃƒÂª como possÃƒÂ­vel o que deseja." },
    { word: "FELICIDADE", hints: ["Alegria.", "Sorriso.", "Bem-estar.", "Contente.", "EmoÃƒÂ§ÃƒÂ£o."], meaning: "Estado de quem ÃƒÂ© feliz." },
    { word: "BORBOLETA", hints: ["Inseto.", "Voar.", "Colorida.", "Casulo.", "TransformaÃƒÂ§ÃƒÂ£o."], meaning: "Inseto de asas coloridas." },
    { word: "GEOGRAFIA", hints: ["Mapas.", "Terra.", "PaÃƒÂ­ses.", "Estudo.", "Relevo."], meaning: "CiÃƒÂªncia que estuda a superfÃƒÂ­cie terrestre." },
    { word: "AVENTURA", hints: ["Risco.", "Viagem.", "AÃƒÂ§ÃƒÂ£o.", "Explorar.", "Adrenalina."], meaning: "ExperiÃƒÂªncia arriscada ou emocionante." },
    { word: "CHOCOLATE", hints: ["Doce.", "Cacau.", "Marrom.", "PÃƒÂ¡scoa.", "Comer."], meaning: "Alimento feito de cacau." },
    { word: "PRINCESA", hints: ["Reino.", "Coroa.", "Conto de fadas.", "Castelo.", "Filha do rei."], meaning: "Filha de rei ou rainha." },
    { word: "TECNOLOGIA", hints: ["Computador.", "Futuro.", "InovaÃƒÂ§ÃƒÂ£o.", "Digital.", "MÃƒÂ¡quinas."], meaning: "AplicaÃƒÂ§ÃƒÂ£o de conhecimento cientÃƒÂ­fico." },
    { word: "LITERATURA", hints: ["Livros.", "Escrita.", "Autores.", "Poesia.", "Texto."], meaning: "Arte de escrever." },
    { word: "PROFESSOR", hints: ["Ensino.", "Escola.", "Mestre.", "Aula.", "Aprender."], meaning: "Aquele que ensina." },

    // --- 10 LETRAS ---
    { word: "COMPUTADOR", hints: ["MÃƒÂ¡quina.", "Internet.", "Teclado.", "Tela.", "PC."], meaning: "MÃƒÂ¡quina eletrÃƒÂ´nica de processamento de dados." },
    { word: "RINOCERONTE", hints: ["Animal.", "Chifre.", "Pesado.", "ÃƒÂfrica.", "Forte."], meaning: "Grande mamÃƒÂ­fero com chifre no nariz." },
    { word: "MATEMATICA", hints: ["NÃƒÂºmeros.", "Contas.", "Soma.", "Escola.", "LÃƒÂ³gica."], meaning: "CiÃƒÂªncia dos nÃƒÂºmeros e formas." },
    { word: "ANIVERSARIO", hints: ["Festa.", "Bolo.", "Idade.", "ParabÃƒÂ©ns.", "Data."], meaning: "Dia em que se completa anos." },
    { word: "ASTRONAUTA", hints: ["EspaÃƒÂ§o.", "Lua.", "Foguete.", "Nasa.", "Capacete."], meaning: "Viajante espacial." },
    { word: "BRINCADEIRA", hints: ["DiversÃƒÂ£o.", "CrianÃƒÂ§a.", "Jogo.", "Rir.", "Passatempo."], meaning: "Ato de brincar." },
    { word: "INTELIGENTE", hints: ["Esperto.", "CÃƒÂ©rebro.", "Saber.", "GÃƒÂªnio.", "RaciocÃƒÂ­nio."], meaning: "Que tem inteligÃƒÂªncia." },
    { word: "RESILIENCIA", hints: ["ForÃƒÂ§a.", "Superar.", "Adaptar.", "Voltar.", "Persistir."], meaning: "Capacidade de se recuperar de dificuldades." },
    { word: "SENTIMENTO", hints: ["EmoÃƒÂ§ÃƒÂ£o.", "CoraÃƒÂ§ÃƒÂ£o.", "Amor.", "Ãƒâ€œdio.", "Sentir."], meaning: "Ato ou efeito de sentir." },
    { word: "CATASTROFE", hints: ["Desastre.", "Caos.", "DestruiÃƒÂ§ÃƒÂ£o.", "Ruim.", "Acidente."], meaning: "Grande desgraÃƒÂ§a ou infortÃƒÂºnio." },

    // --- 11 a 13 LETRAS ---
    { word: "CURIOSIDADE", hints: ["Saber.", "Pergunta.", "Descobrir.", "Interesse.", "Xereta."], meaning: "Vontade de ver ou aprender algo." },
    { word: "ELETRICIDADE", hints: ["Luz.", "Choque.", "Tomada.", "Energia.", "Fios."], meaning: "Forma de energia." },
    { word: "UNIVERSIDADE", hints: ["Faculdade.", "Estudo.", "Diploma.", "Campus.", "Superior."], meaning: "InstituiÃƒÂ§ÃƒÂ£o de ensino superior." },
    { word: "COMUNICACAO", hints: ["Falar.", "Mensagem.", "Troca.", "Conversa.", "MÃƒÂ­dia."], meaning: "Ato de transmitir informaÃƒÂ§ÃƒÂ£o." },
    { word: "REFRIGERANTE", hints: ["Bebida.", "GÃƒÂ¡s.", "Doce.", "Gelado.", "Soda."], meaning: "Bebida nÃƒÂ£o alcoÃƒÂ³lica gaseificada." },
    { word: "SOLIDARIEDADE", hints: ["Ajuda.", "Apoio.", "Bondade.", "PrÃƒÂ³ximo.", "UniÃƒÂ£o."], meaning: "CooperaÃƒÂ§ÃƒÂ£o mÃƒÂºtua entre pessoas." },
    { word: "TRANSFORMACAO", hints: ["MudanÃƒÂ§a.", "Virar.", "EvoluÃƒÂ§ÃƒÂ£o.", "Metamorfose.", "Diferente."], meaning: "Ato de transformar." },
    { word: "INDEPENDENCIA", hints: ["Livre.", "PaÃƒÂ­s.", "Autonomia.", "Sozinho.", "7 de setembro."], meaning: "Estado de quem nÃƒÂ£o depende de outro." },
    { word: "ARQUITETURA", hints: ["PrÃƒÂ©dios.", "Projeto.", "Desenho.", "ConstruÃƒÂ§ÃƒÂ£o.", "Arte."], meaning: "Arte de projetar e edificar." },
    { word: "CONHECIMENTO", hints: ["Saber.", "Estudo.", "Mente.", "Aprender.", "Sabedoria."], meaning: "Ato de conhecer ou saber." },

    // --- 14 a 20 LETRAS (DIFÃƒÂCIL) ---
    { word: "PARALELEPIPEDO", hints: ["Rua.", "Pedra.", "CalÃƒÂ§ada.", "Bloco.", "Geometria."], meaning: "SÃƒÂ³lido geomÃƒÂ©trico ou pedra de calÃƒÂ§amento." },
    { word: "DESENVOLVIMENTO", hints: ["Crescer.", "Progresso.", "AvanÃƒÂ§o.", "Melhora.", "Evoluir."], meaning: "Ato de desenvolver-se." },
    { word: "RESPONSABILIDADE", hints: ["Dever.", "Adulto.", "Cuidar.", "Culpa.", "SÃƒÂ©rio."], meaning: "ObrigaÃƒÂ§ÃƒÂ£o de responder pelas prÃƒÂ³prias aÃƒÂ§ÃƒÂµes." },
    { word: "SUSTENTABILIDADE", hints: ["Natureza.", "Futuro.", "Reciclar.", "Verde.", "Planeta."], meaning: "Uso consciente dos recursos naturais." },
    { word: "INCONSTITUCIONAL", hints: ["Lei.", "Proibido.", "Contra.", "Regra.", "JurÃƒÂ­dico."], meaning: "Que ÃƒÂ© contra a constituiÃƒÂ§ÃƒÂ£o." },
    { word: "OTORRINOLARINGOLOGISTA", hints: ["MÃƒÂ©dico.", "Garganta.", "Nariz.", "Ouvido.", "Nome comprido."], meaning: "MÃƒÂ©dico especialista em ouvido, nariz e garganta." },
    { word: "INDEPENDENTEMENTE", hints: ["Sem depender.", "Apesar.", "Livre.", "Sozinho.", "AdvÃƒÂ©rbio."], meaning: "De modo independente." },
    { word: "REVOLUCIONARIO", hints: ["MudanÃƒÂ§a.", "Guerra.", "Novo.", "LÃƒÂ­der.", "Transformar."], meaning: "Que causa revoluÃƒÂ§ÃƒÂ£o." },
    { word: "EXTRAORDINARIO", hints: ["IncrÃƒÂ­vel.", "Fora do comum.", "Especial.", "Raro.", "Ãƒâ€œtimo."], meaning: "Que nÃƒÂ£o ÃƒÂ© ordinÃƒÂ¡rio ou comum." },
    { word: "INTERNACIONALIZACAO", hints: ["Mundo.", "Global.", "PaÃƒÂ­ses.", "Exterior.", "Expandir."], meaning: "Tornar algo internacional." }
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
const dailyStatusBar = document.getElementById('daily-status-bar');
const dailyModeLabel = document.getElementById('daily-mode-label');
const dailyTimerEl = document.getElementById('daily-timer');
const dailyAttemptsEl = document.getElementById('daily-attempts');
const dailyResultModal = document.getElementById('daily-result-modal');
const dailyResultTime = document.getElementById('daily-result-time');
const dailyResultAttempts = document.getElementById('daily-result-attempts');
const dailyResultRecord = document.getElementById('daily-result-record');
const dailyResultMeaning = document.getElementById('daily-result-meaning');

let currentWord = [];
let replaceIndex = 0;
let isFirstRound = true; 
let targetChallenge = null;
let hintIndex = 0;
let hintInterval = null;
let maxWordLength = 0;
let currentGameMode = 'normal';
let dailySession = null;
let dailyTimerInterval = null;
let functionsApi = null;
let lastDailyShareText = '';

// --- VARIÃƒÂVEIS DA GALINHA E MENSAGENS ---
let consecutiveErrors = 0;
let chickenAlreadySummoned = false; // Trava para a galinha voar sÃƒÂ³ 1 vez
let feedbackTimeout = null; // Trava para a mensagem durar exatos 6 segundos

const funnyPhrases = [
    "Que isso, cara? TÃƒÂ¡ tentando inventar uma palavra nova pro dicionÃƒÂ¡rio?",
    "Essa aÃƒÂ­ nem o Google teve coragem de reconhecer.",
    "TÃƒÂ¡ difÃƒÂ­cil ou vocÃƒÂª tÃƒÂ¡ de gracinha validando tudo errado?",
    "Quer algo mais fÃƒÂ¡cil? Vai jogar modo trÃƒÂªs letras, campeÃƒÂ£o.",
    "VocÃƒÂª digitou com o cotovelo agora, nÃƒÂ©?",
    "Calma, respiraÃ¢â‚¬Â¦ nÃƒÂ£o ÃƒÂ© um teclado musical.",
    "Essa palavra existe sÃƒÂ³ na sua imaginaÃƒÂ§ÃƒÂ£o fÃƒÂ©rtil.",
    "Eu atÃƒÂ© tentei defender vocÃƒÂª, mas nÃƒÂ£o deu.",
    "Se errar mais uma, vou pedir reforÃƒÂ§o pro professor de portuguÃƒÂªs.",
    "TÃƒÂ¡ treinando pra campeonato mundial de erro?",
    "Essa passou longeÃ¢â‚¬Â¦ tipo, outro CEP.",
    "AmigoÃ¢â‚¬Â¦ isso foi estratÃƒÂ©gia ou desespero?",
    "Eu acredito em vocÃƒÂªÃ¢â‚¬Â¦ mas essa aÃƒÂ­ me quebrou.",
    "Se criatividade valesse ponto, vocÃƒÂª tava ganhando.",
    "Palavra inÃƒÂ©dita detectada. Quer patentear?",
    "VocÃƒÂª tÃƒÂ¡ jogando ou testando minha paciÃƒÂªncia?",
    "Errar ÃƒÂ© humanoÃ¢â‚¬Â¦ mas vocÃƒÂª tÃƒÂ¡ se dedicando demais.",
    "Quase! SÃƒÂ³ errou todas as letras.",
    "Vou fingir que nÃƒÂ£o vi essa e te dar outra chance.",
    "TÃƒÂ¡ me estressandoÃ¢â‚¬Â¦ mas de um jeito carismÃƒÂ¡tico. Continua tentando",
    "VocÃƒÂª tÃƒÂ¡ jogando ou digitando senha errada do WiFi?",
    "Essa palavra foi criada agora, nÃƒÂ©? Registro em cartÃƒÂ³rio jÃƒÂ¡.",
    "Calma, nÃƒÂ£o precisa inventar idioma novo.",
    "Eu pedi uma palavra, nÃƒÂ£o um enigma.",
    "TÃƒÂ¡ tentando me confundir ou se confundir?",
    "Se errar desse jeito fosse esporte, vocÃƒÂª tava nas OlimpÃƒÂ­adas.",
    "Isso aÃƒÂ­ foi ousadiaÃ¢â‚¬Â¦ mas nÃƒÂ£o foi acerto.",
    "Quase acertou! SÃƒÂ³ faltou acertar.",
    "VocÃƒÂª piscou e digitou?",
    "Essa palavra mora em NÃƒÂ¡rnia.",
    "Digitou com pressa ou com raiva?",
    "Eu acredito no seu potencialÃ¢â‚¬Â¦ mas nÃƒÂ£o nessa palavra.",
    "TÃƒÂ¡ testando minha paciÃƒÂªncia nÃƒÂ­vel hard?",
    "Respira, jovem gafanhoto.",
    "Essa foi tÃƒÂ£o errada que eu atÃƒÂ© ri.",
    "VocÃƒÂª desbloqueou o modo criativo sem querer.",
    "Palavra alternativa detectada. Pena que nÃƒÂ£o existe.",
    "TÃƒÂ¡ querendo trollar o sistema?",
    "Se fosse prova, eu chamava seus pais.",
    "Essa aÃƒÂ­ passou voandoÃ¢â‚¬Â¦ longe do certo.",
    "Foi estratÃƒÂ©gia secreta ou sÃƒÂ³ caos mesmo?",
    "VocÃƒÂª tÃƒÂ¡ aquecendo os dedos antes de acertar, nÃƒÂ©?",
    "Essa palavra tÃƒÂ¡ pedindo socorro.",
    "Eu nÃƒÂ£o esperava issoÃ¢â‚¬Â¦ e olha que eu jÃƒÂ¡ vi muita coisa.",
    "Tentativa vÃƒÂ¡lidaÃ¢â‚¬Â¦ sÃƒÂ³ nÃƒÂ£o foi vÃƒÂ¡lida mesmo.",
    "VocÃƒÂª estÃƒÂ¡ oficialmente improvisando.",
    "Calma, nÃƒÂ£o ÃƒÂ© teste de criatividade.",
    "Se insistir assim, eu comeÃƒÂ§o a cobrar taxa de erro.",
    "Palavra misteriosaÃ¢â‚¬Â¦ atÃƒÂ© demais.",
    "VocÃƒÂª tem talentoÃ¢â‚¬Â¦ pra errar com confianÃƒÂ§a.",
    "Isso foi ousado. Errado, mas ousado.",
    "A intenÃƒÂ§ÃƒÂ£o foi boaÃ¢â‚¬Â¦ eu acho.",
    "TÃƒÂ¡ jogando no modo aleatÃƒÂ³rio?",
    "Essa palavra veio de qual dimensÃƒÂ£o?",
    "VocÃƒÂª tÃƒÂ¡ tentando desbloquear um final secreto?",
    "Se errar fosse XP, vocÃƒÂª jÃƒÂ¡ tava nÃƒÂ­vel mÃƒÂ¡ximo.",
    "Palavra quase invisÃƒÂ­velÃ¢â‚¬Â¦ porque nÃƒÂ£o existe.",
    "Eu vi o que vocÃƒÂª fez aÃƒÂ­. NÃƒÂ£o recomendo.",
    "TÃƒÂ¡ me desafiando ou se desafiando?",
    "Essa foi criativa. InÃƒÂºtilÃ¢â‚¬Â¦ mas criativa.",
    "VocÃƒÂª digitou e pensou depois, nÃƒÂ©?",
    "Quer um dicionÃƒÂ¡rio de presente?",
    "TÃƒÂ¡ fazendo speedrun de erro?",
    "Essa aÃƒÂ­ nem a professora corrigia.",
    "VocÃƒÂª consegueÃ¢â‚¬Â¦ sÃƒÂ³ nÃƒÂ£o assim.",
    "Palavra inÃƒÂ©dita versÃƒÂ£o beta.",
    "Foi tentativa ou experimento cientÃƒÂ­fico?",
    "TÃƒÂ¡ achando que eu nÃƒÂ£o sei ler?",
    "Eu sinto que vocÃƒÂª consegue melhorÃ¢â‚¬Â¦ bem melhor.",
    "Continua tentando. Uma hora a gente acertaÃ¢â‚¬Â¦ eu espero."
];
// --- NOVA VARIÃƒÂVEL: SACOLA DE FRASES ---
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

/* NOVO: PREENCHE O SELETOR COM OPÃƒâ€¡Ãƒâ€¢ES DISPONÃƒÂVEIS */
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
    currentGameMode = 'normal';
    resetDailySessionUi();
    clearAllHighlights();
    animateMage('reset');
    
    // FILTRAGEM PELA ESCOLHA DO USUÃƒÂRIO
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
    if (feedbackTimeout) clearTimeout(feedbackTimeout); // Limpa relÃƒÂ³gio antigo
    
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

// LÃƒâ€œGICA DO BOTÃƒÆ’O PULAR DICA
const skipHintBtn = document.getElementById('skip-hint-btn');
if (skipHintBtn) {
    skipHintBtn.addEventListener('click', () => {
        if (!targetChallenge) return;
        // AvanÃƒÂ§a o ÃƒÂ­ndice da dica manualmente
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
    
    // Descobre qual ÃƒÂ© a letra espelhada baseada na posiÃƒÂ§ÃƒÂ£o (A=0 vira Z=25)
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
        msgDiv.innerHTML = 'Digite uma letra no campo abaixo onde tem uma interrogaÃƒÂ§ÃƒÂ£o para comeÃƒÂ§ar';
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

// --- LÃƒâ€œGICA DO BOTÃƒÆ’O LIMPAR TABULEIRO --- //
const clearBoardBtn = document.getElementById('clear-board-btn');
let clearConfirmState = false;

if (clearBoardBtn) {
    clearBoardBtn.addEventListener('click', () => {
        if (!clearConfirmState) {
            // Primeiro clique - Pede confirmaÃƒÂ§ÃƒÂ£o
            clearBoardBtn.innerText = "CERTEZA?";
            clearBoardBtn.style.background = "var(--error)";
            clearBoardBtn.style.color = "#fff";
            clearConfirmState = true;

            // Reseta o botÃƒÂ£o apÃƒÂ³s 3 segundos se nÃƒÂ£o clicar novamente
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
        // --- NOVO: LIMPA O TABULEIRO QUANDO VOLTA PRO INÃƒÂCIO --- //
        playSoundEffect('overwrite');
        
        // Resetamos o array e o ÃƒÂ­ndice para comeÃƒÂ§ar uma palavra nova "limpa"
        currentWord = [];
        replaceIndex = 0;
        
        // Processa a letra que o usuÃƒÂ¡rio acabou de digitar na nova posiÃƒÂ§ÃƒÂ£o 0
        processNewChar(char, 0);

        showFloatingMessage("Ciclo Reiniciado! Tabuleiro limpo.", 2500);

    } else {
        playSoundEffect('type');
        processNewChar(char, currentWord.length);
        
        // AVISO NA PENÃƒÅ¡LTIMA LETRA (N-1)
        if (currentWord.length === maxWordLength - 1) {
            showFloatingMessage("PrÃƒÂ³xima letra ÃƒÂ© a ÃƒÂºltima! O ciclo vai reiniciar.", 2500);
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

    // REGRA 3: SanduÃƒÂ­che
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

function formatElapsed(ms = 0) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const sec = (totalSec % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
}

function stopDailyTimer() {
    if (dailyTimerInterval) {
        clearInterval(dailyTimerInterval);
        dailyTimerInterval = null;
    }
}

function resetDailySessionUi() {
    stopDailyTimer();
    dailySession = null;
    if (dailyStatusBar) dailyStatusBar.classList.add('hidden-control');
    if (dailyTimerEl) dailyTimerEl.innerText = 'Tempo: 00:00';
    if (dailyAttemptsEl) dailyAttemptsEl.innerText = 'Tentativas: 0';
}

function startDailyTimer(startMs = Date.now()) {
    stopDailyTimer();
    const tick = () => {
        if (!dailyTimerEl) return;
        const elapsed = Date.now() - startMs;
        dailyTimerEl.innerText = `Tempo: ${formatElapsed(elapsed)}`;
    };
    tick();
    dailyTimerInterval = setInterval(tick, 1000);
}

function showDailyResult(data) {
    if (dailyResultTime) dailyResultTime.innerText = `Tempo: ${formatElapsed(data.elapsedMs || 0)}`;
    if (dailyResultAttempts) dailyResultAttempts.innerText = `Tentativas: ${data.attempts || 0}`;
    if (dailyResultMeaning) dailyResultMeaning.innerText = `Significado: ${data.meaning || '--'}`;
    if (dailyResultRecord) dailyResultRecord.classList.toggle('hidden-control', !data.isRecord);
    if (dailyResultModal) dailyResultModal.classList.remove('hidden-control');
    lastDailyShareText = data?.share?.text || '';
}

async function shareDailyResult() {
    if (!lastDailyShareText) return;
    try {
        if (navigator.share) {
            await navigator.share({ text: lastDailyShareText });
            return;
        }
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(lastDailyShareText);
            feedback.innerText = 'Resultado copiado para compartilhar!';
            feedback.style.color = 'var(--success)';
        }
    } catch (err) {
        console.log('Falha ao compartilhar resultado diário:', err);
    }
}

async function startDailyWordMode() {
    if (!functionsApi) {
        feedback.innerText = 'Functions indisponivel. Recarregue a pagina.';
        feedback.style.color = 'var(--error)';
        return;
    }

    try {
        const callStart = functionsApi.httpsCallable('startDailyRun');
        const result = await callStart({});
        const data = result?.data || {};

        if (data.blocked) {
            feedback.innerText = data.message || 'Palavra do Dia ja concluida hoje.';
            feedback.style.color = 'var(--warning)';
            return;
        }

        currentGameMode = 'daily';
        clearAllHighlights();
        animateMage('reset');
        stopHintCycle();

        hub.classList.add('hidden-control');
        welcomeScreen.style.display = 'none';
        document.getElementById('app-container')?.classList.remove('hidden-app');

        targetChallenge = {
            word: '',
            hints: Array.isArray(data.hints) ? data.hints : ['Sem dica disponivel.'],
            meaning: ''
        };

        maxWordLength = data.wordLength || 3;
        currentWord = [];
        replaceIndex = 0;
        isFirstRound = true;
        hintIndex = 0;
        consecutiveErrors = 0;
        chickenAlreadySummoned = false;

        if (dailyStatusBar) dailyStatusBar.classList.remove('hidden-control');
        if (dailyModeLabel) dailyModeLabel.innerText = `Palavra do Dia (${data.dateKey || ''})`;

        const startMs = Date.now();
        dailySession = {
            dateKey: data.dateKey,
            startedAtMs: startMs,
            attempts: 0
        };

        if (dailyAttemptsEl) dailyAttemptsEl.innerText = 'Tentativas: 0';
        startDailyTimer(startMs);

        updateHintDisplay();
        feedback.innerText = 'Modo Palavra do Dia iniciado!';
        feedback.style.color = 'var(--accent)';
        meaningBox.classList.add('hidden');
        meaningBox.innerText = '';
        charInput.placeholder = '?';
        render(true);

        if (audioCtx.state === 'suspended') audioCtx.resume();
        syncTopUserUi(activeUser, activeUserDoc);
    } catch (err) {
        feedback.innerText = `Erro ao iniciar Palavra do Dia: ${err.message || err}`;
        feedback.style.color = 'var(--error)';
    }
}

async function validateDailyAttempt(word) {
    if (!functionsApi || !dailySession) return;

    try {
        const callSubmit = functionsApi.httpsCallable('submitDailyGuess');
        const result = await callSubmit({ guess: word });
        const data = result?.data || {};

        if (data.alreadyCompleted) {
            feedback.innerText = 'Voce ja concluiu a Palavra do Dia de hoje.';
            feedback.style.color = 'var(--warning)';
            return;
        }

        if (!data.success) {
            dailySession.attempts = data.attempts || (dailySession.attempts + 1);
            if (dailyAttemptsEl) dailyAttemptsEl.innerText = `Tentativas: ${dailySession.attempts}`;
            feedback.innerText = 'Ainda nao foi dessa vez. Continue tentando!';
            feedback.style.color = 'var(--error)';
            animateMage('sad');
            showMobileErrorMagePopup();
            return;
        }

        dailySession.attempts = data.attempts || dailySession.attempts;
        if (dailyAttemptsEl) dailyAttemptsEl.innerText = `Tentativas: ${dailySession.attempts}`;
        stopDailyTimer();

        feedback.innerText = 'Palavra do Dia concluida!';
        feedback.style.color = 'var(--success)';
        meaningBox.innerText = data.meaning || '';
        meaningBox.classList.remove('hidden');

        successSound.play();
        playSoundEffect('victory');
        triggerConfetti();
        animateMage('win');
        showMobileVictoryPopup();

        showDailyResult(data);
    } catch (err) {
        feedback.innerText = `Erro ao validar Palavra do Dia: ${err.message || err}`;
        feedback.style.color = 'var(--error)';
    }
}

async function validate() {
    const word = currentWord.join('').toUpperCase();
    if (word.length < 2) return;
    
    feedback.innerText = "Verificando...";

    if (currentGameMode === 'daily') {
        await validateDailyAttempt(word);
        return;
    }

    if (targetChallenge && word === targetChallenge.word) {
        feedback.innerText = "Ã°Å¸Ââ€  ACERTOU!"; feedback.style.color = "var(--success)";
        meaningBox.innerText = targetChallenge.meaning;
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
        const res = await fetch(`https://api.dicionario-aberto.net/word/${word.toLowerCase()}`);
        const data = await res.json();
        
        if (data.length > 0) {
            feedback.innerText = "Ã¢Å¡Â Ã¯Â¸Â Palavra existe, mas nÃƒÂ£o ÃƒÂ© a do desafio."; 
            feedback.style.color = "var(--warning)";
            animateMage('reset');
            showMobileErrorMagePopup();
            consecutiveErrors = 0; // Zera o contador se chutar uma palavra real
        } else {
            // ---- LÃƒâ€œGICA DA GALINHA REVISADA ----
            consecutiveErrors++;
            showMobileErrorMagePopup();
            
            // Se a sacola esvaziar, enche ela de novo com as 70 frases!
            if (unusedPhrases.length === 0) {
                unusedPhrases = [...funnyPhrases];
            }
            
            // Sorteia uma frase das que sobraram e tira ela da sacola (splice)
            const randomPhraseIndex = Math.floor(Math.random() * unusedPhrases.length);
            const randomPhrase = unusedPhrases.splice(randomPhraseIndex, 1)[0];
            
            // Exibe a mensagem original + a frase engraÃƒÂ§ada menorzinha embaixo
            feedback.innerHTML = `Ã¢ÂÅ’ Tente novamente<br><span style="font-size: 0.9rem; font-weight: normal; color: var(--text-dim);">${randomPhrase}</span>`; 
            feedback.style.color = "var(--error)";
            
            document.body.classList.add('error-flash'); 
            setTimeout(() => document.body.classList.remove('error-flash'), 500); // Remove o piscar vermelho
            
            // Invoca a galinha apenas se for o 3Ã‚Âº erro E se ela ainda nÃƒÂ£o tiver aparecido neste desafio
            if (consecutiveErrors >= 3 && chickenAlreadySummoned === false) {
                chickenAlreadySummoned = true; // Marca que ela jÃƒÂ¡ apareceu neste desafio
                
                // Toca o SEU som de galinha local
                const chickenAudio = new Audio('galinha.mp3');
                chickenAudio.volume = 1.0; 
                chickenAudio.play().catch(e => console.log("Erro no ÃƒÂ¡udio:", e));    
                
                const chickenEl = document.createElement('div');
                chickenEl.innerText = 'Ã°Å¸Ââ€'; // A galinha!
                chickenEl.className = 'flying-chicken';
                document.body.appendChild(chickenEl);
                
                // Remove a galinha do HTML depois de 3 segundos
                setTimeout(() => chickenEl.remove(), 3000);
                
            } else {
                playSoundEffect('error');
                animateMage('sad');
            }
            // ---- FIM DA LÃƒâ€œGICA ----
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

// BOTÃƒÆ’O LIMPAR HISTÃƒâ€œRICO - RESTAURADO A LÃƒâ€œGICA ORIGINAL
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
            toggleBtn.innerText = "Ã¢â€“Â¶";
        } else {
            toggleBtn.innerText = "Ã¢â€”â‚¬";
        }
    };
}


const isMobileViewport = () => window.matchMedia('(max-width: 800px)').matches;

document.body.onclick = (e) => { 
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (isMobileViewport()) return; // Evita abrir teclado a cada toque fora do input no celular
    // Ajuste para nÃƒÂ£o roubar foco se clicar no sidebar mobile
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

/* --- ÃƒÂUDIO --- */
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

/* --- UTILITÃƒÂRIOS --- */
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

    if (sidebarContent && notepadEl) {
        sidebarContent.appendChild(notepadEl);
        notepadEl.classList.add('mobile-notepad-in-sidebar');
    }

    if (sidebarContent && historySection) {
        sidebarContent.appendChild(historySection);
    }

    if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden-control');
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

function showMobileErrorMagePopup() {
    if (!isMobileViewport() || !mobileErrorModal) return;
    mobileErrorModal.classList.remove('hidden-control');
    setTimeout(() => {
        mobileErrorModal.classList.add('hidden-control');
    }, 1000);
}

/* --- INICIALIZAÃƒâ€¡ÃƒÆ’O --- */
document.addEventListener("DOMContentLoaded", () => {
    // Detecta mobile (apenas para logs ou classes extras se precisar)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 800;
    if (isMobile) {
        document.body.classList.add('mobile-mode');
    }
    
    // NOVO: Preenche as opÃƒÂ§ÃƒÂµes de dificuldade
    populateLengthOptions();
    setupMobileLayout();

    startMageIdle();
    // initChallenge ÃƒÂ© chamado apenas quando clica em START agora
});

// LÃƒâ€œGICA DO BOTÃƒÆ’O DE BOAS-VINDAS
document.getElementById('start-game-btn').onclick = () => {
    // Some com o modal
    document.getElementById('welcome-screen').style.display = 'none';
    // Mostra o jogo
    document.getElementById('app-container').classList.remove('hidden-app');
    
    // Inicia o jogo agora com a dificuldade selecionada
    initChallenge();

    if (audioCtx.state === 'suspended') audioCtx.resume();
    syncTopUserUi(activeUser, activeUserDoc);
};
/* ================= HUB CONTROLE ================= */

const hub = document.getElementById("main-hub");
const hubPlay = document.getElementById("hub-play");
const hubDailyWordBtn = document.getElementById("hub-daily-word");
const welcomeScreen = document.getElementById("welcome-screen");

hubPlay.addEventListener("click", () => {
    currentGameMode = "normal";
    resetDailySessionUi();
    hub.style.display = "none";
    welcomeScreen.style.display = "flex";
    syncTopUserUi(activeUser, activeUserDoc);
});

hubDailyWordBtn?.addEventListener("click", startDailyWordMode);

// BotÃƒÂµes futuros
document.getElementById("hub-profile").addEventListener("click", () => {
    openProfileModal();
});

document.getElementById("hub-tournaments").addEventListener("click", () => {
    alert("Torneios em breve Ã°Å¸Ââ€ ");
});

document.getElementById("hub-ranking").addEventListener("click", () => {
    openRankingModal();
});
/* --- LÃƒâ€œGICA DO SELETOR DE MODO DE JOGO --- */
document.addEventListener("DOMContentLoaded", () => {
    const modeSelector = document.getElementById('mode-selector');
    const modeWarning = document.getElementById('mode-warning');

    if (modeSelector) {
        modeSelector.addEventListener('change', (e) => {
            const selectedMode = e.target.value;

            // Se o modo escolhido NÃƒÆ’O for 'solo'
            if (selectedMode !== 'solo') {
                // Toca som de erro (se o contexto de ÃƒÂ¡udio estiver ativo)
                if (typeof playSoundEffect === 'function') {
                    playSoundEffect('error');
                    // Tenta animar o mago para 'triste' se ele estiver visÃƒÂ­vel
                    if (typeof animateMage === 'function') animateMage('sad');
                }

                // Mostra a mensagem de aviso
                modeWarning.style.display = 'block';
                modeWarning.classList.add('popIn'); // Reusa sua animaÃƒÂ§ÃƒÂ£o de popIn

                // Reseta o seletor para "Solo" automaticamente
                e.target.value = 'solo';

                // Esconde a mensagem apÃƒÂ³s 3 segundos
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

let auth = null;
let db = null;
let storage = null;
let activeUser = null;
let activeUserDoc = null;

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
let gateAuthMode = 'login';

function setStatus(msg = '', isError = false) {
    if (!profileStatus) return;
    profileStatus.innerText = msg;
    profileStatus.style.color = isError ? 'var(--error)' : 'var(--warning)';
}

function showControl(el, show) {
    if (!el) return;
    el.classList.toggle('hidden-control', !show);
}

function setGateStatus(msg = '', isError = false) {
    if (!gateStatus) return;
    gateStatus.innerText = msg;
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
    const userRef = db.collection('users').doc(user.uid);
    const snap = await userRef.get();

    if (!snap.exists) {
        const baseName = user.displayName || (user.email ? user.email.split('@')[0] : 'Jogador');
        await userRef.set({
            uid: user.uid,
            name: baseName,
            photo: user.photoURL || DEFAULT_AVATAR,
            points: 0
        });
    }

    const fresh = await userRef.get();
    return fresh.data();
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
        const higher = await db.collection('users').where('points', '>', points).get();
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
        setStatus('FaÃƒÂ§a login para acessar o perfil.', true);
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
        setStatus('Conta visitante: joga normal, mas nÃƒÂ£o salva pontos nem ranking.');
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
    const storageRef = storage.ref().child(`profile_photos/${uid}/${Date.now()}_${file.name}`);
    await storageRef.put(file);
    return await storageRef.getDownloadURL();
}

async function saveProfile() {
    if (!activeUser || !db || activeUser.isAnonymous) {
        setStatus('Visitante nÃƒÂ£o salva perfil.', true);
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

        await activeUser.updateProfile({ displayName: newName, photoURL });
        await db.collection('users').doc(activeUser.uid).set({
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
        setGateStatus('Firebase Auth nÃ£o inicializado. Recarregue a pÃ¡gina.', true);
        return;
    }
    try {
        await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        setStatus('Login Google realizado.');
        setGateStatus('Login Google realizado.');
    } catch (err) {
        setStatus('Falha no login Google: ' + (err.message || err), true);
        setGateStatus('Falha no login Google: ' + (err.message || err), true);
    }
}


async function authAnonymously() {
    if (!auth) {
        setGateStatus('Firebase Auth nÃ£o inicializado. Recarregue a pÃ¡gina.', true);
        return;
    }
    try {
        await auth.signInAnonymously();
        setStatus('Entrou como visitante.');
        setGateStatus('Entrou como visitante.');
    } catch (err) {
        setStatus('Erro no modo visitante: ' + (err.message || err), true);
        setGateStatus('Erro no modo visitante: ' + (err.message || err), true);
    }
}

async function authWithEmail(isRegister, emailFieldId = 'email-input', passwordFieldId = 'password-input') {
    if (!auth) {
        setGateStatus('Firebase Auth nÃ£o inicializado. Recarregue a pÃ¡gina.', true);
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
            setStatus('As senhas nÃ£o coincidem.', true);
            setGateStatus('As senhas nÃ£o coincidem.', true);
            return;
        }
    }

    try {
        if (isRegister) {
            await auth.createUserWithEmailAndPassword(email, password);
            setStatus('Conta criada com sucesso.');
            setGateStatus('Conta criada com sucesso.');
            setGateAuthMode('login');
        } else {
            await auth.signInWithEmailAndPassword(email, password);
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
        await auth.signOut();
        setStatus('SessÃƒÂ£o encerrada.');
        setGateStatus('FaÃƒÂ§a login para continuar.');
    } catch (err) {
        setStatus('Erro ao sair: ' + (err.message || err), true);
        setGateStatus('Erro ao sair: ' + (err.message || err), true);
    }
}

async function handleCorrectAnswer() {
    if (!activeUser || !db || activeUser.isAnonymous) return;

    try {
        const ref = db.collection('users').doc(activeUser.uid);
        await ref.set({
            uid: activeUser.uid,
            name: activeUserDoc?.name || activeUser.displayName || 'Jogador',
            photo: activeUserDoc?.photo || activeUser.photoURL || DEFAULT_AVATAR,
            points: firebase.firestore.FieldValue.increment(1)
        }, { merge: true });

        const fresh = await ref.get();
        activeUserDoc = fresh.data();
        if (profilePoints) profilePoints.innerText = `Pontos: ${activeUserDoc.points || 0}`;
    } catch (err) {
        console.log('Erro ao somar pontos:', err);
    }
}

async function loadRanking() {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return;

    if (!db) {
        rankingList.innerHTML = '<div class="ranking-item">Firebase indisponÃƒÂ­vel.</div>';
        return;
    }

    rankingList.innerHTML = '<div class="ranking-item">Carregando ranking...</div>';

    try {
        const snap = await db.collection('users').orderBy('points', 'desc').limit(50).get();

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
    document.getElementById('close-daily-result')?.addEventListener('click', () => showControl(dailyResultModal, false));
    document.getElementById('daily-share-btn')?.addEventListener('click', shareDailyResult);
    document.getElementById('daily-back-hub-btn')?.addEventListener('click', () => {
        showControl(dailyResultModal, false);
        document.getElementById('app-container')?.classList.add('hidden-app');
        showHubScreen(true);
        resetDailySessionUi();
    });

    document.getElementById('user-menu-trigger')?.addEventListener('click', () => {
        showControl(userMenuDropdown, userMenuDropdown.classList.contains('hidden-control'));
    });

    window.addEventListener('click', (e) => {
        if (!userMenu?.contains(e.target)) showControl(userMenuDropdown, false);
        if (e.target === profileModal) closeProfileModal();
        if (e.target === rankingModal) closeRankingModal();
    });
}

function initFirebase() {
    if (!window.firebase) {
        setGateStatus('Firebase nÃ£o carregou. Verifique internet/CDN e recarregue (Ctrl+F5).', true);
        return;
    }

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    functionsApi = firebase.app().functions("southamerica-east1");

    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            activeUser = null;
            activeUserDoc = null;
            showAuthGate(true);
            showHubScreen(false);
            welcomeScreen.style.display = 'none';
            document.getElementById('app-container')?.classList.add('hidden-app');
            syncTopUserUi(null, null);
            return;
        }

        activeUser = user;
        try {
            activeUserDoc = await ensureUserDoc(user);
        } catch (e) {
            activeUserDoc = null;
            console.log('Falha ao carregar doc do usuÃƒÂ¡rio:', e);
        }

        showAuthGate(false);
        showHubScreen(true);
        welcomeScreen.style.display = 'none';
        document.getElementById('app-container')?.classList.add('hidden-app');

        syncTopUserUi(user, activeUserDoc);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    bindAuthUiEvents();
    setGateAuthMode('login');
    initFirebase();
    updateAuthProviderLabels();
    observeLanguageChanges();
});









