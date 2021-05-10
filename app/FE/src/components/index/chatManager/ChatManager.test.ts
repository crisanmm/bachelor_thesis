import { HeaderChatType } from './shared';
import { getSelectedHeaderChat } from './ChatManager';

describe('Chat Manager getSelectedHeaderChat', () => {
  beforeAll(() => {
    const headerChats: HeaderChatType[] = [
      { user: { id: 'global', name: 'Global', email: '' }, selected: true },
      { user: { id: 'stage', name: 'Stage', email: '' }, selected: false },
      { user: { id: 'drake', name: 'Drake', email: '' }, selected: false },
      {
        user: { id: '4f5cd51e-770a-4123-97e8-55baeb910b3c', name: 'user one name', email: '' },
        selected: false,
      },
      {
        user: { id: 'd3a1d2c1-03e3-452c-bf40-00eb5bf639e3', name: 'user two name', email: '' },
        selected: false,
      },
    ];
  });

  test('should throw error when there is no selected header chat', () => {
    expect(getSelectedHeaderChat([])).toThrow();
  });
});
