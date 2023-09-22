var express = require("express");
var app = express();
var port = process.env.PORT || 9090;
var mongodb = require("mongodb").MongoClient;
var cors = require("cors");
var connection = mongodb.connect("mongodb+srv://vrajesh:vrajesh2001@cluster0.gwhxuv9.mongodb.net/");
require('dotenv').config();
app.use(express.json());    
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.static(__dirname+"/build"));
app.get("/get_data",(req,res)=>{
    connection.then(function(connect){
        console.log("Database connected successfuly to the server");
        var Database = connect.db("prasang_photo_studio");
        Database.collection("section_data").find().toArray().then(function(data){
            res.json(data);
        }).catch(function(err){
            console.log("Error");
        })
    }).catch(function(err){
        console.log("Error");
    });
});
app.get("/:id/get_data",(req,res)=>{
    connection.then(function(connect){
        console.log("database connected succesfully to server")
        var Database = connect.db("prasang_photo_studio");
        Database.collection("section_data").findOne({section_id:req.params.id}).then(function(data){
            res.json(data)
        }).catch(function(err){
            console.log("Error")
        })
    }).catch(function(err){
        console.log("Error");
    })
})
app.post("/:id/insert_album",(req,res)=>{
    connection.then(function(connect){
             var database = connect.db("prasang_photo_studio")
             database.collection("section_data").updateOne({section_id:req.params.id},{$push:{
                 section_data:req.body
             }}).then(function(data){
                res.json({"status":"img successfully uploaded in album"})
                console.log(data)
             }).catch(function(err){
                 console.log("Error")
             })
         }).catch(function(err){
             console.log("Error")
         })
});
app.post("/:id/post_data",(req,res)=>{
    console.log(req.body)
     connection.then(function(connect){
         console.log("Database connected successfuly to the server");
         var Database = connect.db("prasang_photo_studio");
         Database.collection("section_data").updateOne({section_id:req.params.id},{$push:{
             section_data:req.body
         }}).then(function(data){
             res.json(data);
         }).catch(function(err){
             console.log("Error");
         })
     }).catch(function(err){
         console.log("Error");
     });
})
app.post("/:id/delete_img",(req,res)=>{
    console.log(req.params.id,req.body.section_id)
     connection.then(function(connect){
              var database = connect.db("prasang_photo_studio")
              database.collection("section_data").updateOne({section_id:req.body.section_id},{
                  $pull:{
                      section_data:{
                          "img_id":req.params.id
                      }
                  }
              }).then(function(data){
                  console.log(data)
                  res.json({"status":"album image deleted successfully"})
              }).catch(function(err){
                  console.log("Error")
              });
          }).catch(function(err){
              console.log("Error");
          })
})
app.post("/admin_login",(req,res)=>{
    if(req.body.admin=="NikunjBhimani" && req.body.password=="Prasang.Photo"){
        res.json({"status":"admin access"})
    }
    else{
        res.json({"status":"invalid admin"});
    }
});
app.post("/:id/delete_section",(req,res)=>{
    console.log(req.params.id)
    connection.then(function(connect){
        var Database = connect.db("prasang_photo_studio");
        Database.collection("section_data").deleteOne({section_id:req.params.id}).then(function(res_data){
            res.json({"Status":"Section deleted successfully"});
        }).catch(function(err){
            console.log("Error");
        })
    }).catch(function(err){
        console.log("Error");
    })
});
app.post("/create_section",(req,res)=>{
    var req_body = {
        section_name:req.body.section_name,
        section_img_url:req.body.section_img_url,
        section_id:req.body.section_id,
        section_data:[]
    }
    connection.then(function(connect){
        console.log("Database connected successfuly to the server");
        var Database = connect.db("prasang_photo_studio");
        Database.collection("section_data").insertOne(req_body).then(function(data){
            console.log(data);
            res.json({"reply":"data added successfully"})
        }).catch(function(err){
            console.log("Error");
        });
    }).catch(function(err){
        console.log("Error");
    })
});
app.listen(port,(err)=>{
    if(err){
        console.log("Error");
    }
    else{
        console.log("Server is running on "+port)
    }
});
