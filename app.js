const express = require('express');
const routes = require('./routes/users')
const session = require('express-session');
const app = express();
const port = 3000;
const clave = require('./crypto/config') 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: clave,
      resave: false,
      saveUninitialized: true, 
      cookie: { secure: false },
    })
  );

app.use('/', routes)

app.listen(port, () => {
    console.log('Server on')
})