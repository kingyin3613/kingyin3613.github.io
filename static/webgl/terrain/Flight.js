var gl;
var canvas;
var shaderProgram;
var vertexPositionBuffer;
//var ext = gl.getExtension('OES_element_index_uint');

var aCoords_SB;         // For drawing the skybox
var uProjection_SB;     
var uModelview_SB;
var prog_SB;

var projection = mat4.create();   // projection matrix
var modelview;    // modelview matrix
var normalMatrix = mat3.create();
var invVT = mat3.create();  // The inverse of the view transform rotation matrix.

var texID;   // The cubemap texture.
var cube;    // The cube that is the skybox.

var temp_heightmap;
var temp_colormap;
var imageData;
var heightmap;
var colormap;
var vTerrain;
var cTerrain;
var nTerrain;
var fTerrain;

// Create a place to store terrain geometry
var tVertexPositionBuffer;

// Create a place to store normals for shading
var tVertexNormalBuffer;

// Create a place to store terrain color
var tVertexColorBuffer;

// Create a place to store the terrain triangles
var tIndexTriBuffer;

// Viewing positions
var eyePt = vec3.fromValues(-200.0,300.0,1024.0);
var viewDir = vec3.fromValues(0.0,0.0,-1.0);
var up = vec3.fromValues(0,8.0,0.0);
var viewPt = vec3.fromValues(0.0,5.0,0.0);

// Create the normal
var nMatrix = mat3.create();

// Create ModelView matrix
var mvMatrix = mat4.create();

// Create Projection matrix
var pMatrix = mat4.create();

var mvMatrixStack = [];

//====================== MP2 Part 1 =============================
//
/**
 * Setting up the buffers for terrain vertex positions, terrain vertex normals and terrain triangle indices
 * vTerrain array that will contain vertices generated
 * fTerrain array that will contain facets generated
 * nTerrain array that will contain normals generated
 */
function setupTerrainBuffers() {
    var vTerrain = [], fTerrain = [], nTerrain = [];
    var gridN = 1024;
    var numT = terrainFromIteration(gridN,-gridN,2*gridN,-gridN,2*gridN,vTerrain,fTerrain,nTerrain);
    
    generateNormals(vTerrain, fTerrain, numT, (gridN+1)*(gridN+1), nTerrain);

    tVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);      
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTerrain), gl.STATIC_DRAW);
    tVertexPositionBuffer.itemSize = 3;
    tVertexPositionBuffer.numItems = (gridN+1)*(gridN+1);
    
    tVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nTerrain), gl.STATIC_DRAW);
    tVertexNormalBuffer.itemSize = 3;
    tVertexNormalBuffer.numItems = (gridN + 1) * (gridN + 1);
    
    tIndexTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(fTerrain), gl.STATIC_DRAW);
    tIndexTriBuffer.itemSize = 1;
    tIndexTriBuffer.numItems = numT * 3;    
}

/**
 * Iteratively generate terrain from numeric inputs
 * @param {number} n
 * @param {number} minX Minimum X value
 * @param {number} maxX Maximum X value
 * @param {number} minY Minimum Y value
 * @param {number} maxY Maximum Y value
 * @param {Array} vertexArray Array that will contain vertices generated
 * @param {Array} facetArray Array that will contain indices facets generated
 * @param {Array} normalArray Array that will contain normals generated
 * @return {number}
 */
function terrainFromIteration(n,minX,maxX,minY,maxY,vertexArray,facetArray,normalArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    var heightMap = new Array();
    
    createHeightMap(n, heightMap);
    
    for(var i=0;i<=n;i++)
    {
       for(var j=0;j<=n;j++)
       {
           //  Match the heightMap with the (x,y) coords 
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           vertexArray.push(heightMap[i][j]);
           // Set the normals to (0,0,1)
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }
    }
    // Calculate the total number of triangles
    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           // vid is the index of first vertex of a facet
           var vid = i*(n+1) + j;

           // indices of three vertices of first triangle consisting a facet
           facetArray.push(vid);
           facetArray.push(vid+1);
           facetArray.push(vid+n+1);
           // indices of three vertices of second triangle consisting a facet
           facetArray.push(vid+1);
           facetArray.push(vid+1+n+1);
           facetArray.push(vid+n+1);
           // 
           numT+=2;
       }
    return numT;
}

