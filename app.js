const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

//ใช้ดึงข้อมูลจาก form submit
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

//** */set up mongoDB***//
mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});
const articleSchema={
    title:String,
    content:String
}
const Article=mongoose.model("Article",articleSchema);
//** */set up mongoDB***//


//กรณี url เหมือนกัน แต่ทำหน้าที่ต่างกัน สามารถใช้ app.route 
//มาช่วยลดความซับซ้อนของโคดได้
//https://expressjs.com/en/guide/routing.html
//app.route()
app.route("/articles")

//****************ดึงบทความทั้งหมด*********************** */
.get(function(req,res) {
  //https://mongoosejs.com/docs/api.html#model_Model.find
  Article.find(function(err,foundArticles) {
    // console.log(foundArticles);
    if(!err){
      res.send(foundArticles);
    } else {
      res.send(err);
    }
  })
})

// ****************สร้าง 1 บทความ******************
.post(function (req,res) {
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  //https://mongoosejs.com/docs/models.html
  newArticle.save(function (err) {
    if(!err){
      res.send("Successfully new article");
    } else {
      res.send(err);
    }
  });
})

//*************Deletes all articles */
.delete(function (req,res) {
  Article.deleteMany(function (err) {
    if(!err){
      res.send("Sucess deleted all articles.")
    } else {
      res.send(err);
    }
  });
});


//********Requests Targetting A Specific Article
//https://expressjs.com/en/guide/routing.html
//Route parameters

//localhost:3000/articles/jQuery
app.route("/articles/:articleTitle")
//req.params.articleTitle = "jQuery"
.get(function (req, res) {
  const articleTitle=req.params.articleTitle
  Article.findOne({title:articleTitle},function (err,foundArticle) {
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("No articles matching");
    }
  })
})

//*************update article เขียนทับ */
.put(function (req, res) {
  const articleTitle=req.params.articleTitle
  Article.update(
    {title:articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function (err) {
      if(!err){
        res.send("Sucessfully update");
      }
    }
    );
})

//*************update article แบบเลือก แต่ข้อมูลเก่ายังอยู่*/
.patch(function (req,res) {
  const articleTitle=req.params.articleTitle
  
  Article.update(
    {title:articleTitle},
    {$set:req.body},
    function (err) {
      if(!err){
        res.send("Sucessfully updated")
      }else{
        res.send(err)
      }
    }
  );
})

// https://mongoosejs.com/docs/api.html#model_Model.deleteOne
.delete(function (req,res) {
  const articleTitle=req.params.articleTitle
  Article.deleteOne(
    {title:articleTitle}, //condition
    function (err) {      //callback
      if(!err){
        res.send("successfully deleted")
      }else{
        res.send(err)
      }
    }
  );
});


  




app.listen(3000, function() {
  console.log("Server started on port 3000");
});