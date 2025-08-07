let investments = [];
let user = { 
    name: 'John Doe', 
    email: 'john@email.com',
    pan: 'ABCDE1234F',
    dob: '1990-01-15',
    monthlyLimit: 5000,
    currentExpense: 0
};
let charts = {};

// Backend URL (Update this to your backend URL)
const API_BASE_URL = 'http://localhost:8081';

document.addEventListener('DOMContentLoaded', function() {
    setupCharts();
    loadProfile();
    loadNewsData();
});

// Setup Charts
function setupCharts() {
    charts.investment = new Chart(document.getElementById('investmentChart').getContext('2d'), {
        type: 'pie',
        data: { labels: ['Stocks', 'Gold'], datasets: [{ data: [0, 0], backgroundColor: ['#0d6efd', '#ffc107'] }] },
        options: { responsive: false }
    });
    
    charts.sector = new Chart(document.getElementById('sectorChart').getContext('2d'), {
        type: 'pie', 
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#198754', '#dc3545', '#fd7e14', '#6f42c1'] }] },
        options: { responsive: false }
    });
    
    charts.budget = new Chart(document.getElementById('budgetChart').getContext('2d'), {
        type: 'bar', 
        data: { labels: ['Left', 'Spent'], datasets: [{ data: [user.monthlyLimit, user.currentExpense], backgroundColor: ['#198754', '#dc3545'] }] },
        options: { responsive: false, indexAxis: 'y' }
    });
    
    charts.retirement = new Chart(document.getElementById('retirementChart').getContext('2d'), {
        type: 'doughnut', 
        data: { labels: ['Saved', 'Goal'], datasets: [{ data: [65, 35], backgroundColor: ['#198754', '#e9ecef'] }] },
        options: { responsive: false }
    });
}

// API Functions
async function loadNewsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        const newsData = await response.json();
        displayNews(newsData.articles.slice(0, 3)); // Show first 3 articles
    } catch (error) {
        console.error('Error loading news:', error);
        displayNews([{
            title: 'Market Update',
            description: 'Tech stocks showing strong performance...',
            url: '#'
        }]);
    }
}

function displayNews(articles) {
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    
    articles.forEach(article => {
        const newsCard = `
            <div class="news-card mb-3">
                <h6 class="news-title">${article.title || 'Financial News'}</h6>
                <p class="news-desc">${article.description || 'Latest financial market updates...'}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="window.open('${article.url || '#'}', '_blank')">
                    Read More
                </button>
            </div>
        `;
        container.innerHTML += newsCard;
    });
}

// Add Investment Functions
function showAddForm() { 
    document.getElementById('addInvestmentForm').style.display = 'flex'; 
    // Set today's date as default
    document.getElementById('stockDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('goldDate').value = new Date().toISOString().split('T')[0];
}

function closeForm() { 
    document.getElementById('addInvestmentForm').style.display = 'none'; 
    clearForm(); 
}

function toggleType() {
    const isStock = document.getElementById('stockRadio').checked;
    document.getElementById('stockFields').style.display = isStock ? 'block' : 'none';
    document.getElementById('goldFields').style.display = isStock ? 'none' : 'block';
}

function calculateStock() {
    const qty = parseFloat(document.getElementById('stockQty').value) || 0;
    const price = parseFloat(document.getElementById('stockPrice').value) || 0;
    document.getElementById('stockAmount').value = (qty * price).toFixed(2);
}

function calculateGold() {
    const price = parseFloat(document.getElementById('goldPrice').value) || 0;
    const weight = parseFloat(document.getElementById('goldWeight').value) || 0;
    document.getElementById('goldAmount').value = (price * weight).toFixed(2);
}

async function addInvestment() {
    const isStock = document.getElementById('stockRadio').checked;
    
    if (isStock) {
        const stockData = {
            symbol: document.getElementById('stockSymbol').value.trim(),
            name: document.getElementById('stockName').value.trim(),
            quantity: parseFloat(document.getElementById('stockQty').value),
            price: parseFloat(document.getElementById('stockPrice').value),
            sector: document.getElementById('stockSector').value,
            date: document.getElementById('stockDate').value,
            amount: parseFloat(document.getElementById('stockAmount').value)
        };
        
        if (!stockData.symbol || !stockData.name || !stockData.quantity || !stockData.price || !stockData.sector) {
            alert('Please fill all fields'); return;
        }
        
        // Check expense limit
        if (user.currentExpense + stockData.amount > user.monthlyLimit) {
            alert('This investment exceeds your monthly expense limit!'); return;
        }
        
        // Add to local array
        investments.push({
            type: 'Stock',
            name: `${stockData.name} (${stockData.symbol})`,
            amount: stockData.amount,
            sector: stockData.sector,
            date: stockData.date
        });
        
        // Update expense limit
        user.currentExpense += stockData.amount;
        
    } else {
        const goldData = {
            price: parseFloat(document.getElementById('goldPrice').value),
            weight: parseFloat(document.getElementById('goldWeight').value),
            date: document.getElementById('goldDate').value,
            amount: parseFloat(document.getElementById('goldAmount').value)
        };
        
        if (!goldData.price || !goldData.weight) {
            alert('Please fill all fields'); return;
        }
        
        investments.push({
            type: 'Gold',
            name: `Gold (${goldData.weight} oz)`,
            amount: goldData.amount,
            sector: 'Commodities',
            date: goldData.date
        });
    }
    
    updateEverything();
    closeForm();
    alert('Investment added successfully!');
}

// Chart Modal Functions
async function showStocksChart() {
    document.getElementById('stocksModal').style.display = 'flex';
    // Here you would call your stocks API and create chart
    // For now, showing a placeholder
    setTimeout(() => {
        const ctx = document.getElementById('stocksChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                datasets: [{
                    label: 'Stock Performance',
                    data: [100, 120, 115, 140, 130],
                    borderColor: '#0d6efd',
                    tension: 0.1
                }]
            },
            options: { responsive: false }
        });
    }, 100);
}

