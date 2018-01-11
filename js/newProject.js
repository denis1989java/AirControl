//достаю главное свг из дома
let playingField = document.getElementById("runway");
//получаю его стили
let playingFieldStyle = getComputedStyle(playingField);
let gameStart = 0;//это переменная для записи времени запуска приложения
var userName;
var planes = 0;
var transformCorrection;
var sound_stolk;

'use strict';

function createRandomPath(a, b) {
    let array = [];
    array.push("M");
    array.push(a)
    array.push(b)
    for (let j = 0; j < 20; j++) {
        array.push("C")
        for (let i = 0; i < 6; i++) {
            if (i % 2 === 0) {
                array.push(getRandomInt(1, parseInt(playingFieldStyle.width)));
            } else {
                array.push(getRandomInt(1, parseInt(playingFieldStyle.height)) + ",");
            }
        }
        array.push("S")
        for (let i = 0; i < 4; i++) {
            if (i % 2 === 0) {
                array.push(getRandomInt(1, parseInt(playingFieldStyle.width)));
            } else {
                if (i !== 3 && j !== 4) {
                    array.push(getRandomInt(1, parseInt(playingFieldStyle.height)) + ",");
                } else {
                    array.push(getRandomInt(1, parseInt(playingFieldStyle.height)));
                }

            }
        }
    }
    return array;
}


