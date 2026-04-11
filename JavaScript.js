const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mở webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    });

// Sau khi video chạy
video.addEventListener('play', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const faceDetector = new FaceDetector();

    setInterval(async () => {
        const faces = await faceDetector.detect(video);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        faces.forEach(face => {
            const { x, y, width, height } = face.boundingBox;

            // Vẽ khung mặt
            ctx.strokeStyle = "red";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);
        });

    }, 100);
});