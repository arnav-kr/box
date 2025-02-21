import crypto from 'crypto';

export function hashSolution(data) {
  return crypto.createHash('sha256').
    update(data).
    digest('hex');
}

export function validateSolution(data) {
  return data === hashSolution(data);
}