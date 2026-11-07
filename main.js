const video = document.getElementById('video');
const faceCropCanvas = document.getElementById('face-crop-canvas');
const videoContainer = document.getElementById('video-container');

async function loadModels() {
    const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
    
    console.log("Đang tải models...");
    try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("Model đã tải thành công!");
        startVideo();
    } catch (error) {
        console.error("Lỗi không tải được Model: ", error);
        alert("Không thể tải Model AI. Hãy kiểm tra kết nối internet hoặc link MODEL_URL.");
    }
}
function startVideo() {
    navigator.mediaDevices.getUserMedia({ video: {} })
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(err => {
            console.error("Lỗi truy cập Camera: ", err);
            alert("Trình duyệt bị chặn camera rồi bạn ơi!");
        });
}

video.addEventListener('play', () => {
    
    const canvas = faceapi.createCanvasFromMedia(video);
    videoContainer.append(canvas);
    
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);


    setInterval(async () => {
    
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions());
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        faceapi.draw.drawDetections(canvas, resizedDetections);
        if (resizedDetections.length > 0) {
            const box = resizedDetections[0].box;
            drawCroppedFace(box);
        }
    }, 100);
});


function drawCroppedFace(box) {
    const ctx = faceCropCanvas.getContext('2d');
    
   
    const cropSize = 250;
    faceCropCanvas.width = cropSize;
    faceCropCanvas.height = cropSize;

    
    ctx.drawImage(
        video, 
        box.x, box.y, box.width, box.height, 
        0, 0, cropSize, cropSize
    );
}

loadModels();