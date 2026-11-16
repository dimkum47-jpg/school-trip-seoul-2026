// Run by the developer with Application Default Credentials for the NEW trip project.
// Never commit credentials or generated invitations. Results are PRIVATE stdout only.
import{initializeApp,applicationDefault}from'firebase-admin/app';import{getAuth}from'firebase-admin/auth';import{getFirestore}from'firebase-admin/firestore';import{randomBytes}from'node:crypto';
const [projectId,teacherEmail,countArg='12']=process.argv.slice(2);const count=Number(countArg);if(!projectId||projectId==='school-webapp-2fe32'||!teacherEmail?.includes('@')||!Number.isInteger(count)||count<1||count>20)throw Error('전용 프로젝트 ID, 교사 이메일, 학생 수(1~20)를 확인하세요.');
initializeApp({credential:applicationDefault(),projectId});const auth=getAuth(),db=getFirestore(),trip='seoul-2026';
// Teacher must already have created their own Email/Password account. No password output for teachers.
const teacher=await auth.getUserByEmail(teacherEmail);await auth.setCustomUserClaims(teacher.uid,{teacher:true,trip});
const config=db.doc(`trips/${trip}/settings/main`);if(!(await config.get()).exists)await config.set({notice:'함께 보고, 느끼고, 발견해요.',closed:false,uploads:{},canva:{},aiLinks:{}});
const existing=await db.collection(`trips/${trip}/students`).limit(21).get();if(!existing.empty)throw Error('학생 명부가 이미 있습니다. 중복 생성하지 않습니다. 기존 계정을 확인하세요.');
for(let i=1;i<=count;i++){const code=randomBytes(6).toString('hex'),password=randomBytes(12).toString('base64url');const u=await auth.createUser({email:code+'@trip.invalid',password});await auth.setCustomUserClaims(u.uid,{teacher:false,trip});await db.doc(`trips/${trip}/students/${u.uid}`).set({label:`학생 ${String(i).padStart(2,'0')}`,group:`${1+Math.floor((i-1)/Math.ceil(count/3))}모둠`,active:true,nameConfirmed:false});process.stdout.write(JSON.stringify({label:`학생 ${i}`,code,password})+'\n');}
