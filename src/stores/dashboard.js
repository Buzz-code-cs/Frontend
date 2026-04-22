import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const createTimeStamp = () =>
  new Date().toLocaleTimeString('zh-CN', {
    hour12: false,
  })

const createLog = (message, tone = 'info') => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  time: createTimeStamp(),
  message,
  tone,
})

const countEffectiveLines = (source) => source.split('\n').filter((line) => line.trim()).length

export const useDashboardStore = defineStore('dashboard', () => {
  const systemStatus = ref({
    brand: 'RescuLink',
    systemName: 'RescuLink 异构装备联合搜救平台',
    onlineLabel: '系统在线',
    missionCode: 'RSL-0423',
    linkStability: '98.4%',
    rescueMode: '联合搜索',
    networkPolicy: 'MESH / 边缘自治',
    location: '嘉陵江北岸 / 南山联防区',
    riskLevel: 'III 级预警',
    riskTone: 'danger',
    lastUpdate: '08:23:41',
    dataSource: '模拟接入 / 本地联调',
    version: 'v0.3.2',
  })

  const commander = ref({
    seat: '当前席位',
    displayName: '前端可视化联调台',
    affiliation: '西南大学 / 竞赛联调环境',
    authLevel: '指挥权限 A',
    operator: '杨凯量',
  })

  const devices = ref([
    {
      id: 'drone-alpha',
      icon: '空',
      callSign: 'AIR-A1',
      name: '无人机 A 组',
      role: '高空侦察 / 热成像扫描',
      status: '在线',
      tone: 'success',
      battery: '84%',
      signal: '-62 dBm',
      zone: '扇区 A-03',
      adapter: 'drone.swarm.alpha',
      protocol: 'DJI SDK / MQTT',
      service: 'adapter-air-scout',
      authority: '远程联控',
      latency: '136ms',
      lastSeen: '18 秒前',
      capabilities: ['热成像', '三维建图', '高空回传'],
    },
    {
      id: 'dog-beta',
      icon: '地',
      callSign: 'GROUND-B2',
      name: '机器狗 B 组',
      role: '地面复核 / 近距执行',
      status: '待命',
      tone: 'info',
      battery: '67%',
      signal: '-70 dBm',
      zone: '扇区 B-01',
      adapter: 'ground.unit.beta',
      protocol: 'ROS2 / WebSocket',
      service: 'adapter-ground-verify',
      authority: '近距半自治',
      latency: '168ms',
      lastSeen: '31 秒前',
      capabilities: ['废墟穿越', '近距复核', '环境采样'],
    },
    {
      id: 'vehicle-gamma',
      icon: '车',
      callSign: 'RELAY-G3',
      name: '通信中继车',
      role: '边缘自治 / 通信中继',
      status: '在线',
      tone: 'success',
      battery: '91%',
      signal: '-54 dBm',
      zone: '中继枢纽 C-02',
      adapter: 'vehicle.relay.gamma',
      protocol: 'MESH / CoT',
      service: 'adapter-relay-edge',
      authority: '边缘自治',
      latency: '118ms',
      lastSeen: '12 秒前',
      capabilities: ['自组网中继', '边缘缓存', '断点续传'],
    },
    {
      id: 'command-delta',
      icon: '指',
      callSign: 'CMD-D0',
      name: '指挥终端',
      role: '任务编排 / 态势联控',
      status: '联控中',
      tone: 'warning',
      battery: 'AC',
      signal: '有线专网',
      zone: '指挥中心',
      adapter: 'command.delta',
      protocol: 'JSARL / REST',
      service: 'language-runtime-core',
      authority: 'A级指挥',
      latency: '42ms',
      lastSeen: '本机',
      capabilities: ['任务编排', '语义校验', '指令审计'],
    },
  ])

  const selectedDeviceId = ref(devices.value[0].id)
  const draggingDeviceId = ref('')

  const situationMarkers = ref([
    {
      id: 'm-1',
      deviceId: 'drone-alpha',
      tone: 'blue',
      top: '18%',
      left: '24%',
      code: 'A-01',
      label: '无人机侦察编队',
      meta: '热成像扫描 / 高空回传',
      altitude: '120m',
      z: '62px',
    },
    {
      id: 'm-2',
      deviceId: 'dog-beta',
      tone: 'green',
      top: '61%',
      left: '40%',
      code: 'B-02',
      label: '地面机器人复核组',
      meta: '堤脚巡检 / 近距确认',
      altitude: '8m',
      z: '18px',
    },
    {
      id: 'm-3',
      deviceId: null,
      tone: 'red',
      top: '42%',
      left: '66%',
      code: 'R-17',
      label: '高风险漫溢点',
      meta: '水位异常 / 需二次确认',
      altitude: '+1.4m',
      z: '42px',
    },
    {
      id: 'm-4',
      deviceId: 'vehicle-gamma',
      tone: 'blue',
      top: '78%',
      left: '77%',
      code: 'G-03',
      label: '通信中继车',
      meta: '边缘自治 / MESH 回传',
      altitude: '32m',
      z: '34px',
    },
    {
      id: 'm-5',
      deviceId: 'command-delta',
      tone: 'amber',
      top: '26%',
      left: '76%',
      code: 'C-01',
      label: '临时指挥节点',
      meta: '联控汇聚 / 指令编排',
      altitude: '18m',
      z: '28px',
    },
  ])

  const terrainColumns = ref([
    {
      id: 'elevation-1',
      top: '23%',
      left: '19%',
      size: '58px',
      height: '32px',
      tone: 'primary',
      label: '堤线高程',
    },
    {
      id: 'elevation-2',
      top: '48%',
      left: '67%',
      size: '70px',
      height: '56px',
      tone: 'danger',
      label: '漫溢风险',
    },
    {
      id: 'elevation-3',
      top: '70%',
      left: '38%',
      size: '54px',
      height: '24px',
      tone: 'success',
      label: '地面复核',
    },
    {
      id: 'elevation-4',
      top: '78%',
      left: '77%',
      size: '62px',
      height: '42px',
      tone: 'primary',
      label: '中继覆盖',
    },
  ])

  const routes = ref([
    {
      id: 'route-alpha',
      tone: 'primary',
      label: '空中搜索走廊',
      top: '44%',
      left: '18%',
      width: '29%',
      rotate: '14deg',
      labelTop: '39%',
      labelLeft: '26%',
    },
    {
      id: 'route-beta',
      tone: 'primary',
      label: '地面复核路径',
      top: '67%',
      left: '39%',
      width: '28%',
      rotate: '-9deg',
      labelTop: '70%',
      labelLeft: '49%',
    },
    {
      id: 'route-gamma',
      tone: 'success',
      label: '中继回传链路',
      top: '52%',
      left: '61%',
      width: '15%',
      rotate: '56deg',
      labelTop: '56%',
      labelLeft: '69%',
    },
  ])

  const taskZones = ref([
    {
      id: 'zone-a',
      code: 'A-03',
      title: '上游搜索扇区',
      top: '20%',
      left: '16%',
      width: '24%',
      height: '20%',
      tone: 'primary',
      assignedDeviceId: 'drone-alpha',
    },
    {
      id: 'zone-b',
      code: 'B-01',
      title: '堤脚复核带',
      top: '54%',
      left: '31%',
      width: '22%',
      height: '18%',
      tone: 'success',
      assignedDeviceId: 'dog-beta',
    },
    {
      id: 'zone-c',
      code: 'H-07',
      title: '重点险情控制区',
      top: '33%',
      left: '56%',
      width: '16%',
      height: '16%',
      tone: 'danger',
      assignedDeviceId: '',
    },
  ])

  const terrainLabels = ref([
    { id: 't-1', top: '13%', left: '10%', text: '北岸堤线', kind: 'ridge' },
    { id: 't-2', top: '74%', left: '17%', text: '低洼居民点', kind: 'settlement' },
    { id: 't-3', top: '28%', left: '50%', text: '临时集结场', kind: 'facility' },
    { id: 't-4', top: '49%', left: '73%', text: '漫溢口', kind: 'danger' },
  ])

  const situationLegend = ref([
    { id: 'l-1', tone: 'blue', label: '空中 / 中继装备' },
    { id: 'l-2', tone: 'green', label: '地面执行节点' },
    { id: 'l-3', tone: 'red', label: '高风险目标' },
  ])

  const fieldNotes = ref([
    {
      id: 'note-risk',
      top: '37%',
      left: '73%',
      title: '待复核',
      body: 'R-17 水位读数偏高，优先派地面组二次确认。',
      tone: 'danger',
    },
    {
      id: 'note-relay',
      top: '82%',
      left: '56%',
      title: '调度备注',
      body: 'G-03 可作为弱网缓存节点，回传优先级调高。',
      tone: 'primary',
    },
  ])

  const jsarlSource = ref(`// 嘉陵江北岸联调脚本
// 重点：R-17 漫溢点二次确认，弱网时启用中继缓存
mission FloodRescueAlpha {
  use device "drone-alpha" mapped_to NEMS.Air.Scout
  use device "dog-beta" mapped_to NEMS.Ground.Verify

  on receive risk.level == HIGH {
    dispatch drone-alpha -> sector("A-03")
    dispatch dog-beta -> waypoint("B-01")
    sync vehicle-gamma -> relay("mesh-backhaul")
  }

  when terrain.visibility < 0.45 {
    enable protocol MESH_FALLBACK
    cache telemetry at edge.node("vehicle-gamma")
  }

  emit summary -> command-delta
}`)

  const parseRevision = ref(1)

  const chartMetrics = ref([
    {
      label: '链路时延',
      value: '142',
      unit: 'ms',
      trend: '近 10 分钟 -12ms',
      ratio: 68,
      tone: 'primary',
    },
    {
      label: '设备在线率',
      value: '91',
      unit: '%',
      trend: '4 类装备接入',
      ratio: 91,
      tone: 'success',
    },
    {
      label: '任务执行率',
      value: '76',
      unit: '%',
      trend: '边缘执行待确认',
      ratio: 76,
      tone: 'warning',
    },
  ])

  const chartTimeline = ref(['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'])

  const chartSeries = ref({
    latency: [186, 172, 148, 142, 158, 136],
    onlineRate: [82, 84, 89, 91, 88, 93],
    executionRate: [54, 61, 69, 76, 72, 81],
  })

  const executionLogs = ref([
    {
      id: 'log-1',
      time: '08:00:12',
      message: 'drone.swarm.alpha 已映射到 adapter-air-scout',
      tone: 'success',
    },
    {
      id: 'log-2',
      time: '08:00:15',
      message: 'JSARL 运行时完成语义规则加载',
      tone: 'info',
    },
    {
      id: 'log-3',
      time: '08:00:20',
      message: '任务脚本等待指挥席人工确认',
      tone: 'warning',
    },
  ])

  const selectedDevice = computed(
    () => devices.value.find((device) => device.id === selectedDeviceId.value) ?? devices.value[0],
  )

  const draggingDevice = computed(() =>
    devices.value.find((device) => device.id === draggingDeviceId.value),
  )

  const isDeviceDragging = computed(() => Boolean(draggingDeviceId.value))

  const taskZonesWithAssignments = computed(() =>
    taskZones.value.map((zone) => ({
      ...zone,
      assignedDevice: devices.value.find((device) => device.id === zone.assignedDeviceId),
    })),
  )

  const deviceCountLabel = computed(() => `${devices.value.length}类接入`)

  const selectedDeviceProfile = computed(() => [
    {
      label: '协议适配',
      value: selectedDevice.value.protocol,
    },
    {
      label: '服务端点',
      value: selectedDevice.value.service,
    },
    {
      label: '控制权限',
      value: selectedDevice.value.authority,
      tone: selectedDevice.value.tone,
    },
    {
      label: '链路时延',
      value: selectedDevice.value.latency,
    },
  ])

  const servicePipeline = ref([
    {
      id: 'app',
      name: '指挥应用层',
      desc: '任务规划、态势监控、指令下发',
      status: '就绪',
      tone: 'success',
    },
    {
      id: 'runtime',
      name: 'JSARL 语言运行时',
      desc: '解析 DSL、语义校验、生成标准指令流',
      status: '运行中',
      tone: 'primary',
    },
    {
      id: 'adapter',
      name: '协议适配服务',
      desc: '映射异构设备协议，屏蔽通信壁垒',
      status: '路由中',
      tone: 'warning',
    },
    {
      id: 'edge',
      name: '边缘自治节点',
      desc: '弱网缓存、断点续传、本地协同执行',
      status: '同步中',
      tone: 'success',
    },
  ])

  const missionStages = ref([
    { id: 'stage-1', label: '设备发现', active: true },
    { id: 'stage-2', label: '语言解析', active: true },
    { id: 'stage-3', label: '路由编排', active: true },
    { id: 'stage-4', label: '边缘执行', active: false },
  ])

  const semanticChecks = computed(() => [
    {
      id: 'check-device',
      label: '设备映射',
      status: '通过',
      tone: 'success',
      desc: `${selectedDevice.value.id} -> ${selectedDevice.value.adapter}`,
    },
    {
      id: 'check-domain',
      label: '领域语义',
      status: '通过',
      tone: 'success',
      desc: 'mapped_to 路径已绑定救援装备能力模型',
    },
    {
      id: 'check-protocol',
      label: '协议解耦',
      status: '通过',
      tone: 'primary',
      desc: `${selectedDevice.value.protocol} 由适配器服务屏蔽差异`,
    },
    {
      id: 'check-edge',
      label: '弱网策略',
      status: selectedDevice.value.service.includes('edge') ? '本地自治' : 'MESH',
      tone: selectedDevice.value.service.includes('edge') ? 'success' : 'warning',
      desc: systemStatus.value.networkPolicy,
    },
  ])

  const routePlan = computed(() => [
    {
      id: 'route-command',
      from: 'command-delta',
      to: 'language-runtime-core',
      channel: '脚本解析',
      latency: '42ms',
    },
    {
      id: 'route-adapter',
      from: 'language-runtime-core',
      to: selectedDevice.value.service,
      channel: '语义路由',
      latency: selectedDevice.value.latency,
    },
    {
      id: 'route-device',
      from: selectedDevice.value.service,
      to: selectedDevice.value.id,
      channel: selectedDevice.value.protocol,
      latency: selectedDevice.value.signal,
    },
  ])

  const parseSummary = computed(() => [
    {
      label: '目标设备',
      value: selectedDevice.value.name,
    },
    {
      label: '协议适配',
      value: selectedDevice.value.adapter,
    },
    {
      label: '事件规则',
      value: `${countEffectiveLines(jsarlSource.value)} 行脚本`,
    },
    {
      label: '解析版本',
      value: `v1.${parseRevision.value}`,
    },
  ])

  const compiledPayload = computed(() =>
    JSON.stringify(
      {
        mission: 'FloodRescueAlpha',
        revision: `v1.${parseRevision.value}`,
        sourceLines: countEffectiveLines(jsarlSource.value),
        target: {
          id: selectedDevice.value.id,
          name: selectedDevice.value.name,
          zone: selectedDevice.value.zone,
          adapter: selectedDevice.value.adapter,
          protocol: selectedDevice.value.protocol,
        },
        runtime: {
          service: selectedDevice.value.service,
          policy: systemStatus.value.networkPolicy,
          authority: selectedDevice.value.authority,
        },
        command: {
          action: 'dispatch',
          approvalRequired: true,
          operator: commander.value.operator,
          verifyRisk: true,
          telemetryBackhaul: true,
          fallback: 'MESH_FALLBACK',
        },
      },
      null,
      2,
    ),
  )

  const pushLog = (message, tone = 'info') => {
    executionLogs.value = [createLog(message, tone), ...executionLogs.value].slice(0, 8)
  }

  const updateJsarlSource = (source) => {
    jsarlSource.value = source
  }

  const startDeviceDrag = (deviceId) => {
    const nextDevice = devices.value.find((device) => device.id === deviceId)

    if (!nextDevice) {
      return
    }

    draggingDeviceId.value = deviceId
    selectedDeviceId.value = deviceId
  }

  const endDeviceDrag = () => {
    draggingDeviceId.value = ''
  }

  const assignDeviceToZone = (zoneId, deviceId = draggingDeviceId.value || selectedDeviceId.value) => {
    const targetZone = taskZones.value.find((zone) => zone.id === zoneId)
    const targetDevice = devices.value.find((device) => device.id === deviceId)

    if (!targetZone || !targetDevice) {
      endDeviceDrag()
      return
    }

    taskZones.value = taskZones.value.map((zone) =>
      zone.id === zoneId
        ? {
            ...zone,
            assignedDeviceId: targetDevice.id,
          }
        : zone,
    )

    devices.value = devices.value.map((device) =>
      device.id === targetDevice.id
        ? {
            ...device,
            zone: `${targetZone.code} / ${targetZone.title}`,
          }
        : device,
    )

    selectedDeviceId.value = targetDevice.id
    pushLog(`${targetDevice.name} 已编入 ${targetZone.code} 任务扇区`, 'success')
    endDeviceDrag()
  }

  const syncFormation = () => {
    const assignedCount = taskZones.value.filter((zone) => zone.assignedDeviceId).length
    pushLog(`装备编组已同步：${assignedCount}/${taskZones.value.length} 个任务扇区就绪`, 'success')
  }

  const selectDevice = (deviceId) => {
    if (deviceId === selectedDeviceId.value) {
      return
    }

    const nextDevice = devices.value.find((device) => device.id === deviceId)

    if (!nextDevice) {
      return
    }

    selectedDeviceId.value = deviceId
    pushLog(`当前焦点切换至 ${nextDevice.name}`, 'info')
  }

  const simulateParse = () => {
    parseRevision.value += 1
    const effectiveLines = countEffectiveLines(jsarlSource.value)
    missionStages.value = missionStages.value.map((stage) => ({
      ...stage,
      active: stage.id !== 'stage-4',
    }))
    pushLog(`JSARL 脚本解析完成：${selectedDevice.value.name}，有效 ${effectiveLines} 行`, 'success')
  }

  const dispatchSelectedDevice = () => {
    devices.value = devices.value.map((device) =>
      device.id === selectedDeviceId.value
        ? {
            ...device,
            status: '执行中',
            tone: 'warning',
          }
        : device,
    )

    missionStages.value = missionStages.value.map((stage) => ({
      ...stage,
      active: true,
    }))
    pushLog(`${selectedDevice.value.name} 已收到执行载荷`, 'warning')
  }

  return {
    systemStatus,
    commander,
    devices,
    selectedDeviceId,
    draggingDeviceId,
    selectedDevice,
    draggingDevice,
    isDeviceDragging,
    situationMarkers,
    terrainColumns,
    routes,
    taskZones,
    taskZonesWithAssignments,
    terrainLabels,
    situationLegend,
    fieldNotes,
    jsarlSource,
    executionLogs,
    chartMetrics,
    chartTimeline,
    chartSeries,
    deviceCountLabel,
    selectedDeviceProfile,
    servicePipeline,
    missionStages,
    semanticChecks,
    routePlan,
    parseSummary,
    compiledPayload,
    updateJsarlSource,
    startDeviceDrag,
    endDeviceDrag,
    assignDeviceToZone,
    syncFormation,
    selectDevice,
    simulateParse,
    dispatchSelectedDevice,
  }
})
