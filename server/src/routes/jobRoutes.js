/*
express  we need it to make routes.

authMiddleware  ensures only logged-in users with a valid token can access these routes.

Job  our Mongoose model from Job.js (the database structure for jobs).
*/

import mongoose from "mongoose";//For checking if ID is valid

import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Job from "../models/Job.js";
//Creates a new mini Express app just for these routes
const router = express.Router();

//  Create Job (protected)
router.post("/", authMiddleware, async (req, res) => { //router.post("/") defines a POST request at /api/jobs/.authMiddleware  runs first  checks if the user has a valid token.
  try {
    const { title, company, description } = req.body; //Pulls job data (title, company, description) from the request body (what user sends in JSON)

    if (!title || !company || !description) { //Checks if any of the fields are missing
      return res.status(400).json({ error: "All fields are required" });
    }
//Save Job to MongoDB
/*Uses Mongoose's create() to insert a new Job document into MongoDB.

createdBy: req.user.id  comes from the JWT decoded by authMiddleware (the logged-in user’s ID).

This way, jobs are always tied to the user who created them.*/
    const job = await Job.create({
      title,
      company,
      description,
      createdBy: req.user.id, // comes from authMiddleware
    });
//Sends back the job that was just created.201 = "Created" (standard HTTP code).
    res.status(201).json(job);
  } catch (err) { //If anything goes wrong (e.g. MongoDB crash, validation fails unexpectedly), return 500 (Internal Server Error)
    res.status(500).json({ error: "Server error" });
  }
});

//  Get All Jobs (protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
/*
router.get("/")  handles GET /api/jobs.

Again, authMiddleware ensures only logged-in users can access it.

Job.find({ createdBy: req.user.id })  fetches only the jobs created by that logged-in user.

Sends them back as JSON with status 200 OK.
*/


//  Update Job (protected)
router.patch("/:id", authMiddleware, async (req, res) => { //Defines a PATCH route at /api/jobs/:id.:id is a URL parameter (the Job’s Mongo _id). authMiddleware runs first to ensure the caller has a valid JWT.
  try {
    const { id } = req.params; // Job ID from URL

    //  Validate MongoDB ObjectId before querying
    //This check catches bad IDs early and returns a clean 400 Bad Request instead of crashing the query.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const { title, company, description } = req.body;
    //Pull the job id from the URL and the potential updates from the JSON body.

    // Find job that matches id AND belongs to this user
    const job = await Job.findOneAndUpdate(
      { _id: id, createdBy: req.user.id },//Query filter,Only update if the job’s _id matches AND it was created by the currently logged-in user (req.user.id set by the middleware). This enforces ownership.
      { title, company, description }, //Update object, Fields to change; any undefined fields are ignored by Mongo
      { new: true, runValidators: true } // return updated job, validate fields
    );//return the updated document (not the old one), re-run schema validation on updates (so required types/lengths still apply).

    if (!job) { //If no job matched (wrong id or not owned by this user), return 404
      return res.status(404).json({ error: "Job not found or not authorized" });
    }

    res.status(200).json(job); //On success, return the updated job with 200
  } catch (err) {
    console.error("Update error:", err); //  this will show the exact cause in your terminal
    res.status(500).json({ error: "Server error" });//If something unexpected throws (e.g., invalid ObjectId format), respond 500
  }
});

//  Delete Job (protected)
router.delete("/:id", authMiddleware, async (req, res) => {
    //Defines a DELETE route at /api/jobs/:id.Uses authMiddleware to require a valid token.
  try {
    const { id } = req.params; //Get the job id from the URL

    //  Validate MongoDB ObjectId
    //This check catches bad IDs early and returns a clean 400 Bad Request instead of crashing the query.
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const job = await Job.findOneAndDelete({
      _id: id,
      createdBy: req.user.id,
    });
    /*
    Delete only if:

_id matches the provided id, and

The job belongs to the logged-in user (createdBy: req.user.id).

Returns the deleted document if found, or null if nothing matched.
    */

    if (!job) { //If no matching job (wrong id or not owner), respond 404.
      return res.status(404).json({ error: "Job not found or not authorized" });
    }
//On success, return a simple message with 200
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) { //Any unexpected error  500.
    res.status(500).json({ error: "Server error" });
  }
});

//Exports this router so index.js can use it
export default router;
