document.addEventListener("DOMContentLoaded", function () {
    const studentList = document.getElementById("student-list");
    const submitBtn = document.getElementById("submit-btn");

    const { jsPDF } = window.jspdf;

    // ✅ 64 Individual Student Names
    const students = [
        "Aayush Bijalwan", "Abhay Kumar Saxena", "Abhishek Gorkha", "Abhishek Kumar",
        "Abhishek Kumar Majumdar", "Abhishek Singh", "Abhishek Singh Mahar", "Aditya Rawat",
        "Aditi Bhatt", "Ajay Joshi", "Akarsh Saxena", "Akash Yadav", "Akshi Chauhan",
        "Amisha Bhardwaj", "Anchal Sharma", "Anjali Pokhariya", "Ankita Pargai", "Ankit Kumar",
        "Anuj Kumar Pandey", "Anukul Singh Bisht", "Anuska Singh", "Aradhya Tewari",
        "Arsalan Nawaz", "Ashish Joshi", "Ashitosh Singh Rana", "Chetan Pandey", "Deepak Kumar",
        "Deepak Pandey", "Dhruv Sharma", "Dhatri Upadhyay", "Durgesh Kukreti", "Esha Rawat",
        "Gayathra Bhatt", "Indrajeet Bohra", "Kavita Kapkoti", "Kundan Kumar", "Laxmi Jeena",
        "Mahee Adhikari", "Manish Pandey", "Manish Singh Rajwar", "Mayank Mittal",
        "Mayank Pandey", "Mohammad Suhaiv", "Mohd Kaif", "Mohd. Afzal Gufraan",
        "Nitesh Kumar", "Nikita Adhikari", "Pawan Joshi", "Priyansh Bhatt", "Priyanshu Mishra",
        "Rahul Kandpal", "Rahul Kumar", "Rohit Kumar", "Seetaram Sharma", "Shivendra Dubey",
        "Shubham Dey", "Shubham Singh", "Shubh Srivastava", "Sumit Joshi",
        "Suraj Chandra Paladiya", "Tanuja Rautela", "Vaibhav Dubey", "Vigyat Bisht", "Vivek Singh" , "Yogita Sharma"
    ];

    // ✅ Generate Student List in HTML
    students.forEach((name, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td class="checkbox-container">
                <input type="checkbox" name="attendance-${index}" class="present">
            </td>
            <td class="checkbox-container">
                <input type="checkbox" name="attendance-${index}" class="leave">
            </td>
        `;
        studentList.appendChild(row);
    });

    // ✅ Ensure Only One Checkbox is Checked per Student
    document.querySelectorAll("tr").forEach(row => {
        const checkboxes = row.querySelectorAll("input[type='checkbox']");
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", () => {
                checkboxes.forEach(box => {
                    if (box !== checkbox) box.checked = false;
                });
            });
        });
    });

    // ✅ Generate Two-Column PDF (No Extra Blank Columns)
    submitBtn.addEventListener("click", () => {
        const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Attendance Report", 105, 15, { align: "center" });

        const headers = [["Student Name", "Status"]];
        const leftColumn = [];
        const rightColumn = [];

        // ✅ Split Students into Two Columns (32 each)
        students.forEach((name, index) => {
            const row = document.querySelectorAll("tbody tr")[index];
            const present = row.children[1].querySelector("input").checked;
            const leave = row.children[2].querySelector("input").checked;

            let statusText = "Absent"; 
            let textColor = [255, 0, 0]; // 🔴 Red (Absent)

            if (present) {
                statusText = "Present";
                textColor = [0, 128, 0]; // 🟢 Green (Present)
            } else if (leave) {
                statusText = "Leave";
                textColor = [0, 0, 255]; // 🔵 Blue (Leave)
            }

            const dataRow = [
                { content: name, styles: { fontSize: 8 } },
                { content: statusText, styles: { textColor, fontSize: 8 } }
            ];

            if (index < 32) {
                leftColumn.push(dataRow);
            } else {
                rightColumn.push(dataRow);
            }
        });

        // ✅ Left Column (First 32 Students)
        doc.autoTable({
            startY: 25,
            head: headers,
            body: leftColumn,
            theme: "grid",
            headStyles: { fillColor: [37, 117, 252], textColor: 255, fontSize: 10 },
            styles: { fontSize: 8, cellPadding: 2 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            columnStyles: {
                0: { cellWidth: 60 }, // Name Column (Left)
                1: { cellWidth: 30 }  // Status Column (Left)
            },
            margin: { left: 10, top: 25 }
        });

        // ✅ Right Column (Remaining 32 Students)
        doc.autoTable({
            startY: 25,
            head: headers,
            body: rightColumn,
            theme: "grid",
            headStyles: { fillColor: [37, 117, 252], textColor: 255, fontSize: 10 },
            styles: { fontSize: 8, cellPadding: 2 },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            columnStyles: {
                0: { cellWidth: 60 }, // Name Column (Right)
                1: { cellWidth: 30 }  // Status Column (Right)
            },
            margin: { left: 110, top: 25 } // ✅ Moves Right Table Next to Left Table
        });

        // ✅ Save PDF
        doc.save("Attendance_Report.pdf");
    });
});
