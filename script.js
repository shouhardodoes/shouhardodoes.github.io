"use strict";


/* =====================================================
   DEVICE
===================================================== */

var isTouch =
    ("ontouchstart" in window) ||
    (navigator.maxTouchPoints > 0);


/* =====================================================
   INTRO
===================================================== */

window.addEventListener("load", function () {

    var intro =
        document.getElementById("intro");

    var enter =
        document.getElementById("enterWild");

    var pointer =
        document.getElementById("introPointer");

    var music =
        document.getElementById("ambientMusic");


    if (enter) {

        enter.addEventListener("click", function () {

            if (music) {

                music.volume = 0;

                var playPromise =
                    music.play();

                if (playPromise) {

                    playPromise.then(function () {

                        var volume = 0;

                        var fade =
                            setInterval(function () {

                                volume += 0.01;

                                if (volume >= 0.13) {

                                    volume = 0.13;

                                    clearInterval(fade);
                                }

                                music.volume = volume;

                            }, 70);

                    }).catch(function () {
                        /* Browser blocked playback */
                    });
                }
            }


            if (intro) {
                intro.classList.add("hidden");
            }

        });
    }


    /* =================================================
       INTRO POINTER
       FOLLOWS CURSOR + POINTS TOWARD BUTTON
    ================================================= */

    if (!isTouch && pointer && enter) {

        var mouseX =
            window.innerWidth / 2;

        var mouseY =
            window.innerHeight / 2;

        var targetX;
        var targetY;


        function updateTarget() {

            var rect =
                enter.getBoundingClientRect();

            targetX =
                rect.left +
                rect.width / 2;

            targetY =
                rect.top +
                rect.height / 2;
        }


        updateTarget();

        window.addEventListener(
            "resize",
            updateTarget,
            { passive: true }
        );


        window.addEventListener(
            "mousemove",
            function (event) {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;

            },
            { passive: true }
        );


        function animatePointer() {

            var dx =
                targetX - mouseX;

            var dy =
                targetY - mouseY;

            var distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /*
             * Keep the custom arrow slightly
             * ahead of the real cursor.
             */

            var offset =
                Math.min(
                    55,
                    distance * 0.15
                );


            var x =
                mouseX +
                (dx / (distance || 1)) *
                offset;

            var y =
                mouseY +
                (dy / (distance || 1)) *
                offset;


            pointer.style.left =
                x + "px";

            pointer.style.top =
                y + "px";


            /*
             * Calculate the exact angle from
             * the pointer position toward
             * the ENTER button.
             */

            var angle =
                Math.atan2(
                    targetY - y,
                    targetX - x
                ) *
                180 /
                Math.PI;


            var arrow =
                pointer.querySelector("span");


            if (arrow) {

                arrow.style.transform =
                    "rotate(" +
                    angle +
                    "deg)";
            }


            requestAnimationFrame(
                animatePointer
            );
        }


        animatePointer();
    }

});


/* =====================================================
   LOGO — REFRESH PAGE
===================================================== */

var siteLogo =
    document.getElementById("siteLogo");

if (siteLogo) {

    siteLogo.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            window.location.reload();

        }
    );
}


/* =====================================================
   STARS
===================================================== */

var stars =
    document.getElementById("stars");

if (stars) {

    var starCount =
        window.innerWidth < 600 ? 55 : 100;

    for (var i = 0; i < starCount; i++) {

        var star =
            document.createElement("span");

        star.className = "star";

        var size =
            Math.random() < .8 ? 2 : 3;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 55 + "%";

        star.style.setProperty(
            "--duration",
            3 + Math.random() * 4 + "s"
        );

        star.style.setProperty(
            "--delay",
            -Math.random() * 6 + "s"
        );

        stars.appendChild(star);
    }
}


/* =====================================================
   TREES
===================================================== */

function createTrees(id, amount) {

    var container =
        document.getElementById(id);

    if (!container) return;


    for (var i = 0; i < amount; i++) {

        var tree =
            document.createElement("div");

        tree.className = "tree";

        var scale =
            .7 + Math.random() * .55;

        tree.style.transform =
            "scale(" + scale + ")";

        container.appendChild(tree);
    }
}


createTrees("treesBack", 20);
createTrees("treesMid", 17);
createTrees("treesFront", 14);


/* =====================================================
   FIREFLIES
===================================================== */

