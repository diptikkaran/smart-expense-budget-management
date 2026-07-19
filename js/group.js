let group = {
    name: "",
    head: "",
    currentUser: "",
    members: [],
    expenses: []
};

// Save

function saveGroup() {

    localStorage.setItem(
        "groupData",
        JSON.stringify(group)
    );
    localStorage.setItem(
        "groupCount",
        1
    );

    localStorage.setItem(
        "memberCount",
        group.members.length
    );

    localStorage.setItem(
        "groupExpenseCount",
        group.expenses.length
    );

}

// Load

function loadGroup() {

    const data =
        localStorage.getItem(
            "groupData"
        );

    if (data) {

        group = JSON.parse(data);
        group.members = group.members || [];

        group.expenses = group.expenses || [];

        group.head = group.head || "";

        group.currentUser =

            group.currentUser ||

            group.head;

    }

    document.getElementById(
        "groupName"
    ).value = group.name || "";

    if (document.getElementById("groupHead")) {

        document.getElementById(
            "groupHead"
        ).value = group.head || "";

    }

    renderCurrentUsers();

    renderMembers();

    loadPaidBy();

    renderExpenses();

    calculateSettlement();

}

// Create Group

function createGroup() {

    const groupName =
        document.getElementById(
            "groupName"
        ).value.trim();

    const groupHead =
        document.getElementById(
            "groupHead"
        ).value.trim();

    if (groupName === "") {

        alert(
            "Enter Group Name"
        );

        return;

    }

    if (groupHead === "") {

        alert(
            "Enter Group Head"
        );

        return;

    }
    if (

        group.members.length > 0 &&

        !confirm(

            "Creating a new group will erase the current group. Continue?"

        )

    ) {

        return;

    }

    group.name = groupName;

    group.head = groupHead;

    group.currentUser = groupHead;

    group.members = [

        {

            name: groupHead,

            role: "Head"

        }

    ];

    group.expenses = [];

    saveGroup();

    renderCurrentUsers();

    renderMembers();

    loadPaidBy();

    renderExpenses();

    calculateSettlement();
    document.getElementById(
        "memberName"
    ).value = "";

    clearExpenseForm();

    alert(
        "Group Created Successfully"
    );

}

// Current User 

function renderCurrentUsers() {

    const select =
        document.getElementById(
            "currentUser"
        );

    if (!select) return;

    select.innerHTML = "";

    group.members.forEach(member => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            member.name;

        option.textContent =
            member.name;

        select.appendChild(
            option
        );

    });

    select.value =
        group.currentUser;

    updateRole();

}

// Change User

function changeUser() {

    group.currentUser =
        document.getElementById(
            "currentUser"
        ).value;

    saveGroup();

    updateRole();

}

//  Update Role 

function updateRole() {

    const isHead =
        group.currentUser ===
        group.head;

    document.getElementById(
        "currentRole"
    ).textContent =
        isHead
            ? "Head"
            : "Member";

    document.getElementById(
        "memberSection"
    ).style.display =
        isHead
            ? "block"
            : "none";

    document.getElementById(
        "expenseSection"
    ).style.display =
        isHead
            ? "block"
            : "none";

}

//  Add Member 

function addMember() {

    const memberName =
        document.getElementById(
            "memberName"
        ).value.trim();

    if (memberName === "") {

        alert(
            "Enter Member Name"
        );

        return;

    }

    const exists =
        group.members.find(member =>
            member.name.toLowerCase() ===
            memberName.toLowerCase()
        );

    if (exists) {

        alert(
            "Member Already Exists"
        );

        return;

    }

    group.members.push({


        name: memberName,

        role: "Member"

    });

    document.getElementById(
        "memberName"
    ).value = "";

    saveGroup();

    renderCurrentUsers();

    renderMembers();

    loadPaidBy();

}

//  Render Members 

function renderMembers() {

    const table =
        document.getElementById(
            "memberTable"
        );

    if (!table) return;

    table.innerHTML = "";

    if (
        group.members.length === 0
    ) {

        table.innerHTML = `

        <tr>

            <td colspan="2">

                No Members Added

            </td>

        </tr>

        `;

        return;

    }

    group.members.forEach(member => {

        const row =
            document.createElement(
                "tr"
            );

        let action = "-";

        if (

            group.currentUser ===
            group.head &&

            member.role !== "Head"

        ) {

            action = `

            <button
                onclick="removeMember('${member.name}')">

                Delete

            </button>

            `;

        }

        row.innerHTML = `

        <td>

            ${member.role === "Head" ? "👑 " : ""}

            ${member.name}

        </td>

        <td>

            ${action}

        </td>

        `;

        table.appendChild(
            row
        );

    });

}

//  Remove Member 

function removeMember(name) {

    const confirmDelete =
        confirm(

            "Remove this member?"

        );

    if (!confirmDelete) {

        return;

    }

    const hasExpense =
        group.expenses.some(
            expense =>
                expense.paidBy === name
        );

    if (hasExpense) {

        alert(
            "Member has expenses. Delete those expenses first."
        );

        return;

    }

    group.members =
        group.members.filter(
            member =>
                member.name !== name
        );

    saveGroup();

    renderCurrentUsers();

    renderMembers();

    loadPaidBy();

    renderExpenses();

    calculateSettlement();

}

//  Paid By Dropdown 

function loadPaidBy() {

    const select =
        document.getElementById(
            "paidBy"
        );

    if (!select) return;

    select.innerHTML = "";

    group.members.forEach(member => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            member.name;

        option.textContent =
            member.name;

        select.appendChild(
            option
        );

    });

}

//  Clear Expense Form 

