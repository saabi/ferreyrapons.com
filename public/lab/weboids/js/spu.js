var $spu = {};
var $ppu = {};
var $vpu = {};
$spu.ppu = $ppu;
$ppu.vpu = $vpu;
/*
$spu.concavity = function concavity(shape)
  {
  return 0; //{value: max concavity of all vertices, witness: vertexindex]
  }

$spu.decompose = function (shape,t)
  {
  var c = this.concavity();
  if (c.value < t)
    return shape;
  else
    {
    this.resolve(shape, c.witness);
    for (var i = 0; i<shape.length; i++)
      decompose(shape, t);
    return true;
    }
  }
  
$spu.resolve = function (shape, w)
   {
   //if (w
   }
*/
$spu.create = function()
  {
  var shape =
  {
  vertices: [], // array of [x,y] arrays
  polys: []  // array of arrays of vertex indices
  };
  return shape;
  }
$spu.boundingBox = function (shape)
  {
  var vs = shape.vertices;
  var vsl = vs.length;
  var x=vs[0][0], y=vs[0][0];
  var mx=x, my=y;
  for (var i = 1; i<vsl; i++)
    {
    x = Math.min(x, vs[i][0]);
    y = Math.min(y, vs[i][1]);
    mx = Math.max(mx, vs[i][0]);
    my = Math.max(my, vs[i][1]);
    }
  return {x:x, y:y, width:mx-x, height:my-y};
  }
$spu.translate = function (shape, dx, dy)
  {
  var vs = shape.vertices;
  var vsl = vs.length;
  for (var i = 0; i<vsl; i++)
    {
    var v = vs[i];
    v[0] += dx;
    v[1] += dy;
    }
  };
$spu.scale = function (shape, sx, sy)
  {
  var vs = shape.vertices;
  var vsl = vs.length;
  for (var i = 0; i<vsl; i++)
    {
    var v = vs[i];
    v[0] *= sx;
    v[1] *= sy;
    }
  };
$spu.rotate = function (shape, r)
  {
  var vs = shape.vertices;
  var vsl = vs.length;
  var cr = Math.cos(r);
  var sr = Math.sin(r);
  for (var i = 0; i<vsl; i++)
    {
    var v=vs[i];
    var vx = v[0], vy = v[1];
    v[0] += vx*cr - vy*sr;
    v[1] += vx*sr + vy*cr;
    }
  };
$spu.makeccw = function (shape)
  {
  var ps = shape.polys;
  var vs = shape.vertices;
  var psl = ps.length;
  var area = this.ppu.area;
  for (var i = 0; i<psl; i++)
    if (area(ps[i], vs)>0)
      ps[i] = ps[i].reverse();
  };
$spu.load = function (shape, points)
  {
  var bi = shape.vertices.length;
  shape.vertices = shape.vertices.concat(points);
  var p = [], i = 0, pl = points.length;
  while (i<pl)
    {
    p.push(i+bi);
    i++;
    }
  shape.polys.push(p);
  }
$spu.clean = function (shape, d)
  {
  var nps = [];
  var ps = shape.polys;
  var psl = shape.polys.length;
  //for (var i = 0; i<psl; i++)
    //if (this.ppu.area(shape, i)!=0.0)
      //nps.push(ps[i]);
  for (var i = 0; i<ps.length; i++)
    ps[i] = $ppu.clean(ps[i], shape.vertices, d*d);
  //shape.polys = nps;
  };
$spu.split = function (shape, pi, vi1, vi2)
  {
  //if (Math.abs(vi2-vi1)<2)
    //throw "can't split adjacent vertices";
  if (vi1>vi2) //swap
    {
    //vi1 = vi1 + vi2;
    //vi2 = vi1 – vi2;
    //vi1 = vi1 – vi2;
    var tvi = vi1;
    vi1 = vi2;
    vi2 = tvi;
    }
  return this.ppu.split(shape.polys[pi]);
  };
