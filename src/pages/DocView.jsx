import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

export default function DocView(){
  const { section, slug } = useParams()
  const [text,setText] = useState('')
  useEffect(()=>{
    const base = (import.meta.env.BASE_URL && import.meta.env.BASE_URL!=='/') ? import.meta.env.BASE_URL : './'
    const path = section==='intro' ? `${base}docs/intro.md` : `${base}docs/${section}/${slug}.md`
    fetch(path).then(r=>r.ok?r.text():'Errore caricamento').then(setText).catch(()=>setText('Errore caricamento'))
  },[section,slug])
  return (
    <div className="card">
      <div className="row">
        <Link className="btn secondary" to="/docs">← Indice</Link>
      </div>
      <div className="spacer"></div>
      <article><ReactMarkdown>{text}</ReactMarkdown></article>
    </div>
  )
}
