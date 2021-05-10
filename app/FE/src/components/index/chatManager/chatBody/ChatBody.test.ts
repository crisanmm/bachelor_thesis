import { computeSpacing } from './ChatBody';
import { MessageType } from '../shared';

describe('Chat body', () => {
  describe('Compute spacing', () => {
    test('should return 2 (lower bound) for 5 seconds difference', () => {
      const spacing = computeSpacing({ time: 5000 } as MessageType, { time: 0 } as MessageType);
      expect(spacing).toBe(2);
    });

    test('should return 32 (upper bound) for 24 hours difference', () => {
      const spacing = computeSpacing({ time: 8.64e7 } as MessageType, { time: 0 } as MessageType);
      expect(spacing).toBe(32);
    });

    test('should return 8 for 1600 seconds difference', () => {
      const spacing = computeSpacing({ time: 16e5 } as MessageType, { time: 0 } as MessageType);
      expect(spacing).toBe(8);
    });
  });
});
