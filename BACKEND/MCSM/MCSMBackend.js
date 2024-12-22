function startCourse(course) {
    document.querySelectorAll('.course-content').forEach(el => el.style.display = 'none');
    document.querySelector('.courses-containers').style.display = 'block';
    const selectedCourse = document.getElementById(course.replace(' ', ''));
    console.log("Attempting to display: ", course.replace(' ', ''));
    if (selectedCourse) {
        selectedCourse.style.display = 'block';
        console.log("Displayed: ", selectedCourse.id);
    } else {
        console.error("Element not found: ", course.replace(' ', ''));
    }
}

function takeExam(course) {
    document.querySelectorAll('.exam-content').forEach(el => el.style.display = 'none');
    document.querySelector('.exams-container').style.display = 'block';

    const selectedExam = document.getElementById(course.replace(' ', '') + 'Exam');
    console.log("Attempting to display exam: ", course.replace(' ', '') + 'Exam');
    
    if (selectedExam) {
        selectedExam.style.display = 'block';
        console.log("Displayed exam: ", selectedExam.id);
    } else {
        console.error("Exam element not found: ", course.replace(' ', '') + 'Exam');
    }
}


function completeExam(course) {
    alert(`${course} Exam completed! Certificate awarded.`);
    resetProgressBar(`${course.toLowerCase()}Progress`, 60000);
}
