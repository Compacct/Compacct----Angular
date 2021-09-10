import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ɵConsole,
  Input
} from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessageService } from "primeng/api";
declare var $: any;

@Component({
  selector: "app-compacct-hearing-threshold-chart",
  templateUrl: "./compacct.hearing.threshold-chart.component.html",
  styleUrls: ["./compacct.hearing.threshold-chart.component.css"],
  providers: [MessageService]
})
export class CompacctHearingThresholdChartComponent implements AfterViewInit {
  private context: CanvasRenderingContext2D;
  private context2: CanvasRenderingContext2D;
  c_canvas: HTMLCanvasElement;
  c_canvas2: HTMLCanvasElement;
  ValidField = false;

  ThresoldLevelVal = "༝";
  elements = [];
  symbols = ["🞫", "⭘", "▢", "△", ">", "<", "]", "[", "⬊", "⬋"];
  YLabels = [
    "-20",
    "-10",
    "0",
    "10",
    "20",
    "30",
    "40",
    "50",
    "60",
    "70",
    "80",
    "90",
    "100",
    "110",
    "120"
  ];
  XLabels = ["250", "500", "750", "1k", "1.5k", "2k", "3k", "4k", "6k", "8k"];
  Value = [];
  yAxisValue = {};
  xAxisValue = {};

  ObjAudiogram = new Audiogram();

  AudioGraphData = {};
  ObjAudiogram1 = new Audiogram();
  ObjAudiogram2 = new Audiogram();
  ObjAudiogram3 = new Audiogram();
  ObjAudiogram4 = new Audiogram();
  ObjAudiogram5 = new Audiogram();
  ObjAudiogram6 = new Audiogram();
  ObjAudiogram7 = new Audiogram();
  ObjAudiogram8 = new Audiogram();

  AudiogramArr = [];
  @Input() Footfall: number;
  @Input() AppoID: number;

  // @ViewChild("canvas", { static: false }) public c_canvas: HTMLCanvasElement;
  constructor(
    private $http: HttpClient,
    private compacctToast: MessageService
  ) {}

  public ngAfterViewInit() {
    this.c_canvas = <HTMLCanvasElement>document.getElementById("c");
    this.context = <CanvasRenderingContext2D>this.c_canvas.getContext("2d");
    this.c_canvas2 = <HTMLCanvasElement>document.getElementById("d");
    this.context2 = <CanvasRenderingContext2D>this.c_canvas2.getContext("2d");
    this.InitDraw();
    this.context.save();
    this.InitDraw2();
    this.context2.save();
    this.GetEditDataAudiograph();
  }
  InitDraw() {
    const ctrl = this;
    const elemLeft = this.c_canvas.offsetLeft;
    const elemTop = this.c_canvas.offsetTop;
    this.context.beginPath();
    this.context.textBaseline = "middle";
    this.context.textAlign = "center";
    this.context.font = "14px sans-serif";
    const bw = 436.36;
    const bh = 426.66;
    const p = 0;
    const cw = bw + p * 2 + 1;
    const ch = bh + p * 2 + 1;

    this.elements = [];
    let k = 0;
    for (let x1 = 36.36; x1 <= bw; x1 += 36.36) {
      ctrl.context.beginPath();
      ctrl.context.setLineDash([0, 0]);
      ctrl.context.lineWidth = 0.5;
      ctrl.context.moveTo(0.5 + x1 + p, 36.36);
      ctrl.context.lineTo(0.5 + x1 + p, bh + p);
      ctrl.context.strokeStyle = "black";
      ctrl.context.stroke();
      ctrl.context.closePath();
      k += 1;
    }

    for (let x2 = 26.66; x2 <= bh; x2 += 26.66) {
      ctrl.context.beginPath();
      ctrl.context.setLineDash([0, 0]);
      ctrl.context.lineWidth = 0.5;
      ctrl.context.moveTo(36.66, 0.5 + x2 + p);
      ctrl.context.lineTo(bw + p, 0.5 + x2 + p);
      ctrl.context.strokeStyle = "black";
      ctrl.context.stroke();
      ctrl.context.closePath();
    }
    let baseY = 26.66;
    this.YLabels.forEach(function(element) {
      ctrl.context.beginPath();
      ctrl.context.fillStyle = "black";
      ctrl.context.fillText(element, 10, baseY);
      ctrl.context.stroke();
      baseY += 26.66;
    });
    let baseX = 66.66;
    this.XLabels.forEach(function(element) {
      ctrl.context.beginPath();
      ctrl.context.fillStyle = "black";
      ctrl.context.fillText(element, baseX, 10);
      ctrl.context.stroke();
      baseX += 36.66;
    });

    ctrl.context.beginPath();
    // ctrl.context.strokeStyle = "#ddd";
    ctrl.context.stroke();
  }
  InitDraw2() {
    const ctrl = this;
    const elemLeft = this.c_canvas2.offsetLeft;
    const elemTop = this.c_canvas2.offsetTop;
    this.context2.beginPath();
    this.context2.textBaseline = "middle";
    this.context2.textAlign = "center";
    this.context2.font = "14px sans-serif";
    const bw = 436.36;
    const bh = 426.66;
    const p = 0;
    const cw = bw + p * 2 + 1;
    const ch = bh + p * 2 + 1;

    this.elements = [];
    let k = 0;
    for (let x1 = 36.36; x1 <= bw; x1 += 36.36) {
      ctrl.context2.beginPath();
      ctrl.context2.setLineDash([0, 0]);
      ctrl.context2.lineWidth = 0.5;
      ctrl.context2.moveTo(0.5 + x1 + p, 36.36);
      ctrl.context2.lineTo(0.5 + x1 + p, bh + p);
      ctrl.context2.strokeStyle = "black";
      ctrl.context2.stroke();
      ctrl.context2.closePath();
      k += 1;
    }

    for (let x2 = 26.66; x2 <= bh; x2 += 26.66) {
      ctrl.context2.beginPath();
      ctrl.context2.setLineDash([0, 0]);
      ctrl.context2.lineWidth = 0.5;
      ctrl.context2.moveTo(36.66, 0.5 + x2 + p);
      ctrl.context2.lineTo(bw + p, 0.5 + x2 + p);
      ctrl.context2.strokeStyle = "black";
      ctrl.context2.stroke();
      ctrl.context2.closePath();
    }
    let baseY = 26.66;
    this.YLabels.forEach(function(element) {
      ctrl.context2.beginPath();
      ctrl.context2.fillStyle = "black";
      ctrl.context2.fillText(element, 10, baseY);
      ctrl.context2.stroke();
      baseY += 26.66;
    });
    let baseX = 66.66;
    this.XLabels.forEach(function(element) {
      ctrl.context2.beginPath();
      ctrl.context2.fillStyle = "black";
      ctrl.context2.fillText(element, baseX, 10);
      ctrl.context2.stroke();
      baseX += 36.66;
    });

    ctrl.context2.beginPath();
    // ctrl.context2.strokeStyle = "#ddd";
    ctrl.context2.stroke();
  }

