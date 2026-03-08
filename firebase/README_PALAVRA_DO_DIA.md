# Palavra do Dia - Setup Firebase (MagicLexis)

## 1) Ativar plano Blaze
1. Abra o [Firebase Console](https://console.firebase.google.com/).
2. Selecione o projeto `magiclexis`.
3. Clique em **Upgrade** e mude para **Blaze (pay-as-you-go)**.
4. Cadastre um cartao valido (necessario para Cloud Functions agendadas).

## 2) Habilitar APIs (se solicitado)
No primeiro deploy, o CLI pode pedir para ativar:
- Cloud Build API
- Cloud Functions API
- Cloud Scheduler API
- Artifact Registry API

Aceite todas.

## 3) Instalar Firebase CLI e autenticar
```bash
npm i -g firebase-tools
firebase login
firebase use magiclexis
```

## 4) Publicar regras e indices do Firestore
Na raiz do projeto (`C:\Users\gabri\OneDrive\Documentos\meu site`):
```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## 5) Instalar dependencias das Functions
```bash
cd firebase/functions
npm install
cd ../..
```

## 6) Deploy das Cloud Functions
```bash
firebase deploy --only functions
```

Functions criadas:
- `rotateDailyWord` (cron 00:00 America/Sao_Paulo)
- `startDailyRun`
- `unlockDailyHint`
- `submitDailyGuess`

## 7) Criar credencial de servico para o seed
1. Firebase Console -> Project Settings -> Service Accounts.
2. Clique em **Generate new private key**.
3. Salve o JSON localmente (nao commitar no git).

No terminal (PowerShell):
```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS='C:\caminho\serviceAccount.json'
```

## 8) Rodar seed das 365 palavras
Instale `firebase-admin` na raiz (se nao tiver):
```bash
npm i firebase-admin
```

Rode:
```bash
node firebase/seed/seed-daily-pool.js
```

Isso popula `daily_word_pool` com 365 entradas.

## 9) Teste rapido
1. Chame `startDailyRun` no app.
2. Confira se retorna 3 dicas e `wordLength`.
3. Tente `unlockDailyHint` com `adProof` fake no ambiente de teste.
4. Tente `submitDailyGuess` com palavra errada e correta.
5. Verifique no Firestore:
   - `daily_words/{dateKey}` (publico)
   - `daily_words_private/{dateKey}` (segredo)
   - `daily_words/{dateKey}/runs/{uid}`
   - `users/{uid}/daily_status/{dateKey}`

## 10) Seguranca da resposta (anti-leak)
- **Nunca** guardar palavra/resposta em `daily_words` publico.
- Palavra e significado ficam apenas em `daily_words_private`.
- Cliente so recebe significado apos `submitDailyGuess` com sucesso.
- Se quiser endurecer mais, substitua `word` por hash + validacao derivada no servidor.

## 11) Producao (recomendado)
- Configurar App Check no front.
- Validar `adProof` real (SSV do AdMob) em `unlockDailyHint`.
- Aplicar monitoramento de erro em Functions.
