import React from 'react'
import ReactDOM from 'react-dom'
import './css/main.css'
import './css/modals.css'

import App from './components/App'
import * as serviceWorker from './serviceWorker'

document.title = 'Nympheas Drawing Tool'

const root = document.createElement('div')
document.body.appendChild(root)
ReactDOM.render(<App />, root)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
