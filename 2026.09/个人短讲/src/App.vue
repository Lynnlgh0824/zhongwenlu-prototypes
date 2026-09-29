<script setup lang="ts">
import { computed, ref } from 'vue'
import { IonApp, IonContent, IonHeader, IonIcon, IonPage, IonTabBar, IonTabButton, IonLabel, IonTitle, IonToolbar, IonTextarea } from '@ionic/vue'
import { arrowBackOutline, bookOutline, chatbubblesOutline, chevronForwardOutline, documentTextOutline, homeOutline, micOutline, personOutline, refreshOutline, timeOutline } from 'ionicons/icons'

type Screen = 'home' | 'levels' | 'topics' | 'question' | 'report' | 'library' | 'edit'
const screen = ref<Screen>('home')
const selectedLevel = ref('中级')
const selectedTopic = ref('我的家庭')
const questionIndex = ref(0)
const isRecording = ref(false)
const reportReady = ref(false)
const draft = ref('我想跟大家分享我的妈妈。因为她常常带我去很多地方，也会耐心地教我学习。')
const questions = ['你有什么声音习惯？为什么会觉得这是一个好习惯？', '这个习惯对你有什么影响？', '你有没有发生过什么有趣的经历？', '你打算怎样改掉这个习惯？']
const progress = computed(() => Math.round(((questionIndex.value + 1) / questions.length) * 100))

function go(next: Screen) { screen.value = next; isRecording.value = false }
function start() { questionIndex.value = 0; go('question') }
function nextQuestion() { if (questionIndex.value < questions.length - 1) questionIndex.value++; else { reportReady.value = false; go('report') } }
</script>

