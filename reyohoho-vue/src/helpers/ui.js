export const showMessageToast = (message) => {
  const messageElement = document.createElement('div')
  messageElement.style.position = 'fixed'
  messageElement.style.top = '0'
  messageElement.style.left = '0'
  messageElement.style.width = '100%'
  messageElement.style.height = '100%'
  messageElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  messageElement.style.color = 'white'
  messageElement.style.display = 'flex'
  messageElement.style.justifyContent = 'center'
  messageElement.style.alignItems = 'center'
  messageElement.style.fontSize = '2rem'
  messageElement.style.zIndex = '99000'
  messageElement.textContent = message
  document.body.appendChild(messageElement)

  setTimeout(() => {
    document.body.removeChild(messageElement)
  }, 2000)
}
