import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { view } from '@forge/bridge';
import PetPanel from './views/PetPanel.jsx';
import Clubhouse from './views/Clubhouse.jsx';
import './styles.css';

const VIEW_BY_MODULE = {
  'jiragotchi-pet': PetPanel,
  'jiragotchi-clubhouse': Clubhouse,
};

function Router() {
  const [Component, setComponent] = useState(null);
  const [context, setContext] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    view.getContext()
      .then((ctx) => {
        setContext(ctx);
        // moduleKey lives in different places across Forge versions; check both
        const key = ctx?.moduleKey ?? ctx?.extension?.modulekey ?? ctx?.extension?.type;
        const matched = Object.entries(VIEW_BY_MODULE).find(([k]) => key?.includes(k.split('-').pop()));
        setComponent(() => matched?.[1] ?? PetPanel);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="container"><div className="error">⚠️ {error}</div></div>;
  if (!Component) return <div className="container"><div className="muted">Loading…</div></div>;
  return <Component context={context} />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);
