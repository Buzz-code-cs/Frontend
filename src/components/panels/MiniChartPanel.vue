<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import PanelCard from '@/components/common/PanelCard.vue'
import StatusTag from '@/components/common/StatusTag.vue'
import { useDashboardStore } from '@/stores/dashboard'

use([CanvasRenderer, LineChart, GridComponent, LegendComponent, TooltipComponent])

const dashboardStore = useDashboardStore()
const { chartMetrics, chartSeries, chartTimeline } = storeToRefs(dashboardStore)

const trendOption = computed(() => ({
  backgroundColor: 'transparent',
  color: ['#46a5ff', '#33d17a', '#ffb24d'],
  grid: {
    top: 34,
    right: 34,
    bottom: 24,
    left: 34,
  },
  legend: {
    top: 0,
    right: 0,
    itemWidth: 8,
    itemHeight: 8,
    textStyle: {
      color: '#8fa8c8',
      fontSize: 10,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(4, 11, 20, 0.92)',
    borderColor: 'rgba(70, 165, 255, 0.24)',
    textStyle: {
      color: '#d8e8ff',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartTimeline.value,
    axisLine: {
      lineStyle: {
        color: 'rgba(92, 142, 210, 0.24)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#6f86a6',
      fontSize: 10,
    },
  },
  yAxis: [
    {
      type: 'value',
      name: 'ms',
      min: 100,
      max: 200,
      nameTextStyle: {
        color: '#6f86a6',
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(92, 142, 210, 0.08)',
        },
      },
      axisLabel: {
        color: '#6f86a6',
        fontSize: 10,
      },
    },
    {
      type: 'value',
      name: '%',
      min: 0,
      max: 100,
      nameTextStyle: {
        color: '#6f86a6',
        fontSize: 10,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: '#6f86a6',
        fontSize: 10,
      },
    },
  ],
  series: [
    {
      name: '链路时延',
      type: 'line',
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      data: chartSeries.value.latency,
      areaStyle: {
        color: 'rgba(70, 165, 255, 0.1)',
      },
    },
    {
      name: '在线率',
      type: 'line',
      smooth: true,
      showSymbol: false,
      yAxisIndex: 1,
      data: chartSeries.value.onlineRate,
    },
    {
      name: '执行率',
      type: 'line',
      smooth: true,
      showSymbol: false,
      yAxisIndex: 1,
      data: chartSeries.value.executionRate,
    },
  ],
}))
</script>

<template>
  <PanelCard eyebrow="Module 04" title="图表趋势区">
    <template #actions>
      <StatusTag label="ECharts 已接入" tone="primary" :with-dot="false" />
    </template>

    <div class="mini-chart">
      <div class="mini-chart__echarts">
        <VChart class="mini-chart__echart" :option="trendOption" autoresize />
      </div>

      <div class="mini-chart__metrics">
        <div v-for="metric in chartMetrics" :key="metric.label" class="chart-metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}{{ metric.unit }}</strong>
        </div>
      </div>
    </div>
  </PanelCard>
</template>
