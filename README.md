# ferreyrapons.com
## Personal website

Here's the source code for my website so that you may peruse it at your leisurely will.

The code for handling the WebGL particles might be of interest to some out there.

Maybe later I'll remove the dependency on three.js since it adds about 500KB to the 
initial page load size, pretty much making it twice as big. I'm thinking perhaps I'll
look into [TWGL.js](https://twgljs.org/).

Also, the build configuration is using the latest recommendations for typescript based
projects. No need for Webpack as the Typescript compiler and require.js take care of 
packing and uglyfying.
