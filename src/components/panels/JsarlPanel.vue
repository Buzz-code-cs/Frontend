<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import ActionButton from '@/components/common/ActionButton.vue'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { jsarlSource, parseSummary } = storeToRefs(dashboardStore)
const editorHost = ref(null)
const isEditorLoading = ref(true)
const editorLoadError = ref('')

let editorInstance
let monacoApi

const setupJsarlLanguage = () => {
  if (!monacoApi.languages.getLanguages().some((language) => language.id === 'jsarl')) {
    monacoApi.languages.register({ id: 'jsarl' })
    monacoApi.languages.setLanguageConfiguration('jsarl', {
      brackets: [
        ['{', '}'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
      ],
    })
    monacoApi.languages.setMonarchTokensProvider('jsarl', {
      keywords: [
        'mission',
        'use',
        'device',
        'mapped_to',
        'on',
        'receive',
        'dispatch',
        'sync',
        'when',
        'terrain',
        'enable',
        'protocol',
        'cache',
        'telemetry',
        'at',
        'edge',
        'node',
        'emit',
        'summary',
        'sector',
        'waypoint',
        'relay',
      ],
      tokenizer: {
        root: [
          [/\/\/.*$/, 'comment'],
          [/"[^"]*"/, 'string'],
          [/\d+(\.\d+)?/, 'number'],
          [/->|==|<=|>=|<|>|=/, 'operator'],
          [/[{}()]/, '@brackets'],
          [
            /[a-zA-Z_][\w.]*/,
            {
              cases: {
                '@keywords': 'keyword',
                '@default': 'identifier',
              },
            },
          ],
        ],
      },
    })
  }

  monacoApi.editor.defineTheme('resculink-jsarl', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '4a97c4', fontStyle: 'bold' },
      { token: 'string', foreground: '43b077' },
      { token: 'number', foreground: 'c79447' },
      { token: 'operator', foreground: 'cd4c58' },
      { token: 'comment', foreground: '6f86a6', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#090f18',
      'editor.foreground': '#e7eef8',
      'editor.lineHighlightBackground': '#101b2b',
      'editorLineNumber.foreground': '#546a88',
      'editorLineNumber.activeForeground': '#4a97c4',
      'editorCursor.foreground': '#4a97c4',
      'editor.selectionBackground': '#1b4d68',
      'editor.inactiveSelectionBackground': '#132c3d',
    },
  })
}

const createEditor = () => {
  editorInstance = monacoApi.editor.create(editorHost.value, {
    value: jsarlSource.value,
    language: 'jsarl',
    theme: 'resculink-jsarl',
    automaticLayout: true,
    fontFamily: 'Consolas, "Cascadia Code", "Courier New", monospace',
    fontSize: 13,
    lineHeight: 22,
    minimap: { enabled: false },
    padding: { top: 14, bottom: 14 },
    renderLineHighlight: 'line',
    scrollBeyondLastLine: false,
    tabSize: 2,
    wordWrap: 'on',
  })

  editorInstance.onDidChangeModelContent(() => {
    const nextValue = editorInstance.getValue()

    if (nextValue !== jsarlSource.value) {
      dashboardStore.updateJsarlSource(nextValue)
    }
  })
}

const loadEditor = async () => {
  const [monacoModule, workerModule] = await Promise.all([
    import('monaco-editor/esm/vs/editor/editor.api'),
    import('monaco-editor/esm/vs/editor/editor.worker?worker'),
  ])

  monacoApi = monacoModule

  if (typeof self !== 'undefined') {
    self.MonacoEnvironment = {
      getWorker: () => new workerModule.default(),
    }
  }

  setupJsarlLanguage()
  createEditor()
  isEditorLoading.value = false
}

onMounted(() => {
  loadEditor().catch((error) => {
    console.error(error)
    editorLoadError.value = 'Monaco 编辑器加载失败，请刷新页面重试'
    isEditorLoading.value = false
  })
})

watch(jsarlSource, (nextValue) => {
  if (!editorInstance || nextValue === editorInstance.getValue()) {
    return
  }

  editorInstance.setValue(nextValue)
})

onBeforeUnmount(() => {
  editorInstance?.dispose()
})
</script>

<template>
  <PanelCard
    eyebrow="脚本"
    title="JSARL 编辑"
    subtitle="当前任务脚本，从语言规则生成设备载荷"
  >
    <template #actions>
      <div class="jsarl-actions">
        <StatusTag label="脚本编辑" tone="primary" :with-dot="false" />
        <ActionButton kind="ghost" size="sm" @click="dashboardStore.simulateParse">
          解析脚本
        </ActionButton>
      </div>
    </template>

    <div class="jsarl-panel">
      <div class="jsarl-editor">
        <div class="jsarl-editor__bar">
          <span>mission_flood_rescue.jsarl</span>
          <span>未保存 / 可解析</span>
        </div>
        <div ref="editorHost" class="jsarl-monaco"></div>
        <div v-if="isEditorLoading || editorLoadError" class="jsarl-monaco__state">
          {{ editorLoadError || 'JSARL 编辑器加载中...' }}
        </div>
      </div>

      <div class="jsarl-summary">
        <div v-for="item in parseSummary" :key="item.label" class="summary-item">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="panel-footnote">
        编辑脚本后点击解析，右侧摘要和下方载荷会按当前焦点装备刷新。
      </div>
    </template>
  </PanelCard>
</template>
