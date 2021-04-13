type Size = 'sm' | 'md' | 'lg';

const MEDIUM_STICK_WIDTH = 0.3125;
const MEDIUM_STICK_HEIGHT = 3.125;
const MEDIUM_AVATAR_RADIUS = 1;

const computeAttenderSize = (size?: Size) => {
  let avatarRadius;
  let stickWidth;
  let stickHeight;

  switch (size) {
    case 'sm':
      stickWidth = MEDIUM_STICK_WIDTH * 0.66;
      stickHeight = MEDIUM_STICK_HEIGHT * 0.66;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 0.66;
      break;

    case 'lg':
      stickWidth = MEDIUM_STICK_WIDTH * 1.44;
      stickHeight = MEDIUM_STICK_HEIGHT * 1.44;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 1.44;
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
