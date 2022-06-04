const express = require('express');
const app = express();

const generateId = () => {
    let id = Math.floor(Math.random() * 10000);
    return id;
};

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('---');
    next();
};

app.use(express.json());
app.use(requestLogger);

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
];

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name) {
        return response.status(404).json({
            error: 'person must have a name'
        });
    }

    if (!body.number) {
        return response.status(404).json({
            error: 'person must have a number'
        });
    }

    if (persons.find(p => p.name === body.name)) {
        return response.status(404).json({
            error: 'name must be unique'
        });
    }

    let newId = generateId();
    while (newId in persons.map(p => p.id)) {
        newId = generateId();
    }

    const person = {
        id: newId,
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    
    response.json(person);
});

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.get('/info', (request, response) => {
    const date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    
    <p>${date}</p>`);
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

PORT = 3001;
app.listen(PORT);
console.log('Server is listening on port ' + PORT);