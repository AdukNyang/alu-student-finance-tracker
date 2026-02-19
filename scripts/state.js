// Application state: stores all transactions
let transactions = [];
let nextId = 1;

// Create a unique ID for each transaction
function generateId() {
    return "txn_" + String(nextId++).padStart(4, '0');
}

// Get the current date, and time
function getTimestamp() {
    return new Date().toISOString();
}

// Add a new transaction to the list
function addTransaction(description, amount, category, date) {
    const transaction = {
        id: generateId(),
        description: description,
        amount: parseFloat(amount),
        category: category,
        date: date,
        createdAt: getTimestamp(),
        updatedAt: getTimestamp()
    };
    
    transactions.push(transaction);
    saveToStorage();
    return transaction;
}

// Return all saved transactions
function getTransactions() {
    return transactions;
}

// Delete a transaction by its ID
function deleteTransaction(id) {
    const index = transactions.findIndex(txn => txn.id === id);
    if (index !== -1) {
        transactions.splice(index, 1);
        return true;
    }
    return false;
}

// Find a single transaction by its ID
function getTransactionById(id) {
    return transactions.find(txn => txn.id === id);
}

// Update transaction
function updateTransaction(id, description, amount, category, date) {
    const transaction = getTransactionById(id);
    if (transaction) {
        transaction.description = description;
        transaction.amount = parseFloat(amount);
        transaction.category = category;
        transaction.date = date;
        transaction.updatedAt = getTimestamp();
        saveToStorage();
        return true;
    }
    return false;
}
// Calculate all the total expenses
function getTotalExpenses() {
    return transactions.reduce((sum, txn) => sum + txn.amount, 0);
}

// Find which category has the most spending
function getTopCategory() {
    if (transactions.length === 0) return 'N/A';
    
    const categoryTotals = {};
    
    transactions.forEach(txn => {
        if (!categoryTotals[txn.category]) {
            categoryTotals[txn.category] = 0;
        }
        categoryTotals[txn.category] += txn.amount;
    });
    
    let topCategory = 'N/A';
    let maxAmount = 0;
    
    for (let category in categoryTotals) {
        if (categoryTotals[category] > maxAmount) {
            maxAmount = categoryTotals[category];
            topCategory = category;
        }
    }
    
    return topCategory + ' ($' + maxAmount.toFixed(2) + ')';
}

// Get last 7 days spending
function getLast7DaysTotal() {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    const recent = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= sevenDaysAgo && txnDate <= today;
    });
    
    return recent.reduce((sum, txn) => sum + txn.amount, 0);
}

// Budget cap settings
let budgetCap = 0;

function setBudgetCap(amount) {
    budgetCap = parseFloat(amount) || 0;
    saveSettings();
}

function getBudgetCap() {
    return budgetCap;
}

function getRemainingBudget() {
    return budgetCap - getTotalExpenses();
}

function isBudgetExceeded() {
    return budgetCap > 0 && getTotalExpenses() > budgetCap;
}
// LocalStorage keys
const STORAGE_KEY = 'financeTrackerData';
const SETTINGS_KEY = 'financeTrackerSettings';

// Save all transactions to localStorage
function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

// Load saved transactions from localStorage
function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            transactions = JSON.parse(data);
            // Update nextId based on loaded data
            if (transactions.length > 0) {
                const lastId = transactions[transactions.length - 1].id;
                const idNumber = parseInt(lastId.split('_')[1]);
                nextId = idNumber + 1;
            }
            return true;
        } catch (e) {
            console.error('Error loading data:', e);
            return false;
        }
    }
    return false;
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        budgetCap: budgetCap,
        baseCurrency: document.getElementById('base-currency').value,
        exchangeRates: {
            USD: parseFloat(document.getElementById('usd-rate').value),
            EUR: parseFloat(document.getElementById('eur-rate').value),
            GBP: parseFloat(document.getElementById('gbp-rate').value)
        }
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Load settings from localStorage
function loadSettings() {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) {
        try {
            const settings = JSON.parse(data);
            budgetCap = settings.budgetCap || 0;
            
            if (settings.baseCurrency) {
                document.getElementById('base-currency').value = settings.baseCurrency;
            }
            if (settings.exchangeRates) {
                document.getElementById('usd-rate').value = settings.exchangeRates.USD || 1.00;
                document.getElementById('eur-rate').value = settings.exchangeRates.EUR || 0.85;
                document.getElementById('gbp-rate').value = settings.exchangeRates.GBP || 0.75;
            }
            if (budgetCap > 0) {
                document.getElementById('budget-cap').value = budgetCap;
            }
            return true;
        } catch (e) {
            console.error('Error loading settings:', e);
            return false;
        }
    }
    return false;
}

// Export data as JSON
function exportData() {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'finance-tracker-data.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Validate imported data
function validateImportData(data) {
    if (!Array.isArray(data)) {
        return 'Data must be an array';
    }
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        if (!item.id || typeof item.id !== 'string') {
            return 'Invalid or missing id at index ' + i;
        }
        if (!item.description || typeof item.description !== 'string') {
            return 'Invalid or missing description at index ' + i;
        }
        if (typeof item.amount !== 'number' || item.amount < 0) {
            return 'Invalid amount at index ' + i;
        }
        if (!item.category || typeof item.category !== 'string') {
            return 'Invalid or missing category at index ' + i;
        }
        if (!item.date || typeof item.date !== 'string') {
            return 'Invalid or missing date at index ' + i;
        }
    }
    
    return null; // No errors
}

// Import data from JSON
function importData(data) {
    const error = validateImportData(data);
    if (error) {
        return { success: false, error: error };
    }
    
    transactions = data;
    saveToStorage();
    
    // Update the nextId
    if (transactions.length > 0) {
        const ids = transactions.map(t => parseInt(t.id.split('_')[1]));
        nextId = Math.max(...ids) + 1;
    }
    
    return { success: true };
}

