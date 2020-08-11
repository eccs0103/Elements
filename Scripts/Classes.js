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
        _this._Directions =
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
        //this._GrowCountdownMax = 10;
        _this._GrowCountdown = Grass._GrowCountdownMax;
        return _this;
    }
    Object.defineProperty(Grass, "GrowCountdownMax", {
        get: function () {
            return this._GrowCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._GrowCountdownMax = Value;
                Files.Save("Grass.GrowCountdownMax", this._GrowCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Grow
    Grass.prototype.Grow = function () {
        if (this._GrowCountdown > 0) {
            this._GrowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
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
                this._GrowCountdown = Grass._GrowCountdownMax;
            }
        }
    };
    Grass._MinDuration = 1;
    Grass._MaxDuration = 30;
    return Grass;
}(Pixel));
var Fire = /** @class */ (function (_super) {
    __extends(Fire, _super);
    function Fire(X, Y) {
        var _this = _super.call(this, X, Y) || this;
        _this._Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        //this._LifespanMax = 16;
        _this._Lifespan = Fire._LifespanMax;
        //this._BurnCountdownMax = 4;
        _this._BurnCountdown = Fire._BurnCountdownMax;
        return _this;
    }
    Object.defineProperty(Fire, "LifespanMax", {
        get: function () {
            return this._LifespanMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._LifespanMax = Value;
                Files.Save("Fire.LifespanMax", this._LifespanMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fire, "BurnCountdownMax", {
        get: function () {
            return this._BurnCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._BurnCountdownMax = Value;
                Files.Save("Fire.BurnCountdownMax", this._BurnCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Burn
    Fire.prototype.Burn = function () {
        if (this._BurnCountdown > 0) {
            this._BurnCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
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
                this._Lifespan = Fire._LifespanMax;
            }
            this._BurnCountdown = Fire._BurnCountdownMax;
        }
    };
    //#endregion
    //#region Fade
    Fire.prototype.Fade = function () {
        if (this._Lifespan > 0) {
            this._Lifespan--;
        }
        else {
            Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
        }
    };
    Fire._MinDuration = 1;
    Fire._MaxDuration = 30;
    return Fire;
}(Pixel));
var Water = /** @class */ (function (_super) {
    __extends(Water, _super);
    function Water(X, Y) {
        var _this = _super.call(this, X, Y) || this;
        _this._Directions =
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
        //this._FlowCountdownMax = 8;
        _this._FlowCountdown = Water._FlowCountdownMax;
        //this._EvaporateCountdownMax = 4;
        _this._EvaporateCountdown = Water._EvaporateCountdownMax;
        return _this;
    }
    Object.defineProperty(Water, "FlowCountdownMax", {
        get: function () {
            return this._FlowCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._FlowCountdownMax = Value;
                Files.Save("Water.FlowCountdownMax", this._FlowCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Water, "EvaporateCountdownMax", {
        get: function () {
            return this._EvaporateCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._EvaporateCountdownMax = Value;
                Files.Save("Water.EvaporateCountdownMax", this._EvaporateCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Flow
    Water.prototype.Flow = function () {
        if (this._FlowCountdown > 0) {
            this._FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
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
            this._FlowCountdown = Water._FlowCountdownMax;
        }
    };
    //#endregion
    //#region Evaporate
    Water.prototype.Evaporate = function () {
        var Moves = [];
        for (var Index = 0; Index < this._Directions.length; Index++) {
            var Cell = this._Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Fire) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this._EvaporateCountdown > 0) {
                this._EvaporateCountdown--;
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
    Water._MinDuration = 1;
    Water._MaxDuration = 30;
    return Water;
}(Pixel));
var Lava = /** @class */ (function (_super) {
    __extends(Lava, _super);
    function Lava(X, Y, Density) {
        var _this = _super.call(this, X, Y) || this;
        _this._Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        _this._Density = Density;
        //this._FlowCountdownMax = 15;
        _this._FlowCountdown = Lava._FlowCountdownMax;
        //this._BurnCountdownMax = 8;
        _this._BurnCountdown = Lava._BurnCountdownMax;
        //this._FadeCountdownMax = 4;
        _this._FadeCountdown = Lava._FadeCountdownMax;
        return _this;
    }
    Object.defineProperty(Lava.prototype, "Density", {
        get: function () {
            return this._Density;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Lava, "FlowCountdownMax", {
        get: function () {
            return this._FlowCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._FlowCountdownMax = Value;
                Files.Save("Lava.FlowCountdownMax", this._FlowCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Lava, "BurnCountdownMax", {
        get: function () {
            return this._BurnCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._BurnCountdownMax = Value;
                Files.Save("Lava.BurnCountdownMax", this._BurnCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Lava, "FadeCountdownMax", {
        get: function () {
            return this._FadeCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._FadeCountdownMax = Value;
                Files.Save("Lava.FadeCountdownMax", this._FadeCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Flow
    Lava.prototype.Flow = function () {
        if (this._FlowCountdown > 0) {
            this._FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0 && this._Density > 1) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Lava(X, Y, this._Density - 1);
            }
            this._FlowCountdown = Lava._FlowCountdownMax;
        }
    };
    //#endregion
    //#region Burn
    Lava.prototype.Burn = function () {
        if (this._BurnCountdown > 0) {
            this._BurnCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
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
            this._BurnCountdown = Lava._BurnCountdownMax;
        }
    };
    //#endregion
    //#region Fade
    Lava.prototype.Fade = function () {
        var Moves = [];
        for (var Index = 0; Index < this._Directions.length; Index++) {
            var Cell = this._Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Water) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this._FadeCountdown > 0) {
                this._FadeCountdown--;
            }
            else {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Void(X, Y);
                this._Density--;
                if (this._Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Void(this.X, this.Y);
                }
            }
        }
    };
    Lava._MinDuration = 1;
    Lava._MaxDuration = 30;
    return Lava;
}(Pixel));
var Ice = /** @class */ (function (_super) {
    __extends(Ice, _super);
    function Ice(X, Y, Density) {
        var _this = _super.call(this, X, Y) || this;
        _this._Directions =
            [
                [_this.X, _this.Y - 1],
                [_this.X - 1, _this.Y],
                [_this.X + 1, _this.Y],
                [_this.X, _this.Y + 1],
            ];
        _this._Density = Density;
        //this._FlowCountdownMax = 12;
        _this._FlowCountdown = Ice._FlowCountdownMax;
        //this._MeltCountdownMax = 4;
        _this._MeltCountdown = Ice._MeltCountdownMax;
        //this._EvaporateCountdownMax = 4;
        _this._EvaporateCountdown = Ice._EvaporateCountdownMax;
        return _this;
    }
    Object.defineProperty(Ice.prototype, "Density", {
        get: function () {
            return this._Density;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ice, "FlowCountdownMax", {
        get: function () {
            return this._FlowCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._FlowCountdownMax = Value;
                Files.Save("Ice.FlowCountdownMax", this._FlowCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ice, "MeltCountdownMax", {
        get: function () {
            return this._MeltCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._MeltCountdownMax = Value;
                Files.Save("Ice.MeltCountdownMax", this._MeltCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ice, "EvaporateCountdownMax", {
        get: function () {
            return this._EvaporateCountdownMax;
        },
        set: function (Value) {
            if (this._MinDuration <= Value && Value <= this._MaxDuration) {
                this._EvaporateCountdownMax = Value;
                Files.Save("Ice.EvaporateCountdownMax", this._EvaporateCountdownMax);
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Flow
    Ice.prototype.Flow = function () {
        if (this._FlowCountdown > 0) {
            this._FlowCountdown--;
        }
        else {
            var Moves = [];
            for (var Index = 0; Index < this._Directions.length; Index++) {
                var Cell = this._Directions[Index];
                var X = Cell[0];
                var Y = Cell[1];
                if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                    if (Program.Matrix[Y][X] instanceof Void) {
                        Moves.push(Cell);
                    }
                }
            }
            if (Moves.length > 0 && this._Density > 1) {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                Program.Matrix[Y][X] = new Ice(X, Y, this._Density - 1);
            }
            this._FlowCountdown = Ice._FlowCountdownMax;
        }
    };
    //#endregion
    //#region Melt
    Ice.prototype.Melt = function () {
        var Moves = [];
        for (var Index = 0; Index < this._Directions.length; Index++) {
            var Cell = this._Directions[Index];
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
            if (this._MeltCountdown > 0) {
                this._MeltCountdown--;
            }
            else {
                Program.Matrix[Y][X] = new Void(X, Y);
                this._Density--;
                if (this._Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
                }
            }
        }
    };
    //#endregion
    //#region Evaporate
    Ice.prototype.Evaporate = function () {
        var Moves = [];
        for (var Index = 0; Index < this._Directions.length; Index++) {
            var Cell = this._Directions[Index];
            var X = Cell[0];
            var Y = Cell[1];
            if (0 <= Y && Y < Program.HeightCells && 0 <= X && X < Program.WidthCells) {
                if (Program.Matrix[Y][X] instanceof Lava) {
                    Moves.push(Cell);
                }
            }
        }
        if (Moves.length > 0) {
            if (this._EvaporateCountdown > 0) {
                this._EvaporateCountdown--;
            }
            else {
                var Move = Random.Element(Moves);
                var X = Move[0];
                var Y = Move[1];
                var Loss = Math.min(Program.Matrix[Y][X].density, this._Density);
                Program.Matrix[Y][X].density -= Loss;
                this._Density -= Loss;
                if (Program.Matrix[Y][X].density <= 0) {
                    Program.Matrix[Y][X] = new Void(X, Y);
                }
                if (this._Density <= 0) {
                    Program.Matrix[this.Y][this.X] = new Water(this.X, this.Y);
                }
            }
        }
    };
    Ice._MinDuration = 1;
    Ice._MaxDuration = 30;
    return Ice;
}(Pixel));
//#endregion
