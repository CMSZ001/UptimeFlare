const pageConfig = {
  // Title for your status page
  title: "UptimeFlare",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://github.com/CMSZ001', label: 'GitHub', highlight: true },
    { link: 'mailto:me@acmsz.top', label: '联系我', highlight: true },
  ],
  group: {
    "网页服务监控": ['blog', 'umami'],
    "服务器服务监控": ['mcserver'],
  },
}

const workerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    {
      id: 'blog',
      name: '博客',
      method: 'GET',
      target: 'https://blog.acmsz.top',
      tooltip: '',
      statusPageLink: 'https://blog.acmsz.top',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
    },
    {
      id: 'dnsflare',
      name: 'Dnsflare',
      method: 'GET',
      target: 'https://dnsflare.acmsz.top',
      tooltip: '',
      statusPageLink: 'https://dnsflare.acmsz.top',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
    },
    {
      id: 'umami',
      name: 'Umami',
      method: 'GET',
      target: 'https://umami.acmsz.top',
      tooltip: '',
      statusPageLink: '',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
    },
    {
      id: 'hw',
      name: '作业 | Docsify',
      method: 'GET',
      target: 'https://hw.acmsz.top',
      tooltip: '',
      statusPageLink: 'https://hw.acmsz.top',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
      checkProxy: 'worker://apac',
    },
    {
      id: 'mcserver',
      name: 'MineCraft Server',
      method: 'TCP_PING',
      target: 'om.rainplay.cn:23659',
      tooltip: '',
      statusPageLink: '',
      timeout: 5000,
      checkProxy: 'worker://apac',
    },
  ],
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called when there's a status change for any monitor
      // Write any Typescript code here

      // This will not follow the grace period settings and will be called immediately when the status changes
      // You need to handle the grace period manually if you want to implement it
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
      // Write any Typescript code here
    },
  },
}

// Don't forget this, otherwise compilation fails.
export { pageConfig, workerConfig }
