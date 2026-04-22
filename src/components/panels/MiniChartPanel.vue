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
  color: ['#4a97c4', '#43b077', '#c79447'],
  animation: false,
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
      color: '#a3b2c7',
      fontSize: 10,
    },
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(4, 11, 20, 0.92)',
    borderColor: 'rgba(74, 151, 196, 0.24)',
    textStyle: {
      color: '#e7eef8',
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: chartTimeline.value,
    axisLine: {
      lineStyle: {
        color: 'rgba(148, 163, 184, 0.2)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#718197',
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
        color: '#718197',
        fontSize: 10,
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(148, 163, 184, 0.08)',
        },
      },
      axisLabel: {
        color: '#718197',
        fontSize: 10,
      },
    },
    {
      type: 'value',
      name: '%',
      min: 0,
      max: 100,
      nameTextStyle: {
        color: '#718197',
        fontSize: 10,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: '#718197',
        fontSize: 10,
      },
    },
  ],
  series: [
    {
      name: '链路时延',
      type: 'line',
      smooth: true,
      showSymbol: true,
      symbolSize: 4,
      yAxisIndex: 0,
      data: chartSeries.value.latency,
      lineStyle: {
        width: 2,
      },
      areaStyle: {
        color: 'rgba(74, 151, 196, 0.08)',
      },
    },
    {
      name: '在线率',
      type: 'line',
      smooth: true,
      showSymbol: true,
      symbolSize: 4,
      yAxisIndex: 1,
      data: chartSeries.value.onlineRate,
      lineStyle: {
        width: 2,
      },
    },
    {
      name: '执行率',
      type: 'line',
      smooth: true,
      showSymbol: true,
      symbolSize: 4,
      yAxisIndex: 1,
      data: chartSeries.value.executionRate,
      lineStyle: {
        width: 2,
      },
    },
  ],
}))
</script>

<template>
  <PanelCard eyebrow="指标" title="运行采样" subtitle="联调采样数据，用于观察链路波动">
    <template #actions>
      <StatusTag label="实时指标" tone="primary" :with-dot="false" />
    </template>

    <div class="mini-chart">
      <div class="mini-chart__echarts">
        <VChart class="mini-chart__echart" :option="trendOption" autoresize />
      </div>

      <div class="mini-chart__metrics">
        <div v-for="metric in chartMetrics" :key="metric.label" class="chart-metric">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}{{ metric.unit }}</strong>
          <small>{{ metric.trend }}</small>
        </div>
      </div>
    </div>
  </PanelCard>
</template>
