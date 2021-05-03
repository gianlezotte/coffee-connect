var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

client.connect();

var app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/welcome.html'));
});

app.get('/login', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var pswrepeat = request.body.pswrepeat;
    var email = request.body.email;

    if (username && password && email) {

        if (password == pswrepeat) {
            client
                .query ('INSERT INTO public.accounts(username, password, email) VALUES ($1, $2, $3)', [username, password, email]).then(res => {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/profile');
            });
        }
        else {
            //alert('passwords do not match');
        }

    }

    else if (username && password) {
        client
            .query('SELECT * FROM public.accounts WHERE username = $1 AND password = $2', [username, password]).then(res => {
            console.log(res.rows[0]);
            if (res.rows[0]) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/profile');
            } else {
                //alert('Incorrect Username and/or Password!');
                response.redirect('/login');
            }			
            response.end();
        });
    }

    else {
        response.send('Please enter Username and Password!');
        response.end();
    }
});

app.get('/home', function(request, response) {
    response.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/register', function(request, response) {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

app.get('/profile', function(request, response) {
    response.render('profile', {user: request.session.username});
});

app.get('/friendsfeed', function(request,response) {
    client.query('SELECT username, post, postdate FROM public.posts ORDER BY postdate DESC LIMIT 5').then(res => {
        console.log(res);
        response.render('friendsfeed', {userData: res.rows});
    })

});

app.post('/postcontent', function(request, response) {
    console.log(request.session.username);
    var username = request.session.username;
    var postContent = request.body.postContent;
    var curDate = new Date();

    client
        .query ('INSERT INTO public.posts(postid, username, post, postdate) VALUES (DEFAULT, $1, $2, $3)', [username, postContent, curDate]).then(res => {
        response.redirect('friendsfeed');
    });
});