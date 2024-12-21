const startButton = document.getElementById("start");
const output = document.getElementById("output");
const info = document.getElementById("info");
let transcribedData = "";
const bodyParts = ["head", "neck", "chest", "abdomen","right-shoulder", "right-arm", "right-hand", "right-leg", "right-foot","left-shoulder", "left-arm", "left-hand", "left-leg", "left-foot"];
let injuryDatabase = [];
let aidDatabase = [];
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

async function processTranscription(data) {
    console.log("Processing Transcription: ", data);
    await loadDatabase();

    const matchedScenario = matchScenario(data);
    let detectedBodyParts = [];
    if (matchedScenario) {
        detectedBodyParts = matchedScenario.bodyParts;
    } else {
        detectedBodyParts = checkBodyParts(data);
    }

    const expandedBodyParts = expandGroupedBodyParts(detectedBodyParts);
    const predictedInjuries = identifyInjuries(expandedBodyParts);
    const aidRecommendations = getAidForInjuries(predictedInjuries);
    const { name, age, location } = extractPersonalDetails(data);

    highlightInjuredParts(expandedBodyParts);

    output.innerHTML = `
        <p>Detected Scenario: ${data}</p>
        <p>Matched Scenario: ${matchedScenario ? matchedScenario.description : "None"}</p>
        <p>Identified Body Parts: ${detectedBodyParts.join(", ")}</p>
        <p>Predicted Injuries: ${predictedInjuries.length > 0 ? predictedInjuries.join(", ") : "Unknown injuries detected"}</p>
        <p>Aid Suggestions: ${aidRecommendations.length > 0 ? aidRecommendations.join(", ") : "Unknown aid suggestions available"}</p>
    `;

    info.innerHTML = `
        <p>Name: ${name || "Unknown"}</p>
        <p>Age: ${age || "Unknown"}</p>
        <p>Location: ${location || "Unknown"}</p>
    `;
}

async function loadDatabase() {
    try {
        const injuryResponse = await fetch("/Backend/DATABASE/injury.json");
        if (!injuryResponse.ok) throw new Error(`Failed to load injury.json: ${injuryResponse.status}`);
        injuryDatabase = await injuryResponse.json();

        const aidResponse = await fetch("/Backend/DATABASE/aid.json");
        if (!aidResponse.ok) throw new Error(`Failed to load aid.json: ${aidResponse.status}`);
        aidDatabase = await aidResponse.json();

        const scenarioResponse = await fetch("/Backend/DATABASE/scenario.json");
        if (!scenarioResponse.ok) throw new Error(`Failed to load scenario.json: ${scenarioResponse.status}`);
        scenarioDatabase = await scenarioResponse.json();

        console.log("Databases loaded successfully!");
    } catch (error) {
        console.error("Error Loading Database: ", error);
    }
}



function checkBodyParts(data) {
    const normalizedData = data.toLowerCase().replace(/\s+/g, "-");
    return bodyParts.filter(part => normalizedData.includes(part));
}

function expandGroupedBodyParts(detectedParts) {
    const expandedParts = [];
    detectedParts.forEach(part => {
        if (part === "legs") {
            expandedParts.push("right-leg", "left-leg");
        } else if (part === "arms") {
            expandedParts.push("right-arm", "left-arm");
        } else {
            expandedParts.push(part);
        }
    });
    return expandedParts;
}

function identifyInjuries(detectedParts) {
    const injuries = [];
    detectedParts.forEach(part => {

        const matchingInjuries = injuryDatabase.filter(injury => injury.bodyPart.toLowerCase() === part);
        console.log("Scenario Database:", matchingInjuries);

        matchingInjuries.forEach(injury => injuries.push(injury.name));
    });
    return injuries;
}

function getAidForInjuries(injuries) {
    const aidRecommendations = [];
    injuries.forEach(injury => {
        const matchingAid = aidDatabase.find(aid => aid.injury.toLowerCase() === injury.toLowerCase());
        if (matchingAid) {
            aidRecommendations.push(matchingAid.solution);
        }
    });
    return aidRecommendations;
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

function matchScenario(data) {
    console.log("Matching scenario for data:", data);

    if (!scenarioDatabase || scenarioDatabase.length === 0) {
        console.error("Scenario database is empty or not loaded.");
        return null;
    }

    if (!data) {
        console.error("No data provided to matchScenario.");
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

