import CheckHidingSpotForTreasureMutation from '../mutations/CheckHidingSpotForTreasureMutation'
import ResetGameMutation from '../mutations/ResetGameMutation'
import 'babel/polyfill';


class App extends React.Component {

  _getHidingSpotStyle(hidingSpot) {
   var color;
   if (this.props.relay.hasOptimisticUpdate(hidingSpot)) {
     color = 'lightGrey';
   } else if (hidingSpot.hasBeenChecked) {
     if (hidingSpot.hasTreasure) {
       color = 'green';
     } else {
       color = 'red';
     }
   } else {
     color = 'black';
   }
   return {
     backgroundColor: color,
     cursor: this._isGameOver() ? null : 'pointer',
     display: 'inline-block',
     height: 100,
     marginRight: 10,
     width: 100,
   };
 }

 _handleHidingSpotClick(hidingSpot) {
   console.log('_handleHidingSpotClick fired!');
   if (this._isGameOver()) {
     return;
   }
   Relay.Store.update(
     new CheckHidingSpotForTreasureMutation({
       game: this.props.game,
       hidingSpot,
     })
   );
 }

 _hasFoundTreasure() {
   return (
     this.props.game.hidingSpots.edges.some(edge => edge.node.hasTreasure)
   );
 }

 _isGameOver() {
   return !this.props.game.turnsRemaining || this._hasFoundTreasure();
 }

 _resetGame() {
   console.log('_resetGame fired!');
   console.log(this);
   console.log(this.props.game);
   Relay.Store.update(
     new ResetGameMutation({
       game: this.props.game,
     })
   );
 }

 renderGameBoard() {
    return this.props.game.hidingSpots.edges.map(edge => {
      return (
        <div
          onClick={this._handleHidingSpotClick.bind(this, edge.node)}
          style={this._getHidingSpotStyle(edge.node)}
        />
      )
    })
  }

  render() {
    console.log('rendering App.js')

    var headerText;
    if (this.props.relay.getPendingTransactions(this.props.game)) {
      headerText = '\u2026';
    } else if (this._hasFoundTreasure()) {
      headerText = 'You win!';
    } else if (this._isGameOver()) {
      headerText = 'Game over!';
    } else {
      headerText = 'Find the treasure!';
    }

    return (
      <div>
        <div>
          <h1>{headerText}</h1>
          {this.renderGameBoard()}
          <p>Turns remaining: {this.props.game.turnsRemaining}</p>
        </div>

        <div>
          <h1>Widget list</h1>
          <ul>
            {this.props.viewer.widgets.edges.map(edge =>
              <li>{edge.node.name} (ID: {edge.node.id})</li>
            )}
          </ul>
          <button onClick={console.log.bind(console)} >Other</button>
          <button onClick={this._resetGame.bind(this)} >reset this!</button>
        </div>
      </div>
    )
  }
}

console.log('CheckHidingSpotForTreasureMutation fragment(game):', CheckHidingSpotForTreasureMutation.getFragment('game'));
console.log('ResetGameMutation fragment(game):', ResetGameMutation.getFragment('game'));

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        widgets(first: 10) {
          edges {
            node {
              id,
              name,
            },
          },
        },
      }`,

    game: () => Relay.QL`
      fragment on Game {
        turnsRemaining,
        hidingSpots(first: 9) {
          edges {
            node {
              hasBeenChecked,
              hasTreasure,
              id,
              ${CheckHidingSpotForTreasureMutation.getFragment('hidingSpot')},
            }
          }
        },
        ${CheckHidingSpotForTreasureMutation.getFragment('game')},
        ${ResetGameMutation.getFragment('game')},
      }
    `,
  },
});
