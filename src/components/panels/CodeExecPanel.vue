<script setup>
import { storeToRefs } from 'pinia'
import GlowButton from '@/components/common/GlowButton.vue'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { compiledPayload, executionLogs, routePlan, selectedDevice, semanticChecks } =
  storeToRefs(dashboardStore)
</script>

<template>
  <PanelCard eyebrow="Module 06" title="解析后的设备源码执行区">
    <template #actions>
      <div class="exec-actions">
        <StatusTag :label="selectedDevice.status" :tone="selectedDevice.tone" :with-dot="false" />
        <GlowButton size="sm" @click="dashboardStore.dispatchSelectedDevice">下发执行</GlowButton>
      </div>
    </template>

    <div class="exec-panel">
      <section class="exec-overview">
        <div v-for="check in semanticChecks" :key="check.id" class="exec-check">
          <StatusTag :label="check.status" :tone="check.tone" :with-dot="false" />
          <div>
            <strong>{{ check.label }}</strong>
            <small>{{ check.desc }}</small>
          </div>
        </div>
      </section>

      <section class="exec-route">
        <p class="eyebrow">指令路由链路</p>
        <div class="exec-route__track">
          <template v-for="(route, index) in routePlan" :key="route.id">
            <div class="exec-route__node">
              <strong>{{ route.to }}</strong>
              <span>{{ route.channel }} / {{ route.latency }}</span>
            </div>
            <span v-if="index < routePlan.length - 1" class="exec-route__arrow">→</span>
          </template>
        </div>
      </section>

      <div class="exec-detail-grid">
        <section class="exec-section">
          <p class="eyebrow">编译后指令载荷</p>
          <pre class="exec-code">{{ compiledPayload }}</pre>
        </section>

        <section class="exec-section">
          <p class="eyebrow">执行日志</p>
          <div class="log-placeholder">
            <div v-for="log in executionLogs" :key="log.id" class="log-row">
              <span class="log-time">{{ log.time }}</span>
              <span>{{ log.message }}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  </PanelCard>
</template>
