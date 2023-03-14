var gl;
var camera;
var interactor;
var transforms;
var texture;
var texture2;
var useVertexColors = false;
var WEBGLAPP_RENDER = undefined;
var WEBGLAPP_TIMER_ID = -1;
var WEBGLAPP_RENDER_RATE = 16;

function configure(){
    gl.clearColor(36.0,36.0,36.0,1.0);
    gl.clearDepth(100.0);
    gl.enable(gl.DEPTH_TEST);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
 
    //Creates and sets up the camera location
    camera = new Camera(CAMERA_ORBITING_TYPE);
    camera.goHome([0,0,6.0]);
    camera.setFocus([0.0,0.0,0.0]);
    camera.setAzimuth(-45);
    camera.setElevation(2500);
    camera.hookRenderer = draw;
    
    //Creates and sets up the mouse and keyboard interactor
    interactor = new CameraInteractor(camera, document.getElementById('canvas-element-id'));
    
    //Scene Transforms
    transforms = new SceneTransforms(camera);
   
    //init transforms
    transforms.init();
    
    //Program
    attributeList = ["aVertexPosition",
                    "aVertexNormal",
                    "aVertexTangent",
                    "aVertexColor",
                    "aVertexTextureCoords"];
 
    uniformList = [ "uPMatrix", 
                    "uMVMatrix", 
                    "uNMatrix",
                    "uMaterialDiffuse",
                    "uMaterialAmbient",
                    "uLightAmbient",
                    "uLightDiffuse",
                    "uLightPosition",
                    "uWireframe",
                    "uAlpha",
                    "uUseVertexColor",
                    "uUseLambert",
                    "uSampler",
                    "uNormalSampler"
                    ];
    
    
    Program.load(attributeList, uniformList);
    
    gl.uniform3fv(Program.uLightPosition,   [-10,20,10]);
    gl.uniform4fv(Program.uLightAmbient,    [1.0,1.0,1.0,1.0]);
    gl.uniform4fv(Program.uLightDiffuse,    [1.0,1.0,1.0,1.0]);
    gl.uniform1f(Program.uAlpha, 1.0);
    gl.uniform1i(Program.uUseVertexColor, useVertexColors);
    gl.uniform1i(Program.uUseLambert, true);
    
    //Init textures
    //texture = new Texture('textures/planet-diffuse-specular.png');
    //texture2 = new Texture('textures/blocks_normal.jpg');
    //texture2 = new Texture('textures/planet-normals.png');
    texture = new Texture('textures/154.jpg');
    texture2 = new Texture('textures/154_norm.jpg')
}
 
/**
* Loads the scene
*/
function load(){
    Scene.loadObject('models/geometry/complexCube.json','cube2');
    //var object = generateSphere();
    //Scene.addObject(object);
}

/**
* Loads the texture
*/
function Texture(img){
    var self = this;
    this.tex = gl.createTexture();
    this.image = new Image();
    this.image.onload = function(){
        self.handleLoadedTexture();
    }
    if (img != null){
        this.setImage(img);
    }

};

Texture.prototype.setImage = function(file){
    this.image.src = file;
};

Texture.prototype.handleLoadedTexture = function(){
    console.info('loading image '+this.image.src);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
};

/**
 * Create a model of a sphere.  The z-axis is the axis of the sphere,
 * with the north pole on the positive z-axis and the center at (0,0,0).
 * @param radius the radius of the sphere, default 0.5 if not specified.
 * @param slices the number of lines of longitude, default 32
 * @param stacks the number of lines of latitude plus 1, default 16.  (This 
 *    is the number of vertical slices, bounded by lines of latitude, the
 *    north pole and the south pole.)
 */

