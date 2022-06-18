import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {MantineProvider} from "@mantine/core";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <MantineProvider
          theme={{
              // Override any other properties from default theme
              fontFamily: 'Open Sans, sans serif',
              spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 }
          }}
      >
          <App />
      </MantineProvider>
  </React.StrictMode>
)
