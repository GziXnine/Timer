/** @format */

window.onload = function () {
  new WOW().init();
  loadSavedData(); // TODO: Load data from localStorage on page load
};

// ! Events Section Counter To Count My New Birthday Time
const daysSpan = document.querySelector(".timer .timer-item span#days");
const hoursSpan = document.querySelector(".timer .timer-item span#hours");
const minutesSpan = document.querySelector(".timer .timer-item span#minutes");
const secondsSpan = document.querySelector(".timer .timer-item span#seconds");
const selectDate = document.querySelector("header select");
const inputDate = document.getElementById("date");
const buttonDate = document.querySelector("header button");
const eventType = document.querySelector("h1");
const para = document.querySelector(".para");
const email = document.querySelector("[type='email']");
const emailButton = document.querySelector("[type='email'] + button");
let intervalId;
let data;

// Function to send notifications
function sendNotification(message, title) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      body: message,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, {
          body: message,
        });
      }
    });
  }
}

emailButton.addEventListener("click", function (event) {
  event.preventDefault();
  data = email.value;

  // !Save the email in localStorage
  localStorage.setItem("userEmail", data);
});

buttonDate.addEventListener("click", function (event) {
  event.preventDefault();
  clearInterval(intervalId); //! Clear any previous countdowns

  const selectedType = selectDate.value;
  const enteredDate = inputDate.value;

  if (enteredDate) {
    localStorage.setItem("eventType", selectedType);
    localStorage.setItem("eventDate", enteredDate);
    selectDate.value === "Event" ? Event() : Birthday();
  } else {
    eventType.innerHTML = "Please enter a valid date!";
  }
});

function Event() {
  let currDate = new Date(); //* Current Date
  let eventDate = new Date(inputDate.value); //* Date entered by the user

  if (eventDate < currDate) {
    eventType.innerHTML = "Has passed.";
    alert("The selected event date has already passed!");
    sendNotification(
      "The event date you selected has already passed.",
      "Event"
    );
    return;
  }

  eventType.innerHTML = "Event Countdown";

  intervalId = setInterval(() => {
    let diff = eventDate.getTime() - new Date().getTime();

    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysSpan.innerHTML = days < 10 ? `0${days}` : days;
    hoursSpan.innerHTML = hours < 10 ? `0${hours}` : hours;
    minutesSpan.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
    secondsSpan.innerHTML = seconds < 10 ? `0${seconds}` : seconds;

    // *Stop the countdown when it reaches zero
    if (diff <= 0) {
      alert("The event is happening now!");
      sendNotification("The event has started! Let's celebrate! 🎉", "Event");
      clearInterval(intervalId); // Stop the countdown
      eventType.innerHTML = "Event started!";
      para.innerHTML = `🥳 The moment we've all been waiting for is finally here! <br> 🎈 Enjoy the event to the fullest and make the most of every second.`;

      // *Set the values to zero when time is up
      daysSpan.innerHTML = "00";
      hoursSpan.innerHTML = "00";
      minutesSpan.innerHTML = "00";
      secondsSpan.innerHTML = "00";
    }
  }, 1000);
}

function Birthday() {
  let currDate = new Date(); //* Current Date
  let inputValue = inputDate.value.toString();
  let birthYear = inputValue.slice(0, 4);

  //* Calculate age and suffix
  let age = currDate.getFullYear() - birthYear;
  let lastChar = age.toString().slice(-1);
  let suffix =
    lastChar === "1"
      ? "st"
      : lastChar === "2"
      ? "nd"
      : lastChar === "3"
      ? "rd"
      : "th";

  eventType.innerHTML = `Happy Birthday <br> ${age} <sup>${suffix}</sup>`;

  let countDownDate = new Date(
    `${inputValue.slice(5, 7)} ${inputValue.slice(
      8
    )}, ${currDate.getFullYear()} 00:00:01`
  );

  if (countDownDate < currDate) {
    countDownDate.setFullYear(currDate.getFullYear() + 1);
  }

  intervalId = setInterval(() => {
    let diff = countDownDate.getTime() - new Date().getTime();
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysSpan.innerHTML = days < 10 ? `0${days}` : days;
    hoursSpan.innerHTML = hours < 10 ? `0${hours}` : hours;
    minutesSpan.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
    secondsSpan.innerHTML = seconds < 10 ? `0${seconds}` : seconds;

    //? Check if the countdown is over
    if (days === 364) {
      sendNotification(
        "Happy Birthday! 🎉🎂 May this special day be filled with joy, laughter, and countless unforgettable moments. 💖",
        "Birthday"
      );
      clearInterval(intervalId); // !Stop the countdown
      eventType.innerHTML = "Happy Birthday!🎉";
      para.innerHTML =
        "Happy Birthday! 🎉🎂 May this special day be filled with joy, laughter, and countless unforgettable moments. 💖";
    }
  }, 1000);
}

function loadSavedData() {
  const savedType = localStorage.getItem("eventType");
  const savedDate = localStorage.getItem("eventDate");

  if (savedType && savedDate) {
    inputDate.value = savedDate;
    selectDate.value = savedType;

    savedType === "Event" ? Event() : Birthday();
  }
}
