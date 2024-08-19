require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

morgan.token('person', req => JSON.stringify(req.body))
morgan.format('tiny+', ':method :url :status :res[content-length] - :response-time ms :person')

const app = express()

const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(morgan('tiny', { skip: req => req.method === 'POST' }))
app.use(morgan('tiny+', { skip: req => req.method !== 'POST' }))

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    response.json(result)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const r = `<div>
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}</p>
    </div>`
    response.send(r)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
})

// TODO
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = new Person({ ...request.body })
  // console.log('person', person)

  if (person.name === '') {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (person.number === '') {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  // if (persons.some(p => p.name === person.name)) {
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  // const RANGE = 10 ** 8
  // person.id = String(Math.floor(Math.random() * RANGE))
  // persons = persons.concat(person)
  // response.json(person)

  person.save().then(savedPerson => response.json(savedPerson)) 
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})