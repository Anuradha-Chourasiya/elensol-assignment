const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const port = 3000; // You can change this to any available port you prefer

const users = [];
const JWT_SECRET = "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";
app.use(express.json());





function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Invalid token' });
    }
}


app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.post('/signup', (req, res) => {
    const {name, dob, email, password} = req.body;
    // Check if username already exists
    if (users.find(user => user.email === email)) {
        return res.status(400).json({error: 'Username already exists'});
    }
    users.push({name, dob, email, password});
    console.log(users);
    res.json({message: 'Signup successful'});
});


app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const user = users.find(user => user.email === username && user.password === password);
    console.log(users);
    if (!user) {
        return res.status(401).json({error: 'Invalid credentials'});
    }
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});



app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Access granted' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});