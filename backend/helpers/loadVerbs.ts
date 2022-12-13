import fs from 'fs';
import path from 'path';
import { Prisma, PrismaClient } from '@prisma/client'

const filePath = path.join(__dirname, 'verbs.txt');
fs.readFile(filePath, { encoding: 'utf-8' }, async (err, data) => {
    if (!err) {
        const prisma = new PrismaClient();

        // Logic to limit to 500
        // const numberOfVerbsAlreadyInDB = await prisma.verb.count();
        // if (numberOfVerbsAlreadyInDB >= 500) {
        //     console.log("500 verbs already loaded in db")
        //     await prisma.$disconnect()
        //     return res.send("500 verbs already loaded in db");
        // }

        // split list on new line 
        const verbsToAdd = data.split(/\r?\n/);
        const added = [];
        const skipped = [];
        console.log(verbsToAdd.length, " verbs found in verbs.txt to add...")
        for (let i = 0; i < verbsToAdd.length; i++) {

            // log progress
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
            } catch (e : any) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    // P2022: Unique constraint failed
                    // Prisma error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
                    if (e.code === 'P2002') {
                        skipped.push(verbsToAdd[i])
                        continue;
                    }
                }
                console.log("error adding verb: ", e.message);
            }
        }

        console.log(added.length, " verbs added to db.")
        console.log(skipped.length, " verbs skipped since they already existed or are duplicates.")


        await prisma.$disconnect()
    } else {
        console.log(`Error reading verbs.txt file: ${err}`);
    }
})