type Size = 'sm' | 'md' | 'lg';

const MEDIUM_STICK_WIDTH = 0.5;
const MEDIUM_STICK_HEIGHT = 5;
const MEDIUM_AVATAR_RADIUS = 2;
const MEDIUM_FONT_SIZE = 1;

const computeAttenderSize = (size?: Size) => {
  let avatarRadius;
  let stickWidth;
  let stickHeight;
  let fontSize;

  switch (size) {
    case 'sm':
      stickWidth = MEDIUM_STICK_WIDTH * 0.75;
      stickHeight = MEDIUM_STICK_HEIGHT * 0.75;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 0.75;
      fontSize = MEDIUM_FONT_SIZE * 0.8;
      break;

    case 'lg':
      stickWidth = MEDIUM_STICK_WIDTH * 1.5;
      stickHeight = MEDIUM_STICK_HEIGHT * 1.75;
      avatarRadius = MEDIUM_AVATAR_RADIUS * 1.5;
      fontSize = MEDIUM_FONT_SIZE * 1.5;
      break;

    default:
      stickWidth = MEDIUM_STICK_WIDTH;
      stickHeight = MEDIUM_STICK_HEIGHT;
      avatarRadius = MEDIUM_AVATAR_RADIUS;
      fontSize = MEDIUM_FONT_SIZE * 1;
      break;
  }

  return [stickWidth, stickHeight, avatarRadius, fontSize];
};

export type { Size };
export { computeAttenderSize };
