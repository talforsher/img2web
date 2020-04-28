(function () {
    var newButton = document.createElement('div')
    newButton.classList.add('hey')
    newButton.classList.add('new')
    newButton.innerHTML = `
        <div class="plus">+</div>
        <div class="minus">-</div>
        <input class="input" type="text">
        <div class="resizer"></div>
        `
    document.querySelector('#buttons').appendChild(newButton);
})()
var buttons = document.querySelectorAll('.hey');
buttons.forEach(button => actions(button))

function actions(button) {
    if (!button.classList.contains('new')) {
        button.innerHTML += `
        <div class="plus">+</div>
        <div class="minus">-</div>
        <input class="input" type="text">
        <div class="resizer"></div>
        `
        button.onclick = ""
    }
    var minus = button.getElementsByClassName("minus")[0];
    minus.addEventListener('click', function () {
        button.remove()
    })
    var plus = button.getElementsByClassName("plus")[0]
    plus.addEventListener('click', function () {
        var newButton = document.createElement('div')
        newButton.classList.add('hey')
        newButton.classList.add('new')
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
    news = document.getElementsByClassName('new')
    while (news.length) {
        news[0].classList.remove('new')
    }
    remove = url;
    const urls = []
    while (remove.length) {
        if (remove[0].value.slice(0, 4) == "page")
            urls.push(remove[0].value.split(' ')[1])
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
    document.getElementById('newImage').remove()
    scrape = document.documentElement.outerHTML
    var path = location.pathname.slice(1);
    if (path == '')
        path = 'index'
    path += ".html"
    fetch('save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            filename: path,
            content: scrape,
            urls: urls
        })
    })

}
var saveButton = document.createElement('button')
saveButton.innerText = "Save"
saveButton.style = "position: absolute; width:100%"
saveButton.onclick = save;
document.body.appendChild(saveButton);

var newImage = document.createElement('form')
newImage.onchange = function () {
    const XHR = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const FD = new FormData(newImage);

    // Define what happens on successful data submission
    XHR.addEventListener("load", function (event) {
        document.getElementById('img').src = JSON.parse(event.target.responseText).filename
    });

    // Define what happens in case of error
    XHR.addEventListener("error", function (event) {
        alert('Oops! Something went wrong.');
    });

    // Set up our request
    XHR.open("POST", "upload");

    // The data sent is what the user provided in the form
    XHR.send(FD);



}
newImage.id = 'newImage'
newImage.enctype = 'multipart/form-data'
newImage.innerHTML = `<input type="file" name="file" accept="image/*" />`
newImage.style = "position: fixed; width:30%; bottom: 0; margin: 0"
document.body.appendChild(newImage);