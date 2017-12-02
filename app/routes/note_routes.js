var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
  
  // gets
  app.get("/", function(req, res){
    refreshNotes(req, res);
  });
  
  app.get('/new_note', (req, res) => {
    res.render("new_note");
  });
  
  app.get("/login", function(request, response){
    response.render("login");
  });
  
  app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    db.collection('notes').findOne(details, (err, item) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render('note_page', {article: item});
      } 
    });
  });

  // posts
  app.post('/', (req, res) => {
    const note = {
      text: req.body.text, 
      title: req.body.title,
      description: req.body.description,
      date: new Date()
    };
    db.collection('notes').insert(note, (err, result) => {
      if (err) {
        res.send({'error': 'An error has occured'});
      } else {
        refreshNotes(req, res);
      }
    });
  });
  
  app.post('/login', (req, res) => {
    if (req.body.password === req.body.rep_password) {
      const user = {name: req.body.name, email: req.body.email, password: req.body.password};
      db.collection('users').insert(user, (err, result) => {
        if (err) {
          res.send({'error': 'An error has occured'});
        } else {
          res.render("notes");
        }
      });
    } else {
      console.log('passwords do not match');
    }
  });


  // procedures and functions
  var refreshNotes = function (req, res) {
    db.collection('notes').find().toArray((err, data) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log(data);
        res.render("index", {articles: data});
      }
    });
  };
  
};