class Plane {
    //создаем самолет - у него при создании есть айди и тип - айди просто инкремент от 0, тип рандом от 1 до 3
    constructor(id, type) {
        this.id = id;
        this.ty = type;
        this.create();
        this.drive();
    }

//метод который рисует сам самолет
    create() {
        //точки создания самолетов
        let startPoints = {
            '1': {
                '1': [-10, 100],
                '2': [-10, 200],
                '3': [-10, 300],
                '4': [-10, 400],
                '5': [-10, 500]
            },
            '2': {
                '1': [190, 730],
                '2': [380, 730],
                '3': [570, 730],
                '4': [760, 730],
                '5': [950, 730]
            },
            '3': {
                '1': [1210, 100],
                '2': [1210, 200],
                '3': [1210, 300],
                '4': [1210, 400],
                '5': [1210, 500]
            },
            '4': {
                '1': [190, -10],
                '2': [380, -10],
                '3': [570, -10],
                '4': [760, -10],
                '5': [950, -10]
            }
        }


        // получаем рандомом сторону нашего поля с которой появится самолет
        let side = getRandomInt(1, 5);
        // подмигиваем красным цветом с той стороны где появитсяя самолет
        if (side === 1) {
            playingField.style.borderLeftColor = "red";
            setTimeout(function () {
                playingField.style.borderLeftColor = "white"
            }, 500)
        } else if (side === 2) {
            playingField.style.borderBottomColor = "red";
            setTimeout(function () {
                playingField.style.borderBottomColor = "white"
            }, 500)
        } else if (side === 3) {
            playingField.style.borderRightColor = "red"
            setTimeout(function () {
                playingField.style.borderRightColor = "white"
            }, 500)
        } else if (side === 4) {
            playingField.style.borderTopColor = "red"
            setTimeout(function () {
                playingField.style.borderTopColor = "white"
            }, 500)
        }
        // добавляем 2 точки (выбранные рандомом) из нашего поля в массив для пути
        let array = createRandomPath(startPoints[side][getRandomInt(1, 6)], startPoints[getRandomInt(1, 5)][getRandomInt(1, 6)]);
        //создаем самолет -то что будет летать
        let plane = document.createElementNS('http://www.w3.org/2000/svg', "circle");
        plane.setAttribute("cx", "");
        plane.setAttribute("cy", "");
        plane.setAttribute("stroke", "red");
        plane.setAttribute("stroke-width", "3");
        plane.setAttribute("stroke-opacity", "0");
        //от типа устанавливаем размер и ссылку на картинку - они подтягиваются в доме - тэг defs
        if (this.ty === 1) {
            plane.setAttribute("r", "20");
            plane.setAttribute("fill", "url(#plane1)");
        } else if (this.ty === 2) {
            plane.setAttribute("r", "15");
            plane.setAttribute("fill", "url(#plane3)");
        } else if (this.ty === 3) {
            plane.setAttribute("r", "15");
            plane.setAttribute("fill", "url(#vert1)");
        }
        // присваиваем переменной тип тип самолета - потому что потом до него не достучаться
        let type = this.ty;
        //присваиваем айди самолету чтобы доставать потом его
        plane.id = this.id;
        if (this.id === 0) {
            //записываем время старта первого самолета как старт приложения
            gameStart = new Date().getTime();
        }
        let aM = document.createElementNS('http://www.w3.org/2000/svg', "animateMotion");
        //устанавливаем путь для самолета и крутим автоматически
        let pathForLength = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathForLength.setAttribute("fill", "none")
        pathForLength.setAttribute("stroke", "none");
        pathForLength.setAttribute("d", array.join(" "));
        let lengt = pathForLength.getTotalLength();
        aM.setAttribute("path", array.join(" "));
        aM.setAttribute("rotate", "auto");
        // устанавливаем начало движение  +3 -потому что первый самолет создастся через 3 сек после запуска страницы
        if (this.id === 0) {
            aM.setAttribute("begin", "3s");
        } else {
            aM.setAttribute("begin", (new Date().getTime() - gameStart) / 1000 + 3 + "s");
        }
        aM.setAttribute("repeatCount", "1");
        //регулируем скорость самолетов - естанавливая им за сколько они должны пройти
        let speed = 0;
        if (this.ty === 1) {
            speed = lengt / 50;
            aM.setAttribute("dur", speed + "s");
        } else if (this.ty === 2) {
            speed = lengt / 50 * 1.5;
            aM.setAttribute("dur", speed + "s");
        } else if (this.ty === 3) {
            speed = lengt / 50 * 2;
            aM.setAttribute("dur", speed + "s");
        }
        // присваиваем этому пути айдишник как у самолета но добавляем буквы
        aM.setAttribute("id", "path" + this.id);
        //запихиваем все в дом
        plane.appendChild(aM);
        playingField.appendChild(plane);
        //добавляем на нажатие самолета функцию
        plane.addEventListener("mousedown", addLine, true);

        function addLine(e) {
            let k = [];
            let s = [];
            //проверяем двигался самолет сам или по нашим путям - если  сам то удаляем его пути если по нашим путям то удаляем их
            let lineMove = document.getElementById("lineMove" + this.id);
            let lineForLength = document.getElementById("lengthLine" + this.id);
            if (lineMove !== null) {
                lineMove.parentNode.removeChild(lineMove);
            }
            if (lineForLength !== null) {
                lineForLength.parentNode.removeChild(lineForLength);
            }
            //создаем новую линию
            lineMove = document.createElementNS("http://www.w3.org/2000/svg", "path");
            lineMove.setAttribute("fill", "none")
            lineMove.setAttribute("stroke", "white");
            lineForLength = document.createElementNS("http://www.w3.org/2000/svg", "path");
            lineForLength.setAttribute("fill", "none")
            lineForLength.setAttribute("stroke", "none");
            //удаляем наш самолеи и создаем новый
            plane.setAttribute("stroke", "blue");
            plane.setAttribute("stroke-opacity", "1");
            //устанавливаем в новый самолет координаты клика и добавляем функцию на движение мыши
            plane.setAttribute("cx", "");
            plane.setAttribute("cy", "");
            plane.addEventListener("mousedown", addLine, true);
            //и создаем новую линию (тут другая M......L......)
            lineMove.id = "lineMove" + this.id;
            lineForLength.id = "lengthLine" + this.id;
            k.push("M " + (window.event.offsetX) + " " + (window.event.offsetY));
            s.push("M")
            s.push(window.event.offsetX)
            s.push(window.event.offsetY)
            s.push("L")
            s.push(window.event.offsetX)
            s.push(window.event.offsetY)
            s.push("L")
            s.push(window.event.offsetX)
            s.push(window.event.offsetY)
            lineMove.setAttribute("d", s.join(" "));
            lineForLength.setAttribute("d", k.join(" "));
            aM.setAttribute("path", k.join(" "));
            // устанавливаем начало движение  +3 -потому что первый самолет создастся через 3 сек после запуска страницы
            aM.setAttribute("begin", (new Date().getTime() - gameStart) / 1000 + "s");
            //регулируем скорость самолетов - естанавливая им за сколько они должны пройти путь
            if (this.ty === 1) {
                aM.setAttribute("dur", "700");
            } else if (this.ty === 2) {
                aM.setAttribute("dur", "1000");
            } else if (this.ty === 3) {
                aM.setAttribute("dur", "5s");
            }
            // присваиваем этому пути айдишник как у самолета но добавляем буквы
            //запихиваем все в дом
            $(playingField).prepend(lineMove);
            $(playingField).prepend(lineForLength);
            // присваиваем этому пути айдишник как у самолета но добавляем буквы
            aM.setAttribute("id", "path" + this.id);
            let ready = false;
            e.stopPropagation();
            e.preventDefault();
            let planeId = this.id;
            window.onmousemove = function () {
                let field2 = rect.getBoundingClientRect();
                let leftSideField = field2.left;
                let rightSideField = field2.right;
                let bottomSideField = field2.bottom;
                let topSideField = field2.top;
                let x1 = this.event.offsetX;
                let y1 = this.event.offsetY;
                let lineMove = document.getElementById("lineMove" + planeId);
                if (lineMove !== null) {
                    s = lineMove.getAttribute("d").split(" ")
                }
                //по движению мыши добавляем координаты в линию
                if (lineMove !== null && !ready) {
                    //s.push("L");
                    //s.push((this.event.offsetX) + " " + (this.event.offsetY));
                    k.push("L");
                    k.push((this.event.offsetX) + " " + (this.event.offsetY));
                    aM.setAttribute("path", k.join(" "));

                    s.push("L");
                    s.push((this.event.offsetX));
                    s.push(this.event.offsetY);
                    lineMove.setAttribute("d", s.join(" "));
                    lineForLength.setAttribute("d", k.join(" "));
                    let lengt = parseInt(lineForLength.getTotalLength());
                    let fullTime;
                    if (lengt && lengt > 2) {
                        if (type === 1) {
                            fullTime = lengt / 50;
                            aM.setAttribute("dur", fullTime + "s");
                        } else if (type === 2) {
                            fullTime = lengt / 50 * 1.5;
                            aM.setAttribute("dur", fullTime + "s");
                        } else if (type === 3) {
                            fullTime = lengt / 50 * 2;
                            aM.setAttribute("dur", fullTime + "s");
                        }
                    }
                    let speed;
                    let rt = lineMove.getAttribute("d").split(" ");
                    let lengt1 = parseInt(lineMove.getTotalLength());
                    let lengt2 = parseInt(lineForLength.getTotalLength());
                    speed = lengt2 / fullTime;
                    let time = (new Date().getTime() - (gameStart + parseInt(aM.getAttribute("begin")) * 1000)) / 1000;
                    // console.log(lengt2)
                    let lengt3 = lengt2 - speed * time;
                    //console.log(lengt3)
                    let vector;
                    if (rt.length > 5) {
                        vector = Math.sqrt(Math.pow((parseInt(rt[5]) - parseInt(rt[2])), 2) + Math.pow((parseInt(rt[4]) - parseInt(rt[1])), 2));
                    }
                    if (rt.length > 5 && (lengt1 - vector) > lengt3) {
                        rt.shift()
                        rt.shift();
                        rt.shift();
                        rt[0] = "M";
                    }
                    lineMove.setAttribute("d", s.join(" "));
                    e.stopPropagation();
                    e.preventDefault();

                }
            };

            //по отпускании мыши  - останавливаем запись координат
            window.onmouseup = function () {
                let lengt = parseInt(lineForLength.getTotalLength());
                if (lengt && lengt > 2) {
                    if (type === 1) {
                        aM.setAttribute("dur", lengt / 50 + "s");
                    } else if (type === 2) {
                        aM.setAttribute("dur", lengt / 50 * 1.5 + "s");
                    } else if (type === 3) {
                        aM.setAttribute("dur", lengt / 50 * 2 + "s");
                    }
                }
                plane.setAttribute("stroke-opacity", "0");
                plane.tryIt1 = true;
                ready = true;

            }

        }
    }

