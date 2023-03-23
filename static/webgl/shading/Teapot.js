var gl;

var aCoords_SB;         // For drawing the skybox
var uProjection_SB;     
var uModelview_SB;
var prog_SB;

var aCoords;          // For drawing the reflective teapot
var aNormal;
var aTextureCoords;
var aIndices;
var uProjection;    
var uModelview;
var uNormalMatrix;
var uInvVT;
var prog;

var projection = mat4.create();   // projection matrix
var modelview;    // modelview matrix
var normalMatrix = mat3.create();
var invVT = mat3.create();  // The inverse of the view transform rotation matrix.

var texID;   // The cubemap texture.
var cube;    // The cube that is the skybox.
var teapot;  // The teapot.

var angle = 0;
var rotator;   // A SimpleRotator object to enable rotation by mouse dragging.
               // Provides the view transform that is applied to both skybox and teapot.
var rotX = 0, rotY = 0;  // Additional rotations applied as modeling transform to the teapot.


/**
  * Loads obj files. 
  * @param {url} input Url of the input .obj file.
  */
function LoadObj(input) {
  var lines = input.split(/\r\n|\r|\n/g);
  var out = {};
  out.vertexPositions = [];
  out.vertexNormals = [];
  out.vertexTextureCoords = [];
  out.indices = [];
  lines.forEach(function(line) {
    var linePieces = line.split(" ");
    if(linePieces[0] == "v") {
      //this is a vertex entry. we'll ignore the w coord
      for(var i = 1; i < 4; i++) {
        var num = parseFloat(linePieces[i]);
        num /= 20;
        out.vertexPositions.push(num);
      }
    }
    else if(linePieces[0] == "vn") {
      //this is a normals entry
      for(var i = 1; i < 4; i++)
        out.vertexNormals.push(parseFloat(linePieces[i]));
    }
    else if(linePieces[0] == "vt") {
      //this is a texture coordinate entry, again ignoring w coord
      for(var i = 1; i < 3; i++)
        out.vertexTextureCoords.push(parseFloat(linePieces[i]));
    }
    else if(linePieces[0] == "f") {
      //this is a face entry. indices in the file start at 1, but we want them to start at 0 in js
      for(var i = 2; i < 5; i++) {
        out.indices.push(parseInt(parseInt(linePieces[i]) - 1));
      }
    }
  });
  return out;
}

/**
  * Creates a cube, centered at the origin. 
  * @param {Float32} side Edge length of the cube. If not given, the value will be 1.
  */
function cube(side) {
   var s = (side || 1)/2;
   var coords = [];
   var normals = [];
   var texCoords = [];
   var indices = [];
   function face(xyz, nrm) {
      var start = coords.length/3;
      var i;
      for (i = 0; i < 12; i++) {
         coords.push(xyz[i]);
      }
      for (i = 0; i < 4; i++) {
         normals.push(nrm[0],nrm[1],nrm[2]);
      }
      texCoords.push(0,0,1,0,1,1,0,1);
      indices.push(start,start+1,start+2,start,start+2,start+3);
   }
   face( [-s,-s,s, s,-s,s, s,s,s, -s,s,s], [0,0,1] );
   face( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s], [0,0,-1] );
   face( [-s,s,-s, -s,s,s, s,s,s, s,s,-s], [0,1,0] );
   face( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s], [0,-1,0] );
   face( [s,-s,-s, s,s,-s, s,s,s, s,-s,s], [1,0,0] );
   face( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s], [-1,0,0] );
   return {
      vertexPositions: new Float32Array(coords),
      vertexNormals: new Float32Array(normals),
      vertexTextureCoords: new Float32Array(texCoords),
      indices: new Uint16Array(indices)
   }
}

// Load Teapot Model
function loadTeapotModel() {
  $.get('teapot_0.obj', function(data) {
    teapot0 = createModel(ComputeNorms(LoadObj(data)));
  });
}

/**
  * Computes per vertex normals of a model. 
  * @param {Float32} data Model data.
  */
