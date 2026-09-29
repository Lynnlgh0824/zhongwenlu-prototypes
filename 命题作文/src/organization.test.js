import test from 'node:test'
import assert from 'node:assert/strict'
import {addScenarios} from './scenarios.js'
import {addOrganization,organizationPath} from './organization.js'
function seed(){return {students:Array.from({length:12},(_,i)=>({id:i+1,className:'中四 A 班',name:'学生'+i,number:String(i+1)})),tasks:[{id:1,className:'中四 A 班'}],submissions:[{id:'1-1',taskId:1,studentId:1,published:{total:81}}],rules:[]}}
test('学校年级班级身份完整，小明班号15并拥有三篇独立任务',()=>{
 const db=addOrganization(addScenarios(seed())),s=db.students.find(s=>s.name==='小明')
 assert.equal(s.number,'15');assert.equal(organizationPath(db,s),'明德小学 / 小三 / 3A')
 const records=db.submissions.filter(r=>r.studentId===s.id);assert.equal(records.length,3);assert.equal(new Set(records.map(r=>r.taskId)).size,3)
 assert.deepEqual(records.map(r=>r.status),['已发布','待复核','未提交'])
 for(const item of [...db.students,...db.tasks]){const c=db.classes.find(c=>c.id===item.classId);assert.ok(c);assert.equal(c.gradeId,item.gradeId);assert.equal(c.schoolId,item.schoolId)}
 records[1].feedback='独立修改';assert.notEqual(records[0].feedback,records[1].feedback)
})
test('层级迁移保留既有成绩且不重复添加',()=>{const db=addOrganization(addScenarios(seed()));const before=JSON.stringify(db);addOrganization(db);assert.equal(JSON.stringify(db),before);assert.equal(db.submissions[0].published.total,81)})
