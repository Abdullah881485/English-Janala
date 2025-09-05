const loadLesson = () => {
    fetch("https://openapi.programming-hero.com/api/levels/all")
        .then((res) => res.json())
        .then((data) => displayLesson(data.data));
}
const loadWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`
    fetch(url)
        .then((res) => res.json())
        .then((detail) => displayWord(detail.data));

    


}
const displayWord = (words) => {
        const wordContainer = document.getElementById("word-container")
        wordContainer.innerHTML =""
        words.forEach(word => {
            const card = document.createElement("div")
            card.innerHTML = `
                        <div class="bg-white py-10 space-y-3 rounded-lg shadow-sm px-3">
                    <h1 class="text-2xl font-bold">${word.word}</h1>
                    <p class="text-lg">Meaning /Pronounciation</p>
                    <div class="font-bangla text-xl font-semibold">${word.meaning} / ${word.pronunciation}</div>
                    <div class="flex justify-between items-center px-5">
                    <button class="bg-[#1A91FF15] px-3 py-2 rounded-xl hover:bg-[#1A91FF70]"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="bg-[#1A91FF15] px-3 py-2 rounded-xl hover:bg-[#1A91FF70]"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
            `
            wordContainer.append(card)

        })

    }
const displayLesson = (lessons) => {
    const levelContainer = document.getElementById("lesson-container");
    levelContainer.innerHTML = "";
    lessons.forEach(lesson => {
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
        <button onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary border-2" href="#"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
        `;
        levelContainer.append(lessonDiv);

    })
}
loadLesson();