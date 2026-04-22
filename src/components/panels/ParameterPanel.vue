<script setup>
import { storeToRefs } from 'pinia'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { missionStages, selectedDevice, selectedDeviceProfile, servicePipeline } =
  storeToRefs(dashboardStore)
</script>

<template>
  <PanelCard
    eyebrow="参数"
    title="装备详情"
    subtitle="当前焦点装备的协议、权限与服务节点"
  >
    <template #actions>
      <StatusTag :label="selectedDevice.status" :tone="selectedDevice.tone" :with-dot="false" />
    </template>

    <div class="parameter-panel">
      <section class="parameter-profile">
        <div class="parameter-profile__header">
          <div>
            <p class="eyebrow">当前装备</p>
            <h3>{{ selectedDevice.name }}</h3>
          </div>
          <StatusTag :label="selectedDevice.authority" :tone="selectedDevice.tone" :with-dot="false" />
        </div>

        <div class="parameter-profile__grid">
          <div
            v-for="item in selectedDeviceProfile"
            :key="item.label"
            :class="['parameter-value', { 'parameter-value--strong': item.tone }]"
          >
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>

        <div class="capability-chips">
          <span
            v-for="capability in selectedDevice.capabilities"
            :key="`${selectedDevice.id}-${capability}`"
            class="capability-chip"
          >
            {{ capability }}
          </span>
        </div>
      </section>

      <section class="service-flow">
        <p class="eyebrow">JSARL 服务链路</p>
        <div v-for="(node, index) in servicePipeline" :key="node.id" class="service-node">
          <span class="service-node__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="service-node__body">
            <strong>{{ node.name }}</strong>
            <small>{{ node.desc }}</small>
          </div>
          <StatusTag :label="node.status" :tone="node.tone" :with-dot="false" />
        </div>
      </section>

      <section class="mission-stage">
        <p class="eyebrow">任务闭环</p>
        <div class="mission-stage__track">
          <span
            v-for="stage in missionStages"
            :key="stage.id"
            :class="['mission-stage__item', { 'mission-stage__item--active': stage.active }]"
          >
            {{ stage.label }}
          </span>
        </div>
        <p class="mission-stage__note">边缘执行需指挥席确认后写入执行日志。</p>
      </section>
    </div>
  </PanelCard>
</template>
