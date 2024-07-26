import express from 'express';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator'
import activities from './activities.json' assert {type: "json"};

const port = 3000;
const app = express();

app.use(helmet());
app.use(express.json()); 

// this is to the express validator parameters
const validateInput = [
    body('activity_type')
    .isAlpha('en-US', {ignore: ' '}) // ignore allows to have spaces inside the activity, e.g. playing_football
    .withMessage('Please enter a valid name for activity type')
    .trim(),
    body('activity_duration')
      .trim()
      .isNumeric()
      .withMessage('Please enter a valid number for duration')
      .isInt({ min: 1, max: 720 })
      .withMessage('Please enter the duration in minutes (min 1 min - max 720 min)'),
  ];

  //Check-in Get to make sure the host is connected ok
app.get( '/', (req, res) => { 
    res.send('Hello world!')
})

// Main get request to show all recorded activities
app.get( '/activities', (req, res) => {
    res.json(activities)
})

// Adding new activities
app.post('/activities', validateInput, async (req, res) => { 
    const result = validationResult(req);
    const errors = result.array()
    if (!result.isEmpty()) {
        return res.status(400).json({error: errors});
    }
    try {
        const newTask = await addNewTask(req.body.activity_type, req.body.activity_duration)
        res.json(newTask)
    } catch(error) {
        res.status(500).send("Error handling request")
    }
})

// Replacing an existing task
app.put('/activities/:id', validateInput, async (req, res) => {
    const result = validationResult(req);
    const errors = result.array();
    if (!result.isEmpty()) {
      return res.status(400).json({ error: errors });
    }
    try {
      const newTask = await replaceTask(req.body.activity_type, req.body.activity_duration, req.params.id);
      if (!newTask) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.json(newTask);
    } catch (error) {
      res.status(500).send('Error handling request');
    }
  });


// Delete an existing activity
app.delete('/activities/:id', async (req, res) => {
    try {
        const deletedTask = await deleteTask(req.params.id)
        console.log(deletedTask)
        console.log(req.params.id)
        if (!deletedTask) {   // if there is not - error message
        return res.status(404).json({ error: 'Task not found'})
        }
        res.json(deletedTask); //res.status(200).json({ type: success, payload: deletedTask }) // if there is a match - delete it
    } catch {
        res.status(500).json({ error: "Error handling request"})
    }
})

// Function to create new ID for new
function randomIdGenerator() {
    let randomId = Math.floor((Math.random() * 1000000)) // Generates a random number that is 6 digits long
    for (let i=0; i<activities.length; i++) { // Loop through all current IDs to make sure we don't have one that matches the randomly generated one
        if (randomId === activities[i].id) {
            randomIdGenerator() // If a match is found then recall the function
        } 
    }
    return randomId
}

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
      
async function deleteTask(activityId) {
    const index = activities.findIndex(({ id }) => id === activityId);  // finding the index of the activity matching the i
    console.log(index)
    console.log(activities[index])
    const deletedActivity = activities[index]; // finding the activity matching the id
    delete activities[index]; // deleted the selected activty
    activities.splice(index, index);
    console.log(activityId)
    console.log(deletedActivity)
    console.log(activities)
    return deletedActivity; // returns the activity we got rid of
    
}



app.listen(port, () => {
    console.log(`terminal is now running on ${port}`)
});


