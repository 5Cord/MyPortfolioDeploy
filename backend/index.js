import express from "express"
import mongodb from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import FormFeedback from './models/sendForm.js';
import { validaciaForm } from './validations/validFormPost.js'
import { validationResult } from 'express-validator'

let app = express()
app.use(express.json());
const mongoClient = new mongodb.MongoClient(process.env.DATABASE_URL);

app.use(cors({
    origin: 'http://localhost:5173'
}));

let db
async function connectToMongo() {
    try {
        await mongoClient.connect();
        db = mongoClient.db('testExpress');
        let coll = db.collection('formFeedback');
        let res = await coll.find().toArray();
        console.log(res);
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
    }

}

connectToMongo();


app.get('/', (req, res) => {
    res.send('Главная')
})

app.post('/sendFeedback', validaciaForm, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
        const coll = db.collection('formFeedback');
        // const newPost = req.body;
        const newPost = new FormFeedback({
            nameUser: req.body.nameUser,
            emailUser: req.body.emailUser,
            messageUser: req.body.messageUser,
            imageFile: req.body.imageFile,
        });
        const result = await coll.insertOne(newPost);
        res.status(201).json({ _id: result.insertedId, ...newPost });
    } catch (err) {
        console.error('Ошибка добавления данных', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/getTitle', async (req, res) => {
    try {
        const coll = db.collection('page');
        const proj = { _id: 0 };
        const data = await coll.find().project(proj).toArray();
        res.json(data);
    } catch (err) {
        console.error('Ошибка получения данных', err);
        res.status(500).send('Ошибка сервера');
    }
});


app.listen(3000, () => {
    console.log('Server running')
})