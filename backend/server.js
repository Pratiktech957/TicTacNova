require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');

// Store active games
const activeGames = new Map();
const connectedPlayers = new Map();

// Serve landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'html', 'landing.html'));
});

// Serve game page
app.get('/game', (req, res) => {
  res.sendFile(path.join(publicPath, 'html', 'index.html'));
});

// API endpoint for game statistics
app.get('/api/stats', (req, res) => {
  const stats = {
    totalGames: activeGames.size,
    activePlayers: connectedPlayers.size,
    version: '2.0.0',
    features: ['multiplayer', 'ai', 'voice', '3d']
  };
  res.json(stats);
});

// Serve static files
app.use(express.static(publicPath));

// WebSocket server for real-time multiplayer
wss.on('connection', (ws, req) => {
  console.log('New client connected');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      
      switch(data.type) {
        case 'join':
          handlePlayerJoin(ws, data);
          break;
        case 'move':
          handlePlayerMove(ws, data);
          break;
        case 'chat':
          handleChatMessage(ws, data);
          break;
        case 'challenge':
          handleChallenge(ws, data);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    handlePlayerDisconnect(ws);
  });
});

function handlePlayerJoin(ws, data) {
  const { playerId, playerName, gameId } = data;
  
  connectedPlayers.set(ws, { playerId, playerName });
  
  if (gameId) {
    const game = activeGames.get(gameId);
    if (game) {
      game.players.push({ ws, playerId, playerName });
      ws.send(JSON.stringify({
        type: 'game_joined',
        gameId,
        players: game.players.map(p => p.playerName)
      }));
    }
  }
}

function handlePlayerMove(ws, data) {
  const { gameId, playerId, position } = data;
  const game = activeGames.get(gameId);
  
  if (game && game.currentPlayer === playerId) {
    // Validate move
    if (game.board[position] === null) {
      game.board[position] = game.players.find(p => p.playerId === playerId).symbol;
      
      // Check win
      const winner = checkWin(game.board);
      
      // Broadcast move to all players
      game.players.forEach(player => {
        player.ws.send(JSON.stringify({
          type: 'move_made',
          position,
          playerId,
          symbol: game.players.find(p => p.playerId === playerId).symbol,
          winner
        }));
      });
      
      // Switch player
      game.currentPlayer = game.players.find(p => p.playerId !== playerId).playerId;
    }
  }
}

function handleChatMessage(ws, data) {
  const player = connectedPlayers.get(ws);
  if (player) {
    // Broadcast to all players in the same game
    // Implementation depends on your game structure
  }
}

function handleChallenge(ws, data) {
  const { opponentId, playerName } = data;
  
  // Create new game
  const gameId = 'game_' + Date.now();
  const newGame = {
    id: gameId,
    players: [],
    board: Array(9).fill(null),
    currentPlayer: null,
    status: 'waiting'
  };
  
  activeGames.set(gameId, newGame);
  
  ws.send(JSON.stringify({
    type: 'challenge_created',
    gameId,
    challengeCode: generateChallengeCode()
  }));
}

function handlePlayerDisconnect(ws) {
  const player = connectedPlayers.get(ws);
  if (player) {
    console.log(`${player.playerName} disconnected`);
    connectedPlayers.delete(ws);
  }
}

function checkWin(board) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  
  for (const pattern of winPatterns) {
    const [a,b,c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], pattern };
    }
  }
  
  if (board.every(cell => cell !== null)) {
    return { winner: 'draw' };
  }
  
  return null;
}

function generateChallengeCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/stats`);
});