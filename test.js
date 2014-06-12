var http = require('http');
var express = require('express');
var database;


// verificate that there is a user with username as ":username" and password as ":password".
/*
function verification(req, res) {

console.log("authoritation"+req.params.username+":"+req.params.password);
database.collection("user").find({username:req.params.username, password:req.params.password}).toArray(function(error, docs) {
        assert.equal(null, error);
        console.log(docs);

    if('jsonp' in req.query) {
        res.jsonp(docs)
    } else {
        res.json(docs)
    }
        });
}
// Operate about User.

// getting a user depending on uid.
function getUser(req, res) {

    database.collection("user").find({uid:req.params.id}).toArray(function(error, docs) {
        assert.equal(null, error);
        console.log(docs);

    if('jsonp' in req.query) {
        res.jsonp(docs)
    } else {
        res.json(docs)
    }
        });
}

// List all users.
function listUsers(req, res) {
    database.collection("user").find().toArray(function(error, docs) {
        assert.equal(null, error);
        console.log(docs);

        if('jsonp' in req.query) {
            res.jsonp(docs) // little difference here, callback is always "callback"
        } else {
            res.json(docs)
        }
    });

}

//Insert a user. uid is given as the maximum number +1. friends is given as themselves at beginning.
//username, password and gender are set as :username, :password, :gender
function insertUser(req, res) {
    var max = 0;
    database.collection("user").find().toArray(function(error,docs){
        assert.equal(null, error);

        for(var i =0; i < docs.length; i++){
        if (parseInt(docs[i].uid) > max)
       {
           max = parseInt(docs[i].uid);   //doc
       }
        console.log(docs[i].uid);
    }
        console.log(max+"insert");
        max++;
        database.collection("user").insert(
            {
                uid: max+"",
                username : req.params.username,
                password : req.params.password,
                gender :  req.params.gender,
                friends : [max+""],
                photo :req.params.photo
            },
            function(error, result) {
                assert.equal(null, error);
                console.log(result);
            }
        );
    });
}


// Delete a user depending on uid.
function delUser(req, res) {
    console.log("delete");
    database.collection("user").remove(
        {
            uid: req.params.id},
        function(error, result) {
            assert.equal(null, error);
            console.log(result);
        }
    );
}

//Update a user depending on uid.
function updateUser(req, res) {
    console.log("update");
    database.collection("user").update(
        {
            uid: req.params.id },{
            $set:{password :req.params.password}
        },
        function(error, result) {
            assert.equal(null, error);
            console.log(result);
        }
    );
}

*/


// main()

var mysql      = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'test'
   
});

//create tables
//TEST_TABLE = 'test1';
//db.query(  
//  'CREATE TABLE '+TEST_TABLE+  
//  '(id INT(11) AUTO_INCREMENT, '+  
//  'title VARCHAR(255), '+  
//  'text TEXT, '+  
//  'created DATETIME, '+  
//  'PRIMARY KEY (id))'  
//);  



//list items in axis
function list(req, res) {
db.query(  
  'SELECT * FROM axis ',  
  function selectCb(err, results, fields) {    
 console.log(results);

        if('jsonp' in req.query) {
            res.jsonp(results)
        } else {
            res.json(results)
        }
   
  }  
);  
}
//get a certain item by id
function get(req, res) {
db.query(  
  'SELECT * FROM axis WHERE id = ' +  req.params.id,  
  function selectCb(err, results, fields) {    
//assert.equal(null, err);
        console.log(results.length);

        if('jsonp' in req.query) {
            res.jsonp(results)
        } else {
            res.json(results)
        }
    
  }  
);  
}
//insert into axis
//param field and value: field is the Column Name which is the only column will be valued when the new item added.
function insert(req, res) {
var field = "Long_text";
var value = "1";
var cmd = 'INSERT INTO axis SET '+req.params.field+'="'+req.params.value+'"';
console.log(cmd);
db.query(cmd, function(err, rows, fields){
if (err) {  
      throw err;  
    }
}
);  
}

