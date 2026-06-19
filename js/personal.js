let balance = 0;
let income = 0;
let expense = 0;

let transactions = [];
let editIndex = -1;

const incomeCategories = [
"Salary",
"Scholarship",
"Freelancing",
"Investment",
"Gift",
"Other"
];

const expenseCategories = [
"Food",
"Travel",
"Shopping",
"Rent",
"Medical",
"Bills",
"Entertainment",
"Other"
];

const typeSelect = document.getElementById("type");
const categorySelect = document.getElementById("category");

function loadCategories() {


categorySelect.innerHTML = "";

const categories =
    typeSelect.value === "Income"
    ? incomeCategories
    : expenseCategories;

categories.forEach(category => {

    const option =
        document.createElement("option");

    option.value = category;
    option.textContent = category;

    categorySelect.appendChild(option);

});


}

typeSelect.addEventListener(
"change",
loadCategories
);

function setOpeningBalance() {


const opening =
    Number(
        document.getElementById(
            "openingBalance"
        ).value
    );

if (opening < 0) {
    alert("Invalid Opening Balance");
    return;
}

localStorage.setItem(
    "openingBalance",
    opening
);

recalculate();

updatePreview();


}

function addTransaction() {


const type =
    document.getElementById(
        "type"
    ).value;

const category =
    document.getElementById(
        "category"
    ).value;

const amount =
    Number(
        document.getElementById(
            "amount"
        ).value
    );

const description =
    document.getElementById(
        "description"
    ).value;

const paymentMethod =
    document.getElementById(
        "paymentMethod"
    ).value;

if (amount <= 0) {

    alert(
        "Enter Valid Amount"
    );

    return;
}
if (description.trim() === "") {

    alert(
        "Please enter description"
    );

    return;
}

const transaction = {

    id: Date.now(),

    date:
        new Date()
        .toLocaleDateString(),

    category,

    description,

    type,

    amount,

    paymentMethod

};

if (editIndex === -1) {

    transactions.push(
        transaction
    );

} else {

    transactions[
        editIndex
    ] = transaction;

    editIndex = -1;

    document.getElementById(
        "addBtn"
    ).textContent =
        "Add Transaction";

}

document.getElementById(
    "amount"
).value = "";

document.getElementById(
    "description"
).value = "";

recalculate();

updatePreview();


}

function recalculate() {


income = 0;
expense = 0;

let currentBalance =
    Number(
        localStorage.getItem(
            "openingBalance"
        ) || 0
    );

transactions.forEach(
    transaction => {

        if (
            transaction.type
            === "Income"
        ) {

            income +=
                transaction.amount;

            currentBalance +=
                transaction.amount;

        } else {

            expense +=
                transaction.amount;

            currentBalance -=
                transaction.amount;

        }

        transaction.balanceAfter =
            currentBalance;

    }
);

balance = currentBalance;

updateCards();

renderTransactions();

saveData();


}


function renderTransactions() {

    const table =
        document.getElementById(
            "transactionTable"
        );

    table.innerHTML = "";

    if (
        transactions.length === 0
    ) {

        table.innerHTML = `
        <tr>
            <td colspan="7">
                No Transactions Available
            </td>
        </tr>
        `;

        return;
    }

    transactions.forEach(
        (
            transaction,
            index
        ) => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `
            <td>${transaction.date}</td>
            <td>${transaction.category}</td>
            <td>${transaction.description}</td>

            <td>
                ${
                    transaction.type === "Income"
                    ? '<span style="color:green;font-weight:bold;">Income</span>'
                    : '<span style="color:red;font-weight:bold;">Expense</span>'
                }
            </td>

            <td>₹${transaction.amount}</td>

            <td>₹${transaction.balanceAfter}</td>

            <td>
                <button onclick="editTransaction(${index})">
                    ✏️
                </button>

                <button onclick="deleteTransaction(${index})">
                    🗑️
                </button>
            </td>
            `;

            table.appendChild(
                row
            );

        }
    );

}

function editTransaction(index) {


const transaction =
    transactions[index];

document.getElementById(
    "type"
).value =
    transaction.type;

loadCategories();

document.getElementById(
    "category"
).value =
    transaction.category;

document.getElementById(
    "amount"
).value =
    transaction.amount;

document.getElementById(
    "description"
).value =
    transaction.description;

document.getElementById(
    "paymentMethod"
).value =
    transaction.paymentMethod;

editIndex = index;

document.getElementById(
    "addBtn"
).textContent =
    "Update Transaction";


}

function deleteTransaction(index) {


if (
    confirm(
        "Delete this transaction?"
    )
) {

    transactions.splice(
        index,
        1
    );

    recalculate();

}


}

function updateCards() {


document.getElementById(
    "balance"
).textContent =
    "₹" + balance;

document.getElementById(
    "income"
).textContent =
    "₹" + income;

document.getElementById(
    "expense"
).textContent =
    "₹" + expense;

updatePreview();


}

function updatePreview() {


const amount =
    Number(
        document.getElementById(
            "amount"
        ).value
    ) || 0;

const type =
    document.getElementById(
        "type"
    ).value;

let afterBalance =
    balance;

if (type === "Income") {

    afterBalance =
        balance + amount;

} else {

    afterBalance =
        balance - amount;

}

document.getElementById(
    "currentBalancePreview"
).textContent =
    "₹" + balance;

document.getElementById(
    "afterBalancePreview"
).textContent =
    "₹" + afterBalance;


}

function saveData() {


localStorage.setItem(
    "transactions",
    JSON.stringify(
        transactions
    )
);

localStorage.setItem(
    "totalIncome",
    income
);

localStorage.setItem(
    "totalExpense",
    expense
);

localStorage.setItem(
    "currentBalance",
    balance
);


}

function loadData() {


transactions =
    JSON.parse(
        localStorage.getItem(
            "transactions"
        )
    ) || [];

recalculate();


}

document
.getElementById(
"amount"
)
.addEventListener(
"input",
updatePreview
);

document
.getElementById(
"type"
)
.addEventListener(
"change",
updatePreview
);

loadCategories();
loadData();
