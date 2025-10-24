import React from 'react'
import { Link } from 'react-router-dom'
export default function Home(){
  return (
    <div className="grid">
      <div className="card">
        <h2>Inizia da qui</h2>
        <p className="muted">Principi & domains con esempi pratici.</p>
        <Link className="btn" to="/docs">Apri Teoria</Link>
      </div>
      <div className="card">
        <h2>Simulatore d’esame</h2>
        <p className="muted">Timer, flag, review, report per dominio/approccio.</p>
        <Link className="btn" to="/sim">Avvia</Link>
      </div>
      <div className="card">
        <h2>Tips d’esame</h2>
        <ul>
          <li>Pensa a <b>valore</b> e <b>persone</b>.</li>
          <li>Servant leadership > micromanagement.</li>
          <li>Feedback rapido quando c’è incertezza.</li>
        </ul>
      </div>
    </div>
  )
}
