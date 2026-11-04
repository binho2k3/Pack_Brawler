const test=require('node:test'),assert=require('node:assert/strict');
const {G,run,arrange,prepare,choose,checkGrid,summarize}=require('./stage-benchmark.cjs');
const clone=v=>JSON.parse(JSON.stringify(v));

test('preparation respects grid, inventory provenance, currency, and leaves its input untouched',()=>{
 const p=G.newProfile(1000000);p.seed=57241;G.selectLoadout(p,'haste');const r=G.newRun(p);r.preset='haste';
 const before=JSON.stringify({p,r}),initial=new Map(G.allItems(r).map(it=>[it.type,(G.allItems(r).filter(i=>i.type===it.type).length)]));
 const result=prepare(r,p,'themed');assert.equal(JSON.stringify({p,r}),before);checkGrid(result.r);
 const spent=result.actions.filter(a=>a.kind==='buy').reduce((s,a)=>s+a.cost,0),earned=result.actions.filter(a=>a.kind==='sell').reduce((s,a)=>s+a.amount,0);
 assert.equal(result.r.travelFunds,r.travelFunds+earned-spent);assert.ok(result.r.travelFunds>=0);
 for(const it of result.r.items)assert.ok(r.loadout.includes(it.type));
 for(const type of Object.keys(G.TYPES)){
  const acquired=result.actions.filter(a=>a.kind==='buy'&&a.type===type).length,sold=result.actions.filter(a=>a.kind==='sell'&&a.type===type).length;
  assert.equal(G.allItems(result.r).filter(it=>it.type===type).reduce((sum,it)=>sum+2**(it.tier-1),0),(initial.get(type)||0)+acquired-sold);
 }
});
test('supply evaluation cannot mutate pending choices, reward, profile or HP',()=>{
 const p=G.newProfile(1000000),r=G.newRun(p);r.preset='balanced';G.start(r,p,1000000);G.finish(r,p,true);
 const before=JSON.stringify({p,r}),choice=choose(r,p,'themed');assert.equal(JSON.stringify({p,r}),before);assert.ok([0,1,2].includes(choice.index));assert.equal(choice.values.length,3);
});
test('packing handles rotated rectangles and never silently drops overflow items',()=>{
 const p=G.newProfile(1000000),r=G.newRun(p);r.preset='balanced';r.bench.push(G.item('shield'),G.item('bow'),G.item('censer'));
 const original=G.allItems(r).map(it=>it.id).sort(),result=arrange(r,p,'adaptive');checkGrid(result);assert.deepEqual(G.allItems(result).map(it=>it.id).sort(),original);
});
test('a full trip includes the actual five-round energy and recovery rules and is reproducible',()=>{
 const preset=G.LOADOUT_PRESETS[0],first=run(0,3,preset,57241,'themed'),second=run(0,3,preset,57241,'themed');
 assert.deepEqual(first,second);assert.equal(first.won,true);assert.equal(first.trace.length,5);assert.equal(first.energyUsed,25);
 assert.equal(first.trace[0].startHp,180);for(let i=1;i<5;i++)assert.equal(first.trace[i].startHp,Math.min(180,first.trace[i-1].endHp+36));
 assert.equal(first.roundsWon,5);const summary=summarize([first,second]);assert.equal(summary[0].runs,2);assert.equal(summary[0].wins,2);
});

test('bot explicitly records capacity sales without changing its input or losing currency',()=>{
 const p=G.newProfile(1000000),r=G.newRun(p);r.preset='balanced';r.shop=[];for(let i=0;i<20;i++)r.bench.push(G.item('shield',3));
 const before=JSON.stringify({p,r}),result=prepare(r,p,'adaptive');assert.equal(JSON.stringify({p,r}),before);checkGrid(result.r);assert.ok(result.r.bench.length<=12);
 const sales=result.actions.filter(a=>a.reason==='bench-capacity');assert.ok(sales.length>0);assert.equal(G.allItems(result.r).length,G.allItems(r).length-sales.length);assert.equal(result.r.travelFunds,r.travelFunds+sales.reduce((sum,a)=>sum+a.amount,0));
});
