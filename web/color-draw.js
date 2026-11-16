export const HUNT_COLORS=Object.freeze([
 {name:'빨강',hex:'#c9403a',light:'#fae5e1'},
 {name:'주황',hex:'#d57124',light:'#fff0df'},
 {name:'노랑',hex:'#a67d08',light:'#fff6c9'},
 {name:'초록',hex:'#36744d',light:'#e6f1e2'},
 {name:'파랑',hex:'#376eab',light:'#e6effc'},
 {name:'보라',hex:'#8251a1',light:'#f0e8f7'}
]);
export function colorFromByte(byte){return Number.isInteger(byte)&&byte>=0&&byte<252?HUNT_COLORS[byte%6]:null;}
export function drawColor(){const value=new Uint8Array(1);let result;do{crypto.getRandomValues(value);result=colorFromByte(value[0]);}while(!result);return result;}
