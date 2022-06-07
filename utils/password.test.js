const pass_validator = require('./password')


describe("validatePassword", function() {
    it("false if less than 6", function(){
        expect(pass_validator.validatePassword("hello")).toBeFalsy();
    })
    it("true if greater than or equal to 6", function(){
        expect(pass_validator.validatePassword("password")).toBeTruthy();
    })

    it("true if greater than or equal to 6", function(){
        expect(pass_validator.validatePassword("spring")).toBeTruthy();
    })

})