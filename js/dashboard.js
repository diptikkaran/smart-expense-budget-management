document.getElementById("totalBalance").textContent =
    "₹" + (localStorage.getItem("currentBalance") || 0);

document.getElementById("totalIncome").textContent =
    "₹" + (localStorage.getItem("totalIncome") || 0);

document.getElementById("totalExpense").textContent =
    "₹" + (localStorage.getItem("totalExpense") || 0);

document.getElementById("totalSavings").textContent =
    "₹" + (localStorage.getItem("currentBalance") || 0);