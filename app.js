import express from 'express';
import mainRoutes from './src/routes/main.js';

const app = express();
app.use(express.json());

app.use('/main', mainRoutes);

app.get('/', (req, res) => res.send('API running...'));

app.listen(3000, () => console.log('Server running on port 3000'));