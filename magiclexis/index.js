const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();
const db = admin.firestore();

const TZ = "America/Sao_Paulo";
const DAY_MS = 24 * 60 * 60 * 1000;

function dateKeySaoPaulo(date = new Date()) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(date);
}

function normalizeWord(raw = "") {
  return raw
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^A-Z]/g, "");
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function isBadWordDoc(doc) {
  if (!doc || typeof doc !== "object") return "documento invalido";
  if (!doc.word || typeof doc.word !== "string") return "campo word ausente/invalido";
  if (!Array.isArray(doc.hints)) return "campo hints ausente/invalido";
  if (typeof doc.active !== "boolean") return "campo active ausente/invalido";
  if (typeof doc.meaning !== "string") return "campo meaning ausente/invalido";
  return null;
}

async function getOrCreateDailyDocs(dateKey) {
  logger.info("getOrCreateDailyDocs:start", {dateKey});

  const publicRef = db.collection("daily_words").doc(dateKey);
  const privateRef = db.collection("daily_words_private").doc(dateKey);

  const [pubSnap, priSnap] = await Promise.all([publicRef.get(), privateRef.get()]);
  if (pubSnap.exists && priSnap.exists) {
    const publicData = pubSnap.data() || {};
    const privateData = priSnap.data() || {};
    logger.info("getOrCreateDailyDocs:cache_hit", {
      dateKey,
      wordLength: publicData.wordLength || null,
      hintsPublicCount: Array.isArray(publicData.hintsPublic) ? publicData.hintsPublic.length : null,
      hasPrivateWord: !!privateData.word,
      privateHintsCount: Array.isArray(privateData.hints) ? privateData.hints.length : null,
    });

    return {
      publicRef,
      privateRef,
      publicData,
      privateData,
    };
  }

  logger.info("getOrCreateDailyDocs:cache_miss", {dateKey});

  const poolQuery = db.collection("daily_word_pool").where("active", "==", true);
  const poolSnap = await poolQuery.get();

  logger.info("getOrCreateDailyDocs:pool_scan", {
    dateKey,
    poolExists: !poolSnap.empty,
    activeCount: poolSnap.size,
  });

  if (poolSnap.empty) {
    throw new HttpsError(
        "failed-precondition",
        "Colecao daily_word_pool sem documentos active=true. Execute/reexecute o seed."
    );
  }

  const mapped = poolSnap.docs.map((d) => ({id: d.id, ...d.data()}));
  const invalid = mapped.find((d) => isBadWordDoc(d));
  if (invalid) {
    const reason = isBadWordDoc(invalid);
    logger.error("getOrCreateDailyDocs:invalid_pool_doc", {
      id: invalid.id,
      reason,
      keys: Object.keys(invalid || {}),
    });
    throw new HttpsError(
        "failed-precondition",
        `Documento invalido em daily_word_pool (${invalid.id}): ${reason}`
    );
  }

  const sorted = mapped.sort((a, b) => String(a.word).localeCompare(String(b.word)));

  const hashNum = parseInt(sha256(dateKey).slice(0, 8), 16);
  const chosen = sorted[hashNum % sorted.length];

  logger.info("getOrCreateDailyDocs:chosen", {
    dateKey,
    chosenId: chosen.id,
    chosenWord: chosen.word,
    chosenMeaningLen: (chosen.meaning || "").length,
    chosenHintsCount: Array.isArray(chosen.hints) ? chosen.hints.length : null,
    chosenActive: chosen.active,
  });

  const normalized = normalizeWord(chosen.word);
  const hints = Array.isArray(chosen.hints) ? chosen.hints.slice(0, 5) : [];

  if (!normalized || normalized.length < 2) {
    throw new HttpsError(
        "failed-precondition",
        `Palavra escolhida invalida para o dia (${chosen.id}).`
    );
  }

  if (hints.length < 3) {
    throw new HttpsError(
        "failed-precondition",
        `Documento ${chosen.id} precisa ter ao menos 3 dicas.`
    );
  }

  const startsAt = admin.firestore.Timestamp.fromDate(new Date(`${dateKey}T00:00:00-03:00`));
  const endsAt = admin.firestore.Timestamp.fromMillis(startsAt.toMillis() + DAY_MS);

  const publicDoc = {
    dateKey,
    poolWordFingerprint: sha256(chosen.id).slice(0, 16),
    wordLength: normalized.length,
    hintsPublic: hints.slice(0, 3),
    startsAt,
    endsAt,
    timezone: TZ,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const privateDoc = {
    dateKey,
    word: normalized,
    meaning: chosen.meaning || "",
    hints,
    answerHash: sha256(normalized),
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.runTransaction(async (tx) => {
    const [p1, p2] = await Promise.all([tx.get(publicRef), tx.get(privateRef)]);
    if (!p1.exists) tx.set(publicRef, publicDoc);
    if (!p2.exists) tx.set(privateRef, privateDoc);
  });

  const [newPub, newPri] = await Promise.all([publicRef.get(), privateRef.get()]);
  const publicData = newPub.data() || {};
  const privateData = newPri.data() || {};

  logger.info("getOrCreateDailyDocs:created", {
    dateKey,
    wordLength: publicData.wordLength || null,
    hintsPublicCount: Array.isArray(publicData.hintsPublic) ? publicData.hintsPublic.length : null,
    hasPrivateWord: !!privateData.word,
    privateHintsCount: Array.isArray(privateData.hints) ? privateData.hints.length : null,
  });

  return {
    publicRef,
    privateRef,
    publicData,
    privateData,
  };
}

exports.rotateDailyWord = onSchedule(
    {
      schedule: "0 0 * * *",
      timeZone: TZ,
      region: "southamerica-east1",
    },
    async () => {
      const dateKey = dateKeySaoPaulo(new Date());
      const {publicData} = await getOrCreateDailyDocs(dateKey);
      logger.info("Palavra do Dia garantida", {
        dateKey,
        wordLength: publicData.wordLength,
      });
    },
);

exports.startDailyRun = onCall({region: "southamerica-east1"}, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "Faça login para iniciar.");
  }

  const uid = req.auth.uid;
  const dateKey = dateKeySaoPaulo(new Date());

  logger.info("startDailyRun:input", {
    uid,
    dateKey,
    hasAuth: !!req.auth,
  });

  try {
    const {publicRef, publicData} = await getOrCreateDailyDocs(dateKey);

    logger.info("startDailyRun:daily_docs_ready", {
      uid,
      dateKey,
      wordLength: publicData?.wordLength || null,
      hintsPublicCount: Array.isArray(publicData?.hintsPublic) ? publicData.hintsPublic.length : null,
    });

    const statusRef = db.doc(`users/${uid}/daily_status/${dateKey}`);
    const runRef = publicRef.collection("runs").doc(uid);

    const [statusSnap, runSnap] = await Promise.all([statusRef.get(), runRef.get()]);

    if (statusSnap.exists && statusSnap.data().completedAt) {
      logger.info("startDailyRun:blocked_completed", {uid, dateKey});
      return {
        blocked: true,
        dateKey,
        message: "Palavra do Dia já concluída hoje. Volte após meia-noite de São Paulo.",
      };
    }

    if (!runSnap.exists) {
      await runRef.set({
        uid,
        dateKey,
        attempts: 0,
        unlockedHints: 3,
        startedAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: null,
        elapsedMs: 0,
        isRecord: false,
      });
      logger.info("startDailyRun:run_created", {uid, dateKey});
    } else {
      logger.info("startDailyRun:run_exists", {uid, dateKey});
    }

    return {
      blocked: false,
      dateKey,
      wordLength: publicData.wordLength,
      hints: publicData.hintsPublic,
      unlockedHints: 3,
      timezone: TZ,
    };
  } catch (err) {
    if (err instanceof HttpsError) {
      logger.error("startDailyRun:https_error", {
        uid,
        dateKey,
        code: err.code,
        message: err.message,
      });
      throw err;
    }

    logger.error("startDailyRun:unexpected_error", {
      uid,
      dateKey,
      message: err?.message || String(err),
      stack: err?.stack || null,
    });

    throw new HttpsError(
        "internal",
        `startDailyRun falhou: ${err?.message || "erro desconhecido"}`
    );
  }
});

