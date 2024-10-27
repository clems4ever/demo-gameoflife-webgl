precision highp float;
 
uniform sampler2D u_texture;
uniform vec2 u_textureDims;

int get(int x, int y)
{
    vec2 texcoord = (gl_FragCoord.xy + vec2(x, y)) / u_textureDims;
    return int(texture2D(u_texture, texcoord));
}

float next() {
    //count the "living" neighbour texels
    int sum = get(-1, -1) +
              get(-1,  0) +
              get(-1,  1) +
              get( 0, -1) +
              get( 0,  1) +
              get( 1, -1) +
              get( 1,  0) +
              get( 1,  1);

    //if we have 3 living neighbours the current cell will live, if there are two,
    //we keep the current state. Otherwise the cell is dead.
    if (sum==3) {
        return 1.0;
    }
    else if (sum== 2) {
        return float(get(0, 0));
    }
    else {
        return 0.0;
    }
}
 
void main() {
    float current = next();
    gl_FragColor = vec4(current, current, current, 1.0);
}
