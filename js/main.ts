// !Select DOM elements
const daysSpan = document.querySelector(
  ".timer .timer-item span#days"
) as HTMLSpanElement;
const hoursSpan = document.querySelector(
  ".timer .timer-item span#hours"
) as HTMLSpanElement;
const minutesSpan = document.querySelector(
  ".timer .timer-item span#minutes"
) as HTMLSpanElement;
const secondsSpan = document.querySelector(
  ".timer .timer-item span#seconds"
) as HTMLSpanElement;
const selectDate = document.querySelector("header select") as HTMLSelectElement;
const inputDate = document.getElementById("date") as HTMLInputElement;
const buttonDate = document.querySelector("header button") as HTMLButtonElement;
const eventType = document.querySelector("h1") as HTMLHeadingElement;
const para = document.querySelector(".para") as HTMLParagraphElement;

let intervalId: number | null = null; // Use null instead of any

// !Function to send notifications
function sendNotification(message: string, title: string): void {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body: message });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body: message });
        }
      });
    }
  }
}

// !Event listener for button click
buttonDate.addEventListener("click", handleButtonClick);

// !Main function to handle button click
function handleButtonClick(event: MouseEvent): void {
  event.preventDefault();
  clearInterval(intervalId!); // *Clear any previous countdowns

  const selectedType = selectDate.value;
  const enteredDate = inputDate.value;

  if (enteredDate) {
    localStorage.setItem("eventType", selectedType);
    localStorage.setItem("eventDate", enteredDate);
    selectedType === "Event" ? startEventCountdown() : startBirthdayCountdown();
  } else {
    eventType.innerHTML = "Please enter a valid date!";
  }
}

// !Start countdown for events
function startEventCountdown(): void {
  const currDate = new Date();
  const eventDate = new Date(inputDate.value);

  if (eventDate < currDate) {
    handlePastEvent();
    return;
  }

  eventType.innerHTML = "Event Countdown";
  startCountdown(eventDate);
}

// !Start countdown for birthdays
function startBirthdayCountdown(): void {
  const currDate = new Date();
  const inputValue = inputDate.value.toString();
  const birthYear = inputValue.slice(0, 4);
  const age = currDate.getFullYear() - Number(birthYear);
  const suffix = getAgeSuffix(age);

  eventType.innerHTML = `Happy Birthday <br> ${age} <sup>${suffix}</sup>`;

  let countDownDate = getNextBirthdayDate(inputValue, currDate);
  startCountdown(countDownDate, true);
}

// !Handle past events
function handlePastEvent(): void {
  eventType.innerHTML = "Has passed.";
  alert("The selected event date has already passed!");
  sendNotification("The event date you selected has already passed.", "Event");
}

// !Get age suffix based on age
function getAgeSuffix(age: number): string {
  const lastChar = age.toString().slice(-1);
  return lastChar === "1"
    ? "st"
    : lastChar === "2"
    ? "nd"
    : lastChar === "3"
    ? "rd"
    : "th";
}

// !Get the next birthday date
function getNextBirthdayDate(inputValue: string, currDate: Date): Date {
  const countDownDate = new Date(
    `${inputValue.slice(5, 7)} ${inputValue.slice(
      8
    )}, ${currDate.getFullYear()} 00:00:01`
  );

  if (countDownDate < currDate) {
    countDownDate.setFullYear(currDate.getFullYear() + 1);
  }
  return countDownDate;
}

// !Start a countdown to a specified date
function startCountdown(targetDate: Date, isBirthday: boolean = false): void {
  intervalId = setInterval(() => {
    const diff = targetDate.getTime() - new Date().getTime();
    const { days, hours, minutes, seconds } = calculateTimeDiff(diff);

    updateDisplay(days, hours, minutes, seconds);

    if (diff <= 0) {
      handleCountdownEnd(isBirthday);
    }
  }, 1000);
}

// !Calculate time difference
function calculateTimeDiff(diff: number) {
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

// !Update the display for countdown
function updateDisplay(
  days: number,
  hours: number,
  minutes: number,
  seconds: number
): void {
  daysSpan.innerHTML = formatTime(days);
  hoursSpan.innerHTML = formatTime(hours);
  minutesSpan.innerHTML = formatTime(minutes);
  secondsSpan.innerHTML = formatTime(seconds);
}

// !Handle end of countdown
function handleCountdownEnd(isBirthday: boolean): void {
  clearInterval(intervalId!);
  eventType.innerHTML = isBirthday ? "Happy Birthday! 🎉" : "Event started!";
  para.innerHTML = isBirthday
    ? "Happy Birthday! 🎉🎂 May this special day be filled with joy, laughter, and countless unforgettable moments. 💖"
    : "The event is happening now!";
  sendNotification(
    isBirthday
      ? "Happy Birthday! 🎉🎂 Enjoy your special day!"
      : "The event has started! Let's celebrate! 🎉",
    isBirthday ? "Birthday" : "Event"
  );

  // !Reset display to zero
  updateDisplay(0, 0, 0, 0);
}

// !Helper function to load saved data
function loadSavedData(): void {
  const savedType = localStorage.getItem("eventType");
  const savedDate = localStorage.getItem("eventDate");

  if (savedType && savedDate) {
    inputDate.value = savedDate;
    selectDate.value = savedType;

    savedType === "Event" ? startEventCountdown() : startBirthdayCountdown();
  }
}

// !Helper function to format time values
function formatTime(value: number): string {
  return value < 10 ? `0${value}` : value.toString();
}
