document.addEventListener('DOMContentLoaded', () => {
    // Current step in the journey, starting from 0 (for the new intro screen)
    let currentStep = 0;
    // Total number of steps for the progress bar calculation (0 to 8 = 9 main steps, with intermediate steps)
    // Total logical steps: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8
    // This makes 16 distinct steps, so totalSteps should be 16 for accurate progress bar
    const totalSteps = 16; 

    // Quiz 6 (formerly Quiz 5) answers for the "Who do you love most" quiz
    let quiz6Answers = new Set();
    const quiz6CorrectAnswers = new Set(['1', '2', '3', '4']);

    // Map of step IDs to their corresponding DOM elements
    const steps = {
        0: document.getElementById('step-0'),     // Happy GF Day
        0.5: document.getElementById('step-0-5'), // Late Wish
        1: document.getElementById('step-1'),     // Food Quiz
        1.5: document.getElementById('step-1-5'), // Memory Lane
        2: document.getElementById('step-2'),     // Princess Quiz
        2.5: document.getElementById('step-2-5'), // Love Language Challenge
        3: document.getElementById('step-3'),     // Video 1
        3.5: document.getElementById('step-3-5'), // Quirks & Charms
        4: document.getElementById('step-4'),     // Love Language Quiz (Original)
        4.5: document.getElementById('step-4-5'), // Dream Board
        5: document.getElementById('step-5'),     // Unicorn Quiz
        5.5: document.getElementById('step-5-5'), // Why I Love You
        6: document.getElementById('step-6'),     // Final Love Quiz
        6.5: document.getElementById('step-6-5'), // Promise Wall
        7: document.getElementById('step-7'),     // Video 2
        8: document.getElementById('step-8'),     // Final Message
    };

    // Preloader and main app elements
    const preloader = document.getElementById('preloader');
    const app = document.getElementById('app');
    const progressBar = document.getElementById('progress');

    // Audio elements
    const audioClick1 = document.getElementById('audio-click-1');
    const audioClick2 = document.getElementById('audio-click-2');
    const audioSuccess = document.getElementById('audio-success');
    const audioError = document.getElementById('audio-error');
    const audioFlip = document.getElementById('audio-flip');

    // Function to play sound
    function playSound(audioElement) {
        if (audioElement) {
            audioElement.currentTime = 0; // Rewind to start
            audioElement.play().catch(e => console.log("Audio play failed:", e)); // Catch potential autoplay errors
        }
    }

    // --- Preloader Logic ---
    function hidePreloader() {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                app.classList.remove('hidden-app');
                showStep(0);
            }, 500);
        } else {
            app.classList.remove('hidden-app');
            showStep(0);
        }
    }

    window.addEventListener('load', hidePreloader);
    setTimeout(() => {
        if (preloader.style.display !== 'none') {
            console.warn("Preloader fallback activated. Assets might not be fully loaded.");
            hidePreloader();
        }
    }, 5000);


    /**
     * Updates the width of the progress bar based on the current step.
     */
    function updateProgress() {
        let progressIndex = 0;
        if (currentStep === 0) progressIndex = 0;
        else if (currentStep === 0.5) progressIndex = 1;
        else if (currentStep === 1) progressIndex = 2;
        else if (currentStep === 1.5) progressIndex = 3;
        else if (currentStep === 2) progressIndex = 4;
        else if (currentStep === 2.5) progressIndex = 5;
        else if (currentStep === 3) progressIndex = 6;
        else if (currentStep === 3.5) progressIndex = 7;
        else if (currentStep === 4) progressIndex = 8;
        else if (currentStep === 4.5) progressIndex = 9;
        else if (currentStep === 5) progressIndex = 10;
        else if (currentStep === 5.5) progressIndex = 11;
        else if (currentStep === 6) progressIndex = 12;
        else if (currentStep === 6.5) progressIndex = 13;
        else if (currentStep === 7) progressIndex = 14;
        else if (currentStep === 8) progressIndex = 15;

        const progressPercentage = (progressIndex / totalSteps) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    /**
     * Hides all steps and shows only the specified step.
     * Updates the current step and progress bar.
     * @param {number} stepNumber - The number of the step to show.
     */
    function showStep(stepNumber) {
        Object.values(steps).forEach(step => {
            if (step) step.classList.add('hidden');
        });
        if (steps[stepNumber]) {
            steps[stepNumber].classList.remove('hidden');
        }
        currentStep = stepNumber;
        updateProgress();

        if (stepNumber === 3) {
            const video1 = document.getElementById('video-1');
            if (video1) video1.play();
        } else if (stepNumber === 7) {
            const video2 = document.getElementById('video-2');
            if (video2) video2.play();
        } else if (stepNumber === 6.5) { // Promise Wall step
            promisesShown = 0;
            const promiseWall = document.querySelector('.promise-wall');
            if (promiseWall) promiseWall.innerHTML = '';
            // The showPromisesButton will trigger showNextPromise
        }
    }

    // --- NEW Step 0: Initial Greeting & Late Wish Logic ---
    const initialHeart = document.getElementById('initial-heart');
    const startAdventureButton = document.getElementById('start-adventure-button');

    initialHeart.addEventListener('click', () => {
        playSound(audioClick1); // Play click sound
        steps[0].querySelector('.step-content-wrapper').classList.add('hidden');
        setTimeout(() => {
            showStep(0.5);
        }, 500);
    });

    startAdventureButton.addEventListener('click', () => {
        playSound(audioClick2); // Play click sound
        showStep(1);
    });


    // --- Quiz Logic Implementations (Adjusted Step Numbers) ---

    // Step 1: Food Quiz Logic
    document.querySelectorAll('.food-quiz .quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img.dataset.answer === 'correct') {
                playSound(audioSuccess); // Play success sound
                card.classList.add('correct-sparkle');
                setTimeout(() => showStep(1.5), 1000);
            } else {
                playSound(audioError); // Play error sound
                displayMessage('Oops! Not quite. Try again!');
                card.classList.add('selected');
                setTimeout(() => card.classList.remove('selected'), 500);
            }
        });
    });

    // NEW Step 1.5: Our Memory Lane Logic (Flip Cards)
    const nextMemoryStepButton = document.getElementById('next-memory-step');
    let flippedMemoryCards = 0;
    const totalMemoryCards = document.querySelectorAll('#step-1-5 .flip-card').length;

    document.querySelectorAll('#step-1-5 .flip-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('flipped')) {
                playSound(audioFlip); // Play flip sound
                card.classList.add('flipped');
                flippedMemoryCards++;
                if (flippedMemoryCards === totalMemoryCards) {
                    displayMessage('All memories unlocked! So many good times!');
                    nextMemoryStepButton.classList.remove('hidden');
                }
            }
        });
    });

    nextMemoryStepButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(2);
    });


    // Step 2: Rapunzel Quiz Logic (Text Input)
    document.getElementById('rapunzel-submit').addEventListener('click', () => {
        playSound(audioClick1);
        const answer = document.getElementById('rapunzel-answer').value.trim().toLowerCase();
        if (answer === 'rapunzel') {
            playSound(audioSuccess);
            document.getElementById('princess-quiz-2').classList.remove('hidden');
            displayMessage('That\'s right! She\'s your Rapunzel!');
        } else {
            playSound(audioError);
            displayMessage('That\'s not the special name! Try again.');
        }
    });

    // Step 2: Princess Quiz Logic (Image Selection)
    document.querySelectorAll('.princess-quiz .quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img.dataset.answer === 'correct') {
                playSound(audioSuccess);
                card.classList.add('correct-sparkle');
                setTimeout(() => showStep(2.5), 1000);
            } else {
                playSound(audioError);
                displayMessage('Wrong princess! Try again.');
                card.classList.add('selected');
                setTimeout(() => card.classList.remove('selected'), 500);
            }
        });
    });

    // NEW Step 2.5: Love Language Challenge (Drag & Drop)
    const draggableIcons = document.querySelectorAll('.draggable-icon');
    const dropTargets = document.querySelectorAll('.drop-target');
    const loveLanguageContinueButton = document.getElementById('love-language-continue');
    let matchedPairs = 0;
    const requiredMatches = dropTargets.length;

    draggableIcons.forEach(icon => {
        icon.setAttribute('draggable', true);
        icon.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.lang);
            e.target.classList.add('dragging');
        });
        icon.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropTargets.forEach(target => {
        target.addEventListener('dragover', (e) => {
            e.preventDefault();
            target.classList.add('hovered');
        });
        target.addEventListener('dragleave', (e) => {
            target.classList.remove('hovered');
        });
        target.addEventListener('drop', (e) => {
            e.preventDefault();
            target.classList.remove('hovered');
            const draggedLang = e.dataTransfer.getData('text/plain');
            const targetLang = target.dataset.target;

            const draggedIconElement = document.querySelector(`.draggable-icon[data-lang="${draggedLang}"]`);

            if (draggedLang === targetLang) {
                if (draggedIconElement && !target.classList.contains('correct')) {
                    playSound(audioSuccess);
                    target.classList.add('correct');
                    target.textContent = draggedIconElement.querySelector('span').textContent;
                    draggedIconElement.style.display = 'none';
                    matchedPairs++;
                    if (matchedPairs === requiredMatches) {
                        displayMessage('All matched! You know our languages!');
                        loveLanguageContinueButton.classList.remove('hidden');
                    }
                }
            } else {
                playSound(audioError);
                displayMessage('Oops! That\'s not a match. Try again!');
            }
        });
    });

    loveLanguageContinueButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(3);
    });


    // Step 3: Video 1 End Listener
    document.getElementById('video-1').addEventListener('ended', () => {
        showStep(3.5);
    });

    // NEW Step 3.5: Quirks & Charms (Flip Cards)
    const quirksContinueButton = document.getElementById('quirks-continue');
    let flippedQuirkCards = 0;
    const totalQuirkCards = document.querySelectorAll('#step-3-5 .flip-card').length;

    document.querySelectorAll('#step-3-5 .flip-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('flipped')) {
                playSound(audioFlip);
                card.classList.add('flipped');
                flippedQuirkCards++;
                if (flippedQuirkCards === totalQuirkCards) {
                    displayMessage('All charms revealed! You\'re amazing!');
                    quirksContinueButton.classList.remove('hidden');
                }
            }
        });
    });

    quirksContinueButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(4);
    });


    // Step 4: Love Language Quiz Logic
    document.querySelectorAll('.love-language-quiz .quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img.dataset.answer === 'correct') {
                playSound(audioSuccess);
                card.classList.add('correct-sparkle');
                setTimeout(() => showStep(4.5), 1000);
            } else {
                playSound(audioError);
                displayMessage('Nope, that\'s not it. You know the right one!');
                card.classList.add('selected');
                setTimeout(() => card.classList.remove('selected'), 500);
            }
        });
    });

    // NEW Step 4.5: Our Dream Board (Interactive Map with Image Reveal & Timer)
    const dreamImageWrapper = document.getElementById('dream-image-wrapper'); // The new wrapper div
    const dreamImageDisplay = document.getElementById('dream-image-display'); // The actual image
    const dreamCaption = document.getElementById('dream-caption');
    const dreamsContinueButton = document.getElementById('dreams-continue');
    let revealedDreamPoints = new Set(); // Use a Set to track unique revealed dreams
    const totalDreamPoints = document.querySelectorAll('.dream-point').length;
    let hideImageTimeout; // To store the timeout ID for hiding the image

    document.querySelectorAll('.dream-point').forEach(point => {
        point.addEventListener('click', () => {
            // Clear any existing hide timer and hide current image immediately
            clearTimeout(hideImageTimeout);
            dreamImageWrapper.classList.add('hidden'); // Ensure wrapper is hidden before showing new one
            dreamImageWrapper.classList.remove('show', 'hide-animation'); // Remove any lingering animation classes

            // Play click sound for revealing dream
            playSound(audioClick1); 
            
            // Mark point as revealed (visually, and for tracking completion)
            point.classList.add('revealed'); 
            
            // Update caption
            dreamCaption.textContent = point.dataset.dream;
            
            // Set the image source and show it
            dreamImageDisplay.src = `assets/${point.dataset.image}`;
            dreamImageWrapper.classList.remove('hidden'); // Show wrapper
            dreamImageWrapper.classList.add('show'); // Trigger pop-in animation

            revealedDreamPoints.add(point.dataset.image); // Add image filename to set of revealed dreams

            // Set a new timer to hide the image after 3 seconds with sinking animation
            hideImageTimeout = setTimeout(() => {
                dreamImageWrapper.classList.remove('show'); // Remove show class
                dreamImageWrapper.classList.add('hide-animation'); // Trigger sinking animation
                
                // Listen for the end of the hide-animation to fully hide the element
                dreamImageWrapper.addEventListener('animationend', function handler() {
                    dreamImageWrapper.classList.add('hidden'); // Fully hide after animation
                    dreamImageWrapper.classList.remove('hide-animation'); // Clean up class
                    dreamImageWrapper.removeEventListener('animationend', handler); // Remove listener
                }, { once: true }); // Ensure listener runs only once
            }, 3000); // Image visible for 3 seconds

            // Check if all unique dreams have been revealed
            if (revealedDreamPoints.size === totalDreamPoints) { 
                displayMessage('All dreams revealed! Let\'s make them happen!');
                dreamsContinueButton.classList.remove('hidden'); // Show the continue button
            }
        });
    });

    dreamsContinueButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(5);
    });


    // Step 5: Unicorn Quiz Logic
    document.querySelectorAll('.unicorn-quiz .quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            if (img.dataset.answer === 'correct') {
                playSound(audioSuccess);
                card.classList.add('correct-sparkle');
                setTimeout(() => showStep(5.5), 1000);
            } else {
                playSound(audioError);
                displayMessage('My unicorn friend thinks you should try again!');
                card.classList.add('selected');
                setTimeout(() => card.classList.remove('selected'), 500);
            }
        });
    });

    // NEW Step 5.5: Why I Love You (Dynamic Compliment Generator)
    const loveReasons = [
        "Your infectious laugh that brightens my every day.",
        "The way you always know what I'm thinking, even before I do.",
        "Your incredible kindness and compassion for everyone around you.",
        "Your adorable chubby cheeks that I just want to squish!",
        "The way you make even the most mundane moments feel like an adventure.",
        "Your unwavering support and belief in me, no matter what.",
        "The way you light up a room just by being yourself.",
        "Your playful spirit and the way you make me feel like a kid again.",
        "Your strength and resilience in facing any challenge.",
        "The comfort I feel just being quiet with you.",
        "Your beautiful heart that loves so deeply.",
        "You're my favorite human in the entire universe!",
        "The way you bite my arm... it's just so you!",
        "Your passion for flowers and all things beautiful.",
        "The sparkle in your eyes when you talk about something you love.",
        "You're the best cuddle buddy a guy could ask for.",
        "You're my perfect match, my Pawani."
    ];
    let lastReasonIndex = -1;
    const generateLoveReasonButton = document.getElementById('generate-love-reason');
    const loveReasonDisplay = document.getElementById('love-reason-display');
    const loveReasonContinueButton = document.getElementById('love-reason-continue');

    generateLoveReasonButton.addEventListener('click', () => {
        playSound(audioClick1);
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * loveReasons.length);
        } while (randomIndex === lastReasonIndex && loveReasons.length > 1);
        lastReasonIndex = randomIndex;

        loveReasonDisplay.textContent = loveReasons[randomIndex];
        loveReasonDisplay.classList.remove('hidden');
        loveReasonDisplay.style.animation = 'none';
        void loveReasonDisplay.offsetWidth;
        loveReasonDisplay.style.animation = '';
        loveReasonContinueButton.classList.remove('hidden');
    });

    loveReasonContinueButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(6);
    });


    // Step 6: Final Love Quiz Logic (Multi-select)
    document.querySelectorAll('.final-love-quiz .quiz-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            const answer = img.dataset.answer;

            if (quiz6Answers.has(answer)) {
                quiz6Answers.delete(answer);
                card.classList.remove('selected');
            } else {
                quiz6Answers.add(answer);
                card.classList.add('selected');
            }

            if (quiz6Answers.size === quiz6CorrectAnswers.size &&
                [...quiz6Answers].every(ans => quiz6CorrectAnswers.has(ans))) {
                playSound(audioSuccess);
                setTimeout(() => showStep(6.5), 1000);
            }
        });
    });

    // NEW Step 6.5: The Promise Wall (Animated "Post-it" Notes)
    const promises = [
        "I promise to always make you laugh, even when you don't want to.",
        "I promise to cherish every playful bite and every warm hug.",
        "I promise to always be your biggest fan and support your dreams.",
        "I promise to explore new places with you, near or far.",
        "I promise to always keep our love story magical, just like a unicorn's tale.",
        "I promise to cook for you (and try not to burn anything!).",
        "I promise to always find the comfiest spot for us to cuddle.",
        "I promise to love you more with each passing day, my Pawani."
    ];
    const promiseWall = document.querySelector('.promise-wall');
    const promisesContinueButton = document.getElementById('promises-continue');
    const showPromisesButton = document.getElementById('show-promises-button');
    let promisesShown = 0;
    let promiseInterval;

    function showNextPromise() {
        if (promisesShown < promises.length) {
            const note = document.createElement('div');
            note.classList.add('promise-note');
            note.textContent = promises[promisesShown];

            const topPos = Math.random() * 70 + 10;
            const leftPos = Math.random() * 70 + 10;
            const rotation = Math.random() * 20 - 10;

            note.style.top = `${topPos}%`;
            note.style.left = `${leftPos}%`;
            note.style.transform = `scale(0.8) rotate(${rotation}deg)`;
            note.style.animationDelay = `${promisesShown * 0.1}s`;

            promiseWall.appendChild(note);
            promisesShown++;
            playSound(audioClick1); // Play sound for each note appearing

        } else {
            clearInterval(promiseInterval);
            promisesContinueButton.classList.remove('hidden');
            displayMessage('All my promises to you!');
        }
    }

    showPromisesButton.addEventListener('click', () => {
        playSound(audioClick2);
        showPromisesButton.classList.add('hidden');
        promiseInterval = setInterval(showNextPromise, 700);
        showNextPromise();
    });

    promisesContinueButton.addEventListener('click', () => {
        playSound(audioClick2);
        showStep(7);
    });


    // Step 7: Video 2 End Listener
    document.getElementById('video-2').addEventListener('ended', () => {
        showStep(8);
    });

    /**
     * Custom message display function (replaces alert() for better UX)
     * Creates a temporary message div that fades in and out.
     * @param {string} message - The message to display.
     */
    function displayMessage(message) {
        const appContainer = document.getElementById('app');
        let msgDiv = appContainer.querySelector('.temp-message');
        if (!msgDiv) {
            msgDiv = document.createElement('div');
            msgDiv.classList.add('temp-message');
            appContainer.appendChild(msgDiv);
        }
        msgDiv.textContent = message;
        msgDiv.style.cssText = `
            position: absolute;
            bottom: 40px; /* Higher position */
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-pink); /* Pink background */
            color: var(--white);
            padding: 15px 30px; /* More padding */
            border-radius: var(--border-radius-md);
            z-index: 100; /* Ensure it's on top */
            opacity: 0;
            transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
            font-size: 18px; /* Larger font */
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); /* Stronger shadow */
            white-space: nowrap; /* Prevent text wrapping */
        `;
        // Fade in and then fade out
        setTimeout(() => {
            msgDiv.style.opacity = '1';
        }, 10); // Small delay to ensure transition works
        setTimeout(() => {
            msgDiv.style.opacity = '0';
            // Remove after fade out to clean up DOM
            setTimeout(() => msgDiv.remove(), 500);
        }, 2000); // Message visible for 2 seconds
    }

    // Tone.js setup (uncomment to enable sounds)
    // Tone.start(); // Must be called after a user gesture (e.g., first click)
    // You might want to add Tone.start() on the very first user interaction
    // For example, on the initial heart click:
    // initialHeart.addEventListener('click', () => { Tone.start(); playSound(audioClick1); ... });
});