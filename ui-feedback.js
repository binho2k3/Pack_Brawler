/* Presentation only: never awards loot, advances rounds, or consumes energy. */
(function(root){
'use strict';
const MOTION=Object.freeze({popup:280,card:240,stagger:75,accent:320,easing:'cubic-bezier(.22,1.18,.36,1)'});
const KEY='pack-brawler-feedback-v1';
function create(env){
 const {document:doc}=env,media=env.matchMedia?.('(prefers-reduced-motion: reduce)');
 let settings={sound:true,haptics:false,reducedVfx:false};
 try{const saved=JSON.parse(env.localStorage?.getItem(KEY)||'null');for(const key of Object.keys(settings))if(typeof saved?.[key]==='boolean')settings[key]=saved[key];}catch{}
 let context=null,active=null,lobby=null,inStage=false,destroyed=false;
 const voices=new Set(),pausedLobby=new Set(),listeners=[];
 const listen=(target,type,fn,options)=>{target?.addEventListener(type,fn,options);listeners.push(()=>target?.removeEventListener(type,fn,options));};
 const reduced=()=>settings.reducedVfx||!!media?.matches;
 function stopAudio(){for(const v of voices){v.osc.onended=null;try{v.osc.stop();}catch{}v.osc.disconnect();v.gain.disconnect();}voices.clear();}
 function unlock(event){
  if(destroyed||!event.isTrusted||!settings.sound||doc.hidden)return;
  try{const Audio=env.AudioContext||env.webkitAudioContext;if(!Audio)return;context??=new Audio();if(context.state==='suspended')context.resume().catch(()=>{});}catch{}
 }
 function cue(kind){
  if(destroyed||doc.hidden)return;
  if(settings.haptics&&typeof env.navigator?.vibrate==='function')try{env.navigator.vibrate(kind==='clear'||kind==='select'?30:10);}catch{}
  // No delayed replay: a blocked audio context simply leaves visual/text feedback active.
  if(!settings.sound||context?.state!=='running')return;
  stopAudio();
  const notes=kind==='clear'?[523.25,659.25,783.99]:kind==='select'?[659.25,880]:[440,554.37];
  const pitch=.9+Math.random()*.2;
  try{notes.forEach((hz,i)=>{const osc=context.createOscillator(),gain=context.createGain(),at=context.currentTime+i*.065;
   osc.type='sine';osc.frequency.setValueAtTime(hz*pitch,at);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.045,at+.008);gain.gain.exponentialRampToValueAtTime(.0001,at+.14);
   osc.connect(gain);gain.connect(context.destination);const voice={osc,gain};voices.add(voice);osc.onended=()=>{osc.disconnect();gain.disconnect();voices.delete(voice);};osc.start(at);osc.stop(at+.15);
  });}catch{stopAudio();}
 }
 function finishOpening(session=active){
  if(!session||session!==active)return;
  for(const anim of session.animations){anim.onfinish=null;anim.oncancel=null;anim.cancel();}session.animations.clear();
  session.opening=false;session.overlay.dataset.feedbackOpening='false';session.skip.hidden=true;
  if(doc.activeElement===session.skip)session.focus?.focus({preventScroll:true});
 }
 function cancel(){
  if(active){finishOpening();active.overlay.removeEventListener('click',active.onClick,true);active.overlay.removeEventListener('keydown',active.onKey,true);delete active.overlay.dataset.feedbackKind;delete active.overlay.dataset.feedbackOpening;active=null;}
  stopAudio();try{env.navigator?.vibrate?.(0);}catch{}
 }
 function animate(session,el,frames,options){
  if(!el?.animate)return;
  const anim=el.animate(frames,{fill:'backwards',...options});session.animations.add(anim);
  anim.onfinish=()=>{session.animations.delete(anim);anim.onfinish=null;anim.cancel();if(active===session&&!session.animations.size)finishOpening(session);};
 }
 function open({overlay,panel,cards=[],symbol,skip,focus,kind}){
  cancel();if(destroyed)return;
  const session={overlay,skip,focus,animations:new Set(),opening:false};active=session;
  overlay.dataset.feedbackKind=kind;
  session.onClick=event=>{if(!session.opening)return;event.preventDefault();event.stopImmediatePropagation();finishOpening(session);};
  session.onKey=event=>{if(!session.opening)return;if(event.key==='Tab'){finishOpening(session);return;}if(['Enter',' ','Escape'].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();finishOpening(session);}};
  overlay.addEventListener('click',session.onClick,true);overlay.addEventListener('keydown',session.onKey,true);
  if(!reduced()&&!doc.hidden){
   animate(session,panel,[{opacity:0,transform:'translateY(12px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:MOTION.popup,easing:MOTION.easing});
   cards.forEach((card,i)=>animate(session,card,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:MOTION.card,delay:i*MOTION.stagger,easing:MOTION.easing}));
   animate(session,symbol,[{opacity:.55,transform:'scale(.9)'},{opacity:1,transform:'scale(1.06)',offset:.65},{opacity:1,transform:'scale(1)'}],{duration:MOTION.accent,easing:'ease-out'});
  }
  session.opening=session.animations.size>0;overlay.dataset.feedbackOpening=String(session.opening);skip.hidden=!session.opening;
  cue(kind);
 }
 function syncLobby(){
  if(!lobby)return;
  const pause=inStage||doc.hidden||reduced();lobby.classList.toggle('lobby-motion-paused',pause);
  if(pause){for(const anim of lobby.getAnimations?.({subtree:true})||[])if(anim.playState==='running'||anim.pending){anim.pause();pausedLobby.add(anim);}}
  else{for(const anim of pausedLobby)if(anim.playState==='paused'&&anim.effect?.target?.isConnected!==false)anim.play();pausedLobby.clear();}
 }
 function setScene(nextLobby,stage){lobby=nextLobby;inStage=stage;syncLobby();}
 function preferences(next){
  for(const key of Object.keys(settings))if(typeof next[key]==='boolean')settings[key]=next[key];
  try{env.localStorage?.setItem(KEY,JSON.stringify(settings));}catch{}
  if(!settings.sound)stopAudio();if(!settings.haptics)try{env.navigator?.vibrate?.(0);}catch{}
  if(reduced())finishOpening();syncLobby();
 }
 listen(doc,'pointerdown',unlock,{capture:true,passive:true});listen(doc,'keydown',unlock,true);
 listen(doc,'visibilitychange',()=>{syncLobby();if(doc.hidden){finishOpening();stopAudio();try{env.navigator?.vibrate?.(0);context?.suspend().catch(()=>{});}catch{}}});
 listen(media,'change',()=>{if(reduced())finishOpening();syncLobby();});
 function destroy(){cancel();destroyed=true;listeners.splice(0).forEach(off=>off());pausedLobby.clear();try{context?.close().catch(()=>{});}catch{}}
 return {open,cancel,finishOpening,cue,setScene,syncLobby,preferences,getSettings:()=>({...settings}),destroy};
}
if(typeof module!=='undefined'&&module.exports)module.exports={create,MOTION};else root.GameFeedback={create,MOTION};
})(typeof window==='undefined'?globalThis:window);
