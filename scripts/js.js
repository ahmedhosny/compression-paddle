


window.onload = function () {

  
//
// VARIABLES
// 
var myScene1,
myCamera1,
myRenderer1,
controls1;

var stlLoader = new THREE.STLLoader();
var fov =30;


var fullPath = "https://s3.amazonaws.com/compression-paddle/160725_print.stl"

// CONFIGURE BAR
NProgress.configure({ showSpinner: false });
NProgress.configure({ parent: '#three' });
NProgress.configure({ minimum: 0.05 });
NProgress.configure({ trickle: false });


Initialize("three", fullPath)


function Initialize(container, fullPath){

    //
    // INITIATE THREEJS
    //
    initiateScene1(container);
    

    // load first stl (last one in list)
    loadSTL(fullPath, container);
    
}

//
// LOAD STL 
//
function loadSTL(filePath, myContainer){

    var windowContainer = document.getElementById(myContainer);

    // RESIZE
    $(window).resize(function () {
        width=$("#" + myContainer).width();
        height=$("#" + myContainer).height();

        myCamera1.aspect = width/height;
        myCamera1.updateProjectionMatrix();

        myRenderer1.setSize( width, height );

    });

    NProgress.start();
    stlLoader.load( filePath, createScene1, onProgress); 
    
    myRenderer1.setSize( $("#" + myContainer).width() , $("#" + myContainer).height() );
    windowContainer.appendChild(myRenderer1.domElement);
    myRenderer1.setClearColor( 0xEBEBEB , 1 );
    render();


}

//
// CREATE SCENE 1
//
function initiateScene1(myContainer){

    myContainer = document.getElementById(myContainer);
    // SCENE
    myScene1 = new THREE.Scene();
    // CAMERA
    myCamera1 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer1 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera1.target = new THREE.Vector3(0,0,0);
    myCamera1.position.set(2100, 350, 5300);

    

    myCamera1.target = new THREE.Vector3(2000,-7,4500);

    myCamera1.updateProjectionMatrix();
    
    
    myScene1.add(myCamera1);
    // CONTROL
    controls1 = new THREE.TrackballControls( myCamera1, myContainer);
    controls1.rotateSpeed = 1.0;
    controls1.zoomSpeed = 1.2;
    controls1.panSpeed = 0.8;
    controls1.noZoom = false;
    controls1.noPan = false;
    controls1.staticMoving = false;
    controls1.dynamicDampingFactor = 0.15;
    controls1.keys = [ 65, 83, 68 ];
    controls1.autoRotate = true

}


//
// ON PROGRESS
//

function onProgress(data){
    var percent = ( data.loaded / data.total ). toFixed(3);
    if (percent > 0.05){
        NProgress.set(parseFloat(percent));  
    }   

}

//
// CREATE SCENE FUNC AND ADJUST CAMERA
//
function createScene1( geometry, materials ) {
    var myMesh1 = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial()  );  // 
    myScene1.add(myMesh1); 
    
    // CREATE BOUNDING BOX
    myMesh1.geometry.computeBoundingBox();
    var boundingBox1 = myMesh1.geometry.boundingBox;

    // FIX CAMERA
    var myX1= (boundingBox1.max.x + boundingBox1.min.x) / 2
    var myY1= (boundingBox1.max.y + boundingBox1.min.y) / 2
    var myZ1= (boundingBox1.max.z + boundingBox1.min.z) / 2

    // FIX TARGET
    myCamera1.target = new THREE.Vector3(myX1,myY1,myZ1);


    // SET POSITION
    myCamera1.position.set(boundingBox1.min.x -800 , boundingBox1.max.y + 100, boundingBox1.max.z +600);

    myCamera1.rotation.y
    // FIX ROTATION 
    myCamera1.updateProjectionMatrix();

    // FIX CONTROLS
    controls1.target.set( Math.round(myX1) , Math.round(myY1) , Math.round(myZ1) );

    myCamera1.updateProjectionMatrix();

    width=$("#three").width();
    height=$("#three").height();

    myCamera1.aspect = width/height;
    myCamera1.updateProjectionMatrix();

    myRenderer1.setSize( width, height );


}



//
// RENDER FUNC
//
function render(){
        myRenderer1.render(myScene1,myCamera1);
        controls1.update();
        requestAnimationFrame(render);

}

}