function ComputeNorms(data) {
  // the plan is to find the normal of each triangle, then go through all the vertices, find all the triangles they're attached to, and compute the per-vertex normal from there
  var numVertices = data.vertexPositions.length / 3;
  var numTris = data.indices.length / 3;

  data.vertexNormals = new Array();

  // will contain the xyz components of the normal
  var triangles = new Array(numTris);
  // vertexIndices[n] will contain the indices of the triangles that vertex[n] is part of
  var vertexIndices = new Array(numVertices);
  for(var i = 0; i < vertexIndices.length; i++)
    vertexIndices[i] = new Array();

  var u = vec3.create();
  var v = vec3.create();

  for(var i = 0; i < numTris; i++) {
    // indices of the indices of the vertices
    var vii1 = 3 * i;
    var vii2 = 3 * i + 1;
    var vii3 = 3 * i + 2;
    // indices of the vertices
    var vi1 = data.indices[vii1] * 3;
    var vi2 = data.indices[vii2] * 3;
    var vi3 = data.indices[vii3] * 3;
    // vertices
    var v1 = [data.vertexPositions[vi1], data.vertexPositions[vi1 + 1], data.vertexPositions[vi1 + 2]];
    var v2 = [data.vertexPositions[vi2], data.vertexPositions[vi2 + 1], data.vertexPositions[vi2 + 2]];
    var v3 = [data.vertexPositions[vi3], data.vertexPositions[vi3 + 1], data.vertexPositions[vi3 + 2]];

    
    var normal = vec3.create();
    var normalized = vec3.create();
    vec3.subtract(u, v2, v1);
    vec3.subtract(v, v3, v1);
    vec3.cross(normal, u, v);
    vec3.normalize(normalized, normal);

    // save this vector
    triangles[i] = normalized;
    // save the vertices it's part of
    vertexIndices[vi1 / 3].push(i);
    vertexIndices[vi2 / 3].push(i);
    vertexIndices[vi3 / 3].push(i);
  }

  for(var i = 0; i < numVertices; i++) {
    var totalNormal = vec3.create();
    var temp = vec3.create();
    while(vertexIndices[i].length !== 0) {
      var currentTriangle = vertexIndices[i].pop();
      vec3.add(temp, totalNormal, triangles[currentTriangle]);
      vec3.copy(totalNormal, temp);
    }
    var normalized = vec3.create();
    vec3.normalize(normalized, totalNormal);
    data.vertexNormals[i * 3] = normalized[0];
    data.vertexNormals[i * 3 + 1] = normalized[1];
    data.vertexNormals[i * 3 + 2] = normalized[2];
  }

  for(var i = 0; i < numVertices; i++) {
    // angle should be atan(x/z)
    var angle = Math.atan(data.vertexPositions[3 * i] / data.vertexPositions[3 * i + 2]);
    data.vertexTextureCoords[2 * i] = Math.sin((angle + Math.PI / 4) / 2);
    data.vertexTextureCoords[2 * i + 1] = data.vertexPositions[3 * i + 1] * 7;
  }

  return {
      vertexPositions: new Float32Array(data.vertexPositions),
      vertexNormals: new Float32Array(data.vertexNormals),
      vertexTextureCoords: new Float32Array(data.vertexTextureCoords),
      indices: new Uint16Array(vertexIndices)
   };
}

/**
  * Loads skybox textures. 
  * @param {Float32Array} urls Urls of textures.
  */
function loadTextureCube(urls) {
    var ct = 0;
    var img = new Array(6);
    var urls = [
       "sample/pos-x.png", "sample/neg-x.png", 
       "sample/pos-y.png", "sample/neg-y.png", 
       "sample/pos-z.png", "sample/neg-z.png"
    ];
    for (var i = 0; i < 6; i++) {
        img[i] = new Image();
        img[i].onload = function() {
            ct++;
            if (ct == 6) {
                texID = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texID);
                var targets = [
                   gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                   gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z 
                ];
                for (var j = 0; j < 6; j++) {
                    gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                }
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                draw();
            }
        }
        img[i].src = urls[i];
    }
}

/**
  * Creates model. 
  * @param {Float32Array} modelData Model data.
  */
