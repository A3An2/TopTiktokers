// 全局变量声明
let man;
let phone;
let tiktok;
let images = [];
let cols = 16;
let rows = 6;
let offsetX = 0;
let offsetY = 0;
let imgScale = 0.8;
let spacingX, spacingY;
let manWidth, manHeight;
let table; // 用于存储 CSV 数据
let hovering = false; // 鼠标悬停标志

function preload() {
  man = loadImage("img/man.png");
  phone = loadImage("img/phone.png");
  tiktok = loadImage("img/tiktok.png");
  table = loadTable("top_1000_tiktokers.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  manWidth = man.width * imgScale;
  manHeight = man.height * imgScale;
  
  spacingX = (width - manWidth) / cols + 80;
  spacingY = height / (rows + 1);

  // 初始化图像位置
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = spacingX * (i + 0.5 * (j % 2)); // 当行数为奇数时错开
      let y = spacingY * (j + 0.8);
      let tikTokerIndex = (i * rows + j) % table.getRowCount();
      let tiktokLink = table.getString(tikTokerIndex, "Tiktok Link");
      images.push({ img: man, x: x, y: y, tikTokerIndex: tikTokerIndex, link: tiktokLink });
    }
  }

  // 设置文本样式
  textSize(16);
  fill(255);
}

function draw() {
  background(0,17,28);
  
  
  for (let imgObj of images) {
    // 在这里，不检查鼠标悬停，而是直接绘制所有的图像
    image(imgObj.img, imgObj.x - offsetX, imgObj.y - offsetY, manWidth, manHeight);
  }
  
  // 在绘制所有图像之后，检查鼠标悬停
  for (let imgObj of images) {
    if (mouseX >= imgObj.x - offsetX && mouseX < imgObj.x - offsetX + manWidth &&
        mouseY >= imgObj.y - offsetY && mouseY < imgObj.y - offsetY + manHeight) {
      hovering = true;
      displayTikTokerData(imgObj); // 显示 TikToker 数据
      break; // 找到悬停的图像后退出循环
    } else {
      hovering = false;
    }
  }

  // 如果没有悬停，更新 offsetX
  if (!hovering) {
    offsetX += 2;
    if (offsetX > spacingX) {
      offsetX -= spacingX;
    }
  }

  image(phone, width / 4, height / 4, phone.width * 0.9, phone.height * 0.9);
  image(tiktok, width - 180, 50);
}

function displayTikTokerData(imgObj) {
  // 检查 imgObj 是否有效
  if (imgObj) {
    let row = table.getRow(imgObj.tikTokerIndex);
    text("Views: " + row.get('Views. Avg'), imgObj.x - offsetX - 10, imgObj.y - 20);
    text("Likes: " + row.get('Likes. Avg'), imgObj.x - offsetX - 100, imgObj.y + 50);
    text("Comments: " + row.get('Comments. Avg'), imgObj.x - offsetX + 100, imgObj.y + 50);
    text("Shares: " + row.get('Shares. Avg'), imgObj.x - offsetX - 10, imgObj.y + 120);
  }
}

function mousePressed() {
  // 检查鼠标点击是否在某个 man 图像上
  for (let imgObj of images) {
    if (mouseX >= imgObj.x - offsetX && mouseX < imgObj.x - offsetX + manWidth &&
        mouseY >= imgObj.y - offsetY && mouseY < imgObj.y - offsetY + manHeight) {
      // 如果点击在 man 图像上，打开相应的 TikTok 链接
      window.open(imgObj.link, "_blank"); // 使用 "_blank" 在新标签页打开链接
      break; // 找到后退出循环
    }
  }
}
