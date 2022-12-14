import { PrismaClient } from '@prisma/client';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = express.Router();

// Register
register.post("/", async (req, res) => {

    console.log("register body: ", req.body)
    const prisma = new PrismaClient();

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
