/**
 * Sawn-off smooth shader that uses only the position of the most recently defined light
 * source (the last light defined in the the light list of the current light node) and
 * the ambient, specular and diffuse components of a material node.
 *
 * SceneJS shaders always have separate projection, view and modelling matrices for efficiency.
 *
 * They provide two sets of functions to SceneJS: binders and setters. A binder function dynamically sets a GL buffer as
 * the source of some script attribute, such as a vertex or normal, while a setter sets the value of some attribute
 * within a script, such as a matrix.
 *
 * This is just to get you started!
 *
 * In practise, your shaders would want to use all of the lights, perhaps using something
 * like the virtualised lightsources technique described at:
 * http://gpwiki.org/index.php/OpenGL:Tutorials:Virtualized_Lights_with_OpenGL_and_GLSL
 *
 * @param cfg
 */

SceneJs.backends.installBackend(SceneJs.shaderBackend({

    type: 'simple-shader',

    vertexShaders: [
        //        "attribute vec3 Vertex;\n" +
        //        "attribute vec3 Normal;\n" +
        //        "attribute vec4 InColor;\n" +
        //
        //            /* Matrix locations - these will be mapped to scene reserved names
        //             */
        //        "uniform mat4 PMatrix;\n" +
        //        "uniform mat4 VMatrix;\n" +
        //        "uniform mat4 MMatrix;\n" +
        //        "uniform mat3 NMatrix;\n" +
        //
        //            /* Light position - a value for this is specified in the node's 'vars' config
        //             */
        //        "uniform vec4 LightPos;\n" +
        //        "varying vec4 FragColor;\n" +

        // "void main(void) {\n" +
        //        "    vec4 v = vec4(Vertex, 1.0);\n" +
        //        "    vec4 mv = MMatrix * v;\n" +
        //        "    vec4 vv = VMatrix * mv;\n" +
        //        "    gl_Position = PMatrix * vv;\n" +
        //
        //        "    vec3 nn = normalize(NMatrix * Normal);\n" +
        //        "    vec3 lightDir = vec3(normalize(vv - LightPos));\n" +
        //
        //        "    float intensity = dot(lightDir, nn);\n" +
        //
        //        "    vec4 color;\n" +
        //
        //        "    if (intensity > 0.95)\n" +
        //        "      color = vec4(1.0,0.5,0.5,1.0);\n" +
        //        "    else if (intensity > 0.5)\n" +
        //        "      color = vec4(0.6,0.3,0.3,1.0);\n" +
        //        "    else if (intensity > 0.25)\n" +
        //        "      color = vec4(0.4,0.2,0.2,1.0);\n" +
        //        "    else\n" +
        //        "      color = vec4(0.2,0.1,0.1,1.0);\n" +
        //
        //        "    FragColor = color;\n" +
        //        "}\n"


        'attribute vec3 Vertex; ' +
        'attribute vec3 Normal; ' +

            /* Projection, view and modelling matrices
             */
        'uniform mat4 PMatrix; ' +
        'uniform mat4 VMatrix; ' +
        'uniform mat4 MMatrix; ' +

        'uniform vec4 LightPos; ' +
        'varying vec4 FragColor; ' +

        'uniform vec3 MaterialDiffuse;' +
        'uniform vec3 MaterialSpecular;' +
        'uniform vec3 MaterialAmbient;' +

        'void main(void) { ' +
        '   vec4 v = vec4(Vertex, 1.0); ' +
        '   vec4 mv = MMatrix * v; ' +
        '   vec4 vv = VMatrix * mv; ' +
        '   gl_Position = PMatrix * vv; ' +
        '   vec3 lightDir = vec3(normalize(vv - LightPos)); ' +
        '   float NdotL = max(dot(lightDir, Normal), 0.0); ' +
        '   vec3 diffuse = MaterialDiffuse + MaterialSpecular; ' +
        '   FragColor = vec4(NdotL * diffuse + MaterialAmbient, 1.0); ' +
        '} '
    ],

    fragmentShaders: [
        //        'varying float intensity; ' +
        'varying vec4 FragColor; ' +
        'void main(void) { ' +
        '      gl_FragColor = FragColor; ' +
            //    " gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); \n" +
        '} '
    ],

    /**
     * Binder functions - each of these dynamically sets a GL buffer as the value source for some script attribute.
     */
    binders : {

        /** Binds the given buffer to the Vertex attribute
         */
        bindVertexBuffer : function(context, findVar, buffer) {
            var vertexAttribute = findVar(context, 'Vertex');
            context.enableVertexAttribArray(vertexAttribute);
            context.bindBuffer(context.ARRAY_BUFFER, buffer);
            context.vertexAttribPointer(vertexAttribute, 4, context.FLOAT, false, 0, 0);
        },

        /** Binds the given buffer to the Normal attribute
         */
        bindNormalBuffer : function(context, findVar, buffer) {
            context.bindBuffer(context.ARRAY_BUFFER, buffer);
            context.vertexAttribPointer(findVar(context, 'Normal'), 3, context.FLOAT, false, 0, 0);
        }
    },

    /** Setter functions - each of these sets the value of some attribute within a script, such as a matrix.
     */
    setters : {


        scene_ViewMatrix: function(context, findVar, mat) {
            if (mat) {
                context.uniformMatrix4fv(findVar(context, 'VMatrix'), false, mat.getAsWebGLFloatArray());
            }
        },

        scene_ModelMatrix: function(context, findVar, mat) {
            if (mat) {
                context.uniformMatrix4fv(findVar(context, 'MMatrix'), false, mat.getAsWebGLFloatArray());
            }
        },

        scene_ProjectionMatrix: function(context, findVar, mat) {
            if (mat) {
                context.uniformMatrix4fv(findVar(context, 'PMatrix'), false, mat.getAsWebGLFloatArray());
            }
        },

        scene_Material: function(context, findVar, m) {
            if (m) {
                context.uniform3fv(findVar(context, 'MaterialAmbient'), [m.ambient.r, m.ambient.g, m.ambient.b]);
                context.uniform3fv(findVar(context, 'MaterialDiffuse'), [m.diffuse.r, m.diffuse.g, m.diffuse.b]);
                context.uniform3fv(findVar(context, 'MaterialSpecular'), [m.specular.r, m.specular.g, m.specular.b]);
            }
        },

        scene_Lights: function(context, findVar, lights) {
            if (lights && lights.length > 0) {
                var l = lights[0];
                context.uniform4fv(findVar(context, 'LightPos'), [l.pos.x, l.pos.y, l.pos.z, 1.0]);
            }
        }
//        ,
//
//         scene_Normal: function(context, findVar, normals) {
//            if (normals) {
//                var loc = findVar(context, 'Normal');
//                context.vertexAttribPointer(loc, 3, context.FLOAT, false, 0, normals);
//                context.enableVertexAttribArray(loc);
//            }
//        },
//
//        scene_Vertex: function(context, findVar, vertices) {
//            if (vertices) {
//                for (var i = 0; i < vertices.length; i++) {
//                    vertices[i] *= 10.0;
//                }
//                var loc = findVar(context, 'Vertex') ;
//                context.vertexAttribPointer(loc, 3, context.FLOAT, false, 0, vertices);
//                context.enableVertexAttribArray(loc);
//            }
//
//        }
    }
}));

