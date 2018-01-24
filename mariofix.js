// https://developer.mozilla.org/fr/docs/Web/JavaScript/Introduction_%C3%A0_JavaScript_orient%C3%A9_objet
// a chaque bloc de commentaires, vous devez ajouter du code :p
var Cell = function (y, x, image) {
    this.x = x;
    this.y =  y;
    this.image = image;
    this.cell = document.createElement('img');
    this.cell.setAttribute('src', './misc/'+image);
    this.cell.style.position = 'absolute';
    if (image === 'mario.png' ) {
        this.cell.style.left = (y * 15)+'px';
        this.cell.style.top = (x * 18)-2+'px';
    } else if (image === 'kopa.png') {
        this.cell.style.left = (y * 15)+'px';
        this.cell.style.top = (x * 18)-10+'px';
    } else {
        this.cell.style.left = (y * 15)+'px';
        this.cell.style.top = (x * 18)+'px';
    }

    var contener = document.getElementById('game_contener');
    contener.append(this.cell);
    // crée un élément img et l'insère dans le DOM aux coordonnées x et y
    this.update = function () {
        // met à jour la position de la cellule dans le DOM
    };
    this.checkCollision = function (cell) {
        // retourne true si la cellule est aux même coordonnées que cell
    };
    this.die = function () {
        // détruit l'objet et le remove de la map
    };
};

var Mario = function (y, x, image) {
    Cell.call(this, y, x, image);// Mario hérite de Cell
    this.falling = false;
    this.input = new Input(['ArrowLeft', 'ArrowRight', 'Space']);
    this.jump = {
        power: 0, // hauteur du saut en nombre de cellules
        interval: null // identifiant de l'intervalle de temps entre chaque animations du saut
    };
    this.makeJump = function () {
        // mario monte d'une case s'il le peut et s'il lui reste du power
        // s'il ne le peut pas, il met fin à l'intervalle de temps entre chaque animation du saut
        // mario met à jour le dom à chaque animation de saut
        // si mario saute dans un koopa, mario meurt
    };
    this.fall = function () {
        // mario se déplace d'une cellule vers le bas s'il le peut et met falling à true
        // si mario tombe sur un koopa, le koopa meurt
    };
    this.die = function () {
        // mario met fin à son intervalle d'animations
        // mario est retiré de la map
    };
    this.move = function () {
        // si l'Input est flèche de gauche, mario se déplace à gauche s'il le peut
        // si l'Input est flèche de droite, mario se déplace à droite s'il le peut
        // si l'Input est espace, mario commence un saut
        // si mario rencontre un koopa après son déplacement, il meurt
    };
    var mario = this;
    this.interval = setInterval(function () {
        mario.fall();
        mario.move();
        mario.update();
    }, 100);

};

var Koopa = function (y, x, image) {

    Cell.call(this, y, x, image);// Koopa hérite de Cell
    this.direction = 'left';
    this.die = function() {
        // koopa met fin à son intervalle d'animations
        // koopa est retiré de la map
    };
    this.move = function () {
        console.log('koopa move');
        // sinon il change de direction
        // si koopa recontre mario, mario meurt
    };
    this.fall = function () {
        console.log('koopa fall');// koopa se déplace d'une cellule vers le bas s'il le peut
    };
    var koopa = this;
    this.interval = setInterval(function () {
        koopa.fall();
        koopa.move();
        koopa.update();
    }, 200);
};
//Koopa.prototype = Object.create(Cell.prototype);

// on corrige le constructeur qui pointe sur celui de Personne
//Koopa.prototype.constructor = Koopa;

var Input = function (keys) {
    this.keys = {};
    window.addEventListener("keydown", function (e) {
        console.log(e);
    }, false);
    // Input récupère les touches actives du clavier
};

var Map = function (model) {
    this.map = [];
    this.generateMap = function () {
        for (var height = 0;height < model.length;height++) {
            this.map.push([]);
            for (var width = 0; width <model[height].length;width++) {

                if (model[height][width] === 'w') {
                    new Cell(width, height, 'block.png');
                } else if (model[height][width] === 'm') {
                    new Mario(width, height, 'mario.png');
                }
                else if (model[height][width] === 'k') {
                    new Koopa(width, height, 'kopa.png');
                }
            }
        }
        // créé une map qui soit le reflet du model composés d'objets avec x, y, et l'instance correspondante
        // instancie les classes correspondants au schema
        // avec :
        //      w => Cell
        //      k => Koopa
        //      m => Mario
    };
    this.checkCollision = function (cell) {
        // parcourt la map et renvoie la cellule aux mêmes coordonnées que cell
    };
    this.delete = function (cell) {
        // retire la cell de map
        // retire la cell du dom
        // delete la cell
    };
};

//new Cell(10, 10, 'monkey.png');

var schema = [
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww',
    'w                                      w',
    'w                                 k    w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww    w',
    'w                                      w',
    'w                                      w',
    'w                                      w',
    'w                                      w',
    'w                                      w',
    'w          k    w                      w',
    'wwwwwwwwwwwwwwwww                      w',
    'w                   w           k      w',
    'w            wwwww  wwwwwwwwwwwwwwwwwwww',
    'w            w                         w',
    'w           ww                         w',
    'w          www                         w',
    'w         wwww                         w',
    'wm       wwwww k     w      k          w',
    'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww'
];
window.onload = function () {
    var map = new Map(schema);
    map.generateMap();
};
