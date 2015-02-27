var DOM = React.DOM,
div     = DOM.div, 
button  = DOM.button, 
table   = DOM.table,
tr      = DOM.tr,
td      = DOM.td;

var App = React.createClass({
  getInitialState: function() {
    return {
      turn : "X",
      score : { X: 0, O: 0 },
      moves : 0,
      tiles: {
        1: '',
        2: '',
        4: '',
        8: '',
        16: '',
        32: '',
        64: '',
        128: '',
        256: ''
      },
      wins : [7, 56, 448, 73, 146, 292, 273, 84]
    }
  },

  /*
   * To determine a win condition, each square is "tagged" from left
   * to right, top to bottom, with successive powers of 2.  Each cell
   * thus represents an individual bit in a 9-bit string, and a
   * player's squares at any given time can be represented as a
   * unique 9-bit value. A winner can thus be easily determined by
   * checking whether the player's current 9 bits have covered any
   * of the eight "three-in-a-row" combinations.
   *
   *     273                 84
   *        \               /
   *          1 |   2 |   4  = 7
   *       -----+-----+-----
   *          8 |  16 |  32  = 56
   *       -----+-----+-----
   *         64 | 128 | 256  = 448
   *       =================
   *         73   146   292
   *
   */

  win: function (score) {
      var i;
      for (i = 0; i < this.props.wins.length; i += 1) {
          if ((this.props.wins[i] & score) === this.props.wins[i]) {
              return true;
          }
      }
      return false;
  },

  set: function (indicator) {
    var td = this.refs[indicator];

    if (td.props.children.length !== 0) {
        return;
    }

    this.props.tiles[indicator] = this.props.turn;
    this.props.moves += 1;
    this.props.score[this.props.turn] += indicator;

    this.setState(this.props);

    if (this.win(this.props.score[this.props.turn])) {
      if(this.props.turn === 'X'){
        if(this.props.players[0] === playerName){
          endGame(playerName);
        }else{
          endGame(this.props.players[1]);
        }
      }else{
        if(this.props.players[1] === playerName){
          endGame(playerName);
        }else{
          endGame(this.props.players[0]);
        }
      }
      console.log(this.props.turn + " wins!");
    } else if (this.props.moves === 9) {
      console.log("Game is tied!");
      endGame('Tied');
    }else{
      this.props.turn = this.props.turn === "X" ? "O" : "X";
      move(this.props);
    }
  },

  render: function() {
    var rows  = [],
    indicator = 1;

    for(var i = 0; i < 3; i++){
      var columns = [];
      for(var j = 0; j < 3; j++){
        var options = { 
          key: indicator, 
          ref: indicator,
          className: 'tile', 
          style:{ 
            width: '50px', 
            height: '50px', 
            border: '1px solid gray', 
            textAlign: 'center',
            padding: '0px'
          } 
        };

        if(this.props.turn === 'X'){
          if(this.props.players[0] === playerName){
            options['onClick'] = this.set.bind(this, indicator);
            options['onTouchStart'] = this.set.bind(this, indicator);
          }
        }else{
          if(this.props.players[1] === playerName){
            options['onClick'] = this.set.bind(this, indicator);
            options['onTouchStart'] = this.set.bind(this, indicator);
          }
        }

        columns.push(td(options, this.props.tiles[indicator]));
        indicator += indicator;
      }
      rows.push(tr({className: 'row', key: i}, columns));
    }

    var xPlayerOptions = {
      className: this.props.turn === 'X' ? 'name active' : 'name', 
      id: 'x-player', 
      key: 'x-player'
    };

    var oPlayerOptions = {
      className: this.props.turn === 'O' ? 'name active' : 'name', 
      id: 'o-player', 
      key: 'o-player'
    };

    var divChildren = [
      div(xPlayerOptions, this.props.players[0] ? 'X: ' + this.props.players[0] : 'X: '),
      div(oPlayerOptions, this.props.players[1] ? 'O: ' + this.props.players[1] : 'O: '),
      table({ className: "ttt", key: 'tableKey', style: { margin: '0 auto' } }, rows )
    ];
    return div({className: 'ttt-container'}, divChildren);
  },
});

function renderTTT(turn, score, moves, wins, tiles, players){
  React.render(<App turn={turn} score={score} moves={moves} wins={wins} tiles={tiles} players={players} />, document.getElementById('game'));
}