exports.unlockDailyHint = onCall({region: "southamerica-east1"}, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "Faça login para desbloquear dica.");
  }

  const uid = req.auth.uid;
  const dateKey = dateKeySaoPaulo(new Date());

  // TODO: validar prova real de anúncio (AdMob Rewarded SSV ou provedor equivalente).
  const adProof = req.data?.adProof;
  if (!adProof) {
    throw new HttpsError("failed-precondition", "adProof obrigatório.");
  }

  const runRef = db.doc(`daily_words/${dateKey}/runs/${uid}`);
  const runSnap = await runRef.get();
  if (!runSnap.exists) {
    throw new HttpsError("failed-precondition", "Inicie a Palavra do Dia antes.");
  }

  const run = runSnap.data();
  if (run.completedAt) {
    throw new HttpsError("failed-precondition", "Partida já concluída.");
  }

  const next = Math.min((run.unlockedHints || 3) + 1, 5);
  await runRef.update({
    unlockedHints: next,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const priSnap = await db.doc(`daily_words_private/${dateKey}`).get();
  if (!priSnap.exists) {
    throw new HttpsError("not-found", "Dados privados do dia ausentes.");
  }

  const allHints = priSnap.data().hints || [];
  return {
    unlockedHints: next,
    hints: allHints.slice(0, next),
  };
});