//Height Map generation and Diamond-Square Algo Implementation.
//Major Implementation of Part1.
function createHeightMap(n,heightMap)
{
    //initializing the heightMap to initial condition. e.g. set to 40.
    for(var i=0;i<=n;i++)
    {
        heightMap[i] = new Array();
        for(var j=0;j<=n;j++)
        {
            heightMap[i][j] = 40;
        }
    }

    diamondSquare(heightMap, 0, n, 0, n,  0, 0, n, n, 60, n);
// ---------------------------------------------------------
// If you want to generate terrains like grand canyon, you could use
// following code. XD
//    for(var i = 0; i <= n; i++)
//    {
//        for(var j = 0; j <= n; j++)
//        {
//            if(heightMap[i][j] < 20)
//                heightMap[i][j] = 20;
//            if(heightMap[i][j] > 60)
//                heightMap[i][j] = 60;
//        }
//    }
}

/**
 * Implementation of the Diamond-Square Algorithm.
 * imput 4 corner indices: (x1,y1), (x2,y2), (x3,y3), (x4,y4)
 * for the square step, the boundary vertices will be set by averaging 3 instead of 4 height values
 */
function diamondSquare(heightMap, x1, x2, x3, x4, y1, y2, y3, y4, random_bound, max_n)
{
    // check if the width between two coords is sufficient to determine whether or not to stop
    if(x2-x1 == 1)
        return;
    var x_mid = (x2-x1)/2 + x1;
    var y_mid = (y3-y1)/2 + y1;
    heightMap[x_mid][y_mid] = (heightMap[x1][y1] + heightMap[x2][y2] + heightMap[x3][y3] + heightMap[x4][y4])/4 + Math.random() * random_bound - random_bound / 2;
    if(y2 + y2 - y_mid < max_n && y2 + y2 - y_mid > 0)
        heightMap[x_mid][y1] = (heightMap[x1][y1] + heightMap[x2][y2] + heightMap[x_mid][y_mid] + heightMap[x_mid][y2+y2-y_mid])/4 + Math.random() * random_bound - random_bound/2;
    else
        heightMap[x_mid][y1] = (heightMap[x1][y1] + heightMap[x2][y2] + heightMap[x_mid][y_mid])/3 + Math.random() * random_bound - random_bound/2;
    if(y3 + y3 - y_mid < max_n && y3 + y3 - y_mid > 0)
        heightMap[x_mid][y3] = (heightMap[x3][y3] + heightMap[x4][y4] + heightMap[x_mid][y_mid] + heightMap[x_mid][y3+y3-y_mid])/4 + Math.random() * random_bound - random_bound/2;
    else
        heightMap[x_mid][y3] = (heightMap[x3][y3] + heightMap[x4][y4] + heightMap[x_mid][y_mid])/3 + Math.random() * random_bound - random_bound/2;
    if(x1 - x_mid + x1 < max_n && x1 - x_mid + x1 > 0)
        heightMap[x1][y_mid] = (heightMap[x1][y1] + heightMap[x3][y3] + heightMap[x_mid][y_mid] + heightMap[x1-x_mid+x1][y_mid])/4 + Math.random() * random_bound - random_bound/2;
    else
        heightMap[x1][y_mid] = (heightMap[x1][y1] + heightMap[x3][y3] + heightMap[x_mid][y_mid])/3 + Math.random() * random_bound - random_bound/2;
    if(x2 - x_mid + x2 < max_n && x2 - x_mid + x2 > 0)
        heightMap[x3][y_mid] = (heightMap[x2][y2] + heightMap[x4][y4] + heightMap[x_mid][y_mid] + heightMap[x2-x_mid+x2][y_mid])/4 + Math.random() * random_bound - random_bound/2;
    else
        heightMap[x3][y_mid] = (heightMap[x2][y2] + heightMap[x4][y4] + heightMap[x_mid][y_mid])/3 + Math.random() * random_bound - random_bound/2;
    
    //recursively call diamandSquare until all the grids are operated.
    diamondSquare(heightMap, x1, x_mid, x1, x_mid, y1, y1, y_mid, y_mid, random_bound * 0.6);
    diamondSquare(heightMap, x_mid, x2, x_mid, x2, y1, y1, y_mid, y_mid, random_bound * 0.6);
    diamondSquare(heightMap, x1, x_mid, x1, x_mid, y_mid, y_mid, y3, y3, random_bound * 0.6);
    diamondSquare(heightMap, x_mid, x2, x_mid, x2, y_mid, y_mid, y3, y3, random_bound * 0.6);
}

