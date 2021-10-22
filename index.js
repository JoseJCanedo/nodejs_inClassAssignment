let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
const ToDo = require('./models/todo.model');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended : true}));

//connection to mongo

const mongoDB = 'mongodb+srv://admin:admin@cluster0.iqnde.mongodb.net/todo?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:   '))

let tasks = ['wake up', 'eat breakfast', 'brs'];
let completed = [];

app.get('/', function(request, response){
    response.render('index', {tasks: tasks, completed: completed});
});

app.post('/addToDo', function(req, res){
    let newTodo = new ToDo({
        item: req.body.newtodo,
        done: false
    })
    newTodo.save(function(err, todo){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})

app.post('/removeToDo', function(req, res){
    const remove = req.body.check;
    if(typeof remove === 'string'){
        ToDo.updateOne({item:remove},{done:true}, function(err){
            if(err){
                console.log(err);
            } else {
                res.redirect('/');
            }
        })
    } else if(typeof remove === "object"){
        for( var i=0; i< remove.length; i++){
            ToDo.updateOne({item:remove[i]},{done:true}, function(err){
                if(err){
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
        }
    }
})

app.post('/deleteToDo', function(req, res){
    const deleteTask = req.body.delete;
    if(typeof deleteTask === 'string'){
        completed.splice( completed.indexOf(deleteTask) , 1);
    } else if(typeof deleteTask === "object"){
        for( var i=0; i< deleteTask.length; i++){
            completed.splice( completed.indexOf(deleteTask[i]) , 1);
        }
    }
    res.redirect('/')
})

app.listen(3000, function(){
    console.log('App is running on port 3000!')
})