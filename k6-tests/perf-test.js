import http from 'k6/http';
import { check, sleep } from 'k6';

/* -------------------------------------------------------------------
   Test options
------------------------------------------------------------------- */
export const options = {
  scenarios: {
    // 1) Smoke test – quick health check
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '10s',
      tags: { test_type: 'smoke' },
    },

    // 2) Steady load phase
    steady_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 10 }, // ramp-up
        { duration: '60s', target: 10 }, // steady
        { duration: '30s', target: 0 },  // ramp-down
      ],
      gracefulRampDown: '0s',
      startTime: '10s',
      tags: { test_type: 'load' },
    },

    // 3) Spike test
    spike: {
      executor: 'constant-vus',
      vus: 50,
      duration: '15s',
      startTime: '1m40s',
      tags: { test_type: 'spike' },
    },
  },

  thresholds: {
    http_req_duration: ['p(95)<300'],  // 95% of requests < 300ms
    http_req_failed: ['rate<0.01'],    // <1% requests fail
    checks: ['rate>0.99'],             // >99% checks must pass
  },
};

/* -------------------------------------------------------------------
   Setup phase (optional)
------------------------------------------------------------------- */
export function setup() {
  // Placeholder for future token-based auth setup if needed
  // const authRes = http.post('http://localhost:8083/auth', { user: 'x', pass: 'y' });
  // return { token: authRes.json('token') };
}

/* -------------------------------------------------------------------
   VU execution
------------------------------------------------------------------- */
export default function () {
  const PORT = __ENV.API_PORT || '8083';
  const res = http.get(`http://localhost:${PORT}/UL_SavingsAccount-API_prototype/registers`);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
