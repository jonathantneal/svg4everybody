// Core SVG, code.google.com/p/core-framework, MIT
(function () {
	'use strict';

	function extend(objectA, objectB) {
		for (var key in objectB) {
			if (Object.prototype.hasOwnProperty.call(objectB, key)) {
				objectA[key] = objectB[key];
			}
		}
	}

	function Extendable(object) {
		extend(this, object);
	}

	Extendable.prototype.extend = function (object) {
		var proto = new this.constructor();

		/* Extend object prototypes */
		extend(proto, object);
		
		// The dummy class constructor
		var Class = proto.constructor = function () {};

		extend(Class, {
			prototype:   proto,
			constructor: Class,
			extend: 	 this.extend
		});
		
		return Class;
	};

	var Core = new Extendable({});

	/**
	* Core.SVG
	* @version 1.0
	*/

	window.SVG = (function()
	{
		var SVGPathSeg = Core.extend(
		{
			x:  null,
			y:  null,
			pathSegType: 		 0,
			pathSegTypeAsLetter: null, 
			vml: function()
			{
				return this.pathSegTypeAsLetter;
			},
			curve: function()
			{
				/* Override */
			}
		});
		
		SVGPathSeg.PATHSEG_UNKNOWN                      = 0;
		SVGPathSeg.PATHSEG_CLOSEPATH                    = 1;
		SVGPathSeg.PATHSEG_MOVETO_ABS                   = 2;
		SVGPathSeg.PATHSEG_MOVETO_REL                   = 3;
		SVGPathSeg.PATHSEG_LINETO_ABS                   = 4;
		SVGPathSeg.PATHSEG_LINETO_REL                   = 5;
		SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS            = 6;
		SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL            = 7;
		SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS        = 8;
		SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL        = 9;
		SVGPathSeg.PATHSEG_ARC_ABS                      = 10;
		SVGPathSeg.PATHSEG_ARC_REL                      = 11;
		SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS        = 12;
		SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL        = 13;
		SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS          = 14;
		SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL          = 15;
		SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS     = 16;
		SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL     = 17;
		SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS = 18;
		SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL = 19;
		
		var SVGPathSegClosePath = SVGPathSeg.extend(
		{
			pathSegType: SVGPathSeg.PATHSEG_CLOSEPATH,
			pathSegTypeAsLetter: 'z', 
			vml: function()
			{
				return 'xe';
			},
			curve: function()
			{
				return this.vml();
			}
		});
		
		var SVGPathSegMovetoAbs = SVGPathSeg.extend(
		{
			pathSegType: 		 SVGPathSeg.PATHSEG_MOVETO_ABS,
			pathSegTypeAsLetter: 'M',
			vml: function()
			{
				return 'm' + [this.x, this.y].join(',');
			},
			curve: function()
			{
				return this.vml();
			}
		});
		
		// Path Segment Types
		var SVGPathSegMovetoRel = SVGPathSeg.extend(
		{ 
			pathSegType : SVGPathSeg.PATHSEG_MOVETO_REL,
			pathSegTypeAsLetter : 'm'
		});
		
		var SVGPathSegLinetoAbs = SVGPathSeg.extend(
		{
			pathSegType : SVGPathSeg.PATHSEG_LINETO_ABS,
			pathSegTypeAsLetter : 'L',
			vml: function()
			{
				return 'l' + [this.x, this.y].join(',');
			},
			curve: function()
			{
				var curve = new SVGPathSegCurvetoCubicAbs();
				
				curve.x = this.x;
				curve.y = this.y;
				
				curve.x1 = this.x;
				curve.y1 = this.y;
				curve.x2 = this.x;
				curve.y2 = this.y;
				
				return curve.vml();
			}
		});
		
		var SVGPathSegLinetoRel = SVGPathSeg.extend(
		{ 
			pathSegType : SVGPathSeg.PATHSEG_LINETO_REL,
			pathSegTypeAsLetter : 'l',
			vml: function()
			{
				return this.pathSegTypeAsLetter + [this.x, this.y].join(',');
			},
			curve: function()
			{
				return 'l' + [this.x, this.y].join(',');
			}
		});
		
		var SVGPathSegCurvetoCubicAbs = SVGPathSeg.extend(
		{ 
			x1: null,
			y1: null,
			x2: null,
			y2: null,
			pathSegType : SVGPathSeg.PATHSEG_CURVETO_CUBIC_ABS,
			pathSegTypeAsLetter : 'C',
			vml: function()
			{
				return 'c' + [this.x1,this.y1,this.x2,this.y2, this.x, this.y].join(', ');
			},
			curve: function()
			{
				return this.vml();
			}
		});
		
		var SVGPathSegCurvetoCubicRel = SVGPathSeg.extend(
		{ 
			x1: null,
			y1: null,
			x2: null,
			y2: null,
			pathSegType : SVGPathSeg.PATHSEG_CURVETO_CUBIC_REL,
			pathSegTypeAsLetter : 'c',
			vml: function()
			{
				return 'v' + [this.x1,this.y1,this.x2,this.y2, this.x, this.y].join(',');
			},
			curve: function()
			{
				return this.vml();
			}
		});
		
		var SVGPathSegCurvetoQuadraticAbs = SVGPathSeg.extend(
		{ 
			x1: null,
			y1: null,
			pathSegType: SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_ABS,
			pathSegTypeAsLetter: 'Q'
		});
		
		var SVGPathSegCurvetoQuadraticRel = SVGPathSeg.extend(
		{ 
			x1: null,
			y1: null,
			pathSegType: SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_REL,
			pathSegTypeAsLetter: 'q'
		});
		
		var SVGPathSegArcAbs = SVGPathSeg.extend(
		{ 
			angle: 				null,
			largeArcFlag: 		true,
			sweepFlag: 			true,
			pathSegType: 		SVGPathSeg.PATHSEG_ARC_ABS,
			pathSegTypeAsLetter: 'A'
		});
		
		var SVGPathSegArcRel = SVGPathSeg.extend(
		{ 
			r1: 			null,
			r2: 			null,
			angle: 			null,
			largeArcFlag: 	true,
			sweepFlag: 		true,
			pathSegType: 	SVGPathSeg.PATHSEG_ARC_REL,
			pathSegTypeAsLetter: 'a'
		});
		
		var SVGPathSegLinetoHorizontalAbs = SVGPathSeg.extend(
		{ 
			pathSegType: SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_ABS,
			pathSegTypeAsLetter: 'H'
		});
		
		var SVGPathSegLinetoHorizontalRel = SVGPathSeg.extend(
		{ 
			pathSegType: SVGPathSeg.PATHSEG_LINETO_HORIZONTAL_REL,
			pathSegTypeAsLetter: 'h'
		});
		
		var SVGPathSegLinetoVerticalAbs = SVGPathSeg.extend( 
		{ 
			pathSegType:SVGPathSeg.PATHSEG_LINETO_VERTICAL_ABS,
			pathSegTypeAsLetter:'V'
		});
		
		var SVGPathSegLinetoVerticalRel = SVGPathSeg.extend( 
		{ 
			pathSegType:SVGPathSeg.PATHSEG_LINETO_VERTICAL_REL,
			pathSegTypeAsLetter:'v'
		});
		
		var SVGPathSegCurvetoCubicSmoothAbs = SVGPathSeg.extend(
		{ 
			pathSegType:SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_ABS,
			pathSegTypeAsLetter:'S'
		});
		
		var SVGPathSegCurvetoCubicSmoothRel = SVGPathSeg.extend(
		{
			pathSegType:SVGPathSeg.PATHSEG_CURVETO_CUBIC_SMOOTH_REL,
			pathSegTypeAsLetter:'s'
		});
		
		var SVGPathSegCurvetoQuadraticSmoothAbs = SVGPathSeg.extend(
		{
			pathSegType:SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_ABS,
			pathSegTypeAsLetter:'T'
		});
		
		var SVGPathSegCurvetoQuadraticSmoothRel = SVGPathSeg.extend(
		{
			pathSegType:SVGPathSeg.PATHSEG_CURVETO_QUADRATIC_SMOOTH_REL,
			pathSegTypeAsLetter:'t'
		});

		return {
			cast: function(arg) /* Cast array parameters to integer */
			{
				for ( var i=0, j = arg.length; i < j; ++i ) 
			    {
			        arg[i] = 1 * Math.round(1 * Math.round(arg[i]));
			    }
			    
			    return arg;
			},
			path: function(value) /* Converts SVG path to VML path */
			{
	            /* Transfrom SVG to VML */
	            var path = this.vml(value);

	            /* Return path */
	            return this.concat(path);
			},
			parse: function(value)
			{
				var path = [], regex = /([-+]?[0-9]*\.?[0-9]+)/gi;

	            /* Replace exponent parts */
	            value = value.replace(/(\d*)((\.*\d*)(e ?-?\d*))/g,'$1');
	            
	            var pathCommands = value.match( /([MLHVCSQTAZ].*?)(?=[MLHVCSQTAZ]|$)/gi );
	            
	            for( var i=0; i < pathCommands.length; i++ ) 
	            {
	                var command = pathCommands[i].substring(0,1), params = pathCommands[i].substring(1,pathCommands[i].length);
	                
	                /* Extract numbers */
					var data = params.match(regex), x;
					
					/* Normalize */
					if (data)
					{
						for (x = 0; x < data.length; x++)
						{							
							var num = Math.round(data[x]);
							
							data[x] = ' ' + num;
						}
						
						params = data.join();
					}
					
					/* Get coordinates */
					var args = params.split(/[,]+/), element;
					
					/* Cast all arguments to integers */
					args = this.cast(args);

	                switch(command) 
	                {
	                    case 'M': // moveTo absolute
	                            element = this.createSVGPathSegMovetoAbs(args[0], args[1]);
	                            break;
	                    case 'm': // moveTo relative
	                            element = this.createSVGPathSegMovetoRel(args[0], args[1]);
	                            break;
	                    case 'A': // arc absolute:
	                            element = this.createSVGPathSegArcAbs(args[5], args[6], args[0], args[1], args[2], args[3], args[4]);
	                            break;
	                    case 'a':
	                    		element = this.createSVGPathSegArcRel(args[5], args[6], args[0], args[1], args[2], args[3], args[4]);
	                    		break;
	                    case 'L': // lineTo absolute
	                           	element = this.createSVGPathSegLinetoAbs(args[0], args[1]);
	                            break;
	                    case 'l': // lineTo relative
	                           	element = this.createSVGPathSegLinetoRel(args[0], args[1]);
	                            break;
	                   	case 'V': /* Absolute vertical line */
	                   		  	element = this.createSVGPathSegLinetoVerticalAbs(args[0]);
	                            break;
	                   
	                    case 'v':
	                    		element = this.createSVGPathSegLinetoVerticalRel(args[0]);
	                            break;
	                    case 'H': /* Absolute horizontal line*/
	                    		element = this.createSVGPathSegLinetoHorizontalAbs(args[0]);
	                    		break;
	                   	case 'h': /* Relative line to */
	                   			element = this.createSVGPathSegLinetoHorizontalRel(args[0]);
	                            break;
	                    case 'C':
	                    		element = this.createSVGPathSegCurvetoCubicAbs(args[4], args[5], args[0], args[1],args[2], args[3]);
	                    		break;
	                    case 'c':
	                           	element = this.createSVGPathSegCurvetoCubicRel(args[4], args[5], args[0], args[1], args[2], args[3]);
	                            break;
	                    case 'Q':
	                    		element = this.createSVGPathSegCurvetoQuadraticAbs(args[2], args[3], args[0], args[1]);
	                    		break;
	                    case 'q':
	                           	element = this.createSVGPathSegCurvetoQuadraticRel(args[2], args[3], args[0], args[1]);
	                            break;
	                    case 'S':
	                    		element = this.createSVGPathSegCurvetoCubicSmoothAbs(args[2], args[3], args[0], args[1]);
	                            break;
	                    case 's':
	                    		element = this.createSVGPathSegCurvetoCubicSmoothRel(args[2], args[3], args[0], args[1]);
	                    		break;
	                    case 'z':
	                    		element = this.createSVGPathSegClosePath();
	                          	break;
	                    default:
	                       	  	element = new SVGPathSeg();
	                }

	                path.push(element);                   
	            }
	            
	            return path;
			},
			concat: function(vml)
			{
				var string = [];
				
				for (var i = 0, c = vml.length; i < c; i++)
				{
					string.push(vml[i].vml());
				}
				
				return string.join('');
			},
			vml: function(path)
			{	
				/* Parse path */
				path = this.parse(path);
				
				var vml = [], cx = 0, cy = 0, xn = 0, yn = 0,startx = 0, starty = 0; //M,m Z,z
				
				for (var j = 0, tli = path.length; j < tli; ++j) 
				{
					var ti = path[j], ts = ti.pathSegType, dii = ti.pathSegTypeAsLetter;

					if (ts ===  0) 
					{
						/* SVGPathSeg.PATHSEG_UNKNOWN */
					} 
					else 
					{
						var rx = cx, ry = cy;   //rx
						
						if (ts % 2 === 1) 
						{
							cx += ti.x;
							cy += ti.y;
						} 
						else 
						{
							cx = ti.x;
							cy = ti.y;
						}
						
						if (dii === 'C') 
						{
							vml.push(ti);
						} 
						else if (dii === 'L') 
						{
							vml.push(ti);
							
						} else if (dii === 'M') 
						{
							if (j !== 0) 
							{
								var tg = path[j-1];
								
								if (tg.pathSegTypeAsLetter === 'M') 
								{
									vml.push(this.createSVGPathSegLinetoAbs(cx, cy));
									
									continue;
								}
							}
							startx = cx;
							starty = cy;
							
							vml.push(ti);
						} 
						else if (dii === 'm') 
						{
							if (j !== 0) 
							{
								var tg = path[j-1];
								
								if (tg.pathSegTypeAsLetter === 'm') 
								{
									vml.push(this.createSVGPathSegLinetoAbs(cx, cy));
									
									continue;
								}
							}
							startx = cx;
							starty = cy;
							
							vml.push(this.createSVGPathSegMovetoAbs(cx, cy));
						} 
						else if (dii === 'l') 
						{
							vml.push(this.createSVGPathSegLinetoAbs(cx, cy));
						} 
						else if (dii === 'c') 
						{
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, ti.x1+rx, ti.y1+ry, ti.x2+rx, ti.y2+ry));
						} 
						else if (dii.toLowerCase() === 'z') 
						{
							cx = startx;
							cy = starty;

							vml.push(ti);
						} 
						else if (dii === 'Q') 
						{
							xn = 2 * cx - ti.x1;
							yn = 2 * cy - ti.y1;
							
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, Math.round((rx + 2*ti.x1) / 3), Math.round((ry + 2*ti.y1) / 3), Math.round((2*ti.x1 + cx) / 3), Math.round((2*ti.y1 + cy) / 3)));
							
						} 
						else if (dii === 'q') 
						{
							var x1 = ti.x1 + rx, y1 = ti.y1 + ry;
							
							xn = 2*cx - x1;
							yn = 2*cy - y1;
							
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, (rx + 2*x1) / 3, (ry + 2*y1) / 3, (2*x1 + cx) / 3, (2*y1 + cy) / 3));
							
							x1 = y1 = null;
						} 
						else if (dii === 'A' || dii === 'a') 
						{
							var that = this, tar;
							(function(ti, cx, cy, rx, ry, tar, vml) 
							{
								if (ti.r1 === 0 || ti.r2 === 0) 
								{
									return;
								}
								
								var fS = ti.sweepFlag, psai = ti.angle, r1 = Math.abs(ti.r1),r2 = Math.abs(ti.r2),ctx = (rx - cx) / 2,  cty = (ry - cy) / 2,cpsi = Math.cos(psai*Math.PI/180),spsi = Math.sin(psai*Math.PI/180),rxd = cpsi*ctx + spsi*cty,ryd = -1*spsi*ctx + cpsi*cty,rxdd = rxd * rxd, rydd = ryd * ryd,r1x = r1 * r1,r2y = r2 * r2,lamda = rxdd/r1x + rydd/r2y,sds;
								
								if (lamda > 1) 
								{
									r1 = Math.sqrt(lamda) * r1;
									r2 = Math.sqrt(lamda) * r2;
									sds = 0;
								}  
								else
								{
									var seif = 1;
									if (ti.largeArcFlag === fS) 
									{
										seif = -1;
									}
									sds = seif * Math.sqrt((r1x*r2y - r1x*rydd - r2y*rxdd) / (r1x*rydd + r2y*rxdd));
								}
								
								var txd = sds*r1*ryd / r2,tyd = -1 * sds*r2*rxd / r1,tx = cpsi*txd - spsi*tyd + (rx+cx)/2,ty = spsi*txd + cpsi*tyd + (ry+cy)/2,rad = Math.atan2((ryd-tyd)/r2, (rxd-txd)/r1) - Math.atan2(0, 1),s1 = (rad >= 0) ? rad : 2 * Math.PI + rad,rad = Math.atan2((-ryd-tyd)/r2, (-rxd-txd)/r1) - Math.atan2((ryd-tyd)/r2, (rxd-txd)/r1),dr = (rad >= 0) ? rad : 2 * Math.PI + rad;
								
								if (!fS  &&  dr > 0) 
								{
									dr -=   2*Math.PI;
								} else if (fS  &&  dr < 0) 
								{
									dr += 2*Math.PI;
								}
								
								var sse = dr * 2 / Math.PI,seg = Math.ceil(sse<0 ? -1*sse  :  sse),segr = dr / seg,t = 8/3 * Math.sin(segr/4) * Math.sin(segr/4) / Math.sin(segr/2),cpsir1 = cpsi * r1, cpsir2 = cpsi * r2,spsir1 = spsi * r1, spsir2 = spsi * r2,mc = Math.cos(s1),ms = Math.sin(s1),x2 = rx - t * (cpsir1*ms + spsir2*mc),y2 = ry - t * (spsir1*ms - cpsir2*mc);
								
								for (var n = 0; n < seg; ++n) 
								{
									s1 += segr;
									mc = Math.cos(s1);
									ms = Math.sin(s1);
									
									var x3 = cpsir1*mc - spsir2*ms + tx,y3 = spsir1*mc + cpsir2*ms + ty,dx = -t * (cpsir1*ms + spsir2*mc),dy = -t * (spsir1*ms - cpsir2*mc);
									
									vml.push(that.createSVGPathSegCurvetoCubicAbs(x3, y3, x2, y2, x3-dx, y3-dy));
									
									x2 = x3 + dx;
									y2 = y3 + dy;
								}
								
								ti= cx= cy= rx= ry= tar= vml = null;
							
							})(ti, cx, cy, rx, ry, tar, vml);
						} 
						else if (dii === 'S') 
						{
							if (j !== 0) 
							{
								var tg = vml[vml.length -1];
								
								if (tg.pathSegTypeAsLetter === 'C') 
								{ 
									var x1 = 2 * tg.x - tg.x2, y1 = 2 * tg.y - tg.y2;
								} 
								else 
								{
									var x1 = rx, y1 = ry;
								}
							} 
							else 
							{
								var x1 = rx, y1 = ry;
							}
							
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, x1, y1, ti.x2, ti.y2));
							
							x1 = y1 = null;
						} 
						else if (dii === 's') 
						{
							if (j !== 0) 
							{
								var tg = vml[vml.length -1];
								
								if (tg.pathSegTypeAsLetter === 'C') 
								{
									var x1 = 2*tg.x - tg.x2, y1 = 2*tg.y - tg.y2;
								} 
								else 
								{
									var x1 = rx, y1 = ry;
								}
							} 
							else 
							{
								var x1 = rx,y1 = ry;
							}
							
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, x1, y1, ti.x2+rx, ti.y2+ry));
							
							x1 = y1 = null;
						} 
						else if (dii === 'T' || dii === 't') 
						{
							if (j !== 0) 
							{
								var tg = path[j-1];
								
								if ('QqTt'.indexOf(tg.pathSegTypeAsLetter) > -1) 
								{
									
								} else 
								{
									xn = rx, yn = ry;
								}
							} 
							else 
							{
								xn = rx, yn = ry;
							}
							
							vml.push(this.createSVGPathSegCurvetoCubicAbs(cx, cy, (rx + 2*xn) / 3, (ry + 2*yn) / 3, (2*xn + cx) / 3, (2*yn + cy) / 3));
							
							xn = 2*cx - xn;
							yn = 2*cy - yn;

							var xx1, yy1;

							xx1 = yy1 = null;
							
						} 
						else if (dii === 'H' || dii === 'h') 
						{
							vml.push(this.createSVGPathSegLinetoAbs(cx, ry));
							cy = ry;
						} 
						else if (dii === 'V' || dii === 'v') 
						{
							vml.push(this.createSVGPathSegLinetoAbs(rx, cy));
							cx = rx;
						}
					}
				}
				
				return vml;
			},
			createSVGPathSegClosePath: function() 
			{
				return (new SVGPathSegClosePath());
			},
			createSVGPathSegMovetoAbs: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegMovetoAbs();
				
				s.x = x;
				s.y = y;
				
				return s;
			},
			createSVGPathSegMovetoRel: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegMovetoRel();
				s.x = x;
				s.y = y;
				return s;
			},
			createSVGPathSegLinetoAbs: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegLinetoAbs();
				s.x = x;
				s.y = y;
				return s;
			},
			createSVGPathSegLinetoRel: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegLinetoRel();
				s.x = x;
				s.y = y;
				return s;
			},
			createSVGPathSegCurvetoCubicAbs: function(/*float*/ x, /*float*/ y, /*float*/ x1, /*float*/ y1, /*float*/ x2, /*float*/ y2 ) 
			{
				var s = new SVGPathSegCurvetoCubicAbs();
				
				s.x = x;
				s.y = y;
				s.x1 = x1;
				s.y1 = y1;
				s.x2 = x2;
				s.y2 = y2;
				
				return s;
			},
			createSVGPathSegCurvetoCubicRel: function(/*float*/ x, /*float*/ y, /*float*/ x1, /*float*/ y1, /*float*/ x2, /*float*/ y2 ) 
			{
				var s = new SVGPathSegCurvetoCubicRel();
				
				s.x = x;
				s.y = y;
				s.x1 = x1;
				s.y1 = y1;
				s.x2 = x2;
				s.y2 = y2;
				
				return s;
			},
			createSVGPathSegCurvetoQuadraticAbs: function(/*float*/ x, /*float*/ y, /*float*/ x1, /*float*/ y1 ) 
			{
				var s = new SVGPathSegCurvetoQuadraticAbs();
				
				s.x = x;
				s.y = y;
				s.x1 = x1;
				s.y1 = y1;
				return s;
			},
			createSVGPathSegCurvetoQuadraticRel: function(/*float*/ x, /*float*/ y, /*float*/ x1, /*float*/ y1 ) 
			{
				var s = new SVGPathSegCurvetoQuadraticRel();
				
				s.x = x;
				s.y = y;
				s.x1 = x1;
				s.y1 = y1;
				return s;
			},
			createSVGPathSegArcAbs: function(/*float*/ x, /*float*/ y, /*float*/ r1, /*float*/ r2, /*float*/ angle, /*boolean*/ largeArcFlag, /*boolean*/ sweepFlag ) 
			{
				var s = new SVGPathSegArcAbs();
				
				s.x = x;
				s.y = y;
				s.r1 = r1;
				s.r2 = r2;
				s.angle = angle;
				s.largeArcFlag = largeArcFlag;
				s.sweepFlag = sweepFlag;
				
				return s;
			},
			createSVGPathSegArcRel: function(/*float*/ x, /*float*/ y, /*float*/ r1, /*float*/ r2, /*float*/ angle, /*boolean*/ largeArcFlag, /*boolean*/ sweepFlag ) 
			{
				var s = new SVGPathSegArcRel();
				
				s.x = x;
				s.y = y;
				s.r1 = r1;
				s.r2 = r2;
				s.angle = angle;
				s.largeArcFlag = largeArcFlag;
				s.sweepFlag = sweepFlag;
				
				return s;
			},
			createSVGPathSegLinetoHorizontalAbs: function(/*float*/ x ) 
			{
				var s = new SVGPathSegLinetoHorizontalAbs();
				
				s.x = x;
				s.y = 0;
				
				return s;
			},
			createSVGPathSegLinetoHorizontalRel: function(/*float*/ x ) 
			{
				var s = new SVGPathSegLinetoHorizontalRel();
				s.x = x;
				s.y = 0;
				
				return s;
			},
			createSVGPathSegLinetoVerticalAbs: function(/*float*/ y ) 
			{
				var s = new SVGPathSegLinetoVerticalAbs();
				s.x = 0;
				s.y = y;
				
				return s;
			},
			createSVGPathSegLinetoVerticalRel: function(/*float*/ y ) 
			{
				var s = new SVGPathSegLinetoVerticalRel();
				s.x = 0;
				s.y = y;
				
				return s;
			},
			createSVGPathSegCurvetoCubicSmoothAbs: function(/*float*/ x, /*float*/ y, /*float*/ x2, /*float*/ y2 ) 
			{
				var s = new SVGPathSegCurvetoCubicSmoothAbs();
				
				s.x = x;
				s.y = y;
				s.x2 = x2;
				s.y2 = y2;
				
				return s;
			},
			createSVGPathSegCurvetoCubicSmoothRel: function(/*float*/ x, /*float*/ y, /*float*/ x2, /*float*/ y2 ) 
			{
				var s = new SVGPathSegCurvetoCubicSmoothRel();
				
				s.x = x;
				s.y = y;
				s.x2 = x2;
				s.y2 = y2;
				
				return s;
			},
			createSVGPathSegCurvetoQuadraticSmoothAbs: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegCurvetoQuadraticSmoothAbs();
				s.x = x;
				s.y = y;
				
				return s;
			},
			createSVGPathSegCurvetoQuadraticSmoothRel: function(/*float*/ x, /*float*/ y ) 
			{
				var s = new SVGPathSegCurvetoQuadraticSmoothRel();
				
				s.x = x;
				s.y = y;
				
				return s;
			}
		};
	})();
})();