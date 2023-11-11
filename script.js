const recordBtn = document.querySelector(".record"),
    result = document.querySelector(".result"),
    downloadBtn = document.querySelector(".download"),
    languageSelect = document.querySelector("#language"),
    clearBtn = document.querySelector(".clear");

function populatelanguage() {
    languages.forEach((lang) => {
        const option = document.createElement("option");
        option.value = lang.code;
        option.innerHTML = lang.name;
        languageSelect.appendChild(option);
    });
}
populatelanguage();

let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition,
    recognition,
    recording = false;

function speechToText() {
    try {
        recognition = new speechRecognition();
        recognition.lang = languageSelect.value
        recognition.interimResult = true;//The interimResults property of the SpeechRecognition interface controls whether interim results should be returned (true) or not (false.)

        recordBtn.classList.add("recording");
        recordBtn.querySelector("p").innerHTML = "listening...";
        recognition.start();
        recognition.onresult = (event) => {

            const speechResult = event.results[0][0].transcript;//The transcript read-only property of the SpeechRecognitionResult interface returns a string containing the transcript of the recognized word(s).

            //if result is interim show in p else as it is in result
            if (event.results[0].isFinal) {
                result.innerHTML += " " + speechResult;
                result.querySelector("p").remove;
            } else {
                // interim p not exist create one
                if (!document.querySelector(".interim")) {
                    const interim = document.createElement("p");
                    interim.classList.add("interim");
                    result.appendChild(interim);
                }// after that change inner html

                document.querySelector(".interim").innerHTML = " " + speechResult;
            }//something is wriitten in result let enabal download btn
            downloadBtn.disabled = false;
        };
        recognition.onspeechend = () => {
            //on speech end again call the fuction to continously listen
            speechToText();
        }
        recognition.onerror = (event) => {
            alert("Error Occured :" + event.error);
        }
    } catch (error) {
        recording = false;
        console.log(error);
    }
}

recordBtn.addEventListener("click", () => {
    if (!recording) {
        speechToText();
        recording = true;
    } else {
        stopRecording();
    }
});

function stopRecording() {
    recognition.stop();
    recordBtn.querySelector("p").innerHTML = "Start listening"
    recordBtn.classList.remove("recording");
    recording = false;
}

function download() {
    const text = result.innerHTML;
    const filename = "speech.txt";

    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

downloadBtn.addEventListener("click", download);
clearBtn.addEventListener("click", () => {
    result.innerHTML = "";
    downloadBtn.disabled = true;
})