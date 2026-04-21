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
  <button :type="props.type" :class="['glow-button', `glow-button--${props.kind}`, `glow-button--${props.size}`]">
    <slot />
  </button>
</template>

<style scoped>
.glow-button {
  border: 1px solid transparent;
  border-radius: 10px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease,
    background 0.2s ease;
}

.glow-button:hover {
  transform: translateY(-1px);
}

.glow-button--md {
  padding: 10px 14px;
  font-size: 0.88rem;
}

.glow-button--sm {
  padding: 7px 12px;
  font-size: 0.78rem;
}

.glow-button--primary {
  color: #eff7ff;
  border-color: rgba(70, 165, 255, 0.35);
  background: linear-gradient(135deg, rgba(70, 165, 255, 0.24), rgba(70, 165, 255, 0.08));
  box-shadow: inset 0 0 14px rgba(70, 165, 255, 0.12);
}

.glow-button--ghost {
  color: var(--color-text-soft);
  border-color: rgba(117, 140, 173, 0.22);
  background: rgba(9, 18, 32, 0.75);
}
</style>
