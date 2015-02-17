$(document).ready(function(){
  // Pages
  var $enter = $('#enter-page'),
  $waiting   = $('#waiting-page'),
  $game      = $('#game-page'),
  $result    = $('#result-page');

  /**
   * EVENTS
   */

  $('#playBtn').click(function(e){
    setUsername();
  });

  $('#playAgainBtn').click(function(e){
    socket.emit('join room', 'available');
    switchPage($waiting);
  });

  /**
   * General Functions
   */

  function switchPage(page){
    $('.page').css({'display': 'none'});
    page.css({'display': 'block'});
  }

  /**
   * GAME FUNCTIONS
   */

  function setUsername () {
    playerName = $('#playerNameInput').val().trim();

    // If the playerName is valid
    if (playerName) {
      // Tell the server your player name
      socket.emit('add player', playerName);
      switchPage($waiting);
    }
  }

  // SocketIO

  // Joining a game room
  socket.on('join game', function (room) {
    socket.emit('join room', room);
  });

  // Opponent joined room
  socket.on('joined room', function(state){
    renderTTT(state.turn, state.score, state.moves, state.wins, state.tiles, state.players);
    switchPage($game);
  });

  // Opponent left the game
  socket.on('player left', function (data) {
    socket.emit('join room', 'available');
    switchPage($waiting);
  });

  // Send move to opponent
  socket.on('move', function(state){
    renderTTT(state.turn, state.score, state.moves, state.wins, state.tiles, state.players);
  });

  // Send move to opponent
  socket.on('end game', function(result){
    if(result === playerName){
      $('#resultText').html('You won!');
    }else if(result === 'Tied'){
      $('#resultText').html('It\'s a tie!');
    }else{
      $('#resultText').html('You lost');
    }
    switchPage($result);
    socket.emit('leave room');
  });

  // Init app
  switchPage($enter);
});

function move(state){
  socket.emit('move', state);
}

function endGame(result){
  socket.emit('end game', result);
}