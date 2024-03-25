const { sum } = require('./index');

describe("Sum Test", () =>
{
    it("adds 1 + 2 to equal 3", () =>
    {
        expect(sum(1, 2)).toBe(3);
    });

    it('should add negative numbers', () =>
    {
        expect(sum(-1, -2)).toBe(-3);
    });

    it('should add zero', () =>
    {
        expect(sum(0, 0)).toBe(0);
    });

    it('should throw an error if the inputs are not numbers', () =>
    {
        expect(() => sum('1', 2)).toThrowError();
        expect(() => sum(1, '2')).toThrowError();
    });

});
