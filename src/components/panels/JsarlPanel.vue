<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import GlowButton from '@/components/common/GlowButton.vue'
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
      { token: 'keyword', foreground: '46a5ff', fontStyle: 'bold' },
      { token: 'string', foreground: '33d17a' },
      { token: 'number', foreground: 'ffb24d' },
      { token: 'operator', foreground: 'ff5a68' },
      { token: 'comment', foreground: '6f86a6', fontStyle: 'italic' },
    ],
    colors: {
      'editor.background': '#050b14',
      'editor.foreground': '#d8e8ff',
      'editor.lineHighlightBackground': '#102238',
      'editorLineNumber.foreground': '#546a88',
      'editorLineNumber.activeForeground': '#46a5ff',
      'editorCursor.foreground': '#46a5ff',
      'editor.selectionBackground': '#235f96',
      'editor.inactiveSelectionBackground': '#163854',
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
  <PanelCard eyebrow="Module 05" title="JSARL 语言输入输出区">
    <template #actions>
      <div class="jsarl-actions">
        <StatusTag label="Monaco 已接入" tone="primary" :with-dot="false" />
        <GlowButton kind="ghost" size="sm" @click="dashboardStore.simulateParse">
          解析脚本
        </GlowButton>
      </div>
    </template>

    <div class="jsarl-panel">
      <div class="jsarl-editor">
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
        可直接编辑 JSARL 脚本；解析摘要和执行载荷会随当前焦点设备联动更新。
      </div>
    </template>
  </PanelCard>
</template>
