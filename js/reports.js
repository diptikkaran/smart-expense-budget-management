window.onload = function () {

    const balance = localStorage.getItem("currentBalance");
    const income = localStorage.getItem("totalIncome");
    const expense = localStorage.getItem("totalExpense");

    document.getElementById("reportBalance").innerText =
        "₹" + (balance || 0);

    document.getElementById("reportIncome").innerText =
        "₹" + (income || 0);

    document.getElementById("reportExpense").innerText =
        "₹" + (expense || 0);

    document.getElementById("summaryBalance").innerText =
        "₹" + (balance || 0);

    document.getElementById("summaryIncome").innerText =
        "₹" + (income || 0);

    document.getElementById("summaryExpense").innerText =
        "₹" + (expense || 0);
    const groupExpense =
        localStorage.getItem("groupTotalExpense") || 0;

    document.getElementById("reportGroupExpense").innerText =
        "₹" + groupExpense;

    const memberCount =
        localStorage.getItem("memberCount") || 0;

    document.getElementById("reportMembers").innerText =
        memberCount;


    const transactions =
        JSON.parse(
            localStorage.getItem(
                "personalTransactions"
            )
        ) || [];

    document.getElementById(
        "reportTransactions"
    ).innerText =
        transactions.length;


    const totalIncome = Number(income) || 0;
    const totalExpense = Number(expense) || 0;

    const netSavings = totalIncome - totalExpense;

    const savingsRate =
        totalIncome  > 0
            ? (
                (netSavings / totalIncome ) * 100
            ).toFixed(2)
            : 0;

    document.getElementById(
        "savingsRate"
    ).innerText =
        savingsRate + "%";


    const table =
        document.getElementById(
            "recentTransactionsTable"
        );

    table.innerHTML = "";

    if (transactions.length === 0) {

        table.innerHTML = `
        <tr>
            <td colspan="5">
                No Transactions Available
            </td>
        </tr>
    `;

    } else {

        transactions
            .slice(0, 5)
            .forEach(transaction => {

                const row =
                    document.createElement(
                        "tr"
                    );

                row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.category}</td>
                <td>${transaction.description}</td>
                <td>
                    ${transaction.type === "Income"
                        ? '<span style="color:green;font-weight:bold;">Income</span>'
                        : '<span style="color:red;font-weight:bold;">Expense</span>'
                    }
                </td>
                <td>₹${transaction.amount}</td>
            `;

                table.appendChild(row);

            });

    }
    const categoryTotals = {};

    transactions.forEach(transaction => {

        if (transaction.type.toLowerCase() === "expense") {

            if (!categoryTotals[transaction.category]) {

                categoryTotals[transaction.category] = 0;

            }

            categoryTotals[transaction.category] += Number(transaction.amount);

        }

    });

    const categoryTable =
        document.getElementById(
            "categoryExpenseTable"
        );

    categoryTable.innerHTML = "";
    if (Object.keys(categoryTotals).length === 0) {

        categoryTable.innerHTML = `
        <tr>
            <td colspan="2">
                No Expense Data Available
            </td>
        </tr>
    `;

    } else {

        for (const category in categoryTotals) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
        <td>${category}</td>
        <td>₹${categoryTotals[category]}</td>
    `;

            categoryTable.appendChild(row);

        }
    }
};