const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { nome, email, login, senha } = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { login } }) 
            || await Usuario.findOne({ where: { email } });
        
        if (usuarioExistente) {
            return res.status(400).json({ mensagem: 'Usuário já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaCriptografada = await bcrypt.hash(senha, salt);

        await Usuario.create({ nome, email, login, senha: senhaCriptografada });

        res.status(201).json({ mensagem: 'Usuário criado com sucesso' });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro no servidor');
    }
};

exports.login = async (req, res) => {
    const { identificador, senha } = req.body; // identificador = email ou login

    try {
        const usuario = await Usuario.findOne({
            where: {
                [Usuario.sequelize.Op.or]: [
                    { email: identificador },
                    { login: identificador }
                ]
            }
        });

        if (!usuario) {
            return res.status(400).json({ mensagem: 'Credenciais inválidas' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ mensagem: 'Credenciais inválidas' });
        }

        const payload = { idUsuario: usuario.id };

        const token = jwt.sign(payload, process.env.JWT_SECRETO, { expiresIn: '1h' });

        res.json({ token });
    } catch (erro) {
        console.error(erro);
        res.status(500).send('Erro no servidor');
    }
};
