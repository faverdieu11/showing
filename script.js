const form = document.getElementById("signinForm");
const messageDiv = document.getElementById("message");
const tableBody = document.querySelector("#leadsTable tbody");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

// 1. LOAD LEADS ON STARTUP
// This runs as soon as the page opens
window.addEventListener("DOMContentLoaded", loadLeads);
function loadLeads() {
  tableBody.innerHTML = "";
  const savedLeads = JSON.parse(localStorage.getItem("openHouseLeads")) || [];

  // Update the counter text
  document.getElementById(
    "leadCounter"
  ).innerText = `Total Leads: ${savedLeads.length}`;

  if (savedLeads.length > 0) {
    savedLeads.forEach((lead) => {
      addLeadToTable(
        lead.name,
        lead.email,
        lead.phone,
        lead.comments,
        lead.source
      );
    });
  }
}
// 2. ADD LEAD & SAVE
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const lead = {
    name: document.getElementById("visitorName").value,
    email: document.getElementById("visitorEmail").value,
    phone: document.getElementById("visitorPhone").value,
    comments: document.getElementById("visitorComments").value || "None"
  };

  // Add to UI
  addLeadToTable(lead.name, lead.email, lead.phone, lead.comments);

  // Save to Local Storage
  const currentLeads = JSON.parse(localStorage.getItem("openHouseLeads")) || [];
  currentLeads.push(lead);
  localStorage.setItem("openHouseLeads", JSON.stringify(currentLeads));

  // Success Feedback
  messageDiv.style.display = "block";
  form.reset();
  setTimeout(() => {
    messageDiv.style.display = "none";
  }, 4000);
});

// Helper function to create the table row
function addLeadToTable(name, email, phone, comments) {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `<td>${name}</td><td>${email}</td><td>${phone}</td><td>${comments}</td>`;
  tableBody.appendChild(newRow);
}

// 3. EXPORT CSV (Unchanged)
downloadBtn.addEventListener("click", function () {
  let csvContent = "Name,Email,Phone,Comments\n";
  const rows = document.querySelectorAll("#leadsTable tbody tr");

  if (rows.length === 0) {
    alert("No leads to export yet!");
    return;
  }

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td");
    const rowData = [
      cols[0].innerText,
      cols[1].innerText,
      cols[2].innerText,
      `"${cols[3].innerText}"`
    ].join(",");
    csvContent += rowData + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", "Open_House_Leads.csv");
  a.click();
});

// 4. CLEAR DATA (Now also clears Local Storage)
clearBtn.addEventListener("click", function () {
  const password = prompt("Enter Agent Password to clear all leads:");

  if (password === "exp123") {
    if (
      confirm(
        "Are you sure? This will delete all captured leads from the memory."
      )
    ) {
      tableBody.innerHTML = "";
      localStorage.removeItem("openHouseLeads"); // CLEARS MEMORY
    }
  } else {
    alert("Incorrect password.");
  }
});
const addressInput = document.getElementById("propertyAddress");
const setAddressBtn = document.getElementById("setAddressBtn");
const headerAddress = document.getElementById("headerAddress");

// 1. LOAD ADDRESS ON STARTUP
window.addEventListener("DOMContentLoaded", () => {
  const savedAddress = localStorage.getItem("currentProperty");
  if (savedAddress) {
    headerAddress.innerText = savedAddress;
    addressInput.value = savedAddress;
  }
  loadLeads(); // Call your existing loadLeads function
});

// 2. UPDATE ADDRESS LOGIC
setAddressBtn.addEventListener("click", () => {
  const newAddr = addressInput.value;
  if (newAddr) {
    headerAddress.innerText = newAddr;
    localStorage.setItem("currentProperty", newAddr);
    alert("Property updated!");
  }
});

// 3. MODIFY CSV EXPORT (Add address to filename)
downloadBtn.addEventListener("click", function () {
  const currentAddr = localStorage.getItem("currentProperty") || "Open_House";
  let csvContent = `Property: ${currentAddr}\nName,Email,Phone,Comments\n`;

  const rows = document.querySelectorAll("#leadsTable tbody tr");
  if (rows.length === 0) {
    alert("No leads!");
    return;
  }

  rows.forEach((row) => {
    const cols = row.querySelectorAll("td");
    const rowData = [
      cols[0].innerText,
      cols[1].innerText,
      cols[2].innerText,
      `"${cols[3].innerText}"`
    ].join(",");
    csvContent += rowData + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("href", url);
  // Filename now includes the address!
  a.setAttribute("download", `${currentAddr.replace(/\s+/g, "_")}_Leads.csv`);
  a.click();
});