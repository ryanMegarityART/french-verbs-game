import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';

export const attempt = express.Router();

// endpoint to log an attempt
attempt.post("/", authenticateToken, async (req, res) => {

    console.log("attempt body: ", req.body)
    const prisma = new PrismaClient();

    // get verb from db to use id as FK
    const verbRow = await prisma.verb.findFirst({ where: { verb: req.body.verb } });

    if (!verbRow) {
        return res.status(500).json({ error: "Verb not found" })
    }

    try {
        // write attempt to db
        await prisma.answer.create({
            data: {
                verb: {
                    connect: { id: verbRow.id }
                },
                correct: !!req.body.correct,
                user: {
                    connect: {
                        username: req.body.username
                    }
                }
            }
        })
    }
    catch (e) {
        console.log("Error creating answer in db: ", e)
    }

    await prisma.$disconnect();

    res.send();
})