function createModel(modelData) {
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    model.coordsBuffer.itemSize = 3;
    model.coordsBuffer.numItems = modelData.vertexPositions.length / 3;
    //console.log("Teapot vertexPositions length: " + (model.coordsBuffer.numItems));

    model.normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexNormals, gl.STATIC_DRAW);
    model.normalBuffer.itemSize = 3;
    model.normalBuffer.numItems = modelData.vertexNormals.length / 3;
    //console.log("Teapot vertexNormals length: " + (model.normalBuffer.numItems));

    model.TextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.TextureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexTextureCoords, gl.STATIC_DRAW);
    model.TextureCoordBuffer.itemSize = 2;
    model.TextureCoordBuffer.numItems = modelData.vertexTextureCoords.length / 2;
    //console.log("Teapot TextureCoords length: " + (model.TextureCoordBuffer.numItems));

    model.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    model.indexBuffer.itemSize = 1;
    model.indexBuffer.numItems = modelData.indices.length / 1;
    //console.log("Teapot Indices length: " + (model.indexBuffer.numItems));

    model.render = function() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aCoords, this.coordsBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.vertexAttribPointer(aNormal, this.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.TextureCoordBuffer);
        gl.vertexAttribPointer(aTextureCoords, this.TextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix4fv(uModelview, false, modelview);
        gl.uniformMatrix3fv(uNormalMatrix, false, normalMatrix);
        gl.uniformMatrix3fv(uInvVT, false, invVT);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    return model;
}

