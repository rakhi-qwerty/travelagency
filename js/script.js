  const video = document.getElementsByClassName(".bg-video");
  video.playbackRate = 0.5; 

document.addEventListener("DOMContentLoaded", function () {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    const container = document.getElementById("reviews-container");
    container.innerHTML = "";

    let latestReviews = reviews.slice(-4).reverse();

    latestReviews.forEach(review => {
        const card = document.createElement("div");
        card.classList.add("review-card");

        // ⭐ Jo bhi field me text hoga wo pick ho jayega
        let message =
            review.text ||
            review.experience ||
            review.message ||
            review.review ||
            "No review text found";

        card.innerHTML = `
            <h3>${review.name}</h3>
            <p>${message}</p>
        `;

        container.appendChild(card);
    });
});


