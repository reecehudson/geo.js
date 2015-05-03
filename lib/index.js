"use strict";
/* ------- requisites, definitions ----------- */
var utils = require("./utils.js");
var assert = require("assert");
var format = require("util").format;
// global environment variables used for visual components
var log = (function bootLog() {
  if (console.log) {
    return function() {
      return console.log.apply(console, arguments);
    };
  }
  else if (process.stdout) {
    return function() {
      return process.stdout.write(format.apply(null, arguments) + "\n");
    };
  }
  else
    return function noop() {};
}())

var err = (function bootErr() {
  if (console.err) {
    return function() {
      var args = Array.prototype.slice.call(arguments, 0, arguments.length -1);
      var exit = arguments[arguments.length -1];
      console.err.apply(console, args);
      exit ? process.exit(1) : void 0;
      return;
    }
  }
  else if (process.stderr) {
    return function() {
      var args = [].slice.call(arguments, 0, arguments.length -1);
      var exit = arguments[arguments.lengt -1];
      process.stderr.write(format.apply(null, ars), + "\0x0020");
      exit ? process.exit(1) : 0;
      return;
    };
  }
  else
    return function noop() {};
})()

Math.sq = function (n) {
  return Math.pow(n, 2);
};

/* --------- Class definitions ----------- */

function Point(x, y) {
  if (isNaN(x) || isNaN(y) || x === Infinity || y === Infinity)
    throw new TypeError("Bad arguments");
  this.x = +x;
  this.y = +y;
}

//this in relation to p2, closest to right
Point.prototype.cmpX = function(p2) {
  return ptCmp(this.x, p2.x);
};
// closest to top
Point.prototype.cmpY = function(p2) {
  return ptCmp(this.y, p2.y);
};

function ptCmp(n1, n2) {
  if (n1 > n2)
    return 1;
  else if (n1 < n2)
    return -1;
  else
    return 0;
}

// closest to top center (0, 0)
Point.prototype.cmpXY = function(p2) {
  return cmpXY(0, 0, this, p2);
};

//closest to x, y
function cmpXY(x, y, p1, p2) {
  var home = new Point(x, y);

  var d1, d2;
  d1 = home.dist(p1);
  d2 = home.dist(p2);

  return ptCmp(d1, d2);
}

//FIXME acknowledge on-the-liners
Point.prototype.quadrant = function() {
  var res;
  var x = this.x, y = this.y;

  if (x > 0) {
    //either quad 1 or 4
    if (y > 0)
      res 1;
    else
      res 4;
  }
  else if (x < 0){
    //either quad 2 or 3
    if (y > 0)
      res 2;
    else
      res 3;
  }
  else {
    // on y-int
    if (y )
  }
  //TMP line
  if (res == undefined)
    console.warn("Point.quadrant() on-liner");

  return res;
};

//d = sqrt((x2 - x1)^2 + (y2 - y1)^2)
Point.prototype.dist = function(p2) {
  return ptsDist(this.x, this.y, p2.x, p2.y);
};

function ptsDist(x1, y1, x2, y2) {
  return Math.sqrt(Math.sq(x2 - x1) + Math.sq(y2 - y1));
};

//from this to p2
Point.prototype.direction = function (p2) {
  var d = Object.create(null);

  d.x = this.cmpX(p2) * -1;
  d.y = this.cmpY(p2) * -1;

  return d;
};

function Line(a, b, c) {
  var a, b, c, m, b, tmp;
  var toSlopeInt = utils.toSlopeInt;
  var toStd = utils.toStd;

  if (arguments.length === 3) {
    a = +a;
    b = +b;
    c = +c;
    //convert to slope-int
    tmp = toSlopeInt(a, b, c);
    m = tmp.m;
    b = tmp.b;
  }
  else if (arguments.length === 2) {
    m = +a;
    b = +b;
    //convert to standart
    tmp = toStd(m , b);
    a = tmp.a;
    b = tmp.b;
    c = tmp.c;
  }
  else
    throw new TypeError("Bad arguments.");

  this.a = a;
  this.b = b;
  this.c = c;
  this.m = m;
  this.b = b;
}

Line.prototype.fx = function fx(x) {
  return this.m * x + this.b;
};

Line.prototype.fy = function fy(y) {
  var m, b;

  m = m * -1;
  y = y * -1;

  return y/m + b/m;
};

