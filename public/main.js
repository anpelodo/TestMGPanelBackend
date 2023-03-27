function calcTimeLeft(date) {
  let days, hours, minutes;

  const currentDate = new Date();

  let diff = Math.abs(date - currentDate);

  days = Math.floor(diff / (24 * 60 * 60000));
  diff -= days * 24 * 60 * 60000;

  hours = Math.floor(diff / (60 * 60000));
  diff -= hours * 60 * 60000;

  minutes = Math.floor(diff / 60000);

  return {
    days,
    hours,
    minutes,
  };
}

function updateTimeLeft({ days, hours, minutes }) {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");

  daysEl.innerHTML = days;
  hoursEl.innerHTML = hours;
  minutesEl.innerHTML = minutes;
}

document.addEventListener("DOMContentLoaded", () => {
  const inagurationDate = new Date(2023, 7, 10);
  updateTimeLeft(calcTimeLeft(inagurationDate));

  setInterval(() => updateTimeLeft(calcTimeLeft(inagurationDate)), 30000);

  const form = document.getElementById("addSubscriberForm");
  const submit = document.getElementById("submit");

  submit.addEventListener("click", async (ev) => {
    ev.preventDefault();

    const data = { name: form.name.value, email: form.email.value };

    const response = await fetch("/api/v1/subscriber", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    console.log(response, response.body);
  });
});
