<script setup>
import { computed, useSlots } from 'vue'

const props = defineProps({
  eyebrow: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
})

const slots = useSlots()

const hasHeader = computed(
  () => props.eyebrow || props.title || props.subtitle || props.badge || Boolean(slots.actions),
)
</script>

<template>
  <section class="dashboard-card panel-card">
    <header v-if="hasHeader" class="panel-card__header">
      <div class="panel-card__title">
        <p v-if="props.eyebrow" class="eyebrow">{{ props.eyebrow }}</p>
        <h2 v-if="props.title">{{ props.title }}</h2>
        <p v-if="props.subtitle" class="panel-card__subtitle">{{ props.subtitle }}</p>
      </div>

      <div class="panel-card__actions">
        <slot name="actions">
          <span v-if="props.badge" class="panel-badge">{{ props.badge }}</span>
        </slot>
      </div>
    </header>

    <div class="panel-card__body">
      <slot />
    </div>

    <footer v-if="$slots.footer" class="panel-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.panel-card {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.panel-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
}

.panel-card__title {
  min-width: 0;
}

.panel-card__title h2 {
  font-size: 1rem;
  font-weight: 600;
}

.panel-card__subtitle {
  margin-top: 6px;
  color: var(--color-text-soft);
  font-size: 0.82rem;
}

.panel-card__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.panel-card__body {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 16px;
  padding: 0 18px 16px;
}

.panel-card__footer {
  padding: 0 18px 16px;
}
</style>