    drive() {
        //достаем линию и самолет
        let lineMove = document.getElementById("lineMove" + this.id);
        let lineForLength = document.getElementById("lengthLine" + this.id)
        let aM = document.getElementById("path" + this.id);
        let plane = document.getElementById(this.id);
        if (lineMove !== null) {
            let speed;
            let fullTime;
            if (plane.tryIt1) {
                fullTime = parseInt(aM.getAttribute("dur"))
            }
            let lengt1 = parseInt(lineMove.getTotalLength());
            let lengt2 = parseInt(lineForLength.getTotalLength());
            speed = lengt2 / fullTime;
            let time = (new Date().getTime() - (gameStart + parseInt(aM.getAttribute("begin")) * 1000)) / 1000;
            // console.log(lengt2)
            let lengt3 = lengt2 - speed * time;
            //console.log(lengt3)

            let s = lineMove.getAttribute("d").split(" ");
            //создаем и заполняем массив в котором будет путь нашей линии
            if (plane) {
                let vector;
                if (s.length > 5) {
                    vector = Math.sqrt(Math.pow((parseInt(s[5]) - parseInt(s[2])), 2) + Math.pow((parseInt(s[4]) - parseInt(s[1])), 2));
                }
                if (s.length > 5 && (lengt1 - vector) > lengt3 + 20 && plane.tryIt1) {
                    //console.log(lengt1 + "    " + lengt2 + "     " + (lengt3) + "    " + time)
                    s.shift();
                    s.shift();
                    s.shift();
                    s[0] = "M";
                }
                //перемещаем самолет и подрезаем линию
                //если нлиния закончилась удаляем самолет и линию из дома и создаем самолет и его рандомный путь заново как выше
                if (s.length < 4) {
                    lineMove.parentNode.removeChild(lineMove);
                    let aM = document.getElementById("path" + this.id);
                    let array = createRandomPath(s[s.length - 2], s[s.length - 1]);
                    plane.setAttribute("cx", "");
                    plane.setAttribute("cy", "");
                    aM.setAttribute("path", array.join(" "));
                    aM.setAttribute("begin", (parseInt(((new Date().getTime()) - gameStart) / 1000) + "s"));
                    lineForLength.setAttribute("d", array.join(" "))
                    let lengt = parseInt(lineForLength.getTotalLength());
                    if (lengt && lengt > 2) {
                        if (this.ty === 1) {
                            aM.setAttribute("dur", lengt / 50 + "s");
                        } else if (this.ty === 2) {
                            aM.setAttribute("dur", lengt / 50 * 1.5 + "s");
                        } else if (this.ty === 3) {
                            aM.setAttribute("dur", lengt / 50 * 2 + "s");
                        }
                    }
                    //запускаем эту же функцию опять
                    setTimeout(this.drive.bind(this), 100);
                } else {
                    lineMove.setAttribute("d", s.join(" "));
                    setTimeout(this.drive.bind(this), 100);

                }
            }
        } else {
            setTimeout(this.drive.bind(this), 100);
        }
    }
}