function clearExpenseForm() {

    document.getElementById(
        "expenseDescription"
    ).value = "";

    document.getElementById(
        "expenseAmount"
    ).value = "";

    if (
        document.getElementById(
            "expenseCategory"
        )
    ) {

        document.getElementById(
            "expenseCategory"
        ).selectedIndex = 0;

    }

}

//  Add Expense 

function addExpense() {

    const description =
        document.getElementById(
            "expenseDescription"
        ).value.trim();

    const category =
        document.getElementById(
            "expenseCategory"
        ).value;

    const amount =
        Number(
            document.getElementById(
                "expenseAmount"
            ).value
        );

    const paidBy =
        document.getElementById(
            "paidBy"
        ).value;

    if (description === "") {

        alert("Enter Description");

        return;

    }
    if (description.length > 100) {

        alert("Description should not exceed 100 characters");

        return;

    }

    if (amount <= 0) {

        alert("Enter Valid Amount");

        return;

    }

    const expense = {

        id: Date.now(),
        createdAt: Date.now(),

        date:
            new Date().toLocaleString(),

        description,

        category,

        amount,

        paidBy

    };

    group.expenses.push(expense);

    saveGroup();

    renderExpenses();

    calculateSettlement();

    clearExpenseForm();

}

//  Render Expenses 

function renderExpenses() {
    group.expenses.sort((a, b) => {

        return (b.createdAt || 0) - (a.createdAt || 0);

    });

    const table =
        document.getElementById(
            "expenseTable"
        );

    if (!table) return;

    table.innerHTML = "";

    if (group.expenses.length === 0) {

        table.innerHTML = `

        <tr>

            <td colspan="7">

                No Expenses Found

            </td>

        </tr>

        `;

        return;

    }

    group.expenses.forEach(expense => {

        let editButton = "-";

        let deleteButton = "-";

        if (

            group.currentUser ===
            group.head

        ) {

            editButton = `

            <button
                onclick="editExpense(${expense.id})">

                Edit

            </button>

            `;

            deleteButton = `

            <button
                onclick="deleteExpense(${expense.id})">

                Delete

            </button>

            `;

        }

        const row =
            document.createElement(
                "tr"
            );

        row.innerHTML = `

        <td>

            ${expense.date}

        </td>

        <td>

            ${expense.description}

        </td>

        <td>

            ${expense.category}

        </td>

        <td>

            ${expense.paidBy}

        </td>

        <td>

            ₹${expense.amount}

        </td>

        <td>

            ${editButton}

        </td>

        <td>

            ${deleteButton}

        </td>

        `;

        table.appendChild(row);

    });

}

//  Edit Expense 

function editExpense(id) {

    const expense =
        group.expenses.find(

            item =>

                item.id === id

        );

    if (!expense) return;

    const description =
        prompt(

            "Description",

            expense.description

        );

    if (description === null) return;

    const category =
        prompt(

            "Category",

            expense.category

        );

    if (category === null) return;

    const amount =
        Number(

            prompt(

                "Amount",

                expense.amount

            )

        );

    if (

        amount <= 0

    ) {

        alert(

            "Invalid Amount"

        );

        return;

    }

    expense.description =
        description;

    expense.category =
        category;

    expense.amount =
        amount;

    saveGroup();

    renderExpenses();

    calculateSettlement();

}

//  Delete Expense 

function deleteExpense(id) {

    const confirmDelete =
        confirm(

            "Delete this Expense?"

        );

    if (!confirmDelete) {

        return;

    }

    group.expenses =
        group.expenses.filter(

            expense =>

                expense.id !== id

        );

    saveGroup();

    renderExpenses();

    calculateSettlement();

}
// Settlement Calculation

function calculateSettlement() {

    let totalExpense = 0;

    group.expenses.forEach(expense => {

        totalExpense += expense.amount;

    });
    localStorage.setItem(
        "groupTotalExpense",
        totalExpense
    );

    document.getElementById(
        "groupTotalExpense"
    ).innerText =
        "₹" + totalExpense.toFixed(2);

    if (group.members.length === 0) {

        document.getElementById(
            "perPersonExpense"
        ).innerText = "₹0";

        document.getElementById(
            "settlementResult"
        ).innerHTML =
            "<p>No Members</p>";

        return;

    }

    const perPerson =
        totalExpense /
        group.members.length;

    document.getElementById(
        "perPersonExpense"
    ).innerText =
        "₹" + perPerson.toFixed(2);

    const balance = {};

    group.members.forEach(member => {

        balance[member.name] = -perPerson;

    });

    group.expenses.forEach(expense => {

        balance[expense.paidBy] += expense.amount;

    });

    const creditors = [];

    const debtors = [];

    Object.keys(balance).forEach(name => {

        const value = Number(
            balance[name].toFixed(2)
        );

        if (value > 0) {

            creditors.push({

                name,

                amount: value

            });

        }

        else if (value < 0) {

            debtors.push({

                name,

                amount: Math.abs(value)

            });

        }

    });

    const result =
        document.getElementById(
            "settlementResult"
        );

    result.innerHTML = "";

    let i = 0;

    let j = 0;

    while (

        i < debtors.length &&

        j < creditors.length

    ) {

        const pay =
            Math.min(

                debtors[i].amount,

                creditors[j].amount

            );

        result.innerHTML += `
<p>
    <b>${debtors[i].name}</b>
    owes
    <b>${creditors[j].name}</b>
    ₹${pay.toFixed(2)}
</p>
`;




        debtors[i].amount -= pay;

        creditors[j].amount -= pay;

        if (

            debtors[i].amount < 0.01

        ) {

            i++;

        }

        if (

            creditors[j].amount < 0.01

        ) {

            j++;

        }

    }

    if (

        result.innerHTML === ""

    ) {

        result.innerHTML =

            "<p>No Settlement Required</p>";

    }

}

window.onload = function () {

    loadGroup();

};