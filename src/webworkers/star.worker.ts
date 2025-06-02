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
  stars: Star[];
  canvasWidth: number;
  canvasHeight: number;
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

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { stars, canvasWidth, canvasHeight } = event.data;
  const updatedStars = updateStarPositions(
    stars, 
    canvasWidth, 
    canvasHeight
  );
  self.postMessage(updatedStars);
};