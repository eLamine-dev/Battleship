import add from './index';

test('should add two numbers', () => {
   const result = add(3, 4);
   expect(result).toBe(7);
});
