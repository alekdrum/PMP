import React from 'react'
import { Outlet, Link } from 'react-router-dom'
export default function App(){
  return (
    <div className="container">
      <nav className="nav">
        <Link className="brand" to="/">PMP Study</Link>
        <span className="pill">PMBOK7 • ECO • Agile/Hybrid/Predictive</span>
        <div style={{flex:1}}/>
        <Link to="/docs">Teoria</Link>
        <Link to="/sim">Simulatore</Link>
        <a href="https://www.pmi.org" target="_blank" rel="noreferrer">PMI</a>
      </nav>
      <Outlet/>
      <div className="footer">Contenuti parafrasati (no testi PMI). ©</div>
    </div>
  )
}
