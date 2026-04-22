<script setup>
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

const dashboardStore = useDashboardStore()
const {
  draggingDevice,
  isDeviceDragging,
  routes,
  selectedDevice,
  situationMarkers,
  systemStatus,
  taskZonesWithAssignments,
  terrainColumns,
  terrainLabels,
  situationLegend,
  fieldNotes,
} = storeToRefs(dashboardStore)

const handleZoneDrop = (event, zoneId) => {
  const droppedDeviceId = event.dataTransfer?.getData('text/plain')
  dashboardStore.assignDeviceToZone(zoneId, droppedDeviceId)
}

const cameraCenter = {
  x: 0,
  z: 0,
}

const cameraLimit = {
  minX: -72,
  maxX: 72,
}

const camera = reactive({
  x: cameraCenter.x,
  z: cameraCenter.z,
  zoom: 1,
  isDragging: false,
})

const dragState = {
  startClientX: 0,
  startClientY: 0,
  startCameraX: cameraCenter.x,
  startCameraZ: cameraCenter.z,
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const normalizeDegrees = (value) => ((Math.round(value) % 360) + 360) % 360

const cameraTransform = computed(
  () => `rotateX(${camera.x}deg) rotateZ(${camera.z}deg) scale(${camera.zoom})`,
)

const shadowTransform = computed(
  () => `rotateX(${clamp(camera.x + 58, 48, 74)}deg) rotateZ(${camera.z}deg) translateY(70px)`,
)

const orbitNeedleStyle = computed(() => ({
  transform: `rotate(${normalizeDegrees(camera.z)}deg)`,
}))

const cameraLabel = computed(() => `俯仰 ${Math.round(camera.x)}° · 环视 ${normalizeDegrees(camera.z)}°`)

const resetCamera = () => {
  camera.x = cameraCenter.x
  camera.z = cameraCenter.z
  camera.zoom = 1
}

const shouldIgnoreViewDrag = (event) =>
  Boolean(event.target.closest('.view-control'))

const beginCameraDrag = (event) => {
  if (shouldIgnoreViewDrag(event)) {
    return
  }

  camera.isDragging = true
  dragState.startClientX = event.clientX
  dragState.startClientY = event.clientY
  dragState.startCameraX = camera.x
  dragState.startCameraZ = camera.z
  event.currentTarget.setPointerCapture?.(event.pointerId)
}

const moveCameraDrag = (event) => {
  if (!camera.isDragging) {
    return
  }

  const deltaX = event.clientX - dragState.startClientX
  const deltaY = event.clientY - dragState.startClientY

  camera.z = dragState.startCameraZ + deltaX * 0.35
  camera.x = clamp(dragState.startCameraX - deltaY * 0.22, cameraLimit.minX, cameraLimit.maxX)
}

const endCameraDrag = (event) => {
  if (!camera.isDragging) {
    return
  }

  camera.isDragging = false
  event.currentTarget.releasePointerCapture?.(event.pointerId)
}
</script>

<template>
  <PanelCard eyebrow="地图" title="任务态势" badge="拖动视角">
    <div
      :class="['situation-canvas', 'situation-canvas--3d', { 'situation-canvas--orbiting': camera.isDragging }]"
      @pointerdown="beginCameraDrag"
      @pointermove="moveCameraDrag"
      @pointerup="endCameraDrag"
      @pointercancel="endCameraDrag"
    >
      <div class="map-toolbar">
        <button class="map-tool map-tool--active" type="button">任务</button>
        <button class="map-tool" type="button">链路</button>
        <button class="map-tool" type="button">风险</button>
      </div>

      <div class="map-status-strip">
        <span>链路稳定度 {{ systemStatus.linkStability }}</span>
        <span>{{ systemStatus.networkPolicy }}</span>
        <span>更新 {{ systemStatus.lastUpdate }}</span>
      </div>

      <div class="situation-stage">
        <div class="terrain-shadow" :style="{ transform: shadowTransform }"></div>
        <div
          :class="['terrain-platform', { 'terrain-platform--dragging': camera.isDragging }]"
          :style="{ transform: cameraTransform }"
        >
          <div class="situation-gridline"></div>
          <svg class="situation-map" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <path class="map-contour" d="M54,104 C142,62 258,56 378,102 C480,140 610,134 718,94 C820,56 902,68 968,108" />
            <path class="map-contour" d="M22,166 C150,116 282,126 398,168 C520,212 618,204 742,150 C840,108 930,120 1000,152" />
            <path class="map-contour" d="M-8,254 C122,204 254,212 380,258 C500,302 626,304 760,248 C860,206 940,210 1016,246" />
            <path class="map-contour" d="M28,332 C156,284 292,292 418,338 C532,380 650,384 794,332 C878,302 952,300 1030,336" />
            <path class="map-contour" d="M34,418 C170,368 302,382 430,426 C560,470 694,468 814,418 C902,382 970,390 1042,432" />
            <path class="map-contour" d="M18,512 C154,464 298,472 442,522 C572,566 718,568 842,524 C928,494 994,504 1060,540" />

            <path
              class="map-river map-river--buffer"
              d="M-20,446 C88,412 172,368 294,356 C404,344 492,374 586,358 C684,344 762,292 878,280 C944,274 988,280 1040,260"
            />
            <path
              class="map-river"
              d="M-20,446 C88,412 172,368 294,356 C404,344 492,374 586,358 C684,344 762,292 878,280 C944,274 988,280 1040,260"
            />

            <path class="map-road" d="M108,184 C214,204 302,220 402,248 C514,280 636,264 770,220 C860,192 940,174 1036,186" />
            <path class="map-road map-road--secondary" d="M176,560 C300,510 412,474 548,468 C654,464 750,494 876,560" />
            <path class="map-road map-road--dashed" d="M650,118 C704,190 736,252 742,328 C748,406 764,456 840,530" />
          </svg>

          <div
            v-for="column in terrainColumns"
            :key="column.id"
            :class="['terrain-column', `terrain-column--${column.tone}`]"
            :style="{
              top: column.top,
              left: column.left,
              '--column-size': column.size,
              '--column-height': column.height,
            }"
          >
            <span class="terrain-column__body"></span>
            <span class="terrain-column__cap"></span>
            <small>{{ column.label }}</small>
          </div>

          <div
            v-for="zone in taskZonesWithAssignments"
            :key="zone.id"
            :class="['task-zone', 'task-zone--3d', `task-zone--${zone.tone}`, { 'task-zone--drop-ready': isDeviceDragging }]"
            :style="{ top: zone.top, left: zone.left, width: zone.width, height: zone.height }"
            @dragover.prevent
            @drop="handleZoneDrop($event, zone.id)"
          >
            <span class="task-zone__code">{{ zone.code }}</span>
            <span class="task-zone__title">{{ zone.title }}</span>
            <span class="task-zone__assignee">
              {{ zone.assignedDevice ? zone.assignedDevice.name : '拖入装备编组' }}
            </span>
          </div>

          <span
            v-for="label in terrainLabels"
            :key="label.id"
            :class="['terrain-label', `terrain-label--${label.kind}`]"
            :style="{ top: label.top, left: label.left }"
          >
            {{ label.text }}
          </span>

          <div
            v-for="note in fieldNotes"
            :key="note.id"
            :class="['field-note', `field-note--${note.tone}`]"
            :style="{ top: note.top, left: note.left }"
          >
            <strong>{{ note.title }}</strong>
            <span>{{ note.body }}</span>
          </div>

          <div
            v-for="marker in situationMarkers"
            :key="marker.id"
            :class="[
              'map-entity',
              `map-entity--${marker.tone}`,
              { 'map-entity--active': marker.deviceId && marker.deviceId === selectedDevice.id },
            ]"
            :style="{ top: marker.top, left: marker.left, '--marker-z': marker.z }"
          >
            <span class="map-entity__shadow"></span>
            <span class="map-entity__stem"></span>
            <span class="map-entity__dot"></span>
            <span class="map-entity__pulse"></span>
            <div class="map-entity__label">
              <strong>{{ marker.code }} · {{ marker.altitude }}</strong>
              <span>{{ marker.label }}</span>
              <small>{{ marker.meta }}</small>
            </div>
          </div>

          <template v-for="route in routes" :key="route.id">
            <div
              :class="['route', `route--${route.tone}`]"
              :style="{
                top: route.top,
                left: route.left,
                width: route.width,
                transform: `rotate(${route.rotate}) translateZ(16px)`,
              }"
            ></div>
            <span class="route-label" :style="{ top: route.labelTop, left: route.labelLeft }">
              {{ route.label }}
            </span>
          </template>
        </div>
      </div>

      <div class="view-control">
        <p class="view-control__title">视角</p>
        <div class="view-orbit">
          <span class="view-orbit__ring"></span>
          <span class="view-orbit__needle" :style="orbitNeedleStyle"></span>
        </div>
        <span class="view-control__readout">{{ cameraLabel }}</span>
        <button class="view-control__reset" type="button" @click="resetCamera">复位</button>
      </div>

      <div class="map-reference">
        <div class="north-arrow">
          <span>N</span>
        </div>
        <div class="scale-bar">
          <span></span>
          <small>500 m</small>
        </div>
      </div>

      <div class="situation-hint">拖动视角 / 拖入装备</div>

      <div class="map-legend">
        <p class="eyebrow">图层</p>
        <div class="map-legend__items">
          <div v-for="item in situationLegend" :key="item.id" class="map-legend__item">
            <span :class="['legend-dot', `legend-dot--${item.tone}`]"></span>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="isDeviceDragging" class="drop-guidance">
        <p class="eyebrow">拖拽编组</p>
        <strong>{{ draggingDevice?.name }}</strong>
        <span>拖入任一任务扇区，生成 JSARL 路由上下文</span>
      </div>

      <div class="situation-overlay">
        <div class="overlay-card">
          <p class="eyebrow">区域</p>
          <strong>{{ systemStatus.location }}</strong>
        </div>
        <div class="overlay-card">
          <p class="eyebrow">风险</p>
          <strong class="tone-danger">{{ systemStatus.riskLevel }}</strong>
        </div>
        <div class="overlay-card">
          <p class="eyebrow">焦点</p>
          <strong>{{ selectedDevice.name }}</strong>
          <div class="overlay-status">
            <StatusTag :label="selectedDevice.status" :tone="selectedDevice.tone" :with-dot="false" />
          </div>
        </div>
      </div>
    </div>
  </PanelCard>
</template>

<style scoped>
.overlay-status {
  margin-top: 8px;
}
</style>
