import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import '@fortawesome/fontawesome-free/css/all.min.css';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

// Check if the environment is production
const isProduction = import.meta.env.VITE_MODE === 'PRODUCTION';

if (isProduction) {
  Sentry.init({
    dsn: 'https://6ec79e705a7ca5fdbdbd5c6bf5f4ee4a@o4505674430087168.ingest.sentry.io/4505684957659136',
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          'batchmagic.com',
          import.meta.env.VITE_API_KEY,
        ],
      }),
      new Sentry.Replay(),
      new Integrations.BrowserTracing(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.8, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    profilesSampleRate: 1.0,
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <Sentry.ErrorBoundary fallback="An error has occurred.">
    <AuthProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AuthProvider>
  </Sentry.ErrorBoundary>,
);
