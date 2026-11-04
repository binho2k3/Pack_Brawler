// Full-trip balance probe. No simulated player input, account saves or live browser state.
// Bot uses visible item/encounter stats, never a trial battle to choose a build.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const context={module:{exports:{}},Date,Math};
vm.runInNewContext(html.match(/<script id="game-engine">([\s\S]*?)<\/script>/)[1],context);
const G=context.module.exports,copy=v=>JSON.parse(JSON.stringify(v));
const args=Object.fromEntries(process.argv.slice(2).map(v=>v.replace(/^--/,'').split('=')));
const seedCount=Number(args.seeds||12),dt=Number(args.dt||.05),runeTrial=args['rune-value'];
if(!Number.isInteger(seedCount)||seedCount<1||seedCount>100||![.025,.05].includes(dt))throw new Error('Use --seeds=1..100 and --dt=.025 or .05');
if(runeTrial){if(!Number.isFinite(+runeTrial)||+runeTrial<=0)throw new Error('Invalid rune trial');G.TYPES.rune.value=+runeTrial;}
const stages=(args.stages||'1,2,3').split(',').map(Number),bags=(args.bags||'3,5').split(',').map(Number);
if(!stages.length||!stages.every(s=>Number.isInteger(s)&&s>=1&&s<=5)||!bags.length||!bags.every(b=>[3,4,5].includes(b)))throw new Error('Invalid stages or bags');
const presets=G.LOADOUT_PRESETS.filter(p=>(args.presets||'attack,balanced,haste').split(',').includes(p.id)),policies=(args.policies||'themed,adaptive').split(',');
if(!presets.length||!policies.every(p=>['themed','adaptive'].includes(p)))throw new Error('Invalid presets or policies');
const area=it=>G.TYPES[it.type].w*G.TYPES[it.type].h;
const all=r=>G.allItems(r);
function metrics(items,p,r){
 const enemies=G.encounterInfo(r.stage,r.round).enemies;
 const incoming=enemies.reduce((sum,e)=>sum+e.damage/e.cd,0);
 let dps=0,healing=0,shield=0,haste=0;
 for(const it of items){const t=G.TYPES[it.type],value=G.power(p,it);
  if(t.kind==='damage'){
   // Known starting targets only; no look-ahead into the actual fight.
   const e=t.range==='ranged'?enemies.at(-1):enemies[0],raw=value*G.elementMultiplier(t.element,e.element),armor=e.mechanic==='armorCycle'?e.armor*.6:e.armor;
   dps+=Math.min(e.maxHp,Math.max(1,Math.round(Math.max(raw*.2,raw-armor))))/t.cd;
  }else if(t.kind==='heal')healing+=value/t.cd;
  else if(t.kind==='block')shield+=value/t.cd;
  else haste=Math.max(haste,value*4/t.cd/100);
 }
 return{dps:dps*(1+haste),healing,shield,incoming};
}
function score(items,p,r,policy){
 const m=metrics(items,p,r);if(!m.dps)return 0;
 const weights=policy==='adaptive'?{heal:1.1,shield:1.1}:r.preset==='attack'?{heal:.8,shield:.7}:r.preset==='balanced'?{heal:1.3,shield:1.3}:{heal:.7,shield:1.1};
 // Diminishing utility prevents filling every cell with shields or ready-at-full heals.
 return m.dps+weights.heal*Math.min(m.healing,m.incoming*.75)+weights.shield*Math.min(m.shield,m.incoming*.9);
}
function eligible(it,r,policy){return policy==='adaptive'||r.loadout.includes(it.type);}
function fit(r,it){
 for(const rotated of [false,true]){
  if(it.rot!==rotated)G.rotate(r,it.id);
  for(let y=0;y<r.bagSize;y++)for(let x=0;x<r.bagSize;x++)if(G.inspectDrop(r,it,x,y).status==='valid'){assert.ok(G.move(r,it.id,x,y).ok);return true;}
 }
 return false;
}
function arrange(original,p,policy){
 let best=null,bestScore=-1;
 // Four simple greedy orderings. No exhaustive packing or combat outcome oracle.
 for(const order of ['density','strength','large','support']){
  const r=copy(original);for(const it of [...r.items])G.toBench(r,it.id);
  const candidates=r.bench.filter(it=>eligible(it,r,policy));
  const worth=it=>{const t=G.TYPES[it.type],strength=G.power(p,it)/t.cd;
   if(order==='large')return area(it)*100+strength;
   if(order==='support')return (t.kind==='block'||t.kind==='heal'?30:0)+strength/area(it);
   return strength/(order==='density'?area(it):1);
  };
  candidates.sort((a,b)=>worth(b)-worth(a));
  const weapon=candidates.find(it=>G.TYPES[it.type].kind==='damage');if(weapon)fit(r,weapon);
  for(const it of candidates){if(r.items.some(v=>v.id===it.id))continue;if(score([...r.items,it],p,r,policy)<=score(r.items,p,r,policy)+1e-6)continue;fit(r,it);}
  const value=score(r.items,p,r,policy);
  if(value>bestScore+1e-6){best=r;bestScore=value;}
 }
 return best;
}
function improveMerges(original,p,policy,actions){
 let r=arrange(original,p,policy);
 for(let pass=0;pass<24;pass++){
  let best=r,value=score(r.items,p,r,policy),decision=null;
  for(const target of r.items)for(const source of all(r)){
   if(target.id===source.id||target.type!==source.type||target.tier!==source.tier||target.tier>=G.mergeCap(r,target.type))continue;
   const candidate=copy(r),result=G.move(candidate,source.id,target.x,target.y);if(!result.ok||!result.merge)continue;
   const arranged=arrange(candidate,p,policy),next=score(arranged.items,p,arranged,policy);
   if(next>value+1e-6){best=arranged;value=next;decision={kind:'merge',type:target.type,tier:target.tier+1};}
  }
  if(!decision)break;r=best;if(actions)actions.push(decision);
 }
 return r;
}
function prepare(original,p,policy){
 const actions=[];let r=improveMerges(original,p,policy,actions);
 // Sell off-theme drops under the themed policy, and redundant max-haste copies under either policy.
 for(const it of [...r.bench])if(!eligible(it,r,policy)||(G.TYPES[it.type].kind==='haste'&&r.items.some(v=>v.type===it.type&&v.tier===3))){const amount=G.sell(r,it.id);if(amount)actions.push({kind:'sell',type:it.type,amount});}
 // Explicit bot decision only: the game never auto-sells overflow.
 const excess=G.benchStatus(r).overflow;
 if(excess){const selected=[...r.bench].sort((a,b)=>G.saleValue(a)-G.saleValue(b)).slice(0,excess);const quote=G.quoteBenchSale(r,selected.map(it=>it.id));assert.ok(G.sellBench(r,quote).ok);for(const it of selected)actions.push({kind:'sell',type:it.type,tier:it.tier,amount:G.saleValue(it),reason:'bench-capacity'});}
 for(let pass=0;pass<3;pass++){
  let best=null,decision=null,value=score(r.items,p,r,policy);
  for(let i=0;i<r.shop.length;i++){
   const offer=r.shop[i];if(!offer||!eligible(offer,r,policy))continue;
   const candidate=copy(r);if(!G.buy(candidate,i).ok)continue;
   const trialActions=[],arranged=improveMerges(candidate,p,policy,trialActions),next=score(arranged.items,p,arranged,policy);
   if(next>value+1e-6){best=arranged;value=next;decision=[{kind:'buy',type:offer.type,cost:G.TYPES[offer.type].price},...trialActions];}
  }
  if(!best)break;r=best;actions.push(...decision);
 }
 return{r,actions};
}
function choose(r,p,policy){
 let winner=0,best=-1,values=[];
 for(let index=0;index<3;index++){
  const candidate=copy(r),cp=copy(p);assert.ok(G.chooseSupply(candidate,index));assert.ok(G.nextRound(candidate,cp));
  // Shop is not inspected: only the known incoming pack and next encounter are scored.
  const arranged=improveMerges(candidate,cp,policy),value=score(arranged.items,cp,arranged,policy);
  values.push(+value.toFixed(3));if(value>best+1e-6){best=value;winner=index;}
 }
 return{index:winner,values};
}
function checkGrid(r){const occupied=new Set();for(const it of r.items)for(const cell of G.cells(it)){assert.ok(cell.x<r.bagSize&&cell.y<r.bagSize);assert.ok(!occupied.has(cell.n));occupied.add(cell.n);}assert.ok(r.items.some(it=>G.TYPES[it.type].kind==='damage'));return occupied.size;}
function run(stage,bagSize,preset,seed,policy){
 const p=G.newProfile(1000000);p.seed=seed;p.bagSize=bagSize;G.selectLoadout(p,preset.id);let r=G.newRun(p,stage);r.preset=preset.id;
 const trace=[];let combatSeconds=0;
 for(let round=1;round<=5;round++){
  const prepared=prepare(r,p,policy);r=prepared.r;const used=checkGrid(r),base=score(r.items,p,r,policy);
  const blocked=r.bench.filter(it=>eligible(it,r,policy)&&score([...r.items,it],p,r,policy)>base+1e-6&&!(()=>{const c=copy(r);return fit(c,all(c).find(v=>v.id===it.id));})()).length;
  const entry={round,used,cells:bagSize**2,blockedUseful:blocked,bench:r.bench.length,travelFunds:r.travelFunds,startHp:r.hp,gear:r.items.map(it=>({type:it.type,tier:it.tier,x:it.x,y:it.y,rot:it.rot})),actions:prepared.actions};
  assert.ok(G.start(r,p,1000000));for(let tick=0;tick<Math.ceil(181/dt)&&r.phase==='fighting';tick++)G.tick(r,p,dt);
  assert.ok(['victory','defeat'].includes(r.phase));combatSeconds+=r.report.duration;
  Object.assign(entry,{result:r.report.endReason,seconds:+r.report.duration.toFixed(2),endHp:r.hp,damage:r.report.totals.damage,healing:r.report.totals.healing,overheal:r.report.totals.overheal,shield:r.report.totals.shieldAbsorbed});
  trace.push(entry);if(r.phase==='defeat'||round===5)break;
  entry.supply=choose(r,p,policy);assert.ok(G.chooseSupply(r,entry.supply.index));assert.ok(G.nextRound(r,p));entry.recovered=r.recovery;
 }
 return{stage:stage+1,bagSize,preset:preset.id,seed,policy,won:r.phase==='victory'&&r.round===5,roundsWon:trace.filter(t=>t.result==='victory').length,combatSeconds:+combatSeconds.toFixed(2),energyUsed:30-p.energy.value,trace};
}
function median(a){const sorted=[...a].sort((a,b)=>a-b);return sorted.length%2?sorted[(sorted.length-1)/2]:(sorted[sorted.length/2-1]+sorted[sorted.length/2])/2;}
function summarize(runs){return [...new Set(runs.map(r=>[r.policy,r.stage,r.bagSize,r.preset].join(':')))].map(key=>{
 const group=runs.filter(r=>[r.policy,r.stage,r.bagSize,r.preset].join(':')===key),won=group.filter(r=>r.won),rounds=group.flatMap(r=>r.trace),supplies=rounds.filter(t=>t.supply);
 return{key,runs:group.length,wins:won.length,winRate:+(won.length/group.length*100).toFixed(1),medianWinningCombatSeconds:won.length?+median(won.map(r=>r.combatSeconds)).toFixed(1):null,meanRoundsWon:+(group.reduce((s,r)=>s+r.roundsWon,0)/group.length).toFixed(2),meanOccupiedPercent:+(rounds.reduce((s,t)=>s+t.used/t.cells,0)/rounds.length*100).toFixed(1),roundsWithUsefulOverflow:rounds.filter(t=>t.blockedUseful>0).length,rounds:rounds.length,merges:rounds.flatMap(t=>t.actions).filter(a=>a.kind==='merge').length,supplyTies:supplies.filter(t=>new Set(t.supply.values).size===1).length,supplyChoices:supplies.length};
 });}
if(require.main===module){
 const runs=[];for(const policy of policies)for(const bag of bags)for(const stageNumber of stages)for(const preset of presets)for(let i=0;i<seedCount;i++)runs.push(run(stageNumber-1,bag,preset,57241+i*7919,policy));
 console.log(JSON.stringify({conditions:{seedCount,dt,stages,bags,presetIds:presets.map(p=>p.id),policyIds:policies,runeValue:G.TYPES.rune.value,policies:{themed:'Only starting Loadout types; sell off-theme drops',adaptive:'All owned types may replace starting roles'},limits:'Greedy item-stat heuristic, not a human player or optimal strategy. No rerolls, retries, meta upgrades or farm. All starting bench items are available. 5x5 unlock is a controlled test fixture, not free progression. Combat duration excludes preparation.'},summary:summarize(runs),runs},null,2));
}
module.exports={run,summarize,arrange,improveMerges,prepare,choose,checkGrid,G};
