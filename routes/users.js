const express = require('express');
const users = require('../data/users')
const session = require('express-session');
const router = express.Router();
const {generateToken, verifyToken} = require('../middlewares/authMiddleware')

router.get('/', (req, res) => {
    if(!req.session.token) {
        res.send(`<form action="/login" method="post">
        <label for="username">Usuario:</label>
        <input type="text" id="username" name="username" required><br>
        
              <label for="password">Contraseña:</label>
              <input type="password" id="password" name="password" required><br>
        
              <button type="submit">Iniciar sesión</button>
            </form>
            <a href="/dashboard">Dashboard</a>
        
        `)
    }else {
        res.send(`<form action="/logout" method="post"> <button type="submit">Cerrar sesión</button> </form> <a href="/dashboard">Dashboard</a>`)
    }
    
})
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
  
    if (user) {
      const token = generateToken(user);
      req.session.token = token;
      res.redirect('/dashboard');
    } else {
      res.status(401).json({ message: 'Credenciales incorrectas' });
    }
  });

router.get('/dashboard', verifyToken, (req, res) => {
    const userId = req.user;

    const user = users.find((u) => u.id === userId);

    
    if (user) {
        req.loged = true
        res.send(` <h1>Bienvenido, ${user.name}!</h1> <p>ID: ${user.id}</p> <p>Usuario: ${user.username}</p> <br> <form action="/logout" method="post"> <button type="submit">Cerrar sesión</button> </form> <a href="/">Home</a> `);
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
    });

module.exports = router;