
 const userMedals = {
    CPR: "Gold Medal 🥇",
    "First Aid": "Silver Medal 🥈", 
    "Fire Safety": "Bronze Medal 🥉" 
};

const certificateExpirations = {
    CPR: 80, 
    "First Aid": 50,
    "Fire Safety": 20 
};

const medalsContainer = document.getElementById("medals");
for (const [course, medal] of Object.entries(userMedals)) {
    const medalElement = document.createElement("div");
    medalElement.classList.add("medal");
    medalElement.innerText = `${course}: ${medal}`;
    medalsContainer.appendChild(medalElement);
}


for (const [course, progress] of Object.entries(certificateExpirations)) {
    const progressBar = document.getElementById(`${course.toLowerCase().replace(" ", "")}-progress`);
    progressBar.style.width = `${progress}%`;
    if (progress <= 20) {
        progressBar.style.backgroundColor = "red"; 
    } else if (progress <= 50) {
        progressBar.style.backgroundColor = "orange"; 
    } else {
        progressBar.style.backgroundColor = "green";
    }
}