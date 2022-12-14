
import { Translate } from '@google-cloud/translate/build/src/v2';
import { PrismaClient, Verb } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';

export const verb = express.Router();

// main endpoint for application to request a french verb and its translation
verb.get("/", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();

    // Query random verb from table
    const randomVerb: Verb[] = await prisma.$queryRawUnsafe(
        // DO NOT pass in or accept user input here
        `SELECT * FROM Verb ORDER BY RAND() LIMIT 1;`,
    )
    console.log("random verb: ", randomVerb);

    // Creates a google translate api client
    const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY, projectId: "french-verb-game" });

    const text = randomVerb[0].verb;
    const target = 'en-uk';

    let translations;
    try {
        [translations] = await translate.translate(text, target);
    } catch (e) {
        console.log("error translating via API : ", e)
    }
    const translation = Array.isArray(translations) ? translations[0] : translations;
    console.log(`${text} => (${target}) ${translation}`);
    await prisma.$disconnect();
    res.send({
        verb: randomVerb[0].verb,
        verbId: randomVerb[0].id,
        translation: translation,
    });
});
