import express from 'express';
import mongoose from 'mongoose';

const app = express();

// Middleware to parse JSON from requests
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Portfolio", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Portfolio Schema
const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    technologies: {
      type: [String],
      default: [],
    },
    image: {
      type: String, // Base64 string
      required: [true, 'Image is required'],
    },
    githubLink: {
      type: String,
      validate: {
        validator: (val) => /^https?:\/\/.+/.test(val),
        message: 'Invalid GitHub URL',
      },
    },
    liveLink: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PortfolioModel = mongoose.model("Portfolio", portfolioSchema);

// API - POST
app.post("/info", async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      image,
      githubLink,
      liveLink,
      isFeatured
    } = req.body;

    const newPortfolio = new PortfolioModel({
      title,
      description,
      technologies,
      image,
      githubLink,
      liveLink,
      isFeatured
    });

    const savedData = await newPortfolio.save();

    res.status(201).json({
      message: "Information recorded successfully",
      data: savedData
    });

  } catch (error) {
    res.status(400).json({
      message: "Failed to save portfolio info",
      error: error.message
    });
  }
});
// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
