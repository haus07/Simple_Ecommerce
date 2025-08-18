import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FilterProvider } from './context/FilterContext.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>

    <FilterProvider>
    <App />
    </FilterProvider>

      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