exports.submitDailyGuess = onCall({region: "southamerica-east1"}, async (req) => {
  if (!req.auth) {
    throw new HttpsError("unauthenticated", "Faça login para validar tentativa.");
  }

  const uid = req.auth.uid;
  const rawGuess = req.data?.guess;
  if (!rawGuess) {
    throw new HttpsError("invalid-argument", "guess obrigatório.");
  }

  const dateKey = dateKeySaoPaulo(new Date());
  const guess = normalizeWord(rawGuess);

  logger.info("submitDailyGuess:input", {
    uid,
    dateKey,
    rawGuessLen: String(rawGuess || "").length,
    guessLen: guess.length,
  });

  try {
    const runRef = db.doc(`daily_words/${dateKey}/runs/${uid}`);
    const statusRef = db.doc(`users/${uid}/daily_status/${dateKey}`);
    const boardRef = db.doc(`daily_leaderboard/${dateKey}`);
    const priRef = db.doc(`daily_words_private/${dateKey}`);

    const [runSnap, priSnap] = await Promise.all([runRef.get(), priRef.get()]);
    if (!runSnap.exists) {
      throw new HttpsError("failed-precondition", "Inicie a Palavra do Dia antes.");
    }
    if (!priSnap.exists) {
      throw new HttpsError("not-found", "Resposta diária indisponível.");
    }

    const run = runSnap.data() || {};
    if (run.completedAt) {
      return {alreadyCompleted: true};
    }

    const privateData = priSnap.data() || {};
    const target = normalizeWord(privateData.word || "");
    if (!target) {
      throw new HttpsError("failed-precondition", "Palavra diária inválida no documento privado.");
    }

    const now = Date.now();
    const startedAtMs = run.startedAt?.toMillis?.() || now;
    const attempts = (run.attempts || 0) + 1;
    const elapsedMs = Math.max(0, now - startedAtMs);
    const success = guess === target;

    logger.info("submitDailyGuess:before_tx", {
      uid,
      dateKey,
      attempts,
      elapsedMs,
      success,
      hasStartedAt: !!run.startedAt,
      targetLen: target.length,
    });

    let isRecord = false;

    await db.runTransaction(async (tx) => {
      if (success) {
        const boardSnap = await tx.get(boardRef);
        const bestMs = boardSnap.exists ? boardSnap.data().bestElapsedMs : null;
        isRecord = bestMs == null || elapsedMs < bestMs;
      }

      tx.update(runRef, {
        attempts,
        elapsedMs,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...(success ? {completedAt: admin.firestore.FieldValue.serverTimestamp()} : {}),
      });

      if (!success) return;

      if (isRecord) {
        tx.set(boardRef, {
          dateKey,
          bestElapsedMs: elapsedMs,
          bestUid: uid,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});
      }

      tx.set(statusRef, {
        dateKey,
        done: true,
        attempts,
        elapsedMs,
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        isRecord,
      }, {merge: true});
    });

    if (!success) {
      return {success: false, attempts, elapsedMs};
    }

    const meaning = privateData.meaning || "";
    return {
      success: true,
      attempts,
      elapsedMs,
      meaning,
      isRecord,
      share: {
        attempts,
        elapsedMs,
        isRecord,
        dateKey,
        text: `MagicLexis Palavra do Dia ${dateKey} | Tentativas: ${attempts} | Tempo: ${Math.round(elapsedMs / 1000)}s${isRecord ? " | Recorde!" : ""}`,
      },
    };
  } catch (err) {
    if (err instanceof HttpsError) {
      logger.error("submitDailyGuess:https_error", {
        uid,
        dateKey,
        code: err.code,
        message: err.message,
      });
      throw err;
    }

    logger.error("submitDailyGuess:unexpected_error", {
      uid,
      dateKey,
      message: err?.message || String(err),
      stack: err?.stack || null,
    });

    throw new HttpsError(
        "internal",
        `submitDailyGuess falhou: ${err?.message || "erro desconhecido"}`
    );
  }
});
