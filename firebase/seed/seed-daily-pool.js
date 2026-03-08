/*
Uso:
  1) npm i firebase-admin
  2) set GOOGLE_APPLICATION_CREDENTIALS=C:\caminho\serviceAccount.json
  3) node firebase/seed/seed-daily-pool.js
*/

const admin = require('firebase-admin');
const { buildDailyPool365 } = require('./word-bank');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

async function seed() {
  const entries = buildDailyPool365();
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
