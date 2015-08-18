export default class ResetGameMutation extends Relay.Mutation {
  static fragments = {
    game: () => Relay.QL`
      fragment on Game {
        id,
        turnsRemaining,
      }
    `
  };
  getMutation() {
    console.log('getMutation called!');
    return Relay.QL`mutation{resetGame}`;
  }
  getCollisionKey() {
    console.log('getCollisionKey called!');
    return `game_${this.props.game.id}`;
  }
  getFatQuery() {
    console.log('fatQuery called!');
    return Relay.QL`
      fragment on ResetGamePayload {
        game {
          id,
          turnsRemaining,
        },
      }
    `;
  }
  getConfigs() {
    console.log('getConfigs ', this.props.game.id)
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        game: this.props.game.id,
      },
    }];
  }
  getVariables() {
    console.log('getVariables called!');
    return {
      id: this.props.game.id,
    };
  }
  getOptimisticResponse() {
    console.log('getOptimisticResponse called!');
    return {
      game: {
        turnsRemaining: 3,
        restart: true
      },
    };
  }
}
