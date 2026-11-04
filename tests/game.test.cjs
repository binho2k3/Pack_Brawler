const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const assert=require('node:assert/strict');
const test=require('node:test');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
for(const [,script] of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(script);
const context={module:{exports:{}},Date,Math};
vm.runInNewContext(html.match(/<script id="game-engine">([\s\S]*?)<\/script>/)[1],context);
const G=context.module.exports;
const fresh=()=>{const p=G.newProfile(1000000);return[p,G.newRun(p)];};
const advance=(p,r)=>{assert.ok(G.chooseSupply(r,0));return G.nextRound(r,p);};
const empty=()=>{const[p,r]=fresh();r.bagSize=5;r.items=[];r.bench=[];return[p,r];};
const settle=(p,r)=>{for(let i=0;i<30000&&r.phase==='fighting';i++)G.tick(r,p,.04);};

test('eight equipment types cover all four required footprints',()=>{assert.ok(Object.keys(G.TYPES).length===8);const sizes=new Set(Object.values(G.TYPES).map(t=>`${t.w}x${t.h}`));for(const size of ['1x1','1x2','2x1','2x2'])assert.ok(sizes.has(size));});
test('starting equipment fits inside 3x3 without overlaps',()=>{const[,r]=fresh();const occupied=new Set();for(const it of r.items)for(const c of G.cells(it)){assert.ok(c.x>=0&&c.x<3&&c.y>=0&&c.y<3);assert.ok(!occupied.has(c.n));occupied.add(c.n);}});
test('preview recognizes valid placement and leaves state untouched',()=>{const[,r]=empty(),it=G.item('shield');r.bench.push(it);const before=JSON.stringify(r);assert.equal(G.inspectDrop(r,it,2,2).status,'valid');assert.equal(JSON.stringify(r),before);});
test('edge overflow and negative anchor reject without consuming item',()=>{const[p,r]=empty(),it=G.item('shield');r.bench.push(it);for(const [x,y] of [[4,4],[-1,0],[0,-1],[5,0]]){assert.equal(G.inspectDrop(r,it,x,y).status,'invalid');const before=JSON.stringify(r);assert.equal(G.move(r,it.id,x,y).ok,false);assert.equal(JSON.stringify(r),before);}});
test('same type and tier merges, retains target orientation and lower cooldown',()=>{const[,r]=empty(),a=G.item('sword',1,0,0),b=G.item('sword');a.rot=true;a.progress=.8;b.progress=.3;r.items=[a];r.bench=[b];assert.equal(G.inspectDrop(r,b,0,0).status,'mergeable');assert.ok(G.move(r,b.id,0,0).merge);assert.equal(a.tier,2);assert.equal(a.rot,true);assert.equal(a.progress,.3);assert.equal(r.bench.length,0);});
test('overlapping more than one item is invalid even with a matching target',()=>{const[,r]=empty(),a=G.item('sword',1,0,0),b=G.item('potion',1,1,0),moving=G.item('sword');moving.rot=true;r.items=[a,b];r.bench=[moving];assert.equal(G.inspectDrop(r,moving,0,0).status,'invalid');const before=JSON.stringify(r);assert.equal(G.move(r,moving.id,0,0).ok,false);assert.equal(JSON.stringify(r),before);});
test('different type, unequal tier and Tier III reject merges',()=>{const[,r]=empty(),a=G.item('sword',3,0,0),b=G.item('sword',3);r.items=[a];r.bench=[b];assert.equal(G.move(r,b.id,0,0).ok,false);b.tier=2;assert.equal(G.move(r,b.id,0,0).ok,false);b.type='potion';assert.equal(G.move(r,b.id,0,0).ok,false);});
test('move and bench transfer retain cooldown and rotation',()=>{const[,r]=empty(),it=G.item('sword',2,0,0);it.progress=.77;it.rot=true;r.items=[it];assert.ok(G.move(r,it.id,2,2).ok);assert.equal(it.progress,.77);assert.ok(G.toBench(r,it.id));assert.equal(it.rot,true);assert.equal(it.progress,.77);assert.equal(r.items.length,0);assert.equal(r.bench.length,1);});
test('rotation swaps dimensions only when the full footprint is free',()=>{const[,r]=empty(),it=G.item('sword',1,0,0);r.items=[it];assert.ok(G.rotate(r,it.id).ok);assert.equal(G.dimensions(it).w,2);assert.ok(G.rotate(r,it.id).ok);r.items.push(G.item('potion',1,1,0));assert.equal(G.rotate(r,it.id).ok,false);assert.equal(it.rot,false);});
test('rotation rejects out-of-bounds and never performs a merge',()=>{const[,r]=empty(),it=G.item('sword',1,4,0);r.items=[it];assert.equal(G.rotate(r,it.id).ok,false);it.x=0;r.items.push(G.item('sword',1,1,0));assert.equal(G.rotate(r,it.id).ok,false);assert.equal(it.tier,1);});
test('combat locks move, rotate, bench, sell, buy and reroll without mutations',()=>{const[p,r]=fresh();G.start(r,p);const snapshot=JSON.stringify({p,r}),id=r.items[0].id;assert.equal(G.move(r,id,3,3).ok,false);assert.equal(G.rotate(r,id).ok,false);assert.equal(G.toBench(r,id),false);assert.equal(G.sell(r,id),0);assert.equal(G.buy(r,0).ok,false);assert.equal(G.reroll(r,p),false);assert.equal(JSON.stringify({p,r}),snapshot);});
test('buy spends travel funds once and leaves permanent silver untouched',()=>{const[p,r]=fresh(),offer=r.shop[0],before=r.travelFunds,silver=p.silver,n=r.bench.length;assert.ok(G.buy(r,0).ok);assert.equal(r.travelFunds,before-G.TYPES[offer.type].price);assert.equal(p.silver,silver);assert.equal(r.bench.length,n+1);assert.equal(r.shop[0],null);const money=r.travelFunds;assert.equal(G.buy(r,0).ok,false);assert.equal(r.travelFunds,money);});
test('permanent silver cannot cover insufficient travel funds',()=>{const[p,r]=fresh();p.silver=100000;r.travelFunds=0;const before=JSON.stringify({p,r});assert.equal(G.buy(r,0).ok,false);assert.equal(G.reroll(r,p),false);assert.equal(JSON.stringify({p,r}),before);});
test('shop lock prevents reroll and preserves inventory across round transitions',()=>{const[p,r]=fresh();r.shopLocked=true;const before=JSON.stringify(r.shop);assert.equal(G.reroll(r,p),false);G.start(r,p);G.finish(r,p,true);assert.ok(advance(p,r));assert.equal(JSON.stringify(r.shop),before);assert.equal(r.round,2);});
test('selling removes item once and only credits travel funds',()=>{const[p,r]=fresh(),id=r.bench[0].id,before=r.travelFunds,silver=p.silver;const value=G.sell(r,id);assert.ok(value>0);assert.equal(r.travelFunds,before+value);assert.equal(p.silver,silver);assert.equal(G.sell(r,id),0);});
test('combat requires a damaging weapon',()=>{const[p,r]=empty();r.items=[G.item('shield',1,0,0)];assert.equal(G.start(r,p),false);assert.equal(r.phase,'prepare');});
test('haste equipment activates and increases weapon cooldown speed',()=>{const[p,r]=empty();r.items=[G.item('sword',1,0,0),G.item('rune',1,2,0)];G.start(r,p);r.enemies.forEach(e=>{e.hp=10000;e.maxHp=10000;e.damage=0;});const rune=r.items[1];rune.progress=.999;G.tick(r,p,.05);assert.equal(r.haste,30);const sword=r.items[0],before=sword.progress;G.tick(r,p,.1);assert.ok(sword.progress-before>.1/G.TYPES.sword.cd);});
test('healing holds ready at full HP and shield caps at 120',()=>{const[p,r]=fresh();G.start(r,p);r.enemies.forEach(e=>{e.hp=10000;e.damage=0;});const pot=r.items.find(i=>i.type==='potion');pot.progress=1;G.tick(r,p,.1);assert.equal(pot.progress,1);r.hp=100;G.tick(r,p,.1);assert.ok(r.hp>100);r.shield=119;const shield=r.items.find(i=>i.type==='shield');shield.progress=1;G.tick(r,p,.1);assert.equal(r.shield,120);});
test('natural full stage victory grants first reward once and waits between rounds',()=>{const[p,r]=fresh();for(const it of r.items)it.tier=3;for(let round=1;round<=5;round++){while(G.benchStatus(r).overflow)G.sell(r,r.bench[0].id);assert.ok(G.start(r,p));settle(p,r);assert.equal(r.phase,'victory');const before=p.silver;G.tick(r,p,500);assert.equal(p.silver,before);if(round<5){assert.equal(r.round,round);advance(p,r);}}assert.equal(r.reward.first,true);assert.ok(p.cleared.includes(0));const before=p.silver;assert.equal(G.finish(r,p,true),false);assert.equal(p.silver,before);const second=G.newRun(p);second.round=5;G.start(second,p);G.finish(second,p,true);assert.equal(second.reward.first,false);assert.equal(second.reward.bonus,0);});
test('loss and retry preserve round and equipment but reset HP and cooldown',()=>{const[p,r]=fresh();r.round=3;G.start(r,p);r.hp=1;r.enemies[0].progress=1;r.enemies[0].damage=1000;const money=p.silver;G.tick(r,p,.01);assert.equal(r.phase,'defeat');assert.equal(p.silver,money);assert.ok(G.retry(r));assert.equal(r.round,3);assert.equal(r.hp,180);assert.equal(r.items.length,3);assert.ok(r.items.every(i=>i.progress===0));});
test('farm accepts only cleared stages and caps at 12 hours, with no double claim',()=>{const[p]=fresh();assert.equal(G.selectFarm(p,0,1000000),false);p.cleared.push(0);G.selectFarm(p,0,1000000);G.settleFarm(p,1000000+15*3600000);assert.equal(p.farm.elapsed,43200);assert.equal(p.farm.pending.silver,1560);assert.equal(G.claimFarm(p,1000000+15*3600000).silver,1560);assert.equal(G.claimFarm(p,1000000+15*3600000),null);});
test('farm config changes preserve prior accrual and time cap',()=>{const[p]=fresh();p.cleared.push(0,1);G.selectFarm(p,0,1000000);G.selectFarm(p,1,4600000);assert.equal(p.farm.pending.silver,130);assert.equal(p.farm.elapsed,3600);G.upgrade(p,'sword',8200000);assert.equal(p.farm.pending.silver,195);assert.equal(p.farm.elapsed,7200);const restored=JSON.parse(JSON.stringify(p));G.settleFarm(restored,8200000);assert.equal(restored.farm.pending.silver,195);});
test('breakthrough enforces level and currency prerequisites',()=>{const[p]=fresh();assert.equal(G.breakthrough(p,'sword'),false);p.upgrades.sword=3;const before=p.gems;assert.ok(G.breakthrough(p,'sword'));assert.equal(p.gems,before-10);assert.equal(p.breakthroughs.sword,1);assert.equal(G.breakthrough(p,'sword'),false);});

test('repeated sale of starter equipment and restart cannot generate permanent currency',()=>{
  const p=G.newProfile(1000000), permanent=()=>JSON.stringify([p.silver,p.gems,p.mats,p.shards,p.cleared]);
  const before=permanent();
  for(let attempt=0;attempt<100;attempt++){
    const r=G.newRun(p);assert.equal(r.travelFunds,60);
    for(const it of G.allItems(r))assert.ok(G.sell(r,it.id)>0);
    assert.equal(r.travelFunds,151);assert.equal(permanent(),before);
  }
});
test('shop and reroll work with zero permanent silver and only spend travel funds',()=>{
  const[p,r]=fresh();p.silver=0;
  assert.ok(G.reroll(r,p));assert.equal(r.travelFunds,50);assert.equal(p.silver,0);
  r.shop=[{type:'sword',tier:1}];assert.ok(G.buy(r,0).ok);
  assert.equal(r.travelFunds,18);assert.equal(p.silver,0);
});
test('round rewards and transition retain remaining funds without a new allowance',()=>{
  const[p,r]=fresh(),silver=p.silver,mats=p.mats;G.reroll(r,p);
  G.start(r,p);G.finish(r,p,true);
  assert.equal(p.silver,silver+20);assert.equal(p.mats,mats+1);assert.equal(r.travelFunds,50);
  assert.ok(advance(p,r));assert.equal(r.travelFunds,50);assert.equal(r.round,2);
});
test('repeated defeat and retry never replenish funds or remove prior rewards',()=>{
  const[p,r]=fresh();G.start(r,p);G.finish(r,p,true);advance(p,r);G.reroll(r,p);
  const silver=p.silver,mats=p.mats;
  for(let attempt=0;attempt<10;attempt++){
    p.energy.value=30;G.start(r,p);G.finish(r,p,false);assert.ok(G.retry(r));
    assert.equal(r.round,2);assert.equal(r.travelFunds,50);
    assert.equal(p.silver,silver);assert.equal(p.mats,mats);
  }
});
test('boss victory expires remaining funds without conversion or duplicate rewards',()=>{
  const[p,r]=fresh();G.sell(r,r.bench[0].id);const funds=r.travelFunds,silver=p.silver;
  r.round=5;G.start(r,p);G.finish(r,p,true);
  assert.equal(r.travelFunds,0);assert.equal(r.reward.discardedTravelFunds,funds);
  assert.equal(p.silver,silver+G.STAGES[0].reward+G.STAGES[0].first);
  const after=JSON.stringify({p,r});assert.equal(G.finish(r,p,true),false);
  assert.equal(JSON.stringify({p,r}),after);assert.equal(G.sell(r,r.items[0].id),0);
  assert.equal(G.newRun(p).travelFunds,60);
});
test('starting over keeps earned permanent rewards but does not transfer run funds',()=>{
  const[p,r]=fresh();G.start(r,p);G.finish(r,p,true);advance(p,r);
  G.sell(r,r.bench[0].id);const silver=p.silver,mats=p.mats;
  assert.ok(r.travelFunds>60);const next=G.newRun(p);
  assert.equal(next.travelFunds,60);assert.equal(next.round,1);
  assert.equal(p.silver,silver);assert.equal(p.mats,mats);assert.equal(p.cleared.length,0);
});
test('permanent upgrades cannot use run funds and do not change them',()=>{
  const[p,r]=fresh(),cost=G.upgradeCost(p,'sword');
  assert.ok(G.upgrade(p,'sword',1000000));assert.equal(p.silver,320-cost.silver);
  assert.equal(r.travelFunds,60);p.silver=0;r.travelFunds=10000;
  assert.equal(G.upgrade(p,'sword',1000000),false);assert.equal(r.travelFunds,10000);
});
test('existing version 2 profile reload keeps permanent progress with a fresh run allowance',()=>{
  const[p,r]=fresh();G.reroll(r,p);p.silver=987;p.upgrades.sword=2;p.cleared=[0];
  const restored=JSON.parse(JSON.stringify(p)),next=G.newRun(restored);
  assert.equal(restored.version,2);assert.equal(restored.silver,987);
  assert.equal(restored.upgrades.sword,2);assert.equal(restored.cleared[0],0);
  assert.equal(Object.hasOwn(restored,'travelFunds'),false);assert.equal(next.travelFunds,60);
});

test('normal victory offers three packs without automatically granting equipment',()=>{
 const[p,r]=fresh(),bench=r.bench.length;G.start(r,p);G.finish(r,p,true);
 assert.equal(r.bench.length,bench);assert.equal(r.supply.packs.length,3);
 assert.equal(r.supply.round,1);assert.equal(r.supply.selected,null);
 const before=JSON.stringify({p,r});assert.equal(G.nextRound(r,p),false);
 assert.equal(G.start(r,p),false);assert.equal(G.retry(r),false);
 assert.equal(JSON.stringify({p,r}),before);
});
test('every loadout has a guaranteed pack and varied unlocked alternatives across seeds',()=>{
 const types=Object.keys(G.TYPES);
 for(let a=0;a<types.length;a++)for(let b=a+1;b<types.length;b++)for(let c=b+1;c<types.length;c++)for(let seed=1;seed<=30;seed++){
  const p=G.newProfile();p.seed=seed;p.loadout=[types[a],types[b],types[c]];
  const r=G.newRun(p);r.phase='fighting';G.finish(r,p,true);const packs=r.supply.packs;
  assert.ok(packs.some(pack=>pack.items.every(o=>p.loadout.includes(o.type))));
  assert.ok(packs.some(pack=>pack.items.some(o=>!p.loadout.includes(o.type))));
  assert.equal(new Set(packs.map(pack=>pack.items.map(o=>o.type).sort().join(','))).size,3);
  for(const pack of packs){
   assert.equal(pack.items.length,3);
   for(const o of pack.items){assert.ok(p.owned.includes(o.type));assert.equal(o.tier,1);assert.equal(o.outside,!p.loadout.includes(o.type));}
   const kinds={ 'Tấn công':['damage'],'Phòng thủ':['block','heal'],'Hỗ trợ':['haste','heal']}[pack.name];
   assert.ok(pack.items.slice(0,2).every(o=>kinds.includes(G.TYPES[o.type].kind)));
  }
 }
});
test('supply never offers locked types and supports a collection limited to the loadout',()=>{
 const[p]=fresh();p.owned=['sword','shield','potion'];p.loadout=[...p.owned];const r=G.newRun(p);
 G.start(r,p);G.finish(r,p,true);
 for(const pack of r.supply.packs)for(const o of pack.items)assert.ok(p.owned.includes(o.type));
 assert.ok(r.supply.packs.every(pack=>pack.loadoutOnly));
});
test('choosing a pack grants exactly its preview once without spending either currency',()=>{
 const[p,r]=fresh();G.start(r,p);G.finish(r,p,true);const n=r.bench.length,silver=p.silver,funds=r.travelFunds;
 const expected=JSON.stringify(r.supply.packs[2].items.map(o=>[o.type,o.tier]));
 for(const bad of [-1,3,1.5,'0',null])assert.equal(G.chooseSupply(r,bad),false);
 assert.ok(G.chooseSupply(r,2));assert.equal(r.bench.length,n+3);
 assert.equal(JSON.stringify(r.bench.slice(n).map(o=>[o.type,o.tier])),expected);
 assert.equal(p.silver,silver);assert.equal(r.travelFunds,funds);
 const after=JSON.stringify({p,r});assert.equal(G.chooseSupply(r,0),false);assert.equal(G.finish(r,p,true),false);
 assert.equal(JSON.stringify({p,r}),after);assert.ok(G.nextRound(r,p));assert.equal(r.phase,'prepare');
 assert.equal(r.supply,null);assert.equal(G.chooseSupply(r,2),false);
});
test('pending offers remain fixed despite other profile random draws',()=>{
 const[p,r]=fresh();G.start(r,p);G.finish(r,p,true);const offers=JSON.stringify(r.supply),n=r.bench.length;
 for(let i=0;i<20;i++){G.random(p);G.nextRound(r,p);G.finish(r,p,true);}
 assert.equal(JSON.stringify(r.supply),offers);assert.equal(r.bench.length,n);
});
test('defeat and retry grant no supply; winning the retry grants one set',()=>{
 const[p,r]=fresh();const n=r.bench.length;
 for(let i=0;i<5;i++){G.start(r,p);G.finish(r,p,false);assert.equal(r.supply,null);assert.equal(G.chooseSupply(r,0),false);G.retry(r);}
 assert.equal(r.bench.length,n);G.start(r,p);G.finish(r,p,true);assert.ok(G.chooseSupply(r,0));assert.equal(r.bench.length,n+3);
});
test('four normal rounds each grant one pack while the boss grants no supply',()=>{
 const[p,r]=fresh(),n=r.bench.length;
 for(let round=1;round<=4;round++){G.start(r,p);G.finish(r,p,true);assert.equal(r.supply.round,round);advance(p,r);assert.equal(r.bench.length,n+round*3);}
 assert.equal(r.bench.length,n+12);while(G.benchStatus(r).overflow)G.sell(r,r.bench[0].id);
 assert.ok(G.start(r,p));G.finish(r,p,true);assert.equal(r.supply,null);assert.equal(G.chooseSupply(r,0),false);
 assert.equal(r.bench.length,12);assert.equal(r.reward.boss,true);
});

const stepFor=(p,r,seconds)=>{for(let time=0;time<seconds&&r.phase==='fighting';time+=.05)G.tick(r,p,Math.min(.05,seconds-time));};
test('all five elements follow the counter cycle including neutral and reverse relationships',()=>{
 const beats={metal:'wood',wood:'earth',earth:'water',water:'fire',fire:'metal'};
 for(const attack of Object.keys(beats))for(const defense of Object.keys(beats))assert.equal(G.elementMultiplier(attack,defense),beats[attack]===defense?1.2:beats[defense]===attack?.9:1);
 assert.equal(G.elementMultiplier(null,'fire'),1);
});
test('four weapon styles target front or back and apply the element before armor',()=>{
 const cases=[['sword',0,24],['blade',0,48],['bow',1,37],['needles',1,14]];
 for(const[type,target,value]of cases){
  const[p,r]=empty();const it=G.item(type,1,0,0);r.items=[it];G.start(r,p);
  const weak=G.ELEMENTS[G.TYPES[type].element].beats;
  r.enemies=[0,1].map(id=>({id,hp:500,maxHp:500,shield:0,armor:5,element:weak,damage:0,cd:1000,progress:0,age:0}));
  it.progress=1;G.tick(r,p,.001);
  assert.equal(r.enemies[target].hp,500-Math.round(value*1.2-5));assert.equal(r.enemies[1-target].hp,500);
 }
 assert.equal(new Set(Object.values(G.TYPES).filter(t=>t.kind==='damage').map(t=>t.range+'/'+t.style)).size,4);
});
test('armor preserves at least 20 percent damage and shield absorbs the remaining hit',()=>{
 const[p,r]=empty(),it=G.item('sword',1,0,0);r.items=[it];G.start(r,p);
 r.enemies=[{id:0,hp:100,maxHp:100,shield:3,armor:100,element:'metal',damage:0,cd:1000,progress:0,age:0}];
 it.progress=1;G.tick(r,p,.001);assert.equal(r.enemies[0].shield,0);assert.equal(r.enemies[0].hp,98);
});
test('encounter previews are pure and exactly match initial combat enemies',()=>{
 const[p,r]=fresh();const before=JSON.stringify({p,r});
 for(let stage=0;stage<5;stage++)for(let round=1;round<=5;round++){
  const info=G.encounterInfo(stage,round);assert.equal(JSON.stringify(info.enemies),JSON.stringify(G.spawnEnemies({stage,round})));
 }
 assert.equal(JSON.stringify({p,r}),before);
 assert.ok(G.spawnEnemies({stage:0,round:4}).length>G.spawnEnemies({stage:0,round:1}).length);
 assert.ok(G.spawnEnemies({stage:1,round:1}).every(e=>e.armor>0));
 assert.ok(G.spawnEnemies({stage:2,round:1}).every(e=>e.mechanic==='charge'));
});
test('fox boss summons a bounded front line and cannot summon after death',()=>{
 const[p,r]=fresh();r.round=5;G.start(r,p);r.items=[];r.hp=r.maxHp=10000;const boss=r.enemies[0];
 stepFor(p,r,8.1);assert.equal(r.enemies.filter(e=>e.summoned).length,2);assert.equal(r.enemies.at(-1),boss);
 stepFor(p,r,16);assert.equal(r.enemies.filter(e=>e.summoned).length,2);
 r.enemies.find(e=>e.summoned).hp=0;stepFor(p,r,8);assert.equal(r.enemies.filter(e=>e.summoned&&e.hp>0).length,2);
 assert.equal(new Set(r.enemies.map(e=>e.id)).size,r.enemies.length);
 boss.hp=0;const ids=r.enemies.map(e=>e.id).join(',');stepFor(p,r,9);assert.equal(r.enemies.map(e=>e.id).join(','),ids);
 for(const e of r.enemies)e.hp=0;G.tick(r,p,.01);assert.equal(r.phase,'victory');
});
test('golem boss alternates six seconds of armor and four seconds exposed',()=>{
 const[p]=fresh(),r=G.newRun(p,1);r.round=5;G.start(r,p);r.items=[];r.hp=r.maxHp=10000;const boss=r.enemies[0];
 assert.equal(G.enemyArmor(boss),18);stepFor(p,r,6.1);assert.equal(G.enemyArmor(boss),0);assert.match(G.enemyStatus(boss),/Hở giáp/);
 stepFor(p,r,4);assert.equal(G.enemyArmor(boss),18);
});
test('bird boss telegraphs before its heavy strike and retry resets its mechanic',()=>{
 const[p]=fresh(),r=G.newRun(p,2);r.round=5;G.start(r,p);const gear=r.items;r.items=[];r.hp=r.maxHp=1000;const boss=r.enemies[0];
 stepFor(p,r,6.1);assert.equal(r.hp,1000);assert.match(G.enemyStatus(boss),/TÍCH LỰC/);
 stepFor(p,r,2);assert.equal(r.hp,1000-boss.damage);
 G.finish(r,p,false);G.retry(r);r.items=gear;G.start(r,p);assert.equal(r.enemies[0].progress,0);assert.equal(r.enemies[0].age,0);
});
test('energy charges every round and retry but never selection, invalid start or double start',()=>{
 const now=1000000,p=G.newProfile(now),r=G.newRun(p);assert.equal(p.energy.value,30);
 assert.ok(G.start(r,p,now));assert.equal(p.energy.value,25);assert.equal(G.start(r,p,now),false);assert.equal(p.energy.value,25);
 G.finish(r,p,true);advance(p,r);assert.equal(p.energy.value,25);assert.ok(G.start(r,p,now));assert.equal(p.energy.value,20);
 G.finish(r,p,false);G.retry(r);assert.equal(p.energy.value,20);assert.ok(G.start(r,p,now));assert.equal(p.energy.value,15);
 G.finish(r,p,false);G.retry(r);r.items=[];assert.equal(G.start(r,p,now),false);assert.equal(p.energy.value,15);
});
test('insufficient energy blocks combat without consuming money or changing the round',()=>{
 const now=1000000,p=G.newProfile(now),r=G.newRun(p);p.energy.value=4;const before=JSON.stringify({p,r});
 assert.equal(G.start(r,p,now),false);assert.equal(JSON.stringify({p,r}),before);
 G.settleEnergy(p,now+300000);assert.ok(G.start(r,p,now+300000));assert.equal(p.energy.value,0);
});
test('energy regenerates offline with fractional time preserved, capped without stored overflow',()=>{
 const now=1000000,p=G.newProfile(now);p.energy.value=0;
 G.settleEnergy(p,now+450000);assert.equal(p.energy.value,1);assert.equal(G.energyWait(p,now+450000),150000);
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),now+600000);assert.equal(restored.energy.value,2);
 G.settleEnergy(restored,now+24*3600000);assert.equal(restored.energy.value,30);
 const r=G.newRun(restored);G.start(r,restored,now+24*3600000);G.settleEnergy(restored,now+24*3600000+1000);assert.equal(restored.energy.value,25);
});
test('clock rollback cannot restore energy or reset daily purchase limits',()=>{
 const now=Date.parse('2026-11-04T08:00:00Z'),p=G.newProfile(now);p.energy.value=0;p.energy.silverBuys=3;
 G.settleEnergy(p,now-86400000);assert.equal(p.energy.value,0);assert.equal(p.energy.silverBuys,3);assert.equal(p.energy.last,now);
});
test('energy purchases use permanent currencies, enforce cap, funds and daily silver limit',()=>{
 const now=1000000,p=G.newProfile(now);p.energy.value=0;p.silver=500;
 for(let i=0;i<3;i++)assert.equal(G.buyEnergy(p,'silver',now).ok,true);
 assert.equal(p.energy.value,30);assert.equal(p.silver,200);const before=JSON.stringify(p);
 assert.equal(G.buyEnergy(p,'gems',now).ok,false);assert.equal(JSON.stringify(p),before);
 p.energy.value=0;assert.equal(G.buyEnergy(p,'silver',now).ok,false);
 assert.equal(G.buyEnergy(p,'gems',now).ok,true);assert.equal(p.gems,20);assert.equal(p.energy.value,10);
 p.silver=0;p.gems=0;assert.equal(G.buyEnergy(p,'gems',now).ok,false);assert.equal(G.buyEnergy(p,'travelFunds',now).ok,false);
});
test('daily silver purchase allowance resets at midnight UTC+7',()=>{
 const now=Date.parse('2026-11-04T16:59:00Z'),p=G.newProfile(now);p.energy.value=0;p.energy.silverBuys=3;
 assert.equal(G.buyEnergy(p,'silver',now).ok,false);
 assert.equal(G.buyEnergy(p,'silver',now+60000).ok,true);assert.equal(p.energy.silverBuys,1);assert.equal(p.energy.day,'2026-11-05');
});
test('legacy profile migration keeps progress and supplies defaults for new equipment and energy',()=>{
 const p=G.newProfile(1000000);delete p.energy;delete p.upgrades.blade;delete p.upgrades.needles;delete p.breakthroughs.blade;delete p.breakthroughs.needles;
 p.owned=p.owned.filter(t=>!['blade','needles'].includes(t));p.silver=987;p.upgrades.sword=4;p.cleared=[0,1];
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),2000000);
 assert.equal(restored.silver,987);assert.equal(restored.upgrades.sword,4);assert.equal(restored.cleared.length,2);
 assert.equal(restored.energy.value,30);assert.equal(restored.upgrades.blade,0);assert.equal(restored.breakthroughs.needles,0);
 assert.ok(restored.owned.includes('blade'));assert.ok(Number.isFinite(G.power(restored,G.item('needles'))));
});
test('auto farm never consumes energy',()=>{
 const p=G.newProfile(1000000);p.cleared=[0];p.energy.value=0;const before=JSON.stringify(p.energy);
 G.selectFarm(p,0,1000000);G.claimFarm(p,4600000);assert.equal(JSON.stringify(p.energy),before);assert.ok(p.silver>320);
});

