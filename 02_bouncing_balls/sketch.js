// Daniel Shiffman
// Matter.js + p5.js Examples
// This example is based on examples from: http://brm.io/matter-js/

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Composite = Matter.Composite;
var Composites = Matter.Composites;

var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var world;
var bodies;

var canvas;

var mouseConstraint;

function setup() {
  canvas = createCanvas(800, 600);

  // Mouse positions don't align
  // But it does work if I force pixel density of 1
  pixelDensity(1);
  // Can I instead tell mouse to divide its xy by 2?

  // create an engine
  engine = Engine.create();
  world = engine.world;

  var mouse = Mouse.create(canvas.elt);
  var mouseParams = {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
    }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  World.add(world, mouseConstraint);

  var params = {
    isStatic: true
  }
  var ground = Bodies.rectangle(width / 2, height, width, 1, params);
  var wall1 = Bodies.rectangle(0, height / 2, 1, height, params);
  var wall2 = Bodies.rectangle(width, height / 2, 1, height, params);
  var top = Bodies.rectangle(width / 2, 0, width, 1, params);
  World.add(world, ground);
  World.add(world, wall1);
  World.add(world, wall2);
  World.add(world, top);

  function makeCircle(x, y) {
    var params = {
      restitution: 0.7,
      friction: 0.2
    }
    return Bodies.circle(x, y, 32, params);
  }

  // x, y, columns, rows, column gap, row gap
  //var stack = Composites.stack(20, 50, 15, 10, 20, 20, makeCircle);
  var stack = Composites.stack(20, height/2, 7, 3, 50, 50, makeCircle);
  bodies = stack.bodies;

  // add all of the bodies to the world
  World.add(world, stack);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(51);
  stroke(255);
  strokeWeight(1);
  fill(255, 50);
  for (var i = 0; i < bodies.length; i++) {
    var circle = bodies[i];
    var pos = circle.position;
    var r = circle.circleRadius;
    var angle = circle.angle;
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    ellipse(0, 0, r * 2);
    line(0, 0, r, 0);
    pop();
  }

  var a = mouseConstraint.constraint.pointA;
  var bodyB = mouseConstraint.constraint.bodyB;
  if (bodyB) {
    strokeWeight(2);
    stroke(255);
    line(a.x, a.y, bodyB.position.x, bodyB.position.y);
  }
}