/**
 * Calculator of the normals to be used in Blinn-Phong Model
 * Calculate per-vertex normals
 * Interpolate vertex normal across edge
 * Interpolate edge normal across polygon
 */
function generateNormals(vTerrain, fTerrain, numT, numV, tVertexNormalBuffer)
{
     var facetNormals = [];
    
    // calculate normals for each triangle
    for (var i = 0; i < numT; i++){
        var v1 = fTerrain[i*3];
        var v2 = fTerrain[i*3 + 1];
        var v3 = fTerrain[i*3 + 2];
        
        // compute surface normal
        var vector1 = vec3.fromValues(vTerrain[3*v2]-vTerrain[3*v1], vTerrain[3*v2+1]-vTerrain[3*v1+1], vTerrain[3*v2+2]-vTerrain[3*v1+2]);
        var vector2 = vec3.fromValues(vTerrain[3*v3]-vTerrain[3*v1], vTerrain[3*v3+1]-vTerrain[3*v1+1], vTerrain[3*v3+2]-vTerrain[3*v1+2]);
        var normal = vec3.create();
        vec3.cross(normal, vector1, vector2);
        
        facetNormals.push(normal[0]);
        facetNormals.push(normal[1]);
        facetNormals.push(normal[2]);
    }
    
    // initialize count array
    var count = []
    for (var i = 0; i < numV; i++)
        count.push(0);
    
    // calculate sum of the surface normal vectors to which each vertex belongs
    for (var i = 0; i < numT; i++){
        var v1 = fTerrain[i*3 + 0];
        var v2 = fTerrain[i*3 + 1];
        var v3 = fTerrain[i*3 + 2];
        // iterate over each vertex in triangle
        count[v1] += 1
        count[v2] += 1
        count[v3] += 1
        
        // vertex 0
        tVertexNormalBuffer[3*v1 + 0] += facetNormals[i*3 + 0];
        tVertexNormalBuffer[3*v1 + 1] += facetNormals[i*3 + 1];
        tVertexNormalBuffer[3*v1 + 2] += facetNormals[i*3 + 2];
        
        // vertex 1
        tVertexNormalBuffer[3*v2+1 + 0] += facetNormals[i*3 + 0];
        tVertexNormalBuffer[3*v2+1 + 1] += facetNormals[i*3 + 1];
        tVertexNormalBuffer[3*v2+1 + 2] += facetNormals[i*3 + 2];
        
        // vertex 2
        tVertexNormalBuffer[3*v3+2 + 0] += facetNormals[i*3 + 0];
        tVertexNormalBuffer[3*v3+2 + 1] += facetNormals[i*3 + 1];
        tVertexNormalBuffer[3*v3+2 + 2] += facetNormals[i*3 + 2];
    }
    
    // average each normal vector in tVertexNormalBuffer
    // then normalize each normal vector in tVertexNormalBuffer
    for (var i = 0; i < numV; i++){
        // average out the adjacent surface normal vectors for point
        tVertexNormalBuffer[3*i+0] = tVertexNormalBuffer[3*i+0]/count[i];
        tVertexNormalBuffer[3*i+1] = tVertexNormalBuffer[3*i+1]/count[i];
        tVertexNormalBuffer[3*i+2] = tVertexNormalBuffer[3*i+2]/count[i];
        
        // normalize the normal vector
        var normal = vec3.fromValues(tVertexNormalBuffer[i*3+0], tVertexNormalBuffer[i*3+1], tVertexNormalBuffer[i*3+2]);
        var normalized = vec3.create();
        vec3.normalize(normalized, normal);
        
        // store the normal vector
        tVertexNormalBuffer[i*3+0] = normalized[0];
        tVertexNormalBuffer[i*3+1] = normalized[1];
        tVertexNormalBuffer[i*3+2] = normalized[2];
    }
}

