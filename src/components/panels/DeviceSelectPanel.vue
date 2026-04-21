<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import GlowButton from '@/components/common/GlowButton.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { deviceCountLabel, devices, draggingDeviceId, selectedDeviceId, selectedDevice } =
  storeToRefs(dashboardStore)

const selectedSummary = computed(
  () => `${selectedDevice.value.name} / 电量 ${selectedDevice.value.battery} / 链路 ${selectedDevice.value.signal}`,
)

const handleDragStart = (event, deviceId) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', deviceId)
  dashboardStore.startDeviceDrag(deviceId)
}
</script>

<template>
  <PanelCard eyebrow="Module 01" title="装备拖拽选择区">
    <template #actions>
      <StatusTag :label="deviceCountLabel" tone="success" :with-dot="false" />
    </template>

    <div class="device-list">
      <article
        v-for="device in devices"
        :key="device.id"
        :class="[
          'device-item',
          {
            'device-item--active': device.id === selectedDeviceId,
            'device-item--dragging': device.id === draggingDeviceId,
          },
        ]"
        draggable="true"
        @click="dashboardStore.selectDevice(device.id)"
        @dragstart="handleDragStart($event, device.id)"
        @dragend="dashboardStore.endDeviceDrag"
      >
        <div class="device-item__icon">{{ device.icon }}</div>

        <div class="device-item__meta">
          <div class="device-item__header">
            <div>
              <h3>{{ device.name }}</h3>
              <p>{{ device.role }}</p>
            </div>
            <StatusTag :label="device.status" :tone="device.tone" :with-dot="false" />
          </div>

          <div class="device-item__stats">
            <span>电量 {{ device.battery }}</span>
            <span>链路 {{ device.signal }}</span>
            <span>{{ device.zone }}</span>
          </div>

          <div class="device-item__capabilities">
            <span
              v-for="capability in device.capabilities"
              :key="`${device.id}-${capability}`"
              class="capability-chip"
            >
              {{ capability }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <template #footer>
      <div class="panel-card__footer-row">
        <span class="panel-footnote">{{ selectedSummary }}</span>
        <GlowButton size="sm" @click="dashboardStore.syncFormation">同步编组</GlowButton>
      </div>
    </template>
  </PanelCard>
</template>