var fireflies =
    document.getElementById("fireflies");

if (fireflies) {

    for (var i = 0; i < 16; i++) {

        var fly =
            document.createElement("span");

        fly.className = "firefly";

        fly.style.left =
            5 + Math.random() * 90 + "%";

        fly.style.bottom =
            12 + Math.random() * 40 + "%";

        fly.style.setProperty(
            "--duration",
            6 + Math.random() * 6 + "s"
        );

        fly.style.setProperty(
            "--delay",
            -Math.random() * 8 + "s"
        );

        fireflies.appendChild(fly);
    }
}


/* =====================================================
   LUNAR PHASE
===================================================== */

function getMoonPhase() {

    var knownNewMoon =
        Date.UTC(
            2000,
            0,
            6,
            18,
            14,
            0
        );

    var now =
        Date.now();

    var synodicMonth =
        29.530588853;

    var days =
        (now - knownNewMoon) /
        86400000;

    var age =
        days % synodicMonth;

    if (age < 0) {
        age += synodicMonth;
    }

    return age / synodicMonth;
}


function updateMoon() {

    var moon =
        document.getElementById("moon");

    var light =
        document.getElementById("moonLight");

    if (!moon || !light) return;


    var phase =
        getMoonPhase();


    var illumination =
        (1 - Math.cos(
            phase * Math.PI * 2
        )) / 2;


    var percent =
        Math.round(
            illumination * 100
        );


    var clip;


    if (phase < .5) {

        var amount =
            Math.max(
                0,
                Math.min(
                    100,
                    illumination * 100
                )
            );

        clip =
            "polygon(" +
            (100 - amount) +
            "% 0,100% 0,100% 100%," +
            (100 - amount) +
            "% 100%)";

    } else {

        var amount =
            Math.max(
                0,
                Math.min(
                    100,
                    illumination * 100
                )
            );

        clip =
            "polygon(" +
            "0 0," +
            amount +
            "% 0," +
            amount +
            "% 100%,0 100%)";
    }


    if (
        phase > .20 &&
        phase < .30
    ) {

        clip =
            "inset(0 0 0 50%)";
    }


    if (
        phase > .70 &&
        phase < .80
    ) {

        clip =
            "inset(0 50% 0 0)";
    }


    if (
        phase < .03 ||
        phase > .97
    ) {

        clip =
            "inset(0 50% 0 50%)";
    }


    if (
        phase > .47 &&
        phase < .53
    ) {

        clip =
            "inset(0 0 0 0)";
    }


    light.style.clipPath =
        clip;

    light.style.webkitClipPath =
        clip;


    moon.setAttribute(
        "title",
        percent +
        "% illuminated"
    );
}


updateMoon();

setInterval(
    updateMoon,
    60 * 60 * 1000
);


/* =====================================================
   NAVIGATION
===================================================== */

var sections =
    document.querySelectorAll(".section");

var navLinks =
    document.querySelectorAll(".nav-link");


function updateNav() {

    var scroll =
        window.pageYOffset;

    var current =
        "home";


    for (var i = 0; i < sections.length; i++) {

        if (
            scroll >=
            sections[i].offsetTop - 250
        ) {

            current =
                sections[i].id;
        }
    }


    for (var j = 0; j < navLinks.length; j++) {

        var href =
            navLinks[j].getAttribute("href");


        if (href === "#" + current) {

            navLinks[j].classList.add(
                "active"
            );

        } else {

            navLinks[j].classList.remove(
                "active"
            );
        }
    }
}


window.addEventListener(
    "scroll",
    updateNav,
    { passive: true }
);

updateNav();


/* =====================================================
   SCROLL REVEAL
===================================================== */

var reveals =
    document.querySelectorAll(".reveal");


function revealElements() {

    var height =
        window.innerHeight;


    for (var i = 0; i < reveals.length; i++) {

        var rect =
            reveals[i].getBoundingClientRect();


        if (
            rect.top <
            height - 45
        ) {

            reveals[i].classList.add(
                "visible"
            );
        }
    }
}


window.addEventListener(
    "scroll",
    revealElements,
    { passive: true }
);

revealElements();


/* =====================================================
   MAIN CURSOR + FOG TRAIL
===================================================== */

