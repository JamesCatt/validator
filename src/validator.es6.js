

(function() {

    /**
     * @constructor
     * @param {HTMLInputElement} inputEl - The input element to be validated
     * @param {Object} options - Options object to override defaults
     * @param {boolean} options.required - Set field to be explicitly required. If not set, constructor will check for required attribute on the element.
     * @param {string} options.pattern - RegEx string for matching against the user input. If not set, constructor will check for pattern attribute.
     * @param {function} options.requiredCallback - Callback function if the input is blank when options.required === true. Passes inputEl and firstRun (a boolean indicating if this the user's first attempt to fill the field, set to false after calling options.successCallback at least once).
     * @param {function} options.patternCallback - Callback function if the input doesn't match the options.pattern test. Passes inputEl and firstRun (a boolean indicating if this the user's first attempt to fill the field, set to false after calling options.successCallback at least once).
     * @param {function} options.successCallback - Callback function if the input passes all tests. Passes inputEl and firstRun (a boolean indicating if this the user's first attempt to fill the field, set to false after calling options.successCallback at least once).
     * @param {boolean} options.autoInit - Automatically validate when inputEl is blurred. Defaults to true.
     * @param {boolean} options.notices - Log notices to the console of minor issues. Defaults to true.
     */
    function Validator (inputEl, options) {
    
        if (checkIfValidInputElement(inputEl) === false) {
            throw new Error('not a text input');
        } else {
            this.inputEl = inputEl;
        }

        // Set default options

        this.options = options || {};

        this.options.pattern = this.options.pattern || this.inputEl.getAttribute('pattern');

        this.options.required = this.options.required || this.inputEl.required;

        if (typeof this.options.autoInit === 'undefined') {
            this.options.autoInit = true;
        }

        if (typeof this.options.notices === 'undefined') {
            this.options.notices = true;
        }

        if (this.options.pattern === null && this.options.required !== true) {
            throw new Error('either pattern must be set or field must be required');
        }

        this.firstRun = true; // used to inform callbacks if this the user's first attempt at filling the field. Should be set to true after either a successful validation or the field is blurred. This is to facilitate different handling of errors when the user is filling the input for the first time.

        this.setNotFirstRun = () => {
            this.firstRun = false;
            this.inputEl.removeEventListener('blur', this.setNotFirstRun);
        }

        // We need a bound reference to validate in order to access object properties when called by an event listener
        // Note that this must be bound before enable() is called
        this.val = this.validate.bind(this);

        if (this.options.autoInit === true) {
            this.enable();
        }

    };

    // Public methods
    Validator.prototype = {

        /**
         * Validates the submitted value for the input element
         */
        validate: function() {

            const inputValue = this.inputEl.value;

            if (failsRequired(inputValue, this.options.required)) {

                try {

                    this.options.requiredCallback(this.inputEl, this.firstRun);

                } catch (e) {

                    if (this.options.notices) {
                        console.log('Validator Notice: Element was set as required, but but an error was thrown when calling options.requiredCallback. Set options.notices = false to eliminate these messages.');
                    }

                }

                return; // prevent patternCallback from firing

            }

            if (this.options.pattern !== null) {

                if (failsPattern(inputValue, this.options.pattern)) {

                    try {

                        this.options.patternCallback(this.inputEl, this.firstRun);

                    } catch (e) {

                        if (this.options.notices) {
                            console.log('Validator Notice: Input failed the provided pattern, but but an error was thrown when calling options.patternCallback. Set options.notices = false to eliminate these messages.');
                        }

                    }

                    return; // prevent successCallback from firing

                }
            }

            // Successful validation

            try {

                this.options.successCallback(this.inputEl, this.firstRun);

            } catch (e) {

                if (this.options.notices) {

                    console.log('Notice: All validation tests passed, but an error was thrown when calling options.successCallback. Set options.notices = false to eliminate these messages.');

                }

            }

            this.setNotFirstRun(); // set firstRun flag to false *after* calling the successCallback

        },

        /**
         * Enables input-triggered validation
         */
        enable: function() {

            this.disable(); // Disable any previous instances in case this was called by mistake

            this.inputEl.addEventListener('input', this.val);

            if (this.firstRun === true) {

                this.inputEl.addEventListener('blur', this.setNotFirstRun); // bump the blur count before running the blur validation to ensure the blurCount is correct

            }

            this.inputEl.addEventListener('blur', this.val); // blur event listener is needed to catch the user moving past the field without entering anything

        },

        /**
         * Disables input-triggered validation
         */
        disable: function() {

            this.inputEl.removeEventListener('input', this.val);
            this.inputEl.removeEventListener('blur', this.bumpBlurCount);
            this.inputEl.removeEventListener('blur', this.val);

        },

    };



    /**
     * Checks if the submitted object is an HTMLInputElement of an appropriate type
     * @param {*}
     * @returns {boolean}
     */
    function checkIfValidInputElement(element) {

        const validTypes = [
            'text',
            'email',
        ];

        return element instanceof HTMLInputElement && validTypes.includes(element.type);
        
    }

    /**
     * Checks if the input has been filled for required input elements
     * @param {string} inputVal - Value from HTMLInputElement to be tested
     * @param {boolean} required - Whether the HTMLInputElement should be required
     * @returns {boolean} - Returns true if inputVal is blank and required === true
     */
    function failsRequired(inputVal, required) {

        if (required === true) {

            return inputVal === '';
            
        } else {

            return false;

        }

    }

    /**
     * @param {string} inputVal - Value from HTMLInputElement to be tested
     * @param {string} pattern - Regex string for testing inputVal against
     * @returns {boolean} - Returns true if inputVal doesn't match pattern
     */
    function failsPattern(inputVal, pattern) {

        const testPattern = new RegExp(pattern);

        return testPattern.test(inputVal) === true ? false : true;

    }
    
    window.Validator = window.Validator || Validator;

}());

