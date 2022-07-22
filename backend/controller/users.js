
import users from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const datausers = await users.findAll(
            { attributes: ['id', 'name', 'email'] }
        );
        res.status(200).json(datausers);
    } catch (error) {
        console.log(error);
    }
}

export const register = async (req, res) => {

    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) return res.status(400).json({
        msg: "Password dan confirm password tidak cocok"
    })
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {
        await users.create({
            name: name,
            email: email,
            password: hashPassword
        })

        res.json({ msg: "Register Berhasil" });
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const user = await users.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) {
            res.status(400).json({ msg: "wrong password" });
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })

        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        const updateToken = await users.update(
            {
                refresh_token: refreshToken
            },
            {
                where: {
                    id: userId,
                },
            });

        if (updateToken) {
            console.log("token berhasil diupdate");
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // ,secure: true (untuk https)
        });
        // res.json(user);
        // res.json(userId);
        res.json({ accessToken });

    } catch (error) {
        // res.status(404).json({ msg: "Email tidak ditemukan" });
        console.log(error);
    }
}

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);

    const user = await users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

