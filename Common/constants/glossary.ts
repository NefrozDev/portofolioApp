const GLOSSARY_INFO_KEYS = {
  Angular: 'app.glossary.angular',
  TypeScript: 'app.glossary.typescript',
  'Node.js': 'app.glossary.nodeJs',
  Express: 'app.glossary.express',
  SCSS: 'app.glossary.scss',
  RxJS: 'app.glossary.rxjs',
  Docker: 'app.glossary.docker',
  API: 'app.glossary.api',
  'REST API': 'app.glossary.restApi',
  WebSocket: 'app.glossary.webSocket',
  'ROS / ROS2': 'app.glossary.ros',
  MQTT: 'app.glossary.mqtt',
  AI: 'app.glossary.ai',
  Gerrit: 'app.glossary.gerrit',
  'C#': 'app.glossary.cSharp',
  '.NET': 'app.glossary.dotNet',
  SQL: 'app.glossary.sql',
  'Azure DevOps': 'app.glossary.azureDevOps',
  FastAPI: 'app.glossary.fastApi',
  Python: 'app.glossary.python',
  'Microsoft Dynamics 365': 'app.glossary.dynamics365',
  'Power Platform': 'app.glossary.powerPlatform',
  Ionic: 'app.glossary.ionic',
  NgRx: 'app.glossary.ngrx',
  seo: 'app.glossary.seo',
  'ci-cd': 'app.glossary.ciCd'
} as const;

export function getGlossaryInfoKey(term: string): string | undefined {
  return GLOSSARY_INFO_KEYS[term as keyof typeof GLOSSARY_INFO_KEYS];
}
