<script setup>
import HeaderBar from '@/components/layout/HeaderBar.vue'
import CodeExecPanel from '@/components/panels/CodeExecPanel.vue'
import DeviceSelectPanel from '@/components/panels/DeviceSelectPanel.vue'
import JsarlPanel from '@/components/panels/JsarlPanel.vue'
import MiniChartPanel from '@/components/panels/MiniChartPanel.vue'
import ParameterPanel from '@/components/panels/ParameterPanel.vue'
import SituationPanel from '@/components/panels/SituationPanel.vue'
</script>

<template>
  <main class="dashboard-screen">
    <div class="dashboard-grid">
      <HeaderBar class="dashboard-grid__header" />

      <DeviceSelectPanel class="dashboard-grid__devices" />

      <SituationPanel class="dashboard-grid__situation" />

      <aside class="dashboard-grid__side">
        <ParameterPanel class="side-card" />

        <MiniChartPanel class="side-card" />
      </aside>

      <JsarlPanel class="dashboard-grid__jsarl" />

      <CodeExecPanel class="dashboard-grid__exec" />
    </div>
  </main>
</template>
