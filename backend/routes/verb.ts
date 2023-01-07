
import { Translate } from '@google-cloud/translate/build/src/v2';
import { PrismaClient, Verb } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';

export const verb = express.Router();

// main endpoint for application to request a french verb and its translation
verb.get("/", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();

    // Creates a google translate api client
    const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY, projectId: "french-verb-game" });
    
    // minimum translate confidence of 90%
    // the API often returns the detection as English and duplicates the word
    let confidence = 0
    let randomVerb: Verb[] = [];
    let translation;
    while (confidence < 0.9) {
        // Query random verb from table
        randomVerb = await prisma.$queryRawUnsafe(
            // DO NOT pass in or accept user input here
            `SELECT * FROM Verb ORDER BY RAND() LIMIT 1;`,
        )
        console.log("random verb: ", randomVerb);

        const text = randomVerb[0].verb;
        const target = 'en';

        let translations;
        let detections;
        try {
            [translations] = await translate.translate(text, target);
            [detections] = await translate.detect(text);
        } catch (e) {
            console.log("error translating via API : ", e)
        }
        console.log(`Detections: ${JSON.stringify(detections)}`);
        console.log(`Detection: ${detections?.language}, confidence: ${detections?.confidence}`);

        confidence = detections?.confidence || 0;

        translation = Array.isArray(translations) ? translations[0] : translations;
        console.log(`${text} => (${target}) ${translation}`);

        // avoid words which are either equivalent or where the translate API may have failed
        if (translation === text) {
            confidence = 0;
        }  
    }


    await prisma.$disconnect();
    res.send({
        verb: randomVerb[0].verb,
        verbId: randomVerb[0].id,
        translation,
    });
});
