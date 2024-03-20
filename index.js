
var isAccessibilityModeOn = true;
var isNoGameModeOn = false;
var myProjectName = "cet";

window.addEventListener('message', e => {
    const data = e.data;
    // if (data.type === 'log') {
    //    console.log('received from child', data.args)
    // }

    // if (data == "InternalCmd_WEBGL_PLAYER_LOADED") {
        // setTimeout(SetUpMode, 1500);
    // }
	
	if (data == "InternalCmd_startBook") {
		startBook();
	}
	
	if (data == "InternalCmd_pauseBook") {
		pauseBook();
	}
	
	if (data == "InternalCmd_turnToNextPage") {
		turnToNextPage();
	}
	
	if (data == "InternalCmd_turnToPrevPage") {
		turnToPrevPage();
	}
	
	if (data == "InternalCmd_toggleNarration") {
		toggleNarration();
	}
	
	if (data == "InternalCmd_toggleAutomaticPageTurn") {
		toggleAutomaticPageTurn();
	}
	
	if (data == "InternalCmd_togglePauseBook") {
		toggleStartPause();
	}
	
	if (data == "InternalCmd_turnNarrationOn") {
		turnNarrationOn();
	}
	
	if (data == "InternalCmd_turnNarrationOff") {
		turnNarrationOff();
	}
	
	if (data == "InternalCmd_enableAccessibilityMode") {
		enableAccessibilityMode();
	}
	
	if (data == "InternalCmd_enableNoGameMode") {
		enableNoGameMode();
	}
	
	if (data == "InternalCmd_enableNormalMode") {
		enableNormalMode();
	}
	
    // console.log('data received : ' + data);
});

// setTimeout(SetUpMode, 5000);

// setTimeout(SetUpMode, 5500);
// setInterval(SetUpMode, 1000);

var spinnerLoaderForMenu = document.getElementById("theSpinnerLoaderForMenu");
var spinnerLoader = document.getElementById("theSpinnerLoader");
let bookListHtmlItem = document.getElementById("book-list");
let videoPlayerBoyHtml = document.getElementById("video_player_box");
var myVideoHtml = document.getElementById("my-video");
var isCurrentBookFree = true;
var src = "";
var started = new Date();

var mCurrentBookId = null;

var currentBooksNumOfPages = 0;

var currentVideoSeekerPosition = 0;


function changeBackground(color) {
    document.body.style.background = color;
 }
 
 function toggleToggleBtnBgColor(isAccessibilityModeOn) {
     if (isAccessibilityModeOn) {		
         document.getElementById("accessibility_toggle").classList.remove("acc_toggle_btn_bg_color_normal");
         document.getElementById("accessibility_toggle").classList.add("acc_toggle_btn_bg_color_active");
     } else {
         document.getElementById("accessibility_toggle").classList.remove("acc_toggle_btn_bg_color_active");
         document.getElementById("accessibility_toggle").classList.add("acc_toggle_btn_bg_color_normal");		
     }
 }
 
 function toggleAccessabilityMode() {		
 
     isAccessibilityModeOn = !isAccessibilityModeOn;
     console.log("isAccessibilityModeOn : " + isAccessibilityModeOn);
     
     if (isAccessibilityModeOn) {
         changeBackground("#000000");
         document.getElementById("accessability_buttons").style.visibility = "visible";
     }
     else {
         changeBackground("#C0C0C0");		
         document.getElementById("accessability_buttons").style.visibility = "hidden";
     }
     toggleToggleBtnBgColor(isAccessibilityModeOn);

     dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn);
 }

 function dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn) {
    if (isAccessibilityModeOn) {
        window.unityInstance.SendMessage('JavaScriptHook', 'AccessibilityModeTurnedOn');
    }
    else {
        window.unityInstance.SendMessage('JavaScriptHook', 'AccessibilityModeTurnedOff');
    }
 }

 function dispatchNoGameModeUnityMessage(isNoGameModeOn) {
    if (isNoGameModeOn) {
        window.unityInstance.SendMessage('JavaScriptHook', 'NoGameModeTurnedOn');
    }
    else {
        window.unityInstance.SendMessage('JavaScriptHook', 'NoGameModeTurnedOff');
    }
 }

 function turnNarrationOn() {
    if (!isVideoPlayerNeeded()) {
        window.unityInstance.SendMessage('JavaScriptHook', 'TurnNarrationOn');
    }
}

