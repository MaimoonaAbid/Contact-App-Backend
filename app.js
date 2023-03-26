const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

const secretKey = 'maimoona'

// Setting response headers
app.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
  });
  next();
});



app.post('/signup', (req, res) => {
  //data file/database store
})

app.post('/login', (req, res) =>{
  //code
  const user = req.body
  console.log({user})
  //check login details correct
  //file read => will check each object with the body details
  fs.readFile('login.json', (err, data) => {
    if(err){
      throw err
    }
    const newData = JSON.parse(data)
    const matchedUser = newData.find((obj) => obj.email == user.email)

    if(matchedUser != null){
      if(matchedUser.password == user.password){
          //code
          //jwt token create
          const token = jwt.sign(user, secretKey, { expiresIn: "3600s" })
          // res.status(200).send(token)
          res.cookie("token", token).status(200).send({message: 'login successfully'})
      }
    }else{
      res.status(401).send({message: 'login details not correct'})
    }
  })
})

//middleware -> check that if the token is correct or not
const verifyToken = function(req, res, next){
  const authHeader = req.cookies;
  console.log({authHeader})
  //token ->. verify -> next() -> error
  if(!authHeader.token){
    res.status('401').send({message: 'Invalid token'})
    return 
  }
  jwt.verify(authHeader.token, secretKey, (err, authData) => {
    if (err) {
      res.status(401).send({message: 'Invalid token'});
    } else {
      req.authData = authData;
      next();
    }
  });

}

// fetching users
app.get('/users', verifyToken, (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
      return;
    }
    const newData = JSON.parse(data)
    res.status(200).send(newData);
  });
});

// delete route -> id -> id -> fileread -> data filter id, data write file
app.delete('/deleteUser/:id', verifyToken,  (req, res) => {
  const id = req.params.id;
  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send('Internal server error');
      return;
    }
    const userData = JSON.parse(data.toString());
    const newUserData = userData.filter((obj) => obj.id != id);
    fs.writeFile('data.json', JSON.stringify(newUserData), (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
        return;
      }
      res.status(200).send(JSON.stringify(newUserData));
    });
  });
});

// creating new users
// app.post('/users/create', (req, res) => {
//   var id = 100;
//   let postRequestBody = '';
//   req.on('data', (chunk) => {
//     postRequestBody += chunk.toString();
//   });
//   req.on('end', () => {
//     const data = JSON.parse(postRequestBody);
//     fs.readFile('data.json', (err, fileData) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Internal server error');
//         return;
//       }
//       const records = JSON.parse(fileData);
//       const newUser = { id: id++, ...data };
//       records.push(newUser);
//       fs.writeFile('data.json', JSON.stringify(records), (err) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send('Internal server error');
//           return;
//         }
//         res.status(200).send(JSON.stringify(data));
//       });
//     });
//   });
// });
// creating new users
app.post('/users/create', (req, res) => {
  const postdata = req.body
  console.log({postdata})
  
  fs.readFile('data.json', (err, fileData) => {
    if (err) {
          console.log(err);
          res.status(500).send('Internal server error');
          return;
        }
       
        const records = JSON.parse(fileData);
        const id = records.length + 1
        const postData = {...postdata, id}
        records.push(postData)
        // res.send(records)
        fs.writeFile('data.json', JSON.stringify(records), (err) => {
          if (err) {
            console.log(err);
            res.status(500).send('Internal server error');
            return;
          }
          res.status(200).send({message: 'User addded successfully'});
        });
    });
  })


// editing users
app.put('/users/:id', (req, res) => {
  let postRequestBody = '';
  req.on('data', (chunk) => {
    postRequestBody += chunk.toString();
  });
  req.on('end', () => {
    const data = JSON.parse(postRequestBody);
    fs.readFile('data.json', (err, fileData) => {
      if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
        return;
        }
        const records = JSON.parse(fileData);
        const id = req.params.id;
        const userIndex = records.findIndex((obj) => obj.id == id);
        if (userIndex === -1) {
        res.status(404).send('User not found');
        return;
        }
        const updatedUser = { ...records[userIndex], ...data };
        records[userIndex] = updatedUser;
        fs.writeFile('data.json', JSON.stringify(records), (err) => {
        if (err) {
        console.log(err);
        res.status(500).send('Internal server error');
        return;
        }
        res.status(200).send(JSON.stringify(updatedUser));
        });
        });
        });
        });
        
        // Starting server
        app.listen(8001, () => {
        console.log('Server started on port 8001');
        });
        
        
        
        
        
         