  clear() {
    this.context.clearRect(0, 0, this.c_canvas.width, this.c_canvas.height);
    this.context.restore();
    this.InitDraw();
  }
  clear2() {
    this.context2.clearRect(0, 0, this.c_canvas2.width, this.c_canvas2.height);
    this.context2.restore();
    this.InitDraw2();
  }

  saveValue() {
    const x = Number(this.xAxisValue[this.ThresoldLevelVal]) + 36.66,
      y = Number(this.yAxisValue[this.ThresoldLevelVal]) + 79.08;

    // Add element.
    const TempThresoldObj = {
      colour: "#05EFFF",
      sym: this.ThresoldLevelVal,
      width: 15,
      height: 15,
      top: y,
      left: x
    };
    this.context.fillStyle = "#0000ff";
    this.elements.push(TempThresoldObj);
    this.context.fillText(TempThresoldObj.sym, x, y);
  }

  XaxisValueChangeRight(obj, Y_Val, Type, Direct) {
    this.DynamicSymbol(Type, Direct);
    const defaultY =
      Number(obj) > 0
        ? Number(obj) * 2.66
        : Number(obj) === 0
        ? Number(obj)
        : Number(obj) * 2.66;
    const defaultX = this.yDefaultVal(Y_Val);
    const x = defaultX - 65,
      y = 85.34 + defaultY;
    const TempThresoldObj = {
      colour: "#05EFFF",
      sym: this.ThresoldLevelVal,
      type: Type,
      name: Type + Direct,
      prop: Type + Direct + Y_Val,
      width: 15,
      height: 15,
      top: y,
      left: x
    };

    const ctrl = this;
    // this.elements.forEach(function(elem) {
    //   const prop = elem.type + Direct;
    //   if (elem.prop === TempThresoldObj.prop) {
    //     if (Type.includes("NO")) {
    //       ctrl.context.clearRect(elem.left - 12, elem.top - 14, 20, 20);
    //     } else {
    //       ctrl.context.clearRect(elem.left - 12, elem.top - 14, 14, 14);
    //     }
    //   }
    // });

    if (Type.includes("NO")) {
      const img = new Image();
      const filename =
        Direct === "RIGHT"
          ? "Responce_RightCustm.png"
          : "Responce_LeftCustm.png";
      img.src = "/Scripts/App/GlobalApp/Audiogram/" + filename;
      img.onload = function(e): void {
        ctrl.context.beginPath();
        ctrl.context.fillStyle = "#ff0000";
        ctrl.context.drawImage(img, x - 10, y - 10);
        ctrl.context.stroke();
      };
    } else {
      ctrl.context.beginPath();
      this.context.fillStyle = "#ff0000";
      this.context.fillText(TempThresoldObj.sym, x - 4, y - 4);
      this.context.stroke();
    }

    const lastElem = $.grep(this.elements, function(val) {
      return val.name === TempThresoldObj.name;
    });

    if (lastElem.length > 0) {
      const elem = lastElem[lastElem.length - 1];
      if (Type.includes("AC")) {
        const elemY = elem.top;
        const elemX = elem.left;
        if (elemY < y && elemX < x) {
          ctrl.context.beginPath();
          ctrl.context.setLineDash([0, 0]);
          ctrl.context.lineWidth = 1;
          ctrl.context.moveTo(elemX, elemY);
          ctrl.context.strokeStyle = "red";
          ctrl.context.lineTo(x - 7, y - 7);
          ctrl.context.stroke();
          ctrl.context.closePath();
        } else {
          ctrl.context.beginPath();
          ctrl.context.setLineDash([0, 0]);
          ctrl.context.lineWidth = 1;
          ctrl.context.moveTo(elemX, elemY);
          ctrl.context.strokeStyle = "red";
          ctrl.context.lineTo(x - 2, y + 2);
          ctrl.context.stroke();
          ctrl.context.closePath();
        }
      } else if (Type.includes("BC")) {
        const elemY = elem.top;
        const elemX = elem.left;
        if (elemY < y && elemX < x) {
          ctrl.context.beginPath();
          ctrl.context.setLineDash([1, 3]);
          ctrl.context.moveTo(elemX, elemY);
          ctrl.context.strokeStyle = "red";
          ctrl.context.lineTo(x - 7, y - 7);
          ctrl.context.stroke();
          ctrl.context.closePath();
        } else {
          ctrl.context.beginPath();
          ctrl.context.setLineDash([1, 3]);
          ctrl.context.strokeStyle = "red";
          ctrl.context.moveTo(elemX, elemY);
          ctrl.context.lineTo(x - 2, y + 2);
          ctrl.context.stroke();
          ctrl.context.closePath();
        }
      }
    }

    this.elements.push(TempThresoldObj);
  }
  XaxisValueChangeLeft(obj, Y_Val, Type, Direct) {
    this.DynamicSymbol(Type, Direct);
    const defaultY =
      Number(obj) > 0
        ? Number(obj) * 2.66
        : Number(obj) === 0
        ? Number(obj)
        : Number(obj) * 2.66;
    const defaultX = this.yDefaultVal(Y_Val);
    const x = defaultX - 65,
      y = 85.34 + defaultY;

    const TempThresoldObj = {
      colour: "#05EFFF",
      sym: this.ThresoldLevelVal,
      type: Type,
      name: Type + Direct,
      prop: Type + Direct + Y_Val,
      width: 15,
      height: 15,
      top: y,
      left: x
    };
    const ctrl = this;
    // this.elements.forEach(function (elem) {
    //   const prop = elem.type + Direct;
    //   if (elem.prop === TempThresoldObj.prop) {
    //     if (Type.includes("NO")) {
    //       ctrl.context.clearRect(elem.left - 12, elem.top - 14, 20, 20);
    //     } else {
    //       ctrl.context.clearRect(elem.left - 12, elem.top - 14, 14, 14);
    //     }
    //   }
    // });

    if (Type.includes("NO")) {
      const img = new Image();
      const filename =
        Direct === "RIGHT"
          ? "Responce_RightCustm.png"
          : "Responce_LeftCustm.png";
      img.src = "/Scripts/App/GlobalApp/Audiogram/" + filename;
      img.onload = function(e): void {
        ctrl.context.beginPath();
        ctrl.context2.fillStyle = "#0000ff";
        ctrl.context2.drawImage(img, x - 10, y - 10);
        ctrl.context2.stroke();
      };
    } else {
      ctrl.context.beginPath();
      this.context2.fillStyle = "#0000ff";
      this.context2.fillText(TempThresoldObj.sym, x - 4, y - 4);
      this.context2.stroke();
    }

    const lastElem = $.grep(this.elements, function(val) {
      return val.name === TempThresoldObj.name;
    });
    if (lastElem.length > 0) {
      const elem = lastElem[lastElem.length - 1];
      if (Type.includes("AC")) {
        const elemY = elem.top;
        const elemX = elem.left;

        if (elemY < y && elemX < x) {
          ctrl.context2.beginPath();
          ctrl.context2.setLineDash([0, 0]);
          ctrl.context2.moveTo(elemX, elemY);
          ctrl.context2.lineWidth = 1;
          ctrl.context2.strokeStyle = "blue";
          ctrl.context2.lineTo(x - 7, y - 7);
          ctrl.context2.stroke();
          ctrl.context2.closePath();
        } else {
          ctrl.context2.beginPath();
          ctrl.context2.setLineDash([0, 0]);
          ctrl.context2.moveTo(elemX, elemY);
          ctrl.context2.lineWidth = 1;
          ctrl.context2.strokeStyle = "blue";
          ctrl.context2.lineTo(x - 2, y + 2);
          ctrl.context2.stroke();
          ctrl.context2.closePath();
        }
      } else if (Type.includes("BC")) {
        const elemY = elem.top;
        const elemX = elem.left;
        if (elemY < y && elemX < x) {
          ctrl.context2.beginPath();
          ctrl.context2.setLineDash([1, 3]);
          ctrl.context2.strokeStyle = "blue";
          ctrl.context2.moveTo(elemX, elemY);
          ctrl.context2.lineTo(x - 7, y - 7);
          ctrl.context2.stroke();
          ctrl.context2.closePath();
        } else {
          ctrl.context2.beginPath();
          ctrl.context2.setLineDash([1, 3]);
          ctrl.context2.strokeStyle = "blue";
          ctrl.context2.moveTo(elemX, elemY);
          ctrl.context2.lineTo(x - 2, y + 2);
          ctrl.context2.stroke();
          ctrl.context2.closePath();
        }
      }
    }
    this.elements.push(TempThresoldObj);
  }