if (!isTouch) {

    var dot =
        document.querySelector(".cursor-dot");

    var glow =
        document.querySelector(".cursor-glow");

    var canvas =
        document.getElementById("cursorFog");

    if (dot && glow && canvas) {

        var ctx =
            canvas.getContext("2d");


        var mouseX =
            window.innerWidth / 2;

        var mouseY =
            window.innerHeight / 2;

        var glowX =
            mouseX;

        var glowY =
            mouseY;


        var particles = [];

        var lastParticle = 0;


        function resizeCanvas() {

            var dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    1.5
                );

            canvas.width =
                window.innerWidth * dpr;

            canvas.height =
                window.innerHeight * dpr;

            canvas.style.width =
                window.innerWidth + "px";

            canvas.style.height =
                window.innerHeight + "px";

            ctx.setTransform(
                dpr,
                0,
                0,
                dpr,
                0,
                0
            );
        }


        resizeCanvas();


        window.addEventListener(
            "resize",
            resizeCanvas,
            { passive: true }
        );


        window.addEventListener(
            "mousemove",
            function (event) {

                mouseX =
                    event.clientX;

                mouseY =
                    event.clientY;


                dot.style.left =
                    mouseX + "px";

                dot.style.top =
                    mouseY + "px";


                var now =
                    Date.now();


                if (
                    now -
                    lastParticle <
                    55
                ) return;


                lastParticle =
                    now;


                particles.push({
                    x: mouseX,
                    y: mouseY,
                    life: 1,
                    size:
                        8 +
                        Math.random() * 8,
                    vx:
                        (Math.random() - .5) *
                        .3,
                    vy:
                        (Math.random() - .5) *
                        .3
                });


                if (
                    particles.length > 30
                ) {

                    particles.shift();
                }

            },
            { passive: true }
        );


        function cursorAnimation() {

            glowX +=
                (mouseX - glowX) *
                .12;

            glowY +=
                (mouseY - glowY) *
                .12;


            glow.style.left =
                glowX + "px";

            glow.style.top =
                glowY + "px";


            ctx.clearRect(
                0,
                0,
                window.innerWidth,
                window.innerHeight
            );


            for (
                var i = particles.length - 1;
                i >= 0;
                i--
            ) {

                var p =
                    particles[i];


                p.life -= .017;

                p.x += p.vx;
                p.y += p.vy;


                if (p.life <= 0) {

                    particles.splice(i, 1);

                    continue;
                }


                var gradient =
                    ctx.createRadialGradient(
                        p.x,
                        p.y,
                        0,
                        p.x,
                        p.y,
                        p.size
                    );


                gradient.addColorStop(
                    0,
                    "rgba(190,220,194," +
                    p.life * .09 +
                    ")"
                );

                gradient.addColorStop(
                    1,
                    "rgba(190,220,194,0)"
                );


                ctx.fillStyle =
                    gradient;


                ctx.beginPath();

                ctx.arc(
                    p.x,
                    p.y,
                    p.size,
                    0,
                    Math.PI * 2
                );

                ctx.fill();
            }


            requestAnimationFrame(
                cursorAnimation
            );
        }


        cursorAnimation();
    }
}


/* =====================================================
   MUSIC CONTROL
===================================================== */

var musicButton =
    document.getElementById("musicButton");

var music =
    document.getElementById("ambientMusic");


if (musicButton && music) {

    musicButton.addEventListener(
        "click",
        function () {

            if (music.paused) {

                music.volume = .13;

                music.play().catch(
                    function () {}
                );

                musicButton.textContent =
                    "MUSIC ON";

            } else {

                music.pause();

                musicButton.textContent =
                    "MUSIC OFF";
            }
        }
    );
}


/* =====================================================
   CONTACT IMAGE — MOBILE TAP
===================================================== */

var contactImage =
    document.querySelector(".contact-image");


if (contactImage && isTouch) {

    contactImage.addEventListener(
        "click",
        function () {

            var image =
                contactImage.querySelector("img");

            if (!image) return;


            if (
                image.style.opacity === "1"
            ) {

                image.style.opacity = "0";

                image.style.filter =
                    "blur(18px) grayscale(.3)";

                image.style.transform =
                    "scale(1.08)";

            } else {

                image.style.opacity = "1";

                image.style.filter =
                    "blur(0) grayscale(0)";

                image.style.transform =
                    "scale(1)";
            }

        }
    );
}