//draw the terrain
function drawTerrain(){
    gl.polygonOffset(0,0);
    
    // Bind vertex locations
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);


    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 
                           tVertexNormalBuffer.itemSize,
                           gl.FLOAT, false, 0, 0);   

    //Draw 
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.drawElements(gl.TRIANGLES, tIndexTriBuffer.numItems, gl.UNSIGNED_SHORT,0);     
}

//functions to uploading matrices
function uploadModelViewMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}
function uploadProjectionMatrixToShader() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
}
function uploadNormalMatrixToShader() {
  mat3.fromMat4(nMatrix,mvMatrix);
  mat3.transpose(nMatrix,nMatrix);
  mat3.invert(nMatrix,nMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, nMatrix);
}

//mvMatrix push and pop
function mvPushMatrix() {
    var copy = mat4.clone(mvMatrix);
    mvMatrixStack.push(copy);
}
function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
      throw "Empty Stack!";
    }
    mvMatrix = mvMatrixStack.pop();
}

//upload all three matrices
function setMatrixUniforms() {
    uploadModelViewMatrixToShader();
    uploadNormalMatrixToShader();
    uploadProjectionMatrixToShader();
}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

//====================== MP2 Part 2 =============================
//
//quaternions and values used for rotations and translations
var rollRotation = quat.create();
var pitchRotation = quat.create();
var yawRotation = quat.create();
var rollAngle = 0.0;
var pitchAngle = 0.0;
var yawAngle = 0.0;
var velocity = 0.50;
var conjugateRot = quat.create();
var orthoRot = vec3.fromValues(0.0, 1.0, 0.0);
var upRotated = vec3.fromValues(0.0, 1.0, 0.0);
var overallUpRotation = quat.create();
var overallViewDirRotation = quat.fromValues(1.0, 0.0, 0.0, 0.0);

// roll - rotation about x-axle
function roll()
{
  rollRotation[0] = 0.0*Math.sin(rollAngle/2);
  rollRotation[1] = 0.0*Math.sin(rollAngle/2);
  rollRotation[2] = -1.0*Math.sin(rollAngle/2);
  rollRotation[3] = Math.cos(rollAngle/2);

  var upQuat = quat.fromValues(up[0],up[1],up[2],0);
  overallUpRotation = quat.multiply(overallUpRotation, rollRotation, upQuat);

  conjugateRot = quat.conjugate(conjugateRot, rollRotation);
  overallUpRotation = quat.multiply(overallUpRotation, overallUpRotation, conjugateRot);
}
// pitch - rotation about y-axle
function pitch()
{
    orthoRot = vec3.cross(vec3.create(), vec3.fromValues(0.0, 0.0, -1.0), upRotated);
    pitchRotation[0] = orthoRot[0]*Math.sin(pitchAngle/2);
    pitchRotation[1] = orthoRot[1]*Math.sin(pitchAngle/2);
    pitchRotation[2] = orthoRot[2]*Math.sin(pitchAngle/2);
    pitchRotation[3] = Math.cos(pitchAngle/2);
    
    var upQuat = quat.fromValues(upRotated[0],upRotated[1],upRotated[2],0);
    var viewDirQuat = quat.fromValues(0.0, 0.0, -1.0,0);
    newUpQuat = quat.multiply(overallUpRotation, pitchRotation, upQuat);
    overallViewDirRotation = quat.multiply(overallViewDirRotation, pitchRotation, viewDirQuat);
    
    conjugateRot = quat.conjugate(conjugateRot, pitchRotation);
    
    overallUpRotation = quat.multiply(overallUpRotation, newUpQuat, conjugateRot);
    overallViewDirRotation = quat.multiply(overallViewDirRotation, overallViewDirRotation, conjugateRot);
}
// yaw - rotation about z-axle
function yaw()
{
    //no control for yaw(), dont need to implement
}

//translational movement along the current direction, with user controlled velocity and a selected time gap.
function translateMove()
{
    eyePt[0] += viewDir[0]*velocity;
    eyePt[1] += viewDir[1]*velocity;
    eyePt[2] += viewDir[2]*velocity;
}

