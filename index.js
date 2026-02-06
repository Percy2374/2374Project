const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

//add event
app.post("/events", async(req, res) => {
    try {
        console.log(req.body);
        const {description} = req.body;
        const newEvent = await pool.query("INSERT INTO events (description) VALUES($1) RETURNING *",
             [description]);

        res.json(newEvent.rows[0]);     

    } catch (err){
        console.log(err.message);
    }
});

//see events
app.get("/events", async(req, res) => {
    try {
        const allEvents = await pool.query("SELECT * FROM events");
        res.json(allEvents.rows);
    }
    catch (err){
        console.error(err.message);
    }
});

//get event
app.get("/events/:id", async (req, res) => {
    try {
        console.log(req.params);
        const {id} = req.params;
        const event = await pool.query("SELECT * FROM events WHERE event_id = $1", [id]);

        res.json(event.rows[0]);
    }
    catch (err) {
        console.error(err.message);
    }
});

//update
app.put("/events/:id", async(req, res) => {
   try {
        const {id} = req.params;
        const {description} = req.body;
        const updateEvent = await pool.query("UPDATE events SET description = $1 WHERE event_id = $2",
             [description, id]);
        res.json("event updated");

   }
   catch (err){
    console.error(err.message);
   } 
});


//delete event
app.delete("/events/:id", async(req,res) =>{
    try {
        const {id} = req.params;
        const deleteEvent = await pool.query("DELETE FROM events WHERE event_id = $1", [id]);
        res.json("event deleted");
    }
    catch (err){
        console.error(err.message);
    }
});

app.listen(5001, () => {
    console.log("server has started on port 5001")
});