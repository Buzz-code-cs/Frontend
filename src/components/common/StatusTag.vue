<script setup>
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    default: 'info',
  },
  withDot: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <span :class="['status-tag', `status-tag--${props.tone}`]">
    <span v-if="props.withDot" class="status-tag__dot"></span>
    <slot>{{ props.label }}</slot>
  </span>
</template>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.78rem;
  line-height: 1;
  white-space: nowrap;
}

.status-tag__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
}

.status-tag--info {
  color: var(--color-text-soft);
  border-color: rgba(117, 140, 173, 0.22);
  background: rgba(117, 140, 173, 0.08);
}

.status-tag--primary {
  color: var(--color-primary);
  border-color: rgba(70, 165, 255, 0.28);
  background: rgba(70, 165, 255, 0.12);
}

.status-tag--success {
  color: #c8ffe2;
  border-color: rgba(51, 209, 122, 0.28);
  background: rgba(51, 209, 122, 0.12);
}

.status-tag--warning {
  color: #ffe2b7;
  border-color: rgba(255, 178, 77, 0.28);
  background: rgba(255, 178, 77, 0.12);
}

.status-tag--danger {
  color: #ffd4d8;
  border-color: rgba(255, 90, 104, 0.3);
  background: rgba(255, 90, 104, 0.12);
}
</style>