test('new 3x3 bag starts with seven occupied cells and leaves overflowing loadout items on the bench',()=>{
 const[p,r]=fresh();assert.equal(p.bagSize,3);assert.equal(r.bagSize,3);assert.equal(r.items.reduce((sum,it)=>sum+G.cells(it).length,0),7);
 p.loadout=['sword','shield','censer'];const crowded=G.newRun(p);
 assert.ok(crowded.bench.some(it=>it.type==='censer'));assert.equal(G.allItems(crowded).length,6);
 assert.ok(crowded.items.every(it=>G.cells(it).every(c=>c.x<3&&c.y<3)));
});
test('locked cells reject placement, partial footprints and rotation without consuming items',()=>{
 const[p,r]=empty();r.bagSize=3;const it=G.item('sword');r.bench=[it];
 for(const[x,y]of [[3,0],[0,3],[2,2]]){const before=JSON.stringify(r);assert.equal(G.move(r,it.id,x,y).ok,false);assert.equal(JSON.stringify(r),before);}
 assert.ok(G.move(r,it.id,2,0).ok);assert.equal(G.rotate(r,it.id).ok,false);
 for(const size of [3,4,5]){G.resizeBag(r,size);it.x=size-1;it.y=0;assert.equal(G.rotate(r,it.id).ok,false);}
});
test('bag expansion enforces ordered prices, exact boss gates and permanent silver',()=>{
 const[p,r]=fresh();p.silver=5000;r.travelFunds=10000;const before=JSON.stringify(p);
 assert.equal(G.upgradeBag(p,4),false);assert.equal(JSON.stringify(p),before);
 p.cleared=[0];p.silver=499;assert.equal(G.upgradeBag(p,4),false);
 p.silver=2000;assert.equal(G.upgradeBag(p,5),false);assert.ok(G.upgradeBag(p,4));assert.equal(p.silver,1500);assert.equal(p.bagSize,4);
 assert.equal(G.upgradeBag(p,4),false);assert.equal(G.upgradeBag(p,5),false);
 p.cleared.push(2);assert.ok(G.upgradeBag(p,5));assert.equal(p.silver,0);assert.equal(p.bagSize,5);assert.equal(r.travelFunds,10000);
 assert.equal(G.bagUpgrade(p),null);assert.equal(G.upgradeBag(p,5),false);
});
test('purchased expansion survives profile reload and is used by new runs',()=>{
 const[p]=fresh();p.silver=500;p.cleared=[0];G.upgradeBag(p,4);
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);
 assert.equal(restored.bagSize,4);assert.equal(G.newRun(restored).bagSize,4);
 delete restored.bagSize;const legacy=G.restoreProfile(restored,1000000);
 assert.equal(legacy.bagSize,3);assert.equal(legacy.silver,0);assert.equal(legacy.cleared[0],0);
});
test('dev resize returns only out-of-area equipment to bench and leaves profile upgrades intact',()=>{
 const[p,r]=empty();p.bagSize=4;const inside=G.item('potion',2,0,0),outside=G.item('shield',3,3,3);outside.progress=.7;r.items=[inside,outside];
 const result=G.resizeBag(r,3);assert.equal(result.moved,1);assert.equal(r.items[0],inside);assert.equal(r.bench[0],outside);
 assert.equal(outside.x,null);assert.equal(outside.progress,.7);assert.equal(outside.tier,3);assert.equal(p.bagSize,4);
 assert.equal(G.resizeBag(r,2).ok,false);r.phase='fighting';assert.equal(G.resizeBag(r,5).ok,false);
});
test('merge preview compares two active weapons, released cells and inherited cooldown without mutation',()=>{
 const[p,r]=empty(),a=G.item('sword',1,0,0),b=G.item('sword',1,2,0);a.progress=.8;b.progress=.3;r.items=[a,b];
 const before=JSON.stringify({p,r}),info=G.mergePreview(r,p,a.id,b.id);
 assert.equal(info.pairArea,4);assert.equal(info.afterArea,2);assert.equal(info.freedNow,2);
 assert.equal(info.beforeRate,48/1.8);assert.equal(info.afterRate,24*1.7/1.8);assert.equal(info.progress,.3);assert.equal(info.sourceOnGrid,true);
 assert.equal(JSON.stringify({p,r}),before);assert.ok(G.move(r,a.id,b.x,b.y).merge);assert.equal(b.tier,info.tier);assert.equal(b.progress,info.progress);
});
test('merge from bench shows zero currently released cells and an increase in deployed output',()=>{
 const[p,r]=empty(),a=G.item('sword'),b=G.item('sword',1,0,0);r.bench=[a];r.items=[b];
 const info=G.mergePreview(r,p,a.id,b.id);assert.equal(info.sourceOnGrid,false);assert.equal(info.freedNow,0);
 assert.equal(info.deployedBeforeRate,24/1.8);assert.ok(info.afterRate>info.deployedBeforeRate);
});
test('support previews distinguish healing, shield and non-stacking haste',()=>{
 for(const type of ['potion','shield','rune']){
  const[p,r]=empty(),a=G.item(type),b=G.item(type,1,0,0);r.bench=[a];r.items=[b];
  const info=G.mergePreview(r,p,a.id,b.id);assert.equal(info.kind,G.TYPES[type].kind);
  if(type==='rune'){assert.equal(info.hasteBefore,30);assert.equal(info.hasteAfter,51);}else assert.ok(Math.abs(info.afterRate/info.beforeRate-.85)<1e-10);
 }
});
test('merge preview respects upgrades, target rotation and Tier II to III',()=>{
 const[p,r]=empty();p.upgrades.bow=2;p.breakthroughs.bow=1;const a=G.item('bow',2),b=G.item('bow',2,0,0);b.rot=true;r.bench=[a];r.items=[b];
 const info=G.mergePreview(r,p,a.id,b.id);assert.equal(info.tier,3);assert.equal(info.rot,true);
 assert.equal(info.afterRate,G.power(p,{type:'bow',tier:3})/G.TYPES.bow.cd);
});
test('invalid merges have no preview including occupied footprints and locked cells',()=>{
 const[p,r]=empty(),a=G.item('sword'),b=G.item('sword',1,0,0);r.bench=[a];r.items=[b];
 assert.equal(G.mergePreview(r,p,a.id,a.id),null);assert.equal(G.mergePreview(r,p,'missing',b.id),null);
 b.tier=2;assert.equal(G.mergePreview(r,p,a.id,b.id),null);a.tier=b.tier=3;assert.equal(G.mergePreview(r,p,a.id,b.id),null);
 a.tier=b.tier=1;r.phase='fighting';assert.equal(G.mergePreview(r,p,a.id,b.id),null);
 r.phase='prepare';r.bagSize=3;b.x=3;assert.equal(G.mergePreview(r,p,a.id,b.id),null);
 b.x=0;a.rot=true;r.items.push(G.item('potion',1,1,0));assert.equal(G.mergePreview(r,p,a.id,b.id),null);
});