//Code to handle user interaction
var currentlyPressedKeys = {};

function handleKeyDown(event) {
        currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
        currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    
        if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
            // Left cursor key or A
            rollAngle -= 0.02;
        } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
            // Right cursor key or D
            rollAngle += 0.02;
        } 

        if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
            // Up cursor key or W
            pitchAngle += 0.001;
        } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
            // Down cursor key or S
            pitchAngle -= 0.001;
        }
        if (currentlyPressedKeys[187]) {
            // + key 
            velocity += 0.02;
        } else if (currentlyPressedKeys[189]) {
            // - key
            velocity -= 0.02;
        }
}

//================ MP2 4-Credit Extension ======================
//
//
//draw the terrain
function drawTerrain_colormap(){
    gl.polygonOffset(0,0);
    
    // Bind vertex locations
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, tVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Bind vertex normals
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, tVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);   

    // Bind vertex colors
    gl.bindBuffer(gl.ARRAY_BUFFER, tVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, tVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);   

    //Draw 
    var ext = gl.getExtension('OES_element_index_uint');
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
    gl.drawElements(gl.TRIANGLES, tIndexTriBuffer.numItems, gl.UNSIGNED_INT,0);
    //gl.drawArrays(gl.TRIANGLES, tVertexPositionBuffer.numItems, gl.UNSIGNED_INT,0);     
     
}

/**
 * Setting up the buffers for terrain vertex positions, terrain vertex normals and terrain triangle indices
 * vTerrain array that will contain vertices generated
 * fTerrain array that will contain facets generated
 * nTerrain array that will contain normals generated
 */
function setupTerrainBuffers_Extension(gridN,vTerrain,cTerrain,nTerrain,fTerrain,numT) {
  //alert("numT = " + numT);
  //alert("fTerrain(" + fTerrain.length + "): " + fTerrain);
  //alert("vTerrain(" + vTerrain.length + "): " + vTerrain);
  //alert("cTerrain(" + cTerrain.length + "): " + cTerrain);
  //alert("nTerrain(" + nTerrain.length + "): " + nTerrain);

  tVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tVertexPositionBuffer);      
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vTerrain), gl.STATIC_DRAW);
  tVertexPositionBuffer.itemSize = 3;
  tVertexPositionBuffer.numItems = (gridN+1)*(gridN+1);
    
  tVertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tVertexColorBuffer);      
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cTerrain), gl.STATIC_DRAW);
  tVertexColorBuffer.itemSize = 4;
  tVertexColorBuffer.numItems = (gridN+1)*(gridN+1);

  tVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tVertexNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(nTerrain), gl.STATIC_DRAW);
  tVertexNormalBuffer.itemSize = 3;
  tVertexNormalBuffer.numItems = (gridN+1)*(gridN+1);

  tIndexTriBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tIndexTriBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(fTerrain), gl.STATIC_DRAW);
  tIndexTriBuffer.itemSize = 1;
  tIndexTriBuffer.numItems = numT * 3;    
}

/**
 * Iteratively generate terrain from numeric inputs
 * @param {number} n
 * @param {number} minX Minimum X value
 * @param {number} maxX Maximum X value
 * @param {number} minY Minimum Y value
 * @param {number} maxY Maximum Y value
 * @param {Array} vertexArray Array that will contain vertices generated
 * @param {Array} facetArray Array that will contain indices facets generated
 * @param {Array} normalArray Array that will contain normals generated
 * @return {number}
 */
function terrainFromHeightMap(n,minX,maxX,minY,maxY,vertexArray,facetArray,normalArray,colorArray)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
  
    for(var i=0;i<=n;i++)
    {
       for(var j=0;j<=n;j++)
       {
           // Set the normals to (0,0,1)
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }
    }
    // Calculate the total number of triangles
    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {
           // vid is the index of first vertex of a facet
           var vid = i*(n+1) + j;

           // indices of three vertices of first triangle consisting a facet
           facetArray.push(vid);
           facetArray.push(vid+1);
           facetArray.push(vid+n+1);
           // indices of three vertices of second triangle consisting a facet
           facetArray.push(vid+1);
           facetArray.push(vid+1+n+1);
           facetArray.push(vid+n+1);
           // 
           numT+=2;
       }
    return numT;
}

