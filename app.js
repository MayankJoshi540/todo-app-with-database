
require("dotenv").config();
const express = require("express");
const methodOverride = require("method-override");
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));

//connecting mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

// Designing the scheme & model
const trySchema = new mongoose.Schema({
  name: String,
  completed: {
    type: Boolean,
    default: false,
  },
});
const item = mongoose.model("task", trySchema);

// Creating Todo By our Own
// const todo1 = new item({
//   name : "Hello Maayank"
// })
// todo1.save();

//Get Request
app.get("/", async (req, res) => {
  try {
    const foundItem = await item.find({}, "name completed");
    res.render("list", { items: foundItem });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching items.");
  }
});

//post request
app.post("/", (req, res) => {
  const itemName = req.body.name;
  const todo = new item({
    name: itemName,
  });
  todo.save();
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const id = req.body.id;
  try {
    await item.findByIdAndDelete(id);
    res.redirect("/?msg=Task+Deleted+Successfully");
  } catch {
    res.status(500).send("error Fetching");
  }
});

app.post("/delete-completed", async (req, res) => {
  const { ids } = req.body;
  try {
    await item.deleteMany({ _id: { $in: ids } });
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting completed tasks.");
  }
});
app.put("/edit",(req,res)=>{
  const itemId = req.body.index;
  const todo = req.body.value;
  res.render("edit",{value : todo, itemId : itemId })
})
app.put("/update", async(req,res)=>{
  const itemId = req.body.itemId;
  const updatedItem = req.body.updatedItem
  try{
    await item.findByIdAndUpdate(itemId,{name : updatedItem});
    res.redirect("/")
  }
  catch{
    console.log("noooooo!");
  }
})

app.post("/update-status", async (req, res) => {
  const { id, completed } = req.body;
  try {
    await item.findByIdAndUpdate(id, { completed: completed === "true" });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating task status.");
  }
});
const PORT = process.env.PORT || 3000;
// listening to port
app.listen(PORT, () => {
  console.log(`App is Live At http://localhost:3000`);
});
