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
  padding: 4px 8px;
  border: 1px solid transparent;
  border-radius: 7px;
  font-size: 0.74rem;
  line-height: 1;
  white-space: nowrap;
}

.status-tag__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: none;
}

.status-tag--info {
  color: var(--color-text-soft);
  border-color: rgb(var(--rgb-slate) / 0.22);
  background: rgb(var(--rgb-slate) / 0.08);
}

.status-tag--primary {
  color: var(--color-primary);
  border-color: rgb(var(--rgb-tech-blue) / 0.24);
  background: rgb(var(--rgb-tech-blue) / 0.08);
}

.status-tag--success {
  color: #c8e9d6;
  border-color: rgb(var(--rgb-safe-green) / 0.24);
  background: rgb(var(--rgb-safe-green) / 0.1);
}

.status-tag--warning {
  color: #efd8ac;
  border-color: rgba(217, 162, 76, 0.24);
  background: rgba(217, 162, 76, 0.1);
}

.status-tag--danger {
  color: #efd0d3;
  border-color: rgb(var(--rgb-rescue-red) / 0.24);
  background: rgb(var(--rgb-rescue-red) / 0.1);
}
</style>
