/**
 *Routes are created for the Courses
 */

 const express = require("express");

//asyncHandler helper function
const { asyncHandler } = require("../middleware/async-handler");
//authentication user
const { authenticateUser } = require("../middleware/auth-user");
//import Model
const { User, Course } = require("../models");

const router = express.Router();

//get all courses
router.get("/", asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "Student",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
    });
    res.status(200).json({ //Returns a list of courses (including the user that owns each course)
      courses,
    });
  })
);

//get specific course
router.get("/:id", asyncHandler(async (req, res) => {
    const course = await Course.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: {
        model: User,
        as: "Student",
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
    });
    res.status(200).json({ //Returns the course (including the user that owns the course) for the provided course ID
      course,
    });
  })
);

//create new course
router.post("/", authenticateUser, asyncHandler(async (req, res) => {
    try {
      const course = await Course.create({
        title: req.body.title,
        description: req.body.description,
        estimatedTime: req.body.estimatedTime,
        materialsNeeded: req.body.materialsNeeded,
        userId: req.currentUser.id,
      });
      res.status(201).location(`/courses/${course.id}`).end();//Creates a course, sets the Location header to the URI for the course, and returns no content
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" || //attempting extra credit but will come to it later
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//update course ---still working on this...
router.put("/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (req.currentUser.id === course.userId) {
        await course.update(req.body);
        res.status(204).end(); //Updates a course and returns no content
      } else { //location header removed according to feedback ---> location(`/${req.params.id}`)
        res
          .status(403)
          .json({ error: "You cannot update the course." });
      }
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//remove course
router.delete("/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).end();//Deletes a course and returns no content & removed the location header since its not needed here
      } else {
        res
          .status(403)
          .json({ error: "Deletion cannot be done" });
      }
    } catch (error) {
      console.log("ERROR: ", error);
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;