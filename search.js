function search() {
    document.getElementById("generateButton").disabled = true;
    document.getElementById("searchButton").disabled = true;

    // initialization
    stack = new Array();
    direction = 0;
    cursor = new Object();
    cursor.x = 0;
    cursor.y = 0;

    tbody.children[1].children[1].classList.add("step");
    var init = new Object();
    init.x = 0;
    init.y = 0;
    stack.unshift(init);

    interval = setInterval(take1step, 20);
}

function take1step() {
    // if the cursor arrives at the end, stop searching
    if (cursor.x == columns - 1 && cursor.y == rows - 1) {
        clearInterval(interval);
        document.getElementById("generateButton").disabled = false;
        return;
    }

    var i = cursor.x * 2 + 1;
    var j = cursor.y * 2 + 1;
    direction = availableDirection(cursor);
    if (direction != null) { // if there is a direction that has not passed
        // open up a new location
        newCursor = new Object();
        newCursor.x = cursor.x;
        newCursor.y = cursor.y;
        switch(direction) {
            case 0: // right
                tbody.children[j].children[i + 1].classList.add("step");
                newCursor.x = cursor.x + 1;
                break;
            case 1: // down
                tbody.children[j + 1].children[i].classList.add("step");
                newCursor.y = cursor.y + 1;
                break;
            case 2: // left
                tbody.children[j].children[i - 1].classList.add("step");
                newCursor.x = cursor.x - 1;
                break;
            case 3: // up
                tbody.children[j - 1].children[i].classList.add("step");
                newCursor.y = cursor.y - 1;
                break;
        }
        i = newCursor.x * 2 + 1;
        j = newCursor.y * 2 + 1;
        stack.unshift(newCursor);
        tbody.children[j].children[i].classList.add("step");
        
        cursor.x = newCursor.x;
        cursor.y = newCursor.y;
    } else { // if all directions have passed
        do {
            stack.shift();
            var temp = stack[0];
            var deltaX = temp.x - cursor.x;
            var deltaY = temp.y - cursor.y;
            if (deltaX == 1) {
                direction = 0;
            } else if (deltaY == 1) {
                direction = 1;
            } else if (deltaX == -1) {
                direction = 2;
            } else {
                direction = 3;
            }
            var i = cursor.x * 2 + 1;
            var j = cursor.y * 2 + 1;
            tbody.children[j].children[i].classList.add("ed");
            switch(direction) {
                case 0: // right
                    tbody.children[j].children[i + 1].classList.add("ed");
                    break;
                case 1: // down
                    tbody.children[j + 1].children[i].classList.add("ed");
                    break;
                case 2: // left
                    tbody.children[j].children[i - 1].classList.add("ed");
                    break;
                case 3: // up
                    tbody.children[j - 1].children[i].classList.add("ed");
                    break;
            }
            cursor.x = temp.x;
            cursor.y = temp.y;
        } while (availableDirection(cursor) == null);
    }
}

function availableDirection(cursor) {
    var i = cursor.x * 2 + 1;
    var j = cursor.y * 2 + 1;
    var times;
    for (times = 0; times < 4; direction = nextDirection(direction), ++times) {
        var faceI, faceJ;
        switch (direction) {
            case 0:
                faceI = i + 1;
                faceJ = j;
                break;
            case 1:
                faceI = i;
                faceJ = j + 1;
                break;
            case 2:
                faceI = i - 1;
                faceJ = j;
                break;
            case 3:
                faceI = i;
                faceJ = j - 1;
                break;
        }
        if (tbody.children[faceJ].children[faceI].classList.contains("road")
        && !tbody.children[faceJ].children[faceI].classList.contains("step")) {
            break;
        }
    }
    if (times >= 4) { // no directions available
        return null;
    }
    return direction;
}

function nextDirection(direction) {
    // clockwise: 0 right, 1 down, 2 left, 3 up
    switch (direction) {
        case 3:
            return 0;
        case 0:
        case 1:
        case 2:
            return direction + 1;
        default: // null
            return 0;
    }
}