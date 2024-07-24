E1U1

run and install the application (our Express APP), ✅

GET request to “http://localhost:3000/”, ✅

check that we get back a response with status code of 200 and text saying “Hello World!” ✅

check to see that the Node API has also logged the request in the terminal (console.log) ✅

E1U2

Configure Helmet configured as one of the first pieces of middleware. ✅

Make sure “X-Powered-By: Express” is not  in the response hadders ✅

E2U1

make a GET request to “http://localhost:3000/activities” ✅

esponde to the request with the correct status code and an array of User Activity objects in the response body (response.data). ✅

E2U2

Then the API should save the new activity to the activities.json file giving it a unique “id” (UUID) ✅

activity_submitted (time stamp - Date.now()) ✅

Then the the request should succeed, responding with the correct status code and the activity object that I posted as the response body ✅

If data is missing then the request should fail with an explanation ✅

E3U1

the API should update the activity in the activities.json file that has a matching activity id ✅

the request should succeed, responding with the correct status code and the activity object that I posted as the response body ✅

If the put request is invalid (no matching id) the request should fail with correct status code and appropriate message ✅

E3U2

delete the activity that has a matching activity id in the activities.json file ✅

request should succeed, responding with the correct status code and the deleted activity object in the response body ✅

API call should fail with the correct response code and a clear error message (response.error) ✅

Bonus

When an invalid DELETE request specifying an id for a activity that does not exist, API call should fail with the correct response code and a clear error message