function generateSphere(radius, slices, stacks) {
   radius = radius || 0.5;
   slices = slices || 256;
   stacks = stacks || 128;
   var vertexCount = (slices+1)*(stacks+1);
   var vertices = new Float32Array( 3*vertexCount );
   var normals = new Float32Array( 3* vertexCount );
   var texCoords = new Float32Array( 2*vertexCount );
   var indices = new Uint16Array( 2*slices*stacks*3 );
   var du = 2*Math.PI/slices;
   var dv = Math.PI/stacks;
   var i,j,u,v,x,y,z;
   var indexV = 0;
   var indexT = 0;
   for (i = 0; i <= stacks; i++) {
      v = -Math.PI/2 + i*dv;
      for (j = 0; j <= slices; j++) {
         u = j*du;
         x = Math.cos(u)*Math.cos(v);
         y = Math.sin(u)*Math.cos(v);
         z = Math.sin(v);
         vertices[indexV] = radius*x;
         normals[indexV++] = x;
         vertices[indexV] = radius*y;
         normals[indexV++] = y;
         vertices[indexV] = radius*z;
         normals[indexV++] = z;
         texCoords[indexT++] = j/slices;
         texCoords[indexT++] = i/stacks;
      } 
   }
   var k = 0;
   for (j = 0; j < stacks; j++) {
      var row1 = j*(slices+1);
      var row2 = (j+1)*(slices+1);
      for (i = 0; i < slices; i++) {
          indices[k++] = row1 + i;
          indices[k++] = row2 + i + 1;
          indices[k++] = row2 + i;
          indices[k++] = row1 + i;
          indices[k++] = row1 + i + 1;
          indices[k++] = row2 + i + 1;
      }
   }
   return object = {
       vertices: vertices,
       normals: normals,
       texture_coords: texCoords,
       indices: indices
   };
}

function SceneTransforms(c){
    this.stack = [];
    this.camera = c;
    this.mvMatrix    = mat4.create();    // The Model-View matrix
    this.pMatrix     = mat4.create();    // The projection matrix
    this.nMatrix     = mat4.create();    // The normal matrix
    this.cMatrix     = mat4.create();    // The camera matrix   
};

SceneTransforms.prototype.calculateModelView = function(){
    this.mvMatrix = this.camera.getViewTransform();
};

SceneTransforms.prototype.calculateNormal = function(){
    
    mat4.identity(this.nMatrix);
    mat4.set(this.mvMatrix, this.nMatrix);
    mat4.inverse(this.nMatrix);
    mat4.transpose(this.nMatrix);
};

SceneTransforms.prototype.calculatePerspective = function(){
    //Initialize Perspective matrix
    mat4.identity(this.pMatrix);
    mat4.perspective(30, c_width / c_height, 0.1, 1000.0, this.pMatrix);
};


// Defines the initial values for the transformation matrices
SceneTransforms.prototype.init = function(){
    this.calculateModelView();
    this.calculatePerspective();
    this.calculateNormal();
};


SceneTransforms.prototype.updatePerspective = function(){
    mat4.perspective(30, c_width / c_height, 0.1, 1000.0, this.pMatrix);  // We can resize the screen at any point so the perspective matrix should be updated always.
};


/**
* Maps the matrices to shader matrix uniforms
*
* Called once per rendering cycle. 
*/
SceneTransforms.prototype.setMatrixUniforms = function(){
    this.calculateNormal();
    gl.uniformMatrix4fv(Program.uMVMatrix, false, this.mvMatrix);  //Maps the Model-View matrix to the uniform prg.uMVMatrix
    gl.uniformMatrix4fv(Program.uPMatrix, false, this.pMatrix);    //Maps the Perspective matrix to the uniform prg.uPMatrix
    gl.uniformMatrix4fv(Program.uNMatrix, false, this.nMatrix);    //Maps the Normal matrix to the uniform prg.uNMatrix
};


SceneTransforms.prototype.push = function(){
    var memento =  mat4.create();
    mat4.set(this.mvMatrix, memento);
    this.stack.push(memento);
};

SceneTransforms.prototype.pop = function(){
    if(this.stack.length == 0) return;
    this.mvMatrix  =  this.stack.pop();
};
 
