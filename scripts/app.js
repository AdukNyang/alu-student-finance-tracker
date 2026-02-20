// Wait for the page to load
document.addEventListener('DOMContentLoaded', function() {
    //get saved data from localStorage
    loadFromStorage();
    loadSettings();
    
    let currentEditId = null; // Track which transaction is being editing
    
    // Get form elements from the page.
    const form = document.getElementById('transaction-form');
    const inputDescription = document.getElementById('description');
    const InputAmount = document.getElementById('amount');
    const inputCategory = document.getElementById('category');
    const inputDate = document.getElementById('date');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Get error message elements
    const descError = document.getElementById('description-error');
    const amountError = document.getElementById('amount-error');
    
    // check input as hte user types
    inputDescription.addEventListener('input', function() {
        const error = validateDescription(this.value);
        descError.textContent = error;
    });
    
    InputAmount.addEventListener('input', function() {
        const error = validateAmount(this.value);
        amountError.textContent = error;
    });
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const descErr = validateDescription(inputDescription.value);
        const amtErr = validateAmount(InputAmount.value);
        const dateErr = validateDate(inputDate.value);
        const catErr = validateCategory(inputCategory.value);
        
        // Show errors
        document.getElementById('description-error').textContent = descErr;
        document.getElementById('amount-error').textContent = amtErr;
        
        // If any errors, stop
        if (descErr || amtErr || dateErr || catErr) {
            alert('Please fix the errors before submitting');
            return;
        }
        
        // Check if editing or adding
        if (currentEditId) {
            // Update existing transaction
            updateTransaction(
                currentEditId,
                inputDescription.value,
                InputAmount.value,
                inputCategory.value,
                inputDate.value
            );
            alert('Transaction updated successfully!');
            currentEditId = null;
            submitBtn.textContent = 'Add Record';
        } else {
            // Add new transaction
            addTransaction(
                inputDescription.value,
                InputAmount.value,
                inputCategory.value,
                inputDate.value
            );
            alert('Transaction added successfully!');  
        }
        
        // Clear form
        form.reset();
        document.getElementById('description-error').textContent = '';
        document.getElementById('amount-error').textContent = '';
        
        // Update table
        renderTransactions();
        updateDashboard();
    });
    
    // Render all transactions in table
    function renderTransactions() {
        const tbody = document.querySelector('#transactions tbody');
        tbody.innerHTML = '';
        
        const allTransactions = getTransactions();
        
        if (allTransactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No transactions yet. Add one above!</td></tr>';
            return;
        }
        
        allTransactions.forEach(function(txn) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${txn.id}</td>
                <td>${txn.description}</td>
                <td>${txn.amount.toFixed(2)}</td>
                <td>${txn.category}</td>
                <td>${txn.date}</td>
                <td><button class="edit-btn" data-id="${txn.id}">Edit</button></td>
                <td><button class="delete-btn" data-id="${txn.id}">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
        
        // Add event listeners to Edit buttons
        document.querySelectorAll('.edit-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                handleEdit(id);
            });
        });
        
        // Add event listeners to Delete buttons
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                handleDelete(id);
            });
        });
    }
    
    // Handle Edit button when it is clicked
    function handleEdit(id) {
        const transaction = getTransactionById(id);
        if (transaction) {
            // Fill form with transaction data
            inputDescription.value = transaction.description;
            InputAmount.value = transaction.amount;
            inputCategory.value = transaction.category;
            inputDate.value = transaction.date;
            
            // Change button text
            submitBtn.textContent = 'Update Record';
            currentEditId = id;
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Handle Delete button click when clickd
    function handleDelete(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
            alert('Transaction deleted successfully!');
            renderTransactions();
            updateDashboard();
        }
    }
    
    // Initial render
    renderTransactions();
    updateDashboard();
    
    // ============ M4: CRUD Operations, Sorting, and Search ============
    // The code above handles add, edit, delete transactions
    // Below implements sorting and regex search functionality
    
    // Sorting state
    let sortColumn = null;
    let sortDirection = 'asc';
    
    // Sort transactions by column
    function sortTransactions(column) {
        const allTransactions = getTransactions();
        
        // Switch direction if same column
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        
        allTransactions.sort(function(a, b) {
            let valA = a[column];
            let valB = b[column];
            
            // Handle different data types
            if (column === 'amount') {
                valA = parseFloat(valA);
                valB = parseFloat(valB);
            } else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }
            
            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        renderTransactions();
    }
    
    // Add click handlers to table headers
    document.querySelectorAll('#transactions th').forEach(function(th, index) {
        const columns = ['id', 'description', 'amount', 'category', 'date'];
        if (index < columns.length) {
            th.style.cursor = 'pointer';
            th.addEventListener('click', function() {
                sortTransactions(columns[index]);
            });
        }
    });

    // ============ M4: Regex Search with Highlighting ============
    
    // Searchbox functionality
    const searchInput = document.getElementById('search-input');
    const caseSensitiveCheckbox = document.getElementById('case-sensitive');
    
    searchInput.addEventListener('input', function() {
        performSearch();
    });
    
    caseSensitiveCheckbox.addEventListener('change', function() {
        performSearch();
    });
    
    function performSearch() {
        const pattern = searchInput.value.trim();
        
        // If empty, show all
        if (!pattern) {
            renderTransactions();
            return;
        }
        
        // Try to compile regex
        let regex;
        try {
            const flags = caseSensitiveCheckbox.checked ? 'g' : 'gi';
            regex = new RegExp(pattern, flags);
        } catch (e) {
            // Invalid regex, show error in console
            console.log('Invalid regex pattern:', e.message);
            return;
        }
        
        // Filter transactions
        const allTransactions = getTransactions();
        const filtered = allTransactions.filter(function(txn) {
            return regex.test(txn.description) || 
                   regex.test(txn.category) || 
                   regex.test(txn.id);
        });
        
        // Render filtered results with highlighting
        renderSearchResults(filtered, regex);
    }
    
    function renderSearchResults(filtered, regex) {
        const tbody = document.querySelector('#transactions tbody');
        tbody.innerHTML = '';
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">No matching transactions found.</td></tr>';
            return;
        }
        
        filtered.forEach(function(txn) {
            const row = document.createElement('tr');
            
            // Highlight matches in description
            const highlightedDesc = txn.description.replace(regex, function(match) {
                return '<mark>' + match + '';
            });
            
            row.innerHTML = `
                <td>${txn.id}</td>
                <td>${highlightedDesc}</td>
                <td>$${txn.amount.toFixed(2)}</td>
                <td>${txn.category}</td>
                <td>${txn.date}</td>
                <td><button class="edit-btn" data-id="${txn.id}">Edit</button></td>
                <td><button class="delete-btn" data-id="${txn.id}">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
        
        // Re-attach event listeners
        document.querySelectorAll('.edit-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleEdit(this.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                handleDelete(this.getAttribute('data-id'));
            });
        });
    }

    // ============ M5: Dashboard Statistics and Budget Cap ============
    
    // ============ M6: Data Persistence and Import/Export ============
    
    //Handle budget cap setting
    const budgetCapInput = document.getElementById('budget-cap');
    budgetCapInput.addEventListener('change', function() {
        setBudgetCap(this.value);
        updateDashboard();
        alert('Budget cap set to $' + this.value);
    });

    //Handle export button
    const exportBtn = document.getElementById('export-btn');
    exportBtn.addEventListener('click', function() {
        if (getTransactions().length === 0) {
            alert('No data to export!');
            return;
        }
        exportData();
        alert('Data exported successfully!');
    });

    //Handle import button
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    importBtn.addEventListener('click', function() {
        importFile.click();
    });

    importFile.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                const importResult = importData(data);

                if (importResult.success) {
                    alert('Data imported successfully! ' + data.length + ' transactions loaded.');
                    renderTransactions();
                    updateDashboard();
                } else {
                    alert('Import failed: ' + importResult.error);
                }
            } catch (error) {
                alert('Invalid JSON file: ' + error.message);
            }
        };
        reader.readAsText(file);

        // Reset file input
        importFile.value = '';
    });

    //Handle exchange rate changes
    document.getElementById('usd-rate').addEventListener('change', saveSettings);
    document.getElementById('eur-rate').addEventListener('change', saveSettings);
    document.getElementById('gbp-rate').addEventListener('change', saveSettings);
    document.getElementById('base-currency').addEventListener('change', saveSettings);
    
    // Update dashboard statistics
    function updateDashboard() {
        const totalExpenses = getTotalExpenses();
        const topCategory = getTopCategory();
        const last7Days = getLast7DaysTotal();
        const remaining = getRemainingBudget();
        const budgetAlert = document.getElementById('budget-alert');
        
        // Update metrics
        document.querySelector('.metrics div:nth-child(1)').textContent = 
            'Total Expenses: $' + totalExpenses.toFixed(2);
        
        document.querySelector('.metrics div:nth-child(2)').textContent = 
            'Remaining Budget: $' + remaining.toFixed(2);
        
        document.querySelector('.metrics div:nth-child(3)').textContent = 
            'Top Category: ' + topCategory;
        
        document.querySelector('.metrics div:nth-child(4)').innerHTML = 
            'Last 7 days: <span class="chart-placeholder">$' + last7Days.toFixed(2) + '</span>';
        
        // Budget alert (ARIA live region)
        if (isBudgetExceeded()) {
            budgetAlert.textContent = 'Warning: Budget exceeded by $' + 
                Math.abs(remaining).toFixed(2);
            budgetAlert.style.color = 'red';
            budgetAlert.style.fontWeight = 'bold';
            budgetAlert.setAttribute('aria-live', 'assertive');
        } else if (getBudgetCap() > 0 && remaining < getBudgetCap() * 0.2) {
            budgetAlert.textContent = 'Notice: Only $' + remaining.toFixed(2) + 
                ' remaining in budget';
            budgetAlert.style.color = 'orange';
            budgetAlert.style.fontWeight = 'bold';
            budgetAlert.setAttribute('aria-live', 'polite');
        } else {
            budgetAlert.textContent = '';
        }
    }
    
    // Clear all data button
    document.getElementById('clear-all-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete ALL transactions? This cannot be undone!')) {
            localStorage.clear();
            location.reload();
        }
    });
});