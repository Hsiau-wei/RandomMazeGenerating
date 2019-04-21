window.onload = function() {
    tbody = document.getElementsByTagName("tbody")[1];
    rows = 0;
    columns = 0;
    arr = null; // pixels array
    visited = null; // visited grids
    direction = 0; // 0 right, 1 down, 2 left, 3 up
    cursor = new Object();
    cursor.x = 0;
    cursor.y = 0;
    stack = null;
    interval = null;
    document.getElementById("searchButton").disabled = true;
}

function allDirectionsVisited(visitedLocations) {
    for (var i = 0; i < 4; ++i) {
        if (visitedLocations[i] == 0) return false;
    }
    return true;
}

function isAllGridsVisited(visited, rows, columns) {
    return visited.length == rows * columns;
}

// whether a grid is in the visited grids array or not
function isVisited(grid) {
    for (var i = 0; i < visited.length; ++i) {
        if (visited[i].x == grid.x && visited[i].y == grid.y) return true;
    }
    return false;
}

/**
 * Search for the grids around the currently visited.
 * Randomly select one of the grids that has not been accessed.
 * @param {*} grid 
 */
function randomGrid(grid) {
    var four = new Array(4);
    // right grid
    four[0] = new Object();
    four[0].x = grid.x + 1;
    four[0].y = grid.y;
    // down grid
    four[1] = new Object();
    four[1].x = grid.x;
    four[1].y = grid.y + 1;
    // left grid
    four[2] = new Object();
    four[2].x = grid.x - 1;
    four[2].y = grid.y;
    // up
    four[3] = new Object();
    four[3].x = grid.x;
    four[3].y = grid.y - 1;

    var visitedLocations = new Array(4);
    for (var i = 0; i < 4; ++i) {
        visitedLocations[i] = 0;
    }
    var rand;
    do {
        if (allDirectionsVisited(visitedLocations)) return null;
        rand = Math.floor(Math.random() * 4);
        visitedLocations[rand] = 1;
    } while ((four[rand].x < 0 || four[rand].x >= columns) // x out of bounds
    || (four[rand].y < 0 || four[rand].y >= rows) // y out of bounds
    || isVisited(four[rand])); // the new grid has been visited
    return four[rand];
}

function generate() {
    clearInterval(interval);
    // remove previous maze
    while (tbody.children.length >= 1) {
        tbody.removeChild(tbody.children[0]);
    }

    rows = 0;
    columns = 0;
    arr = null;
    visited = null;
    direction = 0;
    cursor = new Object();
    cursor.x = 0;
    cursor.y = 0;
    stack = null;

    // get counts of rows and columns and initialize the array
    rows = form.row.value;
    columns = form.column.value;
    var pixelsX = columns * 2 + 1;
    var pixelsY = rows * 2 + 1;
    arr = new Array(pixelsY);
    for (var i = 0; i < pixelsY; ++i) {
        arr[i] = new Array(pixelsX);
        for (var j = 0; j < pixelsX; ++j) {
            arr[i][j] = 0;
        }
    }
    visited = new Array();

    for (var i = 0; i < pixelsY; ++i) {
        var row = document.createElement("tr");
        for (var j = 0; j < pixelsX; ++j) {
            var column = document.createElement("td");
            if (i % 2 != 0 && j % 2 != 0) {
                column.classList.add("road");
            }
            row.appendChild(column);
        }
        tbody.appendChild(row);
    }

    // put the first grid into the visited
    var grid = new Object();
    grid.x = 0;
    grid.y = 0;
    visited.unshift(grid);

    while (!isAllGridsVisited(visited, rows, columns)) {
        // Break through the wall between the grids
        var newGrid = randomGrid(grid);
        if (newGrid != null) {
            var wallX = grid.x + newGrid.x + 1;
            var wallY = grid.y + newGrid.y + 1;
            arr[wallY][wallX] = 1;
            tbody.children[wallY].children[wallX].classList.add("road");
            grid = newGrid;
            visited.unshift(grid);
        } else {
            // if all grids are visited,
            // randomly select a grid from the visited as the current.
            var r = Math.floor(Math.random() * visited.length);
            grid = visited[r];
        }
    }

    document.getElementById("searchButton").disabled = false;
}