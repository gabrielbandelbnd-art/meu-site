/*
Uso:
  1) npm i firebase-admin
  2) set GOOGLE_APPLICATION_CREDENTIALS=C:\caminho\serviceAccount.json
  3) node firebase/seed/build-daily-pool-json.js
  4) node firebase/seed/seed-daily-pool.js
*/

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();
const BANK_PATH = path.join(__dirname, 'daily-word-pool-365.json');

function loadDailyPool() {
  if (!fs.existsSync(BANK_PATH)) {
    throw new Error(`Arquivo não encontrado: ${BANK_PATH}. Rode antes: node firebase/seed/build-daily-pool-json.js`);
  }

  const raw = fs.readFileSync(BANK_PATH, 'utf8');
  const entries = JSON.parse(raw);

  if (!Array.isArray(entries) || entries.length < 200) {
    throw new Error(`Banco inválido. Esperado 365 itens, recebido: ${Array.isArray(entries) ? entries.length : 'não-array'}`);
  }

  const unique = new Set(entries.map((e) => e.word));
  if (unique.size < 200) {
    throw new Error(`Banco inválido. Existem palavras repetidas (únicas: ${unique.size}).`);
  }

  for (const item of entries) {
    if (!item || typeof item !== 'object') throw new Error('Item inválido no JSON.');
    if (!/^[A-Z]+$/.test(item.word || '')) throw new Error(`Word inválida: ${item.word}`);
    if (!Array.isArray(item.hints) || item.hints.length !== 5) throw new Error(`Hints inválidas para: ${item.word}`);
  }

  return entries;
}

async function seed() {
  const entries = loadDailyPool();
  console.log(`Iniciando seed de ${entries.length} palavras...`);

  const poolRef = db.collection('daily_word_pool');

  // Opcional: descomente se quiser reset completo antes de semear.
  // const old = await poolRef.get();
  // const delBatch = db.batch();
  // old.docs.forEach((d) => delBatch.delete(d.ref));
  // await delBatch.commit();

  let batch = db.batch();
  let opCount = 0;

  for (const entry of entries) {
    const id = entry.word;
    batch.set(poolRef.doc(id), {
      ...entry,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    opCount++;
    if (opCount === 400) {
      await batch.commit();
      batch = db.batch();
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log('Seed finalizado com sucesso.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
