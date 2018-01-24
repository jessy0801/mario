// https://developer.mozilla.org/fr/docs/Web/JavaScript/Introduction_%C3%A0_JavaScript_orient%C3%A9_objet
// a chaque bloc de commentaires, vous devez ajouter du code :p
var map = '';
window.onload = function () {
    map = new Map(schema);
    map.generateMap();
};
var Cell = function (y, x, image) {
    this.x = x;
    this.y = y;
    console.log(map.map);
    this.image = image;
    this.elem = document.createElement('img');// crée un élément img et l'insère dans le DOM aux coordonnées x et y
    var contener = document.getElementById('game_contener');
    this.elem.src = this.image;
    this.elem.style.position = 'absolute';
    this.elem.style.transition = 'all 0.3s';
    this.elem.style.left = (this.y * 16)-(this.elem.width-16)+'px';
    this.elem.style.top = (this.x * 18)-(this.elem.height-18)+'px';
    contener.append(this.elem);
    this.update = function () {
        this.elem.style.left = (this.y * 16)-(this.elem.width-16)+'px';
        this.elem.style.top = (this.x * 18)-(this.elem.height-18)+'px';// met à jour la position de la cellule dans le DOM
    };
    this.checkCollision = function (cell) {
        for (var i = 0; i<schema.length;i++) {
            for (var b = 0;b<schema[i].length;b++) {
                if (schema[i][b] === 'w') {
                    if (cell.y === b && cell.x === i ) {
                        return false;
                    }
                }
            }

        }
        return true;// retourne true si la cellule est aux même coordonnées que cell
    };
    this.die = function () {
         // détruit l'objet et le remove de la map
    };
};

var Mario = function (y, x, image) {
    Cell.call(this, y, x, image);// Mario hérite de Cell
    this.falling = false;
    this.elem.style.transition = "all 0.1s";
    this.input = new Input(['ArrowLeft', 'ArrowRight', 'Space']);
    this.jump = {
        power: 3, // hauteur du saut en nombre de cellules
        interval: null // identifiant de l'intervalle de temps entre chaque animations du saut
    };
    this.makeJump = function () {
        if (this.jump.power > 0) {
            this.x = this.x - 3;
            this.jump.power--;
        }// mario monte d'une case s'il le peut et s'il lui reste du power
        // s'il ne le peut pas, il met fin à l'intervalle de temps entre chaque animation du saut
        // mario met à jour le dom à chaque animation de saut
        // si mario saute dans un koopa, mario meurt
    };
    this.fall = function () {
        if (this.checkCollision({y: this.y , x: this.x+1})) {
            this.x = this.x + 1;
        }// mario se déplace d'une cellule vers le bas s'il le peut et met falling à true
        // si mario tombe sur un koopa, le koopa meurt
    };
    this.die = function () {
        // mario met fin à son intervalle d'animations
        // mario est retiré de la map
    };
    this.move = function () {

        if (this.input.keys.key === 'ArrowLeft' && this.checkCollision({y: this.y -1, x: this.x}) && this.checkCollision({y: this.y, x: this.x})) {
            this.y = this.y - 1;
        } else if (this.input.keys.key === 'ArrowRight' && this.checkCollision({y: this.y +1, x: this.x}) && this.checkCollision({y: this.y, x: this.x})) {
            this.y = this.y + 1;
        } else if (this.input.keys.keyCode === 32 && this.checkCollision({y: this.y, x: this.x-1}) && !this.checkCollision({y: this.y, x: this.x+1}) && this.checkCollision({y: this.y, x: this.x-2}&& this.checkCollision({y: this.y, x: this.x-3}))) {
            this.makeJump();
            this.jump.power = 3;
        } else {

        }
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
    this.elem.style.transition = "all 0.4s";
    this.direction = 'left';
    this.die = function() {
        // koopa met fin à son intervalle d'animations
        // koopa est retiré de la map
    };
    this.move = function () {
        if ((this.direction === 'left' && this.checkCollision({y: this.y +1, x: this.x}))) {
            this.elem.setAttribute('class', 'flip-image');
            this.y = this.y + 1;// koopa se déplace en direction de direction s'il le peut

        } else {
            this.direction = 'right';
        }

        if (this.direction === 'right' && this.checkCollision({y: this.y -1, x: this.x})) {
            this.elem.setAttribute('class', '');
            this.y = this.y - 1;// koopa se déplace en direction de direction s'il le peut

        } else {
            this.direction = 'left';
        }

        // si koopa recontre mario, mario meurt
    };
    this.fall = function () {
        if (this.checkCollision({y: this.y , x: this.x+1})) {
            this.x = this.x + 1;
        }
    };
    var koopa = this;
    this.interval = setInterval(function () {
        koopa.fall();
        koopa.move();
        koopa.update();
    }, 200);
};

var Input = function (keys) {
    this.keys = {};
    var te = this;
    document.addEventListener('keydown', function (e) {
        te.keys = e;
    }, false);// Input récupère les touches actives du clavier
    document.addEventListener('keyup', function () {
            te.keys = {};

    })
};

var Map = function (model) {
    this.map = [];
    this.generateMap = function () {
        for (var height = 0;height < model.length;height++) {
            this.map.push([]);
            for (var width = 0; width <model[height].length;width++) {

                if (model[height][width] === 'w') {
                    this.map[height].push(new Cell(width, height, './misc/block.png'));
                } else if (model[height][width] === 'm') {
                    this.map[height].push(new Mario(width, height, './misc/mario.png'));
                }
                else if (model[height][width] === 'k') {
                    this.map[height].push(new Koopa(width, height, './misc/kopa.png'));
                } else {
                    this.map[height].push('vide');
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
        for (var i = 0; i<this.map.length;i++) {
            if (this.map[i].elem.src === './misc/block.png') {
                if (cell.y === this.map[i].y && cell.x === this.map[i].x ) {
                    return false;
                }
            }

        }
        return true;
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


