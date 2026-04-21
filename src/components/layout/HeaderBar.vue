<script setup>
import { storeToRefs } from 'pinia'
import GlowButton from '@/components/common/GlowButton.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { commander, systemStatus } = storeToRefs(dashboardStore)
</script>

<template>
  <header class="dashboard-card header-bar">
    <div class="header-block">
      <div class="header-brand__badge">R</div>
      <div>
        <p class="eyebrow">{{ systemStatus.brand }}</p>
        <h1 class="header-title">{{ systemStatus.systemName }}</h1>
      </div>
    </div>

    <div class="header-status">
      <StatusTag tone="success" :label="systemStatus.onlineLabel" />
      <StatusTag
        :tone="systemStatus.riskTone"
        :with-dot="false"
        :label="systemStatus.riskLevel"
      />
      <div class="status-meta">
        <span>任务代号：{{ systemStatus.missionCode }}</span>
        <span>链路稳定度：{{ systemStatus.linkStability }}</span>
      </div>
    </div>

    <div class="header-profile">
      <div class="avatar-shell">指</div>
      <div class="header-profile__meta">
        <p class="eyebrow">{{ commander.seat }}</p>
        <p class="header-operator">{{ commander.displayName }}</p>
        <p class="header-subline">{{ commander.affiliation }} / {{ commander.authLevel }}</p>
      </div>
      <GlowButton kind="ghost" size="sm">演示模式</GlowButton>
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  display: grid;
  height: 100%;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
  padding: 16px 18px;
}

.header-profile__meta {
  min-width: 0;
}

.header-subline {
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

@media (max-width: 920px) {
  .header-bar {
    height: auto;
    grid-template-columns: minmax(0, 1fr);
  }

  .header-status,
  .header-profile {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
