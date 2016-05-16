var a=0;
var rot = 0;
var tareas = [];  
var star;
var ship1;
var ship1Burnt;
var rock;
var rockPat;
var corner, border;
var cloud1;
var cloud2;
var cloud3;
var cloud4;
var cloud5;
var starsCol;
var sky;
var nubes;
var ouch;

var FPS = 60.0;
var MSPF = 1000.0/FPS;
var scale = 1;

var game = {};
game.createWorld = function(level, size)
  {
  var gravity = new Box2D.Common.Math.b2Vec2(0, 0);
  game.world = new Box2D.Dynamics.b2World(gravity, true);
  level(game.world);
    Box2D.Common.b2Settings.b2_maxTranslation = 6.0;
    Box2D.Common.b2Settings.b2_maxTranslationSquared = 36.0;
  game.particles = [];
  };
game.convertArray = function (a)
  {
  var na = [];
  for (var i = 0; i<a.length; i++)
    {
    var v = new Box2D.Common.Math.b2Vec2();
    v.Set(a[i][0]*scale,a[i][1]*scale);
    na.push(v);
    }
  return na;
  };
game.createShip = function(w, x, y)
  {
  var p = [[0,17],[-10,-8],[10,-8]];
  game.playerShip = game.createPoly(w, x, y, p, false);
  game.playerShip.isPlayerShip = true;
  game.playerShip.GetFixtureList().paint = function(c)
    {
    var img = this.burnt? ship1Burnt : ship1;
    var cp = this.GetBody().GetPosition().Copy();
    //cp.Add(this.GetBody().GetLocalCenter());
    c.save();
    c.translate(cp.x, cp.y);
    c.rotate(3.1415+game.playerShip.GetAngle());
    c.drawImage(img, -10*scale, -17*scale, 20*scale, 25*scale);
    c.restore();
    //drawFixture(this,c);
    //c.stroke();
    }
  };
game.createPoly = function(w, x, y, points, fixed)
  {
  var polyBd = new Box2D.Dynamics.b2BodyDef();
  polyBd.position.x = x;
  polyBd.position.y = y;

  if (fixed)
    polyBd.type = Box2D.Dynamics.b2Body.b2_staticBody;
  else
    polyBd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  //polyBd.position.Set(x,y);
  var b = w.CreateBody(polyBd);
  var f = b.CreateFixture2(Box2D.Collision.Shapes.b2PolygonShape.AsArray(game.convertArray(points), points.length), 1);
  f.SetFriction(0.7);
  f.SetRestitution(.15);
  var fd = f.m_filter;
  fd.categoryBits = 0x0001;
  fd.maskBits = 0x0003;

  return b;
  };
game.createProp = function (w, x, y)
  {
  var ballSd = new Box2D.Collision.Shapes.b2CircleShape(5);
  //ballSd.density = 1.0;
  //ballSd.radius = 5;
  //ballSd.restitution = 1.0;
  //ballSd.friction = 0;
  //ballSd.groupIndex = -1;
  var ballBd = new Box2D.Dynamics.b2BodyDef();
  ballBd.type = Box2D.Dynamics.b2Body.b2_staticBody;
  //ballBd.AddShape(ballSd);
  //ballBd.position.Set(x,y);
  var b = w.CreateBody(ballBd);
  var f = b.CreateFixture2(ballSd, 0);
  var fd = f.m_filter;
  fd.categoryBits = 0x0100;
  fd.maskBits = 0x0000;
  fd.groupIndex = -8;
  b.SetPosition(new Box2D.Common.Math.b2Vec2(x, y));

  //b.SetActive(false);
  return b;
  }
game.createParticle = function (w, x, y)
  {
  var ballSd = new Box2D.Collision.Shapes.b2CircleShape(1*scale);
  var ballBd = new Box2D.Dynamics.b2BodyDef();
  ballBd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  var b = w.CreateBody(ballBd);
  var f = b.CreateFixture2(ballSd, 0.1);
  f.SetFriction(0.05);
  f.SetRestitution(0.05);
  var fd = f.m_filter;
  fd.categoryBits = 0x2;
  fd.maskBits = 0x0001;

  b.SetPosition(new Box2D.Common.Math.b2Vec2(x, y));
  //b.SetActive(false);
  return b;
  }
