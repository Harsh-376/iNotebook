const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator"); // Express Validator
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");

//* ROUTE 1
// Fetch all the notes using: GET "/api/notes/fetchallnotes". Login Required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Sever Error");
    }
});

//* ROUTE 2
// Add a new note using: POST "/api/notes/addnote". Login Required
router.post(
    "/addnote",
    fetchUser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("description", "Enter a valid description").isLength({ min: 5 }),
    ],
    async (req, res) => {
        // If error then return Bad Request with error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { title, description, tag } = req.body;

            const note = new Notes({
                title,
                description,
                tag,
                user: req.user.id,
            });

            const savedNote = await note.save();
            res.json(savedNote);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Sever Error");
        }
    }
);

//* ROUTE 3
// Update an existing note using: PUT "/api/notes/updatenote". Login Required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // create newNote object
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        //Find the note to be update and then update it
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Unauthorized Client");

        note = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: newNote },
            { new: true }
        );

        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Sever Error");
    }
});

//* ROUTE 4
// Delete an existing note using: Delete "/api/notes/deletenote". Login Required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
    try {
        //Find the note to be deleted and then delete it
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not Found");

        // Allow deleteion only if user owns the note
        if (note.user.toString() !== req.user.id)
            return res.status(401).send("Unauthorized Client");

        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({ Success: "Note Deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Sever Error");
    }
});

module.exports = router;