//Load Height Map and Color Map
function loadHeightMap(filenames)
{
//Initialization of the heightmap and colormap

//Load heightmap
  var files = filenames.split(";");
  //loadImage(colormap + ".png","color",n);
  loadImage([files[0] + ".png",files[1] + ".png"], OnLoadedImages);
  //loadImage(heightmap + ".png","height",n);
}

// Util class for downloading the png
function loadImage(urls, OnSuccess) {
  var pending = urls.length;
  var result = [];
  if (pending === 0) {
    setTimeout(onsuccess.bind(null, result), 0);
    return;
  }
  urls.forEach(function(url,i) {
    var img = new Image();

    img.onload = function() {
      var tempcanvas = document.createElement("canvas");
      var tempcontext = tempcanvas.getContext("2d");
      var size = 1024 * 1024;

      tempcanvas.width = 1024;
      tempcanvas.height = 1024;
      tempcontext.drawImage(img, 0, 0, 1024, 1024);

      result[i] = tempcontext.getImageData(0, 0, 1024, 1024).data;
      //alert("result["+ (pending-1) + "]: " + result[i]);
      pending--;
      if (pending === 0) {
        OnSuccess(result);
      }
    };
    img.src = url;
  });
}

function OnLoadedImages(result)
{
  var datac = result[0];
  var datah = result[1];
  colormap = [];
  for(var j=0; j<datac.length; j++) {
    colormap[j] = datac[j]/255.0;
  }

  heightmap = [];
  for(var j=0; j<(1024*1024); j++) {
    heightmap[j] = datah[j<<2];
  }

  vTerrain = [];
  for(var i=0;i<1024;i++)
  {
    for(var j=0;j<1024;j++)
    {
      vTerrain.push(-1024+2*j);
      vTerrain.push(-1024+2*i); 
      vTerrain.push(heightmap[1024*i+j]);
    }
  }
  fTerrain = []; 
  nTerrain = [];
  var gridN = 1023;
  var numT = terrainFromHeightMap(gridN,-gridN,gridN,-gridN,gridN,vTerrain,fTerrain,nTerrain,cTerrain);
  cTerrain = [];
  for (var i=0;i<colormap.length;i++) {
    cTerrain[i] = colormap[i];
  }
  //alert("numT = " + numT);
  //alert("fTerrain(" + fTerrain.length + "): " + fTerrain);
  //alert("vTerrain(" + vTerrain.length + "): " + vTerrain);
  //generateNormals_New(vTerrain, fTerrain, numT, nTerrain);
  //alert("cTerrain(" + cTerrain.length + "): " + cTerrain);
  //alert("nTerrain(" + nTerrain.length + "): " + nTerrain);

  setupShaders();
  setupBuffers(1023,vTerrain,cTerrain,nTerrain,fTerrain,numT);

  cube = createModelSB(cube(10000));
  //loadTextureCube(); // It is still needed to load all images simultaneously. Currently the problem is loadTextureCube() is running later than loadImage(), and this will lead to the result that terrain buffers deleted when loading the texture cube

  tick();
  loadTextureCube(); 
}

function generateNormals_New(vTerrain, fTerrain, numT, nTerrain) {
  // the plan is to find the normal of each triangle, then go through all the vertices, find all the triangles they're attached to, and compute the per-vertex normal from there
  var numVertices = vTerrain.length / 3; // 1024 * 1024

  // will contain the xyz components of the normal
  var triangles = new Array(numT);
  // vertexIndices[n] will contain the indices of the triangles that vertex[n] is part of
  var vertexIndices = new Array(numVertices);
  for(var i = 0; i < vertexIndices.length; i++)
    vertexIndices[i] = new Array();

  var u = vec3.create();
  var v = vec3.create();

  for(var i = 0; i < numT; i++) {
    // indices of the indices of the vertices
    var vii1 = 3 * i;
    var vii2 = 3 * i + 1;
    var vii3 = 3 * i + 2;
    // indices of the vertices
    var vi1 = fTerrain[vii1] * 3;
    var vi2 = fTerrain[vii2] * 3;
    var vi3 = fTerrain[vii3] * 3;
    // vertices
    var v1 = [vTerrain[vi1], vTerrain[vi1 + 1], vTerrain[vi1 + 2]];
    var v2 = [vTerrain[vi2], vTerrain[vi2 + 1], vTerrain[vi2 + 2]];
    var v3 = [vTerrain[vi3], vTerrain[vi3 + 1], vTerrain[vi3 + 2]];

    
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
    nTerrain[i * 3] = normalized[0];
    nTerrain[i * 3 + 1] = normalized[1];
    nTerrain[i * 3 + 2] = normalized[2];
  }
/*
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
   */
}

