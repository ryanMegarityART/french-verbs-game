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

chat.get("/", authenticateToken, async (req, res) => {
  console.log(`chat request '${JSON.stringify(req.query)}' received...`);
  if (!req.query.chatPrompt) {
    return res.sendStatus(400);
  }
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.query.chatPrompt as string }],
    });
    console.log(response.data);
    return res.send(response.data);
  } catch (e: any) {
    console.log(e.message);
    return res.sendStatus(500);
  }
});

chat.post("/prompt", authenticateToken, async (req, res) => {
  console.log(`prompt: '${JSON.stringify(req.body)}' received...`);
  if (!req.body.type) {
    console.log(req.body.type || "no type");
    return res.sendStatus(400);
  }
  try {
    let promptsArray = [
      "Hello! Can you assist me with learning french? (please respond to prompts in french)",
    ];
    if (req.body.type === "audio") {
      const buffer = Buffer.from(
        req.body.prompt.split("base64,")[1], // only use encoded data after "base64,"
        "base64"
      );
      const audioFileName =
        process.env.PWD + `/temp/audio_${Math.random()}.mp3`;
      fs.writeFileSync(audioFileName, buffer);
      console.log(`wrote ${buffer.byteLength.toLocaleString()} bytes to file.`);
      //TODO: use whisper API
      const whisperResp = await openai.createTranscription(
        fs.createReadStream(audioFileName) as any,
        "whisper-1",
        "vous me aidez a apprends le francais"
      );

      console.log("whisperResp: ", whisperResp.data);
      promptsArray.push(whisperResp.data.text);
      fs.unlinkSync(audioFileName);
    } else {
      promptsArray.push(req.body.prompt);
    }
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: promptsArray.map((p) => {
        return { role: "user", content: p as string };
      }),
    });
    console.log(response.data);
    return res.send(response.data);
  } catch (e: any) {
    console.log(e.message);
    return res.sendStatus(500);
  }
});
