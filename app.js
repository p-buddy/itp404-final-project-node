require('dotenv').config();

var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var cors = require('cors'); //cross origin research sharing
var bodyParser = require('body-parser');
var connect = require('connect');

//var music = require('./api/music');

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_HOST
});

app.use(cors());
app.use(bodyParser());


var User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

var Favorite = sequelize.define('favorite', {
  userId: {
    type: Sequelize.INTEGER,
    field: 'user_id'
  },
  favoriteId: {
    type: Sequelize.INTEGER,
    field: 'favorite_id'
  },
  artists: {
    type: Sequelize.STRING
  },
  link: {
    type: Sequelize.STRING
  }
}, {
  timestamps: false
});

var Artist = sequelize.define('artist', {
  artist: {
    type: Sequelize.STRING
  },
  information: {
    type: Sequelize.STRING
  },
  link: {
    type: Sequelize.STRING
  },
  typeCode: {
    type: Sequelize.INTEGER,
    field: 'type_code'
  },
  isPicture: {
    type: Sequelize.BOOLEAN
  }
}, {
  timestamps: false
});


app.get('/users', function (request, response) {
  var promise = User.findAll();
  promise.then(function(users) {
    response.json({
      data: users
    });
  });
});

app.get('/artists', function (request, response) {
  var promise = Artist.findAll();
  promise.then(function(artists) {
    response.json({
      data: artists
    });
  });
});

app.get('/artists/:id', function (request, response) {
  var promise = Artist.findAll();
  promise.then(function(artists) {
    response.json({
      data: artists,
      id: request.params.id
    });
  });
});

app.post('/artists', function(request, response) {
    var newArtist = Artist.build({
      artist: request.body.artist,
      information: request.body.information,
      link: request.body.link,
      typeCode: request.body.typeCode,
      isPicture: request.body.isPicture,
    });
    newArtist.save().then(function(artist) {
      response.json(artist);
    });
});

app.post('/favorites', function(request, response) {
    var newFavorite = Favorite.build({
      userId: request.body.userId,
      favoriteId: request.body.favoriteId,
      artists: request.body.artists,
      link: request.body.link
    });
    newFavorite.save().then(function(favorite) {
      response.json(favorite);
    });
});

app.delete('/favorites/:id', function(request, response) {
  Favorite.findById(request.params.id).then(function(favorite) {
    if (favorite) {
      favorite.destroy().then(function(favorite) {
        response.json(favorite);
      });
    } else {
      response.status(404).json({
        message: 'Favorite not found'
      });
    }
  });
});


app.get('/favorites', function (request, response) {
  var promise = Favorite.findAll();
  promise.then(function(favorites) {
    response.json({
      data: favorites
    });
  });
});

app.get('/favorites/:id', function (request, response) {
  var promise = Favorite.findAll({
    where: {
      userId: request.params.id
    },
    order: 'id DESC'
  });
  promise.then(function(favorites) {
    response.json({
      data: favorites,
      id: request.params.id
    });
  });
});

app.listen(process.env.PORT || 3000);
