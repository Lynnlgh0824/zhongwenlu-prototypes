import test from 'node:test'
import assert from 'node:assert/strict'
import {addScenarios} from './scenarios.js'
const seed=()=>({students:Array.from({length:12},(_,i)=>({id:i+1,className:'中四 A 班',name:'学生'+i})),tasks:[{id:1}],submissions:[{id:'existing',taskId:1,studentId:1,status:'已发布',published:{total:81}}],rules:[]})
test('新增任务按班级分配，覆盖全部状态，正式成绩无待确认项',()=>{
 const db=addScenarios(seed());assert.equal(db.students.length,32);assert.equal(db.tasks.length,5);assert.equal(db.submissions.length,45)
 for(const r of db.submissions.slice(1)){
  const t=db.tasks.find(t=>t.id===r.taskId),s=db.students.find(s=>s.id===r.studentId)
  assert.equal(t.className,s.className)
  if(r.published)assert.equal(r.published.pending.length,0)
 }
 for(const state of ['未提交','待识别','AI 初评中','需补交','待复核','已复核','已发布'])assert.ok(db.submissions.some(r=>r.status===state))
})
test('数据扩展幂等且保留已有成绩和操作',()=>{
 const db=addScenarios(seed());db.submissions[1].feedback='老师已修改';const before=JSON.stringify(db);addScenarios(db);assert.equal(JSON.stringify(db),before);assert.equal(db.submissions[0].published.total,81)
})