  XaxisRightChange(obj, Y_Val, Type, Direct) {
    if (Number(obj) < 131 && Number(obj) > -21) {
      this.ValidField = false;
      this.context.clearRect(0, 0, this.c_canvas.width, this.c_canvas.height);
      this.context.restore();
      this.InitDraw();
      const ctrl = this;
      const PropArr = [];
      for (const k in this.xAxisValue) {
        if (!!k) {
          PropArr.push(k);
        }
      }
      PropArr.forEach(function(elem) {
        const direction = elem.includes("RIGHT") ? "RIGHT" : "LEFT";
        const typeLastIndex = elem.search(direction);
        const TypeProp = elem.substring(0, typeLastIndex);
        const y = elem.replace(TypeProp + direction, "");
        const yVal = y === "15k" ? "1.5k" : y;
        if (direction === "RIGHT") {
          ctrl.XaxisValueChangeRight(
            ctrl.xAxisValue[elem],
            yVal,
            TypeProp,
            direction
          );
        }
      });
    } else {
      const yval = Y_Val === "1.5k" ? "15k" : Y_Val;
      const name = Type + Direct + yval;
      this.xAxisValue[name] = undefined;
      // this.ValidField = true;
      // const ctrl = this;
      // setTimeout(function() {
      //   ctrl.ValidField = false;
      // }, 2500);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Value Error",
        detail: "Input Must be Less Than 131 & Greater Than -21"
      });
    }
  }
  XaxisLeftChange(obj, Y_Val, Type, Direct) {
    if (Number(obj) < 131 && Number(obj) > -21) {
      this.ValidField = false;
      this.context2.clearRect(
        0,
        0,
        this.c_canvas2.width,
        this.c_canvas2.height
      );
      this.context2.restore();
      this.InitDraw2();
      const ctrl = this;
      const PropArr = [];
      for (const k in this.xAxisValue) {
        if (!!k) {
          PropArr.push(k);
        }
      }
      PropArr.forEach(function(elem) {
        const direction = elem.includes("RIGHT") ? "RIGHT" : "LEFT";
        const typeLastIndex = elem.search(direction);
        const TypeProp = elem.substring(0, typeLastIndex);
        const y = elem.replace(TypeProp + direction, "");
        const yVal = y === "15k" ? "1.5k" : y;
        if (direction === "LEFT") {
          ctrl.XaxisValueChangeLeft(
            ctrl.xAxisValue[elem],
            yVal,
            TypeProp,
            direction
          );
        }
      });
    } else {
      const yval = Y_Val === "1.5k" ? "15k" : Y_Val;
      const name = Type + Direct + yval;
      this.xAxisValue[name] = undefined;
      // this.ValidField = true;
      // setTimeout(function() {
      //   this.ValidField = false;
      // }, 2500);
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Value Error",
        detail: "Input Must be Less Than 131 & Greater Than -21"
      });
    }
  }

  yDefaultVal(yVal): number {
    let result = 0;
    const asString = yVal.toString();
    if (asString === "250") {
      result = 141.5;
    }
    if (asString === "500") {
      result = 178.5;
    }
    if (asString === "750") {
      result = 215.5;
    }
    if (asString === "1k") {
      result = 251.5;
    }
    if (asString === "1.5k") {
      result = 288.5;
    }
    if (asString === "2k") {
      result = 324.5;
    }
    if (asString === "3k") {
      result = 360.5;
    }
    if (asString === "4k") {
      result = 396.5;
    }
    if (asString === "6k") {
      result = 433.5;
    }
    if (asString === "8k") {
      result = 469.5;
    }
    return result;
  }

  DynamicSymbol(type, direction) {
    this.ThresoldLevelVal = undefined;
    if (type && direction) {
      this.ThresoldLevelVal = symbol[type][direction];
    }
  }

  // EDIT DATA
  GetEditDataAudiograph() {
    const para = new HttpParams().set("Appo_ID", this.AppoID.toString());
    this.$http
      .get("/Hearing_Audiogram_Graph/Retrieve_Data", { params: para })
      .subscribe((data: any) => {
        const editDataAudiograph = data ? JSON.parse(data) : [];
        console.log(editDataAudiograph);
        this.DrawEditAudiogram(editDataAudiograph);
      });
  }
  DrawEditAudiogram(data) {
    const ctrl = this;
    data.forEach(function(ind) {
      const type = ind.Heading.replace(/\s+/, "");
      for (const key in ind) {
        if (key) {
          const Right = key.search("R_");
          const Left = key.search("L_");

          if (Right === 0) {
            const PropYType = key
              .split("_")
              .pop()
              .toLowerCase();
            if (ind[key]) {
              if (PropYType === "5k") {
                const prob = type + "RIGHT15k";
                ctrl.xAxisValue[prob] = ind[key];
                ctrl.XaxisRightChange(ind[key], "15k", type, "RIGHT");
              } else {
                const prob = type + "RIGHT" + PropYType;
                ctrl.xAxisValue[prob] = ind[key];
                ctrl.XaxisRightChange(ind[key], PropYType, type, "RIGHT");
              }
            }
          }
          if (Left === 0) {
            const PropYType = key
              .split("_")
              .pop()
              .toLowerCase();
            if (ind[key]) {
              if (PropYType === "5k") {
                const prob = type + "LEFT15k";
                ctrl.xAxisValue[prob] = ind[key];
                ctrl.XaxisLeftChange(ind[key], "15k", type, "LEFT");
              } else {
                const prob = type + "LEFT" + PropYType;
                ctrl.xAxisValue[prob] = ind[key];
                ctrl.XaxisLeftChange(ind[key], PropYType, type, "LEFT");
              }
            }
          }
        }
      }
    });
    console.log(this.xAxisValue);
  }
  // DUPLICATE
  DuplicateData(Type, Direction) {
    const ctrl = this;
    const dir =
      Direction === "RIGHT" ? "LEFT" : Direction === "LEFT" ? "RIGHT" : "";
    const Prop = Type + dir;
    this.XLabels.forEach(function(elem) {
      const XaxisVal = elem === "1.5k" ? "15k" : elem;

      if (dir === "LEFT") {
        const rightObj = Type + Direction + XaxisVal;
        const leftObj = Prop + XaxisVal;
        ctrl.xAxisValue[leftObj] = ctrl.xAxisValue[rightObj];
        ctrl.XaxisValueChangeLeft(ctrl.xAxisValue[rightObj], elem, Type, dir);
      } else if (dir === "RIGHT") {
        const rightObj = Prop + XaxisVal;
        const leftObj = Type + Direction + XaxisVal;
        ctrl.xAxisValue[rightObj] = ctrl.xAxisValue[leftObj];
        ctrl.XaxisValueChangeRight(ctrl.xAxisValue[leftObj], elem, Type, dir);
      }
    });
  }
  //  CLEAR ROW
  ClearRightRow(Type, Direction) {
    const properties = Type + Direction;
    this.context.clearRect(0, 0, this.c_canvas.width, this.c_canvas.height);
    this.context.restore();
    this.InitDraw();
    const ctrl = this;
    const PropArr = [];
    for (const k in this.xAxisValue) {
      if (k.includes(properties)) {
        this.xAxisValue[k] = undefined;
      } else {
        const direction = k.includes("RIGHT") ? "RIGHT" : "LEFT";
        const typeLastIndex = k.search(direction);
        const TypeProp = k.substring(0, typeLastIndex);
        const y = k.replace(TypeProp + direction, "");
        const yVal = y === "15k" ? "1.5k" : y;
        if (direction === "RIGHT") {
          ctrl.XaxisValueChangeRight(
            ctrl.xAxisValue[k],
            yVal,
            TypeProp,
            direction
          );
        }
      }
    }
  }
  ClearLeftRow(Type, Direction) {
    const properties = Type + Direction;
    this.context2.clearRect(0, 0, this.c_canvas2.width, this.c_canvas2.height);
    this.context2.restore();
    this.InitDraw2();
    const ctrl = this;
    const PropArr = [];
    for (const k in this.xAxisValue) {
      if (k.includes(properties)) {
        this.xAxisValue[k] = undefined;
      } else {
        const direction = k.includes("RIGHT") ? "RIGHT" : "LEFT";
        const typeLastIndex = k.search(direction);
        const TypeProp = k.substring(0, typeLastIndex);
        const y = k.replace(TypeProp + direction, "");
        const yVal = y === "15k" ? "1.5k" : y;
        if (direction === "LEFT") {
          ctrl.XaxisValueChangeLeft(
            ctrl.xAxisValue[k],
            yVal,
            TypeProp,
            direction
          );
        }
      }
    }
  }
  // Print
  PrintRight() {
    const img = new Image();
    img.src = this.c_canvas.toDataURL();
    const mywindow = window.open("", "Right Ear", "height=500,width=1000");
    img.onload = function() {
      mywindow.document.write("<html><head><title>my div</title>");
      mywindow.document.write("</head><body >");
      mywindow.document.body.appendChild(img);
      mywindow.document.write("</body></html>");
      mywindow.print();
      mywindow.close();
    };
  }
  PrintLeft() {
    const img = new Image();
    img.src = this.c_canvas2.toDataURL();
    const mywindow = window.open("", "Left Ear", "height=500,width=1000");
    img.onload = function() {
      mywindow.document.write("<html><head><title>my div</title>");
      mywindow.document.write("</head><body >");
      mywindow.document.body.appendChild(img);
      mywindow.document.write("</body></html>");
      mywindow.print();
      mywindow.close();
    };
  }
  PrintBoth() {
    const img1 = new Image();
    img1.src = this.c_canvas.toDataURL();
    const img2 = new Image();
    img2.src = this.c_canvas2.toDataURL();

    setTimeout(function() {
      const mywindow = window.open("", "Both Ear", "height=500,width=1000");
      mywindow.document.write("<html><head><title>my div</title>");
      mywindow.document.write("</head><body >");
      mywindow.document.write(
        "<div style='text-align: center;font-family: sans-serif;'> <div id='img1' style='display: inline-block;width:50%'><h4 style='width:35%;" +
          "margin: 0 auto;background: #d3330a;color: white;'>RIGHT EAR</h4>"
      );
      mywindow.document.getElementById("img1").appendChild(img1);
      mywindow.document.write(
        "</div> <div id='img2' style='display: inline-block;width:50%;float: right;'><h4 style='width:35%;" +
          "margin: 0 auto;background: blue;color: white;'>LEFT EAR</h4>"
      );
      mywindow.document.getElementById("img2").appendChild(img2);
      mywindow.document.write("</div> </div>");
      mywindow.document.write("</body></html>");
      // mywindow.print();
      // mywindow.close();
    }, 1599);
  }
  PrintFetch() {
    const img1 = new Image();
    img1.src = this.c_canvas.toDataURL();
    img1.width = 350;
    img1.height = 350;
    const img2 = new Image();
    img2.src = this.c_canvas2.toDataURL();
    img2.width = 350;
    img2.height = 350;

    const printObj = {
      img1: img1,
      img2: img2,
      right:
        "<div style='text-align: center;font-family: sans-serif;'> <div id='img1' style='display: inline-block;width:50%'><h4 style='width:35%;" +
        "margin: 0 auto;background: #d3330a;color: white;'>RIGHT EAR</h4>",
      left:
        "</div> <div id='img2' style='display: inline-block;width:50%;float: right;'><h4 style='width:35%;" +
        "margin: 0 auto;background: blue;color: white;'>LEFT EAR</h4>"
    };
    return printObj;
  }
  convertJsonString = function(obj) {
    for (const key in obj) {
      if (obj[key] === 0) {
      } else if (obj[key]) {
      }
      //   else if (ctrl.objSupportContract[key] == false) { }
      else {
        obj[key] = null;
      }
    }
    return JSON.stringify([obj]);
  };
  serializeData(key, index) {
    const Right = key.search("RIGHT");
    const Left = key.search("LEFT");
    if (Right > 0) {
      const TypeProp = key.substring(0, Right);
      const Y_Val = key.replace(TypeProp + "RIGHT", "");
      const YaxisValue = Y_Val === "15k" ? "1_5K" : Y_Val.toUpperCase();
      const Field = "R_" + YaxisValue;
      if (TypeProp === "AC") {
        this.ObjAudiogram1[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BC") {
        this.ObjAudiogram2[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "UCL") {
        this.ObjAudiogram3[Field] = this.xAxisValue[key];
      }

      if (TypeProp === "ACUN") {
        this.ObjAudiogram4[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BCUN") {
        this.ObjAudiogram5[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "UCLUN") {
        this.ObjAudiogram6[Field] = this.xAxisValue[key];
      }

      if (TypeProp === "ACNO") {
        this.ObjAudiogram7[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BCNO") {
        this.ObjAudiogram8[Field] = this.xAxisValue[key];
      }
    }
    if (Left > 0) {
      const TypeProp = key.substring(0, Left);
      const Y_Val = key.replace(TypeProp + "LEFT", "");
      const YaxisValue = Y_Val === "15k" ? "1_5K" : Y_Val.toUpperCase();
      const Field = "L_" + YaxisValue;
      if (TypeProp === "AC") {
        this.ObjAudiogram1[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BC") {
        this.ObjAudiogram2[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "UCL") {
        this.ObjAudiogram3[Field] = this.xAxisValue[key];
      }

      if (TypeProp === "ACUN") {
        this.ObjAudiogram4[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BCUN") {
        this.ObjAudiogram5[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "UCLUN") {
        this.ObjAudiogram6[Field] = this.xAxisValue[key];
      }

      if (TypeProp === "ACNO") {
        this.ObjAudiogram7[Field] = this.xAxisValue[key];
      }
      if (TypeProp === "BCNO") {
        this.ObjAudiogram8[Field] = this.xAxisValue[key];
      }
    }
  }
  FetchAudiogram() {
    for (const key in this.xAxisValue) {
      if (key) {
        const Right = key.search("RIGHT");
        const Left = key.search("LEFT");
        this.AudiogramArr = [];
        let TypeProp = "";
        if (Right > 0) {
          TypeProp = key.substring(0, Right);
        }
        if (Left > 0) {
          TypeProp = key.substring(0, Left);
        }
        if (TypeProp === "AC") {
          this.serializeData(key, 1);

          this.ObjAudiogram1.Appo_ID = this.AppoID;
          this.ObjAudiogram1.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram1.Heading_Sl_No = 1;
          this.ObjAudiogram1.Heading = "AC";
        } else {
          this.ObjAudiogram1.Appo_ID = this.AppoID;
          this.ObjAudiogram1.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram1.Heading_Sl_No = 1;
          this.ObjAudiogram1.Heading = "AC";
        }
        if (TypeProp === "BC") {
          this.serializeData(key, 2);

          this.ObjAudiogram2.Appo_ID = this.AppoID;
          this.ObjAudiogram2.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram2.Heading_Sl_No = 2;
          this.ObjAudiogram2.Heading = "BC";
        } else {
          this.ObjAudiogram2.Appo_ID = this.AppoID;
          this.ObjAudiogram2.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram2.Heading_Sl_No = 2;
          this.ObjAudiogram2.Heading = "BC";
        }
        if (TypeProp === "UCL") {
          this.serializeData(key, 3);

          this.ObjAudiogram3.Appo_ID = this.AppoID;
          this.ObjAudiogram3.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram3.Heading_Sl_No = 3;
          this.ObjAudiogram3.Heading = "ULC";
        } else {
          this.ObjAudiogram3.Appo_ID = this.AppoID;
          this.ObjAudiogram3.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram3.Heading_Sl_No = 3;
          this.ObjAudiogram3.Heading = "ULC";
        }

        if (TypeProp === "ACUN") {
          this.serializeData(key, 4);

          this.ObjAudiogram4.Appo_ID = this.AppoID;
          this.ObjAudiogram4.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram4.Heading_Sl_No = 4;
          this.ObjAudiogram4.Heading = "AC UN";
        } else {
          this.ObjAudiogram4.Appo_ID = this.AppoID;
          this.ObjAudiogram4.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram4.Heading_Sl_No = 4;
          this.ObjAudiogram4.Heading = "AC UN";
        }
        if (TypeProp === "BCUN") {
          this.serializeData(key, 5);

          this.ObjAudiogram5.Appo_ID = this.AppoID;
          this.ObjAudiogram5.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram5.Heading_Sl_No = 5;
          this.ObjAudiogram5.Heading = "BC UN";
        } else {
          this.ObjAudiogram5.Appo_ID = this.AppoID;
          this.ObjAudiogram5.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram5.Heading_Sl_No = 5;
          this.ObjAudiogram5.Heading = "BC UN";
        }
        if (TypeProp === "UCLUN") {
          this.serializeData(key, 6);
          this.ObjAudiogram6.Appo_ID = this.AppoID;
          this.ObjAudiogram6.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram6.Heading_Sl_No = 6;
          this.ObjAudiogram6.Heading = "ULC UN";
        } else {
          this.ObjAudiogram6.Appo_ID = this.AppoID;
          this.ObjAudiogram6.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram6.Heading_Sl_No = 6;
          this.ObjAudiogram6.Heading = "ULC UN";
        }

        if (TypeProp === "ACNO") {
          this.serializeData(key, 7);

          this.ObjAudiogram7.Appo_ID = this.AppoID;
          this.ObjAudiogram7.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram7.Heading_Sl_No = 7;
          this.ObjAudiogram7.Heading = "AC NO";
        } else {
          this.ObjAudiogram7.Appo_ID = this.AppoID;
          this.ObjAudiogram7.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram7.Heading_Sl_No = 7;
          this.ObjAudiogram7.Heading = "AC NO";
        }
        if (TypeProp === "BCNO") {
          this.serializeData(key, 8);

          this.ObjAudiogram8.Appo_ID = this.AppoID;
          this.ObjAudiogram8.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram8.Heading_Sl_No = 8;
          this.ObjAudiogram8.Heading = "BC NO";
        } else {
          this.ObjAudiogram8.Appo_ID = this.AppoID;
          this.ObjAudiogram8.Foot_Fall_ID = this.Footfall;
          this.ObjAudiogram8.Heading_Sl_No = 8;
          this.ObjAudiogram8.Heading = "BC NO";
        }
      }
    }
    this.AudiogramArr.push(
      this.ObjAudiogram1,
      this.ObjAudiogram2,
      this.ObjAudiogram3,
      this.ObjAudiogram4,
      this.ObjAudiogram5,
      this.ObjAudiogram6,
      this.ObjAudiogram7,
      this.ObjAudiogram8
    );
    console.log(this.AudiogramArr);
    this.saveAudiogram(this.AudiogramArr);
  }
  saveAudiogram(insetData) {
    if (insetData.length) {
      const UrlAddress = "/Hearing_Audiogram_Graph/Insert_Hearing_Audiogram";
      const obj = { Hearing_Audiogram: JSON.stringify(insetData) };
      this.$http.post(UrlAddress, obj).subscribe((data: any) => {
        if (data.success) {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "success",
            summary: "Appo ID : ",
            detail: "Succesfully Updated Audiogram"
          });
        } else {
          this.compacctToast.clear();
          this.compacctToast.add({
            key: "compacct-toast",
            severity: "error",
            summary: "Warn Message",
            detail: "Error Occured "
          });
        }
      });
    } else {
      this.compacctToast.clear();
      this.compacctToast.add({
        key: "compacct-toast",
        severity: "error",
        summary: "Warn Message",
        detail: "Please Enter Some Data To Save."
      });
    }
  }
}

class Audiogram {
  Appo_ID: number;
  Foot_Fall_ID: number;
  Heading: string;
  Heading_Sl_No: number;
  R_250 = "";
  R_500 = "";
  R_750 = "";
  R_1K = "";
  R_1_5K = "";
  R_2K = "";
  R_3K = "";
  R_4K = "";
  R_6K = "";
  R_8K = "";
  L_250 = "";
  L_500 = "";
  L_750 = "";
  L_1K = "";
  L_1_5K = "";
  L_2K = "";
  L_3K = "";
  L_4K = "";
  L_6K = "";
  L_8K = "";
}

const symbol = {
  AC: {
    RIGHT: "△",
    LEFT: "▢"
  },
  BC: {
    RIGHT: "[",
    LEFT: "]"
  },
  UCL: {
    RIGHT: "U",
    LEFT: "U"
  },
  ACUN: {
    RIGHT: "⭘",
    LEFT: "🞫"
  },
  BCUN: {
    RIGHT: "<",
    LEFT: ">"
  },
  UCLUN: {
    RIGHT: "U",
    LEFT: "U"
  },
  ACNO: {
    RIGHT: "",
    LEFT: ""
  },
  BCNO: {
    RIGHT: "",
    LEFT: ""
  },
  UCLNO: {
    RIGHT: "",
    LEFT: ""
  }
};

// OLD / CLICK FUNCTION

// for (let x = 0.5; x < 501; x += 10) {
//   ctrl.context.moveTo(x, 0);
//   ctrl.context.lineTo(x, 381);
// }

// for (let y = 0.5; y < 381; y += 10) {
//   ctrl.context.moveTo(0, y);
//   ctrl.context.lineTo(500, y);
// }

// this.c_canvas.addEventListener("click", function (event) {
//   const x = event.clientX - ctrl.c_canvas.getBoundingClientRect().left,
//     y = event.clientY - ctrl.c_canvas.getBoundingClientRect().top;
//   // Add element.
//   const TempThresoldObj = {
//     colour: "#05EFFF",
//     sym: ctrl.ThresoldLevelVal,
//     width: 15,
//     height: 15,
//     top: y,
//     left: x
//   };
//   ctrl.elements.push(TempThresoldObj);
//   ctrl.context.beginPath();
//   ctrl.context.fillStyle = "#0000ff";
//   ctrl.context.fillText(TempThresoldObj.sym, x - 4, y - 4);
//   ctrl.context.stroke();
//   const ValObj = {};
//   if (x === 35) {
//     ValObj[ctrl.ThresoldLevelVal] = 0;
//   } else {
//     ValObj[ctrl.ThresoldLevelVal] = Number(x / 35).toFixed(2);
//   }
// ctrl.Value.push(ValObj);
// Render elements.
// ctrl.elements.forEach(function (element) {
// ctrl.context.fillStyle = element.colour;
// ctrl.context.fillRect(
//   element.left,
//   element.top,
//   element.width,
//   element.height
// );
//   });
// });
// this.c_canvas.addEventListener("mouseover", function(event) {
//   console.log(event.clientX, event.clientY);
// });
// ctrl.context.moveTo(0, 0);
// ctrl.context.lineTo(380, 380);

// for (let x = 0.5; x < 501; x += 10) {
//   ctrl.context.moveTo(x, 0);
//   ctrl.context.lineTo(x, 381);
// }

// for (let y = 0.5; y < 381; y += 10) {
//   ctrl.context.moveTo(0, y);
//   ctrl.context.lineTo(500, y);
// }

// this.c_canvas2.addEventListener("click", function(event) {
//   const x = event.clientX - ctrl.c_canvas2.getBoundingClientRect().left,
//     y = event.clientY - ctrl.c_canvas2.getBoundingClientRect().top;
//   // Add element.
//   const TempThresoldObj = {
//     colour: "#05EFFF",
//     sym: ctrl.ThresoldLevelVal,
//     width: 15,
//     height: 15,
//     top: y,
//     left: x
//   };
//   ctrl.elements.push(TempThresoldObj);
//   ctrl.context2.beginPath();
//   ctrl.context2.fillStyle = "#0000ff";
//   ctrl.context2.fillText(TempThresoldObj.sym, x - 4, y - 4);
//   ctrl.context2.stroke();
//   const ValObj = {};
//   if (x === 35) {
//     ValObj[ctrl.ThresoldLevelVal] = 0;
//   } else {
//     ValObj[ctrl.ThresoldLevelVal] = Number(x / 35).toFixed(2);
//   }
//    ctrl.Value.push(ValObj);
// Render elements.
//   ctrl.elements.forEach(function(element) {
// ctrl.context.fillStyle = element.colour;
// ctrl.context.fillRect(
//   element.left,
//   element.top,
//   element.width,
//   element.height
// );
//  });
// });
// this.c_canvas2.addEventListener("mouseover", function(event) {});
// ctrl.context.moveTo(0, 0);
// ctrl.context.lineTo(380, 380);
