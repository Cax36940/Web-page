/* 
    This file implements the main primitives used to draw
    It is inspired by p5.js
    It's purpose is to simplify the creation of drawings, while keeping full control over the implementation 
*/

///// Global Variables /////

const PI = 3.141592653589793238462643383279

// context2D of current canvas is a global variables for easy access

const ctx = {
    value: null,
    get: function () {
        if (this.value === null) {
            throw new Error("current context2D is undefined");
        }
        return this.value;
    },
    set: function (newContext) {
        if (newContext instanceof CanvasRenderingContext2D) {
            this.value = newContext;
        } else {
            this.value = null;
        }
    }
};

// width and height are references to the width and height of the canvas

const width = {
    get: function () {
        return ctx.get().canvas.width;
    }
};

const height = {
    get: function () {
        return ctx.get().canvas.height;
    }
};


// background color is used when the canvas is resized
let backgroundColor = "#FFFFFF" // white

// text color
let textFillColor = "#000000" // black


///// Canvas Setup Functions /////

/**
 * Create a canvas element and adds it inside another element
 * @param {string} place id of the element in which the canvas will be added
 * @param {number} width width of the canvas
 * @param {number} height height of the canvas
 * @param {string} name id of the canvas element
 */

function createCanvas(place, width, height, name) {

    // Get the container element
    let canvasContainer = document.getElementById(place);
    if (canvasContainer === null) {
        throw new Error("Container ${place} does not exists");
    }

    // Initialise canvas
    if (document.getElementById(name) !== null) {
        throw new Error("An element with id : ${name} already exists");
    }

    let canvas = document.createElement("canvas");
    canvas.id = name;
    canvas.width = width;
    canvas.height = height;

    // Add canvas to html page
    canvasContainer.appendChild(canvas);

    // Initialise context
    ctx.set(canvas.getContext("2d"));

}

///// Parameter Modifiers /////


/**
 * Check if argument is a valid CSS color value
 * @param {string} color
 * @returns
 */
function isValidColor(color) {
    const s = new Option().style;
    s.color = color;
    return s.color !== "";
}

/**
 * Change stroke color
 * @param {string} color
 */
function stroke(color) {
    if (!isValidColor(color)) {
        throw new Error("Invalid fill color used");
    }
    ctx.get().strokeStyle = color;
}

/**
 * Disable stroke
 */
function noStroke() {
    // Change the color to a transparent one
    fill("#FFFFFF00");
}

/**
 * Change the width of strokes
 * @param {number} weight
 */
function strokeWeight(weight) {
    if (weight < 0) {
        throw new Error("Invalid stoke width value")
    }
    ctx.get().lineWidth = weight;
}

/**
 * Change fill color
 * @param {string} color
 */
function fill(color) {
    if (!isValidColor(color)) {
        throw new Error("Invalid fill color used");
    }
    ctx.get().fillStyle = color;
}

/**
 * Returns current fill color
 */
function getFillColor() {
    return ctx.get().fillStyle;
}


/**
 * Disable shape filling
 */
function noFill() {
    // Change the color to a transparent one
    fill("#FFFFFF00");
}


///// Primitive Shapes /////


/**
 * Draw a point at coord (x, y)
 * @param {number} x
 * @param {number} y
 */
function point(x, y) {
    // To get a point of a precise size we make a filled circle with no stroke

    if (!isValidColor(tmp_fill_color)) {
        throw new Error("Invalid fill color used");
    }

    // Save color

    let tmp_fill_color = ctx.get().fillStyle

    // Draw circle of size lineWidth
    fill(ctx.get().strokeStyle);
    ctx.get().beginPath();
    ctx.get().arc(x, y, ctx.get().lineWidth / 2, 0, 2 * Math.PI);
    ctx.get().fill();


    // Load back saved colors
    fill(tmp_fill_color);

}

