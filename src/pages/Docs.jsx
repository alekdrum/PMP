import React from 'react'
import { Link } from 'react-router-dom'
const principles = [
  ['1-stewardship','Stewardship'],['2-team','Team'],['3-stakeholders','Stakeholder'],
  ['4-value','Valore'],['5-systems','Pensiero Sistemico'],['6-leadership','Leadership'],
  ['7-tailoring','Tailoring'],['8-quality','Qualità'],['9-complexity','Complessità'],
  ['10-risk','Rischio'],['11-adapt','Adattabilità'],['12-change','Cambiamento'],
]
const domains = [
  ['stakeholder','Stakeholder'],['team','Team'],['approach-lifecycle','Approach & Lifecycle'],
  ['planning','Planning'],['project-work','Project Work'],['delivery','Delivery'],
  ['measurement','Measurement'],['uncertainty','Uncertainty']
]
export default function Docs(){
  return (
    <div className="card">
      <h2>Teoria</h2>
      <p className="muted">Contenuti originali/parafrasati.</p>
      <div className="grid" style={{marginTop:12}}>
        <div className="card">
          <h3>Introduzione</h3>
          <p>Perché PMP, differenze ECO/PMBOK7, come studiare.</p>
          <Link className="btn secondary" to="/docs/intro">Apri introduzione</Link>
        </div>
        <div className="card">
          <h3>Principi (12)</h3>
          <ul>{principles.map(([s,l])=> <li key={s}><Link to={`/docs/principles/${s}`}>{l}</Link></li>)}</ul>
        </div>
        <div className="card">
          <h3>Performance Domains (8)</h3>
          <ul>{domains.map(([s,l])=> <li key={s}><Link to={`/docs/domains/${s}`}>{l}</Link></li>)}</ul>
        </div>
      </div>
    </div>
  )
}