game.createBody = function(w, x, y, polys, fixed)
  {
  var polyBd = new Box2D.Dynamics.b2BodyDef();
  polyBd.position.x = x;
  polyBd.position.y = y;
  var b = w.CreateBody(polyBd);
  if (fixed)
    polyBd.type = Box2D.Dynamics.b2Body.b2_staticBody;
  else
    polyBd.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

  for (var j = 0; j< polys.length; j++)
    {
    var f =b.CreateFixture2(Box2D.Collision.Shapes.b2PolygonShape.AsArray(game.convertArray(polys[j]), polys[j].length), 1);
    f.SetFriction(0.7);
    f.SetRestitution(0);
    }
  return b;
  };
paintStar = function(c)
  {
  var b = this.GetBody();
  var p = b.GetPosition();
  var t = b.ttl;
  c.drawImage(star, p.x-t/2, p.y-t/2, t, t);
  };
function paint(aabb)
  {
  var gradient = game.ctx.createRadialGradient(0, 0, 1600, 0, 0, 2300);

  
  starPat = game.ctx.createPattern(rock1, 'no-repeat');
  game.ctx.fillStyle = starPat;
  for (var i = 0; i < sky.length; i++)
    {
    var star = sky[i]
    game.ctx.save();
    game.ctx.translate(star.x, star.y);
    var dif = 0;
    game.ctx.drawImage(starsCol, Math.floor(star.img)*16,0,16,16, star.x-dif, star.y-dif, star.size+dif, star.size+dif);
    //game.ctx.fillRect(star.x-dif, star.y-dif, star.size+dif, star.size+dif);
    game.ctx.restore();
    }


  gradient.addColorStop(0, '#FF6600');
  gradient.addColorStop(0.25, '#884488');
  gradient.addColorStop(0.6, '#000066');
  gradient.addColorStop(1, '#000000');
  game.ctx.fillStyle = gradient;
  fillCircle(0, 0, 2200);

  drawWorld(game.world, game.ctx, aabb);
    
 // for (var i = 0; i < game.particles.length; i++)
    //game.particles[i].paint();

  paintNube(nubes[3], game.ctx);
  paintNube(nubes[4], game.ctx);

  for (var ni = 0; ni < nubes.length; ni++)
    nubes[ni].rot += nubes[ni].dir;
  }
var totalStepTime = 0;
var totalFrameTime = 0;
var stepCount = 0;
var avgMSPS = 0;
var avgMSPF = 0;
var fps = 0, lastFps = 0;
var lastTime = new Date().getTime();
var skipped = 0, totalSkips = 0, skipsLastSecond=0;

