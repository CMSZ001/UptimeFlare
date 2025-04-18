import Head from 'next/head'

import { Inter } from 'next/font/google'
import { MonitorState, MonitorTarget } from '@/uptime.types'
import { KVNamespace } from '@cloudflare/workers-types'
import { pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import Header from '@/components/Header'
import MonitorList from '@/components/MonitorList'
import { Center, Divider, Text } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  state: stateStr,
  monitors,
}: {
  state: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  let state;
  if (stateStr !== undefined) {
    state = JSON.parse(stateStr) as MonitorState
  }

  // Specify monitorId in URL hash to view a specific monitor (can be used in iframe)
  const monitorId = window.location.hash.substring(1);
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId);
    if (!monitor || !state) {
      return (
        <Text fw={700}>
          未找到 ID 为 {monitorId} 的服务！
        </Text>
      )
    }
    return (
      <div style={{ maxWidth: '810px' }}>
        <MonitorDetail monitor={monitor} state={state} />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Header />

        {state === undefined ? (
          <Center>
            <Text fw={700}>
              当前服务状态未定义，请检查您的 Worker 状态以及 KV 绑定！
              binding!
            </Text>
          </Center>
        ) : (
          <div>
            <OverallStatus state={state} />
            <MonitorList monitors={monitors} state={state} />
          </div>
        )}

        <Divider mt="lg" />
        <Text size="xs" mt="xs" mb="xs" style={{
          textAlign: 'center'
        }}>
          技术支持{' '}
          <a href="https://github.com/CMSZ001/UptimeFlare" target="_blank">UptimeFlare</a><br/>
          Made with ❤ by{' '}
          <a href="https://github.com/lyc8503" target="_blank">lyc8503</a>
          {' '}and{' '}
          <a href="https://github.com/CMSZ001" target="_blank">CMSZ001</a>
          .
        </Text>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const { UPTIMEFLARE_STATE } = process.env as unknown as {
    UPTIMEFLARE_STATE: KVNamespace
  }

  // Read state as string from KV, to avoid hitting server-side cpu time limit
  const state = (await UPTIMEFLARE_STATE?.get('state')) as unknown as MonitorState

  // Only present these values to client
  const monitors = workerConfig.monitors.map((monitor) => {
    return {
      id: monitor.id,
      name: monitor.name,
      // @ts-ignore
      tooltip: monitor?.tooltip,
      // @ts-ignore
      statusPageLink: monitor?.statusPageLink,
      // @ts-ignore
      hideLatencyChart: monitor?.hideLatencyChart,
    }
  })

  return { props: { state, monitors } }
}
