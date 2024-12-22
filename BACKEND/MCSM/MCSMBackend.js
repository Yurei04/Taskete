function startCourse(course) {
    document.querySelectorAll('.course-content').forEach(el => el.style.display = 'none');
    document.getElementById(course.replace(' ', '')).style.display = 'block';
}

function takeExam(course) {
    document.querySelectorAll('.course-content').forEach(el => el.style.display = 'none');
    document.getElementById(course.replace(' ', '') + 'Exam').style.display = 'block';
}

function completeExam(course) {
    alert(`${course} Exam completed! Certificate awarded.`);
    window.location.href = 'profile.html';
}