function turnNarrationOff() {
    if (!isVideoPlayerNeeded()) {
        window.unityInstance.SendMessage('JavaScriptHook', 'TurnNarrationOff');
    }
}

function toggleNarration() {
    if (!isVideoPlayerNeeded()) {
        window.unityInstance.SendMessage('JavaScriptHook', 'ToggleNarration');
    }
}
 
 function turnToNextPage() {
     if (!isVideoPlayerNeeded()) {
         window.unityInstance.SendMessage('JavaScriptHook', 'TurnToNextPage');
     }
 }
 
 function turnToPrevPage() {
     if (!isVideoPlayerNeeded()) {
         window.unityInstance.SendMessage('JavaScriptHook', 'TurnToPrevPage');
     }
 }
 
 function toggleAutomaticPageTurn() {
     if (!isVideoPlayerNeeded()) {
         window.unityInstance.SendMessage('JavaScriptHook', 'ToggleAutomaticPageTurn');
     }
 } 

function myStartHandler(e) {
    console.log("play event was called");
    started = new Date();
}

function myEndHandler(e) {
    var ended = new Date();
    var distance = (ended.getTime() - started.getTime()) / 1000;
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
	
	let allPagesVisited = [...Array(currentBooksNumOfPages).keys()];
	let lastPageIndex = currentBooksNumOfPages - 1;
	
    var result = {
        bookId: params.book || mCurrentBookId,
        startedAt: started,
        duration: distance,
        pagesVisited: allPagesVisited,
        lastPageVisited: lastPageIndex,
    };
    var resultJson = JSON.stringify(result)
    console.log(resultJson)
    window.top.postMessage(resultJson, '*');
}

function myPauseHandler(e) {
	var ended = new Date();
    var distance = (ended.getTime() - started.getTime()) / 1000;
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
	
	let allPagesVisited = [...Array(currentBooksNumOfPages).keys()];
	let lastPageIndex = currentBooksNumOfPages - 1;
	
	let currPagesVisited = currentVideoSeekerPosition > 80 ? allPagesVisited : [0];
	
    var result = {
        bookId: params.book || mCurrentBookId,
        startedAt: started,
        duration: distance,
        pagesVisited: currPagesVisited,
        lastPageVisited: lastPageIndex,
    };
    var resultJson = JSON.stringify(result)
    console.log(resultJson)
    window.top.postMessage(resultJson, '*');
}

function pauseBook() {
	if (isVideoPlayerNeeded()) {
		myVideoHtml.pause();
	} else {
		window.unityInstance.SendMessage('JavaScriptHook', 'PauseBook');
	}
}

function startBook() {
	if (isVideoPlayerNeeded()) {
		myVideoHtml.play();
	} else {
		window.unityInstance.SendMessage('JavaScriptHook', 'StartBook');
	}
}

function toggleStartPause() {
	if (isVideoPlayerNeeded()) {
		if (myVideoHtml.paused == true) {
			myVideoHtml.play();
		} else {
			myVideoHtml.pause();
		}
	} else {
		window.unityInstance.SendMessage('JavaScriptHook', 'TogglePauseBook');
	}
}

window.addEventListener('message', event => {
    if (event.data === "toggleStartPause")
        toggleStartPause();
    else if (event.data === "startBook")
        startBook();
    else if (event.data === "pauseBook")
        pauseBook();
});