/**
* run WebGL App
*/
function WebGLApp(canvas) {
    this.loadSceneHook = undefined;
    this.configureGLHook = undefined;
    gl = Utils.getGLContext(canvas);
}
  
WebGLApp.prototype.run = function(){
        if (this.configureGLHook == undefined){
            alert('The WebGL application cannot start because the configureGLHook has not been specified'); return;
        }
        if (this.loadSceneHook == undefined){
            alert('The WebGL application cannot start because the loadSceneHook has not been specified'); return;
        }
        if (this.drawSceneHook == undefined){
            alert('The WebGL application cannot start because the drawSceneHook has not been specified'); return;
        }
        
        this.configureGLHook();
        
        this.loadSceneHook();
        
        WEBGLAPP_RENDER = this.drawSceneHook;
        
        renderLoop();
 }
 
 // Causes immediate rendering
 WebGLApp.prototype.refresh = function(){
    if (WEBGLAPP_RENDER) WEBGLAPP_RENDER();
 }
     
renderLoop = function(){
     WEBGLAPP_TIMER_ID = setInterval(WEBGLAPP_RENDER, WEBGLAPP_RENDER_RATE);
}

window.onblur = function(){
    clearInterval(WEBGLAPP_TIMER_ID);
    console.info('Rendering stopped');
}

window.onfocus = function(){
    renderLoop();
    console.info('Rendering resumed');
}
 
/**
* invoked on every rendering cycle
*/
function draw() {
    gl.viewport(0, 0, c_width, c_height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0, 0, 0, 0.8);
    transforms.updatePerspective();
 
    try{
        for (var i = 0; i < Scene.objects.length; i++){
            
            var object = Scene.objects[i];
            
            if (object.hidden == true) continue;
            
            transforms.calculateModelView();
            transforms.push();
            transforms.setMatrixUniforms();
            transforms.pop();
   
            //Setting uniforms
            gl.uniform4fv(Program.uMaterialDiffuse, object.diffuse);
            gl.uniform4fv(Program.uMaterialAmbient, object.ambient);
 
            //Setting attributes
            gl.enableVertexAttribArray(Program.aVertexPosition);
            gl.disableVertexAttribArray(Program.aVertexNormal);
            gl.disableVertexAttribArray(Program.aVertexTangent);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, object.vbo);
            gl.vertexAttribPointer(Program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(Program.aVertexPosition);
            
            if (object.texture_coords){
                gl.enableVertexAttribArray(Program.aVertexTextureCoords);
                gl.bindBuffer(gl.ARRAY_BUFFER, object.tbo);
                gl.vertexAttribPointer(Program.aVertexTextureCoords, 2, gl.FLOAT, false, 0, 0);
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture.tex);
                gl.uniform1i(Program.uSampler, 0);
                
                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, texture2.tex);
                gl.uniform1i(Program.uNormalSampler, 1);
            }
            
            if(!object.wireframe){
                gl.bindBuffer(gl.ARRAY_BUFFER, object.nbo);
                gl.vertexAttribPointer(Program.aVertexNormal, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(Program.aVertexNormal);
 
                gl.bindBuffer(gl.ARRAY_BUFFER, object.tanbo);
                gl.vertexAttribPointer(Program.aVertexTangent, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(Program.aVertexTangent);
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.ibo);
            
            if (object.wireframe){
                gl.drawElements(gl.LINES, object.indices.length, gl.UNSIGNED_SHORT,0);
            }
            else{
                gl.drawElements(gl.TRIANGLES, object.indices.length, gl.UNSIGNED_SHORT,0);
            }
            
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            
        }
    }
    catch(err){
        alert(err);
        console.error(err.description);
    }
}
 
 
/**
* Entry point. This function is invoked when the page is loaded
*/
var app = null;
function startup() {
    app = new WebGLApp("canvas-element-id")
    app.configureGLHook = configure;
    app.loadSceneHook   = load;
    app.drawSceneHook   = draw;
    app.run();
}