function targetDummy(overrides={}){return{id:0,name:'Mục tiêu thử',kind:'golem',element:'metal',hp:1000,maxHp:1000,shield:0,maxShield:0,armor:0,damage:0,cd:1000,progress:0,age:0,...overrides};}
test('damage accounting separates actual HP, shield, armor, element and overkill',()=>{
 const[p,r]=empty(),weapon=G.item('sword',1,0,0);r.items=[weapon];G.start(r,p);r.enemies=[targetDummy({element:'wood',hp:10,maxHp:10,armor:5,shield:3,maxShield:3})];
 weapon.progress=1;G.tick(r,p,.05);const report=r.report,stats=report.items[0];
 assert.equal(report.won,true);assert.equal(stats.damage,10);assert.equal(stats.enemyShield,3);assert.ok(Math.abs(stats.armor-5)<1e-9);assert.ok(Math.abs(stats.elementGain-4.8)<1e-9);
 assert.equal(report.totals.damage,10);assert.equal(report.duration,.05);assert.equal(p.lastBattles['0:1'].totals.damage,10);
});
test('healing and shield accounting count effective gains and allocate carry shield first',()=>{
 const[p,r]=empty(),weapon=G.item('sword',1,0,0),shield=G.item('shield',1,1,0),potion=G.item('potion',1,3,0);
 r.items=[weapon,shield,potion];r.hp=175;r.shield=5;G.start(r,p);r.enemies=[targetDummy({damage:12,progress:1})];shield.progress=potion.progress=1;
 G.tick(r,p,.01);G.finish(r,p,false);const report=r.report,s=report.items.find(it=>it.type==='shield'),h=report.items.find(it=>it.type==='potion');
 assert.equal(h.healing,5);assert.equal(h.overheal,14);assert.equal(s.shieldMade,15);assert.equal(s.shieldAbsorbed,7);assert.equal(report.totals.carryShieldAbsorbed,5);
 assert.equal(report.totals.shieldAbsorbed,12);assert.equal(report.totals.hpLost,0);
});
test('lethal charged attack records exact cause and caps actual HP lost',()=>{
 const[p,r]=fresh();r.hp=30;r.shield=10;G.start(r,p);r.enemies=[targetDummy({name:'Yêu Điểu',mechanic:'charge',damage:100,progress:1})];G.tick(r,p,.01);
 assert.equal(r.report.won,false);assert.equal(r.report.totals.incoming,100);assert.equal(r.report.totals.hpLost,30);assert.equal(r.report.totals.shieldAbsorbed,10);
 assert.equal(r.report.lastHit.name,'Yêu Điểu');assert.equal(r.report.lastHit.kind,'charge');assert.equal(r.report.lastHit.hpLost,30);
 assert.equal(r.report.advice[0].code,'burst');
});
test('stats are per item including zero-use items while bench equipment is excluded',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.01);G.finish(r,p,true);
 assert.equal(r.report.items.length,r.items.length);assert.ok(r.report.items.every(it=>it.procs===0));assert.ok(r.report.items.every(it=>!r.bench.some(item=>item.id===it.id)));
});
test('new rounds and retries reset duration and metrics without archiving abandoned attempts',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,1);G.retry(r);assert.equal(Object.keys(p.lastBattles).length,0);
 G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.25);G.finish(r,p,true);assert.equal(r.report.duration,.25);advance(p,r);
 G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);assert.equal(r.report.duration,.1);assert.ok(r.elapsed>1);assert.equal(Object.keys(p.lastBattles).length,2);
});
test('comparison is isolated to stage and round, flags changed gear upgrades bag and starting HP',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);const first=p.lastBattles['0:1'];
 const next=G.newRun(p);next.items[0].tier=2;next.bagSize=4;next.hp=100;p.upgrades.sword=1;G.start(next,p);next.enemies=[targetDummy()];G.tick(next,p,.2);G.finish(next,p,true);
 const comparison=next.report.comparison;assert.equal(comparison.before.duration,.1);assert.equal(comparison.after.duration,.2);assert.equal(comparison.changes.length,4);
 assert.equal(Object.keys(p.lastBattles).length,1);assert.equal(p.lastBattles['0:1'].won,true);assert.equal(first.won,false);
 assert.equal(G.compareBattles({...next.report,stage:1},first),null);assert.equal(G.compareBattles({...next.report,round:2},first),null);
 assert.equal(Object.hasOwn(comparison,'previousReport'),false);
});
test('matching setups do not claim changes and report snapshots cannot mutate the saved record',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);
 const next=G.newRun(p);G.start(next,p);next.enemies=[targetDummy()];G.tick(next,p,.1);G.finish(next,p,false);
 assert.equal(next.report.comparison.changes.length,0);next.report.items[0].damage=99999;
 assert.notEqual(p.lastBattles['0:1'].items[0].damage,99999);
});
test('debug outcomes and mid-combat debug changes never overwrite real results',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);const saved=JSON.stringify(p.lastBattles);
 G.retry(r);G.start(r,p);G.tick(r,p,.1);G.finish(r,p,true,{debug:true});assert.equal(r.report.debug,true);assert.equal(r.report.advice.length,0);assert.equal(JSON.stringify(p.lastBattles),saved);
 const another=G.newRun(p);G.start(another,p);G.tick(another,p,.1);another.battle.debug=true;G.finish(another,p,true);assert.equal(JSON.stringify(p.lastBattles),saved);
});
test('reports and comparisons survive reload, malformed records and extra keys are dropped',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);
 p.lastBattles['99:1']=p.lastBattles['0:1'];p.lastBattles['0:2']={version:1};
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)));assert.equal(Object.keys(restored.lastBattles).length,1);assert.equal(restored.lastBattles['0:1'].duration,.1);
 delete p.lastBattles;const legacy=G.restoreProfile(p);assert.equal(Object.keys(legacy.lastBattles).length,0);
});
test('advice is evidence-based, limited to two, with no unconditional upgrade recommendation',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,true);const report=r.report;
 assert.equal(G.battleAdvice(report).length,0);
 report.totals.outgoing=100;report.totals.armor=30;report.totals.elementLoss=20;report.totals.overheal=50;report.totals.healing=10;
 const advice=G.battleAdvice(report);assert.equal(advice.length,2);assert.equal(advice[0].code,'armor');assert.equal(advice[1].code,'element');assert.match(advice[0].evidence,/30/);
 assert.ok(advice.every(tip=>!tip.text.includes('nâng cấp')));
});
test('finishing or re-reading a completed fight cannot duplicate rewards or change its report',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy({hp:1,maxHp:1})];r.items[0].progress=1;G.tick(r,p,.1);
 const before=JSON.stringify({p,r});G.tick(r,p,10);assert.equal(G.finish(r,p,true),false);assert.equal(JSON.stringify({p,r}),before);
});