function myMoreThanEigthyPercentReachedHandler(seekerPercent) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
	
	let allPagesVisited = [...Array(currentBooksNumOfPages).keys()];
	let lastPageIndex = currentBooksNumOfPages - 1;
	
    var result = {
        bookId: params.book || mCurrentBookId,
        startedAt: started,
        duration: seekerPercent,
        pagesVisited: allPagesVisited,
        lastPageVisited: lastPageIndex,
    };
    var resultJson = JSON.stringify(result)
    console.log(resultJson)
    window.top.postMessage(resultJson, '*');
}

function LoadingMenu(isLoading)
{
    spinnerLoaderForMenu.style.display = isLoading ?  "block" : "none";
    return 
}

function Loading(isLoading)
{
    spinnerLoader.style.display = isLoading ?  "block" : "none";
    return 
}

// function SetUpMode()
// {
//     console.log("SetUpMode() CALLED!");
// 	/*
//     const params = new Proxy(new URLSearchParams(window.location.search), {
//         get: (searchParams, prop) => searchParams.get(prop),
//     });
// 	*/
	
// 	// const params = new URLSearchParams(window.location.search);
	
//     // var mode = params.get('mode');
	
// 	// var urlmy = new URL(window.location.href);
// 	// var searchParams = new URLSearchParams(urlmy.search);
	
// 	var params = {};

// 	if (location.search) {
// 		var parts = location.search.substring(1).split('&');

// 		for (var i = 0; i < parts.length; i++) {
// 			var nv = parts[i].split('=');
// 			if (!nv[0]) continue;
// 			params[nv[0]] = nv[1] || true;
// 		}
// 	}

// 	var mode = params.mode;
	
// 	console.log("'mode' param is : " + mode);

//     if (mode)  {
//         if (mode.toLowerCase() == "accessibility") {
//             console.log("Mode = accessibility");
//             isAccessibilityModeOn = true;
//             isNoGameModeOn = false;
//         }
//         else if (mode.toLowerCase() == "nogame") {
//             console.log("Mode = nogame");
//             isAccessibilityModeOn = false;
//             isNoGameModeOn = true;
//         }
//         else {
//             console.log("The 'mode' param was different than expected");
//             isAccessibilityModeOn = false;
//             isNoGameModeOn = false;
//         }
//     }
//     else {
//         console.log("No 'mode' param was present");
//         console.log("Setting isAccessibilityModeOn : false");
//         console.log("Setting isNoGameModeOn : false");
//         isAccessibilityModeOn = false;
//         isNoGameModeOn = false;
//     }

//     console.log("isAccessibilityModeOn: " + isAccessibilityModeOn);
//     console.log("isNoGameModeOn: " + isNoGameModeOn);

//     dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn);
//     dispatchNoGameModeUnityMessage(isNoGameModeOn);
// }

function enableAccessibilityMode() {
	isAccessibilityModeOn = true;
	isNoGameModeOn = false;
	dispatchNoGameModeUnityMessage(isNoGameModeOn);
	dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn);
}

function enableNoGameMode(){
	isAccessibilityModeOn = false;
	isNoGameModeOn = true;
	dispatchNoGameModeUnityMessage(isNoGameModeOn);
	dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn);
}

function enableNormalMode(){
	isAccessibilityModeOn = false;
	isNoGameModeOn = false;
	dispatchNoGameModeUnityMessage(isNoGameModeOn);
	dispatchAccessabilityModeUnityMessage(isAccessibilityModeOn);
}

