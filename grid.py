
class Grid:
    def __init__(self):
        self.active_cells = set()

    def is_active(self, x, y):
        return (x, y) in self.active_cells

    def toggle(self, x, y):
        position = (x, y)

        if position in self.active_cells:
            self.active_cells.remove(position)
        else:
            self.active_cells.add(position)

    def clear(self):
        self.active_cells.clear()

    def get_active_cells(self):
        return [
            {"x": x, "y": y}
            for x, y in self.active_cells
        ]
