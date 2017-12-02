module.exports = function(app, db) {
  
  // gets
  app.get("/", function(request, response){
    response.render("index");
  });
  
  app.get('/notes', (req, res) => {
    refreshNotes(req, res);
  });
  
  app.get("/login", function(request, response){
    response.render("login");
  });

  // posts
  app.post('/notes', (req, res) => {
    const note = {text: req.body.text, title: req.body.title};
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
    const note = {text: req.body.text, title: req.body.title};
    db.collection('notes').find().toArray((err, data) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.render("notes", {articles: data});
      }
    });
  };
  
};