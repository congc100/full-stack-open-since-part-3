const Person = ({ person, onDelete }) => {
  const { name, number, id } = person
  const onClick = () => {
    if (window.confirm(`Delete ${name}?`)) {
      onDelete(id)
    }
  }
  return <div key={name}>
    {name} {number}
    <button onClick={onClick}>delete</button>
  </div>
}

const Persons = ({ persons, filter, onDelete }) => {
  return persons
    .filter(p => new RegExp(filter, 'i').test(p.name))
    .map(p => <Person person={p} onDelete={onDelete} key={p.id} />)
}

export default Persons