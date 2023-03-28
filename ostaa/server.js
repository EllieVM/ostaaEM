const express = require("express");
const app = express();
const port = 80;
const mongoose = require('mongoose');

const connectionString = 'mongodb://127.0.0.1:27017/ostaadb';

mongoose.connect(connectionString, { useNewUrlParser: true });

mongoose.connection.on('error', () => {
    console.log('CONNECTION ERROR');
});

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  listings: [Object], 
  purchases: [Object]
});

const ItemSchema = new Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
  stat: String
});

const Users = mongoose.model('Users', UserSchema );
const Items = mongoose.model('Items', ItemSchema);

Users.db.collection('users').deleteMany({});
Items.db.collection('items').deleteMany({});

app.use(express.static('public_html'));
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}/`);
});

//add user
app.post('/add/user', (req, res) => {
    let name = req.body.username;
    let pass = req.body.password;

    //ensures a user with the name does not already exist, 
    //then adds the user to the database
    Users.find({username: name}).then((result) => {
        if (result.length == 0){
            var user = new Users({
                username: name,
                password: pass,
                listings: [],
                purchases: []
            });
        
            let p = user.save();
            p.catch((err) => {
                console.log(err);
            });
        
            p.then(() => {
                console.log('User Added!');
            });
        
            res.end("User "+name+" Added");
        } else {
            console.log('User already exists');
            res.end('User already exists');
        }
    });
});

//add item
app.post('/add/item/:username', (req, res) => {
    let user = req.params.username;
    let t = req.body.title;
    let d = req.body.desc;
    let i = req.body.img;
    let p = Number(req.body.price);
    let s = req.body.stat;

    Users.findOne({username: user}).then((result) => {
        if (result == null){
            console.log('No user found to add a listing to');
            res.end('No user found to add a listing to. Item was not added to database');
        }
        else {
            var item = new Items({
                title: t,
                description: d,
                image: i,
                price: p,
                stat: s
            });

            item.save().catch((err) => {
                console.log(err);
            }).then((thisItem) => {
                console.log('Item Added! ' + typeof(thisItem._id) + ' id: ' + thisItem._id);
                var id = thisItem._id;
                let a = result.listings.push(id);
                console.log(a + ' Item added to user listings\n');
                result.save().catch((err) => console.log(err)).then((saved) => {
                    res.end('Item added to user listings');
                });
            });
        }
    });
});

//get users
app.get('/get/users', (req, res) => {
    Users.find({}).then((result) => {
        console.log('\nUSERS\n'+ result);
        res.json(result);
    });
});

//get items
app.get('/get/items', (req, res) => {
    Items.find({}).then((result) => {
        console.log('\nITEMS\n'+ result);
        res.json(result);
    });
});

//get listings of user
app.get('/get/listings/:username', (req, res) => {
    let user = req.params.username;

    var list = [];
    Users.findOne({username: user}, 'listings').then(async (result) => {
        if (result != null){
            for (var i = 0 ; i < result.listings.length ; i++){
                var id = result.listings[i];
                console.log('id to find: '+id);
                var item = await Items.findById(id);
                list.push(item);
            }
            console.log("LISTINGS\n"+list);
            res.json(list);
        }
        else {
            res.end('User '+user+' does not exist');
        }
    });
});

//get purchases of user
app.get('/get/purchases/:username', (req, res) => {
    let user = req.params.username;

    var list = [];
    Users.findOne({username: user}, 'purchases').then(async (result) => {
        if (result != null){
            for (var i = 0 ; i < result.purchases.length ; i++){
                var id = result.purchases[i];
                var item = await Items.findById(id);
                list.push(item);
            }
            console.log("PURCHASES\n"+list);
            res.json(list);
        }
        else {
            res.end('User '+user+' does not exist');
        }
    });
});

//search users
app.get('/search/users/:keyword', (req, res) => {
    let key = req.params.keyword;

    Users.find({username: {$regex: key}}).then((result) => {
        console.log('\nUSERS\n'+ result);
        res.json(result);
    });
});

//search items
app.get('/search/items/:keyword', (req, res) => {
    let key = req.params.keyword;

    Items.find({description: {$regex: key}}).then((result) => {
        console.log('\nITEMS\n'+ result);
        res.json(result);
    });
});