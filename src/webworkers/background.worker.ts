interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  isHovered: boolean;
  targetRadius: number;
}

interface WorkerMessage {
  type: 'update' | 'mouseMove' | 'mouseClick';
  stars: Star[];
  canvasWidth?: number;
  canvasHeight?: number;
  mouseX?: number;
  mouseY?: number;
}

const updateStarPositions = (
  stars: Star[], 
  canvasWidth: number, 
  canvasHeight: number
) => {
  stars.forEach((star) => {
    star.x += star.speedX;
    star.y += star.speedY;

    if (star.x < 0 || star.x > canvasWidth) {
      star.speedX = -star.speedX;
    }
    if (star.y < 0 || star.y > canvasHeight) {
      star.speedY = -star.speedY;
    }

    if (star.isHovered && star.radius < star.targetRadius) {
      star.radius += 0.1;
    } else if (!star.isHovered && star.radius > star.targetRadius) {
      star.radius -= 0.1;
    }
  });
  return stars;
};


const handleMouseMove = (
  stars: Star[], 
  mouseX: number, 
  mouseY: number
) => {
  stars.forEach((star) => {
    const dx = star.x - mouseX;
    const dy = star.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const newIsHovered = distance < star.targetRadius * 2;
    if (newIsHovered !== star.isHovered) {
      star.isHovered = newIsHovered;
      star.targetRadius = newIsHovered 
        ? star.targetRadius * 2 
        : star.targetRadius / 2;
    }
  });
  return stars;
};

const handleMouseClick = (
  stars: Star[], 
  mouseX: number, 
  mouseY: number
) => {
  const baseRadius = Math.random() * 4 + 1;
  const newStar: Star = {
    x: mouseX,
    y: mouseY,
    radius: baseRadius,
    opacity: Math.random(),
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: (Math.random() - 0.5) * 0.5,
    isHovered: false,
    targetRadius: baseRadius
  };
  stars.push(newStar);
  return stars;
};

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { 
    type, 
    stars, 
    canvasWidth, 
    canvasHeight, 
    mouseX, 
    mouseY 
  } = event.data;
  let updatedStars = stars;

  switch (type) {
    case 'update':
      if (canvasWidth && canvasHeight) {
        updatedStars = updateStarPositions(
          stars, 
          canvasWidth, 
          canvasHeight
        );
      }
      break;
    case 'mouseMove':
      if (mouseX !== undefined && mouseY !== undefined) {
        updatedStars = handleMouseMove(
          stars,
          mouseX, 
          mouseY
        );
      }
      break;
    case 'mouseClick':
      if (mouseX !== undefined && mouseY !== undefined) {
        updatedStars = handleMouseClick(
          stars, 
          mouseX, 
          mouseY
        );
      }
      break;
  }

  self.postMessage(updatedStars);
};