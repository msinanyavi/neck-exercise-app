// Egzersiz verilerini doğrudan tanımla
const exercises = [
  {
    id: 1,
    name: "Boyun Rotasyonu",
    description: "Başınızı yavaşça sağa ve sola çevirin.",
    gifUrl: "assets/gifs/boyun-rotasyonu.gif",
    duration: 30, // saniye cinsinden
    sets: 3,
    restTime: 20 // dinlenme süresi (saniye)
  },
  {
    id: 2,
    name: "Çene Geri Çekme",
    description: "Çenenizi içeri çekin ve başınızı düz tutun. 2 saniye tutun ve bırakın.",
    gifUrl: "assets/gifs/cene-geri-cekme.gif",
    duration: 30,
    sets: 3,
    restTime: 20
  },
  {
    id: 3,
    name: "Boyun Yan Esneme",
    description: "Başınızı yavaşça sağa ve sola eğin. Her yönde 3 saniye tutun.",
    gifUrl: "assets/gifs/boyun-yan-esneme.gif",
    duration: 30,
    sets: 2,
    restTime: 25
  },
  {
    id: 4,
    name: "Omuz Silkme",
    description: "Omuzlarınızı kulaklarınıza doğru kaldırın, 3 saniye tutun ve bırakın.",
    gifUrl: "assets/gifs/omuz-silkme.gif",
    duration: 30,
    sets: 3,
    restTime: 20
  },
  {
    id: 5,
    name: "Boyun Geri Hareket Ettirme",
    description: "Boynunuzu geri yönde hareket ettirin.",
    gifUrl: "assets/gifs/boyun-geri.gif",
    duration: 40,
    sets: 2,
    restTime: 30
  },
  {
    id: 6,
    name: "Boyun İleri-Geri Esneme",
    description: "Başınızı nazikçe öne ve arkaya eğin. Her pozisyonda 2 saniye tutun.",
    gifUrl: "assets/gifs/boyun-ileri-geri.gif",
    duration: 30,
    sets: 3,
    restTime: 25
  }
];

// Kalan set sayılarını saklamak için bir dizi
const remainingSets = exercises.map(ex => ex.sets);

// DOM elementleri
let currentExerciseIndex = 0;
let timer = null;
let timeRemaining = 0;
let isRunning = false;
let isRestMode = false; // Dinlenme modu için

// Zamanı formatla (saniye -> mm:ss)
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Uygulamayı render et
function renderApp() {
  const root = document.getElementById('root');
  const currentExercise = exercises[currentExerciseIndex];
  const currentRemainingSets = remainingSets[currentExerciseIndex];
  
  root.innerHTML = `
    <h1 class="app-title">Boyun Egzersiz Uygulaması</h1>
    <div class="exercise-container">
      <div class="gif-container">
        <img src="${currentExercise.gifUrl}" alt="${currentExercise.name}" />
      </div>
      
      <div class="exercise-details">
        <h2>${currentExercise.name}</h2>
        <p>${currentExercise.description}</p>
      </div>
      
      <div class="exercise-info">
        <div class="set-container">
          <p>Set: <span class="set-counter">${currentRemainingSets}</span> / ${currentExercise.sets}</p>
        </div>
        <div class="timer-section">
          <p>${isRestMode ? "Dinlenme Süresi:" : "Süre:"} 
            <span class="timer-display" id="timer-display">
              ${formatTime(timeRemaining > 0 ? timeRemaining : (isRestMode ? currentExercise.restTime : currentExercise.duration))}
            </span>
          </p>
          ${isRestMode ? '<p class="rest-note">Her set sonrası dinlenme süresi</p>' : ''}
        </div>
      </div>
      
      <div class="controls">
        <button id="prev-btn" class="prev-button" ${currentExerciseIndex === 0 ? 'disabled' : ''}>Önceki</button>
        <button id="start-pause-btn" class="${isRestMode ? 'rest-button' : 'start-button'}">
          ${isRestMode ? 'Molayı Başlat' : 'Başlat'}
        </button>
        <button id="next-btn" class="next-button" ${currentExerciseIndex === exercises.length - 1 ? 'disabled' : ''}>Sonraki</button>
      </div>
      
      <div class="progress-indicator">
        ${exercises.map((_, idx) => `
          <div class="progress-dot ${idx === currentExerciseIndex ? 'active-dot' : ''}"></div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Event listener'ları ekle
  document.getElementById('prev-btn').addEventListener('click', previousExercise);
  document.getElementById('next-btn').addEventListener('click', confirmNextExercise);
  document.getElementById('start-pause-btn').addEventListener('click', toggleStartPause);
}

// Sonraki egzersiz için onay iste
function confirmNextExercise() {
  // Popup oluşturma
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Egzersizi Tamamladınız mı?</h2>
      <p>Bu egzersizi bitirdiğinizi onaylıyor musunuz?</p>
      <div class="modal-buttons">
        <button id="confirm-yes" class="confirm-button yes-button">Evet, Tamamladım</button>
        <button id="confirm-no" class="confirm-button no-button">Hayır, Devam Edeceğim</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Modal stilini ekle
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
    
    .confirm-button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .yes-button {
      background-color: #4CAF50;
      color: white;
    }
    
    .no-button {
      background-color: #f44336;
      color: white;
    }
    
    .confirm-button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
  
  // Event listeners ekle
  document.getElementById('confirm-yes').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
    moveToNextExercise();
  });
  
  document.getElementById('confirm-no').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
  });
}

