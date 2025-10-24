import React, { useEffect, useMemo, useState } from 'react'
const LS_KEY = 'pmp-sim-state-v1'
const save = (s)=>{ try{ localStorage.setItem(LS_KEY, JSON.stringify(s)) }catch{} }
const load = ()=>{ try{ const r=localStorage.getItem(LS_KEY); return r?JSON.parse(r):null }catch{return null} }
const clear = ()=>{ try{ localStorage.removeItem(LS_KEY) }catch{} }
const basePath = ()=> (import.meta.env.BASE_URL && import.meta.env.BASE_URL!=='/') ? import.meta.env.BASE_URL : './'
const loadQuestions = ()=> fetch(`${basePath()}questions.json`).then(r=>r.json())
const shuffleSeed = (arr,seed)=>{
  let a=1664525,c=1013904223,m=2**32,s=seed>>>0
  const pairs = arr.map(v=>{ s=(a*s+c)%m; return [s/m,v] })
  return pairs.sort((x,y)=>x[0]-y[0]).map(p=>p[1])
}
function Timer({seconds,onTimeout}){
  const [t,setT]=useState(seconds)
  useEffect(()=>{ const id=setInterval(()=>setT(s=>{ if(s<=1){clearInterval(id); onTimeout?.(); return 0} return s-1 }),1000); return ()=>clearInterval(id)},[])
  const mm=String(Math.floor(t/60)).padStart(2,'0'), ss=String(t%60).padStart(2,'0')
  return <span className="timer">{mm}:{ss}</span>
}
export default function Simulator(){
  const [questions,setQuestions]=useState([])
  const saved = load()
  const [started,setStarted]=useState(saved?.started??false)
  const [answers,setAnswers]=useState(saved?.answers??{})
  const [flags,setFlags]=useState(saved?.flags??{})
  const [done,setDone]=useState(saved?.done??false)
  const [studyMode,setStudyMode]=useState(saved?.studyMode??false)
  const [duration,setDuration]=useState(saved?.duration??60*60)
  const [count,setCount]=useState(saved?.count??100)
  const [seed,setSeed]=useState(saved?.seed??Math.floor(Date.now()%2**32))
  const [selectedIds,setSelectedIds]=useState(saved?.selectedIds??null)
  useEffect(()=>{ loadQuestions().then(setQuestions) },[])
  const selected = useMemo(()=>{
    if(!questions.length) return []
    if(selectedIds){ const map=new Map(questions.map(q=>[q.id,q])); return selectedIds.map(id=>map.get(id)).filter(Boolean) }
    const x = shuffleSeed(questions, seed).slice(0, count); setSelectedIds(x.map(q=>q.id)); return x
  },[questions,count,seed,selectedIds])
  useEffect(()=>{ save({started,answers,flags,done,studyMode,duration,count,seed,selectedIds}) },[started,answers,flags,done,studyMode,duration,count,seed,selectedIds])
  const correct = useMemo(()=> Object.entries(answers).reduce((a,[id,opt])=>{
    const q = selected.find(x=>x && x.id===id); return a + (q && q.correct===opt ? 1 : 0)
  },0),[answers,selected])
  const breakdown = useMemo(()=>{
    const agg = {}; selected.forEach(q=>{ if(!q)return; const k=q.domain_ECO+'|'+q.approach; agg[k]??={total:0,correct:0,domain:q.domain_ECO,approach:q.approach}; agg[k].total++ })
    Object.entries(answers).forEach(([id,opt])=>{ const q=selected.find(x=>x && x.id===id); if(!q)return; const k=q.domain_ECO+'|'+q.approach; if(opt===q.correct) agg[k].correct++ })
    return Object.values(agg)
  },[answers,selected])
  if(!started) return (
    <div className="card">
      <h2>Simulatore PMP</h2>
      <p className="muted">I progressi vengono salvati automaticamente.</p>
      <div className="row">
        <label>Numero domande:&nbsp;<input className="input" type="number" min="10" max="180" value={count} onChange={e=>{setSelectedIds(null); setCount(parseInt(e.target.value||'100'))}}/></label>
        <label>Durata (min):&nbsp;<input className="input" type="number" min="10" max="230" value={Math.round(duration/60)} onChange={e=>setDuration(parseInt(e.target.value||'60')*60)}/></label>
        <label className="row"><input type="checkbox" checked={studyMode} onChange={e=>setStudyMode(e.target.checked)}/>&nbsp;Study Mode</label>
      </div>
      <div className="spacer"></div>
      <div className="row">
        <button className="btn" onClick={()=>setStarted(true)}>Inizia</button>
        {saved && <button className="btn secondary" onClick={()=>{ location.reload() }}>Ripristina sessione</button>}
        <button className="btn secondary" onClick={()=>{ clear(); setAnswers({}); setFlags({}); setDone(false); setSelectedIds(null); }}>Azzera progressi</button>
      </div>
    </div>
  )
  if(done){ const total=selected.length, score=Math.round((correct/total)*100); return (
    <div className="card">
      <h2>Risultati</h2>
      <div className="row"><div className="kpi">{score}%</div><div className="muted">({correct} su {total})</div></div>
      <div className="spacer"></div>
      <table className="table"><thead><tr><th>Dominio</th><th>Approccio</th><th>Corrette</th><th>Totale</th></tr></thead>
      <tbody>{breakdown.map(b=><tr key={b.domain+b.approach}><td>{b.domain}</td><td>{b.approach}</td><td>{b.correct}</td><td>{b.total}</td></tr>)}</tbody></table>
      <div className="spacer"></div>
      <button className="btn" onClick={()=>{ clear(); location.reload() }}>Nuovo tentativo</button>
      <button className="btn secondary" onClick={()=> window.scrollTo({top: document.body.scrollHeight, behavior:'smooth'})}>Rivedi domande</button>
      <ReviewList list={selected} answers={answers}/>
    </div>
  )}
  return <Exam list={selected} studyMode={studyMode} duration={duration} answers={answers} setAnswers={setAnswers} flags={flags} setFlags={setFlags} onSubmit={()=>setDone(true)}/>
}
function Exam({list, studyMode, duration, answers, setAnswers, flags, setFlags, onSubmit}){
  const [idx,setIdx]=useState(0)
  const [timedOut,setTimedOut]=useState(false)
  const q = list[idx]
  if(!q) return <div className="card">Caricamento...</div>
  const setAns=(id,opt)=> setAnswers({...answers,[id]:opt})
  const toggleFlag=(id)=> setFlags({...flags,[id]:!flags[id]})
  return (
    <div className="card">
      <div className="row">
        <div><b>Domanda {idx+1}</b> / {list.length}</div>
        <div className="pill">{q.domain_ECO}</div><div className="pill">{q.approach}</div>
        <div style={{flex:1}}/><div>Tempo: <Timer seconds={duration} onTimeout={()=>setTimedOut(true)}/></div>
      </div>
      <div className="spacer"></div>
      <div className="card">
        <p style={{fontSize:18}}>{q.stem}</p>
        <ul style={{listStyle:'none',padding:0}}>
          {Object.entries(q.options).map(([k,v])=>{
            const sel = answers[q.id]===k
            return <li key={k} style={{marginBottom:8}}><label className="row">
              <input type="radio" name={q.id} checked={!!sel} onChange={()=>setAns(q.id,k)}/><span><b>{k}.</b> {v}</span>
            </label></li>
          })}
        </ul>
        <div className="row">
          <button className="btn secondary" onClick={()=>toggleFlag(q.id)}>{flags[q.id]?'Unflag':'Flag'}</button>
          <div style={{flex:1}}/>
          <button className="btn secondary" disabled={idx===0} onClick={()=>setIdx(i=>i-1)}>← Indietro</button>
          <button className="btn" onClick={()=>setIdx(i=>Math.min(i+1,list.length-1))}>Avanti →</button>
        </div>
      </div>
      {studyMode && answers[q.id] && <div className="card" style={{marginTop:12}}>
        <b>Spiegazione</b>
        <p className={answers[q.id]===q.correct?'correct':'wrong'}>{answers[q.id]===q.correct?'Corretto.':`Risposta corretta: ${q.correct}`}</p>
        <p className="muted">{q.rationale}</p>
      </div>}
      <div className="row" style={{marginTop:12}}>
        <button className="btn" onClick={onSubmit} disabled={timedOut && Object.keys(answers).length===0}>Consegna</button>
        <span className="muted">Progresso salvato automaticamente.</span>
      </div>
      <ReviewStrip list={list} answers={answers} flags={flags} current={idx} jump={(i)=>setIdx(i)}/>
      {timedOut && <p className="wrong">Tempo scaduto. Consegna per vedere i risultati.</p>}
    </div>
  )
}
function ReviewStrip({list,answers,flags,current,jump}){
  return <div className="card" style={{marginTop:12}}>
    <b>Review rapida</b>
    <div className="row" style={{flexWrap:'wrap',gap:6,marginTop:8}}>
      {list.map((q,i)=> q && <span key={q.id} style={{
        padding:'6px 8px', border:'1px solid #2a366e', borderRadius:8, cursor:'pointer',
        background: i===current? '#1b254d' : (answers[q.id]!=null? '#0c1430':'transparent')
      }} onClick={()=>jump(i)}>{i+1} {flags[q.id]?'⚑':''} {answers[q.id]!=null?'•':''}</span>)}
    </div>
  </div>
}
function ReviewList({list,answers}){
  return <div className="card" style={{marginTop:12}}>
    <h3>Revisione domande</h3>
    {list.map((q,i)=> q && <div key={q.id} className="card" style={{marginTop:8}}>
      <div className="row"><b>{i+1}. {q.stem}</b><div style={{flex:1}}/><span className="pill">{q.domain_ECO}/{q.approach}</span></div>
      <ul>{Object.entries(q.options).map(([k,v])=>{
        const ok = q.correct===k, chosen = answers[q.id]===k
        return <li key={k} className={ok?'correct':(chosen?'wrong':'')}>{k}. {v}</li>
      })}</ul>
      <p className="muted"><b>Spiegazione:</b> {q.rationale}</p>
    </div>)}
  </div>
}
