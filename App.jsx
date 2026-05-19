import { useState, useEffect, useRef } from "react";

/* ─── Tokens ──────────────────────────────────────────────────── */
const C = {
  obsidian:"#0A0905", ink:"#100F0C", surface:"#161410", elevated:"#1E1C18",
  border:"rgba(212,182,120,0.12)", borderHi:"rgba(212,182,120,0.28)",
  gold:"#D4B678", goldLight:"#E8D4A0", goldDim:"rgba(212,182,120,0.5)",
  cream:"#F2EDE4", muted:"rgba(242,237,228,0.38)", faint:"rgba(242,237,228,0.14)",
  danger:"#C0614A", success:"#5A9E72",
};
const SF = "'Cormorant Garamond','Playfair Display',Georgia,serif";
const UF = "'Outfit','DM Sans',sans-serif";

/* ─── Screens ────────────────────────────────────────────────── */
const S = {
  SPLASH:"splash", LOGIN:"login", SIGNUP:"signup", OTP:"otp",
  HOME:"home", SEARCH:"search", CARS:"cars", CONFIRM:"confirm",
  PAY:"pay", TRACK:"track", PROFILE:"profile", EDIT:"edit",
  CARDS:"cards", ADDRESSES:"addresses", COUPONS:"coupons",
  HISTORY:"history", NOTIFS:"notifs",
  SOS:"sos", SHARE:"share", SCHEDULE:"schedule",
  POSTRIDE:"postride", RECEIPT:"receipt", CANCEL:"cancel",
  FORGOT:"forgot", DRIVERVERIF:"driververif", TRUSTED:"trusted",
  NONET:"nonet", ONBOARD:"onboard",
  DRIVERCANCEL:"drivercancel", PAYFAIL:"payfail", LOCPERM:"locperm",
  STARTRIDE:"startride", SUBS:"subs",
  WALLET:"wallet", SETTINGS:"settings", HELP:"help",
  PUSHPERM:"pushperm", DELETEACCT:"deleteacct",
  FINDDRIVER:"finddriver", SAFETYPREFS:"safetyprefs", REFERRAL:"referral",
  SURGE:"surge", LOSTANDFOUND:"lostandfound", DISPUTE:"dispute",
  REPORTDRIVER:"reportdriver", MULTISTOP:"multistop", SPLITFARE:"splitfare",
  ECODASH:"ecodash", RATEAPP:"rateapp", PROMO:"promo", CHANGECRED:"changecred",
};

/* ─── Static data ────────────────────────────────────────────── */
const SUGGESTIONS = [
  { icon:"✈️", name:"IGI Airport — Terminal 2", sub:"NH-48, New Delhi", dist:"28 km" },
  { icon:"🏢", name:"Cyber Hub, Gurugram",       sub:"DLF Cyber City, Gurugram", dist:"18 km" },
  { icon:"🏥", name:"AIIMS Delhi",               sub:"Ansari Nagar East, New Delhi", dist:"9 km" },
  { icon:"🛍️", name:"Select CityWalk",           sub:"District Centre, Saket", dist:"14 km" },
  { icon:"🎓", name:"IIT Delhi",                 sub:"Hauz Khas, New Delhi", dist:"11 km" },
  { icon:"🏟️", name:"Jawaharlal Nehru Stadium",  sub:"Lodhi Road, New Delhi", dist:"6 km" },
  { icon:"🏛️", name:"India Gate",                sub:"Kartavya Path, New Delhi", dist:"4 km" },
  { icon:"🌿", name:"Lodhi Garden",              sub:"Lodhi Road, New Delhi", dist:"5 km" },
];

const RECENTS = [
  { icon:"🏠", name:"Sector 62, Noida",     sub:"Home · 22 km" },
  { icon:"🏢", name:"Connaught Place",       sub:"Work · 3 km" },
  { icon:"✈️", name:"IGI Airport T2",        sub:"28 km" },
];

const DRIVERS = [
  { id:"moto",  glyph:"🛵", type:"EV Moto",  tagline:"Quickest route",   driver:"Suresh M.",   rating:"4.7", trips:"1,204", plate:"DL 7B 2341", color:"#1E1A12", eta:2,  fare:89,   capacity:1, desc:"2-Wheeler · Solo ride" },
  { id:"auto",  glyph:"🛺", type:"EV Auto",  tagline:"Budget friendly",  driver:"Ramesh K.",   rating:"4.8", trips:"3,891", plate:"DL 4C 8812", color:"#121A1E", eta:4,  fare:189,  capacity:3, desc:"3-Wheeler · Up to 3 riders" },
  { id:"cab",   glyph:"🚗", type:"EV Cab",   tagline:"Most popular",     driver:"Arjun S.",    rating:"4.9", trips:"6,210", plate:"DL 3C 9821", color:"#121E16", eta:6,  fare:349,  capacity:4, desc:"Sedan · Tata Nexon EV", featured:true },
  { id:"prime", glyph:"🚙", type:"EV Prime", tagline:"Premium comfort",  driver:"Vikram R.",   rating:"4.9", trips:"2,445", plate:"DL 2A 5521", color:"#1A121E", eta:9,  fare:549,  capacity:6, desc:"SUV · Up to 6 riders" },
  { id:"share", glyph:"🚌", type:"EV Share", tagline:"Eco & economical", driver:"Pradeep L.",  rating:"4.6", trips:"8,102", plate:"DL 9S 1234", color:"#1A1A12", eta:7,  fare:69,   capacity:6, desc:"Shared ride · Save more" },
];

const PAY_METHODS = [
  { id:"phonepe",name:"PhonePe", sub:"UPI",                    icon:"💜", accent:"#7B2FBE" },
  { id:"gpay",   name:"GPay",    sub:"UPI",                    icon:"🔵", accent:"#1A73E8" },
  { id:"paytm",  name:"Paytm",   sub:"Wallet · UPI",          icon:"🔷", accent:"#00B9F1" },
  { id:"card",   name:"Card",    sub:"Visa · Mastercard · RuPay",icon:"💳",accent:"#4A4540" },
  { id:"cash",   name:"Cash",    sub:"Pay after ride",         icon:"🟢", accent:"#3D7A52" },
];

/* ─── Global CSS ─────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  input,button{font-family:inherit;}
  input::placeholder{color:rgba(242,237,228,0.2);}
  input:focus{outline:none;}
  ::-webkit-scrollbar{display:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes drift{0%,100%{transform:translate(0,0)}33%{transform:translate(4px,-5px)}66%{transform:translate(-3px,3px)}}
  @keyframes ripple{0%{transform:scale(.6);opacity:.5}100%{transform:scale(2.4);opacity:0}}
  @keyframes shimmer{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes goldPan{0%{background-position:0%}100%{background-position:200%}}
  @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(212,182,120,0.3)}50%{box-shadow:0 0 0 8px rgba(212,182,120,0)}}
  .fu{animation:fadeUp .5s cubic-bezier(.22,.68,0,1.2) both}
  .fu1{animation:fadeUp .5s .07s cubic-bezier(.22,.68,0,1.2) both}
  .fu2{animation:fadeUp .5s .14s cubic-bezier(.22,.68,0,1.2) both}
  .fu3{animation:fadeUp .5s .21s cubic-bezier(.22,.68,0,1.2) both}
  .fu4{animation:fadeUp .5s .28s cubic-bezier(.22,.68,0,1.2) both}
  .fi{animation:fadeIn .4s ease both}
  .su{animation:slideUp .4s cubic-bezier(.22,.68,0,1.2) both}
  .gold-text{
    background:linear-gradient(90deg,#8B6010,#E8D4A0,#8B6010,#F0E0B0,#8B6010);
    background-size:300%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;animation:goldPan 6s linear infinite;
  }
  .grain::after{
    content:'';position:fixed;inset:0;pointer-events:none;z-index:9999;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:160px;opacity:.024;mix-blend-mode:overlay;
  }
  .press{transition:transform .12s,opacity .12s;cursor:pointer;}
  .press:active{transform:scale(.97);opacity:.85;}
  .card-hover{transition:border-color .2s,background .2s;}
  .card-hover:hover{border-color:rgba(212,182,120,0.3)!important;background:rgba(212,182,120,0.025)!important;}
`;

/* ─── Atoms ──────────────────────────────────────────────────── */
const GoldBtn = ({ children, onClick, ghost=false, sm=false, style={} }) => (
  <button onClick={onClick} className="press" style={{
    width:sm?"auto":"100%", padding:sm?"10px 22px":"17px 24px", borderRadius:3,
    border:ghost?`1px solid ${C.borderHi}`:"none",
    background:ghost?"transparent":"linear-gradient(110deg,#5C3A08 0%,#C9A84C 28%,#E8D4A0 50%,#C9A84C 72%,#5C3A08 100%)",
    backgroundSize:"200%",
    color:ghost?C.gold:C.obsidian, fontSize:sm?11:13, fontWeight:600, fontFamily:UF,
    letterSpacing:sm?1:1.8, textTransform:"uppercase", cursor:"pointer",
    transition:"opacity .2s", ...style,
  }}>{children}</button>
);

const Lbl = ({ children, style={} }) => (
  <p style={{ fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:2.5, textTransform:"uppercase", color:C.goldDim, marginBottom:12, ...style }}>{children}</p>
);

const BackBtn = ({ onClick }) => (
  <button onClick={onClick} className="press" style={{
    background:"none", border:`1px solid ${C.border}`, color:C.muted,
    width:38, height:38, borderRadius:3, cursor:"pointer", fontSize:16,
    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
  }}>←</button>
);

const Tag = ({ children, gold, accent }) => (
  <span style={{
    fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase",
    padding:"3px 9px", borderRadius:2,
    border:`1px solid ${gold?C.borderHi:accent?`${accent}44`:C.faint}`,
    color:gold?C.gold:accent||C.muted,
    background:gold?"rgba(212,182,120,0.06)":accent?`${accent}11`:"transparent",
  }}>{children}</span>
);

const LuxInput = ({ label, placeholder, type="text", value, onChange, prefix }) => (
  <div style={{ marginBottom:22 }}>
    {label && <Lbl>{label}</Lbl>}
    <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, transition:"border-color .2s" }}
      onFocusCapture={e=>e.currentTarget.style.borderBottomColor=C.gold}
      onBlurCapture={e=>e.currentTarget.style.borderBottomColor=C.border}>
      {prefix && <span style={{ fontFamily:UF, fontSize:14, color:C.muted, marginRight:12, whiteSpace:"nowrap" }}>{prefix}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={{ flex:1, background:"none", border:"none", padding:"12px 0", color:C.cream, fontFamily:UF, fontSize:15, fontWeight:300, letterSpacing:.3 }}/>
    </div>
  </div>
);

const Screen = ({ children, center=false, scroll=false, style={} }) => (
  <div style={{
    minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column",
    justifyContent:center?"center":"flex-start",
    overflowY:scroll?"auto":"hidden", overflowX:"hidden", ...style,
  }}>{children}</div>
);

/* ══════════════════════════════════════════════════════════════
   SPLASH
══════════════════════════════════════════════════════════════ */
function Splash({ onDone }) {
  useEffect(()=>{const t=setTimeout(onDone,2500);return()=>clearTimeout(t);},[]);
  return (
    <Screen center>
      <div style={{ position:"absolute", top:"28%", left:"50%", transform:"translate(-50%,-50%)", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.055) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div className="fi" style={{ textAlign:"center" }}>
        <div style={{ width:72, height:72, margin:"0 auto 24px", border:`1px solid ${C.borderHi}`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(145deg,${C.surface},${C.ink})`, fontSize:32, animation:"drift 4s ease-in-out infinite" }}>⚡</div>
        <div className="gold-text" style={{ fontFamily:SF, fontSize:58, fontWeight:300, letterSpacing:-1, lineHeight:1 }}>EVGoo</div>
        <p style={{ fontFamily:UF, fontSize:10, letterSpacing:4, color:C.muted, marginTop:16, textTransform:"uppercase" }}>Electric · Premium · India</p>
      </div>
      <div style={{ position:"absolute", bottom:52, left:0, right:0, textAlign:"center", fontFamily:UF, fontSize:9, color:C.faint, letterSpacing:3, textTransform:"uppercase", animation:"shimmer 2.5s ease-in-out infinite" }}>Members only</div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOGIN
══════════════════════════════════════════════════════════════ */
function Login({ onOtp, onSignup, onForgot }) {
  const [mode,setMode]=useState("phone");
  const [val,setVal]=useState(""); const [pass,setPass]=useState("");
  return (
    <Screen center style={{ padding:"0 28px" }}>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:240, background:"radial-gradient(ellipse 80% 100% at 50% 0%,rgba(212,182,120,0.05) 0%,transparent 100%)", pointerEvents:"none" }}/>
      <div className="fu" style={{ marginBottom:48, textAlign:"center" }}>
        <div className="gold-text" style={{ fontFamily:SF, fontSize:48, fontWeight:300, letterSpacing:-.5 }}>EVGoo</div>
        <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2.5, marginTop:8, textTransform:"uppercase" }}>Welcome back</p>
      </div>
      <div className="fu1" style={{ display:"flex", marginBottom:36, borderBottom:`1px solid ${C.border}` }}>
        {[["phone","Phone"],["email","Email"]].map(([k,l])=>(
          <button key={k} onClick={()=>{setMode(k);setVal("");}} style={{ flex:1, padding:"12px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:2, textTransform:"uppercase", color:mode===k?C.gold:C.muted, borderBottom:mode===k?`1px solid ${C.gold}`:"1px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
        ))}
      </div>
      <div className="fu2">
        {mode==="phone"
          ?<LuxInput label="Mobile number" placeholder="10-digit number" type="tel" prefix="🇮🇳  +91" value={val} onChange={e=>setVal(e.target.value.slice(0,10))}/>
          :<><LuxInput label="Email address" placeholder="you@example.com" type="email" value={val} onChange={e=>setVal(e.target.value)}/><LuxInput label="Password" placeholder="••••••••" type="password" value={pass} onChange={e=>setPass(e.target.value)}/><div style={{ textAlign:"right", marginBottom:24 }}><span style={{ fontFamily:UF, fontSize:11, color:C.gold, cursor:"pointer", onClick:onForgot }}>Forgot password?</span></div></>}
        <GoldBtn onClick={onOtp} style={{ marginTop:8 }}>{mode==="phone"?"Send OTP":"Sign In"}</GoldBtn>
        <div style={{ display:"flex", alignItems:"center", gap:14, margin:"28px 0" }}>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,transparent,${C.border})` }}/>
          <span style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>or</span>
          <div style={{ flex:1, height:1, background:`linear-gradient(90deg,${C.border},transparent)` }}/>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {[["G","Google"],["f","Facebook"]].map(([ic,name])=>(
            <button key={name} className="press" style={{ flex:1, padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, fontWeight:500, letterSpacing:1.2, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"border-color .2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{ fontSize:15 }}>{ic}</span>{name}
            </button>
          ))}
        </div>
        <p style={{ textAlign:"center", fontFamily:UF, fontSize:13, color:C.muted, marginTop:36, letterSpacing:.3 }}>
          New to EVGoo?{" "}<span onClick={onSignup} style={{ color:C.gold, cursor:"pointer", fontWeight:500 }}>Create account</span>
        </p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIGNUP
══════════════════════════════════════════════════════════════ */
function Signup({ onBack, onDone }) {
  const [step,setStep]=useState(1);
  const [name,setName]=useState(""); const [phone,setPhone]=useState("");
  const [email,setEmail]=useState(""); const [pass,setPass]=useState("");
  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      <BackBtn onClick={step===1?onBack:()=>setStep(1)}/>
      <div style={{ display:"flex", gap:6, marginTop:32, marginBottom:8 }}>
        {[1,2].map(s=><div key={s} style={{ flex:1, height:1, background:s<=step?C.gold:C.border, transition:"background .4s" }}/>)}
      </div>
      <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2.5, textTransform:"uppercase", marginBottom:32 }}>Step {step} of 2</p>
      <div className="fu" style={{ marginBottom:36 }}>
        <h1 style={{ fontFamily:SF, fontSize:36, fontWeight:300, color:C.cream, letterSpacing:-.5, lineHeight:1.15 }}>{step===1?"Create your\naccount":"Secure your\naccount"}</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:12, lineHeight:1.7 }}>{step===1?"Join India's most premium EV ride network.":"Choose a strong password to protect your account."}</p>
      </div>
      {step===1
        ?<div className="fu1"><LuxInput label="Full name" placeholder="As on Aadhaar" value={name} onChange={e=>setName(e.target.value)}/><LuxInput label="Mobile" placeholder="10-digit number" type="tel" prefix="🇮🇳  +91" value={phone} onChange={e=>setPhone(e.target.value.slice(0,10))}/><LuxInput label="Email" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)}/><div style={{ marginTop:32 }}><GoldBtn onClick={()=>setStep(2)}>Continue</GoldBtn></div></div>
        :<div className="fu1"><LuxInput label="Password" placeholder="Min 8 characters" type="password" value={pass} onChange={e=>setPass(e.target.value)}/><LuxInput label="Confirm password" placeholder="Re-enter password" type="password"/><div style={{ padding:"14px 16px", border:`1px solid ${C.border}`, borderRadius:3, marginBottom:20 }}>{["8+ characters","One uppercase","One number"].map(r=><div key={r} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:7 }}><div style={{ width:5, height:5, borderRadius:"50%", background:pass.length>=8?C.success:C.border }}/><span style={{ fontFamily:UF, fontSize:12, color:pass.length>=8?C.muted:C.faint }}>{r}</span></div>)}</div><div style={{ marginTop:16 }}><GoldBtn onClick={onDone}>Create Account</GoldBtn><p style={{ textAlign:"center", fontFamily:UF, fontSize:10, color:C.faint, marginTop:16, lineHeight:1.8 }}>By continuing, you agree to EVGoo's Terms of Service.</p></div></div>}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   OTP
══════════════════════════════════════════════════════════════ */
function OTP({ onBack, onVerify }) {
  const [digits,setDigits]=useState(Array(6).fill(""));
  const refs=Array(6).fill(0).map(()=>useRef());
  const handle=(i,v)=>{const n=[...digits];n[i]=v.slice(-1);setDigits(n);if(v&&i<5)refs[i+1].current?.focus();};
  return (
    <Screen center style={{ padding:"0 28px" }}>
      <div style={{ position:"absolute", top:28, left:28 }}><BackBtn onClick={onBack}/></div>
      <div style={{ position:"absolute", top:0, left:0, right:0, height:200, background:"radial-gradient(ellipse 60% 100% at 50% 0%,rgba(212,182,120,0.05) 0%,transparent 100%)", pointerEvents:"none" }}/>
      <div className="fu" style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ width:64, height:64, margin:"0 auto 24px", border:`1px solid ${C.borderHi}`, borderRadius:3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, background:C.surface }}>📱</div>
        <h1 style={{ fontFamily:SF, fontSize:38, fontWeight:300, color:C.cream, letterSpacing:-.5 }}>Verify OTP</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:10, lineHeight:1.8 }}>A 6-digit code was sent to your<br/>registered mobile number</p>
      </div>
      <div className="fu1" style={{ display:"flex", gap:9, justifyContent:"center", marginBottom:40 }}>
        {digits.map((d,i)=>(
          <input key={i} ref={refs[i]} type="tel" maxLength={1} value={d} onChange={e=>handle(i,e.target.value)} onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)refs[i-1].current?.focus();}}
            style={{ width:44, height:56, background:d?C.surface:C.ink, border:`1px solid ${d?C.gold:C.border}`, borderRadius:3, color:C.gold, fontFamily:SF, fontSize:24, fontWeight:500, textAlign:"center", transition:"all .15s" }}/>
        ))}
      </div>
      <div className="fu2">
        <GoldBtn onClick={onVerify}>Verify & Enter</GoldBtn>
        <p style={{ textAlign:"center", fontFamily:UF, fontSize:12, color:C.muted, marginTop:22 }}>
          Didn't receive?{" "}<span style={{ color:C.gold, cursor:"pointer", fontWeight:500 }}>Resend OTP</span>
        </p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   HOME — Post-login landing
