const User= require("./schema")
const express = require("express");
const app = express();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose=require("mongoose");
const dotenv= require("dotenv");
dotenv.config();
//Connecting with database
mongoose.connect(process.env.db_url);
const db= mongoose.connection;
db.on("connected", ()=>console.log("DB connected Successfully"))
db.on("error", ()=>console.log("Error in db connection", err))

app.use(cookieParser());
app.use(express.json());
let corsoption = {
  origin: "http://localhost:3000", //origin from where you requesting
  credentials: true,
};
app.use(cors(corsoption));

// database

const secretKey = "maimoona";

// app.options("/login", cors());

// Setting response headers
// app.use((req, res, next) => {
//   res.set({
//     "Access-Control-Allow-Origin": "http://localhost:5000",
//     "Access-Control-Allow-Headers": "Content-Type: application/json",
//     "Access-Control-Allow-Methods": "*",
//     "Access-Control-Allow-Credentials": true,
//   });
//   next();
// });

app.post("/signup", (req, res) => {
  //data file/database store
});

app.post("/login", (req, res) => {
  //code
  const user = req.body;
  console.log({ user });
  //check login details correct
  //file read => will check each object with the body details
  fs.readFile("login.json", (err, data) => {
    if (err) {
      throw err;
    }
    const newData = JSON.parse(data);
    const matchedUser = newData.find((obj) => obj.email == user.email);
    console.log({ matchedUser });
    if (matchedUser != null) {
      console.log("hellp");
      if (matchedUser.password == user.password) {
        //code
        //jwt token create
        const token = jwt.sign(user, secretKey, { expiresIn: "3600s" });
        // res.status(200).send(token)
        console.log({ token });
        res
          .cookie("token", token)
          .status(200)
          .send({ message: "login successfully" });
      }
    } else {
      res.status(401).send({ message: "login details not correct" });
    }
  });
});

//middleware -> check that if the token is correct or not
const verifyToken = function (req, res, next) {
  const authHeader = req.cookies;
  console.log({ authHeader });
  //token ->. verify -> next() -> error
  if (!authHeader.token) {
    res.status(401).send({ message: "Invalid token" });
    return;
  }
  jwt.verify(authHeader.token, secretKey, (err, authData) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
    } else {
      req.authData = authData;
      next();
    }
  });
};

// fetching users
app.get("/users", async (req, res) => {
  const getUsers= await User.find();
  res.json(getUsers); 
  // fs.readFile("data.json", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send({ message: "Internal server error" });
  //     return;
  //   }
  //   const newData = JSON.parse(data);
  //   res.status(200).send(newData);
  // });
});

// delete route -> id -> id -> fileread -> data filter id, data write file
app.delete("/deleteUser/:id", async (req, res) => {
  const id = req.params.id;
  await User.deleteOne({_id:id})
  const newUser = await User.find()
  res.send(newUser)
  // fs.readFile("data.json", (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send("Internal server error");
  //     return;
  //   }
  //   const userData = JSON.parse(data.toString());
  //   const newUserData = userData.filter((obj) => obj.id != id);
  //   fs.writeFile("data.json", JSON.stringify(newUserData), (err) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send("Internal server error");
  //       return;
  //     }
  //     res.status(200).send(JSON.stringify(newUserData));
  //   });
  // });
});
// creating new users
app.post("/users/create", async (req, res) => {
  const newUser = await User.create(req.body)
  res.status(200).send({ message: "User addded successfully" });

  // console.log({ postdata });

  // fs.readFile("data.json", (err, fileData) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send("Internal server error");
  //     return;
  //   }

  //   const records = JSON.parse(fileData);
  //   const id = records.length + 1;
  //   const postData = { ...postdata, id };
  //   records.push(postData);
  //   // res.send(records)
  //   fs.writeFile("data.json", JSON.stringify(records), (err) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send("Internal server error");
  //       return;
  //     }
  //     res.status(200).send({ message: "User addded successfully" });
  //   });
  // });
});

// editing users
app.put("/users/:id", async (req, res) => {
  let userId = req.params.id;
  console.log({userId})

 let conditions = {
  _id : userId 
 }

 console.log(req.body.username)

 let update = {
  username: req.body.username,
  email :req.body.email,
  phone: req.body.phone,
  gender: req.body.gender

 }

  const user = await User.findByIdAndUpdate(conditions,update);
  // // user.save()
  res.send(user)
  // let postRequestBody = "";
  // req.on("data", (chunk) => {
  //   postRequestBody += chunk.toString();
  // });
  // req.on("end", () => {
  //   const data = JSON.parse(postRequestBody);
  //   fs.readFile("data.json", (err, fileData) => {
  //     if (err) {
  //       console.log(err);
  //       res.status(500).send("Internal server error");
  //       return;
  //     }
  //     const records = JSON.parse(fileData);
  //     const id = req.params.id;
  //     const userIndex = records.findIndex((obj) => obj.id == id);
  //     if (userIndex === -1) {
  //       res.status(404).send("User not found");
  //       return;
  //     }
  //     const updatedUser = { ...records[userIndex], ...data };
  //     records[userIndex] = updatedUser;
  //     fs.writeFile("data.json", JSON.stringify(records), (err) => {
  //       if (err) {
  //         console.log(err);
  //         res.status(500).send("Internal server error");
  //         return;
  //       }
  //       res.status(200).send(JSON.stringify(updatedUser));
  //     });
  //   });
  // });
});

// Starting server
app.listen(8001, () => {
  console.log("Server started on port 8001");
});
