import type { UserAttributes } from '#utils';

type Position = [number, number, number];

type AttenderType = {
  position: Position;
} & UserAttributes;

export type { Position, AttenderType };
