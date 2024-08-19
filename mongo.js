const mongoose = require('mongoose')

const init = password => {
  const url = `mongodb+srv://timothy2022cc:${password}@cluster0.owcjful.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  mongoose.set('strictQuery', false)
  mongoose.connect(url)
}

const Person = mongoose.model('Person', new mongoose.Schema({
  name: String,
  number: String,
}))

const __main = () => {
  if (process.argv.length === 3) {
    init(process.argv[2])
    console.log('phonebook:')
    Person.find({}).then(result => {
      result.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
  } else if (process.argv.length === 5) {
    init(process.argv[2])
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })
    person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  } else {
    console.log('please give correct number of arguments')
    process.exit(1)
  }
}

__main()








