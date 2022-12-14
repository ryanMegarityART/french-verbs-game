import express from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateToken } from "./helpers/auth";
const { Translate } = require('@google-cloud/translate').v2;
import serverless from 'serverless-http';

const prisma = new PrismaClient();

interface Verb {
    id: string;
    verb: string;
    createdAt: Date;
    lastUpdatedAt: Date;
}

const app = express();
// const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.options('*', cors()) // include before other routes

// Add headers before the routes are defined
app.use(function (_, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', "true");
    // Pass to next layer of middleware
    next();
});

// main endpoint for application to request a french verb and its translation
app.get("/verb", authenticateToken, async (req, res) => {

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

    console.log("attempt body: ", req.body)

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

// Register
app.post("/register", async (req, res) => {

    console.log("register body: ", req.body)

    // Get user input
    const { username, email, password } = req.body;

    // Validate user input
    if (!(email && password && username)) {
        res.status(400).send("All input is required");
    }

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
        process.env.TOKEN_KEY || "",
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

    // Validate if user exist in our database
    const user: any = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
            { user_id: user.id, email },
            process.env.TOKEN_KEY || "",
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

app.get("/leaderboard", authenticateToken, async (req, res) => {
    const leaderboard = await prisma.$queryRawUnsafe(
        // DO NOT pass in or accept user input here
        `
        SELECT 
        Count(correct) AS numberCorrect,
        username
        FROM 
            Answer a
        INNER JOIN 
            User u ON a.userId = u.id
        GROUP BY 
            userId
        ORDER BY 
            NumberCorrect DESC
        LIMIT 3
        `,
    );
    await prisma.$disconnect();

    console.log(leaderboard);

    // query raw returns BigInts which cannot be parsed as standard
    (BigInt.prototype as any).toJSON = function () {
        return this.toString();
    };

    return res.status(200).json(leaderboard);


})


// app.listen(port, () => {
//     console.log(`Application started and is running on port ${port}.`);
// });

module.exports.handler = serverless(app);
