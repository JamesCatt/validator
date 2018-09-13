//import puppeteer from "puppeteer";
const Keysim = require('keysim'); // Used to simulate user input. Note that this only fires the events, so input value still has to be set programmatically in the tests

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

    test("has method 'enable'", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);
        let funcTest = new Validator(input);

        expect(funcTest.enable).toBeInstanceOf(Function);

    });

    test("has method 'disable'", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('required', true);
        let funcTest = new Validator(input);

        expect(funcTest.disable).toBeInstanceOf(Function);

    });

});

/////////////////////////
// Functionality tests //
/////////////////////////

describe("Test Functionality", () => {

    test("calls only options.requiredCallback with inputElement when required attribute set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.required = true;
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        input.focus();
        input.blur();

        expect(testRequiredCallback).toHaveBeenCalledWith(input);
        expect(testPatternCallback).not.toHaveBeenCalled();
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

    test("calls only options.requiredCallback with inputElement when options.required set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        input.focus();
        input.blur();

        expect(testRequiredCallback).toHaveBeenCalledWith(input);
        expect(testPatternCallback).not.toHaveBeenCalled();
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

    test("calls only options.patternCallback with inputElement when pattern attribute set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('pattern', '^[a-z]+$');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        input.focus();
        let keyboard = Keysim.Keyboard.US_ENGLISH;
        input.value = '111';
        keyboard.dispatchEventsForInput("111", input);

        expect(testRequiredCallback).not.toHaveBeenCalled();
        expect(testPatternCallback).toHaveBeenCalledWith(input);
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

    test("calls only options.patternCallback with inputElement when options.pattern set and test fails", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        input.focus();
        let keyboard = Keysim.Keyboard.US_ENGLISH;
        input.value = '111';
        keyboard.dispatchEventsForInput("111", input);

        expect(testRequiredCallback).not.toHaveBeenCalled();
        expect(testPatternCallback).toHaveBeenCalledWith(input);
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

    test("calls only options.successCallback with inputElement when all tests pass", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        input.focus();
        let keyboard = Keysim.Keyboard.US_ENGLISH;
        input.value = 'test';
        keyboard.dispatchEventsForInput("test", input);

        expect(testRequiredCallback).not.toHaveBeenCalled();
        expect(testPatternCallback).not.toHaveBeenCalled();
        expect(testSuccessCallback).toHaveBeenCalledWith(input);

    });

    test("does not call any callbacks after being disabled", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });
        callbackTest.disable();
        input.focus();
        input.blur();

        expect(testRequiredCallback).not.toHaveBeenCalled();

        input.focus();
        let keyboard = Keysim.Keyboard.US_ENGLISH;
        input.value = '111';
        keyboard.dispatchEventsForInput("111", input);

        expect(testPatternCallback).not.toHaveBeenCalled();
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

    test("does not call any callbacks when options.autoInit == false", async () => {

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        const testRequiredCallback = jest.fn();
        const testPatternCallback = jest.fn();
        const testSuccessCallback = jest.fn();
        let callbackTest = new Validator(input, {
            autoInit: false,
            required: true,
            requiredCallback: testRequiredCallback,
            pattern: '^[a-z]+$',
            patternCallback: testPatternCallback,
            successCallback: testSuccessCallback,
        });

        input.focus();
        input.blur();
        expect(testRequiredCallback).not.toHaveBeenCalled();

        input.focus();
        let keyboard = Keysim.Keyboard.US_ENGLISH;
        input.value = '111';
        keyboard.dispatchEventsForInput("111", input);
        expect(testPatternCallback).not.toHaveBeenCalled();

        input.value = 'test';
        keyboard.dispatchEventsForInput("test", input);
        expect(testSuccessCallback).not.toHaveBeenCalled();

    });

});

afterAll(() => {
    //browser.close();
});