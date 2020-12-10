import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useEffect } from 'react';
import TominoGLTF from './Robottino.gltf';
import { render } from '@testing-library/react';

const Tomino = ({standalone=true}) => {
    //console.log(props);
    //const [standalone, setStandalone] = useState(props.standalone || true);
    useEffect(() => {
        const scene = new THREE.Scene();
        const loader = new GLTFLoader();

        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        const canvas = document.getElementById("tomino-div");
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, canvas});
        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 2.3;
        renderer.shadowMap.enabled = true;
        if(standalone) {
            renderer.setSize(window.innerWidth, window.innerHeight)
            window.addEventListener( 'resize', onWindowResizeStandalone, false );
            camera.setViewOffset( window.innerWidth, window.innerHeight, (window.innerWidth/2)-window.innerWidth+(window.innerWidth/7), (window.innerHeight/2)-window.innerHeight+(window.innerHeight/7), window.innerWidth, window.innerHeight );
            function onWindowResizeStandalone(){
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize( window.innerWidth, window.innerHeight );
                camera.clearViewOffset();
                camera.setViewOffset( window.innerWidth, window.innerHeight, (window.innerWidth/2)-window.innerWidth+(window.innerWidth/7), (window.innerHeight/2)-window.innerHeight+(window.innerHeight/7), window.innerWidth, window.innerHeight );
            }
            camera.position.z = 5;
            camera.position.y += 3;
            } else {
                renderer.setSize(canvas.parentNode.offsetWidth, canvas.parentNode.offsetHeight)
                camera.aspect = canvas.parentNode.offsetWidth / canvas.parentNode.offsetHeight;
                camera.updateProjectionMatrix();
                camera.clearViewOffset();
                window.addEventListener( 'resize', onWindowResize, false );
                function onWindowResize(e){
                    console.log(canvas.parentNode.offsetWidth)
                    camera.aspect = canvas.parentNode.offsetWidth / canvas.parentNode.offsetHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize( canvas.parentNode.offsetWidth, canvas.parentNode.offsetHeight );
                    camera.clearViewOffset();
                }
                camera.position.z = 0;
                camera.position.y += 3;
            }

        const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 0.3);
        scene.add(hemiLight);

        const spotLight = new THREE.SpotLight(0xffa95c,1.2);
        spotLight.position.z = 20;
        spotLight.castShadow = true;
        scene.add(spotLight);

        const spotLight2 = new THREE.SpotLight(0xffa95c, 20);
        spotLight2.position.z -= 5;
        spotLight2.position.x = 5;
        spotLight2.position.y = 4;
        spotLight2.castShadow = true;
        scene.add(spotLight2);

        let Robottino = new THREE.Object3D();
        let mixer, animations, greetings;
        loader.load( TominoGLTF, function ( gltf ) {

                    Robottino = gltf.scene;
                    animations = gltf.animations;
                    mixer = new THREE.AnimationMixer(Robottino);
                    mixer.clipAction(animations[1]).play();
                    greetings = mixer.clipAction(animations[0]);
                    Robottino.name = "Robottino";
                    Robottino.position.y = 0;
                    Robottino.rotation.y = -1.7;
                    Robottino.rotation.x = -0.1;
                    Robottino.position.z -= 5;
                    Robottino.position.x = 0;
                    scene.add( Robottino );

                }, undefined, function ( error ) {

                    console.error( error );

                } );

                window.addEventListener('keydown', () => {
                    greetings.setLoop( THREE.LoopOnce );
                    greetings.clampWhenFinished = true;
                    greetings.enable = true;
                    greetings.play().reset();
                })

                var clock = new THREE.Clock();
        function animate() {
            if ( mixer ) mixer.update( clock.getDelta() );
            requestAnimationFrame( animate );
            renderer.render( scene, camera );

        }
        animate();

        
        
    }, []);

    const getCustomStyle = () => {
        const styles = {
            zIndex: 1,
            pointerEvents: "none",
            position: standalone ? "absolute" : "relative",
            top: standalone ? 0 : "unset",
            left: standalone ? 0 : "unset",
            height: standalone ? "100vh" : "500px",
            width: standalone ? "100vw" : "500px",
        }
        return styles;
    }

    return (
        <canvas id="tomino-div" style={getCustomStyle()}></canvas>
    );
};

export default Tomino;