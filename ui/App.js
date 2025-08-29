import React from 'react';

export default function App(){
  return (
    <div style={{fontFamily:'system-ui,Segoe UI,Roboto,Arial', padding:20}}>
      <h1>Porra F1</h1>
      <p>Proyecto listo. Copia aquí tu App del canvas para la UI completa.</p>
      <ul>
        <li><code>GET /api/auth/me</code></li>
        <li><code>POST /api/auth/login</code> / <code>POST /api/auth/logout</code></li>
        <li><code>PUT /api/participants</code> (semilla)</li>
        <li><code>GET/POST /api/predictions</code></li>
        <li><code>GET/POST /api/results</code></li>
        <li><code>GET /api/standings?gpId=...</code></li>
        <li><code>GET/PUT /api/pilots</code></li>
      </ul>
    </div>
  );
}
