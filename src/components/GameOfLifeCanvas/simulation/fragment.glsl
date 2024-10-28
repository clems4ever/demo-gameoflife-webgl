precision highp float;
 
uniform sampler2D u_texture;
uniform vec2 u_textureDims;

int get(int x, int y) {
    vec2 texcoord = (gl_FragCoord.xy + vec2(x, y)) / u_textureDims;
    return int(texture2D(u_texture, texcoord));
}

int next() {
    int neighbours_alive = get(-1, -1) +
              get(-1,  0) +
              get(-1,  1) +
              get( 0, -1) +
              get( 0,  1) +
              get( 1, -1) +
              get( 1,  0) +
              get( 1,  1);
    int current = get(0, 0);
    bool live = current == 1;

    // Below are the rules:
    // - Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // - Any live cell with two or three live neighbours lives on to the next generation.
    // - Any live cell with more than three live neighbours dies, as if by overpopulation.
    // - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    if (live && neighbours_alive < 2) {
        return 0;
    } else if (live && (neighbours_alive == 2 || neighbours_alive == 3)) {
        return current;
    } else if (live && neighbours_alive > 3) {
        return 0;
    } else if (!live && neighbours_alive == 3) {
        return 1;
    }
    return 0;
}
 
void main() {
    float current = float(next());
    gl_FragColor = vec4(current, current, current, 1.0);
}
