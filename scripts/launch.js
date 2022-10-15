board.setCase(Void, 90);
board.setCase(Grass, 4);
board.setCase(Fire, 2);
board.setCase(Water, 2);
board.setCase(Lava, 1);
board.setCase(Ice, 1);
board.generateArea(new Coordinate(0, 0), new Coordinate(board.size.x, board.size.y));


