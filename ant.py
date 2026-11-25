class Ant:
    # Direções: Norte, Leste, Sul, Oeste
    DIRECTIONS = [
        (0, -1),
        (1, 0),
        (0, 1),
        (-1, 0)
    ]

    def __init__(self):
        self.reset()

    def reset(self):
        self.x = 0
        self.y = 0
        self.direction = 0
        self.steps = 0

    def turn_right(self):
        self.direction = (self.direction + 1) % 4

    def turn_left(self):
        self.direction = (self.direction - 1) % 4

    def move(self):
        dx, dy = self.DIRECTIONS[self.direction]

        self.x += dx
        self.y += dy

    def step(self, grid):
        # Verifica a cor do quadrado atual
        if grid.is_active(self.x, self.y):
            self.turn_left()
        else:
            self.turn_right()

        # Inverte a cor do quadrado
        grid.toggle(self.x, self.y)

        # Avança uma posição
        self.move()

        self.steps += 1

    def get_state(self):
        return {
            "x": self.x,
            "y": self.y,
            "direction": self.direction,
            "steps": self.steps
        }
