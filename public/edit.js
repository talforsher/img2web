var buttons = document.querySelectorAll('.hey');
buttons.forEach(button => actions(button))

function actions(button) {

    var plus = button.getElementsByClassName("plus")[0]
    plus.addEventListener('click', function () {
        var newButton = document.createElement('div')
        newButton.classList.add('hey')
        newButton.innerHTML = `
        <div class="plus">+</div>
        <div class="minus">-</div>
        <input class="input" type="text">
        `
        document.getElementById("buttons").appendChild(newButton);
        newButton.setAttribute('style', this.parentElement.style.cssText)
        newButton.style.top = (parseInt(newButton.style.top) + 2) + '%'
        actions(newButton)
        var minus = newButton.getElementsByClassName("minus")[0];
        minus.addEventListener('click', function () {
            newButton.remove()
        })
    })

    var input = button.getElementsByClassName("input")[0];
    input.addEventListener('click', function () {
        this.focus()
    })

    button.addEventListener('click', function init() {
        button.removeEventListener('click', init, false);
        var resizer = document.createElement('div');
        resizer.className = 'resizer';
        button.appendChild(resizer);
        resizer.addEventListener('mousedown', initDrag, false);
    }, false);



    var startX, startY, startWidth, startHeight;

    function initDrag(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(button).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(button).paddingTop, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    }

    function doDrag(e) {
        button.style.width = (startWidth + e.clientX - startX) / button.parentElement.offsetWidth * 100 + '%';
        button.style.paddingTop = (startHeight + e.clientY - startY) / button.parentElement.offsetHeight * 200 +
            '%';
    }

    function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
    dragElement(button);
}


function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.className != "resizer") {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:

            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) / elmnt.parentElement.offsetHeight * 100 + "%";
        elmnt.style.left = (elmnt.offsetLeft - pos1) / elmnt.parentElement.offsetWidth * 100 + "%";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function save() {
    this.remove()
    url = document.getElementsByClassName('input')
    for (var i = 0; i < url.length; i++) {
        var target = url[i]
        target.parentElement.setAttribute('onclick', 'window.open("' + target.value + '")')
    }
    remove = url;
    while (remove.length) {
        remove[0].remove()
    }
    remove = document.getElementsByClassName('plus')
    while (remove.length) {
        remove[0].remove()
    }
    remove = document.getElementsByClassName('minus')
    while (remove.length) {
        remove[0].remove()
    }
    remove = document.getElementsByClassName('resizer')
    while (remove.length) {
        remove[0].remove()
    }
    document.getElementById('script').remove()
    document.getElementById('editStyle').remove()
    scrape = document.documentElement.outerHTML

    fetch('receive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filename: 'tada.html',
            content: scrape
        })
    })

}
var saveButton = document.createElement('button')
saveButton.innerText = "Save"
saveButton.style = "position: absolute; width:100%"
saveButton.onclick = save;
document.body.appendChild(saveButton);