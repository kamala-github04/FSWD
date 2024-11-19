// Default leave balances
const defaultLeaveBalances = {
    casual: 12, // Casual Leave days (default)
    medical: 10 // Medical Leave days (default)
};

// Load leave data from localStorage or initialize default
function loadLeaveData() {
    let leaveData = JSON.parse(localStorage.getItem('leaveData'));
    if (!leaveData) {
        leaveData = { ...defaultLeaveBalances };
        localStorage.setItem('leaveData', JSON.stringify(leaveData));
    }
    return leaveData;
}

// Update the leave balance displayed on the page
function updateLeaveBalance() {
    const leaveData = loadLeaveData();
    document.getElementById('casual-leave').innerText = leaveData.casual;
    document.getElementById('medical-leave').innerText = leaveData.medical;
}

// Save employee details to localStorage
function saveEmployeeDetails(name, department, email, phone, joiningDate) {
    const employeeData = { name, department, email, phone, joiningDate };
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
}

// Display employee details
function displayEmployeeDetails() {
    const employeeData = JSON.parse(localStorage.getItem('employeeData'));
    if (employeeData) {
        document.getElementById('employee-name').value = employeeData.name;
        document.getElementById('employee-department').value = employeeData.department;
        document.getElementById('employee-email').value = employeeData.email;
        document.getElementById('employee-phone').value = employeeData.phone;
        document.getElementById('employee-joining-date').value = employeeData.joiningDate;
    }
}

// Apply leave by reducing the appropriate leave days
function applyLeave(leaveType, days, fromDate, toDate) {
    let leaveData = loadLeaveData();

    if (leaveType === 'casual' && leaveData.casual >= days) {
        leaveData.casual -= days;
    } else if (leaveType === 'medical' && leaveData.medical >= days) {
        leaveData.medical -= days;
    } else {
        alert('Insufficient leave balance!');
        return false;
    }

    // Save updated leave data
    localStorage.setItem('leaveData', JSON.stringify(leaveData));

    // Add leave application to history
    const leaveHistory = JSON.parse(localStorage.getItem('leaveHistory')) || [];
    leaveHistory.push({
        leaveType,
        days,
        fromDate,
        toDate
    });
    localStorage.setItem('leaveHistory', JSON.stringify(leaveHistory));

    updateLeaveBalance();
    showSuccessMessage('Leave applied successfully!');
    return true;
}

// Show success message
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.classList.add('success');
    successMessage.innerText = message;
    document.body.appendChild(successMessage);
    setTimeout(() => successMessage.remove(), 3000);
}

// Show the modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

// Close the modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
}

// Display leave history
function displayLeaveHistory() {
    const leaveHistory = JSON.parse(localStorage.getItem('leaveHistory')) || [];
    const leaveHistoryList = document.getElementById('leave-history');
    leaveHistoryList.innerHTML = ''; // Clear current list

    if (leaveHistory.length === 0) {
        leaveHistoryList.innerHTML = "<p>No leave history found.</p>";
    }

    leaveHistory.forEach(leave => {
        const listItem = document.createElement('li');
        listItem.classList.add('leave-item');
        listItem.innerHTML = `
            <span>${leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1)}:</span>
            ${leave.days} day(s) from <strong>${leave.fromDate}</strong> to <strong>${leave.toDate}</strong>
        `;
        leaveHistoryList.appendChild(listItem);
    });
}

// Event listener for employee form submission
document.getElementById('employee-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('employee-name').value;
    const department = document.getElementById('employee-department').value;
    const email = document.getElementById('employee-email').value;
    const phone = document.getElementById('employee-phone').value;
    const joiningDate = document.getElementById('employee-joining-date').value;

    if (name && department && email && phone && joiningDate) {
        saveEmployeeDetails(name, department, email, phone, joiningDate);
        showModal('save-details-modal');
    } else {
        alert('Please fill in all employee details.');
    }
});

// Event listener for leave application form submission
document.getElementById('leave-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const leaveType = document.getElementById('leave-type').value;
    const leaveDays = parseInt(document.getElementById('leave-days').value);
    const fromDate = document.getElementById('leave-from-date').value;
    const toDate = document.getElementById('leave-to-date').value;

    if (leaveDays > 0 && fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const dateDiff = Math.ceil((to - from) / (1000 * 3600 * 24)) + 1;

        if (dateDiff !== leaveDays) {
            alert('The number of days selected does not match the dates range.');
        } else {
            applyLeave(leaveType, leaveDays, fromDate, toDate);
            showModal('apply-leave-modal');
        }
    } else {
        alert('Please fill in all the fields correctly.');
    }
});

// Initial setup
updateLeaveBalance();
displayEmployeeDetails();
displayLeaveHistory();
