// Dice roling game
// All code is in the 'dicer; namespace

var dicer = {
	dice : [],
	score: 0,
	bestScore: null,
	DICE_COUNT : 5,
	diceDisplay : document.getElementById('dice-display'),


	initDice : function() {
		var i=0;
		this.dice = [];
		this.score = null;
		for (i=0;i<dicer.DICE_COUNT;i++) {
			dicer.dice[i] = {
				value: null,
				frozen: false
			};
		}
		return this.dice;
	},
		
	rollDie : function(die) {
		var value = Math.floor(Math.random()*6)+1;
		die.value = value;
		// Return value for convenience, even though it is modified
		return die;
	},

	// The big rolling function
	// Will roll the dice, update the score, and determine if game is over
	rollDice : function() {
		var that = this;
		var rolledCount = 0;
		that.dice.forEach(function(die) {
			if (!die.frozen) {
				that.rollDie(die);
				rolledCount++;
			}
		});
		that.calculateScore();
		that.drawDice();
		// if only one die rolled, they must keep it - game is over
		// If we somehow have none rolled, then we probably messed up,
		// but we will still end the game
		if (rolledCount < 2) {
			that.gameOver();
		}
		else {
			that.showMessage('Click on a die to freeze it. You may unfreeze a die frozen in this turn (but not on previous turns.)');
		}
	},

	gameOver: function() {
		document.getElementById('roll').style.display = 'none';
		var message = "Game over. Final score is: "+this.score+'.';
		if (this.bestScore === null || this.score < this.bestScore) {
			this.bestScore = this.score;
			message += ' You set a new low score!';
			document.getElementById('best-score').innerHTML = this.bestScore;
		}
		this.showMessage(message);
	},
		
	calculateScore: function() {
		var that = this;
		that.score = 0;
		this.dice.forEach(function(die) {
			that.score += (die.value === 4 ? 0 : die.value);
		});
		document.getElementById('score').innerHTML = that.score;
	},

	showMessage: function(msg) {
		document.getElementById('message-box').innerHTML = msg;
	},

	freezeDie: function(e) {
		var element = e.target;
		element.classList.toggle('frozen');
		// Update model
		var allDice = this.diceDisplay.querySelectorAll('.die');
		var index = Array.prototype.indexOf.call(allDice, element);
		this.dice[index].frozen = element.classList.contains('frozen');
	},

	drawDie: function(die) {
		var dieElement = document.createElement('div');
		dieElement.className = 'die die'+die.value;
		// Already frozen dice cannot be toggled
		if (die.frozen) {
			dieElement.classList.add('frozen','permafrost');
		}
		else {
			dieElement.addEventListener('click',this.freezeDie.bind(this));
		}
		dieElement.setAttribute('title',die.value);
		this.diceDisplay.appendChild(dieElement);
	},

	drawDice: function() {
		var that = this;
		that.diceDisplay.innerHTML = '';
		that.dice.forEach(function(die) {
			that.drawDie(die);
		});
	},

	performRoll: function(e) {
		var newlyFrozens = this.diceDisplay.querySelectorAll('.frozen:not(.permafrost)');
		if (!newlyFrozens.length) {
			this.showMessage('You must freeze at least one die before rolling');
		}
		else {
			this.rollDice();
		}
	},

	startGame: function() {
		this.initDice();
		this.rollDice();
		document.getElementById('roll').style.display = 'inline-block';
	},

	init: function() {
		// Set up button handlers. These will stay live (though button may be hidden)
		// Individual dice handlers will come and go with the dice
		var that = this;
		var roll = document.getElementById('roll');
		var restart = document.getElementById('restart');
		roll.addEventListener('click',that.performRoll.bind(that));
		restart.addEventListener('click',that.startGame.bind(that));
		that.startGame();
	}

}

document.addEventListener('DOMContentLoaded', function() {
	dicer.init();
});
