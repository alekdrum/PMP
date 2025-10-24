import React from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import App from './mainApp'
import Home from './pages/Home'
import Docs from './pages/Docs'
import DocView from './pages/DocView'
import Simulator from './pages/Simulator'

const router = createHashRouter([
  { path: '/', element: <App/>,
    children: [
      { index: true, element: <Home/> },
      { path: '/docs', element: <Docs/> },
      { path: '/docs/:section/:slug', element: <DocView/> },
      { path: '/sim', element: <Simulator/> },
    ]
  }
])

const root = createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)
