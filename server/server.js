var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jsonfile = require('jsonfile');
var user_file = './students.json';
var tag_file = './tag.json';
var students;
var tags;

function associateTag(id, name, email){
  jsonfile.readFile(tag_file, function(err, obj) {
    tags = obj;
    let found = 0;
    let foundStudent = 0;
    for (i = 0; i < tags.length; i++) {
      if(tags[i].id==id){
        found=1;
        tags[i].name = name;
      }
    }
    if(found==0){
      let newTag = {"id": id,"name":name};
      tags.push(newTag);
    }
    jsonfile.writeFile(tag_file, tags, function (err) {
      if(err){
        console.error(err);
      }
    })
    jsonfile.readFile(user_file, function(err, obj) {
      students = obj;
      for (i = 0; i < students.length; i++) {
        if(students[i].name==name){
          foundStudent = 1;
         }
      }
      if(foundStudent==0){
        let newStudent = {"name":name,"email":email,"data":""};
        students.push(newStudent);
      }
      jsonfile.writeFile(user_file, students, function (err) {
        if(err){
          console.error(err);
        }
      })
    })
  })
}

function manageTag(id,newdata){
  jsonfile.readFile(tag_file, function(err, obj) {
    tags = obj;
    let foundTag = 0;
    let foundStudent = 0;
    let studentName = "";
    for (i = 0; i < tags.length; i++) {
      if(tags[i].id==id){
        foundTag=1;
        studentName = tags[i].name;
      }
    }
    if(foundTag==1){
      jsonfile.readFile(user_file, function(err, obj) {
        students = obj;
        for (i = 0; i < students.length; i++) {
          if(students[i].name==studentName){
            foundStudent = 1;
            if(!students[i].data){
              students[i].data = newdata;
            }
            else if(!students[i].data.includes(newdata)){
              newdata = students[i].data + "," + newdata;
              students[i].data = newdata;
            }
           }
        }
        if (foundStudent==0){
          console.log("Name not Associated!")
        }
        else{
          let msg = {"name": studentName, "data":newdata};
          io.emit('update', msg);
        }
        jsonfile.writeFile(user_file, students, function (err) {
          if(err){
            console.error(err);
          }
        })
      })
    }
    else{
      console.log("Tag not Associated!")
    }
  })
}

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});


io.on('connection', function(socket){

  console.log("Booth Connected!")

  socket.on('scan', function(msg){
    msg = JSON.parse(msg);
    console.log("Scan Recieved:");
    manageTag(msg.id,msg.station);
  });

  socket.on('broadcast', function(msg){
    msg = JSON.parse(msg);
    console.log("Broadcast Recieved:");
    let dat = {"name": "!broadcast", "data": msg.display};
    io.emit('update', dat);
  });

  socket.on('register', function(msg){
    msg = JSON.parse(msg);
    console.log("Registration Recieved:")
    associateTag(msg.id, msg.name, msg.email);
  });

  socket.on('disconnect', function(msg){
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
