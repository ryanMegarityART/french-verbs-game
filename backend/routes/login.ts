import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = express.Router();

// Login
login.post("/", async (req, res) => {

    console.log("login body: ", req.body)
    const prisma = new PrismaClient();

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