// Currency symbol (change here if needed)
const currencySymbol = '$';

// Store all added principal entries (using dayAdded: day of month when added)
let additionEntries = [
    // default: added on 16th in a 30-day month (equivalent to 15 days remaining)
    { amount: 5000, dayAdded: 16 }
];

// Add a new principal entry
function addNewEntry() {
    additionEntries.push({ amount: 1000, dayAdded: 16 });
    renderAdditionEntries();
}

// Remove an entry
function removeEntry(index) {
    additionEntries.splice(index, 1);
    renderAdditionEntries();
}

// Update an entry
function updateEntry(index, field, value) {
    if (field === 'amount') {
        additionEntries[index].amount = parseFloat(value) || 0;
    } else if (field === 'dayAdded') {
        additionEntries[index].dayAdded = parseInt(value) || 0;
    }
}

// Render all addition entries
function renderAdditionEntries() {
    const listContainer = document.getElementById('additionsList');
    listContainer.innerHTML = '';

    additionEntries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'addition-entry';
        // determine maximum day based on current totalDaysInMonth input (fallback to 31)
        const totalDaysInput = document.getElementById('totalDaysInMonth');
        const maxDay = totalDaysInput ? parseInt(totalDaysInput.value) || 31 : 31;

        entryDiv.innerHTML = `
            <div class="addition-entry-field currency-field">
                <label>Amount</label>
                <div class="field-icon-wrapper">
                    <input 
                        type="number" 
                        class="has-currency"
                        placeholder="Enter amount" 
                        step="0.01"
                        value="${entry.amount}"
                        onchange="updateEntry(${index}, 'amount', this.value)"
                    >
                    <span class="currency">${currencySymbol}</span>
                </div>
            </div>
            <div class="addition-entry-field days-field">
                <label>Date Added</label>
                <div class="field-icon-wrapper">
                    <input 
                        type="number" 
                        class="has-unit"
                        placeholder="Day added (1 - ${maxDay})" 
                        min="1"
                        max="${maxDay}"
                        value="${entry.dayAdded}"
                        onchange="updateEntry(${index}, 'dayAdded', this.value)"
                    >
                </div>
            </div>
            <button type="button" class="delete-entry-btn" onclick="removeEntry(${index})">Delete</button>
        `;
        
        listContainer.appendChild(entryDiv);
    });
}

// Calculate interest and display results
function calculateInterest() {
    // Get input values
    const lastPrincipal = parseFloat(document.getElementById('lastPrincipal').value);
    const totalDaysInMonth = parseInt(document.getElementById('totalDaysInMonth').value);
    const annualRate = parseFloat(document.getElementById('interestRate').value);

    // Validate inputs
    if (!lastPrincipal || !totalDaysInMonth || !annualRate) {
        alert('Please fill in all required fields');
        return;
    }

    if (totalDaysInMonth < 1 || totalDaysInMonth > 31) {
        alert('Total days in month should be between 1 and 31');
        return;
    }

    if (additionEntries.length === 0) {
        alert('Please add at least one principal entry');
        return;
    }

    // Validate all entries
    for (let i = 0; i < additionEntries.length; i++) {
        if (!additionEntries[i].amount || !additionEntries[i].dayAdded) {
            alert(`Entry ${i + 1}: Please fill in both amount and day added`);
            return;
        }
        if (additionEntries[i].dayAdded < 1 || additionEntries[i].dayAdded > totalDaysInMonth) {
            alert(`Entry ${i + 1}: Day added must be between 1 and ${totalDaysInMonth}`);
            return;
        }
    }

    // Calculate interest using simple interest formula: I = (P × R × T) / (365 × 100)
    // where P = Principal, R = Annual Rate (%), T = Time in days

    // Interest on last principal for the full month
    const interestOnLast = (lastPrincipal * annualRate * totalDaysInMonth) / (365 * 100);

    // Calculate interest for each addition (compute days remaining from dayAdded)
    let totalAddedInterest = 0;
    const additionsResults = [];

    additionEntries.forEach((entry, index) => {
        const daysRemaining = totalDaysInMonth - entry.dayAdded + 1; // inclusive of the day added
        const actualDays = Math.max(0, daysRemaining);
        const interestOnThisAddition = (entry.amount * annualRate * actualDays) / (365 * 100);
        totalAddedInterest += interestOnThisAddition;
        additionsResults.push({
            index: index,
            amount: entry.amount,
            dayAdded: entry.dayAdded,
            days: actualDays,
            interest: interestOnThisAddition
        });
    });

    // Total interest
    const totalInterest = interestOnLast + totalAddedInterest;

    // Display results
    document.getElementById('interestOnLast').textContent = currencySymbol + interestOnLast.toFixed(2);

    // Display individual addition results
    const additionsResultsList = document.getElementById('additionsResultsList');
    additionsResultsList.innerHTML = '';

    additionsResults.forEach((result) => {
        const resultCard = document.createElement('div');
        resultCard.className = 'addition-result-card';
        resultCard.innerHTML = `
            <div class="result-item">
                <span class="addition-result-label">
                    Interest on ${currencySymbol}${result.amount.toFixed(2)} (added date: ${result.dayAdded}) ( ${result.days} days)
                </span>
                <span class="addition-result-value">${currencySymbol}${result.interest.toFixed(2)}</span>
            </div>
        `;
        additionsResultsList.appendChild(resultCard);
    });

    // Display total
    document.getElementById('totalInterest').textContent = currencySymbol + totalInterest.toFixed(2);

    // Show results section
    document.getElementById('results').classList.remove('hidden');
}

// Reset form and hide results
function resetForm() {
    document.getElementById('interestForm').reset();
    document.getElementById('results').classList.add('hidden');

    // Reset to default values
    document.getElementById('lastPrincipal').value = 10000;
    document.getElementById('totalDaysInMonth').value = 30;
    document.getElementById('interestRate').value = 6;

    // Reset entries
    additionEntries = [
        { amount: 5000, dayAdded: 16 }
    ];
    renderAdditionEntries();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Render initial entries
    renderAdditionEntries();

    // Allow Enter key to calculate
    document.getElementById('interestForm').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateInterest();
        }
    });
    
    // Re-render entries when totalDaysInMonth changes so max/day placeholders update
    const totalDaysInput = document.getElementById('totalDaysInMonth');
    if (totalDaysInput) {
        totalDaysInput.addEventListener('change', renderAdditionEntries);
    }
});
