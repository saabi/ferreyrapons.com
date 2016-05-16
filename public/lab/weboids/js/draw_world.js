function drawWorld(world, context, aabb)
  {
  for (var j = world.m_jointList; j; j = j.m_next)
    drawJoint(j, context);
  var shapes = [];
  context.strokeStyle = '#ffffff';
  world.QueryAABB(function (f)
    {
    if (f['paint'] != null)
      f.paint(context);
    else
      {
      //drawShape(f, context);
      context.stroke();
      }
    return true;
    }, aabb);

  /*
   for (var b = world.m_bodyList; b; b = b.m_next)
   if (b['paint'] != null)
   b.paint(context);
   else
   {
   context.strokeStyle = '#ffffff';
   for (var s = b.GetShapeList(); s != null; s = s.GetNext())
   {
   drawShape(s, context);
   context.stroke();
   }
   }
   */
  }
function drawJoint(joint, context)
  {
  var b1 = joint.m_body1;
  var b2 = joint.m_body2;
  var x1 = b1.m_position;
  var x2 = b2.m_position;
  var p1 = joint.GetAnchor1();
  var p2 = joint.GetAnchor2();
  context.strokeStyle = '#00eeee';
  context.beginPath();
  switch (joint.m_type)
  {
    case b2Joint.e_distanceJoint:
      context.moveTo(p1.x, p1.y);
      context.lineTo(p2.x, p2.y);
      break;

    case b2Joint.e_pulleyJoint:
      // TODO
      break;

    default:
      if (b1 == world.m_groundBody)
        {
        context.moveTo(p1.x, p1.y);
        context.lineTo(x2.x, x2.y);
        }
      else if (b2 == world.m_groundBody)
        {
        context.moveTo(p1.x, p1.y);
        context.lineTo(x1.x, x1.y);
        }
      else
        {
        context.moveTo(x1.x, x1.y);
        context.lineTo(p1.x, p1.y);
        context.lineTo(x2.x, x2.y);
        context.lineTo(p2.x, p2.y);
        }
      break;
  }
  context.stroke();
  }
function drawFixture(fixture, context)
  {
  var b2Math = Box2D.Common.Math.b2Math;
  var b = fixture.GetBody();
  var shape = fixture.m_shape;
  context.beginPath();
  switch (fixture.m_shape.m_type)
    {
    case Box2D.Collision.Shapes.b2Shape.e_circleShape:
      {
      var circle = fixture.m_shape;
      var pos = fixture.GetBody().m_position;
      var r = circle.m_radius;
      var segments = 16.0;
      var theta = 0.0;
      var dtheta = 2.0 * Math.PI / segments;
      // draw circle
      context.moveTo(pos.x + r, pos.y);
      for (var i = 0; i < segments; i++)
        {
        var d = new Box2D.Common.Math.b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
        var v = Box2D.Common.Math.b2Math.AddVV(pos, d);
        context.lineTo(v.x, v.y);
        theta += dtheta;
        }
      context.lineTo(pos.x + r, pos.y);

      // draw radius
      context.moveTo(pos.x, pos.y);
      var ax = circle.m_R.col1;
      var pos2 = new Box2D.Common.Math.b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
      context.lineTo(pos2.x, pos2.y);
      }
      break;
    case Box2D.Collision.Shapes.b2Shape.e_polygonShape:
      {
      var t = b.GetTransform();
      var r = t.R;
      var p = t.position;
      var vs = shape.m_vertices;
      var vsl = vs.length;
      var tV = b2Math.AddVV(p, b2Math.MulMV(r, vs[0]));
      context.moveTo(tV.x, tV.y);
      for (var i = 0; i < vsl; i++)
        {
        var v = b2Math.AddVV(p, b2Math.MulMV(r, vs[i]));
        context.lineTo(v.x, v.y);
        }
      context.lineTo(tV.x, tV.y);
      }
      break;
    }
  }