$spu.splice = function (shape, pi1, vi1, pi2, vi2)
  {
  //if (pi1==pi2)
    //throw "can't specify the same polygons";
  var p1 = shape.polys[pi1];
  var p2 = shape.polys[pi2];
  var area = this.ppu.area;
  if (area(p1, shape.vertices)>0)
    {
    p1 = p1.reverse();
    vi1 = p1.length - vi1;
    }
  if (area(p2, shape.vertices)<0)
    {
    p2 = p2.reverse();
    vi2 = p2.length - vi2;
    }
  return this.ppu.splice(p1,vi1,p2,vi2);
  };
$spu.part = function (shape, l, d)
  {
  var vs = shape.vertices;
  var ps = shape.polys;
  var psl = ps.length;
  var nps = [];
  for (var i = 0; i<psl; i++)
    {
    var p = this.ppu.part(ps[i], vs, l, d);
    nps = nps.concat(p);
    }
  //var nps1 = this.ppu.part(nps[nps.length-1], vs, 40, -80);
  //nps = nps.concat(nps1);
  shape.polys = nps;
  };
$spu.toPolys = function(shape)
  {
  var vs = shape.vertices;
  var ps = shape.polys;
  var psl = ps.length;
  var nps = [];
  for (var i = 0; i<psl; i++)
    nps.push(this.ppu.toPoints(ps[i],vs));
  return nps;
  };
$spu.fill = function (shape, ctx)
  {
  var vs = shape.vertices;
  var ps = shape.polys;
  var psl = ps.length;
  ctx.beginPath();
  for (var i = 0; i<psl; i++)
    {
    var p = ps[i];
    var pl = p.length;
    ctx.moveTo(vs[p[0]][0],vs[p[0]][1]);
    for (var j = 0; j<pl; j++)
      {
      var v = vs[p[j]];
      ctx.lineTo(v[0], v[1]);
      }
    }
  ctx.fill();
  }
$spu.stroke = function (shape, ctx)
  {
  var vs = shape.vertices;
  var ps = shape.polys;
  var psl = ps.length;
  for (var i = 0; i<psl; i++)
    this.ppu.stroke(ps[i], vs, ctx);
  }
$ppu.stroke = function (p, vs, ctx)
  {
  ctx.beginPath();
  ctx.moveTo(vs[p[0]][0],vs[p[0]][1]);
  var pl = p.length;
  for (var i = 1; i<pl; i++)
    {
    var v = vs[p[i]];
    ctx.lineTo(v[0], v[1]);
    }
  ctx.lineTo(vs[p[0]][0],vs[p[0]][1]);
  ctx.stroke();
  };
$ppu.area = function (p,v)
  {
  var a = 0.0;
  var pl = p.length;
  for (var i=0; i<pl; i++)
    {
    j = (i + 1) % pl;
    var vi = v[p[i]], vj = v[p[j]];
    a -= vj[0] * vi[1] - vi[0] * vj[1];
    }
  return a / 2;
  };
$ppu.split = function (p, vi1, vi2)
  {
  return [p.slice(vi1, vi2-vi1), p.slice(vi2-p.length).concat(p.slice(0,vi1))];
  }
$ppu.splice = function (p1, vi1, p2, vi2)
  {
  p1 = p1.slice(vi1).concat(p1.slice(0,vi1));
  p1.push(p1[0]);
  p2 = p2.slice(vi2).concat(p2.slice(0,vi2));
  p2.push(p2[0]);
  return p1.concat(p2);
  };
$ppu.read = function (s)
  {
  s = s.split(' ');
  var points = [];
  var i = 0;
  while (i<s.length)
    points.push([parseFloat(s[i++]),parseFloat(s[i++])]);
  return points;
  }