══════════════════════════════════════════════════════════════ */
function Home({ onSearch, onProfile, onSchedule, onPromo }) {
  const QUICK=[{icon:"✈️",name:"Airport"},{icon:"🏢",name:"Office"},{icon:"🛍️",name:"Mall"},{icon:"🏥",name:"Hospital"},{icon:"🎓",name:"Campus"},{icon:"🌿",name:"Park"}];
  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>
      {/* Map */}
      <div style={{ height:340, position:"relative", background:C.ink, overflow:"hidden", flexShrink:0 }}>
        <svg width="100%" height="100%" style={{ position:"absolute", opacity:.07 }}>
          {Array(9).fill(0).map((_,i)=><line key={i} x1={i*55} y1={0} x2={i*55} y2={340} stroke={C.gold} strokeWidth={.5}/>)}
          {Array(7).fill(0).map((_,i)=><line key={i} x1={0} y1={i*55} x2={430} y2={i*55} stroke={C.gold} strokeWidth={.5}/>)}
        </svg>
        <svg width="100%" height="100%" style={{ position:"absolute" }}>
          <path d="M0 180 Q140 155 220 175 Q320 195 430 165" stroke="rgba(242,237,228,0.06)" strokeWidth={14} fill="none" strokeLinecap="round"/>
          <path d="M0 100 Q100 110 200 104 Q300 98 430 115" stroke="rgba(242,237,228,0.04)" strokeWidth={9} fill="none" strokeLinecap="round"/>
          <path d="M188 0 L200 340" stroke="rgba(242,237,228,0.05)" strokeWidth={11} fill="none"/>
          <path d="M310 0 L305 340" stroke="rgba(242,237,228,0.04)" strokeWidth={7} fill="none"/>
        </svg>
        {/* EV cars */}
        {[[65,148],[238,105],[142,195],[328,162]].map(([x,y],i)=>(
          <div key={i} style={{ position:"absolute", left:x, top:y, fontSize:18, filter:`drop-shadow(0 0 5px ${C.goldDim})`, animation:`drift ${3+i*.6}s ease-in-out ${i*.35}s infinite` }}>🚗</div>
        ))}
        {/* User pin */}
        <div style={{ position:"absolute", left:"50%", top:"52%", transform:"translate(-50%,-50%)" }}>
          <div style={{ width:14, height:14, borderRadius:"50%", background:C.gold, border:`2px solid ${C.cream}`, position:"relative", zIndex:2, animation:"pulse 2.5s ease-in-out infinite" }}/>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:40, height:40, borderRadius:"50%", border:`1px solid rgba(212,182,120,0.15)`, animation:"ripple 2.5s ease-out infinite" }}/>
        </div>
        {/* Ambient */}
        <div style={{ position:"absolute", bottom:-60, left:"50%", transform:"translateX(-50%)", width:260, height:140, background:`radial-gradient(ellipse,rgba(212,182,120,0.055) 0%,transparent 70%)`, pointerEvents:"none" }}/>
        {/* Header */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"50px 20px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"linear-gradient(180deg,rgba(10,9,5,0.94) 0%,transparent 100%)" }}>
          <div>
            <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2.5, textTransform:"uppercase" }}>Your location</p>
            <p style={{ fontFamily:UF, fontSize:14, fontWeight:500, color:C.cream, marginTop:3 }}>📍 Connaught Place, Delhi</p>
          </div>
          <button onClick={onProfile} className="press" style={{ width:40, height:40, borderRadius:3, background:C.surface, border:`1px solid ${C.borderHi}`, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>👤</button>
        </div>
        {/* Stats */}
        <div style={{ position:"absolute", bottom:14, left:14, right:14, display:"flex", gap:8 }}>
          {[["⚡","2.4 kg","CO₂ saved"],["🚗","47","Rides"],["⭐","4.9","Rating"]].map(([ic,v,l])=>(
            <div key={l} style={{ flex:1, background:"rgba(10,9,5,0.82)", border:`1px solid ${C.border}`, borderRadius:3, padding:"8px", textAlign:"center", backdropFilter:"blur(8px)" }}>
              <div style={{ fontSize:12 }}>{ic}</div>
              <div style={{ fontFamily:SF, fontSize:16, fontWeight:600, color:C.gold, marginTop:1 }}>{v}</div>
              <div style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking panel */}
      <div style={{ flex:1, background:C.ink, borderTop:`1px solid ${C.border}`, padding:"26px 22px 32px", overflowY:"auto" }}>
        {/* Where to CTA */}
        <div onClick={onSearch} className="press" style={{
          display:"flex", alignItems:"center", gap:14,
          padding:"16px 18px",
          border:`1px solid ${C.borderHi}`,
          borderRadius:3,
          background:C.surface,
          marginBottom:24,
          cursor:"pointer",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
          <div style={{ width:36, height:36, borderRadius:3, background:"rgba(212,182,120,0.08)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🔍</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:SF, fontSize:18, fontWeight:300, color:C.cream, letterSpacing:-.2 }}>Where to?</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2, letterSpacing:.5 }}>Search destination</p>
          </div>
          <div style={{ fontFamily:UF, fontSize:10, color:C.gold, letterSpacing:1.5, textTransform:"uppercase" }}>Go →</div>
        </div>

        {/* Schedule ride CTA */}
        <div onClick={onSchedule} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${C.border}`, borderRadius:3, marginBottom:16, background:"none", cursor:"pointer" }}>
          <div style={{ width:36, height:36, borderRadius:3, background:"rgba(212,182,120,0.06)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>📅</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>Schedule a ride</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>Book up to 7 days in advance</p>
          </div>
          <span style={{ fontFamily:UF, fontSize:10, color:C.goldDim, letterSpacing:1.5, textTransform:"uppercase" }}>Plan →</span>
        </div>

        {/* Quick destinations */}
        <Lbl>Quick destinations</Lbl>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
          {QUICK.map(q=>(
            <button key={q.name} onClick={onSearch} className="press" style={{ padding:"9px 14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, cursor:"pointer", display:"flex", alignItems:"center", gap:7, transition:"border-color .2s" }} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{ fontSize:14 }}>{q.icon}</span>
              <span style={{ fontFamily:UF, fontSize:12, color:C.muted, letterSpacing:.3 }}>{q.name}</span>
            </button>
          ))}
        </div>

        {/* Recent */}
        <Lbl>Recent rides</Lbl>
        {RECENTS.map(r=>(
          <div key={r.name} onClick={onSearch} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
            <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{r.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:400, color:C.cream }}>{r.name}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{r.sub}</p>
            </div>
            <span style={{ color:C.border, fontSize:18 }}>›</span>
          </div>
        ))}

        {/* EV promo banner */}
        <div onClick={onPromo} className="press" style={{ marginTop:24, padding:"16px 18px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, position:"relative", overflow:"hidden", cursor:"pointer" }}>
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:3, background:`linear-gradient(180deg,${C.gold},transparent)` }}/>
          <div style={{ paddingLeft:12 }}>
            <Tag gold>Limited Offer</Tag>
            <p style={{ fontFamily:SF, fontSize:18, fontWeight:400, color:C.cream, marginTop:8, letterSpacing:-.2 }}>50% off your first 3 rides</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4, lineHeight:1.6 }}>Use code <span style={{ color:C.gold, fontWeight:500 }}>EVGOO50</span> at checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SEARCH SCREEN — Full-screen destination picker
══════════════════════════════════════════════════════════════ */
function Search({ onBack, onResults }) {
  const [pickup,setPickup]=useState("Connaught Place, New Delhi");
  const [drop,setDrop]=useState("");
  const [activeField,setActiveField]=useState("drop"); // "pickup" | "drop"
  const [query,setQuery]=useState("");
  const dropRef=useRef();

  useEffect(()=>{ dropRef.current?.focus(); },[]);

  const filtered = query.length>0
    ? SUGGESTIONS.filter(s=>s.name.toLowerCase().includes(query.toLowerCase())||s.sub.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS;

  const handleSelect = (place) => {
    if(activeField==="drop"){
      setDrop(place.name);
      setQuery("");
      if(pickup) setTimeout(()=>onResults({ pickup, drop:place.name }), 150);
    } else {
      setPickup(place.name);
      setQuery("");
      setActiveField("drop");
      dropRef.current?.focus();
    }
  };

  const handleGo = () => {
    if(pickup && drop) onResults({ pickup, drop });
  };

  return (
    <Screen scroll style={{ padding:0 }}>
      {/* Top search box */}
      <div style={{ background:C.ink, padding:"52px 20px 16px", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        {/* Pickup row */}
        <div style={{
          display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
          border:`1px solid ${activeField==="pickup"?C.gold:C.border}`,
          borderRadius:3, background:activeField==="pickup"?C.surface:C.ink,
          marginBottom:8, transition:"all .2s",
        }} onClick={()=>{ setActiveField("pickup"); setQuery(pickup); }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.gold, border:`2px solid ${C.goldDim}` }}/>
            {[0,1,2].map(i=><div key={i} style={{ width:1.5, height:4, background:C.border }}/>)}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Pickup</p>
            {activeField==="pickup"
              ?<input ref={dropRef} autoFocus value={query||pickup} onChange={e=>{setQuery(e.target.value);setPickup(e.target.value);}} style={{ width:"100%", background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:400 }}/>
              :<p style={{ fontFamily:UF, fontSize:14, fontWeight:400, color:C.cream, lineHeight:1.3 }}>{pickup||"Current location"}</p>}
          </div>
          {activeField==="pickup" && <button onClick={()=>{setPickup("");setQuery("");}} style={{ background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer", padding:4 }}>✕</button>}
        </div>

        {/* Drop row */}
        <div style={{
          display:"flex", alignItems:"center", gap:14, padding:"12px 14px",
          border:`1px solid ${activeField==="drop"?C.gold:C.border}`,
          borderRadius:3, background:activeField==="drop"?C.surface:C.ink,
          transition:"all .2s",
        }} onClick={()=>{ setActiveField("drop"); setQuery(drop); }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
            {[0,1,2].map(i=><div key={i} style={{ width:1.5, height:4, background:C.border }}/>)}
            <div style={{ width:10, height:10, borderRadius:2, background:C.danger }}/>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Drop</p>
            {activeField==="drop"
              ?<input ref={dropRef} autoFocus={activeField==="drop"} value={query||drop} onChange={e=>{setQuery(e.target.value);setDrop(e.target.value);}} placeholder="Search destination…" style={{ width:"100%", background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:400 }}/>
              :<p style={{ fontFamily:UF, fontSize:14, fontWeight:400, color:drop?C.cream:C.muted }}>{drop||"Where are you going?"}</p>}
          </div>
          {activeField==="drop" && drop && <button onClick={()=>{setDrop("");setQuery("");}} style={{ background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer", padding:4 }}>✕</button>}
        </div>

        {/* Swap + Back */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:12 }}>
          <button onClick={onBack} className="press" style={{ background:"none", border:"none", color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>← Back</button>
          <button onClick={()=>{const tmp=pickup;setPickup(drop);setDrop(tmp);}} className="press" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", padding:"7px 14px", cursor:"pointer" }}>⇅ Swap</button>
          {pickup && drop && <GoldBtn sm onClick={handleGo}>Search</GoldBtn>}
        </div>
      </div>

      {/* Suggestions */}
      <div style={{ flex:1, padding:"20px 20px 32px", overflowY:"auto" }}>
        {!query && (
          <>
            <Lbl>Recent</Lbl>
            {RECENTS.map(r=>(
              <div key={r.name} onClick={()=>handleSelect({name:r.name,sub:r.sub})} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}>
                <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>{r.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>{r.name}</p>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{r.sub}</p>
                </div>
                <span style={{ color:C.border, fontSize:16 }}>›</span>
              </div>
            ))}
            <Lbl style={{ marginTop:24 }}>Popular in Delhi NCR</Lbl>
          </>
        )}
        {query && <Lbl>{filtered.length} result{filtered.length!==1?"s":""} found</Lbl>}
        {filtered.map((s,i)=>(
          <div key={s.name} onClick={()=>handleSelect(s)} className="press card-hover" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 10px", borderBottom:`1px solid ${C.border}`, cursor:"pointer", animation:`fadeUp .35s ${i*.04}s both` }}>
            <div style={{ width:38, height:38, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{s.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:14, color:C.cream, fontWeight:400 }}>{s.name}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>{s.sub}</p>
            </div>
            <span style={{ fontFamily:UF, fontSize:10, color:C.goldDim, letterSpacing:.5 }}>{s.dist}</span>
          </div>
        ))}
        {filtered.length===0 && (
          <div style={{ textAlign:"center", paddingTop:48 }}>
            <p style={{ fontSize:32, marginBottom:12 }}>🔍</p>
            <p style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream }}>No results</p>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:8 }}>Try a different search term</p>
          </div>
        )}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   CARS AVAILABLE — The main new screen
══════════════════════════════════════════════════════════════ */
function Cars({ route, onBack, onSelect, onSurge }) {
  const [filter,setFilter]=useState("all"); // all | nearest | cheapest | premium
  const [sel,setSel]=useState(null);

  const FILTERS=[["all","All"],["nearest","Nearest"],["cheapest","Cheapest"],["premium","Premium"]];

  const sorted={
    all:DRIVERS,
    nearest:[...DRIVERS].sort((a,b)=>a.eta-b.eta),
    cheapest:[...DRIVERS].sort((a,b)=>a.fare-b.fare),
    premium:[...DRIVERS].filter(d=>["cab","prime"].includes(d.id)),
  }[filter];

  const dist="18.4 km";
  const duration="~34 min";

  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>

      {/* Mini map */}
      <div style={{ height:200, position:"relative", background:C.ink, overflow:"hidden", flexShrink:0 }}>
        <svg width="100%" height="100%" style={{ position:"absolute", opacity:.06 }}>
          {Array(9).fill(0).map((_,i)=><line key={i} x1={i*55} y1={0} x2={i*55} y2={200} stroke={C.gold} strokeWidth={.5}/>)}
          {Array(5).fill(0).map((_,i)=><line key={i} x1={0} y1={i*50} x2={430} y2={i*50} stroke={C.gold} strokeWidth={.5}/>)}
        </svg>
        <svg width="100%" height="100%" style={{ position:"absolute" }}>
          <path d="M0 160 Q90 140 160 148 Q240 156 310 130 Q370 112 430 100" stroke="rgba(242,237,228,0.06)" strokeWidth={14} fill="none" strokeLinecap="round"/>
          <path d="M188 0 L190 200" stroke="rgba(242,237,228,0.04)" strokeWidth={9} fill="none"/>
          {/* Route line */}
          <path d="M 60 155 Q 140 130 220 120 Q 310 108 390 80" stroke={C.gold} strokeWidth={2} fill="none" strokeDasharray="8 5" opacity={.5}/>
          {/* Pickup dot */}
          <circle cx={60} cy={155} r={7} fill={C.gold} opacity={.9}/>
          <circle cx={60} cy={155} r={14} fill="none" stroke={C.gold} strokeWidth={1} opacity={.25}/>
          {/* Drop pin */}
          <circle cx={390} cy={80} r={7} fill={C.danger} opacity={.9}/>
        </svg>
        {/* Animated car on route */}
        <div style={{ position:"absolute", left:190, top:112, fontSize:18, filter:`drop-shadow(0 0 6px ${C.goldDim})`, animation:"drift 3s ease-in-out infinite" }}>🚗</div>

        {/* Top bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, padding:"48px 18px 10px", display:"flex", alignItems:"center", gap:14, background:"linear-gradient(180deg,rgba(10,9,5,0.95) 0%,transparent 100%)" }}>
          <BackBtn onClick={onBack}/>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2.5, textTransform:"uppercase" }}>Route</p>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:400, color:C.cream, marginTop:2 }}>
              <span style={{ color:C.gold }}>●</span> {(route?.pickup||"Connaught Place").split(",")[0]} <span style={{ color:C.muted }}>→</span> <span style={{ color:C.danger }}>■</span> {(route?.drop||"IGI Airport").split("—")[0].trim()}
            </p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontFamily:SF, fontSize:15, fontWeight:500, color:C.gold }}>{dist}</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{duration}</p>
          </div>
        </div>
      </div>

      {/* Panel */}
      <div style={{ flex:1, background:C.ink, borderTop:`1px solid ${C.border}`, display:"flex", flexDirection:"column" }}>

        {/* Header */}
        <div style={{ padding:"20px 20px 0", borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom:14 }}>
            <h2 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>
              {sorted.length} rides available
            </h2>
            <p style={{ fontFamily:UF, fontSize:10, color:C.success, letterSpacing:1 }}>⚡ All EV</p>
          </div>
          {/* Filter tabs */}
          <div style={{ display:"flex", gap:0, marginBottom:0 }}>
            {FILTERS.map(([k,l])=>(
              <button key={k} onClick={()=>{setFilter(k);setSel(null);}} style={{
                flex:1, padding:"11px 6px", background:"none", border:"none", cursor:"pointer",
                fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase",
                color:filter===k?C.gold:C.muted,
                borderBottom:filter===k?`1.5px solid ${C.gold}`:"1.5px solid transparent",
                transition:"all .2s",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Car list */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px 32px" }}>
          {sorted.map((d,i)=>(
            <div key={d.id} onClick={()=>setSel(sel===d.id?null:d.id)} className="press card-hover" style={{
              marginBottom:10,
              border:`1px solid ${sel===d.id?C.gold:d.featured?"rgba(212,182,120,0.2)":C.border}`,
              borderRadius:3,
              background:sel===d.id?"rgba(212,182,120,0.05)":d.featured?C.surface:C.ink,
              overflow:"hidden",
              transition:"all .2s",
              animation:`slideUp .4s ${i*.07}s both`,
              position:"relative",
            }}>
              {/* Gold line for selected */}
              {sel===d.id && <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)` }}/>}
              {/* Featured badge */}
              {d.featured && sel!==d.id && (
                <div style={{ position:"absolute", top:10, right:10 }}>
                  <Tag gold>Most Popular</Tag>
                </div>
              )}

              {/* Main row */}
              <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 16px" }}>
                {/* Vehicle glyph */}
                <div style={{ width:54, height:54, borderRadius:3, background:`linear-gradient(135deg,${d.color},${C.surface})`, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{d.glyph}</div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontFamily:UF, fontSize:15, fontWeight:600, color:C.cream }}>{d.type}</span>
                    {d.featured && <Tag gold>★</Tag>}
                  </div>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3, letterSpacing:.3 }}>{d.desc}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:6 }}>
                    <span style={{ fontFamily:UF, fontSize:10, color:C.goldDim }}>⭐ {d.rating}</span>
                    <span style={{ color:C.border }}>·</span>
                    <span style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{d.trips} trips</span>
                    <span style={{ color:C.border }}>·</span>
                    <span style={{ fontFamily:UF, fontSize:10, color:C.success }}>🚗 {d.eta} min</span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:SF, fontSize:24, fontWeight:500, color:sel===d.id?C.gold:C.cream, letterSpacing:-.3 }}>₹{d.fare}</div>
                  <div style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, marginTop:2 }}>Total fare</div>
                </div>
              </div>

              {/* Expanded details */}
              {sel===d.id && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 16px 16px", animation:"fadeIn .25s ease" }}>
                  {/* Driver info */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:14, padding:"12px 14px", background:C.surface, borderRadius:3, border:`1px solid ${C.border}` }}>
                    <div style={{ width:38, height:38, borderRadius:"50%", background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>👨‍✈️</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color:C.cream }}>{d.driver}</p>
                      <div style={{ display:"flex", gap:8, marginTop:4 }}>
                        <Tag>{d.plate}</Tag>
                        <Tag gold>⭐ {d.rating}</Tag>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <button className="press" style={{ width:34, height:34, borderRadius:3, background:"none", border:`1px solid ${C.borderHi}`, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>📞</button>
                      <button className="press" style={{ width:34, height:34, borderRadius:3, background:"none", border:`1px solid ${C.border}`, cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>💬</button>
                    </div>
                  </div>

                  {/* Fare breakdown */}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                    {[["🕐","ETA",`${d.eta} min`],["👥","Capacity",`${d.capacity} seats`],["⚡","Energy","100% EV"],["🌱","Emission","Zero CO₂"]].map(([ic,k,v])=>(
                      <div key={k} style={{ padding:"10px 12px", background:C.surface, borderRadius:3, border:`1px solid ${C.border}` }}>
                        <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>{ic} {k}</p>
                        <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, marginTop:4 }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Fare line items */}
                  <div style={{ padding:"12px 14px", background:C.surface, borderRadius:3, border:`1px solid ${C.border}`, marginBottom:14 }}>
                    {[["Base fare","₹50"],[`Distance (${dist})`,`₹${d.fare-50-15}`],["EV Green Discount","−₹15"]].map(([k,v])=>(
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                        <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{k}</span>
                        <span style={{ fontFamily:UF, fontSize:11, color:v.startsWith("−")?C.success:C.cream, fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ height:1, background:C.border, margin:"8px 0" }}/>
                    <div style={{ display:"flex", justifyContent:"space-between" }}>
                      <span style={{ fontFamily:UF, fontSize:10, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>Total</span>
                      <span style={{ fontFamily:SF, fontSize:22, color:C.gold, fontWeight:500 }}>₹{d.fare}</span>
                    </div>
                  </div>

                  <GoldBtn onClick={()=>onSelect(d)}>Book {d.type} →</GoldBtn>
                </div>
              )}

              {/* Tap hint when collapsed */}
              {sel!==d.id && (
                <div style={{ borderTop:`1px solid ${C.border}`, padding:"10px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>{d.tagline}</span>
                  <span style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:1.2, textTransform:"uppercase" }}>Tap to expand ↓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONFIRM — Pre-payment summary
══════════════════════════════════════════════════════════════ */
function Confirm({ ride, route, onBack, onPay, onMultiStop }) {
  const [promo,setPromo]=useState(""); const [promoOpen,setPromoOpen]=useState(false);
  const discount=promo==="EVGOO50"?50:0;
  const total=(ride?.fare||349)-discount;
  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Confirm Ride</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>{ride?.type||"EV Cab"} · {(route?.pickup||"").split(",")[0]} → {(route?.drop||"").split("—")[0]}</p>
        </div>
      </div>

      {/* Ride hero card */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"22px 20px", marginBottom:24, background:C.surface, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:18 }}>
          <div style={{ width:60, height:60, borderRadius:3, background:C.elevated, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>{ride?.glyph||"🚗"}</div>
          <div style={{ flex:1 }}>
            <h3 style={{ fontFamily:SF, fontSize:22, fontWeight:400, color:C.cream, letterSpacing:-.2 }}>{ride?.type||"EV Cab"}</h3>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4 }}>{ride?.desc||"Sedan · Tata Nexon EV"}</p>
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <Tag gold>⭐ {ride?.rating||"4.9"}</Tag>
              <Tag>{ride?.plate||"DL 3C 9821"}</Tag>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div className="gold-text" style={{ fontFamily:SF, fontSize:32, fontWeight:500 }}>₹{total}</div>
          </div>
        </div>
        <div style={{ height:1, background:C.border, marginBottom:14 }}/>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {[["🕐",`${ride?.eta||6} min ETA`],["👤",ride?.driver||"Arjun S."],["⚡","100% EV"]].map(([ic,v])=>(
            <span key={v} style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{ic} {v}</span>
          ))}
        </div>
      </div>

      {/* Route */}
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"16px 18px", marginBottom:22, background:C.surface }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:3, gap:3 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.gold }}/>
            {[0,1,2,3].map(i=><div key={i} style={{ width:1.5, height:5, background:C.border }}/>)}
            <div style={{ width:10, height:10, borderRadius:2, background:C.danger }}/>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ marginBottom:14 }}>
              <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Pickup</p>
              <p style={{ fontFamily:UF, fontSize:14, color:C.cream, lineHeight:1.4 }}>{route?.pickup||"Connaught Place, New Delhi"}</p>
            </div>
            <div>
              <p style={{ fontFamily:UF, fontSize:9, color:"rgba(192,97,74,.7)", letterSpacing:2, textTransform:"uppercase", marginBottom:3 }}>Drop</p>
              <p style={{ fontFamily:UF, fontSize:14, color:C.cream, lineHeight:1.4 }}>{route?.drop||"IGI Airport, New Delhi"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo */}
      <div onClick={()=>setPromoOpen(!promoOpen)} className="press" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", border:`1px solid ${promo?C.gold:C.border}`, borderRadius:3, marginBottom:promoOpen?8:20, cursor:"pointer" }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}><span>🎟️</span><span style={{ fontFamily:UF, fontSize:12, color:promo?C.gold:C.muted }}>{promo?`"${promo}" applied · −₹${discount}`:"Apply promo code"}</span></div>
        <span style={{ color:C.goldDim, fontSize:18 }}>{promoOpen?"−":"+"}</span>
      </div>
      {promoOpen && (
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          <input placeholder="Try EVGOO50" value={promo} onChange={e=>setPromo(e.target.value.toUpperCase())} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"11px 14px", color:C.cream, fontFamily:UF, fontSize:13, outline:"none" }}/>
          <GoldBtn sm onClick={()=>setPromoOpen(false)}>Apply</GoldBtn>
        </div>
      )}

      <button onClick={onMultiStop} className="press" style={{ width:"100%", padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", marginBottom:10 }}>
          ➕ Add multiple stops
        </button>
        <GoldBtn onClick={onPay}>Confirm Ride →</GoldBtn>
      <p style={{ textAlign:"center", fontFamily:UF, fontSize:10, color:C.faint, marginTop:16, lineHeight:1.8 }}>
        Cancellation is free up to 3 minutes after booking
      </p>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYMENT
══════════════════════════════════════════════════════════════ */
function Pay({ ride, onBack, onDone, onFail }) {
  const [sel,setSel]=useState("gpay"); const [busy,setBusy]=useState(false);
  const go=()=>{setBusy(true);setTimeout(onDone,1800);};
  if(busy) return (
    <Screen center>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .9s linear infinite", margin:"0 auto 24px" }}/>
        <p style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream }}>Processing…</p>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:8, letterSpacing:.5 }}>Connecting to {PAY_METHODS.find(p=>p.id===sel)?.name}</p>
      </div>
    </Screen>
  );
  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:36 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Pay for ride</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Choose how you'd like to pay</p>
        </div>
      </div>
      <div style={{ textAlign:"center", padding:"32px 24px", border:`1px solid ${C.borderHi}`, borderRadius:3, background:C.surface, marginBottom:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
        <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Total fare</p>
        <div className="gold-text" style={{ fontFamily:SF, fontSize:58, fontWeight:300, letterSpacing:-1 }}>₹{ride?.fare||349}</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:16 }}>
          <Tag gold>⚡ {ride?.type||"EV Cab"}</Tag><Tag>🌱 Zero Emission</Tag>
        </div>
      </div>
      <Lbl>Select payment method</Lbl>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
        {PAY_METHODS.map(pm=>(
          <div key={pm.id} onClick={()=>setSel(pm.id)} className="press card-hover" style={{ display:"flex", alignItems:"center", gap:16, padding:"15px 18px", border:`1px solid ${sel===pm.id?C.gold:C.border}`, borderRadius:3, background:sel===pm.id?"rgba(212,182,120,0.04)":C.ink, cursor:"pointer", transition:"all .2s" }}>
            <div style={{ width:40, height:40, borderRadius:3, background:`${pm.accent}1A`, border:`1px solid ${pm.accent}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{pm.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:14, fontWeight:500, color:C.cream }}>{pm.name}</p>
              <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>{pm.sub}</p>
            </div>
            {sel===pm.id && <div style={{ width:18, height:18, borderRadius:"50%", background:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.obsidian, fontWeight:700 }}>✓</div>}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:12, alignItems:"center", padding:"12px 16px", border:`1px solid ${C.border}`, borderRadius:3, marginBottom:24 }}>
        <span>🔒</span>
        <span style={{ fontFamily:UF, fontSize:10, color:C.faint, lineHeight:1.7, letterSpacing:.3 }}>256-bit encrypted · PCI DSS compliant · RBI approved</span>
      </div>
      <GoldBtn onClick={go}>Pay ₹{ride?.fare||349}</GoldBtn>
      <button onClick={onFail} className='press' style={{width:'100%',marginTop:10,padding:'13px',background:'none',border:`1px solid ${C.border}`,borderRadius:3,color:C.muted,fontFamily:UF,fontSize:10,letterSpacing:1.8,textTransform:'uppercase',cursor:'pointer'}}>Simulate failure →</button>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRACKING
══════════════════════════════════════════════════════════════ */
function Track({ ride, onHome, onSOS, onShare, onCancel, onRideEnd }) {
  const [eta,setEta]=useState(ride?.eta||6);
  useEffect(()=>{if(eta<=0)return;const t=setInterval(()=>setEta(e=>Math.max(0,e-1)),3000);return()=>clearInterval(t);},[]);
  const progress=Math.round((( ride?.eta||6)-eta)/(ride?.eta||6)*100);
  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>
      <div style={{ height:300, position:"relative", background:C.ink, overflow:"hidden", flexShrink:0 }}>
        <svg width="100%" height="100%" style={{ position:"absolute", opacity:.07 }}>
          {Array(9).fill(0).map((_,i)=><line key={i} x1={i*55} y1={0} x2={i*55} y2={300} stroke={C.gold} strokeWidth={.5}/>)}
          {Array(6).fill(0).map((_,i)=><line key={i} x1={0} y1={i*50} x2={430} y2={i*50} stroke={C.gold} strokeWidth={.5}/>)}
        </svg>
        <svg width="100%" height="100%" style={{ position:"absolute" }}>
          <path d="M 80 250 Q 190 210 280 170 Q 340 145 380 90" stroke={C.gold} strokeWidth={1.5} fill="none" strokeDasharray="7 5" opacity={.35}/>
          <circle cx={380} cy={90} r={6} fill={C.danger}/>
          <circle cx={80} cy={250} r={6} fill={C.gold}/>
        </svg>
        <div style={{ position:"absolute", left:200, top:165, fontSize:22, filter:`drop-shadow(0 0 6px ${C.goldDim})`, animation:"drift 2.5s ease-in-out infinite" }}>{ride?.glyph||"🚗"}</div>
        <div style={{ position:"absolute", top:52, left:0, right:0, display:"flex", justifyContent:"center" }}>
          <div style={{ background:"rgba(10,9,5,0.9)", border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"12px 28px", textAlign:"center" }}>
            <span style={{ fontFamily:SF, fontSize:32, fontWeight:500, color:C.gold }}>{eta}</span>
            <span style={{ fontFamily:UF, fontSize:12, color:C.muted, marginLeft:8 }}>min away</span>
          </div>
        </div>
      </div>
      <div style={{ flex:1, background:C.ink, borderTop:`1px solid ${C.border}`, padding:"22px 22px 32px", overflowY:"auto" }}>
        <div style={{ display:"flex", gap:16, alignItems:"center", padding:"18px", border:`1px solid ${C.borderHi}`, borderRadius:3, background:C.surface, marginBottom:22, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
          <div style={{ width:52, height:52, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>👨‍✈️</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:16, fontWeight:600, color:C.cream }}>{ride?.driver||"Arjun S."}</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3 }}>⭐ {ride?.rating||"4.9"} · {ride?.trips||"6,210"} trips</p>
            <div style={{ display:"flex", gap:8, marginTop:10 }}><Tag gold>{ride?.type||"EV Cab"}</Tag><Tag>{ride?.plate||"DL 3C 9821"}</Tag></div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["📞",C.gold],["💬",C.muted]].map(([ic,col])=>(
              <button key={ic} className="press" style={{ width:38, height:38, borderRadius:3, background:"none", border:`1px solid ${col===C.gold?C.borderHi:C.border}`, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>{ic}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Driver en route</span>
            <span style={{ fontFamily:UF, fontSize:11, color:C.gold, fontWeight:500 }}>{progress}%</span>
          </div>
          <div style={{ height:1, background:C.border }}>
            <div style={{ height:"100%", width:`${progress}%`, background:`linear-gradient(90deg,${C.gold},${C.goldLight})`, transition:"width 1s ease" }}/>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[["🔋","87%","Battery"],["⚡","42 km","Range"],["🌡️","24°C","Cabin"]].map(([ic,v,l])=>(
            <div key={l} style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 8px", textAlign:"center", background:C.surface }}>
              <div style={{ fontSize:13 }}>{ic}</div>
              <div style={{ fontFamily:SF, fontSize:17, fontWeight:500, color:C.gold, marginTop:2 }}>{v}</div>
              <div style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:10, marginBottom:12 }}>
          <button onClick={onSOS} className="press" style={{ flex:1, padding:"15px", background:"rgba(192,97,74,0.1)", border:"1.5px solid rgba(192,97,74,0.5)", borderRadius:3, color:"#E8775F", fontFamily:UF, fontSize:11, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            🆘 SOS Emergency
          </button>
          <button onClick={onShare} className="press" style={{ flex:1, padding:"15px", background:"rgba(212,182,120,0.06)", border:`1px solid ${C.borderHi}`, borderRadius:3, color:C.gold, fontFamily:UF, fontSize:11, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            📡 Share
          </button>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <GoldBtn ghost onClick={onCancel} style={{ flex:1 }}>Cancel Ride</GoldBtn>
          <button onClick={onRideEnd} className='press' style={{ flex:1, padding:'16px', background:'rgba(90,158,114,0.1)', border:'1px solid rgba(90,158,114,0.4)', borderRadius:3, color:'#5A9E72', fontFamily:UF, fontSize:11, fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer' }}>Ride Ended ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════════════════ */
function Profile({ onBack, onEdit, onNav }) {
  const STATS=[["47","Rides"],["2.4 kg","CO₂ saved"],["₹12,400","Spent"],["4.9 ⭐","Rating"]];
  const MENU=[
    ["💰","EVGoo Wallet","₹1,245 balance",S.WALLET],
    ["💳","Saved Cards & UPI","3 methods",S.CARDS],
    ["📍","Saved Addresses","Home, Work +1",S.ADDRESSES],
    ["🎟️","My Coupons","2 active",S.COUPONS],
    ["📜","Ride History","47 rides",S.HISTORY],
    ["🔔","Notifications","",S.NOTIFS],
    ["⚡","EVGoo Pass","Manage subscription",S.SUBS],
    ["⚙️","Settings","Language, notifications & more",S.SETTINGS],
    ["💬","Help & Support","Chat, FAQ & tickets",S.HELP],
    ["🌿","CO₂ Impact","Your eco dashboard",S.ECODASH],
    ["🎁","Refer a friend","Earn ₹100 per join",S.REFERRAL],
    ["🛡️","Safety preferences","Driver filter & more",S.SAFETYPREFS],
    ["ℹ️","About EVGoo","v2.4.1",null],
  ];
  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36 }}>
        <BackBtn onClick={onBack}/>
        <h2 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Profile</h2>
        <button onClick={onEdit} className="press" style={{ fontFamily:UF, fontSize:9, fontWeight:500, color:C.gold, background:"none", border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"8px 16px", cursor:"pointer", letterSpacing:1.8, textTransform:"uppercase" }}>Edit</button>
      </div>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ width:80, height:80, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 16px" }}>👤</div>
        <h2 style={{ fontFamily:SF, fontSize:30, fontWeight:300, color:C.cream, letterSpacing:-.5 }}>Arjun Sharma</h2>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:6 }}>arjun.sharma@gmail.com</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:14 }}><Tag gold>✅ Verified</Tag><Tag gold>⭐ Gold Member</Tag></div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:32 }}>
        {STATS.map(([v,l])=>(
          <div key={l} style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"18px", background:C.surface }}>
            <div style={{ fontFamily:SF, fontSize:24, fontWeight:500, color:C.gold }}>{v}</div>
            <div style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", marginTop:6 }}>{l}</div>
          </div>
        ))}
      </div>
      <Lbl>Account</Lbl>
      {MENU.map(([ic,lbl,sub,dest])=>(
        <div key={lbl} onClick={()=>dest&&onNav&&onNav(dest)} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${C.border}`, cursor:dest?"pointer":"default" }}>
          <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>{ic}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:14, fontWeight:400, color:C.cream }}>{lbl}</p>
            {sub&&<p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>{sub}</p>}
          </div>
          <span style={{ color:dest?C.gold:C.border, fontSize:18 }}>{dest?"›":"–"}</span>
        </div>
      ))}
      <button className="press" style={{ width:"100%", marginTop:28, padding:"15px", fontFamily:UF, fontSize:10, fontWeight:500, letterSpacing:2, textTransform:"uppercase", color:C.danger, background:"none", border:`1px solid rgba(192,97,74,0.25)`, borderRadius:3, cursor:"pointer" }}>Log Out</button>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   EDIT PROFILE