//delete a certain item depending on id.
function deletel(req, res) {
    db.query(
        'SELECT * FROM axis WHERE id = ' +  req.params.id,
        function selectCb(err, results, fields) {
            console.log(results);

            if(results!=null){
                var cmd = 'DELETE FROM axis  WHERE id = ' +  req.params.id;
                console.log(cmd);
                db.query(cmd, function(err, rows, fields){
                    if (err) {
                        throw err;
                    }
                });
            }
            else{
                console.log("not exist!!!!!");
            }
        }
    );



}
//update a item in axis
//param field, value, and id. update the column named "filed" which is the item with id == "id", the new value is "value".
function update(req, res) {
var cmd = 'UPDATE axis SET ' + req.params.field + ' = "' +  req.params.value + '" WHERE id = ' +  req.params.id;
  console.log(cmd);
  db.query(cmd, function(err, rows, fields){
   if (err) {  
      throw err;  
    }
  });
}
function insertAllData(req, res){
    var valuerow=  req.params.value.split("@");
    var values = new Array();

    for(var n = 0; n< req.params.sum; n++){
        values[n]= valuerow[n].split(",");
    }
    var cmd;
    for(var n = 0; n< req.params.sum; n++){
            cmd = 'INSERT INTO axis (Long_text,Short_text,Number,Image,Date,Categories) VALUES("'+values[n][1]+'","'+values[n][2]+'","'+values[n][3]+'","'+values[n][4]+'","'+values[n][5]+'","'+values[n][6]+'")';
            console.log(cmd);

            db.query(cmd, function(err, rows, fields){
                if (err) {
                    throw err;
                }
            });
    }
}
function updateAllData(req, res) {
        var name =  req.params.field.split(",");
        var values = req.params.value.split(",");
        for(var m = 1; m< req.params.column; m++){
            if(m==3&&req.params.value[m]==null){
                req.params.value[m] = 0;
            }

                cmd = 'UPDATE axis SET ' + name[m] + ' = "' + values[m] + '" WHERE id = ' +  req.params.id;
                console.log(cmd);

                db.query(cmd, function(err, rows, fields){
                    if (err) {
                        throw err;
                    }
                });


    }

}

//database interact is used to record all the interactions of users.

// get all the interactions have been done by a certain user. Depending uid.
function getdatabase(req, res) {
    db.query(
        'SELECT * FROM interaction WHERE '+  req.params.uid,
        function selectCb(err, results, fields) {
            console.log(results.length);
            if('jsonp' in req.query) {
                res.jsonp(results)
            } else {
                res.json(results)
            }

        }
    );
}

//insert a interaction into interaction
function insertinteraction(req, res) {
    var field = req.params.column;
    var value = req.params.value;
    var uid = req.params.uid;
    var motion = req.params.motion;
    var table = req.params.table;
    var objectrecord = req.params.objectrecord;

    var cmd = 'INSERT INTO interaction (uid,motion,tablee,objectrecord,fieldd,value) VALUES('+uid+',"'+motion+'","'+table+'",'+objectrecord+',"'+field+'","'+value+'") ';
    console.log(cmd);
    db.query(cmd, function(err, rows, fields){
            if (err) {
                throw err;
            }


        }

    );
}

//delete all interactions have been done by a certain user.
function delinteraction(req, res) {
    var uid = req.params.uid;

    db.query(
        'SELECT * FROM interaction WHERE id = ' +  req.params.id,
        function selectCb(err, results, fields) {
            console.log(results);

            if(results!=null){
                var cmd = 'DELETE FROM interaction  WHERE id = ' +  req.params.id;
                console.log(cmd);
                db.query(cmd, function(err, rows, fields){
                    if (err) {
                        throw err;
                    }
                });
            }
            else{
                console.log("not exist!!!!!");
            }
        }
    );
}
var app = express()

app.use(express.json());
app.use(express.query());

// User
/*app.get('/listusers', listUsers);
app.get('/user/:id', getUser);
app.get('/verification/:username&:password', verification);
app.post('/insertuser/:username&:password&:gender&:photo', insertUser);
app.post('/deleteuser/:id', delUser);
app.post('/updateuser/:id&:password', updateUser);*/

//Record
app.get('/list', list);
app.get('/get/:id', get);
app.post('/insert/:field&:value', insert);
app.post('/deletel/:id', deletel);
app.post('/update/:id&:field&:value', update);
app.post('/updateall/:sum&:column&:field&:value&:id', updateAllData);
app.post('/insertall/:sum&:column&:field&:value', insertAllData);

//interaction

app.get('/getinteraction/:uid', getdatabase);
app.post('/insertinteractor/:uid&:motion&:table&:objectrecord&:column&:value', insertinteraction);
app.post('/delinteraction/:id', delinteraction);

app.use(express.static('content'));
app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');