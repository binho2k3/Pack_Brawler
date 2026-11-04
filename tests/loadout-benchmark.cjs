// Baseline comparison only: isolated rounds, no Shop, supplies, bench gear or meta upgrades.
// Run: node tests/loadout-benchmark.cjs
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const context={module:{exports:{}},Date,Math};
vm.runInNewContext(html.match(/<script id="game-engine">([\s\S]*?)<\/script>/)[1],context);
const G=context.module.exports,results=[];
for(const tier of [1,2])for(let stage=0;stage<3;stage++)for(const round of [1,5])for(const preset of G.LOADOUT_PRESETS){
 const p=G.newProfile(1000000);G.selectLoadout(p,preset.id);const r=G.newRun(p,stage);r.round=round;
 r.items.forEach(it=>it.tier=tier);G.start(r,p,1000000);
 for(let step=0;step<4600&&r.phase==='fighting';step++)G.tick(r,p,.04);
 if(r.phase==='fighting')throw new Error('Round did not terminate');
 results.push({tier,stage:stage+1,round,loadout:preset.name,result:r.report.endReason,seconds:+r.report.duration.toFixed(1),hp:r.report.endHp,damage:r.report.totals.damage});
}
console.log(JSON.stringify({conditions:'3x3, 180 HP, three starting items only, no upgrades, isolated round, dt=0.04',results},null,2));
