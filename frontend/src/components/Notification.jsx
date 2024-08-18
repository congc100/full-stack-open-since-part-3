const Notification = ({ type, message }) => {
  if (message === null) {
    return null
  } else {
    return <div className={type}>{message}</div>
  }
}

export default Notification