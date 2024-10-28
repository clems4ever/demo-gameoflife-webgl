# WebGL Game of Life

This project is a demonstration of the Game of Life implemented using WebGL shaders.

Demo: https://wgol-demo.clems4ever.com/


[<img style="display: block; margin:auto" src="https://user-images.githubusercontent.com/9169414/36646548-4ac65af8-1a79-11e8-811d-da84549f7af3.gif" width="200"/>](https://user-images.githubusercontent.com/9169414/36646548-4ac65af8-1a79-11e8-811d-da84549f7af3.gif)

## What is Game of Life

The [Game of Life][game-of-life] is a cellular automaton devised by mathematician John Horton Conway in 1970. It is a zero-player game, meaning that its evolution is determined solely by its initial state and its rules. The Game of Life has been known to produce many intriguing patterns that have been cataloged and extensively studied.

## WebGL-Powered simulation

### Why use WebGL

I am passionate about simulations, and this project exemplifies how WebGL can be repurposed as a general-purpose GPU (GPGPU) platform. This approach enables various computational tasks to be accessible on the web, with the only requirement being a web browser with hardware acceleration enabled.

The Game of Life, while computationally intensive, is highly parallelizable, making it an ideal candidate for testing. In its simplest form, the simulation involves applying a convolution operator across the entire grid using a 3x3 matrix kernel. If the grid contains $P$ cells and the kernel has $K^2$ values, then the time complexity is $O(P \cdot K^2)$. Naturally, as the size of the kernel increases, the number of operations grows significantly.

While there are several examples online demonstrating how to simulate particle systems using WebGL, it was challenging to find a straightforward, easily replicable example for beginners. This project aims to fill that gap.

### How it works

In essence, this simulation consists of two WebGL programs. The first computes the next state of the grid, while the second renders the resulting grid onto the viewport.

The core concept involves using textures as buffers to store the grid's state. The second WebGL program then scales and projects these textures for display onto a canvas. The shader code implementing the Game of Life rules can be found [here][simulation-shader].

Note that there is absolutely no server-side computing, all the operations are done locally in your own graphic
card.

## Run locally

To run this project locally, execute the following commands:

```bashrc
git clone git@github.com:clems4ever/gameoflife-webgl.git

cd gameoflife-webgl

yarn install

yarn run start
```

## Extensions

### Lenia

This project has actually been created to enable a heavier version of the game of life in the continuous domain
called [Lenia](https://chakazul.github.io/Lenia/JavaScript/Lenia.html)

## License

This project is licensed under the MIT License.
Feel free to use it as you see fit. If this project was helpful to you,
you can buy me a beer!


[game-of-life]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[simulation-shader]: /src/components/GameOfLifeCanvas/simulation/fragment.glsl