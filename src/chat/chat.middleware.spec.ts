import { ChatMiddleware } from './chat.middleware';

describe('ChatMiddleware', () => {
  it('should be defined', () => {
    expect(new ChatMiddleware()).toBeDefined();
  });
});
