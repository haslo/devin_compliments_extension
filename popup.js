document.addEventListener('DOMContentLoaded', function() {
    const complimentElement = document.getElementById('compliment');
    // Check if a compliment is already displayed
    if (!complimentElement.textContent) {
        // Fetch the compliment from the API and update the popup's display
        fetch('https://complimentsapi-274811442e1d.herokuapp.com/compliment')
            .then(response => response.json())
            .then(data => {
                if (data.compliment) {
                    complimentElement.textContent = data.compliment;
                } else {
                    complimentElement.textContent = 'No compliment found. Try again later!';
                }
            })
            .catch(error => {
                console.error('Error fetching compliment:', error);
                complimentElement.textContent = 'Error fetching compliment. Please check your connection.';
            });
    }
});