test('saved results stay bounded to one record for each of the 25 stage-round pairs',()=>{
 const p=G.newProfile();
 for(let stage=0;stage<5;stage++)for(let round=1;round<=5;round++){
  p.energy.value=30;const r=G.newRun(p,stage);r.round=round;G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.01);G.finish(r,p,false);
 }
 assert.equal(Object.keys(p.lastBattles).length,25);
 p.energy.value=30;const r=G.newRun(p);G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.02);G.finish(r,p,false);
 assert.equal(Object.keys(p.lastBattles).length,25);assert.equal(p.lastBattles['0:1'].duration,.02);
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)));assert.equal(Object.keys(restored.lastBattles).length,25);assert.equal(restored.lastBattles['0:1'].comparison.before.duration,.01);
});
test('shield attribution reconciles across multiple generators and carried shield',()=>{
 const[p,r]=empty(),weapon=G.item('sword',1,0,0),first=G.item('shield',1,1,0),second=G.item('shield',1,3,0);r.items=[weapon,first,second];r.shield=5;G.start(r,p);
 r.enemies=[targetDummy({damage:25,progress:1})];first.progress=second.progress=1;G.tick(r,p,.01);G.finish(r,p,false);
 const stats=r.report.items;assert.equal(stats.find(it=>it.id===first.id).shieldAbsorbed,15);assert.equal(stats.find(it=>it.id===second.id).shieldAbsorbed,5);
 assert.equal(r.report.totals.shieldAbsorbed,25);assert.equal(r.report.totals.carryShieldAbsorbed+stats.reduce((sum,it)=>sum+it.shieldAbsorbed,0),25);
});

