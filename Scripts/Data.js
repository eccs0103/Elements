//#region Interface
var Interface = /** @class */ (function () {
    function Interface() {
    }
    Object.defineProperty(Interface, "LoadingTime", {
        get: function () {
            return this._LoadingTime;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Interface, "DarkTheme", {
        get: function () {
            return this._DarkTheme;
        },
        set: function (Value) {
            if (Value) {
                document.documentElement.classList.replace("Light", "Dark");
                document.getElementById("ButtonTheme").classList.replace("Foreground", "Background");
                document.getElementById("ButtonTheme").classList.replace("Unbordered", "Bordered");
                document.getElementById("TextTheme").textContent = "Выключить";
            }
            else if (!Value) {
                document.documentElement.classList.replace("Dark", "Light");
                document.getElementById("ButtonTheme").classList.replace("Background", "Foreground");
                document.getElementById("ButtonTheme").classList.replace("Bordered", "Unbordered");
                document.getElementById("TextTheme").textContent = "Включить";
            }
            this._DarkTheme = Value;
        },
        enumerable: false,
        configurable: true
    });
    //#region Loading
    Interface._LoadingTime = 0.5;
    //#endregion
    //#region Theme
    Interface._DarkTheme = false;
    return Interface;
}());
//#endregion
//#region Navigate
var Navigate = /** @class */ (function () {
    function Navigate() {
    }
    Object.defineProperty(Navigate, "Id", {
        get: function () {
            return this._Id;
        },
        set: function (Value) {
            if (0 <= Value && Value < this._List.length) {
                for (var index = 0; index < this._List.length; index++) {
                    this._List[index][0].style.display = "none";
                    if (this._List[index][1].classList.contains("Background")) {
                        this._List[index][1].classList.replace("Background", "Foreground");
                    }
                    if (this._List[index][1].classList.contains("Bordered")) {
                        this._List[index][1].classList.replace("Bordered", "Unbordered");
                    }
                }
                this._List[Value][0].style.display = "flex";
                this._List[Value][1].classList.replace("Foreground", "Background");
                this._List[Value][1].classList.replace("Unbordered", "Bordered");
                this._Id = Value;
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#region List
    Navigate._List = [
        [document.getElementById("PageHome"), document.getElementById("ButtonHome")],
        [document.getElementById("PageSettings"), document.getElementById("ButtonSettings")],
        [document.getElementById("PageInformation"), document.getElementById("ButtonInformation")],
    ];
    //#endregion
    //#region Id
    Navigate._Id = 0;
    return Navigate;
}());
;
//#endregion
//#region Program
var Program = /** @class */ (function () {
    function Program() {
    }
    Object.defineProperty(Program, "WidthCells", {
        get: function () {
            return this._WidthCells;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Program, "HeightCells", {
        get: function () {
            return this._HeightCells;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Program, "SizeCells", {
        set: function (Value) {
            if (this.MinSizeCells <= Value && Value <= this.MaxSizeCells) {
                this._WidthCells = Value;
                this._HeightCells = Value;
                this.Matrix = [];
                for (var Y = 0; Y < this._HeightCells; Y++) {
                    this.Matrix[Y] = [];
                }
            }
            else {
                throw new RangeError(String(Value));
            }
        },
        enumerable: false,
        configurable: true
    });
    //#endregion
    //#region Functions
    Program.GenerateBoard = function () {
        for (var Y = 0; Y < this.HeightCells; Y++) {
            for (var X = 0; X < this.WidthCells; X++) {
                var RandomElement = Random.Integer(0, this.FullC);
                if (RandomElement >= 0 && RandomElement < this.VoidC) {
                    this.Matrix[Y][X] = new Void(X, Y);
                }
                else if (RandomElement >= this.VoidC && RandomElement < this.VoidC + this.GrassC) {
                    this.Matrix[Y][X] = new Grass(X, Y);
                }
                else if (RandomElement >= this.VoidC + this.GrassC && RandomElement < this.VoidC + this.GrassC + this.FireC) {
                    this.Matrix[Y][X] = new Fire(X, Y);
                }
                else if (RandomElement >= this.VoidC + this.GrassC + this.FireC && RandomElement < this.VoidC + this.GrassC + this.FireC + this.WaterC) {
                    this.Matrix[Y][X] = new Water(X, Y);
                }
                else if (RandomElement >= this.VoidC + this.GrassC + this.FireC + this.WaterC && RandomElement < this.VoidC + this.GrassC + this.FireC + this.WaterC + this.LavaC) {
                    this.Matrix[Y][X] = new Lava(X, Y, 3);
                }
                else if (RandomElement >= this.VoidC + this.GrassC + this.FireC + this.WaterC + this.LavaC && RandomElement < this.FullC) {
                    RandomElement;
                    this.Matrix[Y][X] = new Ice(X, Y, 3);
                }
            }
        }
    };
    Program.DrawElements = function () {
        var CellWidth = document.getElementById("CanvasProgram").width / Program.WidthCells;
        var CellHeight = document.getElementById("CanvasProgram").height / Program.HeightCells;
        for (var Y = 0; Y < Program.HeightCells; Y++) {
            for (var X = 0; X < Program.WidthCells; X++) {
                var Element_1 = Program.Matrix[Y][X];
                if (Element_1 instanceof Void) {
                    this.Desk.fillStyle = "rgb(225, 225, 225)";
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
                else if (Element_1 instanceof Grass) {
                    this.Desk.fillStyle = "rgb(0, 128, 0)";
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
                else if (Element_1 instanceof Fire) {
                    this.Desk.fillStyle = "rgb(255, 150, 0)";
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
                else if (Element_1 instanceof Water) {
                    this.Desk.fillStyle = "rgb(0, 50, 255)";
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
                else if (Element_1 instanceof Lava) {
                    if (Element_1.Density == 3) {
                        this.Desk.fillStyle = "rgb(255, 0, 0)";
                    }
                    else if (Element_1.Density == 2) {
                        this.Desk.fillStyle = "rgb(255, 50, 0)";
                    }
                    else if (Element_1.Density == 1) {
                        this.Desk.fillStyle = "rgb(255, 100, 0)";
                    }
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
                else if (Element_1 instanceof Ice) {
                    if (Element_1.Density == 3) {
                        this.Desk.fillStyle = "rgb(0, 200, 255)";
                    }
                    else if (Element_1.Density == 2) {
                        this.Desk.fillStyle = "rgb(0, 150, 255)";
                    }
                    else if (Element_1.Density == 1) {
                        this.Desk.fillStyle = "rgb(0, 100, 255)";
                    }
                    this.Desk.fillRect(X * CellWidth, Y * CellHeight, CellWidth + 1, CellHeight + 1);
                }
            }
        }
    };
    Program.ExecuteFrame = function () {
        for (var Y = 0; Y < Program.HeightCells; Y++) {
            for (var X = 0; X < Program.WidthCells; X++) {
                var Element_2 = Program.Matrix[Y][X];
                if (Element_2 instanceof Void) {
                }
                else if (Element_2 instanceof Grass) {
                    Element_2.Grow();
                }
                else if (Element_2 instanceof Fire) {
                    Element_2.Burn();
                    Element_2.Fade();
                }
                else if (Element_2 instanceof Water) {
                    Element_2.Flow();
                    Element_2.Evaporate();
                }
                else if (Element_2 instanceof Lava) {
                    Element_2.Flow();
                    Element_2.Burn();
                    Element_2.Fade();
                }
                else if (Element_2 instanceof Ice) {
                    Element_2.Flow();
                    Element_2.Melt();
                    Element_2.Evaporate();
                }
            }
        }
    };
    Object.defineProperty(Program, "Execute", {
        get: function () {
            return this._Eexecute;
        },
        set: function (Value) {
            if (Value) {
                document.getElementById("ImagePlay").src = "../Resources/Pause.png";
                document.getElementById("ImagePlay").alt = "Пауза";
            }
            else if (!Value) {
                document.getElementById("ImagePlay").src = "../Resources/PlayArrow.png";
                document.getElementById("ImagePlay").alt = "Старт";
            }
            this._Eexecute = Value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Program, "Stats", {
        get: function () {
            return this._Stats;
        },
        set: function (Value) {
            if (Value) {
                document.getElementById("DivStats").style.display = "flex";
                document.getElementById("ButtonStats").classList.replace("Foreground", "Background");
                document.getElementById("ButtonStats").classList.replace("Unbordered", "Bordered");
                document.getElementById("TextStats").textContent = "Скрыть";
            }
            else if (!Value) {
                document.getElementById("DivStats").style.display = "none";
                document.getElementById("ButtonStats").classList.replace("Background", "Foreground");
                document.getElementById("ButtonStats").classList.replace("Bordered", "Unbordered");
                document.getElementById("TextStats").textContent = "Показать";
            }
            this._Stats = Value;
        },
        enumerable: false,
        configurable: true
    });
    //#region Canvas
    Program.Canvas = document.getElementById("CanvasProgram");
    Program.Desk = document.getElementById("CanvasProgram").getContext("2d");
    Program.Matrix = [];
    Program.FramesCount = 60;
    Program.FullC = 100;
    Program.GrassC = 4;
    Program.FireC = 2;
    Program.WaterC = 2;
    Program.LavaC = 1;
    Program.IceC = 1;
    Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
    Program.MinSizeCells = 10;
    Program.MaxSizeCells = 50;
    Program._WidthPixels = document.documentElement.clientWidth - 40;
    Program._HeightPixels = document.getElementById("DivProgram").clientHeight - 20 - document.getElementById("DivProgramContol").scrollHeight;
    Program.SizePixels = Math.min(Program._WidthPixels, Program._HeightPixels);
    //#endregion
    //#region Execute
    Program._Eexecute = false;
    //#endregion
    //#region Stats
    Program._Stats = true;
    return Program;
}());
//#endregion
