const startButton = document.getElementById("start");
const output = document.getElementById("output");
const info = document.getElementById("info");
const downloadableData = output;

let transcribedData = "";
let scenarioDatabase = [];

if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    startButton.addEventListener("click", () => {
        output.textContent = "Recording... Please speak into the microphone.";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcribedData = transcript;
        console.log("Transcript: ", transcript);
        output.textContent = `Recorded: "${transcript}"`;
        processTranscription(transcribedData);
    };

    recognition.onerror = (event) => {
        output.textContent = `Error: ${event.error}`;
    };

    recognition.onend = () => {
        if (output.textContent === "Recording... Please speak into the microphone.") {
            output.textContent = "No speech detected. Try again.";
        }
    };
} else {
    output.textContent = "Speech Recognition is not supported in your browser.";
}

async function loadDatabase() {
    try {
        const scenarioResponse = await fetch("/Backend/DATABASE/scenario.json");
        if (!scenarioResponse.ok) throw new Error(`Failed to load scenario.json: ${scenarioResponse.status}`);
        scenarioDatabase = await scenarioResponse.json();
        console.log("Scenario database loaded successfully.");
    } catch (error) {
        console.error("Error loading scenario database: ", error);
    }
}

async function processTranscription(data) {
    console.log("Processing Transcription: ", data);
    await loadDatabase();

    const matchedScenario = matchScenario(data);

    if (matchedScenario) {
        const { description, severeness, injuries, aidRecommendations, affectedBodyParts } = matchedScenario;

        output.innerHTML = `
            <p>Scenario Description: ${description || "No description available"}</p>
            <p>Severity Level: ${severeness || "Unknown"}</p>
            <p>Predicted Injuries: ${injuries ? injuries.join(", ") : "Unknown injuries detected"}</p>
            <p>Aid Suggestions: ${aidRecommendations ? aidRecommendations.join(", ") : "No recommendations available"}</p>
        `;
        highlightInjuredParts(affectedBodyParts || []);
    } else {
        output.innerHTML = `<p>No matching scenario found for the provided transcription.</p>`;
    }

    const { name, age, location } = extractPersonalDetails(data);

    info.innerHTML = `
        <p>Name: ${name || "Unknown"}</p>
        <p>Age: ${age || "Unknown"}</p>
        <p>Location: ${location || "Unknown"}</p>
    `;
}

function matchScenario(data) {
    console.log("Matching scenario for data:", data);

    if (!scenarioDatabase || scenarioDatabase.length === 0) {
        console.error("Scenario database is empty or not loaded.");
        return null;
    }

    const matchedScenario = scenarioDatabase.find(scenario =>
        scenario.keywords &&
        scenario.keywords.some(keyword => 
            keyword && data.toLowerCase().includes(keyword.toLowerCase())
        )
    );

    return matchedScenario || null;
}

function extractPersonalDetails(data) {
    const lowerCaseData = data.toLowerCase();
    const nameMatch = /my name is (\w+)/.exec(lowerCaseData);
    const ageMatch = /i am (\d+) years old/.exec(lowerCaseData);
    const locationMatch = /i live in (\w+)/.exec(lowerCaseData);

    return {
        name: nameMatch ? nameMatch[1] : null,
        age: ageMatch ? ageMatch[1] : null,
        location: locationMatch ? locationMatch[1] : null
    };
}

function highlightInjuredParts(detectedBodyParts) {
    document.querySelectorAll('.human-body svg path, .human-body svg ellipse').forEach(el => {
        el.classList.remove('highlight');
    });

    detectedBodyParts.forEach(part => {
        const svgElements = document.querySelectorAll(`[id*="${part}"], [class*="${part}"]`);
        svgElements.forEach(element => {
            element.classList.add("highlight");
        });
    });
}

//PROBLEM WHEN DOWNLOAD CONTENTS ARE UNDEFINE FIX TOMORROW
function downloadData(content) {
    const blob = new Blob([content], { type: "application/msword"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "document.doc";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

}




loadDatabase();
