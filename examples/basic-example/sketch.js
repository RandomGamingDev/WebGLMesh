			/**
			 * Provides requestAnimationFrame in a cross browser way.
			 * paulirish.com/2011/requestanimationframe-for-smart-animating/
			 */
			window.requestAnimationFrame = window.requestAnimationFrame || ( function() {
				return  window.webkitRequestAnimationFrame ||
				        window.mozRequestAnimationFrame ||
				        window.oRequestAnimationFrame ||
				        window.msRequestAnimationFrame ||
				        function(  callback, element ) {
					        window.setTimeout( callback, 1000 / 60 );
				        };
			})();
 
			var canvas, 
			    gl, 
			    vertex_buffer, 
					element_buffer,
			    vertex_shader, fragment_shader, 
			    currentProgram,
			    vertex_position,
			    timeLocation,
			    resolutionLocation,
			    parameters = {  start_time  : new Date().getTime(), 
			                    time        : 0, 
			                    screenWidth : 0, 
			                    screenHeight: 0 };
			init();
			animate();
			function init() {
				vertex_shader = document.getElementById('vs').textContent;
				fragment_shader = document.getElementById('fs').textContent;
 
				canvas = document.querySelector( 'canvas' );
 
				// Initialise WebGL
 				try {
					gl = canvas.getContext( 'webgl2' );
				} catch(error) {}
				if (!gl) {
					throw "cannot create webgl context";
				}
 
				// Create Vertex buffer (2 triangles)
				vertex_position = new Mesh.VAO(gl);
				vertex_buffer = new Mesh.VBO(new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]), gl.STATIC_DRAW, gl);
				element_buffer = new Mesh.EBO(new Uint16Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW, gl);
 
				// Create Program
				currentProgram = createProgram(vertex_shader, fragment_shader);

				timeLocation = gl.getUniformLocation(currentProgram, 'time');
				resolutionLocation = gl.getUniformLocation(currentProgram, 'resolution');
			}
 
			function createProgram( vertex, fragment ) {
				var program = gl.createProgram();
 
				var vs = createShader( vertex, gl.VERTEX_SHADER );
				var fs = createShader( '#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER );
 
				if ( vs == null || fs == null ) return null;
 
				gl.attachShader(program, vs);
				gl.attachShader(program, fs);
 
				gl.deleteShader(vs);
				gl.deleteShader(fs);
 
				gl.linkProgram(program);
 
				if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
					alert( "ERROR:\n" +
					"VALIDATE_STATUS: " + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) + "\n" +
					"ERROR: " + gl.getError() + "\n\n" +
					"- Vertex Shader -\n" + vertex + "\n\n" +
					"- Fragment Shader -\n" + fragment );
 
					return null;
				}
 
				return program;
 
			}
 
			function createShader(src, type) {
				var shader = gl.createShader(type);
 
				gl.shaderSource(shader, src);
				gl.compileShader(shader);
 
				if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
					alert((type == gl.VERTEX_SHADER ? "VERTEX" : "FRAGMENT") + " SHADER:\n" + gl.getShaderInfoLog(shader));
					return null;
 
				}
				return shader;
			}
 
			function resizeCanvas( event ) {
				if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight) {
					canvas.width = canvas.clientWidth;
					canvas.height = canvas.clientHeight;

					parameters.screenWidth = canvas.width;
					parameters.screenHeight = canvas.height;

					gl.viewport( 0, 0, canvas.width, canvas.height );
				}
 
			}
 
			function animate() {
				resizeCanvas();
				render();
				requestAnimationFrame(animate);
			}
 
			function render() {
				if (!currentProgram) return;
 
				parameters.time = new Date().getTime() - parameters.start_time;
 
				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
				// Load program into GPU
				gl.useProgram(currentProgram);
 
				// Set values to program variables
				gl.uniform1f(timeLocation, parameters.time / 1000);
				gl.uniform2f(resolutionLocation, parameters.screenWidth, parameters.screenHeight);
 
				// Render geometry
				vertex_buffer.bind();
				vertex_position.link_attrib(vertex_position, 2, gl.FLOAT, false, 0, 0);
				element_buffer.bind();
				vertex_position.enable();
				gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
				vertex_position.disable();
			}