//====================== Skybox part ===================================
//
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

/**
  * Loads skybox textures. 
  * @param {Float32Array} urls Urls of textures.
  */
function loadTextureCube(urls) {
    var ct = 0;
    var img = new Array(6);
    var urls = [
       "sample/pos-x.jpg", "sample/neg-x.jpg", 
       "sample/pos-y.jpg", "sample/neg-y.jpg", 
       "sample/pos-z.jpg", "sample/neg-z.jpg"

       //"sample/pos-x.jpg", "sample/neg-x.jpg", 
       //"sample/pos-y.jpg", "sample/neg-y.jpg", 
       //"sample/pos-z.jpg", "sample/neg-z.jpg"
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
                tick();
            }
        }
        img[i].src = urls[i]; // Source after the callback event function
    }
}

/**
  * Creates skybox model. 
  * @param {Float32Array} modelData Model data.
  */
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
        gl.uniformMatrix4fv(uModelview_SB, false, mvMatrix );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.count, gl.UNSIGNED_SHORT, 0);
    }
    return model;
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

//======================================================================
/**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
  var names = ["webgl", "experimental-webgl"];
  var context = null;
  for (var i=0; i < names.length; i++) {
    try {
      context = canvas.getContext(names[i]);
    } catch(e) {}
    if (context) {
      break;
    }
  }
  if (context) {
    context.viewportWidth = canvas.width;
    context.viewportHeight = canvas.height;
  } else {
    alert("Failed to create WebGL context!");
  }
  return context;
}

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
  var shaderScript = document.getElementById(id);
  
  // If we don't find an element with the specified id
  // we do an early exit 
  if (!shaderScript) {
    return null;
  }
  
  // Loop through the children for the found DOM element and
  // build up the shader source code as a string
  var shaderSource = "";
  var currentChild = shaderScript.firstChild;
  while (currentChild) {
    if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
      shaderSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }
 
  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }
 
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
 
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  } 
  return shader;
}

/**
 * Setup the fragment and vertex shaders
 */
function setupShaders() {

  var vertexShaderSource = getTextContent("vshaderSB"); 
  var fragmentShaderSource = getTextContent("fshaderSB");
  prog_SB = createProgram(gl,vertexShaderSource,fragmentShaderSource);
  aCoords_SB =  gl.getAttribLocation(prog_SB, "coords");
  uModelview_SB = gl.getUniformLocation(prog_SB, "mvMatrix");
  uProjection_SB = gl.getUniformLocation(prog_SB, "pMatrix");
          
  vertexShader = loadShaderFromDOM("shader-vs");
  fragmentShader = loadShaderFromDOM("shader-fs");
  

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }


  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);


  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.uniformLightPositionLoc = gl.getUniformLocation(shaderProgram, "uLightPosition");    
  shaderProgram.uniformAmbientLightColorLoc = gl.getUniformLocation(shaderProgram, "uAmbientLightColor");  
  shaderProgram.uniformDiffuseLightColorLoc = gl.getUniformLocation(shaderProgram, "uDiffuseLightColor");
  shaderProgram.uniformSpecularLightColorLoc = gl.getUniformLocation(shaderProgram, "uSpecularLightColor");
  shaderProgram.uniformDiffuseMaterialColor = gl.getUniformLocation(shaderProgram, "uDiffuseMaterialColor");
  shaderProgram.uniformAmbientMaterialColor = gl.getUniformLocation(shaderProgram, "uAmbientMaterialColor");
  shaderProgram.uniformSpecularMaterialColor = gl.getUniformLocation(shaderProgram, "uSpecularMaterialColor");
  shaderProgram.uniformShininess = gl.getUniformLocation(shaderProgram, "uShininess");    
}

