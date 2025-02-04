const slider = document.getElementById("scroll-slider");
const containers = document.querySelectorAll(".grid-container");
const unitToggle = document.getElementById("unit-toggle");
let isMetric = false;

document.querySelectorAll(".temperature, .time span, .wind span, .precip span").forEach(el => {
    if (el.getAttribute("data-fahrenheit") === null && el.innerText.match(/\d+/)) {
        el.setAttribute("data-fahrenheit", el.innerText.match(/\d+/)[0]);
    }
    if (el.getAttribute("data-mph") === null && el.innerText.match(/\d+/)) {
        el.setAttribute("data-mph", el.innerText.match(/\d+/)[0]);
    }
    if (el.getAttribute("data-inches") === null && el.innerText.match(/(\d+(\.\d+)?)-?(\d+(\.\d+)?)?/)) {
        el.setAttribute("data-inches", el.innerText.match(/(\d+(\.\d+)?)-?(\d+(\.\d+)?)?/)[0]);
    }
});

function updateSliderRange() {
    let maxScroll = Math.max(...Array.from(containers).map(c => c.scrollWidth - c.clientWidth));
    slider.max = maxScroll;
}
window.addEventListener("load", updateSliderRange);
window.addEventListener("resize", updateSliderRange);

slider.addEventListener("input", function () {
    containers.forEach(container => container.scrollLeft = parseFloat(this.value));
});

unitToggle.addEventListener("click", function () {
    isMetric = !isMetric;
    this.innerText = isMetric ? "Convert to Imperial Units" : "Convert to Metric Units";

    let bigTempElement = document.querySelector(".temperature");
    let bigTempF = bigTempElement.getAttribute("data-fahrenheit");
    bigTempElement.innerText = isMetric ? Math.round((bigTempF - 32) * 5 / 9) + "°C" : bigTempF + "°F";

    document.querySelectorAll(".time span").forEach(temp => {
        let fahrenheit = temp.getAttribute("data-fahrenheit");
        temp.innerText = isMetric ? Math.round((fahrenheit - 32) * 5 / 9) + "°C" : fahrenheit + "°F";
    });

    document.querySelectorAll(".precip span").forEach(precip => {
        let inches = precip.getAttribute("data-inches");
        if (inches) {
            let newPrecip;
            if (inches.includes("-")) {
                let [low, high] = inches.split("-").map(num => parseFloat(num));
                newPrecip = isMetric ? `${Math.floor(low * 2.54)}-${Math.ceil(high * 2.54)}cm` : `${inches}"`;
            } else {
                let cm = Math.floor(parseFloat(inches) * 2.54);
                newPrecip = isMetric ? `${cm}cm` : `${inches}"`;
            }
            precip.innerText = newPrecip;
        }
    });

    document.querySelectorAll(".wind span").forEach(wind => {
        let mph = wind.getAttribute("data-mph");
        wind.innerText = isMetric ? Math.floor(mph * 1.609) + " kph" : mph + " mph";
    });
});
