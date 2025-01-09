const defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

const colors = ["#bb0000", "#ffffff"];

export function shoot(i) {
    if (i === 1) {
        confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
        });
    } else if (i === 2) {
        confetti({
            particleCount: 50,
            angle: 10,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
        });

    } else if (i === 3) {
        confetti({
            particleCount: 50,
            angle: 180,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
        });
    }
    else if (i === 4) {
        confetti({
            spread: 360,
            ticks: 200,
            gravity: 1,
            decay: 0.94,
            startVelocity: 30,
            particleCount: 100,
            scalar: 3,
            shapes: ["image"],
            shapeOptions: {
                image: [{
                    src: "https://cdn.intra.42.fr/users/4ea572080b176a1551da67a1574e3333/small_bapasqui.jpg",
                    width: 32,
                    height: 32,
                },
                {
                    src: "https://cdn.intra.42.fr/users/408819b9ecc12459e847129d20a195df/small_dboire.jpg",
                    width: 32,
                    height: 32,
                },
                {
                    src: "https://cdn.intra.42.fr/users/050587c4c1cf44513fafd788720f8b4a/small_aboulore.jpg",
                    width: 32,
                    height: 32,
                },
                ],
            },
        });
    }
}

