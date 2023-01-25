
import { Translate } from '@google-cloud/translate/build/src/v2';
import { PrismaClient, Verb } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';

export const conjugate = express.Router();

interface ConjugationsJSON {
    "j'": string;
    "tu": string;
    "il / elle / on": string;
    "nous": string;
    "vous": string;
    "ils / elles": string;
}

conjugate.get("/", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();

    // Query random verb from table
    const randomVerb = await prisma.$queryRawUnsafe(
        // DO NOT pass in or accept user input here
        `SELECT 
             v.verb AS infinitive
            ,t.tense AS tense
            ,c.conjugations AS conjugations
         FROM Conjugation c
         INNER JOIN 
            Verb v
            ON v.id = c.verbId 
        INNER JOIN 
            Tense t
            ON t.id = c.tenseId
         ORDER BY RAND() LIMIT 1;`,
    )
    console.log("random verb: ", randomVerb);

    await prisma.$disconnect();
    res.send({
        randomVerb
    });
});

conjugate.get("/add-options", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();

    const allVerbs = await prisma.verb.findMany();
    const allTenses = await prisma.tense.findMany();

    await prisma.$disconnect();
    res.send({
        verbs: allVerbs,
        tenses: allTenses
    });
})

conjugate.post("/add", authenticateToken, async (req, res) => {
    console.log("attempt body: ", req.body)
    const prisma = new PrismaClient();

    // get verb from db to use id as FK
    const verbRow = await prisma.verb.findFirst({ where: { id: req.body.verbId } });

    if (!verbRow) {
        await prisma.$disconnect();
        return res.status(500).json({ error: "Verb not found" })
    }

    // get tense from db to use id as FK
    const tenseRow = await prisma.tense.findFirst({ where: { id: req.body.tenseId } });

    if (!tenseRow) {
        await prisma.$disconnect();
        return res.status(500).json({ error: "Verb not found" })
    }

    // check conjugations object
    const conjugationsToInsert = <ConjugationsJSON>req.body.conjugations

    try {
        // write attempt to db
        await prisma.conjugation.create({
            data: {
                verb: {
                    connect: { id: verbRow.id }
                },
                tense: {
                    connect: { id: tenseRow.id }
                },
                conjugations: {
                    ...conjugationsToInsert
                }
            }
        })
    }
    catch (e) {
        console.log("Error creating conjugation in db: ", e)
        await prisma.$disconnect();
        res.status(500).json({ error: "Error creating conjugation in db, does it already exist?" })
    }

    await prisma.$disconnect();
    res.status(201).send()
})
