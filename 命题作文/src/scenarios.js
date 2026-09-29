import { dse, calculate } from './scoring.js'
export function addScenarios(db) {
 if(db.scenarioVersion===1)return db
 const groups=[['中四 B 班',['苏颖欣','邓浩然','罗嘉晴','蔡皓轩','冯雅雯','蒋承熙','谢芷柔','潘柏霖','叶晓彤','卢俊彦','袁凯琪','邱子谦']],['中二 A 班',['唐思悦','钟逸朗','马咏恩','萧文轩','曾靖雯','赖乐言','郭梓晴','梁浩宇']]]
 groups.forEach(([className,names],g)=>names.forEach((name,i)=>{const id=100+(g*20)+i;if(!db.students.some(s=>s.id===id))db.students.push({id,name,className,number:String(i+1).padStart(2,'0')})}))
 const school={...structuredClone(dse),id:'school-junior-2026',name:'中二记叙文 · 校本方案',type:'school',version:'v1.0',grade:'中二',wordLimit:450,caps:false,typoMax:0,description:'围绕一件具体的小事展开叙述，重视事件经过、人物描写和真切感受。',dimensions:dse.dimensions.map(d=>({...d,max:({content:35,expression:30,structure:25,writing:10})[d.key]}))}
 if(!db.rules.some(r=>r.id===school.id))db.rules.push(school)
 const specs=[
 {id:-101,title:'为不完美添色彩',className:'中四 A 班',genre:'记叙文',due:'2026-10-15',status:'收稿中',description:'以「为不完美添色彩」为题，记叙一次重新理解自身不足的经历，写出认识的变化。',requirements:'叙事围绕不完美与接纳展开，细节体现心理转变。',rule:structuredClone(dse),states:['未提交','待识别','AI 初评中','需补交','待复核','已复核','已发布'],text:['美术课结束后，我把那张画坏的水彩纸揉成一团。窗外的雨滴打在玻璃上，像是在嘲笑我怎么也画不直的线。','同桌把纸重新摊开，指着晕开的蓝色说：“这里很像海。”我顺着她的手指看去，原先失败的笔触竟成了层层海浪。','我添上一只白色的小船，也第一次愿意留下那些歪斜的线条。它们让海面有了风，让这张画有了属于自己的故事。'],feedback:'前后态度变化清晰，画作细节贴合题意。建议补充尝试修补时的内心活动，让接纳自己的过程更充分。'},
 {id:-102,title:'科技让人与人更亲近吗',className:'中四 B 班',genre:'议论文',due:'2026-10-10',status:'批改中',description:'就「科技让人与人更亲近吗」表达你的看法，运用具体事例论证，并回应不同意见。',requirements:'界定亲近的含义，观点明确，论据和结论形成合理联系。',rule:structuredClone(dse),states:['待复核','已复核','已发布','待复核','AI 初评中','需补交'],text:['通讯工具让远方的问候瞬间抵达，但消息的速度并不等于关系的温度。我认为，科技提供了亲近的机会，却无法代替主动的关心。','外地求学的姐姐每周都会与家人视频。屏幕让她看见家中的变化，也让我们听见她的烦恼。这份亲近来自认真倾听，而不只是网络连接。','也有人在聚餐时只顾手机，忽略身旁的人。因此，使用工具时应给交流留出专注的时间，让科技成为理解彼此的帮助。'],feedback:'立场明确，能同时考虑科技的帮助与限制。建议加入对反方观点的深入回应，避免论证只停留在生活现象。'},
 {id:-103,title:'那一次，我学会了倾听',className:'中二 A 班',genre:'记叙文',due:'2026-10-12',status:'收稿中',description:'记叙一次学会倾听的经历，写清事件的起因、经过和结果，建议不少于450字。',requirements:'事情完整，人物描写具体，感受与事件有联系。',rule:structuredClone(school),states:['未提交','待识别','待复核','需补交','已复核','已发布'],text:['小组讨论时，我急着说出自己的方案，一次次打断同伴。直到坐在旁边的小晴收起笔记，我才发现她一直没有开口。','放学后，我请她再讲一次。她指出我们忽略了调查对象的时间安排，我这才明白自己的计划为什么难以实行。','第二天的讨论里，我先记下每个人的意见，再提出问题。倾听没有让我失去表达的机会，反而让我们的方案更完整。'],feedback:'事件脉络清楚，能够写出自己的变化。可以增加对话和神态描写，使人物之间的交流更生动。'},
 {id:-104,title:'一次难忘的选择',className:'中四 A 班',genre:'记叙文',due:'2026-09-20',status:'已完成',description:'记叙一次让你难忘的选择，说明当时的处境，并写出选择带来的影响。',requirements:'交代选择的两难，结果和反思自然衔接。',rule:structuredClone(dse),states:['已发布'],text:['接力赛开始前，队友突然扭伤了脚。老师问谁愿意替补，我看着跑道，一时不敢举手。','我跑得不快，担心拖累大家。但队友期待的眼神让我走出了队伍。哨声响起后，我紧紧握住接力棒，向终点跑去。','我们没有赢得奖牌，却一起扶着受伤的队友走回教室。我记住的不是名次，而是那次愿意承担的选择。'],feedback:'叙事完整，选择的意义表达自然。建议展开举手前的矛盾心理，加强事件的张力。'}]
 for(const t of specs){
  if(db.tasks.some(x=>x.id===t.id))continue
  const {states,text,feedback,...task}=t;db.tasks.push(task)
  db.students.filter(s=>s.className===t.className).forEach((s,i)=>{
   const status=states[i%states.length],input={content:6+i%4,expression:6+(i+1)%4,structure:6+(i+2)%4,writing:7+i%3,words:[780,620,520,420,290,300,850][i%7],typos:i%9,offTopic:i===8&&t.id===-102}
   if(status==='已发布'||status==='已复核')input.words=660+i*17
   const score=calculate(input,task.rule)
   db.submissions.push({id:`${t.id}-${s.id}`,taskId:t.id,studentId:s.id,status,source:status==='未提交'?'—':i%2?'老师批量上传':'学生拍照',pages:status==='未提交'?0:status==='需补交'?1:3,input,feedback,essay:text,evidence:text[1],evidenceComment:feedback,issue:status==='需补交'?(i%2?'第2页缺失，请补齐原稿页面。':'第1页文字模糊，请重新拍摄清晰图片。'):'',review:status==='已复核'?score:null,published:status==='已发布'?{...score,feedback,at:'2026/09/27 16:30'}:null,files:[]})
  })
 }
 db.scenarioVersion=1
 return db
}
