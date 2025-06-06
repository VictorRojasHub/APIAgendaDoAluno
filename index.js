const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const app = express();

const faltasRouter = require('./routes/faltas');

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado');
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    })
    .catch(err => console.error('Erro ao conectar ao banco de dados:', err));
    
app.use('/api/faltas', faltasRouter);
