function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const createElement = (arr) => {
    const createSpan = arr.map(syn => `<span class = "btn">${syn}</span>`);
    return createSpan.join(" ");
}
const manageSpinner = (load) => {
    if (load === true){
        document.getElementById("spinner").classList.remove("hidden")
        document.getElementById("word-container").classList.add("hidden")
    }
    else {
        document.getElementById("spinner").classList.add("hidden")
        document.getElementById("word-container").classList.remove("hidden")
    }
}
const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((data) => displayLesson(data.data));
}
const loadWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((detail) => {
            const allBtn = document.querySelectorAll(".active");
            allBtn.forEach(btn => btn.classList.remove("active"))
            const clickbtn = document.getElementById(`lesson-btn-${id}`);
            clickbtn.classList.add("active")
            displayWord(detail.data);
        });

}
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    const res = await fetch(url);
    const data = await res.json();
    displayWordDetail(data.data);

}
const displayWordDetail = (word) => {
    console.log(word);

    const modalContainer = document.getElementById("modal-container")
    modalContainer.innerHTML = `
            <div class="space-y-4">
              <h1 class="font-bold text-2xl">
                ${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})
              </h1>
              <div>
                <p class="font-semibold text-lg">Meaning</p>
                <p class="font-bangla font-medium text-[16px]">${word.meaning}</p>
              </div>
              <div>
                <p class="font-semibold text-lg">Example</p>
                <p class="font-normal text-[16px]">
                  ${word.sentence}
                </p>
              </div>
              <div class="">
                <p class="font-bangla font-semibold text-lg pb-3">
                  সমার্থক শব্দ গুলো
                </p>
                <div class="gap-2">
                  ${createElement(word.synonyms)}
                </div>
              </div>
            </div>
    `
    document.getElementById("my_modal").showModal();

}
const displayWord = (words) => {
    const wordContainer = document.getElementById("word-container")
    wordContainer.innerHTML = ""
    if (words.length === 0) {
        wordContainer.innerHTML = `
           <div class="font-bangla col-span-3 text-center space-y-5 flex flex-col justify-center items-center">
        <img src="./assets/alert-error.png" alt="">
        <p class=" text-[16px] text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h1 class="text-xl md:text-3xl font-bold">নেক্সট Lesson এ যান</h1>
      </div>
        `
        manageSpinner(false);
        return;
        
    }
    words.forEach(word => {
        const card = document.createElement("div")
        card.innerHTML = `
                        <div class="bg-white py-10 space-y-3 rounded-lg shadow-sm px-3">
                    <h1 class="text-2xl font-bold">${word.word ? word.word : 'No word found'}</h1>
                    <p class="text-lg">Meaning /Pronounciation</p>
                    <div class="font-bangla text-xl font-semibold">${word.meaning ? word.meaning : 'No meaning found'} / ${word.pronunciation ? word.pronunciation : 'No pronunciation found'}</div>
                    <div class="flex justify-between items-center px-5">
                    <button onclick="loadWordDetail(${word.id})" class="bg-[#1A91FF15] px-3 py-2 rounded-xl hover:bg-[#1A91FF70]"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="bg-[#1A91FF15] px-3 py-2 rounded-xl hover:bg-[#1A91FF70]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
            `
        wordContainer.append(card)
        manageSpinner(false);
    })

}
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("lesson-container");
    levelContainer.innerHTML = "";
    lessons.forEach(lesson => {
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary border-2" href="#"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
        `;
        levelContainer.append(lessonDiv);

    })
}
loadLesson();

document.getElementById("search-btn").addEventListener("click", function () {
    const allBtn = document.querySelectorAll(".active");
    allBtn.forEach(btn => btn.classList.remove("active"))
    const search = document.getElementById("input-search").value;
    const searchValue = search.trim().toLowerCase();
    if (searchValue === "") {
        alert("Please enter a word to search.");
        return;
    }
    fetch(`https://openapi.programming-hero.com/api/words/all`)
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            if (filterWords.length === 0) {
                alert("No matching word found.");
                return;
            }
            displayWord(filterWords)
        });
    

})