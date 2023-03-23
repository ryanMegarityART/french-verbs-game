import { PrismaClient } from "@prisma/client";
import express from "express";
import { authenticateToken } from "../helpers/auth";
import { Configuration, OpenAIApi } from "openai";
import fs from "fs";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chat = express.Router();

chat.post("/audio/transcribe", authenticateToken, async (req, res) => {
  if (!req.body.prompt) {
    return res.sendStatus(400);
  }

  const buffer = Buffer.from(
    req.body.prompt.split("base64,")[1], // only use encoded data after "base64,"
    "base64"
  );
  const audioFileName = process.env.PWD + `/temp/audio_${Math.random()}.mp3`;
  fs.writeFileSync(audioFileName, buffer);
  const whisperResp = await openai.createTranscription(
    fs.createReadStream(audioFileName) as any,
    "whisper-1",
    "vous me aidez a apprends le francais"
  );

  return res.send(whisperResp.data);
});

chat.post("/prompt", authenticateToken, async (req, res) => {
  if (!req.body.prompt || !req.body.prompt.length) {
    console.log(req.body);
    return res.sendStatus(400);
  }

  try {
    const promptsArray = [
      "Hello! Can you assist me with learning french? (please respond to prompts in french)",
      ...req.body.prompt,
    ];
    console.log("making request with prompts: ", promptsArray);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: promptsArray.map((p) => {
        return { role: "user", content: p as string };
      }),
    });
    return res.send(response.data);
  } catch (e: any) {
    console.log(e.message);
    return res.sendStatus(500);
  }
});