var FFT, lfp=0;
var firstFrame = true;
game.step = function ()
  {
  var tft = new Date().getTime();
  if (firstFrame)
    {
    FFT = tft;
    firstFrame = false;
    }
  var tfn = Math.floor((tft-FFT)/MSPF);
  skipped = tfn-lfp-1;
  if (skipped<0)
    {
    lfp = tfn;
    var nextFrameTime = (lfp+1)*MSPF + FFT;
    var nextFrameIn = Math.ceil(nextFrameTime - new Date().getTime());
    if (nextFrameIn<0)
      {
      nextFrameIn =0;
      //nextFrameIn += MSPF;
      }
    setTimeout(game.step, nextFrameIn);
    skipped=0;
    return;
    }
  totalSkips += skipped;

  var stepping = false;
  var timeStep = (1)/FPS;
while (skipped>=0)
  {
  //ejecutar tareas agendadas
  var tareasviejas = tareas;
  tareas = [];
  for (var ti = 0; ti<tareasviejas.length; ti++)
    tareasviejas[ti]();

  //avanzar paso
  controlShip(game.playerShip, timeStep);
  game.world.Step(timeStep, 1,1);
  game.world.ClearForces();
  stepParticles(game.particles);
  handleCollisions();
    skipped--;
  }
  // pintar pantalla
  game.ctx.save();
  game.ctx.setTransform(1,0,0,1,0,0);
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

  //Create a radial gradient.
  var aabb=game.setCamera();
  var frameTime = new Date().getTime();
  totalStepTime += frameTime - tft;
  if (game.goodGraphics)
    paint(aabb);
  //game.ctx.setStroke = 'white';
  if (game.debugGraphics)
    game.world.DrawDebugData();

  totalFrameTime += new Date().getTime() - frameTime;
  stepCount++;
  if (stepCount===20)
    {
    stepCount = 0;
    avgMSPS = totalStepTime/20;
    avgMSPF = totalFrameTime/20;
    totalStepTime = totalFrameTime = 0;
    }
  fps++;
  var newTime = new Date().getTime();
  if ((newTime-lastTime) > 1000)
    {
    lastFps = fps;
    fps = 0;
    skipsLastSecond = totalSkips;
    totalSkips = 0;
    lastTime = newTime;
    }
  lfp = tfn;
  var nextFrameTime = (lfp+1)*MSPF + FFT;
  var nextFrameIn = Math.ceil(nextFrameTime - new Date().getTime());
  if (nextFrameIn<0)
    {
    nextFrameIn =0;
    //nextFrameIn += MSPF;
    }
  setTimeout(game.step, nextFrameIn);

  game.ctx.restore();
  //agendar ejecucion del prox paso
  game.ctx.setTransform(1,0,0,1,0,0);
  game.ctx.font = '10pt sans-serif';
  game.ctx.fillStyle = '#0f0';
  game.ctx.fillText('fps: '+ lastFps + ', frame:'+avgMSPF+'ms, step: '+avgMSPS + 'skip: '+skipped+' last: '+skipsLastSecond,20,20);
  game.ctx.fillText('speed: '+ Math.round(game.playerShip.GetLinearVelocity().Length(),4),20,40);
  var lc = game.playerShip.GetLocalCenter();
    game.ctx.fillText('lfp: '+lfp,20,60);
    game.ctx.fillText('particles: '+game.particles.length,20,80);
  }
//var nube = {width:0, height:0, rot:0, height:2000, dir:0, img:null};
function paintNube(n, ctx)
  {
  var sn = Math.sin(n.rot);
  var cn = Math.cos(n.rot);
  var x = sn*n.alt;
  var y = cn*n.alt;

  ctx.save();
  ctx.translate(x,y);
  ctx.shadowColor = 'rgba(0,0,0,.5)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 6;
  ctx.shadowOffsetY = 6;
  ctx.globalAlpha = 0.2;
  ctx.drawImage(n.img,-n.width/2,-n.height/2, n.width, n.height);
  ctx.globalAlpha = 0;
  ctx.restore();
  }
game.setCamera = function()
  {
  var s = game.playerShip;
  var cp = s.GetPosition().Copy();
  //cp.Add(s.GetLocalCenter());
  return cameraTransform(cp.x,cp.y);
  }
function cameraTransform(x,y)
  {
  var z=(x*x+y*y);
  var m = Math.sqrt(z);
  z = 2200*2200/z;
  if (z>4)
    z =4;
  var a = z*y/m;
  var b = -z*x/m;
  var e = game.canvas.width/2;
  var f = game.canvas.height/2+m*z*0.95;
  game.matrix = {a:a, b:b, e:e, f:f};
  game.ctx.setTransform(a, b, b,-a, e, f);

  var aabb = new Box2D.Collision.b2AABB();
  aabb.lowerBound.Set(x-e/z*1.4, y - e/z*1.4);
  aabb.upperBound.Set(x+e/z*1.4, y + e/z*1.4);
  return aabb;
  }
function centerTransform(x,y)
  {
  var m = Math.sqrt((x*x+y*y));
  var a = y/m;
  var b = -x/m;
  var e = 0;
  var f = m;
  game.matrix = {a:a, b:b, e:e, f:f};
  game.ctx.setTransform(a, b, b,-a, e, f);
  }
