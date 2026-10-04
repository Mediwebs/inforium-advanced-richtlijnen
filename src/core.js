export function filterResources(resources, filters) {
  return resources.filter(r => (!filters.specialty || r.specialties?.includes(filters.specialty)) && (!filters.topic || r.topics.includes(filters.topic)) &&
    (!filters.task || r.tasks.includes(filters.task)) &&
    (!filters.layer || r.layer === filters.layer) &&
    (filters.demo || !r.demo));
}
export function validateManifest(m) {
  const allowed = ['id','name','version','kind','url','topics','capabilities','patientData'];
  if (!m || Object.keys(m).some(k => !allowed.includes(k))) throw new Error('Onbekend manifestveld');
  if (!/^[a-z0-9-]+$/.test(m.id) || !m.name || !/^\d+\.\d+\.\d+$/.test(m.version)) throw new Error('Ongeldige identiteit of versie');
  if (m.patientData !== false) throw new Error('Patiëntgegevens niet toegestaan');
  if (!['source-library','external-link'].includes(m.kind)) throw new Error('Onbekend moduletype');
  if (!Array.isArray(m.topics) || !m.topics.every(x => typeof x === 'string')) throw new Error('Ongeldige onderwerpen');
  if (!Array.isArray(m.capabilities) || m.capabilities.some(c => !['read-catalog','open-source'].includes(c))) throw new Error('Niet toegestane functie');
  const url = new URL(m.url);
  if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) throw new Error('Alleen vaste HTTPS-links zonder parameters');
  return m;
}
export function stageUpdate(state, event) {
  const next = {detected:'staged', staged:'reviewed', reviewed:'released'};
  if (event === 'reset') return 'idle';
  if (state === 'idle' && event === 'detect') return 'detected';
  if (event === 'advance' && next[state]) return next[state];
  throw new Error('Niet toegestane statusovergang');
}