/**
 * Draw a line from coord (x1, y1) to (x2, y2)
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
function line(x1, y1, x2, y2) {
    ctx.get().beginPath();
    ctx.get().moveTo(x1, y1);
    ctx.get().lineTo(x2, y2);
    ctx.get().stroke();
}

/**
 * Draw a rectangle
 * @param {number} x x coordinates of top left corner
 * @param {number} y y coordinates of top left corner
 * @param {number} w width of the rectangle
 * @param {number} h height of the rectangle
 */
function rect(x, y, w, h) {
    ctx.get().beginPath();
    ctx.get().rect(x, y, w, h);
    ctx.get().fill();
    ctx.get().stroke();

}

/**
 * Draw a square
 * @param {number} x x coordinates of top left corner
 * @param {number} y y coordinates of top left corner
 * @param {number} s side length of the square
 */
function square(x, y, s) {
    rect(x, y, s, s);
}

/**
 * Draw a circle with center (x,y) and diameter d
 * @param {number} x
 * @param {number} y
 * @param {number} d
 */
function circle(x, y, d) {
    ctx.get().beginPath();
    ctx.get().arc(x, y, d / 2, 0, 2 * Math.PI);
    ctx.get().fill();
    //ctx.get().stroke();

}


///// Text Functions /////


/**
 * Change the alignement of the text
 * @param {string} horizontal "left" || "right" || "center" || "start" || "end"
 * @param {string} vertical "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom"
 */
function textAlign(horizontal = "center", vertical = "middle") {
    if (!["left", "right", "center", "start", "end"].includes(horizontal)) {
        throw new Error("Invalid horizontal alignment");
    }
    if (!["top", "hanging", "middle", "alphabetic", "ideographic", "bottom"].includes(vertical)) {
        throw new Error("Invalid vertical alignment");
    }

    ctx.get().textAlign = horizontal;
    ctx.get().textBaseline = vertical;

}

/**
 * Set the font of the text
 * @param {string} font valid CSS font value
 */
function textFont(font) {
    ctx.get().font = font;

    // If the font is not valid, the default CSS behaviour is to not change it
    if (font !== ctx.get().font) {
        throw new Error("Font not valid");
    }

}

/**
 * Change text color
 * @param {*} color
 */
function textColor(color) {
    if (!isValidColor(color)) {
        throw new Error("Invalid text fill color used");
    }
    textFillColor = color;
}

/**
 *
 * @returns The current font size
 */
function textSize() {
    return parseInt(ctx.get().font.match(/\d+px/)[0].replace("px", ""));
}

/**
 *
 * @param {*} str
 * @returns Width taken by the string str in the canvas
 */
function textWidth(str) {
    return ctx.get().measureText(str).width;
}

/**
 * Draw text at (x, y), color can be changed with fill()
 * @param {string} txt
 * @param {number} x
 * @param {number} y
 */
function text(txt, x, y) {
    const tmp = ctx.get().fillStyle
    ctx.get().fillStyle = textFillColor;
    ctx.get().fillText(txt, x, y);
    ctx.get().fillStyle = tmp;
}


///// Usefull functions /////


/**
 * Draw the background in a uniform color
 * @param {string} color
 */
function background(color) {
    if (!isValidColor(color)) {
        throw new Error("Invalid background fill color used");
    }

    backgroundColor = color;

    // Save current color

    const tmp = ctx.get().fillStyle
    ctx.get().fillStyle = color;

    // Draw a filled rectangle the size of the canvas
    ctx.get().beginPath();
    ctx.get().rect(0, 0, width.get(), height.get());
    ctx.get().fill();

    // Load saved color
    ctx.get().fillStyle = tmp;

}

function hsl_hex(h, s, l) {
    // Convert the saturation and lightness from percentage to a range of 0 to 1
    s /= 100;
    l /= 100;

    // Calculate the chroma
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    // Determine the intermediate RGB values based on the hue
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }

    // Adjust RGB values based on the lightness
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // Convert the RGB values to a hex string
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}