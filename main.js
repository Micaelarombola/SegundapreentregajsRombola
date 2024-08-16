// Variables y configuración
const approvalThreshold = 7;  // Umbral para aprobar
let students = [];  // Array para almacenar información de estudiantes

// Función para agregar una calificación
function addGrade() {
    const name = document.getElementById('studentName').value.trim();
    const grade = parseFloat(document.getElementById('studentGrade').value);

    if (name && !isNaN(grade) && grade >= 0 && grade <= 10) {
        const student = {
            name: name,
            grade: grade,
            approved: grade >= approvalThreshold
        };
        students.push(student);
        updateHistory();
        showResult(student);
        // Limpiar los campos
        document.getElementById('studentName').value = '';
        document.getElementById('studentGrade').value = '';
    } else {
        alert('Por favor, ingrese un nombre y una calificación válida entre 0 y 10.');
    }
}

// Función para mostrar el resultado de un estudiante
function showResult(student) {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `<p>El estudiante ${student.name} ha ${student.approved ? 'aprobado' : 'reprobado'} con una calificación de ${student.grade}.</p>`;
}

// Función para actualizar el historial en la vista
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';  // Limpiar la lista actual

    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.textContent = `${student.name} - Calificación: ${student.grade} - Estado: ${student.approved ? 'Aprobado' : 'Reprobado'}`;
        historyList.appendChild(listItem);
    });
}

// Función para filtrar y mostrar los estudiantes aprobados (7 a 10)
function filterApproved() {
    const approvedStudents = students.filter(student => student.grade >= 7);
    displayFilteredResults(approvedStudents);
}

// Función para filtrar y mostrar los estudiantes reprobados (Menos de 7)
function filterFailed() {
    const failedStudents = students.filter(student => student.grade < 7);
    displayFilteredResults(failedStudents);
}

// Función para mostrar los resultados filtrados
function displayFilteredResults(filteredStudents) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';  // Limpiar la lista actual

    if (filteredStudents.length === 0) {
        historyList.innerHTML = '<li>No se encontraron resultados.</li>';
    } else {
        filteredStudents.forEach(student => {
            const listItem = document.createElement('li');
            listItem.textContent = `${student.name} - Calificación: ${student.grade} - Estado: ${student.approved ? 'Aprobado' : 'Reprobado'}`;
            historyList.appendChild(listItem);
        });
    }
}
