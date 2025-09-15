import React from 'react'

type Province =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

type Rates = {
  kind: 'HST' | 'GST_PST' | 'GST_QST' | 'GST_ONLY';
  gst: number;
  hst?: number;
  pst?: number;
  qst?: number;
};

const TAX_RATES: Record<Province, Rates> = {
  AB: { kind: 'GST_ONLY', gst: 0.05 },
  BC: { kind: 'GST_PST', gst: 0.05, pst: 0.07 },
  MB: { kind: 'GST_PST', gst: 0.05, pst: 0.07 },
  NB: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NL: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NS: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NT: { kind: 'GST_ONLY', gst: 0.05 },
  NU: { kind: 'GST_ONLY', gst: 0.05 },
  ON: { kind: 'HST', gst: 0.05, hst: 0.13 },
  PE: { kind: 'HST', gst: 0.05, hst: 0.15 },
  QC: { kind: 'GST_QST', gst: 0.05, qst: 0.09975 },
  SK: { kind: 'GST_PST', gst: 0.05, pst: 0.06 },
  YT: { kind: 'GST_ONLY', gst: 0.05 },
};

type Category =
  | 'Standard' | 'Exempt' | 'Zero-rated (basic groceries)'
  | 'Prepared food / restaurant' | 'Children’s clothing & footwear'
  | 'Children’s diapers' | 'Children’s car seats & booster seats'
  | 'Feminine hygiene products' | 'Prescription drugs / medical'
  | 'Printed books (qualifying)' | 'Newspapers (qualifying)'
  | 'Public transit fares' | 'Snack foods / candy' | 'Sweetened carbonated beverages'
  | 'Cannabis (medical)' | 'Cannabis (non-medical)'
  | 'Tobacco / alcohol' | 'GST only' | 'Provincial only';

const CATEGORY_OPTIONS: Category[] = [
  'Standard','Exempt','Zero-rated (basic groceries)','Prepared food / restaurant',
  'Children’s clothing & footwear','Children’s diapers','Children’s car seats & booster seats',
  'Feminine hygiene products','Prescription drugs / medical','Printed books (qualifying)',
  'Newspapers (qualifying)','Public transit fares','Snack foods / candy','Sweetened carbonated beverages',
  'Cannabis (medical)','Cannabis (non-medical)','Tobacco / alcohol','GST only','Provincial only'
];

function baseCategoryFlags(preset: Category) {
  switch (preset) {
    case 'Exempt':
    case 'Zero-rated (basic groceries)':
    case 'Feminine hygiene products':
    case 'Public transit fares':
    case 'Prescription drugs / medical':
      return { federal: false, provincial: false };
    case 'Printed books (qualifying)':
    case 'Newspapers (qualifying)':
      return { federal: true, provincial: true };
    case 'GST only': return { federal: true, provincial: false };
    case 'Provincial only': return { federal: false, provincial: true };
    default: return { federal: true, provincial: true };
  }
}

function applyProvinceCategoryOverrides(amount: number, province: Province, preset: Category, flags: { federal:boolean; provincial:boolean }) {
  let { federal, provincial } = flags;

  switch (preset) {
    case 'Children’s clothing & footwear': {
      if (['ON','NS','PE'].includes(province)) provincial = false; // HST POS rebate
      if (province === 'BC') provincial = false;                   // PST exempt
      if (province === 'MB') provincial = amount <= 150 ? false : true; // ≤ $150 RST-exempt
      break;
    }
    case 'Children’s diapers': {
      if (['ON','NS'].includes(province)) provincial = false;      // HST POS rebate
      if (['BC','MB','SK','QC'].includes(province)) provincial = false; // PST/QST exempt
      break;
    }
    case 'Children’s car seats & booster seats': {
      if (['ON','BC','MB'].includes(province)) provincial = false;
      break;
    }
    case 'Prepared food / restaurant': {
      if (province === 'ON' && amount <= 4) provincial = false;   // small meals GST-only
      if (province === 'BC') provincial = false;                  // PST-exempt
      if (['MB','SK'].includes(province)) provincial = true;      // PST applies
      break;
    }
    case 'Sweetened carbonated beverages': {
      if (['BC','MB','SK'].includes(province)) provincial = true;
      break;
    }
    case 'Snack foods / candy': {
      if (province === 'BC') provincial = false;                  // PST-exempt
      if (['MB','SK'].includes(province)) provincial = true;
      break;
    }
    case 'Printed books (qualifying)': {
      if (['ON','NS','NB','NL','PE'].includes(province)) provincial = false; // HST POS rebate
      if (['BC','MB','SK','QC'].includes(province)) provincial = false;      // PST/QST exempt
      break;
    }
    case 'Newspapers (qualifying)': {
      if (['ON','BC'].includes(province)) provincial = false;
      break;
    }
    case 'Cannabis (medical)':
    case 'Cannabis (non-medical)': {
      // Treated as standard taxable (excise not included)
      break;
    }
    default: break;
  }
  return { federal, provincial };
}

