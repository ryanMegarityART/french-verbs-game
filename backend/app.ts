import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
// import serverless from 'serverless-http';
import routes from "./routes";

const prisma = new PrismaClient();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(bodyParser.text({ limit: "200mb" }));

app.options("*", cors()); // include before other routes

app.use("/", routes);

app.listen(port, () => {
  console.log(`Application started and is running on port ${port}.`);
});

// module.exports.handler = serverless(app);