══════════════════════════════════════════════════════════════ */
function EditProfile({ onBack }) {
  const [name,setName]=useState("Arjun Sharma"); const [phone,setPhone]=useState("9876543210");
  const [email,setEmail]=useState("arjun.sharma@gmail.com"); const [dob,setDob]=useState("1995-04-15");
  const [gender,setGender]=useState("male"); const [saved,setSaved]=useState(false);
  const save=()=>{setSaved(true);setTimeout(()=>{setSaved(false);onBack();},1200);};
  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:36 }}>
        <BackBtn onClick={onBack}/>
        <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Edit Profile</h1>
      </div>
      <div style={{ textAlign:"center", marginBottom:36 }}>
        <div style={{ position:"relative", display:"inline-block" }}>
          <div style={{ width:80, height:80, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>👤</div>
          <div className="press" style={{ position:"absolute", bottom:-4, right:-4, width:26, height:26, borderRadius:2, background:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, cursor:"pointer", color:C.obsidian }}>📷</div>
        </div>
        <p style={{ fontFamily:UF, fontSize:9, color:C.gold, marginTop:14, letterSpacing:2, cursor:"pointer", textTransform:"uppercase" }}>Change photo</p>
      </div>
      <LuxInput label="Full name" placeholder="As on Aadhaar" value={name} onChange={e=>setName(e.target.value)}/>
      <LuxInput label="Mobile" placeholder="10-digit number" type="tel" prefix="🇮🇳  +91" value={phone} onChange={e=>setPhone(e.target.value.slice(0,10))}/>
      <LuxInput label="Email address" placeholder="you@example.com" type="email" value={email} onChange={e=>setEmail(e.target.value)}/>
      <LuxInput label="Date of birth" type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
      <Lbl style={{ marginTop:6 }}>Gender</Lbl>
      <div style={{ display:"flex", gap:8, marginBottom:32 }}>
        {["Male","Female","Other"].map(g=>(
          <button key={g} onClick={()=>setGender(g.toLowerCase())} className="press" style={{ flex:1, padding:"12px", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", border:`1px solid ${gender===g.toLowerCase()?C.gold:C.border}`, borderRadius:3, background:gender===g.toLowerCase()?"rgba(212,182,120,0.06)":"none", color:gender===g.toLowerCase()?C.gold:C.muted, cursor:"pointer", transition:"all .2s" }}>{g}</button>
        ))}
      </div>
      <GoldBtn onClick={save} style={{ background:saved?"linear-gradient(135deg,#3D7A52,#5A9E72)":undefined }}>
        {saved?"✓  Saved":"Save Changes"}
      </GoldBtn>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SAVED CARDS & UPI
══════════════════════════════════════════════════════════════ */
const CARDS_DATA = [
  { id:"hdfc",    type:"card", network:"Visa",       name:"HDFC Regalia Credit",   last4:"4821", expiry:"09/27", color:"#1A160E", accent:"#C9A84C", icon:"💳", primary:true  },
  { id:"sbi",     type:"card", network:"Mastercard", name:"SBI SimplySAVE Debit",  last4:"7734", expiry:"03/26", color:"#0E1218", accent:"#1A73E8", icon:"💳", primary:false },
  { id:"axis",    type:"card", network:"RuPay",      name:"Axis Bank Debit",       last4:"2291", expiry:"11/25", color:"#12180E", accent:"#5A9E72", icon:"💳", primary:false },
  { id:"gpayupi", type:"upi",  network:"GPay",       name:"arjun.sharma@okaxis",   last4:null,   expiry:null,    color:"#0E1218", accent:"#1A73E8", icon:"🔵", primary:false },
  { id:"ppeupi",  type:"upi",  network:"PhonePe",    name:"9876543210@ybl",         last4:null,   expiry:null,    color:"#130E1A", accent:"#7B2FBE", icon:"💜", primary:false },
];

function SavedCards({ onBack }) {
  const [cards, setCards] = useState(CARDS_DATA);
  const [addOpen, setAddOpen] = useState(false);
  const [delId, setDelId] = useState(null);
  const [newCard, setNewCard] = useState({ num:"", name:"", expiry:"", cvv:"" });
  const setPrimary = (id) => setCards(cs => cs.map(c => ({ ...c, primary: c.id === id })));
  const deleteCard = (id) => { setCards(cs => cs.filter(c => c.id !== id)); setDelId(null); };
  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <BackBtn onClick={onBack}/>
        <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Cards & UPI</h2>
        <button onClick={() => setAddOpen(!addOpen)} className="press" style={{ fontFamily:UF, fontSize:9, color:C.gold, background:"none", border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"8px 14px", cursor:"pointer", letterSpacing:1.8, textTransform:"uppercase" }}>+ Add</button>
      </div>
      {addOpen && (
        <div className="fu" style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"20px", marginBottom:24, background:C.surface, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
          <p style={{ fontFamily:SF, fontSize:18, fontWeight:300, color:C.cream, marginBottom:18 }}>Add new card</p>
          {[["Card number","num","tel","4242 4242 4242 4242"],["Name on card","name","text","Arjun Sharma"],["Expiry (MM/YY)","expiry","text","MM / YY"],["CVV","cvv","password","•••"]].map(([lbl,key,type,ph])=>(
            <div key={key} style={{ marginBottom:16 }}>
              <Lbl>{lbl}</Lbl>
              <input type={type} placeholder={ph} value={newCard[key]} onChange={e => setNewCard(n => ({ ...n, [key]: e.target.value }))}
                style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"10px 0", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}
                onFocus={e => e.target.style.borderBottomColor = C.gold} onBlur={e => e.target.style.borderBottomColor = C.border}/>
            </div>
          ))}
          <div style={{ display:"flex", gap:10, marginTop:8 }}>
            <GoldBtn sm onClick={() => { setAddOpen(false); setNewCard({ num:"", name:"", expiry:"", cvv:"" }); }}>Save Card</GoldBtn>
            <button onClick={() => setAddOpen(false)} className="press" style={{ padding:"10px 20px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      <Lbl>Debit & Credit cards ({cards.filter(c => c.type === "card").length})</Lbl>
      {cards.filter(c => c.type === "card").map((c, i) => (
        <div key={c.id} style={{ marginBottom:12, border:`1px solid ${c.primary ? C.gold : C.border}`, borderRadius:3, overflow:"hidden", animation:`fadeUp .4s ${i * .08}s both` }}>
          <div style={{ background:`linear-gradient(135deg,${c.color},${C.ink})`, padding:"18px 18px 14px", position:"relative" }}>
            <div style={{ position:"absolute", top:0, right:0, width:110, height:110, borderRadius:"50%", background:`${c.accent}0A`, transform:"translate(30%,-30%)" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
              <div>
                <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>{c.network}</p>
                {c.primary && <div style={{ marginTop:6 }}><Tag gold>Primary</Tag></div>}
              </div>
              <span style={{ fontSize:22 }}>{c.icon}</span>
            </div>
            <p style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:3 }}>•••• •••• •••• {c.last4}</p>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:12 }}>
              <div><p style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>Card holder</p><p style={{ fontFamily:UF, fontSize:12, color:C.cream, marginTop:2 }}>Arjun Sharma</p></div>
              <div style={{ textAlign:"right" }}><p style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>Expires</p><p style={{ fontFamily:UF, fontSize:12, color:C.cream, marginTop:2 }}>{c.expiry}</p></div>
            </div>
          </div>
          <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
            {!c.primary
              ? <button onClick={() => setPrimary(c.id)} className="press" style={{ flex:1, padding:"11px", background:"none", border:"none", borderRight:`1px solid ${C.border}`, color:C.gold, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>Set primary</button>
              : <div style={{ flex:1, padding:"11px", textAlign:"center", fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", color:C.muted }}>Default card</div>}
            <button onClick={() => setDelId(c.id === delId ? null : c.id)} className="press" style={{ padding:"11px 18px", background:"none", border:"none", color:delId === c.id ? C.danger : C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
              {delId === c.id ? "Confirm?" : "Remove"}
            </button>
            {delId === c.id && <button onClick={() => deleteCard(c.id)} className="press" style={{ padding:"11px 14px", background:"rgba(192,97,74,.12)", border:"none", borderLeft:`1px solid rgba(192,97,74,.25)`, color:C.danger, fontFamily:UF, fontSize:10, cursor:"pointer" }}>✓</button>}
          </div>
        </div>
      ))}
      <Lbl style={{ marginTop:24 }}>UPI IDs ({cards.filter(c => c.type === "upi").length})</Lbl>
      {cards.filter(c => c.type === "upi").map((c, i) => (
        <div key={c.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${C.border}`, borderRadius:3, marginBottom:10, background:C.surface }}>
          <div style={{ width:40, height:40, borderRadius:3, background:`${c.accent}18`, border:`1px solid ${c.accent}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{c.network}</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>{c.name}</p>
          </div>
          <button onClick={() => setDelId(c.id === delId ? null : c.id)} className="press" style={{ background:"none", border:`1px solid ${delId === c.id ? "rgba(192,97,74,.4)" : C.border}`, borderRadius:3, padding:"7px 12px", color:delId === c.id ? C.danger : C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
            {delId === c.id ? "Delete?" : "Remove"}
          </button>
          {delId === c.id && <button onClick={() => deleteCard(c.id)} className="press" style={{ background:"rgba(192,97,74,.12)", border:`1px solid rgba(192,97,74,.25)`, borderRadius:3, padding:"7px 10px", color:C.danger, fontFamily:UF, fontSize:9, cursor:"pointer" }}>✓</button>}
        </div>
      ))}
      <div style={{ marginTop:16, padding:"14px 16px", border:`1px dashed ${C.border}`, borderRadius:3, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} className="press">
        <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.goldDim, fontSize:18 }}>+</div>
        <div><p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>Link new UPI ID</p><p style={{ fontFamily:UF, fontSize:10, color:C.faint, marginTop:2 }}>PhonePe · GPay · Paytm · BHIM</p></div>
      </div>
      <div style={{ marginTop:28, padding:"14px 16px", border:`1px solid ${C.border}`, borderRadius:3, display:"flex", gap:12, alignItems:"flex-start", background:C.surface }}>
        <span style={{ fontSize:16, marginTop:1 }}>🔒</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>Your payment data is encrypted end-to-end and never stored on EVGoo servers. PCI DSS Level 1 certified.</p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SAVED ADDRESSES
══════════════════════════════════════════════════════════════ */
const ADDR_DATA = [
  { id:"home", label:"Home", icon:"🏠", addr:"B-24, Sector 62, Noida, Uttar Pradesh 201309",          lat:"28.6139° N", lng:"77.2090° E", primary:true  },
  { id:"work", label:"Work", icon:"🏢", addr:"DLF Cyber City, Phase II, Gurugram, Haryana 122002",    lat:"28.4595° N", lng:"77.0266° E", primary:false },
  { id:"gym",  label:"Gym",  icon:"🏋️", addr:"Gold's Gym, Sector 18, Noida, Uttar Pradesh 201301", lat:"28.5706° N", lng:"77.3219° E", primary:false },
];

function SavedAddresses({ onBack }) {
  const [addrs, setAddrs] = useState(ADDR_DATA);
  const [addOpen, setAddOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({ label:"", addr:"", icon:"🏠" });
  const ICONS = ["🏠","🏢","🏋️","✈️","🏥","🎓","🛍️","🌿","🏛️","👨‍👩‍👧"];
  const deleteAddr = (id) => setAddrs(as => as.filter(a => a.id !== id));
  const setPrimary = (id) => setAddrs(as => as.map(a => ({ ...a, primary: a.id === id })));
  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32 }}>
        <BackBtn onClick={onBack}/>
        <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Saved Addresses</h2>
        <button onClick={() => setAddOpen(!addOpen)} className="press" style={{ fontFamily:UF, fontSize:9, color:C.gold, background:"none", border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"8px 14px", cursor:"pointer", letterSpacing:1.8, textTransform:"uppercase" }}>+ Add</button>
      </div>
      {addOpen && (
        <div className="fu" style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"20px", marginBottom:24, background:C.surface, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
          <p style={{ fontFamily:SF, fontSize:18, fontWeight:300, color:C.cream, marginBottom:18 }}>Add new address</p>
          <Lbl>Label</Lbl>
          <input placeholder="e.g. Home, Office, Gym…" value={newAddr.label} onChange={e => setNewAddr(n => ({ ...n, label: e.target.value }))}
            style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"10px 0", color:C.cream, fontFamily:UF, fontSize:14, outline:"none", marginBottom:18 }}/>
          <Lbl>Icon</Lbl>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setNewAddr(n => ({ ...n, icon: ic }))} className="press"
                style={{ width:36, height:36, fontSize:18, borderRadius:3, border:`1px solid ${newAddr.icon === ic ? C.gold : C.border}`, background:newAddr.icon === ic ? "rgba(212,182,120,0.08)" : "none", cursor:"pointer" }}>{ic}</button>
            ))}
          </div>
          <Lbl>Full address</Lbl>
          <textarea placeholder="Building, Street, City, PIN…" value={newAddr.addr} onChange={e => setNewAddr(n => ({ ...n, addr: e.target.value }))}
            style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"10px 0", color:C.cream, fontFamily:UF, fontSize:14, outline:"none", resize:"none", height:64, marginBottom:18 }}/>
          <div style={{ display:"flex", gap:10 }}>
            <GoldBtn sm onClick={() => { setAddOpen(false); setNewAddr({ label:"", addr:"", icon:"🏠" }); }}>Save</GoldBtn>
            <button onClick={() => setAddOpen(false)} className="press" style={{ padding:"10px 20px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {addrs.map((a, i) => (
          <div key={a.id} style={{ border:`1px solid ${a.primary ? C.gold : C.border}`, borderRadius:3, overflow:"hidden", animation:`fadeUp .4s ${i * .08}s both` }}>
            <div style={{ padding:"16px 18px", background:C.surface }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:42, height:42, borderRadius:3, border:`1px solid ${a.primary ? C.borderHi : C.border}`, background:a.primary ? "rgba(212,182,120,0.06)" : C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{a.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <p style={{ fontFamily:UF, fontSize:14, fontWeight:600, color:C.cream }}>{a.label}</p>
                    {a.primary && <Tag gold>Default</Tag>}
                  </div>
                  <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:5, lineHeight:1.6 }}>{a.addr}</p>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.faint, marginTop:6 }}>{a.lat} · {a.lng}</p>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
              <button className="press" style={{ flex:1, padding:"10px", background:"none", border:"none", borderRight:`1px solid ${C.border}`, color:C.gold, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Edit</button>
              {!a.primary
                ? <button onClick={() => setPrimary(a.id)} className="press" style={{ flex:1, padding:"10px", background:"none", border:"none", borderRight:`1px solid ${C.border}`, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Set default</button>
                : <div style={{ flex:1, padding:"10px", textAlign:"center", fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:C.faint }}>Default</div>}
              <button onClick={() => deleteAddr(a.id)} className="press" style={{ padding:"10px 16px", background:"none", border:"none", color:C.danger, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div onClick={() => setAddOpen(true)} style={{ marginTop:14, padding:"14px 16px", border:`1px dashed ${C.border}`, borderRadius:3, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }} className="press">
        <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.goldDim, fontSize:18 }}>+</div>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>Add a new address</p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   MY COUPONS
══════════════════════════════════════════════════════════════ */
const COUPON_DATA = [
  { id:"c1", code:"EVGOO50",   title:"50% off your ride",         desc:"Flat 50% off on your next EV Cab or Prime ride",       min:"₹200", max:"₹150", expiry:"31 May 2026", type:"percent", val:50,  used:false, cat:"ride"    },
  { id:"c2", code:"NEWUSER",   title:"First ride free",            desc:"Get up to ₹200 off on your very first EVGoo booking",  min:"₹100", max:"₹200", expiry:"30 Jun 2026", type:"flat",    val:200, used:false, cat:"ride"    },
  { id:"c3", code:"GPAY25",    title:"₹25 cashback via GPay",     desc:"Pay with Google Pay UPI and get ₹25 cashback",         min:"₹150", max:"₹25",  expiry:"15 Jun 2026", type:"flat",    val:25,  used:false, cat:"payment" },
  { id:"c4", code:"WEEKEND20", title:"Weekend special — 20% off", desc:"Book on Sat or Sun and save 20% on any EV ride",       min:"₹300", max:"₹100", expiry:"28 Jun 2026", type:"percent", val:20,  used:false, cat:"ride"    },
  { id:"c5", code:"MONSOON15", title:"Monsoon saver",             desc:"Stay dry this season — 15% off on all rides",          min:"₹250", max:"₹80",  expiry:"10 Jun 2026", type:"percent", val:15,  used:true,  cat:"ride"    },
  { id:"c6", code:"SHARE30",   title:"₹30 off on shared rides",  desc:"Choose EV Share and save an extra ₹30 per trip",       min:"₹80",  max:"₹30",  expiry:"01 Jun 2026", type:"flat",    val:30,  used:true,  cat:"ride"    },
];

function Coupons({ onBack }) {
  const [tab, setTab] = useState("active");
  const [copied, setCopied] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const active = COUPON_DATA.filter(c => !c.used);
  const used   = COUPON_DATA.filter(c =>  c.used);
  const list   = tab === "active" ? active : used;
  const copy   = (code) => { setCopied(code); setTimeout(() => setCopied(null), 1800); };
  const CAT_LABEL = { ride:"Ride offer", payment:"Payment offer" };
  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>My Coupons</h2>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{active.length} active · {used.length} used</p>
        </div>
      </div>
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 16px", marginBottom:22, background:C.surface, display:"flex", gap:10, alignItems:"center" }}>
        <input placeholder="Enter promo code…" value={manualCode} onChange={e => setManualCode(e.target.value.toUpperCase())}
          style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}/>
        <GoldBtn sm onClick={() => setManualCode("")}>Apply</GoldBtn>
      </div>
      <div style={{ display:"flex", marginBottom:20, borderBottom:`1px solid ${C.border}` }}>
        {[["active",`Active (${active.length})`],["used",`Used (${used.length})`]].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:"11px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase", color:tab === k ? C.gold : C.muted, borderBottom:tab === k ? `1.5px solid ${C.gold}` : "1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {list.map((c, i) => (
          <div key={c.id} style={{ border:`1px solid ${c.used ? C.border : C.borderHi}`, borderRadius:3, overflow:"hidden", opacity:c.used ? .65 : 1, animation:`fadeUp .4s ${i * .07}s both` }}>
            <div style={{ padding:"18px", background:C.surface, position:"relative" }}>
              {!c.used && <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                    <Tag gold={!c.used}>{CAT_LABEL[c.cat]}</Tag>
                    {c.used && <Tag>Used</Tag>}
                  </div>
                  <p style={{ fontFamily:SF, fontSize:20, fontWeight:400, color:c.used ? C.muted : C.cream, letterSpacing:-.2 }}>{c.title}</p>
                  {expanded === c.id && <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:6, lineHeight:1.7 }}>{c.desc}</p>}
                </div>
                <div style={{ textAlign:"center", flexShrink:0 }}>
                  <div style={{ fontFamily:SF, fontSize:28, fontWeight:500, color:c.used ? C.muted : C.gold, lineHeight:1 }}>{c.type === "percent" ? `${c.val}%` : `₹${c.val}`}</div>
                  <div style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>off</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:14 }}>
                <div style={{ flex:1, padding:"9px 14px", border:`1px dashed ${c.used ? C.border : C.borderHi}`, borderRadius:2, background:C.elevated, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontFamily:UF, fontSize:13, fontWeight:600, letterSpacing:2, color:c.used ? C.muted : C.gold }}>{c.code}</span>
                  {!c.used && (
                    <button onClick={() => copy(c.code)} className="press" style={{ background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:copied === c.code ? C.success : C.goldDim }}>
                      {copied === c.code ? "Copied ✓" : "Copy"}
                    </button>
                  )}
                </div>
                <button onClick={() => setExpanded(expanded === c.id ? null : c.id)} className="press" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:3, padding:"9px 12px", color:C.muted, fontFamily:UF, fontSize:10, cursor:"pointer" }}>
                  {expanded === c.id ? "▲" : "▼"}
                </button>
              </div>
            </div>
            <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontFamily:UF, fontSize:10, color:C.muted }}>Min: {c.min} · Max: {c.max}</span>
              <span style={{ fontFamily:UF, fontSize:10, color:c.used ? C.faint : C.goldDim }}>Expires {c.expiry}</span>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && (
        <div style={{ textAlign:"center", paddingTop:64 }}>
          <p style={{ fontSize:40, marginBottom:16 }}>🎟️</p>
          <p style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream }}>No {tab} coupons</p>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:8 }}>{tab === "active" ? "Check back soon for offers!" : "Used coupons appear here"}</p>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   RIDE HISTORY
══════════════════════════════════════════════════════════════ */
const HISTORY_DATA = [
  { id:"r1", date:"Mon, 12 May 2026", time:"09:14 AM", from:"Sector 62, Noida",       to:"Cyber Hub, Gurugram",      type:"EV Cab",   glyph:"🚗", fare:349, dist:"18.4 km", driver:"Arjun S.",   rating:5,    status:"completed" },
  { id:"r2", date:"Sat, 10 May 2026", time:"07:32 PM", from:"Connaught Place",         to:"Lodhi Garden",             type:"EV Auto",  glyph:"🛺", fare:189, dist:"5.2 km",  driver:"Ramesh K.",  rating:4,    status:"completed" },
  { id:"r3", date:"Fri, 9 May 2026",  time:"11:05 AM", from:"AIIMS Delhi",             to:"IGI Airport T2",           type:"EV Prime", glyph:"🚙", fare:549, dist:"24.1 km", driver:"Vikram R.",  rating:5,    status:"completed" },
  { id:"r4", date:"Wed, 7 May 2026",  time:"06:48 PM", from:"IIT Delhi",               to:"Select CityWalk",          type:"EV Moto",  glyph:"🛵", fare:89,  dist:"7.8 km",  driver:"Suresh M.",  rating:4,    status:"completed" },
  { id:"r5", date:"Mon, 5 May 2026",  time:"10:22 AM", from:"Sector 62, Noida",        to:"JN Stadium",               type:"EV Cab",   glyph:"🚗", fare:279, dist:"14.6 km", driver:"Arjun S.",   rating:null, status:"cancelled" },
  { id:"r6", date:"Thu, 1 May 2026",  time:"08:50 AM", from:"Connaught Place",         to:"Cyber Hub, Gurugram",      type:"EV Share", glyph:"🚌", fare:69,  dist:"19.2 km", driver:"Pradeep L.", rating:4,    status:"completed" },
  { id:"r7", date:"Sun, 27 Apr 2026", time:"03:15 PM", from:"India Gate",              to:"Sector 62, Noida",         type:"EV Cab",   glyph:"🚗", fare:389, dist:"22.1 km", driver:"Arjun S.",   rating:5,    status:"completed" },
];

function RideHistory({ onBack }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [rated, setRated] = useState({});
  const list  = filter === "all" ? HISTORY_DATA : HISTORY_DATA.filter(r => r.status === filter);
  const total = HISTORY_DATA.filter(r => r.status === "completed").reduce((s, r) => s + r.fare, 0);
  const StarRow = ({ r }) => {
    const cur = rated[r.id] ?? r.rating;
    return (
      <div style={{ display:"flex", gap:6, marginTop:10 }}>
        {[1,2,3,4,5].map(n => (
          <span key={n} onClick={() => setRated(rv => ({ ...rv, [r.id]: n }))} style={{ fontSize:20, cursor:"pointer", filter:n <= (cur || 0) ? "none" : "grayscale(1) opacity(.25)", transition:"filter .15s" }}>⭐</span>
        ))}
        {cur && <span style={{ fontFamily:UF, fontSize:11, color:C.muted, alignSelf:"center", marginLeft:4 }}>{cur}.0</span>}
      </div>
    );
  };
  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Ride History</h2>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{HISTORY_DATA.length} rides · ₹{total.toLocaleString("en-IN")} spent</p>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:24 }}>
        {[["47","Total rides"],["2.4 kg","CO₂ saved"],["4.8 ⭐","Avg rating"]].map(([v, l]) => (
          <div key={l} style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 10px", background:C.surface, textAlign:"center" }}>
            <div style={{ fontFamily:SF, fontSize:17, fontWeight:500, color:C.gold }}>{v}</div>
            <div style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:5 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", marginBottom:20, borderBottom:`1px solid ${C.border}` }}>
        {[["all","All"],["completed","Completed"],["cancelled","Cancelled"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} style={{ flex:1, padding:"10px 4px", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", color:filter === k ? C.gold : C.muted, borderBottom:filter === k ? `1.5px solid ${C.gold}` : "1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {list.map((r, i) => (
          <div key={r.id} style={{ border:`1px solid ${r.status === "cancelled" ? C.border : C.borderHi}`, borderRadius:3, overflow:"hidden", opacity:r.status === "cancelled" ? .7 : 1, animation:`fadeUp .4s ${i * .07}s both` }}>
            <div onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ padding:"16px 18px", background:C.surface, cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:3, border:`1px solid ${r.status === "cancelled" ? C.border : C.borderHi}`, background:C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{r.glyph}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{r.type}</p>
                      <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{r.date} · {r.time}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <p style={{ fontFamily:SF, fontSize:18, fontWeight:500, color:r.status === "cancelled" ? C.muted : C.gold }}>₹{r.fare}</p>
                      <span style={{ fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", color:r.status === "cancelled" ? C.danger : C.success }}>{r.status === "cancelled" ? "Cancelled" : "Completed"}</span>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:C.gold, flexShrink:0 }}/>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.from}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:3 }}>
                    <div style={{ width:7, height:7, borderRadius:1, background:C.danger, flexShrink:0 }}/>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{r.to}</p>
                  </div>
                </div>
              </div>
            </div>
            {expanded === r.id && (
              <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 18px", background:C.ink, animation:"fadeIn .2s ease" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                  {[["🛣️","Distance",r.dist],["👤","Driver",r.driver],["⚡","Vehicle","100% EV"],["🌱","Emission","Zero CO₂"]].map(([ic, k, v]) => (
                    <div key={k} style={{ padding:"10px 12px", background:C.surface, borderRadius:3, border:`1px solid ${C.border}` }}>
                      <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>{ic} {k}</p>
                      <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, marginTop:4 }}>{v}</p>
                    </div>
                  ))}
                </div>
                {r.status === "completed" && (
                  <div>
                    <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>Your rating</p>
                    <StarRow r={r}/>
                  </div>
                )}
                <div style={{ display:"flex", gap:10, marginTop:14 }}>
                  <button className="press" style={{ flex:1, padding:"10px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>📄 Invoice</button>
                  <GoldBtn sm>Rebook →</GoldBtn>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICATIONS
══════════════════════════════════════════════════════════════ */
const NOTIF_DATA = [
  { id:"n1",  icon:"🎟️", title:"New coupon unlocked!",          body:"Use EVGOO50 for 50% off your next ride. Valid till 31 May.",      time:"2 min ago",   read:false, cat:"offer"    },
  { id:"n2",  icon:"✅", title:"Ride completed",                 body:"Your EV Cab ride with Arjun S. is complete. ₹349 paid via GPay.", time:"3 hours ago", read:false, cat:"ride"     },
  { id:"n3",  icon:"⭐", title:"Rate your last ride",            body:"How was your trip to Cyber Hub? Tap to rate Arjun S.",            time:"3 hours ago", read:false, cat:"ride"     },
  { id:"n4",  icon:"🌱", title:"You saved 2.4 kg of CO₂!",     body:"That's equivalent to planting one tree. Keep riding green. 🌳",   time:"Yesterday",   read:true,  cat:"eco"      },
  { id:"n5",  icon:"💳", title:"Payment confirmed",              body:"₹349 debited from HDFC Regalia card ending 4821.",               time:"Yesterday",   read:true,  cat:"payment"  },
  { id:"n6",  icon:"🚗", title:"Driver is arriving",            body:"Arjun S. in Tata Nexon EV DL 3C 9821 is 2 minutes away.",        time:"2 days ago",  read:true,  cat:"ride"     },
  { id:"n7",  icon:"🎉", title:"Gold Member status achieved!",  body:"You've unlocked EVGoo Gold. Enjoy priority rides & rewards.",     time:"3 days ago",  read:true,  cat:"account"  },
  { id:"n8",  icon:"📍", title:"New address saved",             body:"Sector 62, Noida has been saved as your home address.",           time:"5 days ago",  read:true,  cat:"account"  },
  { id:"n9",  icon:"🎟️", title:"Weekend offer just for you",   body:"Book Saturday or Sunday and save 20% with WEEKEND20.",           time:"6 days ago",  read:true,  cat:"offer"    },
  { id:"n10", icon:"🔒", title:"Security alert",                body:"Your EVGoo account was accessed from a new device.",              time:"1 week ago",  read:true,  cat:"security" },
];
const CAT_ACCENT = { offer:C.gold, ride:"#5A9E72", eco:"#5A9E72", payment:"#1A73E8", account:C.gold, security:C.danger };

function Notifications({ onBack }) {
  const [notifs, setNotifs] = useState(NOTIF_DATA);
  const [filter, setFilter] = useState("all");
  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read:true })));
  const dismiss = (id) => setNotifs(ns => ns.filter(n => n.id !== id));
  const unread = notifs.filter(n => !n.read).length;
  const cats = ["all","offer","ride","payment","account","eco","security"];
  const list = filter === "all" ? notifs : notifs.filter(n => n.cat === filter);
  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ flex:1, marginLeft:14 }}>
          <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Notifications</h2>
          {unread > 0 && <p style={{ fontFamily:UF, fontSize:10, color:C.gold, marginTop:2 }}>{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="press" style={{ fontFamily:UF, fontSize:9, color:C.muted, background:"none", border:`1px solid ${C.border}`, borderRadius:3, padding:"8px 14px", cursor:"pointer", letterSpacing:1.5, textTransform:"uppercase" }}>Mark read</button>
        )}
      </div>
      <div style={{ display:"flex", gap:7, overflowX:"auto", marginBottom:22, paddingBottom:4 }}>
        {cats.map(k => (
          <button key={k} onClick={() => setFilter(k)} className="press" style={{ padding:"7px 13px", background:filter === k ? "rgba(212,182,120,0.08)" : "none", border:`1px solid ${filter === k ? C.gold : C.border}`, borderRadius:20, cursor:"pointer", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", color:filter === k ? C.gold : C.muted, whiteSpace:"nowrap", transition:"all .2s" }}>
            {k === "all" ? `All (${notifs.length})` : k.charAt(0).toUpperCase() + k.slice(1)}
          </button>
        ))}
      </div>
      {list.length === 0 && (
        <div style={{ textAlign:"center", paddingTop:64 }}>
          <p style={{ fontSize:40, marginBottom:16 }}>🔔</p>
          <p style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream }}>All quiet</p>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:8 }}>No {filter} notifications</p>
        </div>
      )}
      <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
        {list.map((n, i) => (
          <div key={n.id} style={{ display:"flex", gap:14, padding:"15px 4px", borderBottom:`1px solid ${C.border}`, background:!n.read ? "rgba(212,182,120,0.025)" : C.obsidian, borderLeft:`2px solid ${!n.read ? CAT_ACCENT[n.cat] || C.gold : "transparent"}`, paddingLeft:14, animation:`fadeUp .35s ${i * .04}s both` }}>
            <div style={{ width:40, height:40, borderRadius:3, flexShrink:0, background:`${CAT_ACCENT[n.cat] || C.gold}14`, border:`1px solid ${CAT_ACCENT[n.cat] || C.gold}28`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{n.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <p style={{ fontFamily:UF, fontSize:13, fontWeight:n.read ? 400 : 600, color:n.read ? C.muted : C.cream, flex:1, paddingRight:8 }}>{n.title}</p>
                {!n.read && <div style={{ width:7, height:7, borderRadius:"50%", background:CAT_ACCENT[n.cat] || C.gold, flexShrink:0, marginTop:4 }}/>}
              </div>
              <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4, lineHeight:1.6 }}>{n.body}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
                <p style={{ fontFamily:UF, fontSize:9, color:C.faint, letterSpacing:.5 }}>{n.time}</p>
                <button onClick={() => dismiss(n.id)} className="press" style={{ background:"none", border:"none", color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer", padding:"2px 6px" }}>Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {notifs.length > 0 && (
        <button onClick={() => setNotifs([])} className="press" style={{ width:"100%", marginTop:24, padding:"14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>
          Clear all notifications
        </button>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SOS EMERGENCY SCREEN
══════════════════════════════════════════════════════════════ */
const EMERGENCY_SERVICES = [
  { id:"police",    icon:"🚔", name:"Police",           number:"100",  color:"#1A3A8F", accent:"#3B82F6" },
  { id:"ambulance", icon:"🚑", name:"Ambulance",        number:"108",  color:"#1A3A1A", accent:"#22C55E" },
  { id:"women",     icon:"🛡️", name:"Women's Helpline", number:"1091", color:"#3A1A3A", accent:"#A855F7" },
  { id:"fire",      icon:"🚒", name:"Fire Brigade",     number:"101",  color:"#3A1A0A", accent:"#F97316" },
];

const TRUSTED = [
  { name:"Priya (Sister)",  phone:"+91 98765 43211", initials:"PS" },
  { name:"Rahul (Friend)",  phone:"+91 87654 32100", initials:"RF" },
  { name:"Mom",             phone:"+91 76543 21099", initials:"M"  },
];

function SOS({ onBack, ride, onTrusted }) {
  const [phase,  setPhase]  = useState("idle");   // idle | countdown | active | safe
  const [count,  setCount]  = useState(5);
  const [alerted,setAlerted]= useState([]);
  const [held,   setHeld]   = useState(false);
  const timerRef = useRef(null);

  const startCountdown = () => {
    if(phase !== "idle") return;
    setPhase("countdown");
    setCount(5);
  };

  useEffect(()=>{
    if(phase !== "countdown") return;
    if(count <= 0){ setPhase("active"); setAlerted(TRUSTED.map(t=>t.name)); return; }
    timerRef.current = setTimeout(()=>setCount(c=>c-1), 1000);
    return ()=>clearTimeout(timerRef.current);
  },[phase, count]);

  const cancel = () => { clearTimeout(timerRef.current); setPhase("idle"); setCount(5); };
  const markSafe = () => setPhase("safe");

  const DANGER_RED = "#C0614A";
  const DANGER_DIM = "rgba(192,97,74,0.15)";

  return (
    <div style={{ minHeight:"100vh", background: phase==="active" ? "#120806" : C.obsidian, display:"flex", flexDirection:"column", transition:"background .6s" }}>

      {/* Pulsing red overlay when active */}
      {phase==="active" && (
        <div style={{ position:"absolute", inset:0, background:"rgba(192,97,74,0.04)", animation:"pulse 1.5s ease-in-out infinite", zIndex:0, pointerEvents:"none" }}/>
      )}

      {/* Header */}
      <div style={{ padding:"52px 22px 20px", display:"flex", alignItems:"center", gap:14, position:"relative", zIndex:1 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color: phase==="active" ? "#E8775F" : C.cream, letterSpacing:-.3 }}>
            {phase==="active" ? "Alert Sent" : phase==="safe" ? "All Clear" : "Emergency SOS"}
          </h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3, letterSpacing:.5 }}>
            {phase==="active" ? "Authorities & contacts alerted" : phase==="safe" ? "Contacts have been notified" : "Your safety is our priority"}
          </p>
        </div>
      </div>

      <div style={{ flex:1, padding:"0 22px 36px", overflowY:"auto", position:"relative", zIndex:1 }}>

        {/* Location card */}
        <div style={{ border:`1px solid ${phase==="active" ? "rgba(192,97,74,0.4)" : C.border}`, borderRadius:3, padding:"14px 16px", background:C.surface, marginBottom:22, position:"relative", overflow:"hidden" }}>
          {phase==="active" && <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(192,97,74,0.8),transparent)" }}/>}
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:3, background:DANGER_DIM, border:`1px solid rgba(192,97,74,0.25)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>📍</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Your current location</p>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, marginTop:3 }}>Connaught Place, New Delhi</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>28.6315° N · 77.2167° E · {phase==="active" ? "🔴 Live sharing" : "📍 Pinned"}</p>
            </div>
          </div>
          {ride && (
            <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:"flex", gap:12 }}>
              <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{ride.glyph||"🚗"} {ride.type||"EV Cab"}</span>
              <span style={{ color:C.border }}>·</span>
              <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{ride.plate||"DL 3C 9821"}</span>
              <span style={{ color:C.border }}>·</span>
              <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{ride.driver||"Arjun S."}</span>
            </div>
          )}
        </div>

        {/* ── IDLE / COUNTDOWN: big SOS button ── */}
        {(phase==="idle" || phase==="countdown") && (
          <>
            {/* SOS button */}
            <div style={{ textAlign:"center", margin:"8px 0 28px" }}>
              <div style={{ position:"relative", display:"inline-block" }}>
                {/* Ripple rings */}
                {phase==="countdown" && [1,2,3].map(i=>(
                  <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:100+i*44, height:100+i*44, borderRadius:"50%", border:`1px solid rgba(192,97,74,${0.25-i*0.07})`, animation:`ripple ${1.2+i*.3}s ease-out ${i*.2}s infinite` }}/>
                ))}
                <button
                  onMouseDown={startCountdown}
                  onTouchStart={startCountdown}
                  style={{
                    width:140, height:140, borderRadius:"50%",
                    background: phase==="countdown" ? "rgba(192,97,74,0.18)" : DANGER_DIM,
                    border:`2px solid ${phase==="countdown" ? DANGER_RED : "rgba(192,97,74,0.4)"}`,
                    cursor:"pointer", display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center", gap:6,
                    transition:"all .2s",
                    boxShadow: phase==="countdown" ? "0 0 40px rgba(192,97,74,0.25)" : "none",
                  }}
                >
                  {phase==="countdown" ? (
                    <>
                      <span style={{ fontFamily:SF, fontSize:52, fontWeight:300, color:DANGER_RED, lineHeight:1 }}>{count}</span>
                      <span style={{ fontFamily:UF, fontSize:9, color:"rgba(192,97,74,0.7)", letterSpacing:1.5, textTransform:"uppercase" }}>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize:36 }}>🆘</span>
                      <span style={{ fontFamily:UF, fontSize:11, color:DANGER_RED, fontWeight:600, letterSpacing:1.5, textTransform:"uppercase" }}>SOS</span>
                    </>
                  )}
                </button>
              </div>
              <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:18, lineHeight:1.7 }}>
                {phase==="countdown" ? "Release to cancel · Sending in " + count + "s" : "Press & hold to send emergency alert"}
              </p>
              {phase==="countdown" && (
                <button onClick={cancel} className="press" style={{ marginTop:14, padding:"10px 28px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                  Cancel
                </button>
              )}
            </div>

            {/* Emergency services */}
            <Lbl>Call emergency services</Lbl>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
              {EMERGENCY_SERVICES.map(s=>(
                <div key={s.id} className="press" style={{ padding:"14px 14px", border:`1px solid ${s.accent}33`, borderRadius:3, background:`${s.accent}0D`, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{s.icon}</span>
                  <div>
                    <p style={{ fontFamily:UF, fontSize:12, fontWeight:600, color:C.cream }}>{s.name}</p>
                    <p style={{ fontFamily:SF, fontSize:18, fontWeight:500, color:s.accent, marginTop:2 }}>{s.number}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trusted contacts */}
            <Lbl>Alert trusted contacts</Lbl>
            {TRUSTED.map(t=>(
              <div key={t.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:14, color:C.gold, flexShrink:0 }}>{t.initials}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t.name}</p>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>{t.phone}</p>
                </div>
                <button className="press" style={{ padding:"8px 14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.gold, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Alert</button>
              </div>
            ))}
          </>
        )}

        {/* ── ACTIVE: alert sent ── */}
        {phase==="active" && (
          <div className="fu">
            {/* Status */}
            <div style={{ textAlign:"center", margin:"16px 0 32px" }}>
              <div style={{ width:100, height:100, borderRadius:"50%", background:"rgba(192,97,74,0.12)", border:`2px solid ${DANGER_RED}`, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, animation:"pulse 1.5s ease-in-out infinite" }}>🚨</div>
              <p style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:"#E8775F", letterSpacing:-.3 }}>Help is on the way</p>
              <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:8, lineHeight:1.7 }}>Your location is being shared live with emergency services and your trusted contacts.</p>
            </div>

            {/* Alerted contacts */}
            <Lbl>Contacts alerted</Lbl>
            {TRUSTED.filter(t=>alerted.includes(t.name)).map(t=>(
              <div key={t.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:14, color:C.gold, flexShrink:0 }}>{t.initials}</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t.name}</p>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{t.phone}</p>
                </div>
                <span style={{ fontFamily:UF, fontSize:9, color:C.success, letterSpacing:1.2, textTransform:"uppercase" }}>✓ Notified</span>
              </div>
            ))}

            {/* Emergency numbers */}
            <Lbl style={{ marginTop:24 }}>Emergency lines</Lbl>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:28 }}>
              {EMERGENCY_SERVICES.map(s=>(
                <div key={s.id} className="press" style={{ padding:"12px 14px", border:`1px solid ${s.accent}44`, borderRadius:3, background:`${s.accent}12`, display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <div>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{s.name}</p>
                    <p style={{ fontFamily:SF, fontSize:17, fontWeight:500, color:s.accent }}>{s.number}</p>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={markSafe} className="press" style={{ width:"100%", padding:"16px", background:"rgba(90,158,114,0.1)", border:`1px solid rgba(90,158,114,0.4)`, borderRadius:3, color:C.success, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>
              ✓ I'm safe — Cancel alert
            </button>
          </div>
        )}

        {/* ── SAFE ── */}
        {phase==="safe" && (
          <div className="fu" style={{ textAlign:"center", paddingTop:24 }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background:"rgba(90,158,114,0.12)", border:`2px solid ${C.success}`, margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40 }}>✅</div>
            <p style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>You're safe</p>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:10, lineHeight:1.8 }}>Contacts have been notified that you're okay. Your ride details have been logged.</p>
            <div style={{ marginTop:28 }}>
              <GoldBtn onClick={onBack}>Return to ride</GoldBtn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SHARE RIDE STATUS SCREEN
══════════════════════════════════════════════════════════════ */
function ShareRide({ onBack, ride, route }) {
  const [shared, setShared]         = useState([]);
  const [autoContacts, setAuto]     = useState([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [sharing, setSharing]       = useState(true);
  const [expiry, setExpiry]         = useState("end");   // "end" | "30min" | "1hr"

  const LINK = "evgoo.app/track/live/arjun-xk92p";

  const shareVia = (method) => {
    setShared(s => s.includes(method) ? s : [...s, method]);
  };

  const copyLink = () => { setLinkCopied(true); setTimeout(()=>setLinkCopied(false), 2000); };

  const toggleAuto = (name) => setAuto(a => a.includes(name) ? a.filter(x=>x!==name) : [...a, name]);

  const SHARE_METHODS = [
    { id:"whatsapp", icon:"💬", name:"WhatsApp",  color:"#25D366", accent:"#25D366" },
    { id:"sms",      icon:"📱", name:"SMS",        color:"#4A90E2", accent:"#4A90E2" },
    { id:"email",    icon:"✉️", name:"Email",      color:"#EA4335", accent:"#EA4335" },
    { id:"more",     icon:"⋯",  name:"More",       color:"#888",    accent:"#888"    },
  ];

  const ETA_MINS = ride?.eta || 6;

  return (
    <Screen scroll style={{ padding:"56px 22px 36px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Share Ride Status</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:sharing ? C.success : C.muted, marginTop:3 }}>
            {sharing ? "🔴 Live location active" : "⬛ Sharing paused"}
          </p>
        </div>
        <button onClick={()=>setSharing(s=>!s)} className="press" style={{ marginLeft:"auto", padding:"8px 14px", background: sharing ? "rgba(90,158,114,0.1)" : "none", border:`1px solid ${sharing ? "rgba(90,158,114,0.4)" : C.border}`, borderRadius:3, color: sharing ? C.success : C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
          {sharing ? "Pause" : "Resume"}
        </button>
      </div>

      {/* Mini live map */}
      <div style={{ height:140, background:C.ink, borderRadius:3, border:`1px solid ${C.border}`, marginBottom:20, position:"relative", overflow:"hidden" }}>
        <svg width="100%" height="100%" style={{ position:"absolute", opacity:.07 }}>
          {Array(8).fill(0).map((_,i)=><line key={i} x1={i*60} y1={0} x2={i*60} y2={140} stroke={C.gold} strokeWidth={.5}/>)}
          {Array(4).fill(0).map((_,i)=><line key={i} x1={0} y1={i*48} x2={430} y2={i*48} stroke={C.gold} strokeWidth={.5}/>)}
        </svg>
        <svg width="100%" height="100%" style={{ position:"absolute" }}>
          <path d="M 50 110 Q 140 85 220 75 Q 300 65 380 40" stroke={C.gold} strokeWidth={1.5} fill="none" strokeDasharray="7 5" opacity={.4}/>
          <circle cx={50} cy={110} r={5} fill={C.gold}/>
          <circle cx={380} cy={40} r={5} fill={C.danger}/>
        </svg>
        <div style={{ position:"absolute", left:185, top:58, fontSize:18, filter:`drop-shadow(0 0 5px ${C.goldDim})`, animation:"drift 2.5s ease-in-out infinite" }}>{ride?.glyph||"🚗"}</div>
        {/* Live pulse */}
        {sharing && (
          <div style={{ position:"absolute", top:12, right:12, display:"flex", alignItems:"center", gap:6, background:"rgba(10,9,5,0.82)", border:`1px solid rgba(90,158,114,0.4)`, borderRadius:2, padding:"5px 10px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.success, animation:"shimmer 1.2s ease-in-out infinite" }}/>
            <span style={{ fontFamily:UF, fontSize:9, color:C.success, letterSpacing:1.5, textTransform:"uppercase" }}>Live</span>
          </div>
        )}
        {/* Route labels */}
        <div style={{ position:"absolute", bottom:10, left:10 }}>
          <span style={{ fontFamily:UF, fontSize:9, color:C.goldDim, background:"rgba(10,9,5,0.7)", padding:"3px 8px", borderRadius:2 }}>{(route?.pickup||"Connaught Place").split(",")[0]}</span>
        </div>
        <div style={{ position:"absolute", top:10, right:44 }}>
          <span style={{ fontFamily:UF, fontSize:9, color:"rgba(192,97,74,0.8)", background:"rgba(10,9,5,0.7)", padding:"3px 8px", borderRadius:2 }}>{(route?.drop||"IGI Airport").split("—")[0].trim()}</span>
        </div>
      </div>

      {/* ETA strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
        {[["🕐",`${ETA_MINS} min`,"ETA"],["🛣️","18.4 km","Distance"],["🚗",ride?.driver||"Arjun S.","Driver"]].map(([ic,v,l])=>(
          <div key={l} style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"11px 10px", background:C.surface, textAlign:"center" }}>
            <div style={{ fontSize:13 }}>{ic}</div>
            <div style={{ fontFamily:SF, fontSize:15, fontWeight:500, color:C.gold, marginTop:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</div>
            <div style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Shareable link */}
      <Lbl>Shareable link</Lbl>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        <div style={{ flex:1, padding:"12px 14px", border:`1px solid ${C.borderHi}`, borderRadius:3, background:C.surface, overflow:"hidden" }}>
          <p style={{ fontFamily:UF, fontSize:12, color:C.gold, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{LINK}</p>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Anyone with this link can view your location</p>
        </div>
        <button onClick={copyLink} className="press" style={{ padding:"0 18px", background: linkCopied ? "rgba(90,158,114,0.1)" : "none", border:`1px solid ${linkCopied ? "rgba(90,158,114,0.4)" : C.border}`, borderRadius:3, color: linkCopied ? C.success : C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0 }}>
          {linkCopied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Share via */}
      <Lbl>Share via</Lbl>
      <div style={{ display:"flex", gap:10, marginBottom:24 }}>
        {SHARE_METHODS.map(m=>(
          <button key={m.id} onClick={()=>shareVia(m.id)} className="press" style={{ flex:1, padding:"14px 8px", border:`1px solid ${shared.includes(m.id) ? m.accent+"66" : C.border}`, borderRadius:3, background: shared.includes(m.id) ? `${m.accent}12` : "none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:20 }}>{m.icon}</span>
            <span style={{ fontFamily:UF, fontSize:9, color: shared.includes(m.id) ? m.accent : C.muted, letterSpacing:1, textTransform:"uppercase" }}>{m.name}</span>
            {shared.includes(m.id) && <span style={{ fontFamily:UF, fontSize:8, color:m.accent }}>✓ Sent</span>}
          </button>
        ))}
      </div>

      {/* Auto-share with trusted contacts */}
      <Lbl>Auto-share with trusted contacts</Lbl>
      {TRUSTED.map(t=>(
        <div key={t.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:13, color:C.gold, flexShrink:0 }}>{t.initials}</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t.name}</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{t.phone}</p>
          </div>
          {/* Toggle */}
          <div onClick={()=>toggleAuto(t.name)} className="press" style={{ width:44, height:24, borderRadius:12, background: autoContacts.includes(t.name) ? C.success : C.border, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
            <div style={{ position:"absolute", top:3, left: autoContacts.includes(t.name) ? 23 : 3, width:18, height:18, borderRadius:"50%", background:C.cream, transition:"left .2s" }}/>
          </div>
        </div>
      ))}

      {/* Expiry setting */}
      <Lbl style={{ marginTop:24 }}>Stop sharing after</Lbl>
      <div style={{ display:"flex", gap:8, marginBottom:28 }}>
        {[["end","Ride ends"],["30min","30 min"],["1hr","1 hour"]].map(([k,l])=>(
          <button key={k} onClick={()=>setExpiry(k)} className="press" style={{ flex:1, padding:"10px 8px", border:`1px solid ${expiry===k ? C.gold : C.border}`, borderRadius:3, background: expiry===k ? "rgba(212,182,120,0.06)" : "none", color: expiry===k ? C.gold : C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
        ))}
      </div>

      {/* Stop sharing */}
      <button onClick={()=>setSharing(false)} className="press" style={{ width:"100%", padding:"15px", background:"none", border:`1px solid rgba(192,97,74,0.3)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:11, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>
        Stop sharing location
      </button>

      <p style={{ fontFamily:UF, fontSize:10, color:C.faint, textAlign:"center", marginTop:16, lineHeight:1.7 }}>
        Only the live map view is shared — your personal details and payment info are never visible to the recipient.
      </p>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SCHEDULE A RIDE SCREEN
══════════════════════════════════════════════════════════════ */
const SCHEDULED_RIDES = [
  { id:"s1", date:"Wed, 21 May", time:"06:30 AM", from:"Sector 62, Noida", to:"IGI Airport T2", type:"EV Prime", glyph:"🚙", fare:549, status:"confirmed" },
  { id:"s2", date:"Fri, 23 May", time:"09:00 AM", from:"Connaught Place",  to:"Cyber Hub",      type:"EV Cab",   glyph:"🚗", fare:349, status:"confirmed" },
];

function Schedule({ onBack, onSearch }) {
  const today = new Date();
  const DAYS = Array.from({length:8},(_,i)=>{
    const d = new Date(today); d.setDate(today.getDate()+i);
    return {
      label: i===0?"Today":i===1?"Tomorrow":d.toLocaleDateString("en-IN",{weekday:"short"}),
      date:  d.toLocaleDateString("en-IN",{day:"numeric",month:"short"}),
      d,
    };
  });

  const [selDay,   setSelDay]   = useState(0);
  const [hour,     setHour]     = useState("07");
  const [min,      setMin]      = useState("00");
  const [ampm,     setAmpm]     = useState("AM");
  const [pickup,   setPickup]   = useState("Connaught Place, New Delhi");
  const [drop,     setDrop]     = useState("");
  const [vehicle,  setVehicle]  = useState("cab");
  const [reminder, setReminder] = useState("30");
  const [tab,      setTab]      = useState("new");   // "new" | "upcoming"
  const [booked,   setBooked]   = useState(false);
  const [rides,    setRides]    = useState(SCHEDULED_RIDES);

  const selRide = DRIVERS.find(d=>d.id===vehicle)||DRIVERS[2];

  const HOURS = Array.from({length:12},(_,i)=>String(i+1).padStart(2,"0"));
  const MINS  = ["00","15","30","45"];

  const handleBook = () => {
    if(!drop) return;
    setBooked(true);
    const newRide = {
      id:"s"+Date.now(), date:DAYS[selDay].date,
      time:`${hour}:${min} ${ampm}`,
      from:pickup, to:drop,
      type:selRide.type, glyph:selRide.glyph,
      fare:selRide.fare, status:"confirmed",
    };
    setTimeout(()=>{ setRides(r=>[newRide,...r]); setTab("upcoming"); setBooked(false); setDrop(""); }, 1400);
  };

  const cancelRide = (id) => setRides(r=>r.filter(x=>x.id!==id));

  return (
    <Screen scroll style={{ padding:"0" }}>
      {/* Header */}
      <div style={{ padding:"52px 22px 0", background:C.ink, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:22 }}>
          <BackBtn onClick={onBack}/>
          <div>
            <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Schedule a Ride</h1>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Book up to 7 days in advance</p>
          </div>
        </div>
        <div style={{ display:"flex", marginBottom:0 }}>
          {[["new","New booking"],["upcoming",`Upcoming (${rides.length})`]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"12px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:10, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase", color:tab===k?C.gold:C.muted, borderBottom:tab===k?`1.5px solid ${C.gold}`:"1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"24px 22px 40px", overflowY:"auto" }}>

        {/* ── NEW BOOKING ── */}
        {tab==="new" && (
          <>
            {/* Day selector */}
            <Lbl>Select date</Lbl>
            <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:4, marginBottom:22 }}>
              {DAYS.map((d,i)=>(
                <button key={i} onClick={()=>setSelDay(i)} className="press" style={{ flexShrink:0, width:64, padding:"12px 8px", border:`1px solid ${selDay===i?C.gold:C.border}`, borderRadius:3, background:selDay===i?"rgba(212,182,120,0.07)":"none", cursor:"pointer", textAlign:"center", transition:"all .2s" }}>
                  <p style={{ fontFamily:UF, fontSize:9, color:selDay===i?C.gold:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>{d.label}</p>
                  <p style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:selDay===i?C.gold:C.cream, marginTop:4 }}>{d.d.getDate()}</p>
                  <p style={{ fontFamily:UF, fontSize:9, color:C.muted, marginTop:2 }}>{d.d.toLocaleDateString("en-IN",{month:"short"})}</p>
                </button>
              ))}
            </div>

            {/* Time picker */}
            <Lbl>Select time</Lbl>
            <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:22 }}>
              {/* Hour */}
              <div style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, overflow:"hidden" }}>
                <p style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", padding:"6px 12px 0" }}>Hour</p>
                <select value={hour} onChange={e=>setHour(e.target.value)} style={{ width:"100%", background:"none", border:"none", color:C.cream, fontFamily:SF, fontSize:20, fontWeight:400, padding:"4px 12px 10px", cursor:"pointer", outline:"none", appearance:"none" }}>
                  {HOURS.map(h=><option key={h} value={h} style={{ background:C.ink }}>{h}</option>)}
                </select>
              </div>
              <div style={{ fontFamily:SF, fontSize:28, color:C.goldDim, flexShrink:0 }}>:</div>
              {/* Minute */}
              <div style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, overflow:"hidden" }}>
                <p style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", padding:"6px 12px 0" }}>Minute</p>
                <select value={min} onChange={e=>setMin(e.target.value)} style={{ width:"100%", background:"none", border:"none", color:C.cream, fontFamily:SF, fontSize:20, fontWeight:400, padding:"4px 12px 10px", cursor:"pointer", outline:"none", appearance:"none" }}>
                  {MINS.map(m=><option key={m} value={m} style={{ background:C.ink }}>{m}</option>)}
                </select>
              </div>
              {/* AM / PM */}
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {["AM","PM"].map(p=>(
                  <button key={p} onClick={()=>setAmpm(p)} className="press" style={{ padding:"8px 14px", border:`1px solid ${ampm===p?C.gold:C.border}`, borderRadius:3, background:ampm===p?"rgba(212,182,120,0.08)":"none", color:ampm===p?C.gold:C.muted, fontFamily:UF, fontSize:11, fontWeight:500, cursor:"pointer", transition:"all .2s" }}>{p}</button>
                ))}
              </div>
            </div>

            {/* Summary chip */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", border:`1px solid ${C.borderHi}`, borderRadius:3, background:C.surface, marginBottom:24 }}>
              <span style={{ fontSize:18 }}>📅</span>
              <p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>
                <span style={{ color:C.gold, fontWeight:500 }}>{DAYS[selDay].label}</span>{selDay>1?`, ${DAYS[selDay].date}`:""} at <span style={{ color:C.gold, fontWeight:500 }}>{hour}:{min} {ampm}</span>
              </p>
            </div>

            {/* Locations */}
            <Lbl>Pickup & drop</Lbl>
            <div style={{ border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", marginBottom:22 }}>
              <div style={{ display:"flex", alignItems:"center", padding:"13px 14px", borderBottom:`1px solid ${C.border}`, gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:C.gold, flexShrink:0 }}/>
                <input value={pickup} onChange={e=>setPickup(e.target.value)} placeholder="Pickup location"
                  style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}/>
              </div>
              <div style={{ display:"flex", alignItems:"center", padding:"13px 14px", gap:12 }}>
                <div style={{ width:8, height:8, borderRadius:1, background:C.danger, flexShrink:0 }}/>
                <input value={drop} onChange={e=>setDrop(e.target.value)} placeholder="Where to?"
                  style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}/>
              </div>
            </div>

            {/* Vehicle type */}
            <Lbl>Vehicle type</Lbl>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:22 }}>
              {DRIVERS.filter(d=>d.id!=="share").map(d=>(
                <div key={d.id} onClick={()=>setVehicle(d.id)} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", border:`1px solid ${vehicle===d.id?C.gold:C.border}`, borderRadius:3, background:vehicle===d.id?"rgba(212,182,120,0.04)":C.ink, cursor:"pointer", transition:"all .2s" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{d.glyph}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{d.type}</p>
                    <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{d.desc} · {d.eta} min ETA</p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <p style={{ fontFamily:SF, fontSize:18, fontWeight:500, color:vehicle===d.id?C.gold:C.cream }}>₹{d.fare}</p>
                    <p style={{ fontFamily:UF, fontSize:9, color:C.muted, marginTop:1 }}>Est. fare</p>
                  </div>
                  {vehicle===d.id && <div style={{ width:18, height:18, borderRadius:"50%", background:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:C.obsidian, fontWeight:700, flexShrink:0 }}>✓</div>}
                </div>
              ))}
            </div>

            {/* Reminder */}
            <Lbl>Remind me before ride</Lbl>
            <div style={{ display:"flex", gap:8, marginBottom:28 }}>
              {[["15","15 min"],["30","30 min"],["60","1 hour"],["off","Off"]].map(([k,l])=>(
                <button key={k} onClick={()=>setReminder(k)} className="press" style={{ flex:1, padding:"10px 4px", border:`1px solid ${reminder===k?C.gold:C.border}`, borderRadius:3, background:reminder===k?"rgba(212,182,120,0.06)":"none", color:reminder===k?C.gold:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
              ))}
            </div>

            {/* Confirm */}
            {booked ? (
              <div style={{ textAlign:"center", padding:"20px", border:`1px solid rgba(90,158,114,0.4)`, borderRadius:3, background:"rgba(90,158,114,0.06)" }}>
                <p style={{ fontSize:32, marginBottom:10 }}>✅</p>
                <p style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream }}>Ride scheduled!</p>
                <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:6 }}>Added to your upcoming rides</p>
              </div>
            ) : (
              <GoldBtn onClick={handleBook} style={{ opacity: drop ? 1 : 0.45 }}>
                {drop ? `Confirm — ₹${selRide.fare} · ${DAYS[selDay].label} ${hour}:${min} ${ampm}` : "Enter destination to confirm"}
              </GoldBtn>
            )}

            <p style={{ fontFamily:UF, fontSize:10, color:C.faint, textAlign:"center", marginTop:14, lineHeight:1.7 }}>
              Free cancellation up to 30 min before the scheduled time
            </p>
          </>
        )}

        {/* ── UPCOMING RIDES ── */}
        {tab==="upcoming" && (
          <>
            {rides.length === 0 ? (
              <div style={{ textAlign:"center", paddingTop:60 }}>
                <p style={{ fontSize:40, marginBottom:14 }}>📅</p>
                <p style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream }}>No upcoming rides</p>
                <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:8 }}>Tap "New booking" to schedule your first ride</p>
              </div>
            ) : rides.map((r,i)=>(
              <div key={r.id} style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:12, animation:`fadeUp .4s ${i*.07}s both` }}>
                {/* Gold line */}
                <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
                <div style={{ padding:"18px", background:C.surface }}>
                  {/* Date / time */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div>
                      <p style={{ fontFamily:SF, fontSize:18, fontWeight:400, color:C.cream, letterSpacing:-.2 }}>{r.date}</p>
                      <p style={{ fontFamily:UF, fontSize:13, color:C.gold, fontWeight:500, marginTop:4 }}>{r.time}</p>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <Tag gold>✓ Confirmed</Tag>
                      <p style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:C.gold, marginTop:8 }}>₹{r.fare}</p>
                    </div>
                  </div>
                  {/* Vehicle */}
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                    <span style={{ fontSize:22 }}>{r.glyph}</span>
                    <span style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{r.type}</span>
                  </div>
                  {/* Route */}
                  <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:C.gold, flexShrink:0 }}/>
                      <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{r.from}</p>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:8, height:8, borderRadius:1, background:C.danger, flexShrink:0 }}/>
                      <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{r.to}</p>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display:"flex", borderTop:`1px solid ${C.border}` }}>
                  <button className="press" style={{ flex:1, padding:"11px", background:"none", border:"none", borderRight:`1px solid ${C.border}`, color:C.gold, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Modify</button>
                  <button className="press" style={{ flex:1, padding:"11px", background:"none", border:"none", borderRight:`1px solid ${C.border}`, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Share</button>
                  <button onClick={()=>cancelRide(r.id)} className="press" style={{ padding:"11px 18px", background:"none", border:"none", color:C.danger, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
                </div>
              </div>
            ))}

            <div style={{ marginTop:8 }}>
              <GoldBtn ghost onClick={()=>setTab("new")}>+ Schedule another ride</GoldBtn>
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ONBOARDING WALKTHROUGH
══════════════════════════════════════════════════════════════ */
const OB_SLIDES = [
  {
    emoji:"⚡",
    title:"India's cleanest\nride network",
    body:"Every car on EVGoo is 100% electric. Zero tailpipe emissions, zero guilt — just clean, quiet journeys across the city.",
    accent:"#D4B678",
    stat:"2.4 kg CO₂ saved per ride on average",
  },
  {
    emoji:"🛡️",
    title:"Safety built\ninto every ride",
    body:"SOS emergency button, live location sharing, driver face verification, and trusted contact alerts — all active before you even buckle up.",
    accent:"#5A9E72",
    stat:"24 × 7 safety monitoring on every trip",
  },
  {
    emoji:"🎟️",
    title:"Rewards for\nriding green",
    body:"Earn Gold status, unlock exclusive coupons, and collect eco credits with every kilometre you ride. The more you ride, the more you save.",
    accent:"#C9A84C",
    stat:"Members save ₹1,200+ per month on average",
  },
];

function Onboard({ onDone }) {
  const [slide, setSlide] = useState(0);
  const s = OB_SLIDES[slide];
  const isLast = slide === OB_SLIDES.length - 1;

  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column", padding:"52px 28px 44px" }}>
      {/* Skip */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:32 }}>
        <button onClick={onDone} className="press" style={{ background:"none", border:"none", fontFamily:UF, fontSize:11, color:C.muted, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Skip</button>
      </div>

      {/* Slide content */}
      <div key={slide} className="fu" style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        {/* Large glyph */}
        <div style={{ marginBottom:36 }}>
          <div style={{ width:96, height:96, borderRadius:24, border:`1px solid ${s.accent}44`, background:`${s.accent}0A`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:48 }}>
            {s.emoji}
          </div>
        </div>
        {/* Title */}
        <h1 style={{ fontFamily:SF, fontSize:42, fontWeight:300, color:C.cream, letterSpacing:-1, lineHeight:1.1, marginBottom:20, whiteSpace:"pre-line" }}>
          {s.title}
        </h1>
        {/* Body */}
        <p style={{ fontFamily:UF, fontSize:15, color:C.muted, lineHeight:1.8, marginBottom:32, fontWeight:300 }}>
          {s.body}
        </p>
        {/* Stat pill */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"11px 16px", border:`1px solid ${s.accent}33`, borderRadius:3, background:`${s.accent}08`, alignSelf:"flex-start" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:s.accent, animation:"shimmer 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:UF, fontSize:12, color:s.accent, letterSpacing:.3 }}>{s.stat}</span>
        </div>
      </div>

      {/* Dots + CTA */}
      <div>
        <div style={{ display:"flex", gap:8, marginBottom:28, justifyContent:"center" }}>
          {OB_SLIDES.map((_,i) => (
            <div key={i} onClick={()=>setSlide(i)} style={{ height:3, borderRadius:2, background:i===slide?C.gold:C.border, width:i===slide?28:10, transition:"all .3s", cursor:"pointer" }}/>
          ))}
        </div>
        <GoldBtn onClick={()=>isLast ? onDone() : setSlide(s=>s+1)}>
          {isLast ? "Get Started" : "Continue →"}
        </GoldBtn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   FORGOT PASSWORD
══════════════════════════════════════════════════════════════ */
function ForgotPassword({ onBack, onDone }) {
  const [step,  setStep]  = useState(1);   // 1=enter, 2=otp, 3=newpass, 4=done
  const [mode,  setMode]  = useState("phone");
  const [val,   setVal]   = useState("");
  const [digits,setDigits]= useState(Array(6).fill(""));
  const [pass,  setPass]  = useState("");
  const [conf,  setConf]  = useState("");
  const refs = Array(6).fill(0).map(() => useRef());

  const handleOtp = (i,v) => {
    const n=[...digits]; n[i]=v.slice(-1); setDigits(n);
    if(v && i<5) refs[i+1].current?.focus();
  };

  const STEPS = ["Identify account","Verify identity","New password","Done"];

  return (
    <Screen scroll style={{ padding:"56px 28px 40px" }}>
      {/* Progress */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={step===1 ? onBack : ()=>setStep(s=>s-1)}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:5, marginBottom:6 }}>
            {STEPS.slice(0,3).map((_,i)=>(
              <div key={i} style={{ flex:1, height:1, background:i<step?C.gold:C.border, transition:"background .3s" }}/>
            ))}
          </div>
          <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Step {Math.min(step,3)} of 3 — {STEPS[step-1]}</p>
        </div>
      </div>

      {/* Step 1: identify */}
      {step===1 && (
        <div className="fu">
          <h1 style={{ fontFamily:SF, fontSize:34, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:8 }}>Reset password</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:32 }}>Enter your registered mobile number or email address and we'll send you a verification code.</p>
          <div style={{ display:"flex", marginBottom:28, borderBottom:`1px solid ${C.border}` }}>
            {[["phone","Phone"],["email","Email"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setMode(k);setVal("");}} style={{ flex:1, padding:"11px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:2, textTransform:"uppercase", color:mode===k?C.gold:C.muted, borderBottom:mode===k?`1.5px solid ${C.gold}`:"1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
            ))}
          </div>
          {mode==="phone"
            ? <LuxInput label="Mobile number" placeholder="10-digit number" type="tel" prefix="🇮🇳  +91" value={val} onChange={e=>setVal(e.target.value.slice(0,10))}/>
            : <LuxInput label="Email address" placeholder="you@example.com" type="email" value={val} onChange={e=>setVal(e.target.value)}/>}
          <div style={{ marginTop:8 }}><GoldBtn onClick={()=>setStep(2)}>Send Code</GoldBtn></div>
        </div>
      )}

      {/* Step 2: OTP */}
      {step===2 && (
        <div className="fu">
          <h1 style={{ fontFamily:SF, fontSize:34, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:8 }}>Verify it's you</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:32 }}>A 6-digit code was sent to <span style={{ color:C.gold }}>{mode==="phone"?`+91 ${val}`:val}</span>. Enter it below.</p>
          <div style={{ display:"flex", gap:9, justifyContent:"center", marginBottom:28 }}>
            {digits.map((d,i)=>(
              <input key={i} ref={refs[i]} type="tel" maxLength={1} value={d} onChange={e=>handleOtp(i,e.target.value)} onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)refs[i-1].current?.focus();}}
                style={{ width:44, height:56, background:d?C.surface:C.ink, border:`1px solid ${d?C.gold:C.border}`, borderRadius:3, color:C.gold, fontFamily:SF, fontSize:24, fontWeight:500, textAlign:"center", transition:"all .15s" }}/>
            ))}
          </div>
          <GoldBtn onClick={()=>setStep(3)}>Verify Code</GoldBtn>
          <p style={{ textAlign:"center", fontFamily:UF, fontSize:12, color:C.muted, marginTop:20 }}>Didn't receive? <span style={{ color:C.gold, cursor:"pointer" }}>Resend</span></p>
        </div>
      )}

      {/* Step 3: new password */}
      {step===3 && (
        <div className="fu">
          <h1 style={{ fontFamily:SF, fontSize:34, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:8 }}>New password</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:32 }}>Choose a strong password you haven't used before.</p>
          <LuxInput label="New password" type="password" placeholder="Min 8 characters" value={pass} onChange={e=>setPass(e.target.value)}/>
          <LuxInput label="Confirm password" type="password" placeholder="Re-enter password" value={conf} onChange={e=>setConf(e.target.value)}/>
          {/* Strength */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:"flex", gap:4, marginBottom:8 }}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{ flex:1, height:2, borderRadius:1, background: pass.length>=i*2 ? (pass.length>=8?C.success:C.gold) : C.border, transition:"background .3s" }}/>
              ))}
            </div>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{pass.length===0?"Enter a password":pass.length<4?"Too short":pass.length<6?"Weak":pass.length<8?"Almost there":"Strong ✓"}</p>
          </div>
          <GoldBtn onClick={()=>setStep(4)} style={{ opacity:pass.length>=8&&pass===conf?1:.4 }}>Set New Password</GoldBtn>
        </div>
      )}

      {/* Step 4: done */}
      {step===4 && (
        <div className="fu" style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div style={{ width:88, height:88, borderRadius:3, border:`1px solid rgba(90,158,114,0.4)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, marginBottom:24 }}>🔓</div>
          <h1 style={{ fontFamily:SF, fontSize:36, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:12 }}>Password reset!</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:40 }}>Your password has been updated successfully. Use your new password to log in.</p>
          <GoldBtn onClick={onDone}>Back to Login</GoldBtn>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   DRIVER VERIFICATION
══════════════════════════════════════════════════════════════ */
function DriverVerif({ onBack, ride, onVerified }) {
  const [step,     setStep]    = useState("plate");   // plate | otp | checklist | done
  const [plateIn,  setPlateIn] = useState("");
  const [otpIn,    setOtpIn]   = useState("");
  const [checks,   setChecks]  = useState({});
  const CHECKLIST = [
    "Vehicle matches app (colour & model)",
    "Driver photo matches",
    "Seatbelts are functional",
    "Air conditioning is working",
    "No suspicious items in cabin",
  ];
  const correctPlate = (ride?.plate||"DL 3C 9821").slice(-4);
  const correctOtp   = "4729";
  const allChecked   = CHECKLIST.every(c=>checks[c]);

  const toggle = (k) => setChecks(c=>({...c,[k]:!c[k]}));

  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Verify Your Driver</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Complete 3 steps before boarding</p>
        </div>
      </div>

      {/* Step pills */}
      <div style={{ display:"flex", gap:6, marginBottom:28 }}>
        {[["plate","1 Plate"],["otp","2 OTP"],["checklist","3 Safety"]].map(([k,l])=>{
          const done = (k==="plate"&&(step==="otp"||step==="checklist"||step==="done")) || (k==="otp"&&(step==="checklist"||step==="done")) || step==="done";
          const active = step===k;
          return (
            <div key={k} style={{ flex:1, padding:"9px 8px", border:`1px solid ${done?C.success:active?C.gold:C.border}`, borderRadius:3, textAlign:"center", background:done?"rgba(90,158,114,0.08)":active?"rgba(212,182,120,0.06)":"none", transition:"all .3s" }}>
              <p style={{ fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.5, textTransform:"uppercase", color:done?C.success:active?C.gold:C.muted }}>{done?"✓ "+l.slice(2):l}</p>
            </div>
          );
        })}
      </div>

      {/* Driver card always visible */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"16px", background:C.surface, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:52, height:52, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👨‍✈️</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:15, fontWeight:600, color:C.cream }}>{ride?.driver||"Arjun S."}</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3 }}>⭐ {ride?.rating||"4.9"} · {ride?.trips||"6,210"} trips</p>
            <div style={{ display:"flex", gap:8, marginTop:8 }}>
              <Tag gold>{ride?.type||"EV Cab"}</Tag>
              <Tag>{ride?.plate||"DL 3C 9821"}</Tag>
            </div>
          </div>
        </div>
      </div>

      {/* ── PLATE ── */}
      {step==="plate" && (
        <div className="fu">
          <div style={{ marginBottom:16 }}>
            <Lbl>Enter last 4 digits of vehicle plate</Lbl>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginBottom:16, lineHeight:1.7 }}>Look at the number plate on the car in front of you and enter the last 4 characters.</p>
            <input value={plateIn} onChange={e=>setPlateIn(e.target.value.toUpperCase().slice(0,4))} placeholder="e.g. 9821"
              style={{ width:"100%", background:C.surface, border:`1px solid ${plateIn.length===4?(plateIn===correctPlate?C.success:C.danger):C.border}`, borderRadius:3, padding:"16px 18px", color:C.cream, fontFamily:SF, fontSize:28, letterSpacing:6, textAlign:"center", outline:"none", fontWeight:400, transition:"border-color .2s" }}/>
            {plateIn.length===4 && plateIn!==correctPlate && (
              <p style={{ fontFamily:UF, fontSize:11, color:C.danger, marginTop:8, textAlign:"center" }}>Plate doesn't match. Please check again or <span style={{ textDecoration:"underline", cursor:"pointer" }}>report a mismatch</span>.</p>
            )}
          </div>
          <GoldBtn onClick={()=>plateIn===correctPlate&&setStep("otp")} style={{ opacity:plateIn===correctPlate?1:.4 }}>Plate Verified ✓</GoldBtn>
        </div>
      )}

      {/* ── OTP ── */}
      {step==="otp" && (
        <div className="fu">
          <Lbl>Ask driver for the ride OTP</Lbl>
          <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginBottom:24, lineHeight:1.7 }}>Your driver's app shows a 4-digit OTP. Ask them to read it out and enter it below.</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:28 }}>
            {Array(4).fill(0).map((_,i)=>(
              <input key={i} type="tel" maxLength={1} value={otpIn[i]||""}
                onChange={e=>{ const a=otpIn.split(""); a[i]=e.target.value.slice(-1); setOtpIn(a.join("")); }}
                style={{ width:56, height:64, background:C.surface, border:`1px solid ${otpIn.length>i?(otpIn===correctPlate?C.gold:C.border):C.border}`, borderRadius:3, color:C.gold, fontFamily:SF, fontSize:28, fontWeight:500, textAlign:"center", outline:"none" }}/>
            ))}
          </div>
          {otpIn.length===4 && otpIn!==correctOtp && <p style={{ fontFamily:UF, fontSize:11, color:C.danger, marginBottom:16, textAlign:"center" }}>Incorrect OTP. Ask the driver to check their app.</p>}
          <GoldBtn onClick={()=>setStep("checklist")} style={{ opacity:otpIn.length===4?1:.4 }}>OTP Verified ✓</GoldBtn>
        </div>
      )}

      {/* ── CHECKLIST ── */}
      {step==="checklist" && (
        <div className="fu">
          <Lbl>Safety checklist</Lbl>
          <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginBottom:20, lineHeight:1.7 }}>Quickly confirm these before you begin your journey.</p>
          {CHECKLIST.map(c=>(
            <div key={c} onClick={()=>toggle(c)} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${checks[c]?C.success:C.border}`, borderRadius:3, marginBottom:8, background:checks[c]?"rgba(90,158,114,0.06)":"none", cursor:"pointer", transition:"all .2s" }}>
              <div style={{ width:22, height:22, borderRadius:3, border:`1.5px solid ${checks[c]?C.success:C.border}`, background:checks[c]?"rgba(90,158,114,0.2)":"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                {checks[c] && <span style={{ color:C.success, fontSize:13 }}>✓</span>}
              </div>
              <p style={{ fontFamily:UF, fontSize:13, color:checks[c]?C.cream:C.muted }}>{c}</p>
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <GoldBtn onClick={()=>setStep("done")} style={{ opacity:allChecked?1:.4 }}>All Good — Start Ride</GoldBtn>
            <button className="press" style={{ width:"100%", marginTop:10, padding:"14px", background:"none", border:`1px solid rgba(192,97,74,0.3)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>
              Report a safety issue
            </button>
          </div>
        </div>
      )}

      {/* ── DONE ── */}
      {step==="done" && (
        <div className="fu" style={{ textAlign:"center" }}>
          <div style={{ width:88, height:88, borderRadius:3, border:`1px solid rgba(90,158,114,0.4)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, margin:"16px auto 24px" }}>✅</div>
          <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Driver verified</h2>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:10, lineHeight:1.8 }}>Everything checks out. Have a safe and comfortable journey!</p>
          <div style={{ marginTop:32 }}><GoldBtn onClick={onVerified}>Begin Ride</GoldBtn></div>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   TRUSTED CONTACTS MANAGER
══════════════════════════════════════════════════════════════ */
const INIT_TRUSTED = [
  { id:"t1", name:"Priya (Sister)", phone:"9876543211", rel:"Sister",  initials:"PS", sos:true,  share:true  },
  { id:"t2", name:"Rahul (Friend)", phone:"8765432100", rel:"Friend",  initials:"RF", sos:true,  share:false },
  { id:"t3", name:"Mom",            phone:"7654321099", rel:"Parent",  initials:"M",  sos:true,  share:true  },
];
const RELS = ["Parent","Sibling","Spouse","Friend","Colleague","Other"];

function TrustedContacts({ onBack }) {
  const [contacts, setContacts] = useState(INIT_TRUSTED);
  const [addOpen,  setAddOpen]  = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [nc, setNc] = useState({ name:"", phone:"", rel:"Friend" });
  const [alerted,  setAlerted]  = useState(null);

  const toggle = (id, field) => setContacts(cs=>cs.map(c=>c.id===id?{...c,[field]:!c[field]}:c));
  const remove = (id) => setContacts(cs=>cs.filter(c=>c.id!==id));
  const add = () => {
    if(!nc.name||!nc.phone) return;
    setContacts(cs=>[...cs, { id:"t"+Date.now(), ...nc, initials:nc.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(), sos:true, share:true }]);
    setNc({ name:"", phone:"", rel:"Friend" }); setAddOpen(false);
  };
  const sendTest = (id) => { setAlerted(id); setTimeout(()=>setAlerted(null), 2500); };

  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <h2 style={{ fontFamily:SF, fontSize:20, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Trusted Contacts</h2>
        <button onClick={()=>setAddOpen(!addOpen)} className="press" style={{ fontFamily:UF, fontSize:9, color:C.gold, background:"none", border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"8px 14px", cursor:"pointer", letterSpacing:1.8, textTransform:"uppercase" }}>+ Add</button>
      </div>

      <div style={{ padding:"12px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:24, display:"flex", gap:12 }}>
        <span style={{ fontSize:16 }}>ℹ️</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>These people will be notified when you trigger an SOS or share your ride status. Up to 5 contacts allowed.</p>
      </div>

      {/* Add form */}
      {addOpen && (
        <div className="fu" style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"20px", marginBottom:20, background:C.surface, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
          <p style={{ fontFamily:SF, fontSize:18, fontWeight:300, color:C.cream, marginBottom:18 }}>Add contact</p>
          <LuxInput label="Full name" placeholder="e.g. Priya Sharma" value={nc.name} onChange={e=>setNc(n=>({...n,name:e.target.value}))}/>
          <LuxInput label="Mobile number" placeholder="10-digit number" type="tel" prefix="🇮🇳  +91" value={nc.phone} onChange={e=>setNc(n=>({...n,phone:e.target.value.slice(0,10)}))}/>
          <Lbl style={{ marginTop:4 }}>Relationship</Lbl>
          <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:20 }}>
            {RELS.map(r=>(
              <button key={r} onClick={()=>setNc(n=>({...n,rel:r}))} className="press" style={{ padding:"7px 13px", border:`1px solid ${nc.rel===r?C.gold:C.border}`, borderRadius:3, background:nc.rel===r?"rgba(212,182,120,0.07)":"none", color:nc.rel===r?C.gold:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{r}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <GoldBtn sm onClick={add}>Save Contact</GoldBtn>
            <button onClick={()=>setAddOpen(false)} className="press" style={{ padding:"10px 18px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <Lbl>{contacts.length} of 5 contacts</Lbl>
      {contacts.map((c, i) => (
        <div key={c.id} style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:10, animation:`fadeUp .35s ${i*.07}s both` }}>
          <div onClick={()=>setExpanded(expanded===c.id?null:c.id)} style={{ padding:"16px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", background:C.surface }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:16, color:C.gold, flexShrink:0 }}>{c.initials}</div>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:14, fontWeight:500, color:C.cream }}>{c.name}</p>
              <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>+91 {c.phone} · {c.rel}</p>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {c.sos  && <Tag accent="#E8775F">SOS</Tag>}
              {c.share && <Tag gold>Share</Tag>}
            </div>
            <span style={{ color:C.border, fontSize:16 }}>{expanded===c.id?"▲":"▼"}</span>
          </div>
          {expanded===c.id && (
            <div style={{ borderTop:`1px solid ${C.border}`, padding:"14px 16px", background:C.ink, animation:"fadeIn .2s ease" }}>
              {/* Toggles */}
              {[["sos","SOS alert","Notified when you trigger SOS emergency"],["share","Ride share","Gets your live location link automatically"]].map(([field,label,desc])=>(
                <div key={field} style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:14 }}>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{label}</p>
                    <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>{desc}</p>
                  </div>
                  <div onClick={()=>toggle(c.id,field)} className="press" style={{ width:44, height:24, borderRadius:12, background:c[field]?C.success:C.border, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
                    <div style={{ position:"absolute", top:3, left:c[field]?23:3, width:18, height:18, borderRadius:"50%", background:C.cream, transition:"left .2s" }}/>
                  </div>
                </div>
              ))}
              {/* Test + Remove */}
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button onClick={()=>sendTest(c.id)} className="press" style={{ flex:1, padding:"10px", background:"none", border:`1px solid ${alerted===c.id?"rgba(90,158,114,0.5)":C.border}`, borderRadius:3, color:alerted===c.id?C.success:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                  {alerted===c.id?"✓ Alert sent":"Send test alert"}
                </button>
                <button onClick={()=>remove(c.id)} className="press" style={{ padding:"10px 18px", background:"none", border:`1px solid rgba(192,97,74,0.3)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Remove</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {contacts.length<5 && !addOpen && (
        <div onClick={()=>setAddOpen(true)} className="press" style={{ marginTop:8, padding:"14px 16px", border:`1px dashed ${C.border}`, borderRadius:3, display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
          <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.goldDim, fontSize:18 }}>+</div>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>Add another contact ({5-contacts.length} slots remaining)</p>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   CANCELLATION FLOW
══════════════════════════════════════════════════════════════ */
const CANCEL_REASONS = [
  "Changed my mind",
  "Entered wrong destination",
  "Driver is taking too long",
  "Found a better option",
  "Driver asked to cancel",
  "Booked by mistake",
  "Personal emergency",
  "Other",
];

function CancelRide({ onBack, onConfirm, ride }) {
  const [reason,    setReason]    = useState(null);
  const [otherText, setOtherText] = useState("");
  const [step,      setStep]      = useState("reason");  // reason | fee | done
  const FREE_CANCEL_MINS = 3;
  const elapsed = 4; // simulate 4 min elapsed → fee applies
  const feeApplies = elapsed > FREE_CANCEL_MINS;
  const FEE = 50;

  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={step==="reason"?onBack:()=>setStep("reason")}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Cancel Ride</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>{ride?.type||"EV Cab"} · {ride?.driver||"Arjun S."}</p>
        </div>
      </div>

      {/* ── REASON ── */}
      {step==="reason" && (
        <>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:24 }}>Help us improve by telling us why you're cancelling this ride.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
            {CANCEL_REASONS.map(r=>(
              <div key={r} onClick={()=>setReason(r)} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${reason===r?C.gold:C.border}`, borderRadius:3, background:reason===r?"rgba(212,182,120,0.05)":"none", cursor:"pointer", transition:"all .2s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${reason===r?C.gold:C.border}`, background:reason===r?C.gold:"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                  {reason===r && <div style={{ width:7, height:7, borderRadius:"50%", background:C.obsidian }}/>}
                </div>
                <p style={{ fontFamily:UF, fontSize:14, color:reason===r?C.cream:C.muted }}>{r}</p>
              </div>
            ))}
          </div>
          {reason==="Other" && (
            <div style={{ marginBottom:24 }}>
              <textarea placeholder="Tell us more…" value={otherText} onChange={e=>setOtherText(e.target.value)}
                style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"13px 16px", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none", resize:"none", height:80, lineHeight:1.6 }}/>
            </div>
          )}
          <GoldBtn ghost onClick={()=>reason&&setStep("fee")} style={{ opacity:reason?1:.4 }}>Continue</GoldBtn>
        </>
      )}

      {/* ── FEE WARNING ── */}
      {step==="fee" && (
        <div className="fu">
          {feeApplies ? (
            <>
              <div style={{ border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, padding:"20px", background:"rgba(192,97,74,0.06)", marginBottom:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(192,97,74,0.8),transparent)" }}/>
                <p style={{ fontFamily:SF, fontSize:24, fontWeight:400, color:"#E8775F", marginBottom:6 }}>₹{FEE} cancellation fee</p>
                <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7 }}>
                  Free cancellation window ({FREE_CANCEL_MINS} min) has passed — {elapsed} min elapsed. A ₹{FEE} fee will be charged to your original payment method.
                </p>
              </div>
              <Lbl>Refund timeline</Lbl>
              {[["Original fare","Fully refunded","Within 3–5 business days"],["Cancellation fee",`₹${FEE} charged`,"Deducted from refund"]].map(([k,v,t])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                  <div><p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>{k}</p><p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{t}</p></div>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:k==="Cancellation fee"?C.danger:C.success, alignSelf:"center" }}>{v}</p>
                </div>
              ))}
              <div style={{ display:"flex", gap:10, marginTop:24 }}>
                <button onClick={onBack} className="press" style={{ flex:1, padding:"15px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Keep ride</button>
                <button onClick={()=>setStep("done")} className="press" style={{ flex:1, padding:"15px", background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Pay ₹{FEE} & cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ border:`1px solid rgba(90,158,114,0.4)`, borderRadius:3, padding:"20px", background:"rgba(90,158,114,0.06)", marginBottom:24 }}>
                <p style={{ fontFamily:SF, fontSize:22, fontWeight:400, color:C.success, marginBottom:6 }}>Free cancellation</p>
                <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7 }}>You're within the 3-minute free cancellation window. No charges will apply and your full amount will be refunded.</p>
              </div>
              <div style={{ display:"flex", gap:10, marginTop:8 }}>
                <button onClick={onBack} className="press" style={{ flex:1, padding:"15px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Keep ride</button>
                <button onClick={()=>setStep("done")} className="press" style={{ flex:1, padding:"15px", background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>Cancel ride</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── DONE ── */}
      {step==="done" && (
        <div className="fu" style={{ textAlign:"center", paddingTop:16 }}>
          <div style={{ width:88, height:88, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:42, margin:"0 auto 24px" }}>🚫</div>
          <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Ride cancelled</h2>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:10, lineHeight:1.8 }}>{feeApplies?`A cancellation fee of ₹${FEE} has been deducted. The remaining amount will be refunded within 3–5 business days.`:"Your ride has been cancelled and a full refund has been initiated."}</p>
          <div style={{ margin:"32px 0 16px" }}><GoldBtn onClick={onConfirm}>Back to Home</GoldBtn></div>
          <button onClick={onConfirm} className="press" style={{ background:"none", border:"none", color:C.gold, fontFamily:UF, fontSize:12, letterSpacing:.5, cursor:"pointer" }}>Book another ride →</button>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   POST-RIDE SCREEN
══════════════════════════════════════════════════════════════ */
const RATE_TAGS = ["Clean car","Safe driver","Punctual","Good music","Friendly","Smooth ride"];

function PostRide({ ride, route, onReceipt, onHome, onSplit, onLostFound, onRate }) {
  const [stars,    setStars]   = useState(0);
  const [hovered,  setHover]   = useState(0);
  const [selTags,  setTags]    = useState([]);
  const [tip,      setTip]     = useState(null);
  const [comment,  setComment] = useState("");
  const [done,     setDone]    = useState(false);
  const [lostItem, setLostItem]= useState(false);

  const TIPS = [10,20,50,"Custom"];
  const toggleTag = t => setTags(ts=>ts.includes(t)?ts.filter(x=>x!==t):[...ts,t]);

  const submit = () => setDone(true);

  if(done) return (
    <Screen center style={{ padding:"0 28px" }}>
      <div style={{ position:"absolute", top:"28%", left:"50%", transform:"translate(-50%,-50%)", width:280, height:280, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ fontFamily:SF, fontSize:72, color:C.gold, lineHeight:1, marginBottom:16 }}>✦</div>
        <h1 style={{ fontFamily:SF, fontSize:38, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:12 }}>Thank you!</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:10 }}>Your feedback helps {ride?.driver||"Arjun"} keep delivering excellent rides.</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginBottom:36 }}>
          <Tag gold>🌱 0.8 kg CO₂ saved</Tag>
          <Tag gold>⭐ Gold points +12</Tag>
        </div>
        <GoldBtn onClick={onReceipt} style={{ marginBottom:12 }}>Pay for ride →</GoldBtn>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          <button onClick={onSplit} className="press" style={{ flex:1, padding:"11px 6px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>💸 Split fare</button>
          <button onClick={onLostFound} className="press" style={{ flex:1, padding:"11px 6px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>🔍 Lost item</button>
          <button onClick={onRate} className="press" style={{ flex:1, padding:"11px 6px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>⭐ Rate app</button>
        </div>
        <button onClick={onHome} className="press" style={{ width:"100%", padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>Back to Home</button>
      </div>
    </Screen>
  );

  return (
    <Screen scroll style={{ padding:"0" }}>
      {/* Header */}
      <div style={{ padding:"52px 22px 22px", background:C.ink, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:52, height:52, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>👨‍✈️</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:SF, fontSize:20, fontWeight:400, color:C.cream, letterSpacing:-.2 }}>Ride complete</p>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:3 }}>{ride?.driver||"Arjun S."} · {ride?.type||"EV Cab"} · {ride?.plate||"DL 3C 9821"}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:SF, fontSize:26, fontWeight:500, color:C.gold }}>₹{ride?.fare||349}</div>
            <div style={{ fontFamily:UF, fontSize:9, color:C.success, marginTop:3 }}>Paid ✓</div>
          </div>
        </div>
        {/* Route summary */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:16, padding:"12px 14px", background:C.surface, borderRadius:3, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.gold }}/>
            {[0,1,2].map(i=><div key={i} style={{ width:1.5, height:4, background:C.border }}/>)}
            <div style={{ width:7, height:7, borderRadius:1, background:C.danger }}/>
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginBottom:6 }}>{(route?.pickup||"Connaught Place").split(",")[0]}</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted }}>{(route?.drop||"IGI Airport").split("—")[0].trim()}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted }}>18.4 km</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>32 min</p>
          </div>
        </div>
      </div>

      <div style={{ padding:"24px 22px 40px" }}>
        {/* Star rating */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <p style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, marginBottom:20, letterSpacing:-.2 }}>How was your ride?</p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:10 }}>
            {[1,2,3,4,5].map(n=>(
              <span key={n} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(n)}
                style={{ fontSize:38, cursor:"pointer", filter:n<=(hovered||stars)?"none":"grayscale(1) opacity(.2)", transition:"filter .1s, transform .1s", transform:n<=(hovered||stars)?"scale(1.15)":"scale(1)" }}>⭐</span>
            ))}
          </div>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted, letterSpacing:1 }}>
            {stars===0?"Tap to rate":stars===1?"Poor":stars===2?"Fair":stars===3?"Good":stars===4?"Great":"Excellent!"}
          </p>
        </div>

        {/* Tags */}
        {stars>=3 && (
          <div className="fu" style={{ marginBottom:24 }}>
            <Lbl>What stood out?</Lbl>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {RATE_TAGS.map(t=>(
                <button key={t} onClick={()=>toggleTag(t)} className="press" style={{ padding:"9px 14px", border:`1px solid ${selTags.includes(t)?C.gold:C.border}`, borderRadius:3, background:selTags.includes(t)?"rgba(212,182,120,0.08)":"none", color:selTags.includes(t)?C.gold:C.muted, fontFamily:UF, fontSize:11, letterSpacing:.5, cursor:"pointer", transition:"all .2s" }}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Comment */}
        {stars>0 && (
          <div style={{ marginBottom:24 }}>
            <Lbl>Add a comment (optional)</Lbl>
            <textarea placeholder="Tell us more about your experience…" value={comment} onChange={e=>setComment(e.target.value)}
              style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"13px 16px", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none", resize:"none", height:76, lineHeight:1.6 }}/>
          </div>
        )}

        {/* Tip */}
        <div style={{ marginBottom:28 }}>
          <Lbl>Add a tip for {ride?.driver?.split(" ")[0]||"Arjun"}</Lbl>
          <div style={{ display:"flex", gap:8 }}>
            {TIPS.map(t=>(
              <button key={t} onClick={()=>setTip(tip===t?null:t)} className="press" style={{ flex:1, padding:"12px 6px", border:`1px solid ${tip===t?C.gold:C.border}`, borderRadius:3, background:tip===t?"rgba(212,182,120,0.08)":"none", color:tip===t?C.gold:C.muted, fontFamily:UF, fontSize:typeof t==="number"?13:11, fontWeight:500, letterSpacing:.5, cursor:"pointer", transition:"all .2s" }}>
                {typeof t==="number"?`₹${t}`:t}
              </button>
            ))}
          </div>
        </div>

        {/* Lost item */}
        <div onClick={()=>setLostItem(!lostItem)} className="press" style={{ padding:"13px 16px", border:`1px solid ${lostItem?C.gold:C.border}`, borderRadius:3, marginBottom:24, display:"flex", alignItems:"center", gap:12, cursor:"pointer", background:lostItem?"rgba(212,182,120,0.04)":"none" }}>
          <span style={{ fontSize:18 }}>🔍</span>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>Left something in the car?</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>We'll connect you with your driver</p>
          </div>
          <span style={{ color:C.border }}>›</span>
        </div>

        <GoldBtn onClick={submit} style={{ opacity:stars>0?1:.5 }}>
          {stars>0?"Submit & Continue":"Rate to continue"}
        </GoldBtn>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   RIDE RECEIPT
══════════════════════════════════════════════════════════════ */
function Receipt({ ride, route, onBack, onHome, onDispute }) {
  const [emailed,  setEmailed]  = useState(false);
  const [downloaded, setDL]     = useState(false);

  const INV_NO   = "EV-2026-" + Math.floor(10000+Math.random()*89999);
  const DATE_STR = new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  const fare     = ride?.fare || 349;
  const base     = 65;
  const dist     = Math.round((fare - base) * 0.85);
  const evDisc   = -25;
  const subtotal = base + dist + evDisc;
  const cgst     = Math.round(subtotal * 0.025);
  const sgst     = cgst;
  const total    = subtotal + cgst + sgst;

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div style={{ flex:1 }}>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Ride Receipt</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Invoice #{INV_NO}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setDL(true)} className="press" style={{ padding:"9px 13px", background:"none", border:`1px solid ${downloaded?"rgba(90,158,114,0.4)":C.border}`, borderRadius:3, color:downloaded?C.success:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>{downloaded?"✓ PDF":"PDF"}</button>
          <button onClick={()=>setEmailed(true)} className="press" style={{ padding:"9px 13px", background:"none", border:`1px solid ${emailed?"rgba(90,158,114,0.4)":C.border}`, borderRadius:3, color:emailed?C.success:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>{emailed?"✓ Sent":"Email"}</button>
        </div>
      </div>

      {/* Invoice card */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:20, background:C.surface, position:"relative" }}>
        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>

        {/* Merchant + date */}
        <div style={{ padding:"18px 18px 14px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div className="gold-text" style={{ fontFamily:SF, fontSize:22, fontWeight:300, letterSpacing:-.3 }}>EVGoo</div>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>EVGoo Technologies Pvt. Ltd.</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted }}>GSTIN: 07AABCE4234C1ZY</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:UF, fontSize:11, color:C.cream, fontWeight:500 }}>{DATE_STR}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Invoice #{INV_NO}</p>
            </div>
          </div>
        </div>

        {/* Route */}
        <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
          <Lbl>Trip details</Lbl>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.gold, flexShrink:0 }}/>
              <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{(route?.pickup||"Connaught Place, New Delhi")}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:1, background:C.danger, flexShrink:0 }}/>
              <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{(route?.drop||"IGI Airport T2, New Delhi")}</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:16, marginTop:12 }}>
            {[["⚡",ride?.type||"EV Cab"],["🛣️","18.4 km"],["🕐","32 min"],["👤",ride?.driver||"Arjun S."]].map(([ic,v])=>(
              <span key={v} style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{ic} {v}</span>
            ))}
          </div>
        </div>

        {/* Fare breakdown */}
        <div style={{ padding:"14px 18px" }}>
          <Lbl>Fare breakdown</Lbl>
          {[["Base fare",`₹${base}`],["Distance charges",`₹${dist}`],["EV green discount","−₹25"]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:9 }}>
              <span style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{k}</span>
              <span style={{ fontFamily:UF, fontSize:12, color:v.startsWith("−")?C.success:C.cream }}>{v}</span>
            </div>
          ))}
          <div style={{ height:1, background:C.border, margin:"10px 0" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <span style={{ fontFamily:UF, fontSize:12, color:C.muted }}>Subtotal</span>
            <span style={{ fontFamily:UF, fontSize:12, color:C.cream }}>₹{subtotal}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
            <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>CGST @ 2.5%</span>
            <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>₹{cgst}</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
            <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>SGST @ 2.5%</span>
            <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>₹{sgst}</span>
          </div>
          <div style={{ height:1, background:C.border, margin:"0 0 12px" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
            <span style={{ fontFamily:UF, fontSize:11, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>Total paid</span>
            <span style={{ fontFamily:SF, fontSize:28, color:C.gold, fontWeight:500 }}>₹{total}</span>
          </div>
        </div>

        {/* Payment method */}
        <div style={{ padding:"12px 18px", borderTop:`1px solid ${C.border}`, background:C.ink, display:"flex", justifyContent:"space-between" }}>
          <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>Paid via GPay UPI</span>
          <span style={{ fontFamily:UF, fontSize:11, color:C.success }}>✓ Payment successful</span>
        </div>
      </div>

      {/* Eco impact */}
      <div style={{ border:`1px solid rgba(90,158,114,0.3)`, borderRadius:3, padding:"14px 16px", background:"rgba(90,158,114,0.05)", marginBottom:20, display:"flex", gap:14, alignItems:"center" }}>
        <span style={{ fontSize:24 }}>🌱</span>
        <div>
          <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>0.8 kg CO₂ saved</p>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.6 }}>By choosing an EV, you saved the equivalent of driving 5 km in a petrol car.</p>
        </div>
      </div>

      <button onClick={onDispute} className="press" style={{ width:"100%", padding:"14px", background:"none", border:`1px solid rgba(192,97,74,0.25)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", marginBottom:10 }}>Dispute this charge</button>
      <GoldBtn onClick={onHome} ghost>Back to Home</GoldBtn>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   NO INTERNET / ERROR STATE
══════════════════════════════════════════════════════════════ */
function NoInternet({ onRetry }) {
  const [dots,   setDots]   = useState(0);
  const [trying, setTrying] = useState(false);

  useEffect(()=>{
    const t=setInterval(()=>setDots(d=>(d+1)%4),600);
    return ()=>clearInterval(t);
  },[]);

  const retry = () => {
    setTrying(true);
    setTimeout(()=>{ setTrying(false); onRetry(); }, 2000);
  };

  return (
    <Screen center style={{ padding:"0 32px" }}>
      {/* Animated signal rings */}
      <div style={{ position:"relative", width:140, height:140, margin:"0 auto 40px", display:"flex", alignItems:"center", justifyContent:"center" }}>
        {[1,2,3].map(i=>(
          <div key={i} style={{ position:"absolute", width:i*44, height:i*44, borderRadius:"50%", border:`1px solid ${C.border}`, opacity:1-(i*0.25) }}/>
        ))}
        <div style={{ width:64, height:64, borderRadius:3, background:C.surface, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>📡</div>
        {/* Cross */}
        <div style={{ position:"absolute", top:8, right:8, width:22, height:22, borderRadius:"50%", background:"rgba(192,97,74,0.2)", border:`1px solid rgba(192,97,74,0.5)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:C.danger, fontSize:12, fontWeight:700 }}>✕</span>
        </div>
      </div>

      <div className="fu" style={{ textAlign:"center" }}>
        <h1 style={{ fontFamily:SF, fontSize:36, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:12 }}>No connection</h1>
        <p style={{ fontFamily:UF, fontSize:14, color:C.muted, lineHeight:1.8, marginBottom:8 }}>
          EVGoo can't reach the internet{".".repeat(dots+1)}
        </p>
        <p style={{ fontFamily:UF, fontSize:12, color:C.faint, lineHeight:1.7, marginBottom:40 }}>
          Check your Wi-Fi or mobile data, then try again. Your last known location is saved.
        </p>

        {/* Status items */}
        <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"16px", marginBottom:32, background:C.surface }}>
          {[["📡","Mobile data","No signal"],["🛰️","GPS","Active"],["💾","Last location","Connaught Place"],["🔋","App cache","Available"]].map(([ic,k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
              <span style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{ic}  {k}</span>
              <span style={{ fontFamily:UF, fontSize:11, color:v==="No signal"?C.danger:v==="Active"?C.success:C.muted }}>{v}</span>
            </div>
          ))}
        </div>

        {trying ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"16px" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .8s linear infinite" }}/>
            <span style={{ fontFamily:UF, fontSize:12, color:C.muted, letterSpacing:1 }}>Reconnecting…</span>
          </div>
        ) : (
          <GoldBtn onClick={retry}>Try again</GoldBtn>
        )}

        <p style={{ fontFamily:UF, fontSize:11, color:C.faint, marginTop:24 }}>
          Need urgent help? Call <span style={{ color:C.gold }}>1800-EV-GOOO</span>
        </p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   BOTTOM NAVIGATION BAR
══════════════════════════════════════════════════════════════ */
const NAV_SCREENS = new Set([
  S.HOME, S.HISTORY, S.SCHEDULE,
  S.PROFILE, S.EDIT, S.CARDS, S.ADDRESSES,
  S.COUPONS, S.NOTIFS, S.TRUSTED, S.SUBS,
  S.WALLET, S.SETTINGS, S.HELP,
  S.REFERRAL, S.ECODASH, S.SAFETYPREFS,
]);

const NAV_PROFILE = new Set([S.PROFILE, S.EDIT, S.CARDS, S.ADDRESSES, S.COUPONS, S.NOTIFS, S.TRUSTED, S.SUBS, S.WALLET, S.SETTINGS, S.HELP, S.DELETEACCT, S.REFERRAL, S.ECODASH, S.SAFETYPREFS]);

function BottomNav({ screen, go }) {
  const TABS = [
    {
      id:"home", label:"Home", dest:S.HOME,
      isActive: s => s === S.HOME,
      Icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      ),
    },
    {
      id:"rides", label:"Rides", dest:S.HISTORY,
      isActive: s => s === S.HISTORY,
      Icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          <line x1="12" y1="12" x2="12" y2="16"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
        </svg>
      ),
    },
    {
      id:"schedule", label:"Schedule", dest:S.SCHEDULE,
      isActive: s => s === S.SCHEDULE,
      Icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      id:"profile", label:"Profile", dest:S.PROFILE,
      isActive: s => NAV_PROFILE.has(s),
      badge: 3,
      Icon: () => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      display:"flex", borderTop:`1px solid ${C.border}`,
      background:C.ink, flexShrink:0, height:66,
      position:"relative",
    }}>
      {/* Ambient gold glow at top edge */}
      <div style={{ position:"absolute", top:0, left:"20%", right:"20%", height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.3, pointerEvents:"none" }}/>

      {TABS.map(t => {
        const active = t.isActive(screen);
        return (
          <button
            key={t.id}
            onClick={() => go(t.dest)}
            className="press"
            style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center",
              justifyContent:"center", gap:5, background:"none", border:"none",
              cursor:"pointer", position:"relative", paddingBottom:2,
              borderTop: `1.5px solid ${active ? C.gold : "transparent"}`,
              transition:"border-color .2s",
            }}
          >
            {/* Notification badge */}
            {t.badge && !active && (
              <div style={{
                position:"absolute", top:8, left:"calc(50% + 6px)",
                width:15, height:15, borderRadius:"50%",
                background:C.danger, border:`1.5px solid ${C.ink}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:UF, fontSize:8, fontWeight:700, color:"#fff",
              }}>{t.badge}</div>
            )}
            <div style={{ color: active ? C.gold : C.muted, transition:"color .2s" }}>
              <t.Icon/>
            </div>
            <span style={{
              fontFamily:UF, fontSize:9, fontWeight:500, letterSpacing:1.4,
              textTransform:"uppercase", color: active ? C.gold : C.muted,
              transition:"color .2s",
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOCATION PERMISSION SCREEN
══════════════════════════════════════════════════════════════ */
function LocPerm({ onAllow, onSkip }) {
  const [granted, setGranted] = useState(false);

  const allow = () => { setGranted(true); setTimeout(onAllow, 900); };

  return (
    <Screen center style={{ padding:"0 28px" }}>
      {/* Decorative map backdrop */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:340, overflow:"hidden", pointerEvents:"none" }}>
        <svg width="100%" height="340" style={{ opacity:.05 }}>
          {Array(8).fill(0).map((_,i)=><line key={`v${i}`} x1={i*60} y1={0} x2={i*60} y2={340} stroke={C.gold} strokeWidth={.8}/>)}
          {Array(7).fill(0).map((_,i)=><line key={`h${i}`} x1={0} y1={i*55} x2={430} y2={i*55} stroke={C.gold} strokeWidth={.8}/>)}
        </svg>
        <svg width="100%" height="340" style={{ position:"absolute", top:0 }}>
          <path d="M30 280 Q130 240 220 220 Q310 200 400 170" stroke={C.gold} strokeWidth={1.5} fill="none" strokeDasharray="8 5" opacity={.2}/>
          <path d="M0 180 Q100 160 200 170 Q310 182 430 155" stroke="rgba(255,255,255,0.06)" strokeWidth={10} fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{ position:"absolute", top:0, left:0, right:0, bottom:0, background:`linear-gradient(180deg, transparent 0%, ${C.obsidian} 85%)` }}/>
      </div>

      <div className="fu" style={{ position:"relative", zIndex:1, width:"100%", maxWidth:360, margin:"0 auto" }}>
        {/* Icon */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          {granted ? (
            <div style={{ width:88, height:88, borderRadius:3, border:`1px solid rgba(90,158,114,0.5)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto", animation:"pulse 1s ease" }}>✅</div>
          ) : (
            <div style={{ position:"relative", width:88, height:88, margin:"0 auto" }}>
              <div style={{ position:"absolute", inset:-12, borderRadius:"50%", border:`1px solid rgba(212,182,120,0.1)`, animation:"ripple 2s ease-out infinite" }}/>
              <div style={{ position:"absolute", inset:-24, borderRadius:"50%", border:`1px solid rgba(212,182,120,0.06)`, animation:"ripple 2s ease-out .4s infinite" }}/>
              <div style={{ width:88, height:88, borderRadius:3, border:`1px solid ${C.borderHi}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {granted ? (
          <div style={{ textAlign:"center" }}>
            <h1 style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:10 }}>Location enabled</h1>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>Taking you to your home screen…</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily:SF, fontSize:34, fontWeight:300, color:C.cream, letterSpacing:-.5, lineHeight:1.15, marginBottom:10, textAlign:"center" }}>
              Enable location<br/>for better rides
            </h1>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, textAlign:"center", marginBottom:32 }}>
              EVGoo uses your location to find the nearest drivers, set your pickup point, and keep you safe throughout your journey.
            </p>

            {/* Benefits list */}
            <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:32, border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden" }}>
              {[
                ["📍", "Precise pickup",    "Drops a pin at your exact spot so drivers find you instantly"],
                ["🗺️", "Live ride tracking", "Follow your journey in real time on the map"],
                ["🛡️", "Safety sharing",    "Share your live location with trusted contacts during rides"],
              ].map(([icon, title, desc], i, arr) => (
                <div key={title} style={{ display:"flex", gap:14, padding:"14px 16px", borderBottom: i < arr.length-1 ? `1px solid ${C.border}` : "none", background:C.surface }}>
                  <div style={{ width:36, height:36, borderRadius:3, border:`1px solid ${C.border}`, background:C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{icon}</div>
                  <div>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{title}</p>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <GoldBtn onClick={allow}>Allow while using app</GoldBtn>

            <button onClick={allow} className="press" style={{ width:"100%", marginTop:10, padding:"14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
              Allow once
            </button>

            <button onClick={onSkip} className="press" style={{ display:"block", width:"100%", marginTop:12, padding:"12px", background:"none", border:"none", color:C.faint, fontFamily:UF, fontSize:11, letterSpacing:.5, cursor:"pointer", textAlign:"center", lineHeight:1.7 }}>
              Not now — some features will be limited
            </button>
          </>
        )}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   DRIVER CANCELLED SCREEN
══════════════════════════════════════════════════════════════ */
function DriverCancelled({ ride, route, onRebook, onSchedule, onHome }) {
  const [reported, setReported] = useState(false);
  const [couponCopied, setCopied] = useState(false);

  const REASONS = [
    "Vehicle breakdown",
    "Personal emergency",
    "Navigational issue",
    "Driver app error",
  ];
  const [reason] = useState(REASONS[Math.floor(Math.random() * REASONS.length)]);

  const copy = () => { setCopied(true); setTimeout(()=>setCopied(false), 2000); };

  return (
    <Screen scroll style={{ padding:"0" }}>
      {/* Red-tinted header */}
      <div style={{ padding:"60px 22px 28px", background:C.ink, borderBottom:`1px solid rgba(192,97,74,0.2)`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,transparent,rgba(192,97,74,0.7),transparent)" }}/>

        <div style={{ display:"flex", alignItems:"flex-start", gap:16 }}>
          {/* Animated icon */}
          <div style={{ width:64, height:64, borderRadius:3, background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.35)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0 }}>
            🚫
          </div>
          <div>
            <p style={{ fontFamily:UF, fontSize:10, color:C.danger, letterSpacing:2, textTransform:"uppercase", marginBottom:5 }}>Ride cancelled by driver</p>
            <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3, lineHeight:1.2 }}>
              Your driver cancelled<br/>this trip
            </h1>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:8 }}>Reason given: <span style={{ color:C.cream }}>{reason}</span></p>
          </div>
        </div>
      </div>

      <div style={{ padding:"22px 22px 40px" }}>

        {/* Zero charge assurance */}
        <div style={{ display:"flex", gap:12, padding:"14px 16px", border:`1px solid rgba(90,158,114,0.35)`, borderRadius:3, background:"rgba(90,158,114,0.06)", marginBottom:20 }}>
          <span style={{ fontSize:20 }}>✅</span>
          <div>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color:C.success }}>You won't be charged</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.6 }}>No cancellation fee applies when your driver cancels. Any payment hold will be released within 24 hours.</p>
          </div>
        </div>

        {/* Auto-applied apology coupon */}
        <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:24, position:"relative" }}>
          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
          <div style={{ padding:"16px 18px", background:C.surface }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <Tag gold>🎁 Apology offer — auto-applied</Tag>
                <p style={{ fontFamily:SF, fontSize:20, fontWeight:400, color:C.cream, marginTop:8, letterSpacing:-.2 }}>₹50 off your next ride</p>
                <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4, lineHeight:1.6 }}>Valid for 24 hours · Any vehicle type · No minimum fare</p>
              </div>
              <div style={{ fontFamily:SF, fontSize:28, fontWeight:500, color:C.gold, flexShrink:0 }}>₹50</div>
            </div>
          </div>
          <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:2, color:C.gold }}>SORRY50</span>
            <button onClick={copy} className="press" style={{ background:"none", border:`1px solid ${couponCopied?"rgba(90,158,114,.5)":C.border}`, borderRadius:3, padding:"6px 14px", color:couponCopied?C.success:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
              {couponCopied?"✓ Copied":"Copy"}
            </button>
          </div>
        </div>

        {/* Your route summary */}
        <Lbl>Your trip details</Lbl>
        <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 16px", marginBottom:22, background:C.surface }}>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:C.gold, flexShrink:0 }}/>
              <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{(route?.pickup||"Connaught Place, New Delhi").split(",")[0]}</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:7, height:7, borderRadius:1, background:C.danger, flexShrink:0 }}/>
              <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{(route?.drop||"IGI Airport T2, New Delhi").split("—")[0]}</p>
            </div>
          </div>
        </div>

        {/* Priority re-match badge */}
        <div style={{ display:"flex", gap:12, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:22 }}>
          <span style={{ fontSize:18 }}>⚡</span>
          <div>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>Priority matching enabled</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3 }}>You'll be matched with the next available driver in your area — no queue wait.</p>
          </div>
        </div>

        {/* Primary action */}
        <GoldBtn onClick={onRebook} style={{ marginBottom:10 }}>Find another driver →</GoldBtn>

        {/* Secondary actions */}
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          <button onClick={onSchedule} className="press" style={{ flex:1, padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
            📅 Schedule later
          </button>
          <button onClick={onHome} className="press" style={{ flex:1, padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
            🏠 Go home
          </button>
        </div>

        {/* Report */}
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20 }}>
          {reported ? (
            <p style={{ fontFamily:UF, fontSize:12, color:C.success, textAlign:"center" }}>✓ Report submitted. Our team will review within 24 hours.</p>
          ) : (
            <button onClick={()=>setReported(true)} className="press" style={{ width:"100%", padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
              Report this cancellation
            </button>
          )}
        </div>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAYMENT FAILURE SCREEN
══════════════════════════════════════════════════════════════ */
const FAIL_TYPES = [
  { id:"upi",     icon:"📱", label:"UPI timeout",         title:"UPI request timed out",       body:"Your bank didn't respond in time. Your money was not deducted. Please retry or use another method.", code:"ERR_UPI_TIMEOUT"   },
  { id:"balance", icon:"💸", label:"Insufficient funds",  title:"Insufficient balance",        body:"Your account doesn't have enough funds. Top up your account or pay using a different method.",        code:"ERR_LOW_BALANCE"   },
  { id:"decline", icon:"🏦", label:"Bank declined",       title:"Your bank declined",          body:"Your bank blocked this transaction. This is usually a security check. Try again or call your bank.",   code:"ERR_BANK_DECLINE"  },
  { id:"network", icon:"📡", label:"Network error",       title:"Connection interrupted",      body:"A network issue occurred during payment. No amount was deducted. Check your connection and retry.",    code:"ERR_NETWORK_FAIL"  },
];

function PayFail({ ride, onRetry, onSwitchMethod, onCash, onHome }) {
  const [failType, setFailType] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const err = FAIL_TYPES[failType];

  const doRetry = () => {
    setRetrying(true);
    setTimeout(() => { setRetrying(false); onRetry(); }, 1800);
  };

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>

      {/* Error type selector (demo) */}
      <div style={{ marginBottom:24 }}>
        <Lbl>Demo — select error type</Lbl>
        <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
          {FAIL_TYPES.map((t,i) => (
            <button key={t.id} onClick={()=>setFailType(i)} className="press" style={{ padding:"7px 12px", border:`1px solid ${i===failType?C.gold:C.border}`, borderRadius:3, background:i===failType?"rgba(212,182,120,0.07)":"none", color:i===failType?C.gold:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Animated failure icon */}
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ position:"relative", display:"inline-block" }}>
          {[1,2].map(i=>(
            <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:64+i*28, height:64+i*28, borderRadius:"50%", border:`1px solid rgba(192,97,74,${.15-i*.05})` }}/>
          ))}
          <div style={{ width:80, height:80, borderRadius:3, background:"rgba(192,97,74,0.1)", border:`1.5px solid rgba(192,97,74,0.45)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, position:"relative" }}>
            {err.icon}
          </div>
        </div>
      </div>

      {/* Error message */}
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <Tag accent={C.danger} style={{ marginBottom:12 }}>Payment failed · {err.code}</Tag>
        <h1 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, lineHeight:1.2, marginTop:12, marginBottom:10 }}>{err.title}</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8 }}>{err.body}</p>
      </div>

      {/* Amount + ride context */}
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 18px", background:C.surface, marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted }}>Amount not deducted</p>
          <p style={{ fontFamily:SF, fontSize:24, fontWeight:500, color:C.cream, marginTop:3 }}>₹{ride?.fare||349}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted }}>Ride held for</p>
          <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.gold, marginTop:3 }}>8 min</p>
        </div>
      </div>

      {/* Retry */}
      {retrying ? (
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, padding:"17px", border:`1px solid ${C.borderHi}`, borderRadius:3, marginBottom:12 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .8s linear infinite" }}/>
          <span style={{ fontFamily:UF, fontSize:12, color:C.muted, letterSpacing:.5 }}>Retrying payment…</span>
        </div>
      ) : (
        <GoldBtn onClick={doRetry} style={{ marginBottom:10 }}>Retry payment →</GoldBtn>
      )}

      {/* Alt actions */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
        <button onClick={onSwitchMethod} className="press" style={{ width:"100%", padding:"14px 18px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.cream, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Switch payment method
        </button>
        <button onClick={onCash} className="press" style={{ width:"100%", padding:"14px 18px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.cream, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          💵 Pay driver in cash
        </button>
      </div>

      {/* Safety note */}
      <div style={{ display:"flex", gap:12, padding:"12px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:20 }}>
        <span>🔒</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>
          No amount was deducted from your account. Your driver will wait for up to 8 minutes before the booking expires.
        </p>
      </div>

      <button onClick={onHome} className="press" style={{ width:"100%", padding:"13px", background:"none", border:"none", color:C.faint, fontFamily:UF, fontSize:11, letterSpacing:.5, cursor:"pointer" }}>
        Cancel booking and go home
      </button>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   START RIDE — SHARE OTP WITH DRIVER
══════════════════════════════════════════════════════════════ */
function StartRide({ ride, onStarted, onBack }) {
  const genOtp = () => String(Math.floor(1000 + Math.random() * 9000));
  const [otp,       setOtp]     = useState(genOtp);
  const [phase,     setPhase]   = useState("waiting");  // waiting | confirming | started
  const [secs,      setSecs]    = useState(599);         // 10-min countdown
  const [refreshed, setRefreshed] = useState(false);
  const [revealed,  setRevealed]  = useState(true);

  /* Countdown timer */
  useEffect(() => {
    if (phase !== "waiting") return;
    if (secs <= 0) { setOtp(genOtp()); setSecs(599); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, phase]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const progress = secs / 599;

  const refresh = () => {
    setOtp(genOtp());
    setSecs(599);
    setRefreshed(true);
    setTimeout(() => setRefreshed(false), 2000);
  };

  const confirm = () => {
    setPhase("confirming");
    setTimeout(() => { setPhase("started"); setTimeout(onStarted, 1400); }, 1600);
  };

  const D = otp.split("");   // 4 individual digits

  /* ── STARTED state ── */
  if (phase === "started") return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <div style={{ position:"absolute", top:"28%", left:"50%", transform:"translate(-50%,-50%)", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(90,158,114,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div className="fu" style={{ position:"relative" }}>
        <div style={{ width:96, height:96, borderRadius:3, border:`1px solid rgba(90,158,114,0.45)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:44, margin:"0 auto 24px" }}>🚗</div>
        <h1 style={{ fontFamily:SF, fontSize:38, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:12 }}>Ride started!</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8 }}>OTP verified. {ride?.driver?.split(" ")[0]||"Your driver"} has started the trip — enjoy your journey.</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:20 }}>
          <Tag gold>⚡ 100% EV</Tag>
          <Tag accent={C.success}>🌱 Zero emission</Tag>
        </div>
      </div>
    </div>
  );

  /* ── CONFIRMING state ── */
  if (phase === "confirming") return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .8s linear infinite", margin:"0 auto 24px" }}/>
      <p style={{ fontFamily:SF, fontSize:24, fontWeight:300, color:C.cream }}>Verifying with driver…</p>
      <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:8 }}>Please wait a moment</p>
    </div>
  );

  /* ── WAITING state ── */
  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>

      {/* Ambient radial */}
      <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ padding:"52px 22px 20px", display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2.5, textTransform:"uppercase" }}>Step 4 of 4</p>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3, marginTop:3 }}>Share your ride OTP</h1>
        </div>
      </div>

      <div style={{ flex:1, padding:"0 22px 36px", overflowY:"auto", position:"relative", zIndex:1 }}>

        {/* Driver card */}
        <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${C.borderHi}`, borderRadius:3, background:C.surface, marginBottom:28, position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
          <div style={{ width:44, height:44, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>👨‍✈️</div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:14, fontWeight:600, color:C.cream }}>{ride?.driver||"Arjun S."}</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>{ride?.type||"EV Cab"} · {ride?.plate||"DL 3C 9821"}</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 }}>
            <Tag gold>⭐ {ride?.rating||"4.9"}</Tag>
            <Tag accent={C.success}>● Arrived</Tag>
          </div>
        </div>

        {/* Instruction */}
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:28, textAlign:"center" }}>
          Read the code below to your driver. They'll enter it on their device to start the trip.
        </p>

        {/* OTP display — the hero element */}
        <div style={{ marginBottom:8 }}>
          {/* Boarding-pass style OTP card */}
          <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"32px 24px 24px", background:C.surface, position:"relative", overflow:"hidden", marginBottom:16 }}>
            {/* Decorative top line */}
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.6 }}/>

            {/* Perforated dashes left & right (boarding pass feel) */}
            <div style={{ position:"absolute", left:-1, top:"50%", transform:"translateY(-50%)", width:10, height:22, background:C.obsidian, borderRadius:"0 12px 12px 0", border:`1px solid ${C.border}`, borderLeft:"none" }}/>
            <div style={{ position:"absolute", right:-1, top:"50%", transform:"translateY(-50%)", width:10, height:22, background:C.obsidian, borderRadius:"12px 0 0 12px", border:`1px solid ${C.border}`, borderRight:"none" }}/>

            {/* "Your Ride OTP" label */}
            <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:3, textTransform:"uppercase", textAlign:"center", marginBottom:20 }}>
              Your ride OTP
            </p>

            {/* The 4 digits */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              {D.map((digit, i) => (
                <>
                  <div
                    key={i}
                    style={{
                      width:62, height:78,
                      border:`1.5px solid ${C.borderHi}`,
                      borderRadius:3,
                      background:C.elevated,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      position:"relative", overflow:"hidden",
                    }}
                  >
                    {/* Subtle shimmer on each digit box */}
                    <div style={{
                      position:"absolute", inset:0,
                      background:`linear-gradient(135deg, transparent 40%, rgba(212,182,120,0.04) 50%, transparent 60%)`,
                    }}/>
                    {revealed ? (
                      <span style={{
                        fontFamily:SF, fontSize:46, fontWeight:300,
                        color:C.gold, lineHeight:1, position:"relative",
                        letterSpacing:"-2px",
                        textShadow:`0 0 20px rgba(212,182,120,0.3)`,
                      }}>{digit}</span>
                    ) : (
                      <span style={{ fontFamily:SF, fontSize:46, fontWeight:300, color:C.border }}>•</span>
                    )}
                  </div>
                  {/* Centre dot divider between digit 2 and 3 */}
                  {i === 1 && (
                    <div key="sep" style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:C.goldDim }}/>
                      <div style={{ width:5, height:5, borderRadius:"50%", background:C.goldDim }}/>
                    </div>
                  )}
                </>
              ))}
            </div>

            {/* Countdown bar + time */}
            <div style={{ marginTop:24 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>
                  {secs < 60 ? "⚠️ Expiring soon" : "OTP valid for"}
                </span>
                <span style={{ fontFamily:UF, fontSize:11, fontWeight:600, color:secs < 60 ? C.danger : C.gold }}>
                  {mm}:{ss}
                </span>
              </div>
              <div style={{ height:2, borderRadius:2, background:C.border, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:2,
                  width:`${progress * 100}%`,
                  background: secs < 60
                    ? `linear-gradient(90deg, ${C.danger}, #E8775F)`
                    : `linear-gradient(90deg, ${C.gold}, ${C.goldLight})`,
                  transition:"width 1s linear, background .5s",
                }}/>
              </div>
            </div>
          </div>

          {/* Reveal / hide + refresh row */}
          <div style={{ display:"flex", gap:10 }}>
            <button
              onClick={() => setRevealed(r => !r)}
              className="press"
              style={{ flex:1, padding:"12px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {revealed
                  ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                }
              </svg>
              {revealed ? "Hide OTP" : "Show OTP"}
            </button>
            <button
              onClick={refresh}
              className="press"
              style={{ flex:1, padding:"12px", background:refreshed?"rgba(90,158,114,0.08)":"none", border:`1px solid ${refreshed?"rgba(90,158,114,0.4)":C.border}`, borderRadius:3, color:refreshed?C.success:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
              </svg>
              {refreshed ? "Refreshed ✓" : "New OTP"}
            </button>
          </div>
        </div>

        {/* How it works */}
        <div style={{ margin:"24px 0", padding:"16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface }}>
          <Lbl style={{ marginBottom:12 }}>How this works</Lbl>
          {[
            ["1","Tell your driver", `Say the 4-digit code: ${revealed ? otp.split("").join(" · ") : "• • • •"}`],
            ["2","Driver enters OTP", "They type it into the EVGoo driver app"],
            ["3","Ride begins",       "The meter starts and your trip is underway"],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ display:"flex", gap:14, marginBottom:12 }}>
              <div style={{ width:24, height:24, borderRadius:3, border:`1px solid ${C.border}`, background:C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:13, color:C.gold, flexShrink:0, marginTop:1 }}>{num}</div>
              <div>
                <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{title}</p>
                <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2, lineHeight:1.5 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security note */}
        <div style={{ display:"flex", gap:12, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:24 }}>
          <span style={{ fontSize:15, flexShrink:0, marginTop:1 }}>🔒</span>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>
            Never share this OTP with anyone other than your driver in person. EVGoo support will never ask for your OTP.
          </p>
        </div>

        {/* CTA */}
        <GoldBtn onClick={confirm}>Driver has my OTP — Start Ride →</GoldBtn>

        <button onClick={onBack} className="press" style={{ display:"block", width:"100%", marginTop:12, padding:"13px", background:"none", border:"none", color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
          ← Go back
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUBSCRIPTION — EVGOO PASS
══════════════════════════════════════════════════════════════ */
const PLANS = [
  {
    id:"lite",
    name:"Lite Pass",
    tag:"Get started",
    price:199,
    rides:8,
    kmPerRide:10,
    extraKmRate:14,
    vehicles:["EV Auto","EV Moto"],
    perks:["Zero booking fee","Basic support"],
    color:"#12180E",
    accent:"#5A9E72",
    popular:false,
  },
  {
    id:"city",
    name:"City Pass",
    tag:"Best value",
    price:499,
    rides:20,
    kmPerRide:20,
    extraKmRate:11,
    vehicles:["EV Auto","EV Cab","EV Moto"],
    perks:["Zero surge pricing","Priority support","Free cancellations × 5"],
    color:"#0E1420",
    accent:"#1A73E8",
    popular:false,
  },
  {
    id:"explorer",
    name:"Explorer Pass",
    tag:"Most popular",
    price:899,
    rides:40,
    kmPerRide:30,
    extraKmRate:9,
    vehicles:["All vehicle types"],
    perks:["Zero surge pricing","Priority driver matching","Free cancellations × 10","₹100 wallet credit on renewal"],
    color:"#1A160E",
    accent:"#C9A84C",
    popular:true,
  },
  {
    id:"elite",
    name:"Elite Pass",
    tag:"Maximum freedom",
    price:1499,
    rides:null,        // unlimited
    kmPerRide:50,
    extraKmRate:7,
    vehicles:["All vehicle types incl. Prime"],
    perks:["Zero surge — always","Instant priority matching","Unlimited free cancellations","₹250 wallet credit on renewal","Dedicated 24×7 support","Gold member status guaranteed"],
    color:"#18120E",
    accent:"#D4B678",
    popular:false,
  },
];

// Simulated current subscription
const ACTIVE_PLAN = {
  planId:"explorer",
  ridesUsed:12,
  kmUsed:198,
  renewsOn:"18 Jun 2026",
  daysLeft:18,
  daysTotal:30,
  recentRides:[
    { date:"12 May", from:"Sector 62",     to:"Cyber Hub",   km:18.4, saved:82  },
    { date:"10 May", from:"Connaught Pl.", to:"Lodhi Garden",km:5.2,  saved:41  },
    { date:"9 May",  from:"AIIMS",         to:"IGI Airport", km:24.1, saved:108 },
    { date:"7 May",  from:"IIT Delhi",     to:"CityWalk",    km:7.8,  saved:35  },
  ],
};

function Subscriptions({ onBack }) {
  const [tab,      setTab]    = useState("plans");   // "plans" | "mypass"
  const [selPlan,  setSel]    = useState(null);
  const [hasPass,  setHasPass]= useState(true);      // simulate already subscribed
  const [paying,   setPaying] = useState(false);
  const [success,  setSuccess]= useState(null);
  const [showCancel, setShowCancel] = useState(false);

  const active = PLANS.find(p => p.id === ACTIVE_PLAN.planId);
  const totalKm = active ? (active.rides ? active.rides * active.kmPerRide : "∞") : 0;
  const kmPct   = active?.rides ? Math.round(ACTIVE_PLAN.kmUsed / (active.rides * active.kmPerRide) * 100) : 0;
  const ridePct = active?.rides ? Math.round(ACTIVE_PLAN.ridesUsed / active.rides * 100) : 0;
  const daysPct = Math.round(ACTIVE_PLAN.daysLeft / ACTIVE_PLAN.daysTotal * 100);
  const totalSaved = ACTIVE_PLAN.recentRides.reduce((s, r) => s + r.saved, 0);

  const subscribe = (plan) => {
    setPaying(true);
    setTimeout(() => { setPaying(false); setSuccess(plan.id); setHasPass(true); setTab("mypass"); setTimeout(()=>setSuccess(null),2500); }, 1800);
  };

  /* ── Progress ring helper (SVG) ── */
  const Ring = ({ pct, size=64, stroke=3, color=C.gold, children }) => {
    const r = (size - stroke * 2) / 2;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct / 100;
    return (
      <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
        <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition:"stroke-dasharray .6s ease" }}/>
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {children}
        </div>
      </div>
    );
  };

  /* ── Paying overlay ── */
  if (paying) return (
    <Screen center>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .9s linear infinite", margin:"0 auto 24px" }}/>
        <p style={{ fontFamily:SF, fontSize:24, fontWeight:300, color:C.cream }}>Activating your Pass…</p>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:8 }}>Setting up your subscription</p>
      </div>
    </Screen>
  );

  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>

      {/* Header */}
      <div style={{ padding:"52px 22px 0", background:C.ink, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <BackBtn onClick={onBack}/>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div className="gold-text" style={{ fontFamily:SF, fontSize:22, fontWeight:300, letterSpacing:-.3 }}>EVGoo Pass</div>
              {hasPass && <Tag gold>● Active</Tag>}
            </div>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>
              {hasPass ? `${active?.name} — renews ${ACTIVE_PLAN.renewsOn}` : "Ride more. Spend less."}
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex" }}>
          {(hasPass ? [["plans","Plans"],["mypass","My Pass"]] : [["plans","All Plans"]]).map(([k,l]) => (
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"11px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:10, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase", color:tab===k?C.gold:C.muted, borderBottom:tab===k?`1.5px solid ${C.gold}`:"1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"22px 20px 48px" }}>

        {/* ══ MY PASS tab ══════════════════════════════════════════ */}
        {tab==="mypass" && hasPass && (
          <>
            {/* Success flash */}
            {success && (
              <div className="fu" style={{ padding:"14px 16px", border:`1px solid rgba(90,158,114,0.5)`, borderRadius:3, background:"rgba(90,158,114,0.08)", marginBottom:18, display:"flex", gap:12, alignItems:"center" }}>
                <span style={{ fontSize:20 }}>🎉</span>
                <p style={{ fontFamily:UF, fontSize:13, color:C.success, fontWeight:500 }}>Pass activated successfully!</p>
              </div>
            )}

            {/* Active plan hero */}
            <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:20, position:"relative" }}>
              <div style={{ height:1, background:`linear-gradient(90deg,transparent,${active?.accent||C.gold},transparent)`, opacity:.7 }}/>
              <div style={{ padding:"20px", background:`linear-gradient(135deg,${active?.color||C.surface},${C.surface})` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                  <div>
                    <Tag accent={active?.accent} style={{ marginBottom:8 }}>{active?.tag}</Tag>
                    <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginTop:6 }}>{active?.name}</h2>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4 }}>
                      {active?.rides ? `${active.rides} rides` : "Unlimited rides"} · {active?.kmPerRide} km/ride · ₹{active?.extraKmRate}/km extra
                    </p>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <span style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:active?.accent||C.gold }}>₹{active?.price}</span>
                    <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, marginTop:2 }}>/month</p>
                  </div>
                </div>
                {/* Renewal strip */}
                <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"rgba(0,0,0,0.2)", borderRadius:3 }}>
                  <span style={{ fontFamily:UF, fontSize:11, color:C.muted }}>Renews {ACTIVE_PLAN.renewsOn}</span>
                  <span style={{ fontFamily:UF, fontSize:11, color:active?.accent||C.gold, fontWeight:500 }}>{ACTIVE_PLAN.daysLeft} days left</span>
                </div>
              </div>
            </div>

            {/* Usage rings */}
            <Lbl>This month's usage</Lbl>
            <div style={{ display:"flex", gap:10, marginBottom:22 }}>
              {[
                { label:"Rides used", value:`${ACTIVE_PLAN.ridesUsed}/${active?.rides||"∞"}`, pct:ridePct, color:active?.accent||C.gold },
                { label:"KMs ridden", value:`${ACTIVE_PLAN.kmUsed} km`, pct:kmPct, color:"#5A9E72" },
                { label:"Days left",  value:`${ACTIVE_PLAN.daysLeft}d`, pct:daysPct, color:"#1A73E8" },
              ].map(({ label, value, pct, color }) => (
                <div key={label} style={{ flex:1, border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 10px", background:C.surface, display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
                  <Ring pct={pct} size={60} stroke={4} color={color}>
                    <span style={{ fontFamily:UF, fontSize:10, fontWeight:600, color }}>{pct}%</span>
                  </Ring>
                  <div style={{ textAlign:"center" }}>
                    <p style={{ fontFamily:UF, fontSize:12, fontWeight:600, color:C.cream }}>{value}</p>
                    <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:2 }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* KM pool breakdown */}
            <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"16px", background:C.surface, marginBottom:22 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
                <Lbl style={{ margin:0 }}>KM pool breakdown</Lbl>
                <span style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{ACTIVE_PLAN.kmUsed} / {totalKm} km used</span>
              </div>
              {/* Segmented bar */}
              <div style={{ height:8, borderRadius:4, background:C.border, overflow:"hidden", marginBottom:10 }}>
                <div style={{ height:"100%", width:`${kmPct}%`, background:`linear-gradient(90deg,${active?.accent||C.gold},${C.goldLight})`, borderRadius:4, transition:"width .6s ease" }}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", gap:16 }}>
                {[
                  ["Used", `${ACTIVE_PLAN.kmUsed} km`, active?.accent||C.gold],
                  ["Remaining", `${(active?.rides||0)*active?.kmPerRide - ACTIVE_PLAN.kmUsed} km`, C.success],
                  ["Extra rate", `₹${active?.extraKmRate}/km`, C.muted],
                ].map(([k,v,col]) => (
                  <div key={k} style={{ textAlign:"center", flex:1 }}>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color:col }}>{v}</p>
                    <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:3 }}>{k}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings so far */}
            <div style={{ display:"flex", gap:10, padding:"14px 16px", border:`1px solid rgba(90,158,114,0.3)`, borderRadius:3, background:"rgba(90,158,114,0.06)", marginBottom:22 }}>
              <span style={{ fontSize:20 }}>💰</span>
              <div>
                <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color:C.success }}>₹{totalSaved} saved this month</p>
                <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.6 }}>vs paying per-ride rates for the same {ACTIVE_PLAN.ridesUsed} trips</p>
              </div>
            </div>

            {/* Recent pass rides */}
            <Lbl>Recent pass rides</Lbl>
            {ACTIVE_PLAN.recentRides.map((r, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:36, height:36, borderRadius:3, background:C.surface, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🚗</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>{r.from} → {r.to}</p>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{r.date} · {r.km} km</p>
                </div>
                <div style={{ textAlign:"right" }}>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.success }}>−₹{r.saved}</p>
                  <p style={{ fontFamily:UF, fontSize:9, color:C.muted, marginTop:2 }}>saved</p>
                </div>
              </div>
            ))}

            {/* Manage */}
            <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={()=>setTab("plans")} className="press" style={{ width:"100%", padding:"14px", background:"none", border:`1px solid ${C.borderHi}`, borderRadius:3, color:C.gold, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                ↑ Upgrade plan
              </button>
              <div style={{ display:"flex", gap:8 }}>
                <button className="press" style={{ flex:1, padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
                  Pause
                </button>
                <button onClick={()=>setShowCancel(!showCancel)} className="press" style={{ flex:1, padding:"13px", background:"none", border:`1px solid rgba(192,97,74,0.3)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer" }}>
                  Cancel plan
                </button>
              </div>
              {showCancel && (
                <div className="fu" style={{ padding:"16px", border:`1px solid rgba(192,97,74,0.3)`, borderRadius:3, background:"rgba(192,97,74,0.06)" }}>
                  <p style={{ fontFamily:UF, fontSize:13, color:C.cream, marginBottom:6 }}>Cancel {active?.name}?</p>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7, marginBottom:14 }}>Your plan stays active until {ACTIVE_PLAN.renewsOn}. Unused rides are non-refundable.</p>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={()=>setShowCancel(false)} className="press" style={{ flex:1, padding:"11px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>Keep plan</button>
                    <button onClick={()=>{setHasPass(false);setShowCancel(false);setTab("plans");}} className="press" style={{ flex:1, padding:"11px", background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:10, letterSpacing:1, textTransform:"uppercase", cursor:"pointer" }}>Confirm cancel</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ PLANS tab ════════════════════════════════════════════ */}
        {tab==="plans" && (
          <>
            {/* Hero blurb */}
            <div style={{ marginBottom:24, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
              <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.4, lineHeight:1.2, marginBottom:10 }}>
                Ride more,<br/>pay less every month.
              </h2>
              <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8 }}>
                Pick a Pass that fits your routine. Every plan gives you a fixed number of rides with a per-ride km limit — go over the limit and pay just a small extra rate.
              </p>
            </div>

            {/* How it works — quick explainer */}
            <Lbl>How the km limit works</Lbl>
            <div style={{ display:"flex", gap:8, marginBottom:24, overflowX:"auto", paddingBottom:4 }}>
              {[
                ["📦","Pool size","Rides × km/ride = your monthly km pool"],
                ["✅","Within limit","Rides inside limit are fully covered"],
                ["➕","Extra kms","Pay only the extra rate per km beyond limit"],
              ].map(([ic,t,d]) => (
                <div key={t} style={{ flexShrink:0, width:140, padding:"14px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface }}>
                  <span style={{ fontSize:22 }}>{ic}</span>
                  <p style={{ fontFamily:UF, fontSize:12, fontWeight:600, color:C.cream, marginTop:10, marginBottom:5 }}>{t}</p>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.6 }}>{d}</p>
                </div>
              ))}
            </div>

            {/* Plan cards */}
            <Lbl>Choose your plan</Lbl>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {PLANS.map(plan => {
                const isActive = hasPass && ACTIVE_PLAN.planId === plan.id;
                const isSelected = selPlan === plan.id;
                const totalPool = plan.rides ? plan.rides * plan.kmPerRide : null;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSel(isSelected ? null : plan.id)}
                    className="press"
                    style={{
                      border:`1px solid ${isActive?C.gold:plan.popular?plan.accent+"55":isSelected?C.borderHi:C.border}`,
                      borderRadius:3,
                      overflow:"hidden",
                      transition:"all .2s",
                      background: isActive
                        ? "rgba(212,182,120,0.04)"
                        : plan.popular ? `${plan.accent}08` : C.ink,
                    }}
                  >
                    {/* Plan header */}
                    <div style={{ padding:"18px 18px 14px", background:`linear-gradient(135deg,${plan.color},${C.ink})`, position:"relative", overflow:"hidden" }}>
                      {/* Decorative circle */}
                      <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:"50%", background:`${plan.accent}12` }}/>

                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
                        <div>
                          <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:6 }}>
                            <Tag accent={plan.accent}>{plan.tag}</Tag>
                            {isActive && <Tag gold>Current</Tag>}
                          </div>
                          <h3 style={{ fontFamily:SF, fontSize:24, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>{plan.name}</h3>
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <div style={{ fontFamily:SF, fontSize:30, fontWeight:300, color:plan.accent, lineHeight:1 }}>₹{plan.price}</div>
                          <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:3 }}>/month</p>
                        </div>
                      </div>

                      {/* Core metrics */}
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginTop:16 }}>
                        {[
                          ["🚗", plan.rides ? `${plan.rides}`, "Rides"],
                          ["📍", `${plan.kmPerRide} km`, "Per ride"],
                          ["🗺️", totalPool ? `${totalPool} km` : "∞", "Monthly pool"],
                        ].map(([ic, v, l]) => (
                          <div key={l} style={{ background:"rgba(0,0,0,0.25)", borderRadius:3, padding:"10px 8px", textAlign:"center" }}>
                            <p style={{ fontSize:14, marginBottom:3 }}>{ic}</p>
                            <p style={{ fontFamily:SF, fontSize:15, fontWeight:500, color:plan.accent, lineHeight:1 }}>{v}</p>
                            <p style={{ fontFamily:UF, fontSize:8, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:3 }}>{l}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expanded details */}
                    {(isSelected || isActive) && (
                      <div style={{ padding:"16px 18px", borderTop:`1px solid ${C.border}`, animation:"fadeIn .2s ease" }}>
                        {/* Vehicle types */}
                        <div style={{ marginBottom:14 }}>
                          <Lbl>Vehicles included</Lbl>
                          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                            {plan.vehicles.map(v => <Tag key={v} accent={plan.accent}>{v}</Tag>)}
                          </div>
                        </div>

                        {/* Perks */}
                        <div style={{ marginBottom:16 }}>
                          <Lbl>What's included</Lbl>
                          {plan.perks.map(p => (
                            <div key={p} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                              <div style={{ width:16, height:16, borderRadius:3, background:`${plan.accent}22`, border:`1px solid ${plan.accent}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                                <span style={{ fontSize:9, color:plan.accent }}>✓</span>
                              </div>
                              <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{p}</p>
                            </div>
                          ))}
                        </div>

                        {/* Extra km rate callout */}
                        <div style={{ padding:"11px 14px", border:`1px solid ${C.border}`, borderRadius:3, background:C.elevated, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div>
                            <p style={{ fontFamily:UF, fontSize:12, fontWeight:500, color:C.cream }}>Extra km rate</p>
                            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2 }}>Charged only when you exceed {plan.kmPerRide} km on a ride</p>
                          </div>
                          <span style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:plan.accent, flexShrink:0, marginLeft:12 }}>₹{plan.extraKmRate}/km</span>
                        </div>

                        {/* CTA */}
                        {isActive ? (
                          <div style={{ padding:"13px", border:`1px solid rgba(90,158,114,0.4)`, borderRadius:3, background:"rgba(90,158,114,0.08)", textAlign:"center" }}>
                            <p style={{ fontFamily:UF, fontSize:12, color:C.success, fontWeight:500 }}>✓ You're on this plan · {ACTIVE_PLAN.daysLeft} days remaining</p>
                          </div>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); subscribe(plan); }}
                            className="press"
                            style={{
                              width:"100%", padding:"15px",
                              border:"none", borderRadius:3,
                              background:`linear-gradient(135deg, ${plan.accent}CC, ${plan.accent})`,
                              color: plan.id==="explorer" ? C.obsidian : "#fff",
                              fontFamily:UF, fontSize:12, fontWeight:600,
                              letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer",
                            }}
                          >
                            {hasPass ? `Switch to ${plan.name}` : `Subscribe · ₹${plan.price}/mo`}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Collapsed footer - tap hint */}
                    {!isSelected && !isActive && (
                      <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between" }}>
                        <div style={{ display:"flex", gap:10 }}>
                          {plan.vehicles.slice(0,2).map(v => <Tag key={v} accent={plan.accent}>{v.replace("EV ","")}</Tag>)}
                          {plan.vehicles.length > 2 && <Tag>+{plan.vehicles.length-2}</Tag>}
                        </div>
                        <span style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:1.2, textTransform:"uppercase", alignSelf:"center" }}>Details ↓</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* FAQ strip */}
            <div style={{ marginTop:28, border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", background:C.surface }}>
              <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}` }}>
                <Lbl style={{ marginBottom:0 }}>Common questions</Lbl>
              </div>
              {[
                ["Can I use my pass for any ride?",    "Yes — any ride you book through EVGoo uses your pass allocation automatically."],
                ["What happens if I run out of rides?","You can still book rides at regular per-ride pricing. Your pass benefits like zero surge still apply."],
                ["Does unused balance roll over?",     "Unused rides and KMs do not roll over to the next month."],
                ["Can I switch plans mid-month?",      "Yes. Upgrading is instant. Downgrading takes effect on your next renewal date."],
              ].map(([q, a], i, arr) => (
                <div key={q} style={{ padding:"14px 16px", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, marginBottom:5 }}>{q}</p>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>{a}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PUSH NOTIFICATION OPT-IN
══════════════════════════════════════════════════════════════ */
function PushPerm({ onAllow, onSkip }) {
  const [granted, setGranted] = useState(false);
  const allow = () => { setGranted(true); setTimeout(onAllow, 900); };

  const BENEFITS = [
    { icon:"🚗", title:"Driver arrival alerts",    desc:"Know exactly when your driver is 2 min away — never keep them waiting" },
    { icon:"🎟️", title:"Exclusive offers first",   desc:"Flash sales, city-specific coupons, and Pass deals sent just to you" },
    { icon:"🛡️", title:"Safety check-ins",         desc:"Automatic nudges if a ride takes unusually long or deviates from route" },
    { icon:"💰", title:"Payment confirmations",     desc:"Instant receipt the moment your fare is processed — no surprises" },
  ];

  return (
    <Screen center style={{ padding:"0 28px" }}>
      <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translate(-50%,-50%)", width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>

      <div className="fu" style={{ width:"100%", maxWidth:360, margin:"0 auto" }}>
        {/* Icon */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ position:"relative", width:88, height:88, margin:"0 auto" }}>
            {[1,2].map(i=>(
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:88+i*28, height:88+i*28, borderRadius:"50%", border:`1px solid rgba(212,182,120,${.1-i*.04})` }}/>
            ))}
            <div style={{ width:88, height:88, borderRadius:3, border:`1px solid ${C.borderHi}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
              {granted
                ? <span style={{ fontSize:42 }}>✅</span>
                : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                  </svg>
              }
            </div>
          </div>
        </div>

        {granted ? (
          <div style={{ textAlign:"center" }}>
            <h1 style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:10 }}>Notifications on</h1>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>You're all set — taking you to your account…</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, letterSpacing:-.5, lineHeight:1.15, marginBottom:10, textAlign:"center" }}>
              Stay in the loop
            </h1>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, textAlign:"center", marginBottom:28 }}>
              EVGoo sends only what matters. No spam — just the updates that make your ride better.
            </p>

            {/* Benefits */}
            <div style={{ display:"flex", flexDirection:"column", gap:0, marginBottom:28, border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden" }}>
              {BENEFITS.map(({ icon, title, desc }, i, arr) => (
                <div key={title} style={{ display:"flex", gap:14, padding:"14px 16px", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none", background:C.surface }}>
                  <div style={{ width:36, height:36, borderRadius:3, border:`1px solid ${C.border}`, background:C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{icon}</div>
                  <div>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{title}</p>
                    <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <GoldBtn onClick={allow} style={{ marginBottom:10 }}>Allow notifications</GoldBtn>
            <button onClick={onSkip} className="press" style={{ width:"100%", padding:"13px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
              Not now
            </button>
            <p style={{ textAlign:"center", fontFamily:UF, fontSize:10, color:C.faint, marginTop:14, lineHeight:1.8 }}>
              You can change this any time in Settings → Notifications.
            </p>
          </>
        )}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   EVGOO WALLET
══════════════════════════════════════════════════════════════ */
const WALLET_TXN = [
  { id:"w1", type:"debit",    icon:"🚗", label:"EV Cab ride",           sub:"Connaught Pl → Cyber Hub",     amount:-349,  date:"12 May, 9:14 AM" },
  { id:"w2", type:"credit",   icon:"↩️", label:"Refund — cancelled",     sub:"JN Stadium ride",               amount:+279,  date:"10 May, 11:02 AM"},
  { id:"w3", type:"topup",    icon:"⬆️", label:"Added via GPay",          sub:"UPI · arjun@okaxis",            amount:+500,  date:"8 May, 8:30 PM"  },
  { id:"w4", type:"cashback", icon:"🎁", label:"Cashback — EVGOO50",     sub:"Coupon applied on ride",        amount:+50,   date:"7 May, 6:48 PM"  },
  { id:"w5", type:"debit",    icon:"🚗", label:"EV Auto ride",            sub:"Connaught Pl → Lodhi Garden",  amount:-189,  date:"5 May, 7:32 PM"  },
  { id:"w6", type:"credit",   icon:"🎟️", label:"Pass renewal bonus",      sub:"Explorer Pass — May",          amount:+100,  date:"1 May, 12:00 AM" },
  { id:"w7", type:"debit",    icon:"🚙", label:"EV Prime ride",           sub:"AIIMS → IGI Airport",          amount:-549,  date:"29 Apr, 11:05 AM"},
  { id:"w8", type:"topup",    icon:"⬆️", label:"Added via HDFC Card",     sub:"Card ending 4821",             amount:+1000, date:"25 Apr, 3:20 PM" },
];
const TXN_COLOR = { debit:C.danger, credit:C.success, topup:"#1A73E8", cashback:C.gold };

function Wallet({ onBack }) {
  const [topupOpen, setTopup]   = useState(false);
  const [topupAmt,  setTAmt]    = useState("");
  const [autoPay,   setAutoPay] = useState(true);
  const [added,     setAdded]   = useState(false);
  const [filter,    setFilter]  = useState("all");

  const balance = 1245.50;
  const txns = filter === "all" ? WALLET_TXN : WALLET_TXN.filter(t => t.type === filter);

  const doTopup = () => {
    if (!topupAmt) return;
    setAdded(true);
    setTimeout(() => { setAdded(false); setTopup(false); setTAmt(""); }, 1400);
  };

  const QUICK_AMOUNTS = [100, 200, 500, 1000];
  const TOPUP_METHODS = [
    { id:"gpay",    icon:"🔵", name:"GPay",    accent:"#1A73E8" },
    { id:"phonepe", icon:"💜", name:"PhonePe", accent:"#7B2FBE" },
    { id:"card",    icon:"💳", name:"Card",    accent:"#4A4540" },
  ];
  const [tMethod, setTMethod] = useState("gpay");

  return (
    <Screen scroll style={{ padding:"0" }}>
      {/* Header + balance hero */}
      <div style={{ padding:"52px 22px 24px", background:`linear-gradient(180deg,${C.ink} 0%,${C.obsidian} 100%)`, borderBottom:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
        <div style={{ position:"absolute", top:"20%", right:"-10%", width:180, height:180, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.05) 0%,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
          <BackBtn onClick={onBack}/>
          <div style={{ flex:1 }}>
            <div className="gold-text" style={{ fontFamily:SF, fontSize:22, fontWeight:300, letterSpacing:-.3 }}>EVGoo Wallet</div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 12px", border:`1px solid ${autoPay?"rgba(90,158,114,0.4)":C.border}`, borderRadius:3, background:autoPay?"rgba(90,158,114,0.08)":"none", cursor:"pointer" }} onClick={()=>setAutoPay(a=>!a)}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:autoPay?C.success:C.muted, animation:autoPay?"shimmer 2s ease-in-out infinite":undefined }}/>
            <span style={{ fontFamily:UF, fontSize:9, color:autoPay?C.success:C.muted, letterSpacing:1.5, textTransform:"uppercase" }}>Auto-pay {autoPay?"on":"off"}</span>
          </div>
        </div>

        {/* Balance */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2.5, textTransform:"uppercase", marginBottom:8 }}>Available balance</p>
          <div className="gold-text" style={{ fontFamily:SF, fontSize:56, fontWeight:300, letterSpacing:-2, lineHeight:1 }}>
            ₹{balance.toLocaleString("en-IN", { minimumFractionDigits:2 })}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["₹1,087","Spent this month"],["₹429","Saved this month"],["₹150","Cashback earned"]].map(([v,l]) => (
            <div key={l} style={{ background:"rgba(0,0,0,0.25)", borderRadius:3, padding:"10px 10px" }}>
              <p style={{ fontFamily:SF, fontSize:16, fontWeight:500, color:C.gold }}>{v}</p>
              <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:.8, marginTop:3, lineHeight:1.4 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"22px 22px 48px" }}>
        {/* Add money */}
        <GoldBtn onClick={()=>setTopup(t=>!t)} style={{ marginBottom:16 }}>
          {topupOpen ? "Close" : "+ Add money to wallet"}
        </GoldBtn>

        {/* Top-up panel */}
        {topupOpen && (
          <div className="fu" style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"20px", marginBottom:20, background:C.surface, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>

            <Lbl>Select amount</Lbl>
            <div style={{ display:"flex", gap:8, marginBottom:14 }}>
              {QUICK_AMOUNTS.map(a => (
                <button key={a} onClick={()=>setTAmt(String(a))} className="press" style={{ flex:1, padding:"11px 6px", border:`1px solid ${topupAmt==a?C.gold:C.border}`, borderRadius:3, background:topupAmt==a?"rgba(212,182,120,0.08)":"none", color:topupAmt==a?C.gold:C.muted, fontFamily:UF, fontSize:12, fontWeight:500, cursor:"pointer", transition:"all .2s" }}>₹{a}</button>
              ))}
            </div>

            <div style={{ marginBottom:18 }}>
              <Lbl>Or enter custom amount</Lbl>
              <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${C.border}`, paddingBottom:10 }}>
                <span style={{ fontFamily:SF, fontSize:22, color:C.gold, marginRight:8, flexShrink:0 }}>₹</span>
                <input type="number" placeholder="0" value={topupAmt} onChange={e=>setTAmt(e.target.value)} style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:SF, fontSize:28, fontWeight:300, outline:"none" }}/>
              </div>
            </div>

            <Lbl>Pay via</Lbl>
            <div style={{ display:"flex", gap:8, marginBottom:18 }}>
              {TOPUP_METHODS.map(m => (
                <button key={m.id} onClick={()=>setTMethod(m.id)} className="press" style={{ flex:1, padding:"12px 6px", border:`1px solid ${tMethod===m.id?m.accent+"99":C.border}`, borderRadius:3, background:tMethod===m.id?`${m.accent}12`:"none", color:tMethod===m.id?m.accent:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, transition:"all .2s" }}>
                  <span style={{ fontSize:18 }}>{m.icon}</span>
                  {m.name}
                </button>
              ))}
            </div>

            <button onClick={doTopup} className="press" style={{ width:"100%", padding:"15px", border:"none", borderRadius:3, background:added?"linear-gradient(135deg,#3D7A52,#5A9E72)":"linear-gradient(110deg,#5C3A08,#C9A84C 30%,#E8D4A0 50%,#C9A84C 72%,#5C3A08)", color:added?C.cream:C.obsidian, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", opacity:topupAmt?1:.45 }}>
              {added ? "✓ Money added!" : topupAmt ? `Add ₹${Number(topupAmt).toLocaleString("en-IN")}` : "Add money"}
            </button>
          </div>
        )}

        {/* Auto-pay explainer */}
        <div style={{ display:"flex", gap:12, padding:"13px 16px", border:`1px solid ${autoPay?"rgba(90,158,114,0.3)":C.border}`, borderRadius:3, background:autoPay?"rgba(90,158,114,0.05)":C.surface, marginBottom:22, cursor:"pointer" }} onClick={()=>setAutoPay(a=>!a)}>
          <span style={{ fontSize:18 }}>⚡</span>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>Auto-pay from wallet</p>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.6 }}>Wallet balance is used first when you pay for rides. Remaining charged to your saved card or UPI.</p>
          </div>
          <div style={{ width:44, height:24, borderRadius:12, background:autoPay?C.success:C.border, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0, alignSelf:"center" }}>
            <div style={{ position:"absolute", top:3, left:autoPay?23:3, width:18, height:18, borderRadius:"50%", background:C.cream, transition:"left .2s" }}/>
          </div>
        </div>

        {/* Transaction filters */}
        <div style={{ display:"flex", gap:7, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {[["all","All"],["debit","Debits"],["credit","Refunds"],["topup","Top-ups"],["cashback","Cashback"]].map(([k,l]) => (
            <button key={k} onClick={()=>setFilter(k)} className="press" style={{ flexShrink:0, padding:"7px 13px", border:`1px solid ${filter===k?C.gold:C.border}`, borderRadius:20, background:filter===k?"rgba(212,182,120,0.07)":"none", color:filter===k?C.gold:C.muted, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
          ))}
        </div>

        {/* Transactions */}
        <Lbl>Transactions</Lbl>
        {txns.map((t,i) => (
          <div key={t.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 0", borderBottom:`1px solid ${C.border}`, animation:`fadeUp .35s ${i*.05}s both` }}>
            <div style={{ width:40, height:40, borderRadius:3, background:`${TXN_COLOR[t.type]}14`, border:`1px solid ${TXN_COLOR[t.type]}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{t.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.label}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{t.sub}</p>
              <p style={{ fontFamily:UF, fontSize:9, color:C.faint, marginTop:2, letterSpacing:.3 }}>{t.date}</p>
            </div>
            <p style={{ fontFamily:SF, fontSize:17, fontWeight:500, color:t.amount>0?C.success:C.cream, flexShrink:0 }}>
              {t.amount>0?"+":""}{t.amount<0?"−":""}{t.type==="debit"?"":""}{Math.abs(t.amount).toLocaleString("en-IN", { maximumFractionDigits:0 })}
            </p>
          </div>
        ))}
        {txns.length===0 && <p style={{ fontFamily:UF, fontSize:13, color:C.muted, textAlign:"center", padding:"32px 0" }}>No transactions in this category.</p>}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════════════ */
function Settings({ onBack, onDeleteAccount, onChangeCredential }) {
  const [lang,     setLang]    = useState("English");
  const [notifs,   setNotifs]  = useState({ rides:true, offers:true, safety:true, payments:true, updates:false });
  const [locAcc,   setLocAcc]  = useState("precise");
  const [analytics,setAna]     = useState(false);
  const [twoFA,    setTwoFA]   = useState(false);
  const [langOpen, setLangOpen]= useState(false);
  const [notifsOpen,setNOpen]  = useState(false);
  const LANGS = ["English","हिन्दी","தமிழ்","తెలుగు","ಕನ್ನಡ","বাংলা"];

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width:44, height:24, borderRadius:12, background:on?C.success:C.border, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0 }}>
      <div style={{ position:"absolute", top:3, left:on?23:3, width:18, height:18, borderRadius:"50%", background:C.cream, transition:"left .2s" }}/>
    </div>
  );

  const Row = ({ icon, label, sub, right, onClick, danger }) => (
    <div onClick={onClick} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${C.border}`, cursor:onClick?"pointer":"default" }}>
      <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${danger?"rgba(192,97,74,0.3)":C.border}`, background:danger?"rgba(192,97,74,0.08)":C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>{icon}</div>
      <div style={{ flex:1 }}>
        <p style={{ fontFamily:UF, fontSize:14, fontWeight:400, color:danger?C.danger:C.cream }}>{label}</p>
        {sub&&<p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{sub}</p>}
      </div>
      {right}
    </div>
  );

  return (
    <Screen scroll style={{ padding:"56px 22px 48px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Settings</h1>
      </div>

      {/* APP PREFERENCES */}
      <Lbl>App preferences</Lbl>

      {/* Language */}
      <Row icon="🌐" label="Language" sub={lang} right={<span style={{ color:C.border, fontSize:16 }}>›</span>} onClick={()=>setLangOpen(l=>!l)}/>
      {langOpen && (
        <div className="fu" style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:4, background:C.surface }}>
          {LANGS.map(l=>(
            <div key={l} onClick={()=>{setLang(l);setLangOpen(false);}} className="press" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom:`1px solid ${C.border}`, cursor:"pointer", background:lang===l?"rgba(212,182,120,0.05)":"none" }}>
              <span style={{ fontFamily:UF, fontSize:14, color:lang===l?C.gold:C.cream }}>{l}</span>
              {lang===l && <span style={{ color:C.gold, fontSize:14 }}>✓</span>}
            </div>
          ))}
        </div>
      )}

      {/* Notifications */}
      <Row icon="🔔" label="Notifications" sub={Object.values(notifs).filter(Boolean).length + " categories enabled"} right={<span style={{ color:C.border, fontSize:16 }}>›</span>} onClick={()=>setNOpen(n=>!n)}/>
      {notifsOpen && (
        <div className="fu" style={{ border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", marginBottom:4, background:C.surface }}>
          {Object.entries({ rides:"Ride updates", offers:"Offers & promotions", safety:"Safety alerts", payments:"Payment confirmations", updates:"App updates" }).map(([k,l]) => (
            <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 16px", borderBottom:`1px solid ${C.border}` }}>
              <p style={{ fontFamily:UF, fontSize:13, color:C.cream }}>{l}</p>
              <Toggle on={notifs[k]} onToggle={()=>setNotifs(n=>({...n,[k]:!n[k]}))}/>
            </div>
          ))}
        </div>
      )}

      {/* Location accuracy */}
      <div style={{ padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
          <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>📍</div>
          <p style={{ fontFamily:UF, fontSize:14, color:C.cream, flex:1 }}>Location accuracy</p>
        </div>
        <div style={{ display:"flex", gap:8, paddingLeft:48 }}>
          {[["precise","Precise"],["approximate","Approximate"]].map(([k,l]) => (
            <button key={k} onClick={()=>setLocAcc(k)} className="press" style={{ flex:1, padding:"10px", border:`1px solid ${locAcc===k?C.gold:C.border}`, borderRadius:3, background:locAcc===k?"rgba(212,182,120,0.07)":"none", color:locAcc===k?C.gold:C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* ACCOUNT */}
      <Lbl style={{ marginTop:24 }}>Account</Lbl>
      <Row icon="🔑" label="Change phone / email" sub="OTP-verified update" right={<span style={{ color:C.border, fontSize:16 }}>›</span>} onClick={onChangeCredential}/>
      <Row icon="🔗" label="Linked accounts" sub="Google · Facebook" right={<span style={{ color:C.border, fontSize:16 }}>›</span>}/>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>🔐</div>
          <div>
            <p style={{ fontFamily:UF, fontSize:14, color:C.cream }}>Two-factor auth</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>OTP on every login</p>
          </div>
        </div>
        <Toggle on={twoFA} onToggle={()=>setTwoFA(v=>!v)}/>
      </div>

      {/* PRIVACY */}
      <Lbl style={{ marginTop:24 }}>Privacy</Lbl>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:34, height:34, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>📊</div>
          <div>
            <p style={{ fontFamily:UF, fontSize:14, color:C.cream }}>Share analytics</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>Help improve EVGoo (anonymous)</p>
          </div>
        </div>
        <Toggle on={analytics} onToggle={()=>setAna(v=>!v)}/>
      </div>
      <Row icon="📥" label="Download my data" sub="DPDP Act 2023 — export all your data" right={<span style={{ color:C.border, fontSize:16 }}>›</span>}/>

      {/* ABOUT */}
      <Lbl style={{ marginTop:24 }}>About</Lbl>
      <Row icon="⭐" label="Rate EVGoo" sub="App Store · Play Store" right={<span style={{ color:C.border, fontSize:16 }}>›</span>}/>
      <Row icon="📄" label="Terms of Service" right={<span style={{ color:C.border, fontSize:16 }}>›</span>}/>
      <Row icon="🔒" label="Privacy Policy" right={<span style={{ color:C.border, fontSize:16 }}>›</span>}/>
      <Row icon="ℹ️" label="App version" sub="EVGoo v2.4.1 (build 241)" right={<Tag>Latest</Tag>}/>

      {/* DANGER */}
      <Lbl style={{ marginTop:24 }}>Danger zone</Lbl>
      <Row icon="🗑️" label="Delete account" sub="Permanently remove all your data" right={<span style={{ color:C.border, fontSize:16 }}>›</span>} onClick={onDeleteAccount} danger/>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   HELP & SUPPORT
══════════════════════════════════════════════════════════════ */
const FAQ = [
  { cat:"Booking", items:[
    { q:"How do I cancel a ride?", a:"Go to Live Tracking → tap 'Cancel Ride'. Free within 3 minutes; ₹50 fee applies after that." },
    { q:"Can I schedule a ride in advance?", a:"Yes — tap 'Schedule a ride' on the Home screen. You can book up to 7 days ahead with reminders." },
    { q:"How does multiple stops work?", a:"This feature is coming soon! You'll be able to add up to 3 via-points during booking." },
  ]},
  { cat:"Payments", items:[
    { q:"When am I charged for a ride?", a:"Payment is collected after the ride ends — not before. You rate your driver first, then pay." },
    { q:"How do I get a refund?", a:"Refunds for cancelled rides are processed within 3–5 business days to your original payment method, or instantly to your EVGoo Wallet." },
    { q:"How does EVGoo Wallet work?", a:"Add money to your Wallet and enable Auto-pay. Your Wallet balance is used first for each ride, with the remainder charged to your card or UPI." },
  ]},
  { cat:"EVGoo Pass", items:[
    { q:"What happens when my ride exceeds the km limit?", a:"Only the extra km beyond your plan's per-ride limit is charged at your plan's extra rate (e.g. ₹9/km on Explorer Pass)." },
    { q:"Do unused rides roll over?", a:"Unused rides and KMs do not roll over to the next month." },
    { q:"Can I switch plans mid-month?", a:"Yes. Upgrading takes effect instantly. Downgrading takes effect on your next renewal date." },
  ]},
  { cat:"Safety", items:[
    { q:"How does the SOS button work?", a:"Press and hold the SOS button during a ride. It counts down 5 seconds, then alerts your trusted contacts and shows emergency service numbers." },
    { q:"What is driver verification?", a:"Before every ride, you verify the driver by entering the last 4 digits of their plate, an OTP they share with you, and a 5-item safety checklist." },
    { q:"How do I share my ride with someone?", a:"During a ride, tap 'Share' → generate a live link → send via WhatsApp or SMS. The link expires when your ride ends." },
  ]},
  { cat:"Account", items:[
    { q:"How do I change my phone number?", a:"Go to Settings → Change password flow. For phone number change, contact support — we verify your identity first." },
    { q:"How do I delete my account?", a:"Settings → Delete account. There's a 30-day cooling period before data is permanently erased, as required by DPDP Act 2023." },
  ]},
];

function HelpSupport({ onBack }) {
  const [query,      setQuery]   = useState("");
  const [openCat,    setOpenCat] = useState(null);
  const [openQ,      setOpenQ]   = useState(null);
  const [ticket,     setTicket]  = useState("");
  const [submitted,  setSubmit]  = useState(false);
  const [activeTickets] = useState([
    { id:"TKT-4821", issue:"Refund not received", status:"In review",  date:"10 May" },
    { id:"TKT-4756", issue:"Wrong fare charged",  status:"Resolved",   date:"2 May"  },
  ]);

  const allItems = FAQ.flatMap(c => c.items.map(i => ({ ...i, cat:c.cat })));
  const results  = query.length > 1 ? allItems.filter(i => i.q.toLowerCase().includes(query.toLowerCase()) || i.a.toLowerCase().includes(query.toLowerCase())) : null;

  return (
    <Screen scroll style={{ padding:"0" }}>
      {/* Header */}
      <div style={{ padding:"52px 22px 20px", background:C.ink, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:18 }}>
          <BackBtn onClick={onBack}/>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Help & Support</h1>
        </div>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search FAQs…" value={query} onChange={e=>setQuery(e.target.value)} style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}/>
          {query && <button onClick={()=>setQuery("")} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:16 }}>✕</button>}
        </div>
      </div>

      <div style={{ padding:"22px 22px 48px" }}>

        {/* Quick actions */}
        <Lbl>Get help now</Lbl>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
          {[
            { icon:"📞", label:"Call us",       sub:"1800-EV-GOOO",  color:"#5A9E72",  accent:"rgba(90,158,114,.15)"  },
            { icon:"💬", label:"Live chat",      sub:"~2 min wait",   color:"#1A73E8",  accent:"rgba(26,115,232,.12)"  },
            { icon:"✉️", label:"Email support",  sub:"Reply < 24 hr", color:C.gold,     accent:"rgba(212,182,120,.1)"  },
            { icon:"🎫", label:"Raise a ticket", sub:"Track status",  color:"#7B2FBE",  accent:"rgba(123,47,190,.12)"  },
          ].map(({ icon, label, sub, color, accent }) => (
            <div key={label} className="press" style={{ border:`1px solid rgba(255,255,255,0.07)`, borderRadius:3, padding:"16px 14px", background:accent, cursor:"pointer" }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{icon}</div>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color }}>{label}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Active tickets */}
        {activeTickets.length > 0 && !query && (
          <>
            <Lbl>Your tickets</Lbl>
            {activeTickets.map(t => (
              <div key={t.id} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:8, cursor:"pointer" }}>
                <div style={{ width:36, height:36, borderRadius:3, background:"rgba(123,47,190,0.12)", border:"1px solid rgba(123,47,190,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🎫</div>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t.issue}</p>
                  <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{t.id} · {t.date}</p>
                </div>
                <Tag accent={t.status==="Resolved"?C.success:C.gold}>{t.status}</Tag>
              </div>
            ))}
            <div style={{ marginBottom:20 }}/>
          </>
        )}

        {/* Search results */}
        {results && (
          <>
            <Lbl>{results.length} result{results.length!==1?"s":""} for "{query}"</Lbl>
            {results.length === 0 && <p style={{ fontFamily:UF, fontSize:13, color:C.muted, paddingBottom:16 }}>No FAQs match. Try our live chat or raise a ticket.</p>}
            {results.map((r,i) => (
              <div key={i} style={{ border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                <div onClick={()=>setOpenQ(openQ===`s${i}`?null:`s${i}`)} className="press" style={{ padding:"14px 16px", background:C.surface, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                  <div>
                    <Tag>{r.cat}</Tag>
                    <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream, marginTop:8 }}>{r.q}</p>
                  </div>
                  <span style={{ color:C.border, fontSize:18, flexShrink:0, marginTop:4 }}>{openQ===`s${i}`?"▲":"▼"}</span>
                </div>
                {openQ===`s${i}` && <div style={{ padding:"0 16px 14px", fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7, background:C.surface, animation:"fadeIn .2s" }}>{r.a}</div>}
              </div>
            ))}
          </>
        )}

        {/* FAQ accordion */}
        {!results && (
          <>
            <Lbl>Frequently asked</Lbl>
            {FAQ.map(cat => (
              <div key={cat.cat} style={{ border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", marginBottom:8 }}>
                <div onClick={()=>setOpenCat(openCat===cat.cat?null:cat.cat)} className="press" style={{ padding:"15px 16px", background:C.surface, cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:600, color:C.cream }}>{cat.cat}</p>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontFamily:UF, fontSize:10, color:C.muted }}>{cat.items.length} articles</span>
                    <span style={{ color:C.border, fontSize:16 }}>{openCat===cat.cat?"▲":"▼"}</span>
                  </div>
                </div>
                {openCat===cat.cat && cat.items.map((item,i) => (
                  <div key={i} style={{ borderTop:`1px solid ${C.border}` }}>
                    <div onClick={()=>setOpenQ(openQ===`${cat.cat}${i}`?null:`${cat.cat}${i}`)} className="press" style={{ padding:"13px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10, background:C.ink }}>
                      <p style={{ fontFamily:UF, fontSize:12, fontWeight:500, color:C.cream, flex:1 }}>{item.q}</p>
                      <span style={{ color:C.border, fontSize:14, flexShrink:0 }}>{openQ===`${cat.cat}${i}`?"▲":"▼"}</span>
                    </div>
                    {openQ===`${cat.cat}${i}` && (
                      <div style={{ padding:"0 16px 14px", fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7, background:C.ink, animation:"fadeIn .2s ease" }}>{item.a}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Raise a ticket */}
        {!results && (
          <div style={{ marginTop:24, border:`1px solid ${C.border}`, borderRadius:3, padding:"18px", background:C.surface }}>
            <Lbl style={{ marginBottom:10 }}>Still need help? Raise a ticket</Lbl>
            <textarea placeholder="Describe your issue…" value={ticket} onChange={e=>setTicket(e.target.value)} style={{ width:"100%", background:C.elevated, border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 14px", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none", resize:"none", height:80, lineHeight:1.6, marginBottom:12 }}/>
            <button onClick={()=>{if(ticket){setSubmit(true);setTimeout(()=>{setSubmit(false);setTicket("");},1800);}}} className="press" style={{ width:"100%", padding:"13px", border:"none", borderRadius:3, background:submitted?"rgba(90,158,114,0.12)":submitted?"":"linear-gradient(110deg,#5C3A08,#C9A84C 35%,#E8D4A0 52%,#C9A84C 72%,#5C3A08)", color:submitted?C.success:C.obsidian, fontFamily:UF, fontSize:11, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", opacity:ticket||submitted?1:.4 }}>
              {submitted?"✓ Ticket submitted!":"Submit ticket"}
            </button>
          </div>
        )}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ACCOUNT DELETION
══════════════════════════════════════════════════════════════ */
const DEL_REASONS = [
  "I'm switching to another app",
  "I don't use EVGoo anymore",
  "Privacy concerns",
  "Too many notifications",
  "Technical issues",
  "Other",
];

function DeleteAccount({ onBack, onDeleted }) {
  const [step,      setStep]   = useState("warn");   // warn | reason | confirm | cooling | done
  const [reason,    setReason] = useState(null);
  const [typed,     setTyped]  = useState("");
  const EMAIL = "arjun.sharma@gmail.com";
  const confirmed = typed.toLowerCase() === EMAIL.toLowerCase();

  const CONSEQUENCES = [
    { icon:"🚗", text:"All ride history and receipts will be deleted" },
    { icon:"💰", text:"EVGoo Wallet balance will be forfeited" },
    { icon:"⚡", text:"Your active Pass subscription will be cancelled" },
    { icon:"🎟️", text:"Unused coupons and rewards will expire" },
    { icon:"📍", text:"Saved addresses and trusted contacts removed" },
    { icon:"💳", text:"Saved cards and UPI IDs will be unlinked" },
  ];

  if (step==="done") return (
    <Screen center style={{ padding:"0 28px" }}>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ width:80, height:80, borderRadius:3, border:`1px solid ${C.border}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 24px" }}>👋</div>
        <h1 style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:12 }}>Account scheduled for deletion</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:8 }}>Your account will be permanently deleted on <span style={{ color:C.cream, fontWeight:500 }}>17 Jun 2026</span> (30-day cooling period).</p>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:36 }}>Log back in before that date to cancel deletion. A confirmation has been sent to {EMAIL}.</p>
        <GoldBtn ghost onClick={onDeleted}>Back to login</GoldBtn>
      </div>
    </Screen>
  );

  return (
    <Screen scroll style={{ padding:"56px 24px 48px" }}>
      {/* Step pills */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <BackBtn onClick={step==="warn"?onBack:()=>setStep(s=>({reason:"warn",confirm:"reason",cooling:"confirm"}[s]||"warn"))}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:5, marginBottom:6 }}>
            {["warn","reason","confirm"].map((s,i)=>(
              <div key={s} style={{ flex:1, height:1, background:["warn","reason","confirm"].indexOf(step)>=i?C.danger:C.border, transition:"background .3s" }}/>
            ))}
          </div>
          <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>
            Step {["warn","reason","confirm"].indexOf(step)+1} of 3 — {step==="warn"?"Read carefully":step==="reason"?"Tell us why":"Final confirmation"}
          </p>
        </div>
      </div>

      {/* ── WARN ── */}
      {step==="warn" && (
        <>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ width:80, height:80, borderRadius:3, border:`1px solid rgba(192,97,74,0.4)`, background:"rgba(192,97,74,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 18px" }}>⚠️</div>
            <h1 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Delete your account?</h1>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8 }}>This is permanent and cannot be undone after the 30-day cooling period.</p>
          </div>

          {/* Consequences */}
          <Lbl>What you'll lose</Lbl>
          <div style={{ border:`1px solid rgba(192,97,74,0.25)`, borderRadius:3, overflow:"hidden", marginBottom:22, background:"rgba(192,97,74,0.04)" }}>
            {CONSEQUENCES.map((c,i,arr) => (
              <div key={c.text} style={{ display:"flex", gap:13, padding:"12px 16px", borderBottom:i<arr.length-1?`1px solid rgba(192,97,74,0.12)`:"none" }}>
                <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{c.icon}</span>
                <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.5 }}>{c.text}</p>
              </div>
            ))}
          </div>

          {/* DPDP note */}
          <div style={{ display:"flex", gap:12, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:24 }}>
            <span style={{ fontSize:15 }}>📋</span>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>Under India's <span style={{ color:C.cream }}>DPDP Act 2023</span>, you have the right to erasure. All data is purged within 30 days of confirmed deletion. Some anonymised analytics may be retained as permitted by law.</p>
          </div>

          <button onClick={()=>setStep("reason")} className="press" style={{ width:"100%", padding:"15px", background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", marginBottom:10 }}>
            Continue with deletion
          </button>
          <button onClick={onBack} className="press" style={{ width:"100%", padding:"14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
            Keep my account
          </button>
        </>
      )}

      {/* ── REASON ── */}
      {step==="reason" && (
        <>
          <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Why are you leaving?</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:24 }}>Your feedback helps us improve EVGoo for everyone.</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:28 }}>
            {DEL_REASONS.map(r => (
              <div key={r} onClick={()=>setReason(r)} className="press" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", border:`1px solid ${reason===r?"rgba(192,97,74,0.5)":C.border}`, borderRadius:3, background:reason===r?"rgba(192,97,74,0.06)":"none", cursor:"pointer", transition:"all .2s" }}>
                <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${reason===r?"rgba(192,97,74,0.7)":C.border}`, background:reason===r?"rgba(192,97,74,0.2)":"none", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>
                  {reason===r && <div style={{ width:7, height:7, borderRadius:"50%", background:C.danger }}/>}
                </div>
                <p style={{ fontFamily:UF, fontSize:14, color:reason===r?C.cream:C.muted }}>{r}</p>
              </div>
            ))}
          </div>
          <button onClick={()=>reason&&setStep("confirm")} className="press" style={{ width:"100%", padding:"15px", background:"rgba(192,97,74,0.1)", border:`1px solid rgba(192,97,74,0.4)`, borderRadius:3, color:C.danger, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", opacity:reason?1:.45 }}>
            Continue
          </button>
        </>
      )}

      {/* ── CONFIRM ── */}
      {step==="confirm" && (
        <>
          <h1 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Final confirmation</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:24 }}>
            Type your email address to confirm you want to permanently delete your EVGoo account.
          </p>
          <div style={{ marginBottom:10 }}>
            <Lbl>Your email address</Lbl>
            <div style={{ padding:"12px 0", borderBottom:`1px solid ${confirmed?C.danger:C.border}`, transition:"border-color .3s" }}>
              <input
                placeholder={EMAIL}
                value={typed}
                onChange={e=>setTyped(e.target.value)}
                style={{ width:"100%", background:"none", border:"none", color:confirmed?C.danger:C.cream, fontFamily:UF, fontSize:14, fontWeight:300, outline:"none" }}
              />
            </div>
            {typed.length>0 && !confirmed && <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:6 }}>Must match: {EMAIL}</p>}
            {confirmed && <p style={{ fontFamily:UF, fontSize:10, color:C.danger, marginTop:6 }}>✓ Email confirmed</p>}
          </div>

          <div style={{ padding:"14px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:24, marginTop:16 }}>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>
              🕐 Your account will remain active for <span style={{ color:C.cream }}>30 days</span> after confirmation. Log back in any time before <span style={{ color:C.cream }}>17 Jun 2026</span> to cancel the deletion.
            </p>
          </div>

          <button onClick={()=>confirmed&&setStep("done")} className="press" style={{ width:"100%", padding:"15px", background:confirmed?"rgba(192,97,74,0.12)":"none", border:`1px solid ${confirmed?"rgba(192,97,74,0.5)":C.border}`, borderRadius:3, color:confirmed?C.danger:C.muted, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:confirmed?"pointer":"default", transition:"all .3s", marginBottom:10 }}>
            {confirmed?"Confirm deletion":"Enter email to continue"}
          </button>
          <button onClick={onBack} className="press" style={{ width:"100%", padding:"14px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
            Cancel — keep my account
          </button>
        </>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════════════
   FINDING DRIVER SCREEN
══════════════════════════════════════════════════════════════ */
function FindDriver({ ride, onCancel, onFound }) {
  const [phase, setPhase] = useState("searching"); // searching | found | ready
  const [secs,  setSecs]  = useState(0);
  const DRIVER = { name:"Arjun S.", plate:"DL 3C 9821", vehicle:"Tata Nexon EV", rating:"4.9", trips:"6,210", eta:4 };

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (secs === 5) setPhase("found");
    if (secs === 8) { setPhase("ready"); setTimeout(onFound, 1400); }
  }, [secs]);

  const dots = ".".repeat((secs % 3) + 1).padEnd(3, " ");

  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", textAlign:"center" }}>
      <div style={{ position:"absolute", top:"28%", left:"50%", transform:"translate(-50%,-50%)", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(212,182,120,0.04) 0%,transparent 70%)", pointerEvents:"none" }}/>

      {phase === "ready" && (
        <div className="fu" style={{ width:"100%", maxWidth:360 }}>
          <div style={{ width:72, height:72, borderRadius:3, border:`1px solid rgba(90,158,114,0.5)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>✅</div>
          <p style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Driver verified!</p>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>Proceeding to ride verification…</p>
        </div>
      )}

      {phase === "found" && (
        <div className="fu" style={{ width:"100%", maxWidth:360 }}>
          <p style={{ fontFamily:UF, fontSize:10, color:C.success, letterSpacing:2.5, textTransform:"uppercase", marginBottom:24 }}>Driver found!</p>
          <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"22px", background:C.surface, position:"relative", overflow:"hidden", marginBottom:28, textAlign:"left" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
              <div style={{ width:54, height:54, borderRadius:3, background:`linear-gradient(135deg,${C.elevated},${C.surface})`, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>👨‍✈️</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:UF, fontSize:16, fontWeight:600, color:C.cream }}>{DRIVER.name}</p>
                <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3 }}>⭐ {DRIVER.rating} · {DRIVER.trips} trips</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontFamily:SF, fontSize:22, fontWeight:500, color:C.gold }}>{DRIVER.eta}</p>
                <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>min away</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <Tag gold>{DRIVER.vehicle}</Tag>
              <Tag>{DRIVER.plate}</Tag>
            </div>
          </div>
          <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7 }}>Verifying driver details automatically…</p>
        </div>
      )}

      {phase === "searching" && (
        <div style={{ width:"100%", maxWidth:360 }}>
          {/* Pulsing rings */}
          <div style={{ position:"relative", width:140, height:140, margin:"0 auto 36px" }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:i*44, height:i*44, borderRadius:"50%", border:`1px solid rgba(212,182,120,${.25-i*0.07})`, animation:`ripple ${1.4+i*.3}s ease-out ${i*.25}s infinite` }}/>
            ))}
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:64, height:64, borderRadius:3, border:`1px solid ${C.borderHi}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>🚗</div>
          </div>
          <h1 style={{ fontFamily:SF, fontSize:30, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Finding your driver{dots}</h1>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:36 }}>
            Matching you with the nearest available EV driver. Usually takes under 30 seconds.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:20, marginBottom:40 }}>
            {[["⚡","EV only"],["🛡️","Verified"],["⭐","4.5+ rated"]].map(([ic,l]) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontSize:20, marginBottom:4 }}>{ic}</div>
                <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.2, textTransform:"uppercase" }}>{l}</p>
              </div>
            ))}
          </div>
          <button onClick={onCancel} className="press" style={{ padding:"13px 32px", background:"none", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
            Cancel search
          </button>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SAFETY PREFERENCES
══════════════════════════════════════════════════════════════ */
function SafetyPrefs({ onBack }) {
  const [prefs, setPrefs] = useState({ women:false, verified:true, seatbelt:true, autoShare:false, nightVerif:true });
  const [saved, setSaved] = useState(false);
  const toggle = k => setPrefs(p => ({ ...p, [k]: !p[k] }));
  const save = () => { setSaved(true); setTimeout(() => { setSaved(false); onBack(); }, 1200); };

  const OPTS = [
    { k:"women",    icon:"🛡️", label:"Women-only driver",        desc:"Request a female driver for every ride. May increase wait time by 2–5 min." },
    { k:"verified", icon:"✅", label:"Verified drivers only",     desc:"Only match with drivers who have completed EVGoo's background check programme." },
    { k:"seatbelt", icon:"🔒", label:"Seatbelt reminder",         desc:"Receive a push notification to buckle up when your ride starts." },
    { k:"autoShare",icon:"📡", label:"Auto-share with contacts",  desc:"Automatically send your live ride link to all trusted contacts on every trip." },
    { k:"nightVerif",icon:"🌙",label:"Night ride extra check",    desc:"Require driver OTP verification for all rides booked between 10 PM and 6 AM." },
  ];

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Safety Preferences</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Applied to every ride you book</p>
        </div>
      </div>
      <div style={{ padding:"12px 16px", border:`1px solid rgba(90,158,114,0.3)`, borderRadius:3, background:"rgba(90,158,114,0.05)", marginBottom:24, display:"flex", gap:12 }}>
        <span>🛡️</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.7 }}>These preferences are saved to your account and applied automatically every time you book a ride.</p>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {OPTS.map(o => (
          <div key={o.k} style={{ border:`1px solid ${prefs[o.k] ? C.borderHi : C.border}`, borderRadius:3, padding:"16px", background:prefs[o.k] ? "rgba(212,182,120,0.03)" : C.surface, transition:"all .2s" }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:14 }}>
              <div style={{ width:38, height:38, borderRadius:3, border:`1px solid ${prefs[o.k] ? C.borderHi : C.border}`, background:prefs[o.k] ? "rgba(212,182,120,0.08)" : C.elevated, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{o.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontFamily:UF, fontSize:14, fontWeight:500, color:prefs[o.k] ? C.cream : C.muted }}>{o.label}</p>
                <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:4, lineHeight:1.6 }}>{o.desc}</p>
              </div>
              <div onClick={() => toggle(o.k)} style={{ width:44, height:24, borderRadius:12, background:prefs[o.k] ? C.success : C.border, position:"relative", cursor:"pointer", transition:"background .2s", flexShrink:0, marginTop:4 }}>
                <div style={{ position:"absolute", top:3, left:prefs[o.k] ? 23 : 3, width:18, height:18, borderRadius:"50%", background:C.cream, transition:"left .2s" }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:24 }}>
        <GoldBtn onClick={save} style={{ background:saved ? "linear-gradient(135deg,#3D7A52,#5A9E72)" : undefined }}>
          {saved ? "✓  Preferences saved" : "Save preferences"}
        </GoldBtn>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   REFERRAL PROGRAM
══════════════════════════════════════════════════════════════ */
const FRIENDS = [
  { name:"Priya S.",  joined:"8 May",  status:"first_ride", earned:100 },
  { name:"Rahul M.",  joined:"2 May",  status:"joined",     earned:0   },
  { name:"Sneha K.",  joined:"28 Apr", status:"first_ride", earned:100 },
  { name:"Vikram P.", joined:"20 Apr", status:"first_ride", earned:100 },
  { name:"Anita R.",  joined:"15 Apr", status:"joined",     earned:0   },
];
const STATUS_LABEL = { joined:"Signed up · awaiting first ride", first_ride:"First ride done ✓" };
const STATUS_COLOR = { joined:C.muted, first_ride:C.success };

function Referral({ onBack }) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState([]);
  const CODE = "ARJUN50";
  const LINK = "evgoo.app/join/arjun50";
  const totalEarned = FRIENDS.filter(f => f.status === "first_ride").length * 100;
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const share = id => setShared(s => s.includes(id) ? s : [...s, id]);

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Refer & Earn</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>₹100 credit per friend's first ride</p>
        </div>
      </div>

      {/* Hero stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:24 }}>
        {[["5","Friends joined"],["₹300","Credits earned"],["₹200","Friends saved"]].map(([v,l]) => (
          <div key={l} style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"14px 10px", background:C.surface, textAlign:"center", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
            <p style={{ fontFamily:SF, fontSize:22, fontWeight:500, color:C.gold }}>{v}</p>
            <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1, textTransform:"uppercase", marginTop:5 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Code card */}
      <Lbl>Your referral code</Lbl>
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, overflow:"hidden", marginBottom:20 }}>
        <div style={{ padding:"22px", background:C.surface, textAlign:"center", position:"relative" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
          <p style={{ fontFamily:UF, fontSize:9, color:C.goldDim, letterSpacing:2.5, textTransform:"uppercase", marginBottom:10 }}>Your code</p>
          <div className="gold-text" style={{ fontFamily:SF, fontSize:48, fontWeight:300, letterSpacing:4, lineHeight:1 }}>{CODE}</div>
          <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:10 }}>Your friend gets ₹50 off · You get ₹100 after their first ride</p>
        </div>
        <div style={{ padding:"10px 18px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontFamily:UF, fontSize:11, color:C.muted, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{LINK}</span>
          <button onClick={copy} className="press" style={{ background:"none", border:`1px solid ${copied ? "rgba(90,158,114,.5)" : C.border}`, borderRadius:3, padding:"7px 14px", color:copied ? C.success : C.gold, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", flexShrink:0, marginLeft:10 }}>
            {copied ? "✓ Copied" : "Copy link"}
          </button>
        </div>
      </div>

      {/* Share channels */}
      <Lbl>Share via</Lbl>
      <div style={{ display:"flex", gap:8, marginBottom:24 }}>
        {[["whatsapp","💬","WhatsApp","#25D366"],["sms","📱","SMS","#4A90E2"],["email","✉️","Email","#EA4335"],["more","⋯","More","#888"]].map(([id,ic,nm,col]) => (
          <button key={id} onClick={() => share(id)} className="press" style={{ flex:1, padding:"13px 6px", border:`1px solid ${shared.includes(id) ? col+"66" : C.border}`, borderRadius:3, background:shared.includes(id) ? `${col}12` : "none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
            <span style={{ fontSize:20 }}>{ic}</span>
            <span style={{ fontFamily:UF, fontSize:9, color:shared.includes(id) ? col : C.muted, letterSpacing:1, textTransform:"uppercase" }}>{nm}</span>
            {shared.includes(id) && <span style={{ fontFamily:UF, fontSize:8, color:col }}>✓ Sent</span>}
          </button>
        ))}
      </div>

      {/* Friends list */}
      <Lbl>{FRIENDS.length} friends joined</Lbl>
      {FRIENDS.map((f, i) => (
        <div key={f.name} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 0", borderBottom:`1px solid ${C.border}`, animation:`fadeUp .35s ${i*.06}s both` }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:14, color:C.gold, flexShrink:0 }}>
            {f.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div style={{ flex:1 }}>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{f.name}</p>
            <p style={{ fontFamily:UF, fontSize:10, color:STATUS_COLOR[f.status], marginTop:2 }}>{STATUS_LABEL[f.status]}</p>
          </div>
          <p style={{ fontFamily:UF, fontSize:12, fontWeight:600, color:f.earned > 0 ? C.success : C.muted }}>
            {f.earned > 0 ? `+₹${f.earned}` : "Pending"}
          </p>
        </div>
      ))}

      {/* How it works */}
      <div style={{ marginTop:24, border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", background:C.surface }}>
        <div style={{ padding:"13px 16px", borderBottom:`1px solid ${C.border}` }}><Lbl style={{ margin:0 }}>How it works</Lbl></div>
        {[["1","Share your code","Friend signs up with your code — they get ₹50 off their first ride"],["2","They ride","Your friend completes their first EVGoo ride"],["3","You earn","₹100 is credited to your EVGoo Wallet automatically"]].map(([num,t,d]) => (
          <div key={num} style={{ display:"flex", gap:14, padding:"13px 16px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:22, height:22, borderRadius:4, border:`1px solid ${C.borderHi}`, background:"rgba(212,182,120,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:13, color:C.gold, flexShrink:0 }}>{num}</div>
            <div><p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t}</p><p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.5 }}>{d}</p></div>
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SURGE PRICING DETAIL
══════════════════════════════════════════════════════════════ */
function Surge({ onBack }) {
  const TIMES = [{ t:"6 AM",v:20 },{ t:"8 AM",v:90 },{ t:"10 AM",v:55 },{ t:"12 PM",v:40 },{ t:"2 PM",v:35 },{ t:"4 PM",v:50 },{ t:"6 PM",v:100 },{ t:"8 PM",v:75 },{ t:"10 PM",v:45 }];
  const CURRENT = 70;
  const MAX_H = 60;

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Demand & Pricing</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Connaught Place, New Delhi · Right now</p>
        </div>
      </div>

      {/* Current demand gauge */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"22px", background:C.surface, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
          <div>
            <Tag accent={C.danger}>⚡ High demand</Tag>
            <p style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, marginTop:10, letterSpacing:-.3 }}>1.4× surge</p>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:4 }}>Fares are 40% higher than normal</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ fontFamily:UF, fontSize:11, color:C.muted }}>Wait to save</p>
            <p style={{ fontFamily:SF, fontSize:24, fontWeight:500, color:C.success, marginTop:4 }}>₹45</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>on EV Cab (~12 min)</p>
          </div>
        </div>
        {/* Demand bar */}
        <div style={{ height:6, borderRadius:3, background:C.border, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${CURRENT}%`, background:`linear-gradient(90deg,${C.success},${C.gold},${C.danger})`, borderRadius:3 }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
          <span style={{ fontFamily:UF, fontSize:9, color:C.muted }}>Low</span>
          <span style={{ fontFamily:UF, fontSize:9, color:C.gold, fontWeight:500 }}>Current: {CURRENT}%</span>
          <span style={{ fontFamily:UF, fontSize:9, color:C.muted }}>Peak</span>
        </div>
      </div>

      {/* Current vehicle fares */}
      <Lbl>Current fares with surge</Lbl>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
        {[["🛵","EV Moto","₹89","₹64",2],["🛺","EV Auto","₹189","₹135",4],["🚗","EV Cab","₹349","₹249",6],["🚙","EV Prime","₹549","₹392",9]].map(([g,n,surge,normal,eta]) => (
          <div key={n} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface }}>
            <span style={{ fontSize:22, flexShrink:0 }}>{g}</span>
            <div style={{ flex:1 }}>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{n}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>ETA {eta} min</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontFamily:SF, fontSize:18, fontWeight:500, color:C.cream }}>{surge}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.success, textDecoration:"line-through", marginTop:1 }}>{normal} normal</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demand chart */}
      <Lbl>Today's demand — Connaught Place</Lbl>
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"16px", background:C.surface, marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:MAX_H + 20, marginBottom:8 }}>
          {TIMES.map(({ t, v }) => {
            const h = Math.round(v / 100 * MAX_H);
            const isCurrent = t === "6 PM";
            return (
              <div key={t} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:"100%", height:h, borderRadius:"2px 2px 0 0", background:isCurrent ? `linear-gradient(180deg,${C.danger},${C.gold})` : `rgba(212,182,120,${v/100*.5+.1})`, position:"relative" }}>
                  {isCurrent && <div style={{ position:"absolute", top:-6, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:C.danger }}/>}
                </div>
                <p style={{ fontFamily:UF, fontSize:7, color:isCurrent ? C.gold : C.faint, letterSpacing:.5, textAlign:"center", whiteSpace:"nowrap" }}>{t}</p>
              </div>
            );
          })}
        </div>
        <p style={{ fontFamily:UF, fontSize:10, color:C.muted, textAlign:"center" }}>Peak demand: 6 PM · Best time to book: after 9 PM</p>
      </div>

      <div style={{ padding:"14px 16px", border:`1px solid rgba(90,158,114,0.3)`, borderRadius:3, background:"rgba(90,158,114,0.05)", display:"flex", gap:12 }}>
        <span style={{ fontSize:18 }}>💡</span>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7 }}>Surge pricing ensures more drivers come online during peak hours, reducing your wait time. EVGoo Pass members are <span style={{ color:C.cream }}>always protected from surge</span>.</p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   LOST & FOUND
══════════════════════════════════════════════════════════════ */
const ITEM_CATS = [["👜","Bag"],["📱","Phone"],["🔑","Keys"],["💳","Wallet"],["📖","Documents"],["👓","Glasses"],["🎧","Earphones"],["❓","Other"]];

function LostFound({ onBack, ride }) {
  const [step,   setStep]   = useState("report"); // report | submitted | tracking
  const [cat,    setCat]    = useState(null);
  const [desc,   setDesc]   = useState("");
  const [contact,setContact]= useState("");
  const REF = "LF-" + Math.floor(10000+Math.random()*89999);

  const submit = () => { if(!cat||!desc) return; setStep("submitted"); setTimeout(()=>setStep("tracking"),1500); };

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Lost & Found</h1>
      </div>

      {step==="submitted" && (
        <div style={{ textAlign:"center", paddingTop:40 }}>
          <div style={{ width:56, height:56, borderRadius:"50%", border:`1.5px solid ${C.border}`, borderTop:`1.5px solid ${C.gold}`, animation:"spin .9s linear infinite", margin:"0 auto 24px" }}/>
          <p style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream }}>Contacting driver…</p>
        </div>
      )}

      {step==="tracking" && (
        <div className="fu">
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ width:72, height:72, borderRadius:3, border:`1px solid rgba(90,158,114,0.4)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px" }}>🔍</div>
            <h2 style={{ fontFamily:SF, fontSize:26, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Report submitted</h2>
            <p style={{ fontFamily:UF, fontSize:13, color:C.muted, marginTop:8, lineHeight:1.7 }}>Reference: <span style={{ color:C.gold, fontWeight:500 }}>{REF}</span></p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[["🚗","Driver notified","Arjun S. has been sent your lost item description","In progress"],["📞","Driver contact","Driver will call you within 30 minutes","Pending"],["🏢","EVGoo support","If not resolved, support team will escalate","Standby"]].map(([ic,t,d,s]) => (
              <div key={t} style={{ display:"flex", gap:12, padding:"13px 14px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface }}>
                <span style={{ fontSize:18, flexShrink:0, marginTop:2 }}>{ic}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{t}</p>
                  <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:2, lineHeight:1.5 }}>{d}</p>
                </div>
                <Tag accent={s==="In progress"?C.gold:s==="Pending"?C.muted:C.faint}>{s}</Tag>
              </div>
            ))}
          </div>
          <div style={{ marginTop:24 }}><GoldBtn ghost onClick={onBack}>Back to history</GoldBtn></div>
        </div>
      )}

      {step==="report" && (
        <>
          {/* Last ride context */}
          <div style={{ display:"flex", gap:12, padding:"13px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:24 }}>
            <span style={{ fontSize:18 }}>🚗</span>
            <div>
              <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{ride?.driver||"Arjun S."} · {ride?.plate||"DL 3C 9821"}</p>
              <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>Last ride · {ride?.type||"EV Cab"} · Today</p>
            </div>
          </div>
          <Lbl>What did you lose?</Lbl>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:20 }}>
            {ITEM_CATS.map(([ic,nm]) => (
              <button key={nm} onClick={()=>setCat(nm)} className="press" style={{ padding:"12px 6px", border:`1px solid ${cat===nm?C.gold:C.border}`, borderRadius:3, background:cat===nm?"rgba(212,182,120,0.08)":"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:22 }}>{ic}</span>
                <span style={{ fontFamily:UF, fontSize:9, color:cat===nm?C.gold:C.muted, letterSpacing:.8 }}>{nm}</span>
              </button>
            ))}
          </div>
          <LuxInput label="Describe the item" placeholder="Colour, brand, any identifying details…" value={desc} onChange={e=>setDesc(e.target.value)}/>
          <LuxInput label="Your contact number" placeholder="In case driver needs to reach you" type="tel" prefix="🇮🇳  +91" value={contact} onChange={e=>setContact(e.target.value.slice(0,10))}/>
          <GoldBtn onClick={submit} style={{ marginTop:8, opacity:cat&&desc?1:.45 }}>Submit lost item report</GoldBtn>
          <p style={{ fontFamily:UF, fontSize:10, color:C.faint, textAlign:"center", marginTop:14, lineHeight:1.7 }}>Drivers have 4 hours to respond. Items unclaimed after 7 days are donated to charity.</p>
        </>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   DISPUTE A CHARGE
══════════════════════════════════════════════════════════════ */
function Dispute({ onBack, ride }) {
  const [reason, setReason] = useState(null);
  const [amount, setAmount] = useState("");
  const [note,   setNote]   = useState("");
  const [done,   setDone]   = useState(false);
  const REF = "DSP-" + Math.floor(10000+Math.random()*89999);
  const REASONS = [
    { k:"fare",   label:"Wrong fare charged",     desc:"Final fare doesn't match the estimate or distance" },
    { k:"route",  label:"Route deviation",         desc:"Driver took a longer or incorrect route" },
    { k:"wait",   label:"Excessive waiting charge",desc:"Charged for waiting time that wasn't agreed" },
    { k:"toll",   label:"Unauthorised toll",       desc:"Toll added without passing through one" },
    { k:"cancel", label:"Cancelled but charged",   desc:"Charged for a ride that was cancelled" },
    { k:"other",  label:"Other",                   desc:"Something else is wrong with this charge" },
  ];

  const submit = () => { if(!reason) return; setDone(true); };

  if (done) return (
    <Screen center style={{ padding:"0 28px" }}>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:3, border:`1px solid rgba(90,158,114,0.4)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>📋</div>
        <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Dispute raised</h2>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:8 }}>Reference: <span style={{ color:C.gold, fontWeight:500 }}>{REF}</span></p>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:36 }}>Our team will review and respond within 24–48 hours. If resolved in your favour, the refund goes to your EVGoo Wallet instantly.</p>
        <GoldBtn onClick={onBack}>Back to receipt</GoldBtn>
      </div>
    </Screen>
  );

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Dispute a Charge</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>We'll review and refund within 24–48 hr</p>
        </div>
      </div>
      {/* Ride context */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"14px 16px", background:C.surface, marginBottom:24, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.4 }}/>
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{ride?.type||"EV Cab"} · {ride?.driver||"Arjun S."}</p>
            <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Today · Connaught Pl → Cyber Hub</p>
          </div>
          <p style={{ fontFamily:SF, fontSize:22, fontWeight:500, color:C.gold }}>₹{ride?.fare||349}</p>
        </div>
      </div>
      <Lbl>What's the issue?</Lbl>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:20 }}>
        {REASONS.map(r => (
          <div key={r.k} onClick={()=>setReason(r.k)} className="press" style={{ display:"flex", alignItems:"flex-start", gap:14, padding:"14px 16px", border:`1px solid ${reason===r.k?C.gold:C.border}`, borderRadius:3, background:reason===r.k?"rgba(212,182,120,0.05)":"none", cursor:"pointer", transition:"all .2s" }}>
            <div style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${reason===r.k?C.gold:C.border}`, background:reason===r.k?C.gold:"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2, transition:"all .2s" }}>
              {reason===r.k && <div style={{ width:7, height:7, borderRadius:"50%", background:C.obsidian }}/>}
            </div>
            <div>
              <p style={{ fontFamily:UF, fontSize:14, color:reason===r.k?C.cream:C.muted }}>{r.label}</p>
              <p style={{ fontFamily:UF, fontSize:11, color:C.muted, marginTop:3, lineHeight:1.4 }}>{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <LuxInput label="Amount you're disputing (optional)" placeholder="Leave blank for full fare" type="number" value={amount} onChange={e=>setAmount(e.target.value)}/>
      <div style={{ marginBottom:20 }}>
        <Lbl>Additional notes (optional)</Lbl>
        <textarea placeholder="Any extra details to help us investigate…" value={note} onChange={e=>setNote(e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 14px", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none", resize:"none", height:72, lineHeight:1.6 }}/>
      </div>
      <GoldBtn onClick={submit} style={{ opacity:reason?1:.45 }}>Submit dispute</GoldBtn>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   REPORT DRIVER
══════════════════════════════════════════════════════════════ */
function ReportDriver({ onBack, ride }) {
  const [cat,      setCat]    = useState(null);
  const [severity, setSev]    = useState("medium");
  const [desc,     setDesc]   = useState("");
  const [done,     setDone]   = useState(false);
  const REF = "RPT-" + Math.floor(10000+Math.random()*89999);
  const CATS = [
    { k:"rash",   icon:"🚨", label:"Rash / dangerous driving"  },
    { k:"route",  icon:"🗺️", label:"Wrong route / deviation"   },
    { k:"harass", icon:"⚠️", label:"Harassment or misconduct"  },
    { k:"phone",  icon:"📱", label:"Phone usage while driving"  },
    { k:"vehicle",icon:"🔧", label:"Poor vehicle condition"     },
    { k:"other",  icon:"❓", label:"Other concern"              },
  ];
  const submit = () => { if(!cat||!desc) return; setDone(true); };

  if (done) return (
    <Screen center style={{ padding:"0 28px" }}>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:3, border:`1px solid rgba(192,97,74,0.4)`, background:"rgba(192,97,74,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, margin:"0 auto 20px" }}>🚨</div>
        <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>Report submitted</h2>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:8 }}>Reference: <span style={{ color:C.gold, fontWeight:500 }}>{REF}</span></p>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.7, marginBottom:36 }}>Our safety team reviews all reports within 12 hours. Serious incidents are escalated immediately. Thank you for keeping EVGoo safe.</p>
        <GoldBtn onClick={onBack}>Back to home</GoldBtn>
      </div>
    </Screen>
  );

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Report Driver</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Reviewed by safety team within 12 hours</p>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, padding:"12px 14px", border:`1px solid rgba(192,97,74,0.25)`, borderRadius:3, background:"rgba(192,97,74,0.05)", marginBottom:22 }}>
        <span>⚠️</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.6 }}>If you're in immediate danger, use the SOS button. All reports are kept strictly confidential.</p>
      </div>
      {/* Driver card */}
      <div style={{ display:"flex", gap:12, padding:"13px 14px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, marginBottom:22 }}>
        <div style={{ width:40, height:40, borderRadius:3, background:C.elevated, border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>👨‍✈️</div>
        <div>
          <p style={{ fontFamily:UF, fontSize:13, fontWeight:500, color:C.cream }}>{ride?.driver||"Arjun S."} · {ride?.plate||"DL 3C 9821"}</p>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:2 }}>{ride?.type||"EV Cab"} · Today's ride</p>
        </div>
      </div>
      <Lbl>Type of incident</Lbl>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:20 }}>
        {CATS.map(c => (
          <button key={c.k} onClick={()=>setCat(c.k)} className="press" style={{ padding:"13px", border:`1px solid ${cat===c.k?"rgba(192,97,74,0.5)":C.border}`, borderRadius:3, background:cat===c.k?"rgba(192,97,74,0.08)":"none", cursor:"pointer", display:"flex", alignItems:"center", gap:10, textAlign:"left", transition:"all .2s" }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{c.icon}</span>
            <p style={{ fontFamily:UF, fontSize:12, color:cat===c.k?C.cream:C.muted, lineHeight:1.3 }}>{c.label}</p>
          </button>
        ))}
      </div>
      <Lbl>Severity</Lbl>
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {[["low","Minor"],["medium","Moderate"],["high","Serious"]].map(([k,l]) => (
          <button key={k} onClick={()=>setSev(k)} className="press" style={{ flex:1, padding:"11px", border:`1px solid ${severity===k?(k==="high"?"rgba(192,97,74,0.6)":C.gold):C.border}`, borderRadius:3, background:severity===k?(k==="high"?"rgba(192,97,74,0.08)":"rgba(212,182,120,0.06)"):"none", color:severity===k?(k==="high"?C.danger:C.gold):C.muted, fontFamily:UF, fontSize:10, letterSpacing:1.2, textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}>{l}</button>
        ))}
      </div>
      <div style={{ marginBottom:20 }}>
        <Lbl>Describe what happened</Lbl>
        <textarea placeholder="Please provide as much detail as possible…" value={desc} onChange={e=>setDesc(e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 14px", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none", resize:"none", height:96, lineHeight:1.6 }}/>
      </div>
      <GoldBtn onClick={submit} style={{ opacity:cat&&desc?1:.45 }}>Submit report</GoldBtn>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   MULTIPLE STOPS
══════════════════════════════════════════════════════════════ */
function MultiStop({ onBack, onConfirm, route }) {
  const [stops, setStops] = useState([{ id:1, val:"" },{ id:2, val:"" }]);
  const addStop = () => { if(stops.length < 3) setStops(s=>[...s,{ id:Date.now(),val:"" }]); };
  const removeStop = id => setStops(s=>s.filter(x=>x.id!==id));
  const updateStop = (id,val) => setStops(s=>s.map(x=>x.id===id?{...x,val}:x));
  const hasStops = stops.some(s=>s.val.trim());

  const SUGGESTIONS = ["Sector 62, Noida","Cyber Hub, Gurugram","Connaught Place","Hauz Khas","Saket"];
  const [activeSug, setActiveSug] = useState(null);

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Multiple Stops</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Add up to 3 stops along your route</p>
        </div>
      </div>

      {/* Route visual */}
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, overflow:"hidden", marginBottom:22 }}>
        {/* Pickup */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <div style={{ width:10, height:10, borderRadius:"50%", background:C.gold }}/>
            {stops.map(() => <div key={Math.random()} style={{ width:1.5, height:14, background:C.border }}/>)}
          </div>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>{(route?.pickup||"Connaught Place").split(",")[0]}</p>
        </div>

        {/* Stops */}
        {stops.map((stop,i) => (
          <div key={stop.id} style={{ borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 16px", background:C.ink }}>
              <div style={{ width:10, height:10, borderRadius:2, background:`rgba(201,168,76,0.6)`, flexShrink:0 }}/>
              <input
                placeholder={`Via stop ${i+1}…`}
                value={stop.val}
                onChange={e=>updateStop(stop.id,e.target.value)}
                onFocus={()=>setActiveSug(stop.id)}
                onBlur={()=>setTimeout(()=>setActiveSug(null),200)}
                style={{ flex:1, background:"none", border:"none", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none" }}
              />
              {stop.val && <button onClick={()=>updateStop(stop.id,"")} style={{ background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer" }}>✕</button>}
              {stops.length>1 && <button onClick={()=>removeStop(stop.id)} style={{ background:"none", border:"none", color:C.danger, fontSize:14, cursor:"pointer", padding:"0 4px" }}>−</button>}
            </div>
            {activeSug===stop.id && (
              <div style={{ background:C.surface }}>
                {SUGGESTIONS.filter(s=>!stop.val||s.toLowerCase().includes(stop.val.toLowerCase())).slice(0,3).map(s=>(
                  <div key={s} onClick={()=>updateStop(stop.id,s)} style={{ padding:"10px 38px", fontFamily:UF, fontSize:12, color:C.muted, borderTop:`1px solid ${C.border}`, cursor:"pointer" }}>{s}</div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Drop */}
        <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:C.surface }}>
          <div style={{ width:10, height:10, borderRadius:1, background:C.danger, flexShrink:0 }}/>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted }}>{(route?.drop||"IGI Airport").split("—")[0].trim()}</p>
        </div>
      </div>

      {/* Add stop */}
      {stops.length < 3 && (
        <button onClick={addStop} className="press" style={{ width:"100%", padding:"13px", background:"none", border:`1px dashed ${C.border}`, borderRadius:3, color:C.goldDim, fontFamily:UF, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", marginBottom:22, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          ➕ Add another stop ({3-stops.length} remaining)
        </button>
      )}

      {/* Fare estimate */}
      {hasStops && (
        <div className="fu" style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 16px", background:C.surface, marginBottom:22 }}>
          <Lbl>Estimated fare with stops</Lbl>
          {[["Base route","₹349"],[`${stops.filter(s=>s.val).length} via stop${stops.filter(s=>s.val).length>1?"s":""}`,`+₹${stops.filter(s=>s.val).length*45}`],["Total estimate","₹"+(349+stops.filter(s=>s.val).length*45)]].map(([k,v],i,arr) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none" }}>
              <span style={{ fontFamily:UF, fontSize:12, color:C.muted }}>{k}</span>
              <span style={{ fontFamily:UF, fontSize:12, color:i===arr.length-1?C.gold:C.cream, fontWeight:i===arr.length-1?600:400 }}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <GoldBtn onClick={onConfirm}>Confirm stops & book →</GoldBtn>
      <p style={{ fontFamily:UF, fontSize:10, color:C.faint, textAlign:"center", marginTop:14 }}>Stops add ~₹45 each to your fare. Driver follows the order shown.</p>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   SPLIT FARE
══════════════════════════════════════════════════════════════ */
function SplitFare({ onBack, ride }) {
  const [people, setPeople]  = useState([{ id:1, name:"", upi:"", status:"pending" }]);
  const [sent,   setSent]    = useState({});
  const total = ride?.fare||349;
  const perPerson = Math.round(total / (people.length+1));
  const add = () => { if(people.length<5) setPeople(p=>[...p,{ id:Date.now(),name:"",upi:"",status:"pending" }]); };
  const remove = id => setPeople(p=>p.filter(x=>x.id!==id));
  const update = (id,field,val) => setPeople(p=>p.map(x=>x.id===id?{...x,[field]:val}:x));
  const sendReq = id => setSent(s=>({ ...s,[id]:"sent" }));

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Split Fare</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Request your share from co-passengers</p>
        </div>
      </div>

      {/* Total + per person */}
      <div style={{ border:`1px solid ${C.borderHi}`, borderRadius:3, padding:"20px", background:C.surface, marginBottom:24, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${C.gold},transparent)`, opacity:.5 }}/>
        <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2.5, textTransform:"uppercase", marginBottom:8 }}>Total fare</p>
        <p style={{ fontFamily:SF, fontSize:40, fontWeight:300, color:C.gold, lineHeight:1, marginBottom:10 }}>₹{total}</p>
        <div style={{ display:"flex", justifyContent:"center", gap:20 }}>
          <div><p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>You pay</p><p style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:C.success, marginTop:3 }}>₹{perPerson}</p></div>
          <div style={{ width:1, background:C.border }}/>
          <div><p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>Each person</p><p style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:C.cream, marginTop:3 }}>₹{perPerson}</p></div>
          <div style={{ width:1, background:C.border }}/>
          <div><p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>Split {people.length+1} ways</p><p style={{ fontFamily:UF, fontSize:12, color:C.muted, marginTop:5 }}>{people.length+1} people</p></div>
        </div>
      </div>

      <Lbl>Add co-passengers</Lbl>
      {people.map((p,i) => (
        <div key={p.id} style={{ border:`1px solid ${sent[p.id]?"rgba(90,158,114,0.3)":C.border}`, borderRadius:3, padding:"14px 16px", background:sent[p.id]?"rgba(90,158,114,0.04)":C.surface, marginBottom:10 }}>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"rgba(212,182,120,0.1)", border:`1px solid ${C.borderHi}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:SF, fontSize:14, color:C.gold, flexShrink:0 }}>{i+2}</div>
            <input placeholder="Name" value={p.name} onChange={e=>update(p.id,"name",e.target.value)} style={{ flex:1, background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"6px 0", color:C.cream, fontFamily:UF, fontSize:13, outline:"none" }}/>
            {people.length>1&&<button onClick={()=>remove(p.id)} style={{ background:"none", border:"none", color:C.danger, cursor:"pointer", fontSize:16, flexShrink:0 }}>✕</button>}
          </div>
          <input placeholder="UPI ID (e.g. name@okicici)" value={p.upi} onChange={e=>update(p.id,"upi",e.target.value)} style={{ width:"100%", background:"none", border:"none", borderBottom:`1px solid ${C.border}`, padding:"8px 0", color:C.cream, fontFamily:UF, fontSize:13, outline:"none", marginBottom:12 }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p style={{ fontFamily:SF, fontSize:16, fontWeight:500, color:C.gold }}>₹{perPerson}</p>
            <button onClick={()=>sendReq(p.id)} disabled={!p.upi} className="press" style={{ padding:"8px 18px", background:sent[p.id]?"rgba(90,158,114,0.12)":"none", border:`1px solid ${sent[p.id]?"rgba(90,158,114,0.4)":C.borderHi}`, borderRadius:3, color:sent[p.id]?C.success:C.gold, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:p.upi?"pointer":"default", opacity:p.upi?1:.5 }}>
              {sent[p.id]?"✓ Request sent":"Send request"}
            </button>
          </div>
        </div>
      ))}

      {people.length<5&&<button onClick={add} className="press" style={{ width:"100%", padding:"12px", background:"none", border:`1px dashed ${C.border}`, borderRadius:3, color:C.goldDim, fontFamily:UF, fontSize:10, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer", marginBottom:22, marginTop:4 }}>➕ Add another person</button>}

      <div style={{ padding:"12px 16px", border:`1px solid ${C.border}`, borderRadius:3, background:C.surface, display:"flex", gap:12 }}>
        <span>ℹ️</span>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, lineHeight:1.6 }}>Requests are sent via UPI. Receipts are auto-shared once payment is confirmed. You pay your share regardless.</p>
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   CARBON / ECO DASHBOARD
══════════════════════════════════════════════════════════════ */
const MONTHLY = [
  { m:"Dec", km:180 },{ m:"Jan", km:240 },{ m:"Feb", km:195 },
  { m:"Mar", km:320 },{ m:"Apr", km:290 },{ m:"May", km:198 },
];
const BADGES = [
  { icon:"🌱", label:"First green ride",     earned:true  },
  { icon:"🌳", label:"10 rides taken",        earned:true  },
  { icon:"🌲", label:"100 km EV travelled",   earned:true  },
  { icon:"🏆", label:"CO₂ champion",          earned:true  },
  { icon:"⚡", label:"500 km milestone",      earned:false },
  { icon:"🌍", label:"1 tonne CO₂ saved",     earned:false },
];

function EcoDash({ onBack }) {
  const totalKm   = MONTHLY.reduce((s,m)=>s+m.km,0);
  const co2Saved  = (totalKm * 0.12).toFixed(1);  // 120g/km saved vs petrol
  const trees     = Math.round(co2Saved / 21);
  const maxKm     = Math.max(...MONTHLY.map(m=>m.km));
  const [shared, setShared] = useState(false);

  return (
    <Screen scroll style={{ padding:"56px 22px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={onBack}/>
        <div>
          <h1 style={{ fontFamily:SF, fontSize:22, fontWeight:300, color:C.cream, letterSpacing:-.3 }}>Your Eco Impact</h1>
          <p style={{ fontFamily:UF, fontSize:10, color:C.muted, marginTop:3 }}>Lifetime · All EVGoo rides</p>
        </div>
      </div>

      {/* Hero CO₂ */}
      <div style={{ border:`1px solid rgba(90,158,114,0.4)`, borderRadius:3, padding:"28px", background:"rgba(90,158,114,0.05)", textAlign:"center", marginBottom:20, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,#5A9E72,transparent)", opacity:.6 }}/>
        <p style={{ fontFamily:UF, fontSize:9, color:"rgba(90,158,114,0.7)", letterSpacing:2.5, textTransform:"uppercase", marginBottom:12 }}>Total CO₂ saved</p>
        <div style={{ fontFamily:SF, fontSize:64, fontWeight:300, color:C.success, lineHeight:1, marginBottom:8 }}>{co2Saved}<span style={{ fontSize:24, marginLeft:4 }}>kg</span></div>
        <p style={{ fontFamily:UF, fontSize:12, color:C.muted }}>vs travelling the same distance in a petrol car</p>
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
          <Tag accent={C.success}>🌳 = {trees} trees planted</Tag>
          <Tag accent={C.success}>🛣️ {totalKm} km EV ridden</Tag>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:22 }}>
        {[["🚗","47","Total rides"],["⚡","100%","All electric"],["🌍","0 g","Tailpipe emission"],["🏅","Gold","Member tier"]].map(([ic,v,l]) => (
          <div key={l} style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"14px 12px", background:C.surface, textAlign:"center" }}>
            <div style={{ fontSize:18, marginBottom:6 }}>{ic}</div>
            <p style={{ fontFamily:SF, fontSize:20, fontWeight:500, color:C.gold }}>{v}</p>
            <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:1.2, textTransform:"uppercase", marginTop:4 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      <Lbl>Monthly km ridden (last 6 months)</Lbl>
      <div style={{ border:`1px solid ${C.border}`, borderRadius:3, padding:"18px", background:C.surface, marginBottom:22 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:80 }}>
          {MONTHLY.map(({ m, km }, i) => {
            const h = Math.round(km / maxKm * 70);
            const isCurrent = i === MONTHLY.length - 1;
            return (
              <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <p style={{ fontFamily:UF, fontSize:8, color:isCurrent?C.gold:C.muted }}>{km}</p>
                <div style={{ width:"100%", height:h, borderRadius:"2px 2px 0 0", background:isCurrent?`linear-gradient(180deg,${C.success},rgba(90,158,114,0.4))`:`rgba(90,158,114,${km/maxKm*.5+.1})` }}/>
                <p style={{ fontFamily:UF, fontSize:8, color:isCurrent?C.gold:C.faint }}>{m}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <Lbl>Eco achievements</Lbl>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
        {BADGES.map(b => (
          <div key={b.label} style={{ border:`1px solid ${b.earned?"rgba(90,158,114,0.3)":C.border}`, borderRadius:3, padding:"14px 8px", background:b.earned?"rgba(90,158,114,0.06)":C.surface, textAlign:"center", opacity:b.earned?1:.5 }}>
            <div style={{ fontSize:28, marginBottom:6 }}>{b.icon}</div>
            <p style={{ fontFamily:UF, fontSize:9, color:b.earned?C.success:C.muted, letterSpacing:.8, lineHeight:1.4 }}>{b.label}</p>
          </div>
        ))}
      </div>

      {/* Share */}
      <button onClick={()=>setShared(true)} className="press" style={{ width:"100%", padding:"15px", background:shared?"rgba(90,158,114,0.1)":"none", border:`1px solid ${shared?"rgba(90,158,114,0.4)":C.borderHi}`, borderRadius:3, color:shared?C.success:C.gold, fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer" }}>
        {shared?"✓ Shared to WhatsApp":"🌱 Share your impact"}
      </button>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   RATE THE APP
══════════════════════════════════════════════════════════════ */
function RateApp({ onBack }) {
  const [stars,    setStars]   = useState(0);
  const [hover,    setHover]   = useState(0);
  const [feedback, setFeedback]= useState("");
  const [done,     setDone]    = useState(false);
  const [neverAsk, setNeverAsk]= useState(false);

  const submit = () => setDone(true);

  if (done) return (
    <Screen center style={{ padding:"0 28px" }}>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ fontFamily:SF, fontSize:64, color:C.gold, lineHeight:1, marginBottom:16 }}>★</div>
        <h1 style={{ fontFamily:SF, fontSize:32, fontWeight:300, color:C.cream, letterSpacing:-.5, marginBottom:10 }}>{stars>=4?"Thank you!":"Feedback received"}</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:32 }}>{stars>=4?"Your rating helps other riders find EVGoo. You're amazing 🙌":"Your feedback helps us improve. We'll work on it!"}</p>
        <GoldBtn onClick={onBack}>Done</GoldBtn>
      </div>
    </Screen>
  );

  return (
    <Screen center style={{ padding:"0 28px" }}>
      <div className="fu" style={{ width:"100%", maxWidth:360, margin:"0 auto", textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:3, border:`1px solid ${C.borderHi}`, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 20px" }}>⚡</div>
        <h1 style={{ fontFamily:SF, fontSize:30, fontWeight:300, color:C.cream, letterSpacing:-.4, marginBottom:8 }}>Enjoying EVGoo?</h1>
        <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:28 }}>Your rating takes 5 seconds and helps thousands of riders discover EVGoo.</p>

        {/* Stars */}
        <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:8 }}>
          {[1,2,3,4,5].map(n=>(
            <span key={n} onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)} onClick={()=>setStars(n)}
              style={{ fontSize:40, cursor:"pointer", filter:n<=(hover||stars)?"none":"grayscale(1) opacity(.2)", transition:"filter .1s, transform .1s", transform:n<=(hover||stars)?"scale(1.15)":"scale(1)" }}>⭐</span>
          ))}
        </div>
        <p style={{ fontFamily:UF, fontSize:11, color:C.muted, letterSpacing:1, marginBottom:24 }}>
          {stars===0?"Tap to rate":stars===1?"Very poor":stars===2?"Poor":stars===3?"Okay":stars===4?"Good":"Excellent!"}
        </p>

        {/* Low rating: feedback form */}
        {stars>0&&stars<4&&(
          <div className="fu" style={{ marginBottom:20 }}>
            <textarea placeholder="What could we improve? (optional)" value={feedback} onChange={e=>setFeedback(e.target.value)} style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:3, padding:"12px 14px", color:C.cream, fontFamily:UF, fontSize:13, fontWeight:300, outline:"none", resize:"none", height:80, lineHeight:1.6, textAlign:"left" }}/>
          </div>
        )}
        {/* High rating: App Store */}
        {stars>=4&&(
          <div className="fu" style={{ padding:"14px 16px", border:`1px solid rgba(90,158,114,0.3)`, borderRadius:3, background:"rgba(90,158,114,0.06)", marginBottom:20, display:"flex", gap:12, textAlign:"left" }}>
            <span style={{ fontSize:20 }}>🎉</span>
            <p style={{ fontFamily:UF, fontSize:12, color:C.muted, lineHeight:1.6 }}>Awesome! Tap below to leave a review on the App Store — it takes just 30 seconds.</p>
          </div>
        )}

        {stars>0&&<GoldBtn onClick={submit} style={{ marginBottom:10 }}>{stars>=4?"Rate on App Store ↗":"Submit feedback"}</GoldBtn>}
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontFamily:UF, fontSize:11, letterSpacing:.5, cursor:"pointer", padding:"10px" }}>Not now</button>
        {!neverAsk&&<button onClick={()=>setNeverAsk(true)} style={{ display:"block", width:"100%", background:"none", border:"none", color:C.faint, fontFamily:UF, fontSize:10, letterSpacing:.5, cursor:"pointer", padding:"4px", marginTop:4 }}>Don't ask again</button>}
        {neverAsk&&<p style={{ fontFamily:UF, fontSize:10, color:C.success, marginTop:4 }}>✓ We won't ask again</p>}
      </div>
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   PROMO / ANNOUNCEMENT SCREEN
══════════════════════════════════════════════════════════════ */
const PROMOS = [
  { id:"p1", badge:"🎉 New city launch", title:"EVGoo now live in Bengaluru!", body:"Zero surge for the first 30 days. Book your first Bengaluru ride at 50% off.", cta:"Claim offer", accent:"#1A73E8", code:"BLRLAUNCH" },
  { id:"p2", badge:"⚡ Limited time",    title:"EVGoo Pass at ₹199 this week", body:"Subscribe to Lite Pass before Sunday and lock in India's cleanest ride subscription.", cta:"Get the Pass", accent:"#C9A84C", code:null },
  { id:"p3", badge:"🌱 Eco milestone",   title:"EVGoo riders saved 1 tonne CO₂", body:"Together we've saved 1,000 kg of CO₂ this month. Celebrate with ₹25 off your next ride.", cta:"Claim ₹25 off", accent:"#5A9E72", code:"ECO1TONNE" },
];

function Promo({ onBack }) {
  const [idx,    setIdx]    = useState(0);
  const [copied, setCopied] = useState(null);
  const p = PROMOS[idx];
  const copy = () => { setCopied(p.id); setTimeout(()=>setCopied(null),2000); };

  return (
    <div style={{ minHeight:"100vh", background:C.obsidian, display:"flex", flexDirection:"column" }}>
      {/* Hero */}
      <div style={{ flex:1, position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"0 0 0" }}>
        {/* Gradient bg */}
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, ${p.accent}22 0%, ${C.obsidian} 70%)` }}/>
        {/* Decorative */}
        <div style={{ position:"absolute", top:60, left:"50%", transform:"translateX(-50%)", width:240, height:240, borderRadius:"50%", background:`radial-gradient(circle,${p.accent}18 0%,transparent 70%)`, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:80, left:"50%", transform:"translateX(-50%)", fontSize:96, textAlign:"center", pointerEvents:"none", animation:"drift 4s ease-in-out infinite" }}>
          {p.badge.split(" ")[0]}
        </div>
        {/* Close */}
        <button onClick={onBack} style={{ position:"absolute", top:52, right:22, background:"rgba(255,255,255,0.08)", border:`1px solid ${C.border}`, borderRadius:3, color:C.muted, width:38, height:38, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>

        <div style={{ position:"relative", padding:"0 24px 32px" }}>
          <Tag accent={p.accent} style={{ marginBottom:14 }}>{p.badge}</Tag>
          <h1 style={{ fontFamily:SF, fontSize:34, fontWeight:300, color:C.cream, letterSpacing:-.5, lineHeight:1.15, marginBottom:12 }}>{p.title}</h1>
          <p style={{ fontFamily:UF, fontSize:14, color:C.muted, lineHeight:1.8, marginBottom:24 }}>{p.body}</p>

          {/* Promo code */}
          {p.code && (
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", border:`1px dashed ${p.accent}66`, borderRadius:3, background:`${p.accent}0A`, marginBottom:20 }}>
              <span style={{ fontFamily:UF, fontSize:14, fontWeight:600, letterSpacing:2.5, color:p.accent, flex:1 }}>{p.code}</span>
              <button onClick={copy} className="press" style={{ background:"none", border:`1px solid ${copied===p.id?"rgba(90,158,114,0.5)":p.accent+"55"}`, borderRadius:3, padding:"7px 14px", color:copied===p.id?C.success:p.accent, fontFamily:UF, fontSize:9, letterSpacing:1.5, textTransform:"uppercase", cursor:"pointer" }}>
                {copied===p.id?"✓ Copied":"Copy"}
              </button>
            </div>
          )}

          <button className="press" style={{ width:"100%", padding:"16px", border:"none", borderRadius:3, background:`linear-gradient(135deg,${p.accent}CC,${p.accent})`, color:"#fff", fontFamily:UF, fontSize:12, fontWeight:600, letterSpacing:1.8, textTransform:"uppercase", cursor:"pointer", marginBottom:14 }}>
            {p.cta}
          </button>

          {/* Dot indicators */}
          <div style={{ display:"flex", justifyContent:"center", gap:8 }}>
            {PROMOS.map((_,i) => (
              <div key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?24:7, height:7, borderRadius:4, background:i===idx?p.accent:C.border, transition:"all .3s", cursor:"pointer" }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CHANGE PHONE / EMAIL
══════════════════════════════════════════════════════════════ */
function ChangeCredential({ onBack }) {
  const [type,     setType]    = useState("phone");   // phone | email
  const [step,     setStep]    = useState("input");   // input | verifyCurr | verifyNew | done
  const [newVal,   setNewVal]  = useState("");
  const [otp1,     setOtp1]    = useState(Array(6).fill(""));
  const [otp2,     setOtp2]    = useState(Array(6).fill(""));
  const refs1 = Array(6).fill(0).map(()=>useRef());
  const refs2 = Array(6).fill(0).map(()=>useRef());
  const h1=(i,v)=>{const n=[...otp1];n[i]=v.slice(-1);setOtp1(n);if(v&&i<5)refs1[i+1].current?.focus();};
  const h2=(i,v)=>{const n=[...otp2];n[i]=v.slice(-1);setOtp2(n);if(v&&i<5)refs2[i+1].current?.focus();};

  const STEPS=["New details","Verify current","Verify new","Done"];

  return (
    <Screen scroll style={{ padding:"56px 24px 40px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <BackBtn onClick={step==="input"?onBack:()=>setStep(s=>({verifyCurr:"input",verifyNew:"verifyCurr",done:"verifyNew"}[s]||"input"))}/>
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:5, marginBottom:6 }}>
            {STEPS.slice(0,3).map((_,i)=><div key={i} style={{ flex:1, height:1, background:["input","verifyCurr","verifyNew","done"].indexOf(step)>i?C.gold:C.border, transition:"background .3s" }}/>)}
          </div>
          <p style={{ fontFamily:UF, fontSize:9, color:C.muted, letterSpacing:2, textTransform:"uppercase" }}>Step {["input","verifyCurr","verifyNew"].indexOf(step)+1} of 3</p>
        </div>
      </div>

      {/* Type toggle */}
      {step==="input"&&(
        <div style={{ display:"flex", marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
          {[["phone","📱 Phone"],["email","✉️ Email"]].map(([k,l])=>(
            <button key={k} onClick={()=>{setType(k);setNewVal("");}} style={{ flex:1, padding:"11px 0", background:"none", border:"none", cursor:"pointer", fontFamily:UF, fontSize:10, fontWeight:500, letterSpacing:1.8, textTransform:"uppercase", color:type===k?C.gold:C.muted, borderBottom:type===k?`1.5px solid ${C.gold}`:"1.5px solid transparent", marginBottom:-1, transition:"all .2s" }}>{l}</button>
          ))}
        </div>
      )}

      {step==="input"&&(
        <div className="fu">
          <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>New {type==="phone"?"phone number":"email"}</h2>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:24 }}>Enter your new {type==="phone"?"mobile number":"email address"}. We'll send a verification code to both your current and new {type==="phone"?"number":"email"}.</p>
          <LuxInput label={type==="phone"?"New mobile number":"New email address"} placeholder={type==="phone"?"10-digit number":"you@example.com"} type={type==="phone"?"tel":"email"} prefix={type==="phone"?"🇮🇳  +91":undefined} value={newVal} onChange={e=>setNewVal(type==="phone"?e.target.value.slice(0,10):e.target.value)}/>
          <GoldBtn onClick={()=>newVal&&setStep("verifyCurr")} style={{ opacity:newVal.length>4?1:.4 }}>Send verification codes</GoldBtn>
        </div>
      )}

      {(step==="verifyCurr"||step==="verifyNew")&&(
        <div className="fu">
          <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>{step==="verifyCurr"?"Verify your current":"Verify your new"}</h2>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:28 }}>
            Enter the 6-digit code sent to your <span style={{ color:C.gold }}>{step==="verifyCurr"?(type==="phone"?"current number":"current email"):(type==="phone"?"+91 "+newVal:newVal)}</span>.
          </p>
          <div style={{ display:"flex", gap:9, justifyContent:"center", marginBottom:28 }}>
            {(step==="verifyCurr"?otp1:otp2).map((d,i)=>(
              <input key={i} ref={step==="verifyCurr"?refs1[i]:refs2[i]} type="tel" maxLength={1} value={d}
                onChange={e=>step==="verifyCurr"?h1(i,e.target.value):h2(i,e.target.value)}
                onKeyDown={e=>{if(e.key==="Backspace"&&!d&&i>0)(step==="verifyCurr"?refs1:refs2)[i-1].current?.focus();}}
                style={{ width:44, height:56, background:d?C.surface:C.ink, border:`1px solid ${d?C.gold:C.border}`, borderRadius:3, color:C.gold, fontFamily:SF, fontSize:24, fontWeight:500, textAlign:"center", transition:"all .15s" }}/>
            ))}
          </div>
          <GoldBtn onClick={()=>setStep(step==="verifyCurr"?"verifyNew":"done")}>Verify & continue</GoldBtn>
          <p style={{ textAlign:"center", fontFamily:UF, fontSize:11, color:C.muted, marginTop:20 }}>Didn't receive? <span style={{ color:C.gold, cursor:"pointer" }}>Resend</span></p>
        </div>
      )}

      {step==="done"&&(
        <div className="fu" style={{ textAlign:"center", paddingTop:24 }}>
          <div style={{ width:80, height:80, borderRadius:3, border:`1px solid rgba(90,158,114,0.4)`, background:"rgba(90,158,114,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, margin:"0 auto 20px" }}>✅</div>
          <h2 style={{ fontFamily:SF, fontSize:28, fontWeight:300, color:C.cream, letterSpacing:-.3, marginBottom:8 }}>{type==="phone"?"Phone updated!":"Email updated!"}</h2>
          <p style={{ fontFamily:UF, fontSize:13, color:C.muted, lineHeight:1.8, marginBottom:36 }}>
            Your {type==="phone"?"mobile number":"email address"} has been changed to <span style={{ color:C.gold, fontWeight:500 }}>{type==="phone"?"+91 "+newVal:newVal}</span>. Use this for future logins.
          </p>
          <GoldBtn onClick={onBack}>Back to Settings</GoldBtn>
        </div>
      )}
    </Screen>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState(S.LOCPERM);
  const [route,  setRoute]  = useState(null);
  const [ride,   setRide]   = useState(null);
  const go  = s => setScreen(s);
  const nav = s => setScreen(s);

  const map = {
    [S.LOCPERM]:      <LocPerm         onAllow={()=>go(S.PUSHPERM)}  onSkip={()=>go(S.ONBOARD)}/>,
    [S.PUSHPERM]:     <PushPerm        onAllow={()=>go(S.ONBOARD)}   onSkip={()=>go(S.ONBOARD)}/>,
    [S.ONBOARD]:      <Onboard         onDone={()=>go(S.PROMO)}/>,
    [S.PROMO]:        <Promo           onBack={()=>go(S.LOGIN)}/>,
    [S.SPLASH]:       <Splash          onDone={()=>go(S.LOGIN)}/>,
    [S.LOGIN]:        <Login           onOtp={()=>go(S.OTP)}          onSignup={()=>go(S.SIGNUP)}      onForgot={()=>go(S.FORGOT)}/>,
    [S.SIGNUP]:       <Signup          onBack={()=>go(S.LOGIN)}       onDone={()=>go(S.OTP)}/>,
    [S.OTP]:          <OTP             onBack={()=>go(S.LOGIN)}       onVerify={()=>go(S.HOME)}/>,
    [S.FORGOT]:       <ForgotPassword  onBack={()=>go(S.LOGIN)}       onDone={()=>go(S.LOGIN)}/>,
    [S.HOME]:         <Home            onSearch={()=>go(S.SEARCH)}    onProfile={()=>go(S.PROFILE)}    onSchedule={()=>go(S.SCHEDULE)}  onPromo={()=>go(S.PROMO)}/>,
    [S.SEARCH]:       <Search          onBack={()=>go(S.HOME)}        onResults={r=>{setRoute(r);go(S.CARS);}}/>,
    [S.CARS]:         <Cars            route={route}                  onBack={()=>go(S.SEARCH)}        onSelect={d=>{setRide(d);go(S.CONFIRM);}} onSurge={()=>go(S.SURGE)}/>,
    [S.CONFIRM]:      <Confirm         ride={ride} route={route}      onBack={()=>go(S.CARS)}          onPay={()=>go(S.FINDDRIVER)} onMultiStop={()=>go(S.MULTISTOP)}/>,
    [S.FINDDRIVER]:   <FindDriver      ride={ride}                    onCancel={()=>go(S.HOME)}        onFound={()=>go(S.DRIVERVERIF)}/>,
    [S.PAY]:          <Pay             ride={ride}                    onBack={()=>go(S.POSTRIDE)}      onDone={()=>go(S.RECEIPT)}        onFail={()=>go(S.PAYFAIL)}/>,
    [S.PAYFAIL]:      <PayFail         ride={ride}                    onRetry={()=>go(S.PAY)}          onSwitchMethod={()=>go(S.PAY)}    onCash={()=>go(S.RECEIPT)}    onHome={()=>go(S.HOME)}/>,
    [S.DRIVERVERIF]:  <DriverVerif     ride={ride}                    onBack={()=>go(S.TRACK)}         onVerified={()=>go(S.STARTRIDE)}/>,
    [S.STARTRIDE]:    <StartRide       ride={ride}                    onBack={()=>go(S.DRIVERVERIF)}   onStarted={()=>go(S.TRACK)}/>,
    [S.TRACK]:        <Track           ride={ride}                    onHome={()=>go(S.HOME)}          onSOS={()=>go(S.SOS)}             onShare={()=>go(S.SHARE)}     onCancel={()=>go(S.CANCEL)}  onRideEnd={()=>go(S.POSTRIDE)}/>,
    [S.DRIVERCANCEL]: <DriverCancelled ride={ride} route={route}      onRebook={()=>go(S.CARS)}        onSchedule={()=>go(S.SCHEDULE)}  onHome={()=>go(S.HOME)}/>,
    [S.CANCEL]:       <CancelRide      ride={ride}                    onBack={()=>go(S.TRACK)}         onConfirm={()=>go(S.HOME)}/>,
    [S.POSTRIDE]:     <PostRide        ride={ride} route={route}       onReceipt={()=>go(S.PAY)}        onHome={()=>go(S.HOME)}           onSplit={()=>go(S.SPLITFARE)} onLostFound={()=>go(S.LOSTANDFOUND)} onRate={()=>go(S.RATEAPP)}/>,
    [S.RECEIPT]:      <Receipt         ride={ride} route={route}       onBack={()=>go(S.POSTRIDE)}      onHome={()=>go(S.HOME)}           onDispute={()=>go(S.DISPUTE)}/>,
    [S.SOS]:          <SOS             ride={ride}                    onBack={()=>go(S.TRACK)}         onTrusted={()=>go(S.TRUSTED)}/>,
    [S.SHARE]:        <ShareRide       ride={ride} route={route}       onBack={()=>go(S.TRACK)}/>,
    [S.SCHEDULE]:     <Schedule        onBack={()=>go(S.HOME)}/>,
    [S.PROFILE]:      <Profile         onBack={()=>go(S.HOME)}        onEdit={()=>go(S.EDIT)}          onNav={nav}/>,
    [S.EDIT]:         <EditProfile     onBack={()=>go(S.PROFILE)}/>,
    [S.CARDS]:        <SavedCards      onBack={()=>go(S.PROFILE)}/>,
    [S.ADDRESSES]:    <SavedAddresses  onBack={()=>go(S.PROFILE)}/>,
    [S.COUPONS]:      <Coupons         onBack={()=>go(S.PROFILE)}/>,
    [S.HISTORY]:      <RideHistory     onBack={()=>go(S.PROFILE)}/>,
    [S.NOTIFS]:       <Notifications   onBack={()=>go(S.PROFILE)}/>,
    [S.TRUSTED]:      <TrustedContacts onBack={()=>go(S.SOS)}/>,
    [S.NONET]:        <NoInternet      onRetry={()=>go(S.HOME)}/>,
    [S.SUBS]:         <Subscriptions   onBack={()=>go(S.PROFILE)}/>,
    [S.WALLET]:       <Wallet          onBack={()=>go(S.PROFILE)}/>,
    [S.SETTINGS]:     <Settings        onBack={()=>go(S.PROFILE)}     onDeleteAccount={()=>go(S.DELETEACCT)} onChangeCredential={()=>go(S.CHANGECRED)}/>,
    [S.HELP]:         <HelpSupport     onBack={()=>go(S.PROFILE)}/>,
    [S.DELETEACCT]:   <DeleteAccount   onBack={()=>go(S.SETTINGS)}    onDeleted={()=>go(S.LOGIN)}/>,
    [S.REFERRAL]:     <Referral        onBack={()=>go(S.PROFILE)}/>,
    [S.SAFETYPREFS]:  <SafetyPrefs     onBack={()=>go(S.PROFILE)}/>,
    [S.ECODASH]:      <EcoDash         onBack={()=>go(S.PROFILE)}/>,
    [S.FINDDRIVER]:   <FindDriver      ride={ride}                    onCancel={()=>go(S.HOME)}        onFound={()=>go(S.DRIVERVERIF)}/>,
    [S.SURGE]:        <Surge           onBack={()=>go(S.CARS)}/>,
    [S.LOSTANDFOUND]: <LostFound       ride={ride}                    onBack={()=>go(S.POSTRIDE)}/>,
    [S.DISPUTE]:      <Dispute         ride={ride}                    onBack={()=>go(S.RECEIPT)}/>,
    [S.REPORTDRIVER]: <ReportDriver    ride={ride}                    onBack={()=>go(S.POSTRIDE)}/>,
    [S.MULTISTOP]:    <MultiStop       route={route}                  onBack={()=>go(S.CONFIRM)}       onConfirm={()=>go(S.FINDDRIVER)}/>,
    [S.SPLITFARE]:    <SplitFare       ride={ride}                    onBack={()=>go(S.POSTRIDE)}/>,
    [S.RATEAPP]:      <RateApp         onBack={()=>go(S.HOME)}/>,
    [S.PROMO]:        <Promo           onBack={()=>go(S.HOME)}/>,
    [S.CHANGECRED]:   <ChangeCredential onBack={()=>go(S.SETTINGS)}/>,
  };

  const showNav = NAV_SCREENS.has(screen);

  return (
    <div
      className="grain"
      style={{
        fontFamily:UF, maxWidth:430, margin:"0 auto",
        height:"100vh", display:"flex", flexDirection:"column",
        background:C.obsidian, color:C.cream, overflow:"hidden",
      }}
    >
      <style>{CSS}</style>
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden" }}>
        {map[screen]}
      </div>
      {showNav && <BottomNav screen={screen} go={go}/>}
    </div>
  );
}