// Sonraki egzersize geç
function moveToNextExercise() {
  if (currentExerciseIndex < exercises.length - 1) {
    currentExerciseIndex++;
    timeRemaining = 0;
    isRestMode = false;
    
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
    }
    
    renderApp();
  } else {
    // Son egzersiz bittiğinde kutlama mesajı göster
    showCompletionMessage();
  }
}

// Egzersiz tamamlandığında kutlama mesajı
function showCompletionMessage() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content completion-modal">
      <h2>Tebrikler!</h2>
      <p>Tüm egzersizleri başarıyla tamamladınız!</p>
      <div class="modal-buttons">
        <button id="restart-button" class="confirm-button yes-button">Başa Dön</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Modal stilini ekle
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      animation: modalFadeIn 0.3s ease;
    }
    
    .completion-modal {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    
    .completion-modal h2 {
      color: #4CAF50;
      font-size: 2rem;
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-buttons {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
  `;
  document.head.appendChild(style);
  
  // Event listener ekle
  document.getElementById('restart-button').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
    resetApp();
  });
}

// Uygulamayı sıfırla
function resetApp() {
  currentExerciseIndex = 0;
  timeRemaining = 0;
  isRestMode = false;
  isRunning = false;
  
  // Kalan set sayılarını sıfırla
  for (let i = 0; i < remainingSets.length; i++) {
    remainingSets[i] = exercises[i].sets;
  }
  
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  
  renderApp();
}

// Zamanlayıcıyı başlat
function startTimer() {
  const timerDisplay = document.getElementById('timer-display');
  const startPauseButton = document.getElementById('start-pause-btn');
  
  if (!timeRemaining) {
    timeRemaining = isRestMode ? exercises[currentExerciseIndex].restTime : exercises[currentExerciseIndex].duration;
  }
  
  isRunning = true;
  startPauseButton.textContent = 'Durdur';
  startPauseButton.className = isRestMode ? 'pause-rest-button' : 'pause-button';
  
  timer = setInterval(() => {
    timeRemaining--;
    timerDisplay.textContent = formatTime(timeRemaining);
    
    if (timeRemaining <= 0) {
      clearInterval(timer);
      isRunning = false;
      
      if (isRestMode) {
        // Dinlenme modundan egzersiz moduna geç
        isRestMode = false;
        timeRemaining = 0;
        renderApp();
      } else {
        // Set sayısını azalt
        decrementSet();
        
        // Egzersiz modundan dinlenme moduna geç (kalan set varsa)
        if (remainingSets[currentExerciseIndex] > 0) {
          isRestMode = true;
          timeRemaining = 0;
          renderApp();
        } else {
          // Tüm setler tamamlandı, sonraki egzersize geç
          confirmSetCompletion();
        }
      }
    }
  }, 1000);
}

// Set sayısını azalt
function decrementSet() {
  if (remainingSets[currentExerciseIndex] > 0) {
    remainingSets[currentExerciseIndex]--;
  }
}

// Tüm setler tamamlandığında onay
function confirmSetCompletion() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Set Tamamlandı!</h2>
      <p>Bu egzersizin tüm setleri tamamlandı. Sonraki egzersize geçmek istiyor musunuz?</p>
      <div class="modal-buttons">
        <button id="next-exercise-btn" class="confirm-button yes-button">Sonraki Egzersiz</button>
        <button id="repeat-exercise-btn" class="confirm-button no-button">Tekrar Et</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  
  // Modal stilini ekle
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px;
      max-width: 400px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      animation: modalFadeIn 0.3s ease;
    }
    
    @keyframes modalFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .modal-buttons {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
    }
    
    .confirm-button {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .yes-button {
      background-color: #4CAF50;
      color: white;
    }
    
    .no-button {
      background-color: #f44336;
      color: white;
    }
    
    .confirm-button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
  
  // Event listeners ekle
  document.getElementById('next-exercise-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
    moveToNextExercise();
  });
  
  document.getElementById('repeat-exercise-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
    
    // Set sayısını yeniden ayarla ve dinlenme modunu sıfırla
    remainingSets[currentExerciseIndex] = exercises[currentExerciseIndex].sets;
    isRestMode = false;
    timeRemaining = 0;
    renderApp();
  });
}

// Zamanlayıcıyı durdur
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  
  const startPauseButton = document.getElementById('start-pause-btn');
  startPauseButton.textContent = 'Devam';
  startPauseButton.className = isRestMode ? 'rest-button' : 'start-button';
}

// Başlat/Durdur düğmesi işlevi
function toggleStartPause() {
  if (isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

// Önceki egzersiz
function previousExercise() {
  if (currentExerciseIndex > 0) {
    currentExerciseIndex--;
    timeRemaining = 0;
    isRestMode = false;
    
    if (isRunning) {
      clearInterval(timer);
      isRunning = false;
    }
    
    renderApp();
  }
}

// Sayfa yüklendiğinde uygulamayı başlat
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});