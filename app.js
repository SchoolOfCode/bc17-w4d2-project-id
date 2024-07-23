import express from 'express';
import helmet from 'helmet';

const port = 3000;
const app = express();

app.use(helmet());

app.get( '/', (req, res) => {
    res.send('Hello world!')
})

app.listen(port, () => {
    console.log(`terminal is now running on ${port}`)
});

