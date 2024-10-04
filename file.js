const apiKey = "O9TAUiN7AKq46wLy3vZJRXzoQy6hLCaZ6UI1ZE99rBepchp25DNZoEEq";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const loadMoreBtn = document.querySelector(".load-more");
const imagesWrapper = document.querySelector(".images");
const searchInput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".fa-square-xmark");
const downloadImgBtn = lightBox.querySelector(".fa-download");

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download images!"));
};

const showLightbox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  lightBox.classList.add("show");
  downloadImgBtn.setAttribute("data-img", img);
  document.body.style.overflow = "hidden";
};

const hideLightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) => `
  <li class="card" onClick = "showLightbox('${img.photographer}', '${img.src.large2x}')">
  <img src=" ${img.src.large2x} " alt="">
  <div class="details">
      <div class="photographer">
          <i class="fa-solid fa-camera"></i>
          <span>${img.photographer}</span>
      </div>
      <button onclick="downloadImg ('${img.src.large2x}')">
      <i class="fa-solid fa-download"></i></button>
  </div>
</li>`
    )
    .join("");
};

const getImages = (apiURL) => {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerText = "Load More";
      loadMoreBtn.classList.remove("disabled");
      console.log(data);
    })
    .catch(() => alert("failed to load images!"));
};

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
  apiURL = searchTerm
    ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const loadSearchImages = (e) => {
  if (e.target.value === "") return (searchTerm = null);
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`
    );
  }
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`
);

loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);