function controlShip (s, timeStep)
  {
  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var p = s.GetPosition().Copy();
  var lv = s.GetLinearVelocity();
  var r = s.GetAngle();
  var av = s.GetAngularVelocity();
  //p.Add(s.GetLocalCenter());

  if (chorro)
    {
    if (a<(s.burnt?0.08:0.25))  //crece hasta 20
      a += 60*timeStep;
    // actualizar velocidad de acuerdo a chorro
    // actualizar combustible de acuerdo a chorro
    //s.f -= 3*s.a/20;
    }
  else if (a>0)  //disminuye hasta 0
    a -= 60*timeStep;
 
  if (a>0)
    {
    lv.Add(new Box2D.Common.Math.b2Vec2(-Math.sin(r)*a, Math.cos(r)*a));
    s.SetAwake(true);
    for (var i=0; i < a; i++)
      {
      var b = game.createParticle(game.world, p.x + 4*Math.sin(r), p.y - 4*Math.cos(r));
      b.GetFixtureList().paint = paintStar;
      b.SetLinearVelocity(new b2Vec2(lv.x+240*Math.sin(r)+(Math.random()-0.5)*60, lv.y-240*Math.cos(r)+(Math.random()-0.5)*60));
      b.ttl = Math.floor(Math.random()*10) + 10;
      //var pv = b2Vec2(60*(Math.random() - 0.5)*lv.Length()*timeStep, (Math.random() - 0.5)*60*timeStep);
      /*var pt =
        {
        x: p.x + 10*Math.sin(r),// + Math.random() * 10,
        y: p.y - 10*Math.cos(r),
        dx: lv.x/FPS + 2*Math.sin(r) +(Math.random() - 0.5)*60*timeStep, //+ pv.x*Math.sin(r)-pv.y*Math.cos(r),
        dy: lv.y/FPS - 2*Math.cos(r) +(Math.random() - 0.5)*60*timeStep,// + pv.x*Math.cos(r)-pv.y*Math.sin(r),
        ttl: Math.floor(Math.random()*10) + 10//, // time to live in frames
        paint: paintStar
        };*/
      game.particles.push(b);
      }
    }

  if (rot!=0)
    {
    av -= rot/(s.burnt?20:5);
    s.SetAwake(true);
    }

  if (s.IsAwake())
    {
    var m = Math.sqrt(p.x*p.x+p.y*p.y);
    var mx = (-8*timeStep*p.x/m);
    var my = (-8*timeStep*p.y/m);
    lv.Add(new b2Vec2(mx,my));
    }
  // aminorar velocidad rotacion
  av *= s.burnt? 1:0.99;
  //if (Math.abs(av) > Number.MIN_VALUE && lv.Length() >Number.MIN_VALUE)

  s.SetAngularVelocity(av);
  }
function paintRock(c)
  {
  c.fillStyle = rockPat;
  drawFixture(this, c);
  c.fill();
  }
function fillCircle (x, y, r)
  {
  var c = game.ctx;
  var o = c.globalCompositeOperation;
  c.beginPath();
  c.arc(x, y, r, 0, 270, false);
  c.fill();
  c.globalCompositeOperation = o;
  }
function centerText(msg)
  {
  game.ctx.font = 'bold 40px Arial, sans-serif';
  game.ctx.fillStyle = 'red';
  game.ctx.textAlign = 'center';
  game.ctx.fillText(msg, 320, 240);
  }
