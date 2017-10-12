function Cell(i, j, px, py) {
    this.i = i; 
    this.j = j; //indexes
    this.px = px;
    this.py = py //pixels per rectangle / square
    this.y = i * py;
    this.x = j * px; //pixel locations

    this.mine = false;
    this.revealed = false;
    this.flagged = false;
    this.number;
}

//neighbour offsets
Cell.prototype.OFFSETS = [[-1,-1], [0, -1], [1,-1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

Cell.prototype.getNeighbours = function(i, j) {
    let neighbours = [];
    for (let i = 0; i < this.OFFSETS.length; i++) {
        let new_i = this.i + this.OFFSETS[i][1];
        let new_j = this.j + this.OFFSETS[i][0];

        if (0 <= new_i && new_i < ROWS && 0 <= new_j && new_j < COLS) {
            neighbours.push([new_i, new_j]);
        }
    }
    return neighbours;
}

//when empty cell is revealed
Cell.prototype.floodFill = function() {
    let neighbours = this.getNeighbours(this.i, this.j);
    
    for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];
    
        if (!grid[neighbour[0]][neighbour[1]].revealed) {
            grid[neighbour[0]][neighbour[1]].reveal();
        }
    }
}

Cell.prototype.reveal = function() {
    if (this.mine) {
        gameOver("lose");
    }
    if (!this.revealed) {
        if (!this.flagged) {
            this.revealed = true;
    
            if (this.number === 0) {
                //flood fill it up
                this.floodFill();
            }
        }        
    } else {
        let neighbours = this.getNeighbours(this.i, this.j);
        
        for (let i = 0; i < neighbours.length; i++) {
            let neighbour = neighbours[i];
        
            if (!grid[neighbour[0]][neighbour[1]].flagged && !grid[neighbour[0]][neighbour[1]].revealed) {
                grid[neighbour[0]][neighbour[1]].reveal();
            }
        }
    }
}

Cell.prototype.countMinesNeighbour = function() {
    if (this.mine) {
        this.number = -1;
        return;
    }
    this.number = 0;

    let neighbours = this.getNeighbours(this.i, this.j);

    for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (grid[neighbour[0]][neighbour[1]].mine) {
            this.number++;
        }
    }
}

Cell.prototype.flag = function() {
    if (!this.revealed) {
        this.flagged = !this.flagged; //toggle
        if (this.flagged) {
            return 1;
        } else {
            return 0;
        }
    }
    return -1;
}

Cell.prototype.show = function() {
    
    stroke(0);
    fill(200);
    rect(this.x, this.y, this.px, this.py);
    if (this.flagged) {
        fill(255, 0, 0);
        triangle(this.x + this.px*0.5, this.y + this.py*0.25, this.x + this.px*0.25, this.y + this.py*0.75, this.x + this.px*0.75, this.y + this.py*0.75,);
    } else if (this.revealed) {
        fill(255);
        rect(this.x, this.y, this.px, this.py);
        if (this.mine) {
            ellipse(this.x + this.px*0.5, this.y + this.py*0.5, this.px*0.5, this.py*0.5);
        } else if (this.number > 0) {
            fill(0);
            text(this.number, this.x + this.px*0.4, this.y + this.py*0.6);
        }
    }
}