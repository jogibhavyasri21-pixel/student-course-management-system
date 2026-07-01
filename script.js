const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");
const search = document.getElementById("search");
const totalStudents = document.getElementById("totalStudents");

let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

// Save to Local Storage
function saveStudents() {
    localStorage.setItem("students", JSON.stringify(students));
}

// Update Dashboard Counter
function updateCount() {
    totalStudents.textContent = students.length;
}

// Display Students
function displayStudents(data = students) {
    studentList.innerHTML = "";

    if (data.length === 0) {
        studentList.innerHTML = `
        <tr>
            <td colspan="6">No Students Found</td>
        </tr>`;
        updateCount();
        return;
    }

    data.forEach((student, index) => {
        studentList.innerHTML += `
        <tr>
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.email}</td>
            <td>${student.department.toUpperCase()}</td>
            <td>${student.course}</td>
            <td>
                <button class="action-btn edit" onclick="editStudent(${index})">Edit</button>
                <button class="action-btn delete" onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>`;
    });

    updateCount();
}

// Add / Update Student
form.addEventListener("submit", function(e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value.trim();
    const course = document.getElementById("course").value;

    if(!name || !roll || !email || !department || !course){
        alert("Please fill all fields.");
        return;
    }

    // Duplicate Roll Check
    const duplicate = students.find((s,i)=>s.roll===roll && i!==editIndex);

    if(duplicate){
        alert("Roll Number already exists!");
        return;
    }

    const student={
        name,
        roll,
        email,
        department,
        course
    };

    if(editIndex===-1){
        students.push(student);
        alert("Student Added Successfully");
    }else{
        students[editIndex]=student;
        editIndex=-1;
        form.querySelector("button").textContent="+ Add Student";
        alert("Student Updated Successfully");
    }

    saveStudents();
    displayStudents();
    form.reset();

});

// Edit Student
function editStudent(index){

    const student=students[index];

    document.getElementById("name").value=student.name;
    document.getElementById("roll").value=student.roll;
    document.getElementById("email").value=student.email;
    document.getElementById("department").value=student.department;
    document.getElementById("course").value=student.course;

    editIndex=index;

    form.querySelector("button").textContent="Update Student";
}

// Delete Student
function deleteStudent(index){

    if(confirm("Are you sure you want to delete this student?")){

        students.splice(index,1);

        saveStudents();

        displayStudents();
    }

}

// Search Student
search.addEventListener("keyup", function(){

    const value=this.value.toLowerCase();

    const filtered=students.filter(student=>

        student.name.toLowerCase().includes(value) ||

        student.roll.toLowerCase().includes(value) ||

        student.department.toLowerCase().includes(value) ||

        student.course.toLowerCase().includes(value)

    );

    displayStudents(filtered);

});

// Initial Load
displayStudents();