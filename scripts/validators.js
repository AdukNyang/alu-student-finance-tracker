// Regular expression patterns to check if user input is correct

// 1. Check Description: no extra spaces at the start or end, no double spaces either
const descriptionRegex = /^\S(?:.*\S)?$/;

// 2. Check Amount: must be positive number, can have optional 2 decimal places
const amountRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

// 3. Check Date: YYYY-MM-DD format
const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 4. Check Category: only letters, spaces, hyphens only
const categoryRegex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

// 5. Advanced: detect duplicate words , (e.g., "coffee coffee")
const duplicateWordRegex = /\b(\w+)\s+\1\b/i;

// Functions that checks if form data is correct
function validateDescription(value) {
    if (!value) {
        return "Description is required";
    }
    if (!descriptionRegex.test(value)) {
        return "Description cannot have leading/trailing spaces";
    }
    if (duplicateWordRegex.test(value)) {
        return "Description contains duplicate words";
    }
    return "";
}

function validateAmount(value) {
    if (!value) {
        return "Amount is required";
    }
    if (!amountRegex.test(value)) {
        return "Amount must be a valid number (e.g., 12.50)";
    }
    if (parseFloat(value) < 0) {
        return "Amount must be greater than 0";
    }
    return "";
}

function validateDate(value) {
    if (!value) {
        return "Date is required";
    }
    if (!dateRegex.test(value)) {
        return "Date must be in YYYY-MM-DD format";
    }
    return "";
}

function validateCategory(value) {
    if (!value) {
        return "Category is required";
    }
    if (!categoryRegex.test(value)) {
        return "Category can only contain letters, spaces, and hyphens";
    }
    return "";
}
