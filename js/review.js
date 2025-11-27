document.getElementById("reviewForm").addEventListener("submit", function(e){
    e.preventDefault();

    let name = document.getElementById("name").value;
    let experience = document.getElementById("experience").value;

    let newReview = {
        name,
        experience
    };

    let allReviews = JSON.parse(localStorage.getItem("reviews")) || [];
    allReviews.push(newReview);

    localStorage.setItem("reviews", JSON.stringify(allReviews));

    alert("Review submitted successfully!");

    this.reset();
});
