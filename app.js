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
       if  (!req.body.activity_type || !req.body.activity_duration) {
        return res.status(404).json({ error: 'Error - provide activity info' });}
        const newTask = await addNewTask(req.body.activity_type, req.body.activity_duration)
        res.json(newTask)
    } catch(error) {
        res.status(500).send("Error handling request")
    }
})

app.put('/activities/:id', async (req, res) => { 
    try {
       if  (!req.body.activity_type || !req.body.activity_duration) {
        return res.status(404).json({ error: 'Error - provide activity info' });}
        const newTask = await replaceTask(req.body.activity_type, req.body.activity_duration, req.params.id)
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

async function replaceTask(activityType, activityDuration, activityId) {
    // find task matching to index provided
    const index = activities.findIndex(({ id }) => id === activityId);
    // create new task
    let uniqueIdentifier = randomIdGenerator()
    let timestamp = Date.now()
    const newActivity = {
        uniqueIdentifier,
        timestamp,
        activityType,
        activityDuration
    }
    // replace old task with new task
    activities[index] = newActivity
    // return the new task
    return activities[index]
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

app.delete('/activities/:id', async (req, res) => {

    try { 
        const deletedTask = await deleteTask(req.params.id)
        if (!deletedTask) {   // if there is not - error message
        return res.status(404).json({ error: 'Task not found'})
        }
        // if there is a match - delete it
        //res.status(200).json({success:`Task successfully deleted" ${deletedTask}`})
        res.status(200).json({type: 'success', payload: deletedTask})
    } catch {
        res.status(500).json({error: "Error handling request"})
    }
})

async function deleteTask(activityId) {
const index = activities.findIndex(({ id }) => id === activityId);  // finding the index of the activity matching the id
const deletedActivity = activities[index]; // finding the activity matching the id
delete activities[index]; // deleted the selected activty
return deletedActivity; // returns the activity we got rid of
}