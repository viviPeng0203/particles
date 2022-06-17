
let app = new PIXI.Application({
    view: document.getElementById('myCanvas2'), // 指定元素
    width: 600, // 寬度
    height: 600, // 高度,
    backgroundAlpha: 0
});

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

// let container = new PIXI.container();
// app.stage.addChild(container);
(function () {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var image = new Image();
    image.src = './mario.png';

    var pixels = [];  //儲存像素數據
    var newPixels = [];  //儲存像素數據
    var imageData;
    image.onload = function () {
        /*
         * image: image或canvas對象
         * sx, sy: 來源(圖像)的x, y 座標, 可選
         * sWidth, sHeight: 來源(圖像)的寬高, 可選
         * dx, dy: 畫布的x, y 座標, 可選
         * dWidth, dHeight: 畫布的寬高, 可選
        */
        // ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        ctx.drawImage(image, 0, 0, 512, 512);    //將load完的圖片繪製到畫布上
        /*
         * x, y: 畫布的x, y 座標
         * width, height: 指定區域的寬高
        */
        // ctx.getImageData(x, y, Width, Height);
        imageData = ctx.getImageData(0, 0, 600, 600);    //取得圖片像素資訊
        getPixels();    //取得所有像素
        ctx.clearRect(0, 0, 600, 600);
        drawPic();  //繪製圖像
    };

    function getPixels() {
        var pos = 0;
        var data = imageData.data;    //RGBA的一维數组數據
        //原圖像的高度為512px
        for (var y = 1; y <= 512; y++) {
            //原圖像的寬度為512px
            for (var x = 1; x <= 512; x++) {
                // 600:畫布寬, 4:rgba四個索引值
                pos = [(y - 1) * 600 + (x - 1)] * 4; //取得像素位置
                // 判斷每個單元格的透明度是否符合要求
                // if (data[pos] >= 0) {
                // }
                var pixel = {
                    x: x + 40, //重新設置每個像素的位置
                    y: y + 40, //重新設置每個像素的位置
                    fillStyle: getHexColor('rgb(' + data[pos] + ',' + (data[pos + 1]) + ',' + (data[pos + 2]) + ')'),
                    alpha: data[pos + 3]
                }
                pixels.push(pixel);

                var newPixel = {
                    x: Math.random() * 600,
                    y: Math.random() * 600
                }
                newPixels.push(newPixel);
            }
        }
    }

    function drawPic() {
        var len = pixels.length,
            cur_pixel = null;

        for (var i = 0; i < len; i += 5) {
            cur_pixel = pixels[i];
            new_pixel = newPixels[i];

            let graphics = new PIXI.Graphics();
            graphics.beginFill(cur_pixel.fillStyle);
            graphics.drawCircle(new_pixel.x, new_pixel.y, 1);
            graphics.endFill();

            app.stage.addChild(graphics);

            gsap.set(graphics, { alpha: 0 })

            if (cur_pixel.alpha >= 127) {
                gsap.to(graphics, {
                    duration: 4,
                    delay: 'random(1, 2)',
                    ease: 'power3.out',
                    x: cur_pixel.x - new_pixel.x,
                    y: cur_pixel.y - new_pixel.y,
                    alpha: 1
                });
                // gsap.to(graphics, {
                //     delay: 5,
                //     duration: 1,
                //     alpha: 0
                // });
            }
        }
    }

    function getHexColor(color) {
        var values = color
            .replace(/rgba?\(/, '')
            .replace(/\)/, '')
            .replace(/[\s+]/g, '')
            .split(',')
        var a = parseFloat(values[3] || 1),
            r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
        return '0X' +
            ('0' + r.toString(16)).slice(-2) +
            ('0' + g.toString(16)).slice(-2) +
            ('0' + b.toString(16)).slice(-2)
    }
}())