
import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';

export const leaderboard = express.Router();

leaderboard.get("/", authenticateToken, async (req, res) => {
    const prisma = new PrismaClient();
    const leaderboard = await prisma.$queryRawUnsafe(
        // DO NOT pass in or accept user input here
        `
        SELECT 
        SUM(correct) AS numberCorrect,
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

