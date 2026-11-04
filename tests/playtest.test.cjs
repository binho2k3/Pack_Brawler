const test=require('node:test'),assert=require('node:assert/strict');
const PT=require('../playtest.js'),{G}=require('./stage-benchmark.cjs');
const make=(id='attack-3',qa=false)=>PT.create(PT.cases.find(c=>c.id===id),'rules-a',0,1000000,'test-'+id,qa);
const advanceSeconds=(r,n,category)=>{PT.advance(r,r.clock.last,1000000+r.clock.last,category);for(let i=0;i<n;i++)PT.advance(r,r.clock.last+1000,1000000+r.clock.last+1000,category);};
const complete=(r,status='won')=>PT.finish(r,status,r.clock.last,1000000+r.clock.last);

test('six cases use stage 2 and isolated fixed profiles with no skins or upgrades',()=>{
 const account=G.newProfile(1000000);account.silver=9999;account.skins.owned.sword=[5];account.skins.equipped.sword=5;const before=JSON.stringify(account);
 assert.equal(PT.cases.length,6);for(const c of PT.cases){const {p,r}=PT.fixture(G,c.id,1000000);assert.equal(r.stage,1);assert.equal(r.bagSize,c.bag);assert.equal(p.energy.value,30);assert.equal(p.silver,320);assert.equal(p.gems,25);assert.ok(Object.values(p.upgrades).every(n=>n===0));assert.ok(Object.values(p.skins.equipped).every(n=>n===0));assert.equal(p.loadout.join(','),G.LOADOUT_PRESETS.find(v=>v.id===c.preset).types.join(','));assert.equal(r.travelFunds,60);p.silver+=100;G.sell(r,r.bench[0].id);}
 assert.equal(JSON.stringify(account),before);assert.throws(()=>PT.fixture(G,'bad',0));
});
test('fixed seed reproduces shop and supplies for equal choices independent of bag size',()=>{
 const a=PT.fixture(G,'attack-3',1000000),b=PT.fixture(G,'attack-5',1000000);assert.equal(JSON.stringify(a.r.shop),JSON.stringify(b.r.shop));
 for(const f of [a,b]){G.start(f.r,f.p,1000000);G.finish(f.r,f.p,true);}assert.equal(JSON.stringify(a.r.supply),JSON.stringify(b.r.supply));
});
test('timers separate preparing, supply, review and actual-speed combat without multiplying x2',()=>{
 const r=make();advanceSeconds(r,20,'prepare');advanceSeconds(r,10,'combat1');advanceSeconds(r,5,'combat2');advanceSeconds(r,7,'supply');advanceSeconds(r,3,'review');assert.deepEqual(PT.totals(r),{active:45,excluded:0,observed:45,combat:15,simulatedCombat:0});assert.equal(r.flags.speed2,true);complete(r);assert.equal(PT.timing(r),'speed2');
});
test('explicit pause, hidden time and energy wait remain excluded even over long intervals',()=>{
 const r=make();for(const category of ['paused','hidden','energy']){PT.advance(r,r.clock.last,1000000+r.clock.last,category);PT.advance(r,r.clock.last+60000,1000000+r.clock.last+60000,category);}assert.equal(PT.totals(r).active,0);assert.equal(PT.totals(r).excluded,180);assert.equal(r.flags.gap,false);
});
test('unobserved foreground gaps and clock rollback cannot inflate active time or count twice',()=>{
 const r=make();advanceSeconds(r,3,'prepare');PT.advance(r,33000,1033000,'prepare');assert.equal(r.seconds.gap,30);assert.equal(r.seconds.prepare,3);assert.equal(r.flags.gap,true);PT.advance(r,100,100,'prepare');assert.equal(r.clock.last,33000);PT.advance(r,34000,1034000,'prepare');assert.equal(r.seconds.prepare,4);complete(r);assert.equal(PT.timing(r),'gap');
});
test('timestamps close on victory and reading the final report cannot extend the journey',()=>{
 const r=make();advanceSeconds(r,190,'prepare');assert.ok(complete(r));const before=JSON.stringify(r);PT.advance(r,300000,1300000,'review');assert.equal(complete(r,'abandoned'),false);PT.event(r,'sell',5,{count:3});assert.equal(JSON.stringify(r),before);assert.equal(PT.timing(r),'within');
});
test('only completed x1 human trips are judged against the three-to-five-minute goal',()=>{
 for(const [seconds,expected] of [[179,'short'],[180,'within'],[300,'within'],[301,'long']]){const r=make();advanceSeconds(r,seconds,'prepare');complete(r);assert.equal(PT.timing(r),expected);}
 for(const status of ['stopped','abandoned','interrupted']){const r=make();advanceSeconds(r,200,'prepare');complete(r,status);assert.equal(PT.timing(r),'incomplete');}
 const qa=make('attack-3',true);advanceSeconds(qa,200,'prepare');complete(qa);assert.equal(PT.timing(qa),'qa');
});
test('action counts preserve quantity versus transactions, rejected placements and retry separately',()=>{
 const r=make();PT.event(r,'sell',1,{count:3,received:42});PT.event(r,'sell',1,{count:1,received:14});PT.event(r,'merge',1,{type:'sword'});PT.event(r,'invalidMove',1,{reason:'overlap'});PT.event(r,'retry',1);assert.equal(r.counts.sell,2);assert.equal(r.counts.soldItems,4);assert.equal(r.counts.merge,1);assert.equal(r.counts.move,0);assert.equal(r.counts.invalidMove,1);assert.equal(r.counts.retry,1);
});
test('event truncation is explicit while aggregate counts continue',()=>{
 const r=make();for(let i=0;i<PT.EVENT_LIMIT+10;i++)PT.event(r,'move',1,{x:i});assert.equal(r.events.length,PT.EVENT_LIMIT);assert.equal(r.counts.move,PT.EVENT_LIMIT+10);assert.equal(r.flags.truncated,true);
});
test('each combat attempt records the actual grid and terminal report only once',()=>{
 const {p,r}=PT.fixture(G,'balanced-5',1000000),journal=make('balanced-5');G.start(r,p,1000000);PT.attempt(journal,r,G,30);G.tick(r,p,.1);G.finish(r,p,false);assert.ok(PT.result(journal,r.report));assert.equal(PT.result(journal,r.report),false);assert.equal(journal.attempts[0].occupied,7);assert.equal(journal.attempts[0].energyBefore,30);assert.equal(PT.totals(journal).simulatedCombat,.1);
 G.retry(r);G.start(r,p,1000000);PT.attempt(journal,r,G,25);assert.equal(journal.attempts[1].ordinal,2);assert.equal(journal.attempts[1].result,null);assert.equal(journal.attempts[0].result.won,false);
});
test('reload closes a pending journal at its last saved heartbeat without inventing offline play',()=>{
 const active=make();advanceSeconds(active,12,'prepare');const restored=PT.restore(JSON.parse(PT.exportData([],active)));assert.equal(restored.length,1);assert.equal(restored[0].status,'interrupted');assert.equal(restored[0].endedAt,1012000);assert.equal(PT.totals(restored[0]).active,12);assert.equal(active.status,'active');assert.equal(PT.restore({records:restored,active}).length,1);
});
test('archiving and restoring deduplicate IDs and retain the last thirty reports',()=>{
 let records=[];for(let i=0;i<35;i++){const r=make();r.id='id-'+i;complete(r,'abandoned');records=PT.archive(records,r);}assert.equal(records.length,30);assert.equal(records[0].id,'id-5');records=PT.archive(records,records.at(-1));assert.equal(records.length,30);assert.equal(PT.restore({records:[...records,...records]}).length,30);
});
test('invalid persisted times, feedback and display fields are rejected safely',()=>{
 const base=make();complete(base);assert.ok(PT.valid(base));for(const mutate of [r=>r.seconds.prepare=-1,r=>r.seconds.hidden=NaN,r=>r.counts.sell=Infinity,r=>r.feedback.next=123,r=>r.config.stage=4,r=>r.status='bad',r=>r.events.push({kind:'x',round:'<img>',at:0}),r=>r.attempts.push({round:1,gear:[],occupied:0,benchCount:0,hp:'<img>'})]){const r=structuredClone(base);mutate(r);assert.equal(PT.valid(r),false);assert.equal(PT.restore({records:[r]}).length,0);}assert.deepEqual(PT.restore(null),[]);
});
test('feedback is bounded and JSON export retains exact content without touching account data',()=>{
 const r=make();complete(r);PT.feedback(r,'<script> thử & ghép','a'.repeat(600));const exported=JSON.parse(PT.exportData([r]));assert.equal(exported.schema,'pack-brawler-playtest');assert.equal(exported.units,'seconds');assert.equal(exported.records[0].feedback.decision,'<script> thử & ghép');assert.equal(exported.records[0].feedback.next.length,500);assert.equal(exported.active,null);
});
test('cohort includes losses but excludes QA, other rules, x2 and incomplete timings from time averages',()=>{
 const records=[];for(const [id,status,qa,speed,rules] of [['a','won',false,false,'rules-a'],['b','stopped',false,false,'rules-a'],['c','won',true,false,'rules-a'],['d','won',false,true,'rules-a'],['e','won',false,false,'old']]){const r=make('attack-3',qa);r.id=id;r.rules=rules;advanceSeconds(r,200,speed?'combat2':'prepare');complete(r,status);records.push(r);}const group=PT.cohort(records,'rules-a')[0];assert.equal(group.runs,3);assert.equal(group.wins,2);assert.equal(group.incomplete,1);assert.equal(group.timingSamples,1);assert.equal(group.meanActive,200);assert.equal(group.within,1);
});
test('rule signature detects changed balance and is repeatable',()=>{
 const first=PT.rulesKey(G);assert.equal(first,PT.rulesKey(G));const changed={...G,ENERGY:{...G.ENERGY,cost:6}};assert.notEqual(first,PT.rulesKey(changed));
});
