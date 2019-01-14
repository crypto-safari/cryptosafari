enchant();

window.onload = function () {
    var instance;
    var accounts;
    var web3 = window.Web3;
    init = async() => {
        if(typeof web3 !== 'undefined') {
            console.log("Using web3 detected from external source like Metamask");
            web3 = new Web3(ethereum);
            console.log(web3);
            await ethereum.enable();

        } else {
            console.log("Using localhost");
            web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/b1cec4481daf41e88910bbdba6f08aab"));
        }
    }

    init();
    ethereum = async() => {
        // contract
        const contractAddress = "0x0345EBc6eDC7fAA68a435A7826660ff2592C10bE";
        instance = new web3.eth.Contract(contractABI, contractAddress);
        console.log(instance);

        accounts = await web3.eth.getAccounts();
        console.log(accounts);
    
        // balance
        const balance = await web3.eth.getBalance(accounts[0]);
        console.log("balance: " + balance);
    }
    ethereum();

    var PRELOAD_MATERIAL = [
        'http://jsrun.it/assets/h/I/Y/z/hIYzl.png',
        'http://jsrun.it/assets/3/0/f/E/30fEq.png',
        'http://jsrun.it/assets/s/Z/V/N/sZVNl.png',
        'http://jsrun.it/assets/g/Z/F/A/gZFAa.gif',
        'http://jsrun.it/assets/b/K/5/V/bK5VO.png'
    ];
    var game = new Game(320, 320);
    game.fps = 100;
    if (PRELOAD_MATERIAL) game.preload(PRELOAD_MATERIAL);

    var Player = enchant.Class.create(Avatar, {
        initialize: function (code) {
            Avatar.call(this, code);
            this.left();
            this.animPattern['specialAttack'] = [6, 6, 6, 9, 5, 5, 13, 10, 11, 10, 11, 5, 13, 9, 13, 14, 15, 15, 8, 8, -1];
            this.command = '';
            this.targetEnemy = '';
            this.inputCount = game.fps;
            this.hp = 200;
            this.energy = 0;
            this.addEventListener(enchant.Event.ENTER_FRAME, this.onEnterFrame);
        },
        onEnterFrame: function () {
            if (this.x === -this.width || this.action === 'dead') this.tl.delay(2).then(function () { game.end(); });
            if (this.inputCount > 0 && this.action === 'stop') this.inputCount--;
            if (this.hp < 1 && this.action === 'stop') this.action = 'dead';
            if (!this.command) return;
            var target = this.targetEnemy;
            switch (this.command) {
                case 'attack':
                    this.action = 'attack';
                    this.energy += 5;
                    this.tl.moveTo(target.x + target.width, target.y + target.height - this.height, 3);
                    this.tl.delay(24).moveTo(this.positionX, this.positionY, 1);
                    target.tl.delay(15).then(function () {
                        var damage = rand(100) + 1;
                        game.rootScene.addChild(new Damage(target.x + target.width / 2 + 25, target.y, 180, damage));
                        this.hp -= damage;
                    });
                    break;
                case 'specialAttack':
                    this.action = 'specialAttack';
                    this.energy = 0;
                    this.tl.moveTo(target.x + 185, target.y + 130, 3);
                    this.tl.delay(58);
                    this.tl.moveBy(-128, 0, 3).delay(game.fps);
                    this.tl.moveTo(this.positionX, this.positionY, 1);
                    target.tl.delay(64);
                    target.tl.then(function () {
                        var damage = rand(600) + 400;
                        game.rootScene.addChild(new Damage(target.x + target.width / 2 + 25, target.y, 180, damage));
                        this.hp -= damage;

                    });
                    break;
                case 'win':
                if (rand(100) > 50) {
                    const id = rand(15);

                    var animal = animalURI[0];
                    var animalName = animal[id].name;
                    var animalURL = animal[id].url;
                    var animalHP = animal[id].HP;
                    var animalAT = animal[id].AT;

                    const URI = `{"name": ${animalName}, "URL": ${animalURL}, "HP": ${animalHP.toString()}, "AT": ${animalAT.toString()}}`;
                    console.log(URI);

                    getToken = async() => {
                        await instance.methods.createChar(
                            accounts[0],
                            id,
                            URI
                        ).send({from: accounts[0]});
                    }

                    getToken();
    
                    
                    game.rootScene.addChild(new Damage(target.x + target.width / 2, target.y, target.height - 16, id));

                } else {
                    const alert = 999;
                    game.rootScene.addChild(new Damage(target.x + target.width / 2, target.y, target.height - 16, alert));

                }
                    this.tl.delay(game.fps / 2).moveBy(0, -32, 3).moveBy(0, 32, 3);
                    this.tl.then(function () { this.action = 'run'; }).moveTo(-this.width, this.positionY, game.fps);

                    
                    this.tl.then(function() {window.location.href = '../rpg/index.html';}); // 通常の遷移


                    break;

                default: break;
            }
            this.command = this.targetEnemy = '';
        }
    });

    var Damage = enchant.Class.create(MutableText, {
        initialize: function (x, y, height, val) {
            MutableText.call(this, x, y);
            this.text = "" + val;
            this.tl.moveBy(0, height, game.fps / 2, BOUNCE_EASEOUT).delay(game.fps / 2).removeFromScene();
        }
    });

    var Bar = enchant.Class.create(Entity, {
        initialize: function (x, y, width, height, color) {
            Entity.call(this);
            this.width = this.maxWidth = width;
            this.height = height;
            this.x = x;
            this.y = y;
            this.value = 1;
            this.backgroundColor = color;
            var background = new Entity();
            background.width = width;
            background.height = height;
            background.x = x;
            background.y = y;
            background.backgroundColor = '#000000';
            this.addEventListener(enchant.Event.ENTER_FRAME, function () {
                this.width = this.maxWidth * this.value;
                background.x = this.x;
                background.y = this.y;
            });
            game.currentScene.addChild(background);
            game.currentScene.addChild(this);
        }
    });

    game.onload = function () {
        game.rootScene.backgroundColor = '#000000';
        var background = new AvatarBG(1);
        background.y = 32;
        game.rootScene.addChild(background);

        var player = new Player('2:10:3:2517:21600:2222');
        player.x = 320;
        player.y = player.positionY = 64;
        player.positionX = 224;
        player.tl.moveX(player.positionX, game.fps / 4);
        game.rootScene.addChild(player);

        var lifeBar = new Bar(player.x, player.y + 52, 64, 4, '#00FF80');
        lifeBar.addEventListener(enchant.Event.ENTER_FRAME, function () {
            this.x = player.x;
            this.y = player.y + 52;
            this.value = Math.max(Math.min(player.hp / 200, 1), 0);
        });
        game.rootScene.addChild(lifeBar);

        var energyBar = new Bar(player.x, player.y + 56, 64, 4, '#FF0000');
        energyBar.addEventListener(enchant.Event.ENTER_FRAME, function () {
            this.x = player.x;
            this.y = player.y + 56;
            this.value = Math.max(Math.min(player.energy / 100, 1), 0);
            this.backgroundColor = (this.value > 0.8) ? '#FFFFFF' : '#FF0000';
        });
        game.rootScene.addChild(energyBar);


        var enemy = new AvatarMonster(game.assets['http://jsrun.it/assets/g/Z/F/A/gZFAa.gif']);
        enemy.x = -enemy.width;
        enemy.y = 80;
        enemy.scaleX = -1;
        enemy.tl.moveX(80, game.fps / 4);
        enemy.hp = 100;
        enemy.inputCount = game.fps * 8;
        enemy.addEventListener(enchant.Event.ENTER_FRAME, function () {
            if (this.hp < 1) this.action = 'disappear';
            if (this.action === 'stop' && player.action === 'stop') this.inputCount--;
            if (this.inputCount < 1) {
                this.tl.fadeTo(0, 2).fadeTo(1, 2).fadeTo(0, 2).fadeTo(1, 2).then(function () { this.action = 'attack'; });
                this.inputCount = game.fps * 8;
                player.tl.delay(8).then(function () {
                    this.action = 'damage';
                    var damage = rand(80);
                    game.rootScene.addChild(new Damage(this.x + this.width / 2, this.y, this.height - 16, damage));
                    this.hp -= damage;
                    this.energy += damage / 2;
                });
            }
        });
        enemy.addEventListener(enchant.Event.REMOVED_FROM_SCENE, function () {
            player.command = 'win';
            command.visible = false;
        });
        game.rootScene.addChild(enemy);

        var command = new Group();
        command.x = 70;
        command.y = 320;
        command.addEventListener(enchant.Event.ENTER_FRAME, function () {
            if (player.inputCount === 0 && enemy.action === 'stop') {
                this.tl.moveTo(this.x, 208, 3);
                player.inputCount = -1;
            }
        });
        game.rootScene.addChild(command);
        var commandButton = [];
        var temp = ['attack', 'specialAttack'];
        for (var i = 0; i < 2; i++) {
            commandButton[i] = new Sprite(180, 48);
            commandButton[i].x = 0;
            commandButton[i].y = i * 50;
            commandButton[i].image = game.assets['http://jsrun.it/assets/b/K/5/V/bK5VO.png'];
            commandButton[i].frame = i;
            commandButton[i].command = temp[i];
            commandButton[i].addEventListener(enchant.Event.TOUCH_END, function () {
                if (enemy.action !== 'stop' || player.action !== 'stop') return;
                this.touchEnabled = false;
                this.tl.delay(6).then(function () { this.touchEnabled = true; });
                this.parentNode.tl.moveY(320, 2);
                player.targetEnemy = enemy;
                player.command = this.command;
                player.inputCount = this.command.length * 10;
            });
            command.addChild(commandButton[i]);
        }
        commandButton[1].addEventListener(enchant.Event.ENTER_FRAME, function () {
            this.visible = (player.energy > 80) ? true : false;
        });
    }
    game.start();
}