import express from 'express';
import dotenv from 'dotenv'
import mainRoutes from './src/routes/main.js';


dotenv.config();
const app = express();
app.use(express.json());

app.use('/main', mainRoutes);

app.get('/', (req, res) => res.send('API running...'));

app.listen(3000, () => console.log('Server running on port 3000'));