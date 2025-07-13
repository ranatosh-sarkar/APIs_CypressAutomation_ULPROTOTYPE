import http from 'k6/http';
import { check, sleep } from 'k6';

/* -------------------------------------------------------------------
   Test options
------------------------------------------------------------------- */
export const options = {
  // three traffic patterns that run one after another
  scenarios: {
    // 1) quick health‑check
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      tags: { test_type: 'smoke' },
    },

    // 2) steady  load phase
    steady_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 },   // ramp‑up
        { duration: '60s', target: 10 },   // hold
        { duration: '30s', target: 0 },    // ramp‑down
      ],
      gracefulRampDown: '0s',
      startTime: '10s',                     // starts after smoke test
      tags: { test_type: 'load' },
    },

    // 3) short traffic spike
    spike: {
      executor: 'constant-vus',
      vus: 50,
      duration: '15s',
      startTime: '1m40s',                  // starts after load test
      tags: { test_type: 'spike' },
    },
  },

  // fail the run if these are breached
  thresholds: {
    http_req_duration: ['p(95)<300'], // 95% of responses < 300 ms
    http_req_failed:   ['rate<0.01'], // < 1 % errors
    checks:            ['rate>0.99'], // 99 % of checks must pass
  },
};

/* -------------------------------------------------------------------
   Optional one‑time setup – e.g. login to obtain a token
------------------------------------------------------------------- */
export function setup () {
  // const authRes = http.post('http://localhost:8082/auth', { user: 'x', pass: 'y' });
  // return { token: authRes.json('token') };
}

/* -------------------------------------------------------------------
   Default function run by every virtual user
------------------------------------------------------------------- */
export default function (data) {
  // const headers = { Authorization: `Bearer ${data.token}` };
  const res = http.get('http://localhost:8082/UL_SavingsAccount-API_prototype/registers');

  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(1); // think‑time so we don’t hammer the API unrealistically
}