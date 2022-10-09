import express from 'express';
import * as userService from '../services/userService.js';


const app = express();
const port = 8000;

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    next();
});

app.post('/registration', (req, res) => {
    const user = req.body;
    if (!user) {
        return res.status(500).json({
            message: 'Неверные данные'
        });
    }
    if (!user.login || !user.password) {
        return res.status(500).json({
            message: 'Ошибка в запросе'
        });
    }

    const result = userService.registerUser(user);

    if (result) {
        res.status(200).json({
            message: 'Регистрация прошла успешно'
        });
    } else {
        return res.status(500).json({
            message: 'Ошибка регистрации'
        });
    }
});


app.post('/auth', (req, res) => {
    const user = req.body;
    if (user && user.login && user.password) {
        const result = userService.authUser(user);

        if (result) {
            res.status(200).json({
                message: 'Авторизация прошла успешно'
            });
        } else {
            res.status(403);
            return res.json({
                message: 'Ошибка в логине или пароле'
            })
        }
    } else {
        res.status(400);
        return res.json({
            message: 'Некорректный запрос'
        })
    }


})


app.get('/users', (req, res) => {
    res.json([]);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})













