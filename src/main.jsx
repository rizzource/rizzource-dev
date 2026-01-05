import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './redux/store'
import { ThemeProvider } from 'next-themes'

import { PostHogProvider } from 'posthog-js/react'

const posthogOptions = {
  api_host: 'https://us.i.posthog.com',
  defaults: '2025-11-30',
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider
      apiKey="phc_Rlu9tUrv8ykJGugYkSbVtIohNZEZLQlQt26Ha2r5Zj4"
      options={posthogOptions}
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </PostHogProvider>
  </StrictMode>
)