test('farm yields stay independent of loadout, upgrades, breakthroughs and bag size',()=>{
 const[p]=fresh();p.cleared=[0,1,2,3,4];G.selectFarm(p,1,1000000);const rates=JSON.stringify(G.farmRates(p));
 p.loadout=['blade','needles','rune'];for(const t of Object.keys(G.TYPES)){p.upgrades[t]=20;p.breakthroughs[t]=5;}p.bagSize=5;
 assert.equal(JSON.stringify(G.farmRates(p)),rates);G.settleFarm(p,4600000);
 assert.equal(p.farm.pending.silver,65);assert.equal(p.farm.pending.mats,12);assert.equal(p.farm.pending.shards,1.5);
});
test('each early specialist remains the best source of its resource',()=>{
 const routes=G.FARM_ROUTES;for(const [i,key] of [[0,'silver'],[1,'mats'],[2,'shards']])for(let j=0;j<routes.length;j++)if(i!==j)assert.ok(routes[i][key]>routes[j][key]);
 for(let i=0;i<routes.length;i++)for(let j=0;j<routes.length;j++)if(i!==j)assert.ok(['silver','mats','shards'].some(k=>routes[i][k]>routes[j][k]),'No route is dominated in every resource');
});
test('route changes combine actual intervals, preserve cap and never award boss rewards',()=>{
 const[p]=fresh();p.cleared=[0,1,2];const energy=JSON.stringify(p.energy),gems=p.gems,cleared=JSON.stringify(p.cleared);
 G.selectFarm(p,0,1000000);G.selectFarm(p,1,4600000);G.selectFarm(p,2,8200000);G.settleFarm(p,11800000);
 assert.equal(p.farm.elapsed,10800);assert.equal(p.farm.pending.silver,260);assert.equal(p.farm.pending.mats,20);assert.equal(p.farm.pending.shards,8);
 G.claimFarm(p,11800000);assert.equal(p.gems,gems);assert.equal(JSON.stringify(p.energy),energy);assert.equal(JSON.stringify(p.cleared),cleared);
});
test('a full farm stays capped after switching routes, then resumes only after claim',()=>{
 const[p]=fresh();p.cleared=[0,1];G.selectFarm(p,0,1000000);G.settleFarm(p,1000000+20*3600000);const pending=JSON.stringify(p.farm.pending);
 G.selectFarm(p,1,1000000+21*3600000);G.settleFarm(p,1000000+22*3600000);assert.equal(JSON.stringify(p.farm.pending),pending);
 G.claimFarm(p,1000000+22*3600000);G.settleFarm(p,1000000+23*3600000);assert.equal(p.farm.pending.silver,65);assert.equal(p.farm.elapsed,3600);
});
test('claim preserves fractional resources and accepts a non-silver-only reward',()=>{
 const[p]=fresh();p.farm.pending={silver:.5,mats:2.75,shards:1.25};const before=p.mats;
 const reward=G.claimFarm(p,1000000);assert.equal(reward.silver,0);assert.equal(reward.mats,2);assert.equal(p.mats,before+2);
 assert.equal(p.farm.pending.silver,.5);assert.equal(p.farm.pending.mats,.75);assert.equal(p.farm.pending.shards,.25);
 assert.equal(G.claimFarm(p,1000000),null);
});
test('legacy farm accrues once with old loadout formula then switches without changing the source save',()=>{
 const[raw]=fresh();raw.cleared=[0];raw.upgrades.sword=5;raw.breakthroughs.sword=1;raw.farm={stage:0,last:1000000,elapsed:3600,pending:{silver:10.5,mats:2,shards:.5}};
 const before=JSON.stringify(raw),p=G.restoreProfile(raw,4600000);
 assert.equal(JSON.stringify(raw),before);assert.equal(p.farm.version,2);assert.equal(p.farm.elapsed,7200);
 assert.equal(p.farm.pending.silver,111.5);assert.ok(Math.abs(p.farm.pending.mats-8.2)<1e-9);assert.ok(Math.abs(p.farm.pending.shards-2.825)<1e-9);
 const reloaded=G.restoreProfile(JSON.parse(JSON.stringify(p)),4600000);assert.equal(reloaded.farm.pending.silver,111.5);
 G.settleFarm(reloaded,8200000);assert.equal(reloaded.farm.pending.silver,241.5);
});
test('legacy conversion respects remaining cap and preserves all existing progress',()=>{
 const[raw]=fresh();raw.cleared=[0,1];delete raw.farm.version;raw.farm.stage=1;raw.farm.elapsed=39600;raw.silver=1000;raw.bagSize=4;
 const p=G.restoreProfile(raw,1000000+15*3600000);assert.equal(p.farm.elapsed,43200);assert.equal(p.farm.pending.silver,104);assert.equal(p.silver,1000);assert.equal(p.bagSize,4);
 G.settleFarm(p,1000000+16*3600000);assert.equal(p.farm.pending.silver,104);
});
test('clock rollback cannot replay claimed farm intervals',()=>{
 const[p]=fresh();p.cleared=[0];G.selectFarm(p,0,1000000);G.settleFarm(p,4600000);
 assert.equal(G.claimFarm(p,2800000).silver,130);assert.equal(p.farm.last,4600000);
 G.settleFarm(p,4600000);assert.equal(p.farm.pending.silver,0);G.settleFarm(p,8200000);assert.equal(p.farm.pending.silver,130);
});
test('restore sanitizes malformed farm fields and rejects locked or invalid routes',()=>{
 const[raw]=fresh();raw.cleared=[0,0,-1,9,'1'];raw.farm={version:2,stage:4,last:NaN,elapsed:-100,pending:{silver:12,mats:NaN,shards:-2}};
 const p=G.restoreProfile(raw,1000000);assert.equal(p.cleared.length,1);assert.equal(p.farm.stage,null);assert.equal(p.farm.elapsed,0);assert.equal(p.farm.pending.silver,12);assert.equal(p.farm.pending.mats,0);
 const before=JSON.stringify(p);for(const i of [null,-1,1,5,'0',.5])assert.equal(G.selectFarm(p,i,4600000),false);assert.equal(JSON.stringify(p),before);
 assert.equal(G.claimFarm(p,1000000).silver,12);
});

