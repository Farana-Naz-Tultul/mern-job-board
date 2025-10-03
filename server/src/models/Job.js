//We're using Mongoose to define how job data will look inside MongoDB
// Mongoose = wrapper around MongoDB  makes it easier to work with schemas & models.

import mongoose from "mongoose";

//mongoose.Schema lets us define the structure of a "Job" document.
/*
The second argument { timestamps: true } means Mongo will automatically add:

createdAt  when the job was created.

updatedAt  when it was last updated.
*/
const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a job title"], //Required, if missing, Mongo will throw error: "Please provide a job title.""
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
    },
    description: {
      type: String,
      required: [true, "Please provide job description"],
    },

    /*
    Every job must be linked to a user (the one who created it).

ObjectId is Mongo's way of saying "a reference to another document."

ref: "User" tells Mongoose this field references the User model.
    */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // links job to user
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // auto add createdAt & updatedAt
);

//Turns the schema into a model called "Job"
export default mongoose.model("Job", JobSchema);

/*
title  Job title (e.g. "Frontend Developer").

company  Company name.

description  Job description/details.

createdBy  The User's ObjectId (so we know which logged-in user posted it).

timestamps  Mongoose automatically adds createdAt and updatedAt.
*/