$ppu.part = function (p, vs, l, d)
  {
  var pl = p.length;
  if (pl<4)
    return [p];
  var isLeftTurn = this.vpu.isLeftTurn;
  var bisect = this.vpu.bisect;
  var pi = p[0], pi1 = p[1%pl];
  var v0 = vs[0];
  var v1 = vs[pi1];
  var cpoly = null, innerPoly = [];
  var npolys = [];
  var base = 2, started = false;
  for (var i = base; i<pl+base; i++)
    {
    var pi2 = p[i%pl];
    var v2 = vs[pi2];
    if (started)
      cpoly.push(pi1);
    else
      base++;
    //var lt = isLeftTurn(v0, v1, v2);// || i == 86;
    var lt = $ppu.area([pi,pi1,pi2],vs)>0;
    if (!lt || cpoly && cpoly.length == l-1)
      {
      if (started)
        {
        if (d!=0)
          cpoly.push(vs.length);
        }
      else
        started=true;
      if (d!=0)
        {
        cpoly = [vs.length, pi1];
        innerPoly.push(vs.length);
        vs.push(bisect(v0, v1, v2, lt?-d:d));
        }
      else
        {
        cpoly = [pi1];
        innerPoly.push(pi1);
        }
      npolys.push(cpoly);
      }
    pi = pi1;
    pi1 = pi2;
    v0 = v1;
    v1 = v2;
    }
  npolys.pop();
  npolys.push(innerPoly);
  return npolys;
  }
//$ppu.offset = function (p, v, d);
$vpu.bisect = function (v0,v1,v2,d)
  {
  var v1x = v1[0], v1y = v1[1];
  var v3x =  v0[0]-v1x;
  var v3y = v0[1]-v1y;
  var m3 = Math.sqrt(v3x*v3x + v3y*v3y);
  var v4x = v2[0]-v1x;
  var v4y = v2[1]-v1y;
  var m4 = Math.sqrt(v4x*v4x + v4y*v4y);
  v4x = v3x/m3+v4x/m4;
  v4y = v3y/m3+v4y/m4;
  m4 = Math.sqrt(v4x*v4x + v4y*v4y)/d;
  return [v4x/m4+v1x, v4y/m4+v1y];
  }
$vpu.isLeftTurn = function (v1, v2, v3)
  {
  // Compute vectors
  var x1 = v1[0], y1 = v1[1];
  var v0x = v2[0] - x1, v0y = v2[1] - y1;
  var v2x = v3[0] - x1, v2y = v3[1] - y1;
  // Compute dot products
  var dot00 = v0x*v0x + v0y*v0y;
  // Compute barycentric coordinates
  var u = (v0x*v2x + v0y*v2y) / dot00;
  var v = (-v0y*v2x + v0x*v2y) / dot00;
  // Check if point is ccw
  return (u > 0) && (v > 0);
  }
$ppu.clean = function (p, vs, l)
  {
  var pl = p.length;
  var np = [];
  for (var i = 0; i<pl; i++)
    {
    var j = (i+1)%pl;
    var v0 = vs[p[i]];
    var v1 = vs[p[j]];
    var v2 = [v0[0]-v1[0], v0[1]-v1[1]]
    var m = v2[0]*v2[0] + v2[1]*v2[1];
    if (m>l)
      np.push(p[j]);
    }
  return np;
  }
$ppu.toPoints = function (p, vs)
  {
  var pl = p.length;
  var np = [];
  for (var i = 0; i<pl; i++)
    np.push(vs[p[i]]);
  return np;
  }
/*
$vpu.sameSide = function (p1, p2, a, b)
  {
  cp1 = CrossProduct(b-a, p1-a)
  cp2 = CrossProduct(b-a, p2-a)
  if DotProduct(cp1, cp2) >= 0 then return true
  else return false
  }
$vpu.pointInTriangle = function (p, a, b, c)
  {
  var ss = this.sameSide;
  return (ss(p, a, b, c) && ss(p, b, a, c) && ss(p, c, a, b));
  }
*/