test('presets use existing owned types, persist, and do not grant gear or spend currencies',()=>{
 const[p,r]=fresh(),runBefore=JSON.stringify(r),wallet=JSON.stringify([p.silver,p.mats,p.gems,p.energy,p.farm]);
 for(const preset of G.LOADOUT_PRESETS){assert.ok(G.selectLoadout(p,preset.id));assert.equal(p.loadout.length,3);assert.equal(JSON.stringify(p.loadout),JSON.stringify(preset.types));assert.ok(p.loadout.some(t=>G.TYPES[t].kind==='damage'));const next=G.newRun(p);assert.equal(next.items.length,3);for(const it of next.items)assert.equal(G.inspectDrop(next,it,it.x,it.y).status,'valid');}
 assert.equal(JSON.stringify(r),runBefore);assert.equal(JSON.stringify([p.silver,p.mats,p.gems,p.energy,p.farm]),wallet);
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);assert.equal(JSON.stringify(restored.loadout),JSON.stringify(p.loadout));
 const before=JSON.stringify(p);assert.equal(G.selectLoadout(p,'unknown'),false);assert.equal(JSON.stringify(p),before);
 p.owned=p.owned.filter(t=>t!=='bow');assert.equal(G.selectLoadout(p,'attack'),false);
});
test('changing a preset affects new runs but preserves current run supply affinity',()=>{
 const[p]=fresh();G.selectLoadout(p,'attack');const r=G.newRun(p),before=JSON.stringify(r.items);
 G.selectLoadout(p,'haste');assert.equal(JSON.stringify(r.items),before);assert.equal(r.loadout.join(','),'sword,bow,potion');
 G.start(r,p);G.finish(r,p,true);assert.ok(r.supply.packs.some(pack=>pack.items.every(it=>r.loadout.includes(it.type))));
 assert.equal(G.newRun(p).loadout.join(','),'blade,shield,rune');
});
test('round recovery heals 20 percent max HP once and preserves shield, haste and cooldown',()=>{
 const[p,r]=fresh();G.start(r,p);r.hp=80;r.shield=43;r.haste=16;r.hasteTime=2;r.items[0].progress=.7;G.finish(r,p,true);
 assert.equal(r.hp,80);assert.equal(G.nextRound(r,p),false);assert.equal(r.hp,80);G.chooseSupply(r,0);assert.equal(r.hp,80);
 const energy=p.energy.value;assert.ok(G.nextRound(r,p));assert.equal(r.hp,116);assert.equal(r.recovery,36);assert.equal(r.shield,43);assert.equal(r.haste,16);assert.equal(r.hasteTime,2);assert.equal(r.items[0].progress,.7);assert.equal(p.energy.value,energy);
 assert.equal(G.nextRound(r,p),false);G.tick(r,p,60);assert.equal(r.hp,116);
});
test('recovery is capped at max HP and never added for boss wins or defeat',()=>{
 const[p,r]=fresh();G.start(r,p);r.hp=170;G.finish(r,p,true);advance(p,r);assert.equal(r.hp,180);assert.equal(r.recovery,10);
 r.round=5;G.start(r,p);r.hp=90;G.finish(r,p,true);assert.equal(G.nextRound(r,p),false);assert.equal(r.hp,90);
 const next=G.newRun(p);G.start(next,p);G.finish(next,p,false);assert.equal(G.nextRound(next,p),false);assert.equal(next.hp,0);
});
test('rage warning and additive damage bonus begin at exact per-fight thresholds',()=>{
 assert.equal(G.combatPressure(54.99).warning,false);assert.equal(G.combatPressure(55).warning,true);assert.equal(G.combatPressure(59.9).bonus,0);
 assert.equal(G.combatPressure(60).warning,false);assert.equal(G.combatPressure(60).bonus,10);assert.equal(G.combatPressure(69.99).bonus,10);assert.equal(G.combatPressure(70).bonus,20);assert.equal(G.combatPressure(179.9).bonus,120);
});
test('rage scales every enemy from original damage without cumulative multiplication',()=>{
 const[p,r]=empty();r.items=[G.item('sword',1,0,0)];G.start(r,p);r.hp=r.maxHp=1000;
 const enemy=targetDummy({damage:10,progress:1});r.enemies=[enemy];r.battle.duration=59.99;G.tick(r,p,.01);assert.equal(r.hp,989);assert.equal(enemy.damage,10);assert.equal(r.battle.lastHit.rageBonus,10);
 enemy.progress=1;r.battle.duration=69.99;G.tick(r,p,.01);assert.equal(r.hp,977);assert.equal(enemy.damage,10);
 const add=targetDummy({id:99,name:'Hồ yêu con',damage:20,progress:1,summoned:true});r.enemies.push(add);G.tick(r,p,.01);assert.equal(r.hp,953);assert.equal(add.damage,20);
});
test('timeout preserves actual HP, records its cause, and grants no rewards or supplies',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy({damage:0,hp:100000,maxHp:100000})];r.battle.duration=179.95;r.hp=111;r.shield=19;
 const before=JSON.stringify([p.silver,p.mats,p.gems,p.cleared,p.energy,r.travelFunds]);G.tick(r,p,100);
 assert.equal(r.phase,'defeat');assert.equal(r.hp,111);assert.equal(r.report.duration,180);assert.equal(r.report.endHp,111);assert.equal(r.report.endReason,'timeout');assert.equal(r.report.lastHit,null);assert.equal(r.reward,null);assert.equal(r.supply,null);assert.equal(r.report.advice[0].code,'timeout');assert.equal(r.report.totals.hpLost,0);
 assert.equal(JSON.stringify([p.silver,p.mats,p.gems,p.cleared,p.energy,r.travelFunds]),before);
 const snapshot=JSON.stringify({p,r});G.tick(r,p,10);assert.equal(G.finish(r,p,true),false);assert.equal(JSON.stringify({p,r}),snapshot);
 const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);assert.equal(restored.lastBattles['0:1'].endReason,'timeout');assert.equal(restored.lastBattles['0:1'].endHp,111);
});
test('retry resets fight timer and rage, requires energy again, and cannot keep timeout HP',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];r.battle.duration=179.99;G.tick(r,p,.01);assert.ok(G.retry(r));assert.equal(r.battle,null);assert.equal(r.hp,180);assert.equal(r.shield,0);assert.ok(r.items.every(it=>it.progress===0));
 const energy=p.energy.value;assert.ok(G.start(r,p));assert.equal(p.energy.value,energy-5);assert.equal(r.battle.duration,0);assert.equal(G.combatPressure(r.battle.duration).bonus,0);
});
test('new rounds start a fresh clock while previous fight statistics stay frozen',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];r.battle.duration=70;G.finish(r,p,true);const report=JSON.stringify(r.report);
 advance(p,r);assert.equal(r.battle,null);assert.equal(JSON.stringify(r.report),report);assert.ok(G.start(r,p));assert.equal(r.battle.duration,0);assert.equal(r.battle.setup.startHp,r.hp);
});
test('paused/non-fighting time cannot trigger rage or timeout, simulation dt controls progression',()=>{
 const[p,r]=fresh();G.tick(r,p,100);assert.equal(r.battle,null);G.start(r,p);r.enemies=[targetDummy({damage:0,hp:100000})];
 G.tick(r,p,1);assert.equal(r.battle.duration,1);G.tick(r,p,2);assert.equal(r.battle.duration,3);G.tick(r,p,NaN);assert.equal(r.battle.duration,3);
 G.retry(r);G.tick(r,p,500);assert.equal(r.battle,null);assert.equal(r.phase,'prepare');
});
test('comparisons flag old combat rules but continue reading legacy reports',()=>{
 const[p,r]=fresh();G.start(r,p);r.enemies=[targetDummy()];G.tick(r,p,.1);G.finish(r,p,false);const old=JSON.parse(JSON.stringify(r.report));delete old.rulesVersion;delete old.endReason;delete old.rageBonus;
 p.lastBattles['0:1']=old;const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);assert.ok(restored.lastBattles['0:1']);
 G.retry(r);G.start(r,restored);G.tick(r,restored,.1);G.finish(r,restored,false);assert.ok(r.report.comparison.changes.includes('Quy tắc giao chiến đã thay đổi'));
});

test('balanced rune grants 30 percent, higher Tier wins over duplicates, and the buff expires',()=>{
 const[p,r]=empty();r.items=[G.item('sword',1,0,0),G.item('rune',2,1,0),G.item('rune',1,1,1)];G.start(r,p);r.enemies=[targetDummy({hp:100000,maxHp:100000,damage:0})];
 assert.equal(G.power(p,{type:'rune',tier:1}),30);r.items[1].progress=r.items[2].progress=1;G.tick(r,p,.01);assert.equal(r.haste,51);assert.equal(r.hasteTime,4);
 const progress=r.items[0].progress;G.tick(r,p,.1);assert.ok(Math.abs((r.items[0].progress-progress)-.1/G.TYPES.sword.cd*1.51)<1e-10);
 for(let i=0;i<41;i++)G.tick(r,p,.1);assert.equal(r.haste,0);assert.equal(r.hasteTime,0);assert.equal(G.TYPES.rune.cd,6);
});

