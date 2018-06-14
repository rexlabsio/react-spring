import React from 'react'
import ReactDOM from 'react-dom'
import Loadable from 'react-loadable'
import './styles.css'

const components = ['trails'].map(path =>
  Loadable({
    loader: () => import('./demos/' + path),
    loading: () => <div />,
  })
)

ReactDOM.render(
  <div className="app-container">
    {components.map((Component, i) => <Component key={i} />)}
  </div>,
  document.getElementById('root')
)
