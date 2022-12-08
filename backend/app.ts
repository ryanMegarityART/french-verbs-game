import express from "express";
import cors from "cors";

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
    
    res.send();
})


app.listen(port, () => {
    console.log(`Application started and is running on port ${port}.`);
});
