import express from "express";
import cors from "cors";
import { safeParse } from 'valibot';
import { limiter, corsOptions, PORT } from "./lib/config.js";
import { BoxCreateSchema, SolveBoxSchema } from "./lib/schema.js";
import { boxes } from "./lib/supabase.js";
import { hashSolution, validateSolution } from "./lib/hash.js";

const app = express();

app.use(express.json());
app.use(limiter);
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200)
    .send(
      `
<pre>
Welcome to The Box!
A place where you can create and solve boxes.
boxes can be any type of challenge, puzzle, or riddle. You make a box and the community tries to solve it.

Usage:
GET / - View this message
GET /boxes - get a list of boxes
GET /box/:id - get a box by id

POST /create - create a new box
    Content-Type: application/json
    data: {
      name: string, min 3, max 50
      content: string, max 200
      solution: string, max 200
      difficulty?: number, 1-5
      tags?: array of strings, each tag length min 3, max 20
    }
POST /box/:id/solve - solve a box by id
    Content-Type: application/json
    data: {
      solution: string, max 200
    }

Quick Tips: 
    Use ggl.link/jsonformatter to easy work with JSON data in Browser
    Use curl or other tools to interact with the API from terminal

Author: github.com/arnav-kr

Happy Box-ing! (lol)🎉
</pre>
`);
});

app.get("/boxes", (req, res) => {
  let page = parseInt(req.query.page, 10) || 1;
  let limit = parseInt(req.query.limit, 10) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 50) limit = 50;
  const offset = (page - 1) * limit;

  boxes.select("*").limit(limit).offset(offset).then(r => {
    res.status(200).json(r.map(b => {
      delete b.solution;
      return b;
    }));
  }).catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An Error Occured while fetching the boxes. Please try again later."
    });
  });
});

app.post("/create", (req, res) => {
  const result = safeParse(BoxCreateSchema, req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      issues: result.issues.map(i => i.message),
    });
  }
  const data = result.output;
  data.solution = hashSolution(data.solution);
  boxes.insert(data, "id").then(r => {
    const id = r[0].id;
    res.status(200).json({
      success: true,
      boxId: id,
      solutionHash: data.solution,
      boxUrl: `/box/${id}`,
      solveUrl: `/box/${id}/solve`,
    });
  }).catch(err => {
    if (err.code === "23505") {
      return res.status(400).json({
        success: false,
        message: "Box with same name already exists"
      });
    }
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An Error Occured while creating the box. Please try again later."
    })
  });
});

app.get("/box/:id", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Box ID is required as /box/:id"
    });
  }
  boxes.select("*").where("id", id).then(r => {
    if (r.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Box not found"
      });
    }
    const box = r[0];
    delete box.solution;
    res.status(200).json(box);
  }).catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An Error Occured while fetching the box. Please try again later."
    });
  });
});

app.post("/box/:id/solve", (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Box ID is required as /box/:id/solve"
    });
  }

  const result = safeParse(SolveBoxSchema, req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data",
      issues: result.issues.map(i => i.message),
    });
  }
  const solution = result.output.solution;

  boxes.select("solution").where("id", id).then(r => {
    if (r.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Box not found"
      });
    }
    if (!validateSolution(solution, r[0].solution)) {
      return res.status(400).json({
        success: false,
        message: "Invalid solution"
      });
    }
    res.status(200).json({
      success: true,
      message: `Congrats! Box ${id} solved successfully, the solution was '${solution}'`
    });
  }).catch(err => {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An Error Occured while fetching the box. Please try again later."
    });
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
