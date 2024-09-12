// Variables y configuración
const approvalThreshold = 7; 
let students = [];  
let chart = null;  // Variable para almacenar la instancia del gráfico

// Inicializar y mostrar la notificación
const showToast = (message) => {
    Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        confirmButtonText: 'OK'
    });
};

// Mostrar notificación de error
const showError = (message) => {
    Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        confirmButtonText: 'OK'
    });
};

// Cargar datos desde LocalStorage
function loadFromLocalStorage() {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
        students = JSON.parse(storedStudents);
        updateHistory();
        renderChart();
    }
}

// Guardar datos en LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Agregar una calificación
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
        saveToLocalStorage();  
        renderChart();  

        // Mostrar notificación
        showToast(`Estudiante ${name} agregado exitosamente`);

        // Limpiar el formulario
        document.getElementById('studentName').value = '';
        document.getElementById('studentGrade').value = '';
    } else {
        showError('Por favor, ingrese un nombre y una calificación válida entre 0 y 10.');
    }
}

// Mostrar resultado de un estudiante
function showResult(student) {
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = `<p>El estudiante ${student.name} ha ${student.approved ? 'aprobado' : 'reprobado'} con una calificación de ${student.grade}.</p>`;
}

// Actualizar historial
function updateHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; 
    students.forEach((student, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = ` 
            ${student.name} - Calificación: ${student.grade} - Estado: ${student.approved ? 'Aprobado' : 'Reprobado'}
            <div class="actions">
                <button onclick="editStudent(${index})">Editar</button>
                <button onclick="deleteStudent(${index})">Eliminar</button>
            </div>
        `;
        historyList.appendChild(listItem);
    });
}

// Editar un estudiante
function editStudent(index) {
    const student = students[index];
    Swal.fire({
        title: 'Editar Estudiante',
        html: `
            <input id="editName" class="swal2-input" value="${student.name}" placeholder="Nombre">
            <input id="editGrade" class="swal2-input" type="number" value="${student.grade}" min="0" max="10" placeholder="Calificación">
        `,
        focusConfirm: false,
        preConfirm: () => {
            const name = Swal.getPopup().querySelector('#editName').value.trim();
            const grade = parseFloat(Swal.getPopup().querySelector('#editGrade').value);
            if (!name || isNaN(grade) || grade < 0 || grade > 10) {
                showError('Por favor, ingrese un nombre y una calificación válida entre 0 y 10.');
                return false;
            }
            return { name, grade };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            students[index] = {
                ...students[index],
                name: result.value.name,
                grade: result.value.grade,
                approved: result.value.grade >= approvalThreshold
            };
            saveToLocalStorage();
            updateHistory();
            renderChart();
            showToast('Estudiante actualizado exitosamente');
        }
    });
}

// Eliminar un estudiante
function deleteStudent(index) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            students.splice(index, 1);
            saveToLocalStorage();
            updateHistory();
            renderChart();
            showToast('Estudiante eliminado exitosamente');
        }
    });
}

// Filtrar y mostrar los estudiantes aprobados
function filterApproved() {
    const approvedStudents = students.filter(student => student.grade >= 7);
    displayFilteredResults(approvedStudents);
}

// Filtrar y mostrar los estudiantes reprobados
function filterFailed() {
    const failedStudents = students.filter(student => student.grade < 7);
    displayFilteredResults(failedStudents);
}

// Mostrar resultados filtrados
function displayFilteredResults(filteredStudents) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';  
    if (filteredStudents.length === 0) {
        historyList.innerHTML = '<li>No se encontraron resultados.</li>';
    } else {
        filteredStudents.forEach((student, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${student.name} - Calificación: ${student.grade} - Estado: ${student.approved ? 'Aprobado' : 'Reprobado'}`;
            historyList.appendChild(listItem);
        });
    }
}

// Buscar estudiante
function searchStudent() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const historyList = document.getElementById('historyList');
    const items = historyList.getElementsByTagName('li');
    Array.from(items).forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchInput) ? 'block' : 'none';
    });
}

// Exportar a CSV
function exportToCSV() {
    const csvRows = [];
    csvRows.push(['Nombre', 'Calificación', 'Estado']);
    students.forEach(student => {
        csvRows.push([student.name, student.grade, student.approved ? 'Aprobado' : 'Reprobado']);
    });
    const csvString = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estudiantes.csv';
    a.click();
}

// Función para renderizar el gráfico
function renderChart() {
    if (chart) {
        chart.destroy();
    }
    const ctx = document.getElementById('chart').getContext('2d');
    const grades = students.map(student => student.grade);
    const labels = students.map(student => student.name);
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Calificaciones',
                data: grades,
                backgroundColor: grades.map(grade => grade >= 7 ? 'green' : 'red'),
                borderColor: grades.map(grade => grade >= 7 ? 'darkgreen' : 'darkred'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para alternar el tema
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// Inicializar
loadFromLocalStorage();

// Asignar la función al botón
document.getElementById('addStudent').addEventListener('click', addGrade);
