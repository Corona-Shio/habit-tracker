export const STATUS = {
  NONE: "none",
  HALF: "half",
  DONE: "done",
  SKIP: "skip"
};

export const STATUS_ORDER = [STATUS.NONE, STATUS.HALF, STATUS.DONE, STATUS.SKIP];

export const STATUS_SCORE = {
  [STATUS.NONE]: 0,
  [STATUS.HALF]: 0.5,
  [STATUS.DONE]: 1,
  [STATUS.SKIP]: 0
};

export function cycleStatus(current) {
  const index = STATUS_ORDER.indexOf(current);
  if (index < 0) {
    return STATUS.HALF;
  }
  return STATUS_ORDER[(index + 1) % STATUS_ORDER.length];
}

export function normalizeStatus(value) {
  if (STATUS_ORDER.includes(value)) {
    return value;
  }
  return STATUS.NONE;
}