Line.prototype.isPt = function isPt(p) {
  if (p.y === this.fx(p.x))
    return true;
  else
    return false;
};

// TODO support m, b
util.inherits(Ray, Line);
function Ray(d, v, a, b, c) {
  this.v1 = v1;
  this.d = d;
  this.a = a;
  this.b = b;
  this.c = c;
};

Ray.prototype.fx = function (x) {
  var p2, p2d;
  var orig = this.constructor.super_.prototype.fx;

  var y = orig.call(this, x);
  p2 = new Point(x, y);
  p2d = p2.direction();
  // same or no direction
  if (utils.sameDirection(this.d, p2d) || (p2d.x === 0 && p2d.y === 0)) {
    return y;
  }
  else
    return false;
};

Ray.prototype.fy = function (y) {
  var p2, p2d;
  var orig = this.constructor.super_.prototype.fy;

  var x = orig.call(p2, y);
  p2 = new Point(x, y);
  p2d = p2.direction();
  // same or no direction
  if (utils.sameDirection(this.d, p2d) || (p2d.x === 0 && p2d.y === 0)) {
    return y;
  }
  else
    return false;
}

Ray.prototype.isPt = function (p) {
  if (this.fx(p.x) === false)
    return false
  else
    return true
};

function LineSegment(p1, p2) {
  var a, b, c, m, b;

  m = utils.mFromPts(p1, p2);
  // plug in
  y = p1.y;
  x = p1.x;
  // b = y + -(mx)
  var mx = m * x
  mx = mx * -1;
  b = y + mx;

  this.v1 = p1;
  this.v2 = p2;
  this.m = m;
  this.b = b;

  var std = utils.toStd(m, b);
  this.a = std.a;
  this.b = std.b;
  this.c = std.c;

  // consider segment and do accordingly to b
  // 1) b no null only if pts are:  one 2/3 other 1/4 or on y-int
}

/**
 * Overwrite fx and fy to suit a line segment, only diff being that they return
 * false if point os past the vertex.
 */

LineSegment.prototype.fx = function (x) {
  var orig = Line.prototype.fx,
      ret = false, val, tempPt;

      val = orig.call(this, x);
      tempPt = new Point(x, val);
      if (this.isPt(tempPt)) {
        ret = val;
      }

      return ret;
};

LineSegment.prototype.fy = function(y) {
  var orig = Line.prototype.fy, ret = false;
  var x, tPt;

  x = orig.call(this, y);
  tPt = new Point(x, y);
  if (this.isPt(tPt)) {
    ret = x;
  }

  return ret;
};

LineSegment.prototype.isPt = function (p) {
  var vstack = [v1, v2],
      dstack = [v1.direction(v2), v2.direction(v1)],
      pd, cd, d, res = true;

  for (var i = 0; i < 2 && res; i++) {
    cd = dstack[i];
    cv = vstack[i];

    switch (cd[i].x) {
      case 0:
        res = cv.x === p.x;
        break;
      case 1:
        res = p.x >= cv.x;
        break;
      case -1:
        res = p.x <= cv.x;
        break
    }
  }

  return res;
};

function Polygon() {
  if (arguments.length < 3)
    throw new Error("Polygon must have more than 2 verticees.");
  this.center = arguments[0];// used for direction in operations
  var vertices = this.vertices = [].slice.call(arguments, 1);
}

Polygon.prototype.ptOnPerim = function (pt) {
  var loop = this.verticees, seg, iPeak = loop.length;

  loop[loop.length] = loop[0];

  for (var i = 0; i < iPeak; i++) {
    seg = new LineSegment(loop[i], loop[i +1]);
    if (seg.isPt(pt))
      return true;
    else
      continue;
  }

  return false;
};

/**
 *  1) Collect random point from boundary.
 *  2) Draw line from random point to `pt`.
 *  3) If any other boundary comes before pt:  invalid.
 */
Polygon.prototype.ptWithin = function (pt, inc) {

};

util.inherits(Triangle, Polygon);
function Triangle(p1, p2, p3) {
  var c = // find center somehow
  Polygon.apply(this, [c].concat(arguments));
}

Triangle.prototype.angles

util.inherits(Square, Polygon);
function Square(p1, p2, p3, p4) {
  if (this ! instanceof Square)
    return new Square(p1, p2, p3, p4);
  Polygon.apply(this, arguments);
}

function Rectangle() {
  //keep in mind, square is a rectangel but recantel is not a square,  use
  //these similarities to automize
}
