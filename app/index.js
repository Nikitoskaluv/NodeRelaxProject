import express from 'express';
import * as userService from '../services/userService.js';
import * as timerService from '../services/timerService.js'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();
const JWT_KEY = process.env.JWT_KEY;


const app = express();
const port = 8000;

app.use(express.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, authorization');
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
                message: 'Авторизация прошла успешно',
                user: {
                    login: user.login,
                    name: user.name
                },
                token: jwt.sign({ login: user.login }, JWT_KEY, { expiresIn: "2h" })
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
});

app.get('/user', authenticateToken, (req, res) => {
    console.log(req.user_login);
    res.json(userService.getUser(req.user_login));
});

app.put('/user', authenticateToken, (req, res) => {
    const result = userService.updateUser(req.body);
    if (result) {
        res.status(200);
        return res.json({
            message: 'Сохранено успешно'
        })
    } else {
        res.status(500);
        return res.json({
            message: 'Ошибка сохранения'
        })
    }
});

app.put('/user/password', authenticateToken, (req, res) => {
    const result = userService.updateUserPassword(req.body);
    if (result) {
        res.status(200);
        return res.json({
            message: 'Сохранено успешно'
        })
    } else {
        res.status(500);
        return res.json({
            message: 'Ошибка сохранения'
        })
    }
});
app.get('/users', authenticateToken, (req, res) => {
    res.json(userService.getAllUsers());
});

app.get('/timer', authenticateToken, (req, res) => {
    res.json(timerService.getAllTimers());
})

app.post('/timer', authenticateToken, (req, res) => {
    const timer = req.body;
    timer.user = req.user_login;
    timer.serverTime = new Date();
    console.log(`timer2`, timer);
    const result = timerService.saveTimer(timer);

    if (result) {
        res.status(200);
        return res.json({
            message: 'OK'
        })
    } else {
        res.status(500);
        return res.json({
            message: 'Ошибка сохранения'
        })
    }

});

function authenticateToken(req, res, next) {

    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_KEY, (err, user) => {
        if (err) {
            res.status(403);
            return res.json({
                message: 'Не авторизованный пользователь'
            })
        }
        req.user_login = user.login
        next()
    })
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})









