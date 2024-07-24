import express from 'express';
import helmet from 'helmet';

import activities from './activities.json' assert {type: "json"};

const port = 3000;
const app = express();

app.use(helmet());

app.use(express.json()); 

app.get( '/', (req, res) => {
    res.send('Hello world!')
})

app.listen(port, () => {
    console.log(`terminal is now running on ${port}`)
});

app.get( '/activities', (req, res) => {
    res.json(activities)
})

app.post('/activities', async (req, res) => { 
    try {
        const newTask = await addNewTask(req.body.activity_type, req.body.activity_duration)
        res.json(newTask)
    } catch(error) {
        res.status(500).send("Error handling request")
    }
})

async function addNewTask(activityType, activityDuration) {
    let uniqueIdentifier = randomIdGenerator()
    let timestamp = Date.now()
    activities.push({
        uniqueIdentifier,
        timestamp,
        activityType,
        activityDuration
    })
    return activities[activities.length - 1]
} 

function randomIdGenerator() {
    let randomId = Math.floor((Math.random() * 1000000)) // Generates a random number that is 6 digits long
    for (let i=0; i<activities.length; i++) { // Loop through all current IDs to make sure we don't have one that matches the randomly generated one
        if (randomId === activities[i].id) {
            randomIdGenerator() // If a match is found then recall the function
        } 
    }
    return randomId
}