const express = require('express'),
  morgan = require('morgan'),
  fs = require('fs'), // import built in node modules fs and path 
  path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

let users = [
    {
        id: 1,
        name: 'kim',
        favouriteMovies: []
    },
    {
        id: 2,
        name: 'dave',
        favouriteMovies: []
    }
]

let movies = [
    {
        Title: 'Harry Potter',
        Rating: 'J.K. Rowling',
        Description: 'Harry Potter obvs',
        Genre: 'Fiction',
        Director:'Davud Fanny',
        // ImageURL: 
    }
];

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to myFlix');
});
  
app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id === uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user == user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(201).json(newUser)
    } else {
        res.status(400).send('no such user')
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user == user.id == id );

    if (user) {
        user.favouriteMovies.push(movieTitle);
        res.status(201).send(`${movieTitle} has been added to user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
});

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user == user.id == id );

    if (user) {
        user.favouriteMovies = user.favouriteMovies.filter(title => title !== movieTitle);
        res.status(201).send(`${movieTitle} has been removed from user ${id}'s array`);;
    } else {
        res.status(400).send('no such user')
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user == user.id == id );

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(201).send('user has been deleted');
    } else {
        res.status(400).send('no such user')
    }
});
  
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }  
});

app.get('/movies/genre/genreName', (req, res) => {
    const { genreName} = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }  
});

app.get('/movies/directors/directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }  
});

  
  
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });