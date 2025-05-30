document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants list
        let participantsHTML = "";
        if (details.participants && details.participants.length > 0) {
          participantsHTML = `
            <div class="participants-section">
              <strong>Participants:</strong>
              <ul class="participants-list no-bullets">
                ${details.participants
                  .map(
                    (participant) =>
                      `<li><span class="participant-badge">${participant}</span> <span class="delete-participant" data-activity="${encodeURIComponent(
                        name
                      )}" data-email="${encodeURIComponent(
                        participant
                      )}" title="Remove">🗑️</span></li>`
                  )
                  .join("")}
              </ul>
            </div>
          `;
        } else {
          participantsHTML = `<div class="participants-section"><em>No participants yet.</em></div>`;
        }

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          ${participantsHTML}
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });

      // Register delete icon event listeners after rendering
      activitiesList.querySelectorAll('.delete-participant').forEach(icon => {
        icon.addEventListener('click', async (e) => {
          // Decode URI components for human-readable display
          const activity = decodeURIComponent(icon.getAttribute('data-activity'));
          const email = decodeURIComponent(icon.getAttribute('data-email'));
          if (!confirm(`Remove ${email} from ${activity}?`)) return;
          try {
            const response = await fetch(
              `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
              { method: 'DELETE' }
            );
            const result = await response.json();
            if (response.ok) {
              messageDiv.textContent = result.message;
              messageDiv.className = 'success';
              fetchActivities();
            } else {
              messageDiv.textContent = result.detail || 'An error occurred';
              messageDiv.className = 'error';
            }
            messageDiv.classList.remove('hidden');
            setTimeout(() => {
              messageDiv.classList.add('hidden');
            }, 5000);
          } catch (error) {
            messageDiv.textContent = 'Failed to remove participant. Please try again.';
            messageDiv.className = 'error';
            messageDiv.classList.remove('hidden');
            console.error('Error removing participant:', error);
          }
        });
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
        fetchActivities(); // Refresh activities after successful signup
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
