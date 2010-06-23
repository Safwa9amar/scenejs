/**
 * SceneJS Example - Switchable Viewpoint using the Symbol, Instance and Selector Nodes.
 *
 * A Selector node is a branch node that selects which among its children are currently active, while
 * a Symbol node marks its subgraph so that it can be instanced by Instance nodes.
 *
 * This example demonstrates these nodes by defining three LookAt (view transform) nodes that can be switched with
 * a Selector. Each LookAt contains an Instance of the scene content, which is defined within a Symbol.
 *
 * Click the mouse to switch between the viewpoints.
 *
 * Lindsay Kay
 * lindsay.kay@xeolabs.com
 * January 2010
 */
var exampleScene = SceneJS.scene({

    /* Bind scene to a WebGL canvas:
     */
    canvasId: "theCanvas",

    /* You can optionally write logging to a DIV - scene will log to the console as well.
     */
    loggingElementId: "theLoggingDiv" },

    //--------------------------------------------------------------------------------------------------------------
    // The scene content, a teapot illuminated by two light sources.
    // We'll defined it within a Symbol that will be referenced by an
    // Instance node within each child of our Selector, down below.
    //--------------------------------------------------------------------------------------------------------------

        SceneJS.symbol({ sid: "theScene" },

                SceneJS.camera({
                    optics: {
                        type: "perspective",
                        fovy : 65.0,
                        aspect : 1.0,
                        near : 0.10,
                        far : 300.0  }
                },

                        SceneJS.lights({
                            sources: [
                                {
                                    type:                   "dir",
                                    color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: 1.0, y: 1.0, z: 1.0 }
                                },
                                {
                                    type:                   "dir",
                                    color:                  { r: 0.8, g: 0.8, b: 0.8 },
                                    diffuse:                true,
                                    specular:               true,
                                    dir:                    { x: -2.0, y: -1.0, z: 0.0 }
                                }
                            ]},
                                SceneJS.material({
                                    baseColor:      { r: 0.6, g: 0.9, b: 0.6 },
                                    specularColor:  { r: 0.6, g: 0.9, b: 0.6 },
                                    specular:       0.9,
                                    shine:          6.0
                                },
                                        SceneJS.objects.teapot())))),

    //------------------------------------------------------------------------------------------------------
    // Our Selector node selects one of three LookAt child nodes
    // to provide the current view point. Each LookAt contains an
    // instance of the scene content.
    //------------------------------------------------------------------------------------------------------

        SceneJS.selector(function(data) {
            return {
                selection: [data.get("activeView")]
            };
        },
                SceneJS.lookAt({
                    eye : { z: 10.0 }
                },
                        SceneJS.instance({ uri: "theScene"})),

                SceneJS.lookAt({
                    eye : { x: 10.0 }
                },
                        SceneJS.instance({ uri: "theScene"})),

                SceneJS.lookAt({
                    eye : { x: -5.0, y: 5, z: 5 }
                },
                        SceneJS.instance({ uri: "theScene" })))
        )
        ;

//------------------------------------------------------------------------------------------------------------------
// Mouse handler and scene render calls - whenever the mouse is clicked, switch cameras and re-render scene.
//------------------------------------------------------------------------------------------------------------------

var activeView = 0;
var canvas = document.getElementById(exampleScene.getCanvasId());

exampleScene
        .setData({activeView: activeView })
        .render();

function mouseClick() {
    activeView = (activeView + 1) % 3;
    exampleScene
            .setData({activeView: activeView})
            .render();
}

canvas.addEventListener('click', mouseClick, true);


