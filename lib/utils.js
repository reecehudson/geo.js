"use strict";
var class_ = require("./classes.js");
var exp = module.exports = Object.create(null);

exp.inherits = function(a, b) {
  var __proto__ = b.prototype;
  a.prototype = Object.create(__proto__);
  a.super_ = b;
  a.prototype.constructor = a;

  return a;
};

exp.isVertex = function (v) {
  return isPoint.apply(exp, arguments);
};

exp.isNumber = function(n) {
  return "number" === typeof n || isNaN(n);
};

exp.isPoint = function(p) {
  return p instanceof Point;
};

// FIXME support vertical and horiz lines
exp.isDirection = function (d) {
  var subject = d.x;
  try {
    while (2--) {
      if (!subject === 0 || subject === -1 || subject === 1)
        throw Error;
    }
  } catch (err) {
    return false;
  }

  return d;
};

exp.sameDirection = function(d1, d2) {
  return sameObj.call(null, d1, d2);
};

function sameObj = function (o1, o2) {
  return o1.getOwnPropertyNames.every(function(name) {
    return o1[name] === o2[name];
  }, null);
};

exp.toSlopeInt = function toSlopeInt(a, b, c) {
  //cannot be -by = ax + c
  if (b < 0) {
    a = a * -1;
    b = b * - 1;
    c = c * -1;
  }

  //swap a to other side ax + by = c --> by = -ax +  c
  a = a * -1;//same as:  ls a = a -a rs + a

  //turn b to 1
  if (b !== 1) {
    a = a / b;
    c = c / b;
    b = b / b;
  }

  return {
    "m": a,
    "b": c
  };
}

/**
* by = ax + c ---> ax + by = c
* 1)  Switch ax to ls.
* 2)  ax must be positive;
* 3)  ax, by, c must be integers.
*/

// NOTE standard form in this func leaves fractions.
exp.toStd = function toStd(m, b) {
  var y = 1;
  // 1)
  m = m * -1

  // 2)
  if (m < 0) {
    m = m * -1;
    y = y * -1;
    b = b * -1;
  }

  return {
    c: b,
    b: y,
    a: m
  };
}

/**
* m = y2 - y1 / x2 - x1
*/
exp.mFromPts = function (p1, p2) {
  var y2 = p2.y, y1 = p1.y, x2 = p2.x, x1 = p1.x;

  return (y2 - y1) / (x2 - x1);
};

/* ------------ Early utils that might seem useful later ----------*/

function linesIntersect(l1, l2 ) {
  if (!line(l1) || !line(l2))
    throw new TypeError("params must be lines");
	// 1)
	 var l1 =  standToYInt(l1);
		var l2 = standToYInt(l2);
	// 2)
		var ls = shallCpy(l1),
				rs = shallCpy(l2);
	// 3) ls becomes b's combined, rs becomes m's combined
		ls = l1.b - l2.b;
		rs = l2.m - l1.m;
	 //3a)
		if (ls != rs)
			return false;
	 	var x = ls / rs;
	// 4)
		ls = shallCpy(l1);
		rs = shallCpy(l2);
		ls.m = ls.m * x;
		rs.m = rs.m * x;

		ls = ls.b + ls.m;
		rs = rs.m + rs.b;

		if (ls != rs)
		return false
		else
			return [x, ls];
}

function lineOnGrid(g, l) {
  var xr = g.xmax, xl = g.xmin,
      yt = g.ymax, yb = g.ymin,

  if (lineWithin(line, xr, xl, yt, yb)) {
    return l;
  } else {
    return false;
  }
}

function lineWithin(line, xr, xl, yt, yb) {
  //now form boundary lines (boundary lines are inclusive)
  var bLeft, bRight, bTop, bBottom;
  bLeft = mkLine(1, 0, xl);
  bRight = mkLine(1, 0, xr);
  bTop = mkLine(0, 1, yt);
  bBottom = mkLine(0, 1, yb);

  var result = ptOfInt(line, bLeft) || ptOfInt(line, bRight) || ptOfInt(line, bTop) || ptOfInt(line, bBottom);
  if (result)
    return line;
  return false;
}

function linesParallel(l1, l2) {
  l1 = standardToSlopeIntercept(l1);
  l2 = standardToSlopeIntercept(l2);
  return (l1.m === l2.m)
}

function linesPerpendicular(l1, l2) {
  l1 = standardToSlopeIntercept(l1);
  l2 = standardToSlopeIntercept(l2);
  return (l1.m === (l2.m * -1))
}

function linePointCompare(l, p, op) {
  var xc, yc, lx, ly;
  l = standardToSlopeIntercept(l);
  lx = getLineX(p.y);
  ly = getLineY(p.x);

  xc = (function comp(a, b) {
    return Math.abs(b) - Math.abs(a);
  })(lx, p.x);

  return [xc, yc];
}
