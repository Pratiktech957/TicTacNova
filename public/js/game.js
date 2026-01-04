 class ModernTicTacToe {
            constructor() {
                this.board = Array(9).fill(null);
                this.currentPlayer = 'X';
                this.gameMode = 'player';
                this.aiDifficulty = 'medium';
                this.aiPersonality = 'friendly';
                this.gameOver = false;
                this.scores = { X: 0, O: 0, draws: 0 };
                this.isListening = false;
                this.recognition = null;
                this.synth = window.speechSynthesis;
                this.isAIThinking = false;
                this.darkMode = true;
                this.soundEnabled = true;
                this.musicEnabled = true;
                this.playerXName = 'Player X';
                this.playerOName = 'Player O';
                this.aiName = 'AI';
                this.moveHistory = [];
                this.powerUps = {
                    undo: 3,
                    swap: 1,
                    block: 1
                };
                
                this.winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                    [0, 4, 8], [2, 4, 6] // Diagonals
                ];

                this.init();
            }

            init() {
                this.showLoading();
                this.createParticles();
                this.setupEventListeners();
                this.setupVoiceRecognition();
                this.loadSettings();
                
                setTimeout(() => {
                    this.hideLoading();
                    this.speak("Welcome to the premium Tic Tac Toe experience!");
                    this.playSound('start');
                }, 2000);
            }

            showLoading() {
                document.getElementById('loading').style.display = 'flex';
            }

            hideLoading() {
                const loading = document.getElementById('loading');
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }

            createParticles() {
                const particlesContainer = document.getElementById('particles');
                
                for (let i = 0; i < 50; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 8 + 's';
                    particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
                    particlesContainer.appendChild(particle);
                }
            }

            setupEventListeners() {
                // Game mode buttons
                document.getElementById('vsPlayerBtn').addEventListener('click', () => {
                    this.setGameMode('player');
                });
                
                document.getElementById('vsAIBtn').addEventListener('click', () => {
                    this.setGameMode('ai');
                });

                // AI difficulty
                document.getElementById('aiDifficulty').addEventListener('change', (e) => {
                    this.aiDifficulty = e.target.value;
                    this.speak(`AI difficulty set to ${e.target.selectedOptions[0].text.split(' ')[1]}`);
                });
                
                // AI personality
                document.getElementById('aiPersonality').addEventListener('change', (e) => {
                    this.aiPersonality = e.target.value;
                    this.speak(`AI personality set to ${e.target.selectedOptions[0].text}`);
                });

                // Voice button
                document.getElementById('voiceBtn').addEventListener('click', () => {
                    this.toggleVoiceRecognition();
                });

                // Game control buttons
                document.getElementById('resetBtn').addEventListener('click', () => {
                    this.resetGame();
                });

                document.getElementById('newGameBtn').addEventListener('click', () => {
                    this.newGame();
                });

                // Theme button
                document.getElementById('themeBtn').addEventListener('click', () => {
                    this.toggleTheme();
                });
                
                // Language selector
                document.getElementById('languageSelect').addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
                
                // Sound controls
                document.getElementById('soundToggleBtn').addEventListener('click', () => {
                    this.toggleSound();
                });
                
                document.getElementById('musicToggleBtn').addEventListener('click', () => {
                    this.toggleMusic();
                });
                
                // Player names
                document.getElementById('saveNamesBtn').addEventListener('click', () => {
                    this.savePlayerNames();
                });
                
                // Power ups
                document.getElementById('undoPower').addEventListener('click', () => {
                    this.useUndoPower();
                });
                
                document.getElementById('swapPower').addEventListener('click', () => {
                    this.useSwapPower();
                });
                
                document.getElementById('blockPower').addEventListener('click', () => {
                    this.useBlockPower();
                });
                
                // Stats toggle
                document.getElementById('statsToggleBtn').addEventListener('click', () => {
                    this.toggleStats();
                });

                // Cell clicks
                document.querySelectorAll('.cell').forEach((cell, index) => {
                    cell.addEventListener('click', () => {
                        this.handleCellClick(index);
                    });
                });
            }
            
            loadSettings() {
                // Load player names from localStorage
                if (localStorage.getItem('playerXName')) {
                    this.playerXName = localStorage.getItem('playerXName');
                    document.getElementById('playerXName').value = this.playerXName;
                }
                
                if (localStorage.getItem('playerOName')) {
                    this.playerOName = localStorage.getItem('playerOName');
                    document.getElementById('playerOName').value = this.playerOName;
                }
                
                // Load sound settings
                if (localStorage.getItem('soundEnabled') !== null) {
                    this.soundEnabled = localStorage.getItem('soundEnabled') === 'true';
                    document.getElementById('soundToggleBtn').textContent = 
                        this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
                }
                
                if (localStorage.getItem('musicEnabled') !== null) {
                    this.musicEnabled = localStorage.getItem('musicEnabled') === 'true';
                    document.getElementById('musicToggleBtn').textContent = 
                        this.musicEnabled ? '🎵 Music On' : '🔇 Music Off';
                }
            }
            
            savePlayerNames() {
                this.playerXName = document.getElementById('playerXName').value || 'Player X';
                this.playerOName = document.getElementById('playerOName').value || 'Player O';
                
                localStorage.setItem('playerXName', this.playerXName);
                localStorage.setItem('playerOName', this.playerOName);
                
                this.updateUI();
                this.playSound('success');
                this.speak("Player names saved successfully!");
            }
            
            toggleSound() {
                this.soundEnabled = !this.soundEnabled;
                localStorage.setItem('soundEnabled', this.soundEnabled);
                document.getElementById('soundToggleBtn').textContent = 
                    this.soundEnabled ? '🔊 Sound On' : '🔇 Sound Off';
                
                if (this.soundEnabled) {
                    this.playSound('toggle');
                }
            }
            
            toggleMusic() {
                this.musicEnabled = !this.musicEnabled;
                localStorage.setItem('musicEnabled', this.musicEnabled);
                document.getElementById('musicToggleBtn').textContent = 
                    this.musicEnabled ? '🎵 Music On' : '🔇 Music Off';
                
                if (this.musicEnabled) {
                    this.playSound('music');
                }
            }
            
            setLanguage(lang) {
                // In a real implementation, this would update all text in the UI
                this.speak(`Language changed to ${document.getElementById('languageSelect').selectedOptions[0].text}`);
            }
            
            toggleStats() {
                const statsBtn = document.getElementById('statsToggleBtn');
                const statsContent = document.getElementById('statsContent');
                
                if (statsContent.style.display === 'none') {
                    statsContent.style.display = 'grid';
                    statsBtn.textContent = 'Show Less';
                } else {
                    statsContent.style.display = 'none';
                    statsBtn.textContent = 'Show More';
                }
            }
            
            useUndoPower() {
                if (this.powerUps.undo > 0 && this.moveHistory.length > 0 && !this.gameOver) {
                    const lastMove = this.moveHistory.pop();
                    this.board[lastMove.index] = null;
                    const cell = document.querySelector(`.cell[data-index="${lastMove.index}"]`);
                    cell.innerHTML = '';
                    
                    this.currentPlayer = lastMove.player;
                    this.powerUps.undo--;
                    
                    this.updatePowerUps();
                    this.updateUI();
                    this.playSound('power');
                    this.speak("Last move undone!");
                } else {
                    this.playSound('error');
                }
            }
            
            useSwapPower() {
                if (this.powerUps.swap > 0 && !this.gameOver) {
                    // Swap player names and symbols
                    [this.playerXName, this.playerOName] = [this.playerOName, this.playerXName];
                    
                    // Swap scores
                    [this.scores.X, this.scores.O] = [this.scores.O, this.scores.X];
                    
                    // Update UI
                    this.updateUI();
                    this.updateScoreboard();
                    
                    this.powerUps.swap--;
                    this.updatePowerUps();
                    this.playSound('power');
                    this.speak("Player positions swapped!");
                } else {
                    this.playSound('error');
                }
            }
            
            useBlockPower() {
                if (this.powerUps.block > 0 && !this.gameOver && this.gameMode === 'ai' && this.currentPlayer === 'X') {
                    // Block the AI from making a move this turn
                    this.powerUps.block--;
                    this.updatePowerUps();
                    this.playSound('power');
                    this.speak("AI blocked for this turn!");
                    
                    // Skip AI turn
                    this.currentPlayer = 'X';
                    this.updateUI();
                } else {
                    this.playSound('error');
                }
            }
            
            updatePowerUps() {
                document.getElementById('undoPower').classList.toggle('disabled', this.powerUps.undo <= 0);
                document.getElementById('swapPower').classList.toggle('disabled', this.powerUps.swap <= 0);
                document.getElementById('blockPower').classList.toggle('disabled', this.powerUps.block <= 0 || this.gameMode !== 'ai');
            }

            setupVoiceRecognition() {
                if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    this.recognition = new SpeechRecognition();
                    this.recognition.continuous = false;
                    this.recognition.interimResults = false;
                    this.recognition.lang = 'en-US';

                    this.recognition.onresult = (event) => {
                        const command = event.results[0][0].transcript.toLowerCase();
                        this.processVoiceCommand(command);
                    };

                    this.recognition.onend = () => {
                        this.isListening = false;
                        this.updateVoiceButton();
                    };

                    this.recognition.onerror = (event) => {
                        console.error('Speech recognition error:', event.error);
                        this.isListening = false;
                        this.updateVoiceButton();
                        this.speak('Sorry, I could not understand that command');
                    };
                } else {
                    document.querySelector('.voice-controls').style.display = 'none';
                }
            }

            handleCellClick(index) {
                if (this.gameOver || this.board[index] !== null || this.isAIThinking) return;

                this.makeMove(index, this.currentPlayer);
                this.speak(`${this.currentPlayer} placed at position ${index + 1}`);

                if (!this.gameOver && this.gameMode === 'ai' && this.currentPlayer === 'O') {
                    setTimeout(() => this.makeAIMove(), 800);
                }
            }

            makeMove(index, player) {
                if (this.board[index] !== null || this.gameOver) return false;

                this.board[index] = player;
                const cell = document.querySelectorAll('.cell')[index];
                
                // Add symbol with animation
                const symbol = document.createElement('div');
                symbol.className = `symbol ${player.toLowerCase()}`;
                symbol.textContent = player;
                cell.appendChild(symbol);
                
                // Save move to history
                this.moveHistory.push({index, player});
                
                // Play sound
                this.playSound('move');

                // Check for win
                const winResult = this.checkWin();
                if (winResult.winner) {
                    this.gameOver = true;
                    this.scores[winResult.winner]++;
                    this.updateScoreboard();
                    this.highlightWinningLine(winResult.pattern);
                    setTimeout(() => {
                        this.showWinOverlay(`Player ${winResult.winner} Wins! 🎉`);
                        this.speak(`Player ${winResult.winner} wins the game! Congratulations!`);
                        this.playSound('win');
                        this.confetti();
                    }, 800);
                } else if (this.isBoardFull()) {
                    this.gameOver = true;
                    this.scores.draws++;
                    this.updateScoreboard();
                    setTimeout(() => {
                        this.showWinOverlay("It's a Draw! 🤝");
                        this.speak("The game is a draw! Well played!");
                        this.playSound('draw');
                    }, 500);
                } else {
                    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                    this.updateUI();
                }

                return true;
            }

            makeAIMove() {
                if (this.gameOver || this.currentPlayer !== 'O') return;

                this.isAIThinking = true;
                this.updateUI('AI is analyzing the board...');

                setTimeout(() => {
                    let move;
                    
                    switch (this.aiDifficulty) {
                        case 'easy':
                            move = this.getRandomMove();
                            break;
                        case 'medium':
                            move = this.getStrategicMove();
                            break;
                        case 'hard':
                            move = this.getMinimaxMove();
                            break;
                    }

                    if (move !== null) {
                        this.makeMove(move, 'O');
                        this.speak(`AI placed O at position ${move + 1}`);
                        
                        // AI personality comments
                        if (this.aiPersonality === 'competitive') {
                            this.speak("I'm winning this!");
                        } else if (this.aiPersonality === 'sarcastic') {
                            this.speak("Was that your best move?");
                        }
                    }

                    this.isAIThinking = false;
                    this.updateUI();
                }, 1200);
            }

            getRandomMove() {
                const availableMoves = this.board
                    .map((cell, index) => cell === null ? index : null)
                    .filter(val => val !== null);
                
                return availableMoves.length > 0 
                    ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
                    : null;
            }

            getStrategicMove() {
                // Try to win first
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === null) {
                        this.board[i] = 'O';
                        if (this.checkWin().winner === 'O') {
                            this.board[i] = null;
                            return i;
                        }
                        this.board[i] = null;
                    }
                }

                // Block opponent from winning
                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === null) {
                        this.board[i] = 'X';
                        if (this.checkWin().winner === 'X') {
                            this.board[i] = null;
                            return i;
                        }
                        this.board[i] = null;
                    }
                }

                // Take center if available
                if (this.board[4] === null) {
                    return 4;
                }

                // Take corners
                const corners = [0, 2, 6, 8];
                const availableCorners = corners.filter(i => this.board[i] === null);
                if (availableCorners.length > 0) {
                    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
                }

                // Take any available move
                return this.getRandomMove();
            }

            getMinimaxMove() {
                const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
                    const result = this.checkWinForBoard(board);
                    
                    if (result.winner === 'O') return 10 - depth;
                    if (result.winner === 'X') return depth - 10;
                    if (board.every(cell => cell !== null)) return 0;

                    if (isMaximizing) {
                        let maxScore = -Infinity;
                        for (let i = 0; i < 9; i++) {
                            if (board[i] === null) {
                                board[i] = 'O';
                                const score = minimax(board, depth + 1, false, alpha, beta);
                                board[i] = null;
                                maxScore = Math.max(maxScore, score);
                                alpha = Math.max(alpha, score);
                                if (beta <= alpha) break;
                            }
                        }
                        return maxScore;
                    } else {
                        let minScore = Infinity;
                        for (let i = 0; i < 9; i++) {
                            if (board[i] === null) {
                                board[i] = 'X';
                                const score = minimax(board, depth + 1, true, alpha, beta);
                                board[i] = null;
                                minScore = Math.min(minScore, score);
                                beta = Math.min(beta, score);
                                if (beta <= alpha) break;
                            }
                        }
                        return minScore;
                    }
                };

                let bestMove = null;
                let bestScore = -Infinity;

                for (let i = 0; i < 9; i++) {
                    if (this.board[i] === null) {
                        this.board[i] = 'O';
                        const moveScore = minimax(this.board, 0, false);
                        this.board[i] = null;

                        if (moveScore > bestScore) {
                            bestScore = moveScore;
                            bestMove = i;
                        }
                    }
                }

                return bestMove !== null ? bestMove : this.getRandomMove();
            }

            checkWin() {
                return this.checkWinForBoard(this.board);
            }

            checkWinForBoard(board) {
                for (const pattern of this.winPatterns) {
                    const [a, b, c] = pattern;
                    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                        return { winner: board[a], pattern };
                    }
                }
                return { winner: null, pattern: null };
            }

            isBoardFull() {
                return this.board.every(cell => cell !== null);
            }

            highlightWinningLine(pattern) {
                if (!pattern) return;

                const cells = document.querySelectorAll('.cell');
                pattern.forEach(index => {
                    cells[index].style.background = 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))';
                    cells[index].style.borderColor = '#fbbf24';
                    cells[index].style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
                });

                this.drawWinningLine(pattern);
            }

            drawWinningLine(pattern) {
                const gameBoard = document.getElementById('gameBoard');
                const line = document.createElement('div');
                line.className = 'winning-line';
                
                const [start, middle, end] = pattern;
                const cells = document.querySelectorAll('.cell');
                
                const startRect = cells[start].getBoundingClientRect();
                const endRect = cells[end].getBoundingClientRect();
                const boardRect = gameBoard.getBoundingClientRect();
                
                const startX = startRect.left + startRect.width / 2 - boardRect.left;
                const startY = startRect.top + startRect.height / 2 - boardRect.top;
                const endX = endRect.left + endRect.width / 2 - boardRect.left;
                const endY = endRect.top + endRect.height / 2 - boardRect.top;
                
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
                
                line.style.width = length + 'px';
                line.style.left = startX + 'px';
                line.style.top = startY + 'px';
                line.style.transform = `rotate(${angle}deg)`;
                line.style.transformOrigin = '0 50%';
                
                gameBoard.appendChild(line);
            }

            showWinOverlay(message) {
                const overlay = document.createElement('div');
                overlay.className = 'win-overlay';
                
                const messageDiv = document.createElement('div');
                messageDiv.className = 'win-message';
                messageDiv.innerHTML = `
                    <h2>${message}</h2>
                    <p>Click anywhere to continue playing</p>
                    <button class="btn" onclick="this.parentElement.parentElement.remove()">Continue</button>
                `;
                
                overlay.appendChild(messageDiv);
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        document.body.removeChild(overlay);
                    }
                });
            }
            
            confetti() {
                const canvas = document.createElement('canvas');
                canvas.style.position = 'fixed';
                canvas.style.top = '0';
                canvas.style.left = '0';
                canvas.style.width = '100%';
                canvas.style.height = '100%';
                canvas.style.pointerEvents = 'none';
                canvas.style.zIndex = '10000';
                document.body.appendChild(canvas);
                
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                
                const confettiParticles = [];
                const colors = ['#06ffa5', '#6366f1', '#8b5cf6', '#f87171', '#fbbf24'];
                
                for (let i = 0; i < 150; i++) {
                    confettiParticles.push({
                        x: Math.random() * canvas.width,
                        y: -Math.random() * canvas.height,
                        radius: Math.random() * 5 + 2,
                        color: colors[Math.floor(Math.random() * colors.length)],
                        speed: Math.random() * 3 + 2,
                        rotation: Math.random() * 360,
                        spin: Math.random() * 10 - 5
                    });
                }
                
                function animate() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    confettiParticles.forEach(p => {
                        ctx.save();
                        ctx.translate(p.x, p.y);
                        ctx.rotate(p.rotation * Math.PI / 180);
                        ctx.fillStyle = p.color;
                        ctx.beginPath();
                        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.restore();
                        
                        p.y += p.speed;
                        p.rotation += p.spin;
                        
                        if (p.y > canvas.height) {
                            p.y = -p.radius;
                            p.x = Math.random() * canvas.width;
                        }
                    });
                    
                    requestAnimationFrame(animate);
                }
                
                animate();
                
                setTimeout(() => {
                    document.body.removeChild(canvas);
                }, 3000);
            }
            
            playSound(type) {
                if (!this.soundEnabled) return;
                
                try {
                    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    let frequency = 440;
                    let duration = 0.1;
                    
                    switch(type) {
                        case 'move':
                            frequency = this.currentPlayer === 'X' ? 440 : 523.25;
                            break;
                        case 'win':
                            frequency = 659.25; // E5
                            duration = 0.3;
                            break;
                        case 'draw':
                            frequency = 220; // A3
                            duration = 0.5;
                            oscillator.type = 'square';
                            break;
                        case 'power':
                            frequency = 784; // G5
                            duration = 0.2;
                            break;
                        case 'error':
                            frequency = 220; // A3
                            duration = 0.5;
                            oscillator.type = 'sawtooth';
                            break;
                        case 'start':
                            frequency = 880; // A6
                            duration = 0.5;
                            break;
                        case 'toggle':
                            frequency = 523.25; // C5
                            duration = 0.1;
                            break;
                        case 'music':
                            // Play a short melody
                            const notes = [659.25, 783.99, 987.77, 880];
                            let time = audioContext.currentTime;
                            
                            notes.forEach((note, i) => {
                                const osc = audioContext.createOscillator();
                                const gn = audioContext.createGain();
                                osc.connect(gn);
                                gn.connect(audioContext.destination);
                                osc.type = 'sine';
                                osc.frequency.value = note;
                                gn.gain.value = 0.1;
                                osc.start(time + i * 0.2);
                                osc.stop(time + i * 0.2 + 0.1);
                            });
                            return;
                    }
                    
                    oscillator.type = 'sine';
                    oscillator.frequency.value = frequency;
                    gainNode.gain.value = 0.1;
                    
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + duration);
                } catch (e) {
                    console.error('Audio error:', e);
                }
            }

            toggleVoiceRecognition() {
                if (!this.recognition) {
                    this.speak('Voice recognition is not supported in your browser');
                    return;
                }

                if (this.isListening) {
                    this.recognition.stop();
                    this.isListening = false;
                } else {
                    this.recognition.start();
                    this.isListening = true;
                    this.speak('Listening for your command');
                }
                this.updateVoiceButton();
            }

            updateVoiceButton() {
                const btn = document.getElementById('voiceBtn');
                if (this.isListening) {
                    btn.textContent = '🛑 Stop Listening';
                    btn.classList.add('listening');
                } else {
                    btn.textContent = '🎤 Start Voice Command';
                    btn.classList.remove('listening');
                }
            }

            processVoiceCommand(command) {
                console.log('Voice command:', command);
                
                // Parse position from voice command
                const position = this.parsePositionFromVoice(command);
                if (position !== null && this.board[position] === null && !this.gameOver && !this.isAIThinking) {
                    this.makeMove(position, this.currentPlayer);
                    this.speak(`Placed ${this.currentPlayer} at position ${position + 1}`);
                    
                    if (!this.gameOver && this.gameMode === 'ai' && this.currentPlayer === 'O') {
                        setTimeout(() => this.makeAIMove(), 800);
                    }
                } else if (position !== null && this.board[position] !== null) {
                    this.speak('That position is already taken. Try another one.');
                } else {
                    this.speak('I did not understand the position. Please say a number from 1 to 9, or use position names like top left or center.');
                }
            }

            parsePositionFromVoice(command) {
                const words = command.toLowerCase();
                
                const numbers = {
                    'one': 0, '1': 0,
                    'two': 1, '2': 1,
                    'three': 2, '3': 2,
                    'four': 3, '4': 3,
                    'five': 4, '5': 4,
                    'six': 5, '6': 5,
                    'seven': 6, '7': 6,
                    'eight': 7, '8': 7,
                    'nine': 8, '9': 8
                };

                for (const [word, pos] of Object.entries(numbers)) {
                    if (words.includes(word)) return pos;
                }

                // Position mapping
                const positions = {
                    'top left': 0, 'top center': 1, 'top right': 2,
                    'middle left': 3, 'center': 4, 'middle right': 5,
                    'bottom left': 6, 'bottom center': 7, 'bottom right': 8,
                    'left top': 0, 'center top': 1, 'right top': 2,
                    'left middle': 3, 'middle': 4, 'right middle': 5,
                    'left bottom': 6, 'center bottom': 7, 'right bottom': 8
                };

                for (const [phrase, pos] of Object.entries(positions)) {
                    if (words.includes(phrase.replace(' ', ''))) return pos;
                    
                    const phraseWords = phrase.split(' ');
                    if (phraseWords.every(word => words.includes(word))) return pos;
                }

                return null;
            }

            speak(text) {
                if (this.synth && this.synth.speaking) {
                    this.synth.cancel();
                }
                
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 1.0;
                utterance.pitch = 1.0;
                utterance.volume = 0.6;
                
                if (this.synth) {
                    this.synth.speak(utterance);
                }
            }

            setGameMode(mode) {
                this.gameMode = mode;
                
                document.getElementById('vsPlayerBtn').classList.toggle('active', mode === 'player');
                document.getElementById('vsAIBtn').classList.toggle('active', mode === 'ai');
                document.getElementById('aiDifficultyGroup').style.display = mode === 'ai' ? 'block' : 'none';
                
                this.resetGame();
                this.speak(`Game mode changed to ${mode === 'ai' ? 'AI' : 'player versus player'}`);
                this.updatePowerUps();
            }

            resetGame() {
                this.board = Array(9).fill(null);
                this.currentPlayer = 'X';
                this.gameOver = false;
                this.isAIThinking = false;
                this.moveHistory = [];

                document.querySelectorAll('.cell').forEach(cell => {
                    cell.innerHTML = '';
                    cell.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))';
                    cell.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    cell.style.boxShadow = 'none';
                    cell.classList.remove('disabled');
                });

                document.querySelectorAll('.winning-line').forEach(line => line.remove());

                this.updateUI();
                this.updatePowerUps();
                this.speak('Game reset. Player X starts first.');
                this.playSound('start');
            }

            newGame() {
                this.resetGame();
                this.scores = { X: 0, O: 0, draws: 0 };
                this.updateScoreboard();
                this.powerUps = { undo: 3, swap: 1, block: 1 };
                this.updatePowerUps();
                this.speak('Starting a completely new game with fresh scores');
            }

            toggleTheme() {
                this.darkMode = !this.darkMode;
                document.body.classList.toggle('light', !this.darkMode);
                
                const btn = document.getElementById('themeBtn');
                btn.textContent = this.darkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
                
                if (!this.darkMode) {
                    document.documentElement.style.setProperty('--primary-color', '#4f46e5');
                    document.documentElement.style.setProperty('--secondary-color', '#7c3aed');
                    document.documentElement.style.setProperty('--accent-color', '#10b981');
                    document.documentElement.style.setProperty('--bg-dark', '#f8fafc');
                    document.documentElement.style.setProperty('--bg-darker', '#e2e8f0');
                    document.documentElement.style.setProperty('--text-light', '#1e293b');
                    document.documentElement.style.setProperty('--text-muted', '#475569');
                    document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.7)');
                } else {
                    document.documentElement.style.setProperty('--primary-color', '#6366f1');
                    document.documentElement.style.setProperty('--secondary-color', '#8b5cf6');
                    document.documentElement.style.setProperty('--accent-color', '#06ffa5');
                    document.documentElement.style.setProperty('--bg-dark', '#0f0f23');
                    document.documentElement.style.setProperty('--bg-darker', '#0a0a1a');
                    document.documentElement.style.setProperty('--text-light', '#f8fafc');
                    document.documentElement.style.setProperty('--text-muted', '#94a3b8');
                    document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.05)');
                }
            }

            updateUI(customStatus = null) {
                const playerElement = document.getElementById('currentPlayer');
                const statusElement = document.getElementById('gameStatus');
                
                const playerName = this.currentPlayer === 'X' ? 
                    this.playerXName : 
                    (this.gameMode === 'ai' ? this.aiName : this.playerOName);
                
                if (customStatus) {
                    statusElement.textContent = customStatus;
                    statusElement.className = 'ai-thinking';
                } else {
                    statusElement.className = '';
                    
                    if (this.gameOver) {
                        playerElement.textContent = 'Game Over';
                        statusElement.textContent = 'Click Reset to play again';
                    } else {
                        playerElement.textContent = `${playerName}'s Turn`;
                        statusElement.textContent = this.gameMode === 'ai' && this.currentPlayer === 'O' 
                            ? 'AI is thinking...' 
                            : 'Click a cell to make your move!';
                    }
                }

                document.querySelectorAll('.cell').forEach(cell => {
                    cell.classList.toggle('disabled', this.gameOver || this.isAIThinking);
                });
            }

            updateScoreboard() {
                document.getElementById('xWins').textContent = this.scores.X;
                document.getElementById('oWins').textContent = this.scores.O;
                document.getElementById('draws').textContent = this.scores.draws;
            }
        }

        window.addEventListener('load', () => {
            new ModernTicTacToe();
        });

        document.addEventListener('mousemove', (e) => {
            const cursor = document.createElement('div');
            cursor.style.position = 'fixed';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.width = '4px';
            cursor.style.height = '4px';
            cursor.style.background = 'rgba(6, 255, 165, 0.6)';
            cursor.style.borderRadius = '50%';
            cursor.style.pointerEvents = 'none';
            cursor.style.zIndex = '9999';
            cursor.style.animation = 'fadeOut 0.5s ease-out forwards';
            document.body.appendChild(cursor);
            
            setTimeout(() => {
                if (cursor.parentNode) {
                    cursor.parentNode.removeChild(cursor);
                }
            }, 500);
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(0);
                }
            }
        `;
        document.head.appendChild(style);