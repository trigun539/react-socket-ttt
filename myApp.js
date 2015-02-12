var React = require('react'),
DOM       = React.DOM,
div       = DOM.div, 
button    = DOM.button, 
table     = DOM.table,
tr        = DOM.tr,
td        = DOM.td;

// This is just a simple example of a component that can be rendered on both
// the server and browser

module.exports = React.createClass({

  // We initialise its state by using the `props` that were passed in when it
  // was first rendered. We also want the button to be disabled until the
  // component has fully mounted on the DOM
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

  /*
   * Returns whether the given score is a winning score.
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

  /*
   * Sets the clicked-on square to the current player's mark,
   * then checks for a win or cats game.  Also changes the
   * current player.
   */
  set: function (indicator) {
    var td = this.refs[indicator];

    if (td.props.children.length !== 0) {
        return;
    }

    this.props.tiles[indicator] = this.props.turn;
    this.props.moves += 1;
    this.props.score[this.props.turn] += indicator;

    if (this.win(this.props.score[this.props.turn])) {
      alert(this.props.turn + " wins!");
    } else if (this.props.moves === 9) {
      alert("Game is tied!");
    } else {
        this.props.turn = this.props.turn === "X" ? "O" : "X";
    }

    this.setState(this.props);
  },

  // For ease of illustration, we just use the React JS methods directly
  // (no JSX compilation needed)
  // Note that we allow the button to be disabled initially, and then enable it
  // when everything has loaded
  render: function() {
    var rows  = [],
    indicator = 1;

    for(var i = 0; i < 3; i++){
      var columns = [];
      for(var j = 0; j < 3; j++){
        columns.push(td({ 
          onClick: this.set.bind(this, indicator), 
          key: indicator, 
          ref: indicator,
          className: 'tile', 
          style:{ width: '50px', height: '50px', border: '1px solid gray', textAlign: 'center'} 
        }, this.props.tiles[indicator]));
        indicator += indicator;
      }
      rows.push(tr({className: 'row', key: i, style: { border: '1px solid gray' }}, columns));
    }
    var divChildren = [
      table({ className: "ttt", key: 'tableKey', style: { border: '1px solid gray' } }, rows )
    ];
    return div({className: 'ttt-container'}, divChildren);
  },
});
