import { useEffect, useState } from "react";

export default function Home(){
  const [gps, setGps] = useState([]);
  const [gpId, setGpId] = useState("");
  const [storage, setStorage] = useState("");

  const [usuario, setUsuario] = useState("");
  const [qualy, setQualy] = useState(["","",""]);
  const [carrera, setCarrera] = useState(["","","","",""]);
  const [pod, setPod] = useState("");

  const [rQualy, setRQualy] = useState(["","",""]);
  const [rCarrera, setRCarrera] = useState(["","","","",""]);
  const [rPod, setRPod] = useState("");

  const [msg, setMsg] = useState("");
  const [rmsg, setRmsg] = useState("");
  const [tabla, setTabla] = useState(null);
  const [lista, setLista] = useState([]);

  useEffect(()=>{
    fetch("/api/gps").then(r=>r.json()).then(j=>{
      setGps(j.gps || []);
      setStorage(j.storage);
      const last = localStorage.getItem("gpId");
      setGpId(last || (j.gps?.[0]?.id ?? ""));
    });
  },[]);

  function updateArray(setter, idx, val){
    setter(prev => prev.map((x,i)=> i===idx ? val : x));
  }

  async function enviarPronostico(){
    const body = {
      usuario: usuario.trim() || "Anónimo",
      gpId,
      qualy: qualy.filter(Boolean),
      carrera: carrera.filter(Boolean),
      pilotoDelDia: pod.trim() || undefined
    };
    const r = await fetch("/api/predictions", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    setMsg(j.ok ? "✅ Pronóstico enviado" : `❌ ${j.error || "Error"}`);
  }

  async function guardarResultados(){
    const body = {
      gpId,
      qualyOficial: rQualy.filter(Boolean),
      carreraOficial: rCarrera.filter(Boolean),
      pilotoDelDia: rPod.trim() || undefined
    };
    const r = await fetch("/api/results", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body) });
    const j = await r.json();
    setRmsg(j.ok ? "💾 Resultados guardados" : `❌ ${j.error || "Error"}`);
  }

  async function recalcular(){
    const r = await fetch(`/api/standings?gpId=${encodeURIComponent(gpId)}`);
    const j = await r.json();
    setTabla(j);
  }

  async function verPronosticos(){
    const r = await fetch(`/api/predictions?gpId=${encodeURIComponent(gpId)}`);
    const j = await r.json();
    setLista(j.predictions || []);
  }

  return (
    <div style={{fontFamily:"system-ui,Segoe UI,Roboto,Arial", background:"#0f1115", color:"#e8edf2", minHeight:"100vh"}}>
      <header style={{padding:"12px 16px", background:"#171a21", position:"sticky", top:0, zIndex:10}}>
        <strong>Porra F1</strong>
        <span style={{color:"#8b95a7", marginLeft:8, fontSize:13}}>
          almacenamiento: {storage === "blob" ? "Vercel Blob" : "Memoria (demo)"}
        </span>
      </header>
      <main style={{padding:16, maxWidth:900, margin:"0 auto"}}>
        <section style={card}>
          <h3>1) Selecciona GP</h3>
          <div style={{display:"flex", gap:8}}>
            <select value={gpId} onChange={e=>{ setGpId(e.target.value); localStorage.setItem("gpId", e.target.value); }} style={input}>
              {gps.map(g => <option key={g.id} value={g.id}>{g.nombre} — {new Date(g.fecha).toLocaleString()}</option>)}
            </select>
            <button onClick={()=>{ fetch("/api/gps").then(r=>r.json()).then(j=>{ setGps(j.gps); setStorage(j.storage) }); }} style={button}>Recargar</button>
          </div>
        </section>

        <section style={card}>
          <h3>2) Enviar Pronóstico</h3>
          <div style={grid3}>
            <input placeholder="Tu nombre (ej. Raúl)" value={usuario} onChange={e=>setUsuario(e.target.value)} style={input} />
            {["Qualy P1","Qualy P2","Qualy P3"].map((ph,i)=>(
              <input key={ph} placeholder={ph} value={qualy[i]} onChange={e=>updateArray(setQualy,i,e.target.value)} style={input} />
            ))}
            {["Carrera P1","Carrera P2","Carrera P3","Carrera P4","Carrera P5"].map((ph,i)=>(
              <input key={ph} placeholder={ph} value={carrera[i]} onChange={e=>updateArray(setCarrera,i,e.target.value)} style={input} />
            ))}
            <input placeholder="Piloto del Día (opcional)" value={pod} onChange={e=>setPod(e.target.value)} style={input} />
          </div>
          <button onClick={enviarPronostico} style={button}>Enviar pronóstico</button>
          <p style={{color:"#8b95a7"}}>{msg}</p>
        </section>

        <section style={card}>
          <h3>3) Resultados Oficiales (admin demo)</h3>
          <p style={{color:"#8b95a7"}}>Introduce resultados para calcular la clasificación.</p>
          <div style={grid3}>
            {["Qualy P1","Qualy P2","Qualy P3"].map((ph,i)=>(
              <input key={ph} placeholder={ph} value={rQualy[i]} onChange={e=>updateArray(setRQualy,i,e.target.value)} style={input} />
            ))}
            {["Carrera P1","Carrera P2","Carrera P3","Carrera P4","Carrera P5"].map((ph,i)=>(
              <input key={ph} placeholder={ph} value={rCarrera[i]} onChange={e=>updateArray(setRCarrera,i,e.target.value)} style={input} />
            ))}
            <input placeholder="Piloto del Día (opcional)" value={rPod} onChange={e=>setRPod(e.target.value)} style={input} />
          </div>
          <button onClick={guardarResultados} style={button}>Guardar resultados</button>
          <p style={{color:"#8b95a7"}}>{rmsg}</p>
        </section>

        <section style={card}>
          <h3>4) Clasificación</h3>
          <button onClick={recalcular} style={button}>Recalcular</button>
          <div style={{marginTop:12}}>
            {(!tabla || !tabla.standings || !tabla.standings.length) ? (
              <p style={{color:"#8b95a7"}}>Sin datos aún.</p>
            ) : (
              <table style={{width:"100%", borderCollapse:"collapse"}}>
                <thead>
                  <tr>
                    {["Pos","Usuario","Pts","Qualy","Carrera","POD"].map(h => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tabla.standings.map((r,i)=>(
                    <tr key={r.usuario+"-"+i}>
                      <td style={td}>{i+1}</td>
                      <td style={td}>{r.usuario}</td>
                      <td style={{...td, textAlign:"right"}}>{r.puntos}</td>
                      <td style={{...td, textAlign:"right"}}>{r.desglose.qualy}</td>
                      <td style={{...td, textAlign:"right"}}>{r.desglose.carrera}</td>
                      <td style={{...td, textAlign:"right"}}>{r.desglose.pilotoDelDia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section style={card}>
          <h3>Pronósticos enviados</h3>
          <button onClick={verPronosticos} style={button}>Cargar lista</button>
          <pre style={{whiteSpace:"pre-wrap", color:"#8b95a7"}}>{JSON.stringify(lista, null, 2)}</pre>
        </section>
      </main>
      <footer style={{padding:"12px 16px", background:"#171a21"}}>
        <span style={{color:"#8b95a7"}}>Frontend Next.js + Backend Vercel API • Puntuación automática</span>
      </footer>
    </div>
  );
}

const card = { background:"#151922", border:"1px solid #232a36", borderRadius:12, padding:12, margin:"12px 0" };
const input = { background:"#0f1320", border:"1px solid #2a3445", color:"#e8edf2", borderRadius:8, padding:"10px", width:"100%" };
const button = { background:"#0f1320", border:"1px solid #2a3445", color:"#e8edf2", borderRadius:8, padding:"10px 12px", cursor:"pointer" };
const grid3 = { display:"grid", gap:8, gridTemplateColumns:"repeat(3, minmax(0,1fr))" };
const th = { textAlign:"left", padding:6, borderBottom:"1px solid #2a3445" };
const td = { padding:6, borderBottom:"1px solid #202636" };
