

// var http = require('http');
// var fs = require('fs');

// // Create a server object
// // req is coming from the client side res is going to client as response from the server
// http.createServer(function (req, res) {
//   console.log(req.method);
//   console.log(req.url)

//   // Setting response headers
//   const headers = {
//     "access-control-allow-origin": "*",
//     'Access-Control-Allow-Headers': '*',
//     'Access-Control-Allow-Methods': '*',
//   }

  
//   if (req.method === "OPTIONS") {
//     res.writeHead(200, {
//       "access-control-allow-origin": "*",
//       'Access-Control-Allow-Headers': '*',
//       'Access-Control-Allow-Methods': '*',
//     })
//     res.end();
//     return;
//   }

//   // fetching users
//   if (req.url === "/users" && req.method === "GET") {
//     fs.readFile('data.json', function (err, data) {
//       res.writeHead(200, headers);
//       res.write(data);
//       return res.end();
//     });
//   }

//   // delete route -> id -> id -> fileread -> data filter id, data write file
//   else if(req.method === 'DELETE' && req.url.startsWith('/deleteUser')){
//     res.writeHead(200, headers)
//     const arr = req.url.split('/')
//     const id = arr[2]
//     console.log("HELLPO")
//     fs.readFile('data.json', (err, data) => {
//       if(err){
//         throw err
//       }else{
//         const userData = JSON.parse(data.toString())
//         console.log(userData)
//         const newUserData = userData.filter((obj) => obj.id != id)
//         console.log(newUserData)
//         fs.writeFile('data.json', JSON.stringify(newUserData), (err, data) => {
//           if(err){
//             throw err
//           }else{
            
//             res.write(JSON.stringify(newUserData))
//             res.end()
//           }
//         })
//       }
//     })
//   }

//   // creating new users
//   else if (req.url === "/users/create" && req.method === 'POST') {
//     var id = 100;
//     let postRequestBody = '';

//     req.on('data', (chunk) => {
//       postRequestBody += chunk.toString();
//     });

//     req.on('end', () => {
//       // Parsing request body
//       const data = JSON.parse(postRequestBody);

//       // Reading data from file
//       fs.readFile('data.json', (err, fileData) => {
//         if (err) {
//           console.log(err);
//           res.writeHead(500, headers);
//           res.end('Internal server error');
//           return;
//         }
//         // Parsing file data
//         const records = JSON.parse(fileData);

//         // Adding new record to records array
//         const newUser = { id: id++, ...data }; // Add a unique id to the new user object
//         records.push(newUser);

//         // Writing updated records array to file
//         fs.writeFile('data.json', JSON.stringify(records), (err) => {
//           if (err) {
//             console.log(err);
//             res.writeHead(500, headers);
//             res.end('Internal server error');
//             return;
//           }
//           // Sending response with the newly added record
//           const jsonResponse = JSON.stringify(data);
//           res.writeHead(200, headers);
//           res.end(jsonResponse);
//           return;
//         });
//       });
//     });
//   }

//   // editing users
//   else if (req.url.startsWith("/users/") && req.method === "PUT") {

//     let postRequestBody = "";
//     req.on("data", (chunk) => {
//       postRequestBody += chunk.toString();
//       console.log(postRequestBody)
//     });

//     req.on("end", () => {
//       // Parsing request body
//       const data = JSON.parse(postRequestBody);

//       // Reading data from file
//       fs.readFile("data.json", (err, fileData) => {
//         if (err) {
//           console.log(err);
//           res.writeHead(500, headers);
//           res.end("Internal server error");
//           return;
//         }

//         try {
//           // Parsing file data
//           const users = JSON.parse(fileData);

//           // Find the user to update
//           const id = parseInt(req.url.split("/")[2]);
//           const userToUpdate = users.find((u) => u.id === id);

//           // Update the user data
//           userToUpdate.username = data.username;
//           userToUpdate.email = data.email;
//           userToUpdate.phone = data.phone;

//           // Write the updated data back to the file
//           var newdata=JSON.stringify(users)
//           fs.writeFile("data.json", newdata, (err) => {
//             if (err) {
//               console.log(err);
//               res.writeHead(500, headers);
//               res.end("Internal server error");
//               return;
//             }

//             // Sending response with the newly updated record
//             // const jsonResponse = JSON.stringify(userToUpdate);
//             res.writeHead(200, headers);
// console.log(newdata)
//             res.end(newdata);
//           });
//         } catch (err) {
//           console.log(err);
//           res.writeHead(500, headers);
//           res.end("Error parsing JSON data");
//           return;
//         }
//       });
//     });
//   }
//   else {
//     console.log('error')
//   }
// }).listen(8001);



