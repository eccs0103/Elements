document.addEventListener("DOMContentLoaded", function (Event) {
    //#region Loading
    Interface.SlideTime = Files.Load("Interface.SlideTime", Default.SlideTime);
    Interface.ConsoleTime = Files.Load("Interface.ConsoleTime", Default.ConsoleTime);
    Interface.DarkTheme = Files.Load("Interface.DarkTheme", Default.DarkTheme);
    setTimeout(function () {
        document.getElementById("DivLoading").style.transform = "translateY(-100%)";
        document.getElementById("DivLoading").style.transition = Interface.SlideTime + "s";
        document.getElementById("DivLoading").style.visibility = "hidden";
        document.body.style.overflow = "auto";
    }, Interface.SlideTime * 1000);
    //#endregion
    //#region Navigation
    Navigate.Id = Files.Load("Navigate.Id", Default.NavigateId);
    //#endregion
    //#region Program
    Program.Canvas.width = Program.SizePixels;
    Program.Canvas.height = Program.SizePixels;
    Program.WidthCells = Files.Load("Program.WidthCells", Default.WidthCells);
    Program.HeightCells = Files.Load("Program.HeightCells", Default.HeightCells);
    Program.FramesCount = Files.Load("Program.FramesCount", Default.FramesCount);
    Program.Execute = false;
    Program.Stats = Files.Load("Program.Stats", Default.Stats);
    Program.Coefficents(Files.Load("Program.GrassC", Default.GrassC), Files.Load("Program.FireC", Default.FireC), Files.Load("Program.WaterC", Default.WaterC), Files.Load("Program.LavaC", Default.LavaC), Files.Load("Program.IceC", Default.IceC));
    Grass.GrowCountdownMax = Files.Load("Grass.GrowCountdownMax", Default.GrassGrowCountdownMax);
    Fire.LifespanMax = Files.Load("Fire.LifespanMax", Default.FireLifespanMax);
    Fire.BurnCountdownMax = Files.Load("Fire.BurnCountdownMax", Default.FireBurnCountdownMax);
    Water.FlowCountdownMax = Files.Load("Water.FlowCountdownMax", Default.WaterFlowCountdownMax);
    Water.EvaporateCountdownMax = Files.Load("Water.EvaporateCountdownMax", Default.WaterEvaporateCountdownMax);
    Lava.FlowCountdownMax = Files.Load("Lava.FlowCountdownMax", Default.LavaFlowCountdownMax);
    Lava.BurnCountdownMax = Files.Load("Lava.BurnCountdownMax", Default.LavaBurnCountdownMax);
    Lava.FadeCountdownMax = Files.Load("Lava.FadeCountdownMax", Default.LavaFadeCountdownMax);
    Ice.FlowCountdownMax = Files.Load("Ice.FlowCountdownMax", Default.IceFlowCountdownMax);
    Ice.MeltCountdownMax = Files.Load("Ice.MeltCountdownMax", Default.IceMeltCountdownMax);
    Ice.EvaporateCountdownMax = Files.Load("Ice.EvaporateCountdownMax", Default.IceEvaporateCountdownMax);
    Program.GenerateBoard();
    Program.DrawElements();
    //#endregion
    //#region Efficiency
    setTimeout(Update, 1000 / Program.FramesCount);
    function Update() {
        setTimeout(Update, 1000 / Program.FramesCount);
        //#region Execute
        if (Program.Execute) {
            Program.DrawElements();
            Program.ExecuteFrame();
        }
        //#endregion
        //#region Stats
        var VoidCount = 0;
        var GrassCount = 0;
        var FireCount = 0;
        var WaterCount = 0;
        var LavaCount = 0;
        var IceCount = 0;
        for (var Y = 0; Y < Program.HeightCells; Y++) {
            for (var X = 0; X < Program.WidthCells; X++) {
                var element = Program.Matrix[Y][X];
                if (element instanceof Void) {
                    VoidCount++;
                }
                else if (element instanceof Grass) {
                    GrassCount++;
                }
                else if (element instanceof Fire) {
                    FireCount++;
                }
                else if (element instanceof Water) {
                    WaterCount++;
                }
                else if (element instanceof Lava) {
                    LavaCount++;
                }
                else if (element instanceof Ice) {
                    IceCount++;
                }
            }
        }
        if (Program.Stats) {
            document.getElementById("TextVoid").textContent = String(VoidCount);
            document.getElementById("TextGrass").textContent = String(GrassCount);
            document.getElementById("TextFire").textContent = String(FireCount);
            document.getElementById("TextWater").textContent = String(WaterCount);
            document.getElementById("TextLava").textContent = String(LavaCount);
            document.getElementById("TextIce").textContent = String(IceCount);
            document.getElementById("TextAll").textContent = String(Program.WidthCells * Program.HeightCells);
        }
        //#endregion
    }
    //#endregion
    //#region Settings
    document.getElementById("InputSize").value = Program.WidthCells;
    document.getElementById("InputFramesCount").value = Program.FramesCount;
    document.getElementById("InputVoidC").value = Program.VoidC;
    document.getElementById("InputGrassC").value = Program.GrassC;
    document.getElementById("InputFireC").value = Program.FireC;
    document.getElementById("InputWaterC").value = Program.WaterC;
    document.getElementById("InputLavaC").value = Program.LavaC;
    document.getElementById("InputIceC").value = Program.IceC;
    document.getElementById("InputGrassGrow").value = Grass.GrowCountdownMax;
    document.getElementById("InputFireLifespan").value = Fire.LifespanMax;
    document.getElementById("InputFireBurn").value = Fire.BurnCountdownMax;
    document.getElementById("InputWaterFlow").value = Water.FlowCountdownMax;
    document.getElementById("InputWaterEvaporate").value = Water.EvaporateCountdownMax;
    document.getElementById("InputLavaFlow").value = Lava.FlowCountdownMax;
    document.getElementById("InputLavaBurn").value = Lava.BurnCountdownMax;
    document.getElementById("InputLavaFade").value = Lava.FadeCountdownMax;
    document.getElementById("InputIceFlow").value = Ice.FlowCountdownMax;
    document.getElementById("InputIceMelt").value = Ice.MeltCountdownMax;
    document.getElementById("InputIceEvaporate").value = Ice.EvaporateCountdownMax;
    //#endregion
});