function closeStocksModal() {
    document.getElementById('stocksModal').style.display = 'none';
}

async function showGoldChart() {
    document.getElementById('goldModal').style.display = 'flex';
    // Gold chart implementation
    setTimeout(() => {
        const ctx = document.getElementById('goldChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Gold Holdings'],
                datasets: [{
                    label: 'Gold Value ($)',
                    data: [2500],
                    backgroundColor: '#ffc107'
                }]
            },
            options: { responsive: false }
        });
    }, 100);
}

function closeGoldModal() {
    document.getElementById('goldModal').style.display = 'none';
}

function showHistory() {
    document.getElementById('historyModal').style.display = 'flex';
    
    // Create history from investments
    const historyHTML = investments.map((inv, index) => `
        <div class="history-card">
            <div class="d-flex justify-content-between">
                <div>
                    <div class="history-date">${inv.date || 'Today'}</div>
                    <div class="history-action buy">BUY ${inv.name}</div>
                </div>
                <div class="text-end">
                    <strong>$${inv.amount.toLocaleString()}</strong>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('historyContainer').innerHTML = historyHTML || '<div class="history-card"><h6>No transactions yet</h6></div>';
}

function closeHistoryModal() {
    document.getElementById('historyModal').style.display = 'none';
}

function showPortfolio() {
    document.getElementById('portfolioModal').style.display = 'flex';
    
    const portfolioHTML = investments.map((inv, index) => `
        <tr>
            <td>${inv.name}</td>
            <td>$${inv.amount.toLocaleString()}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="sellInvestment(${index})">
                    Sell
                </button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('portfolioTableBody').innerHTML = portfolioHTML || 
        '<tr><td colspan="3">No investments in portfolio</td></tr>';
}

function closePortfolioModal() {
    document.getElementById('portfolioModal').style.display = 'none';
}

function sellInvestment(index) {
    const investment = investments[index];
    
    if (confirm(`Are you sure you want to sell ${investment.name}?`)) {
        // If it's a stock, add money back to expense limit
        if (investment.type === 'Stock') {
            user.currentExpense -= investment.amount;
            if (user.currentExpense < 0) user.currentExpense = 0;
        }
        // For gold, only remove from portfolio (no expense limit change)
        
        // Remove from investments array
        investments.splice(index, 1);
        
        updateEverything();
        showPortfolio(); // Refresh portfolio modal
        alert('Investment sold successfully!');
    }
}

// Profile Functions
function showProfileModal() {
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profilePan').textContent = user.pan;
    document.getElementById('profileDob').textContent = user.dob;
    document.getElementById('profileLimit').value = user.monthlyLimit;
    document.getElementById('profileModal').style.display = 'flex';
}

function closeProfileModal() {
    document.getElementById('profileModal').style.display = 'none';
}

function updateProfile() {
    user.monthlyLimit = parseFloat(document.getElementById('profileLimit').value) || user.monthlyLimit;
    closeProfileModal();
    updateBudgetChart();
    alert('Profile updated!');
}

function loadProfile() {
    // Profile data is already loaded in user object
}

// Update Functions
function updateEverything() { 
    updateTable(); 
    updateCharts(); 
    updateNetWorth(); 
    updateBudgetChart();
}

function updateTable() {
    const tbody = document.getElementById('investmentList');
    tbody.innerHTML = '';
    investments.forEach(inv => {
        tbody.innerHTML += `<tr>
            <td><span class="badge bg-primary">${inv.type}</span></td>
            <td>${inv.name}</td>
            <td>$${inv.amount.toLocaleString()}</td>
        </tr>`;
    });
    document.getElementById('investmentTable').style.display = investments.length > 0 ? 'block' : 'none';
}

function updateCharts() {
    const stocks = investments.filter(inv => inv.type === 'Stock').length;
    const gold = investments.filter(inv => inv.type === 'Gold').length;
    
    charts.investment.data.datasets[0].data = [stocks, gold];
    charts.investment.update();
    
    const sectors = {};
    investments.forEach(inv => {
        if (inv.sector && inv.sector !== 'Commodities') {
            sectors[inv.sector] = (sectors[inv.sector] || 0) + 1;
        }
    });
    
    charts.sector.data.labels = Object.keys(sectors);
    charts.sector.data.datasets[0].data = Object.values(sectors);
    charts.sector.update();
}

function updateNetWorth() {
    const total = investments.reduce((sum, inv) => sum + inv.amount, 0);
    document.getElementById('netWorth').textContent = `$${(1000000 + total).toLocaleString()}`;
}

function updateBudgetChart() {
    const budgetLeft = user.monthlyLimit - user.currentExpense;
    charts.budget.data.datasets[0].data = [budgetLeft, user.currentExpense];
    charts.budget.update();
}

function clearForm() {
    document.getElementById('stockSymbol').value = '';
    document.getElementById('stockName').value = '';
    document.getElementById('stockQty').value = '';
    document.getElementById('stockPrice').value = '';
    document.getElementById('stockSector').value = '';
    document.getElementById('stockAmount').value = '';
    document.getElementById('goldPrice').value = '';
    document.getElementById('goldWeight').value = '';
    document.getElementById('goldAmount').value = '';
    document.getElementById('stockRadio').checked = true;
    toggleType();
}
