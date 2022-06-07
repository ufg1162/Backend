const validator = require('./validators')

describe("validateEmail", function() {
    it("false if @ symbol missing", function(){
        expect(validator.validateEmail("error.com")).toBeFalsy();
    })

    it("false if . missing", function(){
        expect(validator.validateEmail("have@errorcom")).toBeFalsy();
    })

    it("false if . right after @ symbol", function(){
        expect(validator.validateEmail("this@.com")).toBeFalsy();
    })

    it("false if more than 4 words after .", function(){
        expect(validator.validateEmail("this@have.errors")).toBeFalsy();
    })

    it("true for valid email", function(){
        expect(validator.validateEmail("this@one.com")).toBeTruthy();
    })
})