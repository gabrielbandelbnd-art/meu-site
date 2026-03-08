# Palavra do Dia - Setup Firebase (MagicLexis)

## Estrutura usada neste projeto
- Functions codebase: `magiclexis/`
- Regras Firestore: `firebase/firestore.rules`
- Indexes Firestore: `firebase/firestore.indexes.json`
- Seed: `firebase/seed/`

## 1) Confirmar plano Blaze
1. Abra o Firebase Console e selecione `magiclexis`.
2. Verifique se o projeto está em **Blaze**.

## 2) Login e seleção de projeto
```bash
firebase login
firebase use magiclexis
```

## 3) Publicar regras e índices
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 4) Instalar dependências das Functions
```bash
cd magiclexis
npm install
cd ..
```

## 5) Deploy das Functions
```bash
firebase deploy --only functions
```

Functions publicadas:
- `rotateDailyWord` (00:00 America/Sao_Paulo)
- `startDailyRun`
- `unlockDailyHint`
- `submitDailyGuess`

## 6) Rodar seed das 365 palavras
### 6.1 Gerar chave de serviço
- Firebase Console -> Project settings -> Service accounts -> Generate new private key.

### 6.2 Exportar credencial no terminal (PowerShell)
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\caminho\serviceAccount.json'
```

### 6.3 Rodar seed
Na raiz do projeto:
```bash
node firebase/seed/seed-daily-pool.js
```

## 7) Teste rápido
1. Chame `startDailyRun` autenticado.
2. Chame `submitDailyGuess` com tentativa errada.
3. Chame com tentativa correta e valide `meaning` + `isRecord`.
4. Confirme no Firestore:
   - `daily_words/{dateKey}` (sem resposta)
   - `daily_words_private/{dateKey}` (com resposta)
   - `daily_words/{dateKey}/runs/{uid}`
   - `users/{uid}/daily_status/{dateKey}`

## Segurança (resposta não exposta)
- A palavra correta NÃO fica em coleção pública.
- Cliente só lê `daily_words/{dateKey}` com metadados e 3 dicas.
- Palavra e significado ficam em `daily_words_private/{dateKey}`.
- `meaning` só retorna após acerto em `submitDailyGuess`.
