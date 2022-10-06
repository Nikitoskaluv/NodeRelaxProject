import express from 'express';
import { users } from '../db/db';

const app = express();
const port = 8000;

app.use(express.json());



app.post('/registration', (req, res) => {
    console.log(req.body);
    if (users.some((user => user.username === req.body.username))) {
        console.log('Пользователь с таким именем уже существует');
    } else {
        users.push(req.body);
    }
    res.send('Hello World!')
})




app.post('/auth', (req, res) => {

    const user_from_req = req.body;
    const user_from_db = users.find((user => user.username === user_from_req.username));
    if (!user_from_db) {
        res.status(403);
        return res.json({
            message: 'Пользовтель с таким именем не найден'
        })

    }

    if (user_from_db.password !== user_from_req.password) {
        res.status(403);
        return res.json({
            message: 'Пароль не верный'
        })
    }

    res.status(200);
    res.json({
        message: 'OK'
    })
})



app.get('/users', (req, res) => {
    res.json(users);
})





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})













