window.onload = function () {
    // USER INFORMATION

    const currentUser =
        localStorage.getItem("currentUser") || "Guest";

    document.getElementById("welcomeUser").innerText =
        "Welcome, " + currentUser + " 👋";

    document.getElementById("userName").innerText =
        currentUser;

    document.getElementById("currentWorkspace").innerText =
        localStorage.getItem("currentWorkspace") || "Personal Finance";

    document.getElementById("lastLogin").innerText =
        localStorage.getItem("lastLogin") || "First Login";

    // DASHBOARD STATISTICS

    const balance =
        localStorage.getItem("currentBalance") || 0;

    const income =
        localStorage.getItem("totalIncome") || 0;

    const expense =
        localStorage.getItem("totalExpense") || 0;

    const savings =
        localStorage.getItem("totalSavings") || 0;

    document.getElementById("totalBalance").innerText =
        "₹" + balance;

    document.getElementById("totalIncome").innerText =
        "₹" + income;

    document.getElementById("totalExpense").innerText =
        "₹" + expense;

    document.getElementById("totalSavings").innerText =
        "₹" + savings;

    // WORKSPACES

    const workspaceContainer =
        document.getElementById("workspaceContainer");

    if (workspaceContainer) {

        workspaceContainer.innerHTML = "";

        const workspaces = [];

        workspaces.push("Personal Finance");

        const groupCount =
            Number(localStorage.getItem("groupCount")) || 0;

        for (let i = 1; i <= groupCount; i++) {

            workspaces.push("Student Group " + i);

        }

        if (workspaces.length === 0) {

            workspaceContainer.innerHTML =
                `<div class="workspace-card">
                    No Workspace Available
                </div>`;

        } else {

            workspaces.forEach(workspace => {

                const card =
                    document.createElement("div");

                card.className =
                    "workspace-card";

                card.innerText =
                    workspace;

                workspaceContainer.appendChild(card);

            });

        }

    }
    // RECENT TRANSACTIONS

    const transactions =
        JSON.parse(
            localStorage.getItem("personalTransactions")
        ) || [];

    const table =
        document.getElementById("recentTransactionTable");

    if (table) {

        table.innerHTML = "";

        if (transactions.length === 0) {

            table.innerHTML = `
                <tr id="noRecentTransaction">
                    <td colspan="5">
                        No Transactions Available
                    </td>
                </tr>
            `;

        } else {

            transactions
                .slice(-5)
                .reverse()
                .forEach(transaction => {

                    const row =
                        document.createElement("tr");

                    row.innerHTML = `
                        <td>${transaction.date}</td>
                        <td>${transaction.description}</td>
                        <td>${transaction.type}</td>
                        <td>₹${transaction.amount}</td>
                        <td>₹${transaction.balanceAfter}</td>
                    `;

                    table.appendChild(row);

                });

        }

    }

};