/**
 * Populate buffers with data
 */
function setupBuffers(gridN,vTerrain,cTerrain,nTerrain,fTerrain,numT) {
    setupTerrainBuffers_Extension(gridN,vTerrain,cTerrain,nTerrain,fTerrain,numT); 
}

/**
 * Sends material information to the shader
 * @param {Float32Array} a diffuse material color
 * @param {Float32Array} a ambient material color
 * @param {Float32Array} a specular material color 
 * @param {Float32} the shininess exponent for Phong illumination
 */
function uploadMaterialToShader(dcolor, acolor, scolor,shiny) {
  gl.uniform3fv(shaderProgram.uniformDiffuseMaterialColor, dcolor);
  gl.uniform3fv(shaderProgram.uniformAmbientMaterialColor, acolor);
  gl.uniform3fv(shaderProgram.uniformSpecularMaterialColor, scolor);
  gl.uniform1f(shaderProgram.uniformShininess, shiny);
}

//-------------------------------------------------------------------------
/**
 * Sends light information to the shader
 * @param {Float32Array} loc Location of light source
 * @param {Float32Array} a Ambient light strength
 * @param {Float32Array} d Diffuse light strength
 * @param {Float32Array} s Specular light strength
 */
function uploadLightsToShader(loc,a,d,s) {
  gl.uniform3fv(shaderProgram.uniformLightPositionLoc, loc);
  gl.uniform3fv(shaderProgram.uniformAmbientLightColorLoc, a);
  gl.uniform3fv(shaderProgram.uniformDiffuseLightColorLoc, d);
  gl.uniform3fv(shaderProgram.uniformSpecularLightColorLoc, s); 
}

/**
 * Draw call that applies matrix transformations to model and draws model in frame
 */
function draw() { 
    // Flight Simulator Navigation
    translateMove();
    roll();

    upRotated = vec3.fromValues(overallUpRotation[0],overallUpRotation[1],overallUpRotation[2]);
    pitch();
    yaw();
    
    upRotated = vec3.fromValues(overallUpRotation[0],overallUpRotation[1],overallUpRotation[2]);
    viewDir = vec3.fromValues(overallViewDirRotation[0],overallViewDirRotation[1],overallViewDirRotation[2]); 
    var transformVec = vec3.create();
        
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // We'll use perspective 
    mat4.perspective(pMatrix,degToRad(60), gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0);

    // We want to look down -z, so create a lookat point in that direction    
    vec3.add(viewPt, eyePt, viewDir);
    // Then generate the lookat matrix and initialize the MV matrix to that view
    mat4.lookAt(mvMatrix,eyePt,viewPt,upRotated);  
    
    // Draw the skybox, with the viewing transform from the rotator.
    gl.useProgram(prog_SB); // Select the shader program that is used for the skybox.
    gl.uniformMatrix4fv(uProjection_SB, false, pMatrix);
    if (texID) {
    gl.enableVertexAttribArray(aCoords_SB);
    cube.render();  
    gl.disableVertexAttribArray(aCoords_SB);
    }
      
    // Draw Terrain
    gl.useProgram(shaderProgram);
    vec3.set(transformVec, 0.0, 0,0);
    mat4.translate(mvMatrix, mvMatrix,transformVec);
    mat4.rotateX(mvMatrix, mvMatrix, degToRad(-90));
    uploadLightsToShader([0.0,0.0,0.0],[1.0,1.0,1.0],[1.0,1.0,1.0],[1.0,1.0,1.0]);
    uploadMaterialToShader([0.0,0.0,0.0],[0.1,0.1,0.1],[1.0,1.0,1.0],32.0);
    setMatrixUniforms();
    drawTerrain_colormap();
}

/**
 * Startup function called from html code to start program.
 */
function startup() {
    canvas = document.getElementById("myGLCanvas");
    gl = createGLContext(canvas);
	gl.clearColor(1.0,1.0,1.0,1.0);//background Color
	
    loadHeightMap("colorHMBIG;heightHMBIG");

    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    tick();
}

function animate() {
    //currently nothing to do
    
}

function tick() {
    requestAnimFrame(tick);
    handleKeys();
    draw();
    animate();
}
