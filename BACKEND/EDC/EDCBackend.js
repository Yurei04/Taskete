const output = document.getElementById("output");
const info = document.getElementById("info");
let transcribedData = "";
const bodyParts = ["head", "neck", "chest", "abdomen","right-shoulder", "right-arm", "right-hand", "right-leg", "right-foot","left-shoulder", "left-arm", "left-hand", "left-leg", "left-foot"];
let injuryDatabase = [];
let aidDatabase = [];
let scenarioDatabase = [];

function record() {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
    
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.start();
        output.textContent = "Recording... Please speak into the microphone.";
    
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            transcribedData = transcript;
            console.log("Transcript: ", transcript);
            output.textContent = `Recorded: "${transcript}"`; //REMOVE LATER
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
}

async function processTranscription(data) {
    console.log("Processing Transcription: ", data);
    identifyScenario()
    
}

async function loadDatabase() {
    try {
        const injuryResponse = await fetch("/BACKEND/DATABASE/injury.json");
        if (!injuryResponse.ok) throw new Error(`Failed to load injury.json: ${injuryResponse.status}`);
        injuryDatabase = await injuryResponse.json();

        const aidResponse = await fetch("/BACKEND/DATABASE/injury.json");
        if (!aidResponse.ok) throw new Error(`Failed to load aid.json: ${aidResponse.status}`);
        aidDatabase = await aidResponse.json();

        const scenarioResponse = await fetch("/BACKEND/DATABASE/injury.json");
        if (!scenarioResponse.ok) throw new Error(`Failed to load scenario.json: ${scenarioResponse.status}`);
        scenarioDatabase = await scenarioResponse.json();

        console.log("Databases loaded successfully!");
    } catch (error) {
        console.error("Error Loading Database: ", error);
    }
}


function identifyScenario(scenario) {

}

function identifyInjuries(detectedParts) {

}

function getAidForInjuries(injuries) {

}

function checkBodyParts(data) {
    
}

function extractPersonalDetails(PersonalData) {

}

function highlightInjuredParts(detectedBodyParts) {
    
}