// Step 9: capacity guards and explicit, atomic bench sale.
const fillBench=(r,n,type='shield')=>{while(r.bench.length<n)r.bench.push(G.item(type));};
test('bench holds twelve items independently of footprint and bag size',()=>{
 for(const size of [3,4,5]){const[,r]=fresh();r.bagSize=size;fillBench(r,12);assert.equal(G.benchStatus(r).space,0);assert.equal(G.benchStatus(r).overflow,0);r.bench.push(G.item('potion'));assert.equal(G.benchStatus(r).overflow,1);}
});
test('shop fills the last slot then rejects without consuming offer or travel funds',()=>{
 const[p,r]=fresh();fillBench(r,11);r.travelFunds=1000;assert.ok(G.buy(r,0).ok);assert.equal(r.bench.length,12);
 const before=JSON.stringify({p,r});assert.equal(G.buy(r,1).ok,false);assert.equal(JSON.stringify({p,r}),before);
});
test('all chests reject full and overflow benches before currency or random changes',()=>{
 for(const count of [12,14])for(let index=0;index<3;index++){const[p,r]=fresh();p.silver=1000;p.gems=100;fillBench(r,count);const before=JSON.stringify({p,r});assert.equal(G.openChest(r,p,index).ok,false);assert.equal(JSON.stringify({p,r}),before);}
});
test('all chests use the last free slot and grant precisely their advertised reward',()=>{
 for(let index=0;index<3;index++){const[p,r]=fresh();p.silver=1000;p.gems=100;fillBench(r,11);const c=G.CHESTS[index],silver=p.silver,gems=p.gems,mats=p.mats;
 const result=G.openChest(r,p,index);assert.ok(result.ok);assert.equal(r.bench.length,12);assert.equal(result.item.tier,c.tier);assert.equal(p.mats,mats+c.mats);assert.equal(p.silver,silver+c.money-(c.currency==='silver'?c.cost:0));assert.equal(p.gems,gems-(c.currency==='gems'?c.cost:0));}
});
test('invalid, unaffordable and non-preparation chests leave all state intact',()=>{
 const[p,r]=fresh();for(const index of [-1,3,1.5,'0',null]){const before=JSON.stringify({p,r});assert.equal(G.openChest(r,p,index).ok,false);assert.equal(JSON.stringify({p,r}),before);}
 p.silver=0;p.gems=0;let before=JSON.stringify({p,r});assert.equal(G.openChest(r,p,0).ok,false);assert.equal(JSON.stringify({p,r}),before);
 p.silver=1000;for(const phase of ['fighting','victory','defeat']){r.phase=phase;before=JSON.stringify({p,r});assert.equal(G.openChest(r,p,0).ok,false);assert.equal(JSON.stringify({p,r}),before);}
});
test('supply overflow keeps every item, heals once and blocks launch without charging energy',()=>{
 const[p,r]=fresh();fillBench(r,11);assert.ok(G.start(r,p,1000000));r.hp=80;G.finish(r,p,true);
 const preview=JSON.stringify(r.supply.packs[0].items.map(it=>[it.type,it.tier]));assert.ok(G.chooseSupply(r,0));assert.equal(r.bench.length,14);assert.equal(JSON.stringify(r.bench.slice(11).map(it=>[it.type,it.tier])),preview);assert.equal(G.chooseSupply(r,0),false);
 assert.ok(G.nextRound(r,p));assert.equal(r.hp,116);assert.equal(G.nextRound(r,p),false);
 const before=JSON.stringify({p,r});assert.equal(G.start(r,p,2000000),false);assert.equal(JSON.stringify({p,r}),before);
 const quote=G.quoteBenchSale(r,r.bench.slice(0,2).map(it=>it.id));assert.ok(G.sellBench(r,quote).ok);const energy=p.energy.value;assert.ok(G.start(r,p,1000000));assert.equal(p.energy.value,energy-5);
});
test('moving equipment to a full bench preserves identity, tier, rotation and cooldown',()=>{
 const[,r]=fresh();fillBench(r,12);const it=r.items[0];it.tier=2;it.rot=true;it.progress=.73;assert.ok(G.toBench(r,it.id));assert.equal(r.bench.length,13);assert.equal(r.bench.at(-1),it);assert.equal(it.tier,2);assert.equal(it.rot,true);assert.equal(it.progress,.73);
});
test('packing or merging can resolve overflow without sale',()=>{
 for(const merge of [false,true]){const[p,r]=empty();r.items=[G.item('sword',1,0,0)];r.bench=[G.item('sword')];fillBench(r,13,'potion');const funds=r.travelFunds;assert.ok(G.move(r,r.bench[0].id,merge?0:2,0).ok);assert.equal(r.bench.length,12);assert.equal(r.travelFunds,funds);assert.ok(G.start(r,p,1000000));}
});
test('batch sale quotes mixed tiers and sells only selected bench items into travel funds',()=>{
 const[p,r]=fresh();r.bench=[G.item('sword',1),G.item('bow',2),G.item('rune',3)];const keep=r.bench[2];keep.progress=.37;keep.rot=true;
 const beforeProfile=JSON.stringify(p),grid=JSON.stringify(r.items),funds=r.travelFunds,quote=G.quoteBenchSale(r,r.bench.slice(0,2).map(it=>it.id));
 const total=Math.floor(G.TYPES.sword.price*.45)+Math.floor(G.TYPES.bow.price*.45*1.7);assert.ok(quote.ok);assert.equal(quote.total,total);assert.equal(quote.items[1].tier,2);assert.ok(G.sellBench(r,quote).ok);assert.equal(r.travelFunds,funds+total);assert.equal(r.bench.length,1);assert.equal(r.bench[0],keep);assert.equal(JSON.stringify(p),beforeProfile);assert.equal(JSON.stringify(r.items),grid);
 const after=JSON.stringify(r);assert.equal(G.sellBench(r,quote).ok,false);assert.equal(JSON.stringify(r),after);
});
test('empty, duplicate, equipped and unknown selections reject atomically',()=>{
 const[,r]=fresh();for(const ids of [[],[r.bench[0].id,r.bench[0].id],[r.bench[0].id,r.items[0].id],['missing'],null]){const before=JSON.stringify(r);const q=G.quoteBenchSale(r,ids);assert.equal(q.ok,false);assert.equal(G.sellBench(r,q).ok,false);assert.equal(JSON.stringify(r),before);}
});
test('stale quotes cannot partially sell after tier, location, phase or price changes',()=>{
 for(const mutation of ['tier','move','phase','price']){const[,r]=empty();r.bench=[G.item('sword'),G.item('bow')];const q=G.quoteBenchSale(r,r.bench.map(it=>it.id));
 if(mutation==='tier')r.bench[0].tier=2;if(mutation==='move')assert.ok(G.move(r,r.bench[0].id,0,0).ok);if(mutation==='phase')r.phase='fighting';if(mutation==='price')q.total++;
 const before=JSON.stringify(r);assert.equal(G.sellBench(r,q).ok,false);assert.equal(JSON.stringify(r),before);}
});

test('shrinking a bag can overflow the bench without dropping or resetting equipment',()=>{
 const[,r]=empty();const it=G.item('sword',3,4,0);it.progress=.64;r.items=[it];fillBench(r,12);const ids=G.allItems(r).map(i=>i.id).sort().join(',');
 assert.equal(G.resizeBag(r,3).moved,1);assert.equal(r.bench.length,13);assert.equal(G.allItems(r).map(i=>i.id).sort().join(','),ids);assert.equal(it.tier,3);assert.equal(it.progress,.64);
});
test('merging a selected item invalidates the entire pending sale',()=>{
 const[,r]=empty();r.items=[G.item('sword',1,0,0)];r.bench=[G.item('sword'),G.item('bow')];const q=G.quoteBenchSale(r,r.bench.map(it=>it.id));assert.ok(G.move(r,r.bench[0].id,0,0).merge);
 const before=JSON.stringify(r);assert.equal(G.sellBench(r,q).ok,false);assert.equal(JSON.stringify(r),before);
});

