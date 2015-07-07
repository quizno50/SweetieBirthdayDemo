function Flower(ctx, initialFlower)
{
	this.ctx = ctx;
	this.x = Math.random() * this.ctx.canvas.width;
	this.w = Math.random() * 250;
	this.h = this.w;
	if (initialFlower)
	{
		this.y = Math.random() * this.ctx.canvas.height;
	}
	else
	{
		this.y = -this.h / 2;
	}
	this.dx = Math.random() * 10 - 5;
	this.dy = Math.random() * 8 + 2;
	this.dr = Math.random() * Math.PI * 8 / 360;
	this.r = Math.random() * 2 * Math.PI;
	this.offScreen = false;

	this.processMovement = function()
	{
		if (!this.offScreen)
		{
			this.x += this.dx;
			this.y += this.dy;
			this.r += this.dr;
			if (this.x > this.ctx.canvas.width + this.w * 2 || this.x < -this.w / 2)
			{
				this.offScreen = true;
			}
			if (this.y > this.ctx.canvas.height + this.h * 2 || this.y < -this.h / 2)
			{
				this.offScreen = true;
			}
		}
	}

	this.render = function(srcImage)
	{
		var scaleFactor = this.w / srcImage.width;
		this.ctx.save();
		this.ctx.translate(this.x - this.w / 2, this.y - this.h / 2);
		this.ctx.scale(scaleFactor, scaleFactor);
		this.ctx.rotate(this.r);
		this.ctx.drawImage(srcImage, -srcImage.width / 2, -srcImage.height / 2);
		this.ctx.restore();
	}
}

function SweetieBirthdayDemo()
{
	this.canvas = document.getElementsByTagName('canvas')[0];
	this.ctx = this.canvas.getContext('2d');
	this.numFlowers = 45;
	this.flowerImage = new Image();
	this.flowerImage.src = "flower.png";
	this.flowers = [];
	this.frame = 0;
	this.text = [ { "text" : "Happy Birthday", "x" : this.ctx.canvas.width / 2,
			"y" : this.ctx.canvas.height * 0.33, "s" : 55, "startFrame" : 0,
			"endFrame" : 30 * 5, "topColor" : "cyan", "bottomColor" : "blue" },
			{ "text" : "Sweetie", "x" : this.ctx.canvas.width / 2,
			"y" : this.ctx.canvas.height * 0.66, "s" : 85, "startFrame" : 0,
			"endFrame" : 30 * 5, "topColor" : "#ffaaaa", "bottomColor" : "#ff3333" },
			{ "text" : "I hope you're having a wonderful birthday,",
			"x" : this.ctx.canvas.width / 2, "y" : this.ctx.canvas.height * 0.33,
			"s" : 25, "startFrame" : 30 * 5,
			"endFrame" : 30 * 10, "topColor" : "#222222",
			"bottomColor" : "#444444" },
			{ "text" : "and I hope work was good to you and you",
			"x" : this.ctx.canvas.width / 2, "y" : this.ctx.canvas.height * 0.33 + 30,
			"s" : 25, "startFrame" : 30 * 5,
			"endFrame" : 30 * 10, "topColor" : "#444444",
			"bottomColor" : "#666666" },
			{ "text" : "get lots of yum-yums and happies.",
			"x" : this.ctx.canvas.width / 2, "y" : this.ctx.canvas.height * 0.33 + 60,
			"s" : 25, "startFrame" : 30 * 5,
			"endFrame" : 30 * 10, "topColor" : "#666666",
			"bottomColor" : "#888888" },
			{ "text" : "I loves you",
			"x" : this.ctx.canvas.width / 2, "y" : this.ctx.canvas.height * 0.86,
			"s" : 85, "startFrame" : 30*5, "endFrame" : 30 * 10, "topColor" : "#ff8888",
			"bottomColor" : "#ffeeee" }
	];

	for (var i = 0; i < this.numFlowers; ++i)
	{
		this.flowers.push(new Flower(this.ctx, true));
	}

	this.maxFrame = 0;
	for (var i = 0; i < this.text.length; ++i)
	{
		this.maxFrame = Math.max(this.maxFrame, this.text[i].endFrame);
	}

	this.drawGradient = function()
	{
		var startColor = [200, 200, 255];
		var startY = this.canvas.height / 2;
		var yOffset = 0;
		for (yOffset = 0; yOffset < startY; ++yOffset)
		{
			var currentColor = [yOffset / startY * 55 + 200,
					yOffset / startY * 55 + 200, 255];
			this.ctx.fillStyle = "rgb(" + currentColor.join(', ') + ")";
			this.ctx.fillRect(0, startY - yOffset, this.canvas.width,
					startY - yOffset - 1);
			this.ctx.fillRect(0, startY + yOffset, this.canvas.width,
					startY + yOffset + 1);
		}
	}

	this.drawFlowers = function()
	{
		var i = 0;
		while (i < this.flowers.length)
		{
			this.flowers[i].processMovement();
			this.flowers[i].render(this.flowerImage);
			if (this.flowers[i].offScreen)
			{
				this.flowers.splice(i, 1);
				this.flowers.push(new Flower(this.ctx, false));
			}
			else
			{
				++i;
			}
		}
	}

	this.drawText = function()
	{
		var toDraw = [];
		for (var i = 0; i < this.text.length; ++i)
		{
			if (this.text[i].startFrame <= this.frame
					&& this.text[i].endFrame >= this.frame)
			{
				toDraw.push(this.text[i]);
			}
		}

		for (var i = 0; i < toDraw.length; ++i)
		{
			var t = toDraw[i];
			this.ctx.font = t.s + "pt sans";
			var g = this.ctx.createLinearGradient(0, 0, this.ctx.canvas.width, 0);
			g.addColorStop("0", t.topColor);
			g.addColorStop("1.0", t.bottomColor);
			this.ctx.fillStyle = g;
			this.ctx.textBaseline = "middle";
			this.ctx.textAlign = "center";
			this.ctx.fillText(t.text, t.x, t.y);
		}
	}

	this.renderAll = function()
	{
		this.drawGradient();
		this.drawFlowers();
		this.drawText();
	}

	this.processNextFrame = function()
	{
		var startTime = performance.now();
		this.renderAll();
		var endTime = performance.now();
		++this.frame;
		if (this.frame > this.maxFrame) this.frame = 0;
		setTimeout("sweetie_demo.processNextFrame();",
				Math.floor(33 - endTime - startTime));
	}
}

function after_load()
{
	sweetie_demo = new SweetieBirthdayDemo();
	setTimeout("sweetie_demo.processNextFrame();", 33);
}

