import express from 'express';
import helmet from 'helmet';

import activities from './activities.json' assert {type: "json"};

const port = 3000;
const app = express();

app.use(helmet());

app.get( '/', (req, res) => {
    res.send('Hello world!')
})

app.listen(port, () => {
    console.log(`terminal is now running on ${port}`)
});

app.get( '/activities', (req, res) => {
    res.json(activities)
})