// Step 10: permanent weapon skins, typed fragments and run snapshots.
const grantSkin=(p,type,rank)=>{p.skins.fragments[type][rank-1]=G.SKIN_GRADES[rank-1].cost;assert.ok(G.craftSkin(p,type,rank).ok);assert.ok(G.equipSkin(p,type,rank));};
test('legacy profiles receive empty skin collections while preserving progress and common shards',()=>{
 const[p]=fresh();p.shards=17;p.cleared=[0,1];delete p.skins;const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);
 assert.equal(restored.shards,17);assert.equal(restored.silver,p.silver);assert.equal(restored.cleared.join(','),'0,1');assert.equal(restored.skins.owned.sword.length,0);assert.equal(G.skinRank(restored,'sword'),0);
});
test('skin migration sanitizes unknown grades, unsupported types and unowned equipment',()=>{
 const[p]=fresh();p.skins={owned:{sword:[1,1,7,-1,'2',3]},equipped:{sword:5},fragments:{sword:[-2,3.8,NaN,Infinity,7]}};
 const q=G.restoreProfile(p,1000000);assert.equal(q.skins.owned.sword.join(','),'1,3');assert.equal(q.skins.equipped.sword,0);assert.equal(q.skins.fragments.sword.join(','),'0,3,0,0,7');assert.equal(q.skins.owned.shield,undefined);
});
test('crafting consumes only matching typed fragments, is permanent and never auto-equips',()=>{
 const[p]=fresh();p.skins.fragments.sword[2]=12;p.skins.fragments.bow[2]=9;p.shards=100;const funds=p.silver,gems=p.gems;
 assert.ok(G.craftSkin(p,'sword',3).ok);assert.equal(p.skins.fragments.sword[2],7);assert.equal(p.skins.fragments.bow[2],9);assert.equal(p.shards,100);assert.equal(p.silver,funds);assert.equal(p.gems,gems);assert.equal(G.skinRank(p,'sword'),0);
 const before=JSON.stringify(p);assert.equal(G.craftSkin(p,'sword',3).ok,false);assert.equal(JSON.stringify(p),before);
 assert.ok(G.equipSkin(p,'sword',3));const restored=G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000);assert.equal(G.skinRank(restored,'sword'),3);assert.equal(restored.skins.fragments.sword[2],7);
});
test('invalid crafts and equips cannot consume other rarities or common shards',()=>{
 const[p]=fresh();p.shards=1000;p.skins.fragments.sword[0]=100;
 for(const [type,rank] of [['shield',1],['sword',2],['missing',1],['sword',0],['sword',6],['sword',1.5]]){const before=JSON.stringify(p);assert.equal(G.craftSkin(p,type,rank).ok,false);assert.equal(JSON.stringify(p),before);}
 assert.equal(G.equipSkin(p,'sword',2),false);assert.equal(G.equipSkin(p,'shield',0),false);assert.equal(G.equipSkin(p,'sword',NaN),false);
});
test('five skins unlock exactly III through VII; equipment, shop and supply share a frozen run skin',()=>{
 for(let rank=1;rank<=5;rank++){
 const[p]=fresh();grantSkin(p,'sword',rank);const r=G.newRun(p);assert.equal(G.mergeCap(r,'sword'),rank+2);assert.equal(G.mergeCap(r,'shield'),3);assert.ok(G.allItems(r).filter(it=>it.type==='sword').every(it=>it.skin===rank&&it.tier===1));
 const weapon=r.items.find(it=>it.type==='sword'),before=G.power(p,weapon);G.equipSkin(p,'sword',0);assert.equal(G.power(p,weapon),before);assert.equal(G.mergeCap(r,'sword'),rank+2);assert.equal(G.mergeCap(G.newRun(p),'sword'),3);
 r.shop=[{type:'sword',tier:1}];assert.ok(G.buy(r,0).ok);assert.equal(r.bench.at(-1).skin,rank);
 G.start(r,p,1000000);G.finish(r,p,true);G.chooseSupply(r,0);assert.ok(G.allItems(r).filter(it=>it.type==='sword').every(it=>it.skin===rank));
 }
});
test('equipping a new skin does not buff an existing unskinned trip and skins do not stack',()=>{
 const[p,r]=fresh(),weapon=r.items.find(it=>it.type==='sword'),before=G.power(p,weapon);grantSkin(p,'sword',5);grantSkin(p,'sword',2);assert.equal(G.power(p,weapon),before);assert.equal(G.mergeCap(r,'sword'),3);
 const next=G.newRun(p),it=next.items.find(it=>it.type==='sword');assert.equal(G.power(p,it),G.TYPES.sword.value*1.1);assert.equal(G.mergeCap(next,'sword'),4);
});
test('every unlocked merge ceiling rejects beyond the cap and preserves target state below it',()=>{
 for(let rank=1;rank<=5;rank++){const[p]=fresh();grantSkin(p,'sword',rank);const r=G.newRun(p),cap=rank+2;r.items=[G.runItem(r,'sword',cap-1,0,0)];r.bench=[G.runItem(r,'sword',cap-1)];r.items[0].progress=.8;r.bench[0].progress=.3;
 const preview=G.mergePreview(r,p,r.bench[0].id,r.items[0].id);assert.equal(preview.tier,cap);assert.equal(preview.tradeoffPercent,cap>3?-25:-15);assert.equal(preview.afterRate,G.power(p,{...r.items[0],tier:cap})/G.TYPES.sword.cd);assert.ok(G.move(r,r.bench[0].id,0,0).merge);assert.equal(r.items[0].tier,cap);assert.equal(r.items[0].progress,.3);assert.equal(r.items[0].skin,rank);
 r.bench.push(G.runItem(r,'sword',cap));const before=JSON.stringify(r);assert.equal(G.move(r,r.bench[0].id,0,0).ok,false);assert.equal(G.mergePreview(r,p,r.bench[0].id,r.items[0].id),null);assert.equal(JSON.stringify(r),before);}
});
test('advanced tiers keep old I–III values and use the displayed 1.5 ratio through VII',()=>{
 const[p]=fresh();assert.equal(G.tierFactor(1),1);assert.equal(G.tierFactor(2),1.7);assert.ok(Math.abs(G.tierFactor(3)-2.89)<1e-12);
 for(let tier=4;tier<=7;tier++){assert.ok(Math.abs(G.tierFactor(tier)/G.tierFactor(tier-1)-1.5)<1e-12);const it=G.item('sword',tier);assert.equal(G.saleValue(it),Math.floor(G.TYPES.sword.price*.45*G.tierFactor(tier)));assert.equal(G.power(p,it),G.TYPES.sword.value*G.tierFactor(tier));}
 assert.ok(G.tierFactor(7)<15);
});
test('skin bonus adds to permanent bonuses only for the equipped weapon type',()=>{
 const[p]=fresh();grantSkin(p,'sword',5);p.upgrades.sword=2;p.breakthroughs.sword=1;
 assert.equal(G.power(p,{type:'sword',tier:2}),24*1.7*(1+.3+.3+.25));assert.equal(G.power(p,{type:'bow',tier:1}),37);assert.equal(G.power(p,{type:'shield',tier:1,skin:5}),15);
});
test('new chest items inherit the active trip skin rather than later profile selection',()=>{
 const[p]=fresh();grantSkin(p,'sword',5);const r=G.newRun(p);G.equipSkin(p,'sword',0);p.silver=100000;
 let found=false;for(let i=0;i<100&&!found;i++){r.bench=[];const result=G.openChest(r,p,0);assert.ok(result.ok);if(result.item.type==='sword'){assert.equal(result.item.skin,5);found=true;}}assert.ok(found);
});
test('boss loot preview is pure, chapter-only grades are absent from regular bosses, rates are ordered',()=>{
 const[p]=fresh(),before=JSON.stringify(p);for(let stage=0;stage<5;stage++){const info=G.bossLootInfo(stage);assert.equal(info.shards,[5,8,12,16,20][stage]);assert.equal(info.chapter,stage===4);assert.ok(info.rates.reduce((a,b)=>a+b,0)<=1.0000001);for(let i=1;i<5;i++)assert.ok(info.rates[i]<=info.rates[i-1]);if(stage<4)assert.equal(info.rates.slice(2).join(','),'0,0,0');}assert.equal(JSON.stringify(p),before);assert.equal(G.bossLootInfo(5),null);
});
test('seeded fragment drops cover all advertised grades; high grades never drop on ordinary stages',()=>{
 const[p]=fresh();const seen=new Set();for(let i=0;i<2000;i++){const regular=G.rollSkinFragment(p,i%4);if(regular)assert.ok(regular.rank<=2);const chapter=G.rollSkinFragment(p,4);assert.ok(chapter);seen.add(chapter.rank);assert.ok(G.WEAPON_TYPES.includes(chapter.type));}assert.equal([...seen].sort().join(','),'1,2,3,4,5');
 const total=Object.values(p.skins.fragments).flat().reduce((a,b)=>a+b,0);assert.ok(total>=2000);
});
test('boss wins credit common and skin fragments once, repeat wins still pay common shards',()=>{
 const[p]=fresh();for(const first of [true,false]){const r=G.newRun(p,4);r.round=5;const shards=p.shards;assert.ok(G.start(r,p,1000000));assert.ok(G.finish(r,p,true));assert.equal(r.reward.first,first);assert.equal(r.reward.shards,20);assert.equal(p.shards,shards+20);assert.ok(r.reward.skinFragment);const after=JSON.stringify(p);assert.equal(G.finish(r,p,true),false);assert.equal(JSON.stringify(p),after);}
});
test('normal rounds, losses and Auto Farm do not grant skin fragments',()=>{
 const[p,r]=fresh();let before=JSON.stringify(p.skins);G.start(r,p,1000000);G.finish(r,p,true);assert.equal(r.reward.shards,0);assert.equal(r.reward.skinFragment,null);assert.equal(JSON.stringify(p.skins),before);
 const lost=G.newRun(p,4);lost.round=5;G.start(lost,p,1000000);G.finish(lost,p,false);assert.equal(JSON.stringify(p.skins),before);p.cleared=[0];G.selectFarm(p,0,1000000);G.claimFarm(p,4600000);assert.equal(JSON.stringify(p.skins),before);
});
test('breakthrough chooses either common shards or gems and never consumes skin fragments',()=>{
 for(const currency of ['shards','gems']){const[p]=fresh();p.upgrades.sword=3;p.shards=100;const gems=p.gems,skins=JSON.stringify(p.skins);assert.ok(G.breakthroughWith(p,'sword',currency,1000000,0));assert.equal(p.breakthroughs.sword,1);assert.equal(p.shards,currency==='shards'?80:100);assert.equal(p.gems,currency==='gems'?gems-10:gems);assert.equal(JSON.stringify(p.skins),skins);assert.equal(G.breakthroughCost(p,'sword').shards,40);assert.equal(G.breakthroughCost(p,'sword').need,6);}
});
test('invalid, stale and unaffordable breakthrough confirmations are atomic',()=>{
 const[p]=fresh();p.upgrades.sword=6;p.shards=100;assert.ok(G.breakthroughWith(p,'sword','shards',1000000,0));let before=JSON.stringify(p);assert.equal(G.breakthroughWith(p,'sword','shards',1000000,0),false);assert.equal(G.breakthroughWith(p,'sword','silver',1000000),false);assert.equal(JSON.stringify(p),before);
 p.shards=0;p.gems=0;before=JSON.stringify(p);assert.equal(G.breakthroughWith(p,'sword','shards',1000000),false);assert.equal(G.breakthroughWith(p,'sword','gems',1000000),false);assert.equal(JSON.stringify(p),before);
});
test('battle reports preserve skin snapshots and flag changed skins when comparing',()=>{
 const[p]=fresh();let r=G.newRun(p);G.start(r,p,1000000);G.tick(r,p,.1);G.finish(r,p,true);const previous=r.report;grantSkin(p,'sword',2);r=G.newRun(p);G.start(r,p,1000000);G.tick(r,p,.1);G.finish(r,p,true);assert.equal(r.report.setup.gear.find(it=>it.type==='sword').skin,2);assert.ok(G.compareBattles(r.report,previous).changes.includes('Skin trang bị đã đổi'));assert.ok(G.restoreProfile(JSON.parse(JSON.stringify(p)),1000000).lastBattles['0:1']);
});

test('Tier VII combat damage uses the trip skin even after changing the selected skin',()=>{
 const[p]=fresh();grantSkin(p,'sword',5);const r=G.newRun(p),it=r.items.find(it=>it.type==='sword');it.tier=7;const expected=Math.round(G.power(p,it));G.equipSkin(p,'sword',0);G.start(r,p,1000000);
 r.enemies[0].hp=r.enemies[0].maxHp=100000;r.enemies[0].element='metal';r.enemies[0].armor=0;r.enemies[0].shield=0;it.progress=1;G.tick(r,p,.01);assert.equal(100000-r.enemies[0].hp,expected);assert.equal(r.battle.items.find(v=>v.id===it.id).damage,expected);
});
