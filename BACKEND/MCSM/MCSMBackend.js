function startCourse(course) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    document.querySelectorAll('.course-content').forEach(el => el.style.display = 'none');
    modal.style.display = 'flex';
    document.body.classList.add('modal-active');
    const selectedCourse = document.getElementById(course.replace(' ', ''));
    if (selectedCourse) {
        modalBody.innerHTML = selectedCourse.innerHTML;
        modalBody.querySelector('button').addEventListener('click', () => {
            takeExam(course); 
        });
    }
}

function takeExam(course) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const selectedExam = document.getElementById(`${course.replace(' ', '')}Exam`);
    if (selectedExam) {
        modalBody.innerHTML = selectedExam.innerHTML;
        modalBody.querySelector('button').addEventListener('click', () => {
            alert(`Exam for ${course} submitted!`);
            closeModal();
        });
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.body.classList.remove('modal-active');
}

document.getElementById('closeModal').addEventListener('click', closeModal);


