let model; // Variable globale pour stocker le modèle
const classesMapping = ['Castor', 'Chat', 'Chien', 'Coyote', 'Écureuil', 'Lapin', 'Loup','Lynx', 'Ours', 'Puma', 'Rat', 'Raton Laveur', 'Renard']; // les noms d'animaux pour chaque classe

// Fonction pour charger le modèle TensorFlow.js au démarrage
async function loadModel() {
    await tf.ready();  // Chargement su modèle pour que TensorFlow.js soit prêt
    // Chargement du modèle TensorFlow.js depuis le dossier tfjs_model
    model = await tf.loadLayersModel('tfjs_model/model.json');
}

// Fonction pour traiter une image lorsqu'elle est sélectionnée
async function processImage() {
    const empreinteInput = document.getElementById('empreinteInput');
    const resultSection = document.getElementById('result');

    const file = empreinteInput.files[0];

    if (file) {
        // Fonction pour charger l'image en tant que tenseur
        async function loadImageTensor(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = async function () {
                    const image = new Image();

                    // Attente pour que l'image soit chargée
                    image.onload = function () {
                        // Prétraitement de l'image
                        const tensor = tf.browser.fromPixels(image)
                            .resizeNearestNeighbor([224, 224])
                            .expandDims()
                            .toFloat()
                            .div(tf.scalar(255));

                        resolve(tensor);
                    };

                    image.onerror = function () {
                        reject(new Error("Erreur lors du chargement de l'image."));
                    };

                    image.src = reader.result;
                };

                reader.onerror = function () {
                    reject(new Error("Erreur lors de la lecture de l'image."));
                };

                reader.readAsDataURL(file);
            });
        }

        // la prédiction avec le modèle
        const imgTensor = await loadImageTensor(file);
        const predictions = await model.predict(imgTensor).data();
        const predictedClass = predictions.indexOf(Math.max(...predictions));

        // Affichage des résultats
        displayResults(predictedClass);
    } else {
        resultSection.innerHTML = "<p>Veuillez sélectionner une image valide.</p>";
    }
}

// Fonction pour afficher les résultats de la prédiction
function displayResults(predictedClass) {
    const resultSection = document.getElementById('result');
    const animalName = classesMapping[predictedClass];

    if (animalName) {
        resultSection.innerHTML = `<p>Animal identifié : ${animalName}</p>`;
    } else {
        resultSection.innerHTML = "<p>Animal non reconnu.</p>";
    }
    // 
}

function openCamera() {
    const video = document.getElementById('video');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.style.display = "block"; 
            })
            .catch(function(error) {
                console.error("Erreur lors de l'accès à la caméra : ", error);
            });
    } else {
        alert("Votre navigateur ne supporte pas l'accès à la caméra.");
    }
}


// Fonction pour capturer une photo
function capturePhoto() {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const video = document.getElementById('video');

    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');

    console.log(imageDataUrl);

}

// Fonction appelée lors du chargement du script
function onMainScriptLoad() {
    // 
}

// Appel de la fonction pour charger le modèle au démarrage
loadModel();
