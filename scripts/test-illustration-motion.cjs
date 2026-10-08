const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync(require('node:path').join(__dirname, '../js/illustrations.js'), 'utf8');
function setup({reduce=false,saved=false,storageError=false}={}) {
 const events={}, listeners={}, storage=new Map([['brandflow-illustration-motion-paused',String(saved)]]);
 const button={addEventListener:(name,fn)=>events[name]=fn,setAttribute:(name,value)=>button[name]=value};
 const scene={dataset:{},style:{removeProperty(){},setProperty(){}},querySelector:()=>button,addEventListener(){}};
 const media={matches:reduce,addEventListener:(name,fn)=>listeners.media=fn};
 const document={hidden:false,querySelectorAll:()=>[scene],addEventListener:(name,fn)=>listeners[name]=fn};
 let observed;
 class Observer {constructor(fn){observed=fn}observe(){}}
 vm.runInNewContext(code,{document,window:{IntersectionObserver:Observer},IntersectionObserver:Observer,matchMedia:q=>q.includes('reduced')?media:{matches:true},localStorage:{getItem:k=>{if(storageError)throw Error('blocked');return storage.get(k)},setItem:(k,v)=>{if(storageError)throw Error('blocked');storage.set(k,v)}},requestAnimationFrame(){},cancelAnimationFrame(){}});
 return {button,scene,media,document,click:()=>events.click(),change:()=>listeners.media(),visibility:()=>listeners.visibilitychange(),intersection:value=>observed([{target:scene,isIntersecting:value}]),storage};
}
let t=setup();assert.equal(t.scene.dataset.motion,'running');assert.equal(t.button.hidden,false);
t.click();assert.equal(t.scene.dataset.motion,'paused');assert.equal(t.button.textContent,'Play motion');assert.equal(t.button['aria-pressed'],'true');assert.equal(t.storage.get('brandflow-illustration-motion-paused'),'true');
t.click();assert.equal(t.scene.dataset.motion,'running');t.intersection(false);assert.equal(t.scene.dataset.motion,'paused');t.intersection(true);assert.equal(t.scene.dataset.motion,'running');
t.document.hidden=true;t.visibility();assert.equal(t.scene.dataset.motion,'paused');t.document.hidden=false;t.visibility();assert.equal(t.scene.dataset.motion,'running');
t.media.matches=true;t.change();assert.equal(t.scene.dataset.motion,'paused');assert.equal(t.button.disabled,true);t.media.matches=false;t.change();assert.equal(t.scene.dataset.motion,'running');
t=setup({reduce:true});assert.equal(t.scene.dataset.motion,'paused');assert.equal(t.button.disabled,true);assert.equal(t.button.textContent,'Reduced motion');
t=setup({saved:true});assert.equal(t.scene.dataset.motion,'paused');t.media.matches=true;t.change();t.media.matches=false;t.change();assert.equal(t.scene.dataset.motion,'paused');
t=setup({storageError:true});t.click();assert.equal(t.scene.dataset.motion,'paused');t.click();assert.equal(t.scene.dataset.motion,'running');
console.log('Passed: play/pause, persisted choice, reduced-motion precedence and changes, offscreen and hidden-tab suspension, blocked storage.');