function BookDataRecived(jsonData, isAllowedToSeePaidBooks)
{
	console.log("isAllowedToSeePaidBooks : " + isAllowedToSeePaidBooks);	
    isCurrentBookFree = true;
    console.log("books data arrived");
    LoadingMenu(false);
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    var bookId = params.book;
    if (!bookId)
        bookId = params.bookId;

    // var posterImg = "https://api.v2.bookrclass.com/api/media/Ym9vay1jb3Zlci93LzMvdzNsa3p5ZzFZYW1pQjlxVXJMYU1vSFZseDU1UXJUeGhVT1VvbkVQWUs0LmpwZw==/original_4k.jpg";
    var posterImg = "https://video-base-cet.bookrclass.com/book41.jpg"; /// TODO: poster image path for CET needed

    var availableBooks = [];
    var myVideoBaseUrl = "";
    var bookListingAvailable = false;

    for (var index in jsonData.projects) {
        var projectData = jsonData.projects[index];

        if (projectData.projectName == myProjectName) {
            availableBooks = projectData.booksList;
            myVideoBaseUrl = projectData.videoBase;
            bookListingAvailable = projectData.bookListingAvailable;
        }
    }

    for (var index in availableBooks) {
        var book = availableBooks[index];
		
		currentBooksNumOfPages = book.numberOfPages;

        const li = document.createElement('li');
        li.innerHTML = `<h3><a href="?book=`+book.id+ `">`+book.title+`</a></h3>`;
        if (bookListHtmlItem !== undefined && bookListHtmlItem !== null) {
            bookListHtmlItem.appendChild(li);
        }
    }
    
    if (bookId !== undefined && bookId !== null && bookId !== "") {
        firstAvailableBookIdForProject = bookId;
        videoPlayerBoyHtml.hidden = false;
		videoPlayerBoyHtml.style.display = "block";
        bookListHtmlItem.remove();

        // load poster image
        posterImg = myVideoBaseUrl + "book" + bookId + ".jpg";

        // load video mp4
        src = myVideoBaseUrl + "book" + bookId + ".mp4";

    } else if (bookListingAvailable == false) {
        // Pick first available bookId (as default) if ther book listing is not available for this project
        var firstAvailableBookIdForProject = availableBooks[0].id;
        mCurrentBookId = firstAvailableBookIdForProject;

        videoPlayerBoyHtml.hidden = false;
		videoPlayerBoyHtml.style.display = "block";
        bookListHtmlItem.remove();

        // load poster image
        posterImg = myVideoBaseUrl + "book" + firstAvailableBookIdForProject + ".jpg";

        // load video mp4
        src = myVideoBaseUrl + "book" + firstAvailableBookIdForProject + ".mp4";
    } else {
        // Book listing, if no specific book selected with url param, and if this project has book listing enabled on config
        bookListHtmlItem.hidden = false;
        videoPlayerBoyHtml.remove();
    }

    var myVideoSrc = document.getElementById("videosrc");
    if (myVideoSrc) myVideoSrc.src = src;
    if (myVideoHtml) {
        console.log("myVideoHtml is loading");
        myVideoHtml.addEventListener('ended',myEndHandler);
        myVideoHtml.addEventListener('pause',myPauseHandler);
        myVideoHtml.addEventListener('play',myStartHandler);
		myVideoHtml.addEventListener('timeupdate', () => {
		  let seekerPercent = myVideoHtml.currentTime / myVideoHtml.duration * 100;
		  currentVideoSeekerPosition = seekerPercent;
		});
        myVideoHtml.setAttribute("poster",posterImg);
        myVideoHtml.load();
        console.log("myVideoHtml is loaded");
    }
}

function LoadMobile()
{
	bookListHtmlItem.hidden = true;
    videoPlayerBoyHtml.hidden = true;
    myVideoHtml.pause();
	
	const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

	var bookId = params.book;
    if (!bookId)
        bookId = params.bookId;

    let bookDataUrl = "https://bookrlab.com/ClassWebGLInfoProvider/"; // BookData URL for CET
	
    LoadingMenu(true);
    console.log("started loading mobile");
    fetch(bookDataUrl)
        .then(response => {
            console.log("Books recived");
            return response.json();
        })
        .then(jsonData =>  {		  
            BookDataRecived(jsonData, true);
        }).catch((error) => {
            console.error('Error:', error);
            // BookDataRecived(jsonData, false);
        });
}

// window.onblur = (event) => { pauseBook(); };