let addTimeaou = setTimeout(add, 5000);
let tt = 0;
let allPlanes = [];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//запускаем создание самолетов 1-ый через 3 се после запуска приложения остальные через 5 сек после каждого
function add() {
    clearTimeout(addTimeaou);
    addTimeaou = 0;
    //создаем самолеты с айди и рандомным типом
    let plane = new Plane(tt, getRandomInt(1, 4));
    //добавляем все самолеты в массив чтобы проверять их потом на сталкивание и посадку
    allPlanes.push(plane);
    tt++;
    addTimeaou = setTimeout(add, 5000);
}

let checkTimeoutCrash = setTimeout(checkingCrash, 3000);

//проверяем на сталкивание
function checkingCrash() {
    //получаем массив самолетов
    let toCheck = allPlanes;
    let toBreak = false;
    //получаем координаты поля - чтобы сталкивались только в нем
    let field = playingField.getBoundingClientRect();
    let leftSideField = field.left + parseInt(playingFieldStyle.borderWidth);
    let rightSideField = field.right - parseInt(playingFieldStyle.borderWidth);
    let bottomSideField = field.bottom - parseInt(playingFieldStyle.borderWidth);
    let topSideField = field.top + parseInt(playingFieldStyle.borderWidth);
    clearTimeout(checkTimeoutCrash);
    checkTimeoutCrash = 0;
    //если самолетов больше 1 начинаем маслать
    if (toCheck.length > 1) {
        for (let i = 0; i < toCheck.length; i++) {
            let XY;
            if (toCheck[i]) {
                //получаем 1 ый самолет для проверки
                XY = document.getElementById(toCheck[i].id);
                if (XY) {
                    //получаем координаты самолета на экране
                    let themCoord = XY.getBoundingClientRect();
                    let x1 = parseFloat(themCoord.left) + (parseFloat(themCoord.right) - parseFloat(themCoord.left)) / 2;
                    let y1 = parseFloat(themCoord.top) + (parseFloat(themCoord.bottom) - parseFloat(themCoord.top)) / 2;
                    for (let j = 0; j < toCheck.length; j++) {
                        if (i !== j) {
                            let XY1;
                            if (toCheck[i] && toCheck[j]) {
                                //получаем 2 самолет и его координаты
                                XY1 = document.getElementById(toCheck[j].id);
                                if (XY1) {
                                    let themCoord1 = XY1.getBoundingClientRect();
                                    let x2 = parseFloat(themCoord1.left) + (parseFloat(themCoord1.right) - parseFloat(themCoord1.left)) / 2;
                                    let y2 = parseFloat(themCoord1.top) + (parseFloat(themCoord1.bottom) - parseFloat(themCoord1.top)) / 2;
                                    //если самолеты в поле
                                    if (themCoord.right < rightSideField && themCoord.left > leftSideField && themCoord.bottom < bottomSideField && themCoord.top > topSideField) {
                                        if (themCoord1.right < rightSideField && themCoord1.left > leftSideField && themCoord1.bottom < bottomSideField && themCoord1.top > topSideField) {
                                            //задаем радиусы
                                            let r1 = 0;
                                            let r2 = 0;
                                            if (toCheck[j].ty === 1) {
                                                r2 = (20 * transformCorrection);
                                            } else if (toCheck[j].ty === 2) {
                                                r2 = (15 * transformCorrection);
                                            } else if (toCheck[j].ty === 3) {
                                                r2 = (15 * transformCorrection);
                                            }
                                            if (toCheck[i].ty === 1) {
                                                r1 = (20 * transformCorrection);
                                            } else if (toCheck[i].ty === 2) {
                                                r1 = (15 * transformCorrection);
                                            } else if (toCheck[i].ty === 3) {
                                                r1 = (15 * transformCorrection);
                                            }
                                            //находим длину вектора(расстояние между самолетами)
                                            let qw = Math.pow((parseInt(x2) - parseInt(x1)), 2);
                                            let we = Math.pow((parseInt(y2) - parseInt(y1)), 2);
                                            let vector = Math.sqrt(qw + we);
                                            //столкнулись
                                            if (vector < (r1 + r2)) {
                                                XY.setAttribute("fill", "red");
                                                XY1.setAttribute("fill", "red");
                                                //останавливаем перебор и вызываем функцию стоп
                                                if (window.confirm(`Вы проиграли, ваш результат: ${planes}, хотите начать заново ?`)) {
                                                    bestResultWrite();
                                                    restart();
                                                }
                                                stopAll();
                                                toBreak = true;
                                                break;
                                            } else {
                                                //подсвечиваем красным если самолеты близко
                                                if (vector < (r1 + r2 + (40 * transformCorrection))) {
                                                    XY.setAttribute("stroke", "red");
                                                    XY1.setAttribute("stroke", "red");
                                                    XY.setAttribute("stroke-opacity", "1");
                                                    XY1.setAttribute("stroke-opacity", "1");
                                                    setTimeout(function () {
                                                        XY.setAttribute("stroke", "blue");
                                                        XY1.setAttribute("stroke", "blue");
                                                        XY.setAttribute("stroke-opacity", "0");
                                                        XY1.setAttribute("stroke-opacity", "0");
                                                    }, 100)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                    if (toBreak) {
                        break;
                    }
                }
            }

        }
    }
    if (!toBreak) {
        checkTimeoutCrash = setTimeout(checkingCrash, 1);
    }
}

function stopAll() {
    console.log("STOP");
    //останавливаем функцию проверки посадки и врезания
    clearTimeout(addTimeaou);
    addTimeaou = 0;
    clearTimeout(checkTimeoutCrash);
    checkTimeoutCrash = 0;
    for (let i = 0; i < allPlanes.length; i++) {
        if (allPlanes[i]) {
            //удаляем пути и линии чтобы самолеты остановились
            let plane = document.getElementById("path" + allPlanes[i].id);
            if (plane) {
                plane.parentNode.removeChild(plane);
            }
            let plane1 = document.getElementById("line" + allPlanes[i].id);
            if (plane1) {
                plane1.parentNode.removeChild(plane1);
            }
        }
    }
}

let checkTimeoutLand = setTimeout(checkingLand, 10);

//массив для хранения последних координат перед посадкой
let landed = {};
//создаем прямоуголиники для получения координат успешной посадки
let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect.setAttribute("x", parseInt(playingFieldStyle.width) / 2 - 50 + '');
rect.setAttribute('y', parseInt(playingFieldStyle.height) / 2 + 25 + '');
rect.setAttribute("width", 35);
rect.setAttribute("height", 22);
rect.setAttribute("fill", "none");
playingField.appendChild(rect);

let rect1 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect1.setAttribute("x", parseInt(playingFieldStyle.width) / 2 + 295 + '');
rect1.setAttribute('y', parseInt(playingFieldStyle.height) / 2 + 120 + '');
rect1.setAttribute("width", 20);
rect1.setAttribute("height", 20);
rect1.setAttribute("fill", "none");
playingField.appendChild(rect1);

let rect2 = document.createElementNS("http://www.w3.org/2000/svg", "rect");
rect2.setAttribute("x", parseInt(playingFieldStyle.width) / 2 + 210 + '');
rect2.setAttribute('y', parseInt(playingFieldStyle.height) / 2 - 40 + '');
rect2.setAttribute("width", 35);
rect2.setAttribute("height", 35);
rect2.setAttribute("fill", "none");
playingField.appendChild(rect2);

function checkingLand() {
    //получаем координаты прямоугольников для посадки
    let field2 = rect.getBoundingClientRect();
    let leftSideField = field2.left;
    let rightSideField = field2.right;
    let bottomSideField = field2.bottom;
    let topSideField = field2.top;

    let field3 = rect1.getBoundingClientRect();
    let leftSideField1 = field3.left;
    let rightSideField1 = field3.right;
    let bottomSideField1 = field3.bottom;
    let topSideField1 = field3.top;

    let field4 = rect2.getBoundingClientRect();
    let leftSideField2 = field4.left;
    let rightSideField2 = field4.right;
    let bottomSideField2 = field4.bottom;
    let topSideField2 = field4.top;

    clearTimeout(checkTimeoutLand);
    checkTimeoutLand = 0;
    for (let i = 0; i < allPlanes.length; i++) {
        if (allPlanes[i]) {
            //проверяем есть лы в массиве что то с именем самолета - если нет то добавляем имя
            if (!(allPlanes[i].id in landed)) {
                landed[allPlanes[i].id] = [];
            }
            let XY = document.getElementById(allPlanes[i].id);
            if (XY) {
                let themCoord = XY.getBoundingClientRect();
                let x1 = parseFloat(themCoord.left) + (parseFloat(themCoord.right) - parseFloat(themCoord.left)) / 2;
                let y1 = parseFloat(themCoord.top) + (parseFloat(themCoord.bottom) - parseFloat(themCoord.top)) / 2;
                let line = document.getElementById("lineMove" + allPlanes[i].id);
                //если влетел в 1 прямоугольник, есть линия, и тип самолета 1
                if (x1 < rightSideField && x1 > leftSideField && y1 < bottomSideField && y1 > topSideField && line !== null && allPlanes[i].ty === 1) {
                    //если самолет сместился по прямоугольнику добавляем след координаты по Х в массив
                    if (landed[allPlanes[i].id][landed[allPlanes[i].id].length - 1] !== x1) {
                        landed[allPlanes[i].id].push(x1);
                    }
                    //если координат больше 3 то каждая след больше пред то начинаем посадку
                    if (landed[allPlanes[i].id].length > 2 &&
                        landed[allPlanes[i].id][landed[allPlanes[i].id].length - 1] > landed[allPlanes[i].id][landed[allPlanes[i].id].length - 2] &&
                        landed[allPlanes[i].id][landed[allPlanes[i].id].length - 2] > landed[allPlanes[i].id][landed[allPlanes[i].id].length - 3]) {
                        //задаем в линию новые координаты
                        let array = line.getAttribute("d").split(" ");
                        let number1 = array[1];
                        let number2 = array[2];
                        let newArray = [];
                        line.setAttribute("opacity", "0")
                        for (let i = 0; i < 30; i++) {
                            if (i === 0) {
                                newArray.push("M " + number1 + " " + number2)
                            } else if (i > 0 && i < 10) {
                                number1 = parseInt(number1) + 5;
                                newArray.push("L " + number1 + " " + number2)
                            }
                            else if (i > 9 && i < 20) {
                                number1 = parseInt(number1) + 5;
                                newArray.push("L " + number1 + " " + number2)
                            } else if (i > 19) {
                                number1 = parseInt(number1) + 5;
                                newArray.push("L " + number1 + " " + number2)
                            }
                        }
                        line.setAttribute("d", newArray.join(" "));
                        //меняем видимость самолета
                        let plane = document.getElementById(allPlanes[i].id);
                        delete allPlanes[i];
                        setTimeout(function () {
                            plane.setAttribute("opacity", "0.66")
                            setTimeout(function () {
                                plane.setAttribute("opacity", "0.33")
                                setTimeout(function () {
                                    line.parentNode.removeChild(line)
                                    plane.parentNode.removeChild(plane);
                                    planes = planes + 1;
                                    document.getElementById('score').innerHTML = `NickName: ${userName} Planes: ${planes}`;
                                }, 500)
                            }, 500)
                        }, 500)
                    }

                }
                //все как у самолета 1 го типа
                if (x1 < rightSideField1 && x1 > leftSideField1 && y1 < bottomSideField1 && y1 > topSideField1 && line !== null && allPlanes[i].ty === 2) {
                    console.log("come");
                    if (landed[allPlanes[i].id][landed[allPlanes[i].id].length - 1] !== x1) {
                        landed[allPlanes[i].id].push(x1);
                    }
                    if (landed[allPlanes[i].id].length > 2 &&
                        landed[allPlanes[i].id][landed[allPlanes[i].id].length - 1] > landed[allPlanes[i].id][landed[allPlanes[i].id].length - 2] &&
                        landed[allPlanes[i].id][landed[allPlanes[i].id].length - 2] > landed[allPlanes[i].id][landed[allPlanes[i].id].length - 3]) {
                        let array = line.getAttribute("d").split(" ");
                        let number1 = array[1];
                        let number2 = array[2];
                        let newArray = [];
                        line.setAttribute("opacity", "0")
                        for (let i = 0; i < 30; i++) {
                            if (i === 0) {
                                newArray.push("M " + number1 + " " + number2)
                            } else if (i > 0 && i < 10) {
                                number1 = parseInt(number1) + 3;
                                number2 = parseInt(number2) - 3;
                                newArray.push("L " + number1 + " " + number2)
                            }
                            else if (i > 9 && i < 20) {
                                number1 = parseInt(number1) + 3;
                                number2 = parseInt(number2) - 3;
                                newArray.push("L " + number1 + " " + number2)
                            } else if (i > 19) {
                                number1 = parseInt(number1) + 3;
                                number2 = parseInt(number2) - 3;
                                newArray.push("L " + number1 + " " + number2)
                            }
                        }
                        console.log(newArray.toString())
                        line.setAttribute("d", newArray.join(" "));
                        let plane = document.getElementById(allPlanes[i].id);
                        delete allPlanes[i];
                        setTimeout(function () {
                            plane.setAttribute("opacity", "0.66")
                            setTimeout(function () {
                                plane.setAttribute("opacity", "0.33")
                                setTimeout(function () {
                                    line.parentNode.removeChild(line)
                                    plane.parentNode.removeChild(plane);
                                    planes = planes + 1;
                                    document.getElementById('score').innerHTML = `NickName: ${userName} Planes: ${planes}`;
                                }, 500)
                            }, 500)
                        }, 500)
                    }

                }
                //все как у самолета 1 го типа
                if (x1 < rightSideField2 && x1 > leftSideField2 && y1 < bottomSideField2 && y1 > topSideField2 && line !== null && allPlanes[i].ty === 3) {
                    if (landed[allPlanes[i].id][landed[allPlanes[i].id].length - 1] !== x1) {
                        landed[allPlanes[i].id].push(x1);
                    }
                    if (landed[allPlanes[i].id].length > 2) {
                        let array = line.getAttribute("d").split(" ");
                        let number1 = array[1];
                        let number2 = array[2];
                        let newArray = [];
                        for (let i = 0; i < 30; i++) {
                            if (i === 0) {
                                newArray.push("M " + number1 + " " + number2)
                            } else {
                                newArray.push("L " + number1 + " " + number2)
                            }
                        }
                        console.log(newArray.toString())
                        line.setAttribute("d", newArray.join(" "));
                        let plane = document.getElementById(allPlanes[i].id);
                        delete allPlanes[i];
                        setTimeout(function () {
                            plane.setAttribute("opacity", "0.66")
                            setTimeout(function () {
                                plane.setAttribute("opacity", "0.33")
                                setTimeout(function () {
                                    line.parentNode.removeChild(line)
                                    plane.parentNode.removeChild(plane);
                                    planes = planes + 1;
                                    document.getElementById('score').innerHTML = `NickName: ${userName} Planes: ${planes}`;
                                }, 500)
                            }, 500)
                        }, 500)
                    }

                }
            }

        }

    }
    checkTimeoutLand = setTimeout(checkingLand, 10);
}

// Работа меню

function transformCorrectionF() {

    let node = $("#runway")[0];
    let transform = new WebKitCSSMatrix(window.getComputedStyle(node).transform);
    if (transform.a < 0.3) {
        transformCorrection = 0.3;
    } else {
        transformCorrection = transform.a;
    }
}

function getUserName() {
    userName = prompt('Введите имя пользователя: ');
    if (userName != null) {
        if (!userName) {
            getUserName();
        }
        sessionStorage.setItem('name', userName);
        startGame();
    }
}

function startGame() {
    sessionStorage.setItem('restart', false);
    $('#menu').hide('slow');
    $('#game').show('slow');
    document.getElementById('score').innerHTML = `NickName: ${userName} Planes: ${planes}`;
    setTimeout(add(), 3000);
    transformCorrectionF();
}

function exit() {
    if (window.confirm("Вы уверены что хотите выйти ?")) {
        window.close();
    }
}

function pause() {
    window.alert('Pause')
}

function restartConfirm() {
    if (window.confirm('вы уверены что хотите начать игру заново ?')) {
        restart();
    }
}

function restart() {
    sessionStorage.setItem('name', userName);
    sessionStorage.setItem('restart', true);
    window.location.reload("true");
}

function bestResultWrite() {
    let best = localStorage.getItem('bestR');
    if (best < planes) {
        localStorage.setItem('bestN', userName);
        localStorage.setItem('bestR', planes);
    }
}

function getBestResult() {
    let name = localStorage.getItem('bestN');
    let result = localStorage.getItem('bestR');
    window.alert(`Best Result : UserName ${name} result: ${result}`);
}

var resize = function (e) {
    transformCorrectionF();
    console.log(transformCorrection);
};
(function () {
    var time;
    window.onresize = function (e) {
        if (time)
            clearTimeout(time);
        time = setTimeout(function () {
            resize(e);
        }, 1000);
    }
})();


