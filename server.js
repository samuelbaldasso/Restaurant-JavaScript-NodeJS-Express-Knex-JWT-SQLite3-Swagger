const express = require('express');
require('dotenv').config();

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./controllers/apiDocController'); // caminho para o seu arquivo apiDocController.js

const app = express();

app.use(cors(
    {
        origin: 'http://localhost:3001',
        allowedHeaders: ['Content-Type', 'Authorization']
    }
));

app.use(express.json());

app.use('/uploads', express.static('uploads'));
// Defina a rota para acessar a documentação do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authRoutes = require('./routes/authRouter');
const dishesRoutes = require('./routes/dishesRouter');
const photoRoutes = require('./routes/uploadImageRouter');
const favoriteRoutes = require('./routes/favoritesRouter');
const orderRoutes = require('./routes/orderRouter');

app.use('/auth', authRoutes);
app.use('/dishes', dishesRoutes);
app.use('/photo', photoRoutes);
app.use('/favorite', favoriteRoutes);
app.use('/order', orderRoutes);

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        if (err.message === "jwt expired") {
            return res.status(401).send('Token has expired');
        } else {
            return res.status(401).send('Unauthorized: ' + err.message);
        }
    }
    next(err);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


