import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authenticateToken } from '../helpers/auth';
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chat = express.Router();

chat.get("/", authenticateToken, async (req, res) => {
    console.log(`chat request '${req.query.chatPrompt}' received...`)
    if (!req.query.chatPrompt) {
        return res.send(400)
    }
    try {
        const response = await openai.createChatCompletion({
            "model": "gpt-3.5-turbo",
            "messages": [{ "role": "user", "content": req.query.chatPrompt as string }]
        }
        );
        console.log(response.data)
        return res.send(response.data)
    } catch (e: any) {
        console.log(e.message)
        return res.sendStatus(500)
    }
})
