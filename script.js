const canvasEl = document.getElementById("canvas");
        const canvasCtx = canvasEl.getContext("2d");
        const gapx = 10;

        const field = {
            w: window.innerWidth,
            h: window.innerHeight,
            draw: function () {
                canvasCtx.fillStyle = "#286047";
                canvasCtx.fillRect(0, 0, this.w, this.h);
            }
        }

        const line = {
            w: 15,
            h: field.h,
            draw: function () {
                canvasCtx.fillStyle = "#ffffff";
                canvasCtx.fillRect(
                    field.w / 2 - this.w / 2,
                    0,
                    this.w,
                    this.h
                );
            }
        }

        const mouse = {
            x: 0,
            y: 0
        }

        const raqueteEsquerda = {
            x: gapx,
            y: 100,
            w: line.w,
            h: 200,
            _move: function () {
                this.y = mouse.y - this.h / 2;
            },
            draw: function () {
                canvasCtx.fillStyle = "#ffffff";
                canvasCtx.fillRect(
                    this.x,
                    this.y,
                    this.w,
                    this.h
                );
                this._move();
            }
        }

        const raqueteDireita = {
            x: field.w - line.w - 10,
            y: 100,
            w: line.w,
            h: 200,
            velocidade: 2,
            _move: function () {
                if(this.y + this.h / 2 < bolinha.y + bolinha.r){
                    this.y += this.velocidade
                }else {
                    this.y -= this.velocidade
                }
            },
            velocidadeUp: function () {
                this.velocidade += 2;
            },
            draw: function () {
                canvasCtx.fillStyle = "#ffffff";
                canvasCtx.fillRect(
                    this.x,
                    this.y,
                    this.w,
                    this.h
                );
                this._move();
            }
        }

        const bolinha = {
            x: 300,
            y: 200,
            r: 20,
            velocidade: 10,
            directionX: 1,
            directionY: 1,
            _calcPosition: function () {
                if(this.x > field.w - this.r - raqueteDireita.w - gapx){
                    if(this.y + this.r > raqueteDireita.y && this.y - this.r < raqueteDireita.y + raqueteDireita.h){
                        this._reverseX();
                    }else {
                        placar.incrementaHumano();
                        this._pontoUp();
                    }
                }

                if(this.x < this.r + raqueteEsquerda.w + gapx) {
                    if(this.y + this.r > raqueteEsquerda.y && this.y - this.r < raqueteEsquerda.y + raqueteEsquerda.h){
                        this._reverseX();
                    }else {
                        placar.incrementaComputador();
                        this._pontoUp();
                    }
                }

                if((this.y - this.r > field.h - this.r && this.directionY > 0) || (this.y < 0 && this.directionY < 0)){
                    this._reverseY();
                }
            },
            _reverseX: function () {
                this.directionX *= -1;
            },
            _reverseY: function () {
                this.directionY *= -1;
            },
            _velocidadeUp: function () {
                this.velocidade += 2
            },
            _pontoUp: function () {
                this.x = field.w / 2;
                this.y = field.h / 2;
                this._velocidadeUp();
                raqueteEsquerda.velocidadeUp();
            },
            _move: function () {
                this.x += this.directionX * this.velocidade,
                this.y += this.directionY * this.velocidade
            },
            draw: function () {
                canvasCtx.beginPath();
                canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
                canvasCtx.fill();
                this._calcPosition();
                this._move();
            }
        }

        const placar = {
            humano: "0",
            computador: "0",
            incrementaHumano: function () {
                this.humano++
            },
            incrementaComputador: function () {
                this.computador++
            },
            draw: function () {
                canvasCtx.font = "bold 72px Arial";
                canvasCtx.textAlign = "center";
                canvasCtx.textBaseline = "top";
                canvasCtx.fillStyle = "#01341D";
                canvasCtx.fillText(this.humano, field.w / 4, 50);
                canvasCtx.fillText(this.computador, field.w / 4 + field.w / 2, 50);
            }
        }

        function setup() {
            canvasEl.width = field.w;
            canvasCtx.width = field.w;
            canvasCtx.height = field.h;
            canvasEl.height = field.h;
        }

        function draw() {
            field.draw();
            line.draw();
            raqueteEsquerda.draw();
            raqueteDireita.draw();
            bolinha.draw();
            placar.draw();
        }

        window.animateFrame = (function () {
            return(
                window.requestAnimationFrame ||
                window.webKitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, 1000 / 60)
                }
            )
        })()
        
        function main() {
            animateFrame(main);
            draw();
        }

        setup();
        main();
        canvasEl.addEventListener("mousemove", (e) => {
            mouse.x = e.pageX;
            mouse.y = e.pageY;
        })