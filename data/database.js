/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Model types
export class User extends Object {}
export class Widget extends Object {}
export class Game extends Object {
  constructor(){
    super();
    this.reset();
  }

  reset() {
    console.log('game reseting... ');
    this.hidingSpots = [];
    this.turnsRemaining = 3;

    var hidingSpot;
    var indexOfSpotWithTreasure = Math.floor(Math.random() * 9);
    for (var i = 0; i < 9; i++) {
      hidingSpot = new HidingSpot();
      hidingSpot.id = `${i}`;
      hidingSpot.hasTreasure = (i === indexOfSpotWithTreasure);
      hidingSpot.hasBeenChecked = false;
      this.hidingSpots.push(hidingSpot);
    }
  }
}
export class HidingSpot extends Object {}

// Mock data
var game = new Game();
game.id = '1';

export function getHidingSpot(id) { return game.hidingSpots.find(hs => hs.id === id) }
export function getGame() { return game }
export function getHidingSpots() { return game.hidingSpots; }
export function getTurnsRemaining() { return game.turnsRemaining; }
export function resetGameThe() { game.reset(); }

export function checkHidingSpotForTreasure(id) {
  console.log('checkHidingSpotForTreasure called with id '+id);
  if (game.hidingSpots.some(hs => hs.hasTreasure && hs.hasBeenChecked)) {
    console.log('tresure already founded. Exiting... ');
    return;
  }
  game.turnsRemaining--;
  console.log('game.turnsRemaining... '+game.turnsRemaining);
  var hidingSpot = getHidingSpot(id);
  hidingSpot.hasBeenChecked = true;
};

var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';
var widgets = ['What\'s-it', 'Who\'s-it', 'How\'s-it'].map((name, i) => {
  var widget = new Widget();
  widget.name = name;
  widget.id = `${i}`;
  return widget;
});

export function getUser(id) { return id === viewer.id ? viewer : null }
export function getViewer() { return viewer }
export function getWidget(id) { return widgets.find(w => w.id === id) }
export function getWidgets() { return widgets }