type LineItem = { id: string; label: string; category: Category; amount: string; };

function fmt(n: number) { return n.toLocaleString('en-CA', { style: 'currency', currency: 'CAD' }); }

export default function TaxSmartCalculator() {
  const [province, setProvince] = React.useState<Province>('BC');
  const [items, setItems] = React.useState<LineItem[]>([{ id: crypto.randomUUID(), label: 'Item 1', category: 'Standard', amount: '0' }]);
  const [dark, setDark] = React.useState(false);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [resultKey, setResultKey] = React.useState(0);

  const currentRates = TAX_RATES[province];
  const provLabel = currentRates.kind === 'HST' ? 'HST' : currentRates.kind === 'GST_QST' ? 'QST' : currentRates.kind === 'GST_PST' ? 'PST' : '';
  const provPct = currentRates.kind === 'HST' ? (currentRates.hst ?? 0)
                : currentRates.kind === 'GST_QST' ? (currentRates.qst ?? 0)
                : currentRates.kind === 'GST_PST' ? (currentRates.pst ?? 0) : 0;

  function computeLine(amount: number, cat: Category) {
    const base = baseCategoryFlags(cat);
    const { federal, provincial } = applyProvinceCategoryOverrides(amount, province, cat, base);
    let federalTax = 0, provincialTax = 0, hstTax = 0;
    const r = TAX_RATES[province];
    if (r.kind === 'HST') {
      if (federal && provincial) hstTax = amount * (r.hst ?? 0);
      else if (federal && !provincial) federalTax = amount * r.gst;
      else if (!federal && provincial) provincialTax = amount * ((r.hst ?? 0) - r.gst);
    } else if (r.kind === 'GST_PST') {
      if (federal) federalTax = amount * r.gst;
      if (provincial) provincialTax = amount * (r.pst ?? 0);
    } else if (r.kind === 'GST_QST') {
      if (federal) federalTax = amount * r.gst;
      if (provincial) provincialTax = amount * (r.qst ?? 0);
    } else {
      if (federal) federalTax = amount * r.gst;
    }
    const tax = federalTax + provincialTax + hstTax;
    return { amount, federalTax, provincialTax, hstTax, tax, total: amount + tax };
  }

  const parsed = items.map(it => ({ ...it, amountNum: Number(it.amount || 0) || 0 }));
  const lines = parsed.map(it => ({ id: it.id, ...computeLine(it.amountNum, it.category), amount: it.amountNum }));
  const subTotal = lines.reduce((s,l)=>s+l.amount,0);
  const federal = lines.reduce((s,l)=>s+l.federalTax,0);
  const provincial = lines.reduce((s,l)=>s+l.provincialTax,0);
  const hst = lines.reduce((s,l)=>s+l.hstTax,0);
  const tax = lines.reduce((s,l)=>s+l.tax,0);
  const grandTotal = subTotal + tax;

  function addItem() { setItems(prev => [...prev, { id: crypto.randomUUID(), label: `Item ${prev.length+1}`, category: 'Standard', amount: '0' }]); }
  function removeItem(id: string) { setItems(prev => prev.filter(p => p.id !== id)); }
  function updateItem(id: string, patch: Partial<LineItem>) { setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it)); }
  function calculate() { setResultKey(k => k+1); }

  function showNotice(msg: string) { setNotice(msg); window.setTimeout(()=>setNotice(null), 1600); }

  function copyTotalsToClipboard() {
    const parts = [
      `Province: ${province}`,
      `Subtotal: ${fmt(subTotal)}`,
      currentRates.kind === 'HST' ? `HST: ${fmt(hst)}` : `GST: ${fmt(federal)}\n${provLabel || 'Provincial'}: ${fmt(provincial)}`,
      `Total tax: ${fmt(tax)}`,
      `Grand total: ${fmt(grandTotal)}`,
    ];
    const text = parts.map(String).join('\n');
    navigator.clipboard.writeText(text).then(()=>showNotice('Totals copied'));
  }
  function buildShareUrl() {
    const data = { province, items: items.map(({label,category,amount}) => ({label,category,amount})) };
    const url = new URL(window.location.href);
    url.hash = 'state=' + encodeURIComponent(btoa(JSON.stringify(data)));
    return url.toString();
  }
  function copyShareLink() { navigator.clipboard.writeText(buildShareUrl()).then(()=>showNotice('Link copied')); }
  function copyAppLink() {
    const url = new URL(window.location.href); url.hash='';
    navigator.clipboard.writeText(url.toString()).then(()=>showNotice('App link copied'));
  }
  React.useEffect(()=>{
    const m = window.location.hash.match(/state=([^&]+)/);
    if (m) {
      try {
        const json = JSON.parse(atob(decodeURIComponent(m[1])));
        if (json.province) setProvince(json.province as Province);
        if (Array.isArray(json.items)) {
          setItems(json.items.map((it:any,i:number)=>({ id: crypto.randomUUID(), label: it.label ?? `Item ${i+1}`, category: (it.category ?? 'Standard') as Category, amount: String(it.amount ?? '0') })));
        }
      } catch {}
    }
  }, []);

  const rootClass = 'container ' + (dark ? 'dark' : '');

  return (
    <div className={rootClass}>
      <div className="topbar">
        <div style={{display:'flex',alignItems:'center',gap:8}}><span>🍁</span><strong>TaxSmart</strong></div>
        <div className="muted">Totally free. No ads.</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={copyAppLink}>Share calculator</button>
          <button className="btn" onClick={()=>setDark(d=>!d)}>{dark ? 'Light' : 'Dark'} mode</button>
        </div>
      </div>

      {notice && <div style={{marginTop:12}} className="notice">{notice}</div>}

      <h1 className="title" style={{fontSize:32, margin:'18px 0 12px', display:'flex', alignItems:'center', gap:10}}>
        Canada Sales‑Tax Smart Calculator <span className="badge">Free</span>
      </h1>

      <div className="card" style={{padding:16, marginBottom:16}}>
        <div className="row" style={{gridTemplateColumns:'repeat(12, 1fr)'}}>
          <div className="col" style={{gridColumn:'span 4'}}>
            <div className="muted" style={{marginBottom:6}}>Province / Territory</div>
            <select value={province} onChange={e=>setProvince(e.target.value as Province)}>
              {['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT'].map(p=>(
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="col" style={{gridColumn:'span 8', display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12}}>
            <div className="tile">
              <div className="muted">Federal (GST)</div>
              <div style={{fontWeight:700, fontSize:18}}>{(TAX_RATES[province].gst*100).toFixed(1)}%</div>
            </div>
            <div className="tile">
              <div className="muted">Provincial ({provLabel || '—'})</div>
              <div style={{fontWeight:700, fontSize:18}}>{provPct ? (provPct*100).toFixed(2)+'%' : '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{padding:16, marginBottom:16}}>
        <h2 className="title" style={{fontSize:20, marginTop:0}}>Line Items</h2>
        <div style={{display:'flex', flexDirection:'column', gap:10}}>
          {items.map(it => (
            <div key={it.id} className="row" style={{gridTemplateColumns:'repeat(12,1fr)', padding:8, border:'1px solid rgba(0,0,0,.06)', borderRadius:12, background:'rgba(255,255,255,.9)'}}>
              <input className="input" style={{gridColumn:'span 4'}} value={it.label} onChange={e=>updateItem(it.id,{label:e.target.value})} placeholder="Label" />
              <select className="input" style={{gridColumn:'span 3'}} value={it.category} onChange={e=>updateItem(it.id,{category:e.target.value as Category})}>
                {CATEGORY_OPTIONS.map(opt=> <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <div style={{gridColumn:'span 4', position:'relative'}}>
                <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#9ca3af'}}>$</span>
                <input className="input" style={{paddingLeft:22}} type="number" inputMode="decimal" step="0.01" min="0" value={it.amount} onChange={e=>updateItem(it.id,{amount:e.target.value})} placeholder="0.00" />
              </div>
              <button className="btn ghost" style={{gridColumn:'span 1'}} onClick={()=>removeItem(it.id)}>✕</button>
            </div>
          ))}
          <button className="btn" onClick={addItem}>＋ Add item</button>
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'center', margin:'6px 0 18px'}}>
        <button className="btn primary" onClick={calculate}>Calculate tax</button>
      </div>

      <div key={resultKey} className="card" style={{padding:16}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, marginBottom:8}}>
          <h2 className="title" style={{fontSize:20, margin:0}}>Totals</h2>
          <div style={{display:'flex', gap:8}}>
            <button className="btn" onClick={copyTotalsToClipboard}>Copy totals</button>
            <button className="btn" onClick={copyShareLink}>Share link</button>
          </div>
        </div>
        <div className="row" style={{gridTemplateColumns:'repeat(12,1fr)'}}>
          <div className="tile" style={{gridColumn:'span 2'}}> <div className="muted">Subtotal</div> <div style={{fontWeight:700}}>{fmt(subTotal)}</div> </div>
          {currentRates.kind === 'HST'
            ? <div className="tile" style={{gridColumn:'span 2'}}><div className="muted">HST</div><div style={{fontWeight:700}}>{fmt(hst)}</div></div>
            : (<>
                <div className="tile" style={{gridColumn:'span 2'}}><div className="muted">GST</div><div style={{fontWeight:700}}>{fmt(federal)}</div></div>
                <div className="tile" style={{gridColumn:'span 2'}}><div className="muted">{provLabel || 'Provincial'}</div><div style={{fontWeight:700}}>{fmt(provincial)}</div></div>
              </>)
          }
          <div className="tile" style={{gridColumn:'span 2'}}> <div className="muted">Total tax</div> <div style={{fontWeight:700}}>{fmt(tax)}</div> </div>
          <div className="tile" style={{gridColumn:'span 4', background:'var(--brand)', color:'white'}}> <div className="muted" style={{color:'rgba(255,255,255,.9)'}}>Grand total</div> <div style={{fontWeight:800, fontSize:22}}>{fmt(grandTotal)}</div> </div>
        </div>
      </div>

      <div className="card" style={{padding:16, marginTop:16}}>
        <h2 className="title" style={{fontSize:20, marginTop:0}}>References</h2>
        <ul>
          <li><a href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-type-supply.html" target="_blank" rel="noreferrer">CRA: Charge & collect GST/HST by type of supply (zero‑rated vs exempt)</a></li>
          <li><a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/gi-063.html" target="_blank" rel="noreferrer">CRA GI‑063: Ontario POS rebates (children’s goods, books, diapers, car seats)</a></li>
          <li><a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/gi-060.html" target="_blank" rel="noreferrer">CRA GI‑060: Ontario POS rebate on newspapers</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst" target="_blank" rel="noreferrer">BC PST: Overview & exemptions (incl. restaurant meals, children’s clothing, books)</a></li>
          <li><a href="https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst/ice-cream-sweetened-beverages" target="_blank" rel="noreferrer">BC PST: Sweetened carbonated beverages</a></li>
          <li><a href="https://www.gov.mb.ca/finance/taxation/taxes/retail.html" target="_blank" rel="noreferrer">Manitoba RST: Exemptions incl. children’s clothing (≤ $150)</a></li>
          <li><a href="https://www.revenuquebec.ca/en/" target="_blank" rel="noreferrer">Revenu Québec: QST – books (0%) and baby diapers</a></li>
        </ul>
        <p className="muted" style={{marginTop:8}}>Excise duties/markups (alcohol, tobacco, cannabis) and deposits/levies are not included.</p>
      </div>

      <footer style={{textAlign:'center', margin:'20px 0', fontSize:12, color:'var(--muted)'}}>
        Built with ❤️ for Canadians — Totally free. No ads.
      </footer>
    </div>
  )
}
