class Oscillators {
    constructor(num_oscillators) {
        this.num_oscillators = num_oscillators;
        this.oscillators = [];
    }

    // initiating a number of oscillators
    // and adding those to the oscillator
    // list. They should have multiple properties
    set_origins() {
        for (let i = 0; i < this.num_oscillators; i++) {
            this.oscillators.push(
                {
                    id: i,
                    originX: random(-windowWidth/2, windowWidth/2),
                    originY: random(-windowHeight/2, windowHeight/2),
                    originZ: random(-1000, 1000),
                    theta: random(TWO_PI),
                    angle: 0,
                    trail: [],
                    config: {
                        big_radius: random(0.1, 1),
                        amplitude: random(0.1, 1),
                        phase: random(0, 1),
                        small_radius: (0, 200),
                        period: random(20, 80),
                        offset: random(-windowHeight, windowHeight),
                        z_pos: random(-3, 3),
                        angle_velocity: random(0.05, 100),
                        color_shift: random(0.01, 0.1)
                    }
                }
            );
        }
    }

    show_origins() {
        for (let i of this.oscillators) {
            push();
            // fill(g, b, r, 255);
            fill(0, 0, 0, 255);
            stroke(255, 255, 255);
            strokeWeight(0.5);
            translate(i.originX, i.originY, i.originZ);
            sphere(params.get("small_radius"), detail, detail);
            pop();   
        }
    }

}
