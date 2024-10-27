precision highp float;
 
uniform sampler2D u_texture;
varying vec2 v_texCoord;
 
void main() {
  float v = 1.0 - texture2D(u_texture, v_texCoord).r;
  gl_FragColor = vec4(v, v, v, 1.0);
}