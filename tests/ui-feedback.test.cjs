const test=require('node:test');
const assert=require('node:assert/strict');
const {create,MOTION}=require('../ui-feedback.js');
class Target{
 constructor(){this.events=new Map();this.dataset={};this.hidden=false;this.animations=[];this.focused=0;this.isConnected=true;this.classList={toggle(){}};}
 addEventListener(type,fn){if(!this.events.has(type))this.events.set(type,new Set());this.events.get(type).add(fn);}
 removeEventListener(type,fn){this.events.get(type)?.delete(fn);}
 emit(type,event={}){for(const fn of this.events.get(type)||[])fn(event);}
 focus(){this.focused++;}
 animate(frames,options){const anim={frames,options,playState:'running',effect:{target:this},pause(){this.playState='paused';},play(){this.playState='running';},cancel(){this.playState='idle';},complete(){this.playState='finished';this.onfinish?.();}};this.animations.push(anim);return anim;}
 getAnimations(){return this.animations;}
}
function setup({noAnimation=false,blockedStorage=false}={}){
 const doc=new Target(),media=new Target(),vibrations=[],contexts=[],storage={};media.matches=false;
 class AudioContext{
  constructor(){this.state='suspended';this.currentTime=0;this.nodes=[];contexts.push(this);}
  resume(){this.state='running';return Promise.resolve();}
  suspend(){this.state='suspended';return Promise.resolve();}
  close(){this.state='closed';return Promise.resolve();}
  createOscillator(){const node={frequency:{setValueAtTime(){}},connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;}};this.nodes.push(node);return node;}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 }
 const env={document:doc,matchMedia:()=>media,navigator:{vibrate:value=>vibrations.push(value)},AudioContext,localStorage:{getItem:key=>{if(blockedStorage)throw Error('storage denied');return storage[key];},setItem:(k,v)=>{if(blockedStorage)throw Error('storage denied');storage[k]=v;}}};
 const service=create(env),elements={overlay:new Target(),panel:new Target(),cards:[new Target(),new Target(),new Target()],symbol:new Target(),skip:new Target(),focus:new Target(),kind:'supply'};
 if(noAnimation)for(const el of [elements.panel,elements.symbol,...elements.cards])el.animate=null;
 return {env,doc,media,vibrations,contexts,service,elements,storage};
}
function click(){return {preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};}
test('three cards stagger within 400ms; skipping never executes a selection and restores final state',()=>{
 const {service,elements:e}=setup();service.open(e);
 assert.equal(e.panel.animations[0].options.duration,280);
 assert.deepEqual(e.cards.map(card=>card.animations[0].options.delay),[0,75,150]);
 assert.equal(MOTION.card+2*MOTION.stagger,390);
 const event=click();e.overlay.emit('click',event);assert.equal(event.stopped,true);assert.equal(e.overlay.dataset.feedbackOpening,'false');assert.equal(e.skip.hidden,true);
 assert.ok([...e.panel.animations,...e.cards.flatMap(c=>c.animations)].every(a=>a.playState==='idle'));
 const next=click();e.overlay.emit('click',next);assert.equal(next.stopped,undefined);
});
test('natural completion releases every tween and restores focus if skip button was focused',()=>{
 const {service,elements:e,doc}=setup();service.open(e);doc.activeElement=e.skip;
 for(const el of [e.panel,...e.cards,e.symbol])el.animations[0].complete();
 assert.equal(e.overlay.dataset.feedbackOpening,'false');assert.equal(e.skip.hidden,true);assert.equal(e.focus.focused,1);
});
test('replacement/close removes listeners and old completion cannot finish a new popup',()=>{
 const {service,elements:e}=setup();service.open(e);const stale=e.panel.animations[0].onfinish;
 service.open(e);stale();assert.equal(e.overlay.dataset.feedbackOpening,'true');assert.equal(e.overlay.events.get('click').size,1);
 service.cancel();assert.equal(e.overlay.events.get('click').size,0);assert.equal(e.overlay.events.get('keydown').size,0);assert.equal(e.overlay.dataset.feedbackKind,undefined);
});
test('Tab finishes without trapping navigation; Enter skips without activating',()=>{
 const {service,elements:e}=setup();service.open(e);const tab={key:'Tab',...click()};e.overlay.emit('keydown',tab);assert.equal(tab.stopped,undefined);assert.equal(e.skip.hidden,true);
 service.open(e);const enter={key:'Enter',...click()};e.overlay.emit('keydown',enter);assert.equal(enter.stopped,true);
});
test('OS reduced motion, user reduced VFX, and unavailable WAAPI leave usable static content',()=>{
 const {service,elements:e,media}=setup();media.matches=true;service.open(e);assert.equal(e.panel.animations.length,0);assert.equal(e.skip.hidden,true);
 media.matches=false;service.open(e);media.matches=true;media.emit('change');assert.equal(e.overlay.dataset.feedbackOpening,'false');
 media.matches=false;service.preferences({reducedVfx:true});service.open(e);assert.equal(e.skip.hidden,true);
 const other=setup({noAnimation:true});other.service.open(other.elements);assert.equal(other.elements.skip.hidden,true);
});
test('audio unlock requires trusted gesture, settings gate cues, and replacing popup stops old voices',()=>{
 const {service,elements:e,doc,contexts,vibrations}=setup();service.open(e);assert.equal(contexts.length,0);
 doc.emit('pointerdown',{isTrusted:false});assert.equal(contexts.length,0);
 doc.emit('pointerdown',{isTrusted:true});service.open(e);assert.equal(contexts.length,1);assert.equal(contexts[0].nodes.length,2);
 const old=[...contexts[0].nodes];service.open({...e,kind:'clear'});assert.ok(old.every(n=>n.stopped&&n.disconnected));
 assert.ok(!vibrations.includes(30));service.preferences({haptics:true});service.cue('select');assert.equal(vibrations.at(-1),30);
 service.preferences({sound:false,haptics:false});const count=contexts[0].nodes.length;service.cue('clear');assert.equal(contexts[0].nodes.length,count);
});
test('background ends popup motion, suspends audio, and does not replay stale cues on foreground',()=>{
 const {service,elements:e,doc,contexts}=setup();doc.emit('pointerdown',{isTrusted:true});service.open(e);doc.hidden=true;doc.emit('visibilitychange');
 assert.equal(e.skip.hidden,true);assert.equal(contexts[0].state,'suspended');assert.ok(contexts[0].nodes.every(n=>n.stopped));
 const count=contexts[0].nodes.length;doc.hidden=false;doc.emit('visibilitychange');assert.equal(contexts[0].nodes.length,count);assert.equal(contexts[0].state,'suspended');
});
test('lobby pauses on entering stage; foreground only resumes animations paused by this controller',()=>{
 const {service,doc}=setup(),lobby=new Target(),a=lobby.animate([],{}),alreadyPaused=lobby.animate([],{});alreadyPaused.pause();
 service.setScene(lobby,true);assert.equal(a.playState,'paused');doc.hidden=true;service.setScene(lobby,false);assert.equal(a.playState,'paused');
 doc.hidden=false;doc.emit('visibilitychange');assert.equal(a.playState,'running');assert.equal(alreadyPaused.playState,'paused');
});
test('disabled APIs and denied local storage cannot block popup or preference changes',()=>{
 const {service,elements:e}=setup({blockedStorage:true});assert.doesNotThrow(()=>{service.preferences({sound:false,reducedVfx:true});service.open(e);service.cancel();});
 const plain=create({document:new Target()});assert.doesNotThrow(()=>{plain.cue('clear');plain.destroy();});
});
test('destroy cleans document/media handlers and audio; recreation does not accumulate listeners',()=>{
 const {env,doc,media,service,contexts}=setup();doc.emit('keydown',{isTrusted:true});service.destroy();
 assert.ok([...doc.events.values(),...media.events.values()].every(set=>set.size===0));assert.equal(contexts[0].state,'closed');
 const again=create(env);assert.equal(doc.events.get('pointerdown').size,1);again.destroy();assert.equal(doc.events.get('pointerdown').size,0);
});
