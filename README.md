# WebGL Snow Globe

### Project Title:
Christmas Snow Globe Animation

### Team Members:
Jason Lai

Yuanyuan Xiong

Yingzhe Hu

## Description:
There will be a single scene depicting a snow globe with a Christmas tree and presents inside. It is snowing inside the snow globe.

## Individual Contributions:
### Jason Lai:
Reflection and Refraction with Glass, Environment Mapping (Skybox)

### Yuanyuan Xiong:
Drawing objects: Christmas Tree, Presents

### Yingzhe Hu:
Interactivity, Snow Simulation, Music

## How to Run:
If you are using a Mac, run "host.command", and if you are running a Windows, run "host.bat".  Afterwards, open Google Chrome and navigate to "http://localhost:8000".  You're ready to enjoy the animaition! There are some animation-related interactions provided through buttons.

## Details and Organization:
All code written by us are placed in main-scene.js. We also did change some parameters and values in tiny-graphics.js (e.g. enlarging the canvas), and added useful shapes from the tiny graphics WebGL library in dependencies.js.

## Custom Shapes:
### Tree Leaves
This was accomplished with a custom TreeCube shape. Each "level" represents one tree cube. 

### Star
This was accomplished with a custom Star shape.

### Skybox
The skybox is a plane (a regular square) with its vertices defined in viewport/screen space coordinates.

## Advanced Features:
### Environment Mapping
The skybox was created by mapping a cube map representing the environment to a plane. The 6 sides of the cube map represents the environment in the positive and negative x, y, and z directions. By breaking down a continuous scene (in our case, we used sort of a starry night kind of background) into a cube map, we are able to provide a more realistic background with smooth transitions.

This was done with a custom shader called Skybox_Shader in our program. This shader is intended to be applied on a plane object. This shader expects the plane's vertices to be given in viewport/screen space coordinates, and calculates the mapping of each point on the environment to a point on the plane.

### Glass 
Utilizing the same cube map we used for the skybox, we mapped the environment onto the sphere. On top of that, we used physics formulas like Snell's law, reflectivity, and fresnel (cited them from Wikipedia in our code) to simulate reflection and refraction.

This was also done with a custom shader called Glass_Shader in our program. This shader can be applied to any shape. 

### Snow Simulation
Used particles to simulate the behavior of snowflakes. A snowflake particle's "life" terminates after it falls a certain distance and is restarted again from it's initial point. A snowflake particle in this project is a very small sphere.

Users can interact with the snow particles with the labeled control buttons in the control panel below the animation. Interactions include pausing, stopping, and restarting the snow animation, increasing and decreasing the speed of snow particles, and adding wind from the positive or negative x-axis to change the snow particles' direction.

