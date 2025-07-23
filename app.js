require("dotenv").config(); 
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//connecting mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

// Designing the scheme & model
const trySchema = new mongoose.Schema({
  name: String,
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
    const foundItem = await item.find({}, "name");
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
app.post("/edit",(req,res)=>{
  const itemId = req.body.index;
  const todo = req.body.value;
  res.render("edit",{value : todo, itemId : itemId })
})
app.post("/update", async(req,res)=>{
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
const PORT = process.env.PORT || 3000;
// listening to port
app.listen(PORT, () => {
  console.log(`App is Live At http://localhost:3000`);
});
