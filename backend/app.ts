import express from "express";
import cors from "cors";
import fs from 'fs';
import path from 'path';
import { Prisma, PrismaClient } from '@prisma/client'

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: '*' }));

// main endpoint for application to request a french verb and its translation
app.get("/verb", (req, res) => {
    res.send({
        verb: "regarder",
        translation: "look",
    });
});

// endpoint to load in the verbs to the database from verbs.txt file
app.get("/load", (req, res) => {

    let respMessage = "";

    const filePath = path.join(__dirname, 'verbs.txt');
    fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
        if (!err) {
            const prisma = new PrismaClient()

            // split list on new line 
            const verbsToAdd = data.split(/\r?\n/);
            const added = [];
            const skipped = [];
            console.log(verbsToAdd.length, " verbs found in verbs.txt to add...")
            for (let i = 0; i < verbsToAdd.length; i++) {

                if (i % 250 === 0) {
                    console.log(i, "/", verbsToAdd.length, " actioned...")
                }

                // write as verb to db
                try {
                    const verb = await prisma.verb.create({
                        data: {
                            verb: verbsToAdd[i],
                        },
                    })
                    added.push(verbsToAdd[i])
                } catch (e) {
                    if (e instanceof Prisma.PrismaClientKnownRequestError) {
                        // P2022: Unique constraint failed
                        // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
                        if (e.code === 'P2002') {
                            // console.log("verb: ", verbsToAdd[i], " has already been loaded into the db.")
                            skipped.push(verbsToAdd[i])
                            continue;
                        }
                    }
                    console.log("error adding verb: ", e.message);
                }
            }

            console.log(added.length, " verbs added to db.")
            console.log(skipped.length, " verbs skipped since they already existed or are duplicates.")

            respMessage = added.length + " verbs added to db. " + skipped.length + " verbs skipped since they already existed or are duplicates."

            await prisma.$disconnect()
        } else {
            console.log("Error reading verbs.txt file: ", err);
        }
    });
    res.send(respMessage);
})


app.listen(port, () => {
    console.log(`Application started and is running on port ${port}.`);
});