function handleCollisions()
  {
  var cl = game.world.GetContactList();
  while (cl != null)
    {
    if (!cl.IsTouching())
      {
      cl = cl.GetNext();
      continue;
      }
    var ba = cl.GetFixtureB().GetBody();
    var bap = ba.GetPosition();
    var bav = ba.GetLinearVelocity();
    var m = cl.GetManifold();
    var p = m.m_points;
    var mni = 0;
    for (var j = 0; j<p.length; j++)
      {
      var ni = p[j].m_normalImpulse;
      mni = Math.max(mni, ni);
      if (ni > 2000)  // sparks
        for (var ip=0; ip < 5; ip++)
          {
          var pt =
            {
            x: m.m_localPoint.x,
            y: m.m_localPoint.y,
            dx: m.m_localPlaneNormal.x * ni/4000 - m.m_localPlaneNormal.y * p[j].m_tangentImpulse/1000 + Math.random() - 0.5,
            dy: m.m_localPlaneNormal.y * ni/4000 + m.m_localPlaneNormal.x * p[j].m_tangentImpulse/1000 + Math.random() - 0.5,
            ttl: Math.floor(Math.random()*10) + 10, // time to live in frames
            paint: paintStar
            };
          game.particles.push(pt);
          }
      if (ni > 4000)  // explosions
        {
        var spawn = function (cuadros, x, y, r)
          {
          if (cl != null)
            {
            cl.m_fixtureA.burnt = true;
            cl.m_fixtureB.burnt = true;
            cl.m_fixtureA.m_body.burnt = true;
            cl.m_fixtureB.m_body.burnt = true;
            }
          if (cuadros === 0)
            return;
          for (var ip=0; ip <1; ip++)
            {
            var ttl1 = Math.floor(Math.random()*5) + 20;
			//*
			var b = game.createParticle(game.world, bap.x , bap.y );
			b.dx = Math.random() - 0.5,
            b.dy = Math.random() - 0.5,
			b.GetFixtureList().ttl1 = ttl1;
			b.GetFixtureList().ttl = ttl1;
			b.GetFixtureList().paint = function(c)
			  {
              var b = this.GetBody();
              var p = b.GetPosition();
		      var c2=cuadros/5;
              game.ctx.fillStyle = 'rgb(255,'+Math.floor(256*ttl1/25)+',0)';
              fillCircle(p.x, p.y, (this.ttl1 - this.ttl)*c2);
			  }/*
            var pt =
              {
              x: bap.x+(Math.random() - 0.5)*r*10,
              y: bap.y+(Math.random() - 0.5)*r*10,
              dx: Math.random() - 0.5,
              dy: Math.random() - 0.5,
              ttl1: ttl1,
              ttl: ttl1, // time to live in frames
              paint: function ()
                {
                var c2=cuadros/5;
                game.ctx.fillStyle = 'rgb(255,'+Math.floor(256*ttl1/25)+',0)';
                fillCircle(this.x, this.y, (this.ttl1 - this.ttl)*c2);
                }
              };*/
            game.particles.push(pt);
//            tareas.push(function() {spawn(cuadros-1, game.playerShip.GetCenterPosition().x, game.playerShip.GetCenterPosition().y,r+1);});
            tareas.push(function() {spawn(cuadros-1, m.m_localPoint.x, m.m_localPoint.y,r+1);});
            }
          }
        spawn(Math.floor(5+(ni-4000)/800), p[j].m_localPoint.x, p[j].m_localPoint.y,10);
        }
      if (mni > 2000 && !game.playerShip.GetFixtureList().burnt )
        {
        //$('consola').innerHTML += '<p>Ouch!';

        var b = game.createParticle(game.world, bap.x , bap.y );
        //b.SetLinearVelocity(bav.Copy().Multiply(0.1));
        b.GetFixtureList().paint = function(c)
          {
          var b = this.GetBody();
          var p = b.GetPosition();
          c.save();
          c.translate(p.x,p.y);
          c.scale(1,-1);
          c.rotate(0);
          c.globalAlpha = Math.min(1,b.ttl/45);
          //c.globalAlpha = 0.25;
          c.drawImage(ouch,-32,-32,32,32);
          c.globalAlpha = 1;
          c.restore();
          };
        //b.SetLinearVelocity(new b2Vec2(lv.x+240*Math.sin(r)+(Math.random()-0.5)*60, lv.y-240*Math.cos(r)+(Math.random()-0.5)*60));
        b.ttl = 90;
        game.particles.push(b);
        }
      //centerText(mc);
      }
    cl = cl.GetNext();
    }
  }
function stepParticles(particles)
  {
  for (var i=0; i < particles.length; i++) 
    {
    particles[i].ttl = particles[i].ttl - 1;
    if (particles[i].ttl > 0)
      {
      //particles[i].x = particles[i].x + particles[i].dx;
      //particles[i].y = particles[i].y + particles[i].dy;
      }
    else
      {
      game.world.DestroyBody(particles[i]);
      particles.splice(i, 1);
      i = i-1;
      }
    }
  }


