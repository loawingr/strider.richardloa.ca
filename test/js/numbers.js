describe("numbers", function(){

    it("odd", function(){
        expect(window.numbers.isOdd(1)).toBe(true);
        expect(window.numbers.isOdd(2)).toBe(false);
    });

    it("even", function(){
        expect(window.numbers.isEven(1)).toBe(false);
        expect(window.numbers.isEven(2)).toBe(true);
    });

});