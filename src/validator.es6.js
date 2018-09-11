

(function() {

    /**
     * @constructor
     * @param {HTMLInputElement} inputEl - The input element to be validated
     * @param {Object} options - Options object to override defaults
     * @param {boolean} options.required - Set field to be explicitly required. If not set, constructor will check for required attribute on the element.
     * @param {string} options.pattern - RegEx string for matching against the user input. If not set, constructor will check for pattern attribute.
     * @param {function} options.requiredCallback - Callback function if the input is blank when options.required === true.
     * @param {function} options.patternCallback - Callback function if the input doesn't match the options.pattern test.
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

        this.options.required = this.options.required || this.inputEl.getAttribute('required');


        if (typeof this.options.autoInit === 'undefined') {
            this.options.autoInit = true;
        }

        if (typeof this.options.notices === 'undefined') {
            this.options.notices = true;
        }

        if (this.options.pattern === null && this.options.required === null) {
            throw new Error('either pattern must be set or field must be required');
        }

        // We need a bound reference to validate in order to access options when it's called on the blur event
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

            if (this.options.required && inputValue === '') {
                try {
                    this.options.requiredCallback();
                } catch (e) {
                    if (this.options.notices) {
                        console.log('Validator Notice: Element was set as required, but no requiredCallback function was provided. Set options.notices = false to eliminate these messages.');
                    }
                }
                return; // prevent patternCallback from firing
            }

            if (this.options.pattern !== null) {

                const testPattern = new RegExp(this.options.pattern);

                if (!testPattern.test(inputValue)) {

                    try {
                        this.options.patternCallback();
                    } catch (e) {
                        if (this.options.notices) {
                            console.log('Validator Notice: Element was set as required, but no patternCallback function was provided. Set options.notices = false to eliminate these messages.');
                        }
                    }

                }
            }

        },

        /**
         * Enables blur-triggered validation
         */
        enable: function() {
            this.disable(); // Disable any previous instances in case this was called by mistake
            this.inputEl.addEventListener('blur', this.val);
        },

        /**
         * Disables blur-triggered validation
         */
        disable: function() {
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
    
    window.Validator = window.Validator || Validator;

}());

