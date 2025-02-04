const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");
const Note = require("../models/Note");
const router = express.Router();
//Route 1: Get all the notes

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
  res.json(notes);
    } catch (error) {
    res.status(500).send("Internal Server Error");
        
    }
});

//Route 2:Add a new notes using Post "api/notes/addnote". Login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a Valid title").isLength({ min: 3 }),
    body("description", "Enter a Valid Email").isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are no errors, return Bad requests and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
          title,
          description,
          tag,
          user: req.user.id,
        });
        const savedNote= await note.save()
        res.json(savedNote)   
    } catch (error) {
    res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3: Update an exsisting note Note using :POST api/notes/updatenote. Login required

router.put(
    "/updatenote/:id",
    fetchuser,
    async (req, res) => {
        const {title,description,tag}=req.body;
        //create a newNote object
        const newNote={};
        if(title){newNote.title=title}
        if(description){newNote.description=description}
        if(tag){newNote.tag=tag}

        //Find the note to be updated and update it
        let note=await Note.findById(req.params.id)
        if(!note)
        {
           return res.status(404).send("Not Found!")
        }
        if(note.user.toString()!==req.user.id)
        {
            return res.status(401).send("Not allowed");
        }
        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.json({note})

    })

    //Route 4: Deleting an exsisting note. Note using :DELTETE api/notes/deletenote. Login required

router.delete(
  "/deletenote/:id",
  fetchuser,
  async (req, res) => {
    try {
      const {title,description,tag}=req.body;

      //Find the note to be deleted and delete it
      let note=await Note.findById(req.params.id)
      if(!note)
      {
         return res.status(404).send("Not Found!")
      }
      //Allow deletion only if the user owns thr note
      if(note.user.toString()!==req.user.id)
      {
          return res.status(401).send("Not allowed");
      }
      note=await Note.findByIdAndDelete(req.params.id)
      res.json({"Success":"Note has been Deleted",note:note})

  
      
    } catch (error) {
      res.status(500).send("Internal Server Error")
    }
  })


module.exports = router;
