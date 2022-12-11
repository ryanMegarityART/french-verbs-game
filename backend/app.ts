import express from "express";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import { Prisma, PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from "./helpers/auth";
const { Translate } = require('@google-cloud/translate').v2;

interface Verb {
    id: string;
    verb: string;
    createdAt: Date;
    lastUpdatedAt: Date;
}

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// main endpoint for application to request a french verb and its translation
app.get("/verb", authenticateToken, async (req, res) => {
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

    let translations = [];
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

// endpoint to log an attempt
app.post("/attempt", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();

    console.log("attempt body: ", req.body)

    // get verb from db to use id as FK
    const verbRow = await prisma.verb.findFirst({ where: { verb: req.body.verb } });

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

// Register
app.post("/register", async (req, res) => {

    console.log("register body: ", req.body)

    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
        res.status(400).send("All input is required");
    }

    const prisma = new PrismaClient();

    // check if user already exist
    // Validate if user exist in our database
    const oldUserByUsername = await prisma.user.findUnique({ where: { username } });
    if (oldUserByUsername) {
        return res.status(409).send("User Already Exist. Please Login or choose a different username");
    }
    const oldUserByEmail = await prisma.user.findUnique({ where: { email } });
    if (oldUserByEmail) {
        return res.status(409).send("Email Already Exist. Please Login or choose a different email address");
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            username,
            email,
            password: encryptedPassword
        }
    })

    // Create token
    const token = jwt.sign(
        { user_id: user.id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );

    await prisma.$disconnect();

    // return new user
    res.status(201).json({ ...user, token });
});

// Login
app.post("/login", async (req, res) => {

    console.log("login body: ", req.body)

    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
        res.status(400).send("All input is required");
    }

    const prisma = new PrismaClient();

    // Validate if user exist in our database
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        await prisma.$disconnect();

        // user
        return res.status(200).json({ ...user, token });
    }
    res.status(400).send("Invalid Credentials");
});


app.listen(port, () => {
    console.log(`Application started and is running on port ${port}.`);
});
