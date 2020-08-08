var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
//#region Default
var Pixel = /** @class */ (function () {
    function Pixel(X, Y) {
        this.X = X;
        this.Y = Y;
    }
    return Pixel;
}());
//#endregion
//#region Elements
var Void = /** @class */ (function (_super) {
    __extends(Void, _super);
    //#region Constructor
    function Void(X, Y) {
        return _super.call(this, X, Y) || this;
    }
    return Void;
}(Pixel));
var Grass = /** @class */ (function (_super) {
    __extends(Grass, _super);
    function Grass(X, Y) {
        var _this = _super.call(this, X, Y) || this;
        _this.Directions =
            [
                [_this.X - 1, _this.Y - 1],
                [_this.X, _this.Y - 1],
                [_this.X + 1, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X - 1, _this.Y + 1],
                [_this.X, _this.Y + 1],
                [_this.X + 1, _this.Y + 1]
            ];
        _this.GrowCountdownMax = 10;
        _this.GrowCountdown = _this.GrowCountdownMax;
        return _this;
    }
    //#endregion
    //#region Grow
    Grass.prototype.Grow = function () {
        if (this.GrowCountdown > 0) {
            this.GrowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Grass(X, Y);
                this.GrowCountdown = this.GrowCountdownMax;
            }
        }
    };
    return Grass;
}(Pixel));
var Fire = /** @class */ (function (_super) {
    __extends(Fire, _super);
    function Fire(X, Y) {
        var _this = _super.call(this, X, Y) || this;
        _this.Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        _this.LifespanMax = 16;
        _this.Lifespan = _this.LifespanMax;
        _this.BurnCountdownMax = 4;
        _this.BurnCountdown = _this.BurnCountdownMax;
        return _this;
    }
    //#endregion
    //#region Burn
    Fire.prototype.Burn = function () {
        if (this.BurnCountdown > 0) {
            this.BurnCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Grass) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Fire(X, Y);
                this.Lifespan = this.LifespanMax;
            }
            this.BurnCountdown = this.BurnCountdownMax;
        }
    };
    //#endregion
    //#region Fade
    Fire.prototype.Fade = function () {
        if (this.Lifespan > 0) {
            this.Lifespan--;
        }
        else {
            Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
        }
    };
    return Fire;
}(Pixel));
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(X, Y) {
        var _this = _super.call(this, X, Y) || this;
        _this.Directions =
            [
                [_this.X - 1, _this.Y - 1],
                [_this.X, _this.Y - 1],
                [_this.X + 1, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X - 1, _this.Y + 1],
                [_this.X, _this.Y + 1],
                [_this.X + 1, _this.Y + 1],
            ];
        _this.FlowCountdownMax = 8;
        _this.FlowCountdown = _this.FlowCountdownMax;
        _this.EvaporateCountdownMax = 4;
        _this.EvaporateCountdown = _this.EvaporateCountdownMax;
        return _this;
    }
    //#endregion
    //#region Flow
    Water.prototype.Flow = function () {
        if (this.FlowCountdown > 0) {
            this.FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Water(X, Y);
                //Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
            }
            this.FlowCountdown = this.FlowCountdownMax;
        }
    };
    //#endregion
    //#region Evaporate
    Water.prototype.Evaporate = function () {
        var Moves = [];
        for (var Index = 0; Index < this.Directions.length; Index++) {
            var Cell = this.Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Fire) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this.EvaporateCountdown > 0) {
                this.EvaporateCountdown--;
            }
            else {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Void(X, Y);
                Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
            }
        }
    };
    return Water;
}(Pixel));
var Lava = /** @class */ (function (_super) {
    __extends(Lava, _super);
    function Lava(X, Y, Density) {
        var _this = _super.call(this, X, Y) || this;
        _this.Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        _this.Density = Density;
        _this.FlowCountdownMax = 15;
        _this.FlowCountdown = _this.FlowCountdownMax;
        _this.BurnCountdownMax = 8;
        _this.BurnCountdown = _this.BurnCountdownMax;
        _this.FadeCountdownMax = 4;
        _this.FadeCountdown = _this.FadeCountdownMax;
        return _this;
    }
    //#endregion
    //#region Flow
    Lava.prototype.Flow = function () {
        if (this.FlowCountdown > 0) {
            this.FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0 && this.Density > 1) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Lava(X, Y, this.Density - 1);
            }
            this.FlowCountdown = this.FlowCountdownMax;
        }
    };
    //#endregion
    //#region Burn
    Lava.prototype.Burn = function () {
        if (this.BurnCountdown > 0) {
            this.BurnCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Grass) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Fire(X, Y);
            }
            this.BurnCountdown = this.BurnCountdownMax;
        }
    };
    //#endregion
    //#region Fade
    Lava.prototype.Fade = function () {
        var Moves = [];
        for (var Index = 0; Index < this.Directions.length; Index++) {
            var Cell = this.Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Water) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this.FadeCountdown > 0) {
                this.FadeCountdown--;
            }
            else {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Void(X, Y);
                this.Density--;
                if (this.Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
                }
            }
        }
    };
    return Lava;
}(Pixel));
var Ice = /** @class */ (function (_super) {
    __extends(Ice, _super);
    function Ice(X, Y, Density) {
        var _this = _super.call(this, X, Y) || this;
        _this.Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        _this.Density = Density;
        _this.FlowCountdownMax = 12;
        _this.FlowCountdown = _this.FlowCountdownMax;
        _this.MeltCountdownMax = 4;
        _this.MeltCountdown = _this.MeltCountdownMax;
        _this.EvaporateCountdownMax = 4;
        _this.EvaporateCountdown = _this.EvaporateCountdownMax;
        return _this;
    }
    //#endregion
    //#region Flow
    Ice.prototype.Flow = function () {
        if (this.FlowCountdown > 0) {
            this.FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this.Directions.length; Index++) {
                var Cell = this.Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0 && this.Density > 1) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Ice(X, Y, this.Density - 1);
            }
            this.FlowCountdown = this.FlowCountdownMax;
        }
    };
    //#endregion
    //#region Melt
    Ice.prototype.Melt = function () {
        var Moves = [];
        for (var Index = 0; Index < this.Directions.length; Index++) {
            var Cell = this.Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Fire) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            var Move = Random.Element(Moves);
            var X = Move[0];
            var Y = Move[1];
            if (this.MeltCountdown > 0) {
                this.MeltCountdown--;
            }
            else {
                Program.Matrix[Y][X] = new Void(X, Y);
                this.Density--;
                if (this.Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
                }
            }
        }
    };
    //#endregion
    //#region Evaporate
    Ice.prototype.Evaporate = function () {
        var Moves = [];
        for (var Index = 0; Index < this.Directions.length; Index++) {
            var Cell = this.Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Lava) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this.EvaporateCountdown > 0) {
                this.EvaporateCountdown--;
            }
            else {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                var Loss = Math.min(Program.Matrix[Y][X].density, this.Density);
                Program.Matrix[Y][X].density -= Loss;
                this.Density -= Loss;
                if (Program.Matrix[Y][X].density <= 0) {
                    Program.Matrix[Y][X] = new Void(X, Y);
                }
                if (this.Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
                }
            }
        }
    };
    return Ice;
}(Pixel));
//#endregion