<template>
  <IonApp><IonPage>
    <IonHeader class="ion-no-border"><IonToolbar><button v-if="screen !== 'home'" class="back" @click="go(screen === 'library' ? 'home' : 'levels')"><IonIcon :icon="arrowBackOutline" /></button><IonTitle>个人短讲</IonTitle><button class="history" @click="go('library')">历史记录</button></IonToolbar></IonHeader>
    <IonContent :fullscreen="true"><main>
      <section v-if="screen === 'home'" class="home-screen"><div class="home-tabs"><button class="selected">口语训练</button><button>聆听与辨音</button><button>HSK</button><button>更多练习</button></div><div class="feature-grid"><button class="feature-card sky" @click="go('levels')"><b>发音评测</b><small>即时评分，改善发音</small><span>🎙</span></button><button class="feature-card mint"><b>场景对话</b><small>情境对话，提高表达</small><span>💬</span></button><button class="feature-card yellow" @click="go('levels')"><b>个人短讲</b><small>整理思路，流畅开口</small><span>▰</span></button><button class="feature-card pink"><b>看图说话</b><small>看图描述，训练表达</small><span>☻</span></button><button class="feature-card lavender"><b>聆听练习</b><small>听特征音，选择答案</small><span>◉</span></button><button class="feature-card blue"><b>拼音练习</b><small>辨认声母，巩固拼音</small><span>拼</span></button></div><div class="section-title"><h2>我的任务</h2><button @click="go('library')">查看全部</button></div><button class="recent-card" @click="go('library')"><span class="round-icon"><IonIcon :icon="documentTextOutline" /></span><span><b>图片指导 3</b><small>任务截止 · 9月30日 23:59</small></span><strong>去完成</strong></button></section>

      <section v-else-if="screen === 'levels'" class="stack-screen"><div class="screen-heading"><span>STEP 1</span><h1>选择练习难度</h1><p>选择适合你的个人短讲练习。</p></div><button class="level-card blue" :class="{ active: selectedLevel === '初级' }" @click="selectedLevel = '初级'"><span><b>初级</b><small>P1-P3 · 基础朗读练习</small></span><IonIcon :icon="micOutline" /></button><button class="level-card violet" :class="{ active: selectedLevel === '中级' }" @click="selectedLevel = '中级'"><span><b>中级</b><small>P4-P6 · 提纲辅助表达</small></span><IonIcon :icon="documentTextOutline" /></button><button class="level-card purple" :class="{ active: selectedLevel === '高级' }" @click="selectedLevel = '高级'"><span><b>高级</b><small>S1-S3 · 自由表达训练</small></span><IonIcon :icon="chatbubblesOutline" /></button><button class="primary full" @click="go('topics')">下一步</button></section>

      <section v-else-if="screen === 'topics'" class="stack-screen"><div class="screen-heading"><span>个人短讲</span><h1>选择练习内容</h1><p>公共题库与校本题库</p></div><div class="topic-tabs"><button class="selected">公共</button><button>校本</button><button>历史记录</button></div><button class="topic-card active" @click="selectedTopic = '我感恩的人'; start()"><span><b>我感恩的人</b><small>日常 · 个人短讲</small></span><IonIcon :icon="chevronForwardOutline" /></button><button class="topic-card" @click="selectedTopic = '我改变的坏习惯'; start()"><span><b>我改变的坏习惯</b><small>日常 · 个人短讲</small></span><IonIcon :icon="chevronForwardOutline" /></button><button class="topic-card" @click="selectedTopic = '暑假圈再上暑'; start()"><span><b>暑假圈再上暑</b><small>学习 · 个人短讲</small></span><IonIcon :icon="chevronForwardOutline" /></button><button class="topic-card" @click="selectedTopic = '难忘的香港本地游'; start()"><span><b>难忘的香港本地游</b><small>社会 · 个人短讲</small></span><IonIcon :icon="chevronForwardOutline" /></button></section>

      <section v-else-if="screen === 'question'" class="talk-screen"><div class="stepper"><span v-for="(_, i) in questions" :key="i" :class="{ active: i <= questionIndex }">{{ i + 1 }}</span></div><div class="progress-label"><span>第 {{ questionIndex + 1 }} 题 / {{ questions.length }}</span><b>{{ progress }}%</b></div><article class="question-card"><span>题目</span><h1>{{ questions[questionIndex] }}</h1><p>请用普通话完整表达，尽量加入具体细节。</p></article><div class="timer" :class="{ recording: isRecording }"><span>{{ isRecording ? '正在录音' : '准备开始' }}</span><strong>{{ isRecording ? '00:46' : '01:00' }}</strong><small>倒计时</small></div><p class="hint">已为你整理草稿，准备好后点击下方按钮开始演讲</p><button class="record-button" :class="{ recording: isRecording }" @click="isRecording = !isRecording"><IonIcon :icon="micOutline" />{{ isRecording ? '结束录音' : '开始演讲' }}</button><button v-if="isRecording" class="next-button" @click="nextQuestion">完成本题，继续</button><button v-else class="text-button" @click="go('edit')">先查看文字稿</button></section>

      <section v-else-if="screen === 'edit'" class="stack-screen"><div class="screen-heading"><span>文字稿</span><h1>检查你的表达</h1><p>可以修改文字稿，再提交本次练习。</p></div><div class="draft-tabs"><button class="selected">当前稿</button><button>原始稿</button><button>AI 润色</button></div><IonTextarea v-model="draft" :auto-grow="true" class="draft-input" /><div class="edit-actions"><button class="secondary" @click="draft += ' 我很喜欢和家人在一起。'">AI 润色</button><button class="primary" @click="go('report')">保存并评分</button></div></section>

      <section v-else-if="screen === 'report'" class="report-screen"><div class="report-modal"><div class="report-art"><IonIcon :icon="documentTextOutline" /></div><h1>{{ reportReady ? '本次短讲已完成' : '恭喜你完成本次演讲' }}</h1><div class="report-status">{{ reportReady ? '评分 86 · 表达清晰' : '报告生成中' }}</div><p>{{ reportReady ? '你的练习结果已经生成，可以查看详细建议。' : '等待 3 分钟后可在历史记录查看本次报告' }}</p><button class="primary full" @click="reportReady ? go('library') : reportReady = true">{{ reportReady ? '查看历史记录' : '我知道了' }}</button></div><button class="record-button" @click="start"><IonIcon :icon="refreshOutline" />再次练习</button></section>

      <section v-else class="stack-screen"><div class="screen-heading"><span>我的短讲</span><h1>练习记录</h1><p>查看你的稿件、评分和历史练习。</p></div><button class="library-card" @click="go('report')"><span class="round-icon"><IonIcon :icon="documentTextOutline" /></span><span><b>我的家庭</b><small>练习 3 次 · 最近评分 86</small></span><IonIcon :icon="chevronForwardOutline" /></button><button class="library-card"><span class="round-icon"><IonIcon :icon="timeOutline" /></span><span><b>我的学习习惯</b><small>练习 1 次 · 尚未评分</small></span><IonIcon :icon="chevronForwardOutline" /></button><button class="primary full" @click="go('levels')">开始新的短讲</button></section>
    </main></IonContent>
    <IonTabBar slot="bottom"><IonTabButton tab="home" @click="go('home')"><IonIcon :icon="homeOutline" /><IonLabel>学习</IonLabel></IonTabButton><IonTabButton tab="tasks"><IonIcon :icon="bookOutline" /><IonLabel>课程</IonLabel></IonTabButton><IonTabButton tab="ai"><IonIcon :icon="chatbubblesOutline" /><IonLabel>AI 助学</IonLabel></IonTabButton><IonTabButton tab="me" @click="go('library')"><IonIcon :icon="personOutline" /><IonLabel>我的</IonLabel></IonTabButton></IonTabBar>
  </IonPage></IonApp>
</template>
