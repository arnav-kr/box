import crypto from 'crypto';

export function hashSolution(data) {
  return crypto.createHash('sha256').
    update(data).
    digest('hex');
}

export function validateSolution(solution, hash) {
  return hash === hashSolution(solution);
}