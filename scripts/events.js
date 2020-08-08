//#region Navigation
document.getElementById("ButtonHome").addEventListener("click", function (Event) {
    Navigate.Id = 0;
    Files.Save("Navigate.Id", Navigate.Id);
});
document.getElementById("ButtonSettings").addEventListener("click", function (Event) {
    Navigate.Id = 1;
    Files.Save("Navigate.Id", Navigate.Id);
});
document.getElementById("ButtonInformation").addEventListener("click", function (Event) {
    Navigate.Id = 2;
    Files.Save("Navigate.Id", Navigate.Id);
});
//#endregion
//#region Program
document.getElementById("ButtonExecute").addEventListener("click", function (Event) {
    Program.Execute = !Program.Execute;
});
document.getElementById("ButtonReset").addEventListener("click", function (Event) {
    Program.GenerateBoard();
    Program.DrawElements();
});
//#endregion
//#region Settings
document.getElementById("ButtonTheme").addEventListener("click", function (Event) {
    Interface.DarkTheme = !Interface.DarkTheme;
    Files.Save("Interface.DarkTheme", Interface.DarkTheme);
});
document.getElementById("ButtonStats").addEventListener("click", function (Event) {
    Program.Stats = !Program.Stats;
    Files.Save("Program.Stats", Program.Stats);
});
document.getElementById("InputSize").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= Program.MinSizeCells &&
        Value <= Program.MaxSizeCells) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.SizeCells = Value;
        Files.Save("Program.Size", Value);
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
document.getElementById("InputGrassC").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= 0 &&
        Value + Program.FireC + Program.WaterC + Program.LavaC + Program.IceC <= Program.FullC) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.GrassC = Value;
        Files.Save("Program.GrassC", Value);
        Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
        Files.Save("Program.VoidC", Program.VoidC);
        document.getElementById("InputVoidC").value = Program.VoidC;
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
document.getElementById("InputFireC").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= 0 &&
        Value + Program.GrassC + Program.WaterC + Program.LavaC + Program.IceC <= Program.FullC) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.FireC = Value;
        Files.Save("Program.FireC", Value);
        Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
        Files.Save("Program.VoidC", Program.VoidC);
        document.getElementById("InputVoidC").value = Program.VoidC;
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
document.getElementById("InputWaterC").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= 0 &&
        Value + Program.GrassC + Program.FireC + Program.LavaC + Program.IceC <= Program.FullC) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.WaterC = Value;
        Files.Save("Program.WaterC", Value);
        Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
        Files.Save("Program.VoidC", Program.VoidC);
        document.getElementById("InputVoidC").value = Program.VoidC;
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
document.getElementById("InputLavaC").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= 0 &&
        Value + Program.GrassC + Program.FireC + Program.WaterC + Program.IceC <= Program.FullC) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.LavaC = Value;
        Files.Save("Program.LavaC", Value);
        Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
        Files.Save("Program.VoidC", Program.VoidC);
        document.getElementById("InputVoidC").value = Program.VoidC;
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
document.getElementById("InputIceC").addEventListener("input", function (Event) {
    var InputField = Event.target;
    InputField.value = InputField.value.replace(/[^0-9]/g, "");
    var Value = Number(InputField.value);
    if (Value >= 0 &&
        Value + Program.GrassC + Program.FireC + Program.WaterC + Program.LavaC <= Program.FullC) {
        if (InputField.classList.contains("Denied")) {
            InputField.classList.replace("Denied", "Background");
        }
        Program.IceC = Value;
        Files.Save("Program.IceC", Value);
        Program.VoidC = Program.FullC - Program.GrassC - Program.FireC - Program.WaterC - Program.LavaC - Program.IceC;
        Files.Save("Program.VoidC", Program.VoidC);
        document.getElementById("InputVoidC").value = Program.VoidC;
        Program.Execute = false;
        Program.GenerateBoard();
        Program.DrawElements();
    }
    else {
        if (InputField.classList.contains("Background")) {
            InputField.classList.replace("Background", "Denied");
        }
    }
});
//#endregion
