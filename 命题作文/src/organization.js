import {dse,calculate} from './scoring.js'
export function addOrganization(db){
 if(db.organizationVersion===1)return db
 db.schools=[{id:'md-secondary',name:'明德书院'},{id:'md-primary',name:'明德小学'}]
 db.grades=[{id:'s4',schoolId:'md-secondary',name:'中四'},{id:'s2',schoolId:'md-secondary',name:'中二'},{id:'p3',schoolId:'md-primary',name:'小三'}]
 db.classes=[{id:'s4a',gradeId:'s4',schoolId:'md-secondary',name:'4A',legacyName:'中四 A 班',year:'2026—2027'},{id:'s4b',gradeId:'s4',schoolId:'md-secondary',name:'4B',legacyName:'中四 B 班',year:'2026—2027'},{id:'s2a',gradeId:'s2',schoolId:'md-secondary',name:'2A',legacyName:'中二 A 班',year:'2026—2027'},{id:'p3a',gradeId:'p3',schoolId:'md-primary',name:'3A',legacyName:'3A',year:'2026—2027'}]
 const rule={...structuredClone(dse),id:'primary-p3',name:'小三写作 · 校本方案',type:'school',version:'v1.0',grade:'小三',wordLimit:200,caps:false,typoMax:0,description:'写清事情经过，语句通顺，标点正确，表达自己的感受。',dimensions:dse.dimensions.map(d=>({...d,max:({content:40,expression:30,structure:20,writing:10})[d.key]}))}
 db.rules.push(rule)
 for(const [i,name] of ['小明','小欣','子乐','咏晴'].entries())db.students.push({id:300+i,name,className:'3A',number:String(15+i)})
 const texts=[['我的好朋友','下课时，我发现忘了带水彩笔，急得把书包翻了好几遍。','小欣把她的笔盒推过来，说我们可以一起用。她还帮我调出了天空的颜色。','那天我们完成了一幅春天的画。我觉得朋友就是在需要时愿意伸出手的人。'],['校园里的发现','早晨，我在花坛边发现一只背着小壳的蜗牛。','它慢慢爬过叶子，留下了一条亮亮的痕迹。我和同学蹲下来安静地看，没有伸手碰它。','原来校园里还有这么多有趣的小生命，只要仔细观察就能发现。'],['我学会了做早餐','星期天，我请妈妈教我做三明治。','我先洗好生菜，再把鸡蛋和面包放在盘子里。第一次煎蛋时蛋黄破了，妈妈鼓励我再试一次。','吃着自己做的早餐，我很开心，也明白了每天准备早餐并不容易。']]
 texts.forEach(([title,...essay],n)=>{
  const id=-201-n;db.tasks.push({id,title,className:'3A',genre:'记叙文',due:['2026-09-22','2026-10-06','2026-10-13'][n],status:n===0?'已完成':'收稿中',description:`以「${title}」为题，写一篇短文，交代事情经过和自己的感受，建议不少于200字。`,requirements:'结合生活经验，事情清楚，句子完整。',rule:structuredClone(rule)})
  db.students.filter(s=>s.className==='3A').forEach((s,i)=>{const status=n===0?'已发布':n===1?['待复核','已复核','需补交','已发布'][i]:'未提交';const input={content:7+i%3,expression:7,structure:8,writing:8,typos:i,words:230+i*18,offTopic:false};const result=calculate(input,rule),feedback='事情经过清楚，能够写出自己的感受。可以加入人物说话时的动作，让内容更加具体。';db.submissions.push({id:`${id}-${s.id}`,taskId:id,studentId:s.id,status,source:status==='未提交'?'—':i%2?'老师批量上传':'学生拍照',pages:status==='未提交'?0:2,input,essay,evidence:essay[1],evidenceComment:feedback,feedback,issue:status==='需补交'?'第2页不清晰，请补拍原稿。':'',review:status==='已复核'?result:null,published:status==='已发布'?{...result,feedback,at:'2026/09/23 15:30'}:null,files:[]})})
 })
 for(const item of [...db.students,...db.tasks]){const c=db.classes.find(c=>c.legacyName===item.className);if(c)Object.assign(item,{classId:c.id,gradeId:c.gradeId,schoolId:c.schoolId})}
 db.organizationVersion=1;return db
}
export function organizationPath(db,item){
 const c=db.classes.find(c=>c.id===item?.classId),g=db.grades.find(g=>g.id===item?.gradeId),s=db.schools.find(s=>s.id===item?.schoolId)
 return [s?.name,g?.name,c?.name].filter(Boolean).join(' / ')
}
