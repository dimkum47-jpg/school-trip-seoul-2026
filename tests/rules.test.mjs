import {readFileSync}from'node:fs';import{initializeTestEnvironment,assertFails,assertSucceeds}from'@firebase/rules-unit-testing';import{doc,setDoc,getDoc,updateDoc,serverTimestamp,Timestamp,collection,getDocs,query,limit}from'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-school-trip',firestore:{rules:readFileSync('firestore.rules','utf8')}});const trip='seoul-2026';const path=id=>`trips/${trip}/students/alice/submissions/${id}`;
const auth=(uid,teacher=false,tripClaim=trip)=>env.authenticatedContext(uid,{teacher,trip:tripClaim}).firestore();
const answer=()=>({title:'발견',body:'내 생각',url:'',photoClaim:false,review:'pending',feedback:'',updatedAt:serverTimestamp(),windowStart:serverTimestamp(),saveCount:1});
try{await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();for(const uid of ['alice','bob'])await setDoc(doc(db,`trips/${trip}/students/${uid}`),{label:uid,group:'1모둠',active:true});await setDoc(doc(db,`trips/${trip}/settings/main`),{closed:false,notice:''});});
const a=auth('alice'),b=auth('bob'),t=auth('teacher',true);
await assertSucceeds(setDoc(doc(a,path('museum')),answer()));
await assertFails(getDoc(doc(b,path('museum'))));await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(),path('museum'))));
await assertFails(setDoc(doc(a,path('unknown')),answer()));await assertFails(setDoc(doc(auth('alice',false,'another-trip'),path('math')),answer()));
await assertFails(setDoc(doc(a,path('math')),{...answer(),body:'가'.repeat(2001)}));await assertFails(setDoc(doc(a,path('math')),{...answer(),image:'data:photo'}));await assertFails(setDoc(doc(a,path('math')),{...answer(),review:'confirmed'}));
await assertFails(updateDoc(doc(a,path('museum')),{body:'바로 수정',updatedAt:serverTimestamp(),saveCount:2}));
await assertSucceeds(getDoc(doc(t,path('museum'))));await assertSucceeds(updateDoc(doc(t,path('museum')),{review:'confirmed',feedback:'잘했어요'}));await assertFails(updateDoc(doc(t,path('museum')),{body:'학생 내용 변경'}));
await assertFails(getDocs(collection(a,`trips/${trip}/students/alice/submissions`)));await assertSucceeds(getDocs(query(collection(a,`trips/${trip}/students/alice/submissions`),limit(20))));
await env.withSecurityRulesDisabled(async c=>{await updateDoc(doc(c.firestore(),path('museum')),{updatedAt:Timestamp.fromMillis(Date.now()-120000),windowStart:Timestamp.fromMillis(Date.now()-3600000),saveCount:29});});
await assertSucceeds(updateDoc(doc(a,path('museum')),{review:'pending',feedback:'',body:'수정',updatedAt:serverTimestamp(),saveCount:30}));
await env.withSecurityRulesDisabled(async c=>{await updateDoc(doc(c.firestore(),path('museum')),{updatedAt:Timestamp.fromMillis(Date.now()-120000)});});await assertFails(updateDoc(doc(a,path('museum')),{updatedAt:serverTimestamp(),saveCount:31}));
await assertSucceeds(setDoc(doc(t,`trips/${trip}/settings/main`),{closed:true,notice:''}));await assertFails(setDoc(doc(a,path('math')),answer()));console.log('PASS: ownership, anonymous denial, role isolation, size, known missions, throttle, 30-save cap, teacher review and closing');
}finally{await env.cleanup();}
