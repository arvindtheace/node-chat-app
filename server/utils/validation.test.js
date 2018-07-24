const expect = require('expect');
const { isRealString } = require('./validation');

describe('isRealString', () => {
    it('should reject non-string values', () => {
        var str = 123;
        var isValid = isRealString(str);
        expect(isValid).toBe(false);
    })
    it('should reject empty spaces', () => {
        var str = "    ";
        var isValid = isRealString(str);
        expect(isValid).toBe(false);
    })
    it('should allow string with non-space characters', () => {
        var str = "   test   ";
        var isValid = isRealString(str);
        expect(isValid).toBe(true);
    })
});