function createModelSB(modelData) {  // For creating the skybox cube.
    var model = {};
    model.coordsBuffer = gl.createBuffer();
    model.indexBuffer = gl.createBuffer();
    model.count = modelData.indices.length;
    gl.bindBuffer(gl.ARRAY_BUFFER, model.coordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, modelData.vertexPositions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelData.indices, gl.STATIC_DRAW);
    console.log("Skybox vertexPositions length: " + (modelData.vertexPositions.length));
    console.log("Skybox indices length: " + (modelData.indices.length));
    model.render = function() { 
        gl.bindBuffer(gl.ARRAY_BUFFER, this.coordsBuffer);
        gl.vertexAttribPointer(aCoords_SB, 3, gl.FLOAT, false, 0, 0);
        gl.uniformMatrix4fv(uModelview_SB, false, modelview );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
}

/**
 * An event listener for the keydown event.  It is installed by the startup() function.
 */
function doKey(evt) {
    var rotationChanged = true;
	switch (evt.keyCode) {
	    case 37: rotY -= 0.05; break;        // left arrow
	    case 39: rotY +=  0.05; break;       // right arrow
	    case 38: rotX -= 0.05; break;        // up arrow
	    case 40: rotX += 0.05; break;        // down arrow
	    case 13: rotX = rotY = 0; break;  // return
	    case 36: rotX = rotY = 0; break;  // home
	    default: rotationChanged = false;
	}
	if (rotationChanged) {
     	     evt.preventDefault();
             draw();
	}
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
   var vsh = gl.createShader( gl.VERTEX_SHADER );
   gl.shaderSource(vsh,vertexShaderSource);
   gl.compileShader(vsh);
   if ( ! gl.getShaderParameter(vsh, gl.COMPILE_STATUS) ) {
      throw "Error in vertex shader:  " + gl.getShaderInfoLog(vsh);
   }
   var fsh = gl.createShader( gl.FRAGMENT_SHADER );
   gl.shaderSource(fsh, fragmentShaderSource);
   gl.compileShader(fsh);
   if ( ! gl.getShaderParameter(fsh, gl.COMPILE_STATUS) ) {
      throw "Error in fragment shader:  " + gl.getShaderInfoLog(fsh);
   }
   var prog = gl.createProgram();
   gl.attachShader(prog,vsh);
   gl.attachShader(prog, fsh);
   gl.linkProgram(prog);
   if ( ! gl.getProgramParameter( prog, gl.LINK_STATUS) ) {
      throw "Link error in program:  " + gl.getProgramInfoLog(prog);
   }
   return prog;
}

function getTextContent( elementID ) {
    var element = document.getElementById(elementID);
    var fsource = "";
    var node = element.firstChild;
    var str = "";
    while (node) {
        if (node.nodeType == 3) // this is a text node
            str += node.textContent;
        node = node.nextSibling;
    }
    return str;
}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**
 * Sends material information to the shader
 * @param {Float32Array} dcolor Diffuse material color
 * @param {Float32Array} acolor Dmbient material color
 * @param {Float32Array} scolor Specular material color 
 * @param {Float32} shiny Shininess exponent for Phong illumination
 */
function uploadMaterialToShader(dcolor,acolor,scolor,shiny) {
  gl.uniform3fv(uniformDiffuseMaterialColor, dcolor);
  gl.uniform3fv(uniformAmbientMaterialColor, acolor);
  gl.uniform3fv(uniformSpecularMaterialColor, scolor);
  gl.uniform1f(uniformShininess, shiny);
}

/**
 * Sends light information to the shader
 * @param {Float32Array} loc Location of light source
 * @param {Float32Array} a Ambient light strength
 * @param {Float32Array} d Diffuse light strength
 * @param {Float32Array} s Specular light strength
 */
function uploadLightsToShader(loc,a,d,s) {
  gl.uniform3fv(uniformLightPositionLoc, loc);
  gl.uniform3fv(uniformAmbientLightColorLoc, a);
  gl.uniform3fv(uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(uniformSpecularLightColorLoc, s); 
}

function draw() {
  gl.clearColor(0,0,0,1);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
  mat4.perspective(projection, Math.PI/3, 1, 10, 2000);
    
  modelview = rotator.getViewMatrix();
  mat3.normalFromMat4(normalMatrix, modelview);
    
  // Draw the skybox, with the viewing transform from the rotator.
    
  gl.useProgram(prog_SB); // Select the shader program that is used for the skybox.
  gl.uniformMatrix4fv(uProjection_SB, false, projection);
  if (texID) {
    gl.enableVertexAttribArray(aCoords_SB);
    cube.render();  
    gl.disableVertexAttribArray(aCoords_SB);
  }
    
  // Get the inverse of the rotation that was applied to the skybox.
  // This is needed in the teapot shader to account for the rotation
  // of the skybox.  (Note that it is passed to the shader in the
  // teapot's render function.)
    
  mat3.fromMat4(invVT, modelview);
  mat3.invert(invVT,invVT);

  // Add modeling rotations to the view transform.

  mat4.rotateX(modelview,modelview,rotX);
  mat4.rotateY(modelview,modelview,rotY);
    
  mat3.normalFromMat4(normalMatrix, modelview);
    
  // Draw the teapot.
    
  gl.useProgram(prog); // Select the shader program that is used for the teapot.
  gl.uniformMatrix4fv(uProjection, false, projection);
  if (texID) {
    gl.enableVertexAttribArray(aCoords);
    gl.enableVertexAttribArray(aNormal);
    gl.enableVertexAttribArray(aTextureCoords);
    teapot.render();  
    gl.disableVertexAttribArray(aCoords);
    gl.disableVertexAttribArray(aNormal);
    gl.disableVertexAttribArray(aTextureCoords);
  }
  
  uploadLightsToShader([20,20,20],[0.0,0.0,0.0],[1.0,1.0,1.0],[1.0,1.0,1.0]);
  uploadMaterialToShader([0.7,0.7,0.7],[0.15,0.15,0.15],[1.0,1.0,1.0],64);

  tick();
}

/**
 * An event listener for the shaderchange event.
 * It is installed in the radio button section in Teapot.html
 */
function changeShader(shadertype){
  var shaderChanged = true;
  vertexShaderSource = getTextContent("vshader"); 
  fragmentShaderSource = getTextContent("fshader-" + shadertype);
  prog = createProgram(gl,vertexShaderSource,fragmentShaderSource);
  // since default shading method is reflective, we need to reload simple shading buffers
  aCoords =  gl.getAttribLocation(prog, "coords");
  aNormal =  gl.getAttribLocation(prog, "normal")
  aTextureCoords = gl.getAttribLocation(prog, "texturecoords");
  uModelview = gl.getUniformLocation(prog, "modelview");
  uProjection = gl.getUniformLocation(prog, "projection");
  uNormalMatrix = gl.getUniformLocation(prog, "normalMatrix");
  uInvVT = gl.getUniformLocation(prog, "invVT");
  uniformLightPositionLoc = gl.getUniformLocation(prog, "uLightPosition");    
  uniformAmbientLightColorLoc = gl.getUniformLocation(prog, "uAmbientLightColor");  
  uniformDiffuseLightColorLoc = gl.getUniformLocation(prog, "uDiffuseLightColor");
  uniformSpecularLightColorLoc = gl.getUniformLocation(prog, "uSpecularLightColor");
  uniformDiffuseMaterialColor = gl.getUniformLocation(prog, "uDiffuseMaterialColor");
  uniformAmbientMaterialColor = gl.getUniformLocation(prog, "uAmbientMaterialColor");
  uniformSpecularMaterialColor = gl.getUniformLocation(prog, "uSpecularMaterialColor");
  uniformShininess = gl.getUniformLocation(prog, "uShininess");   

  draw(); // draw immediately after shader changed

  if (shaderChanged) {
    draw();
  }
}

function startup() {
   try {
        var canvas = document.getElementById("glcanvas");
        gl = canvas.getContext("webgl");
        if ( ! gl ) {
            gl = canvas.getContext("experimental-webgl");
        }
        if ( ! gl ) {
            throw "Could not create WebGL context.";
        }

        var vertexShaderSource = getTextContent("vshaderSB"); 
        var fragmentShaderSource = getTextContent("fshaderSB");
        prog_SB = createProgram(gl,vertexShaderSource,fragmentShaderSource);
        aCoords_SB =  gl.getAttribLocation(prog_SB, "coords");
        uModelview_SB = gl.getUniformLocation(prog_SB, "modelview");
        uProjection_SB = gl.getUniformLocation(prog_SB, "projection");
        
        vertexShaderSource = getTextContent("vshader"); 
        fragmentShaderSource = getTextContent("fshader-reflective"); // here default fshader is reflective
        prog = createProgram(gl,vertexShaderSource,fragmentShaderSource);
        aCoords =  gl.getAttribLocation(prog, "coords");
        aNormal =  gl.getAttribLocation(prog, "normal");
        aTextureCoords = gl.getAttribLocation(prog, "texturecoords");
        uModelview = gl.getUniformLocation(prog, "modelview");
        uProjection = gl.getUniformLocation(prog, "projection");
        uNormalMatrix = gl.getUniformLocation(prog, "normalMatrix");
        uInvVT = gl.getUniformLocation(prog, "invVT");
        uniformLightPositionLoc = gl.getUniformLocation(prog, "uLightPosition");    
        uniformAmbientLightColorLoc = gl.getUniformLocation(prog, "uAmbientLightColor");  
        uniformDiffuseLightColorLoc = gl.getUniformLocation(prog, "uDiffuseLightColor");
        uniformSpecularLightColorLoc = gl.getUniformLocation(prog, "uSpecularLightColor");
        uniformDiffuseMaterialColor = gl.getUniformLocation(prog, "uDiffuseMaterialColor");
        uniformAmbientMaterialColor = gl.getUniformLocation(prog, "uAmbientMaterialColor");
        uniformSpecularMaterialColor = gl.getUniformLocation(prog, "uSpecularMaterialColor");
        uniformShininess = gl.getUniformLocation(prog, "uShininess");    

        var cameraLocation = [0, 0.15, 0];
  
        cameraLocation[0] = 0.3 * Math.sin(degToRad(angle));
        cameraLocation[2] = 0.3 * Math.cos(degToRad(angle));
        rotator = new SimpleRotator(canvas,draw);
        rotator.setView( cameraLocation, [0,1,0], 45 );
        loadTeapotModel();
        teapot = createModel(teapotModel);
        cube = createModelSB(cube(1000));
        }
        catch (e) {
            return;
        }
        loadTextureCube();
        document.addEventListener("keydown", doKey, false);
        draw();
}

var lastTime = 0;

function animate() {
  var timeNow = new Date().getTime();
  if(lastTime !== 0)
    angle += 0.03 * (timeNow - lastTime);
  lastTime = timeNow;
}

function tick() {
  requestAnimFrame(tick);
  animate();
}
