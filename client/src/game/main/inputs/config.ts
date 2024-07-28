import hotkeys from 'hotkeys-js';

const codes = {
  w: 87,
  d: 68,
  s: 83,
  a: 65,
  up: 38,
  right: 39,
  left: 37,
  down: 40,
  space: 32,
} as const;

export const inputs = {
  up: {
    keys: [codes.w, codes.up],
  },
  down: {
    keys: [codes.s, codes.down],
  },
  left: {
    keys: [codes.a, codes.left],
  },
  right: {
    keys: [codes.d, codes.right],
  },
  space: {
    keys: [codes.space],
  },
} as const;

type Input = { readonly keys: readonly number[] };

export const isKeyActive = (key: Input) => {
  let active = false;
  key.keys.forEach((code: number) => {
    if (hotkeys.isPressed(code)) {
      active = true;
    }
  });
  return active;
};
