//import puppeteer from "puppeteer";

//const TESTURL = "http://localhost:8080/test.html";

/*let page,
    browser;*/

beforeAll(async () => {

    //browser = await puppeteer.launch();

    //page = await browser.newPage();

});

describe("Test Constructor", () => {

    test("throws error when called with non-HTMLInputElement", async () => {

        let input = document.createElement('div');

        expect(() => {
            let errorTest = new Validator(input);
        }).toThrowError();

    });

    test("throws error when called with wrong type of HTMLInputElement", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'radio');

        expect(() => {
            let errorTest = new Validator(input);
        }).toThrowError();

    });

    test("throws error when called with HTMLInputElement with correct type but no pattern or required attributes or settings", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');

        expect(() => {
            let errorTest = new Validator(input);
        }).toThrowError();

    });

    test("doesn't throw error when called with HTMLInputElement with correct type and required attribute", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);

        expect(() => {
            let errorTest = new Validator(input);
        }).not.toThrowError();

    });

    test("doesn't throw error when called with HTMLInputElement with correct type and required option passed to constructor", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');

        expect(() => {
            let errorTest = new Validator(input, {required: true});
        }).not.toThrowError();

    });

    test("doesn't throw error when called with HTMLInputElement with correct type and pattern attribute", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('pattern', '[a-zA-Z]');

        expect(() => {
            let errorTest = new Validator(input);
        }).not.toThrowError();

    });

    test("doesn't throw error when called with HTMLInputElement with correct type and pattern option passed to constructor", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');

        expect(() => {
            let errorTest = new Validator(input, {pattern: '/[a-zA-Z]/'});
        }).not.toThrowError();

    });

    test("has method 'validate'", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);
        let funcTest = new Validator(input);

        expect(funcTest.validate).toBeInstanceOf(Function);

    });

    test("has method 'disable'", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);
        let funcTest = new Validator(input);

        expect(funcTest.disable).toBeInstanceOf(Function);

    });

});



describe("Test Functionality", () => {

    test("calls options.requiredCallback with inputElement when required attribute set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.required = true;
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            requiredCallback: testCallback,
        });
        input.focus();
        input.blur();

        expect(testCallback).toHaveBeenCalledWith(input);

    });

    test("calls options.requiredCallback with inputElement when options.required set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testCallback,
        });
        input.focus();
        input.blur();

        expect(testCallback).toHaveBeenCalledWith(input);

    });

    test("does not call options.requiredCallback when required test passes", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testCallback,
        });
        input.focus();
        input.value = '111';
        input.blur();

        expect(testCallback).not.toHaveBeenCalled();

    });

    test("calls options.patternCallback with inputElement when pattern attribute set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('pattern', '^[a-z]+$');
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            patternCallback: testCallback,
        });
        input.focus();
        input.value = '111';
        input.blur();

        expect(testCallback).toHaveBeenCalledWith(input);

    });

    test("calls options.patternCallback with inputElement when options.pattern set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            pattern: '[a-z]',
            patternCallback: testCallback,
        });
        input.focus();
        input.value = '111';
        input.blur();

        expect(testCallback).toHaveBeenCalledWith(input);

    });

    test("does not call options.patternCallback when pattern test passes", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testCallback = jest.fn();
        let callbackTest = new Validator(input, {
            pattern: '^[a-z]+$',
            patternCallback: testCallback,
        });
        input.focus();
        input.value = 'abc';
        input.blur();

        expect(testCallback).not.toHaveBeenCalled();

    });

    test("does not call options.patternCallback when required test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
        });
        input.focus();
        input.value = '';
        input.blur();

        expect(testRequiredCallback).toHaveBeenCalled();
        expect(testPatternCallback).not.toHaveBeenCalled();

    });

    test("does not call any callbacks after being disabled", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
        });
        callbackTest.disable();
        input.focus();
        input.blur();

        expect(testRequiredCallback).not.toHaveBeenCalled();

        input.focus();
        input.value = '111';
        input.blur();

        expect(testPatternCallback).not.toHaveBeenCalled();

    });

    test("does not call any callbacks when options.autoInit == false", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            autoInit: false,
        });

        input.focus();
        input.blur();
        expect(testRequiredCallback).not.toHaveBeenCalled();

        input.focus();
        input.value = '111';
        input.blur();
        expect(testPatternCallback).not.toHaveBeenCalled();

    });

});

afterAll(() => {
    //browser.close();
});