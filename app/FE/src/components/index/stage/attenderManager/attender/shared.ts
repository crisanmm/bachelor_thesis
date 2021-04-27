type Size = 'sm' | 'md' | 'lg';

const MEDIUM_STICK_WIDTH = 0.5;
const MEDIUM_STICK_HEIGHT = 5;
const MEDIUM_AVATAR_RADIUS = 2;

const computeAttenderSize = (size?: Size) => {
  let avatarRadius;
  let stickWidth;
  let stickHeight;

  switch (size) {
    case 'sm':
      stickWidth = MEDIUM_STICK_WIDTH * 0.75;
      stickHeight = MEDIUM_STICK_HEIGHT * 0.75;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 0.75;
      break;

    case 'lg':
      stickWidth = MEDIUM_STICK_WIDTH * 1.5;
      stickHeight = MEDIUM_STICK_HEIGHT * 1.75;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 1.5;
      break;

    default:
      stickWidth = MEDIUM_STICK_WIDTH;
      stickHeight = MEDIUM_STICK_HEIGHT;
      avatarRadius = MEDIUM_AVATAR_RADIUS;
      break;
  }

  return [stickWidth, stickHeight, avatarRadius];
};

export type { Size };
export { computeAttenderSize };
