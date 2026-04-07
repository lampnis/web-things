var maxId;
var currentId;
const displayElement = document.getElementById('blog-content');
const prevBtn = document.getElementById('prev-button')
const nextBtn = document.getElementById('next-button')

fetch('./scripts/blogs.conf')
  .then(response => response.text())
  .then(text => {
    maxId = parseInt(text.trim());
    currentId = maxId;
    console.log("Latest post number is:", maxId);

    loadNote(maxId);
  });

function loadNote(id) {
  const filename = './blogs/' + id + '.md';

  fetch(filename)
    .then(response => response.text())
    .then(blogText => {
      displayElement.innerText = blogText;
    })
    .catch(error => {
      displayElement.innerText = "Error loading post.";
      console.error(error);
    });
}

function getNext() {
  if (currentId >= maxId) {
    console.log("Already at the newest note!")
  } else {
    currentId += 1;
    loadNote(currentId);
  }
}

function getPrevious() {
  if (currentId <= 1) {
    console.log("Already at the oldest note!")
  } else {
    currentId -= 1;
    loadNote(currentId);
  }
}

prevBtn.addEventListener('click', getPrevious)
nextBtn.addEventListener('click', getNext)
