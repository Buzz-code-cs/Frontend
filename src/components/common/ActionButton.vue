<script setup>
const props = defineProps({
  kind: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'md',
  },
  type: {
    type: String,
    default: 'button',
  },
})
</script>

<template>
  <button :type="props.type" :class="['action-button', `action-button--${props.kind}`, `action-button--${props.size}`]">
    <slot />
  </button>
</template>

<style scoped>
.action-button {
  border: 1px solid transparent;
  border-radius: 7px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.action-button:hover {
  transform: none;
}

.action-button--md {
  padding: 10px 14px;
  font-size: 0.88rem;
}

.action-button--sm {
  padding: 7px 12px;
  font-size: 0.78rem;
}

.action-button--primary {
  color: #eff7ff;
  border-color: rgb(var(--rgb-tech-blue) / 0.32);
  background: rgb(var(--rgb-tech-blue) / 0.16);
  box-shadow: none;
}

.action-button--ghost {
  color: var(--color-text-soft);
  border-color: rgb(var(--rgb-slate) / 0.2);
  background: rgba(9, 18, 32, 0.54);
}
</style>
