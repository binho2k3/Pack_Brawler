/* Loadout presentation rules and pointer feedback; no combat rules or rewards. */
(function(root){
'use strict';
function choice(Game,p,type){
 const selected=p.loadout.includes(type),lastWeapon=selected&&Game.TYPES[type]?.kind==='damage'&&p.loadout.filter(t=>Game.TYPES[t].kind==='damage').length===1;
 let reason='';
 if(!Game.TYPES[type]||!p.owned.includes(type))reason='Chưa sở hữu trang bị này.';
 else if(selected&&(p.loadout.length===1||lastWeapon))reason='Cần giữ ít nhất một vũ khí trong đội hình.';
 else if(!selected&&p.loadout.length>=3)reason='Đã đủ 3 loại. Bỏ chọn một món trước khi thêm.';
 return {selected,reason,allowed:!reason};
}
function rating(Game,p){return Math.round(p.loadout.reduce((sum,type)=>sum+Game.power(p,{type,tier:1}),0)*10);}
function createPressFeedback(env,{reduced=()=>false,haptic=()=>{}}={}){
 const doc=env.document,animations=new Map(),listeners=[];let pressed=null,suppressed=null;
 const listen=(type,fn)=>{doc.addEventListener(type,fn,true);listeners.push(()=>doc.removeEventListener(type,fn,true));};
 const buttonFor=event=>event.target?.closest?.('button[data-inventory-press]');
 const face=button=>button.querySelector('.press-face')||button;
 function stop(button){const anim=animations.get(button);if(anim){anim.onfinish=null;anim.cancel();animations.delete(button);}button.dataset.pressState='idle';}
 function tween(button,frames,options){stop(button);if(reduced()||!face(button).animate)return;const a=face(button).animate(frames,options);animations.set(button,a);a.onfinish=()=>{if(animations.get(button)===a){a.cancel();animations.delete(button);button.dataset.pressState='idle';}};}
 function down(button){tween(button,[{transform:'scale(1)'},{transform:'scale(.9)'}],{duration:40,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'});button.dataset.pressState='pressed';haptic(10);}
 function release(button){tween(button,[{transform:'scale(.9)'},{transform:'scale(1.05)',offset:.65},{transform:'scale(1)'}],{duration:130,easing:'cubic-bezier(.22,1.18,.36,1)'});button.dataset.pressState='released';}
 function reject(button){tween(button,[{transform:'translateX(0)'},{transform:'translateX(-8px)'},{transform:'translateX(8px)'},{transform:'translateX(0)'}],{duration:200,easing:'ease-out'});button.dataset.pressState='blocked';haptic(30);}
 function cancel(){if(pressed)stop(pressed.button);pressed=null;for(const button of [...animations.keys()])stop(button);}
 listen('pointerdown',e=>{const button=buttonFor(e);if(!button||button.disabled||e.button!==0||e.isPrimary===false)return;suppressed=null;cancel();pressed={button,id:e.pointerId,x:e.clientX,y:e.clientY};down(button);});
 listen('pointermove',e=>{if(!pressed||pressed.id!==e.pointerId)return;if(Math.hypot(e.clientX-pressed.x,e.clientY-pressed.y)>8){suppressed=pressed.button;stop(pressed.button);pressed=null;}});
 listen('pointercancel',e=>{if(pressed?.id===e.pointerId){suppressed=pressed.button;cancel();}});
 listen('pointerup',e=>{if(!pressed||pressed.id!==e.pointerId)return;const {button}=pressed,r=button.getBoundingClientRect();pressed=null;if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){suppressed=button;stop(button);return;}release(button);});
 listen('click',e=>{const button=buttonFor(e);if(button&&button===suppressed){e.preventDefault();e.stopImmediatePropagation();suppressed=null;return;}if(button?.getAttribute('aria-disabled')==='true'){e.preventDefault();e.stopImmediatePropagation();reject(button);const reason=button.dataset.blockReason||'Chưa thể thực hiện.';button.dispatchEvent(new env.CustomEvent('inventory-blocked',{bubbles:true,detail:reason}));}});
 listen('keydown',e=>{const button=buttonFor(e);if(!button||e.repeat||!['Enter',' '].includes(e.key))return;suppressed=null;down(button);});
 listen('keyup',e=>{const button=buttonFor(e);if(button&&['Enter',' '].includes(e.key))release(button);});
 listen('visibilitychange',()=>{if(doc.hidden)cancel();});listen('focusout',e=>{const button=buttonFor(e);if(button)stop(button);});
 function bind(scope){scope.querySelectorAll('button').forEach(button=>{button.dataset.inventoryPress='';if(!button.querySelector('.press-face')){const wrapper=doc.createElement('span');wrapper.className='press-face';wrapper.append(...button.childNodes);button.append(wrapper);}});}
 function destroy(){cancel();listeners.splice(0).forEach(off=>off());}
 return {bind,cancel,release,reject,destroy};
}
const api={choice,rating,createPressFeedback};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InventoryUI=api;
})(typeof window==='undefined'?globalThis:window);
