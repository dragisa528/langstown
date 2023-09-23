import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createInertiaApp } from '@inertiajs/react'

export default function render(page) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => require(`./Pages/${name}.jsx`),
    setup: ({ App, props }) => <App {...props} />,
  })
}
