import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])

  const [message, setMessage] = useState(null)
  const [type, setType] = useState('message')

  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => setPersons(response.data))
  }, [])

  const notify = m => {
    console.log('notify', m)
    setType('message')
    setMessage(m)
    setTimeout(() => setMessage(null), 2000)
  }

  const errorify = m => {
    console.log('errorify', m)
    setType('error')
    setMessage(m)
    setTimeout(() => setMessage(null), 2000)
  }

  const onSubmit = e => {
    e.preventDefault()
    const sameName = persons.filter(p => p.name === newName)
    if (sameName.length !== 0) {
      const current = sameName[0]
      if (!window.confirm(`${current.name} is already added to phonebook, replace the old number with a new one?`)) {
        return
      }
      personService
        .update(current.id, { ...current, number: newNumber })
        .then(response => {
          console.log('update res', response)
          notify(`${response.data.name} updated`)
          setPersons(persons.map(p => p.id === response.data.id ? response.data : p))
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log('update error', error)
          errorify(`Information of ${current.name} has already been removed from server`)
        })
    } else {
      personService
        .create({ name: newName, number: newNumber })
        .then(response => {
          console.log('submit res', response)
          notify(`${response.data.name} added`)
          setPersons([...persons, response.data])
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const onDelete = id => {
    personService
      .remove(id)
      .then(response => {
        console.log('remove res', response)
        notify(`${response.data.name} deleted`)
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={type} message={message} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        onSubmit={onSubmit}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} onDelete={onDelete} />
    </div>
  )
}

export default App