
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

// soundArray
const sound = [];
sound[0] = new Audio("sound/piano_B.wav");
sound[1] = new Audio("sound/hihat_Acoustic.wav");
sound[2] = new Audio("sound/kick_Plain.wav");
sound[3] = new Audio("sound/kick_Tight.wav");
sound[4] = new Audio("sound/piano_E.wav");
sound[5] = new Audio("sound/snare_Noise.wav");

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.drawImage(
    //     results.image, 0, 0, canvasElement.width, canvasElement.height);
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                { color: '#0000FF', lineWidth: 5 });
            drawLandmarks(canvasCtx, landmarks, { color: '#00FF00', lineWidth: 2 })

            //   Thumb finger
            let diffThumbX = landmarks[5].x - landmarks[4].x
            let diffThumbY = landmarks[5].y - landmarks[4].y
            let totalThumbDiff = Math.abs(diffThumbX) + Math.abs(diffThumbY);

            //   Index finger 
            let diffIndexX = landmarks[5].x - landmarks[8].x
            let diffIndexY = landmarks[5].y - landmarks[8].y
            let totalIndexDiff = Math.abs(diffIndexX) + Math.abs(diffIndexY);

            //   Middle finger 
            let diffMiddleX = landmarks[9].x - landmarks[12].x
            let diffMiddleY = landmarks[9].y - landmarks[12].y
            let totalMiddleDiff = Math.abs(diffMiddleX) + Math.abs(diffMiddleY);

            //   Ring finger 
            let diffRingX = landmarks[13].x - landmarks[16].x
            let diffRingY = landmarks[13].y - landmarks[16].y
            let totalRingDiff = Math.abs(diffRingX) + Math.abs(diffRingY);

            // Pinky finger 
            let diffPinkyX = landmarks[17].x - landmarks[20].x
            let diffPinkyY = landmarks[17].y - landmarks[20].y
            let totalPinkyDiff = Math.abs(diffPinkyX) + Math.abs(diffPinkyY);



            //   handGestures
            // Peace sign
                if (totalIndexDiff > 0.2 && totalMiddleDiff > 0.2) {
                    if (totalPinkyDiff < 0.2 && totalThumbDiff < 0.2 && totalRingDiff < 0.2) {
                    console.log("Peace");
                    sound[0].play();
                }
            }

            // L- Sign 
            if (totalThumbDiff > 0.2 && totalIndexDiff > 0.2) {
                if ((totalPinkyDiff < 0.2 && totalMiddleDiff < 0.2 && totalRingDiff < 0.2)) {
                    console.log("Live");
                    sound[1].play();
                    // } else {
                    //   console.log("Test");
                    //   sound[2].play();
                    // }
                // }
                }
            }

            // ThumbsUp 
            if (totalThumbDiff > 0.2) {
                if (totalPinkyDiff < 0.2 && totalIndexDiff < 0.2 && totalMiddleDiff < 0.2 && totalRingDiff < 0.2)  {
                    console.log("ThumbsUp!");
                    sound[2].play();
                }
            }

            // IndexUp 
            if (totalIndexDiff > 0.2) {
                if (totalThumbDiff < 0.2 && totalMiddleDiff < 0.2 && totalRingDiff < 0.2 && totalPinkyDiff < 0.2)  {
                    console.log("Hey You!");
                    sound[3].play();
                }
            }
            
            // rockGesture 
            if (totalIndexDiff > 0.2 && totalPinkyDiff > 0.2) {
                if (totalThumbDiff < 0.2 && totalMiddleDiff < 0.2 && totalRingDiff < 0.2) {
                    console.log("You Rock!");
                     sound[4].play();
                }
            }

             // PinkySwear
             if (totalPinkyDiff > 0.2) {
                if (totalThumbDiff < 0.2 && totalIndexDiff < 0.2 && totalMiddleDiff < 0.2 && totalRingDiff < 0.2) {
                    console.log("PinkyPromise..");
                     sound[5].play();
                }
            }

        }
    }
    canvasCtx.restore();
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);
console.log(hands);
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

camera.start()

