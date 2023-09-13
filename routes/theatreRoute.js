const router = require("express").Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');

//add theatre

router.post('/add-theatre', authMiddleware, async (req,res)=>{
    try{
        const newTheatre = new Theatre(req.body);
        await newTheatre.save();
        res.send({
            success:true,
            message:"Theatre added"
        })
    }catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})


//get all theatre by owner
router.post('/get-all-theatres-by-owner', authMiddleware, async(req,res)=>{
    try{
        const theatres = await Theatre.find({owner:req.body.owner})
        res.send({
            success:true,
            message:"Theatres fetched by owner",
            data:theatres
        })
    }catch(err){
        res.send({
            success:false,
            message:err.message
        })   
    }
})

router.put('/update-theatre', authMiddleware,async (req,res)=>{
    try{
        await Theatre.findByIdAndUpdate(req.body.theatreId,req.body);
        res.send({
            success:true,
            message:"Theatre Updated"
        })

    }catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})

//delete a theatre
router.post('/delete-theatre', authMiddleware, async(req,res)=>{
    try{
        await Theatre.findByIdAndDelete(req.body.theatreId);
        res.send({
            success:true,
            message:"Theatre deleted"
        })
    }catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})

router.get('/get-all-theatres',authMiddleware,async(req,res)=>{
    try{
        const theatres = await Theatre.find().populate('owner');
        res.send({
            success:true,
            message:"All Theatres fetched",
            data:theatres
        })
    }catch(err){
        res.send({
            success:false,
            message:err.message
        })
    }
})

// add a Show

router.post("/add-show", authMiddleware, async (req, res) => {
    try {
      const newShow = new Show(req.body);
      await newShow.save();
      res.send({
        success: true,
        message: "Show added successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });


  router.post("/get-all-shows-by-theatre", authMiddleware, async (req, res) => {
    try {
      const shows = await Show.find({ theatre: req.body.theatreId })
        .populate("movie")
        .sort({
          createdAt: -1,
        });

      res.send({
        success: true,
        message: "Shows fetched successfully",
        data: shows,
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });


    // delete show
router.post("/delete-show", authMiddleware, async (req, res) => {
    try {
      await Show.findByIdAndDelete(req.body.showId);
      res.send({
        success: true,
        message: "Show deleted successfully",
      });
    } catch (error) {
      res.send({
        success: false,
        message: error.message,
      });
    }
  });

//get all theatre by movie 

router.post("/get-all-theatres-by-movie", authMiddleware, async (req, res) => {
  try {
    const { movie, date } = req.body;

    // find all shows of a movie
    const shows = await Show.find({ movie, date })
      .populate("theatre")
      .sort({ createdAt: -1 });

    // get all unique theatres
    let uniqueTheatres = [];
    shows.forEach((show) => {
      const theatre = uniqueTheatres.find(
        (theatre) => theatre._id == show.theatre._id
      );
      if (!theatre) {
        const showsForThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsForThisTheatre,
        });
      }
    });

    res.send({
      success: true,
      message: "Theatres fetched successfully",
      data: uniqueTheatres,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

// get show by id
router.post("/get-show-by-id", authMiddleware, async (req, res) => {
  try {
    const show = await Show.findById(req.body.showId)
      .populate("movie")
      .populate("theatre");
    res.send({
      success: true,
      message: "Show fetched successfully",
      data: show,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;