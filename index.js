require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

morgan.token('person', req => JSON.stringify(req.body))
morgan.format('tiny+', ':method :url :status :res[content-length] - :response-time ms :person')

const app = express()

const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('tiny', { skip: req => req.method === 'POST' }))
app.use(morgan('tiny+', { skip: req => req.method !== 'POST' }))


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

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = new Person({ ...request.body })
  // console.log('add person', person)
  if (person.name === '') {
    return response.status(400).json({ error: 'name missing' })
  }
  if (person.number === '') {
    return response.status(400).json({ error: 'number missing' })
  }
  person
    .save()
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = { ...request.body }
  // console.log('update person', person)
  Person
    .findByIdAndUpdate(
      request.params.id,
      person,
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

// handler of errors
const errorHandler = (error, request, response, next) => {
  console.error(error.name, error.message)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  } else {
    response.status(500).json({ error: 'internal error' })
  }
  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})