<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import ActionButton from '@/components/common/ActionButton.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const { deviceCountLabel, devices, draggingDeviceId, selectedDeviceId, selectedDevice } =
  storeToRefs(dashboardStore)

const deviceFilters = [
  { label: '全部', value: 'all' },
  { label: '在线', value: 'online' },
  { label: '待命', value: 'standby' },
]

const activeDeviceFilter = ref('all')

const filteredDevices = computed(() => {
  if (activeDeviceFilter.value === 'online') {
    return devices.value.filter((device) => ['在线', '联控中', '执行中'].includes(device.status))
  }

  if (activeDeviceFilter.value === 'standby') {
    return devices.value.filter((device) => device.status === '待命')
  }

  return devices.value
})

const selectedSummary = computed(
  () =>
    `当前焦点：${selectedDevice.value.callSign} / ${selectedDevice.value.name} / ${selectedDevice.value.zone}`,
)

const handleDragStart = (event, deviceId) => {
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', deviceId)
  dashboardStore.startDeviceDrag(deviceId)
}
</script>

<template>
  <PanelCard
    eyebrow="装备"
    title="编组列表"
    subtitle="点击切换焦点，拖入地图扇区完成分配。"
  >
    <template #actions>
      <StatusTag :label="deviceCountLabel" tone="success" :with-dot="false" />
    </template>

    <div class="device-toolbar">
      <button
        v-for="filter in deviceFilters"
        :key="filter.value"
        :class="['device-filter', { 'device-filter--active': activeDeviceFilter === filter.value }]"
        type="button"
        @click="activeDeviceFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="device-list">
      <article
        v-for="device in filteredDevices"
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
        <div class="device-item__meta">
          <div class="device-item__header">
            <div>
              <div class="device-item__title-row">
                <span class="device-item__icon">{{ device.icon }}</span>
                <h3>{{ device.name }}</h3>
              </div>
              <small class="device-item__call">{{ device.callSign }}</small>
              <p>{{ device.role }}</p>
            </div>
            <StatusTag :label="device.status" :tone="device.tone" :with-dot="false" />
          </div>

          <div class="device-item__stats">
            <span>电量：{{ device.battery }}</span>
            <span>链路：{{ device.signal }}</span>
            <span>回传：{{ device.lastSeen }}</span>
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
        <ActionButton size="sm" @click="dashboardStore.syncFormation">同步</ActionButton>
      </div>
    </template>
  </PanelCard>
</template>
